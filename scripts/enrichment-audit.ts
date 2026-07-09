// Enrichment audit: rank strains most likely to be UNDER-tagged on their
// secondary/trace notes, weighted by how visible they are (how high the
// engines surface them). Prisma-free — runs with `npx tsx`.
import { scoreStrain } from "../src/lib/taste-engine";
import { scoreBlendTarget, type BlendMember } from "../src/lib/blend-target";
import { STRAINS, findStrain } from "../src/lib/strain-data";
import { PRIMARY_AROMA_TOKENS } from "../src/lib/profile-target";
import type { TasteProfileInput } from "../src/lib/types";

function profile(over: Partial<TasteProfileInput>): TasteProfileInput {
  return {
    favoriteStrains: [], dislikedStrains: [], likedTraits: [], dislikedTraits: [],
    preferredAromas: [], preferredFlavors: [], preferredEffects: [],
    texturePreferences: [], qualityPriorities: [], ...over,
  };
}
function fam(key: keyof typeof PRIMARY_AROMA_TOKENS): TasteProfileInput {
  const t = PRIMARY_AROMA_TOKENS[key];
  return profile({ primaryAroma: key, preferredAromas: t, preferredFlavors: t });
}

const FAMILIES = Object.keys(PRIMARY_AROMA_TOKENS) as (keyof typeof PRIMARY_AROMA_TOKENS)[];
const names = STRAINS.map((s) => s.name);

// --- Visibility: best rank a strain reaches across all single-family runs +
// a few representative blends. Lower = more visible to users. ---
const runs: { n: string; score: number }[][] = [];
for (const f of FAMILIES) {
  const P = fam(f);
  runs.push(names.map((n) => ({ n, score: scoreStrain(n, P).matchScore })).sort((a, b) => b.score - a.score));
}
// A few blends (dom 70 / minor 30) so blend-visible strains count too.
const BLENDS: [keyof typeof PRIMARY_AROMA_TOKENS, keyof typeof PRIMARY_AROMA_TOKENS][] = [
  ["gas", "sweet"], ["sweet", "citrus"], ["earthfunk", "sweet"], ["fruit", "gas"], ["citrus", "sweet"],
];
for (const [d, m] of BLENDS) {
  const members: BlendMember[] = [{ profile: fam(d), share: 0.7 }, { profile: fam(m), share: 0.3 }];
  runs.push(names.map((n) => ({ n, score: scoreBlendTarget(n, members) })).sort((a, b) => b.score - a.score));
}
const bestRank = new Map<string, number>();
for (const r of runs) r.forEach((row, i) => {
  const cur = bestRank.get(row.n) ?? Infinity;
  if (i + 1 < cur) bestRank.set(row.n, i + 1);
});

// --- Thinness of a strain's secondary/trace layer ---
function audit(name: string) {
  const s = findStrain(name)!;
  const secondaryAromas = (s.aromas ?? []).filter((a) => !(s.primaryAromas ?? []).includes(a));
  const secondaryFlavors = (s.flavors ?? []).filter((f) => !(s.primaryFlavors ?? []).includes(f));
  const traceCount = (s.traceAromas?.length ?? 0) + (s.traceFlavors?.length ?? 0);
  const secondaryCount = secondaryAromas.length + secondaryFlavors.length;
  const hasPrimary = (s.primaryAromas?.length ?? 0) > 0;
  return { hasPrimary, secondaryCount, traceCount, secondaryAromas, secondaryFlavors };
}

let noTrace = 0, thinSecondary = 0;
for (const n of names) {
  const a = audit(n);
  if (a.traceCount === 0) noTrace++;
  if (a.secondaryCount <= 2) thinSecondary++;
}

console.log(`Каталог: ${names.length} сортов`);
console.log(`  без единого trace-тега:       ${noTrace}  (${Math.round(noTrace / names.length * 100)}%)`);
console.log(`  с «тонкой» вторичкой (≤2):     ${thinSecondary}  (${Math.round(thinSecondary / names.length * 100)}%)`);

// Priority = высокая видимость (маленький bestRank) + нет trace + характерная доминанта.
const queue = names
  .map((n) => ({ n, ...audit(n), vis: bestRank.get(n) ?? Infinity }))
  .filter((r) => r.hasPrimary && r.traceCount === 0 && r.vis <= 60)
  .sort((a, b) => a.vis - b.vis);

console.log(`\nОЧЕРЕДЬ НА ОБОГАЩЕНИЕ (видимые + без trace, top-60 хоть в одном прогоне): ${queue.length} шт.`);
console.log("".padEnd(72, "─"));
queue.forEach((r) => {
  console.log(`${String(r.vis).padStart(3)}\t${r.n}\t${r.secondaryAromas.concat(r.secondaryFlavors).join(",") || "-"}`);
});
