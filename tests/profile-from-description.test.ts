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
