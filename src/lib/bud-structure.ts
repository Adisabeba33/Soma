// Bud-structure (density) — a SOFT, phenotype/grow-dependent signal. The same
// strain comes dense from one grower and fluffy from another, so this is a
// tendency, never a fact — and it carries an explicit confidence level so the
// engine knows how much to trust it (and whether to nudge the score at all).
//
// Two curated axes feed it:
//   GENETICS — the reported indica/sativa split (%). Marketing-tinged, treated
//     as "reported lineage ratio", not botanical truth. Sets the PRESUMED
//     density lean when no real-world structure data exists yet.
//   DENSITY  — real-world structure observations. Each credible confirmation
//     lifts the confidence presumed → low → medium → high.
//
// Both are curated in batches; an unseeded strain falls back to a presumed lean
// from its `type`, scaled by how far the split leans from 50/50.

import type { StrainProfile, StrainType } from "./types";

export type DensityLean = "dense" | "fluffy" | "mixed";
// presumed — genotype theory only, no real-world confirmation
// low/medium/high — one / several / consensus of credible sources
export type DensityConfidence = "presumed" | "low" | "medium" | "high";

// Raw-score bonus per confidence tier (added on a structure match, then scaled
// by how hard the user asked for that structure — the slider). presumed is a
// near-silent 0.33 whisper; a true unknown contributes 0.
export const DENSITY_BONUS: Record<DensityConfidence, number> = {
  presumed: 0.33,
  low: 1,
  medium: 2,
  high: 4,
};

export interface Genetics {
  indica: number; // 0–100; indica + sativa = 100
  sativa: number;
}

export interface DensityEntry {
  lean: DensityLean;
  confidence: DensityConfidence;
  sources?: string; // short note for the Audit trail / future re-verification
}

