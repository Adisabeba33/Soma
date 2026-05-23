// Turns a pasted dispensary menu (or a loose list) into clean strain names
// and structured per-line metadata (grower, THC%, price, weight) where the
// text makes it possible. Unknown lines are preserved with rawLine so the
// caller can still surface them for analysis.

export interface ParsedMenuItem {
  strainName: string;
  grower: string | null;
  thcPercent: number | null;
  price: number | null;
  weight: string | null;
  rawLine: string;
  confidence: "high" | "medium" | "low";
  warnings: string[];
}

const CATEGORY_WORDS = new Set([
  "sativa",
  "indica",
  "hybrid",
  "flower",
  "flowers",
  "preroll",
  "prerolls",
  "pre-rolls",
  "edibles",
  "concentrates",
  "vapes",
  "vape",
  "cartridges",
  "menu",
  "strains",
  "topshelf",
  "top-shelf",
  "mids",
  "value",
  "eighth",
  "eighths",
  "quarter",
  "ounce",
  "gram",
  "grams",
  "specials",
  "new",
  "popular",
]);

const THC_RE = /\b(\d{1,2}(?:\.\d{1,2})?)\s?%/;
const PRICE_RE = /\$\s?(\d{1,4}(?:[.,]\d{1,2})?)/;
const WEIGHT_RE =
  /\b(\d+(?:\.\d+)?\s?(?:g|gram|grams|oz|ounce)\b|1\s?\/\s?[2-8]|3\.5\s?g)/i;
// "by X", optionally with & and spaces, terminated by separator/number/end.
const GROWER_BY_RE = /\bby\s+([A-Z][A-Za-z0-9 .&'-]{1,40}?)(?=\s*[-–—|,]|\s*\d|\s{2,}|$)/;
// Parenthetical near the end of the line — often a brand/grower tag.
const GROWER_PAREN_RE = /\(([A-Z][A-Za-z0-9 .&'-]{1,40})\)/;
// "BRAND: strain" or "BRAND — strain" prefix (brand in ALL CAPS or TitleCase).
const GROWER_PREFIX_RE = /^([A-Z][A-Za-z0-9 .&'-]{1,30})\s*[:|]\s+/;

function cleanLine(raw: string): string {
  let line = raw.trim();
  // Strip leading list markers and numbering.
  line = line.replace(/^[\s\-*•·▪◦\d.)\]]+/, "");
  // Cut at the first structural separator (name comes first on menu lines).
  const sepMatch = line.search(/\s[-–—|]\s|\t|\s{2,}/);
  if (sepMatch > 0) line = line.slice(0, sepMatch);
  // Drop prices, percentages, weights and lab labels.
  line = line.replace(/\$\s?\d[\d.,]*/g, "");
  line = line.replace(/\b\d+(\.\d+)?\s?%/gi, "");
  line = line.replace(/\b\d+(\.\d+)?\s?(mg|g|oz|gram|grams)\b/gi, "");
  // Fraction weights such as "1/8", "1 / 4".
  line = line.replace(/\b\d+\s?\/\s?\d+\b/g, "");
  line = line.replace(/\b(thc|cbd|cbg)\b/gi, "");
  // Drop trailing parenthetical noise.
  line = line.replace(/\([^)]*\)/g, "");
  line = line.replace(/\s{2,}/g, " ").trim();
  // Trim dangling separators left behind.
  line = line.replace(/[-–—|,:]+$/, "").trim();
  return line;
}

function detectGrower(rawLine: string): string | null {
  const byMatch = rawLine.match(GROWER_BY_RE);
  if (byMatch) return byMatch[1].trim().replace(/[.,;:]+$/, "");
  const parenMatch = rawLine.match(GROWER_PAREN_RE);
  if (parenMatch) {
    const candidate = parenMatch[1].trim();
    // Skip parentheticals that are obviously not a brand (numbers, single words too short).
    if (!/^\d/.test(candidate) && candidate.length >= 3) {
      return candidate;
    }
  }
  const prefixMatch = rawLine.match(GROWER_PREFIX_RE);
  if (prefixMatch) {
    const candidate = prefixMatch[1].trim();
    // Don't treat a single common category word as a grower.
    if (!CATEGORY_WORDS.has(candidate.toLowerCase())) {
      return candidate;
    }
  }
  return null;
}

function parseSegment(raw: string): ParsedMenuItem | null {
  const rawLine = raw.trim();
  if (!rawLine) return null;

  const thcMatch = rawLine.match(THC_RE);
  const priceMatch = rawLine.match(PRICE_RE);
  const weightMatch = rawLine.match(WEIGHT_RE);
  const grower = detectGrower(rawLine);

  let strainName = cleanLine(rawLine);
  // Strip detected brand prefix from the name (so "Stiiizy: Gelato" → "Gelato").
  if (grower) {
    const prefixRe = new RegExp(`^${escapeRe(grower)}\\s*[:|-]?\\s*`, "i");
    strainName = strainName.replace(prefixRe, "").trim();
    // "by X" tail can survive the first cleanup if there was no separator.
    strainName = strainName
      .replace(new RegExp(`\\bby\\s+${escapeRe(grower)}\\b`, "i"), "")
      .trim();
  }
  strainName = strainName.replace(/[-–—|,:]+$/, "").trim();

  if (!strainName || strainName.length < 2) return null;
  const norm = strainName.toLowerCase();
  if (CATEGORY_WORDS.has(norm.replace(/[^a-z]/g, ""))) return null;
  if (/^\d+$/.test(norm)) return null;

  const warnings: string[] = [];
  let confidence: "high" | "medium" | "low" = "high";

  if (strainName.length < 3) {
    confidence = "low";
    warnings.push("Strain name looks too short.");
  } else if (strainName.length > 40) {
    confidence = "low";
    warnings.push("Line may contain extra text beyond the strain name.");
  } else if (/\d{3,}/.test(strainName) || /[#@]/.test(strainName)) {
    confidence = "medium";
    warnings.push("Cleanup left some noise — verify the strain name.");
  }

  // High confidence still warrants medium if we couldn't pull any structured
  // detail at all and the raw line clearly had extra words.
  const rawWordCount = rawLine.split(/\s+/).length;
  const nameWordCount = strainName.split(/\s+/).length;
  if (
    confidence === "high" &&
    rawWordCount - nameWordCount >= 4 &&
    !thcMatch &&
    !priceMatch &&
    !weightMatch &&
    !grower
  ) {
    confidence = "medium";
    warnings.push("Extra text on this line wasn't recognised.");
  }

  return {
    strainName,
    grower,
    thcPercent: thcMatch ? parseFloat(thcMatch[1]) : null,
    price: priceMatch ? parseFloat(priceMatch[1].replace(",", ".")) : null,
    weight: weightMatch ? weightMatch[1].replace(/\s+/g, "").toLowerCase() : null,
    rawLine,
    confidence,
    warnings,
  };
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseMenuRich(text: string): ParsedMenuItem[] {
  if (!text) return [];
  const tokens = text
    .split(/[\n\r;]+/)
    .flatMap((segment) =>
      // A single comma-separated line is also a valid list, but only when
      // there's no other structural separator on it.
      segment.includes(",") && !/\s[-–—|]\s/.test(segment)
        ? segment.split(",")
        : [segment],
    );

  const seen = new Set<string>();
  const result: ParsedMenuItem[] = [];

  for (const token of tokens) {
    const item = parseSegment(token);
    if (!item) continue;
    const key = item.strainName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

// Backwards-compatible: returns just the strain names.
export function parseMenu(text: string): string[] {
  return parseMenuRich(text).map((item) => item.strainName);
}
