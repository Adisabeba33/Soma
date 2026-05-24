// Semantic-divergence helpers used by the stress-test harness.
// Goal: surface "illusion of intelligence" — explanations that score
// differently across archetypes but are made of the same recycled phrasing.

// The engine appends a stable caveat sentence to every explanation
// ("Confidence in this read is ...; batch quality still depends on..."). It's
// boilerplate by design, so we strip it before measuring divergence —
// otherwise we'd just be measuring template overlap.
const BOILERPLATE_RE =
  /\bConfidence in this read is [^.]*\.?\s*batch quality still depends on[^.]*\.?/i;

export function stripBoilerplate(text: string): string {
  return text.replace(BOILERPLATE_RE, "").trim();
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function bigrams(text: string): string[] {
  const t = tokens(text);
  const out: string[] = [];
  for (let i = 0; i < t.length - 1; i++) out.push(`${t[i]} ${t[i + 1]}`);
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 1 : inter / union;
}

// Mean pairwise Jaccard across all explanations for one strain. 1.0 = all
// archetypes produced the same words; 0.0 = no shared vocabulary at all.
export function meanPairwiseSimilarity(
  texts: string[],
  mode: "words" | "bigrams" = "words",
): number {
  if (texts.length < 2) return 1;
  const grams = texts.map((t) =>
    mode === "words" ? new Set(tokens(t)) : new Set(bigrams(t)),
  );
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < grams.length; i++) {
    for (let j = i + 1; j < grams.length; j++) {
      total += jaccard(grams[i], grams[j]);
      pairs++;
    }
  }
  return pairs === 0 ? 1 : total / pairs;
}

export interface DivergenceVerdict {
  similarity: number;
  similarityBigrams: number;
  flag: "diverging" | "borderline" | "too-similar";
}

const WORD_TOO_SIMILAR = 0.8;
const WORD_BORDERLINE = 0.65;

export function classifyDivergence(texts: string[]): DivergenceVerdict {
  const cleaned = texts.map(stripBoilerplate);
  const sim = meanPairwiseSimilarity(cleaned, "words");
  const simB = meanPairwiseSimilarity(cleaned, "bigrams");
  const flag: DivergenceVerdict["flag"] =
    sim >= WORD_TOO_SIMILAR
      ? "too-similar"
      : sim >= WORD_BORDERLINE
        ? "borderline"
        : "diverging";
  return {
    similarity: round(sim),
    similarityBigrams: round(simB),
    flag,
  };
}

// Bigrams that appear in N or more explanations across the whole run.
// Useful for spotting "earthy and pine" / "calm head" style recycling.
export function repeatedBigrams(
  allExplanations: string[],
  minOccurrences = 4,
): Array<{ phrase: string; count: number }> {
  const counts = new Map<string, number>();
  for (const text of allExplanations) {
    const seen = new Set<string>();
    for (const bg of bigrams(stripBoilerplate(text))) {
      if (seen.has(bg)) continue;
      seen.add(bg);
      counts.set(bg, (counts.get(bg) ?? 0) + 1);
    }
  }
  const stop = new Set([
    "of the",
    "in the",
    "to the",
    "on the",
    "and the",
    "for the",
    "with the",
    "is the",
    "as the",
    "at the",
    "from the",
    "this is",
    "that is",
    "you re",
    "it is",
  ]);
  return [...counts.entries()]
    .filter(([phrase, count]) => count >= minOccurrences && !stop.has(phrase))
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count);
}

function round(n: number, places = 3): number {
  const m = 10 ** places;
  return Math.round(n * m) / m;
}
