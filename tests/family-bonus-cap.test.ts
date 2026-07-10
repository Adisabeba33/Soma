// E2 / deferred #2 Option A: the behavioural-family bonus is capped at +8
// when the candidate's curated sensory family is KNOWN unrelated to every
// favourite's. Groups are derived from live identity data (no frozen strain
// lists) — what's pinned is the invariant, not the catalog.

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain, sensoryFamilyBonus } from "../src/lib/taste-engine";
import { STRAINS, findStrain } from "../src/lib/strain-data";
import { getIdentity } from "../src/lib/strain-identity";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

const profile: TasteProfileInput = {
  favoriteStrains: ["GG4", "OG Kush", "Tahoe OG"], // clustered gas favourites
  dislikedStrains: [],
  likedTraits: [],
  dislikedTraits: [],
  preferredAromas: ["gassy", "earthy"],
  preferredFlavors: ["gassy", "earthy"],
  preferredEffects: ["relaxed", "body-heavy", "sleepy"],
  texturePreferences: [],
  qualityPriorities: [],
};

const favourites = profile.favoriteStrains
  .map((f) => findStrain(f))
  .filter((s): s is StrainProfile => Boolean(s));

describe("behavioural-family bonus cap on known smell mismatch (E2)", () => {
  it("no known-unrelated-smell strain collects more than +8 family bonus", () => {
    let checked = 0;
    for (const s of STRAINS) {
      const hasIdentity = Boolean(getIdentity(s.name)?.sensoryFamily);
      const related = sensoryFamilyBonus(s, favourites) > 0;
      if (!hasIdentity || related) continue;
      checked++;
      const m = scoreStrain(s.name, profile);
      assert.ok(
        m.bonuses.family <= 8,
        `${s.name}: family bonus ${m.bonuses.family} despite unrelated smell territory`,
      );
    }
    assert.ok(checked > 100, `expected a real unrelated population, got ${checked}`);
  });

  it("same/adjacent smell territory still earns the full ladder (cap not over-applied)", () => {
    const full = STRAINS.filter((s) => {
      if (sensoryFamilyBonus(s, favourites) === 0) return false;
      return scoreStrain(s.name, profile).bonuses.family > 8;
    });
    assert.ok(
      full.length > 0,
      "no related-smell strain reaches a family bonus above 8 — the cap leaked onto related territory",
    );
  });
});
