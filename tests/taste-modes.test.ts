import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { deriveTasteModes } from "../src/lib/taste-modes";
import { behavioralFamilyOf } from "../src/lib/behavioral-family";
import { findStrain } from "../src/lib/strain-data";
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

const fam = (name: string) => {
  const s = findStrain(name);
  return s ? behavioralFamilyOf(s) : null;
};

describe("deriveTasteModes — single-mode (no-op) cases", () => {
  it("no favourites → exactly one mode", () => {
    const modes = deriveTasteModes(profile());
    assert.equal(modes.length, 1);
  });

  it("one favourite → exactly one mode", () => {
    const modes = deriveTasteModes(profile({ favoriteStrains: ["GG4"] }));
    assert.equal(modes.length, 1);
    assert.deepEqual(modes[0].favorites, ["GG4"]);
  });

  it("favourites that share a family → one mode", () => {
    // Granddaddy Purple and Northern Lights are both nighttime-indica.
    if (
      fam("Granddaddy Purple") &&
      fam("Granddaddy Purple") === fam("Northern Lights")
    ) {
      const modes = deriveTasteModes(
        profile({ favoriteStrains: ["Granddaddy Purple", "Northern Lights"] }),
      );
      assert.equal(modes.length, 1);
    }
  });

  it("forced-choice profile stays single-mode even across families", () => {
    const modes = deriveTasteModes(
      profile({
        favoriteStrains: ["Northern Lights", "Super Lemon Haze"],
        primaryEffect: "knockout",
        useTime: "bed",
      }),
    );
    assert.equal(modes.length, 1);
    assert.equal(modes[0].target.source, "forced");
  });
});

describe("deriveTasteModes — multi-modal cases", () => {
  it("favourites spanning two families → two modes, each internally consistent", () => {
    // Northern Lights = nighttime-indica, Super Lemon Haze = daytime-functional.
    const a = fam("Northern Lights");
    const b = fam("Super Lemon Haze");
    if (a && b && a !== b) {
      const modes = deriveTasteModes(
        profile({ favoriteStrains: ["Northern Lights", "Super Lemon Haze"] }),
      );
      assert.equal(modes.length, 2);
      for (const m of modes) {
        for (const n of m.favorites) {
          assert.equal(fam(n), m.family);
        }
      }
      const fams = new Set(modes.map((m) => m.family));
      assert.equal(fams.size, 2);
    }
  });

  it("caps at three modes and keeps all members within favourites", () => {
    // Four distinct family groups (two null-family + three named) → capped to 3.
    const favs = [
      "Northern Lights",
      "Super Lemon Haze",
      "Sour Diesel",
      "OG Kush",
      "Granddaddy Purple",
    ];
    const modes = deriveTasteModes(profile({ favoriteStrains: favs }));
    assert.ok(modes.length >= 1 && modes.length <= 3);
    const favSet = new Set(favs);
    for (const m of modes) {
      assert.ok(m.favorites.length > 0);
      for (const n of m.favorites) assert.ok(favSet.has(n));
    }
  });

  it("every mode carries a usable target", () => {
    const modes = deriveTasteModes(
      profile({ favoriteStrains: ["Northern Lights", "Super Lemon Haze"] }),
    );
    for (const m of modes) {
      assert.ok(m.target);
      assert.ok(m.target.source === "forced" || m.target.source === "inferred");
      assert.ok(typeof m.label === "string" && m.label.length > 0);
    }
  });
});
