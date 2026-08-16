// The anonymous homepage's static "sample read" card. Kept as data (not
// hardcoded JSX values) so the displayed category is always derived from
// the real taxonomy — the sample can never contradict the engine the way
// the old hardcoded "82% / Closest Alternative" pair did.

import { categoryForScore } from "./score-taxonomy";

export const HOME_SAMPLE = {
  name: "Triple Double OG",
  score: 76,
  confidence: "medium",
} as const;

export const HOME_SAMPLE_CATEGORY = categoryForScore(HOME_SAMPLE.score);
