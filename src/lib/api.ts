import { prisma } from "./prisma";
import type { ParsedMenuItem } from "./parse-menu";
import {
  emptyPurchaseConfidence,
  isPurchaseConfidence,
} from "./purchase-confidence";
import { buildUnknownStrainPayloads } from "./unknown-strains";
import type {
  Category,
  Confidence,
  FeedbackData,
  FeedbackSignal,
  MenuQuality,
  PurchaseConfidence,
  SessionRecommendation,
  StrainMatch,
} from "./types";

// Confirmed likes/dislikes the user has logged, resolved into signals the
// Taste Match Engine can fold into future scoring.
//
// Reads from two tables:
//   - Feedback: tied to a saved Recommendation row (Taste Match
//     session-grade verdicts captured on /saved)
//   - StrainFeedback: keyed directly on the strain, captured from
//     quick-rate pills on Compare and other surfaces
// Both surface as the same FeedbackSignal shape so the engine's
// evaluateFeedback() loop doesn't need to know which surface a verdict
// came from. The 4-state strain verdict collapses to the binary
// `liked` field the engine expects:
//   "loved"   → liked=true,  rating=5
//   "good"    → liked=true,  rating=4
//   "neutral" → skipped (no useful signal)
//   "avoid"   → liked=false, rating=1
// Capped at 400 rows total (200 per source) so the loop stays bounded.
export async function getFeedbackSignals(
  userId: string,
): Promise<FeedbackSignal[]> {
  const [classic, strainLevel] = await Promise.all([
    prisma.feedback.findMany({
      where: { userId, liked: { not: null } },
      include: {
        recommendation: { select: { resolvedName: true, strainName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    // Strain-level feedback is an additive layer. If its table hasn't been
    // provisioned yet (deploy ran `next build` without a `prisma db push`),
    // don't let a missing table take down the catalog — degrade to classic
    // feedback only. See `db:push` in package.json.
    prisma.strainFeedback
      .findMany({
        where: { userId, verdict: { in: ["loved", "good", "avoid"] } },
        orderBy: { updatedAt: "desc" },
        take: 200,
      })
      .catch((err) => {
        console.error("getFeedbackSignals: strainFeedback query failed", err);
        return [] as Awaited<ReturnType<typeof prisma.strainFeedback.findMany>>;
      }),
  ]);

  const fromClassic: FeedbackSignal[] = classic.map((row) => ({
    strainName: row.recommendation.resolvedName || row.recommendation.strainName,
    liked: row.liked === true,
    rating: row.rating,
    // A 1–5 star rating maps onto the signed scale (3 = neutral): 5→+1,
    // 4→+0.5, 2→-0.5, 1→-1. Without a rating, fall back to the like flag.
    strength:
      row.rating != null
        ? Math.max(-1, Math.min(1, (row.rating - 3) / 2))
        : row.liked === true
          ? 1
          : -1,
  }));

  const fromStrain: FeedbackSignal[] = strainLevel
    .map((row): FeedbackSignal | null => {
      switch (row.verdict) {
        case "loved":
          return { strainName: row.strainName, liked: true, rating: 5, strength: 1 };
        case "good":
          // A softer yes — "I'd smoke it again", not "this is my lane". Counts
          // at half a loved so it refines order without redefining taste.
          return { strainName: row.strainName, liked: true, rating: 4, strength: 0.5 };
        case "avoid":
          return { strainName: row.strainName, liked: false, rating: 1, strength: -1 };
        default:
          return null;
      }
    })
    .filter((s): s is FeedbackSignal => s !== null);

  // When the same strain has both a classic Recommendation-tied
  // verdict and a strain-level quick verdict, the more recent one
  // should win. Classic rows ship first in the array; replace by
  // strain-level if we have one (StrainFeedback unique-key
  // guarantees there's at most one per strain).
  const merged = new Map<string, FeedbackSignal>();
  for (const s of fromClassic) merged.set(s.strainName, s);
  for (const s of fromStrain) merged.set(s.strainName, s);
  return [...merged.values()];
}

export function asArray(value: unknown, max = 40): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const s = String(item ?? "").trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s.slice(0, 120));
    if (out.length >= max) break;
  }
  return out;
}

export function asText(value: unknown, max = 4000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

// Whitelist + clamp the structured items the client sends along with a paste,
// so we don't trust raw JSON from the browser when we persist it.
export function sanitizeParsedItems(value: unknown, max = 60): ParsedMenuItem[] {
  if (!Array.isArray(value)) return [];
  const out: ParsedMenuItem[] = [];
  for (const raw of value.slice(0, max)) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const strainName =
      typeof r.strainName === "string" ? r.strainName.slice(0, 120).trim() : "";
    if (!strainName) continue;
    out.push({
      strainName,
      grower: typeof r.grower === "string" ? r.grower.slice(0, 80) : null,
      thcPercent: typeof r.thcPercent === "number" ? r.thcPercent : null,
      price: typeof r.price === "number" ? r.price : null,
      weight: typeof r.weight === "string" ? r.weight.slice(0, 20) : null,
      rawLine:
        typeof r.rawLine === "string" ? r.rawLine.slice(0, 400) : strainName,
      confidence:
        r.confidence === "low" || r.confidence === "medium" || r.confidence === "high"
          ? r.confidence
          : "high",
      warnings: Array.isArray(r.warnings)
        ? r.warnings.filter((w): w is string => typeof w === "string").slice(0, 6)
        : [],
    });
  }
  return out;
}

const CONFIDENCE_WEIGHT: Record<"high" | "medium" | "low", number> = {
  high: 1,
  medium: 0.6,
  low: 0.3,
};

export function computeMenuQuality(
  items: ParsedMenuItem[],
  matches: StrainMatch[],
): MenuQuality {
  const totalParsed = items.length;
  const unclearRows = items.filter((i) => i.confidence !== "high").length;
  const unknownStrains = matches.filter((m) => !m.knownStrain).length;
  const avgConfidence =
    totalParsed === 0
      ? 0
      : Math.round(
          (items.reduce((acc, i) => acc + CONFIDENCE_WEIGHT[i.confidence], 0) /
            totalParsed) *
            100,
        ) / 100;
  return { totalParsed, unclearRows, unknownStrains, avgConfidence };
}

// Distinct warning strings collected from the parsed items, kept as a flat
// list so the DB column stays queryable without unpacking JSON.
export function flattenParserWarnings(items: ParsedMenuItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    for (const w of item.warnings) set.add(w);
  }
  return [...set].slice(0, 20);
}

// Unknown strains feed the seed-expansion queue. Each (userId, normalizedName,
// growerKey) is upserted so that recurring strains bump occurrences/lastSeenAt
// rather than create new rows. rawName is preserved exactly as received.
export async function logUnknownStrains(
  userId: string,
  sessionId: string | null,
  matches: StrainMatch[],
  items: ParsedMenuItem[],
): Promise<void> {
  const payloads = buildUnknownStrainPayloads(userId, sessionId, matches, items);
  if (payloads.length === 0) return;

  for (const p of payloads) {
    await prisma.unknownStrain.upsert({
      where: {
        userId_normalizedName_growerKey: {
          userId: p.userId,
          normalizedName: p.normalizedName,
          growerKey: p.growerKey,
        },
      },
      create: {
        userId: p.userId,
        sessionId: p.sessionId,
        rawName: p.rawName,
        normalizedName: p.normalizedName,
        grower: p.grower,
        growerKey: p.growerKey,
        rawLine: p.rawLine,
      },
      update: {
        occurrences: { increment: 1 },
        lastSeenAt: new Date(),
        // Keep the most recent session and raw line so the latest sighting is
        // easy to inspect; rawName stays as first seen for stable display.
        sessionId: p.sessionId,
        rawLine: p.rawLine ?? undefined,
      },
    });
  }
}

interface DbRecommendation {
  id: string;
  strainName: string;
  resolvedName: string;
  knownStrain: boolean;
  category: string;
  matchScore: number;
  confidence: string;
  aromaMatch: number;
  flavorMatch: number;
  effectMatch: number;
  whyItFits: string;
  riskNotes: string;
  explanation: string;
  feedbackNote: string | null;
  purchaseConfidence?: unknown;
}

interface DbFeedback {
  id: string;
  purchased: boolean | null;
  liked: boolean | null;
  rating: number | null;
  notes: string | null;
}

export function toFeedbackData(
  feedback: DbFeedback | null | undefined,
): FeedbackData | null {
  if (!feedback) return null;
  return {
    id: feedback.id,
    purchased: feedback.purchased,
    liked: feedback.liked,
    rating: feedback.rating,
    notes: feedback.notes,
  };
}

export function dbRecToView(
  r: DbRecommendation,
  feedback: DbFeedback | null = null,
): SessionRecommendation {
  const purchaseConfidence: PurchaseConfidence = isPurchaseConfidence(
    r.purchaseConfidence,
  )
    ? r.purchaseConfidence
    : emptyPurchaseConfidence();
  return {
    id: r.id,
    strainName: r.strainName,
    resolvedName: r.resolvedName,
    knownStrain: r.knownStrain,
    category: r.category as Category,
    matchScore: r.matchScore,
    // Old DB rows don't carry the pre-calibration score (the column
    // doesn't exist on Recommendation). Defaulting to matchScore is
    // safe: tie-break sort degrades to insertion order, identical to
    // pre-v6 behaviour.
    unclampedScore: r.matchScore,
    confidence: r.confidence as Confidence,
    aromaMatch: r.aromaMatch,
    flavorMatch: r.flavorMatch,
    effectMatch: r.effectMatch,
    traitMatch: 0,
    referenceSimilarity: 0,
    matchedAromas: [],
    matchedFlavors: [],
    matchedEffects: [],
    conflicts: [],
    whyItFits: r.whyItFits,
    riskNotes: r.riskNotes,
    explanation: r.explanation,
    feedbackAdjustment: 0,
    feedbackNote: r.feedbackNote,
    // Saved rows don't carry the audit breakdown; default to a clean read.
    baseScore: r.matchScore,
    feedbackPotential: 0,
    feedbackDecay: 1,
    matchStrengths: [],
    penaltyStrengths: [],
    feedback: toFeedbackData(feedback),
    purchaseConfidence,
  };
}
