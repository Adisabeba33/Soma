// Trace-tag enrichment overlay.
// ---------------------------------------------------------------------------
// Ground-truth pass over the catalog's WEAKEST layer: 51% of strains carried
// no `traceAromas`/`traceFlavors` at all, yet real-world sources (Leafly,
// AllBud, breeder notes, terpene reports) almost always describe a faint third
// tier of notes below the dominant + secondary character. That faint tier is
// exactly what the Signature (weighted-target) blender leans on to tell a
// "light sweet note" from a cloying one — so missing traces made it undershoot.
//
// Rather than hand-edit ~900 object literals in strain-data.ts (risking the
// catalog), each verified strain adds its faint notes HERE and they're merged
// onto the base profile once at load (see applyTraceEnrichment in
// strain-data.ts). Every entry cites the source(s) it was read from.
//
// Rules for an entry:
//   • Only add a note the sources describe as a light/undertone/hint — never a
//     dominant note (that belongs in the base profile's primary/secondary).
//   • Tokens must be real vocab (aroma/flavor families used elsewhere).
//   • The merge drops any trace token already present as a base aroma/flavor,
//     so overlaps here are harmless — but keep them clean for readability.
//   • Keyed by the strain's CANONICAL name (findStrain resolves aliases).

export interface TraceEnrichment {
  traceAromas?: string[];
  traceFlavors?: string[];
}

export const TRACE_ENRICHMENT: Record<string, TraceEnrichment> = {
  // Sweet-floral "soap" Z-cross whose profile also carries a citrus/earth base
  // and, per multiple reviews, a faint gas note under the candy — none of which
  // was traced. Sources: Leafly, AllBud, Alien Labs strain review.
  Zoap: { traceAromas: ["earthy", "gassy"] },

  // California Orange × Skunk. Catalog captured the citrus but dropped the
  // skunk that's literally in its lineage, plus the earthy/pine terpinolene
  // finish. Sources: Leafly, Strainpedia, AllBud.
  Tangie: { traceAromas: ["skunky", "earthy"], traceFlavors: ["pine"] },

  // Berry-sweet dominant, but reviews consistently note a subtle skunk
  // undertone and a pinene edge under the earthy spice. Sources: Abstrax
  // terpene profile, STIIIZY strain guide.
  "Cherry Pie": { traceAromas: ["skunky", "pine"], traceFlavors: ["herbal"] },

  // Pine/spice sativa with a lemon-herbal body and, on the exhale, a faint
  // earthy sweetness/creaminess reviewers call out. Sources: Leafly, Abstrax.
  "Jack Herer": { traceFlavors: ["sweet"] },
};
