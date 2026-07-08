// Weighted-blend target scorer invariants (blend-target.ts). Groups are
// derived from the LIVE catalog by tag tier — not hardcoded tag arrays — so
// curation can evolve without freezing these strains (see issue D3). What we
// pin is the model's behaviour: symmetry, the light-note lift, cloying
// sinking, and unknown strains not being buried by blind undershoot.

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreBlendTarget, type BlendMember } from "../src/lib/blend-target";
import { STRAINS } from "../src/lib/strain-data";
import type { TasteProfileInput } from "../src/lib/types";

function profile(over: Partial<TasteProfileInput>): TasteProfileInput {
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
    ...over,
  };
}

const GAS = profile({
  primaryAroma: "gas",
  preferredAromas: ["gassy", "diesel"],
  preferredFlavors: ["gassy"],
  preferredEffects: ["relaxed", "body-heavy"],
});
const SWEET = profile({
  primaryAroma: "sweet",
  preferredAromas: ["sweet", "creamy"],
  preferredFlavors: ["sweet", "vanilla"],
  preferredEffects: ["euphoric", "happy"],
});

const G80_S20: BlendMember[] = [
  { profile: GAS, share: 0.8 },
  { profile: SWEET, share: 0.2 },
];

// Tier of a token set in a strain, mirroring how the scorer measures
// prominence (primary=1, present=.66, trace=.33, absent=0).
const SWEET_TOKENS = new Set(["sweet", "creamy", "vanilla", "candy", "dessert", "fruity", "berry", "tropical", "grape"]);
const GAS_TOKENS = new Set(["gassy", "diesel"]);
function tier(s: (typeof STRAINS)[number], tokens: Set<string>): number {
  const prim = [...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])];
  const pres = [...s.aromas, ...s.flavors];
  const tr = [...(s.traceAromas ?? []), ...(s.traceFlavors ?? [])];
  if (prim.some((t) => tokens.has(t))) return 1;
  if (pres.some((t) => tokens.has(t))) return 0.66;
  if (tr.some((t) => tokens.has(t))) return 0.33;
  return 0;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

// Deterministic samples (catalog order) keep the suite fast while staying
// representative — each group is capped, not cherry-picked.
const CAP = 25;
const pureGas = STRAINS.filter((s) => tier(s, GAS_TOKENS) === 1 && tier(s, SWEET_TOKENS) === 0).slice(0, CAP);
const gasLightSweet = STRAINS.filter((s) => {
  const sw = tier(s, SWEET_TOKENS);
  return tier(s, GAS_TOKENS) === 1 && (sw === 0.33 || sw === 0.66);
}).slice(0, CAP);
const sweetDominant = STRAINS.filter((s) => tier(s, SWEET_TOKENS) === 1 && tier(s, GAS_TOKENS) < 1).slice(0, CAP);

describe("blend-target: recipe basics", () => {
  it("returns 0 for an empty recipe and a plain number otherwise", () => {
    assert.equal(scoreBlendTarget("GG4", []), 0);
    const sc = scoreBlendTarget("GG4", G80_S20);
    assert.ok(Number.isFinite(sc) && sc >= 0 && sc <= 100);
  });

  it("is deterministic", () => {
    assert.equal(scoreBlendTarget("GG4", G80_S20), scoreBlendTarget("GG4", G80_S20));
  });

  it("normalises shares — {0.8,0.2} and {8,2} are the same recipe", () => {
    const scaled: BlendMember[] = [
      { profile: GAS, share: 8 },
      { profile: SWEET, share: 2 },
    ];
    for (const s of [...pureGas.slice(0, 5), ...sweetDominant.slice(0, 5)]) {
      assert.ok(Math.abs(scoreBlendTarget(s.name, G80_S20) - scoreBlendTarget(s.name, scaled)) < 1e-9, s.name);
    }
  });
});

describe("blend-target: 50/50 symmetry (issue B2)", () => {
  it("equal shares are order-independent for every sampled strain", () => {
    const ab: BlendMember[] = [
      { profile: GAS, share: 0.5 },
      { profile: SWEET, share: 0.5 },
    ];
    const ba: BlendMember[] = [
      { profile: SWEET, share: 0.5 },
      { profile: GAS, share: 0.5 },
    ];
    const sample = [...pureGas.slice(0, 10), ...gasLightSweet.slice(0, 10), ...sweetDominant.slice(0, 10)];
    for (const s of sample) {
      assert.equal(scoreBlendTarget(s.name, ab), scoreBlendTarget(s.name, ba), s.name);
    }
  });
});

describe("blend-target: gas 80% + sweet 20% calibration", () => {
  const score = (s: { name: string }) => scoreBlendTarget(s.name, G80_S20);

  it("a light sweet note LIFTS a gas strain (group median) — the 20% dial does something", () => {
    const withNote = median(gasLightSweet.map(score));
    const without = median(pureGas.map(score));
    assert.ok(
      withNote > without,
      `light-sweet median ${withNote.toFixed(1)} should exceed pure-gas ${without.toFixed(1)}`,
    );
  });

  it("cloying (sweet-dominant) sinks far below plain gas", () => {
    const cloying = median(sweetDominant.map(score));
    const gas = median(pureGas.map(score));
    assert.ok(
      cloying < gas - 20,
      `sweet-dominant median ${cloying.toFixed(1)} should sit well below pure-gas ${gas.toFixed(1)}`,
    );
  });
});

describe("blend-target: unknown strains (issue B3)", () => {
  it("an off-catalog gassy name is not buried by blind undershoot", () => {
    const unknown = scoreBlendTarget("Diesel Dream Haze", G80_S20); // not in catalog
    const cloying = median(sweetDominant.map((s) => scoreBlendTarget(s.name, G80_S20)));
    assert.ok(unknown > 20, `unknown gassy strain scored ${unknown.toFixed(1)} — buried`);
    assert.ok(
      unknown > cloying,
      `unknown gassy (${unknown.toFixed(1)}) should beat known cloying strains (${cloying.toFixed(1)})`,
    );
  });

  it("an off-catalog sweet-leaning name still lands mid-range, not zero", () => {
    const sc = scoreBlendTarget("Sugar Nebula", G80_S20);
    assert.ok(sc > 10 && sc < 70, `expected a damped mid-range read, got ${sc.toFixed(1)}`);
  });
});
