import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import { STRAINS, normalizeStrainName } from "../src/lib/strain-data";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

// Tag weighting (deferred-improvements #3): a preferred tag that lands on a
// strain's PRIMARY (dominant) token should score above one that lands on a
// secondary token, on a partial match; a TRACE token scores a fraction; no
// curated primaries → unchanged (opt-in, no-op).
//
// MECHANICS run on SYNTHETIC fixtures fed through scoreStrain's `overrides`
// path (names deliberately off-catalog), so curating a real strain's tags
// can never break them — that coupling froze 63 anchor strains for months
// (see docs/sensory-tag-audit-2026-06.md). The intentional data guard for
// reference strains lives in tests/anchor-tags-guard.test.ts instead.

function profile(overrides: Partial<TasteProfileInput> = {}): TasteProfileInput {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    texturePreferences: [],
    qualityPriorities: [],
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
    ...overrides,
  };
}

// The GG4-shaped specimen: two primaries per axis over a wider full list.
const TIERED: StrainProfile = {
  name: "Fixture Tiered",
  type: "hybrid",
  aromas: ["gassy", "earthy", "pine", "diesel"],
  primaryAromas: ["gassy", "earthy"],
  flavors: ["gassy", "earthy", "pine"],
  primaryFlavors: ["gassy", "earthy"],
  effects: ["relaxed", "body-heavy", "euphoric", "happy", "calm"],
  primaryEffects: ["relaxed", "body-heavy"],
  traits: ["gassy", "sticky", "heavy-body"],
  potency: "strong",
};

// Trace mechanics: same nose, skunky at three different tiers.
const TRACE: StrainProfile = {
  name: "Fixture Trace",
  type: "hybrid",
  aromas: ["citrus", "diesel"],
  traceAromas: ["skunky"],
  flavors: ["citrus", "diesel"],
  effects: ["uplifted", "happy"],
  traits: ["terpy"],
  potency: "moderate",
};
const FULL: StrainProfile = {
  ...TRACE,
  name: "Fixture Full",
  aromas: ["citrus", "diesel", "skunky"],
  traceAromas: [],
};
const ABSENT: StrainProfile = {
  ...TRACE,
  name: "Fixture Absent",
  traceAromas: [],
};

// No curated primaries at all — the opt-in no-op case.
const FLAT: StrainProfile = {
  name: "Fixture Flat",
  type: "hybrid",
  aromas: ["gassy", "earthy", "herbal", "spicy"],
  flavors: ["gassy", "earthy"],
  effects: ["relaxed", "happy"],
  traits: ["earthy"],
  potency: "strong",
};

const OVERRIDES = new Map(
  [TIERED, TRACE, FULL, ABSENT, FLAT].map((s) => [
    normalizeStrainName(s.name),
    s,
  ]),
);

const score = (name: string, p: TasteProfileInput) =>
  scoreStrain(name, p, [], OVERRIDES);

describe("primary/secondary tag data invariants (whole catalog)", () => {
  it("every primary subset is contained in its full array", () => {
    for (const s of STRAINS) {
      const check = (
        primary: string[] | undefined,
        full: string[],
        kind: string,
      ) => {
        if (!primary) return;
        const set = new Set(full);
        for (const p of primary) {
          assert.ok(
            set.has(p),
            `${s.name}: primary ${kind} "${p}" not in ${kind} list`,
          );
        }
      };
      check(s.primaryAromas, s.aromas, "aroma");
      check(s.primaryFlavors, s.flavors, "flavor");
      check(s.primaryEffects, s.effects, "effect");
    }
  });

  it("every catalog strain carries curated primaries (coverage reached 100% in 2026-07)", () => {
    for (const s of STRAINS) {
      assert.ok(s.primaryAromas && s.primaryAromas.length > 0, `${s.name} aroma`);
      assert.ok(s.primaryEffects && s.primaryEffects.length > 0, `${s.name} effect`);
    }
  });
});

