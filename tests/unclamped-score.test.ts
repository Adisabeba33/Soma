import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { analyze, scoreStrain } from "../src/lib/taste-engine";
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

const gasFan: TasteProfileInput = profile({
  favoriteStrains: ["GG4"],
  likedTraits: ["gassy", "earthy", "heavy-body", "potent"],
  preferredAromas: ["gassy", "earthy", "diesel", "pine"],
  preferredFlavors: ["gassy", "earthy", "pine"],
  preferredEffects: ["relaxed", "euphoric", "body-heavy", "calm", "happy"],
  primaryAroma: "gas",
  primaryEffect: "calm",
  useTime: "evening",
  bodyFeel: 70,
});

describe("StrainMatch — unclampedScore field", () => {
  it("is present on every scored strain", () => {
    const r = scoreStrain("OG Kush", gasFan);
    assert.equal(typeof r.unclampedScore, "number");
    assert.ok(Number.isFinite(r.unclampedScore));
  });

  it("carries decimal precision (not pre-rounded)", () => {
    // The expert review case: Face Off OG, Permanent Marker, King Louis
    // all land at matchScore=88 after the ceiling, but unclampedScore
    // shows decimals so they're genuinely differentiable.
    const fa = scoreStrain("Face Off OG", gasFan);
    const pm = scoreStrain("Permanent Marker", gasFan);
    const kl = scoreStrain("King Louis XIII", gasFan);
    const isDecimal = (n: number) => n !== Math.round(n);
    assert.ok(
      isDecimal(fa.unclampedScore) ||
        isDecimal(pm.unclampedScore) ||
        isDecimal(kl.unclampedScore),
      `At least one of the three should carry a decimal value, got ${fa.unclampedScore}, ${pm.unclampedScore}, ${kl.unclampedScore}`,
    );
  });

  it("exceeds matchScore when the candidate hits the 88 ceiling", () => {
    // For a strong non-anchor match, the matchScore is capped at 88 but
    // unclampedScore should be > 88 to reflect the actual computed value.
    const fa = scoreStrain("Face Off OG", gasFan);
    if (fa.matchScore === 88) {
      assert.ok(
        fa.unclampedScore > 88,
        `Face Off OG hit the 88 ceiling, unclampedScore should be > 88, got ${fa.unclampedScore}`,
      );
    }
  });
});

describe("analyze — sort tie-breaker on unclampedScore", () => {
  it("orders ceiling-tied strains by their internal raw score", () => {
    // The reviewer's case: three strains all hit matchScore=88, but the
    // engine actually thinks Permanent Marker > Face Off OG > King Louis.
    // Without the tie-breaker, the order would depend on input order.
    const result = analyze(
      ["Face Off OG", "King Louis XIII", "Permanent Marker"],
      gasFan,
    );
    const names = result.recommendations.map((r) => r.strainName);
    // All three should be at 88 (verify the test setup is still valid).
    assert.deepEqual(
      result.recommendations.map((r) => r.matchScore),
      [88, 88, 88],
      `expected all three tied at 88, got ${result.recommendations.map((r) => r.matchScore).join(", ")}`,
    );
    // Permanent Marker should lead because its archetype bonus (+5
    // exact match to garlic-funk) puts its raw score highest. King
    // Louis XIII should trail.
    assert.equal(
      names[0],
      "Permanent Marker",
      `Permanent Marker should lead by tie-break, got ${names[0]}`,
    );
    assert.equal(
      names[2],
      "King Louis XIII",
      `King Louis XIII should trail (lowest raw), got ${names[2]}`,
    );
  });

  it("tie-break is stable: reversing input order gives same final order", () => {
    const a = analyze(
      ["Face Off OG", "King Louis XIII", "Permanent Marker"],
      gasFan,
    );
    const b = analyze(
      ["Permanent Marker", "King Louis XIII", "Face Off OG"],
      gasFan,
    );
    assert.deepEqual(
      a.recommendations.map((r) => r.strainName),
      b.recommendations.map((r) => r.strainName),
      "Tie-break must be deterministic regardless of input order",
    );
  });

  it("does not re-order strains with different matchScore", () => {
    // Sanity: tie-break should only kick in when matchScore is equal.
    // OG Kush (gas-og) > Northern Lights (kush-classic) for a gas fan;
    // unclampedScore can't drag NL above OG Kush.
    const r = analyze(["Northern Lights", "OG Kush"], gasFan);
    assert.equal(r.recommendations[0].strainName, "OG Kush");
  });
});
