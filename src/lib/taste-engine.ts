// SOMA Taste Match Engine
// ------------------------------------------------------------------
// The deterministic heart of the product. It scores each available
// strain against a user's personal taste profile and explains *why*
// something fits — or does not. It never claims to know batch quality
// it cannot see: caveats about grower, freshness and storage are baked
// into every explanation.

import { findStrain, normalizeStrainName, STRAINS } from "./strain-data";
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

const NEUTRAL = 52;

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
  return Math.min(1, sim);
}

function setScore(
  strainTags: string[],
  preferred: string[],
): { score: number; matched: string[] } {
  if (preferred.length === 0) return { score: NEUTRAL, matched: [] };
  const tagSet = new Set(strainTags);
  const matched = preferred.filter((p) => tagSet.has(p));
  const coverage = matched.length / preferred.length;
  return { score: Math.round(26 + coverage * 74), matched };
}

function referenceSimilarity(
  strain: StrainProfile,
  favorites: string[],
): { score: number; against: string | null } {
  const resolved = favorites
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));
  if (resolved.length === 0) return { score: NEUTRAL, against: null };

  let best = 0;
  let against = resolved[0].name;
  for (const fav of resolved) {
    if (normalizeStrainName(fav.name) === normalizeStrainName(strain.name)) {
      return { score: 100, against: fav.name };
    }
    const sim = similarity(strain, fav);
    if (sim > best) {
      best = sim;
      against = fav.name;
    }
  }
  return { score: Math.round(best * 100), against };
}

function dislikedConflicts(
  strain: StrainProfile,
  disliked: string[],
): string[] {
  const conflicts: string[] = [];
  const has = (...tags: string[]) =>
    tags.some(
      (t) =>
        strain.aromas.includes(t) ||
        strain.flavors.includes(t) ||
        strain.effects.includes(t) ||
        strain.traits.includes(t),
    );

  for (const d of disliked) {
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
  return conflicts;
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

export function scoreStrain(
  rawName: string,
  profile: TasteProfileInput,
  feedback: FeedbackSignal[] = [],
): StrainMatch {
  const { strain, known } = resolveStrain(rawName);

  const aroma = setScore(strain.aromas, profile.preferredAromas);
  const flavor = setScore(strain.flavors, profile.preferredFlavors);
  const effect = setScore(strain.effects, profile.preferredEffects);
  const trait = setScore(strain.traits, profile.likedTraits);
  const ref = referenceSimilarity(strain, profile.favoriteStrains);
  const conflicts = dislikedConflicts(strain, profile.dislikedTraits);

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

  const raw =
    0.27 * effect.score +
    0.23 * aroma.score +
    0.18 * flavor.score +
    0.14 * trait.score +
    0.18 * ref.score;
  const penalty = Math.min(42, conflicts.length * 15);
  let baseScore = Math.round(raw - penalty);
  if (isDisliked) baseScore = Math.min(baseScore, 18);
  if (isFavoriteAnchor) baseScore = Math.max(baseScore, 96);
  baseScore = clamp(baseScore, 4, 99);

  // Feedback loop: the deterministic base score is the anchor; confirmed
  // likes/dislikes on similar past strains nudge it within a bounded range.
  // A favorite anchor is exempt — the user already told us this is the
  // reference, noise from related sessions shouldn't drag it down.
  const fb = evaluateFeedback(strain, feedback);
  const fbAdjustment = isFavoriteAnchor ? 0 : fb.adjustment;
  const matchScore = clamp(baseScore + fbAdjustment, 4, 99);

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
  );
  const riskNotes = buildRiskNotes(strain, known, conflicts, profile);
  const explanation = buildExplanation(
    strain,
    matchScore,
    category,
    confidence,
    favoriteAnchorName,
  );

  return {
    strainName: rawName.trim(),
    resolvedName: strain.name,
    knownStrain: known,
    category,
    matchScore,
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
  };
}

function buildWhyItFits(
  effect: { matched: string[] },
  aroma: { matched: string[] },
  flavor: { matched: string[] },
  trait: { matched: string[] },
  ref: { score: number; against: string | null },
  favoriteAnchorName: string | null,
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
    return `It's the saved favourite itself — SŌMA treats ${favoriteAnchorName} as your direct sensory anchor.${tail}`;
  }

  const points: string[] = [];
  if (effect.matched.length)
    points.push(`the ${labelList(effect.matched)} effect you're after`);
  if (aroma.matched.length) points.push(`a ${labelList(aroma.matched)} nose`);
  if (flavor.matched.length) points.push(`${labelList(flavor.matched)} on the palate`);
  if (trait.matched.length) points.push(`${labelList(trait.matched)} structure`);
  if (ref.score >= 72 && ref.against)
    points.push(`a clear kinship with ${ref.against}`);

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
): string {
  if (favoriteAnchorName) {
    return (
      `${strain.name} is one of your saved favourites, so SŌMA treats it as a direct sensory anchor rather than scoring it like any other strain — it lands at ${score}%. ` +
      `Confidence in this read is ${confidence}; batch quality still depends on grower, freshness and storage, so even a favourite can vary from one purchase to the next.`
    );
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

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return {
    recommendations,
    engine: "builtin",
    generatedAt: new Date().toISOString(),
  };
}

export const KNOWN_STRAIN_NAMES = STRAINS.map((s) => s.name).sort();
