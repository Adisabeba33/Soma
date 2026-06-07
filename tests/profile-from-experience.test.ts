import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { inferProfileFromExperience } from "../src/lib/profile-from-experience";

describe("inferProfileFromExperience — happy paths", () => {
  it("heavy-indica anchors produce a nighttime profile", () => {
    const r = inferProfileFromExperience({
      loved: ["Northern Lights", "Bubba Kush", "Granddaddy Purple"],
      liked: [],
      disliked: [],
    });
    assert.ok(r.sufficient, "3 known loved strains must clear the threshold");
    // Effects should lean nighttime — relaxed/sleepy/body-heavy.
    const nightEffects = ["relaxed", "sleepy", "body-heavy"].filter((e) =>
      r.profile.preferredEffects.includes(e),
    );
    assert.ok(
      nightEffects.length >= 2,
      `expected nighttime effects, got ${JSON.stringify(r.profile.preferredEffects)}`,
    );
    // Forced-choice should land in the knockout family.
    assert.ok(
      ["knockout", "calm"].includes(r.profile.primaryEffect),
      `expected knockout/calm primaryEffect, got "${r.profile.primaryEffect}"`,
    );
    assert.ok(
      ["evening", "bed"].includes(r.profile.useTime),
      `expected evening/bed useTime, got "${r.profile.useTime}"`,
    );
    // Body should be heavy (>= 60).
    assert.ok(
      (r.profile.bodyFeel ?? 0) >= 60,
      `expected heavy bodyFeel >=60, got ${r.profile.bodyFeel}`,
    );
  });

  it("bright sativa anchors produce a daytime profile", () => {
    const r = inferProfileFromExperience({
      loved: ["Super Lemon Haze", "Durban Poison", "Jack Herer"],
      liked: [],
      disliked: [],
    });
    assert.ok(r.sufficient);
    // Should land on uplifted / focused / energetic territory.
    const dayEffects = ["uplifted", "focused", "energetic", "happy"].filter(
      (e) => r.profile.preferredEffects.includes(e),
    );
    assert.ok(
      dayEffects.length >= 2,
      `expected daytime effects, got ${JSON.stringify(r.profile.preferredEffects)}`,
    );
    assert.ok(
      ["lifted", "sharp", "social"].includes(r.profile.primaryEffect),
      `expected lifted/sharp/social primaryEffect, got "${r.profile.primaryEffect}"`,
    );
    assert.ok(
      ["morning", "daytime"].includes(r.profile.useTime),
      `expected morning/daytime useTime, got "${r.profile.useTime}"`,
    );
    // Body should be light (<= 40).
    assert.ok(
      (r.profile.bodyFeel ?? 100) <= 40,
      `expected light bodyFeel <=40, got ${r.profile.bodyFeel}`,
    );
  });

  it("derives primaryAroma from the strongest aroma family in the anchors", () => {
    // GG4 + Sour Diesel + OG Kush all carry gassy. Should infer "gas".
    const r = inferProfileFromExperience({
      loved: ["GG4", "Sour Diesel", "OG Kush"],
      liked: [],
      disliked: [],
    });
    assert.equal(r.profile.primaryAroma, "gas");
  });
});

describe("inferProfileFromExperience — favoriteStrains + referenceStrain", () => {
  it("favoriteStrains uses canonical names, not user input", () => {
    // GDP is an alias for Granddaddy Purple.
    const r = inferProfileFromExperience({
      loved: ["GDP", "Bubba Kush"],
      liked: [],
      disliked: [],
    });
    assert.ok(
      r.profile.favoriteStrains.includes("Granddaddy Purple"),
      `expected canonical Granddaddy Purple, got ${JSON.stringify(r.profile.favoriteStrains)}`,
    );
  });

  it("referenceStrain is the first canonical loved strain", () => {
    const r = inferProfileFromExperience({
      loved: ["Wedding Cake", "GG4"],
      liked: [],
      disliked: [],
    });
    assert.equal(r.profile.referenceStrain, "Wedding Cake");
  });

  it("favoriteStrains caps at 3 even with many loved", () => {
    const r = inferProfileFromExperience({
      loved: [
        "Wedding Cake",
        "GG4",
        "Northern Lights",
        "Bubba Kush",
        "GDP",
      ],
      liked: [],
      disliked: [],
    });
    assert.equal(r.profile.favoriteStrains.length, 3);
  });
});

