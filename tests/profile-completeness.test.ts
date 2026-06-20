import { test } from "node:test";
import assert from "node:assert/strict";
import { profileCompleteness } from "../src/lib/profile-completeness";
import type { TasteProfileInput } from "../src/lib/types";

const empty = (over: Partial<TasteProfileInput> = {}): TasteProfileInput => ({
  favoriteStrains: [],
  dislikedStrains: [],
  likedTraits: [],
  dislikedTraits: [],
  preferredAromas: [],
  preferredFlavors: [],
  preferredEffects: [],
  dislikedEffects: [],
  dislikedAromas: [],
  texturePreferences: [],
  qualityPriorities: [],
  primaryAroma: null,
  primaryEffect: null,
  useTime: null,
  smokingMethods: [],
  bodyFeel: null,
  potencyPreference: null,
  preferredFamilies: [],
  avoidedFamilies: [],
  avoidedRisks: [],
  notes: "",
  ...over,
});

// What onboarding screen 1 (the three quick questions) writes.
const afterScreen1 = (): TasteProfileInput =>
  empty({
    favoriteStrains: ["GG4"],
    smokingMethods: ["joint"],
    useTime: "evening",
  });

const everything = (): TasteProfileInput => ({
  ...empty(),
  favoriteStrains: ["GG4", "Sour Diesel"],
  smokingMethods: ["vape"],
  budStructure: "fluffy",
  primaryEffect: "calm",
  primaryAroma: "citrus",
  useTime: "evening",
  preferredAromas: ["citrus"],
  dislikedEffects: ["sleepy"],
  bodyFeel: 70,
  potencyPreference: "strong",
  dislikedAromas: ["floral"],
  preferredFamilies: ["OG"],
  avoidedRisks: ["racy"],
  qualityPriorities: ["freshness"],
  texturePreferences: ["dense"],
  notes: "love a gassy evening smoke",
});

test("empty profile is 0% and has no base", () => {
  const c = profileCompleteness(empty());
  assert.equal(c.percent, 0);
  assert.equal(c.hasBase, false);
  assert.equal(c.isComplete, false);
  assert.equal(c.filled.length, 0);
  assert.ok(c.missing.length > 0);
});

test("after screen 1, a real chunk is filled but it's far from done", () => {
  const c = profileCompleteness(afterScreen1());
  assert.ok(c.percent > 20 && c.percent < 50, `got ${c.percent}`);
  assert.equal(c.isComplete, false);
  // The favourite strain + method + time are recorded.
  const keys = c.filled.map((i) => i.key);
  assert.ok(keys.includes("favoriteStrains"));
  assert.ok(keys.includes("smokingMethods"));
  assert.ok(keys.includes("useTime"));
});

test("a fully filled profile is 100% and complete", () => {
  const c = profileCompleteness(everything());
  assert.equal(c.percent, 100);
  assert.equal(c.isComplete, true);
  assert.equal(c.missing.length, 0);
});

test("hasBase needs both the primary effect and the use-time", () => {
  assert.equal(profileCompleteness(empty({ useTime: "morning" })).hasBase, false);
  assert.equal(
    profileCompleteness(empty({ primaryEffect: "sharp" })).hasBase,
    false,
  );
  assert.equal(
    profileCompleteness(empty({ primaryEffect: "sharp", useTime: "morning" }))
      .hasBase,
    true,
  );
});

test("the avoid signal is a minor weight", () => {
  const base = empty({ primaryEffect: "calm", useTime: "evening" });
  const without = profileCompleteness(base).percent;
  const withAvoid = profileCompleteness({
    ...base,
    dislikedEffects: ["sleepy"],
  }).percent;
  assert.ok(withAvoid > without);
  assert.ok(withAvoid - without <= 8);
});

test("adding any signal never lowers the percent (monotonic), reaching 100", () => {
  const steps: Partial<TasteProfileInput>[] = [
    { primaryEffect: "sharp" },
    { useTime: "morning" },
    { smokingMethods: ["bong"] },
    { primaryAroma: "gas" },
    { budStructure: "dense" },
    { dislikedEffects: ["head-high"] },
    { favoriteStrains: ["Jack Herer"] },
    { bodyFeel: 20 },
    { potencyPreference: "balanced" },
    { dislikedAromas: ["cheese"] },
    { preferredFamilies: ["Haze"] },
    { avoidedRisks: ["racy"] },
    { notes: "bright daytime" },
  ];
  let acc: TasteProfileInput = empty();
  let prev = profileCompleteness(acc).percent;
  for (const s of steps) {
    acc = { ...acc, ...s };
    const pct = profileCompleteness(acc).percent;
    assert.ok(pct >= prev, `step ${JSON.stringify(s)} dropped ${prev}→${pct}`);
    prev = pct;
  }
  assert.equal(prev, 100);
});

test("nextHint points at the highest-value missing item", () => {
  const c = profileCompleteness(empty({ smokingMethods: ["joint"] }));
  assert.ok(c.nextHint);
  assert.equal(c.nextHint!.weight, 18);
});
