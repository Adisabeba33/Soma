import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import {
  profileCompleteness,
  MATCH_GATE_PERCENT,
} from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";

export const dynamic = "force-dynamic";

const cleanName = (v: unknown, fallback: string): string =>
  (typeof v === "string" ? v : "").trim().slice(0, 40) || fallback;

// Rename, or activate (set as the profile all matching runs under). Activating
// requires the profile to be at least MATCH_GATE_PERCENT complete.
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

  if (body.action === "activate") {
    const percent = profileCompleteness(
      profile as unknown as TasteProfileInput,
    ).percent;
    if (percent < MATCH_GATE_PERCENT) {
      return NextResponse.json(
        {
          error: `Finish this profile to ${MATCH_GATE_PERCENT}% before making it active.`,
          percent,
        },
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
