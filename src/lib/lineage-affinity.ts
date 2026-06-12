// Lineage / genetics affinity (deferred-improvements #13).
//
// Surface tags miss genetic kinship: a strain that descends from — or shares
// a parent with — one of the user's favourites is "family" even when its
// aroma/flavour tags have drifted (the Pink Kush / OG-line case). This adds a
// small bounded bonus for that kinship, drawn from the curated identity
// lineage. It is a NO-OP (0) whenever either side has no recorded lineage, so
// it never moves scores for strains we don't have genealogy for — it only
// lights up as lineage is curated.

import { getIdentity } from "./strain-identity";
import { normalizeStrainName } from "./strain-data";

// Maximum bonus (points added to the raw score). On the order of the
// sensory-family exact bonus (+5) — strong but never dominant.
export const LINEAGE_AFFINITY_MAX = 6;

// A strain's "ancestor keys": itself + direct parents + grandparents (two
// levels), normalised. Walks the curated identity lineage; a strain with no
// lineage yields just its own name.
function ancestorKeys(name: string, depth = 2): Set<string> {
  const out = new Set<string>();
  const visit = (n: string, d: number) => {
    const key = normalizeStrainName(n);
    if (!key || out.has(key)) return;
    out.add(key);
    if (d <= 0) return;
    for (const p of getIdentity(n)?.lineage?.parents ?? []) visit(p, d - 1);
  };
  visit(name, depth);
  return out;
}

// Bounded affinity (0 or LINEAGE_AFFINITY_MAX) from DIRECT lineage between the
// candidate and the user's favourites — i.e. one is a parent of the other.
// Distant shared ancestors (OG Kush, Chemdawg, Hindu Kush, …) are deliberately
// NOT counted: those are in the ancestry of a huge slice of the catalogue, so
// rewarding them flagged ~20% of strains and pushed them into the 88 ceiling.
// Returns 0 when there's no recorded parent/child link.
export function lineageAffinity(candidate: string, favourites: string[]): number {
  // Candidate + its DIRECT parents only (depth 1).
  const candParents = ancestorKeys(candidate, 1);
  if (candParents.size <= 1) return 0; // no recorded parents → no-op
  const candSelf = normalizeStrainName(candidate);

  for (const fav of favourites) {
    const favSelf = normalizeStrainName(fav);
    if (favSelf === candSelf) continue; // same strain — that's the anchor path
    // The favourite is a parent of the candidate …
    if (candParents.has(favSelf)) return LINEAGE_AFFINITY_MAX;
    // … or the candidate is a parent of the favourite.
    if (ancestorKeys(fav, 1).has(candSelf)) return LINEAGE_AFFINITY_MAX;
  }
  return 0;
}
