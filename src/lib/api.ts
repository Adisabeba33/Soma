import type {
  Category,
  Confidence,
  FeedbackData,
  SessionRecommendation,
} from "./types";

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
  return {
    id: r.id,
    strainName: r.strainName,
    resolvedName: r.resolvedName,
    knownStrain: r.knownStrain,
    category: r.category as Category,
    matchScore: r.matchScore,
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
    feedback: toFeedbackData(feedback),
  };
}
