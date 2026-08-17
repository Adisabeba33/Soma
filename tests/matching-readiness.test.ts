import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  matchingReadiness,
  profileCompleteness,
} from "../src/lib/profile-completeness";
import type { TasteProfileInput } from "../src/lib/types";

// Field classification, mirroring the audit's inventory: readiness may
// depend only on "scoring" fields; "contextual" and "inert-for-now" fields
// must never unlock matching no matter how many are filled.
//
//   scoring (positive signal): favoriteStrains, primaryEffect + useTime,
//     primaryAroma, preferredEffects, preferredAromas, preferredFlavors
//   scoring (negative signal, no unlock alone): dislikedEffects,
//     dislikedAromas, dislikedStrains, avoidedRisks("racy")
//   contextual / similarity-only: smokingMethods, bodyFeel, lookingFor,
//     referenceStrain, notes
//   inert until curated: avoidedRisks paranoia/foggy/crash,
//     texturePreferences moist/fluffy

function p(overrides: Partial<TasteProfileInput>): Partial<TasteProfileInput> {
  return overrides;
}

describe("matchingReadiness", () => {
  it("empty profile is not ready", () => {
    const r = matchingReadiness(p({}));
    assert.equal(r.ready, false);
    assert.ok(r.missing.length > 0);
  });

  it("non-scoring and inert answers can never unlock matching", () => {
    const r = matchingReadiness(
      p({
        smokingMethods: ["joint", "bong"],
        bodyFeel: 50,
        potencyPreference: "strong",
        avoidedRisks: ["paranoia", "foggy", "crash"],
        texturePreferences: ["moist", "fluffy"],
        dislikedTraits: ["harsh"],
        notes: "long free text that only feeds the prose layer",
      } as Partial<TasteProfileInput>),
    );
    assert.equal(r.ready, false);
  });

  it("a single favourite strain unlocks matching (anchor path)", () => {
    const r = matchingReadiness(p({ favoriteStrains: ["GG4"] }));
    assert.equal(r.ready, true);
    assert.deepEqual(r.missing, []);
  });

  it("primary effect + time alone is NOT enough — needs one sensory pick", () => {
    const r = matchingReadiness(
      p({ primaryEffect: "calm", useTime: "evening" }),
    );
    assert.equal(r.ready, false);
  });

  it("primary effect + time + primary aroma is ready", () => {
    const r = matchingReadiness(
      p({ primaryEffect: "calm", useTime: "evening", primaryAroma: "gas" }),
    );
    assert.equal(r.ready, true);
  });

  it("primary effect + time + preferred effects is ready", () => {
    const r = matchingReadiness(
      p({
        primaryEffect: "calm",
        useTime: "evening",
        preferredEffects: ["sleepy"],
      }),
    );
    assert.equal(r.ready, true);
  });

  it("sensory picks without the base target are NOT ready", () => {
    const r = matchingReadiness(
      p({ primaryAroma: "gas", preferredEffects: ["sleepy"] }),
    );
    assert.equal(r.ready, false);
  });

  it("readiness is independent of the completeness percent", () => {
    // A profile heavy on contextual answers scores completeness points but
    // stays locked; a single favourite outranks all of them.
    const contextual = p({
      smokingMethods: ["joint"],
      bodyFeel: 100,
      potencyPreference: "mild",
      texturePreferences: ["moist"],
      dislikedTraits: ["harsh"],
      avoidedRisks: ["paranoia"],
    } as Partial<TasteProfileInput>);
    const anchored = p({ favoriteStrains: ["Blue Dream"] });
    assert.ok(
      profileCompleteness(contextual).percent >
        profileCompleteness(anchored).percent,
    );
    assert.equal(matchingReadiness(contextual).ready, false);
    assert.equal(matchingReadiness(anchored).ready, true);
  });
});
