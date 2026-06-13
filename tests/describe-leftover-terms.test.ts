import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { describeLeftoverTerms } from "../src/lib/profile-from-description";

// describeLeftoverTerms returns the content words a description used that
// mapped to NO trigger — the growth signal for new synonyms (#18).

describe("describeLeftoverTerms", () => {
  it("returns nothing for an empty description", () => {
    assert.deepEqual(describeLeftoverTerms(""), []);
    assert.deepEqual(describeLeftoverTerms("   "), []);
  });

  it("words the parser understood are NOT reported as leftovers", () => {
    // Every content word here is a known trigger.
    const left = describeLeftoverTerms("sweet citrus and gassy");
    assert.ok(!left.includes("sweet"));
    assert.ok(!left.includes("citrus"));
    assert.ok(!left.includes("gassy"));
  });

  it("unrecognised content words ARE reported", () => {
    // "zkittlez" and "gushers" aren't in any trigger yet.
    const left = describeLeftoverTerms("something like zkittlez or gushers");
    assert.ok(left.includes("zkittlez"));
    assert.ok(left.includes("gushers"));
  });

  it("filler / stopwords are stripped", () => {
    const left = describeLeftoverTerms("I really just want something nice for the day");
    // "really", "just", "want", "something", "nice", "for", "the", "day" are
    // all filler — nothing of value remains.
    assert.deepEqual(left, []);
  });

  it("recognised activity words don't leak into leftovers", () => {
    // "gym" is a context trigger; "tuesday" is a real leftover.
    const left = describeLeftoverTerms("before the gym on tuesday");
    assert.ok(!left.includes("gym"));
    assert.ok(left.includes("tuesday"));
  });

  it("dedupes and drops tiny words", () => {
    const left = describeLeftoverTerms("wibble wibble tv ok");
    assert.equal(left.filter((t) => t === "wibble").length, 1);
    assert.ok(!left.includes("tv")); // length < 3
  });
});
