import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getActiveProfile } from "@/lib/active-profile";
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
import { inferStrainsAI } from "@/lib/strain-inference-ai";
import { enhanceWithOpenAI, isOpenAIEnabled } from "@/lib/openai";
import { buildAuditEntry, writeRunAudit } from "@/lib/run-audit";
import type { TasteProfileInput } from "@/lib/types";
import { profileCompleteness, MATCH_GATE_PERCENT } from "@/lib/profile-completeness";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const strains = asArray(body.strains, 60);
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
  let result = analyze(strains, profile, feedback, overrides);
  // The optional AI layer only rewrites prose; scores stay untouched.
  if (isOpenAIEnabled()) {
    result = await enhanceWithOpenAI(result, profile);
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
    });
    writeRunAudit(entry).catch((err) =>
      console.error("taste-match audit failed", err),
    );
  } catch (err) {
    console.error("taste-match audit failed", err);
  }

  const recommendations = result.recommendations.map((r) => ({
    ...r,
    id: session.recommendations.find((d) => d.strainName === r.strainName)?.id,
  }));

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
  });
}
