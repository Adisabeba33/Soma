import { NextResponse } from "next/server";
import { getUserId } from "@/lib/user";
import { getTopMatches } from "@/lib/top-matches";

export const dynamic = "force-dynamic";

// Top blend-aware catalog matches for the signed-in user — powers the account
// "Last matches & discoveries" strip. Mirrors the dashboard carousel.
export async function GET() {
  const userId = await getUserId();
  const matches = await getTopMatches(userId, 6);
  return NextResponse.json({ matches });
}
