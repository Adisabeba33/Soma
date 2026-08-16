import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { matchingReadiness } from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";

export const dynamic = "force-dynamic";

const cleanName = (v: unknown, fallback: string): string =>
  (typeof v === "string" ? v : "").trim().slice(0, 40) || fallback;

// The one gate message for activate/merge. Readiness (not the completeness
// percent) is what unlocks use — see matchingReadiness().
const NOT_READY_ERROR =
  "This profile needs real matching signal first: a favourite strain, or a primary effect + time plus one aroma/effect you enjoy.";

// Rename, or activate (set as the profile all matching runs under). Activating
// requires the profile to be matching-ready.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const profile = await prisma.tasteProfile.findFirst({
    where: { id, userId },
  });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  if (body.action === "rename") {
    await prisma.tasteProfile.update({
      where: { id },
      data: { name: cleanName(body.name, profile.name ?? "Profile") },
    });
    return NextResponse.json({ ok: true });
  }

  // Toggle this profile in/out of the merge set. Like activate, a profile must
  // be matching-ready before it can join — merging an empty profile would only
  // dilute the blend. Removing from the set is always allowed.
  if (body.action === "merge") {
    const on = body.on !== false; // default true
    if (on) {
      const readiness = matchingReadiness(
        profile as unknown as TasteProfileInput,
      );
      if (!readiness.ready) {
        return NextResponse.json(
          { error: NOT_READY_ERROR, missing: readiness.missing },
          { status: 400 },
        );
      }
    }
    await prisma.tasteProfile.update({
      where: { id },
      data: { merged: on },
    });
    // When this merge brings the set to three, the blend becomes 3-way and
    // starts at an equal third (33/33/33) — reset the admix recipe to full so
    // the third isn't dosed down by a stale value from an earlier session.
    if (on) {
      const mergedCount = await prisma.tasteProfile.count({
        where: { userId, merged: true },
      });
      if (mergedCount >= 3) {
        await prisma.user.update({
          where: { id: userId },
          data: { blenderLean2: 1 },
        });
      }
    }
    return NextResponse.json({ ok: true, merged: on });
  }

  if (body.action === "activate") {
    const readiness = matchingReadiness(
      profile as unknown as TasteProfileInput,
    );
    if (!readiness.ready) {
      return NextResponse.json(
        { error: NOT_READY_ERROR, missing: readiness.missing },
        { status: 400 },
      );
    }
    await prisma.$transaction([
      prisma.tasteProfile.updateMany({
        where: { userId },
        data: { isActive: false },
      }),
      prisma.tasteProfile.update({ where: { id }, data: { isActive: true } }),
    ]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  const { id } = await params;

  const profile = await prisma.tasteProfile.findFirst({
    where: { id, userId },
  });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  await prisma.tasteProfile.delete({ where: { id } });

  // If the deleted profile was active, promote the most recent remaining one so
  // the account always has an active profile to match under.
  if (profile.isActive) {
    const next = await prisma.tasteProfile.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    if (next) {
      await prisma.tasteProfile.update({
        where: { id: next.id },
        data: { isActive: true },
      });
    }
  }
  return NextResponse.json({ ok: true });
}
