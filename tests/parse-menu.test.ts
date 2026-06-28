import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { parseMenuRich } from "../src/lib/parse-menu";
import { MESSY_MENU_LINES } from "./fixtures/messy-menus";

function parseFirst(line: string) {
  const items = parseMenuRich(line);
  assert.ok(items.length >= 1, `Expected at least one item from: ${line}`);
  return items[0];
}

describe("parseMenuRich — structured extraction", () => {
  it("pulls strain, grower, weight, thc, price from a standard line", () => {
    const item = parseFirst("Wedding Cake by Jungle Boys 3.5g 28% $60");
    assert.equal(item.strainName, "Wedding Cake");
    assert.equal(item.grower, "Jungle Boys");
    assert.equal(item.weight, "3.5g");
    assert.equal(item.thcPercent, 28);
    assert.equal(item.price, 60);
    assert.equal(item.confidence, "high");
  });

  it("strips a brand prefix and keeps the strain alone", () => {
    const item = parseFirst("Stiiizy: Gelato 3.5g $40");
    assert.equal(item.strainName, "Gelato");
    assert.equal(item.grower, "Stiiizy");
    assert.equal(item.weight, "3.5g");
    assert.equal(item.price, 40);
  });

  it("reads grower from a trailing parenthetical", () => {
    const item = parseFirst("Sour Diesel (Cookies) - 22% - $55");
    assert.equal(item.strainName, "Sour Diesel");
    assert.equal(item.grower, "Cookies");
    assert.equal(item.thcPercent, 22);
    assert.equal(item.price, 55);
  });

  it("handles fraction weights like 1/8", () => {
    const item = parseFirst("GG4 1/8 $50");
    assert.equal(item.strainName, "GG4");
    assert.equal(item.weight, "1/8");
    assert.equal(item.price, 50);
  });

  it("expands a comma-separated single line into multiple items", () => {
    const items = parseMenuRich(
      "GMO Cookies, Forbidden Fruit, Runtz, Pineapple Express",
    );
    const names = items.map((i) => i.strainName);
    assert.deepEqual(names, [
      "GMO Cookies",
      "Forbidden Fruit",
      "Runtz",
      "Pineapple Express",
    ]);
  });

  it("splits a combined 'A / B / C' listing into separate strains", () => {
    const names = parseMenuRich(
      "Permanent Shade / Xeno / Brain Wash",
    ).map((i) => i.strainName);
    assert.deepEqual(names, ["Permanent Shade", "Xeno", "Brain Wash"]);
  });

  it("does not split a name with an internal slash (AC/DC) or fraction weight", () => {
    assert.equal(parseFirst("AC/DC 3.5g $40").strainName, "AC/DC");
    // Spaced slash splits, but "1 / 8" reads as a weight, leaving one strain.
    const items = parseMenuRich("Gelato 1 / 8 $50");
    assert.equal(items.length, 1);
    assert.equal(items[0].strainName, "Gelato");
  });

  it("preserves rawLine for unclear rows rather than dropping them", () => {
    const items = parseMenuRich(
      "🔥 SPECIAL: Lemon Cherry Gelato — 30% THC — was $70 now $55",
    );
    assert.equal(items.length, 1);
    const item = items[0];
    // The parser may not get the name perfectly here, but the raw line must
    // survive so the user can still see what came in.
    assert.ok(item.rawLine.includes("Lemon Cherry Gelato"));
    assert.ok(item.rawLine.length > 0);
  });

  it("drops obvious category headings (EDIBLES, Top Shelf)", () => {
    assert.equal(parseMenuRich("EDIBLES").length, 0);
    assert.equal(parseMenuRich("Top Shelf").length, 0);
  });

  it("ignores empty / whitespace-only input", () => {
    assert.equal(parseMenuRich("   ").length, 0);
    assert.equal(parseMenuRich("").length, 0);
  });

  it("flags a long noisy line as low confidence and keeps it", () => {
    const item = parseFirst(
      "Some Random Strain Name That Is Way Too Long With Extra Promo Text 20% off today",
    );
    assert.notEqual(item.confidence, "high");
    assert.ok(item.warnings.length > 0);
    assert.ok(item.rawLine.length > 0);
  });

  it("keeps hyphenated strain names readable (Do-Si-Dos)", () => {
    const item = parseFirst("Do-Si-Dos 1/8 $45");
    assert.match(item.strainName, /Do[-– ]?Si[-– ]?Dos/i);
    assert.equal(item.weight, "1/8");
    assert.equal(item.price, 45);
  });

  it("does not crash on any line in the messy-menu fixture", () => {
    for (const line of MESSY_MENU_LINES) {
      // Should never throw.
      parseMenuRich(line);
    }
  });

  it("dedupes case-insensitively across separate lines", () => {
    const items = parseMenuRich("Blue Dream\nblue dream\nBLUE DREAM");
    assert.equal(items.length, 1);
  });
});
