import { test } from "node:test";
import assert from "node:assert/strict";

import { PRESETS } from "../src/lib/profile-presets";
import {
  AROMAS,
  FLAVORS,
  EFFECTS,
  LIKED_TRAITS,
  DISLIKED_TRAITS,
  RISK_AVOIDANCE,
  QUALITY_PRIORITIES,
  TEXTURE_PREFERENCES,
} from "../src/lib/vocab";
import {
  SMOKING_METHODS,
  isPrimaryAroma,
  isPrimaryEffect,
  isUseTime,
  isPreferredType,
} from "../src/lib/profile-target";
import { isFamilyKey } from "../src/lib/strain-families";
import { findStrain } from "../src/lib/strain-data";
import { profileCompleteness } from "../src/lib/profile-completeness";
import type { TasteProfileInput } from "../src/lib/types";

const set = (opts: { value: string }[]) => new Set(opts.map((o) => o.value));
const AROMA = set(AROMAS);
const FLAVOR = set(FLAVORS);
const EFFECT = set(EFFECTS);
const LIKED = set(LIKED_TRAITS);
const DISLIKED = set(DISLIKED_TRAITS);
const RISK = set(RISK_AVOIDANCE);
const QUALITY = set(QUALITY_PRIORITIES);
const TEXTURE = set(TEXTURE_PREFERENCES);
const SMOKING = set(SMOKING_METHODS);

for (const preset of PRESETS) {
  const p = preset.profile;

  test(`preset "${preset.id}" — every token is a real vocab value`, () => {
    for (const a of p.preferredAromas) assert.ok(AROMA.has(a), `aroma ${a}`);
    for (const a of p.dislikedAromas) assert.ok(AROMA.has(a), `dislikedAroma ${a}`);
    for (const f of p.preferredFlavors) assert.ok(FLAVOR.has(f), `flavor ${f}`);
    for (const e of p.preferredEffects) assert.ok(EFFECT.has(e), `effect ${e}`);
    for (const e of p.dislikedEffects) assert.ok(EFFECT.has(e), `dislikedEffect ${e}`);
    for (const t of p.likedTraits) assert.ok(LIKED.has(t), `likedTrait ${t}`);
    for (const t of p.dislikedTraits) assert.ok(DISLIKED.has(t), `dislikedTrait ${t}`);
    for (const r of p.avoidedRisks) assert.ok(RISK.has(r), `risk ${r}`);
    for (const q of p.qualityPriorities) assert.ok(QUALITY.has(q), `quality ${q}`);
    for (const x of p.texturePreferences) assert.ok(TEXTURE.has(x), `texture ${x}`);
    for (const m of p.smokingMethods) assert.ok(SMOKING.has(m), `smoking ${m}`);
    for (const fam of p.preferredFamilies) assert.ok(isFamilyKey(fam), `family ${fam}`);
    for (const fam of p.avoidedFamilies) assert.ok(isFamilyKey(fam), `avoidedFamily ${fam}`);
    assert.ok(isPrimaryAroma(p.primaryAroma), `primaryAroma ${p.primaryAroma}`);
    assert.ok(isPrimaryEffect(p.primaryEffect), `primaryEffect ${p.primaryEffect}`);
    assert.ok(isUseTime(p.useTime), `useTime ${p.useTime}`);
    assert.ok(isPreferredType(p.preferredType), `preferredType ${p.preferredType}`);
  });

  test(`preset "${preset.id}" — favourites resolve in the catalogue`, () => {
    assert.ok(p.favoriteStrains.length >= 2 && p.favoriteStrains.length <= 3, "2–3 favourites");
    for (const name of p.favoriteStrains) {
      assert.ok(findStrain(name), `favourite "${name}" not in catalogue`);
    }
  });

  test(`preset "${preset.id}" — a preset is a thorough worked example (>= 90%)`, () => {
    const { percent } = profileCompleteness(p as unknown as TasteProfileInput);
    assert.ok(percent >= 90, `completeness ${percent}% < 90%`);
  });

  test(`preset "${preset.id}" — likes and dislikes never contradict`, () => {
    const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x));
    assert.deepEqual(overlap(p.preferredAromas, p.dislikedAromas), [], "aroma like/dislike clash");
    assert.deepEqual(overlap(p.preferredEffects, p.dislikedEffects), [], "effect like/dislike clash");
    assert.deepEqual(overlap(p.preferredFamilies, p.avoidedFamilies), [], "family seek/avoid clash");
  });
}
