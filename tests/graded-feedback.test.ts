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
    preferredEffects: ["relaxed"],
    texturePreferences: [],
    qualityPriorities: [],
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
    ...overrides,
  };
}

// The verdict's graded strength must modulate the nudge: a soft "good" can't
// move a score as hard as a "loved", and an "avoid" pushes the other way.
describe("graded feedback weight", () => {
  function adjFor(strength: number, liked: boolean): number {
    return scoreStrain("Blue Dream", profile(), [
      { strainName: "Blue Dream", liked, rating: null, strength },
    ]).feedbackAdjustment;
  }

  it("a loved (+1) nudges harder than a good (+0.5)", () => {
    const loved = adjFor(1, true);
    const good = adjFor(0.5, true);
    assert.ok(loved > 0, `loved should be positive, got ${loved}`);
    assert.ok(good > 0, `good should be positive, got ${good}`);
    assert.ok(loved > good, `loved ${loved} should exceed good ${good}`);
  });

  it("an avoid (-1) pushes the score down", () => {
    assert.ok(adjFor(-1, false) < 0);
  });

  it("no feedback leaves the score untouched", () => {
    const none = scoreStrain("Blue Dream", profile(), []).feedbackAdjustment;
    assert.equal(none, 0);
  });
});

// Diminishing-returns taper (#23): the same feedback should boost a
// high-base pick LESS than a low-base one — so confirmed likes fill the gaps
// the profile missed instead of inflating the strains it already rates high.
describe("feedback taper by base score", () => {
  const gasProfile = profile({
    favoriteStrains: ["GG4", "Skunk #1", "Gary Payton", "White Hot Guava"],
    preferredEffects: [],
    dislikedEffects: ["sleepy", "couch-lock", "head-high"],
    preferredAromas: ["gassy", "diesel", "skunky", "pine", "earthy"],
    preferredFlavors: ["gassy", "diesel", "earthy"],
  });
  const fb = [
    { strainName: "Stardawg", liked: true, rating: 5, strength: 1 },
  ];

  it("a high-base pick gets a smaller boost than a low-base one", () => {
    const high = scoreStrain("Animal Face", gasProfile, fb); // bases high
    const low = scoreStrain("Headband", gasProfile, fb); // bases lower
    assert.ok(
      high.matchScore > low.matchScore,
      `expected Animal Face to base above Headband, got ${high.matchScore} vs ${low.matchScore}`,
    );
    assert.ok(high.feedbackAdjustment >= 0 && low.feedbackAdjustment >= 0);
    assert.ok(
      high.feedbackAdjustment < low.feedbackAdjustment,
      `taper: high-base adj ${high.feedbackAdjustment} should be < low-base adj ${low.feedbackAdjustment}`,
    );
  });
});
