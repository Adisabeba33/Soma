import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { familyMatches, isFamilyKey } from "../src/lib/strain-families";
import { findStrain } from "../src/lib/strain-data";
import { scoreStrain } from "../src/lib/taste-engine";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

const strain = (n: string): StrainProfile => {
  const s = findStrain(n);
  if (!s) throw new Error(`missing ${n}`);
  return s;
};

function profile(overrides: Partial<TasteProfileInput> = {}): TasteProfileInput {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: ["gassy", "earthy"],
    preferredFlavors: [],
    preferredEffects: ["relaxed"],
    texturePreferences: [],
    qualityPriorities: [],
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
    ...overrides,
  };
}

describe("named-family matcher (#14)", () => {
  it("matches the Mint family by token across different sensory families", () => {
    // These mint strains live in funky-exotic / gelato-exotic / dessert-cookies
    // but all carry the `mint` token.
    for (const n of ["The Menthol", "Sunset Mintz", "Animal Mints", "Kush Mints"]) {
      assert.ok(familyMatches(strain(n), "mint"), `${n} should match mint`);
    }
    assert.ok(!familyMatches(strain("GG4"), "mint"));
  });

  it("matches OG by sensoryFamily and name", () => {
    assert.ok(familyMatches(strain("Triangle Kush"), "og"));
    assert.ok(familyMatches(strain("OG Kush"), "og"));
  });

  it("validates family keys", () => {
    assert.ok(isFamilyKey("mint"));
    assert.ok(!isFamilyKey("not-a-family"));
  });
});

describe("family preference modifier (#14)", () => {
  it("an avoided family lowers the score", () => {
    const base = scoreStrain("The Menthol", profile()).unclampedScore;
    const avoided = scoreStrain(
      "The Menthol",
      profile({ avoidedFamilies: ["mint"] }),
    ).unclampedScore;
    assert.ok(avoided < base, `expected drop, got ${base} → ${avoided}`);
  });

  it("a sought-out family raises the score", () => {
    const base = scoreStrain("Triangle Kush", profile()).unclampedScore;
    const sought = scoreStrain(
      "Triangle Kush",
      profile({ preferredFamilies: ["og"] }),
    ).unclampedScore;
    assert.ok(sought > base, `expected rise, got ${base} → ${sought}`);
  });

  it("is a no-op when both lists are empty", () => {
    const a = scoreStrain("The Menthol", profile()).unclampedScore;
    const b = scoreStrain(
      "The Menthol",
      profile({ preferredFamilies: [], avoidedFamilies: [] }),
    ).unclampedScore;
    assert.equal(a, b);
  });
});
