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
    assert.equal(entry.schemaVersion, 2);
    assert.equal(entry.taste, undefined);
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
