import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreStrain } from "../src/lib/taste-engine";
import { riskTagsFor } from "../src/lib/risk-tags";
import type { TasteProfileInput } from "../src/lib/types";

const base = (over: Partial<TasteProfileInput> = {}): TasteProfileInput => ({
  favoriteStrains: [],
  dislikedStrains: [],
  likedTraits: [],
  dislikedTraits: [],
  preferredAromas: ["citrus", "herbal"],
  preferredFlavors: ["citrus"],
  preferredEffects: ["energetic", "uplifted", "creative", "focused", "happy"],
  dislikedEffects: [],
  dislikedAromas: [],
  texturePreferences: [],
  qualityPriorities: [],
  ...over,
});

test("risk overlay tags the curated racy sativas, not the clean ones", () => {
  assert.deepEqual(riskTagsFor("Ghost Train Haze"), ["racy"]);
  assert.deepEqual(riskTagsFor("Sour Diesel"), ["racy"]);
  assert.deepEqual(riskTagsFor("Apollo 13"), []); // clean uplifting — untagged
  assert.deepEqual(riskTagsFor("Blue Dream"), []);
});

test("high-confidence racy costs -5 when the user opts out", () => {
  const without = scoreStrain("Ghost Train Haze", base());
  const optedOut = scoreStrain("Ghost Train Haze", base({ avoidedRisks: ["racy"] }));
  assert.equal(optedOut.unclampedScore, without.unclampedScore - 5);
});

test("medium-confidence (50/50) racy costs only -2", () => {
  const without = scoreStrain("Durban Poison", base());
  const optedOut = scoreStrain("Durban Poison", base({ avoidedRisks: ["racy"] }));
  assert.equal(optedOut.unclampedScore, without.unclampedScore - 2);
});

test("the penalty never caps the category (stays out of conflicts)", () => {
  const optedOut = scoreStrain("Ghost Train Haze", base({ avoidedRisks: ["racy"] }));
  assert.equal(optedOut.conflicts.length, 0);
});

test("untagged strains are untouched even when the user avoids racy", () => {
  const a = scoreStrain("Apollo 13", base());
  const b = scoreStrain("Apollo 13", base({ avoidedRisks: ["racy"] }));
  assert.equal(a.unclampedScore, b.unclampedScore);
});

test("a favourite carrying the risk reconciles it away (no self-penalty)", () => {
  const noAvoid = scoreStrain(
    "Ghost Train Haze",
    base({ favoriteStrains: ["Ghost Train Haze"] }),
  );
  const avoid = scoreStrain(
    "Ghost Train Haze",
    base({ favoriteStrains: ["Ghost Train Haze"], avoidedRisks: ["racy"] }),
  );
  assert.equal(avoid.unclampedScore, noAvoid.unclampedScore);
});
