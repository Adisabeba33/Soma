import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { reconciledDislikes, scoreStrain } from "../src/lib/taste-engine";
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

describe("reconciledDislikes — list silenced dislikes", () => {
  it("silences too-heavy when favourites are heavy indicas", () => {
    const r = reconciledDislikes(
      profile({
        favoriteStrains: ["Northern Lights", "Bubba Kush"],
        dislikedTraits: ["too-heavy", "dry-flower"],
      }),
    );
    assert.deepEqual(r, ["too-heavy"]);
  });

  it("does NOT silence too-heavy when favourites are light/sativa", () => {
    const r = reconciledDislikes(
      profile({
        favoriteStrains: ["Jack Herer", "Durban Poison"],
        dislikedTraits: ["too-heavy"],
      }),
    );
    assert.deepEqual(r, []);
  });

  it("silences sharp-citrus when favourites are citrus-forward", () => {
    const r = reconciledDislikes(
      profile({
        favoriteStrains: ["Super Lemon Haze"],
        dislikedTraits: ["sharp-citrus"],
      }),
    );
    assert.deepEqual(r, ["sharp-citrus"]);
  });

  it("never silences batch-quality dislikes (dry-flower, weak-smell)", () => {
    const r = reconciledDislikes(
      profile({
        favoriteStrains: ["Northern Lights"],
        dislikedTraits: ["dry-flower", "weak-smell", "hay-smell"],
      }),
    );
    assert.deepEqual(r, []);
  });

  it("returns empty when favourites list is empty", () => {
    const r = reconciledDislikes(
      profile({ favoriteStrains: [], dislikedTraits: ["too-heavy"] }),
    );
    assert.deepEqual(r, []);
  });
});

describe("integration — the screenshot regression (NL+GDP+Bubba + bright daytime prefs + too-heavy disliked)", () => {
  // This is the exact pattern from the real-world Compare run:
  // favourites are heavy indicas, but the user has also marked
  // too-heavy as a disliked trait. Pre-reconciliation, the engine
  // hit every nighttime strain with a 15pt conflict penalty
  // (anchors were saved only by the floor). Post-reconciliation,
  // the contradiction is detected and the dislike is silenced for
  // scoring purposes — the user's own favourites override the label.
  const screenshotProfile = profile({
    favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
    likedTraits: ["loud-smell", "potent", "terpy"],
    dislikedTraits: ["dry-flower", "weak-smell", "too-heavy"],
    preferredAromas: ["pine", "citrus", "sweet", "herbal"],
    preferredFlavors: ["citrus", "sweet", "herbal"],
    preferredEffects: ["happy", "uplifted", "focused", "creative", "energetic"],
    texturePreferences: ["well-cured"],
    qualityPriorities: ["aroma", "focus", "creativity"],
  });

  it("Ice Cream Cake rises above Jack Herer after reconciliation", () => {
    const icc = scoreStrain("Ice Cream Cake", screenshotProfile);
    const jh = scoreStrain("Jack Herer", screenshotProfile);
    assert.ok(
      icc.matchScore > jh.matchScore,
      `ICC (${icc.matchScore}) must beat Jack Herer (${jh.matchScore}) — same family as favourites, contradictory dislike silenced`,
    );
  });

  it("Family-aligned strains (PK, MK) outscore Jack Herer", () => {
    const pk = scoreStrain("Purple Kush", screenshotProfile).matchScore;
    const mk = scoreStrain("Master Kush", screenshotProfile).matchScore;
    const jh = scoreStrain("Jack Herer", screenshotProfile).matchScore;
    assert.ok(pk > jh, `Purple Kush (${pk}) must beat JH (${jh})`);
    assert.ok(mk > jh, `Master Kush (${mk}) must beat JH (${jh})`);
  });

  it("Conflicts list is empty for family-aligned strains (dislike silenced)", () => {
    const r = scoreStrain("Ice Cream Cake", screenshotProfile);
    assert.deepEqual(r.conflicts, []);
  });

  it("Anchors still pin 94–96", () => {
    for (const name of ["Northern Lights", "Granddaddy Purple", "Bubba Kush"]) {
      const r = scoreStrain(name, screenshotProfile);
      assert.ok(
        r.matchScore >= 94 && r.matchScore <= 96,
        `${name} anchor expected 94–96, got ${r.matchScore}`,
      );
    }
  });

  it("Cross-family strains still get conflict-penalised when applicable", () => {
    // Sanity: reconciliation only suppresses dislikes that favourites
    // would themselves trigger. A profile that loves citrus sativa but
    // dislikes too-heavy should STILL penalise heavy strains.
    const dayProfile = profile({
      favoriteStrains: ["Super Lemon Haze", "Durban Poison"],
      dislikedTraits: ["too-heavy"],
      preferredEffects: ["uplifted", "focused"],
    });
    const heavyStrain = scoreStrain("Northern Lights", dayProfile);
    assert.ok(
      heavyStrain.conflicts.some((c) => c.includes("heavy, sedating")),
      `dayProfile + too-heavy disliked should still flag NL: got ${JSON.stringify(heavyStrain.conflicts)}`,
    );
  });
});

describe("integration — reconciliation does not soften honest dislikes", () => {
  // Without contradiction, dislike penalties remain. A user who loves
  // SLH (sativa) and dislikes "too-light" reconciles — favourites are
  // light. But "too-heavy" disliked + SLH favourite has no
  // contradiction → too-heavy stays as a real signal.
  it("too-heavy disliked still penalises NL when favourites are sativa", () => {
    const p = profile({
      favoriteStrains: ["Super Lemon Haze"],
      dislikedTraits: ["too-heavy"],
    });
    const r = scoreStrain("Northern Lights", p);
    assert.ok(
      r.conflicts.length > 0,
      `expected too-heavy conflict to fire on NL, got no conflicts`,
    );
  });
});
