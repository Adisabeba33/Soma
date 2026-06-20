// Profile completeness — how much sharpening signal a taste profile carries.
//
// This drives the onboarding "you're at 60%" indicator, the persistent
// finish-your-profile nudge, and the ring on the profile page. It is NOT a
// score of the user and never gates anything: a partial profile still matches,
// just with a broader (noisier) target. The weighting mirrors what the engine
// actually leans on (src/lib/profile-target.ts): the forced-choice target
// fields — primaryEffect + useTime + primaryAroma — are the highest-value
// signal, so they make up the "base" 60%. Depth layers (favourites, body-feel,
// potency, avoid lists, families…) refine the target the rest of the way to
// 100%.
//
// Design notes:
//   - "Base" (60) is exactly what the /onboarding/quick four-tap flow captures,
//     so finishing quick lands a user right around 60% — the threshold where we
//     offer "good enough" vs "finish for a sharper match".
//   - Weights are tunable; the only invariants the tests pin are: empty = 0,
//     full = 100, monotonic (adding signal never lowers the percent), and the
//     post-quick base sits in the ~55–60 band.

import {
  isPrimaryAroma,
  isPrimaryEffect,
  isUseTime,
  isSmokingMethod,
} from "./profile-target";
import type { TasteProfileInput } from "./types";

const nonEmpty = (v: unknown): boolean => Array.isArray(v) && v.length > 0;
const hasText = (v: unknown): boolean =>
  typeof v === "string" && v.trim().length > 0;

// One scorable signal: its weight, whether the profile carries it, and the
// human hint shown in "what's missing". `section` points at where to fill it.
export interface CompletenessItem {
  key: string;
  label: string;
  weight: number;
  filled: boolean;
  section: "base" | "depth";
}

function items(p: TasteProfileInput): CompletenessItem[] {
  const avoidEffects = nonEmpty(p.dislikedEffects);
  const familiesSet = nonEmpty(p.preferredFamilies) || nonEmpty(p.avoidedFamilies);
  const extras =
    nonEmpty(p.qualityPriorities) ||
    nonEmpty(p.texturePreferences) ||
    hasText(p.notes);

  return [
    // ── Base (60): the forced-choice target + the primary avoid signal ──
    {
      key: "primaryEffect",
      label: "The one effect you want most",
      weight: 18,
      filled: isPrimaryEffect(p.primaryEffect),
      section: "base",
    },
    {
      key: "useTime",
      label: "When you usually reach for it",
      weight: 18,
      filled: isUseTime(p.useTime),
      section: "base",
    },
    {
      key: "smokingMethod",
      label: "How you like to smoke it",
      weight: 6,
      filled: isSmokingMethod(p.smokingMethod),
      section: "base",
    },
    {
      key: "primaryAroma",
      label: "The aroma that pulls you in",
      weight: 18,
      filled: isPrimaryAroma(p.primaryAroma) || nonEmpty(p.preferredAromas),
      section: "base",
    },
    {
      key: "dislikedEffects",
      label: "What ruins a session for you",
      weight: 6,
      filled: avoidEffects,
      section: "base",
    },
    // ── Depth (40): signals that sharpen the target the rest of the way ──
    {
      key: "favoriteStrains",
      label: "A few strains you already love",
      weight: 12,
      filled: nonEmpty(p.favoriteStrains),
      section: "depth",
    },
    {
      key: "bodyFeel",
      label: "How heavy a body feel you like",
      weight: 6,
      filled: typeof p.bodyFeel === "number",
      section: "depth",
    },
    {
      key: "potencyPreference",
      label: "How hard-hitting you want it",
      weight: 6,
      filled: hasText(p.potencyPreference),
      section: "depth",
    },
    {
      key: "dislikedAromas",
      label: "Aromas you'd rather avoid",
      weight: 5,
      filled: nonEmpty(p.dislikedAromas),
      section: "depth",
    },
    {
      key: "families",
      label: "Strain families you seek or avoid",
      weight: 4,
      filled: familiesSet,
      section: "depth",
    },
    {
      key: "avoidedRisks",
      label: "Sensitivity to racy / heady highs",
      weight: 3,
      filled: nonEmpty(p.avoidedRisks),
      section: "depth",
    },
    {
      key: "extras",
      label: "Quality priorities, texture & notes",
      weight: 4,
      filled: extras,
      section: "depth",
    },
  ];
}

export interface ProfileCompleteness {
  percent: number; // 0..100, rounded
  isComplete: boolean; // percent >= 100
  hasBase: boolean; // enough for a real match (base target captured)
  filled: CompletenessItem[];
  missing: CompletenessItem[];
  // The single highest-value unfilled item — the one thing to nudge next.
  nextHint: CompletenessItem | null;
}

// The forced-choice target the engine prefers needs BOTH primaryEffect and
// useTime (see deriveProfileTarget); that pairing is what "has a real base"
// means here — without it the match falls back to noisy inference.
function computeHasBase(p: TasteProfileInput): boolean {
  return isPrimaryEffect(p.primaryEffect) && isUseTime(p.useTime);
}

export function profileCompleteness(
  p: TasteProfileInput,
): ProfileCompleteness {
  const all = items(p);
  const earned = all.reduce((sum, i) => sum + (i.filled ? i.weight : 0), 0);
  const total = all.reduce((sum, i) => sum + i.weight, 0); // 100 by construction
  const percent = Math.round((earned / total) * 100);

  const filled = all.filter((i) => i.filled);
  const missing = all
    .filter((i) => !i.filled)
    .sort((a, b) => b.weight - a.weight);

  return {
    percent,
    isComplete: percent >= 100,
    hasBase: computeHasBase(p),
    filled,
    missing,
    nextHint: missing[0] ?? null,
  };
}
