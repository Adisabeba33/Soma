// Collection tier — an editorial "collectibility" class for each strain, shown
// on catalog cards under the match score (e.g. GG4 → Legendary, OG Kush →
// Foundational). It is curated, not derived: collectibility is a cultural
// judgement, not something the data can compute. Strains without a curated tier
// simply show no badge — we'd rather say nothing than guess.
//
// Curated in batches, keyed by canonical strain name (must match STRAINS).

export type CollectionTier =
  | "Legendary"
  | "Foundational"
  | "Classic"
  | "Cult Favorite"
  | "Modern Favorite"
  | "Regional Icon"
  | "Rare Find";

export const COLLECTION_TIERS: Record<string, CollectionTier> = {
  // Legendary — genre-defining, household names.
  GG4: "Legendary",
  "Girl Scout Cookies": "Legendary",
  Gelato: "Legendary",
  Runtz: "Legendary",

  // Foundational — building-block genetics most of the catalogue descends from.
  "OG Kush": "Foundational",
  "Northern Lights": "Foundational",
  Afghani: "Foundational",
  "Hindu Kush": "Foundational",
  "Skunk #1": "Foundational",
  Chemdawg: "Foundational",
  Haze: "Foundational",
  "Granddaddy Purple": "Foundational",
  Blueberry: "Foundational",

  // Classic — timeless, well-established staples.
  "Sour Diesel": "Classic",
  "Jack Herer": "Classic",
  "Super Lemon Haze": "Classic",
  "Amnesia Haze": "Classic",
  "Bubba Kush": "Classic",
  "AK-47": "Classic",
  "White Widow": "Classic",
  Trainwreck: "Classic",
  "Green Crack": "Classic",
  "Blue Dream": "Classic",
  "Pineapple Express": "Classic",
  "Master Kush": "Classic",

  // Cult Favorite — devoted, vocal following.
  "Gary Payton": "Cult Favorite",
  "GMO Cookies": "Cult Favorite",
  "Do-Si-Dos": "Cult Favorite",
  MAC: "Cult Favorite",
  Zkittlez: "Cult Favorite",
  "Wedding Cake": "Cult Favorite",
  "Forbidden Fruit": "Cult Favorite",
  "Cap Junky": "Cult Favorite",

  // Modern Favorite — newer hits already on every menu.
  "White Hot Guava": "Modern Favorite",
  Jealousy: "Modern Favorite",
  Oreoz: "Modern Favorite",
  "Apples and Bananas": "Modern Favorite",
  "Rainbow Belts": "Modern Favorite",
  RS11: "Modern Favorite",
  Gelonade: "Modern Favorite",
  "Lemon Cherry Gelato": "Modern Favorite",
  "Ice Cream Cake": "Modern Favorite",
  "Sunset Sherbet": "Modern Favorite",
  Gushers: "Modern Favorite",
  Biscotti: "Modern Favorite",

  // Regional Icon — tied to a place.
  "Maui Wowie": "Regional Icon",
  "Acapulco Gold": "Regional Icon",
  "Durban Poison": "Regional Icon",
  "Tahoe OG": "Regional Icon",
  "SFV OG": "Regional Icon",
  Hawaiian: "Regional Icon",
  "Pakistani Chitral Kush": "Regional Icon",
};

export function tierOf(strainName: string): CollectionTier | null {
  return COLLECTION_TIERS[strainName] ?? null;
}

// Per-tier badge styling — kept inside the cream/brass/green palette, with a
// small colour cue so the prestige tiers read as more special at a glance.
export const TIER_STYLE: Record<CollectionTier, string> = {
  Legendary: "bg-brass/90 text-white",
  Foundational: "bg-accent/85 text-white",
  Classic: "bg-white/85 text-foreground",
  "Cult Favorite": "bg-[#6d4534]/85 text-white",
  "Modern Favorite": "bg-white/85 text-foreground",
  "Regional Icon": "bg-white/85 text-foreground",
  "Rare Find": "bg-[#4a5a44]/85 text-white",
};
