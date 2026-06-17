import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { STRAINS, normalizeStrainName } from "../src/lib/strain-data";

// Data-integrity guardrails for the strain catalog. These lock invariants
// that were established/repaired during the June 2026 tag work so future
// edits (or bulk scripts) cannot silently regress them:
//   - every strain carries primary tags (the 1.5x dominant-note layer),
//   - primaries are real subsets of their parent arrays,
//   - no two strains collide under the resolver's normalization (which
//     would make one silently shadow the other in STRAIN_INDEX),
//   - array sizes stay within the curated bounds.

describe("data integrity — primary tags", () => {
  it("every strain has non-empty primaryAromas / primaryFlavors / primaryEffects", () => {
    const missing = STRAINS.filter(
      (s) =>
        !s.primaryAromas?.length ||
        !s.primaryFlavors?.length ||
        !s.primaryEffects?.length,
    ).map((s) => s.name);
    assert.deepEqual(missing, [], `strains missing primary tags: ${missing.join(", ")}`);
  });

  it("every primary* is a subset of its parent array", () => {
    const bad: string[] = [];
    for (const s of STRAINS) {
      const check = (prim: string[] | undefined, full: string[], label: string) => {
        for (const t of prim ?? []) {
          if (!full.includes(t)) bad.push(`${s.name}: ${label} "${t}" not in ${label.replace("primary", "").toLowerCase()}`);
        }
      };
      check(s.primaryAromas, s.aromas, "primaryAromas");
      check(s.primaryFlavors, s.flavors, "primaryFlavors");
      check(s.primaryEffects, s.effects, "primaryEffects");
    }
    assert.deepEqual(bad, [], bad.join("; "));
  });
});

describe("data integrity — resolver uniqueness", () => {
  it("no two distinct strains share a normalized name/alias key", () => {
    const keyToNames = new Map<string, Set<string>>();
    for (const s of STRAINS) {
      for (const label of [s.name, ...(s.aliases ?? [])]) {
        const key = normalizeStrainName(label);
        if (!keyToNames.has(key)) keyToNames.set(key, new Set());
        keyToNames.get(key)!.add(s.name);
      }
    }
    const collisions = [...keyToNames.entries()]
      .filter(([, names]) => names.size > 1)
      .map(([key, names]) => `[${key}] <- ${[...names].join(" || ")}`);
    assert.deepEqual(collisions, [], `name/alias collisions: ${collisions.join("; ")}`);
  });
});

describe("data integrity — array bounds", () => {
  const bounds: Record<string, [number, number]> = {
    aromas: [3, 5],
    flavors: [2, 4],
    effects: [4, 5],
    traits: [2, 7],
  };
  it("aroma/flavor/effect/trait array sizes stay within curated bounds", () => {
    const bad: string[] = [];
    for (const s of STRAINS) {
      for (const [field, [lo, hi]] of Object.entries(bounds)) {
        const n = (s as unknown as Record<string, string[]>)[field].length;
        if (n < lo || n > hi) bad.push(`${s.name}: ${field}=${n} (want ${lo}-${hi})`);
      }
    }
    assert.deepEqual(bad, [], bad.join("; "));
  });
});
