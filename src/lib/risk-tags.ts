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

// Penalty scales with confidence (applied in the engine): high = clearly /
// well-documented racy (−5), medium = 50/50, dose-dependent (−2), anything not
// listed = clean (0). Curated conservatively; medium is the deliberately-soft
// tier for "could go either way".
const HIGH: RiskEntry = { tags: ["racy"], confidence: "high", source: "community-consensus" };
const MAYBE: RiskEntry = { tags: ["racy"], confidence: "medium", source: "community-consensus" };

// Canonical strain name → risk entry. Edit here to extend / re-tier coverage.
const RISK: Record<string, RiskEntry> = {
  // — HIGH (−5): documented / strong-consensus racy —
  // Hazes
  "Ghost Train Haze": HIGH,
  "Neville's Haze": HIGH,
  "Nevil's Wreck": HIGH,
  "Hawaiian Snow": HIGH,
  Haze: HIGH,
  "Amnesia Haze": HIGH,
  "Super Silver Haze": HIGH,
  "Super Lemon Haze": HIGH,
  "Mango Haze": HIGH,
  "Arjan's Haze": HIGH,
  // Classic sharp sativas
  "Jack the Ripper": HIGH,
  "Kali Mist": HIGH,
  "Green Crack": HIGH,
  "Sour Diesel": HIGH,
  "Power Plant": HIGH,
  // Racy hybrids
  "Bruce Banner": HIGH,
  Chemdawg: HIGH,
  "Chem 91": HIGH,
  Trainwreck: HIGH,

  // — MEDIUM (−2): 50/50, dose-dependent —
  "Durban Poison": MAYBE,
  Tangie: MAYBE,
  "Sour Tangie": MAYBE,
  "NYC Diesel": MAYBE,
  "Chocolate Diesel": MAYBE,
  Chocolope: MAYBE,
  "Moby Dick": MAYBE,
  Malawi: MAYBE,
  "Cinderella 99": MAYBE,
  "Jack's Cleaner": MAYBE,
  Grapefruit: MAYBE,
  "Lemon G": MAYBE,
  Snowcap: MAYBE,
  "Jet Fuel": MAYBE,
  "Lemon Diesel": MAYBE,
  "White Widow": MAYBE,
  "White Fire OG": MAYBE,
  "Cap Junky": MAYBE,
  "Girl Scout Cookies": MAYBE,
  Headbanger: MAYBE,
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
