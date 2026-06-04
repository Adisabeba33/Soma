// Effect archetypes — behavioural texture of a strain, beyond raw effect
// tags. Two strains can both carry "energetic + focused" but feel
// completely different in practice (Green Crack's sharp dopamine spike vs
// Jack Herer's clean creative daytime). This module lets the scoring
// engine distinguish those buckets.
//
// Architecture:
// - effectArchetypeOf(strain) returns a single archetype per strain via
//   an explicit override map OR a deterministic fallback rule.
// - inferProfileArchetype(profile) derives a TARGET archetype from the
//   user's favourites (strongest signal) or their preferred effects (only
//   if there's enough signal — sparse profiles return null so we don't
//   manufacture a verdict).
// - areAdjacent(a, b) marks pairs that feel close enough that mismatch
//   shouldn't punish. sharp-stimulant has NO adjacents — it always
//   feels distinct.

import { findStrain } from "./strain-data";
import type { StrainProfile, TasteProfileInput } from "./types";

export const EFFECT_ARCHETYPES = [
  "clean-creative-daytime",
  "sharp-stimulant",
  "floaty-cerebral",
  "social-bright",
  "introspective-calm",
  "smooth-expressive",
  "dessert-couch-lock",
  "garlic-funk",
  "deep-sleeper",
] as const;

export type EffectArchetype = (typeof EFFECT_ARCHETYPES)[number];

// Explicit overrides for strains where the deterministic fallback would
// classify them wrong. Particularly important for the sharp-stimulant
// bucket (which the fallback would otherwise lump into
// clean-creative-daytime because both carry energetic+focused).
const OVERRIDES: Record<string, EffectArchetype> = {
  // Sharp stimulants — must be explicit, the fallback would miss these.
  "Green Crack": "sharp-stimulant",
  "Ghost Train Haze": "sharp-stimulant",

  // Clean creative daytime — citrus/pine forward, smooth functional uplift.
  "Jack Herer": "clean-creative-daytime",
  "Durban Poison": "clean-creative-daytime",
  "Super Lemon Haze": "clean-creative-daytime",
  "Lemon Haze": "clean-creative-daytime",
  "Lemon Tree": "clean-creative-daytime",
  Clementine: "clean-creative-daytime",
  Trainwreck: "clean-creative-daytime",
  Tangie: "clean-creative-daytime",

  // Floaty cerebral — heady, less body, classic head-up.
  "Sour Diesel": "floaty-cerebral",
  "NYC Diesel": "floaty-cerebral",
  Chemdawg: "floaty-cerebral",
  "Chem 91": "floaty-cerebral",
  Stardawg: "floaty-cerebral",
  "Amnesia Haze": "floaty-cerebral",
  "Super Silver Haze": "floaty-cerebral",
  "Moby Dick": "floaty-cerebral",

  // Social bright — giggly happy, conversational warmth.
  "Strawberry Cough": "social-bright",
  Mimosa: "social-bright",
  "Tropicana Cookies": "social-bright",
  "Tropicana Cherry": "social-bright",
  "Maui Wowie": "social-bright",
  "Pineapple Express": "social-bright",
  "Pink Lemonade": "social-bright",
  "Orange Crush": "social-bright",

  // Smooth expressive — flavour-forward full-bodied hybrids.
  "Blue Dream": "smooth-expressive",
  GG4: "smooth-expressive",
  "White Widow": "smooth-expressive",
  Runtz: "smooth-expressive",
  "White Runtz": "smooth-expressive",
  "Cherry Pie": "smooth-expressive",
  "Cherry Punch": "smooth-expressive",
  Gelato: "smooth-expressive",
  "Gelato 33": "smooth-expressive",
  "White Hot Guava": "smooth-expressive",
  "Strawberry Banana": "smooth-expressive",

  // Dessert couch-lock — sweet/creamy heavy body, sedative dessert.
  "Wedding Cake": "dessert-couch-lock",
  "Ice Cream Cake": "dessert-couch-lock",
  "Gelato Cake": "dessert-couch-lock",
  "Birthday Cake": "dessert-couch-lock",
  "Lemon Cherry Gelato": "dessert-couch-lock",
  Mochi: "dessert-couch-lock",
  "Sundae Driver": "dessert-couch-lock",
  "Lava Cake": "dessert-couch-lock",
  "London Pound Cake": "dessert-couch-lock",
  "LA Kush Cake": "dessert-couch-lock",
  "Apple Fritter": "dessert-couch-lock",

  // Garlic / funk — savoury pungent, body-forward slow-burn.
  "GMO Cookies": "garlic-funk",
  "Donny Burger": "garlic-funk",
  "Permanent Marker": "garlic-funk",
  "Cheetah Piss": "garlic-funk",

  // Deep sleeper — couch-lock / sleepy heavy indica.
  "Northern Lights": "deep-sleeper",
  "Granddaddy Purple": "deep-sleeper",
  "Purple Punch": "deep-sleeper",
  "Bubba Kush": "deep-sleeper",
  "Skywalker OG": "deep-sleeper",
  "Tahoe OG": "deep-sleeper",
  "King Louis XIII": "deep-sleeper",
  "Platinum OG": "deep-sleeper",
  "Master Kush": "deep-sleeper",
  "Hindu Kush": "deep-sleeper",
  Afghani: "deep-sleeper",
  "Blackberry Kush": "deep-sleeper",
  "Kosher Kush": "deep-sleeper",
  "9 Pound Hammer": "deep-sleeper",
  Slurricane: "deep-sleeper",
  "Do-Si-Dos": "deep-sleeper",

  // Introspective calm — fruity relaxed without heavy sedation.
  Zkittlez: "introspective-calm",
  "Watermelon Zkittlez": "introspective-calm",
  "Forbidden Fruit": "introspective-calm",
  Blueberry: "introspective-calm",
  Papaya: "introspective-calm",
};

