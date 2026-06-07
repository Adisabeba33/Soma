import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  isKnownStrain,
  resolveCanonical,
} from "../src/lib/known-strains";

describe("isKnownStrain", () => {
  it("returns true for a canonical seed name", () => {
    assert.equal(isKnownStrain("Wedding Cake"), true);
    assert.equal(isKnownStrain("Northern Lights"), true);
    assert.equal(isKnownStrain("GG4"), true);
  });

  it("returns true for known aliases", () => {
    // GG4 is alias-mapped from Gorilla Glue #4
    assert.equal(isKnownStrain("Gorilla Glue #4"), true);
    // GDP is alias for Granddaddy Purple
    assert.equal(isKnownStrain("GDP"), true);
    // NL is alias for Northern Lights
    assert.equal(isKnownStrain("NL"), true);
  });

  it("is case-insensitive", () => {
    assert.equal(isKnownStrain("wedding cake"), true);
    assert.equal(isKnownStrain("NORTHERN LIGHTS"), true);
    assert.equal(isKnownStrain("gG4"), true);
  });

  it("trims whitespace", () => {
    assert.equal(isKnownStrain("  Wedding Cake  "), true);
    assert.equal(isKnownStrain("\tGDP\n"), true);
  });

  it("returns false for unknown strains", () => {
    assert.equal(isKnownStrain("Cosmic Garlic Funk"), false);
    assert.equal(isKnownStrain("Made Up Strain XYZ 9000"), false);
  });

  it("returns false for empty / whitespace input", () => {
    assert.equal(isKnownStrain(""), false);
    assert.equal(isKnownStrain("   "), false);
  });
});

describe("resolveCanonical", () => {
  it("returns canonical name for a seed entry", () => {
    assert.equal(resolveCanonical("Wedding Cake"), "Wedding Cake");
  });

  it("resolves an alias to its canonical name", () => {
    assert.equal(resolveCanonical("GDP"), "Granddaddy Purple");
    assert.equal(resolveCanonical("NL"), "Northern Lights");
    assert.equal(resolveCanonical("Gorilla Glue #4"), "GG4");
  });

  it("returns null for unknown strains", () => {
    assert.equal(resolveCanonical("Cosmic Garlic Funk"), null);
    assert.equal(resolveCanonical(""), null);
  });
});