// Curated reported indica/sativa split. Keyed by canonical strain name.
// Filled in batches — "reported lineage ratio", not botanical truth.
export const GENETICS: Record<string, Genetics> = {
  // Batch 1 — iconic / common strains.
  "GMO Cookies": { indica: 90, sativa: 10 },
  "OG Kush": { indica: 75, sativa: 25 },
  "Bubba Kush": { indica: 80, sativa: 20 },
  "Granddaddy Purple": { indica: 70, sativa: 30 },
  "Northern Lights": { indica: 90, sativa: 10 },
  "Wedding Cake": { indica: 60, sativa: 40 },
  "Do-Si-Dos": { indica: 70, sativa: 30 },
  "Girl Scout Cookies": { indica: 60, sativa: 40 },
  "Skywalker OG": { indica: 85, sativa: 15 },
  "Purple Punch": { indica: 80, sativa: 20 },
  "Ice Cream Cake": { indica: 75, sativa: 25 },
  "Master Kush": { indica: 80, sativa: 20 },
  Zkittlez: { indica: 70, sativa: 30 },
  Gelato: { indica: 55, sativa: 45 },
  Runtz: { indica: 50, sativa: 50 },
  MAC: { indica: 50, sativa: 50 },
  GG4: { indica: 50, sativa: 50 },
  "Sour Diesel": { indica: 10, sativa: 90 },
  "Super Lemon Haze": { indica: 20, sativa: 80 },
  "Amnesia Haze": { indica: 20, sativa: 80 },
  "Ghost Train Haze": { indica: 30, sativa: 70 },
  "Jack Herer": { indica: 45, sativa: 55 },
  "Maui Wowie": { indica: 20, sativa: 80 },
  "Strawberry Cough": { indica: 20, sativa: 80 },
  Tangie: { indica: 30, sativa: 70 },
  "Pineapple Express": { indica: 40, sativa: 60 },
  "Green Crack": { indica: 35, sativa: 65 },
  "Durban Poison": { indica: 10, sativa: 90 },
  "Blue Dream": { indica: 40, sativa: 60 },
  // Batch 2 — hazes / landrace sativas + common dense indicas.
  "Acapulco Gold": { indica: 20, sativa: 80 },
  Chocolope: { indica: 15, sativa: 85 },
  "Lamb's Bread": { indica: 15, sativa: 85 },
  "Chocolate Thai": { indica: 10, sativa: 90 },
  Hawaiian: { indica: 20, sativa: 80 },
  "Hawaiian Haze": { indica: 20, sativa: 80 },
  "Lemon Haze": { indica: 25, sativa: 75 },
  Harlequin: { indica: 25, sativa: 75 },
  Clementine: { indica: 35, sativa: 65 },
  Congolese: { indica: 10, sativa: 90 },
  "Jack the Ripper": { indica: 30, sativa: 70 },
  "Cinderella 99": { indica: 25, sativa: 75 },
  Candyland: { indica: 40, sativa: 60 },
  "AK-47": { indica: 45, sativa: 55 },
  Chemdawg: { indica: 45, sativa: 55 },
  Gushers: { indica: 60, sativa: 40 },
  Biscotti: { indica: 60, sativa: 40 },
  "Grape Ape": { indica: 90, sativa: 10 },
  "Purple Kush": { indica: 100, sativa: 0 },
  "Hindu Kush": { indica: 100, sativa: 0 },
  Afghani: { indica: 100, sativa: 0 },
  "Blackberry Kush": { indica: 80, sativa: 20 },
  "9 Pound Hammer": { indica: 80, sativa: 20 },
  "Animal Cookies": { indica: 75, sativa: 25 },
  "Animal Mints": { indica: 60, sativa: 40 },
  "Kush Mints": { indica: 50, sativa: 50 },
  "London Pound Cake": { indica: 70, sativa: 30 },
  "Gary Payton": { indica: 50, sativa: 50 },
  "Apple Fritter": { indica: 50, sativa: 50 },
  "Critical Mass": { indica: 80, sativa: 20 },
  "Ghost OG": { indica: 70, sativa: 30 },
  "God Bud": { indica: 75, sativa: 25 },
  // Batch 3 — Gelato/Runtz/Sherbet & OG lines, fruity hybrids, more hazes.
  "Gelato 33": { indica: 55, sativa: 45 },
  "Gelato 41": { indica: 55, sativa: 45 },
  "White Runtz": { indica: 50, sativa: 50 },
  "Pink Runtz": { indica: 50, sativa: 50 },
  "Sunset Sherbet": { indica: 60, sativa: 40 },
  "Cherry Pie": { indica: 50, sativa: 50 },
  "Forbidden Fruit": { indica: 70, sativa: 30 },
  "Mendo Breath": { indica: 80, sativa: 20 },
  "Lava Cake": { indica: 70, sativa: 30 },
  "Birthday Cake": { indica: 50, sativa: 50 },
  Slurricane: { indica: 80, sativa: 20 },
  "Cap Junky": { indica: 50, sativa: 50 },
  Jealousy: { indica: 50, sativa: 50 },
  Oreoz: { indica: 65, sativa: 35 },
  "Grape Pie": { indica: 70, sativa: 30 },
  "Purple Urkle": { indica: 90, sativa: 10 },
  "Wedding Crasher": { indica: 50, sativa: 50 },
  "Tahoe OG": { indica: 80, sativa: 20 },
  "SFV OG": { indica: 70, sativa: 30 },
  "Fire OG": { indica: 70, sativa: 30 },
  "Triangle Kush": { indica: 75, sativa: 25 },
  "Cereal Milk": { indica: 50, sativa: 50 },
  Mimosa: { indica: 30, sativa: 70 },
  "Sour Tangie": { indica: 30, sativa: 70 },
  "Sour Amnesia": { indica: 20, sativa: 80 },
  "Galactic Jack": { indica: 20, sativa: 80 },
  "Arjan's Haze": { indica: 20, sativa: 80 },
  "Hawaiian Snow": { indica: 10, sativa: 90 },
  "Jack Flash": { indica: 30, sativa: 70 },
  "Lemon Skunk": { indica: 40, sativa: 60 },
  "Lemon G": { indica: 40, sativa: 60 },
  // Batch 4 — GMO/Garlic & Gelato/Zkittlez crosses, classic dense indicas.
  "Garlic Breath": { indica: 70, sativa: 30 },
  "Astro GMO": { indica: 80, sativa: 20 },
  "Golden GMO": { indica: 80, sativa: 20 },
  "Black Cherry Gelato": { indica: 60, sativa: 40 },
  "Peach Gelato": { indica: 55, sativa: 45 },
  "Watermelon Gelato": { indica: 60, sativa: 40 },
  "Purple Gelato": { indica: 60, sativa: 40 },
  "Apple Gelato": { indica: 55, sativa: 45 },
  "Gelato Cake": { indica: 65, sativa: 35 },
  "Gorilla Zkittlez": { indica: 70, sativa: 30 },
  "Watermelon Zkittlez": { indica: 60, sativa: 40 },
  Blueberry: { indica: 80, sativa: 20 },
  Papaya: { indica: 70, sativa: 30 },
  "Black Domina": { indica: 95, sativa: 5 },
  "Kosher Kush": { indica: 80, sativa: 20 },
  "LA Confidential": { indica: 70, sativa: 30 },
  "Death Star": { indica: 75, sativa: 25 },
  "Alien OG": { indica: 50, sativa: 50 },
  "Granddaddy Pluto": { indica: 80, sativa: 20 },
  "Strawberry Banana": { indica: 60, sativa: 40 },
  "Chem 91": { indica: 45, sativa: 55 },
  Stardawg: { indica: 50, sativa: 50 },
  "Northern Lights #5": { indica: 90, sativa: 10 },
  Sherbacio: { indica: 60, sativa: 40 },
  "Mango Kush": { indica: 65, sativa: 35 },
  "Bruce Banner": { indica: 40, sativa: 60 },
  "Purple Trainwreck": { indica: 55, sativa: 45 },
  Trainwreck: { indica: 40, sativa: 60 },
  "Mango Haze": { indica: 20, sativa: 80 },
  "Tropical Trainwreck": { indica: 30, sativa: 70 },
  "Banana Kush": { indica: 40, sativa: 60 },
  // Batch 5 — Skunk/Cheese classics, OG/Kush, cookies phenos, modern desserts.
  "Skunk #1": { indica: 65, sativa: 35 },
  "Super Skunk": { indica: 80, sativa: 20 },
  "Shiva Skunk": { indica: 80, sativa: 20 },
  "UK Cheese": { indica: 60, sativa: 40 },
  "Blue Cheese": { indica: 70, sativa: 30 },
  "True OG": { indica: 80, sativa: 20 },
  "Larry OG": { indica: 60, sativa: 40 },
  "Banana OG": { indica: 70, sativa: 30 },
  "Lemon OG": { indica: 50, sativa: 50 },
  "Lemon Kush": { indica: 50, sativa: 50 },
  "Critical Kush": { indica: 80, sativa: 20 },
  "Las Vegas Purple Kush": { indica: 90, sativa: 10 },
  "Mendo Purps": { indica: 70, sativa: 30 },
  "Thin Mint GSC": { indica: 60, sativa: 40 },
  "Platinum GSC": { indica: 60, sativa: 40 },
  "Blue Cookies": { indica: 60, sativa: 40 },
  "Apples and Bananas": { indica: 55, sativa: 45 },
  "Rainbow Belts": { indica: 50, sativa: 50 },
  RS11: { indica: 50, sativa: 50 },
  Gelonade: { indica: 40, sativa: 60 },
  Jokerz: { indica: 50, sativa: 50 },
  "Biscotti Sundae": { indica: 60, sativa: 40 },
  "Big Bud": { indica: 85, sativa: 15 },
  G13: { indica: 70, sativa: 30 },
  "Sensi Star": { indica: 80, sativa: 20 },
  "White Rhino": { indica: 80, sativa: 20 },
  "Key Lime Pie": { indica: 75, sativa: 25 },
  "MAC and Cheese": { indica: 50, sativa: 50 },
  "NYC Diesel": { indica: 30, sativa: 70 },
  "Skunk Haze": { indica: 30, sativa: 70 },
};