describe("inferProfileFromExperience — sufficiency", () => {
  it("returns sufficient=false when no loved and no liked resolve", () => {
    const r = inferProfileFromExperience({
      loved: ["Made Up Strain XYZ"],
      liked: ["Another Unknown"],
      disliked: [],
    });
    assert.equal(r.sufficient, false);
    assert.deepEqual(r.unknown.loved, ["Made Up Strain XYZ"]);
    assert.deepEqual(r.unknown.liked, ["Another Unknown"]);
  });

  it("returns sufficient=false with only 1 resolved positive strain", () => {
    const r = inferProfileFromExperience({
      loved: ["Wedding Cake"],
      liked: [],
      disliked: [],
    });
    assert.equal(r.sufficient, false);
  });

  it("returns sufficient=true with 1 loved + 1 liked", () => {
    const r = inferProfileFromExperience({
      loved: ["Wedding Cake"],
      liked: ["GG4"],
      disliked: [],
    });
    assert.equal(r.sufficient, true);
  });

  it("filters unknown strains out of resolved without erroring", () => {
    const r = inferProfileFromExperience({
      loved: ["Wedding Cake", "Made Up Strain"],
      liked: ["GG4"],
      disliked: ["Phantom"],
    });
    assert.equal(r.resolved.loved.length, 1);
    assert.equal(r.resolved.liked.length, 1);
    assert.equal(r.resolved.disliked.length, 0);
    assert.deepEqual(r.unknown.loved, ["Made Up Strain"]);
    assert.deepEqual(r.unknown.disliked, ["Phantom"]);
  });
});

describe("inferProfileFromExperience — dislikedEffects extraction", () => {
  it("disliked sativa pulls energetic into dislikedEffects when loved is heavy", () => {
    const r = inferProfileFromExperience({
      loved: ["Northern Lights", "Bubba Kush"],
      liked: [],
      disliked: ["Super Lemon Haze"],
    });
    // SLH carries energetic/uplifted; loved doesn't. Should surface.
    const hasDaytimeDislike = ["energetic", "head-high", "uplifted"].some((e) =>
      r.profile.dislikedEffects.includes(e),
    );
    assert.ok(
      hasDaytimeDislike,
      `expected daytime effect in dislikedEffects, got ${JSON.stringify(r.profile.dislikedEffects)}`,
    );
  });

  it("silences disliked effects that the loved strains also carry", () => {
    // User says they hate Bubba (carries couch-lock) but loves NL+GDP
    // (also carry couch-lock). The contradiction is silenced — we don't
    // surface couch-lock as a dislike because it'd contradict the loved
    // anchors immediately.
    const r = inferProfileFromExperience({
      loved: ["Northern Lights", "Granddaddy Purple"],
      liked: [],
      disliked: ["Bubba Kush"],
    });
    // Loved effects include "relaxed" (positive set). Bubba's "relaxed"
    // should NOT propagate to dislikedEffects.
    assert.ok(
      !r.profile.dislikedEffects.includes("relaxed"),
      `relaxed shared with loved, should be silenced`,
    );
  });

  it("returns empty dislikedEffects when nothing is disliked", () => {
    const r = inferProfileFromExperience({
      loved: ["Wedding Cake", "GG4"],
      liked: [],
      disliked: [],
    });
    assert.deepEqual(r.profile.dislikedEffects, []);
  });
});

describe("inferProfileFromExperience — basic shape", () => {
  it("returns empty arrays for axes not yet inferable", () => {
    const r = inferProfileFromExperience({
      loved: ["Wedding Cake", "GG4"],
      liked: [],
      disliked: [],
    });
    // texturePreferences / qualityPriorities aren't inferable from
    // strain tags — they need explicit user input. Should be empty.
    assert.deepEqual(r.profile.texturePreferences, []);
    assert.deepEqual(r.profile.qualityPriorities, []);
    assert.equal(r.profile.notes, "");
    assert.equal(r.profile.lookingFor, "similar");
  });

  it("deduplicates the same canonical strain entered twice (e.g. GG4 + Gorilla Glue #4)", () => {
    const r = inferProfileFromExperience({
      loved: ["GG4", "Gorilla Glue #4"],
      liked: [],
      disliked: [],
    });
    assert.equal(r.resolved.loved.length, 1);
  });
});
