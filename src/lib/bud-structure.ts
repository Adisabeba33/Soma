// Bud-structure (density) — a SOFT, phenotype/grow-dependent signal. The same
// strain comes dense from one grower and fluffy from another, so this is a
// tendency, never a fact — and it carries an explicit confidence level so the
// engine knows how much to trust it (and whether to nudge the score at all).
//
// Two curated axes feed it:
//   GENETICS — the reported indica/sativa split (%). Marketing-tinged, treated
//     as "reported lineage ratio", not botanical truth. Sets the PRESUMED
//     density lean when no real-world structure data exists yet.
//   DENSITY  — real-world structure observations. Each credible confirmation
//     lifts the confidence presumed → low → medium → high.
//
// Both are curated in batches; an unseeded strain falls back to a presumed lean
// from its `type`, scaled by how far the split leans from 50/50.

import type { StrainProfile } from "./types";

export type DensityLean = "dense" | "fluffy" | "mixed";
// presumed — genotype theory only, no real-world confirmation
// low/medium/high — one / several / consensus of credible sources
export type DensityConfidence = "presumed" | "low" | "medium" | "high";

// Raw-score bonus per confidence tier (added on a structure match, then scaled
// by how hard the user asked for that structure — the slider). presumed is a
// near-silent 0.33 whisper; a true unknown contributes 0.
export const DENSITY_BONUS: Record<DensityConfidence, number> = {
  presumed: 0.33,
  low: 1,
  medium: 2,
  high: 4,
};

export interface Genetics {
  indica: number; // 0–100; indica + sativa = 100
  sativa: number;
}

export interface DensityEntry {
  lean: DensityLean;
  confidence: DensityConfidence;
  sources?: string; // short note for the Audit trail / future re-verification
}

// Curated reported indica/sativa split. Keyed by canonical strain name.
// Filled in batches — "reported lineage ratio", not botanical truth.
export const GENETICS: Record<string, Genetics> = {
  // Batch 1 — iconic / common strains.
  "GMO Cookies": { indica: 90, sativa: 10 },
  "OG Kush": { indica: 75, sativa: 25 },
  "Bubba Kush": { indica: 80, sativa: 20 },
  "Granddaddy Purple": { indica: 70, sativa: 30 },
  "Northern Lights": { indica: 90, sativa: 10 },
  "Wedding Cake": { indica: 60, sativa: 40 },
  "Do-Si-Dos": { indica: 70, sativa: 30 },
  "Girl Scout Cookies": { indica: 60, sativa: 40 },
  "Skywalker OG": { indica: 85, sativa: 15 },
  "Purple Punch": { indica: 80, sativa: 20 },
  "Ice Cream Cake": { indica: 75, sativa: 25 },
  "Master Kush": { indica: 80, sativa: 20 },
  Zkittlez: { indica: 70, sativa: 30 },
  Gelato: { indica: 55, sativa: 45 },
  Runtz: { indica: 50, sativa: 50 },
  MAC: { indica: 50, sativa: 50 },
  GG4: { indica: 50, sativa: 50 },
  "Sour Diesel": { indica: 10, sativa: 90 },
  "Super Lemon Haze": { indica: 20, sativa: 80 },
  "Amnesia Haze": { indica: 20, sativa: 80 },
  "Ghost Train Haze": { indica: 30, sativa: 70 },
  "Jack Herer": { indica: 45, sativa: 55 },
  "Maui Wowie": { indica: 20, sativa: 80 },
  "Strawberry Cough": { indica: 20, sativa: 80 },
  Tangie: { indica: 30, sativa: 70 },
  "Pineapple Express": { indica: 40, sativa: 60 },
  "Green Crack": { indica: 35, sativa: 65 },
  "Durban Poison": { indica: 10, sativa: 90 },
  "Blue Dream": { indica: 40, sativa: 60 },
};

