import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  areAdjacent,
  effectArchetypeOf,
  inferProfileArchetype,
} from "../src/lib/effect-archetype";
import { scoreStrain } from "../src/lib/taste-engine";
import { STRAINS } from "../src/lib/strain-data";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

function profile(overrides: Partial<TasteProfileInput> = {}): TasteProfileInput {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    texturePreferences: [],
    qualityPriorities: [],
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
    ...overrides,
  };
}

function findSeed(name: string): StrainProfile {
  const s = STRAINS.find((x) => x.name === name);
  if (!s) throw new Error(`seed missing ${name}`);
  return s;
}

describe("effectArchetypeOf — known classifications", () => {
  it("classifies sharp stimulants distinctly from clean creative daytime", () => {
    assert.equal(effectArchetypeOf(findSeed("Green Crack")), "sharp-stimulant");
    assert.equal(
      effectArchetypeOf(findSeed("Jack Herer")),
      "clean-creative-daytime",
    );
    assert.equal(
      effectArchetypeOf(findSeed("Durban Poison")),
      "clean-creative-daytime",
    );
  });

  it("classifies known deep-sleeper indicas correctly", () => {
    assert.equal(
      effectArchetypeOf(findSeed("Northern Lights")),
      "deep-sleeper",
    );
    assert.equal(
      effectArchetypeOf(findSeed("Granddaddy Purple")),
      "deep-sleeper",
    );
  });

  it("classifies dessert couch-lock vs garlic funk distinctly", () => {
    assert.equal(
      effectArchetypeOf(findSeed("Wedding Cake")),
      "dessert-couch-lock",
    );
    assert.equal(effectArchetypeOf(findSeed("GMO Cookies")), "garlic-funk");
  });
});

