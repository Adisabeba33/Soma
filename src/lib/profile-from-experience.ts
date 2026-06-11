// Experience Match — derive a taste profile from a small set of strains
// the user has actually tried.
//
// One-shot alternative to the questionnaire: instead of answering 16
// abstract questions, the user names 2-7 strains they loved/liked/
// disliked, and the engine reads back what sensory features those
// choices imply. The resulting profile is shown as a preview the user
// can edit before saving — the inference is a starting point, not a
// verdict.
//
// Pure function (no DB, no fetch) so the same logic can be tested
// directly and called from the API route. Caller is responsible for
// persisting the result via the normal POST /api/profile contract.

import { findStrain } from "./strain-data";
import {
  PRIMARY_AROMA_TOKENS,
  type PrimaryAroma,
  type PrimaryEffect,
  type UseTime,
} from "./profile-target";
import type { PotencyPreference, StrainProfile } from "./types";

export interface ExperienceInput {
  loved: string[];
  liked: string[];
  disliked: string[];
}

// Mirrors the parts of TasteProfileState we can actually infer from
// strain tags. lookingFor / notes / referenceStrain we either default
// or pull straight from the user's input — they aren't reverse-derived.
export interface InferredProfile {
  favoriteStrains: string[];
  dislikedStrains: string[];
  referenceStrain: string;
  likedTraits: string[];
  dislikedTraits: string[];
  preferredAromas: string[];
  preferredFlavors: string[];
  preferredEffects: string[];
  dislikedEffects: string[];
  dislikedAromas: string[];
  texturePreferences: string[];
  qualityPriorities: string[];
  primaryAroma: PrimaryAroma | "";
  primaryEffect: PrimaryEffect | "";
  useTime: UseTime | "";
  bodyFeel: number | null;
  potencyPreference: PotencyPreference | "";
  lookingFor: "similar" | "new";
  notes: string;
}

export interface InferenceResult {
  profile: InferredProfile;
  // What was usable for inference vs ignored. Frontend uses these to
  // tell the user "we recognised 3 of your 5 strains" and prompt them
  // to add more known strains for a stronger inference.
  resolved: {
    loved: ResolvedStrain[];
    liked: ResolvedStrain[];
    disliked: ResolvedStrain[];
  };
  unknown: {
    loved: string[];
    liked: string[];
    disliked: string[];
  };
  // Sufficient signal threshold. The frontend should redirect the user
  // to the questionnaire when this is false — there isn't enough data
  // to build a meaningful profile.
  sufficient: boolean;
}

export interface ResolvedStrain {
  raw: string;
  canonical: string;
  strain: StrainProfile;
}

// Inference weights. Loved strains carry more weight than liked because
// the user is explicitly anchoring on them. Disliked strains are kept
// out of the positive-axis tallies but feed dislikedEffects.
const LOVED_WEIGHT = 1.5;
const LIKED_WEIGHT = 1.0;

// Minimum support for a token to make it into the inferred profile.
// Either it appears in at least half the resolved positive strains, or
// it has at least 2 weighted votes — whichever is lower. Keeps single
// outlier tags from dominating a small sample.
const MIN_TOKEN_SUPPORT = 2.0;

