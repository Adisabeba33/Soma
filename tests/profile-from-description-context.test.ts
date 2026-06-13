import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { inferProfileFromDescription } from "../src/lib/profile-from-description";

// The situation/activity layer: people who don't know strain vocabulary
// describe what they want by ACTIVITY ("movie night", "before the gym"),
// not by effect tokens. These cues must resolve to the implied effects.

function effects(text: string) {
  return inferProfileFromDescription(text).preferredEffects;
}

describe("profile-from-description — situation/activity layer", () => {
  it("a party / social cue implies upbeat social effects", () => {
    const e = effects("good for hanging out with friends at a party");
    assert.ok(e.includes("happy"));
    assert.ok(e.includes("giggly"));
    assert.equal(
      inferProfileFromDescription("friends at a party").primaryEffect,
      "social",
    );
  });

  it("exercise cues imply energetic + a daytime slot", () => {
    const r = inferProfileFromDescription("something before the gym");
    assert.ok(r.preferredEffects.includes("energetic"));
    assert.ok(r.preferredEffects.includes("uplifted"));
    assert.equal(r.useTime, "daytime");
  });

  it("outdoors cues imply energetic/uplifted", () => {
    const e = effects("something for hiking and being outdoors");
    assert.ok(e.includes("energetic"));
  });

  it("gaming cues imply focus", () => {
    assert.ok(
      effects("want to play video games and stay locked in").includes("focused"),
    );
  });

  it("'take the edge off after a stressful day' → relaxed/calm + evening", () => {
    const r = inferProfileFromDescription("takes the edge off after a stressful day");
    assert.ok(r.preferredEffects.includes("relaxed"));
    assert.ok(r.preferredEffects.includes("calm"));
    assert.equal(r.useTime, "evening");
  });

  it("movie night implies relaxed/body-heavy and evening", () => {
    const r = inferProfileFromDescription("something for movie night");
    assert.ok(r.preferredEffects.includes("relaxed"));
    assert.ok(r.preferredEffects.includes("body-heavy"));
    assert.equal(r.useTime, "evening");
  });

  it("yoga / meditation implies calm", () => {
    assert.ok(effects("yoga and meditation in the morning").includes("calm"));
  });

  it("does NOT infer effects from a negated activity", () => {
    // "not for the gym" sits in the negated tail — the activity layer reads
    // the positive head only, so no energetic leaks in.
    const e = effects("sweet fruity stuff but not for the gym");
    assert.ok(!e.includes("energetic"));
    assert.ok(!e.includes("uplifted"));
  });

  it("a context vote does not overpower explicit time words", () => {
    // Explicit "at night" must win over a movie→evening context vote.
    const r = inferProfileFromDescription("movie at night before bed");
    assert.equal(r.useTime, "bed");
  });
});
