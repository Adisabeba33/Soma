import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  deriveProfileTarget,
  resolveProfileTarget,
  primaryAromaTokens,
} from "../src/lib/profile-target";
import { inferProfileArchetype } from "../src/lib/effect-archetype";
import { scoreStrain } from "../src/lib/taste-engine";
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
    lookingFor: "new",
    primaryAroma: null,
    primaryEffect: null,
    useTime: null,
    bodyFeel: null,
    notes: null,
    ...overrides,
  };
}

describe("deriveProfileTarget — the connection formula", () => {
  it("returns null unless BOTH primary effect and use-time are present", () => {
    assert.equal(deriveProfileTarget(profile()), null);
    assert.equal(deriveProfileTarget(profile({ primaryEffect: "calm" })), null);
    assert.equal(deriveProfileTarget(profile({ useTime: "evening" })), null);
  });

  it("gas + calm + evening → garlic-funk / pressure-heavy / nighttime-indica", () => {
    const t = deriveProfileTarget(
      profile({ primaryAroma: "gas", primaryEffect: "calm", useTime: "evening" }),
    );
    assert.deepEqual(t, {
      archetype: "garlic-funk",
      texture: "pressure-heavy",
      family: "nighttime-indica",
    });
  });

  it("citrus + sharp + morning → clean-creative-daytime / lucid / daytime-functional", () => {
    const t = deriveProfileTarget(
      profile({ primaryAroma: "citrus", primaryEffect: "sharp", useTime: "morning" }),
    );
    assert.deepEqual(t, {
      archetype: "clean-creative-daytime",
      texture: "lucid",
      family: "daytime-functional",
    });
  });

  it("sweet + knockout + bed → dessert-couch-lock / grounded / nighttime-indica", () => {
    const t = deriveProfileTarget(
      profile({ primaryAroma: "sweet", primaryEffect: "knockout", useTime: "bed" }),
    );
    assert.deepEqual(t, {
      archetype: "dessert-couch-lock",
      texture: "grounded",
      family: "nighttime-indica",
    });
  });

  it("ignores an invalid primary-aroma token (falls back to generic branch)", () => {
    const t = deriveProfileTarget(
      profile({ primaryAroma: "bogus", primaryEffect: "calm", useTime: "evening" }),
    );
    // calm + evening with no recognised aroma → introspective-calm
    assert.equal(t?.archetype, "introspective-calm");
  });
});

describe("resolveProfileTarget — forced wins, else inferred", () => {
  it("uses forced answers and tags the source", () => {
    const r = resolveProfileTarget(
      profile({ primaryAroma: "gas", primaryEffect: "calm", useTime: "evening" }),
    );
    assert.equal(r.source, "forced");
    assert.equal(r.archetype, "garlic-funk");
  });

  it("falls back to legacy inference when no forced answers", () => {
    const p = profile({ favoriteStrains: ["Northern Lights"] });
    const r = resolveProfileTarget(p);
    assert.equal(r.source, "inferred");
    assert.equal(r.archetype, inferProfileArchetype(p));
  });
});

describe("primaryAromaTokens", () => {
  it("maps the gas family to gassy + diesel", () => {
    assert.deepEqual(primaryAromaTokens(profile({ primaryAroma: "gas" })), [
      "gassy",
      "diesel",
    ]);
  });
  it("is empty when unset or invalid", () => {
    assert.deepEqual(primaryAromaTokens(profile()), []);
    assert.deepEqual(primaryAromaTokens(profile({ primaryAroma: "bogus" })), []);
  });
});

describe("scoring — forced target lifts the user's actual gas strains", () => {
  // The muddy gassy profile from the audit data: scattered/partly-unresolved
  // favourites made the auto-inference drift to smooth-expressive, dampening
  // the gassy garlic-funk strains the user actually wants.
  const muddy = profile({
    favoriteStrains: ["GG4", "white hot guava", "Sour Diesel"],
    preferredAromas: ["gassy", "diesel", "earthy", "pine", "herbal", "skunky"],
    preferredFlavors: ["gassy", "earthy", "pine", "herbal", "nutty"],
    preferredEffects: ["relaxed", "calm", "happy", "uplifted", "giggly"],
  });
  const forced = { ...muddy, primaryAroma: "gas", primaryEffect: "calm", useTime: "evening" };

  it("GMO Cookies (garlic-funk) scores higher once the target is forced", () => {
    const before = scoreStrain("GMO Cookies", muddy).matchScore;
    const after = scoreStrain("GMO Cookies", forced).matchScore;
    assert.ok(
      after > before,
      `forced target should lift the gas strain (before ${before}, after ${after})`,
    );
  });
});

describe("scoring — half-damper for primary-aroma strains", () => {
  // Both profiles target garlic-funk (calm + evening). Sour Diesel is
  // floaty-cerebral → an archetype mismatch. With primaryAroma=gas its nose
  // matches the user's primary, so the damper softens (0.8) and it also gets
  // the aroma boost; without it, the full 0.6 damper applies.
  const withPrimary = profile({
    preferredAromas: ["gassy", "diesel"],
    preferredEffects: ["energetic", "happy", "euphoric"],
    primaryAroma: "gas",
    primaryEffect: "calm",
    useTime: "evening",
  });
  const withoutPrimary = { ...withPrimary, primaryAroma: null };

  it("a gassy mismatch strain is penalised less than without primary aroma", () => {
    const a = scoreStrain("Sour Diesel", withPrimary).matchScore;
    const b = scoreStrain("Sour Diesel", withoutPrimary).matchScore;
    assert.ok(
      a > b,
      `primary-aroma strain should survive the mismatch better (with ${a}, without ${b})`,
    );
  });
});
