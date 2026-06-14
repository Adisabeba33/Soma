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

describe("favourite anchor behaviour", () => {
  it("scores a favourite in the 94–96 range, never 100", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.ok(
      result.matchScore >= 94 && result.matchScore <= 96,
      `expected 94–96, got ${result.matchScore}`,
    );
    assert.equal(result.category, "Best Match");
    assert.equal(result.confidence, "high");
  });

  it("uses canonical wording when both sides are canonical", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.match(result.explanation, /is one of your saved favourites/i);
    assert.doesNotMatch(result.explanation, /by alias/i);
    assert.match(result.explanation, /not 100%/i);
    assert.match(result.explanation, /grower, batch freshness/i);
  });

  it("uses alias wording when the favourite was listed by alias", () => {
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["SLH"] }),
    );
    assert.ok(result.matchScore >= 94 && result.matchScore <= 96);
    assert.match(result.explanation, /matches one of your saved favourites by alias/i);
    assert.match(result.explanation, /listed it as/i);
    assert.match(result.whyItFits, /by alias/i);
  });

  it("uses alias wording when the user types an alias on the menu", () => {
    const result = scoreStrain(
      "SLH",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.ok(result.matchScore >= 94 && result.matchScore <= 96);
    assert.match(result.explanation, /matches one of your saved favourites by alias/i);
  });

  it("does not anchor a non-favourite, even if sensorily similar", () => {
    const result = scoreStrain(
      "Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.ok(
      result.matchScore < 94,
      `expected non-favourite under anchor floor, got ${result.matchScore}`,
    );
    assert.doesNotMatch(result.explanation, /saved favourites/i);
  });

  it("uses 'closeness to your saved favourite' wording for nearby strains", () => {
    const result = scoreStrain(
      "Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    if (result.referenceSimilarity >= 72) {
      assert.match(
        result.whyItFits,
        /closeness to your saved favourite/i,
      );
    }
  });

  it("uses 'same sensory territory' wording for moderate kinship", () => {
    const result = scoreStrain(
      "Granddaddy Purple",
      profile({ favoriteStrains: ["Northern Lights"] }),
    );
    if (
      result.referenceSimilarity >= 60 &&
      result.referenceSimilarity < 72
    ) {
      assert.match(result.whyItFits, /same sensory territory/i);
    }
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
      [
        { strainName: "Super Lemon Haze", liked: false, rating: 1, strength: -1 },
        { strainName: "Super Lemon Haze", liked: false, rating: 2, strength: -0.5 },
        { strainName: "Super Lemon Haze", liked: false, rating: 1, strength: -1 },
      ],
    );
    assert.ok(result.matchScore >= 94 && result.matchScore <= 96);
    assert.equal(result.feedbackAdjustment, 0);
    assert.equal(result.feedbackNote, null);
  });
});
