import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import {
  FAMILY_PALETTE_KEYS,
  paletteForFamily,
} from "../src/lib/sensory-family-palette";
import { IDENTITIES } from "../src/lib/strain-identity-data";

const LIVE_FAMILIES = [...new Set(IDENTITIES.map((i) => i.sensoryFamily))];

// The fallback object is a stable reference, so "family has no palette"
// is detectable by identity against a lookup that can never match.
const FALLBACK = paletteForFamily("__no-such-family__");

describe("sensory family palette coverage", () => {
  it("every live sensoryFamily value has its own palette (no silent fallback)", () => {
    for (const family of LIVE_FAMILIES) {
      assert.notStrictEqual(
        paletteForFamily(family),
        FALLBACK,
        `sensoryFamily "${family}" has no palette — catalog cards fall back silently`,
      );
    }
  });

  it("every palette key corresponds to a live sensoryFamily (no stale keys)", () => {
    const live = new Set(LIVE_FAMILIES);
    for (const key of FAMILY_PALETTE_KEYS) {
      assert.ok(
        live.has(key),
        `palette key "${key}" matches no strain's sensoryFamily — stale after a rename/split?`,
      );
    }
  });

  it("missing/unknown family still resolves to the fallback, never throws", () => {
    assert.strictEqual(paletteForFamily(null), FALLBACK);
    assert.strictEqual(paletteForFamily(undefined), FALLBACK);
    assert.strictEqual(paletteForFamily(""), FALLBACK);
  });
});
