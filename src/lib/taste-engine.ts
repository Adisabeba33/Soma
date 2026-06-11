// SOMA Taste Match Engine
// ------------------------------------------------------------------
// The deterministic heart of the product. It scores each available
// strain against a user's personal taste profile and explains *why*
// something fits — or does not. It never claims to know batch quality
// it cannot see: caveats about grower, freshness and storage are baked
// into every explanation.

import { findStrain, normalizeStrainName, STRAINS } from "./strain-data";
import { evaluatePurchase } from "./purchase-confidence";
import { areAdjacent, effectArchetypeOf } from "./effect-archetype";
import { effectTextureOf, textureContribution } from "./effect-texture";
import {
  behavioralFamilyOf,
  familyBonus,
  hasClusteredFavorites,
  type BehavioralFamily,
} from "./behavioral-family";
import { primaryAromaTokens, type ResolvedTarget } from "./profile-target";
import { deriveTasteModes } from "./taste-modes";
import { getIdentity, isAdjacentSensoryFamily } from "./strain-identity";
import type {
  AnalysisResult,
  Category,
  Confidence,
  FeedbackSignal,
  StrainMatch,
  StrainProfile,
  StrainType,
  TasteProfileInput,
} from "./types";
import { BATCH_QUALITY_TRAITS, labelFor } from "./vocab";

// Audit log marker — bump when the scoring formula, layer mechanics or
// bonus magnitudes change in a way that makes old score numbers
// incomparable with new ones. The input side (profile, parsedItems) is
// always replayable through the new engine; this version tag lets audit
// analysis filter to a single engine era.
// v1 → v2: areAdjacent made symmetric (garlic-funk ↔ smooth-expressive).
// v2 → v3: forced-choice target (primaryAroma/primaryEffect/useTime) plus
// primary-aroma boost and the half-damper. Scores from profiles that use
// the forced-choice questions are not comparable to v2, so audits are
// tagged "v3" from this deploy on.
// v3 → v4: dislikedEffects added as an explicit input dimension —
// strains carrying a disliked effect incur the same conflict penalty as
// trait dislikes, with the same favourite-driven reconciliation. Profiles
// that filled in disliked effects can no longer be compared head-to-head
// with v3 audits, so this deploy tags audits "v4".
// v4 → v5: sensoryFamily bonus — when the candidate strain shares a
// curator-defined sensory family ("gas-og", "garlic-funk", etc.) with
// any of the user's resolved favourites, a small flat bonus is added to
// the raw score. Captures cluster identity that tag-Jaccard misses (a
// gas-fan looking at OG Kush vs Tahoe OG would otherwise see scores
// driven only by aroma/effect tag overlap). Bonus is bounded and only
// fires when both sides have identity records, so the existing
// archetype/texture/family layers continue to dominate.
// v5 → v6: sensoryFamily adjacency — the bonus now also fires (at a
// reduced magnitude) when candidate and favourite live in adjacent
// sensory families (gas-og ↔ diesel-chem, citrus-haze ↔ sweet-haze, …).
// Closes the "different family but same smell territory" gap an external
// reviewer flagged: a GG4 fan looking at Sour Diesel or GMO previously
// got no sensory-cluster signal at all even though both clearly share
// gas/funk character with GG4. Exact-match bonus also nudges up (+4 → +5).
// Older v5 audits stay readable.
// v6 → v7: previously-dead profile fields finally pull weight in the
// formula. texturePreferences and qualityPriorities were collected from
// the questionnaire but ignored at scoring time; now they participate
// at 3% and 2% of the weighted sum (small slices, tiebreakers rather
// than primary signals). Also adds position-weighting on favorites in
// referenceSimilarity — the first favourite is the strongest anchor,
// each later position discounts by 5%, so a candidate that's slightly
// closer to favourite #3 than to favourite #1 still reports against
// #1 unless the gap is large. Effect, aroma, flavor, trait, and ref
// weights nudged down a couple of points to make room. Older v6 audits
// stay readable but the absolute score distribution shifts a little.
export const ENGINE_VERSION = "v7";

const NEUTRAL = 52;

// Bounded boost added to a strain's aroma sub-score when its nose matches
// the user's forced-choice primary aroma family.
const PRIMARY_AROMA_BONUS = 10;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function labelList(values: string[]): string {
  return joinList(values.map((v) => labelFor(v).toLowerCase()));
}

// ---- Strain inference for names outside the reference dataset ------

interface Bucket {
  keywords: string[];
  aromas?: string[];
  flavors?: string[];
  effects?: string[];
  traits?: string[];
  type?: StrainType;
  potent?: boolean;
}

