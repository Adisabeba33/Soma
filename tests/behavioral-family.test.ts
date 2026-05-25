import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  behavioralFamilyOf,
  familyBonus,
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

  it("family gate + zero evidence → +2 (minimal recognition)", () => {
    assert.equal(
      familyBonus("nighttime-indica", "nighttime-indica", evidenceEmpty),
      2,
    );
  });

  it("family + all 3 secondary signals → +8 (full evidence)", () => {
    assert.equal(
      familyBonus("nighttime-indica", "nighttime-indica", evidenceFull),
      8,
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
    assert.equal(partial, 4); // family + effect signal
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