export function inferProfileFromExperience(
  input: ExperienceInput,
): InferenceResult {
  const lovedResolved = resolveMany(input.loved);
  const likedResolved = resolveMany(input.liked);
  const dislikedResolved = resolveMany(input.disliked);

  const positiveCount = lovedResolved.kept.length + likedResolved.kept.length;
  const sufficient = lovedResolved.kept.length >= 1 && positiveCount >= 2;

  const preferredAromas = topTokens(
    lovedResolved.kept,
    likedResolved.kept,
    (s) => s.aromas,
  );
  const preferredFlavors = topTokens(
    lovedResolved.kept,
    likedResolved.kept,
    (s) => s.flavors,
  );
  const preferredEffects = topTokens(
    lovedResolved.kept,
    likedResolved.kept,
    (s) => s.effects,
  );
  const likedTraits = topTokens(
    lovedResolved.kept,
    likedResolved.kept,
    (s) => s.traits,
  );

  // dislikedEffects: effects that show up across the disliked strains
  // but NOT in the user's loved/liked strains. Effects present in both
  // would create a contradiction at onboarding — silenced for now.
  const positiveEffectSet = new Set(preferredEffects);
  const dislikedEffectTally = tally(dislikedResolved.kept, (s) => s.effects);
  const dislikedEffects = [...dislikedEffectTally.entries()]
    .filter(([token, count]) => count >= 1 && !positiveEffectSet.has(token))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([token]) => token);

  // referenceStrain — the first loved canonical name (the strain the
  // user clearly anchored on). Falls back to first liked, or "" if the
  // user only resolved disliked strains.
  const referenceStrain =
    lovedResolved.kept[0]?.canonical ??
    likedResolved.kept[0]?.canonical ??
    "";

  // favoriteStrains — up to 3 from loved (anchors for the engine's
  // trust mode). Use canonical names so the rest of the engine can
  // resolve them cleanly.
  const favoriteStrains = lovedResolved.kept
    .slice(0, 3)
    .map((r) => r.canonical);

  const dislikedStrains = dislikedResolved.kept.map((r) => r.canonical);

  // Forced-choice dimensions — sharper signal than the broad multi-selects.
  const primaryAroma = inferPrimaryAroma(preferredAromas);
  const primaryEffect = inferPrimaryEffect(preferredEffects);
  const useTime = inferUseTime(preferredEffects);
  const bodyFeel = inferBodyFeel(
    lovedResolved.kept,
    likedResolved.kept,
  );

  return {
    profile: {
      favoriteStrains,
      dislikedStrains,
      referenceStrain,
      likedTraits,
      dislikedTraits: [],
      preferredAromas,
      preferredFlavors,
      preferredEffects,
      dislikedEffects,
      dislikedAromas: [],
      texturePreferences: [],
      qualityPriorities: [],
      primaryAroma,
      primaryEffect,
      useTime,
      bodyFeel,
      potencyPreference: "",
      lookingFor: "similar",
      notes: "",
    },
    resolved: {
      loved: lovedResolved.kept,
      liked: likedResolved.kept,
      disliked: dislikedResolved.kept,
    },
    unknown: {
      loved: lovedResolved.unknown,
      liked: likedResolved.unknown,
      disliked: dislikedResolved.unknown,
    },
    sufficient,
  };
}

function resolveMany(names: string[]): {
  kept: ResolvedStrain[];
  unknown: string[];
} {
  const kept: ResolvedStrain[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const strain = findStrain(trimmed);
    if (!strain) {
      unknown.push(trimmed);
      continue;
    }
    if (seen.has(strain.name)) continue;
    seen.add(strain.name);
    kept.push({ raw: trimmed, canonical: strain.name, strain });
  }
  return { kept, unknown };
}

function tally(
  entries: ResolvedStrain[],
  axis: (s: StrainProfile) => string[],
): Map<string, number> {
  const out = new Map<string, number>();
  for (const e of entries) {
    for (const token of axis(e.strain)) {
      out.set(token, (out.get(token) ?? 0) + 1);
    }
  }
  return out;
}

function topTokens(
  loved: ResolvedStrain[],
  liked: ResolvedStrain[],
  axis: (s: StrainProfile) => string[],
): string[] {
  const tally = new Map<string, number>();
  for (const e of loved) {
    for (const token of axis(e.strain)) {
      tally.set(token, (tally.get(token) ?? 0) + LOVED_WEIGHT);
    }
  }
  for (const e of liked) {
    for (const token of axis(e.strain)) {
      tally.set(token, (tally.get(token) ?? 0) + LIKED_WEIGHT);
    }
  }
  const totalEntries = loved.length + liked.length;
  // A token clears if it has 2 weighted votes OR appears in at least half
  // the strains. Caps at 6 so a busy aroma list doesn't drown the UI.
  const halfThreshold = totalEntries / 2;
  return [...tally.entries()]
    .filter(([_, weight]) => weight >= MIN_TOKEN_SUPPORT || weight >= halfThreshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([token]) => token);
}

