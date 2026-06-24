import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { buildAuditEntry, buildAuditItem } from "../src/lib/run-audit";
import { scoreStrain } from "../src/lib/taste-engine";
import type { TasteProfileInput } from "../src/lib/types";

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

describe("buildAuditEntry — raw label stays glued to its own match", () => {
  // Regression: Taste Match sorts/dedups recommendations, so rawInputs[i]
  // did NOT line up with matches[i]. The audit zipped them by index and
  // swapped raw labels (Cookie Dough showed canonical Tahoe OG and vice
  // versa). Build items from the matches themselves so each raw is glued to
  // the strain it was actually scored from.
  const p = profile({
    favoriteStrains: ["GG4"],
    preferredAromas: ["gassy", "earthy"],
    preferredEffects: ["relaxed"],
  });

  it("each item is self-consistent even when matches are pre-sorted", () => {
    const rawInputs = ["cookie dough", "Tahoe OG", "UK cheese"];
    // Mimic the engine: score then sort by matchScore desc — a different
    // order from rawInputs.
    const matches = rawInputs
      .map((r) => scoreStrain(r, p))
      .sort((a, b) => b.matchScore - a.matchScore);

    const entry = buildAuditEntry({
      source: "taste-match",
      userId: "u1",
      profile: p,
      rawInputs,
      matches,
      closestName: matches[0].strainName,
    });

    // Order follows matches (sorted), and every item's raw must reproduce
    // its own canonical + score — i.e. raw and match are never swapped.
    for (const item of entry.items) {
      const rescored = scoreStrain(item.raw, p);
      assert.equal(
        item.canonical,
        rescored.resolvedName,
        `raw "${item.raw}" must keep its own canonical`,
      );
      assert.equal(item.matchScore, rescored.matchScore);
    }
    // The Tahoe OG input keeps Tahoe OG as its canonical (not a neighbour).
    const tahoe = entry.items.find((i) => i.raw === "Tahoe OG");
    assert.equal(tahoe?.canonical, "Tahoe OG");
  });
});

describe("buildAuditItem — per-strain snapshot", () => {
  const p = profile({
    favoriteStrains: ["Northern Lights", "Bubba Kush"],
    preferredAromas: ["earthy"],
    preferredEffects: ["sleepy"],
  });

  it("captures raw, canonical and behavioural-layer triple", () => {
    const match = scoreStrain("ice cream cake", p);
    const item = buildAuditItem("ice cream cake", match);
    assert.equal(item.raw, "ice cream cake");
    assert.equal(item.canonical, "Ice Cream Cake");
    assert.equal(item.known, true);
    assert.equal(item.behavioralLayers.archetype, "dessert-couch-lock");
    assert.equal(item.behavioralLayers.texture, "smooth");
    assert.equal(item.behavioralLayers.family, "nighttime-indica");
  });

  it("includes sub-scores for aroma/flavor/effect/trait/ref", () => {
    const match = scoreStrain("Wedding Cake", p);
    const item = buildAuditItem("Wedding Cake", match);
    assert.equal(typeof item.subScores.aroma, "number");
    assert.equal(typeof item.subScores.flavor, "number");
    assert.equal(typeof item.subScores.effect, "number");
    assert.equal(typeof item.subScores.trait, "number");
    assert.equal(typeof item.subScores.ref, "number");
  });

  it("includes purchase confidence as the second axis", () => {
    const match = scoreStrain("Wedding Cake", p);
    const item = buildAuditItem("Wedding Cake", match);
    assert.equal(item.purchaseConfidence.overall, "unknown");
  });

  it("marks unknown strains honestly", () => {
    const match = scoreStrain("Definitely Not A Real Strain XYZ", p);
    const item = buildAuditItem("Definitely Not A Real Strain XYZ", match);
    assert.equal(item.known, false);
  });
});

describe("buildAuditEntry — Compare run", () => {
  it("tags source = 'compare' and omits taste context", () => {
    const p = profile({
      favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
      preferredEffects: ["sleepy"],
    });
    const inputs = ["Purple Punch", "Wedding Cake"];
    const matches = inputs.map((n) => scoreStrain(n, p));
    const closest = matches.reduce((b, m) =>
      m.matchScore > b.matchScore ? m : b,
    );
    const entry = buildAuditEntry({
      source: "compare",
      userId: "user-123",
      profile: p,
      rawInputs: inputs,
      matches,
      closestName: closest.strainName,
    });
    assert.equal(entry.source, "compare");
    assert.equal(entry.userId, "user-123");
    assert.equal(entry.schemaVersion, 3);
    assert.equal(entry.taste, undefined);
    assert.equal(entry.merge, undefined);
    assert.equal(entry.modeSnapshot.trustMode, true);
    assert.equal(entry.modeSnapshot.targetFamily, "nighttime-indica");
    assert.equal(entry.items.length, 2);
  });
});

