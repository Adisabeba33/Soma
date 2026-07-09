// Head-to-head: Explorer (best-of / MAX) vs Signature (weighted-target).
// Prisma-free — imports only the pure engines, so it runs with `npx tsx`.
import { scoreStrain } from "../src/lib/taste-engine";
import { scoreBlendTarget, type BlendMember } from "../src/lib/blend-target";
import { STRAINS, findStrain } from "../src/lib/strain-data";
import type { TasteProfileInput } from "../src/lib/types";

// Minimal profile builder — only the fields the sensory engines read.
function profile(over: Partial<TasteProfileInput>): TasteProfileInput {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    texturePreferences: [],
    qualityPriorities: [],
    ...over,
  };
}

// Profile A — the GAS lover (loud note = gas).
const GAS = profile({
  primaryAroma: "gas",
  preferredAromas: ["gassy", "diesel"],
  preferredFlavors: ["gassy", "diesel"],
});

// Profile B — the SWEET lover (loud note = sweet).
const SWEET = profile({
  primaryAroma: "sweet",
  preferredAromas: ["sweet"],
  preferredFlavors: ["sweet", "creamy"],
});

const names = STRAINS.map((s) => s.name);

// --- Explorer: best-of (MAX) across the two worlds ------------------------
const explorer = names
  .map((n) => ({
    name: n,
    score: Math.max(
      scoreStrain(n, GAS).matchScore,
      scoreStrain(n, SWEET).matchScore,
    ),
  }))
  .sort((a, b) => b.score - a.score);

// --- Signature: weighted target, gas 75% / sweet 25% (a LIGHT sweet note) --
const members: BlendMember[] = [
  { profile: GAS, share: 0.75 },
  { profile: SWEET, share: 0.25 },
];
const signature = names
  .map((n) => ({ name: n, score: scoreBlendTarget(n, members) }))
  .sort((a, b) => b.score - a.score);

// Tier of a strain's SWEET character, for reading the tables.
function sweetTier(name: string): string {
  const s = findStrain(name);
  if (!s) return "?";
  const sweetToks = ["sweet", "creamy", "vanilla", "candy", "dessert", "fruity", "berry", "tropical", "grape"];
  const prim = new Set([...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])]);
  const pres = new Set([...(s.aromas ?? []), ...(s.flavors ?? [])]);
  const tr = new Set([...(s.traceAromas ?? []), ...(s.traceFlavors ?? [])]);
  if (sweetToks.some((t) => prim.has(t))) return "СЛАДКИЙ-доминант";
  if (sweetToks.some((t) => pres.has(t))) return "заметно-сладкий";
  if (sweetToks.some((t) => tr.has(t))) return "лёгкая сладость";
  return "без сладости";
}
function gasHit(name: string): string {
  const s = findStrain(name);
  if (!s) return "?";
  const g = ["gassy", "diesel"];
  const prim = new Set([...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])]);
  const pres = new Set([...(s.aromas ?? []), ...(s.flavors ?? [])]);
  if (g.some((t) => prim.has(t))) return "газ-доминант";
  if (g.some((t) => pres.has(t))) return "газ есть";
  return "нет газа";
}

function table(title: string, rows: { name: string; score: number }[]) {
  console.log(`\n${title}`);
  console.log("".padEnd(64, "─"));
  rows.slice(0, 12).forEach((r, i) => {
    console.log(
      `${String(i + 1).padStart(2)}. ${r.name.padEnd(22)} ${String(r.score).padStart(3)}  | ${gasHit(r.name).padEnd(12)} | ${sweetTier(r.name)}`,
    );
  });
}

console.log("СЦЕНАРИЙ: «газ + лёгкая сладость» (gas 75% / sweet 25%)");
table("EXPLORER — лучшее из моих вкусов (best-of / MAX)", explorer);
table("SIGNATURE — собери по пропорции, без перебора", signature);

// Where do they disagree? Rank each strain in both lists.
const rankOf = (list: { name: string }[]) => {
  const m = new Map<string, number>();
  list.forEach((r, i) => m.set(r.name, i + 1));
  return m;
};
const eRank = rankOf(explorer);
const sRank = rankOf(signature);

console.log("\nКЛЮЧЕВЫЕ РАСХОЖДЕНИЯ (сорт: место в Explorer → место в Signature)");
console.log("".padEnd(64, "─"));
const moved = names
  .map((n) => ({ name: n, e: eRank.get(n)!, s: sRank.get(n)!, d: sRank.get(n)! - eRank.get(n)! }))
  .sort((a, b) => b.d - a.d);

console.log("Сильнее всего ПРОСЕЛИ в Signature (Explorer их любит, Signature — нет):");
moved.slice(0, 6).forEach((m) => {
  console.log(`   ${m.name.padEnd(22)} Explorer #${m.e} → Signature #${m.s}   [${sweetTier(m.name)}]`);
});
console.log("Сильнее всего ПОДНЯЛИСЬ в Signature (Signature их любит, Explorer — нет):");
moved.slice(-6).reverse().forEach((m) => {
  console.log(`   ${m.name.padEnd(22)} Explorer #${m.e} → Signature #${m.s}   [${gasHit(m.name)} / ${sweetTier(m.name)}]`);
});