function inferPrimaryAroma(preferredAromas: string[]): PrimaryAroma | "" {
  // Reverse the PRIMARY_AROMA_TOKENS map. Score each family by how many
  // of its tokens appear in the user's top aromas, weighted by position
  // (earlier = stronger). First non-zero family wins.
  const families = Object.keys(PRIMARY_AROMA_TOKENS) as PrimaryAroma[];
  const scores = new Map<PrimaryAroma, number>();
  for (const family of families) {
    let score = 0;
    for (const token of PRIMARY_AROMA_TOKENS[family]) {
      const rank = preferredAromas.indexOf(token);
      if (rank >= 0) score += preferredAromas.length - rank;
    }
    scores.set(family, score);
  }
  let best: PrimaryAroma | "" = "";
  let bestScore = 0;
  for (const [family, score] of scores) {
    if (score > bestScore) {
      best = family;
      bestScore = score;
    }
  }
  return best;
}

// Primary-effect families and which inferred effect tags they cover.
// The mapping deliberately overlaps (uplifted appears in lifted + social)
// — the winning family is the one with most overlapping evidence.
const PRIMARY_EFFECT_MAP: Record<PrimaryEffect, string[]> = {
  calm: ["relaxed", "calm"],
  knockout: ["sleepy", "couch-lock", "body-heavy"],
  social: ["happy", "giggly", "uplifted"],
  lifted: ["uplifted", "euphoric", "energetic", "head-high"],
  sharp: ["focused", "creative", "energetic"],
};

function inferPrimaryEffect(
  preferredEffects: string[],
): PrimaryEffect | "" {
  const families = Object.keys(PRIMARY_EFFECT_MAP) as PrimaryEffect[];
  let best: PrimaryEffect | "" = "";
  let bestScore = 0;
  for (const family of families) {
    const hits = PRIMARY_EFFECT_MAP[family].filter((t) =>
      preferredEffects.includes(t),
    ).length;
    if (hits > bestScore) {
      best = family;
      bestScore = hits;
    }
  }
  return best;
}

const USE_TIME_MAP: Record<UseTime, string[]> = {
  morning: ["focused", "energetic"],
  daytime: ["happy", "uplifted", "creative", "giggly", "energetic"],
  evening: ["relaxed", "calm", "euphoric"],
  bed: ["sleepy", "couch-lock", "body-heavy"],
};

function inferUseTime(preferredEffects: string[]): UseTime | "" {
  const times = Object.keys(USE_TIME_MAP) as UseTime[];
  let best: UseTime | "" = "";
  let bestScore = 0;
  for (const time of times) {
    const hits = USE_TIME_MAP[time].filter((t) =>
      preferredEffects.includes(t),
    ).length;
    if (hits > bestScore) {
      best = time;
      bestScore = hits;
    }
  }
  return best;
}

const HEAVY_TAGS = new Set([
  "body-heavy",
  "heavy-body",
  "couch-lock",
  "sleepy",
]);
const LIGHT_TAGS = new Set([
  "energetic",
  "focused",
  "head-high",
  "uplifted",
]);

function inferBodyFeel(
  loved: ResolvedStrain[],
  liked: ResolvedStrain[],
): number | null {
  const all = [...loved, ...liked];
  if (all.length === 0) return null;
  let heavyVotes = 0;
  let lightVotes = 0;
  for (const r of all) {
    for (const tag of r.strain.effects) {
      if (HEAVY_TAGS.has(tag)) heavyVotes += 1;
      if (LIGHT_TAGS.has(tag)) lightVotes += 1;
    }
    for (const tag of r.strain.traits) {
      if (tag === "heavy-body") heavyVotes += 1;
    }
  }
  const total = heavyVotes + lightVotes;
  if (total === 0) return 50;
  // 0 = clear & light, 100 = couch-lock heavy.
  return Math.round((heavyVotes / total) * 100);
}
