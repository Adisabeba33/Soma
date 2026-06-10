// Identity layer that sits ABOVE the sensory StrainProfile used by the
// Taste Match Engine. The engine continues to read aromas/effects/traits
// from src/lib/strain-data.ts — identity enriches, clusters, explains, and
// surfaces alternative market names, but doesn't change scoring.
//
// Everything except canonicalName and sourceConfidence is optional, so the
// dataset can grow gradually without fake completeness. A strain with no
// identity record at all is also a valid state — getIdentity returns null
// in that case.

import type { StrainType, TimeProfile, ArtStatus } from "./types";

export type IdentityConfidence = "low" | "medium" | "high";

// Minimal grandparent-level passport for a parent that ISN'T in our own
// catalog. When the parent strain (e.g. "Chem's Sister") has its own
// catalog entry, the UI pulls its lineage and type from there directly —
// no curation needed. When it doesn't, you can paint in just these two
// fields by name and the parent card lights up the same way.
export interface ParentDetail {
  // Short grandparent lineage like "Chemdawg phenotype" or
  // "Sour Diesel × Sour Bubble". Shown in parens under the parent name.
  lineageBrief?: string;
  // Sensory type readback shown under the parent name. Independent of
  // the child strain's type.
  type?: StrainType;
}

export interface StrainLineage {
  // Direct parents when reasonably documented. Empty / undefined when we
  // don't have a reliable source.
  parents?: string[];
  // Free-form description like "Chem Sister × Sour Dubb × Chocolate Diesel".
  cross?: string;
  // Optional overrides for parents that aren't in our own catalog. Keys
  // must match a name from `parents`. UI priority is:
  //   1. catalog lookup (parent has its own StrainProfile + identity)
  //   2. parentDetails[name] from this record
  //   3. nothing — just the parent's name
  // So you only fill in here what the catalog can't give you for free.
  parentDetails?: Record<string, ParentDetail>;
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
  // Short, memorable pull-quote — one line distilled from the strain's
  // story, rendered as a magazine-style pull-quote above the long note.
  // Two patterns work well:
  //   - "If someone asks what X is, this is one of the first references."
  //   - A short sensory image: "The aroma enters the room before you do."
  // Optional. When absent, the page just shows curatorNote with normal
  // typography.
  curatorQuote?: string;
  // Catalog-card tagline. 2–4 words that capture the strain at a
  // glance — sized like a movie-poster strap. Shown on the catalog
  // collectible card so the gradient and the strain name carry the
  // composition without competing with chip lists or full sentences.
  // Examples:
  //   GG4            → "Couch-bound legend"
  //   OG Kush        → "The gas reference"
  //   Runtz          → "Pure candy bag"
  //   Northern Lights → "Old guard sedation"
  // Optional. When absent, the card just shows the name and type —
  // still reads cleanly, just without the catchy line.
  tagline?: string;
  // Growers who tend to bring the strain out well (informational, not a
  // batch-quality claim — that lives in a separate layer).
  growerVariants?: string[];
  // Honest signal about how reliable the rest of this record is.
  sourceConfidence: IdentityConfidence;

  // ── Artwork layer (see src/lib/strain-art.ts and docs/strain-artwork.md) ──
  // Time-of-day mood override. When absent, it is DERIVED from the strain's
  // behavioural family (deriveTimeProfile) — so the whole catalog gets a
  // sensible mood for free and only deliberate exceptions need a value here.
  timeProfile?: TimeProfile;
  // Image filename override. When absent it defaults to `${strainSlug}.webp`
  // (e.g. GG4 → "gg4.webp"). Lives in /public/strains/.
  artFileName?: string;
  // Artwork lifecycle. Defaults to "none". The card/detail page only render
  // the WebP when this is "published".
  artStatus?: ArtStatus;
  // Bumped each time the image is regenerated. Defaults to 1. Informational —
  // lets us track which prompt/version a published image came from.
  artVersion?: number;
  // The generation prompt for this strain's image. A sensible default can be
  // produced with buildArtPrompt(); store a hand-tuned override here when the
  // default doesn't capture the strain. The prompt always forbids text,
  // logos, names, people, products and cannabis leaves — the UI overlays the
  // name and data, the image is pure atmosphere.
  artPrompt?: string;
}

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

// Sensory-family adjacency. Two families are "adjacent" when their
// signature smell territory overlaps enough that a fan of one will
// recognise the other — gas-OG into diesel-chem and garlic-funk, for
// example, all share fuel/funk character even though they're separate
// clusters. Used by the engine to give a partial sensory bonus when the
// candidate isn't an exact family match but lives in a neighbouring
// territory. Without this the engine treats "different sensoryFamily"
// the same way for "wedding cake vs diesel-chem" (truly different) and
// "gas-og vs diesel-chem" (very close) — flattening real proximity.
//
// The table is intentionally symmetric: every entry "a in adjacent[b]"
// is mirrored by "b in adjacent[a]". A test pins this so the two
// directions can't drift out of sync.
const ADJACENCY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  // ── Gas/fuel cluster — share heavy fuel, earth, chem character ──
  ["gas-og", "diesel-chem"],
  ["gas-og", "garlic-funk"],
  ["gas-og", "kush-classic"],
  ["diesel-chem", "garlic-funk"],

  // ── Heavy indica cluster — share dense body, dark fruit/earth notes ──
  ["kush-classic", "purple-berry"],

  // ── Bright sativa cluster — share lemon/herbal/haze character ──
  ["citrus-haze", "sweet-haze"],
  ["citrus-haze", "pine-spice"],

  // ── Dessert / modern cluster — share sweet, creamy, candy-fruit notes ──
  ["dessert-cookies", "modern-exotic"],
  ["dessert-cookies", "purple-berry"],
];

const ADJACENCY_MAP: Map<string, Set<string>> = (() => {
  const m = new Map<string, Set<string>>();
  for (const [a, b] of ADJACENCY_PAIRS) {
    if (!m.has(a)) m.set(a, new Set());
    if (!m.has(b)) m.set(b, new Set());
    m.get(a)!.add(b);
    m.get(b)!.add(a);
  }
  return m;
})();

// Returns true when the two sensory families share enough character for
// the engine to award a partial bonus. Identity-symmetric and reflexive
// across the same family is FALSE (use === for exact match): adjacency
// is the "close but not the same" relation.
export function isAdjacentSensoryFamily(a: string, b: string): boolean {
  if (a === b) return false;
  return ADJACENCY_MAP.get(a)?.has(b) ?? false;
}

// Exposed for tests so the adjacency contract can be audited without
// reaching into module internals.
export function adjacentFamilies(family: string): ReadonlySet<string> {
  return ADJACENCY_MAP.get(family) ?? new Set();
}
