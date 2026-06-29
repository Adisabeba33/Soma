import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { findStrain } from "../src/lib/strain-data";

// Regression guard: findStrain's loose match must only absorb trailing
// non-letter menu noise, never collapse a distinct cultivar whose name merely
// ENDS WITH a shorter catalog name. Before the fix, "Sunset Runtz" /
// "Rainbow Runtz" / "Venom Runtz" all resolved to "Runtz", so three different
// strains scored identically in head-to-head.
describe("findStrain — loose match never collapses distinct cultivars", () => {
  it("resolves each '<modifier> Runtz' to its own entry, not base Runtz", () => {
    const runtz = findStrain("Runtz");
    assert.ok(runtz && runtz.name === "Runtz");
    for (const n of ["Sunset Runtz", "Rainbow Runtz", "Venom Runtz"]) {
      const s = findStrain(n);
      assert.ok(s, `${n} should resolve`);
      assert.equal(s!.name, n, `${n} must resolve to itself, not ${s!.name}`);
    }
  });

  it("does NOT collapse an unknown '<word> <catalogName>' onto the base", () => {
    // Not in the catalog — must be treated as unknown (null), never silently
    // mapped to "Runtz" / "Gelato" just because it ends with that word.
    assert.equal(findStrain("Zzqq Runtz"), null);
    assert.equal(findStrain("Madeup Gelato"), null);
  });

  it("still absorbs trailing numeric/weight menu noise", () => {
    // "Runtz #41" → digits/# only after the catalog key → still resolves.
    const s = findStrain("Runtz #41");
    assert.ok(s && s.name === "Runtz");
  });
});
