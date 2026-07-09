// Multi-scenario Signature vs Explorer, with a plausibility read per case.
// Prisma-free — runs with `npx tsx`.
import { scoreStrain } from "../src/lib/taste-engine";
import { scoreBlendTarget, type BlendMember } from "../src/lib/blend-target";
import { STRAINS, findStrain } from "../src/lib/strain-data";
import { PRIMARY_AROMA_TOKENS } from "../src/lib/profile-target";
import type { TasteProfileInput } from "../src/lib/types";

// Broad measuring groups (same idea as blend-target's SENSORY_GROUPS) — for
// READING a family's prominence in a strain, not for matching.
const GROUP: Record<string, string[]> = {
  gas: ["gassy", "diesel"],
  earthfunk: ["earthy", "skunky", "cheese", "woody"],
  citrus: ["citrus"],
  sweet: ["sweet", "creamy", "vanilla", "candy", "dessert", "fruity", "berry", "tropical", "grape"],
  fruit: ["fruity", "berry", "tropical", "grape"],
  pineherb: ["pine", "herbal", "spicy", "floral"],
};

function profile(over: Partial<TasteProfileInput>): TasteProfileInput {
  return {
    favoriteStrains: [], dislikedStrains: [], likedTraits: [], dislikedTraits: [],
    preferredAromas: [], preferredFlavors: [], preferredEffects: [],
    texturePreferences: [], qualityPriorities: [], ...over,
  };
}

// Build a single-family taste profile from a primaryAroma key.
function fam(key: keyof typeof PRIMARY_AROMA_TOKENS): TasteProfileInput {
  const toks = PRIMARY_AROMA_TOKENS[key];
  return profile({ primaryAroma: key, preferredAromas: toks, preferredFlavors: toks });
}

// Tier of a family's character in a strain: 3=dominant 2=present 1=trace 0=none.
function tier(name: string, key: string): number {
  const s = findStrain(name);
  if (!s) return 0;
  const toks = GROUP[key] ?? [];
  const prim = new Set([...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])]);
  const pres = new Set([...(s.aromas ?? []), ...(s.flavors ?? [])]);
  const tr = new Set([...(s.traceAromas ?? []), ...(s.traceFlavors ?? [])]);
  if (toks.some((t) => prim.has(t))) return 3;
  if (toks.some((t) => pres.has(t))) return 2;
  if (toks.some((t) => tr.has(t))) return 1;
  return 0;
}
const TIER = ["нет", "лёгк", "заметн", "ДОМИН"];

type Scenario = {
  title: string;
  dom: keyof typeof PRIMARY_AROMA_TOKENS;
  minor: keyof typeof PRIMARY_AROMA_TOKENS;
  domShare: number;
};

const SCENARIOS: Scenario[] = [
  { title: "Десерт с лёгкой цитрусовой искрой (sweet 70 / citrus 30)", dom: "sweet", minor: "citrus", domShare: 0.7 },
  { title: "Фруктовый с лёгким газом (fruit 75 / gas 25)", dom: "fruit", minor: "gas", domShare: 0.75 },
  { title: "Земля-фанк с лёгкой сладостью (earthfunk 70 / sweet 30)", dom: "earthfunk", minor: "sweet", domShare: 0.7 },
];

const names = STRAINS.map((s) => s.name);

for (const sc of SCENARIOS) {
  const P = { dom: fam(sc.dom), minor: fam(sc.minor) };
  const members: BlendMember[] = [
    { profile: P.dom, share: sc.domShare },
    { profile: P.minor, share: 1 - sc.domShare },
  ];

  const signature = names
    .map((n) => ({ n, s: scoreBlendTarget(n, members) }))
    .sort((a, b) => b.s - a.s);
  const explorer = names
    .map((n) => ({ n, s: Math.max(scoreStrain(n, P.dom).matchScore, scoreStrain(n, P.minor).matchScore) }))
    .sort((a, b) => b.s - a.s);

  console.log(`\n\n█ ${sc.title}`);
  console.log(`   dom=${sc.dom}  minor=${sc.minor}  (хочу: ${sc.dom} сильно, ${sc.minor} лёгкой нотой)`);

  console.log("\n  SIGNATURE топ-8            балл | dom / minor");
  console.log("  " + "".padEnd(52, "─"));
  signature.slice(0, 8).forEach((r, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. ${r.n.padEnd(20)} ${r.s.toFixed(0).padStart(3)} | ${TIER[tier(r.n, sc.dom)].padEnd(6)} / ${TIER[tier(r.n, sc.minor)]}`);
  });

  console.log("\n  EXPLORER топ-8 (для контраста)");
  console.log("  " + "".padEnd(52, "─"));
  explorer.slice(0, 8).forEach((r, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. ${r.n.padEnd(20)} ${r.s.toFixed(0).padStart(3)} | ${TIER[tier(r.n, sc.dom)].padEnd(6)} / ${TIER[tier(r.n, sc.minor)]}`);
  });

  // Plausibility read: of Signature's top-20, how many hold the dominant AND
  // keep the minor light (not absent, not overpowering)?
  const top = signature.slice(0, 20).map((r) => r.n);
  const domHeld = top.filter((n) => tier(n, sc.dom) >= 2).length;
  const minorLight = top.filter((n) => { const t = tier(n, sc.minor); return t >= 1 && t <= 2; }).length;
  const minorAbsent = top.filter((n) => tier(n, sc.minor) === 0).length;
  const minorDom = top.filter((n) => tier(n, sc.minor) === 3).length;
  // Where do minor-DOMINANT (overshoot) strains land in Signature vs Explorer?
  const overshoot = names.filter((n) => tier(n, sc.minor) === 3 && tier(n, sc.dom) === 0);
  const sRank = new Map(signature.map((r, i) => [r.n, i + 1]));
  const eRank = new Map(explorer.map((r, i) => [r.n, i + 1]));
  const medS = median(overshoot.map((n) => sRank.get(n)!));
  const medE = median(overshoot.map((n) => eRank.get(n)!));

  console.log("\n  ПРАВДОПОДОБНОСТЬ (по топ-20 Signature):");
  console.log(`    держат доминанту (${sc.dom} заметно+): ${domHeld}/20`);
  console.log(`    minor лёгкой/заметной нотой:        ${minorLight}/20`);
  console.log(`    minor отсутствует совсем:           ${minorAbsent}/20`);
  console.log(`    minor ПЕРЕбивает (overshoot):        ${minorDom}/20`);
  console.log(`    «приторный minor» (${sc.minor}-доминант без ${sc.dom}): медиана места Signature #${medS} vs Explorer #${medE}  (из ${names.length})`);
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}