describe("primary outweighs secondary on a partial match", () => {
  // Second preferred tag ("citrus"/"sleepy") is absent from the fixture, so
  // each profile matches exactly one tag — only its primary-ness differs.
  it("aroma: matching the primary (gassy) beats the secondary (pine)", () => {
    const primary = score("Fixture Tiered", profile({ preferredAromas: ["gassy", "citrus"] }));
    const secondary = score("Fixture Tiered", profile({ preferredAromas: ["pine", "citrus"] }));
    assert.ok(
      primary.aromaMatch > secondary.aromaMatch,
      `expected primary > secondary, got ${primary.aromaMatch} vs ${secondary.aromaMatch}`,
    );
  });

  it("flavor: matching the primary (gassy) beats the secondary (pine)", () => {
    const primary = score("Fixture Tiered", profile({ preferredFlavors: ["gassy", "citrus"] }));
    const secondary = score("Fixture Tiered", profile({ preferredFlavors: ["pine", "citrus"] }));
    assert.ok(primary.flavorMatch > secondary.flavorMatch);
  });

  it("effect: matching the primary (relaxed) beats the secondary (happy)", () => {
    const primary = score("Fixture Tiered", profile({ preferredEffects: ["relaxed", "sleepy"] }));
    const secondary = score("Fixture Tiered", profile({ preferredEffects: ["happy", "sleepy"] }));
    assert.ok(primary.effectMatch > secondary.effectMatch);
  });

  it("a full single-tag match still maxes out regardless of primary-ness", () => {
    const gassy = score("Fixture Tiered", profile({ preferredAromas: ["gassy"] }));
    const pine = score("Fixture Tiered", profile({ preferredAromas: ["pine"] }));
    assert.equal(gassy.aromaMatch, pine.aromaMatch); // both 100 — weighting only splits partials
  });
});

describe("trace tags score a fraction of a full match", () => {
  it("a trace match lands strictly between absent and full", () => {
    const trace = score("Fixture Trace", profile({ preferredAromas: ["skunky"] }));
    const full = score("Fixture Full", profile({ preferredAromas: ["skunky"] }));
    const absent = score("Fixture Absent", profile({ preferredAromas: ["skunky"] }));
    assert.ok(
      trace.aromaMatch > absent.aromaMatch && trace.aromaMatch < full.aromaMatch,
      `expected absent ${absent.aromaMatch} < trace ${trace.aromaMatch} < full ${full.aromaMatch}`,
    );
    // ~33% of the bonus a full match earns over the no-match baseline.
    const ratio =
      (trace.aromaMatch - absent.aromaMatch) /
      (full.aromaMatch - absent.aromaMatch);
    assert.ok(
      Math.abs(ratio - 0.33) < 0.05,
      `trace bonus ratio ${ratio.toFixed(2)} should be ≈ 0.33`,
    );
  });

  it("a trace note is not reported as missing, but an absent one is", () => {
    const trace = score("Fixture Trace", profile({ preferredAromas: ["skunky"] }));
    const absent = score("Fixture Absent", profile({ preferredAromas: ["skunky"] }));
    assert.ok(!trace.missingTags.critical.includes("skunky"));
    assert.ok(absent.missingTags.critical.includes("skunky"));
  });

  it("a trace match contributes positive points and is flagged trace in the audit", () => {
    const trace = score("Fixture Trace", profile({ preferredAromas: ["skunky"] }));
    const s = trace.matchStrengths.find((m) => m.token === "skunky");
    assert.ok(s && s.points > 0, "trace skunky should show a small positive strength");
    assert.equal(s?.trace, true, "trace skunky should carry the trace flag");
    // A full match must NOT be flagged trace.
    const full = score("Fixture Full", profile({ preferredAromas: ["skunky"] }));
    const fs = full.matchStrengths.find((m) => m.token === "skunky");
    assert.ok(fs && !fs.trace, "a full skunky match must not be flagged trace");
  });
});

describe("preferred lists are kept to their own vocab", () => {
  // The combined aroma/flavour picker used to write the same selection into
  // both axes, parking flavour-only tokens (nutty) in preferredAromas where
  // they can never match — showing forever as Critical Missing.
  it("a flavour-only token in preferredAromas is not reported as a critical (aroma) miss", () => {
    const r = score("Fixture Tiered", profile({ preferredAromas: ["gassy", "nutty"] }));
    assert.ok(
      !r.missingTags.critical.includes("nutty"),
      "nutty is a flavour, not an aroma — it must not pollute Critical Missing",
    );
  });

  it("a valid aroma miss is still reported", () => {
    const r = score("Fixture Tiered", profile({ preferredAromas: ["gassy", "skunky"] }));
    assert.ok(r.missingTags.critical.includes("skunky"));
  });
});

describe("no primaries → unchanged (no-op) scoring", () => {
  it("two equal-count partial matches score identically", () => {
    const a = score("Fixture Flat", profile({ preferredAromas: ["gassy", "citrus"] }));
    const b = score("Fixture Flat", profile({ preferredAromas: ["earthy", "citrus"] }));
    assert.equal(a.aromaMatch, b.aromaMatch);
  });
});
