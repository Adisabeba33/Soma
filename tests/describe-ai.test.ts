import { test } from "node:test";
import assert from "node:assert/strict";
import { inferProfileAI, isDescribeAIEnabled, mergeInferred } from "../src/lib/describe-ai";
import type { InferredProfile } from "../src/lib/profile-from-experience";

const emptyInferred = (over: Partial<InferredProfile> = {}): InferredProfile => ({
  favoriteStrains: [],
  dislikedStrains: [],
  referenceStrain: "",
  likedTraits: [],
  dislikedTraits: [],
  preferredAromas: [],
  preferredFlavors: [],
  preferredEffects: [],
  dislikedEffects: [],
  dislikedAromas: [],
  texturePreferences: [],
  qualityPriorities: [],
  primaryAroma: "",
  primaryEffect: "",
  useTime: "",
  bodyFeel: null,
  potencyPreference: "",
  preferredFamilies: [],
  avoidedFamilies: [],
  lookingFor: "similar",
  notes: "",
  ...over,
});

test("describe AI is a no-op without OPENAI_API_KEY", async () => {
  const prev = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  assert.equal(isDescribeAIEnabled(), false);
  assert.equal(await inferProfileAI("bright lemon daytime, no anxiety"), null);
  if (prev !== undefined) process.env.OPENAI_API_KEY = prev;
});

test("DESCRIBE_AI=off disables it even with a key", () => {
  const k = process.env.OPENAI_API_KEY;
  const f = process.env.DESCRIBE_AI;
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.DESCRIBE_AI = "off";
  assert.equal(isDescribeAIEnabled(), false);
  if (k === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = k;
  if (f === undefined) delete process.env.DESCRIBE_AI;
  else process.env.DESCRIBE_AI = f;
});

test("merge unions lists and never drops the parser's findings", () => {
  const base = emptyInferred({
    preferredAromas: ["citrus"],
    preferredEffects: ["energetic"],
  });
  const ai: Partial<InferredProfile> = {
    preferredAromas: ["citrus", "gassy"], // adds gassy, keeps citrus
    preferredEffects: ["uplifted"],
    dislikedEffects: ["sleepy"],
  };
  const m = mergeInferred(base, ai);
  assert.deepEqual([...m.preferredAromas].sort(), ["citrus", "gassy"]);
  assert.deepEqual([...m.preferredEffects].sort(), ["energetic", "uplifted"]);
  assert.deepEqual(m.dislikedEffects, ["sleepy"]);
});

test("merge fills empty forced-choice scalars from AI but base wins when set", () => {
  const base = emptyInferred({ primaryAroma: "gas" }); // already set
  const ai: Partial<InferredProfile> = {
    primaryAroma: "citrus", // ignored — base wins
    useTime: "daytime", // base empty → taken
    bodyFeel: 20,
  };
  const m = mergeInferred(base, ai);
  assert.equal(m.primaryAroma, "gas");
  assert.equal(m.useTime, "daytime");
  assert.equal(m.bodyFeel, 20);
});
