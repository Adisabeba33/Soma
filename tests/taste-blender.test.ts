// Taste Blender invariants — how we test the blend WITHOUT tasting anything.
// These assert the rules the blend MUST obey, so a regression in the merge
// math is caught automatically. They check the engine is FAITHFUL to the
// inputs; whether the inputs (your profiles) are right is a separate question
// only real feedback answers.

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { analyzeMerged } from "../src/lib/merge-worlds";

type P = Record<string, unknown> & { id: string };
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

const MENU = [
  "GG4",
  "Skunk #1",
  "Zkittlez",
  "Sour Diesel",
  "White Hot Guava",
  "Granddaddy Purple",
  "AK-47",
  "Blue Dream",
];

// Two contrasting worlds, no dislikes (so best-of = max cleanly).
const GAS = profile({
  id: "gas",
  favoriteStrains: ["GG4", "Gary Payton"],
  preferredAromas: ["gassy", "diesel", "earthy"],
  preferredEffects: ["relaxed", "happy"],
  primaryAroma: "gassy",
});
const FRUIT = profile({
  id: "fruit",
  favoriteStrains: ["Zkittlez", "White Hot Guava"],
  preferredAromas: ["tropical", "sweet", "fruity"],
  preferredEffects: ["uplifted", "euphoric"],
  primaryAroma: "fruity",
});

const run = (opts: { balance?: boolean; penalties?: Record<string, number> } = {}) =>
  analyzeMerged({
    strains: MENU,
    profiles: [GAS, FRUIT] as never,
    penalties: opts.penalties ?? {},
    feedback: [],
    balance: opts.balance ?? false,
  });

describe("Taste Blender invariants", () => {
  it("best-of = the MAX of the per-world scores", () => {
    const r = run({ balance: false });
    for (const rec of r.recommendations) {
      const worlds = r.mergeBreakdown[rec.strainName].map((w) => w.score);
      assert.equal(
        rec.matchScore,
        Math.max(...worlds),
        `${rec.strainName}: best-of should be max of ${worlds}`,
      );
    }
  });

  it("balance (bridge) = the MIN of the per-world scores", () => {
    const r = run({ balance: true });
    for (const rec of r.recommendations) {
      const worlds = r.mergeBreakdown[rec.strainName].map((w) => w.score);
      assert.equal(
        rec.matchScore,
        Math.min(...worlds),
        `${rec.strainName}: bridge should be min of ${worlds}`,
      );
    }
  });

  it("bridge <= best-of for every strain (min <= max)", () => {
    const max = new Map(run({ balance: false }).recommendations.map((r) => [r.strainName, r.matchScore]));
    const min = new Map(run({ balance: true }).recommendations.map((r) => [r.strainName, r.matchScore]));
    for (const [name, lo] of min) {
      assert.ok((lo as number) <= (max.get(name) as number), `${name}: bridge > best-of`);
    }
  });

  it("a profile's favourite anchors high in its own world", () => {
    const r = run();
    const gg4 = r.mergeBreakdown["GG4"]; // GG4 is a GAS favourite
    const gasScore = gg4.find((w) => w.world === "gas")!.score;
    assert.ok(gasScore >= 94, `GG4 in the gas world should anchor >=94, got ${gasScore}`);
  });

  it("a strain avoided in ANY world is vetoed (takes its lowest world, never tops the blend)", () => {
    // FRUIT avoids Blue Dream → it must not ride its best world.
    const fruitAvoid = profile({ ...FRUIT, id: "fruit", dislikedStrains: ["Blue Dream"] }) as never;
    const r = analyzeMerged({ strains: MENU, profiles: [GAS, fruitAvoid] as never, penalties: {}, feedback: [], balance: false });
    const bd = r.recommendations.find((x) => x.strainName === "Blue Dream")!;
    const worlds = r.mergeBreakdown["Blue Dream"].map((w) => w.score);
    assert.equal(bd.matchScore, Math.min(...worlds), "vetoed strain should take its LOWEST world");
    const top3 = r.recommendations.slice(0, 3).map((x) => x.strainName);
    assert.ok(!top3.includes("Blue Dream"), "vetoed strain must not be in the top 3");
    // The audit needs to NAME who vetoed it (else a low score with "no
    // penalties" reads like a bug).
    assert.deepEqual(bd.avoidedBy, ["fruit"], "vetoed strain should name the avoiding world");
    const gg4 = r.recommendations.find((x) => x.strainName === "GG4")!;
    assert.equal(gg4.avoidedBy, undefined, "un-vetoed strain should carry no avoidedBy");
  });

  it("is deterministic — same inputs, identical output", () => {
    const a = run();
    const b = run();
    assert.deepEqual(
      a.recommendations.map((r) => [r.strainName, r.matchScore]),
      b.recommendations.map((r) => [r.strainName, r.matchScore]),
    );
  });

  it("leaning (a penalty) never RAISES the penalised world's strains", () => {
    const base = new Map(run().recommendations.map((r) => [r.strainName, r.matchScore]));
    // Penalise the FRUIT world.
    const leaned = new Map(
      run({ penalties: { fruit: 25 } }).recommendations.map((r) => [r.strainName, r.matchScore]),
    );
    for (const [name, score] of leaned) {
      assert.ok(
        (score as number) <= (base.get(name) as number),
        `${name}: leaning away from fruit should not raise it`,
      );
    }
  });
});
