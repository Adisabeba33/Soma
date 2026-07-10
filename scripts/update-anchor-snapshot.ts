// Regenerates tests/fixtures/anchor-tags.json — the CONSCIOUS-CHANGE guard
// for the reference strains' sensory tags (see anchor-tags-guard.test.ts).
//
// Run this AFTER deliberately curating an anchor strain's tags:
//
//   npx tsx scripts/update-anchor-snapshot.ts
//
// then commit the updated snapshot together with the data change. The diff
// of the snapshot file IS the curator's changelog for anchor edits.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { STRAINS } from "../src/lib/strain-data";
import { ANCHOR_STRAINS } from "../tests/fixtures/anchor-list";

const snapshot: Record<string, unknown> = {};
for (const name of ANCHOR_STRAINS) {
  const s = STRAINS.find((x) => x.name === name);
  if (!s) {
    console.error(`Anchor "${name}" not found in the catalog — fix the list first.`);
    process.exit(1);
  }
  snapshot[name] = {
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
}

const path = join(__dirname, "..", "tests", "fixtures", "anchor-tags.json");
writeFileSync(path, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Snapshot updated: ${Object.keys(snapshot).length} anchors → ${path}`);
