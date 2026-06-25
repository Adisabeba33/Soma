// Taste Blender direction report — a readable sanity check on REAL profiles,
// without tasting. Run:  npx tsx scripts/blend-report.ts
//
// It answers "is the blend pointing the right way for ME?":
//   - each profile's own favourites/aromas top its list,
//   - opposite profiles rank a strain oppositely (gas-lover vs gas-avoider),
//   - each profile's avoided category sits at the bottom,
//   - best-of vs bridge (universal picks), favourite-free discoveries.
//
// Edit the three profiles below to match the account you're checking.

import { analyze, KNOWN_STRAIN_NAMES } from "../src/lib/taste-engine";
import { analyzeMerged } from "../src/lib/merge-worlds";
import { findStrain } from "../src/lib/strain-data";

const base = {
  dislikedStrains: [] as string[],
  likedTraits: ["smooth", "loud-smell", "well-cured", "sticky", "terpy"],
  dislikedTraits: ["dry-flower", "weak-smell", "harsh", "bland-taste", "seedy"],
  texturePreferences: [] as string[],
  qualityPriorities: [] as string[],
  preferredFamilies: [] as string[],
  lookingFor: "new",
  isActive: false,
};

// ── EDIT THESE to the account you're testing ───────────────────────────────
const P1 = { ...base, id: "g", name: "Gas", isActive: true,
  favoriteStrains: ["GG4", "Gary Payton", "Paw Paw", "White Fire OG", "White Hot Guava", "Skunk #1"],
  preferredAromas: ["gassy", "diesel", "earthy", "skunky", "pine", "fruity"], preferredFlavors: ["gassy", "diesel", "earthy"],
  preferredEffects: ["relaxed", "calm", "happy", "giggly", "creative", "uplifted"], dislikedEffects: ["sleepy", "couch-lock"],
  dislikedAromas: ["mint", "spicy"], avoidedFamilies: ["mint"], primaryAroma: "gassy", primaryEffect: "calm", potencyPreference: "balanced" };
const P2 = { ...base, id: "k", name: "Funk",
  favoriteStrains: ["Skunk #1", "Sweet Skunk", "White Widow", "Acapulco Gold"], dislikedStrains: ["Blue Dream"],
  preferredAromas: ["skunky", "citrus", "pine", "earthy", "diesel", "sweet", "tropical", "fruity", "cheese"], preferredFlavors: ["citrus", "earthy", "cheese"],
  preferredEffects: ["relaxed", "calm", "euphoric", "happy", "uplifted", "giggly", "focused", "creative"], dislikedEffects: ["sleepy", "couch-lock"],
  dislikedAromas: ["mint"], avoidedFamilies: ["mint"], primaryAroma: "earthy", primaryEffect: "happy", potencyPreference: "balanced" };
const P3 = { ...base, id: "f", name: "Fruit",
  favoriteStrains: ["Paw Paw", "Grape Ape", "Biscotti", "White Hot Guava", "Zkittlez"],
  preferredAromas: ["tropical", "floral", "sweet", "fruity", "berry", "grape", "citrus", "earthy"], preferredFlavors: ["tropical", "sweet", "fruity", "berry", "grape"],
  preferredEffects: ["relaxed", "euphoric", "focused", "uplifted", "happy", "energetic", "creative"], dislikedEffects: ["couch-lock", "sleepy", "hungry"],
  dislikedAromas: ["diesel", "gassy"], avoidedFamilies: ["diesel"], primaryAroma: "fruity", primaryEffect: "energetic", potencyPreference: "strong" };
const PROFILES = [P1, P2, P3];
// ───────────────────────────────────────────────────────────────────────────

const r1 = (x: number) => x.toFixed(0).padStart(3);
const single = (p: typeof P1) =>
  new Map(analyze(KNOWN_STRAIN_NAMES, p as never).recommendations.map((r) => [r.strainName, r.matchScore]));
const maps = PROFILES.map(single);
const favs = new Set(PROFILES.flatMap((p) => p.favoriteStrains).map((f) => findStrain(f)?.name).filter(Boolean) as string[]);

