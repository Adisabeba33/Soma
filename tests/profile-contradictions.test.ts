import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { detectProfileContradictions } from "../src/lib/profile-contradictions";
import type { TasteProfileInput } from "../src/lib/types";

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

describe("detectProfileContradictions", () => {
  it("returns empty list when nothing contradicts", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Northern Lights"],
        dislikedTraits: ["dry-flower"],
      }),
    );
    assert.deepEqual(c, []);
  });

  it("flags too-heavy when favourites carry heavy-body", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Northern Lights", "Bubba Kush"],
        dislikedTraits: ["too-heavy"],
      }),
    );
    assert.equal(c.length, 1);
    assert.equal(c[0].kind, "disliked-trait-vs-favorite");
    assert.equal(c[0].trigger, "too-heavy");
    assert.ok(c[0].evidenceFavorites.includes("Northern Lights"));
    assert.ok(c[0].evidenceFavorites.includes("Bubba Kush"));
    assert.match(c[0].description, /too heavy/i);
    assert.match(c[0].resolution, /silenced/i);
  });

  it("does NOT flag too-heavy when favourites are bright sativas", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Jack Herer", "Durban Poison"],
        dislikedTraits: ["too-heavy"],
      }),
    );
    assert.deepEqual(c, []);
  });

  it("flags sharp-citrus when favourites are citrus-forward", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Super Lemon Haze"],
        dislikedTraits: ["sharp-citrus"],
      }),
    );
    assert.equal(c.length, 1);
    assert.equal(c[0].trigger, "sharp-citrus");
    assert.ok(c[0].evidenceFavorites.includes("Super Lemon Haze"));
  });

  it("never flags batch-quality dislikes (no scoring mapping)", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Northern Lights"],
        dislikedTraits: ["dry-flower", "weak-smell", "hay-smell"],
      }),
    );
    assert.deepEqual(c, []);
  });

  it("handles multiple contradictions in one profile", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Super Lemon Haze", "Northern Lights"],
        dislikedTraits: ["sharp-citrus", "too-heavy"],
      }),
    );
    assert.equal(c.length, 2);
    const triggers = c.map((x) => x.trigger).sort();
    assert.deepEqual(triggers, ["sharp-citrus", "too-heavy"]);
  });

  it("returns empty list for sparse profile (no favourites)", () => {
    const c = detectProfileContradictions(
      profile({ dislikedTraits: ["too-heavy"] }),
    );
    assert.deepEqual(c, []);
  });
});

describe("detectProfileContradictions — dislikedEffects axis", () => {
  it("flags couch-lock when favourites directly deliver it", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Bubba Kush"],
        dislikedEffects: ["couch-lock"],
      }),
    );
    assert.equal(c.length, 1);
    assert.equal(c[0].kind, "disliked-effect-vs-favorite");
    assert.equal(c[0].trigger, "couch-lock");
    assert.ok(c[0].evidenceFavorites.includes("Bubba Kush"));
    assert.match(c[0].description, /couch-lock/i);
    assert.match(c[0].resolution, /silenced/i);
  });

  it("does NOT flag couch-lock when favourites are bright sativas", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Jack Herer", "Durban Poison"],
        dislikedEffects: ["couch-lock"],
      }),
    );
    assert.deepEqual(c, []);
  });

  it("returns trait + effect contradictions side-by-side", () => {
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Bubba Kush"],
        dislikedTraits: ["too-heavy"],
        dislikedEffects: ["couch-lock"],
      }),
    );
    assert.equal(c.length, 2);
    const kinds = c.map((x) => x.kind).sort();
    assert.deepEqual(kinds, [
      "disliked-effect-vs-favorite",
      "disliked-trait-vs-favorite",
    ]);
  });

  it("ignores effects the favourites do not actually carry", () => {
    // Bubba Kush carries couch-lock but NOT energetic. The dislike of
    // "energetic" stands — no contradiction.
    const c = detectProfileContradictions(
      profile({
        favoriteStrains: ["Bubba Kush"],
        dislikedEffects: ["energetic"],
      }),
    );
    assert.deepEqual(c, []);
  });
});
