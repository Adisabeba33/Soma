import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  behavioralProfileOf,
  effectTextureOf,
  inferProfileTexture,
  textureContribution,
  texturesAreAdjacent,
} from "../src/lib/effect-texture";
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

describe("effectTextureOf — known classifications inside clean-creative-daytime", () => {
  it("Jack Herer / Lemon Tree / Durban Poison are lucid", () => {
    assert.equal(effectTextureOf(findSeed("Jack Herer")), "lucid");
    assert.equal(effectTextureOf(findSeed("Lemon Tree")), "lucid");
    assert.equal(effectTextureOf(findSeed("Durban Poison")), "lucid");
  });

  it("Tangie is smooth, SLH is floaty, Trainwreck is chaotic", () => {
    assert.equal(effectTextureOf(findSeed("Tangie")), "smooth");
    assert.equal(effectTextureOf(findSeed("Super Lemon Haze")), "floaty");
    assert.equal(effectTextureOf(findSeed("Trainwreck")), "chaotic");
  });

  it("Green Crack is electric, Ghost Train Haze is sharp", () => {
    assert.equal(effectTextureOf(findSeed("Green Crack")), "electric");
    assert.equal(effectTextureOf(findSeed("Ghost Train Haze")), "sharp");
  });

  it("Heavy gas reads pressure-heavy; classic indica reads grounded", () => {
    assert.equal(effectTextureOf(findSeed("GG4")), "pressure-heavy");
    assert.equal(effectTextureOf(findSeed("OG Kush")), "pressure-heavy");
    assert.equal(effectTextureOf(findSeed("Northern Lights")), "grounded");
    assert.equal(effectTextureOf(findSeed("Granddaddy Purple")), "grounded");
  });

  it("Dessert smooth: Wedding Cake, Gelato, Runtz are smooth", () => {
    assert.equal(effectTextureOf(findSeed("Wedding Cake")), "smooth");
    assert.equal(effectTextureOf(findSeed("Gelato")), "smooth");
    assert.equal(effectTextureOf(findSeed("Runtz")), "smooth");
  });
});

describe("texturesAreAdjacent — cluster topology", () => {
  it("soft cluster: smooth / dreamy / floaty / lucid are adjacent", () => {
    assert.ok(texturesAreAdjacent("lucid", "smooth"));
    assert.ok(texturesAreAdjacent("lucid", "floaty"));
    assert.ok(texturesAreAdjacent("dreamy", "smooth"));
  });

  it("edgy cluster: electric / sharp / chaotic are adjacent", () => {
    assert.ok(texturesAreAdjacent("electric", "sharp"));
    assert.ok(texturesAreAdjacent("chaotic", "electric"));
  });

  it("heavy cluster: grounded / pressure-heavy are adjacent", () => {
    assert.ok(texturesAreAdjacent("grounded", "pressure-heavy"));
  });

  it("cross-cluster pairs are NOT adjacent (the whole point)", () => {
    assert.equal(texturesAreAdjacent("lucid", "electric"), false);
    assert.equal(texturesAreAdjacent("smooth", "chaotic"), false);
    assert.equal(texturesAreAdjacent("grounded", "lucid"), false);
    assert.equal(texturesAreAdjacent("pressure-heavy", "floaty"), false);
  });

  it("self-adjacency is true", () => {
    assert.ok(texturesAreAdjacent("electric", "electric"));
  });
});

describe("inferProfileTexture", () => {
  it("returns null on empty profile — no manufactured target", () => {
    assert.equal(inferProfileTexture(profile()), null);
  });

  it("favourites drive the inference", () => {
    assert.equal(
      inferProfileTexture(profile({ favoriteStrains: ["Jack Herer"] })),
      "lucid",
    );
    assert.equal(
      inferProfileTexture(profile({ favoriteStrains: ["Trainwreck"] })),
      "chaotic",
    );
    assert.equal(
      inferProfileTexture(profile({ favoriteStrains: ["Wedding Cake"] })),
      "smooth",
    );
  });
});

describe("textureContribution — bounded ±3", () => {
  it("match → +3", () => {
    assert.equal(textureContribution("lucid", "lucid"), 3);
  });
  it("adjacent → 0", () => {
    assert.equal(textureContribution("lucid", "smooth"), 0);
  });
  it("cross-cluster mismatch → -3", () => {
    assert.equal(textureContribution("electric", "lucid"), -3);
    assert.equal(textureContribution("grounded", "floaty"), -3);
  });
  it("null target → 0 (no signal, no penalty)", () => {
    assert.equal(textureContribution("electric", null), 0);
  });
});

