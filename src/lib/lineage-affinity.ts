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

// Bounded affinity (0..LINEAGE_AFFINITY_MAX) from shared lineage between the
// candidate and the user's favourites — kinship that surface tags miss.
// Returns 0 when the candidate has no lineage beyond its own name.
export function lineageAffinity(candidate: string, favourites: string[]): number {
  const candKeys = ancestorKeys(candidate);
  if (candKeys.size <= 1) return 0; // no recorded lineage → no-op
  const candSelf = normalizeStrainName(candidate);

  let best = 0;
  for (const fav of favourites) {
    const favSelf = normalizeStrainName(fav);
    if (favSelf === candSelf) continue; // same strain — that's the anchor path
    const favKeys = ancestorKeys(fav);

    let shared = 0;
    let directLink = false; // one is a parent/grandparent of the other
    for (const k of candKeys) {
      if (!favKeys.has(k)) continue;
      shared += 1;
      if (k === favSelf || k === candSelf) directLink = true;
    }
    if (shared === 0) continue;

    // Direct parent/child line → full bonus; a shared ancestor (siblings,
    // cousins) scales gently with how many ancestors they share.
    const pts = directLink
      ? LINEAGE_AFFINITY_MAX
      : Math.min(LINEAGE_AFFINITY_MAX, 2 + shared);
    best = Math.max(best, pts);
  }
  return best;
}
