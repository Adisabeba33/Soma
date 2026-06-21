import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { getActiveProfile } from "@/lib/active-profile";
import { asArray, asText } from "@/lib/api";
import { detectProfileContradictions } from "@/lib/profile-contradictions";
import { isFamilyKey } from "@/lib/strain-families";
import { isRiskTag } from "@/lib/risk-tags";
import {
  isPrimaryAroma,
  isPrimaryEffect,
  isUseTime,
  isSmokingMethod,
  isBudStructure,
  isPreferredType,
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

const asPotency = (value: unknown): "mild" | "balanced" | "strong" | null =>
  value === "mild" || value === "balanced" || value === "strong" ? value : null;

export const dynamic = "force-dynamic";

// ?id=<profileId> reads that specific profile (for editing a named profile);
// otherwise the active profile.
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  const id = new URL(req.url).searchParams.get("id");
  const profile = id
    ? await prisma.tasteProfile.findFirst({ where: { id, userId } })
    : await getActiveProfile(userId);
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
    dislikedEffects: asArray(body.dislikedEffects),
    dislikedAromas: asArray(body.dislikedAromas),
    avoidedRisks: asArray(body.avoidedRisks).filter(isRiskTag),
    texturePreferences: asArray(body.texturePreferences),
    qualityPriorities: asArray(body.qualityPriorities),
    referenceStrain: asText(body.referenceStrain, 120),
    lookingFor: asText(body.lookingFor, 20) === "new" ? "new" : "similar",
    primaryAroma: asEnum(body.primaryAroma, isPrimaryAroma),
    primaryEffect: asEnum(body.primaryEffect, isPrimaryEffect),
    useTime: asEnum(body.useTime, isUseTime),
    smokingMethods: asArray(body.smokingMethods).filter(isSmokingMethod),
    budStructure: asEnum(body.budStructure, isBudStructure),
    preferredType: asEnum(body.preferredType, isPreferredType),
    bodyFeel: asBodyFeel(body.bodyFeel),
    potencyPreference: asPotency(body.potencyPreference),
    preferredFamilies: asArray(body.preferredFamilies).filter(isFamilyKey),
    avoidedFamilies: asArray(body.avoidedFamilies).filter(isFamilyKey),
    notes: asText(body.notes, 2000),
  };

  // Edit a specific named profile when profileId is given (the form passes it);
  // otherwise the active profile. With no profile at all, create the first one
  // as the active "Main".
  const profileId = typeof body.profileId === "string" ? body.profileId : null;
  const existing = profileId
    ? await prisma.tasteProfile.findFirst({ where: { id: profileId, userId } })
    : await getActiveProfile(userId);

  const profile = existing
    ? await prisma.tasteProfile.update({ where: { id: existing.id }, data })
    : await prisma.tasteProfile.create({
        data: { ...data, userId, name: "Main", isActive: true },
      });

  const contradictions = detectProfileContradictions(
    profile as unknown as TasteProfileInput,
  );
  return NextResponse.json({ profile, contradictions });
}

export const POST = upsertProfile;
export const PUT = upsertProfile;
