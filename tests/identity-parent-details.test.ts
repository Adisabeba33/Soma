import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { IDENTITIES } from "../src/lib/strain-identity-data";

// Regression guard for the parentDetails fallback added to support
// non-catalog grandparents in the Genetics block. If you typo a parent
// name or rename a parent without updating the detail key, the UI
// silently falls back to "just the name" — this test catches the drift
// instead.

describe("identity — parentDetails ⊆ parents", () => {
  it("every parentDetails key matches a name in parents", () => {
    for (const id of IDENTITIES) {
      const details = id.lineage?.parentDetails;
      if (!details) continue;
      const parents = new Set(id.lineage?.parents ?? []);
      for (const key of Object.keys(details)) {
        assert.ok(
          parents.has(key),
          `${id.canonicalName}: parentDetails has "${key}" which isn't in parents ${JSON.stringify([...parents])}`,
        );
      }
    }
  });

  it("each detail carries at least one populated field", () => {
    // An empty {} key would render as a useless fallback. Surface it.
    for (const id of IDENTITIES) {
      const details = id.lineage?.parentDetails;
      if (!details) continue;
      for (const [key, value] of Object.entries(details)) {
        const hasSomething = Boolean(value.lineageBrief) || Boolean(value.type);
        assert.ok(
          hasSomething,
          `${id.canonicalName}: parentDetails["${key}"] has no lineageBrief or type — drop the entry or fill it in`,
        );
      }
    }
  });
});

describe("identity — parentDetails coverage demo", () => {
  it("at least 5 strains paint grandparent fallbacks", () => {
    const withDetails = IDENTITIES.filter(
      (id) =>
        id.lineage?.parentDetails &&
        Object.keys(id.lineage.parentDetails).length > 0,
    );
    assert.ok(
      withDetails.length >= 5,
      `expected ≥5 strains using parentDetails as a demo, got ${withDetails.length}`,
    );
  });
});
