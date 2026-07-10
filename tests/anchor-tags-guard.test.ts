// Conscious-change guard for the reference strains' sensory tags.
//
// This test fails when an anchor strain's tags differ from the committed
// snapshot — catching ACCIDENTAL data damage (a bad bulk edit, a stray
// find-and-replace) the moment it happens. It is NOT a freeze: a deliberate
// curator edit is legitimate and one command away —
//
//   npx tsx scripts/update-anchor-snapshot.ts
//
// — regenerate, review the snapshot diff (that diff is the changelog), and
// commit it together with the data change.

import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { STRAINS } from "../src/lib/strain-data";
import { ANCHOR_STRAINS } from "./fixtures/anchor-list";

const snapshot: Record<string, Record<string, unknown>> = JSON.parse(
  readFileSync(join(__dirname, "fixtures", "anchor-tags.json"), "utf8"),
);

describe("anchor strain tags match the committed snapshot", () => {
  it("every listed anchor exists in the catalog and in the snapshot", () => {
    for (const name of ANCHOR_STRAINS) {
      assert.ok(
        STRAINS.some((s) => s.name === name),
        `anchor "${name}" is gone from the catalog — renamed? update fixtures/anchor-list.ts`,
      );
      assert.ok(
        snapshot[name],
        `anchor "${name}" missing from the snapshot — run scripts/update-anchor-snapshot.ts`,
      );
    }
  });

  for (const name of ANCHOR_STRAINS) {
    it(`${name} is unchanged (or the snapshot was consciously updated)`, () => {
      const s = STRAINS.find((x) => x.name === name);
      if (!s || !snapshot[name]) return; // reported by the existence check above
      const live = {
        type: s.type,
        potency: s.potency,
        aromas: s.aromas,
        primaryAromas: s.primaryAromas ?? [],
        traceAromas: s.traceAromas ?? [],
        flavors: s.flavors,
        primaryFlavors: s.primaryFlavors ?? [],
        traceFlavors: s.traceFlavors ?? [],
        effects: s.effects,
        primaryEffects: s.primaryEffects ?? [],
        traits: s.traits,
      };
      assert.deepEqual(
        live,
        snapshot[name],
        `${name}'s tags differ from the committed snapshot. Deliberate curation? ` +
          `Run "npx tsx scripts/update-anchor-snapshot.ts" and commit the diff. ` +
          `Didn't mean to touch ${name}? You just caught accidental data damage.`,
      );
    });
  }
});
