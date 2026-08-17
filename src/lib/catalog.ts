// Catalog assembly. Reads directly from src/lib/strain-data.ts (the same
// source of truth the Taste Match Engine uses) and adds derived view-only
// fields: archetype label, source/confidence tag, and the top-N most
// sensorily similar strains computed via the engine's similarity(). The
// optional identity layer (canonical name, market names, breeder, lineage,
// sensory family, phenotype notes) is also attached when available.
//
// No data is duplicated here — every catalog entry is a thin projection
// over one StrainProfile plus an optional StrainIdentity.

import { STRAINS } from "./strain-data";
import { similarity, archetypeFor } from "./taste-engine";
import { getIdentity, identitiesInFamily } from "./strain-identity";
import type { StrainIdentity } from "./strain-identity";
import type { StrainProfile } from "./types";

export interface SimilarStrain {
  name: string;
  score: number; // 0–1
}

export type CatalogSource = "curated" | "inferred";

export interface CatalogEntry {
  strain: StrainProfile;
  archetype: string;
  source: CatalogSource;
  confidence: "high" | "medium" | "low";
  similar: SimilarStrain[];
  identity: StrainIdentity | null;
  // Other catalog entries in the same sensory family (canonical names),
  // excluding this strain itself. Computed when identity has a family.
  familyMembers: string[];
}

function topSimilar(target: StrainProfile, n: number): SimilarStrain[] {
  const out: SimilarStrain[] = [];
  for (const candidate of STRAINS) {
    if (candidate.name === target.name) continue;
    out.push({ name: candidate.name, score: similarity(target, candidate) });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, n);
}

// Heuristic detail signal: how richly described is this seed entry.
// Catalog never lies — "high" means we have generous data across all axes,
// "medium" is decent but uneven, "low" means we're light on one or more axes.
function entryConfidence(s: StrainProfile): "high" | "medium" | "low" {
  const counts = [
    s.aromas.length,
    s.flavors.length,
    s.effects.length,
    s.traits.length,
  ];
  const minCount = Math.min(...counts);
  const totalCount = counts.reduce((a, b) => a + b, 0);
  if (minCount >= 3 && totalCount >= 16) return "high";
  if (minCount >= 2 && totalCount >= 10) return "medium";
  return "low";
}

// The raw catalog assembly: pure projection over STRAINS + similarity matrix.
// N strains × N similarity comparisons (~800K ops at today's catalog size)
// per cold start. Memoized at module level: the data is immutable per
// deploy, so one warm instance computes it once and every request/page in
// that instance reuses it. Deliberately NOT wrapped in Next's data cache —
// the serialized result is ~2.9 MB, over unstable_cache's 2 MB limit, so
// the old wrapper failed to store on every build/render while still paying
// serialization. If cross-instance caching is ever needed, cache small
// per-slug values instead of this whole array.
let _cached: CatalogEntry[] | null = null;
function _buildCatalogSync(): CatalogEntry[] {
  if (_cached) return _cached;
  _cached = STRAINS.map((strain) => {
    const identity = getIdentity(strain.name);
    const familyMembers = identity?.sensoryFamily
      ? identitiesInFamily(identity.sensoryFamily).filter(
          (n) => n !== strain.name,
        )
      : [];
    return {
      strain,
      archetype: archetypeFor(strain),
      source: "curated" as const,
      confidence: entryConfidence(strain),
      similar: topSimilar(strain, 4),
      identity,
      familyMembers,
    };
  }).sort((a, b) => a.strain.name.localeCompare(b.strain.name));
  return _cached;
}

// Async only to keep call sites unchanged from the cached era.
export async function buildCatalog(): Promise<CatalogEntry[]> {
  return _buildCatalogSync();
}

export function catalogSize(): number {
  return STRAINS.length;
}

