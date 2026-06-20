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
  budStructure: null,
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

// Every one of the 20 questions answered.
const everything = (): TasteProfileInput => ({
  ...empty(),
  favoriteStrains: ["GG4", "Sour Diesel"],
  primaryEffect: "calm",
  useTime: "evening",
  primaryAroma: "citrus",
  preferredEffects: ["relaxed"],
  preferredAromas: ["citrus"],
  dislikedEffects: ["sleepy"],
  bodyFeel: 70,
  potencyPreference: "strong",
  dislikedAromas: ["floral"],
  smokingMethods: ["vape"],
  budStructure: "fluffy",
  avoidedRisks: ["racy"],
  dislikedStrains: ["Durban Poison"],
  dislikedTraits: ["harsh"],
  likedTraits: ["terpy"],
  preferredFamilies: ["OG"],
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
  // favouriteStrains(13) + smokingMethods(2) + useTime(8) = 23.
  assert.equal(c.percent, 23);
  assert.equal(c.isComplete, false);
  const keys = c.filled.map((i) => i.key);
  assert.ok(keys.includes("favoriteStrains"));
  assert.ok(keys.includes("smokingMethods"));
  assert.ok(keys.includes("useTime"));
});

test("the four directional answers are worth 39% together", () => {
  const c = profileCompleteness(
    empty({
      favoriteStrains: ["GG4"],
      primaryEffect: "calm",
      useTime: "evening",
      primaryAroma: "citrus",
    }),
  );
  assert.equal(c.percent, 39);
});

test("the onboarding questions max out at 75% (extras live in the profile)", () => {
  // Everything except the five depth/extra questions.
  const c = profileCompleteness({
    ...everything(),
    likedTraits: [],
    preferredFamilies: [],
    avoidedFamilies: [],
    qualityPriorities: [],
    texturePreferences: [],
    notes: "",
  });
  assert.equal(c.percent, 75);
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

test("adding any signal never lowers the percent (monotonic), reaching 100", () => {
  const steps: Partial<TasteProfileInput>[] = [
    { favoriteStrains: ["Jack Herer"] },
    { primaryEffect: "sharp" },
    { useTime: "morning" },
    { primaryAroma: "gas" },
    { preferredEffects: ["energetic"] },
    { preferredAromas: ["citrus"] },
    { dislikedEffects: ["head-high"] },
    { bodyFeel: 20 },
    { potencyPreference: "balanced" },
    { dislikedAromas: ["cheese"] },
    { smokingMethods: ["bong"] },
    { budStructure: "dense" },
    { avoidedRisks: ["racy"] },
    { dislikedStrains: ["Durban Poison"] },
    { dislikedTraits: ["harsh"] },
    { likedTraits: ["terpy"] },
    { preferredFamilies: ["Haze"] },
    { qualityPriorities: ["freshness"] },
    { texturePreferences: ["dense"] },
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

test("nextHint points at the highest-value missing question (favourites)", () => {
  const c = profileCompleteness(empty({ smokingMethods: ["joint"] }));
  assert.ok(c.nextHint);
  assert.equal(c.nextHint!.key, "favoriteStrains");
  assert.equal(c.nextHint!.weight, 13);
});
