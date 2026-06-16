import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { STRAINS } from "../src/lib/strain-data";
import {
  AROMAS,
  EFFECTS,
  FLAVORS,
  LIKED_TRAITS,
} from "../src/lib/vocab";

// Regression guard against the "phantom tokens" bug.
//
// Before vocab v2 the strain catalog used aroma/flavor tokens that
// didn't exist in the questionnaire vocab:
//   aromas:  vanilla  (used by 4 strains)
//   flavors: diesel   (used by 11 strains)
//   flavors: floral   (used by 4 strains)
//   flavors: cheese   (used by 3 strains)
// Users physically could not pick those tokens in the questionnaire,
// so 22 strain-tag pairs were unreachable through preference matching.
//
// These tests fail fast if anyone re-introduces an unreachable token —
// either by adding a new strain with a token that isn't in vocab, or
// by removing a token from vocab while strains still tag it.

function collectStrainTokens(axis: "aromas" | "flavors" | "effects" | "traits") {
  const seen = new Set<string>();
  for (const s of STRAINS) {
    for (const token of s[axis]) seen.add(token);
  }
  return seen;
}

function vocabSet(options: { value: string }[]) {
  return new Set(options.map((o) => o.value));
}

describe("vocab consistency — no phantom tokens", () => {
  it("every aroma used in strain-data exists in AROMAS vocab", () => {
    const used = collectStrainTokens("aromas");
    const vocab = vocabSet(AROMAS);
    const phantom = [...used].filter((t) => !vocab.has(t));
    assert.deepEqual(
      phantom,
      [],
      `Strains carry aroma tokens absent from AROMAS vocab — users can't select them: ${JSON.stringify(phantom)}`,
    );
  });

  it("every flavor used in strain-data exists in FLAVORS vocab", () => {
    const used = collectStrainTokens("flavors");
    const vocab = vocabSet(FLAVORS);
    const phantom = [...used].filter((t) => !vocab.has(t));
    assert.deepEqual(
      phantom,
      [],
      `Strains carry flavor tokens absent from FLAVORS vocab: ${JSON.stringify(phantom)}`,
    );
  });

  it("every effect used in strain-data exists in EFFECTS vocab", () => {
    const used = collectStrainTokens("effects");
    const vocab = vocabSet(EFFECTS);
    const phantom = [...used].filter((t) => !vocab.has(t));
    assert.deepEqual(
      phantom,
      [],
      `Strains carry effect tokens absent from EFFECTS vocab: ${JSON.stringify(phantom)}`,
    );
  });

  it("every liked trait used in strain-data exists in LIKED_TRAITS vocab", () => {
    const used = collectStrainTokens("traits");
    const vocab = vocabSet(LIKED_TRAITS);
    const phantom = [...used].filter((t) => !vocab.has(t));
    assert.deepEqual(
      phantom,
      [],
      `Strains carry trait tokens absent from LIKED_TRAITS vocab: ${JSON.stringify(phantom)}`,
    );
  });

  it("every trace aroma exists in AROMAS vocab and is disjoint from aromas", () => {
    const vocab = vocabSet(AROMAS);
    for (const s of STRAINS) {
      if (!s.traceAromas) continue;
      const full = new Set(s.aromas);
      for (const t of s.traceAromas) {
        assert.ok(
          vocab.has(t),
          `${s.name}: trace aroma "${t}" absent from AROMAS vocab`,
        );
        assert.ok(
          !full.has(t),
          `${s.name}: "${t}" is both a full and a trace aroma — pick one`,
        );
      }
    }
  });

  it("every trace flavour exists in FLAVORS vocab and is disjoint from flavors", () => {
    const vocab = vocabSet(FLAVORS);
    for (const s of STRAINS) {
      if (!s.traceFlavors) continue;
      const full = new Set(s.flavors);
      for (const t of s.traceFlavors) {
        assert.ok(
          vocab.has(t),
          `${s.name}: trace flavour "${t}" absent from FLAVORS vocab`,
        );
        assert.ok(
          !full.has(t),
          `${s.name}: "${t}" is both a full and a trace flavour — pick one`,
        );
      }
    }
  });

  it("vocab entries are unique (no duplicate values within a list)", () => {
    for (const [name, list] of [
      ["AROMAS", AROMAS],
      ["FLAVORS", FLAVORS],
      ["EFFECTS", EFFECTS],
      ["LIKED_TRAITS", LIKED_TRAITS],
    ] as const) {
      const seen = new Set<string>();
      const dupes: string[] = [];
      for (const opt of list) {
        if (seen.has(opt.value)) dupes.push(opt.value);
        seen.add(opt.value);
      }
      assert.deepEqual(
        dupes,
        [],
        `${name} has duplicate values: ${JSON.stringify(dupes)}`,
      );
    }
  });
});

describe("vocab v2 — phantom token fix verification", () => {
  it("AROMAS contains vanilla (vocab v2 addition)", () => {
    assert.ok(AROMAS.some((o) => o.value === "vanilla"));
  });

  it("FLAVORS contains diesel/floral/cheese (vocab v2 additions)", () => {
    assert.ok(FLAVORS.some((o) => o.value === "diesel"));
    assert.ok(FLAVORS.some((o) => o.value === "floral"));
    assert.ok(FLAVORS.some((o) => o.value === "cheese"));
  });

  it("strains carrying the previously-phantom tokens are now reachable", () => {
    const vanillaAromaStrains = STRAINS.filter((s) =>
      s.aromas.includes("vanilla"),
    );
    const dieselFlavorStrains = STRAINS.filter((s) =>
      s.flavors.includes("diesel"),
    );
    assert.ok(
      vanillaAromaStrains.length >= 1,
      "expected at least one strain with vanilla aroma to validate the fix",
    );
    assert.ok(
      dieselFlavorStrains.length >= 1,
      "expected at least one strain with diesel flavor to validate the fix",
    );
  });
});
