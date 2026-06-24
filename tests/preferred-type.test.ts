import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreStrain } from "../src/lib/taste-engine";
import { findStrain } from "../src/lib/strain-data";
import type { TasteProfileInput } from "../src/lib/types";

const base = (over: Partial<TasteProfileInput> = {}): TasteProfileInput => ({
  favoriteStrains: [],
  dislikedStrains: [],
  likedTraits: [],
  dislikedTraits: [],
  preferredAromas: ["earthy"],
  preferredFlavors: [],
  preferredEffects: ["relaxed", "sleepy"],
  dislikedEffects: [],
  dislikedAromas: [],
  texturePreferences: [],
  qualityPriorities: [],
  ...over,
});

test("preferred-type match adds a whisper-soft +0.5; mismatch/any/unset add nothing", () => {
  const name = "Northern Lights";
  const strain = findStrain(name)!;
  const other = strain.type === "indica" ? "sativa" : "indica";

  const none = scoreStrain(name, base()).unclampedScore;
  const match = scoreStrain(name, base({ preferredType: strain.type })).unclampedScore;
  const any = scoreStrain(name, base({ preferredType: "any" })).unclampedScore;
  const mismatch = scoreStrain(name, base({ preferredType: other })).unclampedScore;

  // Match nudges the raw score up by exactly 0.5 (tie-breaker on rounding).
  assert.ok(Math.abs(match - none - 0.5) < 1e-9, `match Δ ${match - none}`);
  // No preference / "any" / wrong type never change the score.
  assert.equal(any, none);
  assert.equal(mismatch, none);
});
