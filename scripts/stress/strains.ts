// Curated stress-test strain set. Picked to cover distinct sensory
// territories — gas / skunk / citrus / dessert / pine / funk / sleeper /
// daytime / heavy / creative — across known and unknown lineage.
//
// WiFi OG is intentionally NOT in the seed dataset: it forces the harness
// to also exercise the inference fallback path.

export const STRESS_STRAINS = [
  "GG4",
  "WiFi OG",
  "Sour Diesel",
  "Skunk #1",
  "GMO Cookies",
  "Northern Lights",
  "Super Lemon Haze",
  "Wedding Cake",
  "Runtz",
  "White Hot Guava",
] as const;
