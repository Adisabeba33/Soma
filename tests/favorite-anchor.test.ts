import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import type { TasteProfileInput } from "../src/lib/types";

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

describe("favorite anchor behaviour", () => {
  it("scores a favourite at ≥95 even with an otherwise sparse profile", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.ok(
      result.matchScore >= 95,
      `expected ≥95, got ${result.matchScore}`,
    );
    assert.equal(result.category, "Best Match");
    assert.equal(result.confidence, "high");
  });

  it("recognises a favourite by its alias", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["SLH"] }),
    );
    assert.ok(result.matchScore >= 95);
    assert.equal(result.category, "Best Match");
  });

  it("recognises the same strain typed via alias against canonical favourite", () => {
    const result = scoreStrain("SLH", profile({ favoriteStrains: ["Super Lemon Haze"] }));
    assert.ok(result.matchScore >= 95);
  });

  it("explanation discloses the favourite anchor", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.match(result.explanation, /saved favourite/i);
    assert.match(result.explanation, /sensory anchor/i);
    assert.match(result.whyItFits, /saved favourite|sensory anchor/i);
  });

  it("does not anchor a non-favourite, even if sensorily similar", () => {
    const result = scoreStrain(
      "Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.ok(
      result.matchScore < 95,
      `expected non-favourite under anchor floor, got ${result.matchScore}`,
    );
    assert.doesNotMatch(result.explanation, /saved favourite/i);
  });

  it("disliked list wins when a strain is in both lists", () => {
    const result = scoreStrain(
      "GG4",
      profile({
        favoriteStrains: ["GG4"],
        dislikedStrains: ["GG4"],
      }),
    );
    assert.ok(
      result.matchScore <= 18,
      `expected disliked cap, got ${result.matchScore}`,
    );
    assert.notEqual(result.category, "Best Match");
  });

  it("disliked detection also resolves aliases", () => {
    const result = scoreStrain(
      "Gorilla Glue #4",
      profile({ dislikedStrains: ["GG4"] }),
    );
    assert.ok(result.matchScore <= 18);
  });

  it("favourite anchor is immune to noisy feedback adjustment", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
      // Three confirmed dislikes on a sensorily-similar strain would normally
      // pull a non-anchor down by a few points; the anchor must ignore that.
      [
        { strainName: "Super Lemon Haze", liked: false, rating: 1 },
        { strainName: "Super Lemon Haze", liked: false, rating: 2 },
        { strainName: "Super Lemon Haze", liked: false, rating: 1 },
      ],
    );
    assert.ok(result.matchScore >= 95);
    assert.equal(result.feedbackAdjustment, 0);
    assert.equal(result.feedbackNote, null);
  });
});