export function effectArchetypeOf(strain: StrainProfile): EffectArchetype {
  const override = OVERRIDES[strain.name];
  if (override) return override;
  return inferEffectArchetype(strain);
}

// Deterministic fallback. Order matters — first matching rule wins.
function inferEffectArchetype(strain: StrainProfile): EffectArchetype {
  const e = new Set(strain.effects);
  const a = new Set(strain.aromas);

  if (e.has("couch-lock") || e.has("sleepy")) return "deep-sleeper";
  if (e.has("body-heavy")) {
    if (a.has("cheese") || (a.has("gassy") && a.has("earthy") && a.has("spicy"))) {
      return "garlic-funk";
    }
    if (a.has("sweet") || a.has("creamy") || a.has("berry") || a.has("fruity")) {
      return "dessert-couch-lock";
    }
    return "introspective-calm";
  }
  if (e.has("focused") && e.has("energetic")) return "clean-creative-daytime";
  if (e.has("energetic") && (a.has("diesel") || a.has("gassy"))) {
    return "floaty-cerebral";
  }
  if (e.has("head-high")) return "floaty-cerebral";
  if (e.has("giggly")) return "social-bright";
  if (e.has("happy") && e.has("uplifted") && (a.has("citrus") || a.has("tropical"))) {
    return "social-bright";
  }
  if (e.has("creative") && e.has("uplifted")) return "clean-creative-daytime";
  if (e.has("calm") && e.has("relaxed")) return "introspective-calm";
  return "smooth-expressive";
}

// Pairs that feel adjacent enough that an archetype mismatch shouldn't
// punish. sharp-stimulant intentionally has NO adjacents — it always
// reads as a distinct experience, which is the whole point of the bucket.
const ADJACENT: Record<EffectArchetype, EffectArchetype[]> = {
  "clean-creative-daytime": ["social-bright", "floaty-cerebral", "smooth-expressive"],
  "sharp-stimulant": [],
  "floaty-cerebral": ["clean-creative-daytime"],
  "social-bright": ["clean-creative-daytime", "smooth-expressive"],
  "introspective-calm": ["smooth-expressive", "deep-sleeper", "dessert-couch-lock"],
  "smooth-expressive": [
    "clean-creative-daytime",
    "social-bright",
    "introspective-calm",
    "dessert-couch-lock",
  ],
  "dessert-couch-lock": ["deep-sleeper", "smooth-expressive", "introspective-calm"],
  "garlic-funk": ["deep-sleeper", "smooth-expressive"],
  "deep-sleeper": ["introspective-calm", "dessert-couch-lock", "garlic-funk"],
};

export function areAdjacent(a: EffectArchetype, b: EffectArchetype): boolean {
  if (a === b) return true;
  return ADJACENT[a]?.includes(b) ?? false;
}

// Derive the user's target archetype. Returns null when the profile gives
// us no clear signal — we don't manufacture a target out of thin air.
export function inferProfileArchetype(
  profile: TasteProfileInput,
): EffectArchetype | null {
  // 1. Favourites are the strongest signal — they're the user's explicit
  //    sensory anchor.
  const favStrains = profile.favoriteStrains
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));
  if (favStrains.length > 0) {
    const archs = favStrains.map(effectArchetypeOf);
    return mostCommon(archs);
  }

  // 2. Fall back to preferences — but only if the user expressed any
  //    effect or aroma preference. Empty profiles return null so the
  //    archetype dampener doesn't fire on no signal.
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
  return inferEffectArchetype(synthetic);
}

function mostCommon(items: EffectArchetype[]): EffectArchetype {
  const counts = new Map<EffectArchetype, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  let best: EffectArchetype = items[0];
  let bestCount = 0;
  for (const [item, count] of counts) {
    if (count > bestCount) {
      best = item;
      bestCount = count;
    }
  }
  return best;
}
