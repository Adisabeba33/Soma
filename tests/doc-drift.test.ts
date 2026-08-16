import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { STRAINS } from "../src/lib/strain-data";
import { IDENTITIES } from "../src/lib/strain-identity-data";
import { ENGINE_VERSION } from "../src/lib/taste-engine";
import {
  buildCatalog,
  catalogSize,
  trimEntryForList,
} from "../src/lib/catalog";
import { profileCompleteness } from "../src/lib/profile-completeness";

// Documentation-drift guards. The audit (docs/CODE_AUDIT_OBSERVATIONS.md §7)
// found hand-maintained counts scattered through comments and docs that had
// silently gone stale. These tests pin the facts that matter to the source,
// so a future drift fails loudly instead of misleading the next agent.

describe("doc drift — counts derive from source", () => {
  it("catalog size equals the strain data set", async () => {
    const entries = await buildCatalog();
    assert.equal(entries.length, STRAINS.length);
    assert.equal(catalogSize(), STRAINS.length);
  });

  it("every strain has at most one identity record and no orphans", () => {
    const strainNames = new Set(STRAINS.map((s) => s.name));
    const seen = new Set<string>();
    for (const id of IDENTITIES) {
      assert.ok(
        strainNames.has(id.canonicalName),
        `identity without strain: ${id.canonicalName}`,
      );
      assert.ok(!seen.has(id.canonicalName), `duplicate identity: ${id.canonicalName}`);
      seen.add(id.canonicalName);
    }
  });

  it("engine version is the one tests and docs should reference", () => {
    assert.equal(ENGINE_VERSION, "v9");
  });

  it("completeness normalizes to exactly 100 when everything is answered", () => {
    const full = profileCompleteness({
      favoriteStrains: ["GG4"],
      primaryEffect: "calm",
      useTime: "evening",
      primaryAroma: "gas",
      preferredEffects: ["relaxed"],
      preferredAromas: ["earthy"],
      dislikedEffects: ["anxious"],
      bodyFeel: 50,
      potencyPreference: "balanced",
      dislikedAromas: ["skunky"],
      smokingMethods: ["joint"],
      avoidedRisks: ["racy"],
      dislikedStrains: ["Haze"],
      dislikedTraits: ["harsh"],
      likedTraits: ["smooth"],
      preferredFamilies: ["Kush"],
      preferredType: "indica",
      qualityPriorities: ["freshness"],
      texturePreferences: ["sticky"],
    });
    assert.equal(full.percent, 100);
    assert.equal(full.missing.length, 0);
  });

  it("serialized catalog list payload stays within budget", async () => {
    // Regression guard from the audit's catalog findings: the list view's
    // serialized entries must not creep back toward the multi-MB payloads.
    const entries = (await buildCatalog()).map(trimEntryForList);
    const bytes = JSON.stringify(entries).length;
    assert.ok(
      bytes < 700_000,
      `catalog list payload ${bytes} bytes exceeds 700 KB budget`,
    );
  });
});
