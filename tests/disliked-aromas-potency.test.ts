import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import type { TasteProfileInput } from "../src/lib/types";

// PR B — disliked aromas (ISSUE-2) and potency preference (ISSUE-6).
// Both are no-ops when absent, so existing calibration is untouched.

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

describe("disliked aromas (ISSUE-2)", () => {
  it("a disliked aroma the strain carries lowers the score", () => {
    // GG4 carries diesel.
    const base = scoreStrain("GG4", profile()).unclampedScore;
    const withDislike = scoreStrain(
      "GG4",
      profile({ dislikedAromas: ["diesel"] }),
    ).unclampedScore;
    assert.ok(
      withDislike < base,
      `expected a penalty, got ${base} → ${withDislike}`,
    );
  });

  it("surfaces the dislike as a conflict", () => {
    const r = scoreStrain("GG4", profile({ dislikedAromas: ["diesel"] }));
    assert.ok(r.conflicts.some((c) => c.includes("diesel")));
  });

  it("reconciles a disliked aroma a favourite itself carries", () => {
    // Disliking diesel while a favourite (Chemdawg) is diesel-forward is a
    // self-contradiction — the lived favourite wins, so no diesel penalty.
    const r = scoreStrain(
      "Sour Diesel",
      profile({ dislikedAromas: ["diesel"], favoriteStrains: ["Chemdawg"] }),
    );
    assert.ok(!r.conflicts.some((c) => c.includes("diesel")));
  });

  it("is a no-op when empty (no diesel conflict)", () => {
    const r = scoreStrain("GG4", profile());
    assert.ok(!r.conflicts.some((c) => c.includes("want to avoid")));
  });
});

describe("potency preference (ISSUE-6)", () => {
  it("penalises a very-strong strain for a mild preference", () => {
    const base = scoreStrain("GG4", profile()).unclampedScore; // GG4 = very-strong
    const mild = scoreStrain("GG4", profile({ potencyPreference: "mild" })).unclampedScore;
    assert.ok(mild < base, `expected mild penalty, got ${base} → ${mild}`);
  });

  it("rewards a very-strong strain for a strong preference", () => {
    const base = scoreStrain("GG4", profile()).unclampedScore;
    const strong = scoreStrain("GG4", profile({ potencyPreference: "strong" })).unclampedScore;
    assert.ok(strong > base, `expected strong reward, got ${base} → ${strong}`);
  });

  it("'balanced' and unknown values are no-ops", () => {
    const base = scoreStrain("GG4", profile()).unclampedScore;
    assert.equal(scoreStrain("GG4", profile({ potencyPreference: "balanced" })).unclampedScore, base);
    assert.equal(scoreStrain("GG4", profile({ potencyPreference: "whatever" })).unclampedScore, base);
  });
});
