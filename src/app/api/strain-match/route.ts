import { NextRequest, NextResponse } from "next/server";
import { getActiveProfile } from "@/lib/active-profile";
import { getUserIdReadOnly } from "@/lib/user";
import { getFeedbackSignals, isPlausibleStrainName } from "@/lib/api";
import { mergedMatchForStrain } from "@/lib/merge-worlds";
import { scoreStrain } from "@/lib/taste-engine";
import type { TasteProfileInput } from "@/lib/types";

// Read-only per-strain match for the current visitor. The strain page is now
// statically rendered (so it indexes well), so its personal match score is
// fetched here on the client instead of at request time. Mirrors the logic
// that used to live in catalog/[slug]/page.tsx → loadMatch().
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";
  if (!isPlausibleStrainName(name)) {
    return NextResponse.json({ match: null });
  }

  const userId = await getUserIdReadOnly();
  if (!userId) return NextResponse.json({ match: null });

  // Merge mode wins, so the detail page agrees with the blended list.
  const merged = await mergedMatchForStrain(userId, name);
  if (merged) return NextResponse.json({ match: merged });

  const profile = await getActiveProfile(userId);
  if (!profile) return NextResponse.json({ match: null });

  const feedback = await getFeedbackSignals(userId);
  const m = scoreStrain(name, profile as unknown as TasteProfileInput, feedback);
  return NextResponse.json({
    match: { score: m.matchScore, category: m.category },
  });
}
