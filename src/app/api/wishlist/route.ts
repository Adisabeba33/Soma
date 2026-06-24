// Wishlist ("want to try") endpoint.
//
// A wishlist row is plain intent — a strain the user tapped to save before
// ever trying it. It is deliberately kept in its own table, NOT in
// StrainFeedback: the scoring engine reads StrainFeedback only, so a wishlist
// entry can never leak into recommendations. Adding to the wishlist is
// therefore guaranteed not to nudge scoring, even indirectly.
//
// Disjoint from the collection: you cannot "want" what you've already tried.
// POST refuses (no-op) if a verdict already exists for the strain, and
// /api/strain-feedback POST deletes any wishlist row when a verdict is set
// (graduation). So a strain is either on the wishlist or on the shelf.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { findStrain } from "@/lib/strain-data";

export const dynamic = "force-dynamic";

const VALID_SOURCES = new Set(["catalog", "taste-match", "compare"]);

function asString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const rawName = asString(body.strainName, 120);
  if (!rawName) {
    return NextResponse.json({ error: "Missing strainName." }, { status: 400 });
  }

  // Resolve to the canonical name so the wishlist key matches StrainFeedback
  // regardless of which alias the user typed.
  const known = findStrain(rawName);
  const canonical = known?.name ?? rawName;

  const source = asString(body.source, 32);
  const sourceValid = source && VALID_SOURCES.has(source) ? source : null;

  // Guard: you can't want what you've already tried. If a verdict exists for
  // this strain it's on the shelf — leave it there and report back.
  const verdict = await prisma.strainFeedback.findUnique({
    where: { userId_strainName: { userId, strainName: canonical } },
    select: { id: true },
  });
  if (verdict) {
    return NextResponse.json({ ok: true, alreadyCollected: true });
  }

  await prisma.wishlist.upsert({
    where: { userId_strainName: { userId, strainName: canonical } },
    create: { userId, strainName: canonical, source: sourceValid },
    update: { source: sourceValid },
  });

  return NextResponse.json({ ok: true, strainName: canonical });
}

// Remove from the wishlist. Two modes:
//   { strainName }  → clear one strain (the button's toggle-off).
//   { all: true }   → wipe the whole wishlist.
export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  if (body?.all === true) {
    const { count } = await prisma.wishlist.deleteMany({ where: { userId } });
    return NextResponse.json({ ok: true, cleared: count });
  }

  const rawName = asString(body.strainName, 120);
  if (!rawName) {
    return NextResponse.json(
      { error: "Missing strainName (or pass { all: true })." },
      { status: 400 },
    );
  }

  const known = findStrain(rawName);
  const canonical = known?.name ?? rawName;

  // deleteMany (not delete) so removing something never wishlisted is a no-op
  // rather than a 404 — the button can fire it optimistically.
  const { count } = await prisma.wishlist.deleteMany({
    where: { userId, strainName: canonical },
  });
  return NextResponse.json({ ok: true, cleared: count });
}

// Read-only retrieval of the current user's wishlist. The button row hydrates
// from this on mount so a returning user sees their saved strains highlighted.
export async function GET() {
  const userId = await getUserId();
  const rows = await prisma.wishlist
    .findMany({
      where: { userId },
      select: { strainName: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => [] as Array<{ strainName: string; createdAt: Date }>);

  return NextResponse.json({
    wishlist: rows.map((r) => ({
      strainName: r.strainName,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}
