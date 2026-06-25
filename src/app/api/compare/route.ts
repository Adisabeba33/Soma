import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveProfile } from "@/lib/active-profile";
import { isOwner, redactAuditFields } from "@/lib/owner";
import { getUserId } from "@/lib/user";
import {
  asArray,
  getFeedbackSignals,
  logUnknownStrains,
} from "@/lib/api";
import { resolveStrain, scoreStrain, useCaseFor } from "@/lib/taste-engine";
import { resolveBlend, analyzeMerged } from "@/lib/merge-worlds";
import { inferStrainsAI } from "@/lib/strain-inference-ai";
import { buildAuditEntry, writeRunAudit } from "@/lib/run-audit";
import type { ComparisonItem, StrainMatch, TasteProfileInput } from "@/lib/types";
import { profileCompleteness, MATCH_GATE_PERCENT } from "@/lib/profile-completeness";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));
  const strains = asArray(body.strains, 5);

  if (strains.length < 2) {
    return NextResponse.json(
      { error: "Add at least two strains to compare." },
      { status: 400 },
    );
  }

  const profile = await getActiveProfile(userId);

  if (!profile) {
    return NextResponse.json(
      {
        error: "Build your taste profile first — comparison ranks against it.",
        profileExists: false,
      },
      { status: 400 },
    );
  }

  // Gate: same threshold as Taste Match — enough profile to rank with confidence.
  const completion = profileCompleteness(profile as unknown as TasteProfileInput);
  if (completion.percent < MATCH_GATE_PERCENT) {
    return NextResponse.json(
      {
        error: `Finish your sensory profile to ${MATCH_GATE_PERCENT}% to compare.`,
        gated: true,
        percent: completion.percent,
      },
      { status: 400 },
    );
  }

  const feedback = await getFeedbackSignals(userId);

  // Resolve strains not in the catalog via the optional AI layer. No-op
  // (empty map) without OPENAI_API_KEY, so scoring is unchanged until a key
  // is added; with one, the unknowns get a vocab-constrained profile instead
  // of the keyword guess.
  const unknownNames = strains.filter((name) => !resolveStrain(name).known);
  const overrides = await inferStrainsAI(unknownNames);

  // Blend mode (merged profiles / Taste Blender) ranks the comparison too, so
  // Compare agrees with Harvest and Taste Match. No per-run lean here (Compare
  // has no priorities popup); the Blender's stored recipe applies when on.
  const blend = await resolveBlend(userId);
  let matches: StrainMatch[];
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
      balance: blend.balance,
    });
    const byName = new Map(m.recommendations.map((r) => [r.strainName, r]));
    matches = strains.map(
      (name) => byName.get(name) ?? scoreStrain(name, profile, feedback, overrides),
    );
    mergeBreakdown = m.mergeBreakdown;
  } else {
    matches = strains.map((name) =>
      scoreStrain(name, profile, feedback, overrides),
    );
  }

  const items: ComparisonItem[] = strains.map((name, i) => {
    const { strain } = resolveStrain(name, overrides);
    const match = matches[i];
    return {
      ...match,
      strainType: strain.type,
      potency: strain.potency,
      aromas: strain.aromas,
      flavors: strain.flavors,
      effects: strain.effects,
      useCase: useCaseFor(strain),
    };
  });

  const closest = items.reduce((best, item) => {
    if (item.matchScore !== best.matchScore) {
      return item.matchScore > best.matchScore ? item : best;
    }
    return item.unclampedScore > best.unclampedScore ? item : best;
  });

  // Rank results highest match first; tie-break on unclampedScore so
  // multiple strains at the 88 ceiling stay in the engine's actual
  // order rather than collapsing to insertion-order.
  items.sort(
    (a, b) =>
      b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );

  // Fire-and-forget on the unknown-strain queue. Compare doesn't create
  // an AnalysisSession, so sessionId is null — the row is still recorded
  // so the seed-expansion queue sees Compare inputs too.
  logUnknownStrains(userId, null, matches, []).catch((err) =>
    console.error("logUnknownStrains (compare) failed", err),
  );

  // Fire-and-forget audit log. Default backend is Postgres so it works
  // on Vercel. Disabled with RUN_AUDIT=off. The promise is not awaited —
  // audit must never block or break the compare response.
  try {
    const entry = buildAuditEntry({
      source: "compare",
      userId,
      profile,
      rawInputs: strains,
      matches,
      closestName: closest.strainName,
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
      console.error("compare audit failed", err),
    );
  } catch (err) {
    console.error("compare audit failed", err);
  }

  // Audit mode is owner-only; strip the engine internals for everyone else
  // before the response leaves the server (see redactAuditFields).
  const owner = await isOwner(userId);
  const safeItems = owner ? items : items.map(redactAuditFields);

  return NextResponse.json({
    items: safeItems,
    closestName: closest.strainName,
    isOwner: owner,
  });
}

