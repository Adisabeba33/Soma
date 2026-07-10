// Atmospheric gradient palette keyed on the curator-defined sensoryFamily.
// Each family maps to a layered CSS background that evokes the strain's
// smell territory — gas-OG reads as deep pine smoke, garlic-funk reads
// as cellar earth, citrus-haze reads as golden dawn, and so on. Used
// as the card background on /catalog so a row of cards from different
// families feels visually distinct at a glance even before we wire up
// per-strain artwork.
//
// Fallback covers strains with no sensoryFamily (rare since identity
// curation finished, but still a real safety net) and strains whose
// family isn't in the table (e.g., a brand-new family value added by
// the curator before this map is updated).

import type { TimeProfile } from "./types";

export interface FamilyPalette {
  // Linear/radial gradient applied via inline style — multi-stop so the
  // card has depth, not a flat slab.
  background: string;
  // Tone of the curator quote / fine print at the bottom of the card.
  // Either "light" (for dark-family gradients — most of them) or "dark"
  // (for the few pale palettes we might add later).
  contentTone: "light" | "dark";
  // Subtle accent colour for the match% pip and effect dots.
  accent: string;
}

const FALLBACK: FamilyPalette = {
  background:
    "linear-gradient(155deg, #2a2a32 0%, #15151a 65%, #0c0c10 100%)",
  contentTone: "light",
  accent: "#caa46a",
};

const PALETTE: Record<string, FamilyPalette> = {
  // Deep forest pine smoke — sap and damp earth under a moonlit canopy.
  "gas-og": {
    background:
      "linear-gradient(155deg, #2d3a2f 0%, #1a2620 55%, #0a120e 100%)",
    contentTone: "light",
    accent: "#cabd6a",
  },
  // Industrial fuel haze — dieselled steel, sodium streetlamps over slate.
  "diesel-chem": {
    background:
      "linear-gradient(160deg, #2a3338 0%, #181f24 55%, #0a0d11 100%)",
    contentTone: "light",
    accent: "#d6b985",
  },
  // Cellar earth and roasted garlic — underground larder warmth.
  "garlic-funk": {
    background:
      "linear-gradient(155deg, #3a2c1f 0%, #221912 55%, #100b07 100%)",
    contentTone: "light",
    accent: "#caa46a",
  },
  // Hashish caravan — warm sandstone amber, evening kerosene lamps.
  "kush-classic": {
    background:
      "linear-gradient(155deg, #4a342a 0%, #281e18 55%, #110a07 100%)",
    contentTone: "light",
    accent: "#e0b079",
  },
  // Twilight vineyard — dusty violet over wine-dark grapes.
  "purple-berry": {
    background:
      "linear-gradient(155deg, #422a4a 0%, #25172c 55%, #100912 100%)",
    contentTone: "light",
    accent: "#d39ec8",
  },
  // Warm cream and vanilla evening — pastel dusk over pastry shop.
  "dessert-cookies": {
    background:
      "linear-gradient(155deg, #4b372b 0%, #2a1e17 55%, #120b08 100%)",
    contentTone: "light",
    accent: "#e9c391",
  },
  // Golden lemon grove dawn — citrus oil sunset.
  "citrus-haze": {
    background:
      "linear-gradient(160deg, #3f3320 0%, #25200f 55%, #100d05 100%)",
    contentTone: "light",
    accent: "#e6cf6e",
  },
  // Soft blue dawn — berry haze drifting through indigo sky.
  "sweet-haze": {
    background:
      "linear-gradient(160deg, #2b3147 0%, #181c2e 55%, #0a0c16 100%)",
    contentTone: "light",
    accent: "#9bc1e2",
  },
  // Fresh pine ridge — moss and sharp resin, cool mountain morning.
  "pine-spice": {
    background:
      "linear-gradient(155deg, #1f3528 0%, #11201a 55%, #06100b 100%)",
    contentTone: "light",
    accent: "#a7caa5",
  },
  // Candy sunset dream — pink-coral exotic, sugar-glass haze.
  "candy-exotic": {
    background:
      "linear-gradient(155deg, #4a2a3a 0%, #2a1822 55%, #120a10 100%)",
    contentTone: "light",
    accent: "#e8a5c5",
  },
  // Mango dusk over a warm lagoon — guava, papaya, late-holiday teal.
  "tropical-fruit": {
    background:
      "linear-gradient(155deg, #1f3d3a 0%, #14262b 55%, #081114 100%)",
    contentTone: "light",
    accent: "#f2b25c",
  },
  // Scoop-shop twilight — creamy lavender gelato over cool cream.
  "gelato-exotic": {
    background:
      "linear-gradient(155deg, #3a3348 0%, #221e2e 55%, #0f0c15 100%)",
    contentTone: "light",
    accent: "#cdb8e8",
  },
  // Murky funk cellar — olive gas and cheese-rind bruise.
  "funky-exotic": {
    background:
      "linear-gradient(155deg, #35322a 0%, #201d24 55%, #0e0c10 100%)",
    contentTone: "light",
    accent: "#c8c07a",
  },
  // Airy equatorial haze — sun-bleached green, thin high-altitude light.
  "haze-sativa": {
    background:
      "linear-gradient(160deg, #33422b 0%, #1e281a 55%, #0d120a 100%)",
    contentTone: "light",
    accent: "#bfdc8f",
  },
  // Outdoor skunk funk — yellow-green pasture under overcast.
  "skunk-funk": {
    background:
      "linear-gradient(155deg, #2f3320 0%, #1c1d12 55%, #0c0d07 100%)",
    contentTone: "light",
    accent: "#cad883",
  },
};

