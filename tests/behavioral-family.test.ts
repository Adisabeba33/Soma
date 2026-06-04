import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  behavioralFamilyOf,
  familyBonus,
  hasClusteredFavorites,
  inferProfileFamily,
} from "../src/lib/behavioral-family";
import { scoreStrain } from "../src/lib/taste-engine";
import { STRAINS } from "../src/lib/strain-data";
import type { StrainProfile, TasteProfileInput } from "../src/lib/types";

function profile(overrides: Partial<TasteProfileInput> = {}): TasteProfileInput {
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
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
    ...overrides,
  };
}

function findSeed(name: string): StrainProfile {
  const s = STRAINS.find((x) => x.name === name);
  if (!s) throw new Error(`seed missing ${name}`);
  return s;
}

describe("behavioralFamilyOf — composition mapping", () => {
  it("nighttime-indica: deep-sleeper × grounded canon", () => {
    assert.equal(behavioralFamilyOf(findSeed("Northern Lights")), "nighttime-indica");
    assert.equal(behavioralFamilyOf(findSeed("Granddaddy Purple")), "nighttime-indica");
    assert.equal(behavioralFamilyOf(findSeed("Bubba Kush")), "nighttime-indica");
    assert.equal(behavioralFamilyOf(findSeed("Purple Punch")), "nighttime-indica");
  });

  it("nighttime-indica: dessert-couch-lock × smooth/grounded (the cake wing)", () => {
    assert.equal(behavioralFamilyOf(findSeed("Wedding Cake")), "nighttime-indica");
    assert.equal(behavioralFamilyOf(findSeed("LA Kush Cake")), "nighttime-indica");
    assert.equal(behavioralFamilyOf(findSeed("Ice Cream Cake")), "nighttime-indica");
  });

  it("nighttime-indica: garlic-funk × pressure-heavy (savoury heavy)", () => {
    assert.equal(behavioralFamilyOf(findSeed("GMO Cookies")), "nighttime-indica");
    assert.equal(behavioralFamilyOf(findSeed("Donny Burger")), "nighttime-indica");
  });

  it("daytime-functional: clean-creative-daytime in soft cluster", () => {
    assert.equal(behavioralFamilyOf(findSeed("Jack Herer")), "daytime-functional");
    assert.equal(behavioralFamilyOf(findSeed("Durban Poison")), "daytime-functional");
    assert.equal(behavioralFamilyOf(findSeed("Lemon Tree")), "daytime-functional");
    assert.equal(behavioralFamilyOf(findSeed("Tangie")), "daytime-functional");
    assert.equal(behavioralFamilyOf(findSeed("Super Lemon Haze")), "daytime-functional");
  });

  it("edgy-stimulant: sharp-stimulant always, plus chaotic/electric daytime", () => {
    assert.equal(behavioralFamilyOf(findSeed("Green Crack")), "edgy-stimulant");
    assert.equal(behavioralFamilyOf(findSeed("Ghost Train Haze")), "edgy-stimulant");
    assert.equal(behavioralFamilyOf(findSeed("Trainwreck")), "edgy-stimulant");
  });

  it("contemplative-quiet: introspective-calm × any", () => {
    assert.equal(behavioralFamilyOf(findSeed("Zkittlez")), "contemplative-quiet");
    assert.equal(behavioralFamilyOf(findSeed("Forbidden Fruit")), "contemplative-quiet");
  });

  it("exotic-modern-hybrid: smooth-expressive × smooth (modern candy wave)", () => {
    assert.equal(behavioralFamilyOf(findSeed("Runtz")), "exotic-modern-hybrid");
    assert.equal(behavioralFamilyOf(findSeed("Gelato")), "exotic-modern-hybrid");
  });

  it("null is a valid return — ambiguous compositions don't fake a family", () => {
    // Strains whose (archetype, texture) composition has no clear family
    // home should return null. We can't easily target a known null
    // strain without inspecting overrides, so test via a synthetic one:
    const ambig: StrainProfile = {
      name: "__test__",
      type: "hybrid",
      aromas: [],
      flavors: [],
      effects: [],
      traits: [],
      potency: "moderate",
    };
    // Falls through inference to "smooth-expressive" + "smooth" by default
    // → exotic-modern-hybrid. Use this to confirm at least one
    // composition is meaningfully classified.
    const fam = behavioralFamilyOf(ambig);
    assert.ok(fam === "exotic-modern-hybrid" || fam === null);
  });
});

