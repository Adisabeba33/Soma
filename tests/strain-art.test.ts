import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  TIME_PROFILES,
  deriveTimeProfile,
  timeProfileOf,
  artFileNameOf,
  artStatusOf,
  artImageSrc,
  buildArtPrompt,
} from "../src/lib/strain-art";
import { paletteForTime } from "../src/lib/sensory-family-palette";
import { STRAINS, findStrain } from "../src/lib/strain-data";
import { getIdentity } from "../src/lib/strain-identity";
import type { StrainIdentity } from "../src/lib/strain-identity";

const VALID = new Set(TIME_PROFILES);

describe("deriveTimeProfile", () => {
  it("returns a valid time profile for every strain in the catalog", () => {
    for (const strain of STRAINS) {
      const tp = deriveTimeProfile(strain);
      assert.ok(
        VALID.has(tp),
        `${strain.name} derived an invalid time profile: ${tp}`,
      );
    }
  });

  it("never throws across the whole catalog", () => {
    assert.doesNotThrow(() => {
      for (const strain of STRAINS) deriveTimeProfile(strain);
    });
  });
});

describe("timeProfileOf", () => {
  it("prefers the identity override over the derived value", () => {
    const strain = findStrain("Super Lemon Haze");
    assert.ok(strain);
    // SLH derives to "daytime" but is overridden to "morning".
    assert.equal(deriveTimeProfile(strain), "daytime");
    assert.equal(timeProfileOf(strain, getIdentity("Super Lemon Haze")), "morning");
  });

  it("falls back to the derived value with no identity", () => {
    const strain = findStrain("Super Lemon Haze");
    assert.ok(strain);
    assert.equal(timeProfileOf(strain, null), deriveTimeProfile(strain));
  });
});

describe("seed example time profiles", () => {
  const expected: Record<string, string> = {
    GG4: "night",
    "Sour Diesel": "daytime",
    "White Hot Guava": "sunset",
    "Super Lemon Haze": "morning",
  };
  for (const [name, tp] of Object.entries(expected)) {
    it(`${name} → ${tp}`, () => {
      const strain = findStrain(name);
      assert.ok(strain, `${name} missing from catalog`);
      assert.equal(timeProfileOf(strain, getIdentity(name)), tp);
    });
  }
});

describe("artFileNameOf", () => {
  it("derives the filename from the slug when no override exists", () => {
    const cases: Record<string, string> = {
      GG4: "gg4.webp",
      "White Hot Guava": "white-hot-guava.webp",
      "Sour Diesel": "sour-diesel.webp",
      "Super Lemon Haze": "super-lemon-haze.webp",
    };
    for (const [name, file] of Object.entries(cases)) {
      const strain = findStrain(name);
      assert.ok(strain);
      // The seed records carry an explicit (matching) override; strip it to
      // prove the derived default is identical.
      assert.equal(artFileNameOf(strain, null), file);
      assert.equal(artFileNameOf(strain, getIdentity(name)), file);
    }
  });

  it("respects an explicit artFileName override", () => {
    const strain = findStrain("GG4");
    assert.ok(strain);
    const override: StrainIdentity = {
      canonicalName: "GG4",
      sourceConfidence: "high",
      artFileName: "custom-glue.webp",
    };
    assert.equal(artFileNameOf(strain, override), "custom-glue.webp");
  });
});

describe("artStatus / artImageSrc", () => {
  it("defaults artStatus to none and renders no image", () => {
    const strain = findStrain("GG4");
    assert.ok(strain);
    assert.equal(artStatusOf(null), "none");
    assert.equal(artImageSrc(strain, null), null);
  });

  it("renders the public path only when published", () => {
    const strain = findStrain("GG4");
    assert.ok(strain);
    const published: StrainIdentity = {
      canonicalName: "GG4",
      sourceConfidence: "high",
      artFileName: "gg4.webp",
      artStatus: "published",
    };
    assert.equal(artImageSrc(strain, published), "/strains/gg4.webp");

    const generated: StrainIdentity = { ...published, artStatus: "generated" };
    assert.equal(artImageSrc(strain, generated), null);
  });
});

describe("paletteForTime", () => {
  it("returns a palette for every time profile", () => {
    for (const tp of TIME_PROFILES) {
      const p = paletteForTime(tp);
      assert.ok(p.background.includes("gradient"));
      assert.ok(p.contentTone === "light" || p.contentTone === "dark");
      assert.match(p.accent, /^#[0-9a-fA-F]{3,8}$/);
    }
  });

  it("keeps morning/daytime light (dark text) and night dark (light text)", () => {
    assert.equal(paletteForTime("morning").contentTone, "dark");
    assert.equal(paletteForTime("daytime").contentTone, "dark");
    assert.equal(paletteForTime("night").contentTone, "light");
  });
});

describe("buildArtPrompt", () => {
  it("allows art-integrated text but forbids UI overlays and the clichés", () => {
    const strain = findStrain("GG4");
    assert.ok(strain);
    const prompt = buildArtPrompt(strain, getIdentity("GG4"));
    assert.match(prompt, /baked artistically into the scene/i);
    assert.match(prompt, /overlay/i);
    assert.match(prompt, /logos|watermark/i);
    assert.match(prompt, /no cannabis leaves/i);
    assert.match(prompt, /3:4/);
  });
});
