// Weighted-recipe wiring (BLEND_MODEL=target): the dial→share mapping and
// analyzeMerged's shares path. The scorer's own behaviour is covered in
// blend-target.test.ts — here we assert the plumbing: shares sum to 1 and
// respect the dials' documented meaning, the merged result equals the
// blend-target score, vetoes still sink, and NO shares → semantics unchanged.

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { analyzeMerged, leanToShares } from "../src/lib/merge-worlds";
import { scoreBlendTarget } from "../src/lib/blend-target";
import { toEngineInput, type StoredTasteProfile } from "../src/lib/engine-input";

type P = StoredTasteProfile & Record<string, unknown> & { id: string };
function profile(over: Partial<P> & { id: string }): P {
  return {
    name: over.id,
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    dislikedEffects: [],
    dislikedAromas: [],
    texturePreferences: [],
    qualityPriorities: [],
    preferredFamilies: [],
    avoidedFamilies: [],
    lookingFor: "new",
    ...over,
  };
}

const GAS = profile({
  id: "gas",
  preferredAromas: ["gassy", "diesel"],
  preferredFlavors: ["gassy"],
  preferredEffects: ["relaxed", "body-heavy"],
  primaryAroma: "gas",
});
const SWEET = profile({
  id: "sweet",
  preferredAromas: ["sweet", "creamy"],
  preferredFlavors: ["sweet", "vanilla"],
  preferredEffects: ["euphoric", "happy"],
  primaryAroma: "sweet",
});

const MENU = ["GG4", "Wedding Cake", "Sour Diesel", "Zkittlez", "Blue Dream"];

const sum = (r: Record<string, number>) =>
  Object.values(r).reduce((a, b) => a + b, 0);

describe("leanToShares — dial → share mapping", () => {
  const pair = [{ id: "a" }, { id: "b" }];

  it("even pair at lean1=0; full tilt hands the pair mass to one side", () => {
    assert.deepEqual(leanToShares(pair, "a", 0), { a: 0.5, b: 0.5 });
    assert.deepEqual(leanToShares(pair, "a", 1), { a: 1, b: 0 });
    assert.deepEqual(leanToShares(pair, "a", -1), { a: 0, b: 1 });
  });

  it("third at lean2=1 is a full equal world (⅓ each with a balanced pair)", () => {
    const s = leanToShares(pair, "a", 0, { id: "c" }, 1);
    assert.ok(Math.abs(s.a - 1 / 3) < 1e-9);
    assert.ok(Math.abs(s.b - 1 / 3) < 1e-9);
    assert.ok(Math.abs(s.c - 1 / 3) < 1e-9);
  });

  it("third at lean2=0 vanishes from the recipe", () => {
    const s = leanToShares(pair, "a", 0, { id: "c" }, 0);
    assert.equal(s.c, 0);
    assert.deepEqual([s.a, s.b], [0.5, 0.5]);
  });

  it("shares always sum to 1", () => {
    for (const [lean1, lean2] of [[0, 0.4], [0.7, 1], [-0.3, 0.2], [1, 0]] as const) {
      assert.ok(Math.abs(sum(leanToShares(pair, "a", lean1, { id: "c" }, lean2)) - 1) < 1e-9);
      assert.ok(Math.abs(sum(leanToShares(pair, "a", lean1)) - 1) < 1e-9);
    }
  });
});

describe("analyzeMerged — weighted-recipe mode (shares present)", () => {
  const shares = { gas: 0.8, sweet: 0.2 };
  const run = (withShares: boolean, profiles: P[] = [GAS, SWEET]) =>
    analyzeMerged({
      strains: MENU,
      profiles: profiles as never,
      penalties: {},
      feedback: [],
      shares: withShares ? shares : undefined,
    });

  it("matchScore of non-vetoed strains equals the blend-target score", () => {
    const r = run(true);
    const members = [
      { profile: toEngineInput(GAS), share: 0.8 },
      { profile: toEngineInput(SWEET), share: 0.2 },
    ];
    for (const rec of r.recommendations) {
      const expected = Math.max(4, Math.min(99, Math.round(scoreBlendTarget(rec.strainName, members))));
      assert.equal(rec.matchScore, expected, rec.strainName);
    }
  });

  it("without shares the best-of semantics are untouched", () => {
    const r = run(false);
    for (const rec of r.recommendations) {
      const worlds = r.mergeBreakdown[rec.strainName].map((w) => w.score);
      assert.equal(rec.matchScore, Math.max(...worlds), rec.strainName);
    }
  });

  it("a vetoed strain still sinks to its lowest world and names the vetoer", () => {
    const sweetVeto = { ...SWEET, dislikedStrains: ["GG4"] };
    const r = run(true, [GAS, sweetVeto]);
    const gg4 = r.recommendations.find((x) => x.strainName === "GG4");
    assert.ok(gg4);
    const worlds = r.mergeBreakdown["GG4"].map((w) => w.score);
    assert.ok(gg4.matchScore <= Math.min(...worlds), "veto must sink, not score the recipe");
    assert.deepEqual(gg4.avoidedBy, ["sweet"]);
  });
});
