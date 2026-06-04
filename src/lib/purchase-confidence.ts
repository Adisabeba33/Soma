// Purchase confidence — the second axis of SŌMA's reasoning.
//
// Sensory match (matchScore + confidence) answers: "is this strain right
// for this person?" Purchase confidence answers a different question:
// "is THIS actual purchase likely to be a good copy of that strain?"
//
// These two axes must never collapse back into one sentence ("94% but
// batch may vary"). They live and render side-by-side so the user can
// reason about identity-fit and pickup-risk independently.
//
// Today every signal returns "unknown" — that's deliberate honesty, not a
// TODO. SŌMA captures no grower, no package date, no cure quality and no
// storage info. As real signals get wired in (per-grower reliability,
// pheno-stability per cut, freshness from package date), they plug into
// the same shape and overall is derived from them.

export type SignalLevel = "unknown" | "low" | "medium" | "high";

export interface PurchaseSignals {
  freshness: SignalLevel;
  cure: SignalLevel;
  storage: SignalLevel;
  growerReliability: SignalLevel;
  phenotypeConsistency: SignalLevel;
}

export interface PurchaseConfidence {
  overall: SignalLevel;
  signals: PurchaseSignals;
  // Per-signal explanations shown in the UI when we have any. Empty when
  // everything is "unknown" — no fake reassurance.
  notes: string[];
}

// Context the engine can pass in once we start wiring real signals. For
// now it's accepted but unused — the seam exists so adding grower /
// package date later doesn't require touching every caller.
export interface PurchaseContext {
  grower?: string | null;
  weight?: string | null;
  thcPercent?: number | null;
}

const ALL_UNKNOWN: PurchaseSignals = {
  freshness: "unknown",
  cure: "unknown",
  storage: "unknown",
  growerReliability: "unknown",
  phenotypeConsistency: "unknown",
};

const LEVEL_WEIGHT: Record<SignalLevel, number> = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

// Derive the overall verdict from individual signals. Conservative: any
// "low" pulls the overall down. All-unknown stays unknown (we don't fake
// a verdict from no data).
export function deriveOverall(signals: PurchaseSignals): SignalLevel {
  const known: SignalLevel[] = (Object.values(signals) as SignalLevel[]).filter(
    (s) => s !== "unknown",
  );
  if (known.length === 0) return "unknown";
  if (known.some((s) => s === "low")) return "low";
  const avg =
    known.reduce((sum, s) => sum + LEVEL_WEIGHT[s], 0) / known.length;
  if (avg >= 2.5) return "high";
  if (avg >= 1.5) return "medium";
  return "low";
}

export function evaluatePurchase(
  _context: PurchaseContext | null = null,
): PurchaseConfidence {
  // Today: no signal sources are wired. Tomorrow this is where grower
  // reliability records, identity.phenotypeNotes, package-date readers
  // and storage heuristics will fold in. Returning "unknown" is the
  // honest state until those exist.
  const signals: PurchaseSignals = { ...ALL_UNKNOWN };
  const notes: string[] = [];
  return {
    overall: deriveOverall(signals),
    signals,
    notes,
  };
}

// Default used when we deserialise an old saved session that predates the
// purchase-confidence column.
export function emptyPurchaseConfidence(): PurchaseConfidence {
  return {
    overall: "unknown",
    signals: { ...ALL_UNKNOWN },
    notes: [],
  };
}

// Guard for things coming back from JSON storage or unsanitised API
// responses. Keeps the UI side simple by ensuring every read is safe.
export function isPurchaseConfidence(value: unknown): value is PurchaseConfidence {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!isLevel(v.overall)) return false;
  if (!v.signals || typeof v.signals !== "object") return false;
  const s = v.signals as Record<string, unknown>;
  for (const key of [
    "freshness",
    "cure",
    "storage",
    "growerReliability",
    "phenotypeConsistency",
  ] as const) {
    if (!isLevel(s[key])) return false;
  }
  if (!Array.isArray(v.notes)) return false;
  return true;
}

function isLevel(v: unknown): v is SignalLevel {
  return v === "unknown" || v === "low" || v === "medium" || v === "high";
}

const SIGNAL_LABELS: Record<keyof PurchaseSignals, string> = {
  freshness: "Freshness",
  cure: "Cure",
  storage: "Storage",
  growerReliability: "Grower reliability",
  phenotypeConsistency: "Phenotype consistency",
};

export function signalLabel(key: keyof PurchaseSignals): string {
  return SIGNAL_LABELS[key];
}
