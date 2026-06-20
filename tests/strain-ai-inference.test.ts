import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, resolveStrain } from "../src/lib/taste-engine";
import { normalizeStrainName } from "../src/lib/strain-data";
import {
  inferStrainsAI,
  isStrainAIEnabled,
} from "../src/lib/strain-inference-ai";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

const fakeProfile = (over: Partial<TasteProfileInput> = {}): TasteProfileInput => ({
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
  ...over,
});

const override = (name: string, p: StrainProfile) =>
  new Map([[normalizeStrainName(name), p]]);

const ZZ: StrainProfile = {
  name: "Zztest Kush",
  type: "hybrid",
  aromas: ["citrus", "sweet"],
  flavors: ["citrus"],
  effects: ["happy", "uplifted"],
  traits: ["terpy"],
  potency: "moderate",
  primaryAromas: ["citrus"],
};

test("AI inference is a no-op with no provider key", async () => {
  const prevOpenAI = process.env.OPENAI_API_KEY;
  const prevClaude = process.env.ANTHROPIC_API_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  assert.equal(isStrainAIEnabled(), false);
  const map = await inferStrainsAI(["Totally Made Up Strain 9000"]);
  assert.equal(map.size, 0);
  if (prevOpenAI !== undefined) process.env.OPENAI_API_KEY = prevOpenAI;
  if (prevClaude !== undefined) process.env.ANTHROPIC_API_KEY = prevClaude;
});

test("STRAIN_AI=off disables inference even with a key present", async () => {
  const prevKey = process.env.OPENAI_API_KEY;
  const prevFlag = process.env.STRAIN_AI;
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.STRAIN_AI = "off";
  assert.equal(isStrainAIEnabled(), false);
  const map = await inferStrainsAI(["Whatever Strain"]);
  assert.equal(map.size, 0);
  if (prevKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = prevKey;
  if (prevFlag === undefined) delete process.env.STRAIN_AI;
  else process.env.STRAIN_AI = prevFlag;
});

test("activeProvider prefers Claude and falls back by key", async () => {
  const { activeProvider } = await import("../src/lib/ai-provider");
  const prevOpenAI = process.env.OPENAI_API_KEY;
  const prevClaude = process.env.ANTHROPIC_API_KEY;
  const prevPref = process.env.AI_PROVIDER;
  try {
    // No keys → dormant.
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.AI_PROVIDER;
    assert.equal(activeProvider(), null);

    // Default preference is Claude when its key is present.
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    assert.equal(activeProvider(), "claude");

    // Only an OpenAI key → falls back to OpenAI even under the default pref.
    delete process.env.ANTHROPIC_API_KEY;
    process.env.OPENAI_API_KEY = "sk-test";
    assert.equal(activeProvider(), "openai");

    // Explicit openai preference wins when both keys exist.
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    process.env.AI_PROVIDER = "openai";
    assert.equal(activeProvider(), "openai");

    // Preferred openai but no OpenAI key → falls back to Claude.
    delete process.env.OPENAI_API_KEY;
    assert.equal(activeProvider(), "claude");
  } finally {
    if (prevOpenAI === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = prevOpenAI;
    if (prevClaude === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = prevClaude;
    if (prevPref === undefined) delete process.env.AI_PROVIDER;
    else process.env.AI_PROVIDER = prevPref;
  }
});

test("resolveStrain uses an override for an unknown strain", () => {
  const { strain, known } = resolveStrain("Zztest Kush", override("Zztest Kush", ZZ));
  assert.equal(known, false); // an estimate, not curated
  assert.deepEqual(strain.aromas, ["citrus", "sweet"]);
  assert.deepEqual(strain.primaryAromas, ["citrus"]);
});

test("a catalog strain is never shadowed by an override", () => {
  // GG4 is in the catalog — even if an override map carries it, the curated
  // record must win and known stays true.
  const bogus: StrainProfile = { ...ZZ, name: "GG4", aromas: ["floral"] };
  const { strain, known } = resolveStrain("GG4", override("GG4", bogus));
  assert.equal(known, true);
  assert.ok(!strain.aromas.includes("floral"));
});

test("without overrides, behaviour is unchanged (keyword fallback)", () => {
  const { known } = resolveStrain("Zztest Kush");
  assert.equal(known, false);
});

test("analyze scores an unknown strain from the override profile", () => {
  const profile = fakeProfile({
    preferredAromas: ["citrus", "sweet"],
    preferredEffects: ["happy", "uplifted"],
  });
  const { recommendations } = analyze(
    ["Zztest Kush"],
    profile,
    [],
    override("Zztest Kush", ZZ),
  );
  assert.equal(recommendations.length, 1);
  assert.equal(recommendations[0].knownStrain, false);
  assert.ok(recommendations[0].matchedAromas.includes("citrus"));
});
