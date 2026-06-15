export type StrainType = "indica" | "sativa" | "hybrid";
export type Potency = "mild" | "moderate" | "strong" | "very-strong";

// Time-of-day mood for strain artwork. Drives the catalog card atmosphere
// (light, fresh morning → deep, sedative night) and, once art is generated,
// which vertical 3:4 WebP loads for the strain. Four categories on purpose —
// they map cleanly onto the experiential arc of a strain (energy → wind-down)
// and onto the existing behavioural-family classification.
export type TimeProfile = "morning" | "daytime" | "sunset" | "night";

// Lifecycle of a strain's generated artwork.
//   none      — no art yet (default; the card shows the time-of-day gradient)
//   prompt    — artPrompt written, image not generated yet
//   generated — image produced, in review (file may exist but isn't shown)
//   published — live: the WebP renders on the card and detail page
export type ArtStatus = "none" | "prompt" | "generated" | "published";

import type { PurchaseConfidence } from "./purchase-confidence";
export type { PurchaseConfidence, PurchaseSignals, SignalLevel } from "./purchase-confidence";

export interface StrainProfile {
  name: string;
  aliases?: string[];
  type: StrainType;
  aromas: string[];
  flavors: string[];
  effects: string[];
  traits: string[];
  potency: Potency;
  note?: string;
  // Tag weighting (deferred-improvements #3). Optional subsets of aromas /
  // flavors / effects marking the strain's DOMINANT character (e.g. GG4's
  // nose is primarily `gassy`+`earthy`, with `pine`+`citrus` secondary).
  // The engine weights a match on a primary token above a secondary one, so
  // a fan of the gas-primary character scores higher on GG4 than a fan of its
  // citrus secondary. Each must be a subset of the corresponding full array.
  // When omitted, every tag is weighted equally (identical to pre-#3
  // behaviour), so this is opt-in per strain and curated over time.
  primaryAromas?: string[];
  primaryFlavors?: string[];
  primaryEffects?: string[];
}

export type Category =
  | "Best Match"
  | "Closest Alternative"
  | "Worth Trying"
  | "Risky"
  | "Avoid";

export type Confidence = "low" | "medium" | "high";

// How hard-hitting the user wants it. Optional axis (see deferred #/cold-start
// ISSUE-6); absent/"balanced" is a no-op in scoring.
export type PotencyPreference = "mild" | "balanced" | "strong";

export interface TasteProfileInput {
  favoriteStrains: string[];
  dislikedStrains: string[];
  likedTraits: string[];
  dislikedTraits: string[];
  preferredAromas: string[];
  preferredFlavors: string[];
  preferredEffects: string[];
  // Effects the user actively wants to avoid (symmetric with preferredEffects).
  // Optional on the input contract so older test fixtures and unmigrated DB
  // reads stay valid; engine treats absent as []. Same vocab as EFFECTS.
  dislikedEffects?: string[];
  // Aromas/flavours the user actively wants to avoid (symmetric with
  // preferredAromas). Optional; engine treats absent as []. Same vocab as
  // AROMAS/FLAVORS.
  dislikedAromas?: string[];
  texturePreferences: string[];
  qualityPriorities: string[];
  referenceStrain?: string | null;
  lookingFor?: string | null;
  // Forced-choice dimensions — see src/lib/profile-target.ts. Nullable so
  // older profiles stay valid; when present they pin the scoring target
  // directly instead of relying on inference from favourites.
  primaryAroma?: string | null;
  primaryEffect?: string | null;
  useTime?: string | null;
  bodyFeel?: number | null;
  // Desired overall strength ("mild" | "balanced" | "strong"). Typed loosely
  // (like primaryAroma) so raw DB rows assign cleanly; absent/"balanced"/an
  // unknown value is a no-op in scoring.
  potencyPreference?: string | null;
  // Named strain families the user seeks out / usually avoids (see
  // src/lib/strain-families.ts). Buying-behaviour signal, distinct from
  // sensory match; optional, no-op when empty.
  preferredFamilies?: string[];
  avoidedFamilies?: string[];
  notes?: string | null;
}

export interface StrainMatch {
  strainName: string;
  resolvedName: string;
  knownStrain: boolean;
  category: Category;
  matchScore: number;
  // Pre-calibration internal score (no anchor floor, no 99 cap, no 88
  // non-anchor ceiling). Carries decimal precision so ties at matchScore
  // can be broken deterministically by what the engine actually thinks.
  // Visible only as a sort tie-breaker and a small "#N of N" indicator
  // when multiple items share the same displayed matchScore.
  unclampedScore: number;
  confidence: Confidence;
  aromaMatch: number;
  flavorMatch: number;
  effectMatch: number;
  traitMatch: number;
  referenceSimilarity: number;
  matchedAromas: string[];
  matchedFlavors: string[];
  matchedEffects: string[];
  conflicts: string[];
  whyItFits: string;
  riskNotes: string;
  explanation: string;
  feedbackAdjustment: number;
  feedbackNote: string | null;
  // Audit-mode breakdown of how feedback reached `feedbackAdjustment`:
  //   baseScore        — the score BEFORE any feedback (the "raw" read)
  //   feedbackPotential — what the feedback would add at full strength
  //   feedbackDecay    — the diminishing-returns taper factor (0..1); the
  //                       applied = round(potential * decay)
  baseScore: number;
  feedbackPotential: number;
  feedbackDecay: number;
  // Audit mode — per-tag point strength of each match (token) and each penalty.
  matchStrengths: { token: string; points: number }[];
  penaltyStrengths: { label: string; points: number }[];
  // Audit mode — preferred tags the user asked for that this strain lacks
  // (matched in no category), so the audit shows what was missing too.
  missingTags: string[];
  // Second axis: how confident we are about THIS purchase, separate from
  // the sensory match score. See src/lib/purchase-confidence.ts.
  purchaseConfidence: PurchaseConfidence;
}

// A confirmed like/dislike on a past recommendation, fed back into scoring.
export interface FeedbackSignal {
  strainName: string;
  liked: boolean;
  rating: number | null;
  // Signed verdict weight in [-1, 1]. Lets the engine grade how much a
  // verdict counts instead of treating every positive alike: a "loved"
  // anchors at +1, a softer "good" at +0.5, an "avoid" at -1. `liked` is
  // kept as the sign for note copy; `strength` drives the actual nudge.
  strength: number;
}

export interface AnalysisResult {
  recommendations: StrainMatch[];
  engine: "builtin" | "openai";
  generatedAt: string;
}

export interface FeedbackData {
  id: string;
  purchased: boolean | null;
  liked: boolean | null;
  rating: number | null;
  notes: string | null;
}

export interface SessionRecommendation extends StrainMatch {
  id: string;
  feedback: FeedbackData | null;
}

export interface SessionSummary {
  id: string;
  title: string | null;
  saved: boolean;
  engine: string;
  inputType: string;
  createdAt: string;
  strainCount: number;
}

export interface SessionDetail extends SessionSummary {
  recommendations: SessionRecommendation[];
}

// A snapshot of how legible the pasted menu was. Computed at analyze time and
// persisted with the session so we can see parse quality drift over real menus.
export interface MenuQuality {
  totalParsed: number;
  unclearRows: number;
  unknownStrains: number;
  avgConfidence: number; // 0–1 mean of per-line confidence (high=1, medium=0.6, low=0.3)
}

export interface ComparisonItem extends StrainMatch {
  strainType: StrainType;
  potency: Potency;
  aromas: string[];
  flavors: string[];
  effects: string[];
  useCase: string;
}