const BUCKETS: Bucket[] = [
  {
    keywords: ["lemon", "lime", "citrus", "tangie", "orange", "clementine", "grapefruit", "sour"],
    aromas: ["citrus"],
    flavors: ["citrus"],
    effects: ["uplifted", "energetic", "happy"],
    type: "sativa",
  },
  {
    keywords: ["haze"],
    aromas: ["herbal", "spicy", "citrus"],
    flavors: ["herbal", "spicy"],
    effects: ["uplifted", "energetic", "head-high", "creative"],
    type: "sativa",
  },
  {
    keywords: ["diesel", "chem", "fuel"],
    aromas: ["diesel", "gassy", "skunky"],
    flavors: ["gassy", "diesel"],
    effects: ["euphoric", "energetic", "happy"],
    traits: ["gassy", "loud-smell"],
    potent: true,
  },
  {
    keywords: ["og", "kush"],
    aromas: ["gassy", "earthy", "pine"],
    flavors: ["earthy", "pine", "gassy"],
    effects: ["relaxed", "body-heavy", "calm"],
    traits: ["gassy", "earthy", "dense-buds"],
    type: "hybrid",
    potent: true,
  },
  {
    keywords: ["glue", "gorilla", "gas", "gmo", "garlic"],
    aromas: ["gassy", "earthy"],
    flavors: ["gassy", "earthy"],
    effects: ["relaxed", "body-heavy", "euphoric"],
    traits: ["gassy", "loud-smell", "sticky"],
    potent: true,
  },
  {
    keywords: ["purple", "grape", "granddaddy", "gdp"],
    aromas: ["berry", "sweet", "floral"],
    flavors: ["grape", "berry", "sweet"],
    effects: ["relaxed", "sleepy", "body-heavy"],
    type: "indica",
  },
  {
    keywords: ["blue", "blueberry", "berry"],
    aromas: ["berry", "sweet", "fruity"],
    flavors: ["berry", "sweet"],
    effects: ["relaxed", "happy", "calm"],
  },
  {
    keywords: ["cookie", "cake", "cream", "gelato", "dosi", "biscotti", "sherb", "wedding", "mints"],
    aromas: ["sweet", "creamy", "earthy"],
    flavors: ["sweet", "creamy", "vanilla"],
    effects: ["euphoric", "relaxed", "happy"],
    traits: ["frosty", "sticky"],
  },
  {
    keywords: ["pineapple", "mango", "guava", "papaya", "tropical", "punch", "zkittlez", "skittle", "runtz", "fruit", "mimosa"],
    aromas: ["tropical", "fruity", "sweet"],
    flavors: ["tropical", "fruity", "sweet"],
    effects: ["happy", "uplifted", "relaxed"],
  },
  {
    keywords: ["cheese"],
    aromas: ["cheese", "skunky", "earthy"],
    flavors: ["earthy", "herbal"],
    effects: ["relaxed", "happy"],
  },
  {
    keywords: ["skunk"],
    aromas: ["skunky", "earthy"],
    flavors: ["earthy"],
    effects: ["relaxed", "euphoric"],
  },
  {
    keywords: ["mint"],
    aromas: ["herbal"],
    flavors: ["mint", "herbal"],
    effects: ["calm", "relaxed"],
  },
  {
    keywords: ["jack", "trainwreck", "pine"],
    aromas: ["pine", "spicy"],
    flavors: ["pine", "spicy"],
    effects: ["uplifted", "focused", "energetic"],
    type: "sativa",
  },
];

export function inferStrain(name: string): StrainProfile {
  const lower = name.toLowerCase();
  const aromas = new Set<string>();
  const flavors = new Set<string>();
  const effects = new Set<string>();
  const traits = new Set<string>();
  let type: StrainType = "hybrid";
  let potent = false;
  let matched = false;

  for (const bucket of BUCKETS) {
    if (!bucket.keywords.some((k) => lower.includes(k))) continue;
    matched = true;
    bucket.aromas?.forEach((a) => aromas.add(a));
    bucket.flavors?.forEach((f) => flavors.add(f));
    bucket.effects?.forEach((e) => effects.add(e));
    bucket.traits?.forEach((t) => traits.add(t));
    if (bucket.type) type = bucket.type;
    if (bucket.potent) potent = true;
  }

  if (!matched) {
    ["earthy", "sweet"].forEach((a) => aromas.add(a));
    ["earthy", "sweet"].forEach((f) => flavors.add(f));
    ["relaxed", "happy", "euphoric"].forEach((e) => effects.add(e));
  }
  if (effects.size === 0) ["relaxed", "happy"].forEach((e) => effects.add(e));
  if (flavors.size === 0) aromas.forEach((a) => flavors.add(a));
  if (traits.size === 0) traits.add("terpy");

  return {
    name: name.trim(),
    type,
    aromas: [...aromas],
    flavors: [...flavors],
    effects: [...effects],
    traits: [...traits],
    potency: potent ? "strong" : "moderate",
  };
}

export function resolveStrain(name: string): {
  strain: StrainProfile;
  known: boolean;
} {
  const known = findStrain(name);
  if (known) return { strain: known, known: true };
  return { strain: inferStrain(name), known: false };
}

// ---- Similarity & scoring ------------------------------------------

function profileSet(s: StrainProfile): Set<string> {
  return new Set([
    ...s.aromas.map((t) => `a:${t}`),
    ...s.flavors.map((t) => `f:${t}`),
    ...s.effects.map((t) => `e:${t}`),
    ...s.traits.map((t) => `t:${t}`),
  ]);
}

export function similarity(a: StrainProfile, b: StrainProfile): number {
  const setA = profileSet(a);
  const setB = profileSet(b);
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter += 1;
  const union = new Set([...setA, ...setB]).size;
  let sim = union === 0 ? 0 : inter / union;
  if (a.type === b.type) sim += 0.08;
  // Behavioural-weighted similarity. Naive tag-Jaccard collapses
  // dessert-cake territory (Wedding Cake / Birthday Cake / Biscotti /
  // Gelato Cake all share "sweet, creamy, vanilla, relaxed, euphoric")
  // into one indistinct cloud in Catalog Nearby. The three structural
  // layers we already compute let us reward exact behavioural twinning
  // and de-emphasise pairs that only overlap on broad surface vocab.
  // This also propagates into Compare via referenceSimilarity → ref.score,
  // tightening within-family discrimination without a new layer.
  if (effectArchetypeOf(a) === effectArchetypeOf(b)) sim += 0.1;
  if (effectTextureOf(a) === effectTextureOf(b)) sim += 0.05;
  const famA = behavioralFamilyOf(a);
  if (famA !== null && famA === behavioralFamilyOf(b)) sim += 0.03;
  return Math.min(1, sim);
}

// Weight applied to a matched preferred tag that lands on one of the
// strain's PRIMARY (dominant) tokens, vs 1.0 for a secondary token. See
// deferred-improvements #3.
const PRIMARY_TAG_WEIGHT = 1.5;

function setScore(
  strainTags: string[],
  preferred: string[],
  primaryTags?: string[],
): { score: number; matched: string[] } {
  if (preferred.length === 0) return { score: NEUTRAL, matched: [] };
  const tagSet = new Set(strainTags);
  const matched = preferred.filter((p) => tagSet.has(p));
  const primarySet =
    primaryTags && primaryTags.length ? new Set(primaryTags) : null;

  // No curated primaries → unweighted coverage, identical to pre-#3 scoring.
  if (!primarySet) {
    const coverage = matched.length / preferred.length;
    return { score: Math.round(26 + coverage * 74), matched };
  }

  // Weighted coverage: a preferred tag that hits a primary token counts
  // 1.5×, a secondary 1.0×, an unmatched preferred 1.0 in the denominator.
  // coverage = matchedWeight / (matchedWeight + unmatched) stays in [0,1],
  // reduces to the unweighted form when no match is primary, and reaches 1
  // only on a full match — so weighting differentiates PARTIAL overlaps,
  // which is exactly the gas-primary vs citrus-secondary case.
  let matchedWeight = 0;
  for (const m of matched) {
    matchedWeight += primarySet.has(m) ? PRIMARY_TAG_WEIGHT : 1;
  }
  const unmatched = preferred.length - matched.length;
  const coverage = matchedWeight / (matchedWeight + unmatched);
  return { score: Math.round(26 + coverage * 74), matched };
}

