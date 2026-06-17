// Diagnostic: score distribution across the whole catalog for a given profile.
// Answers "is a dense high cluster natural or a scoring artifact?" by showing
// how many strains land in each band, and whether trust mode is engaged.
//
// Run: npx tsx scripts/score-distribution.ts

import { analyze, KNOWN_STRAIN_NAMES } from "../src/lib/taste-engine";
import { hasClusteredFavorites } from "../src/lib/behavioral-family";
import type { TasteProfileInput } from "../src/lib/types";

function emptyProfile(): TasteProfileInput {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    dislikedEffects: [],
    dislikedAromas: [],
    texturePreferences: [],
    qualityPriorities: [],
  };
}

function report(label: string, profile: TasteProfileInput) {
  const { recommendations } = analyze(KNOWN_STRAIN_NAMES, profile);
  const trust = hasClusteredFavorites(profile);
  const total = recommendations.length;

  // Anchors (saved favourites) float to 94-96 by design; separate them so the
  // non-anchor distribution is what we actually judge.
  const anchors = recommendations.filter((r) => r.matchScore >= 94);
  const nonAnchor = recommendations.filter((r) => r.matchScore < 94);

  const bands: [string, (n: number) => boolean][] = [
    ["89–92 elite", (n) => n >= 89 && n < 94],
    ["80–88 Best", (n) => n >= 80 && n < 89],
    ["66–79 Closest", (n) => n >= 66 && n < 80],
    ["50–65 Worth", (n) => n >= 50 && n < 66],
    ["36–49 Risky", (n) => n >= 36 && n < 50],
    ["4–35 Avoid", (n) => n >= 4 && n < 36],
  ];

  console.log(`\n=== ${label} ===`);
  console.log(`trustMode: ${trust} | catalog: ${total} | anchors(94-96): ${anchors.length}`);
  const best80 = nonAnchor.filter((r) => r.matchScore >= 80).length;
  console.log(
    `NON-ANCHOR ≥80 ("Best Match" cluster): ${best80} / ${nonAnchor.length}  (${((best80 / nonAnchor.length) * 100).toFixed(1)}%)`,
  );
  for (const [name, test] of bands) {
    const n = nonAnchor.filter((r) => test(r.matchScore)).length;
    const bar = "█".repeat(Math.round((n / nonAnchor.length) * 50));
    console.log(`  ${name.padEnd(16)} ${String(n).padStart(3)}  ${bar}`);
  }
  console.log("  top 12 non-anchor:");
  for (const r of nonAnchor.slice(0, 12)) {
    console.log(
      `    ${r.matchScore.toFixed(2).padStart(6)}  ${r.category.padEnd(20)} ${r.strainName}`,
    );
  }
}

// --- Profile A: clustered favourites (gas/nighttime) — trust mode ON ---
const clustered = emptyProfile();
clustered.favoriteStrains = ["GG4", "OG Kush", "Sour Diesel"];

// --- Profile B: broad questionnaire-only, common tokens, no favourites ---
const broad = emptyProfile();
broad.preferredAromas = ["sweet", "fruity", "citrus"];
broad.preferredFlavors = ["sweet", "fruity"];
broad.preferredEffects = ["euphoric", "happy", "relaxed", "uplifted"];

// --- Profile C: single favourite, no cluster — trust mode OFF ---
const single = emptyProfile();
single.favoriteStrains = ["GG4"];

// --- Profile D: the user's real profile (daytime sativa-citrus) ---
const user: TasteProfileInput = {
  favoriteStrains: [
    "Super Lemon Haze",
    "Jack Herer",
    "Durban Poison",
    "Green Crack",
    "Tangie",
  ],
  dislikedStrains: [],
  likedTraits: ["loud-smell", "smooth", "frosty", "well-cured", "terpy"],
  dislikedTraits: ["dry-flower", "weak-smell", "harsh", "bland-taste", "seedy"],
  preferredAromas: ["herbal", "citrus", "sweet", "tropical", "floral"],
  preferredFlavors: ["citrus", "sweet", "tropical", "herbal", "floral"],
  preferredEffects: ["euphoric", "happy", "uplifted", "focused", "creative", "energetic"],
  dislikedEffects: ["sleepy", "body-heavy", "couch-lock"],
  texturePreferences: ["frosty", "well-cured"],
  qualityPriorities: [],
  primaryAroma: "citrus",
  primaryEffect: "happy",
  useTime: "daytime",
};

report("A: clustered favourites (GG4 / OG Kush / Sour Diesel)", clustered);
report("B: broad questionnaire (sweet/fruity + happy/euphoric)", broad);
report("C: single favourite (GG4)", single);
report("D: YOUR PROFILE (Super Lemon Haze/Jack Herer/Durban/Green Crack/Tangie)", user);
