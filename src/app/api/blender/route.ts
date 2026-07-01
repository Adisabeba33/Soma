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
      select: {
        blenderActive: true,
        blenderLean1: true,
        blenderLean2: true,
        blenderBalance: true,
      },
    }),
    prisma.tasteProfile.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        merged: true,
        mergedAt: true,
        createdAt: true,
        isActive: true,
        primaryAroma: true,
        preferredAromas: true,
        preferredFlavors: true,
        primaryEffect: true,
        preferredEffects: true,
      },
    }),
  ]);

  // The blend is driven by the MERGE set, ordered by when each profile joined
  // it (legacy rows fall back to createdAt). The first two merged are the
  // adjustable pair; once a third is merged it becomes the "third" that blends
  // in. 2 merged → 2-way (pair lean only); 3 merged → 3-way (33/33/33 start).
  const mergedSorted = profiles
    .filter((p) => p.merged)
    .sort(
      (a, b) =>
        (a.mergedAt ?? a.createdAt).getTime() -
        (b.mergedAt ?? b.createdAt).getTime(),
    );

  const threeWay = mergedSorted.length >= 3;
  const pairProfiles = threeWay ? mergedSorted.slice(0, 2) : mergedSorted;
  const thirdProfile = threeWay ? mergedSorted[mergedSorted.length - 1] : null;
  const ready = mergedSorted.length >= 2;

  // If the shape is no longer valid (e.g. a profile was unmerged/deleted), the
  // Blender can't be "on" — report it off so the UI and scoring stay consistent.
  const active = ready && Boolean(user?.blenderActive);

  const name = (p: { name: string | null } | null | undefined) =>
    p?.name?.trim() || "Profile";

  // Top dominant aroma/effect tokens — let the diagram pick each node's
  // emblem (gas pump / moon / pineapple) the same way the account cards do.
  const top = (...lists: (string[] | null | undefined)[]): string[] =>
    Array.from(new Set(lists.flatMap((l) => l ?? []).filter(Boolean))).slice(0, 3);
  type Prof = (typeof profiles)[number];
  const aromas = (p: Prof) =>
    top(p.primaryAroma ? [p.primaryAroma] : [], p.preferredAromas, p.preferredFlavors);
  const effects = (p: Prof) =>
    top(p.primaryEffect ? [p.primaryEffect] : [], p.preferredEffects);

  return {
    active,
    ready,
    threeWay,
    balance: user?.blenderBalance ?? false,
    lean1: user?.blenderLean1 ?? 0,
    lean2: user?.blenderLean2 ?? 1,
    profileCount: profiles.length,
    mergedCount: mergedSorted.length,
    pair: pairProfiles.map((p) => ({
      id: p.id,
      name: name(p),
      primary: p.isActive,
      topAromas: aromas(p),
      topEffects: effects(p),
    })),
    third: thirdProfile
      ? {
          id: thirdProfile.id,
          name: name(thirdProfile),
          topAromas: aromas(thirdProfile),
          topEffects: effects(thirdProfile),
        }
      : null,
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
    blenderBalance?: boolean;
  } = {};

  if (typeof body.active === "boolean") data.blenderActive = body.active;
  if (typeof body.balance === "boolean") data.blenderBalance = body.balance;
  const l1 = clampNum(body.lean1, -1, 1);
  if (l1 !== null) data.blenderLean1 = l1;
  const l2 = clampNum(body.lean2, 0, 1);
  if (l2 !== null) data.blenderLean2 = l2;

  // Turning the Blender on requires at least two merged profiles (2-way blend);
  // merging a third makes it 3-way.
  if (data.blenderActive === true) {
    const state = await readState(userId);
    if (!state.ready) {
      return NextResponse.json(
        {
          error:
            "Taste Blender needs at least two merged profiles. Merge two to start, and a third to blend all three.",
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
