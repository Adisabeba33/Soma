import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { createLatestWins } from "../src/lib/latest-wins";

describe("latest-wins write sequencing", () => {
  it("a single write is current until the next one starts", () => {
    const w = createLatestWins();
    const a = w.next();
    assert.equal(w.isCurrent(a), true);
    const b = w.next();
    assert.equal(w.isCurrent(a), false);
    assert.equal(w.isCurrent(b), true);
  });

  it("an older slow response can never win over a newer write", () => {
    const w = createLatestWins();
    // Simulate: drag commit A starts, then commit B starts, then A's slow
    // response lands last. A must be dropped, B applied.
    const a = w.next();
    const b = w.next();
    // B's response arrives first and applies.
    assert.equal(w.isCurrent(b), true);
    // A's response arrives late — stale, must not apply.
    assert.equal(w.isCurrent(a), false);
  });

  it("a reload invalidates in-flight writes and vice versa", () => {
    const w = createLatestWins();
    const patchSeq = w.next();
    const loadSeq = w.next(); // error-path reload starts after the patch
    assert.equal(w.isCurrent(patchSeq), false);
    assert.equal(w.isCurrent(loadSeq), true);
  });
});
