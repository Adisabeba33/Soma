import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  COLLECTION_TIERS,
  TIER_STYLE,
  tierOf,
} from "../src/lib/collection-tier";
import { STRAINS } from "../src/lib/strain-data";

describe("collection tiers", () => {
  it("every curated key matches a real catalogue strain", () => {
    const names = new Set(STRAINS.map((s) => s.name));
    for (const key of Object.keys(COLLECTION_TIERS)) {
      assert.ok(names.has(key), `tier key "${key}" is not in STRAINS`);
    }
  });

  it("every tier value has a badge style", () => {
    for (const [name, tier] of Object.entries(COLLECTION_TIERS)) {
      assert.ok(TIER_STYLE[tier], `${name}: tier "${tier}" has no style`);
    }
  });

  it("tierOf returns the curated tier or null", () => {
    assert.equal(tierOf("GG4"), "Legendary");
    assert.equal(tierOf("Sour Diesel"), "Classic");
    assert.equal(tierOf("definitely not a strain"), null);
  });
});
