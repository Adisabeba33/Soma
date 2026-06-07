import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { buildSigil, sigilToSvg } from "../src/lib/sensory-sigil";
import { STRAINS } from "../src/lib/strain-data";

function seed(name: string) {
  const s = STRAINS.find((x) => x.name === name);
  if (!s) throw new Error(`missing ${name}`);
  return s;
}

describe("sensory sigil — deterministic & distinct", () => {
  it("is deterministic: the same strain renders identically every time", () => {
    const a = buildSigil(seed("GG4"));
    const b = buildSigil(seed("GG4"));
    assert.deepEqual(a, b);
  });

  it("differs between strains with different tags", () => {
    const gg4 = sigilToSvg(seed("GG4"));
    const gdp = sigilToSvg(seed("Granddaddy Purple"));
    assert.notEqual(gg4, gdp);
  });

  it("palette tracks aroma: gassy GG4 vs berry GDP get different colours", () => {
    const gg4 = buildSigil(seed("GG4"));
    const gdp = buildSigil(seed("Granddaddy Purple"));
    assert.notEqual(gg4.c0, gdp.c0);
  });

  it("silhouette tracks texture: electric strain is spikier than a smooth one", () => {
    // The outer path of an electric texture should swing further from its
    // mean radius than a smooth one. Compare radial variance.
    const variance = (name: string) => {
      const s = buildSigil(seed(name));
      const nums = s.outerPath
        .replace(/[MLZ]/g, " ")
        .trim()
        .split(/\s+/)
        .map(Number);
      const pts: number[] = [];
      const cx = s.size / 2;
      const cy = s.size / 2;
      for (let i = 0; i + 1 < nums.length; i += 2) {
        pts.push(Math.hypot(nums[i] - cx, nums[i + 1] - cy));
      }
      const mean = pts.reduce((a, b) => a + b, 0) / pts.length;
      return pts.reduce((a, r) => a + (r - mean) ** 2, 0) / pts.length;
    };
    // Green Crack = electric, Zkittlez = dreamy.
    assert.ok(
      variance("Green Crack") > variance("Zkittlez"),
      "electric texture should be spikier (higher radial variance) than dreamy",
    );
  });

  it("renders a sigil for every catalog strain without throwing", () => {
    for (const s of STRAINS) {
      const svg = sigilToSvg(s);
      assert.ok(svg.startsWith("<svg"));
    }
  });
});