// Exposed for the consistency test: every live sensoryFamily value must have
// a palette, and every palette key must correspond to a live family — a
// renamed/split family that leaves this map stale falls back silently on the
// catalog cards, which is exactly the drift the test exists to catch.
export const FAMILY_PALETTE_KEYS = Object.keys(PALETTE);

// ── Family display meta ─────────────────────────────────────────────────
// Human-facing label + one-line character for each smell territory. Used by
// the strain page's "Smell territory" band; kept beside the palettes so the
// coverage test guards both maps against family renames/splits.
export interface FamilyMeta {
  label: string;
  blurb: string;
}

const FAMILY_META: Record<string, FamilyMeta> = {
  "gas-og": {
    label: "Gas & OG",
    blurb: "Fuel, pine and damp earth — the OG line's sharp gas backbone.",
  },
  "diesel-chem": {
    label: "Diesel & Chem",
    blurb: "Sour fuel and chemical funk — the East Coast diesel school.",
  },
  "garlic-funk": {
    label: "Garlic Funk",
    blurb: "Savoury garlic-and-onion funk; slow, heavy burners.",
  },
  "kush-classic": {
    label: "Kush Classic",
    blurb: "Warm hash, spice and old-world earth — the Afghan kush line.",
  },
  "purple-berry": {
    label: "Purple Berry",
    blurb: "Grape and dark berry over floral musk; twilight indicas.",
  },
  "dessert-cookies": {
    label: "Dessert & Cookies",
    blurb: "Doughy vanilla-cream sweetness — the Cookies-and-Cake dynasty.",
  },
  "citrus-haze": {
    label: "Citrus Haze",
    blurb: "Bright lemon oil over spicy haze — daytime citrus energy.",
  },
  "sweet-haze": {
    label: "Sweet Haze",
    blurb: "Soft berry-sweet haze; blue-sky, easy-going sativas.",
  },
  "pine-spice": {
    label: "Pine & Spice",
    blurb: "Fresh pine resin and cracked pepper; forest-morning clarity.",
  },
  "candy-exotic": {
    label: "Candy Exotic",
    blurb: "Sugar-glass candy over fruity gas — the Zkittlez-to-Runtz era.",
  },
  "tropical-fruit": {
    label: "Tropical Fruit",
    blurb: "Mango, guava and papaya — juicy island-fruit terpenes.",
  },
  "gelato-exotic": {
    label: "Gelato Exotic",
    blurb: "Creamy gelato sweetness with a gassy undertow — the MAC and sherbet school.",
  },
  "funky-exotic": {
    label: "Funky Exotic",
    blurb: "Gas, cheese and diesel funk in modern exotic wrappers.",
  },
  "haze-sativa": {
    label: "Haze Sativa",
    blurb: "Airy, herbal old-school haze; long-flowering equatorial energy.",
  },
  "skunk-funk": {
    label: "Skunk Funk",
    blurb: "Loud classic skunk and cheese — the original outdoor funk.",
  },
};

export const FAMILY_META_KEYS = Object.keys(FAMILY_META);

export function familyMeta(family: string): FamilyMeta {
  return (
    FAMILY_META[family] ?? {
      label: family,
      blurb: "A distinct smell territory in the SŌMA catalog.",
    }
  );
}

export function paletteForFamily(family: string | null | undefined): FamilyPalette {
  if (!family) return FALLBACK;
  return PALETTE[family] ?? FALLBACK;
}

// ── Time-of-day palette ─────────────────────────────────────────────────
// Drives the catalog card atmosphere by the strain's TimeProfile rather than
// its smell family, so a row of cards reads as a spread of moods (light,
// fresh morning → deep, sedative night) instead of a uniformly dark wall —
// even before any artwork is generated. Each gradient runs from a lighter
// top toward a deeper bottom, where the strain name / tagline sit, so the
// contentTone stays legible at the foot of the card.
const TIME_PALETTE: Record<TimeProfile, FamilyPalette> = {
  // Dewy dawn — pale gold and fresh green, awake and clean.
  morning: {
    background:
      "linear-gradient(165deg, #eef5ef 0%, #d4e7dd 45%, #aeccc2 100%)",
    contentTone: "dark",
    accent: "#2f6f5f",
  },
  // Open midday sky — bright, social, energetic blue.
  daytime: {
    background:
      "linear-gradient(165deg, #dcebf7 0%, #aacfeb 45%, #7aaed6 100%)",
    contentTone: "dark",
    accent: "#1f5f8b",
  },
  // Golden hour — warm amber fading into a wine-dark dusk.
  sunset: {
    background:
      "linear-gradient(160deg, #e6a85a 0%, #b75f3c 50%, #5a2740 100%)",
    contentTone: "light",
    accent: "#ffd9a0",
  },
  // Deep night — indigo into near-black, heavy and still.
  night: {
    background:
      "linear-gradient(155deg, #1c2336 0%, #11131f 55%, #06070d 100%)",
    contentTone: "light",
    accent: "#8aa0c8",
  },
};

export function paletteForTime(tp: TimeProfile): FamilyPalette {
  return TIME_PALETTE[tp];
}
