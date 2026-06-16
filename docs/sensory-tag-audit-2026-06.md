# Sensory Tag Audit — June 2026

A catalog-wide audit and enrichment of strain sensory tags, performed with
Claude Code. This document is the durable record of what was done, why, and how.

- **Date:** 2026-06-16
- **Performed by:** Claude Code (automated research + edits, human-reviewed)
- **Branch / PR:** `claude/github-project-review-nDujE` → PR #206
- **File changed:** `src/lib/strain-data.ts` (only)
- **Result:** `tsc --noEmit` clean, 410/410 tests pass.

## Goal

Improve recommendation quality by correcting inaccurate sensory tags and, above
all, by populating **primary** tags (`primaryAromas` / `primaryFlavors` /
`primaryEffects`) — the signature/dominant notes of each strain — which were
essentially absent across the long tail of the catalog.

## Scope

| Group | Count | Action |
| --- | --- | --- |
| Total strains | 440 | — |
| **Audited (targets)** | **377** | corrected tags + populated `primary*` |
| **Anchors (excluded)** | **63** | left byte-for-byte untouched |

**Why the 63 anchors were excluded.** A pilot on 20 famous strains (GG4, Blue
Dream, Green Crack, …) broke 13 engine tests: the scoring test suite hardwires
the exact tag arrays of those strains as invariants (e.g. `tag-weighting`,
`effect-archetype`, `behavioral-family`, `sensory-radar`). Changing their tags
would destabilize the engine's regression guarantees for marginal benefit, since
those strains were already well-curated. By decision, all strains referenced by
name in `tests/` were left unchanged.

## Method

- The 377 targets were split into 16 batches and researched in parallel.
- Each strain's profile was derived from **cross-source consensus**: Leafly,
  AllBud, Wikileaf, Leafwell, Weedmaps, Seedfinder, and terpene-profile pages
  (Abstrax et al.). No tags were invented.
- Every descriptor was mapped into the project's **fixed tag vocabulary**.
  Out-of-vocab notes were mapped to the closest token, e.g. lemon/lime→`citrus`,
  gas/fuel→`gassy`, pepper→`spicy`, lavender→`floral`, mango/pineapple→`tropical`,
  grape→`grape` (flavor) + `berry` (aroma), coffee/chocolate→`nutty`,
  menthol→`mint` (flavor only).

### Edit policy (balanced / conservative)

- Start from the current tags; **keep** tags that match consensus.
- **Add** an aroma/flavor/effect only if it is clearly dominant across sources.
- **Remove** a tag only if it is clearly wrong (no source support).
- Leave contested/minor tags in place.
- Change `type` / `potency` only when the current value is clearly wrong.
- **Always set `primary*`** (1–2 tokens each), as a subset of the final arrays.
- Thinly-sourced/obscure landraces: keep arrays as-is, add only `primary*`.

## What changed

- **`primary*` populated on all 377 targets** — the main signal win.
- **Tag corrections**: e.g. `The Soap` reoriented to mint/pine/cheese;
  purple strains given grape/berry; mango-forward strains given tropical;
  coffee/chocolate strains given nutty.
- **Type/potency fixes** (clear-consensus only): `Blockhead` (energizing →
  couch-lock indica), `SFV OG`, `Ice`, `Honey Bun`, `Khalifa Kush`,
  `Sour Tsunami`, `High Country Diesel`, and a few others.
- **~15 thin-source landraces** (e.g. Sinai, Korean, Persian, Angola Roja)
  left as-is apart from `primary*`.

## Validation

- Custom validator: every token in-vocab; every `primary*` ⊆ its parent array;
  array sizes within bounds (aromas 3–5, flavors 3–4, effects 4–5, traits 2–4).
- `tsc --noEmit`: clean.
- Full suite: **410/410 tests pass.**
- `git diff` touches only `src/lib/strain-data.ts`; anchors unchanged.

## How `primary*` affects the engine

In `src/lib/taste-engine.ts`, each axis (aroma/flavor/effect) is scored by
**coverage** = matched preferences / (matched + missed). The weight of a match
depends on whether the matched token is one of the strain's primary tokens:

```
PRIMARY_TAG_WEIGHT = 1.5   // match on a strain's signature note
(normal match)     = 1.0
TRACE_TAG_WEIGHT   = 0.33  // faint/trace note
```

So a match on a strain's **dominant** note is worth 50% more than a match on a
merely-listed note. Example — a user who wants `citrus`: a strain where `citrus`
is *primary* (a lemon-forward strain) scores higher than one where `citrus` is
just a secondary tag. Before this audit the long tail had no primary signal, so
all notes counted equally; now each strain's dominant note is distinguished,
sharpening the ranking.
