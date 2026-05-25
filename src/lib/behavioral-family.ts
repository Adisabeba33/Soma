// Behavioural family — Layer 3 of the reasoning stack.
//
// Layer 1 (archetype) and Layer 2 (texture) describe what a strain IS and
// HOW the high feels. Layer 3 names which experiential UNIVERSE a strain
// belongs to: "nighttime indica," "daytime functional," "edgy stimulant,"
// "contemplative quiet," "exotic modern hybrid."
//
// Two critical architectural choices:
//
// 1. Family is a PURE FUNCTION of (archetype, texture). It is never tagged
//    per-strain. This avoids vocab drift: as long as a strain has the
//    right archetype and texture, its family follows automatically. There
//    is no "third manual classification" to maintain.
//
// 2. Family layer is RECOGNITION-ONLY — it adds a bounded bonus when the
//    candidate sits in the same universe as the user's favourites, never
//    penalises. Punishment role is already played by Layers 1 + 2; adding
//    a family dampener would double-count. The bonus exists so that a
//    behaviourally-aligned strain with weak surface-tag overlap (e.g.
//    Purple Punch on a Northern Lights / GDP / Bubba profile, where the
//    user's profile lists earthy/woody aromas and PP brings grape/berry)
//    is recognised as "same world" rather than dragged down by missing
//    aroma matches.
//
// Evidence-density scaling: bonus is +2 per signal up to 4 signals
// (max +8). Family match is the gate — without it, bonus is 0. With it,
// secondary signals (effect overlap, sensory overlap, reference
// similarity) increase the recognition reward.

import { findStrain } from "./strain-data";
import { effectArchetypeOf } from "./effect-archetype";
import type { EffectArchetype } from "./effect-archetype";
import { effectTextureOf } from "./effect-texture";
import type { EffectTexture } from "./effect-texture";
import type { StrainProfile, TasteProfileInput } from "./types";

export const BEHAVIORAL_FAMILIES = [
  "nighttime-indica",
  "daytime-functional",
  "exotic-modern-hybrid",
  "edgy-stimulant",
  "contemplative-quiet",
] as const;

export type BehavioralFamily = (typeof BEHAVIORAL_FAMILIES)[number];

// (archetype, texture) → family | null. Partial function on purpose —
// some compositions don't fit any clear family, and returning null is
// the honest signal. Don't force every strain into a bucket.
function familyFromComposition(
  archetype: EffectArchetype,
  texture: EffectTexture,
): BehavioralFamily | null {
  switch (archetype) {
    case "deep-sleeper":
      if (texture === "grounded" || texture === "pressure-heavy" || texture === "smooth") {
        return "nighttime-indica";
      }
      return null;

    case "dessert-couch-lock":
      if (texture === "smooth" || texture === "grounded" || texture === "pressure-heavy") {
        return "nighttime-indica";
      }
      if (texture === "dreamy") return "contemplative-quiet";
      return null;

    case "garlic-funk":
      if (texture === "pressure-heavy" || texture === "grounded") {
        return "nighttime-indica";
      }
      return null;

    case "introspective-calm":
      return "contemplative-quiet";

    case "clean-creative-daytime":
      if (
        texture === "lucid" ||
        texture === "smooth" ||
        texture === "floaty" ||
        texture === "dreamy"
      ) {
        return "daytime-functional";
      }
      if (texture === "chaotic" || texture === "electric" || texture === "sharp") {
        return "edgy-stimulant";
      }
      return null;

    case "social-bright":
      return "daytime-functional";

    case "floaty-cerebral":
      if (
        texture === "floaty" ||
        texture === "dreamy" ||
        texture === "smooth" ||
        texture === "lucid"
      ) {
        return "daytime-functional";
      }
      if (texture === "sharp" || texture === "electric" || texture === "chaotic") {
        return "edgy-stimulant";
      }
      return null;

    case "sharp-stimulant":
      return "edgy-stimulant";

    case "smooth-expressive":
      if (texture === "smooth") return "exotic-modern-hybrid";
      return null;
  }
}

export function behavioralFamilyOf(
  strain: StrainProfile,
): BehavioralFamily | null {
  return familyFromComposition(effectArchetypeOf(strain), effectTextureOf(strain));
}

// Profile family — favourites are the strongest signal, but only when
// they cluster (≥ half land in the same family). Diverse favourites
// across families correctly return null — there is no single experiential
// universe to recognise.
//
// Sparse profile with no favourites: try to infer from preferred effects
// and aromas via a synthetic strain. Empty profiles return null so the
// bonus never fires on no signal.
export function inferProfileFamily(
  profile: TasteProfileInput,
): BehavioralFamily | null {
  const favStrains = profile.favoriteStrains
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));

  if (favStrains.length > 0) {
    const families = favStrains
      .map(behavioralFamilyOf)
      .filter((f): f is BehavioralFamily => f !== null);
    if (families.length === 0) return null;
    const mode = mostCommon(families);
    const modeCount = families.filter((f) => f === mode).length;
    // Require dominance — at least half of the family-classifiable
    // favourites must agree. Otherwise it's not really "one universe."
    if (modeCount * 2 >= families.length) return mode;
    return null;
  }

  if (
    profile.preferredEffects.length === 0 &&
    profile.preferredAromas.length === 0
  ) {
    return null;
  }
  const synthetic: StrainProfile = {
    name: "__profile__",
    type: "hybrid",
    aromas: profile.preferredAromas,
    flavors: profile.preferredFlavors,
    effects: profile.preferredEffects,
    traits: profile.likedTraits,
    potency: "moderate",
  };
  return behavioralFamilyOf(synthetic);
}

export interface FamilyEvidence {
  effectMatched: number; // count of preferred effects this strain has
  aromaMatched: number; // count of preferred aromas matched
  flavorMatched: number; // count of preferred flavors matched
  refScore: number; // referenceSimilarity 0–100
  effectScore: number; // setScore 0–100
}

// Evidence-density-scaled bonus. Family is the gate. Once family matches,
// secondary signals increase the reward. Asymmetric — never negative.
//
//   1 signal  (family alone)    → +2
//   2 signals                   → +4
//   3 signals                   → +6
//   4 signals                   → +8
//
// Combined with Layer 1's archetype bonus (+4) and Layer 2's texture bonus
// (+3), the maximum upward swing on a richly-aligned non-anchor strain is
// +15. Anchor floor 94–96 still wins.
export function familyBonus(
  strainFamily: BehavioralFamily | null,
  targetFamily: BehavioralFamily | null,
  evidence: FamilyEvidence,
): number {
  if (targetFamily === null || strainFamily === null) return 0;
  if (strainFamily !== targetFamily) return 0;

  let signals = 1; // family match is the gate, counts as one
  if (evidence.effectMatched >= 2 || evidence.effectScore >= 60) signals++;
  if (evidence.aromaMatched >= 1 || evidence.flavorMatched >= 1) signals++;
  if (evidence.refScore >= 40) signals++;

  return signals * 2;
}

function mostCommon(items: BehavioralFamily[]): BehavioralFamily {
  const counts = new Map<BehavioralFamily, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  let best: BehavioralFamily = items[0];
  let bestCount = 0;
  for (const [item, count] of counts) {
    if (count > bestCount) {
      best = item;
      bestCount = count;
    }
  }
  return best;
}
