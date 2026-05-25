import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  getIdentity,
  identitiesInFamily,
  knownAsNames,
} from "../src/lib/strain-identity";
import { IDENTITIES } from "../src/lib/strain-identity-data";
import { STRAINS } from "../src/lib/strain-data";

describe("getIdentity", () => {
  it("returns null for an unknown strain", () => {
    assert.equal(getIdentity("Definitely Not A Real Strain"), null);
  });

  it("returns null for the empty string", () => {
    assert.equal(getIdentity(""), null);
  });

  it("resolves a canonical name to its identity record", () => {
    const id = getIdentity("Wedding Cake");
    assert.ok(id);
    assert.equal(id.canonicalName, "Wedding Cake");
    assert.ok(id.lineage?.parents?.includes("Triangle Kush"));
    assert.equal(id.sensoryFamily, "dessert-cookies");
  });

  it("is case- and punctuation-insensitive (via normalizeStrainName)", () => {
    const a = getIdentity("gg4");
    const b = getIdentity("GG4");
    assert.ok(a && b);
    assert.equal(a.canonicalName, b.canonicalName);
  });
});

describe("identity record invariants", () => {
  it("every identity has a sourceConfidence", () => {
    for (const id of IDENTITIES) {
      assert.ok(
        id.sourceConfidence === "low" ||
          id.sourceConfidence === "medium" ||
          id.sourceConfidence === "high",
        `bad sourceConfidence on ${id.canonicalName}: ${id.sourceConfidence}`,
      );
    }
  });

  it("every identity canonicalName matches a real seed strain", () => {
    const names = new Set(STRAINS.map((s) => s.name));
    for (const id of IDENTITIES) {
      assert.ok(
        names.has(id.canonicalName),
        `${id.canonicalName} not found in strain-data.ts`,
      );
    }
  });

  it("canonical names are unique within the identity set", () => {
    const seen = new Set<string>();
    for (const id of IDENTITIES) {
      assert.ok(
        !seen.has(id.canonicalName),
        `duplicate identity for ${id.canonicalName}`,
      );
      seen.add(id.canonicalName);
    }
  });
});

describe("knownAsNames", () => {
  it("merges parser aliases and identity market names", () => {
    const merged = knownAsNames(
      ["Pink Cookies"],
      getIdentity("Wedding Cake"),
    );
    assert.ok(merged.includes("Pink Cookies"));
    assert.ok(merged.includes("Triangle Mints"));
  });

  it("dedupes case-insensitively", () => {
    const merged = knownAsNames(["GSC", "Cookies"], getIdentity("Girl Scout Cookies"));
    const lower = merged.map((s) => s.toLowerCase());
    assert.equal(new Set(lower).size, lower.length);
  });

  it("returns an empty list when nothing is known", () => {
    assert.deepEqual(knownAsNames(undefined, null), []);
    assert.deepEqual(knownAsNames([], null), []);
  });

  it("works when identity has no marketNames", () => {
    const id = getIdentity("Hindu Kush");
    assert.ok(id && (!id.marketNames || id.marketNames.length === 0));
    const merged = knownAsNames(undefined, id);
    assert.deepEqual(merged, []);
  });
});

describe("identitiesInFamily", () => {
  it("returns multiple members of the same family", () => {
    const dessert = identitiesInFamily("dessert-cookies");
    assert.ok(dessert.includes("Wedding Cake"));
    assert.ok(dessert.includes("Gelato"));
    assert.ok(dessert.length >= 3);
  });

  it("returns empty array for an unknown family key", () => {
    assert.deepEqual(identitiesInFamily("not-a-real-family"), []);
  });
});

describe("scoring pipeline isolation", () => {
  it("identity layer does not modify StrainProfile fields", () => {
    // Spot-check a few seed entries still carry their original sensory arrays
    // after the identity module is loaded.
    const gg4 = STRAINS.find((s) => s.name === "GG4");
    assert.ok(gg4);
    assert.ok(gg4.aromas.includes("gassy"));
    assert.ok(gg4.effects.includes("relaxed"));
  });
});
