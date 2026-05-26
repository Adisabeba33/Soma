import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain, similarity } from "../src/lib/taste-engine";
import { STRAINS } from "../src/lib/strain-data";
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

function seed(name: string): StrainProfile {
  const s = STRAINS.find((x) => x.name === name);
  if (!s) throw new Error(`seed missing ${name}`);
  return s;
}

describe("behavioural-weighted similarity — tightens within-family clusters", () => {
  // Naive tag-Jaccard collapses dessert-cake territory into one
  // indistinct cloud. Behavioural bonuses (archetype/texture/family)
  // make exact behavioural twins read significantly closer than
  // adjacent or cross-family neighbours.

  it("exact behavioural twins read very close (Wedding Cake ↔ Birthday Cake)", () => {
    // Both dessert-couch-lock × smooth × nighttime-indica.
    const sim = similarity(seed("Wedding Cake"), seed("Birthday Cake"));
    assert.ok(
      sim >= 0.9,
      `dessert-cake twins should read ≥0.9, got ${sim.toFixed(2)}`,
    );
  });

  it("cross-family pairs are clearly lower than in-family pairs", () => {
    const wcBC = similarity(seed("Wedding Cake"), seed("Birthday Cake"));
    const wcJH = similarity(seed("Wedding Cake"), seed("Jack Herer"));
    assert.ok(
      wcBC - wcJH >= 0.3,
      `gap between in-family twin and cross-family should be ≥0.3, got ${(wcBC - wcJH).toFixed(2)}`,
    );
  });

  it("within-family but different archetype is between exact and cross", () => {
    // Wedding Cake (dessert-couch-lock) vs Northern Lights (deep-sleeper) —
    // same family, different archetype, no texture match.
    const wcNL = similarity(seed("Wedding Cake"), seed("Northern Lights"));
    const wcBC = similarity(seed("Wedding Cake"), seed("Birthday Cake"));
    const wcJH = similarity(seed("Wedding Cake"), seed("Jack Herer"));
    assert.ok(
      wcNL < wcBC && wcNL > wcJH,
      `family-only should be between twin and cross: WC↔NL ${wcNL.toFixed(2)} should sit between WC↔BC ${wcBC.toFixed(2)} and WC↔JH ${wcJH.toFixed(2)}`,
    );
  });

  it("type bonus alone (different family AND different behavioural) is the lowest tier", () => {
    // Jack Herer (sativa, daytime-functional) vs Sour Diesel (sativa,
    // edgy-stimulant). Same type, different family.
    const jhSD = similarity(seed("Jack Herer"), seed("Sour Diesel"));
    const jhDP = similarity(seed("Jack Herer"), seed("Durban Poison"));
    assert.ok(
      jhDP > jhSD,
      `same family > same type only: JH↔DP ${jhDP.toFixed(2)} should beat JH↔SD ${jhSD.toFixed(2)}`,
    );
  });

  it("similarity is symmetric", () => {
    const ab = similarity(seed("Wedding Cake"), seed("Northern Lights"));
    const ba = similarity(seed("Northern Lights"), seed("Wedding Cake"));
    assert.equal(ab, ba);
  });
});

describe("Compare scoring — behavioural similarity lifts in-family ref.score", () => {
  // The screenshot-profile regression after reconciliation +
  // graduated archetype bonus: Purple Kush / Master Kush still felt
  // too compressed in the 60s. Behavioural similarity propagates into
  // referenceSimilarity → ref.score → Compare scoring, lifting them
  // visibly into the 70s on this contradictory profile.
  const contradictoryProfile = profile({
    favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
    likedTraits: ["loud-smell", "potent", "terpy"],
    dislikedTraits: ["dry-flower", "weak-smell", "too-heavy"],
    preferredAromas: ["pine", "citrus", "sweet", "herbal"],
    preferredFlavors: ["citrus", "sweet", "herbal"],
    preferredEffects: ["happy", "uplifted", "focused", "creative"],
  });

  it("Master Kush and Purple Kush now reach ≥65 (in-family ref.score lift)", () => {
    const mk = scoreStrain("Master Kush", contradictoryProfile);
    const pk = scoreStrain("Purple Kush", contradictoryProfile);
    assert.ok(
      mk.matchScore >= 65,
      `Master Kush expected ≥65 after behavioural similarity, got ${mk.matchScore}`,
    );
    assert.ok(
      pk.matchScore >= 65,
      `Purple Kush expected ≥65, got ${pk.matchScore}`,
    );
  });

  it("cross-family Jack Herer still doesn't catch family-aligned kush", () => {
    const jh = scoreStrain("Jack Herer", contradictoryProfile);
    const mk = scoreStrain("Master Kush", contradictoryProfile);
    assert.ok(
      mk.matchScore > jh.matchScore,
      `MK (${mk.matchScore}) should still beat JH (${jh.matchScore}) by a wide margin now`,
    );
    assert.ok(
      mk.matchScore - jh.matchScore >= 10,
      `family-aligned vs cross-family gap should be ≥10pt, got ${mk.matchScore - jh.matchScore}`,
    );
  });
});

describe("anchor-floor invariant survives the similarity lift", () => {
  // High behavioural similarity to a favourite (e.g., Purple Punch vs
  // Granddaddy Purple — almost identical tag-set + same archetype +
  // texture + family) could mathematically push similarity to 1.0 and
  // trick the anchor logic. referenceSimilarity caps non-canonical
  // matches at 99 so anchor floor stays driven by explicit favourite
  // identity, not by similarity coincidence.

  it("Purple Punch is NOT treated as a favourite anchor on a GDP-favourite profile", () => {
    const p = profile({
      favoriteStrains: ["Granddaddy Purple", "Bubba Kush"],
      preferredAromas: ["earthy", "sweet"],
      preferredEffects: ["sleepy", "body-heavy"],
    });
    const pp = scoreStrain("Purple Punch", p);
    // PP is not in favourites; even with very high similarity to GDP,
    // it must respect the 88 non-anchor ceiling, not the 94–96 anchor
    // floor.
    assert.ok(
      pp.matchScore <= 88,
      `PP should respect non-anchor ceiling, got ${pp.matchScore} (anchor floor leaked)`,
    );
  });

  it("Granddaddy Purple itself still anchors at 94–96", () => {
    const p = profile({ favoriteStrains: ["Granddaddy Purple", "Bubba Kush"] });
    const gdp = scoreStrain("Granddaddy Purple", p);
    assert.ok(gdp.matchScore >= 94 && gdp.matchScore <= 96);
  });
});
