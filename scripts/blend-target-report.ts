// Calibration report for the weighted-blend target scorer (blend-target.ts).
//
// Runs several recipes over the FULL catalog and prints, per recipe, the
// top strains plus the group medians the constants are tuned against:
//
//   gas+sweet 80/20 — "gas with a light sweet touch" must beat plain gas,
//                     and cloying (sweet-dominant) must sink below plain gas.
//   gas+sweet 50/50 — both characters wanted strongly; one-sided strains
//                     drop, dual-character strains rise. Order-independent.
//   citrus+dessert 70/30 — same shape on a different axis pair.
//   3-way 50/30/20  — shares keep meaning with three sides.
//
// Usage: npx tsx scripts/blend-target-report.ts

import { scoreBlendTarget, type BlendMember } from "../src/lib/blend-target";
import { STRAINS } from "../src/lib/strain-data";
import type { TasteProfileInput } from "../src/lib/types";

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

const GAS = profile({
  primaryAroma: "gas",
  preferredAromas: ["gassy", "diesel"],
  preferredFlavors: ["gassy"],
  preferredEffects: ["relaxed", "body-heavy"],
});
const SWEET = profile({
  primaryAroma: "sweet",
  preferredAromas: ["sweet", "creamy"],
  preferredFlavors: ["sweet", "vanilla"],
  preferredEffects: ["euphoric", "happy"],
});
const CITRUS = profile({
  primaryAroma: "citrus",
  preferredAromas: ["citrus"],
  preferredFlavors: ["citrus"],
  preferredEffects: ["uplifted", "energetic"],
});
const DESSERT = profile({
  primaryAroma: "sweet",
  preferredAromas: ["creamy", "vanilla"],
  preferredFlavors: ["creamy", "sweet"],
  preferredEffects: ["relaxed", "euphoric"],
});

// Tag-tier classification for the gas+sweet scenario groups (measured the
// same way blend-target measures prominence, so groups match the model).
const SWEET_TOKENS = new Set(["sweet", "creamy", "vanilla", "candy", "dessert", "fruity", "berry", "tropical", "grape"]);
const GAS_TOKENS = new Set(["gassy", "diesel"]);

function tier(s: (typeof STRAINS)[number], tokens: Set<string>): number {
  const prim = [...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])];
  const pres = [...s.aromas, ...s.flavors];
  const tr = [...(s.traceAromas ?? []), ...(s.traceFlavors ?? [])];
  if (prim.some((t) => tokens.has(t))) return 1;
  if (pres.some((t) => tokens.has(t))) return 0.66;
  if (tr.some((t) => tokens.has(t))) return 0.33;
  return 0;
}

function median(xs: number[]): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function report(title: string, members: BlendMember[]) {
  const scored = STRAINS.map((s) => ({
    name: s.name,
    score: scoreBlendTarget(s.name, members),
    gasT: tier(s, GAS_TOKENS),
    sweetT: tier(s, SWEET_TOKENS),
  })).sort((a, b) => b.score - a.score);

  console.log(`\n=== ${title} ===`);
  for (const r of scored.slice(0, 10)) {
    console.log(
      `  ${r.score.toFixed(1).padStart(5)}  ${r.name}  [gas ${r.gasT}, sweet ${r.sweetT}]`,
    );
  }
  return scored;
}

// ── gas 80 / sweet 20 ────────────────────────────────────────────────────
const g80s20 = report("gas 80% + sweet 20%", [
  { profile: GAS, share: 0.8 },
  { profile: SWEET, share: 0.2 },
]);

// Group medians for the calibration invariants.
const groups = {
  "gas-primary, NO sweet anywhere": g80s20.filter((r) => r.gasT === 1 && r.sweetT === 0),
  "gas-primary + light sweet (trace/present)": g80s20.filter(
    (r) => r.gasT === 1 && (r.sweetT === 0.33 || r.sweetT === 0.66),
  ),
  "sweet-PRIMARY (cloying for this dial)": g80s20.filter((r) => r.sweetT === 1 && r.gasT < 1),
};
console.log("\n  Group medians (gas 80/sweet 20):");
for (const [label, rows] of Object.entries(groups)) {
  console.log(
    `    ${median(rows.map((r) => r.score)).toFixed(1).padStart(5)}  ${label}  (n=${rows.length})`,
  );
}

// ── gas 50 / sweet 50 (+ symmetry check) ────────────────────────────────
const ab = report("gas 50% + sweet 50%", [
  { profile: GAS, share: 0.5 },
  { profile: SWEET, share: 0.5 },
]);
const ba = STRAINS.map((s) => ({
  name: s.name,
  score: scoreBlendTarget(s.name, [
    { profile: SWEET, share: 0.5 },
    { profile: GAS, share: 0.5 },
  ]),
}));
const baMap = new Map(ba.map((r) => [r.name, r.score]));
const asym = ab.filter((r) => Math.abs(r.score - (baMap.get(r.name) ?? NaN)) > 1e-9);
console.log(`\n  Symmetry: ${asym.length === 0 ? "OK — order-independent" : `BROKEN for ${asym.length} strains`}`);

// ── citrus 70 / dessert 30 ──────────────────────────────────────────────
report("citrus 70% + dessert 30%", [
  { profile: CITRUS, share: 0.7 },
  { profile: DESSERT, share: 0.3 },
]);

// ── 3-way ────────────────────────────────────────────────────────────────
report("gas 50% + sweet 30% + citrus 20%", [
  { profile: GAS, share: 0.5 },
  { profile: SWEET, share: 0.3 },
  { profile: CITRUS, share: 0.2 },
]);

// ── unknown-strain sanity ────────────────────────────────────────────────
const unknowns = ["Diesel Dream Haze", "Sugar Nebula", "Mystery Cut #7"];
console.log("\n=== Unknown strains (inferred from name), gas 80/sweet 20 ===");
for (const u of unknowns) {
  const sc = scoreBlendTarget(u, [
    { profile: GAS, share: 0.8 },
    { profile: SWEET, share: 0.2 },
  ]);
  console.log(`  ${sc.toFixed(1).padStart(5)}  ${u}`);
}
