import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  buildRadar,
  radarToSvg,
  axisValue,
  RADAR_AXES,
} from "../src/lib/sensory-radar";
import { STRAINS } from "../src/lib/strain-data";

function seed(name: string) {
  const s = STRAINS.find((x) => x.name === name);
  if (!s) throw new Error(`missing ${name}`);
  return s;
}

const axis = (label: string) => {
  const a = RADAR_AXES.find((x) => x.label === label);
  if (!a) throw new Error(`no axis ${label}`);
  return a;
};

describe("sensory radar — deterministic & data-driven", () => {
  it("is deterministic: same strain renders identically", () => {
    assert.deepEqual(buildRadar(seed("GG4")), buildRadar(seed("GG4")));
  });

  it("differs between strains with different effect profiles", () => {
    assert.notEqual(
      radarToSvg(seed("Green Crack")),
      radarToSvg(seed("Granddaddy Purple")),
    );
  });

  it("energetic sativa peaks on Energy; sleepy indica peaks on Sleep", () => {
    const gc = seed("Green Crack");
    const gdp = seed("Granddaddy Purple");
    assert.ok(
      axisValue(gc, axis("Energy")) > axisValue(gdp, axis("Energy")),
      "Green Crack should out-rank GDP on Energy",
    );
    assert.ok(
      axisValue(gdp, axis("Sleep")) > axisValue(gc, axis("Sleep")),
      "GDP should out-rank Green Crack on Sleep",
    );
  });

  it("palette tracks aroma: gassy GG4 vs berry GDP get different stroke colours", () => {
    assert.notEqual(buildRadar(seed("GG4")).stroke, buildRadar(seed("Granddaddy Purple")).stroke);
  });

  it("every axis value stays within [0,1]", () => {
    for (const s of STRAINS) {
      for (const ax of RADAR_AXES) {
        const v = axisValue(s, ax);
        assert.ok(v >= 0 && v <= 1, `${s.name}/${ax.label} out of range: ${v}`);
      }
    }
  });

  it("labels appear only when requested", () => {
    assert.equal(buildRadar(seed("GG4"), { labels: false }).axisLabels.length, 0);
    assert.equal(buildRadar(seed("GG4"), { labels: true }).axisLabels.length, RADAR_AXES.length);
  });

  it("renders a radar for every catalog strain without throwing", () => {
    for (const s of STRAINS) {
      assert.ok(radarToSvg(s).startsWith("<svg"));
    }
  });
});