console.log("\n■ FAVOURITE RESOLUTION (unresolved = engine guessed by keyword)");
for (const p of PROFILES) {
  const miss = p.favoriteStrains.filter((f) => !findStrain(f));
  console.log(`   ${p.name.padEnd(6)} ${miss.length ? "missing: " + miss.join(", ") : "all resolve ✓"}`);
}

console.log("\n■ EACH PROFILE — top 6 (should be its own favourites + matching aromas)");
PROFILES.forEach((p, i) => {
  const top = [...maps[i].entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([n, s]) => `${n}(${r1(s)})`);
  console.log(`   ${p.name.padEnd(6)} ${top.join(", ")}`);
});

console.log("\n■ CONTRAST TEST — same strain, scored in each profile (opposite tastes must differ)");
console.log(`   strain                ${PROFILES.map((p) => p.name.padEnd(5)).join(" ")}`);
for (const n of ["GG4", "Sour Diesel", "Chemdawg", "Zkittlez", "Runtz", "Pineapple Express", "Skunk #1"]) {
  console.log(`   ${n.padEnd(20)} ${maps.map((m) => r1(m.get(n) ?? 0).padStart(5)).join(" ")}`);
}

console.log("\n■ AVOID CHECK — each profile's bottom 4 (should be what it avoids)");
PROFILES.forEach((p, i) => {
  const bot = [...maps[i].entries()].sort((a, b) => a[1] - b[1]).slice(0, 4).map(([n, s]) => `${n}(${r1(s)})`);
  console.log(`   ${p.name.padEnd(6)} ${bot.join(", ")}`);
});

const bestof = analyzeMerged({ strains: KNOWN_STRAIN_NAMES, profiles: PROFILES as never, penalties: {}, feedback: [], balance: false });
const bridge = analyzeMerged({ strains: KNOWN_STRAIN_NAMES, profiles: PROFILES as never, penalties: {}, feedback: [], balance: true });
const noFav = (recs: typeof bestof.recommendations) => recs.filter((r) => !favs.has(r.strainName));

console.log("\n■ BLEND best-of — top discoveries per world (favourites hidden)");
for (const w of PROFILES.map((p) => p.name)) {
  const top = noFav(bestof.recommendations).filter((r) => r.world === w).slice(0, 4).map((r) => `${r.strainName}(${r.matchScore})`);
  console.log(`   ${w.padEnd(6)} ${top.join(", ")}`);
}
console.log("\n■ BRIDGE (works for ALL sides) — top 8 (favourites hidden)");
console.log("   " + noFav(bridge.recommendations).slice(0, 8).map((r) => `${r.strainName}(${r.matchScore})`).join(", "));
const strong = bridge.recommendations.filter((r) => r.matchScore >= 70).length;
console.log(`\n   strains good in ALL ${PROFILES.length} profiles (min>=70): ${strong}`);

// ── Tag sensitivity: how much do the broad preference tags actually move the
// result? "Tighten" a profile to its core (favourites + primary aroma/effect +
// the hard avoids), drop the broad aroma/flavour/effect lists, and see how the
// bridge count shifts. Big shift = your tags are doing real narrowing; tiny
// shift = those tags are noise you could trim.
type Prof = typeof P1;
const tighten = (p: Prof): Prof => ({
  ...p,
  preferredAromas: p.primaryAroma ? [p.primaryAroma] : [],
  preferredFlavors: [],
  preferredEffects: p.primaryEffect ? [p.primaryEffect] : [],
});
const bridges = (profs: Prof[]) =>
  analyzeMerged({ strains: KNOWN_STRAIN_NAMES, profiles: profs as never, penalties: {}, feedback: [], balance: true })
    .recommendations.filter((r) => r.matchScore >= 70).length;

console.log("\n■ TAG SENSITIVITY — bridges (min>=70) as profiles are tightened to their core");
const full = bridges(PROFILES);
console.log(`   full profiles (all tags):     ${full}`);
console.log(`   all tightened to core:        ${bridges(PROFILES.map(tighten))}`);
PROFILES.forEach((p, i) => {
  const variant = PROFILES.map((q, j) => (j === i ? tighten(q) : q));
  console.log(`   tighten only ${p.name.padEnd(6)}        ${bridges(variant)}  (vs ${full})`);
});
console.log("   big shift = those tags narrow the result; tiny shift = they're noise to trim");