describe("buildAuditEntry — Taste Match run", () => {
  it("tags source = 'taste-match' and includes the taste context block", () => {
    const p = profile({
      favoriteStrains: ["Jack Herer"],
      preferredEffects: ["focused"],
    });
    const inputs = ["Tangie", "Sour Diesel", "Northern Lights"];
    const matches = inputs.map((n) => scoreStrain(n, p));
    const closest = matches.reduce((b, m) =>
      m.matchScore > b.matchScore ? m : b,
    );
    const entry = buildAuditEntry({
      source: "taste-match",
      userId: "user-tm",
      profile: p,
      rawInputs: inputs,
      matches,
      closestName: closest.strainName,
      taste: {
        sessionId: "session-abc",
        inputType: "paste",
        parsedItems: [
          {
            strainName: "Tangie",
            grower: "Jungle Boys",
            thcPercent: 24,
            price: 50,
            weight: "3.5g",
            rawLine: "Tangie by Jungle Boys 3.5g 24% $50",
            confidence: "high",
            warnings: [],
          },
        ],
        menuQuality: {
          totalParsed: 3,
          unclearRows: 0,
          unknownStrains: 0,
          avgConfidence: 1,
        },
        engine: "builtin",
      },
    });
    assert.equal(entry.source, "taste-match");
    assert.ok(entry.taste);
    assert.equal(entry.taste.sessionId, "session-abc");
    assert.equal(entry.taste.inputType, "paste");
    assert.equal(entry.taste.engine, "builtin");
    assert.equal(entry.taste.menuQuality?.totalParsed, 3);
    assert.ok(entry.taste.parsedItems);
    assert.equal(entry.taste.parsedItems.length, 1);
    assert.equal(entry.taste.parsedItems[0].grower, "Jungle Boys");
  });

  it("modeSnapshot carries vocab + engine version markers", () => {
    const p = profile({ favoriteStrains: ["Jack Herer"] });
    const matches = [scoreStrain("Tangie", p)];
    const entry = buildAuditEntry({
      source: "taste-match",
      userId: "u",
      profile: p,
      rawInputs: ["Tangie"],
      matches,
      closestName: "Tangie",
      taste: {
        sessionId: "s",
        inputType: "manual",
        parsedItems: null,
        menuQuality: null,
        engine: "builtin",
      },
    });
    assert.equal(typeof entry.modeSnapshot.vocabVersion, "string");
    assert.equal(typeof entry.modeSnapshot.engineVersion, "string");
    assert.ok(entry.modeSnapshot.vocabVersion.length > 0);
    assert.ok(entry.modeSnapshot.engineVersion.length > 0);
  });

  it("modeSnapshot reflects sparse profile honestly (no fake targets)", () => {
    const p = profile();
    const matches = [scoreStrain("GG4", p)];
    const entry = buildAuditEntry({
      source: "taste-match",
      userId: "u",
      profile: p,
      rawInputs: ["GG4"],
      matches,
      closestName: "GG4",
      taste: {
        sessionId: "s",
        inputType: "manual",
        parsedItems: null,
        menuQuality: null,
        engine: "builtin",
      },
    });
    assert.equal(entry.modeSnapshot.trustMode, false);
    assert.equal(entry.modeSnapshot.targetArchetype, null);
    assert.equal(entry.modeSnapshot.targetTexture, null);
    assert.equal(entry.modeSnapshot.targetFamily, null);
  });

  it("snapshot is JSON-serialisable end-to-end (both sources)", () => {
    const p = profile({ favoriteStrains: ["Jack Herer", "Durban Poison"] });
    const matches = [scoreStrain("Tangie", p)];
    const entry = buildAuditEntry({
      source: "compare",
      userId: "u",
      profile: p,
      rawInputs: ["Tangie"],
      matches,
      closestName: "Tangie",
    });
    const json = JSON.stringify(entry);
    const parsed = JSON.parse(json);
    assert.equal(parsed.source, "compare");
    assert.equal(parsed.items[0].canonical, "Tangie");
  });
});

describe("buildAuditEntry — merge run", () => {
  it("records the lean, a snapshot per world, and per-item world + raw scores", () => {
    const gas = profile({
      favoriteStrains: ["GG4"],
      preferredAromas: ["gassy"],
      preferredEffects: ["relaxed"],
    });
    const skunk = profile({
      favoriteStrains: ["Skunk #1"],
      preferredAromas: ["skunky"],
      preferredEffects: ["happy"],
    });
    const inputs = ["GG4", "Skunk #1"];
    // Merge attaches the winning world to each match; mimic that here.
    const matches = inputs.map((n) => ({
      ...scoreStrain(n, gas),
      world: n === "GG4" ? "Gas" : "Skunk",
    }));
    const breakdown = {
      GG4: [
        { world: "Gas", score: 94 },
        { world: "Skunk", score: 40 },
      ],
      "Skunk #1": [
        { world: "Gas", score: 50 },
        { world: "Skunk", score: 95 },
      ],
    };

    const entry = buildAuditEntry({
      source: "taste-match",
      userId: "u",
      profile: gas,
      rawInputs: inputs,
      matches,
      closestName: "GG4",
      merge: {
        bias: 0.6,
        profiles: [
          { name: "Gas", primary: true, profile: gas },
          { name: "Skunk", primary: false, profile: skunk },
        ],
        breakdown,
      },
    });

    assert.equal(entry.schemaVersion, 3);
    assert.ok(entry.merge);
    assert.equal(entry.merge?.bias, 0.6);
    assert.equal(entry.merge?.profiles.length, 2);
    assert.equal(entry.merge?.profiles[0].primary, true);
    // Every merged world carries its own derived snapshot.
    assert.ok(entry.merge?.profiles[0].modeSnapshot);
    assert.ok(entry.merge?.profiles[1].modeSnapshot);
    // Per item: which world won + every world's raw pre-lean score.
    const gg4 = entry.items.find((i) => i.canonical === "GG4");
    assert.equal(gg4?.world, "Gas");
    assert.equal(gg4?.perWorld?.length, 2);
    assert.equal(gg4?.perWorld?.[0].score, 94);
    // Single-profile items stay merge-free.
    const single = buildAuditEntry({
      source: "compare",
      userId: "u",
      profile: gas,
      rawInputs: ["GG4"],
      matches: [scoreStrain("GG4", gas)],
      closestName: "GG4",
    });
    assert.equal(single.merge, undefined);
    assert.equal(single.items[0].world, undefined);
  });
});