// Texture preferences ("sticky", "dense", "frosty", …) map to traits the
// engine already has on each StrainProfile. Some labels need a small
// translation (e.g. "dense" → "dense-buds"). Anything without a sensible
// trait analogue is dropped — the score reflects only mappable
// preferences, so a user who only picks "fluffy" gets 0 contribution
// rather than a spurious low score.
const TEXTURE_TO_TRAIT: Record<string, string | null> = {
  sticky: "sticky",
  dense: "dense-buds",
  frosty: "frosty",
  moist: null, // "Moist / fresh" — no direct strain-intrinsic analogue
  "well-cured": "well-cured",
  fluffy: null, // antonym of dense; no positive trait
};

function textureScore(
  strain: StrainProfile,
  texturePreferences: string[],
): { score: number; matched: string[] } {
  const wanted = texturePreferences
    .map((t) => TEXTURE_TO_TRAIT[t])
    .filter((x): x is string => Boolean(x));
  return setScore(strain.traits, wanted);
}

// Quality priorities ("freshness", "potency", "aroma", …) describe what
// the user judges a purchase on. They don't map 1:1 to strain tags,
// so we project each onto whichever existing trait or effect is the
// closest proxy. The contribution is intentionally small (a few percent
// of the weighted sum) — they're a tiebreaker, not a primary signal.
const QUALITY_SIGNALS: Record<
  string,
  { traits?: string[]; effects?: string[] }
> = {
  freshness: { traits: ["well-cured"] },
  moisture: { traits: ["well-cured"] },
  aroma: { traits: ["loud-smell", "terpy"] },
  taste: { traits: ["smooth", "terpy"] },
  potency: { traits: ["potent"] },
  "body-feel": { traits: ["heavy-body"] },
  "head-feel": { effects: ["head-high", "euphoric"] },
  sleep: { effects: ["sleepy", "couch-lock"] },
  focus: { effects: ["focused"] },
  creativity: { effects: ["creative"] },
  appearance: { traits: ["frosty", "dense-buds"] },
};

function qualityScore(
  strain: StrainProfile,
  qualityPriorities: string[],
): number {
  if (qualityPriorities.length === 0) return NEUTRAL;
  let hits = 0;
  for (const priority of qualityPriorities) {
    const signal = QUALITY_SIGNALS[priority];
    if (!signal) continue;
    const traitMatch = signal.traits?.some((t) => strain.traits.includes(t));
    const effectMatch = signal.effects?.some((e) => strain.effects.includes(e));
    if (traitMatch || effectMatch) hits += 1;
  }
  const coverage = hits / qualityPriorities.length;
  return Math.round(26 + coverage * 74);
}

// Position-weighting on the favourite list. First favourite is the
// strongest anchor (the strain the user most reliably represents their
// taste with); each later position gets a small discount. Applied as a
// multiplier on similarity during the best-of search — a candidate
// that's slightly closer to favourite #3 than to favourite #1 still
// reports against #1 if the gap is small enough. Reported score stays
// the RAW similarity to the winner, so the user-visible "{strain} sits
// closest to your taste" reading remains honest.
const FAVORITE_POSITION_WEIGHTS = [1.0, 0.95, 0.9, 0.85, 0.8];

function favoritePositionWeight(index: number): number {
  return FAVORITE_POSITION_WEIGHTS[
    Math.min(index, FAVORITE_POSITION_WEIGHTS.length - 1)
  ];
}

function referenceSimilarity(
  strain: StrainProfile,
  favorites: string[],
): { score: number; against: string | null } {
  const resolved = favorites
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));
  if (resolved.length === 0) return { score: NEUTRAL, against: null };

  let bestWeighted = 0;
  let bestRaw = 0;
  let against = resolved[0].name;
  for (let i = 0; i < resolved.length; i++) {
    const fav = resolved[i];
    if (normalizeStrainName(fav.name) === normalizeStrainName(strain.name)) {
      return { score: 100, against: fav.name };
    }
    const sim = similarity(strain, fav);
    const weighted = sim * favoritePositionWeight(i);
    if (weighted > bestWeighted) {
      bestWeighted = weighted;
      bestRaw = sim;
      against = fav.name;
    }
  }
  // Reserve 100 strictly for canonical-name match above. After
  // behavioural-weighted similarity, non-favourite strains can climb
  // very close to 1.0 (Purple Punch vs GDP, for example), and we must
  // not let that trigger the anchor floor via `ref.score === 100`.
  // Cap at 99 so anchor logic stays driven by explicit favourite
  // identity, not high similarity.
  return { score: Math.min(99, Math.round(bestRaw * 100)), against };
}

function dislikedConflicts(
  strain: StrainProfile,
  profile: TasteProfileInput,
  favorites: StrainProfile[],
): string[] {
  // Reconcile self-contradicting profiles. If any of the user's
  // favourites would themselves trigger a given dislike (e.g., user
  // dislikes "too-heavy" but favourites contain heavy-body indicas),
  // suppress that dislike — the lived-experience favourite overrides
  // the label. Without this, the engine penalises the user's own
  // family for the very trait their favourites carry, anchor-floor
  // saves the favourites but family-aligned non-anchors collapse.
  const reconciledTraits = profile.dislikedTraits.filter(
    (d) => !favoriteTriggers(d, favorites),
  );
  const dislikedEffects = profile.dislikedEffects ?? [];
  const reconciledEffects = dislikedEffects.filter(
    (e) => !favorites.some((f) => f.effects.includes(e)),
  );

  const conflicts: string[] = [];
  const has = (...tags: string[]) =>
    tags.some(
      (t) =>
        strain.aromas.includes(t) ||
        strain.flavors.includes(t) ||
        strain.effects.includes(t) ||
        strain.traits.includes(t),
    );

  for (const d of reconciledTraits) {
    if (
      d === "sharp-citrus" &&
      (strain.aromas.includes("citrus") || strain.flavors.includes("citrus"))
    ) {
      conflicts.push("citrus-forward, which can read as the sharp citrus you avoid");
    }
    if (
      d === "too-light" &&
      strain.type === "sativa" &&
      !has("body-heavy", "heavy-body", "couch-lock")
    ) {
      conflicts.push("a light, heady lift rather than the weight you tend to want");
    }
    if (d === "too-heavy" && has("couch-lock", "heavy-body", "body-heavy", "sleepy")) {
      conflicts.push("a heavy, sedating body that can feel like too much");
    }
  }

  // Effect dislikes are explicit (vocab-aligned), so no heuristic mapping —
  // each disliked effect carried by the strain becomes a direct conflict.
  // Same penalty magnitude as trait conflicts (15pt each, capped at 42).
  for (const e of reconciledEffects) {
    if (strain.effects.includes(e)) {
      conflicts.push(
        `${labelFor(e).toLowerCase()}, which you said you want to avoid`,
      );
    }
  }
  return conflicts;
}