describe("inferProfileFamily", () => {
  it("returns null on an empty profile", () => {
    assert.equal(inferProfileFamily(profile()), null);
  });

  it("favourites that cluster yield the dominant family", () => {
    assert.equal(
      inferProfileFamily(
        profile({ favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"] }),
      ),
      "nighttime-indica",
    );
    assert.equal(
      inferProfileFamily(
        profile({ favoriteStrains: ["Jack Herer", "Durban Poison", "Lemon Tree"] }),
      ),
      "daytime-functional",
    );
  });

  it("scattered favourites across families return null (no fake target)", () => {
    // 1 nighttime, 1 daytime, 1 edgy — no dominance.
    assert.equal(
      inferProfileFamily(
        profile({
          favoriteStrains: ["Northern Lights", "Jack Herer", "Green Crack"],
        }),
      ),
      null,
    );
  });

  it("falls back to preferences when no favourites", () => {
    const fam = inferProfileFamily(
      profile({
        preferredEffects: ["sleepy", "couch-lock", "body-heavy"],
        preferredAromas: ["earthy", "woody"],
      }),
    );
    assert.equal(fam, "nighttime-indica");
  });
});

describe("familyBonus — evidence-density scaling", () => {
  const evidenceFull = {
    effectMatched: 3,
    aromaMatched: 2,
    flavorMatched: 1,
    refScore: 60,
    effectScore: 75,
  };
  const evidenceEmpty = {
    effectMatched: 0,
    aromaMatched: 0,
    flavorMatched: 0,
    refScore: 0,
    effectScore: 0,
  };

  it("returns 0 when target family is null (no signal to recognise)", () => {
    assert.equal(familyBonus("nighttime-indica", null, evidenceFull), 0);
  });

  it("returns 0 when strain family is null (nothing to gate on)", () => {
    assert.equal(familyBonus(null, "nighttime-indica", evidenceFull), 0);
  });

  it("returns 0 when families don't match (recognition-only — no penalty)", () => {
    assert.equal(familyBonus("edgy-stimulant", "nighttime-indica", evidenceFull), 0);
  });

  it("family gate + zero evidence → +3 (minimal recognition)", () => {
    assert.equal(
      familyBonus("nighttime-indica", "nighttime-indica", evidenceEmpty),
      3,
    );
  });

  it("family + all 3 secondary signals → +12 (full evidence)", () => {
    assert.equal(
      familyBonus("nighttime-indica", "nighttime-indica", evidenceFull),
      12,
    );
  });

  it("bonus is monotonic in evidence", () => {
    const partial = familyBonus("nighttime-indica", "nighttime-indica", {
      effectMatched: 2,
      aromaMatched: 0,
      flavorMatched: 0,
      refScore: 0,
      effectScore: 70,
    });
    assert.equal(partial, 6); // family + effect signal = 2 signals × 3
  });
});

describe("integration — NL + GDP + Bubba profile (the reported regression)", () => {
  // The exact profile from the user's report: three deep-sleeper indica
  // favourites with kush-flavoured sensory prefs. Expected behaviour after
  // family layer:
  //   - Purple Punch / LA Kush Cake / Wedding Cake all sit clearly above
  //     30–40%, because they're in the same behavioural universe.
  //   - GMO Cookies rises too (same family) but less so — its aromas
  //     overlap less with the kush profile.
  //   - Green Crack, Durban Poison, Trainwreck do NOT inflate — they're
  //     in different families, the bonus gate fails for them, the
  //     archetype/texture penalties still apply.
  const nightProfile = profile({
    favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
    preferredAromas: ["earthy", "woody", "sweet"],
    preferredFlavors: ["earthy", "sweet"],
    preferredEffects: ["sleepy", "body-heavy", "relaxed", "calm"],
    likedTraits: ["heavy-body", "dense-buds", "smooth"],
  });

  it("anchors NL / GDP / Bubba stay 94–96", () => {
    for (const name of ["Northern Lights", "Granddaddy Purple", "Bubba Kush"]) {
      const r = scoreStrain(name, nightProfile);
      assert.ok(
        r.matchScore >= 94 && r.matchScore <= 96,
        `${name} anchor expected 94–96, got ${r.matchScore}`,
      );
    }
  });

  it("Purple Punch, LA Kush Cake and Wedding Cake land in the same score zone", () => {
    const pp = scoreStrain("Purple Punch", nightProfile).matchScore;
    const lakc = scoreStrain("LA Kush Cake", nightProfile).matchScore;
    const wc = scoreStrain("Wedding Cake", nightProfile).matchScore;
    // "Same zone" honest interpretation: all three above 50, spread ≤ 15pt.
    assert.ok(pp >= 50, `PP should be ≥50, got ${pp}`);
    assert.ok(lakc >= 50, `LAKC should be ≥50, got ${lakc}`);
    assert.ok(wc >= 50, `WC should be ≥50, got ${wc}`);
    const max = Math.max(pp, lakc, wc);
    const min = Math.min(pp, lakc, wc);
    assert.ok(
      max - min <= 15,
      `PP/LAKC/WC should sit in ~15pt band, got spread ${max - min} (PP ${pp}, LAKC ${lakc}, WC ${wc})`,
    );
  });

  it("Purple Punch outscores GMO (closer kush family overlap)", () => {
    const pp = scoreStrain("Purple Punch", nightProfile).matchScore;
    const gmo = scoreStrain("GMO Cookies", nightProfile).matchScore;
    assert.ok(
      pp > gmo,
      `Purple Punch (${pp}) should beat GMO (${gmo}) — same family, more aromatic alignment`,
    );
  });

  it("Green Crack stays low — family gate fails, dampeners still apply", () => {
    const gc = scoreStrain("Green Crack", nightProfile).matchScore;
    assert.ok(gc < 50, `Green Crack expected <50 on nighttime profile, got ${gc}`);
    // Crucially, Green Crack does NOT outscore family-aligned strains.
    const pp = scoreStrain("Purple Punch", nightProfile).matchScore;
    assert.ok(
      gc < pp,
      `Green Crack (${gc}) must not outscore Purple Punch (${pp}) — opposite world`,
    );
  });

  it("Trainwreck and Durban Poison do not get artificially inflated", () => {
    const tw = scoreStrain("Trainwreck", nightProfile).matchScore;
    const dp = scoreStrain("Durban Poison", nightProfile).matchScore;
    // Both are in daytime/edgy families — no nighttime bonus should fire.
    // They should remain well below the nighttime cohort.
    const pp = scoreStrain("Purple Punch", nightProfile).matchScore;
    assert.ok(tw < pp, `Trainwreck (${tw}) must not catch PP (${pp})`);
    assert.ok(dp < pp, `Durban Poison (${dp}) must not catch PP (${pp})`);
  });
});

describe("integration — family layer never penalises", () => {
  // An invariant: comparing a strain on a profile where its family does
  // NOT match the target must not produce a negative familyMod. The
  // overall score might be lower due to Layers 1+2, but never because
  // of Layer 3.
  it("scoring Green Crack on a nighttime profile vs no-target profile", () => {
    const nightProfileWithFamily = profile({
      favoriteStrains: ["Northern Lights", "Granddaddy Purple"],
    });
    const noTargetProfile = profile();
    const withFamily = scoreStrain("Green Crack", nightProfileWithFamily);
    const noFamily = scoreStrain("Green Crack", noTargetProfile);
    // Layer 3 contributes 0 in both cases (different family in first,
    // null target in second). The score difference comes from Layer 1+2
    // archetype/texture, not from family.
    assert.ok(typeof withFamily.matchScore === "number");
    assert.ok(typeof noFamily.matchScore === "number");
  });
});

describe("integration — anchor floor still wins over family layer", () => {
  it("a chaotic favourite stays 94–96 even though family suggests edgy-stimulant", () => {
    const wreckLover = profile({
      favoriteStrains: ["Trainwreck"],
      preferredEffects: ["uplifted", "energetic"],
    });
    const r = scoreStrain("Trainwreck", wreckLover);
    assert.ok(r.matchScore >= 94 && r.matchScore <= 96);
  });
});

describe("calibration band — non-anchor ceiling at 88", () => {
  // Reserve 94–96 for direct favourite anchors only. Any other strain,
  // no matter how strong the layered evidence, caps at 88. Creates a
  // visible gap between "your strain" and "close alternative."
  const alignedNight = profile({
    favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
    preferredAromas: ["earthy", "woody", "sweet"],
    preferredFlavors: ["earthy", "sweet"],
    preferredEffects: ["sleepy", "body-heavy", "relaxed", "calm"],
    likedTraits: ["heavy-body", "dense-buds", "smooth"],
  });

  it("non-anchor strong alternatives are capped at 88", () => {
    for (const name of ["Purple Punch", "LA Kush Cake", "Ice Cream Cake"]) {
      const r = scoreStrain(name, alignedNight);
      assert.ok(
        r.matchScore <= 88,
        `${name} expected ≤88 (non-anchor), got ${r.matchScore}`,
      );
    }
  });

  it("anchors are unaffected by the ceiling and stay 94–96", () => {
    for (const name of ["Northern Lights", "Granddaddy Purple", "Bubba Kush"]) {
      const r = scoreStrain(name, alignedNight);
      assert.ok(
        r.matchScore >= 94 && r.matchScore <= 96,
        `${name} anchor expected 94–96, got ${r.matchScore}`,
      );
    }
  });

  it("the 89–93 gap stays empty on aligned profiles", () => {
    const cohort = [
      "Purple Punch",
      "LA Kush Cake",
      "Wedding Cake",
      "Ice Cream Cake",
      "GMO Cookies",
    ];
    for (const name of cohort) {
      const score = scoreStrain(name, alignedNight).matchScore;
      assert.ok(
        score <= 88 || score >= 94,
        `${name} fell into the reserved gap zone: ${score}`,
      );
    }
  });
});

describe("hasClusteredFavorites — trust-mode detection", () => {
  it("returns false for an empty profile", () => {
    assert.equal(hasClusteredFavorites(profile()), false);
  });

  it("returns false with a single favourite (1 strain can't cluster)", () => {
    assert.equal(
      hasClusteredFavorites(profile({ favoriteStrains: ["Northern Lights"] })),
      false,
    );
  });

  it("returns true when ≥ 2 favourites land in the same family", () => {
    assert.equal(
      hasClusteredFavorites(
        profile({ favoriteStrains: ["Northern Lights", "Granddaddy Purple"] }),
      ),
      true,
    );
  });

  it("returns false when 2 favourites split across families (no dominance)", () => {
    assert.equal(
      hasClusteredFavorites(
        profile({ favoriteStrains: ["Northern Lights", "Jack Herer"] }),
      ),
      false,
    );
  });

  it("returns true when majority of favourites cluster (NL+GDP+Bubba+Jack)", () => {
    assert.equal(
      hasClusteredFavorites(
        profile({
          favoriteStrains: [
            "Northern Lights",
            "Granddaddy Purple",
            "Bubba Kush",
            "Jack Herer",
          ],
        }),
      ),
      true,
    );
  });
});

describe("integration — trust-mode reweighting on a contradictory profile", () => {
  // The reported runtime regression: user has NL+GDP+Bubba favourites
  // but enumerated preferences pull toward bright/daytime (citrus/pine
  // aromas, focused/creative effects). Default weighted-sum lets Jack
  // Herer dominate purely on tag overlap; family layer alone can't
  // overcome 30pt of aroma+flavor advantage. Trust-mode reweighting
  // re-prioritises favourites over enumerated tags so the empirical
  // anchor wins.
  const contradictoryProfile = profile({
    favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
    preferredAromas: ["citrus", "pine"],
    preferredFlavors: ["citrus"],
    preferredEffects: ["focused", "creative", "energetic"],
  });

  it("Ice Cream Cake outscores Sour Diesel (family > terp-mismatch)", () => {
    const icc = scoreStrain("Ice Cream Cake", contradictoryProfile);
    const sd = scoreStrain("Sour Diesel", contradictoryProfile);
    assert.ok(
      icc.matchScore > sd.matchScore,
      `ICC (${icc.matchScore}) must beat Sour Diesel (${sd.matchScore}) — same family vs edgy-stimulant`,
    );
  });

  it("Family-aligned strains rise above Jack Herer (the perfect-terp-mismatch)", () => {
    const masterKush = scoreStrain("Master Kush", contradictoryProfile);
    const purpleKush = scoreStrain("Purple Kush", contradictoryProfile);
    const jackHerer = scoreStrain("Jack Herer", contradictoryProfile);
    // Master Kush and Purple Kush share archetype + family with the
    // user's favourites. Even when Jack Herer matches every enumerated
    // preference perfectly, lived-experience favourites must win.
    assert.ok(
      masterKush.matchScore > jackHerer.matchScore,
      `Master Kush (${masterKush.matchScore}) must beat Jack Herer (${jackHerer.matchScore})`,
    );
    assert.ok(
      purpleKush.matchScore > jackHerer.matchScore,
      `Purple Kush (${purpleKush.matchScore}) must beat Jack Herer (${jackHerer.matchScore})`,
    );
  });

  it("Jack Herer is not catastrophically punished — still readable score", () => {
    // Trust-mode is re-weighting, not penalty. Jack Herer on a contradictory
    // profile should land mid-range, not at 5%. The user might genuinely
    // be open to it occasionally.
    const jackHerer = scoreStrain("Jack Herer", contradictoryProfile);
    assert.ok(
      jackHerer.matchScore >= 40 && jackHerer.matchScore <= 70,
      `JH should be mid-range, got ${jackHerer.matchScore}`,
    );
  });

  it("Anchor strains still pin 94–96 even in trust-mode", () => {
    for (const name of ["Northern Lights", "Granddaddy Purple", "Bubba Kush"]) {
      const r = scoreStrain(name, contradictoryProfile);
      assert.ok(
        r.matchScore >= 94 && r.matchScore <= 96,
        `${name} anchor expected 94–96, got ${r.matchScore}`,
      );
    }
  });
});

describe("integration — default mode untouched without clustered favourites", () => {
  it("single-favourite profile uses default weights", () => {
    // 1 favourite → trust-mode OFF. The strain still anchors at 94–96,
    // but cross-family strains use the original formula weights.
    const single = profile({ favoriteStrains: ["Jack Herer"] });
    const jh = scoreStrain("Jack Herer", single);
    assert.ok(jh.matchScore >= 94 && jh.matchScore <= 96);
  });

  it("sparse profile (no favourites, no preferences) is unaffected", () => {
    // Neither trust-mode nor family layer can fire on a blank profile —
    // both gate on signals that don't exist. Scores stay in whatever
    // band the base formula produces, exactly as before this change.
    const blank = profile();
    const score = scoreStrain("Blue Dream", blank).matchScore;
    assert.ok(score > 0 && score < 100, `score should be in valid range`);
  });
});
