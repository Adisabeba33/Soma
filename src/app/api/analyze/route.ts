import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveProfile } from "@/lib/active-profile";
import { isOwner, redactAuditFields } from "@/lib/owner";
import { getUserId } from "@/lib/user";
import {
  asArray,
  asText,
  computeMenuQuality,
  flattenParserWarnings,
  getFeedbackSignals,
  logUnknownStrains,
  sanitizeParsedItems,
} from "@/lib/api";
import { analyze, resolveStrain } from "@/lib/taste-engine";
import { resolveBlend, analyzeMerged } from "@/lib/merge-worlds";
import { inferStrainsAI } from "@/lib/strain-inference-ai";
import { enhanceWithOpenAI, isOpenAIEnabled } from "@/lib/openai";
import { buildAuditEntry, writeRunAudit } from "@/lib/run-audit";
import type { AnalysisResult, TasteProfileInput } from "@/lib/types";
import { profileCompleteness, MATCH_GATE_PERCENT } from "@/lib/profile-completeness";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const strains = asArray(body.strains, 60);
  // Per-run dense↔fluffy slider (−1 fluffy … +1 dense). Clamped; 0/absent =
  // no structure preference for this run. Does not touch the saved profile.
  const densityPreference =
    typeof body.densityPreference === "number" && !Number.isNaN(body.densityPreference)
      ? Math.max(-1, Math.min(1, body.densityPreference))
      : 0;
  // Per-run channel priority sliders (−1…+1 each). Clamped; 0/absent = no
  // change. Does not touch the saved profile.
  const clampPref = (v: unknown) =>
    typeof v === "number" && !Number.isNaN(v) ? Math.max(-1, Math.min(1, v)) : 0;
  const priorities = {
    senses: clampPref(body.priorities?.senses),
    effect: clampPref(body.priorities?.effect),
  };
  // Per-run merge lean (−1…+1, + toward the primary/Main profile). Only used
  // when two or more profiles are merged; 0/absent = balanced best-of.
  const mergeBias = clampPref(body.mergeBias);
  const inputType = body.inputType === "paste" ? "paste" : "manual";
  const rawInput = asText(body.rawInput, 12_000) ?? strains.join("\n");
  const parsedItems = sanitizeParsedItems(body.parsedItems, 60);

  if (strains.length === 0) {
    return NextResponse.json(
      { error: "Add at least one strain to analyze." },
      { status: 400 },
    );
  }

  const profile = await getActiveProfile(userId);

  if (!profile) {
    return NextResponse.json(
      { error: "Build your taste profile before running an analysis." },
      { status: 400 },
    );
  }

  // Gate: matching needs enough of the profile to read a taste with confidence.
  const completion = profileCompleteness(profile as unknown as TasteProfileInput);
  if (completion.percent < MATCH_GATE_PERCENT) {
    return NextResponse.json(
      {
        error: `Finish your sensory profile to ${MATCH_GATE_PERCENT}% to start matching.`,
        gated: true,
        percent: completion.percent,
      },
      { status: 400 },
    );
  }

  // Deterministic engine first — it always produces the structured result.
  // Confirmed feedback from past sessions is folded into the scoring.
  const feedback = await getFeedbackSignals(userId);
  // Resolve any menu strains not in the catalog via the optional AI layer.
  // No-op (empty map) without OPENAI_API_KEY — scoring stays identical until a
  // key is added; with one, unknown names get a vocab-constrained profile.
  const unknownNames = strains.filter((name) => !resolveStrain(name).known);
  const overrides = await inferStrainsAI(unknownNames);

  // Merge mode: when two or more profiles are merged, blend them best-of with
  // the per-run lean. Otherwise the single active profile drives the run.
  // The blend brain: pair (+ third, if Taste Blender is on) with per-world
  // penalties. The per-run pair lean is ignored when the Blender is active
  // (it owns the recipe).
  const blend = await resolveBlend(userId, { pairBias: mergeBias });
  let result: AnalysisResult;
  let mergeBreakdown:
    | Record<string, Array<{ world: string; score: number }>>
    | undefined;
  if (blend) {
    const m = analyzeMerged({
      strains,
      profiles: blend.profiles,
      penalties: blend.penalties,
      feedback,
      overrides,
      density: densityPreference,
      priorities,
      balance: blend.balance,
    });
    result = m;
    mergeBreakdown = m.mergeBreakdown;
  } else {
    let single = analyze(
      strains,
      profile,
      feedback,
      overrides,
      densityPreference,
      priorities,
    );
    // The optional AI layer only rewrites prose; scores stay untouched. Skipped
    // in merge mode, where prose comes from each pick's own winning world.
    if (isOpenAIEnabled()) {
      single = await enhanceWithOpenAI(single, profile);
    }
    result = single;
  }

  const menuQuality = computeMenuQuality(parsedItems, result.recommendations);

  const session = await prisma.analysisSession.create({
    data: {
      userId,
      tasteProfileId: profile.id,
      inputType,
      rawInput,
      engine: result.engine,
      parsedItems:
        parsedItems.length > 0
          ? (parsedItems as unknown as Prisma.InputJsonValue)
          : undefined,
      parserWarnings: flattenParserWarnings(parsedItems),
      menuQuality: menuQuality as unknown as Prisma.InputJsonValue,
      recommendations: {
        create: result.recommendations.map((r) => ({
          strainName: r.strainName,
          resolvedName: r.resolvedName,
          knownStrain: r.knownStrain,
          category: r.category,
          matchScore: r.matchScore,
          confidence: r.confidence,
          aromaMatch: r.aromaMatch,
          flavorMatch: r.flavorMatch,
          effectMatch: r.effectMatch,
          whyItFits: r.whyItFits,
          riskNotes: r.riskNotes,
          explanation: r.explanation,
          feedbackNote: r.feedbackNote,
          purchaseConfidence: r.purchaseConfidence as unknown as Prisma.InputJsonValue,
        })),
      },
    },
    include: { recommendations: true },
  });

  // Fire-and-forget on the unknown-strain queue. A failure here must not
  // block the user's analysis response.
  logUnknownStrains(userId, session.id, result.recommendations, parsedItems).catch(
    (err) => console.error("logUnknownStrains failed", err),
  );

  // Fire-and-forget audit log. Default backend is Postgres (RunAudit
  // table) so it works on Vercel. Mode 1 carries extra context under
  // `taste`: sessionId, inputType, parsedItems, menuQuality, engine.
  // Disabled with RUN_AUDIT=off. Never blocks the response.
  try {
    const closest =
      result.recommendations.reduce(
        (best, r) => (r.matchScore > (best?.matchScore ?? -1) ? r : best),
        result.recommendations[0],
      ) ?? result.recommendations[0];
    const entry = buildAuditEntry({
      source: "taste-match",
      userId,
      profile: profile as unknown as TasteProfileInput,
      rawInputs: strains,
      matches: result.recommendations,
      closestName: closest?.strainName ?? "",
      taste: {
        sessionId: session.id,
        inputType,
        parsedItems: parsedItems.length > 0 ? parsedItems : null,
        menuQuality,
        engine: result.engine,
      },
      merge: blend
        ? {
            mode: blend.blenderActive ? "blender" : "merge",
            balance: blend.balance,
            bias: blend.pairLean,
            lean2: blend.lean2,
            profiles: blend.profiles.map((p, i) => ({
              name: blend.worlds[i],
              primary: p.id === blend.primaryId,
              penalty: blend.penalties[p.id] ?? 0,
              profile: p as unknown as TasteProfileInput,
            })),
            breakdown: mergeBreakdown ?? {},
          }
        : undefined,
    });
    writeRunAudit(entry).catch((err) =>
      console.error("taste-match audit failed", err),
    );
  } catch (err) {
    console.error("taste-match audit failed", err);
  }

  // Audit mode (the engine-internal breakdown) is owner-only. For everyone
  // else the audit fields are stripped server-side, so they never reach the
  // browser at all — the panel is hidden AND there's nothing to read.
  const owner = await isOwner(userId);
  const recommendations = result.recommendations.map((r) => {
    const withId = {
      ...r,
      id: session.recommendations.find((d) => d.strainName === r.strainName)?.id,
    };
    return owner ? withId : redactAuditFields(withId);
  });

  return NextResponse.json({
    session: {
      id: session.id,
      title: session.title,
      saved: session.saved,
      engine: session.engine,
      inputType: session.inputType,
      createdAt: session.createdAt,
      strainCount: session.recommendations.length,
    },
    recommendations,
    engine: result.engine,
    menuQuality,
    isOwner: owner,
  });
}
