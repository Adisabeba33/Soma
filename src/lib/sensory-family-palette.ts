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
  "modern-exotic": {
    background:
      "linear-gradient(155deg, #4a2a3a 0%, #2a1822 55%, #120a10 100%)",
    contentTone: "light",
    accent: "#e8a5c5",
  },
  // Outdoor skunk funk — yellow-green pasture under overcast.
  skunk: {
    background:
      "linear-gradient(155deg, #2f3320 0%, #1c1d12 55%, #0c0d07 100%)",
    contentTone: "light",
    accent: "#cad883",
  },
};

export function paletteForFamily(family: string | null | undefined): FamilyPalette {
  if (!family) return FALLBACK;
  return PALETTE[family] ?? FALLBACK;
}
