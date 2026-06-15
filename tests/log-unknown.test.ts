import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { buildUnknownStrainPayloads } from "../src/lib/unknown-strains";
import type { ParsedMenuItem } from "../src/lib/parse-menu";
import { emptyPurchaseConfidence } from "../src/lib/purchase-confidence";
import type { StrainMatch } from "../src/lib/types";

function match(strainName: string, knownStrain: boolean): StrainMatch {
  return {
    strainName,
    resolvedName: strainName,
    knownStrain,
    category: "Worth Trying",
    matchScore: 60,
    unclampedScore: 60,
    confidence: "low",
    aromaMatch: 0,
    flavorMatch: 0,
    effectMatch: 0,
    traitMatch: 0,
    referenceSimilarity: 0,
    matchedAromas: [],
    matchedFlavors: [],
    matchedEffects: [],
    conflicts: [],
    whyItFits: "",
    riskNotes: "",
    explanation: "",
    feedbackAdjustment: 0,
    feedbackNote: null,
    baseScore: 0,
    feedbackPotential: 0,
    feedbackDecay: 1,
    purchaseConfidence: emptyPurchaseConfidence(),
  };
}

function item(
  strainName: string,
  overrides: Partial<ParsedMenuItem> = {},
): ParsedMenuItem {
  return {
    strainName,
    grower: null,
    thcPercent: null,
    price: null,
    weight: null,
    rawLine: strainName,
    confidence: "high",
    warnings: [],
    ...overrides,
  };
}

describe("buildUnknownStrainPayloads", () => {
  it("skips known strains", () => {
    const payloads = buildUnknownStrainPayloads(
      "user-1",
      "session-1",
      [match("Blue Dream", true), match("Cosmic Garlic Funk", false)],
      [],
    );
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].rawName, "Cosmic Garlic Funk");
  });

  it("populates normalizedName and growerKey from raw inputs", () => {
    const payloads = buildUnknownStrainPayloads(
      "user-1",
      "session-1",
      [match("Frosted Reverie", false)],
      [
        item("Frosted Reverie", {
          grower: "Local Farm",
          rawLine: "Frosted Reverie by Local Farm 3.5g $50",
        }),
      ],
    );
    assert.equal(payloads.length, 1);
    const p = payloads[0];
    assert.equal(p.rawName, "Frosted Reverie"); // preserved as received
    assert.equal(p.normalizedName, "frosted reverie");
    assert.equal(p.grower, "Local Farm");
    assert.equal(p.growerKey, "local farm");
    assert.equal(p.rawLine, "Frosted Reverie by Local Farm 3.5g $50");
  });

  it("falls back to empty growerKey when the item or grower is missing", () => {
    const payloads = buildUnknownStrainPayloads(
      "user-1",
      "session-1",
      [match("Mystery OG", false)],
      [],
    );
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].grower, null);
    assert.equal(payloads[0].growerKey, "");
  });

  it("collapses casing/whitespace variants under the same normalizedName", () => {
    const payloads = buildUnknownStrainPayloads(
      "user-1",
      "session-1",
      [match("Mystery OG", false), match("  mystery   og  ", false)],
      [],
    );
    assert.equal(payloads.length, 2);
    assert.equal(payloads[0].normalizedName, payloads[1].normalizedName);
    // rawName is preserved exactly as received on each row.
    assert.notEqual(payloads[0].rawName, payloads[1].rawName);
  });

  it("drops rows whose normalized name is empty", () => {
    const payloads = buildUnknownStrainPayloads(
      "user-1",
      "session-1",
      [match("***", false), match("Mystery OG", false)],
      [],
    );
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].rawName, "Mystery OG");
  });
});
