import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { scoreStrain } from "../src/lib/taste-engine";
import { STRAINS } from "../src/lib/strain-data";
import type { TasteProfileInput } from "../src/lib/types";

// Tag weighting (deferred-improvements #3): a preferred tag that lands on a
// strain's PRIMARY (dominant) token should score above one that lands on a
// secondary token, on a partial match. When a strain has no curated
// primaries the scoring is unchanged (opt-in, no-op).

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

describe("primary/secondary tag data invariants", () => {
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

  it("at least the seeded reference strains carry primaries", () => {
    for (const name of ["GG4", "Sour Diesel", "OG Kush"]) {
      const s = STRAINS.find((x) => x.name === name);
      assert.ok(s);
      assert.ok(s.primaryAromas && s.primaryAromas.length > 0, `${name} aroma`);
      assert.ok(s.primaryEffects && s.primaryEffects.length > 0, `${name} effect`);
    }
  });
});

describe("primary outweighs secondary on a partial match (GG4)", () => {
  // GG4: aromas gassy*,earthy*,pine,diesel  (primary = gassy,earthy)
  //      flavors gassy*,earthy*,pine        (primary = gassy,earthy)
  //      effects relaxed*,body-heavy*,euphoric,happy,calm
  // Second preferred tag ("citrus"/"sleepy") is absent from GG4, so each
  // profile matches exactly one tag — only its primary-ness differs.
  it("aroma: matching the primary (gassy) beats the secondary (pine)", () => {
    const primary = scoreStrain("GG4", profile({ preferredAromas: ["gassy", "citrus"] }));
    const secondary = scoreStrain("GG4", profile({ preferredAromas: ["pine", "citrus"] }));
    assert.ok(
      primary.aromaMatch > secondary.aromaMatch,
      `expected primary > secondary, got ${primary.aromaMatch} vs ${secondary.aromaMatch}`,
    );
  });

  it("flavor: matching the primary (gassy) beats the secondary (pine)", () => {
    const primary = scoreStrain("GG4", profile({ preferredFlavors: ["gassy", "citrus"] }));
    const secondary = scoreStrain("GG4", profile({ preferredFlavors: ["pine", "citrus"] }));
    assert.ok(primary.flavorMatch > secondary.flavorMatch);
  });

  it("effect: matching the primary (relaxed) beats the secondary (happy)", () => {
    const primary = scoreStrain("GG4", profile({ preferredEffects: ["relaxed", "sleepy"] }));
    const secondary = scoreStrain("GG4", profile({ preferredEffects: ["happy", "sleepy"] }));
    assert.ok(primary.effectMatch > secondary.effectMatch);
  });

  it("a full single-tag match still maxes out regardless of primary-ness", () => {
    const gassy = scoreStrain("GG4", profile({ preferredAromas: ["gassy"] }));
    const pine = scoreStrain("GG4", profile({ preferredAromas: ["pine"] }));
    assert.equal(gassy.aromaMatch, pine.aromaMatch); // both 100 — weighting only splits partials
  });
});

describe("trace tags score a fraction of a full match (skunky)", () => {
  // Lemon Diesel carries skunky only as a trace (phenotype-dependent);
  // Skunk #1 has it as a full aroma; GG4 not at all. With skunky the sole
  // preferred aroma, each strain's aromaMatch isolates the trace mechanic.
  it("a trace match lands strictly between absent and full", () => {
    const trace = scoreStrain("Lemon Diesel", profile({ preferredAromas: ["skunky"] }));
    const full = scoreStrain("Skunk #1", profile({ preferredAromas: ["skunky"] }));
    const absent = scoreStrain("GG4", profile({ preferredAromas: ["skunky"] }));
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
    const trace = scoreStrain("Lemon Diesel", profile({ preferredAromas: ["skunky"] }));
    const absent = scoreStrain("GG4", profile({ preferredAromas: ["skunky"] }));
    assert.ok(!trace.missingTags.critical.includes("skunky"));
    assert.ok(absent.missingTags.critical.includes("skunky"));
  });

  it("a trace match contributes positive points and is flagged trace in the audit", () => {
    const trace = scoreStrain("Lemon Diesel", profile({ preferredAromas: ["skunky"] }));
    const s = trace.matchStrengths.find((m) => m.token === "skunky");
    assert.ok(s && s.points > 0, "trace skunky should show a small positive strength");
    assert.equal(s?.trace, true, "trace skunky should carry the trace flag");
    // A full match must NOT be flagged trace.
    const full = scoreStrain("Skunk #1", profile({ preferredAromas: ["skunky"] }));
    const fs = full.matchStrengths.find((m) => m.token === "skunky");
    assert.ok(fs && !fs.trace, "a full skunky match must not be flagged trace");
  });
});

describe("no primaries → unchanged (no-op) scoring", () => {
  // Skywalker OG has no curated primaries: aromas gassy,earthy,herbal,spicy.
  it("two equal-count partial matches score identically", () => {
    const a = scoreStrain("Skywalker OG", profile({ preferredAromas: ["gassy", "citrus"] }));
    const b = scoreStrain("Skywalker OG", profile({ preferredAromas: ["earthy", "citrus"] }));
    assert.equal(a.aromaMatch, b.aromaMatch);
  });
});
