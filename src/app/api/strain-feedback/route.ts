// Strain-level quick verdict endpoint.
//
// The original /api/feedback ties a verdict to a saved Recommendation
// row, which means the user has to first save a Taste Match session
// before they can rate anything. That gate is too high for the
// "fresh after testing" case the feedback pill on Compare results is
// designed for. This route persists a verdict keyed directly on the
// strain — one tap, no session save required.
//
// The signal feeds the engine's evaluateFeedback() loop on every
// subsequent scoreStrain call across this user, so accumulated
// verdicts gradually personalise scoring without any explicit
// "promote to favourite" action.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { findStrain } from "@/lib/strain-data";

export const dynamic = "force-dynamic";

const VALID_VERDICTS = new Set([
  "loved",
  "good",
  "neutral",
  "avoid",
] as const);
type Verdict = "loved" | "good" | "neutral" | "avoid";

const VALID_SOURCES = new Set(["compare", "taste-match", "catalog"]);

function asString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function asVerdict(value: unknown): Verdict | null {
  return typeof value === "string" && VALID_VERDICTS.has(value as Verdict)
    ? (value as Verdict)
    : null;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const verdict = asVerdict(body.verdict);
  if (!verdict) {
    return NextResponse.json(
      {
        error: "Invalid verdict. Expected one of: loved, good, neutral, avoid.",
      },
      { status: 400 },
    );
  }

  const rawName = asString(body.strainName, 120);
  if (!rawName) {
    return NextResponse.json(
      { error: "Missing strainName." },
      { status: 400 },
    );
  }

  // Resolve to the canonical name so verdicts persist consistently
  // regardless of which alias the user typed at Compare time.
  const known = findStrain(rawName);
  const canonical = known?.name ?? rawName;

  const source = asString(body.source, 32);
  const sourceValid =
    source && VALID_SOURCES.has(source) ? source : null;

  const record = await prisma.strainFeedback.upsert({
    where: {
      userId_strainName: { userId, strainName: canonical },
    },
    create: {
      userId,
      strainName: canonical,
      verdict,
      source: sourceValid,
    },
    update: {
      verdict,
      source: sourceValid,
    },
  });

  return NextResponse.json({
    ok: true,
    verdict: {
      strainName: record.strainName,
      verdict: record.verdict,
      updatedAt: record.updatedAt.toISOString(),
    },
  });
}

// Read-only retrieval for the current user's verdicts. The compare
// page calls this on mount to hydrate the pills with existing
// selections so a returning user sees their prior verdict highlighted
// instead of an empty pill row.
export async function GET() {
  const userId = await getUserId();
  const rows = await prisma.strainFeedback.findMany({
    where: { userId },
    select: { strainName: true, verdict: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({
    verdicts: rows.map((r) => ({
      strainName: r.strainName,
      verdict: r.verdict,
      updatedAt: r.updatedAt.toISOString(),
    })),
  });
}
