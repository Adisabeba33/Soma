// Soft-risk overlay — community/consensus reputation, NOT measured data, so it
// lives apart from strain-data and carries its own source + confidence (the
// canonical-tags provenance idea in miniature). A "racy" strain has a sharp /
// overstimulating cerebral lift that some users experience as nervous or
// anxious. It only ever costs a user points if they explicitly opt out
// (profile.avoidedRisks) — and never if one of their own favourites carries
// the same tag (reconciled in the engine). Curated conservatively by the Haze /
// classic sharp-sativa / diesel-sativa cluster with documented racy reputations:
// under-tagging is safer than penalising a clean sativa for a sensitive user.
import { normalizeStrainName } from "./strain-data";

export type RiskTag = "racy";
export type RiskConfidence = "low" | "medium" | "high";

export interface RiskEntry {
  tags: RiskTag[];
  confidence: RiskConfidence;
  source: string;
}

const RACY: RiskEntry = { tags: ["racy"], confidence: "medium", source: "community-consensus" };

// Canonical strain name → risk entry. Edit here to extend coverage.
const RISK: Record<string, RiskEntry> = {
  "Ghost Train Haze": RACY,
  "Neville's Haze": RACY,
  "Nevil's Wreck": RACY,
  "Hawaiian Snow": RACY,
  Haze: RACY,
  "Amnesia Haze": RACY,
  "Super Silver Haze": RACY,
  "Super Lemon Haze": RACY,
  "Mango Haze": RACY,
  "Arjan's Haze": RACY,
  "Jack the Ripper": RACY,
  "Kali Mist": RACY,
  "Green Crack": RACY,
  "Sour Diesel": RACY,
  "Power Plant": RACY,
};

const BY_NORM = new Map<string, RiskEntry>();
for (const [name, entry] of Object.entries(RISK)) {
  BY_NORM.set(normalizeStrainName(name), entry);
}

export function riskEntryFor(strainName: string): RiskEntry | null {
  return BY_NORM.get(normalizeStrainName(strainName)) ?? null;
}

export function riskTagsFor(strainName: string): RiskTag[] {
  return riskEntryFor(strainName)?.tags ?? [];
}

// The vocab a user can list under profile.avoidedRisks.
export const RISK_TAG_VALUES: RiskTag[] = ["racy"];

export function isRiskTag(value: unknown): value is RiskTag {
  return typeof value === "string" && (RISK_TAG_VALUES as string[]).includes(value);
}
