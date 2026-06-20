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
  bodyFeel: null,
  potencyPreference: null,
  preferredFamilies: [],
  avoidedFamilies: [],
  avoidedRisks: [],
  notes: "",
  ...over,
});

// What the four-tap /onboarding/quick flow writes (non-"Nothing" avoid).
const afterQuick = (): TasteProfileInput =>
  empty({
    primaryEffect: "calm",
    useTime: "evening",
    primaryAroma: "citrus",
    preferredAromas: ["citrus"],
    preferredFlavors: ["citrus"],
    preferredEffects: ["relaxed", "calm"],
    dislikedEffects: ["sleepy"],
  });

const everything = (): TasteProfileInput => ({
  ...afterQuick(),
  favoriteStrains: ["GG4", "Sour Diesel"],
  bodyFeel: 70,
  potencyPreference: "strong",
  dislikedAromas: ["floral"],
  preferredFamilies: ["OG"],
  avoidedFamilies: ["Haze"],
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

test("after the quick flow, base is captured and percent sits in the 55–60 band", () => {
  const c = profileCompleteness(afterQuick());
  assert.equal(c.hasBase, true);
  assert.ok(c.percent >= 55 && c.percent <= 60, `got ${c.percent}`);
  assert.equal(c.isComplete, false);
});

test("a fully filled profile is 100% and complete", () => {
  const c = profileCompleteness(everything());
  assert.equal(c.percent, 100);
  assert.equal(c.isComplete, true);
  assert.equal(c.missing.length, 0);
});

test("picking 'Nothing ruins it' costs only the small avoid weight", () => {
  const withAvoid = profileCompleteness(afterQuick()).percent;
  const noAvoid = profileCompleteness({
    ...afterQuick(),
    dislikedEffects: [],
  }).percent;
  assert.ok(noAvoid < withAvoid);
  assert.ok(withAvoid - noAvoid <= 8, "avoid signal is a minor weight");
  assert.equal(profileCompleteness({ ...afterQuick(), dislikedEffects: [] }).hasBase, true);
});

test("adding any signal never lowers the percent (monotonic)", () => {
  let prev = profileCompleteness(empty()).percent;
  const steps: Partial<TasteProfileInput>[] = [
    { primaryEffect: "sharp" },
    { useTime: "morning" },
    { primaryAroma: "gas" },
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
  for (const s of steps) {
    acc = { ...acc, ...s };
    const pct = profileCompleteness(acc).percent;
    assert.ok(pct >= prev, `step ${JSON.stringify(s)} dropped ${prev}→${pct}`);
    prev = pct;
  }
  assert.equal(prev, 100);
});

test("nextHint points at the highest-value missing item", () => {
  // Only the smallest base field is filled → the nextHint should be one of the
  // big 18-weight target fields, not a tiny depth one.
  const c = profileCompleteness(empty({ dislikedEffects: ["sleepy"] }));
  assert.ok(c.nextHint);
  assert.equal(c.nextHint!.weight, 18);
});
