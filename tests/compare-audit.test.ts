import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { buildAuditEntry, buildAuditItem } from "../src/lib/compare-audit";
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

describe("buildAuditEntry — full snapshot", () => {
  it("includes mode snapshot (trustMode + target layers)", () => {
    const p = profile({
      favoriteStrains: ["Northern Lights", "Granddaddy Purple", "Bubba Kush"],
      preferredEffects: ["sleepy"],
    });
    const inputs = ["Purple Punch", "Wedding Cake"];
    const matches = inputs.map((n) => scoreStrain(n, p));
    const closest = matches.reduce((b, m) =>
      m.matchScore > b.matchScore ? m : b,
    );
    const entry = buildAuditEntry(
      "user-123",
      p,
      inputs,
      matches,
      closest.strainName,
    );
    assert.equal(entry.userId, "user-123");
    assert.equal(entry.schemaVersion, 1);
    assert.equal(entry.modeSnapshot.trustMode, true);
    assert.equal(entry.modeSnapshot.targetFamily, "nighttime-indica");
    assert.equal(entry.modeSnapshot.targetArchetype, "deep-sleeper");
    assert.equal(entry.items.length, 2);
    assert.equal(entry.rawInputs.length, 2);
  });

  it("modeSnapshot reflects sparse profile honestly (no fake targets)", () => {
    const p = profile();
    const matches = [scoreStrain("GG4", p)];
    const entry = buildAuditEntry("u", p, ["GG4"], matches, "GG4");
    assert.equal(entry.modeSnapshot.trustMode, false);
    assert.equal(entry.modeSnapshot.targetArchetype, null);
    assert.equal(entry.modeSnapshot.targetTexture, null);
    assert.equal(entry.modeSnapshot.targetFamily, null);
  });

  it("snapshot is JSON-serialisable end-to-end", () => {
    const p = profile({ favoriteStrains: ["Jack Herer", "Durban Poison"] });
    const matches = [scoreStrain("Tangie", p)];
    const entry = buildAuditEntry("u", p, ["Tangie"], matches, "Tangie");
    const json = JSON.stringify(entry);
    const parsed = JSON.parse(json);
    assert.equal(parsed.items[0].canonical, "Tangie");
  });
});
