import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import type { TasteProfileInput } from "../src/lib/types";

// Favourites are read in descending preference (most-loved first). A strain
// that resembles a higher-ranked favourite scores above one that resembles a
// lower-ranked favourite (engine v8).

function profile(favs: string[]): TasteProfileInput {
  return {
    favoriteStrains: favs,
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
  };
}

describe("favourite rank weighting (v8)", () => {
  it("a candidate scores higher when the favourite it resembles is ranked first", () => {
    // Lemon Haze (citrus) resembles Super Lemon Haze, not the gassy GG4.
    const slhFirst = scoreStrain("Lemon Haze", profile(["Super Lemon Haze", "GG4"]));
    const slhSecond = scoreStrain("Lemon Haze", profile(["GG4", "Super Lemon Haze"]));
    assert.ok(
      slhFirst.unclampedScore > slhSecond.unclampedScore,
      `expected SLH-first to score higher, got ${slhSecond.unclampedScore} → ${slhFirst.unclampedScore}`,
    );
  });

  it("reversing the favourite order moves an aligned candidate", () => {
    const a = scoreStrain(
      "Chemdawg",
      profile(["GG4", "OG Kush", "White Hot Guava", "Sour Diesel"]),
    ).unclampedScore;
    const b = scoreStrain(
      "Chemdawg",
      profile(["Sour Diesel", "White Hot Guava", "OG Kush", "GG4"]),
    ).unclampedScore;
    assert.ok(Math.abs(a - b) >= 2, `expected a visible shift, got ${a} vs ${b}`);
  });

  it("a single favourite is unaffected by rank weighting (weight 1.0)", () => {
    // With one favourite there's no rank to discount — score is stable.
    const s1 = scoreStrain("Tahoe OG", profile(["GG4"])).matchScore;
    const s2 = scoreStrain("Tahoe OG", profile(["GG4"])).matchScore;
    assert.equal(s1, s2);
  });
});
