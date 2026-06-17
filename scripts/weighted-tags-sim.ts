// SIMULATION (illustrative, not wired into the engine): what weighted-tag
// matching would do to the user's daytime sativa-citrus profile.
//
// Mechanic shown: today the primary-aroma bonus is BINARY on presence — a
// strain gets the full +10 for "citrus" whether citrus is its dominant note
// or a background trace. Weighted tags scale that bonus by the strain's TIER
// for the token: full when the token is in the strain's primaryAromas
// (dominant), reduced when it's only present, tiny when trace, zero absent.
// That alignment ("I want citrus LOUD" ↔ "this strain IS citrus-forward")
// separates the currently-flat top cluster.
//
// Run: npx tsx scripts/weighted-tags-sim.ts

import { analyze, KNOWN_STRAIN_NAMES } from "../src/lib/taste-engine";
import { STRAINS } from "../src/lib/strain-data";

const byName = new Map(STRAINS.map((s) => [s.name, s]));

const user = {
  favoriteStrains: ["Super Lemon Haze", "Jack Herer", "Durban Poison", "Green Crack", "Tangie"],
  dislikedStrains: [], likedTraits: ["loud-smell", "smooth", "frosty", "well-cured", "terpy"],
  dislikedTraits: ["dry-flower", "weak-smell", "harsh", "bland-taste", "seedy"],
  preferredAromas: ["herbal", "citrus", "sweet", "tropical", "floral"],
  preferredFlavors: ["citrus", "sweet", "tropical", "herbal", "floral"],
  preferredEffects: ["euphoric", "happy", "uplifted", "focused", "creative", "energetic"],
  dislikedEffects: ["sleepy", "body-heavy", "couch-lock"],
  texturePreferences: ["frosty", "well-cured"], qualityPriorities: [],
  primaryAroma: "citrus", primaryEffect: "happy", useTime: "daytime",
};

// The user's LOUD note (their "one jar" forced choice): citrus = dominant desire.
const DOMINANT_DESIRE = "citrus";
const W_AROMA_TRUST = 0.17; // aroma weight in trust mode (from taste-engine W)
const OLD_BONUS = 10;       // PRIMARY_AROMA_BONUS, fired on mere presence today
const NEW_BONUS = { dominant: 10, present: 4, trace: 1, absent: 0 };

function tierOf(strainName: string, token: string): keyof typeof NEW_BONUS {
  const s = byName.get(strainName);
  if (!s) return "absent";
  if (s.primaryAromas?.includes(token)) return "dominant";
  if (s.traceAromas?.includes(token)) return "trace";
  if (s.aromas.includes(token)) return "present";
  return "absent";
}

const { recommendations } = analyze(KNOWN_STRAIN_NAMES, user as never);
const nonAnchor = recommendations.filter((r) => r.matchScore < 94);

// Coverage: how much of the catalog already has primaryAromas curated.
const withPrimary = STRAINS.filter((s) => s.primaryAromas?.length).length;
console.log(
  `primaryAromas coverage: ${withPrimary}/${STRAINS.length} strains (${((withPrimary / STRAINS.length) * 100).toFixed(0)}%) already curated\n`,
);

type Row = { name: string; before: number; tier: string; after: number };
const rows: Row[] = nonAnchor.slice(0, 20).map((r) => {
  const tier = tierOf(r.strainName, DOMINANT_DESIRE);
  const oldFired = tier === "dominant" || tier === "present" || tier === "trace";
  const deltaBonus = NEW_BONUS[tier] - (oldFired ? OLD_BONUS : 0);
  const after = r.matchScore + deltaBonus * W_AROMA_TRUST;
  return { name: r.strainName, before: r.matchScore, tier, after };
});

const afterSorted = [...rows].sort((a, b) => b.after - a.after);

console.log("BEFORE (today)              →  AFTER (weighted, citrus-aligned)");
console.log("rank  score  strain                citrus     score  Δ");
afterSorted.forEach((row, i) => {
  const beforeRank = rows.findIndex((x) => x.name === row.name) + 1;
  const move = beforeRank - (i + 1);
  const arrow = move > 0 ? `↑${move}` : move < 0 ? `↓${-move}` : " ·";
  console.log(
    `${String(i + 1).padStart(2)}.  ${row.before.toFixed(2).padStart(6)}  ${row.name.padEnd(20)} ${row.tier.padEnd(9)} ${row.after.toFixed(2).padStart(6)}  ${arrow}`,
  );
});
