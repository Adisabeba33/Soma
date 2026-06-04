import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  deriveOverall,
  emptyPurchaseConfidence,
  evaluatePurchase,
  isPurchaseConfidence,
  signalLabel,
  type PurchaseSignals,
} from "../src/lib/purchase-confidence";
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

describe("evaluatePurchase (default behaviour today)", () => {
  it("returns all-unknown when no signals are available", () => {
    const pc = evaluatePurchase();
    assert.equal(pc.overall, "unknown");
    for (const v of Object.values(pc.signals)) {
      assert.equal(v, "unknown");
    }
    assert.deepEqual(pc.notes, []);
  });

  it("ignores context for now (seam exists but isn't wired)", () => {
    const pc = evaluatePurchase({
      grower: "Jungle Boys",
      thcPercent: 28,
      weight: "3.5g",
    });
    assert.equal(pc.overall, "unknown");
  });
});

describe("deriveOverall — verdict from signals", () => {
  function s(over: Partial<PurchaseSignals> = {}): PurchaseSignals {
    return {
      freshness: "unknown",
      cure: "unknown",
      storage: "unknown",
      growerReliability: "unknown",
      phenotypeConsistency: "unknown",
      ...over,
    };
  }

  it("all-unknown stays unknown — never fabricates a verdict", () => {
    assert.equal(deriveOverall(s()), "unknown");
  });

  it("any low signal pulls the overall to low", () => {
    assert.equal(
      deriveOverall(s({ freshness: "high", storage: "low" })),
      "low",
    );
  });

  it("medium average maps to medium", () => {
    assert.equal(
      deriveOverall(s({ freshness: "medium", growerReliability: "medium" })),
      "medium",
    );
  });

  it("all-high known signals map to high", () => {
    assert.equal(
      deriveOverall(
        s({
          freshness: "high",
          cure: "high",
          storage: "high",
          growerReliability: "high",
          phenotypeConsistency: "high",
        }),
      ),
      "high",
    );
  });
});

describe("isPurchaseConfidence guard", () => {
  it("accepts a freshly-constructed empty record", () => {
    assert.ok(isPurchaseConfidence(emptyPurchaseConfidence()));
  });

  it("rejects null, primitives, partial shapes", () => {
    assert.equal(isPurchaseConfidence(null), false);
    assert.equal(isPurchaseConfidence(undefined), false);
    assert.equal(isPurchaseConfidence("low"), false);
    assert.equal(isPurchaseConfidence({}), false);
    assert.equal(
      isPurchaseConfidence({ overall: "unknown", signals: {} }),
      false,
    );
  });

  it("rejects invalid level strings", () => {
    assert.equal(
      isPurchaseConfidence({
        overall: "verygood",
        signals: emptyPurchaseConfidence().signals,
        notes: [],
      }),
      false,
    );
  });
});

describe("signalLabel", () => {
  it("returns a human label for each key", () => {
    assert.equal(signalLabel("freshness"), "Freshness");
    assert.equal(signalLabel("growerReliability"), "Grower reliability");
    assert.equal(signalLabel("phenotypeConsistency"), "Phenotype consistency");
  });
});

describe("engine integration — purchase axis is always present", () => {
  it("scoreStrain attaches purchaseConfidence to every result", () => {
    const result = scoreStrain("GG4", profile());
    assert.ok(result.purchaseConfidence);
    assert.equal(result.purchaseConfidence.overall, "unknown");
  });

  it("a favourite anchor still has unknown purchase confidence", () => {
    // Critical: sensory anchor MUST NOT bleed into purchase confidence.
    // The whole point of the split is that knowing the strain doesn't
    // tell us anything about THIS specific batch.
    const result = scoreStrain(
      "Super Lemon Haze",
      profile({ favoriteStrains: ["Super Lemon Haze"] }),
    );
    assert.ok(result.matchScore >= 94);
    assert.equal(result.purchaseConfidence.overall, "unknown");
  });

  it("an unknown (inferred) strain still has unknown purchase confidence", () => {
    const result = scoreStrain("Made Up Strain XYZ", profile());
    assert.equal(result.knownStrain, false);
    assert.equal(result.purchaseConfidence.overall, "unknown");
  });
});