// Curated real-world density observations. Overrides the genetics-presumed lean
// once we have actual confirmation. `sources` is an honest note on the basis —
// knowledge-based consensus here, not a live multi-source audit. Confidence is
// conservative: high = broad consensus, medium = solid with some grow variance,
// low = weaker / single signal.
export const DENSITY: Record<string, DensityEntry> = {
  // — Dense, well-documented —
  "GMO Cookies": { lean: "dense", confidence: "high", sources: "Consensus: very dense, chunky resinous nugs" },
  "OG Kush": { lean: "dense", confidence: "high", sources: "Consensus: classic dense OG nug" },
  "Bubba Kush": { lean: "dense", confidence: "high", sources: "Consensus: dense, rounded indica nugs" },
  "Granddaddy Purple": { lean: "dense", confidence: "high", sources: "Consensus: dense purple nugs" },
  "Northern Lights": { lean: "dense", confidence: "high", sources: "Consensus: classic dense indica" },
  "Wedding Cake": { lean: "dense", confidence: "high", sources: "Consensus: dense, frosty, tight" },
  "Do-Si-Dos": { lean: "dense", confidence: "high", sources: "Consensus: dense, OGKB-line nugs" },
  "Girl Scout Cookies": { lean: "dense", confidence: "high", sources: "Consensus: dense, tight, frosty" },
  // GG4 is a balanced hybrid (presumed would read mixed/0) but is famously dense.
  GG4: { lean: "dense", confidence: "high", sources: "Correction vs 50/50 presumed: famously dense, chunky, resin-coated" },
  "Skywalker OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Purple Punch": { lean: "dense", confidence: "medium", sources: "Dense, compact, frosty" },
  "Ice Cream Cake": { lean: "dense", confidence: "medium", sources: "Dense, tight cake-line nugs" },
  "Master Kush": { lean: "dense", confidence: "medium", sources: "Dense indica nugs" },
  Zkittlez: { lean: "dense", confidence: "medium", sources: "Fairly dense, compact, colourful" },
  Gelato: { lean: "dense", confidence: "medium", sources: "Dense, resinous" },
  Runtz: { lean: "dense", confidence: "medium", sources: "Dense, tight, colourful nugs" },
  MAC: { lean: "dense", confidence: "low", sources: "Moderately dense; some phenos run airier" },
  // Sativa-line correction cases — denser than lineage suggests.
  "Green Crack": { lean: "dense", confidence: "medium", sources: "Correction vs sativa presumed: compact, fairly dense small nugs" },
  "Durban Poison": { lean: "dense", confidence: "medium", sources: "Correction vs sativa presumed: chunky, foxtailing, dense for a pure sativa" },
  // — Fluffy / airy, well-documented —
  "Sour Diesel": { lean: "fluffy", confidence: "high", sources: "Consensus: spindly, airy sativa structure" },
  "Super Lemon Haze": { lean: "fluffy", confidence: "high", sources: "Consensus: airy haze structure" },
  "Amnesia Haze": { lean: "fluffy", confidence: "high", sources: "Consensus: airy, wispy haze nugs" },
  "Ghost Train Haze": { lean: "fluffy", confidence: "medium", sources: "Airy haze structure (resinous)" },
  "Jack Herer": { lean: "fluffy", confidence: "medium", sources: "Sativa-leaning, somewhat airy" },
  "Maui Wowie": { lean: "fluffy", confidence: "medium", sources: "Airy island sativa" },
  "Strawberry Cough": { lean: "fluffy", confidence: "medium", sources: "Airy, light sativa nugs" },
  Tangie: { lean: "fluffy", confidence: "medium", sources: "Airy, sativa-leaning" },
  "Pineapple Express": { lean: "fluffy", confidence: "low", sources: "Medium structure, slightly airy" },
  "Blue Dream": { lean: "fluffy", confidence: "low", sources: "Medium density, slightly airy" },
};

function geneticsFromType(type: string): Genetics {
  if (type === "indica") return { indica: 100, sativa: 0 };
  if (type === "sativa") return { indica: 0, sativa: 100 };
  return { indica: 50, sativa: 50 }; // hybrid → neutral until curated
}

// Resolve a strain's effective density lean, confidence and the raw-score bonus
// magnitude. A curated real-world DENSITY entry wins; otherwise a PRESUMED lean
// from genetics (curated split, else `type`), scaled by dominance — so 100/0
// gives the full 0.33 whisper, 60/40 a faint fraction, 50/50 nothing.
export function densityProfileOf(strain: StrainProfile): {
  lean: DensityLean;
  confidence: DensityConfidence;
  weight: number;
} {
  const curated = DENSITY[strain.name];
  if (curated) {
    const weight = curated.lean === "mixed" ? 0 : DENSITY_BONUS[curated.confidence];
    return { lean: curated.lean, confidence: curated.confidence, weight };
  }
  const g = GENETICS[strain.name] ?? geneticsFromType(strain.type);
  const dominance = Math.abs(g.indica - g.sativa) / 100; // 0 at 50/50, 1 at 100/0
  if (dominance === 0) return { lean: "mixed", confidence: "presumed", weight: 0 };
  return {
    lean: g.indica > g.sativa ? "dense" : "fluffy",
    confidence: "presumed",
    weight: DENSITY_BONUS.presumed * dominance,
  };
}

// Bridge the existing budStructure enum to a slider value (−1 fully fluffy … 0
// no preference … +1 fully dense) until the pre-run slider sends a continuous
// one of its own.
export function densityPreferenceFromProfile(
  budStructure?: string | null,
): number {
  switch (budStructure) {
    case "dense":
      return 1;
    case "popcorn":
      return 0.5;
    case "larfy":
      return -0.6;
    case "airy":
      return -0.8;
    case "fluffy":
      return -1;
    default:
      return 0;
  }
}

// Signed raw-score nudge for how the strain's structure matches what the user
// asked for. preference: −1 (fluffy) … 0 (neutral) … +1 (dense). Matches add
// the confidence-scaled bonus; mismatches take the same hit (symmetric), all
// scaled by slider intensity. Neutral preference or unknown strain → 0.
export function densityBonus(strain: StrainProfile, preference: number): number {
  if (!preference) return 0;
  const { lean, weight } = densityProfileOf(strain);
  if (lean === "mixed" || weight === 0) return 0;
  const want: DensityLean = preference > 0 ? "dense" : "fluffy";
  const intensity = Math.min(1, Math.abs(preference));
  return (lean === want ? weight : -weight) * intensity;
}
