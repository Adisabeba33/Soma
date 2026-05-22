// Turns a pasted dispensary menu (or a loose list) into clean strain names.

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

export function parseMenu(text: string): string[] {
  if (!text) return [];
  const tokens = text
    .split(/[\n\r;]+/)
    .flatMap((segment) =>
      // A single comma-separated line is also a valid list.
      segment.includes(",") && !/\s[-–—|]\s/.test(segment)
        ? segment.split(",")
        : [segment],
    );

  const seen = new Set<string>();
  const result: string[] = [];

  for (const token of tokens) {
    const name = cleanLine(token);
    if (!name || name.length < 2) continue;
    const norm = name.toLowerCase();
    if (CATEGORY_WORDS.has(norm.replace(/[^a-z]/g, ""))) continue;
    if (/^\d+$/.test(norm)) continue;
    const key = norm.replace(/[^a-z0-9]/g, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }

  return result;
}
