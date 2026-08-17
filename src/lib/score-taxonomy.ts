// Score taxonomy — the single source of truth for how a match score is
// named, described and colored, everywhere a verdict is shown (results
// list, recommendation card, Compare, homepage sample, docs, tests).
//
// SŌMA has exactly ONE visible verdict scale: the engine's five sensory
// categories below. There is deliberately no second purchase-value scale —
// money-worthiness / buy-confidence claims are banned while purchase
// confidence (src/lib/purchase-confidence.ts) returns every signal as
// "unknown" (tests/score-taxonomy.test.ts enforces this over all of src/).
// A match score means "this fits your taste profile", never "this jar is
// good" or "this is good value". See docs/PRODUCT_DECISIONS.md 1–2.

import type { Category } from "./types";

// Highest first. `categorize()` in taste-engine.ts maps the raw score
// through these thresholds and may then cap the category downward when
// the strain conflicts with the profile (dislikes/risks) — so a card can
// legitimately show a category lower than its raw score implies. That is
// why groups and cards must key off `match.category`, never re-derive a
// verdict from the score alone.
export const CATEGORY_THRESHOLDS: ReadonlyArray<{
  min: number;
  category: Category;
}> = [
  { min: 80, category: "Best Match" },
  { min: 66, category: "Closest Alternative" },
  { min: 50, category: "Worth Trying" },
  { min: 36, category: "Risky" },
  { min: 0, category: "Avoid" },
];

// Low → high, used for conflict-cap comparisons and ordering sections.
export const CATEGORY_ORDER: readonly Category[] = [
  "Avoid",
  "Risky",
  "Worth Trying",
  "Closest Alternative",
  "Best Match",
];

export function categoryForScore(score: number): Category {
  for (const t of CATEGORY_THRESHOLDS) {
    if (score >= t.min) return t.category;
  }
  return "Avoid";
}

export function categoryRank(category: Category): number {
  return CATEGORY_ORDER.indexOf(category);
}

export interface CategoryMeta {
  // One-line sensory description. Speaks only about fit with the user's
  // taste profile — never about money, batch quality or buying.
  hint: string;
  // Tailwind tone tokens. Keep these as full literal class names so the
  // Tailwind scanner picks them up (src/lib is in tailwind content globs).
  tone: string;
  bar: string;
  dot: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "Best Match": {
    hint: "Closest to your taste profile — strong sensory fit.",
    tone: "text-accent",
    bar: "bg-accent",
    dot: "bg-accent",
  },
  "Closest Alternative": {
    hint: "Close to your taste, with small trade-offs.",
    tone: "text-brass",
    bar: "bg-brass",
    dot: "bg-brass",
  },
  "Worth Trying": {
    hint: "Partial fit — some of what you like, some gaps.",
    tone: "text-foreground",
    bar: "bg-foreground/65",
    dot: "bg-foreground/55",
  },
  Risky: {
    hint: "Clashes with things you avoid — read the watch-outs first.",
    tone: "text-[#b4791f]",
    bar: "bg-[#b4791f]",
    dot: "bg-[#b4791f]",
  },
  Avoid: {
    hint: "Poor sensory fit for your profile.",
    tone: "text-[#a23b2c]",
    bar: "bg-[#a23b2c]",
    dot: "bg-[#a23b2c]",
  },
};

// Sections for grouped result lists, best first.
export const CATEGORY_SECTIONS: readonly Category[] = [
  ...CATEGORY_ORDER,
].reverse();
