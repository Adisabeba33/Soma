import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { layoutParents } from "../src/lib/genetics-layout";
import type { StrainType } from "../src/lib/types";

// Minimal parent shape — the layout function only needs `name` for
// identity in test assertions and `type` for the clustering rule.
type P = { name: string; type?: StrainType | null };

const p = (name: string, type?: StrainType | null): P => ({ name, type });

describe("layoutParents — count-driven cases", () => {
  it("empty list → both columns empty", () => {
    const out = layoutParents<P>([]);
    assert.deepEqual(out, { left: [], right: [] });
  });

  it("single parent → goes left, right stays empty", () => {
    const out = layoutParents([p("Mom", "indica")]);
    assert.deepEqual(out, { left: [p("Mom", "indica")], right: [] });
  });

  it("two parents → one per side, order preserved", () => {
    const out = layoutParents([p("Mom", "indica"), p("Dad", "sativa")]);
    assert.deepEqual(out, {
      left: [p("Mom", "indica")],
      right: [p("Dad", "sativa")],
    });
  });
});

describe("layoutParents — 3-parent clustering by type", () => {
  it("two sativas + one hybrid → sativas cluster right, hybrid alone left (GG4 case)", () => {
    const out = layoutParents([
      p("Chem's Sister", "hybrid"),
      p("Sour Dubb", "sativa"),
      p("Chocolate Diesel", "sativa"),
    ]);
    assert.deepEqual(out.left.map((x) => x.name), ["Chem's Sister"]);
    assert.deepEqual(out.right.map((x) => x.name), [
      "Sour Dubb",
      "Chocolate Diesel",
    ]);
  });

  it("two indicas + one sativa → indicas cluster right, sativa alone left", () => {
    const out = layoutParents([
      p("Mom1", "indica"),
      p("Dad", "sativa"),
      p("Mom2", "indica"),
    ]);
    assert.deepEqual(out.left.map((x) => x.name), ["Dad"]);
    assert.deepEqual(out.right.map((x) => x.name), ["Mom1", "Mom2"]);
  });

  it("three parents all-different types → first solo left, rest right (no cluster)", () => {
    const out = layoutParents([
      p("First", "indica"),
      p("Second", "sativa"),
      p("Third", "hybrid"),
    ]);
    assert.deepEqual(out.left.map((x) => x.name), ["First"]);
    assert.deepEqual(out.right.map((x) => x.name), ["Second", "Third"]);
  });

  it("three parents all-same type → first solo left, rest right (no empty side)", () => {
    const out = layoutParents([
      p("A", "sativa"),
      p("B", "sativa"),
      p("C", "sativa"),
    ]);
    assert.deepEqual(out.left.map((x) => x.name), ["A"]);
    assert.deepEqual(out.right.map((x) => x.name), ["B", "C"]);
  });

  it("three parents with no type data → first solo left, rest right", () => {
    const out = layoutParents([p("A"), p("B"), p("C")]);
    assert.deepEqual(out.left.map((x) => x.name), ["A"]);
    assert.deepEqual(out.right.map((x) => x.name), ["B", "C"]);
  });

  it("three parents with mixed null types and one cluster still works", () => {
    const out = layoutParents([
      p("Mystery"),
      p("Sativa1", "sativa"),
      p("Sativa2", "sativa"),
    ]);
    // Two sativas cluster right; Mystery (no type) ends up left.
    assert.deepEqual(out.left.map((x) => x.name), ["Mystery"]);
    assert.deepEqual(out.right.map((x) => x.name), ["Sativa1", "Sativa2"]);
  });
});

describe("layoutParents — 4-parent edge cases", () => {
  it("2+2 split with clear majority cluster", () => {
    const out = layoutParents([
      p("A", "indica"),
      p("B", "sativa"),
      p("C", "sativa"),
      p("D", "sativa"),
    ]);
    // Three sativas cluster right, indica solo left.
    assert.deepEqual(out.left.map((x) => x.name), ["A"]);
    assert.deepEqual(out.right.map((x) => x.name), ["B", "C", "D"]);
  });

  it("4 parents 2+2 different types → first cluster wins right, others left", () => {
    const out = layoutParents([
      p("A", "indica"),
      p("B", "sativa"),
      p("C", "indica"),
      p("D", "sativa"),
    ]);
    // Indica was the first to reach a count of 2 → right.
    assert.deepEqual(out.left.map((x) => x.name), ["B", "D"]);
    assert.deepEqual(out.right.map((x) => x.name), ["A", "C"]);
  });
});