// True when at least one favourite would itself trigger the given
// dislike mapping. Used to silence self-contradicting dislikes.
function favoriteTriggers(disliked: string, favorites: StrainProfile[]): boolean {
  if (favorites.length === 0) return false;
  const has = (s: StrainProfile, ...tags: string[]) =>
    tags.some(
      (t) =>
        s.aromas.includes(t) ||
        s.flavors.includes(t) ||
        s.effects.includes(t) ||
        s.traits.includes(t),
    );
  if (disliked === "sharp-citrus") {
    return favorites.some(
      (f) => f.aromas.includes("citrus") || f.flavors.includes("citrus"),
    );
  }
  if (disliked === "too-light") {
    return favorites.some(
      (f) =>
        f.type === "sativa" &&
        !has(f, "body-heavy", "heavy-body", "couch-lock"),
    );
  }
  if (disliked === "too-heavy") {
    return favorites.some((f) =>
      has(f, "couch-lock", "heavy-body", "body-heavy", "sleepy"),
    );
  }
  // Other dislikes (dry-flower, weak-smell, hay-smell, etc.) are
  // batch-quality concerns that don't map to strain-intrinsic conflict
  // logic, so reconciliation doesn't apply.
  return false;
}

// Lists the dislikes that were silenced by reconciliation for this
// profile. Surfaced in the compare audit log so we can see at a glance
// when the engine read a profile as self-contradicting. Flat list across
// the two axes (trait tokens like "too-heavy" + effect tokens like
// "couch-lock") — the vocabularies don't collide.
export function reconciledDislikes(profile: TasteProfileInput): string[] {
  const favorites = profile.favoriteStrains
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));
  const silencedTraits = profile.dislikedTraits.filter((d) =>
    favoriteTriggers(d, favorites),
  );
  const silencedEffects = (profile.dislikedEffects ?? []).filter((e) =>
    favorites.some((f) => f.effects.includes(e)),
  );
  return [...silencedTraits, ...silencedEffects];
}

// Bounded recognition bonus when the candidate's curator-defined sensory
// family relates to one of the user's resolved favourites. Two tiers:
//
//   - Exact match  → SENSORY_FAMILY_BONUS_EXACT (+5)
//   - Adjacent     → SENSORY_FAMILY_BONUS_ADJACENT (+3)
//
// "Adjacent" is the curator-asserted "different cluster but same smell
// territory" relation defined in strain-identity.ts. Without it the
// engine collapses "gas-og vs diesel-chem" (very close) into the same
// "no bonus" bucket as "gas-og vs dessert-cookies" (truly different),
// which under-rewards the old gas/diesel-chem school for a GG4 fan.
//
// Fires only when BOTH sides have identity records — most of the seed
// catalog doesn't have identity yet, so the bonus stays inert there.
// As identity coverage grows, the bonus lights up for more pairs.
//
// Magnitudes are tuned to sit between texture (±3) and archetype (+5):
// noticeable enough to break ties inside the 4–88 non-anchor band, but
// not large enough to override Layer 1/2/3 disagreement on effect feel.
// Exact > adjacent — the engine still respects the curator's assertion
// that two strains live in the same cluster vs merely close ones.
export const SENSORY_FAMILY_BONUS_EXACT = 5;
export const SENSORY_FAMILY_BONUS_ADJACENT = 3;

// Kept as an alias so older imports that named the v5 constant don't
// break — points at the exact-match magnitude which is the canonical
// reading of "the sensory family bonus."
export const SENSORY_FAMILY_BONUS = SENSORY_FAMILY_BONUS_EXACT;

export function sensoryFamilyBonus(
  candidate: StrainProfile,
  resolvedFavorites: StrainProfile[],
): number {
  const candidateId = getIdentity(candidate.name);
  const candidateFamily = candidateId?.sensoryFamily;
  if (!candidateFamily) return 0;
  let best = 0;
  for (const fav of resolvedFavorites) {
    const favFamily = getIdentity(fav.name)?.sensoryFamily;
    if (!favFamily) continue;
    if (favFamily === candidateFamily) {
      // Exact match always wins — short-circuit.
      return SENSORY_FAMILY_BONUS_EXACT;
    }
    if (
      isAdjacentSensoryFamily(favFamily, candidateFamily) &&
      best < SENSORY_FAMILY_BONUS_ADJACENT
    ) {
      best = SENSORY_FAMILY_BONUS_ADJACENT;
    }
  }
  return best;
}

function categorize(
  score: number,
  conflicts: number,
  isDisliked: boolean,
): Category {
  if (isDisliked) return "Avoid";
  let cat: Category;
  if (score >= 80) cat = "Best Match";
  else if (score >= 66) cat = "Closest Alternative";
  else if (score >= 50) cat = "Worth Trying";
  else if (score >= 36) cat = "Risky";
  else cat = "Avoid";

  const rank: Category[] = ["Avoid", "Risky", "Worth Trying", "Closest Alternative", "Best Match"];
  const cap = (max: Category) => {
    if (rank.indexOf(cat) > rank.indexOf(max)) cat = max;
  };
  if (conflicts >= 2) cap("Risky");
  else if (conflicts === 1) cap("Closest Alternative");
  return cat;
}

