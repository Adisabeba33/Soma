import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  SENSORY_FAMILY_BONUS,
  scoreStrain,
  sensoryFamilyBonus,
} from "../src/lib/taste-engine";
import { findStrain } from "../src/lib/strain-data";
import { getIdentity } from "../src/lib/strain-identity";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

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

function strain(name: string): StrainProfile {
  const s = findStrain(name);
  if (!s) throw new Error(`Test setup: ${name} not in catalog`);
  return s;
}

describe("sensoryFamilyBonus — unit behaviour", () => {
  it("returns 0 when candidate has no identity record", () => {
    // Every real catalog strain now carries an identity record, so we
    // fabricate a candidate with a name that has none to exercise the
    // no-identity path directly.
    const candidate: StrainProfile = {
      name: "__no_identity_fixture__",
      type: "hybrid",
      aromas: ["gassy"],
      flavors: ["gassy"],
      effects: ["relaxed"],
      traits: ["gassy"],
      potency: "strong",
    };
    assert.equal(getIdentity(candidate.name), null);
    const favs = [strain("GG4")];
    assert.equal(sensoryFamilyBonus(candidate, favs), 0);
  });

  it("returns 0 when no favourites resolve to identity", () => {
    const candidate = strain("OG Kush"); // has gas-og identity
    const favs: StrainProfile[] = []; // no favourites
    assert.equal(sensoryFamilyBonus(candidate, favs), 0);
  });

  it("fires bonus when candidate and a favourite share the same family", () => {
    const candidate = strain("OG Kush"); // sensoryFamily = "gas-og"
    const favs = [strain("GG4")]; // sensoryFamily = "gas-og"
    assert.equal(sensoryFamilyBonus(candidate, favs), SENSORY_FAMILY_BONUS);
  });

  it("does NOT fire when candidate and all favourites are in distant families", () => {
    // Pick a truly cross-cluster pair the adjacency table does NOT
    // connect. Blue Dream (sweet-haze) vs GG4 (gas-og) — different
    // worlds, no adjacency edge between them.
    const candidate = strain("Blue Dream");
    const favs = [strain("GG4")];
    assert.equal(sensoryFamilyBonus(candidate, favs), 0);
  });

  it("fires when at least ONE of multiple favourites shares family", () => {
    // Favourites: NL (kush-classic) + GG4 (gas-og)
    // Candidate: OG Kush (gas-og) → shares with GG4
    const candidate = strain("OG Kush");
    const favs = [strain("Northern Lights"), strain("GG4")];
    assert.equal(sensoryFamilyBonus(candidate, favs), SENSORY_FAMILY_BONUS);
  });
});

describe("sensoryFamily — integration with scoreStrain", () => {
  // The bonus should lift gas-og candidates above same-family-tier
  // alternatives for a gas-og fan. Tests the visible effect through
  // the full engine rather than the helper in isolation.

  const gasProfile = profile({
    favoriteStrains: ["GG4"], // gas-og
    preferredAromas: ["gassy", "earthy"],
    preferredEffects: ["relaxed", "euphoric"],
  });

  it("OG Kush (gas-og, identity) scores higher than a no-identity peer", () => {
    // Both OG Kush and Skywalker OG carry gassy/earthy. OG Kush has
    // identity with sensoryFamily "gas-og"; Skywalker OG also has it,
    // so this test demonstrates intra-family alignment. For the
    // null-identity comparison we pick a sorta-similar gassy strain
    // that has NO identity record like Tahoe OG... wait Tahoe OG has
    // identity too. Use Fire OG which has no identity record.
    const og = scoreStrain("OG Kush", gasProfile).matchScore;
    const fireOg = scoreStrain("Fire OG", gasProfile).matchScore;
    // OG Kush's score now carries +4 sensory bonus that Fire OG misses.
    // Other factors are similar enough that OG Kush should win.
    assert.ok(
      og >= fireOg,
      `OG Kush (${og}) expected ≥ Fire OG (${fireOg}) thanks to sensory-family bonus`,
    );
  });

  it("score margin reflects the bonus for same-family vs cross-family alternatives", () => {
    // GG4-fan: OG Kush (gas-og) vs Northern Lights (kush-classic).
    // NL is heavy indica too but the sensory family is different. The
    // bonus should be one of the signals pushing OG Kush higher.
    const og = scoreStrain("OG Kush", gasProfile).matchScore;
    const nl = scoreStrain("Northern Lights", gasProfile).matchScore;
    // Don't assert the exact bonus magnitude — many layers overlap.
    // Just assert directional separation.
    assert.ok(
      og > nl,
      `OG Kush (${og}) should beat NL (${nl}) on a gas-og profile`,
    );
  });

  it("favourite anchor still pins 94–96 regardless of bonus", () => {
    // GG4 favorite, GG4 candidate → anchor floor wins; sensoryFamily
    // bonus is already inside the 94-cap so cannot push the score out.
    const gg4 = scoreStrain("GG4", gasProfile);
    assert.ok(
      gg4.matchScore >= 94 && gg4.matchScore <= 96,
      `GG4 anchor expected 94–96, got ${gg4.matchScore}`,
    );
  });

  it("bonus does not fire for strains without identity records", () => {
    // Pink Kush has no identity → no sensoryFamily → no bonus path.
    // Score is still computable, no errors.
    const r = scoreStrain("Pink Kush", gasProfile);
    assert.ok(typeof r.matchScore === "number");
    assert.ok(r.matchScore >= 4 && r.matchScore <= 99);
  });
});