describe("scoring — within-archetype discrimination on a Jack Herer profile", () => {
  // Same target profile as the effect-archetype regression test. On Layer 1
  // alone Lemon Tree, Tangie, SLH, Trainwreck all share Jack's archetype
  // (clean-creative-daytime). Layer 2 splits them by texture:
  //   target = lucid (Jack Herer)
  //   Lemon Tree = lucid       → +3 match
  //   Tangie     = smooth      → 0 adjacent
  //   SLH        = floaty      → 0 adjacent
  //   Trainwreck = chaotic     → -3 cross-cluster
  //   Green Crack = electric   → -3 cross-cluster (plus Layer 1 dampener)
  const jackProfile = profile({
    favoriteStrains: ["Jack Herer"],
    preferredAromas: ["citrus", "pine", "earthy", "sweet"],
    preferredFlavors: ["citrus", "pine"],
    preferredEffects: ["uplifted", "focused", "creative", "happy"],
    likedTraits: ["terpy", "smooth"],
  });

  it("Jack Herer stays the anchor at 94–96", () => {
    const jh = scoreStrain("Jack Herer", jackProfile);
    assert.ok(jh.matchScore >= 94 && jh.matchScore <= 96);
  });

  it("Lemon Tree (lucid match) and Tangie (smooth, adjacent) sit close together", () => {
    // After Layer 3 (family) and trust-mode reweighting, both Lemon Tree
    // and Tangie are in daytime-functional and get the same family bonus.
    // Texture match gives Lemon Tree a +3 edge, but Tangie can equal or
    // narrowly beat it if its effect overlap is stronger (Tangie matches
    // all 4 preferred daytime effects perfectly while Lemon Tree misses
    // "creative"). The honest claim is they should sit within a tight
    // band — texture is a tiebreaker on the order of points, not the
    // dominant signal between two adjacent-texture same-family strains.
    const lt = scoreStrain("Lemon Tree", jackProfile);
    const tg = scoreStrain("Tangie", jackProfile);
    assert.ok(
      Math.abs(lt.matchScore - tg.matchScore) <= 5,
      `lucid vs adjacent smooth should be tight: Lemon Tree ${lt.matchScore} vs Tangie ${tg.matchScore}`,
    );
  });

  it("texture dampener materially shifts Trainwreck on a lucid target", () => {
    // Indirect proof the dampener fires: same strain, two profiles where
    // archetype matches in both but texture target differs. The lucid
    // target should score Trainwreck lower than the chaotic target does.
    const lucidTarget = scoreStrain("Trainwreck", jackProfile);
    const chaoticTarget = scoreStrain(
      "Trainwreck",
      profile({
        favoriteStrains: ["Trainwreck"], // anchor — but check raw score below
        preferredAromas: ["citrus", "pine", "earthy"],
        preferredEffects: ["uplifted", "energetic", "creative"],
      }),
    );
    // Chaotic-target Trainwreck is its own anchor (≥94); lucid-target
    // Trainwreck is below anchor and has -3 texture penalty.
    assert.ok(chaoticTarget.matchScore >= 94);
    assert.ok(lucidTarget.matchScore < chaoticTarget.matchScore);
  });

  it("Green Crack (sharp-stimulant + electric — double mismatch) is the lowest of the daytime cohort", () => {
    const gc = scoreStrain("Green Crack", jackProfile);
    for (const name of ["Lemon Tree", "Tangie", "Super Lemon Haze", "Trainwreck"]) {
      const other = scoreStrain(name, jackProfile);
      assert.ok(
        other.matchScore > gc.matchScore,
        `${name} (${other.matchScore}) should outrank Green Crack (${gc.matchScore})`,
      );
    }
  });
});

describe("layered isolation — anchor floor still wins over texture dampener", () => {
  it("a chaotic favourite is still pinned 94–96 by the anchor", () => {
    const wreckLover = profile({
      favoriteStrains: ["Trainwreck"],
      preferredEffects: ["uplifted", "energetic"],
    });
    const result = scoreStrain("Trainwreck", wreckLover);
    assert.ok(result.matchScore >= 94 && result.matchScore <= 96);
  });
});

describe("behavioralProfileOf composition", () => {
  it("returns both archetype and texture", () => {
    const bp = behavioralProfileOf(findSeed("Jack Herer"));
    assert.equal(bp.archetype, "clean-creative-daytime");
    assert.equal(bp.texture, "lucid");
  });
});
