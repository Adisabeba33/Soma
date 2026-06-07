import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { asArray, asText } from "@/lib/api";
import { detectProfileContradictions } from "@/lib/profile-contradictions";
import {
  isPrimaryAroma,
  isPrimaryEffect,
  isUseTime,
} from "@/lib/profile-target";
import type { TasteProfileInput } from "@/lib/types";

const asEnum = <T extends string>(
  value: unknown,
  guard: (v: unknown) => v is T,
): T | null => (guard(value) ? value : null);

// bodyFeel is a 0–100 slider; clamp and round, null when absent.
const asBodyFeel = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
};

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getUserId();
  const profile = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  const contradictions = profile
    ? detectProfileContradictions(profile as unknown as TasteProfileInput)
    : [];
  return NextResponse.json({ profile, contradictions });
}

async function upsertProfile(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const data = {
    favoriteStrains: asArray(body.favoriteStrains),
    dislikedStrains: asArray(body.dislikedStrains),
    likedTraits: asArray(body.likedTraits),
    dislikedTraits: asArray(body.dislikedTraits),
    preferredAromas: asArray(body.preferredAromas),
    preferredFlavors: asArray(body.preferredFlavors),
    preferredEffects: asArray(body.preferredEffects),
    texturePreferences: asArray(body.texturePreferences),
    qualityPriorities: asArray(body.qualityPriorities),
    referenceStrain: asText(body.referenceStrain, 120),
    lookingFor: asText(body.lookingFor, 20) === "new" ? "new" : "similar",
    primaryAroma: asEnum(body.primaryAroma, isPrimaryAroma),
    primaryEffect: asEnum(body.primaryEffect, isPrimaryEffect),
    useTime: asEnum(body.useTime, isUseTime),
    bodyFeel: asBodyFeel(body.bodyFeel),
    notes: asText(body.notes, 2000),
  };

  const existing = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const profile = existing
    ? await prisma.tasteProfile.update({ where: { id: existing.id }, data })
    : await prisma.tasteProfile.create({ data: { ...data, userId } });

  const contradictions = detectProfileContradictions(
    profile as unknown as TasteProfileInput,
  );
  return NextResponse.json({ profile, contradictions });
}

export const POST = upsertProfile;
export const PUT = upsertProfile;
