import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  lineageAffinity,
  LINEAGE_AFFINITY_MAX,
} from "../src/lib/lineage-affinity";
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

describe("lineageAffinity (#13)", () => {
  it("gives the full bonus to a direct child of a favourite", () => {
    // Larry OG = OG Kush × SFV OG.
    assert.equal(lineageAffinity("Larry OG", ["OG Kush"]), LINEAGE_AFFINITY_MAX);
  });

  it("is a no-op (0) when the candidate has no recorded lineage", () => {
    // Durban Poison is a landrace — no recorded parents (and never will have).
    assert.equal(lineageAffinity("Durban Poison", ["OG Kush"]), 0);
  });

  it("ignores the strain against itself", () => {
    assert.equal(lineageAffinity("Larry OG", ["Larry OG"]), 0);
  });

  it("never exceeds the cap and is never negative", () => {
    for (const [cand, favs] of [
      ["Larry OG", ["OG Kush", "GG4"]],
      ["Stardawg", ["Chemdawg"]],
      ["Pink Kush", ["OG Kush"]],
    ] as const) {
      const a = lineageAffinity(cand, [...favs]);
      assert.ok(a >= 0 && a <= LINEAGE_AFFINITY_MAX);
    }
  });

  it("the engine still produces a valid score (lineage module present, hook disabled)", () => {
    // The lineageMod hook is intentionally NOT wired into scoring right now
    // (see docs/deferred-improvements.md #13); the pure module + these tests
    // stay for when it's reworked. Smoke-check the engine runs regardless.
    const r = scoreStrain("Larry OG", profile({ favoriteStrains: ["OG Kush"] }));
    assert.ok(r.matchScore >= 4 && r.matchScore <= 99);
  });
});
