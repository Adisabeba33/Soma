import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  GENETICS,
  DENSITY,
  DENSITY_BONUS,
  densityProfileOf,
  densityBonus,
} from "../src/lib/bud-structure";
import { STRAINS } from "../src/lib/strain-data";

describe("bud-structure curation", () => {
  it("every curated key matches a real catalogue strain", () => {
    const names = new Set(STRAINS.map((s) => s.name));
    for (const key of [...Object.keys(GENETICS), ...Object.keys(DENSITY)]) {
      assert.ok(names.has(key), `curated key "${key}" is not in STRAINS`);
    }
  });

  it("indica/sativa genetics splits sum to 100", () => {
    for (const [name, g] of Object.entries(GENETICS)) {
      assert.equal(g.indica + g.sativa, 100, `${name} split must total 100`);
    }
  });

  it("a curated DENSITY entry overrides the genotype-presumed lean", () => {
    // GG4 is a 50/50 hybrid (presumed mixed → 0) but curated dense/high.
    const gg4 = STRAINS.find((s) => s.name === "GG4");
    assert.ok(gg4);
    const p = densityProfileOf(gg4!);
    assert.equal(p.lean, "dense");
    assert.equal(p.confidence, "high");
    assert.equal(p.weight, DENSITY_BONUS.high);
  });

  it("corrects sativa-line strains that are actually dense", () => {
    for (const name of ["Green Crack", "Durban Poison"]) {
      const s = STRAINS.find((x) => x.name === name)!;
      assert.equal(densityProfileOf(s).lean, "dense", `${name} should be dense`);
    }
  });

  it("the slider direction and intensity scale the bonus", () => {
    const gmo = STRAINS.find((s) => s.name === "GMO Cookies")!; // dense/high
    assert.equal(densityBonus(gmo, 1), DENSITY_BONUS.high); // full dense match
    assert.equal(densityBonus(gmo, -1), -DENSITY_BONUS.high); // full fluffy mismatch
    assert.equal(densityBonus(gmo, 0.5), DENSITY_BONUS.high * 0.5); // half intensity
    assert.equal(densityBonus(gmo, 0), 0); // no preference → nothing
  });

  it("an uncurated hybrid stays neutral (presumed mixed → 0)", () => {
    // A hybrid with no GENETICS and no DENSITY entry contributes nothing.
    const uncurated = STRAINS.find(
      (s) => s.type === "hybrid" && !GENETICS[s.name] && !DENSITY[s.name],
    );
    assert.ok(uncurated);
    assert.equal(densityBonus(uncurated!, 1), 0);
  });
});
