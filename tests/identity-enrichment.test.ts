import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { IDENTITIES } from "../src/lib/strain-identity-data";
import { TERPENE_VOCAB } from "../src/lib/strain-identity";

// Regression guards for the genetics enrichment data added in PR #24
// (indica/sativa split + top terpenes). Catches drift between identity
// records and the contract the UI relies on.

describe("identity enrichment — indicaSativaSplit", () => {
  it("every split sums to exactly 100", () => {
    for (const id of IDENTITIES) {
      if (!id.indicaSativaSplit) continue;
      const sum = id.indicaSativaSplit.indica + id.indicaSativaSplit.sativa;
      assert.equal(
        sum,
        100,
        `${id.canonicalName}: indica+sativa = ${sum}, expected 100`,
      );
    }
  });

  it("split values are non-negative whole numbers", () => {
    for (const id of IDENTITIES) {
      if (!id.indicaSativaSplit) continue;
      const { indica, sativa } = id.indicaSativaSplit;
      assert.ok(
        Number.isInteger(indica) && indica >= 0,
        `${id.canonicalName}: indica=${indica} must be a non-negative integer`,
      );
      assert.ok(
        Number.isInteger(sativa) && sativa >= 0,
        `${id.canonicalName}: sativa=${sativa} must be a non-negative integer`,
      );
    }
  });
});

describe("identity enrichment — topTerpenes", () => {
  const VOCAB_SET = new Set<string>(TERPENE_VOCAB);

  it("every terpene name comes from TERPENE_VOCAB", () => {
    for (const id of IDENTITIES) {
      if (!id.topTerpenes) continue;
      for (const t of id.topTerpenes) {
        assert.ok(
          VOCAB_SET.has(t.name),
          `${id.canonicalName}: terpene "${t.name}" not in TERPENE_VOCAB`,
        );
      }
    }
  });

  it("terpene percentages are positive numbers under 5%", () => {
    // 5% is a generous ceiling — real flower rarely exceeds 3% on any
    // single terpene. Catches typos like 4.3 instead of 0.43.
    for (const id of IDENTITIES) {
      if (!id.topTerpenes) continue;
      for (const t of id.topTerpenes) {
        assert.ok(
          t.percent > 0 && t.percent < 5,
          `${id.canonicalName}: ${t.name} percent=${t.percent} out of expected (0, 5) range`,
        );
      }
    }
  });

  it("terpenes within a strain are unique", () => {
    for (const id of IDENTITIES) {
      if (!id.topTerpenes) continue;
      const names = id.topTerpenes.map((t) => t.name);
      const unique = new Set(names);
      assert.equal(
        unique.size,
        names.length,
        `${id.canonicalName}: duplicate terpene in topTerpenes`,
      );
    }
  });

  it("each strain lists at most 6 terpenes (UI capacity)", () => {
    for (const id of IDENTITIES) {
      if (!id.topTerpenes) continue;
      assert.ok(
        id.topTerpenes.length <= 6,
        `${id.canonicalName}: topTerpenes has ${id.topTerpenes.length} entries, UI shows max 6`,
      );
    }
  });
});

describe("identity enrichment — coverage target", () => {
  it("PR #24 curates at least 10 strains with split + terpenes", () => {
    const withBoth = IDENTITIES.filter(
      (id) => id.indicaSativaSplit && id.topTerpenes,
    );
    assert.ok(
      withBoth.length >= 10,
      `expected at least 10 fully curated strains, got ${withBoth.length}`,
    );
  });
});
