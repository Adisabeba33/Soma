import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  SENSORY_FAMILY_BONUS_ADJACENT,
  SENSORY_FAMILY_BONUS_EXACT,
  sensoryFamilyBonus,
} from "../src/lib/taste-engine";
import { findStrain } from "../src/lib/strain-data";
import { getIdentity } from "../src/lib/strain-identity";
import { IDENTITIES } from "../src/lib/strain-identity-data";
import type { StrainProfile } from "../src/lib/types";

// modern-exotic was a 60-strain catch-all; split into candy-/funky-/gelato-
// exotic (+ tropical-fruit) — see deferred-improvements #1.

function strain(name: string): StrainProfile {
  const s = findStrain(name);
  if (!s) throw new Error(`Test setup: ${name} not in catalog`);
  return s;
}

describe("modern-exotic split", () => {
  it("no identity record still uses modern-exotic", () => {
    const stragglers = IDENTITIES.filter(
      (i) => i.sensoryFamily === "modern-exotic",
    ).map((i) => i.canonicalName);
    assert.deepEqual(stragglers, []);
  });

  it("the sub-families exist with representative members", () => {
    const fam = (name: string) => getIdentity(name)?.sensoryFamily;
    assert.equal(fam("Runtz"), "candy-exotic");
    assert.equal(fam("White Runtz"), "candy-exotic");
    assert.equal(fam("Permanent Marker"), "funky-exotic");
    assert.equal(fam("Cap Junky"), "funky-exotic");
    assert.equal(fam("MAC"), "gelato-exotic");
    assert.equal(fam("White Hot Guava"), "tropical-fruit");
    assert.equal(fam("Pink Guava"), "tropical-fruit");
  });

  it("closes the reviewer's gap: fruity-exotic and gas-funky no longer same family", () => {
    // White Hot Guava (tropical-fruit) fan vs Permanent Marker (funky-exotic):
    // no exact bonus, and they're not adjacent either → 0.
    const pm = strain("Permanent Marker");
    const whg = [strain("White Hot Guava")];
    assert.equal(sensoryFamilyBonus(pm, whg), 0);
  });

  it("same candy-exotic still earns the exact bonus", () => {
    const whiteRuntz = strain("White Runtz");
    const fav = [strain("Runtz")];
    assert.equal(sensoryFamilyBonus(whiteRuntz, fav), SENSORY_FAMILY_BONUS_EXACT);
  });

  it("funky-exotic is adjacent to classic gas-og", () => {
    // Permanent Marker (funky-exotic) ↔ GG4 (gas-og).
    const pm = strain("Permanent Marker");
    const gg4 = [strain("GG4")];
    assert.equal(sensoryFamilyBonus(pm, gg4), SENSORY_FAMILY_BONUS_ADJACENT);
  });
});
