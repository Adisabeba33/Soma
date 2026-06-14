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

  it("a band candidate (>88) was mapped from a raw score over 88", () => {
    // A strong non-anchor match maps into the 89–92 elite band; the raw
    // unclamped score it was mapped from must sit above the 88 entry point.
    const fa = scoreStrain("Face Off OG", gasFan);
    if (fa.matchScore > 88) {
      assert.ok(
        fa.unclampedScore > 88,
        `Face Off OG is in the band (${fa.matchScore}), unclampedScore should be > 88, got ${fa.unclampedScore}`,
      );
    }
  });
});

describe("analyze — sort tie-breaker on unclampedScore", () => {
  it("orders band-tied strains by their internal raw score (descending)", () => {
    // The reviewer's case: multiple strains map to the same visible band
    // value (here they all top out at the 92 ceiling), but the engine
    // differentiates them internally. The sort guarantee is "by
    // unclampedScore desc within the tie" — the engine's actual judgment
    // isn't lost to insertion order. WHICH strain wins depends on current
    // identity / curation state, so we don't hard-code the winner.
    const result = analyze(
      ["Face Off OG", "King Louis XIII", "Permanent Marker"],
      gasFan,
    );
    // All three share one band value (verify the tie setup is still valid).
    const scores = result.recommendations.map((r) => r.matchScore);
    assert.ok(
      scores.every((s) => s === scores[0] && s > 88 && s <= 92),
      `expected all three tied inside the 89–92 band, got ${scores.join(", ")}`,
    );
    // Unclamped scores must be monotonically decreasing — that's the
    // invariant the tie-breaker enforces.
    const raws = result.recommendations.map((r) => r.unclampedScore);
    for (let i = 1; i < raws.length; i++) {
      assert.ok(
        raws[i - 1] >= raws[i],
        `unclampedScore order violated at index ${i}: ${raws[i - 1]} should be ≥ ${raws[i]} (full sequence: ${raws.join(", ")})`,
      );
    }
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