export function useCaseFor(strain: StrainProfile): string {
  const e = new Set(strain.effects);
  if (e.has("sleepy") || e.has("couch-lock")) return "Late-night wind-down and sleep";
  if (e.has("body-heavy") || (e.has("relaxed") && strain.type === "indica"))
    return "Evening relaxation and body relief";
  if (e.has("focused") || e.has("energetic")) return "Daytime focus and activity";
  if (e.has("creative") || e.has("uplifted")) return "Creative or social daytime sessions";
  if (e.has("relaxed")) return "Easygoing anytime use";
  return "Balanced anytime use";
}

// ---- Feedback loop -------------------------------------------------
// A lightweight layer on top of the deterministic engine. Confirmed
// likes and dislikes nudge the base score for strains that are
// sensorily similar to what the user has already judged. It is
// deliberately bounded: a single rating can only move a score a few
// points, and the effect grows as more consistent feedback accumulates.

interface ResolvedFeedback {
  strain: StrainProfile;
  liked: boolean;
  sim: number;
}

// How quickly trust saturates. Higher = single ratings matter less.
const FEEDBACK_DAMPING = 2;
// Maximum points the feedback layer can shift a score in either direction.
const FEEDBACK_MAX_SHIFT = 12;

function topFeedbackTags(entries: ResolvedFeedback[]): string[] {
  const tally = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.strain.aromas) {
      tally.set(tag, (tally.get(tag) ?? 0) + entry.sim);
    }
  }
  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tag]) => tag);
}

function evaluateFeedback(
  candidate: StrainProfile,
  feedback: FeedbackSignal[],
): { adjustment: number; note: string | null; confidenceBoost: number } {
  if (feedback.length === 0) {
    return { adjustment: 0, note: null, confidenceBoost: 0 };
  }

  const entries: ResolvedFeedback[] = feedback.map((signal) => {
    const { strain } = resolveStrain(signal.strainName);
    return { strain, liked: signal.liked, sim: similarity(candidate, strain) };
  });

  // "Support" is how much of the user's feedback is actually relevant
  // to this candidate — the sum of similarities.
  const support = entries.reduce((acc, e) => acc + e.sim, 0);
  if (support < 0.15) {
    return { adjustment: 0, note: null, confidenceBoost: 0 };
  }

  // Similarity-weighted average sentiment, in [-1, 1].
  const sentiment =
    entries.reduce((acc, e) => acc + (e.liked ? 1 : -1) * e.sim, 0) / support;
  // Trust grows with the volume of relevant feedback but never reaches 1,
  // so one rating alone cannot dominate.
  const trust = support / (support + FEEDBACK_DAMPING);
  const adjustment = Math.round(sentiment * trust * FEEDBACK_MAX_SHIFT);

  // Confidence only firms up once several confirmed, relevant ratings exist.
  const confidenceBoost = feedback.length >= 3 && support >= 0.6 ? 1 : 0;

  let note: string | null = null;
  if (Math.abs(adjustment) >= 3) {
    const positive = adjustment > 0;
    const relevant = entries.filter(
      (e) => e.liked === positive && e.sim > 0.1,
    );
    const tags = topFeedbackTags(relevant);
    if (tags.length > 0) {
      note = positive
        ? `Your saved feedback leans toward ${joinList(tags)} flower, so this pick received a small boost.`
        : `Your saved feedback leans away from ${joinList(tags)} flower, so this pick was slightly penalised.`;
    } else {
      note = positive
        ? "Your saved feedback nudged this pick upward."
        : "Your saved feedback nudged this pick downward.";
    }
  }

  return { adjustment, note, confidenceBoost };
}

function bumpConfidence(base: Confidence, boost: number): Confidence {
  if (boost <= 0) return base;
  const tiers: Confidence[] = ["low", "medium", "high"];
  const idx = Math.min(tiers.length - 1, tiers.indexOf(base) + boost);
  return tiers[idx];
}

// Friendly name for the taste mode a candidate matched, surfaced in the
// explanation only when the profile is genuinely multi-modal. Keeps the
// behavioural-family key out of user-facing copy.
const FAMILY_SIDE_LABEL: Record<BehavioralFamily, string> = {
  "nighttime-indica": "your wind-down side",
  "daytime-functional": "your daytime side",
  "edgy-stimulant": "your high-energy side",
  "contemplative-quiet": "your mellow side",
  "exotic-modern-hybrid": "your exotic-hybrid side",
};

