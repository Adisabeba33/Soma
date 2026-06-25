// Profile completeness — a single per-question cost model used everywhere
// (onboarding progress, the finish-your-profile nudge, the profile ring) so the
// percentage is one consistent number. Each question carries a weight; the
// percent is the sum of answered weights. The 15 onboarding questions total
// 75%; five extra refinement questions (full profile only) take it to 100%.
// Weights are tuned so the answers that point the engine in the right direction
// up front — favourite strains, primary effect, use-time, primary aroma — are
// worth the most (39% between them). It never gates matching here; the 60% gate
// lives at the call sites.

import {
  isPrimaryAroma,
  isPrimaryEffect,
  isUseTime,
  isPreferredType,
} from "./profile-target";
import type { TasteProfileInput } from "./types";

const nonEmpty = (v: unknown): boolean => Array.isArray(v) && v.length > 0;
const hasText = (v: unknown): boolean =>
  typeof v === "string" && v.trim().length > 0;

// Below this, matching is gated — the engine needs the directional answers
// (favourites + effect + time + aroma ≈ 39%, plus a couple of the broad
// sensory picks) before a run is worth showing.
export const MATCH_GATE_PERCENT = 60;

// One scorable question: its weight, whether the profile carries an answer, and
// the human hint shown in "what's missing". `section` groups onboarding ("base")
// vs full-profile-only refinement ("depth").
export interface CompletenessItem {
  key: string;
  label: string;
  weight: number;
  filled: boolean;
  section: "base" | "depth";
}

function items(p: Partial<TasteProfileInput>): CompletenessItem[] {
  const familiesSet =
    nonEmpty(p.preferredFamilies) || nonEmpty(p.avoidedFamilies);

  return [
    // ── Onboarding (73): the questions, weighted by directional value ──
    { key: "favoriteStrains", label: "A few strains you already love", weight: 13, filled: nonEmpty(p.favoriteStrains), section: "base" },
    { key: "primaryEffect", label: "Your one-word session (primary effect)", weight: 10, filled: isPrimaryEffect(p.primaryEffect), section: "base" },
    { key: "useTime", label: "When you usually reach for it", weight: 8, filled: isUseTime(p.useTime), section: "base" },
    { key: "primaryAroma", label: "The one aroma that pulls you in", weight: 8, filled: isPrimaryAroma(p.primaryAroma), section: "base" },
    { key: "preferredEffects", label: "The effects you're after", weight: 6, filled: nonEmpty(p.preferredEffects), section: "base" },
    { key: "preferredAromas", label: "The aromas & flavours you reach for", weight: 6, filled: nonEmpty(p.preferredAromas) || nonEmpty(p.preferredFlavors), section: "base" },
    { key: "dislikedEffects", label: "Effects that ruin a session", weight: 4, filled: nonEmpty(p.dislikedEffects), section: "base" },
    { key: "bodyFeel", label: "How heavy a body feel you like", weight: 4, filled: typeof p.bodyFeel === "number", section: "base" },
    { key: "potencyPreference", label: "How hard-hitting you want it", weight: 4, filled: hasText(p.potencyPreference), section: "base" },
    { key: "dislikedAromas", label: "Aromas that are an instant no", weight: 3, filled: nonEmpty(p.dislikedAromas), section: "base" },
    { key: "smokingMethods", label: "How you like to smoke it", weight: 2, filled: nonEmpty(p.smokingMethods), section: "base" },
    { key: "avoidedRisks", label: "Risks in the high to avoid", weight: 2, filled: nonEmpty(p.avoidedRisks), section: "base" },
    { key: "dislikedStrains", label: "Strains to steer away from", weight: 2, filled: nonEmpty(p.dislikedStrains), section: "base" },
    { key: "dislikedTraits", label: "Past-pickup dealbreakers", weight: 1, filled: nonEmpty(p.dislikedTraits), section: "base" },
    // ── Full-profile refinement (23): the extra precision questions ──
    { key: "likedTraits", label: "What you liked about your favourites", weight: 7, filled: nonEmpty(p.likedTraits), section: "depth" },
    { key: "families", label: "Strain families you seek or avoid", weight: 6, filled: familiesSet, section: "depth" },
    { key: "preferredType", label: "Indica / sativa / hybrid preference", weight: 4, filled: isPreferredType(p.preferredType), section: "depth" },
    { key: "qualityPriorities", label: "Quality priorities", weight: 4, filled: nonEmpty(p.qualityPriorities), section: "depth" },
    { key: "texturePreferences", label: "Texture you like", weight: 2, filled: nonEmpty(p.texturePreferences), section: "depth" },
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
function computeHasBase(p: Partial<TasteProfileInput>): boolean {
  return isPrimaryEffect(p.primaryEffect) && isUseTime(p.useTime);
}

// Accepts a partial profile (the onboarding passes live, half-filled state) —
// every field is read defensively, so missing ones simply count as unanswered.
export function profileCompleteness(
  p: Partial<TasteProfileInput>,
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
