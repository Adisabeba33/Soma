// Effect texture — Layer 2 of behavioural reasoning.
//
// Layer 1 (effect-archetype.ts) splits broad intent (clean-creative-daytime
// vs sharp-stimulant vs deep-sleeper). Within a single archetype, strains
// can still feel completely different: Jack Herer, Durban Poison, Tangie,
// SLH and Trainwreck are all "clean-creative-daytime" but a lucid Jack
// experience is nothing like a chaotic Trainwreck one.
//
// Texture answers: "what does the high feel like in the nervous system?"
//
// Each strain has ONE texture. The engine applies a bounded ±3 modifier
// (match bonus / mismatch dampener) on top of the existing formula —
// never replaces it. Adjacency clusters mean nearby textures don't
// punish each other; only cross-cluster mismatches dampen.
//
// Written definitions live in docs/behavioral-layers.md so the vocab
// stays stable as the dataset grows.

import { findStrain } from "./strain-data";
import { effectArchetypeOf } from "./effect-archetype";
import type { StrainProfile, TasteProfileInput } from "./types";

export const EFFECT_TEXTURES = [
  "smooth", // even, no edges, soft onset and arc
  "dreamy", // slow, mellow, soft-edged drift
  "floaty", // weightless, drifty, body disengaged
  "lucid", // clear-headed, deliberate, functional
  "electric", // racing, restless, persistent energy
  "sharp", // pointed, immediate, narrow stimulation
  "chaotic", // unstable, swings, undirected
  "grounded", // settled in the body, present, anchored
  "pressure-heavy", // felt as weight, dense, can be intense
] as const;

export type EffectTexture = (typeof EFFECT_TEXTURES)[number];

// Explicit overrides. Most strains will fall through to inferEffectTexture,
// but the experiential calls that matter most — especially within
// clean-creative-daytime where Layer 1 collapses too much — are pinned
// here so the discrimination is intentional, not accidental.
const OVERRIDES: Record<string, EffectTexture> = {
  // Lucid — clear functional daytime
  "Jack Herer": "lucid",
  "Durban Poison": "lucid",
  "Lemon Tree": "lucid",
  "Lemon Haze": "lucid",
  Clementine: "lucid",

  // Smooth — even bright, no edge
  Tangie: "smooth",
  "Pink Lemonade": "smooth",
  "Orange Crush": "smooth",
  "Strawberry Cough": "smooth",
  "Maui Wowie": "smooth",

  // Floaty — cerebral drift
  "Super Lemon Haze": "floaty",
  "Super Silver Haze": "floaty",
  "Amnesia Haze": "floaty",
  "Moby Dick": "floaty",

  // Dreamy — soft mellow drift
  "Blue Dream": "dreamy",
  "Forbidden Fruit": "dreamy",
  "Watermelon Zkittlez": "dreamy",
  Zkittlez: "dreamy",

  // Sharp — pointed immediate energy
  "NYC Diesel": "sharp",
  "Ghost Train Haze": "sharp",

  // Electric — sustained racey
  "Green Crack": "electric",
  "Bruce Banner": "electric",

  // Chaotic — unstable / swing
  Trainwreck: "chaotic",
  "Sour Diesel": "chaotic",

  // Pressure-heavy — felt as weight (gas-heavy)
  GG4: "pressure-heavy",
  "OG Kush": "pressure-heavy",
  "Tahoe OG": "pressure-heavy",
  "King Louis XIII": "pressure-heavy",
  "Platinum OG": "pressure-heavy",
  "Skywalker OG": "pressure-heavy",
  "GMO Cookies": "pressure-heavy",
  "Donny Burger": "pressure-heavy",
  "Permanent Marker": "pressure-heavy",
  "Fire OG": "pressure-heavy",
  "Face Off OG": "pressure-heavy",
  "9 Pound Hammer": "pressure-heavy",

  // Grounded — settled body, anchored
  "Northern Lights": "grounded",
  "Granddaddy Purple": "grounded",
  "Bubba Kush": "grounded",
  "Hindu Kush": "grounded",
  Afghani: "grounded",
  "Master Kush": "grounded",
  "Purple Punch": "grounded",
  "Blackberry Kush": "grounded",
  Blueberry: "grounded",
  "Kosher Kush": "grounded",
  Slurricane: "grounded",

  // Smooth dessert
  "Wedding Cake": "smooth",
  Gelato: "smooth",
  "Ice Cream Cake": "smooth",
  "Birthday Cake": "smooth",
  Runtz: "smooth",
  Mochi: "smooth",
  "Sundae Driver": "smooth",
  "Cherry Pie": "smooth",
  "White Hot Guava": "smooth",
};

