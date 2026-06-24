// Taste Blender config — the virtual "4th profile" that mixes all three real
// profiles. Stored on the User: `blenderActive` (drives every surface when on),
// `blenderLean1` (lean inside the merged pair, −1…+1) and `blenderLean2` (how
// much the third profile is blended in, 0…1).
//
// "Ready" means the shape the Blender needs exists: exactly 3 profiles, with 2
// merged into the base pair and 1 left as the third. The UI gates on this.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

const clampNum = (v: unknown, lo: number, hi: number): number | null => {
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  return Math.max(lo, Math.min(hi, v));
};

async function readState(userId: string) {
  const [user, profiles] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { blenderActive: true, blenderLean1: true, blenderLean2: true },
    }),
    prisma.tasteProfile.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, merged: true, isActive: true },
    }),
  ]);

  const pair = profiles.filter((p) => p.merged);
  const third = profiles.length === 3 && pair.length === 2
    ? profiles.find((p) => !p.merged) ?? null
    : null;
  const ready = Boolean(third);

  // If the shape is no longer valid (e.g. a profile was deleted), the Blender
  // can't be "on" — report it off so the UI and scoring stay consistent.
  const active = ready && Boolean(user?.blenderActive);

  const name = (p: { name: string | null } | null | undefined) =>
    p?.name?.trim() || "Profile";

  return {
    active,
    ready,
    lean1: user?.blenderLean1 ?? 0,
    lean2: user?.blenderLean2 ?? 0,
    profileCount: profiles.length,
    pairCount: pair.length,
    pair: pair.map((p) => ({ id: p.id, name: name(p), primary: p.isActive })),
    third: third ? { id: third.id, name: name(third) } : null,
  };
}

export async function GET() {
  const userId = await getUserId();
  return NextResponse.json(await readState(userId));
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const data: {
    blenderActive?: boolean;
    blenderLean1?: number;
    blenderLean2?: number;
  } = {};

  if (typeof body.active === "boolean") data.blenderActive = body.active;
  const l1 = clampNum(body.lean1, -1, 1);
  if (l1 !== null) data.blenderLean1 = l1;
  const l2 = clampNum(body.lean2, 0, 1);
  if (l2 !== null) data.blenderLean2 = l2;

  // Turning the Blender on requires the ready shape (3 profiles, 2 merged + 1).
  if (data.blenderActive === true) {
    const state = await readState(userId);
    if (!state.ready) {
      return NextResponse.json(
        {
          error:
            "Taste Blender needs three profiles — two merged into a pair, plus a third to blend in.",
        },
        { status: 400 },
      );
    }
  }

  if (Object.keys(data).length > 0) {
    await prisma.user.update({ where: { id: userId }, data });
  }
  return NextResponse.json(await readState(userId));
}
