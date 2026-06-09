import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import type { TasteProfileInput } from "../src/lib/types";

// Regression guard for the prod crash that hit after PR #52 shipped.
// texturePreferences and qualityPriorities had been collected by the
// questionnaire but never read by the engine until v7. Some historic
// profile rows in Postgres carry NULL in those columns (the schema
// declares String[] but there's no explicit @default([]), and Postgres
// permits NULL on text[]). PR #52 was the first code path to .map()
// across them — a TypeError crashed scoreStrain and cascaded through
// /api/compare, /api/analyze, /catalog and any other surface that
// renders per-strain match scores.
//
// Fix: coerce both fields to [] at the engine seam. These tests pin
// the contract: scoreStrain MUST be safe to call on a profile whose
// texturePreferences or qualityPriorities are missing entirely, null
// (cast through a permissive type), or undefined.

function bareProfile(): TasteProfileInput {
  return {
    favoriteStrains: ["GG4"],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: ["gassy"],
    preferredFlavors: [],
    preferredEffects: ["relaxed"],
    texturePreferences: [],
    qualityPriorities: [],
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
  };
}

describe("scoreStrain — null safety on previously-dead profile fields", () => {
  it("does not crash when texturePreferences is undefined", () => {
    const p = bareProfile();
    // Simulate a legacy DB row whose column came back as null.
    (p as unknown as { texturePreferences: unknown }).texturePreferences =
      undefined;
    assert.doesNotThrow(() => scoreStrain("OG Kush", p));
  });

  it("does not crash when qualityPriorities is undefined", () => {
    const p = bareProfile();
    (p as unknown as { qualityPriorities: unknown }).qualityPriorities =
      undefined;
    assert.doesNotThrow(() => scoreStrain("OG Kush", p));
  });

  it("does not crash when texturePreferences is explicitly null", () => {
    const p = bareProfile();
    (p as unknown as { texturePreferences: unknown }).texturePreferences = null;
    assert.doesNotThrow(() => scoreStrain("OG Kush", p));
  });

  it("does not crash when qualityPriorities is explicitly null", () => {
    const p = bareProfile();
    (p as unknown as { qualityPriorities: unknown }).qualityPriorities = null;
    assert.doesNotThrow(() => scoreStrain("OG Kush", p));
  });

  it("does not crash when both are null at once", () => {
    const p = bareProfile();
    (p as unknown as { texturePreferences: unknown }).texturePreferences = null;
    (p as unknown as { qualityPriorities: unknown }).qualityPriorities = null;
    assert.doesNotThrow(() => scoreStrain("OG Kush", p));
  });

  it("produces a sensible numeric score when both are null", () => {
    const p = bareProfile();
    (p as unknown as { texturePreferences: unknown }).texturePreferences = null;
    (p as unknown as { qualityPriorities: unknown }).qualityPriorities = null;
    const r = scoreStrain("OG Kush", p);
    assert.ok(
      Number.isFinite(r.matchScore) && r.matchScore >= 4 && r.matchScore <= 99,
      `score out of [4,99]: ${r.matchScore}`,
    );
  });
});