export function scoreStrain(
  rawName: string,
  profile: TasteProfileInput,
  feedback: FeedbackSignal[] = [],
): StrainMatch {
  const { strain, known } = resolveStrain(rawName);

  const aroma = setScore(strain.aromas, profile.preferredAromas, strain.primaryAromas);
  const flavor = setScore(strain.flavors, profile.preferredFlavors, strain.primaryFlavors);
  const effect = setScore(strain.effects, profile.preferredEffects, strain.primaryEffects);
  const trait = setScore(strain.traits, profile.likedTraits);
  const ref = referenceSimilarity(strain, profile.favoriteStrains);

  // Primary-aroma weighting. When the user named one aroma family as the
  // thing that stops them (forced choice), a strain whose nose lands in
  // that family gets a bounded aroma boost — the broad multi-select dilutes
  // this signal, the forced choice restores it. Same boosted value feeds
  // both the weighted sum and the archetype-bonus threshold below.
  const primaryTokens = primaryAromaTokens(profile);
  const matchesPrimaryAroma =
    primaryTokens.length > 0 &&
    strain.aromas.some((a) => primaryTokens.includes(a));
  const aromaScore = matchesPrimaryAroma
    ? Math.min(100, aroma.score + PRIMARY_AROMA_BONUS)
    : aroma.score;
  const resolvedFavorites = profile.favoriteStrains
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));
  const conflicts = dislikedConflicts(strain, profile, resolvedFavorites);

  // Disliked detection — resolve aliases through findStrain so that flagging
  // "GG4" also catches "Gorilla Glue #4" and vice versa.
  const isDisliked = profile.dislikedStrains.some((d) => {
    const resolved = findStrain(d);
    if (resolved && resolved.name === strain.name) return true;
    return normalizeStrainName(d) === normalizeStrainName(rawName);
  });

  // Favorite anchor — when the strain the user is looking at is canonically
  // one of their saved favourites (alias-aware via findStrain inside
  // referenceSimilarity), it has to dominate the score. A weighted-sum of
  // partial signals can otherwise cap a favourite around 70% if the rest of
  // the profile is sparse, which destroys trust. Disliked-list wins ties.
  const isFavoriteAnchor = !isDisliked && ref.score === 100 && ref.against !== null;
  const favoriteAnchorName: string | null = isFavoriteAnchor ? ref.against : null;

  // For the explanation: did the match come through an alias (either the
  // saved favourite was written as an alias, or the user typed an alias of
  // the favourite on the menu)? We surface this so wording can be honest:
  // "one of your saved favourites" vs "matches one of your saved favourites
  // by alias".
  let favoriteMatchKind: "canonical" | "alias" = "canonical";
  let favoriteSurface: string | null = null;
  if (isFavoriteAnchor) {
    const matchedFavoriteSurface = profile.favoriteStrains.find((f) => {
      const r = findStrain(f);
      return r !== null && r.name === strain.name;
    });
    favoriteSurface = matchedFavoriteSurface ?? null;
    const favoriteIsCanonical =
      matchedFavoriteSurface !== undefined &&
      normalizeStrainName(matchedFavoriteSurface) ===
        normalizeStrainName(strain.name);
    const strainTypedCanonical =
      normalizeStrainName(rawName) === normalizeStrainName(strain.name);
    if (!favoriteIsCanonical || !strainTypedCanonical) {
      favoriteMatchKind = "alias";
    }
  }

  // Behavioural-archetype layer. Raw effect-tags ("energetic + focused")
  // collapse very different experiences — Green Crack's sharp dopamine
  // spike reads the same as Jack Herer's clean creative daytime on
  // tag-overlap alone. Archetypes split those buckets.
  //
  // Bonus is graduated, not binary, so within-family alignment registers:
  //   - Exact archetype + strong sensory (aroma OR flavor ≥ 70) → +5
  //   - Exact archetype alone                                   → +3
  //   - Adjacent archetype (within-family neighbour)            → +1
  //   - Cross-family (not adjacent) + effect overlap            → dampen
  //                                                                effect ×0.6
  //
  // The +1 adjacent step exists because users with NL/GDP/Bubba favourites
  // (all deep-sleeper) should see Purple Punch (exact deep-sleeper) score
  // a little above LA Kush Cake / Wedding Cake (dessert-couch-lock,
  // adjacent within nighttime-indica). Before this graduation, exact and
  // adjacent both produced 0 archetype bonus and collapsed in the score.
  // Behavioural target layers (archetype / texture / family). These are the
  // only target-dependent parts of the score. We evaluate them per taste
  // mode and credit the candidate by whichever mode it fits best — the
  // max-over-modes selection runs once the weights are known (below). For
  // ordinary single-mode profiles there is exactly one mode whose target
  // equals resolveProfileTarget(profile), so the result is unchanged.
  //
  // Layer 1 archetype: raw effect tags collapse very different experiences
  // (Green Crack's sharp spike reads like Jack Herer's clean daytime);
  // archetypes split them. Bonus is graduated — exact + strong sensory +5,
  // exact +3, adjacent +1, else 0. A cross-family archetype miss dampens the
  // effect channel to 60% (80% — the half-damper — when the nose matches the
  // user's primary aroma, which they said pulls them in). Layer 2 texture is
  // a bounded ±3. Layer 3 family is recognition-only 0..+8, evidence-gated.
  const strainArchetype = effectArchetypeOf(strain);
  const strainTexture = effectTextureOf(strain);
  const strainFamily = behavioralFamilyOf(strain);
  const mismatchDamper = matchesPrimaryAroma ? 0.8 : 0.6;
  const familyEvidence = {
    effectMatched: effect.matched.length,
    aromaMatched: aroma.matched.length,
    flavorMatched: flavor.matched.length,
    refScore: ref.score,
    effectScore: effect.score,
  };

  const layersForTarget = (t: ResolvedTarget) => {
    const tArch = t.archetype;
    const match = tArch !== null && tArch === strainArchetype;
    const adjacent =
      tArch !== null && tArch !== strainArchetype && areAdjacent(tArch, strainArchetype);
    const mismatch = tArch !== null && !areAdjacent(tArch, strainArchetype);
    const effectContribution =
      mismatch && effect.matched.length > 0 ? effect.score * mismatchDamper : effect.score;
    const archetypeBonus = match
      ? aromaScore >= 70 || flavor.score >= 70
        ? 5
        : 3
      : adjacent
        ? 1
        : 0;
    const textureMod = textureContribution(strainTexture, t.texture);
    const familyMod = familyBonus(strainFamily, t.family, familyEvidence);
    return { effectContribution, archetypeBonus, textureMod, familyMod };
  };

  // Trust-favorites mode — fires when ≥ 2 of the user's resolved favourites
  // cluster in the same behavioural family. In that case the user has
  // given us a strong empirical anchor (their lived experience), so the
  // formula treats reference-similarity as the dominant signal and the
  // enumerated preference tags as supporting. This is the architectural
  // answer to contradictory profiles — favourites say "kush nighttime"
  // while preferredAromas say "citrus daytime."
  //
  // Important: this is a re-weighting, not a Layer-3 penalty. Cross-family
  // strains can still win if they're genuinely exceptional on the
  // remaining signals; they just no longer auto-win on tag overlap alone.
  // Default mode (no clustered favourites) keeps the original weights so
  // sparse/exploring profiles are not affected. In both modes the
  // texture and quality channels take a tiny slice so the previously
  // collected-but-unused fields finally pull weight — small enough to
  // be a tiebreaker, never a primary signal.
  const trustMode = hasClusteredFavorites(profile);
  const W = trustMode
    ? {
        effect: 0.21,
        aroma: 0.17,
        flavor: 0.13,
        trait: 0.1,
        ref: 0.34,
        texture: 0.03,
        quality: 0.02,
      }
    : {
        effect: 0.25,
        aroma: 0.22,
        flavor: 0.17,
        trait: 0.13,
        ref: 0.18,
        texture: 0.03,
        quality: 0.02,
      };

  // Sensory-family bonus — orthogonal to the behavioural family used by
  // familyMod above. familyMod looks at effect-feel (nighttime-indica,
  // daytime-functional, …); sensoryFamily looks at aroma/cluster
  // identity (gas-og, garlic-funk, kush-classic, …). Both can fire on
  // the same candidate without double-counting because they measure
  // different signals — but the bonus only fires when both candidate
  // and at least one favourite carry an identity record.
  const sensoryMod = sensoryFamilyBonus(strain, resolvedFavorites);

  // Defensive against legacy DB rows where these columns were not
  // backfilled (the schema declares String[] but historic profiles in
  // production may carry NULL — Postgres permits it on text[] columns
  // without an explicit @default([]). Before PR #52 nobody read these
  // fields so NULLs were silent; now they'd crash .map(). Always
  // coerce to [] at this single seam.
  const texture = textureScore(strain, profile.texturePreferences ?? []);
  const quality = qualityScore(strain, profile.qualityPriorities ?? []);

  // Multi-modal selection: credit the candidate by the taste mode it fits
  // best (highest target-driven value at the current weights). deriveTasteModes
  // returns a single mode for ordinary profiles, so this collapses to the
  // pre-change single-target computation and leaves their scores unchanged.
  const modes = deriveTasteModes(profile);
  let layers = layersForTarget(modes[0].target);
  let selectedMode = modes[0];
  let bestModeValue =
    W.effect * layers.effectContribution +
    layers.archetypeBonus +
    layers.textureMod +
    layers.familyMod;
  for (let i = 1; i < modes.length; i++) {
    const cand = layersForTarget(modes[i].target);
    const value =
      W.effect * cand.effectContribution +
      cand.archetypeBonus +
      cand.textureMod +
      cand.familyMod;
    if (value > bestModeValue) {
      bestModeValue = value;
      layers = cand;
      selectedMode = modes[i];
    }
  }
  const { effectContribution, archetypeBonus, textureMod, familyMod } = layers;

  // Explanation note for which taste mode matched — only when the profile is
  // genuinely multi-modal AND the candidate actually earned target-driven
  // recognition from the chosen mode (otherwise the mention would be noise).
  const modeNote =
    modes.length > 1 &&
    (familyMod > 0 || archetypeBonus > 0) &&
    selectedMode.family !== null
      ? FAMILY_SIDE_LABEL[selectedMode.family]
      : null;

  const raw =
    W.effect * effectContribution +
    W.aroma * aromaScore +
    W.flavor * flavor.score +
    W.trait * trait.score +
    W.ref * ref.score +
    W.texture * texture.score +
    W.quality * quality +
    archetypeBonus +
    textureMod +
    familyMod +
    sensoryMod;
  const penalty = Math.min(42, conflicts.length * 15);
  // Pre-calibration score with decimal precision. Same formula as the
  // visible matchScore but without anchor floor, 99 base cap, or 88
  // non-anchor ceiling. Used to break ties when multiple strains end up
  // displaying the same matchScore — the engine differentiates them on
  // the raw side but the calibration bands compress that signal away.
  const unclampedScore = raw - penalty;
  let baseScore = Math.round(raw - penalty);
  if (isDisliked) baseScore = Math.min(baseScore, 18);
  // Favourite anchor lives in 94–96. Never 100, because grower, batch
  // freshness, package date and storage are not captured — even a perfect
  // sensory match can be a bad pickup. Anchor floor wins over the
  // archetype dampener intentionally — the user explicitly chose this
  // strain.
  if (isFavoriteAnchor) baseScore = clamp(Math.max(baseScore, 94), 94, 96);
  baseScore = clamp(baseScore, 4, 99);

  // Feedback loop: the deterministic base score is the anchor; confirmed
  // likes/dislikes on similar past strains nudge it within a bounded range.
  // A favorite anchor is exempt — the user already told us this is the
  // reference, noise from related sessions shouldn't drag it down.
  const fb = evaluateFeedback(strain, feedback);
  const fbAdjustment = isFavoriteAnchor ? 0 : fb.adjustment;
  let matchScore = clamp(baseScore + fbAdjustment, 4, 99);
  // Calibration band: reserve 94–96 exclusively for direct favourite
  // anchors. Strong non-anchor alternatives top out at 88 so the visual
  // gap between "your strain" and "close alternative" stays obvious.
  // Anchors flow through unchanged.
  const NON_ANCHOR_CEILING = 88;
  if (!isFavoriteAnchor && matchScore > NON_ANCHOR_CEILING) {
    matchScore = NON_ANCHOR_CEILING;
  }

  let category = categorize(matchScore, conflicts.length, isDisliked);
  if (isFavoriteAnchor) category = "Best Match";

  const depthSignals = [
    profile.preferredAromas,
    profile.preferredEffects,
    profile.preferredFlavors,
    profile.likedTraits,
    profile.favoriteStrains,
  ].filter((a) => a.length > 0).length;

  let baseConfidence: Confidence;
  if (!known) baseConfidence = depthSignals >= 4 ? "medium" : "low";
  else if (depthSignals >= 4) baseConfidence = "high";
  else if (depthSignals >= 2) baseConfidence = "medium";
  else baseConfidence = "low";
  // Favorite anchors are high-confidence by definition — the user has told us
  // this is their reference point.
  if (isFavoriteAnchor) baseConfidence = "high";
  const confidence = bumpConfidence(baseConfidence, fb.confidenceBoost);

  const whyItFits = buildWhyItFits(
    effect,
    aroma,
    flavor,
    trait,
    ref,
    favoriteAnchorName,
    favoriteMatchKind,
    favoriteSurface,
    modeNote,
  );
  const riskNotes = buildRiskNotes(strain, known, conflicts, profile);
  const explanation = buildExplanation(
    strain,
    matchScore,
    category,
    confidence,
    favoriteAnchorName,
    favoriteMatchKind,
    favoriteSurface,
  );
  // Second axis: purchase confidence. Today nothing is known about the
  // batch, grower or storage, so this returns all-"unknown". The seam is
  // here for grower-reliability and freshness signals to plug in later.
  const purchaseConfidence = evaluatePurchase();

  return {
    strainName: rawName.trim(),
    resolvedName: strain.name,
    knownStrain: known,
    category,
    matchScore,
    unclampedScore,
    confidence,
    aromaMatch: aroma.score,
    flavorMatch: flavor.score,
    effectMatch: effect.score,
    traitMatch: trait.score,
    referenceSimilarity: ref.score,
    matchedAromas: aroma.matched,
    matchedFlavors: flavor.matched,
    matchedEffects: effect.matched,
    conflicts,
    whyItFits,
    riskNotes,
    explanation,
    feedbackAdjustment: fbAdjustment,
    feedbackNote: isFavoriteAnchor ? null : fb.note,
    purchaseConfidence,
  };
}