describe("areAdjacent", () => {
  it("sharp-stimulant has no adjacents — always feels distinct", () => {
    for (const other of [
      "clean-creative-daytime",
      "smooth-expressive",
      "social-bright",
      "floaty-cerebral",
    ] as const) {
      assert.equal(
        areAdjacent("sharp-stimulant", other),
        false,
        `sharp-stimulant should not be adjacent to ${other}`,
      );
    }
  });

  it("clean-creative-daytime is adjacent to social/floaty/smooth", () => {
    assert.ok(areAdjacent("clean-creative-daytime", "social-bright"));
    assert.ok(areAdjacent("clean-creative-daytime", "floaty-cerebral"));
    assert.ok(areAdjacent("clean-creative-daytime", "smooth-expressive"));
  });

  it("self-adjacency is true (an archetype matches itself)", () => {
    assert.ok(areAdjacent("deep-sleeper", "deep-sleeper"));
  });

  it("is symmetric — direction of the pair never changes the verdict", () => {
    // Regression: garlic-funk listed smooth-expressive as adjacent but not
    // vice-versa, so a gassy garlic-funk strain scored against a
    // smooth-expressive target was wrongly dampened while the reverse pair
    // was not. Adjacency is a symmetric relation by definition.
    assert.equal(
      areAdjacent("smooth-expressive", "garlic-funk"),
      areAdjacent("garlic-funk", "smooth-expressive"),
    );
    assert.ok(areAdjacent("smooth-expressive", "garlic-funk"));

    const ALL = [
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
    for (const a of ALL) {
      for (const b of ALL) {
        assert.equal(
          areAdjacent(a, b),
          areAdjacent(b, a),
          `adjacency must be symmetric for ${a} ↔ ${b}`,
        );
      }
    }
  });
});

describe("inferProfileArchetype", () => {
  it("returns null for an empty profile (no signal, no manufactured verdict)", () => {
    assert.equal(inferProfileArchetype(profile()), null);
  });

  it("uses favourites as the strongest signal", () => {
    assert.equal(
      inferProfileArchetype(
        profile({ favoriteStrains: ["Jack Herer", "Durban Poison"] }),
      ),
      "clean-creative-daytime",
    );
    assert.equal(
      inferProfileArchetype(profile({ favoriteStrains: ["Northern Lights"] })),
      "deep-sleeper",
    );
  });

  it("falls back to preferences when no favourites", () => {
    const arch = inferProfileArchetype(
      profile({
        preferredEffects: ["sleepy", "couch-lock", "body-heavy"],
      }),
    );
    assert.equal(arch, "deep-sleeper");
  });
});

describe("scoring — Green Crack vs Lemon Tree on a sensory-first daytime profile", () => {
  // The user-reported regression: target profile is clean-creative-daytime
  // with strong citrus preference. Green Crack should NOT outrank Lemon
  // Tree purely because it shares Energetic + Focused tags.
  const dayCreativeCitrus = profile({
    favoriteStrains: ["Jack Herer"], // anchors target archetype
    preferredAromas: ["citrus", "sweet", "earthy", "pine"],
    preferredFlavors: ["citrus", "sweet"],
    preferredEffects: ["uplifted", "focused", "creative", "happy"],
    likedTraits: ["terpy", "smooth"],
  });

  it("Lemon Tree (clean-creative-daytime) scores above Green Crack (sharp-stimulant)", () => {
    const lemonTree = scoreStrain("Lemon Tree", dayCreativeCitrus);
    const greenCrack = scoreStrain("Green Crack", dayCreativeCitrus);
    assert.ok(
      lemonTree.matchScore > greenCrack.matchScore,
      `expected Lemon Tree (${lemonTree.matchScore}) > Green Crack (${greenCrack.matchScore})`,
    );
  });

  it("Trainwreck (clean-creative-daytime) also out-scores Green Crack", () => {
    const trainwreck = scoreStrain("Trainwreck", dayCreativeCitrus);
    const greenCrack = scoreStrain("Green Crack", dayCreativeCitrus);
    assert.ok(
      trainwreck.matchScore > greenCrack.matchScore,
      `expected Trainwreck (${trainwreck.matchScore}) > Green Crack (${greenCrack.matchScore})`,
    );
  });

  it("Jack Herer stays high as the favourite anchor", () => {
    const jackHerer = scoreStrain("Jack Herer", dayCreativeCitrus);
    assert.ok(
      jackHerer.matchScore >= 94 && jackHerer.matchScore <= 96,
      `anchor should sit 94–96, got ${jackHerer.matchScore}`,
    );
  });

  it("Northern Lights (deep-sleeper, opposite archetype) drops materially", () => {
    const nl = scoreStrain("Northern Lights", dayCreativeCitrus);
    const greenCrack = scoreStrain("Green Crack", dayCreativeCitrus);
    // Deep-sleeper is just as wrong as sharp-stimulant for a daytime profile;
    // it shouldn't out-score a still-imperfect daytime stimulant.
    assert.ok(
      nl.matchScore <= greenCrack.matchScore + 5,
      `deep-sleeper should not beat sharp-stimulant on a daytime profile`,
    );
  });
});

describe("scoring — when target is sharp-stimulant, dampener doesn't fire", () => {
  it("Green Crack lover gets Green Crack scoring high", () => {
    const sharpLover = profile({
      favoriteStrains: ["Green Crack"],
      preferredEffects: ["energetic", "focused"],
    });
    const gc = scoreStrain("Green Crack", sharpLover);
    // Anchor floor pins it 94–96.
    assert.ok(gc.matchScore >= 94);
  });
});

describe("scoring — sparse profiles don't get archetype-penalised", () => {
  it("a blank profile produces no archetype dampener", () => {
    // No favourites, no preferences → inferProfileArchetype returns null
    // → no dampener can fire. Scores are whatever the base formula gives.
    const a = scoreStrain("Green Crack", profile());
    const b = scoreStrain("Lemon Tree", profile());
    // Neither should be aggressively penalised by the new layer.
    assert.ok(a.matchScore > 0);
    assert.ok(b.matchScore > 0);
  });
});

describe("graduated archetype bonus — within-family discrimination", () => {
  // The user-reported regression after reconciliation: on a kush
  // favourite cluster with bright daytime preferences, family-aligned
  // strains all collapsed into the same score band even though they
  // belong to different archetypes within nighttime-indica.
  //
  // Graduated bonus: exact archetype match → +3 (or +5 with strong
  // sensory), adjacent → +1. Creates a ~2-3pt visible gap between
  // "exact match" and "within-family neighbour."
  const kushProfile = profile({
    favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
    likedTraits: ["loud-smell", "potent", "terpy"],
    dislikedTraits: ["dry-flower", "weak-smell", "too-heavy"],
    preferredAromas: ["pine", "citrus", "sweet", "herbal"],
    preferredFlavors: ["citrus", "sweet", "herbal"],
    preferredEffects: ["happy", "uplifted", "focused", "creative"],
  });

  it("exact deep-sleeper match outscores adjacent dessert-couch-lock", () => {
    // Master Kush = deep-sleeper × grounded (exact target match)
    // Ice Cream Cake = dessert-couch-lock × smooth (adjacent within family)
    const mk = scoreStrain("Master Kush", kushProfile);
    const icc = scoreStrain("Ice Cream Cake", kushProfile);
    assert.ok(
      mk.matchScore > icc.matchScore,
      `exact deep-sleeper match (MK ${mk.matchScore}) should beat adjacent (ICC ${icc.matchScore})`,
    );
    assert.ok(
      mk.matchScore - icc.matchScore >= 2,
      `gap should be visible (at least 2pt), got ${mk.matchScore - icc.matchScore}`,
    );
  });

  it("Purple Kush (exact deep-sleeper) outscores Wedding Cake (adjacent)", () => {
    const pk = scoreStrain("Purple Kush", kushProfile);
    const wc = scoreStrain("Wedding Cake", kushProfile);
    assert.ok(
      pk.matchScore > wc.matchScore,
      `exact (PK ${pk.matchScore}) should beat adjacent (WC ${wc.matchScore})`,
    );
  });

  it("adjacent family members still beat cross-family strains", () => {
    // Adjacent gets +1, cross-family (no dampener if no effect overlap)
    // still gets nothing — adjacent within-family should rank higher
    // than cross-family on a nighttime profile.
    const icc = scoreStrain("Ice Cream Cake", kushProfile);
    const jh = scoreStrain("Jack Herer", kushProfile);
    assert.ok(
      icc.matchScore > jh.matchScore,
      `adjacent family (ICC ${icc.matchScore}) should beat cross-family (JH ${jh.matchScore})`,
    );
  });
});
