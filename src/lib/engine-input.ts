// The single seam between stored TasteProfile rows and the engine's input
// type. Every call site used to cast `p as unknown as TasteProfileInput`,
// which silently trusts that (a) the Prisma model and the engine contract
// never drift and (b) no legacy row carries NULL in a String[] column —
// Postgres permits NULL on text[] without an explicit @default([]), and
// that already bit once (see the defensive `?? []` note in taste-engine.ts).
// This adapter normalises every field in one place instead: arrays coerce
// to [], scalars to null. New engine fields added to TasteProfileInput will
// fail to compile HERE rather than defaulting through a cast somewhere.

import type { TasteProfileInput } from "./types";

// Structural shape of a stored profile row — matches the Prisma TasteProfile
// model without importing @prisma/client, so this module (and everything
// that depends on it) stays loadable in tests without a generated client.
// Every field is optional/nullable: legacy rows, partial selects and test
// fixtures are all valid inputs.
export interface StoredTasteProfile {
  favoriteStrains?: string[] | null;
  dislikedStrains?: string[] | null;
  likedTraits?: string[] | null;
  dislikedTraits?: string[] | null;
  preferredAromas?: string[] | null;
  preferredFlavors?: string[] | null;
  preferredEffects?: string[] | null;
  dislikedEffects?: string[] | null;
  dislikedAromas?: string[] | null;
  texturePreferences?: string[] | null;
  qualityPriorities?: string[] | null;
  referenceStrain?: string | null;
  lookingFor?: string | null;
  primaryAroma?: string | null;
  primaryEffect?: string | null;
  useTime?: string | null;
  smokingMethod?: string | null;
  smokingMethods?: string[] | null;
  budStructure?: string | null;
  preferredType?: string | null;
  bodyFeel?: number | null;
  potencyPreference?: string | null;
  preferredFamilies?: string[] | null;
  avoidedFamilies?: string[] | null;
  avoidedRisks?: string[] | null;
  notes?: string | null;
}

export function toEngineInput(p: StoredTasteProfile): TasteProfileInput {
  return {
    favoriteStrains: p.favoriteStrains ?? [],
    dislikedStrains: p.dislikedStrains ?? [],
    likedTraits: p.likedTraits ?? [],
    dislikedTraits: p.dislikedTraits ?? [],
    preferredAromas: p.preferredAromas ?? [],
    preferredFlavors: p.preferredFlavors ?? [],
    preferredEffects: p.preferredEffects ?? [],
    dislikedEffects: p.dislikedEffects ?? [],
    dislikedAromas: p.dislikedAromas ?? [],
    texturePreferences: p.texturePreferences ?? [],
    qualityPriorities: p.qualityPriorities ?? [],
    referenceStrain: p.referenceStrain ?? null,
    lookingFor: p.lookingFor ?? null,
    primaryAroma: p.primaryAroma ?? null,
    primaryEffect: p.primaryEffect ?? null,
    useTime: p.useTime ?? null,
    smokingMethod: p.smokingMethod ?? null,
    smokingMethods: p.smokingMethods ?? [],
    budStructure: p.budStructure ?? null,
    preferredType: p.preferredType ?? null,
    bodyFeel: p.bodyFeel ?? null,
    potencyPreference: p.potencyPreference ?? null,
    preferredFamilies: p.preferredFamilies ?? [],
    avoidedFamilies: p.avoidedFamilies ?? [],
    avoidedRisks: p.avoidedRisks ?? [],
    notes: p.notes ?? null,
  };
}
