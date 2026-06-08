// Pure layout split for the Genetics diagram on the strain detail page.
// Decides which parents go on the left vs right of the centre leaf,
// keeping the visual symmetric even when parent count is awkward.
//
// Rules (matching the design discussion):
//   - 0 parents: empty both sides
//   - 1 parent:  goes left (centre's right column stays empty)
//   - 2 parents: one each side (the reference Animal Mints layout)
//   - 3+ parents: cluster by sensory type. If 2 or more parents share a
//                 type, that cluster goes RIGHT and the odd parent(s) go
//                 LEFT. So GG4's (Chem's Sister · Sour Dubb · Chocolate
//                 Diesel) — one hybrid, two sativas — lands with both
//                 sativas stacked on the right and Chem's Sister alone
//                 on the left, each with its own arrow into the centre.
//                 No clustering signal (all-different or all-same types)
//                 falls back to "first parent left, rest right" so we
//                 never produce an empty column.

import type { StrainType } from "./types";

// Minimal shape the layout cares about — anything with an optional type.
// Keeps the function reusable without dragging in UI-only fields.
export interface LayoutableParent {
  type?: StrainType | null;
}

export interface LayoutResult<T> {
  left: T[];
  right: T[];
}

export function layoutParents<T extends LayoutableParent>(
  parents: T[],
): LayoutResult<T> {
  if (parents.length === 0) return { left: [], right: [] };
  if (parents.length === 1) return { left: [parents[0]], right: [] };
  if (parents.length === 2)
    return { left: [parents[0]], right: [parents[1]] };

  // 3+ parents: try clustering by type.
  const counts = new Map<StrainType, number>();
  for (const p of parents) {
    if (p.type) counts.set(p.type, (counts.get(p.type) ?? 0) + 1);
  }

  // Find a type with ≥ 2 occurrences (a real cluster). Ties resolved by
  // first occurrence in the parents list — stable, deterministic.
  let majority: StrainType | null = null;
  for (const p of parents) {
    if (!p.type) continue;
    if ((counts.get(p.type) ?? 0) >= 2) {
      majority = p.type;
      break;
    }
  }

  if (majority !== null) {
    const right = parents.filter((p) => p.type === majority);
    const left = parents.filter((p) => p.type !== majority);
    // Only use the clustering when both columns end up populated;
    // otherwise (all parents same type) fall through to the order
    // fallback so we never render an empty side.
    if (left.length > 0 && right.length > 0) {
      return { left, right };
    }
  }

  // No clustering signal — first parent solo on left, rest stacked on
  // right. Keeps the visual symmetric even without type data.
  return {
    left: [parents[0]],
    right: parents.slice(1),
  };
}