function buildWhyItFits(
  effect: { matched: string[] },
  aroma: { matched: string[] },
  flavor: { matched: string[] },
  trait: { matched: string[] },
  ref: { score: number; against: string | null },
  favoriteAnchorName: string | null,
  favoriteMatchKind: "canonical" | "alias",
  favoriteSurface: string | null,
  modeNote: string | null,
): string {
  if (favoriteAnchorName) {
    const supporting: string[] = [];
    if (effect.matched.length)
      supporting.push(`the ${labelList(effect.matched)} effect you're after`);
    if (aroma.matched.length) supporting.push(`a ${labelList(aroma.matched)} nose`);
    if (flavor.matched.length) supporting.push(`${labelList(flavor.matched)} on the palate`);
    const tail = supporting.length
      ? ` It also lines up with ${joinList(supporting)}.`
      : "";
    const opener =
      favoriteMatchKind === "alias" && favoriteSurface
        ? `It matches one of your saved favourites by alias — you listed it as “${favoriteSurface}”, and ${favoriteAnchorName} is the canonical strain SŌMA reads it as.`
        : `It is one of your saved favourites — SŌMA treats ${favoriteAnchorName} as your direct sensory anchor.`;
    return `${opener}${tail}`;
  }

  const points: string[] = [];
  // Multi-modal: lead with which side of the user's taste this matched.
  if (modeNote) points.push(modeNote);
  if (effect.matched.length)
    points.push(`the ${labelList(effect.matched)} effect you're after`);
  if (aroma.matched.length) points.push(`a ${labelList(aroma.matched)} nose`);
  if (flavor.matched.length) points.push(`${labelList(flavor.matched)} on the palate`);
  if (trait.matched.length) points.push(`${labelList(trait.matched)} structure`);
  // Four-tier wording for favourite kinship. The exact-anchor case is
  // handled above; here we distinguish "close to" vs "same sensory
  // territory" vs nothing, so the language is honest about how strong the
  // link actually is.
  if (ref.against) {
    if (ref.score >= 72) {
      points.push(`closeness to your saved favourite ${ref.against}`);
    } else if (ref.score >= 60) {
      points.push(`the same sensory territory as ${ref.against}`);
    }
  }

  if (points.length === 0) {
    return "It is a balanced profile with no strong clash against your taste profile, though nothing in it strongly echoes your stated favourites either.";
  }
  return `It lands on ${joinList(points)}.`;
}

