// Time-of-day bucketing for the Taste Match hero / active-profile card.

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { timeProfileForHour, TIME_HEADLINE } from "../src/lib/time-of-day";

describe("timeProfileForHour", () => {
  it("maps each hour to exactly one of the four moods", () => {
    for (let h = 0; h < 24; h++) {
      const tp = timeProfileForHour(h);
      assert.ok(
        ["morning", "daytime", "sunset", "night"].includes(tp),
        `hour ${h} → ${tp} should be a valid TimeProfile`,
      );
    }
  });

  it("buckets the boundaries the way the headline expects", () => {
    assert.equal(timeProfileForHour(5), "morning"); // dawn opens morning
    assert.equal(timeProfileForHour(10), "morning");
    assert.equal(timeProfileForHour(11), "daytime");
    assert.equal(timeProfileForHour(16), "daytime");
    assert.equal(timeProfileForHour(17), "sunset");
    assert.equal(timeProfileForHour(20), "sunset");
    assert.equal(timeProfileForHour(21), "night");
    assert.equal(timeProfileForHour(4), "night"); // small hours
    assert.equal(timeProfileForHour(0), "night");
  });

  it("night reads as 'tonight', morning as 'this morning'", () => {
    assert.equal(TIME_HEADLINE[timeProfileForHour(23)], "tonight");
    assert.equal(TIME_HEADLINE[timeProfileForHour(8)], "this morning");
    assert.equal(TIME_HEADLINE[timeProfileForHour(13)], "today");
    assert.equal(TIME_HEADLINE[timeProfileForHour(19)], "this evening");
  });
});
