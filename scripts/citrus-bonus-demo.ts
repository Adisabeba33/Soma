// Bare-numbers demo: Lemon Thai vs Genius for the user's profile (loud
// note = citrus). Shows the aroma sub-score (setScore) + the +10 bonus,
// NOW (binary) vs AFTER (tier-aware), and the effect on the final score.
//
// Run: npx tsx scripts/citrus-bonus-demo.ts

import { analyze, KNOWN_STRAIN_NAMES } from "../src/lib/taste-engine";
import { STRAINS } from "../src/lib/strain-data";

const byName = new Map(STRAINS.map((s) => [s.name, s]));
const PREFERRED = ["herbal", "citrus", "sweet", "tropical", "floral"];
const LOUD = "citrus";
const W_AROMA_TRUST = 0.17;

// Faithful copy of setScore's aroma math (primary 1.5 / present 1.0 / trace 0.33).
function aromaSub(name: string) {
  const s = byName.get(name)!;
  const tagSet = new Set(s.aromas);
  const prim = new Set(s.primaryAromas ?? []);
  const trace = new Set(s.traceAromas ?? []);
  const matched = PREFERRED.filter((p) => tagSet.has(p));
  const traced = PREFERRED.filter((p) => !tagSet.has(p) && trace.has(p));
  const missed = PREFERRED.filter((p) => !tagSet.has(p) && !trace.has(p));
  const weights = matched.map((m) => (prim.has(m) ? 1.5 : 1));
  const matchedWeight = weights.reduce((a, b) => a + b, 0) + traced.length * 0.33;
  const missingPortion = missed.length + traced.length * (1 - 0.33);
  const coverage = matchedWeight / (matchedWeight + missingPortion);
  const score = Math.round(26 + coverage * 74);
  return { score, matched, weights, missed };
}

function citrusTier(name: string): "dominant" | "present" | "trace" | "absent" {
  const s = byName.get(name)!;
  if (s.primaryAromas?.includes(LOUD)) return "dominant";
  if (s.traceAromas?.includes(LOUD)) return "trace";
  if (s.aromas.includes(LOUD)) return "present";
  return "absent";
}

const NEW_BONUS = { dominant: 10, present: 4, trace: 1, absent: 0 } as const;

const user = {
  favoriteStrains: ["Super Lemon Haze", "Jack Herer", "Durban Poison", "Green Crack", "Tangie"],
  dislikedStrains: [], likedTraits: ["loud-smell", "smooth", "frosty", "well-cured", "terpy"],
  dislikedTraits: ["dry-flower", "weak-smell", "harsh", "bland-taste", "seedy"],
  preferredAromas: PREFERRED, preferredFlavors: ["citrus", "sweet", "tropical", "herbal", "floral"],
  preferredEffects: ["euphoric", "happy", "uplifted", "focused", "creative", "energetic"],
  dislikedEffects: ["sleepy", "body-heavy", "couch-lock"],
  texturePreferences: ["frosty", "well-cured"], qualityPriorities: [],
  primaryAroma: "citrus", primaryEffect: "happy", useTime: "daytime",
};

const { recommendations } = analyze(KNOWN_STRAIN_NAMES, user as never);
const find = (n: string) => recommendations.find((r) => r.strainName === n)!;

for (const name of ["Lemon Thai", "Genius"]) {
  const s = byName.get(name)!;
  const a = aromaSub(name);
  const tier = citrusTier(name);
  const oldBonus = s.aromas.includes(LOUD) ? 10 : 0; // binary, today
  const newBonus = NEW_BONUS[tier];
  const m = find(name);

  console.log(`\n=== ${name} ===`);
  console.log(`  aromas: ${JSON.stringify(s.aromas)}  primaryAromas: ${JSON.stringify(s.primaryAromas)}`);
  console.log(`  citrus tier for you: ${tier.toUpperCase()}`);
  console.log(`  aroma sub-score from setScore (citrus weighted ${a.weights[a.matched.indexOf("citrus")] ?? "-"}×): ${a.score}`);
  console.log(`  NOW   bonus = +${oldBonus} (binary)      → aroma sub = ${Math.min(100, a.score + oldBonus)}`);
  console.log(`  AFTER bonus = +${newBonus} (tier-aware)  → aroma sub = ${Math.min(100, a.score + newBonus)}`);
  const deltaFinal = (newBonus - oldBonus) * W_AROMA_TRUST;
  console.log(`  Δ on FINAL score ≈ (${newBonus} − ${oldBonus}) × ${W_AROMA_TRUST} = ${deltaFinal.toFixed(2)}`);
  console.log(`  engine NOW: matchScore ${m.matchScore.toFixed(2)}, aromaMatch ${m.aromaMatch}`);
  console.log(`  projected AFTER: matchScore ≈ ${(m.matchScore + deltaFinal).toFixed(2)}`);
}
