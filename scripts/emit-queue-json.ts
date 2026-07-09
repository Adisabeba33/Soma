// Emit the enrichment queue as JSON (name + base tags) for the workflow args.
import { scoreStrain } from "../src/lib/taste-engine";
import { scoreBlendTarget, type BlendMember } from "../src/lib/blend-target";
import { STRAINS, findStrain } from "../src/lib/strain-data";
import { PRIMARY_AROMA_TOKENS } from "../src/lib/profile-target";
import type { TasteProfileInput } from "../src/lib/types";

function profile(over: Partial<TasteProfileInput>): TasteProfileInput {
  return { favoriteStrains: [], dislikedStrains: [], likedTraits: [], dislikedTraits: [],
    preferredAromas: [], preferredFlavors: [], preferredEffects: [],
    texturePreferences: [], qualityPriorities: [], ...over };
}
function fam(key: keyof typeof PRIMARY_AROMA_TOKENS): TasteProfileInput {
  const t = PRIMARY_AROMA_TOKENS[key];
  return profile({ primaryAroma: key, preferredAromas: t, preferredFlavors: t });
}
const FAMILIES = Object.keys(PRIMARY_AROMA_TOKENS) as (keyof typeof PRIMARY_AROMA_TOKENS)[];
const names = STRAINS.map((s) => s.name);
const runs: { n: string; score: number }[][] = [];
for (const f of FAMILIES) runs.push(names.map((n) => ({ n, score: scoreStrain(n, fam(f)).matchScore })).sort((a, b) => b.score - a.score));
const BLENDS: [any, any][] = [["gas","sweet"],["sweet","citrus"],["earthfunk","sweet"],["fruit","gas"],["citrus","sweet"]];
for (const [d, m] of BLENDS) {
  const members: BlendMember[] = [{ profile: fam(d), share: 0.7 }, { profile: fam(m), share: 0.3 }];
  runs.push(names.map((n) => ({ n, score: scoreBlendTarget(n, members) })).sort((a, b) => b.score - a.score));
}
const bestRank = new Map<string, number>();
for (const r of runs) r.forEach((row, i) => { const c = bestRank.get(row.n) ?? Infinity; if (i + 1 < c) bestRank.set(row.n, i + 1); });

const queue = names
  .map((n) => { const s = findStrain(n)!; return { n, s, vis: bestRank.get(n) ?? Infinity }; })
  .filter((r) => (r.s.primaryAromas?.length ?? 0) > 0 && ((r.s.traceAromas?.length ?? 0) + (r.s.traceFlavors?.length ?? 0)) === 0 && r.vis <= 60)
  .sort((a, b) => a.vis - b.vis)
  .map((r) => ({
    name: r.s.name,
    type: r.s.type,
    primaryAromas: r.s.primaryAromas ?? [],
    primaryFlavors: r.s.primaryFlavors ?? [],
    aromas: r.s.aromas ?? [],
    flavors: r.s.flavors ?? [],
  }));

console.log(JSON.stringify(queue));
