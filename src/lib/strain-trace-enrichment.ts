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

  // Sweet-cream dessert dominant, but reviews consistently note bright orange
  // citrus on the nose and a peppery spice edge. Sources: Leafly, AllBud.
  Gelato: { traceAromas: ["citrus"], traceFlavors: ["spicy"] },

  // Gas top over sweet cream, with sugary diesel, nutty cherry and a fresh
  // citrus zest below the dominant. Sources: Leafly, AllBud, Mood Shine.
  "Gary Payton": { traceAromas: ["citrus", "diesel"], traceFlavors: ["nutty", "creamy", "berry"] },

  // Sweet-fruit dominant (Gelato 41 × Gushers) with a resinous pine, damp
  // earthiness and tropical undertone. Sources: Leafly, GrowDiaries, weedsearch.
  Gushlato: { traceAromas: ["earthy", "pine"], traceFlavors: ["tropical"] },

  // Candy-sweet fruit dominant with a bright citrus lift many reviews note.
  // Sources: Leafly, AllBud.
  Runtz: { traceAromas: ["citrus"] },

  // Garlic/cheese funk over nutty cream, with a limonene citrus edge and a
  // faint sweetness under the savoury character. Sources: Leafly, AllBud.
  "Garlic Budder": { traceAromas: ["citrus"], traceFlavors: ["sweet"] },

  // Sour earth/skunk with sweet floral; sessions open citrusy and finish on a
  // peppery, sandalwood-herbal sweetness with a pine edge. Sources: Leafly,
  // AllBud, Serious Seeds.
  "AK-47": { traceAromas: ["citrus", "pine"], traceFlavors: ["sweet", "herbal"] },

  // Sour Diesel × SFV OG: tart fuel + lemon over damp earth/pine, finishing on
  // a woody kush with a minty-herbal undertone. Sources: Leafly, Strainpedia,
  // AllBud.
  "Sour OG": { traceAromas: ["woody"], traceFlavors: ["herbal", "woody"] },

  // Sweet-cream dessert with sugared-violet florals, orange/lemon citrus, a
  // small pinene note and herbal/peppery (linalool/caryophyllene) undertones.
  // Sources: True Terpenes, Verano, strngseeds.
  "Gelato 33": { traceAromas: ["floral", "pine"], traceFlavors: ["herbal", "spicy"] },

  // Candy fruit dominant, but sources note tropical citrus (mango/papaya) up
  // top and an earthy/herbal humulene backbone with gentle spice. Sources:
  // Abstrax, CannaConnection, Gold Coast Terpenes.
  Zkittlez: { traceAromas: ["citrus", "earthy"], traceFlavors: ["herbal", "spicy"] },

  // Tangy vanilla cake with a subtle citrus/lemon twist and a peppery-spice
  // (caryophyllene) finish under the sweetness. Sources: Leafly, AllBud, DNA.
  "Wedding Cake": { traceAromas: ["citrus"], traceFlavors: ["citrus", "spicy"] },

  // Pineapple-tropical dominant with subtle earthy pine, floral sweetness and a
  // herbal/peppery exhale. Sources: AllBud, Strainpedia, JointCommerce.
  "Maui Wowie": { traceAromas: ["pine", "earthy", "floral"], traceFlavors: ["herbal", "spicy"] },

  // Sweet fruit/berry candy over a kushy base — reviews consistently note
  // earthy/cedar undertones, a light gas note and a mild peppery snap with
  // vanilla cream. Sources: AllBud, Alien Labs, Strainpedia.
  Gushers: { traceAromas: ["earthy", "gassy", "citrus"], traceFlavors: ["creamy", "spicy"] },

  // Strawberry-banana cream dominant with, from its Kush heritage, subtle
  // earthy/hash spice and a limonene citrus undertone. Sources: DNA Genetics,
  // Strainpedia, Medical Terpenes.
  "Strawberry Banana": { traceAromas: ["earthy", "citrus"], traceFlavors: ["spicy"] },
};
