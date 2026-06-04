import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  normalizeGrowerKey,
  normalizeStrainQueryName,
} from "../src/lib/strain-normalize";

describe("normalizeStrainQueryName", () => {
  it("lowercases and trims", () => {
    assert.equal(normalizeStrainQueryName("  Gelato  "), "gelato");
    assert.equal(normalizeStrainQueryName("BLUE DREAM"), "blue dream");
  });

  it("collapses internal whitespace", () => {
    assert.equal(normalizeStrainQueryName("Blue    Dream"), "blue dream");
    assert.equal(normalizeStrainQueryName("Gelato\t33"), "gelato 33");
  });

  it("normalizes dashes (hyphen, en-dash, em-dash) to a space", () => {
    assert.equal(normalizeStrainQueryName("Gelato-33"), "gelato 33");
    assert.equal(normalizeStrainQueryName("Gelato–33"), "gelato 33");
    assert.equal(normalizeStrainQueryName("Gelato—33"), "gelato 33");
  });

  it("preserves strain numbers (distinct cuts)", () => {
    assert.notEqual(
      normalizeStrainQueryName("Gelato"),
      normalizeStrainQueryName("Gelato 33"),
    );
  });

  it("strips obvious punctuation noise", () => {
    assert.equal(normalizeStrainQueryName("Gelato #33"), "gelato 33");
    assert.equal(normalizeStrainQueryName("Gelato*"), "gelato");
    assert.equal(normalizeStrainQueryName("Gelato!!!"), "gelato");
  });

  it("clusters the duplicate cases from the brief", () => {
    const variants = [
      "Gelato",
      "gelato",
      " Gelato ",
      "GELATO",
      "gelato!",
    ];
    const normalized = variants.map(normalizeStrainQueryName);
    for (const n of normalized) assert.equal(n, "gelato");
  });

  it("keeps Gelato 33 and Gelato-33 in the same cluster", () => {
    assert.equal(
      normalizeStrainQueryName("Gelato 33"),
      normalizeStrainQueryName("Gelato-33"),
    );
  });

  it("returns empty string for empty / nullish input", () => {
    assert.equal(normalizeStrainQueryName(""), "");
    // @ts-expect-error: defensive against runtime nulls from JSON.
    assert.equal(normalizeStrainQueryName(null), "");
  });
});

describe("normalizeGrowerKey", () => {
  it("normalizes the same way as strain names", () => {
    assert.equal(normalizeGrowerKey("Jungle Boys"), "jungle boys");
    assert.equal(normalizeGrowerKey("  COOKIES  "), "cookies");
  });

  it("treats null / undefined / empty as an empty key", () => {
    assert.equal(normalizeGrowerKey(null), "");
    assert.equal(normalizeGrowerKey(undefined), "");
    assert.equal(normalizeGrowerKey(""), "");
    assert.equal(normalizeGrowerKey("   "), "");
  });
});
