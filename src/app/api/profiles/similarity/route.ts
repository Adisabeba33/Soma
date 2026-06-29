// Profile similarity — warn before merging near-duplicate profiles.
// Compares the relevant pair: the two profiles when there are exactly two, or
// the merged pair when there are three. Returns null otherwise (nothing to
// compare). Pure tag comparison; no engine, no writes.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { profileSimilarity } from "@/lib/profile-similarity";
import type { TasteProfileInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getUserId();
  const profiles = await prisma.tasteProfile
    .findMany({ where: { userId }, orderBy: { createdAt: "asc" } })
    .catch(() => []);

  // Pick the pair to compare.
  let pair: typeof profiles = [];
  if (profiles.length === 2) {
    pair = profiles;
  } else if (profiles.length === 3) {
    const merged = profiles.filter((p) => p.merged);
    if (merged.length === 2) pair = merged;
  }

  if (pair.length !== 2) {
    return NextResponse.json({ comparable: false });
  }

  const [a, b] = pair;
  const sim = profileSimilarity(
    a as unknown as TasteProfileInput,
    b as unknown as TasteProfileInput,
  );

  return NextResponse.json({
    comparable: true,
    a: a.name?.trim() || "Profile 1",
    b: b.name?.trim() || "Profile 2",
    percent: sim.percent,
    differOn: sim.differOn,
  });
}