// Trim an entry to only the fields the catalog LIST view actually reads, so
// the page doesn't ship the heavy detail-only payload (curator paragraphs,
// lineage with parent details, why-it-matters, art prompt, similar list,
// family members…) to every visitor's browser. The detail page rebuilds the
// full entry independently via getCatalogEntryBySlug, so nothing is lost —
// the heavy bits just load on the strain page where they're actually shown.
//
// Identity fields kept: those used for search (marketNames), display
// (shortName, tagline), the palette/art helpers (timeProfile, artFileName,
// artVersion, artStatus, artFocus), and curatedScore (sourceConfidence).
export function trimEntryForList(entry: CatalogEntry): CatalogEntry {
  const id = entry.identity;
  const s = entry.strain;
  return {
    // Only the strain fields the list view reads (cards, search, client-side
    // curatedScore). The optional deep-scoring fields (note, primary*/trace*
    // weighting arrays) are detail-page material — dropping them here cuts
    // the serialized payload across ~900 entries.
    strain: {
      name: s.name,
      ...(s.aliases ? { aliases: s.aliases } : {}),
      type: s.type,
      aromas: s.aromas,
      flavors: s.flavors,
      effects: s.effects,
      traits: s.traits,
      potency: s.potency,
    },
    archetype: entry.archetype,
    source: entry.source,
    confidence: entry.confidence,
    similar: [],
    familyMembers: [],
    identity: id
      ? {
          canonicalName: id.canonicalName,
          sourceConfidence: id.sourceConfidence,
          ...(id.marketNames ? { marketNames: id.marketNames } : {}),
          ...(id.shortName ? { shortName: id.shortName } : {}),
          ...(id.tagline ? { tagline: id.tagline } : {}),
          ...(id.timeProfile ? { timeProfile: id.timeProfile } : {}),
          ...(id.artFileName ? { artFileName: id.artFileName } : {}),
          ...(id.artVersion !== undefined ? { artVersion: id.artVersion } : {}),
          ...(id.artStatus ? { artStatus: id.artStatus } : {}),
          ...(id.artFocus ? { artFocus: id.artFocus } : {}),
        }
      : null,
  };
}

// A per-strain user match, surfaced on cards and the strain page. Lives here
// (not in the client) so both server and client modules can share the type.
export interface CatalogMatch {
  score: number;
  category: string;
  // Optional ordering key that outranks `score` for sorting (used by merged
  // profiles to break visible-score ties on the engine's unclamped raw). The
  // displayed badge always uses `score`; this only affects sort order.
  sort?: number;
}

// A derived, deterministic "Curated" index (0–100) used for the badge and the
// default sort when the visitor has no taste profile yet. It is NOT a quality
// rating of the flower — it reflects how richly SOMA has characterised the
// strain: detail completeness, sensory richness and identity confidence. Pure
// function of the entry, so the same strain always shows the same number.
// Server-safe so the strain page can call it directly.
export function curatedScore(entry: CatalogEntry): number {
  const s = entry.strain;
  const confBase =
    entry.confidence === "high" ? 86 : entry.confidence === "medium" ? 78 : 70;
  const richness =
    s.aromas.length + s.flavors.length + s.effects.length + s.traits.length;
  const richBonus = Math.max(-4, Math.min(8, Math.round((richness - 14) * 0.6)));
  const idBonus = entry.identity
    ? entry.identity.sourceConfidence === "high"
      ? 6
      : entry.identity.sourceConfidence === "medium"
        ? 3
        : 1
    : 0;
  return Math.max(60, Math.min(98, confBase + richBonus + idBonus));
}

// URL-safe slug for a strain name. "OG Kush" → "og-kush", "GG4" → "gg4".
export function strainSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Reverse lookup used by the dedicated strain page (/catalog/[slug]) —
// O(1) via a lazily built slug index instead of a linear scan per route
// (page render + metadata + OG image across ~900 static routes).
let _bySlug: Map<string, CatalogEntry> | null = null;
export async function getCatalogEntryBySlug(
  slug: string,
): Promise<CatalogEntry | null> {
  if (!_bySlug) {
    _bySlug = new Map(
      _buildCatalogSync().map((e) => [strainSlug(e.strain.name), e]),
    );
  }
  return _bySlug.get(slug) ?? null;
}

// Similar strains enriched with their full profile, so the detail page can
// render each one's own mini radar (similar[] only carries name + score).
export interface SimilarStrainEntry extends SimilarStrain {
  strain: StrainProfile;
}

let _strainByName: Map<string, StrainProfile> | null = null;
export function similarWithProfiles(
  similar: SimilarStrain[],
): SimilarStrainEntry[] {
  if (!_strainByName) {
    _strainByName = new Map(STRAINS.map((x) => [x.name, x]));
  }
  const out: SimilarStrainEntry[] = [];
  for (const s of similar) {
    const strain = _strainByName.get(s.name);
    if (strain) out.push({ ...s, strain });
  }
  return out;
}