// Curated real-world density observations. Overrides the genetics-presumed lean
// once we have actual confirmation. `sources` is an honest note on the basis —
// knowledge-based consensus here, not a live multi-source audit. Confidence is
// conservative: high = broad consensus, medium = solid with some grow variance,
// low = weaker / single signal.
export const DENSITY: Record<string, DensityEntry> = {
  // — Dense, well-documented —
  "GMO Cookies": { lean: "dense", confidence: "high", sources: "Consensus: very dense, chunky resinous nugs" },
  "OG Kush": { lean: "dense", confidence: "high", sources: "Consensus: classic dense OG nug" },
  "Bubba Kush": { lean: "dense", confidence: "high", sources: "Consensus: dense, rounded indica nugs" },
  "Granddaddy Purple": { lean: "dense", confidence: "high", sources: "Consensus: dense purple nugs" },
  "Northern Lights": { lean: "dense", confidence: "high", sources: "Consensus: classic dense indica" },
  "Wedding Cake": { lean: "dense", confidence: "high", sources: "Consensus: dense, frosty, tight" },
  "Do-Si-Dos": { lean: "dense", confidence: "high", sources: "Consensus: dense, OGKB-line nugs" },
  "Girl Scout Cookies": { lean: "dense", confidence: "high", sources: "Consensus: dense, tight, frosty" },
  // GG4 is a balanced hybrid (presumed would read mixed/0) but is famously dense.
  GG4: { lean: "dense", confidence: "high", sources: "Correction vs 50/50 presumed: famously dense, chunky, resin-coated" },
  "Skywalker OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Purple Punch": { lean: "dense", confidence: "medium", sources: "Dense, compact, frosty" },
  "Ice Cream Cake": { lean: "dense", confidence: "medium", sources: "Dense, tight cake-line nugs" },
  "Master Kush": { lean: "dense", confidence: "medium", sources: "Dense indica nugs" },
  Zkittlez: { lean: "dense", confidence: "medium", sources: "Fairly dense, compact, colourful" },
  Gelato: { lean: "dense", confidence: "medium", sources: "Dense, resinous" },
  Runtz: { lean: "dense", confidence: "medium", sources: "Dense, tight, colourful nugs" },
  MAC: { lean: "dense", confidence: "low", sources: "Moderately dense; some phenos run airier" },
  // Sativa-line correction cases — denser than lineage suggests.
  "Green Crack": { lean: "dense", confidence: "medium", sources: "Correction vs sativa presumed: compact, fairly dense small nugs" },
  "Durban Poison": { lean: "dense", confidence: "medium", sources: "Correction vs sativa presumed: chunky, foxtailing, dense for a pure sativa" },
  // — Fluffy / airy, well-documented —
  "Sour Diesel": { lean: "fluffy", confidence: "high", sources: "Consensus: spindly, airy sativa structure" },
  "Super Lemon Haze": { lean: "fluffy", confidence: "high", sources: "Consensus: airy haze structure" },
  "Amnesia Haze": { lean: "fluffy", confidence: "high", sources: "Consensus: airy, wispy haze nugs" },
  "Ghost Train Haze": { lean: "fluffy", confidence: "medium", sources: "Airy haze structure (resinous)" },
  "Jack Herer": { lean: "fluffy", confidence: "medium", sources: "Sativa-leaning, somewhat airy" },
  "Maui Wowie": { lean: "fluffy", confidence: "medium", sources: "Airy island sativa" },
  "Strawberry Cough": { lean: "fluffy", confidence: "medium", sources: "Airy, light sativa nugs" },
  Tangie: { lean: "fluffy", confidence: "medium", sources: "Airy, sativa-leaning" },
  "Pineapple Express": { lean: "fluffy", confidence: "low", sources: "Medium structure, slightly airy" },
  "Blue Dream": { lean: "fluffy", confidence: "low", sources: "Medium density, slightly airy" },

  // — Batch 2: fluffy / airy hazes & landrace sativas —
  "Acapulco Gold": { lean: "fluffy", confidence: "medium", sources: "Classic airy landrace sativa" },
  Chocolope: { lean: "fluffy", confidence: "medium", sources: "Light, airy sativa nugs" },
  "Lamb's Bread": { lean: "fluffy", confidence: "medium", sources: "Light, wispy sativa structure" },
  "Chocolate Thai": { lean: "fluffy", confidence: "medium", sources: "Wispy, airy landrace sativa" },
  Hawaiian: { lean: "fluffy", confidence: "low", sources: "Airy island sativa" },
  "Hawaiian Haze": { lean: "fluffy", confidence: "medium", sources: "Airy haze structure" },
  "Lemon Haze": { lean: "fluffy", confidence: "medium", sources: "Airy haze nugs" },
  Harlequin: { lean: "fluffy", confidence: "medium", sources: "Loose, open CBD sativa structure" },
  Clementine: { lean: "fluffy", confidence: "low", sources: "Slightly airy, sativa-leaning" },
  Congolese: { lean: "fluffy", confidence: "low", sources: "Airy landrace sativa" },
  "Jack the Ripper": { lean: "fluffy", confidence: "low", sources: "Airy, sativa-leaning" },
  // — Batch 2: sativa-line correction cases (actually dense) —
  "Cinderella 99": { lean: "dense", confidence: "low", sources: "Correction vs sativa presumed: prized for dense, compact buds" },
  Candyland: { lean: "dense", confidence: "low", sources: "Correction vs sativa presumed: dense, compact, frosty" },
  "AK-47": { lean: "dense", confidence: "low", sources: "Correction vs sativa-lean presumed: dense, resinous buds" },
  // — Batch 2: common dense indicas / hybrids —
  Chemdawg: { lean: "dense", confidence: "medium", sources: "Dense, sticky, gassy" },
  Gushers: { lean: "dense", confidence: "medium", sources: "Dense, indica-leaning" },
  Biscotti: { lean: "dense", confidence: "medium", sources: "Dense, dark, compact" },
  "Grape Ape": { lean: "dense", confidence: "medium", sources: "Very dense purple indica" },
  "Purple Kush": { lean: "dense", confidence: "medium", sources: "Dense Kush-line indica" },
  "Hindu Kush": { lean: "dense", confidence: "medium", sources: "Classic dense landrace indica" },
  Afghani: { lean: "dense", confidence: "high", sources: "Archetypal dense landrace indica" },
  "Blackberry Kush": { lean: "dense", confidence: "medium", sources: "Dense, dark indica nugs" },
  "9 Pound Hammer": { lean: "dense", confidence: "medium", sources: "Dense, heavy indica" },
  "Animal Cookies": { lean: "dense", confidence: "medium", sources: "Dense, frosty cookies-line" },
  "Animal Mints": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Kush Mints": { lean: "dense", confidence: "medium", sources: "Dense, compact" },
  "London Pound Cake": { lean: "dense", confidence: "medium", sources: "Dense, tight cake-line nugs" },
  "Gary Payton": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Apple Fritter": { lean: "dense", confidence: "medium", sources: "Dense, frosty hybrid" },
  "Critical Mass": { lean: "dense", confidence: "high", sources: "Famously very dense, heavy buds" },
  "Ghost OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "God Bud": { lean: "dense", confidence: "low", sources: "Dense indica nugs" },

  // — Batch 3: dense Gelato/Runtz/Sherbet, OG & cake lines, fruity hybrids —
  "Gelato 33": { lean: "dense", confidence: "medium", sources: "Dense, frosty gelato pheno" },
  "Gelato 41": { lean: "dense", confidence: "medium", sources: "Dense, frosty gelato pheno" },
  "White Runtz": { lean: "dense", confidence: "medium", sources: "Dense, frosty Runtz pheno" },
  "Pink Runtz": { lean: "dense", confidence: "medium", sources: "Dense, colourful Runtz pheno" },
  "Sunset Sherbet": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Cherry Pie": { lean: "dense", confidence: "medium", sources: "Dense (GDP x Durban)" },
  "Forbidden Fruit": { lean: "dense", confidence: "medium", sources: "Dense, dark, compact" },
  "Mendo Breath": { lean: "dense", confidence: "medium", sources: "Dense, OGKB-line nugs" },
  "Lava Cake": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Birthday Cake": { lean: "dense", confidence: "medium", sources: "Dense, frosty cake-line" },
  Slurricane: { lean: "dense", confidence: "medium", sources: "Dense, heavy indica" },
  "Cap Junky": { lean: "dense", confidence: "medium", sources: "Very dense, frosty" },
  Jealousy: { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  Oreoz: { lean: "dense", confidence: "medium", sources: "Very dense, dark, frosty" },
  "Grape Pie": { lean: "dense", confidence: "medium", sources: "Dense, compact" },
  "Purple Urkle": { lean: "dense", confidence: "medium", sources: "Dense purple indica" },
  "Wedding Crasher": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Tahoe OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "SFV OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Fire OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Triangle Kush": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Cereal Milk": { lean: "dense", confidence: "low", sources: "Moderately dense" },
  Mimosa: { lean: "dense", confidence: "low", sources: "Correction vs sativa-lean presumed: fairly dense, frosty" },
  // — Batch 3: fluffy / airy sativas & hazes —
  "Sour Tangie": { lean: "fluffy", confidence: "medium", sources: "Airy, sativa-leaning" },
  "Sour Amnesia": { lean: "fluffy", confidence: "medium", sources: "Airy haze-line" },
  "Galactic Jack": { lean: "fluffy", confidence: "medium", sources: "Airy Jack-line sativa" },
  "Arjan's Haze": { lean: "fluffy", confidence: "medium", sources: "Airy haze structure" },
  "Hawaiian Snow": { lean: "fluffy", confidence: "medium", sources: "Airy haze structure" },
  "Jack Flash": { lean: "fluffy", confidence: "low", sources: "Airy, sativa-leaning" },
  "Lemon Skunk": { lean: "fluffy", confidence: "low", sources: "Slightly airy, sativa-leaning" },
  "Lemon G": { lean: "fluffy", confidence: "low", sources: "Slightly airy, sativa-leaning" },

  // — Batch 4: dense GMO/Garlic, Gelato/Zkittlez crosses, classic indicas —
  "Garlic Breath": { lean: "dense", confidence: "medium", sources: "Dense, gassy GMO-line" },
  "Astro GMO": { lean: "dense", confidence: "medium", sources: "Dense, gassy GMO-line" },
  "Golden GMO": { lean: "dense", confidence: "medium", sources: "Dense, gassy GMO-line" },
  "Black Cherry Gelato": { lean: "dense", confidence: "medium", sources: "Dense, frosty gelato-line" },
  "Peach Gelato": { lean: "dense", confidence: "low", sources: "Dense, frosty gelato-line" },
  "Watermelon Gelato": { lean: "dense", confidence: "low", sources: "Dense, frosty gelato-line" },
  "Purple Gelato": { lean: "dense", confidence: "medium", sources: "Dense, frosty gelato-line" },
  "Apple Gelato": { lean: "dense", confidence: "low", sources: "Dense, frosty gelato-line" },
  "Gelato Cake": { lean: "dense", confidence: "medium", sources: "Dense, frosty cake-line" },
  "Gorilla Zkittlez": { lean: "dense", confidence: "medium", sources: "Dense, compact" },
  "Watermelon Zkittlez": { lean: "dense", confidence: "low", sources: "Dense, compact" },
  Blueberry: { lean: "dense", confidence: "medium", sources: "Classic dense blueberry indica" },
  Papaya: { lean: "dense", confidence: "medium", sources: "Dense, frosty indica" },
  "Black Domina": { lean: "dense", confidence: "high", sources: "Near-pure indica, very dense" },
  "Kosher Kush": { lean: "dense", confidence: "medium", sources: "Dense Kush-line indica" },
  "LA Confidential": { lean: "dense", confidence: "medium", sources: "Dense indica nugs" },
  "Death Star": { lean: "dense", confidence: "medium", sources: "Dense, gassy indica" },
  "Alien OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Granddaddy Pluto": { lean: "dense", confidence: "medium", sources: "Dense purple indica" },
  "Strawberry Banana": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Chem 91": { lean: "dense", confidence: "medium", sources: "Dense, gassy chem" },
  Stardawg: { lean: "dense", confidence: "medium", sources: "Dense, gassy, frosty" },
  "Northern Lights #5": { lean: "dense", confidence: "high", sources: "Classic dense indica" },
  Sherbacio: { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Mango Kush": { lean: "dense", confidence: "low", sources: "Moderately dense kush hybrid" },
  // Correction cases (sativa-leaning but dense)
  "Bruce Banner": { lean: "dense", confidence: "low", sources: "Correction vs sativa-lean presumed: dense, frosty buds" },
  "Purple Trainwreck": { lean: "dense", confidence: "low", sources: "Dense-leaning, indica side" },
  // — Batch 4: fluffy / airy —
  Trainwreck: { lean: "fluffy", confidence: "low", sources: "Medium, slightly airy sativa-lean" },
  "Mango Haze": { lean: "fluffy", confidence: "medium", sources: "Airy haze structure" },
  "Tropical Trainwreck": { lean: "fluffy", confidence: "low", sources: "Airy, sativa-leaning" },
  "Banana Kush": { lean: "fluffy", confidence: "low", sources: "Medium, slightly airy" },

  // — Batch 5: dense Skunk/Cheese, OG/Kush, cookies phenos, modern desserts —
  "Skunk #1": { lean: "dense", confidence: "medium", sources: "Classic dense, chunky skunk nugs" },
  "Super Skunk": { lean: "dense", confidence: "medium", sources: "Dense skunk indica" },
  "Shiva Skunk": { lean: "dense", confidence: "medium", sources: "Dense skunk indica" },
  "UK Cheese": { lean: "dense", confidence: "medium", sources: "Dense cheese pheno" },
  "Blue Cheese": { lean: "dense", confidence: "medium", sources: "Dense, indica-leaning cheese" },
  "True OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Larry OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Banana OG": { lean: "dense", confidence: "medium", sources: "Dense OG-line nugs" },
  "Lemon OG": { lean: "dense", confidence: "low", sources: "Moderately dense OG hybrid" },
  "Lemon Kush": { lean: "dense", confidence: "low", sources: "Moderately dense" },
  "Critical Kush": { lean: "dense", confidence: "medium", sources: "Dense, heavy Kush" },
  "Las Vegas Purple Kush": { lean: "dense", confidence: "medium", sources: "Dense purple Kush indica" },
  "Mendo Purps": { lean: "dense", confidence: "low", sources: "Dense purple indica" },
  "Thin Mint GSC": { lean: "dense", confidence: "medium", sources: "Dense, frosty cookies pheno" },
  "Platinum GSC": { lean: "dense", confidence: "medium", sources: "Dense, frosty cookies pheno" },
  "Blue Cookies": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Apples and Bananas": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  "Rainbow Belts": { lean: "dense", confidence: "medium", sources: "Dense, frosty" },
  RS11: { lean: "dense", confidence: "medium", sources: "Dense, frosty (Rainbow Sherbet #11)" },
  Gelonade: { lean: "dense", confidence: "low", sources: "Dense, frosty" },
  Jokerz: { lean: "dense", confidence: "low", sources: "Dense, frosty" },
  "Biscotti Sundae": { lean: "dense", confidence: "medium", sources: "Dense, dark, compact" },
  "Big Bud": { lean: "dense", confidence: "high", sources: "Famously huge, dense, heavy buds" },
  G13: { lean: "dense", confidence: "medium", sources: "Dense indica nugs" },
  "Sensi Star": { lean: "dense", confidence: "medium", sources: "Dense, frosty indica" },
  "White Rhino": { lean: "dense", confidence: "medium", sources: "Dense indica nugs" },
  "Key Lime Pie": { lean: "dense", confidence: "medium", sources: "Dense, GSC-line" },
  "MAC and Cheese": { lean: "dense", confidence: "low", sources: "Moderately dense" },
  // — Batch 5: fluffy / airy —
  "NYC Diesel": { lean: "fluffy", confidence: "medium", sources: "Airy diesel sativa" },
  "Skunk Haze": { lean: "fluffy", confidence: "low", sources: "Airy haze-skunk cross" },
};

function geneticsFromType(type: string): Genetics {
  if (type === "indica") return { indica: 100, sativa: 0 };
  if (type === "sativa") return { indica: 0, sativa: 100 };
  return { indica: 50, sativa: 50 }; // hybrid → neutral until curated
}

// The strain's indica/sativa split — curated when we have it, otherwise a flat
// read from its `type`. `curated` flags which, so UI can be honest about it.
export function geneticsFor(
  name: string,
  type: StrainType,
): Genetics & { curated: boolean } {
  const g = GENETICS[name];
  return g ? { ...g, curated: true } : { ...geneticsFromType(type), curated: false };
}

// Resolve density lean / confidence / bonus weight from a name + type. A
// curated DENSITY entry wins; otherwise a PRESUMED lean from genetics (curated
// split, else type), scaled by dominance.
export function densityFor(
  name: string,
  type: StrainType,
): { lean: DensityLean; confidence: DensityConfidence; weight: number } {
  const curated = DENSITY[name];
  if (curated) {
    const weight = curated.lean === "mixed" ? 0 : DENSITY_BONUS[curated.confidence];
    return { lean: curated.lean, confidence: curated.confidence, weight };
  }
  const g = GENETICS[name] ?? geneticsFromType(type);
  const dominance = Math.abs(g.indica - g.sativa) / 100; // 0 at 50/50, 1 at 100/0
  if (dominance === 0) return { lean: "mixed", confidence: "presumed", weight: 0 };
  return {
    lean: g.indica > g.sativa ? "dense" : "fluffy",
    confidence: "presumed",
    weight: DENSITY_BONUS.presumed * dominance,
  };
}

// Human-readable density label that is honest about how sure we are.
export function densityLabel(
  lean: DensityLean,
  confidence: DensityConfidence,
): string {
  if (lean === "mixed") return "No clear lean";
  const word = lean === "dense" ? "Dense" : "Fluffy / airy";
  switch (confidence) {
    case "high":
      return `${word} — well documented`;
    case "medium":
      return `${word} — fairly consistent`;
    case "low":
      return `Tends ${lean} — varies by grow`;
    case "presumed":
      return `Presumed ${lean} (from genetics)`;
  }
}

// Resolve a strain's effective density lean, confidence and the raw-score bonus
// magnitude. A curated real-world DENSITY entry wins; otherwise a PRESUMED lean
// from genetics (curated split, else `type`), scaled by dominance — so 100/0
// gives the full 0.33 whisper, 60/40 a faint fraction, 50/50 nothing.
export function densityProfileOf(strain: StrainProfile): {
  lean: DensityLean;
  confidence: DensityConfidence;
  weight: number;
} {
  return densityFor(strain.name, strain.type);
}

// Bridge the existing budStructure enum to a slider value (−1 fully fluffy … 0
// no preference … +1 fully dense) until the pre-run slider sends a continuous
// one of its own.
export function densityPreferenceFromProfile(
  budStructure?: string | null,
): number {
  switch (budStructure) {
    case "dense":
      return 1;
    case "popcorn":
      return 0.5;
    case "larfy":
      return -0.6;
    case "airy":
      return -0.8;
    case "fluffy":
      return -1;
    default:
      return 0;
  }
}

// Signed raw-score nudge for how the strain's structure matches what the user
// asked for. preference: −1 (fluffy) … 0 (neutral) … +1 (dense). Matches add
// the confidence-scaled bonus; mismatches take the same hit (symmetric), all
// scaled by slider intensity. Neutral preference or unknown strain → 0.
export function densityBonus(strain: StrainProfile, preference: number): number {
  if (!preference) return 0;
  const { lean, weight } = densityProfileOf(strain);
  if (lean === "mixed" || weight === 0) return 0;
  const want: DensityLean = preference > 0 ? "dense" : "fluffy";
  const intensity = Math.min(1, Math.abs(preference));
  return (lean === want ? weight : -weight) * intensity;
}