export function effectTextureOf(strain: StrainProfile): EffectTexture {
  const override = OVERRIDES[strain.name];
  if (override) return override;
  return inferEffectTexture(strain);
}

// Deterministic fallback. Order matters — first matching rule wins.
function inferEffectTexture(strain: StrainProfile): EffectTexture {
  const e = new Set(strain.effects);
  const a = new Set(strain.aromas);
  const t = new Set(strain.traits);

  if (e.has("couch-lock") || (e.has("sleepy") && e.has("body-heavy"))) {
    return "grounded";
  }
  if (e.has("body-heavy")) {
    if (a.has("gassy") || a.has("diesel") || t.has("heavy-body")) {
      return "pressure-heavy";
    }
    if (a.has("sweet") || a.has("creamy") || a.has("berry")) return "smooth";
    return "grounded";
  }
  if (e.has("head-high") && !e.has("body-heavy")) return "floaty";
  if (e.has("focused") && e.has("energetic")) return "lucid";
  if (e.has("energetic") && !e.has("focused")) return "electric";
  if (e.has("uplifted") && (e.has("calm") || e.has("relaxed") || e.has("happy"))) {
    if (a.has("berry") || a.has("fruity") || a.has("floral")) return "dreamy";
    return "smooth";
  }
  if (e.has("creative") && e.has("uplifted")) return "lucid";
  if (e.has("relaxed") && e.has("calm")) return "grounded";
  return "smooth"; // benign catchall
}

// Adjacency clusters. Within a cluster, neighbouring textures don't
// punish — they're different but not contradictory. Cross-cluster
// mismatches DO punish, which is the whole point of the layer.
//
//   Soft cluster:  smooth ↔ dreamy ↔ floaty ↔ lucid
//   Edgy cluster:  electric ↔ sharp ↔ chaotic
//   Heavy cluster: grounded ↔ pressure-heavy
const ADJACENT: Record<EffectTexture, EffectTexture[]> = {
  smooth: ["dreamy", "lucid", "floaty"],
  dreamy: ["smooth", "floaty"],
  floaty: ["dreamy", "lucid", "smooth"],
  lucid: ["smooth", "floaty"],
  electric: ["sharp", "chaotic"],
  sharp: ["electric", "chaotic"],
  chaotic: ["electric", "sharp"],
  grounded: ["pressure-heavy"],
  "pressure-heavy": ["grounded"],
};

export function texturesAreAdjacent(a: EffectTexture, b: EffectTexture): boolean {
  if (a === b) return true;
  return ADJACENT[a]?.includes(b) ?? false;
}

// Derive the user's target texture. Same shape as inferProfileArchetype:
// favourites first, preferences fallback, null on no signal so the
// modifier doesn't fire unfairly.
export function inferProfileTexture(
  profile: TasteProfileInput,
): EffectTexture | null {
  const favStrains = profile.favoriteStrains
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));
  if (favStrains.length > 0) {
    return mostCommon(favStrains.map(effectTextureOf));
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
  return inferEffectTexture(synthetic);
}

// Bounded ±3 contribution to the score. Match → +3, cross-cluster
// mismatch → -3, adjacent → 0. Null target → 0 (no signal, no penalty).
//
// This sits alongside the Layer 1 archetype dampener. Combined worst-case
// downward swing from the two behavioural layers is ≈ 14pt (10.8 from
// archetype's effect-multiplier + 3 here), worst-case upward swing ≈ 7pt
// (4 archetype bonus + 3 here). Anchor floor (94–96) wins over both.
export function textureContribution(
  strainTexture: EffectTexture,
  targetTexture: EffectTexture | null,
): number {
  if (targetTexture === null) return 0;
  if (strainTexture === targetTexture) return 3;
  if (texturesAreAdjacent(strainTexture, targetTexture)) return 0;
  return -3;
}

function mostCommon(items: EffectTexture[]): EffectTexture {
  const counts = new Map<EffectTexture, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  let best: EffectTexture = items[0];
  let bestCount = 0;
  for (const [item, count] of counts) {
    if (count > bestCount) {
      best = item;
      bestCount = count;
    }
  }
  return best;
}

// Convenience — useful for logging/debugging and the future catalog
// audit view. Pair (archetype, texture) is the behavioural fingerprint.
export interface BehavioralProfile {
  archetype: ReturnType<typeof effectArchetypeOf>;
  texture: EffectTexture;
}

export function behavioralProfileOf(strain: StrainProfile): BehavioralProfile {
  return {
    archetype: effectArchetypeOf(strain),
    texture: effectTextureOf(strain),
  };
}
