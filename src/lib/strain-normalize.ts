// Lightweight, deterministic strain-name normalization for deduplication.
// No ML, no external lookups — just lowercase, trim, collapse whitespace,
// normalize dashes, and strip obvious punctuation noise. Strain numbers
// (e.g. "Gelato 33") are preserved because they identify distinct cuts.

const DASH_VARIANTS = /[‐-―−­]/g; // hyphens, en/em dashes, minus, soft hyphen
const PUNCT_NOISE = /[#@*•·▪◦"'`~^|/\\]/g;
const SOFT_SEPARATORS = /[,;:!?()]+/g;

export function normalizeStrainQueryName(raw: string): string {
  if (!raw) return "";
  return raw
    .normalize("NFKC")
    .toLowerCase()
    .replace(DASH_VARIANTS, "-")
    .replace(PUNCT_NOISE, " ")
    .replace(SOFT_SEPARATORS, " ")
    // Treat ASCII hyphen as a word boundary so "Gelato-33" matches "Gelato 33".
    .replace(/-+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Grower needs the same treatment so "Cookies" and "cookies " share a key,
// and an empty/missing grower deduplicates against itself rather than NULL.
export function normalizeGrowerKey(raw: string | null | undefined): string {
  if (!raw) return "";
  return normalizeStrainQueryName(raw);
}
