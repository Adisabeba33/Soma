import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { asArray, getFeedbackSignals } from "@/lib/api";
import { resolveStrain, scoreStrain, useCaseFor } from "@/lib/taste-engine";
import { buildAuditEntry, writeCompareAudit } from "@/lib/compare-audit";
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

  // Fire-and-forget audit log. Disabled with COMPARE_AUDIT=off env var.
  try {
    const entry = buildAuditEntry(
      userId,
      profile,
      strains,
      matches,
      closest.strainName,
    );
    writeCompareAudit(entry);
  } catch (err) {
    console.error("compare audit failed", err);
  }

  return NextResponse.json({ items, closestName: closest.strainName });
}

