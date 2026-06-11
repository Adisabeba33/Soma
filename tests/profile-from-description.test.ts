import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { inferProfileFromDescription as parse } from "../src/lib/profile-from-description";

describe("inferProfileFromDescription — empty / noise", () => {
  it("empty input yields an empty profile", () => {
    const p = parse("");
    assert.deepEqual(p.preferredAromas, []);
    assert.deepEqual(p.preferredEffects, []);
    assert.deepEqual(p.dislikedEffects, []);
    assert.equal(p.useTime, "");
    assert.equal(p.primaryAroma, "");
    assert.equal(p.bodyFeel, null);
    assert.equal(p.lookingFor, "similar");
  });

  it("keeps the original text in notes", () => {
    assert.equal(parse("  hello world ").notes, "hello world");
  });
});

describe("inferProfileFromDescription — aromas", () => {
  it("maps natural words to canonical aroma + flavor tokens", () => {
    const p = parse("sweet fruity candy");
    assert.ok(p.preferredAromas.includes("sweet"));
    assert.ok(p.preferredAromas.includes("fruity"));
    assert.ok(p.preferredFlavors.includes("sweet"));
  });

  it("maps lemon → citrus, fuel → gassy", () => {
    const p = parse("lemon and fuel");
    assert.ok(p.preferredAromas.includes("citrus"));
    assert.ok(p.preferredAromas.includes("gassy"));
  });

  it("sets primaryAroma to the dominant family", () => {
    // gassy + diesel → both the "gas" family → clear winner.
    const p = parse("gassy diesel fuel");
    assert.equal(p.primaryAroma, "gas");
  });

  it("leaves primaryAroma blank when families tie", () => {
    const p = parse("citrus and sweet");
    assert.equal(p.primaryAroma, "");
  });
});

describe("inferProfileFromDescription — effects & negation", () => {
  it("captures wanted effects", () => {
    const p = parse("I want to feel relaxed and focused");
    assert.ok(p.preferredEffects.includes("relaxed"));
    assert.ok(p.preferredEffects.includes("focused"));
    assert.deepEqual(p.dislikedEffects, []);
  });

  it("routes negated effects to dislikedEffects", () => {
    const p = parse("uplifting but not sleepy");
    assert.ok(p.preferredEffects.includes("uplifted"));
    assert.ok(p.dislikedEffects.includes("sleepy"));
    assert.ok(!p.preferredEffects.includes("sleepy"));
  });

  it("handles 'nothing that knocks me out' as a disliked sleepy effect", () => {
    const p = parse("something for the daytime, nothing that knocks me out");
    assert.ok(p.dislikedEffects.includes("sleepy"));
    assert.equal(p.useTime, "daytime");
  });
});

describe("inferProfileFromDescription — use-time", () => {
  it("sets a single clear use-time", () => {
    assert.equal(parse("good for the evening to unwind").useTime, "evening");
    assert.equal(parse("right before bed").useTime, "bed");
  });

  it("leaves use-time blank when two times conflict (stays multi-modal)", () => {
    const p = parse("candy for the daytime and gas for the evening");
    assert.equal(p.useTime, "");
  });
});

describe("inferProfileFromDescription — body-feel & novelty", () => {
  it("reads heavy vs light body language", () => {
    assert.ok((parse("heavy couch-lock body stone").bodyFeel ?? 0) > 60);
    assert.ok((parse("light, clear-headed and functional").bodyFeel ?? 100) < 40);
  });

  it("detects an appetite for novelty", () => {
    assert.equal(parse("surprise me with something new").lookingFor, "new");
    assert.equal(parse("more of what I already like").lookingFor, "similar");
  });
});

describe("PR A — forward-scope negation (ISSUE-1)", () => {
  it("keeps positives before a 'without' and only negates what follows", () => {
    const p = parse("citrus and giggly without frying my brain");
    assert.ok(p.preferredAromas.includes("citrus"));
    assert.ok(p.preferredEffects.includes("giggly"));
    assert.ok(p.dislikedEffects.includes("head-high")); // "frying my brain"
    assert.ok(!p.preferredEffects.includes("head-high"));
  });

  it("recovers daytime aromas swallowed by a later negation", () => {
    const p = parse(
      "bright citrus and tropical that keeps me giggly without getting too heady",
    );
    assert.ok(p.preferredAromas.includes("citrus"));
    assert.ok(p.preferredAromas.includes("tropical"));
    assert.ok(p.preferredEffects.includes("giggly"));
  });
});

describe("PR A — couch-lock matching (ISSUE-4)", () => {
  it("matches couch phrasings and the hyphenated term", () => {
    assert.ok(parse("melt into the couch").preferredEffects.includes("couch-lock"));
    assert.ok(parse("pins me to the couch").preferredEffects.includes("couch-lock"));
    assert.ok(parse("I avoid couch-lock").dislikedEffects.includes("couch-lock"));
  });
});

describe("PR A — comparatives (ISSUE-7)", () => {
  it("'more X than Y' keeps X, drops Y (not disliked)", () => {
    const p = parse("more relaxing than energizing");
    assert.ok(p.preferredEffects.includes("relaxed"));
    assert.ok(!p.preferredEffects.includes("energetic"));
    assert.ok(!p.dislikedEffects.includes("energetic"));
  });
});

describe("PR A — slang & synonyms (ISSUE-3/3a)", () => {
  it("maps very-high and sleep slang and 'social'", () => {
    assert.ok(parse("gets me zooted").preferredEffects.includes("euphoric"));
    assert.ok(parse("I just want to zonk out").preferredEffects.includes("sleepy"));
    assert.ok(parse("keeps me social").preferredEffects.includes("happy"));
  });
});

describe("PR A — time idioms (ISSUE-5)", () => {
  it("recognises indirect/slang time phrases", () => {
    assert.equal(parse("perfect after a long day").useTime, "evening");
    assert.equal(parse("a wake and bake strain").useTime, "morning");
  });
});

describe("inferProfileFromDescription — worked example", () => {
  it("parses a rich daytime/evening description", () => {
    const p = parse(
      "I love sweet fruity candy strains, gassy diesel in the evening, focused for work, nothing too heavy that knocks me out",
    );
    assert.ok(p.preferredAromas.includes("sweet"));
    assert.ok(p.preferredAromas.includes("gassy"));
    assert.ok(p.preferredEffects.includes("focused"));
    assert.ok(p.dislikedEffects.includes("sleepy"));
  });
});