function buildRiskNotes(
  strain: StrainProfile,
  known: boolean,
  conflicts: string[],
  profile: TasteProfileInput,
): string {
  const risks: string[] = [];
  for (const c of conflicts) risks.push(`it leans toward ${c}`);

  const concerns = profile.dislikedTraits.filter((d) =>
    BATCH_QUALITY_TRAITS.has(d),
  );
  if (concerns.length) {
    risks.push(
      `you flagged ${labelList(concerns)} on past pickups — that comes down to freshness, packaging date and storage rather than the strain itself`,
    );
  }
  if (!known) {
    risks.push(
      "we don't hold detailed sensory data on this one, so the read above is inferred from the name",
    );
  }
  risks.push(
    "the same strain can be excellent from one grower and flat from another, so batch quality and cure still decide the experience",
  );

  const sentence = risks
    .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
    .join(". ");
  return `${sentence}. This is a sensory match, not a guarantee.`;
}

function buildExplanation(
  strain: StrainProfile,
  score: number,
  category: Category,
  confidence: Confidence,
  favoriteAnchorName: string | null,
  favoriteMatchKind: "canonical" | "alias",
  favoriteSurface: string | null,
): string {
  if (favoriteAnchorName) {
    const opener =
      favoriteMatchKind === "alias" && favoriteSurface
        ? `${strain.name} matches one of your saved favourites by alias — you listed it as “${favoriteSurface}”. It's the same strain canonically, so SŌMA treats it as a direct sensory anchor.`
        : `${strain.name} is one of your saved favourites, so SŌMA treats it as a direct sensory anchor.`;
    const cap = `It lands at ${score}% — not 100% — because grower, batch freshness, package date and storage are not captured here. Sensory identity matches your preference; purchase quality is still unknown.`;
    return `${opener} ${cap}`;
  }
  const opener = `${strain.name} lands at ${score}% — a ${category.toLowerCase()} for your profile.`;
  const direction =
    category === "Avoid"
      ? "On sensory grounds it pulls away from what you've told us you enjoy, so it is likely a poor use of your money."
      : category === "Risky"
        ? "There is some overlap with your taste, but enough friction that it could genuinely go either way."
        : category === "Worth Trying"
          ? "It overlaps with your taste in real ways without being a perfect echo of your favourites."
          : "It sits close to the sensory territory you keep returning to.";
  const caveat = `Confidence in this read is ${confidence}; batch quality still depends on grower, freshness and storage, so treat it as a sensory match rather than a guarantee.`;
  return `${opener} ${direction} ${caveat}`;
}

export function analyze(
  strainNames: string[],
  profile: TasteProfileInput,
  feedback: FeedbackSignal[] = [],
): AnalysisResult {
  const seen = new Set<string>();
  const recommendations: StrainMatch[] = [];

  for (const name of strainNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const key = normalizeStrainName(trimmed);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    recommendations.push(scoreStrain(trimmed, profile, feedback));
  }

  // Primary sort by visible matchScore; tie-breaker on unclampedScore so
  // the calibration ceiling (88) doesn't collapse the engine's actual
  // ordering of close non-anchor candidates.
  recommendations.sort(
    (a, b) =>
      b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );

  return {
    recommendations,
    engine: "builtin",
    generatedAt: new Date().toISOString(),
  };
}

export const KNOWN_STRAIN_NAMES = STRAINS.map((s) => s.name).sort();
