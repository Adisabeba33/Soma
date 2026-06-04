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
import { similarity, useCaseFor } from "./taste-engine";
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

let _cached: CatalogEntry[] | null = null;

export function buildCatalog(): CatalogEntry[] {
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
      archetype: useCaseFor(strain),
      source: "curated" as const,
      confidence: entryConfidence(strain),
      similar: topSimilar(strain, 4),
      identity,
      familyMembers,
    };
  }).sort((a, b) => a.strain.name.localeCompare(b.strain.name));
  return _cached;
}

export function catalogSize(): number {
  return STRAINS.length;
}
