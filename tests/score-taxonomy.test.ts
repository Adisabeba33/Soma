import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  CATEGORY_META,
  CATEGORY_ORDER,
  CATEGORY_SECTIONS,
  CATEGORY_THRESHOLDS,
  categoryForScore,
  categoryRank,
} from "../src/lib/score-taxonomy";
import { HOME_SAMPLE, HOME_SAMPLE_CATEGORY } from "../src/lib/home-sample";
import { scoreStrain } from "../src/lib/taste-engine";
import type { Category, TasteProfileInput } from "../src/lib/types";

describe("score taxonomy — boundaries", () => {
  // Every threshold edge, from both sides. These pins are the contract:
  // moving a boundary is a product decision, not a refactor side-effect.
  const cases: Array<[number, Category]> = [
    [0, "Avoid"],
    [35, "Avoid"],
    [36, "Risky"],
    [49, "Risky"],
    [50, "Worth Trying"],
    [65, "Worth Trying"],
    [66, "Closest Alternative"],
    [79, "Closest Alternative"],
    [80, "Best Match"],
    [100, "Best Match"],
  ];
  for (const [score, expected] of cases) {
    it(`score ${score} → ${expected}`, () => {
      assert.equal(categoryForScore(score), expected);
    });
  }

  it("thresholds are sorted highest-first and start at 0", () => {
    for (let i = 1; i < CATEGORY_THRESHOLDS.length; i++) {
      assert.ok(CATEGORY_THRESHOLDS[i].min < CATEGORY_THRESHOLDS[i - 1].min);
    }
    assert.equal(CATEGORY_THRESHOLDS[CATEGORY_THRESHOLDS.length - 1].min, 0);
  });

  it("order, sections and meta cover exactly the five categories", () => {
    const all = new Set<Category>([
      "Best Match",
      "Closest Alternative",
      "Worth Trying",
      "Risky",
      "Avoid",
    ]);
    assert.deepEqual(new Set(CATEGORY_ORDER), all);
    assert.deepEqual(new Set(CATEGORY_SECTIONS), all);
    assert.deepEqual(new Set(Object.keys(CATEGORY_META)), all);
    assert.equal(CATEGORY_SECTIONS[0], "Best Match");
    assert.ok(categoryRank("Best Match") > categoryRank("Avoid"));
  });
});

describe("score taxonomy — engine agreement", () => {
  it("scoreStrain never returns a category above what the raw score implies", () => {
    // Conflict caps may lower the category, never raise it (favorites are
    // the one deliberate exception: anchors pin to Best Match by design).
    const profile: TasteProfileInput = {
      favoriteStrains: [],
      dislikedStrains: [],
      likedTraits: [],
      dislikedTraits: [],
      preferredAromas: ["earthy"],
      preferredFlavors: [],
      preferredEffects: ["relaxed"],
      texturePreferences: [],
      qualityPriorities: [],
      referenceStrain: null,
      lookingFor: "similar",
      notes: null,
    };
    const match = scoreStrain("GG4", profile);
    assert.ok(
      categoryRank(match.category) <=
        categoryRank(categoryForScore(match.matchScore)),
      `${match.category} exceeds ${categoryForScore(match.matchScore)} for score ${match.matchScore}`,
    );
  });
});

describe("score taxonomy — copy honesty", () => {
  it("category hints speak about sensory fit, not money or buying", () => {
    for (const meta of Object.values(CATEGORY_META)) {
      assert.doesNotMatch(meta.hint.toLowerCase(), /money|buy|purchase|price|worth/);
    }
  });

  it("every category has a compact label, and it never sells a purchase", () => {
    // The compact label is the SAME scale rendered small (chips, cards). It
    // must exist for every category so a narrow surface can't invent its own
    // wording, and it is held to the same honesty rule as the hints.
    for (const [category, meta] of Object.entries(CATEGORY_META)) {
      assert.ok(
        meta.short.length > 0 && meta.short.length <= 16,
        `${category} needs a short label that fits a chip`,
      );
      assert.doesNotMatch(meta.short.toLowerCase(), /money|buy|purchase|price/);
    }
  });

  it("homepage sample is consistent with the taxonomy", () => {
    assert.equal(HOME_SAMPLE_CATEGORY, categoryForScore(HOME_SAMPLE.score));
    // The sample narrative describes a close-but-not-perfect read; pin the
    // category so a score edit can't silently break the story around it.
    assert.equal(HOME_SAMPLE_CATEGORY, "Closest Alternative");
  });

  it("no UI source contains purchase-value verdict copy", () => {
    // The old three-tier framing must not creep back anywhere in src/.
    // \s+ between words: JSX copy wraps across lines, and a wrapped
    // "worth your\n  money" evaded the first literal-space version.
    const banned = [
      /worth\s+your\s+money/i,
      /buy\s+with\s+confidence/i,
      /save\s+your\s+money/i,
      /worth\s+a\s+shot/i,
      /waste\s+of\s+money/i,
      /use\s+of\s+your\s+money/i,
      /save\s+you\s+money/i,
    ];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) walk(p);
        else if (/\.(ts|tsx)$/.test(name)) {
          const text = readFileSync(p, "utf8");
          for (const re of banned) {
            if (re.test(text)) offenders.push(`${p}: ${re}`);
          }
        }
      }
    };
    walk(join(__dirname, "..", "src"));
    assert.deepEqual(offenders, []);
  });
});
