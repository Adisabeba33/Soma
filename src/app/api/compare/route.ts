import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import {
  asArray,
  getFeedbackSignals,
  logUnknownStrains,
} from "@/lib/api";
import { resolveStrain, scoreStrain, useCaseFor } from "@/lib/taste-engine";
import { buildAuditEntry, writeRunAudit } from "@/lib/run-audit";
import type { ComparisonItem, StrainMatch } from "@/lib/types";

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

  const profile = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  if (!profile) {
    return NextResponse.json(
      {
        error: "Build your taste profile first — comparison ranks against it.",
        profileExists: false,
      },
      { status: 400 },
    );
  }

  const feedback = await getFeedbackSignals(userId);

  const matches: StrainMatch[] = strains.map((name) =>
    scoreStrain(name, profile, feedback),
  );

  const items: ComparisonItem[] = strains.map((name, i) => {
    const { strain } = resolveStrain(name);
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

  const closest = items.reduce((best, item) =>
    item.matchScore > best.matchScore ? item : best,
  );

  // Rank results highest match first. Input order is meaningless to the
  // user — they want to see the best fit at the top, like Taste Match.
  items.sort((a, b) => b.matchScore - a.matchScore);

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
    });
    writeRunAudit(entry).catch((err) =>
      console.error("compare audit failed", err),
    );
  } catch (err) {
    console.error("compare audit failed", err);
  }

  return NextResponse.json({ items, closestName: closest.strainName });
}

