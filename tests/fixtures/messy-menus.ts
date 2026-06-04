// Snapshots of how real dispensary menus tend to look once they're pasted.
// Used by the parser tests to keep regressions visible. Add new lines here
// (don't change existing ones) as we run into formats in the wild.

export const MESSY_MENU_LINES = [
  // Standard "strain by grower weight thc price"
  "Wedding Cake by Jungle Boys 3.5g 28% $60",
  // Brand prefix "BRAND: strain weight $price"
  "Stiiizy: Gelato 3.5g $40",
  // Parenthetical grower
  "Sour Diesel (Cookies) - 22% - $55",
  // Sativa/Indica/Hybrid label
  "Blue Dream - Hybrid - 24% THC - $45",
  // Numbered list, weight only
  "1. Northern Lights 7g — $80",
  // Fraction weight + price
  "GG4 1/8 $50",
  // Comma-separated list (multiple strains, one line)
  "GMO Cookies, Forbidden Fruit, Runtz, Pineapple Express",
  // Unknown strain (not in seed DB)
  "Cosmic Garlic Funk 28% $65",
  // Unknown strain with grower
  "Frosted Reverie by Local Farm 3.5g $50",
  // Noisy / promo line
  "🔥 SPECIAL: Lemon Cherry Gelato — 30% THC — was $70 now $55",
  // Edibles / category — should be dropped
  "EDIBLES",
  // Pure category word
  "Top Shelf",
  // Em-dash separators
  "Bubba Kush — Indica — 26% — $55",
  // ALL CAPS strain
  "GELATO 41 - 3.5G - 27% - $60",
  // Strain with hyphen — should not be split
  "Do-Si-Dos 1/8 $45",
  // Strain with # in name
  "Gelato #33 3.5g 25% $50",
  // Multi-grower noise (parser keeps the first detected)
  "OG Kush (Cookies / Stiiizy) 3.5g $55",
  // Whitespace only
  "   ",
  // Strain only, no metadata
  "Zkittlez",
  // Trailing promo with weight
  "Mac 1 - 3.5g - $50 - BUY 2 GET 1",
] as const;
