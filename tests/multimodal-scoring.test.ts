import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import type { TasteProfileInput } from "../src/lib/types";

// Phase 2 of the multimodal taste model: a candidate is credited by the
// taste mode it fits best (max-over-modes), so a multi-family favourite set
// serves BOTH worlds instead of averaging into a target that fits neither.

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

// Northern Lights = nighttime-indica, Super Lemon Haze = daytime-functional.
const NIGHT_ONLY = profile({ favoriteStrains: ["Northern Lights"] });
const DUAL = profile({ favoriteStrains: ["Northern Lights", "Super Lemon Haze"] });

describe("multimodal scoring — serves both taste worlds", () => {
  it("adding a daytime favourite lifts a daytime candidate", () => {
    // Jack Herer (daytime-functional) is recognised by the new daytime mode
    // that a nighttime-only profile didn't have.
    const night = scoreStrain("Jack Herer", NIGHT_ONLY).unclampedScore;
    const dual = scoreStrain("Jack Herer", DUAL).unclampedScore;
    assert.ok(
      dual > night + 5,
      `expected a clear lift, got ${night} → ${dual}`,
    );
  });

  it("does NOT drag a nighttime candidate when a daytime mode is added", () => {
    // Bubba Kush (nighttime-indica) keeps picking the nighttime mode, so the
    // extra daytime favourite leaves its target-driven score intact.
    const night = scoreStrain("Bubba Kush", NIGHT_ONLY).unclampedScore;
    const dual = scoreStrain("Bubba Kush", DUAL).unclampedScore;
    assert.ok(
      Math.abs(dual - night) < 1,
      `expected no drag, got ${night} → ${dual}`,
    );
  });

  it("both a daytime and a nighttime candidate land well under the dual profile", () => {
    const day = scoreStrain("Jack Herer", DUAL).unclampedScore;
    const nightCand = scoreStrain("Bubba Kush", DUAL).unclampedScore;
    assert.ok(day > 55, `daytime candidate too low: ${day}`);
    assert.ok(nightCand > 55, `nighttime candidate too low: ${nightCand}`);
  });

  it("explanation names which taste side matched (multi-modal only)", () => {
    const day = scoreStrain("Jack Herer", DUAL).whyItFits;
    const night = scoreStrain("Bubba Kush", DUAL).whyItFits;
    assert.match(day, /your daytime side/);
    assert.match(night, /your wind-down side/);
    // A single-mode profile gets no "side" note.
    const single = scoreStrain(
      "Jack Herer",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    ).whyItFits;
    assert.doesNotMatch(single, /side/);
  });
});
