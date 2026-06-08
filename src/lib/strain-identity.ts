// Identity layer that sits ABOVE the sensory StrainProfile used by the
// Taste Match Engine. The engine continues to read aromas/effects/traits
// from src/lib/strain-data.ts — identity enriches, clusters, explains, and
// surfaces alternative market names, but doesn't change scoring.
//
// Everything except canonicalName and sourceConfidence is optional, so the
// dataset can grow gradually without fake completeness. A strain with no
// identity record at all is also a valid state — getIdentity returns null
// in that case.

export type IdentityConfidence = "low" | "medium" | "high";

export interface StrainLineage {
  // Direct parents when reasonably documented. Empty / undefined when we
  // don't have a reliable source.
  parents?: string[];
  // Free-form description like "Chem Sister × Sour Dubb × Chocolate Diesel".
  cross?: string;
}

export interface StrainIdentity {
  // Must match a StrainProfile.name in strain-data.ts.
  canonicalName: string;
  // Alternative market names a dispensary might use ("Pink Cookies" for
  // Wedding Cake). Parser aliases in strain-data.ts are separate — these
  // are the consumer-facing "KNOWN AS" surface.
  marketNames?: string[];
  // Who created it, when reasonably documented.
  breeder?: string;
  lineage?: StrainLineage;
  // Cluster key — e.g. "gas-og", "garlic-funk", "citrus-haze". Used for
  // future territory/family grouping.
  sensoryFamily?: string;
  // Phenotype / cut-level notes ("the Larry Bird pheno of Gelato 33",
  // "louder gas pheno"). Free-form, kept short.
  phenotypeNotes?: string[];
  // Long-form curator's note — a sommelier-style description in prose:
  // where the strain came from, how it reads in the nose and on the palate,
  // the arc of the effect, both sides of it, and who it's for. Written from
  // experience and the weight of reviews, kept honest (no medical claims,
  // no invented potency numbers). One paragraph; optional like everything
  // else here.
  curatorNote?: string;
  // Growers who tend to bring the strain out well (informational, not a
  // batch-quality claim — that lives in a separate layer).
  growerVariants?: string[];
  // Approximate indica/sativa split as a curator estimate. Must sum to 100.
  // This is a directional read, not a lab test on any specific batch —
  // labelled as such in the UI. When absent, the diagram falls back to the
  // categorical StrainProfile.type.
  indicaSativaSplit?: { indica: number; sativa: number };
  // Top dominant terpenes as a curator's typical-profile estimate. The UI
  // makes explicit that these are typical values, not per-batch lab data:
  // every batch reads differently depending on cultivation, cure and
  // storage. Names should come from TERPENE_VOCAB in this module.
  topTerpenes?: Array<{ name: TerpeneName; percent: number }>;
  // Honest signal about how reliable the rest of this record is.
  sourceConfidence: IdentityConfidence;
}

// The terpene families the catalog speaks. Kept tight on purpose — the
// big six cover ~95% of what shows up in flower lab reports. Adding more
// only when curation actually has the data.
export const TERPENE_VOCAB = [
  "Caryophyllene",
  "Limonene",
  "Myrcene",
  "Pinene",
  "Humulene",
  "Linalool",
  "Terpinolene",
  "Ocimene",
] as const;
export type TerpeneName = (typeof TERPENE_VOCAB)[number];

import { IDENTITIES } from "./strain-identity-data";
import { normalizeStrainName } from "./strain-data";

const IDENTITY_INDEX = new Map<string, StrainIdentity>();
for (const identity of IDENTITIES) {
  IDENTITY_INDEX.set(normalizeStrainName(identity.canonicalName), identity);
}

export function getIdentity(canonicalName: string): StrainIdentity | null {
  return IDENTITY_INDEX.get(normalizeStrainName(canonicalName)) ?? null;
}

// Display helper: merges parser aliases from StrainProfile with marketNames
// from identity, deduped case-insensitively. "Known as" in the UI is this
// union — users shouldn't have to reason about which list a name lives in.
export function knownAsNames(
  parserAliases: string[] | undefined,
  identity: StrainIdentity | null,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (n: string) => {
    const key = n.toLowerCase().trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(n);
  };
  for (const a of parserAliases ?? []) push(a);
  for (const m of identity?.marketNames ?? []) push(m);
  return out;
}

// Cluster lookup — returns canonical names sharing the same sensoryFamily.
// Useful for future "same sensory territory" grouping in the UI.
export function identitiesInFamily(family: string): string[] {
  return IDENTITIES.filter((i) => i.sensoryFamily === family).map(
    (i) => i.canonicalName,
  );
}
