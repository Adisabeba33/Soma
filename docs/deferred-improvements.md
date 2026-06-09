# Deferred improvements — observation backlog

A running journal of issues and ideas we've noticed but **deliberately
not fixed yet**. The point is to capture them while they're fresh so
we don't lose context, then revisit when the right time comes (after
observation data, after a related refactor, when the trade-off
becomes worth it, etc.).

**This file is the source of truth across chat sessions.** When
opening a new chat with Claude or any other assistant, point them
here so they have the full historical context of "what we know we
should improve but chose not to right now."

## How to use this file

Each entry follows the same structure:

```
### #N — Short title
- **Found:** YYYY-MM-DD
- **Source:** who/what surfaced it (external review, internal test, …)
- **What:** brief description of the observation
- **Why deferred:** the explicit reason we're not fixing it now
- **Potential fix:** the shape of the eventual change
- **Estimated effort:** rough size
- **Trigger to revisit:** what condition should bring this back
```

When you fix one, **don't delete it** — move it to the bottom under
`## Resolved` with the PR number. The history of what we considered
and didn't do is itself valuable context.

---

## Open

### #1 — `modern-exotic` sensoryFamily cluster is too broad

- **Found:** 2026-06-09
- **Source:** External expert review (gas / White Hot Guava profile tests)
- **What:** The `modern-exotic` family currently groups very different
  sensory profiles under one label:
  - Fruity / candy: Runtz, Zoap, RS11, White Hot Guava, Garanimals
  - Funky / gas: Permanent Marker, Cap Junky
  - Mixed heavy: Donny Burger
  
  Consequence: a White Hot Guava fan (fruity-tropical preferences)
  rates Permanent Marker (gassy-funky modern) at 63 — engine reads the
  aroma honestly (PM doesn't smell tropical) so technically correct,
  but the user's expectation around "exotic-fan loves other exotics"
  isn't being met. The +5 sensory-family exact-match bonus fires for
  ALL pairings under `modern-exotic` regardless of how different they
  actually smell.

- **Why deferred:** In the specific test that exposed this, the engine's
  judgment is **arguably correct**: the user wrote `tropical/fruity` in
  preferences, PM smells gassy, the score reflects that mismatch. The
  expert's intuition over-generalizes "modern exotic" as one cluster.
  Splitting the family requires careful re-curation of ~20 strains
  AND a calibration check, which is not worth doing on a single piece
  of feedback.

- **Potential fix:**
  1. Split `modern-exotic` into `modern-fruity`, `modern-funky`,
     `modern-dessert`, `modern-gas` in identity-data
  2. Add adjacency rules between the sub-families
     (`modern-fruity ↔ modern-dessert`, `modern-funky ↔ gas-og`, etc.)
  3. Re-test on profiles where favourites span the modern-exotic
     era: White Hot Guava, Runtz, Permanent Marker, Cap Junky

- **Estimated effort:** 3–4 hours (curation + tests + calibration check)

- **Trigger to revisit:**
  - Another piece of feedback flags the same cluster being too broad
  - Identity curation expands to cover most of the catalog
    (≥ 100 strains with identity) — at that point the split is
    proportionally cheaper

---

### #2 — `behavioralFamily +12 dominance` over `sensoryFamily +5`

- **Found:** 2026-06-09
- **Source:** External expert review (GG4 / GMO Cookies test)
- **What:** When a candidate strain shares the user's favourite's
  `behavioralFamily` (e.g., `nighttime-indica`), it gets a +12 bonus.
  When it shares the `sensoryFamily` (e.g., `gas-og`), it gets +5
  exact / +3 adjacent. Result: a modern bx that **happens to share
  behavioral family** with the favourite gets bumped to the 88 ceiling
  even when its smell territory is very different.
  
  Concrete case: GG4 fan looking at GMO Cookies — different aroma
  cluster (gas-og vs garlic-funk) but both nighttime-indica → GMO
  hits 88 ceiling while old gas-school strains in different behavioral
  families end up lower.

- **Why deferred:** Lowering `behavioralFamily` max (from +12 to +8,
  say) would require recalibrating the whole 4–88 / 89–93 / 94–96
  band design. Risky without enough usage data to validate the new
  distribution. Better to wait for ≥ 2 weeks of observation on the
  current scoring shape.

- **Potential fix:**
  - Option A: cap `behavioralFamily` bonus to +8 when the
    `sensoryFamily` between candidate and favourite is unrelated.
    Keeps the lift for "same family + same smell" but trims the
    "right family wrong smell" overrewarded case.
  - Option B: lower the absolute max from +12 to +8 and rebalance
    the whole layer system.
  - Option C: introduce a separate "lifestyle/use-case family" axis
    distinct from behavioural-effect family.

- **Estimated effort:** 4–8 hours depending on option

- **Trigger to revisit:**
  - 2 weeks of `/stats` data confirming the bias matters at scale
  - Recalibration becomes necessary for other reasons (e.g., tag
    weighting work below)

---

### #3 — Tag weighting (Primary / Secondary)

- **Found:** 2026-05 (earlier in this session)
- **Source:** User idea + later external expert validation
- **What:** Every aroma/flavor/effect tag on a strain is currently
  worth the same in scoring. In reality, GG4's primary nose is
  `gassy`+`earthy`, with `pine`+`citrus` as secondary characters.
  Without weighting, a fan who likes the gas-primary character of
  GG4 looks identical to the engine as a fan of GG4's citrus
  secondary. Same goes for "Wedding Cake vs Pink Kush for a gas fan"
  cases where the precise smell weighting would matter.

- **Why deferred:**
  - Requires curating Primary/Secondary on every strain (~180 strains)
  - Doesn't have observational evidence yet that it's the bottleneck
  - The behavioural-family + archetype layers already do significant
    work in this direction

- **Potential fix:** Binary `primaryAromas?: string[]` / `primaryFlavors?`
  / `primaryEffects?` subset fields on `StrainProfile`. Engine reads
  with `weight=1.5` for primary tokens, `weight=1.0` for the rest.
  Recommended over numeric weights (less curation noise).

- **Estimated effort:** 5–7 hours core engine work + ongoing curation

- **Trigger to revisit:**
  - Observation data shows scoring precision is the actual bottleneck
  - We have a partner who can co-curate (sommelier-equivalent)

---

### #4 — Community Consensus blocks (`89% Deep Relaxation`, etc.)

- **Found:** 2026-06-09
- **Source:** External reviewer (curated strain page recommendation)
- **What:** The reviewer suggested showing "89% Deep Relaxation", "82%
  Sleepy", "Most Mentioned Notes: Pine, Fuel, Earth" style aggregate
  blocks on the strain detail page. Pattern lifted from Leafly /
  large-review sites.

- **Why deferred:** **We have ~0 real users so far.** Printing those
  percentages now would mean fabricating data, which contradicts the
  project's honesty-everywhere principle. The block would be visually
  reassuring but functionally fake.

- **Potential fix:** Wire up when we have enough RunAudit data with
  feedback signals (`liked`, `rating`) to compute non-trivial
  aggregates. Threshold: ≥ 1000 sessions with feedback OR ≥ 50
  ratings on a single strain.

- **Estimated effort:** 8–12 hours when data exists (aggregation
  pipeline + caching + UI block)

- **Trigger to revisit:**
  - RunAudit table crosses 1000 entries
  - We launch a "save your verdict" feedback UI that collects enough
    structured ratings

---

### #5 — Per-category source confidence (lineage / historical / community)

- **Found:** 2026-06-09
- **Source:** External reviewer (curated strain page recommendation)
- **What:** We have a single `sourceConfidence: low/medium/high` on
  identity. Reviewer suggested splitting into separate confidence
  signals for `Identity`, `Lineage`, `Historical data`, `Community
  consensus`. Lets us be honest about uncertainty at finer grain
  ("we know the breeder, we don't know the lineage").

- **Why deferred:** Adds curation overhead (4 confidence fields per
  strain instead of 1) for incremental clarity. Better to grow
  identity coverage first, then refine the confidence model on the
  records we have.

- **Potential fix:** Optional `lineageConfidence`, `historicalConfidence`
  fields on `StrainIdentity`, falling back to the overall
  `sourceConfidence` when not set.

- **Estimated effort:** 1 hour code + ongoing curation

- **Trigger to revisit:**
  - Identity coverage crosses ~100 strains (40 today)
  - We hit a real "this lineage is contested but the strain itself is
    well-documented" case we want to surface

---

### #6 — "Why It Matters" educational sections

- **Found:** 2026-06-09
- **Source:** External reviewer (curated strain page recommendation)
- **What:** Add a short paragraph per major strain explaining its
  cultural / genetic significance (e.g., "Northern Lights → the strain
  that taught the 80s what indica was supposed to feel like; many
  modern indicas trace back to it"). Turns SOMA from a sensory guide
  into a sensory + history archive.

- **Why deferred:** Worth doing but adds another curation field. Not
  shipped in the same PR as the pull-quote work (PR #48) to keep that
  PR focused. Should ship in a follow-up with curation for the 10–15
  historically-significant anchors.

- **Potential fix:** Optional `whyItMatters?: string` field on
  `StrainIdentity`. Renders as a separate "Why it matters" section
  below the Story, only when present.

- **Estimated effort:** 1 hour code + 1–2 hours curation for the
  initial anchor set

- **Trigger to revisit:** After 2 weeks of observation we're
  confident the strain-detail page is the right surface to invest
  more curated content in

---

### #7 — Visual storytelling: genetics timelines, history maps, regional origins

- **Found:** 2026-06-09
- **Source:** External reviewer (curated strain page recommendation)
- **What:** Reviewer suggested timeline blocks for genetics history,
  regional origins, etc. Aim: turn the strain page into something
  users "explore" rather than read once.

- **Why deferred:** Very large scope (multiple new components,
  significant per-strain curation, possibly image/map assets).
  Aspirational direction, not a near-term ship.

- **Potential fix:** A staged plan starting with the lowest-cost
  visual element (e.g., a horizontal genetics timeline reusing the
  existing parent / grandparent data) before any new curation is
  required.

- **Estimated effort:** Weeks of work spread across multiple PRs

- **Trigger to revisit:** Phase F or later, after the core engine
  and content strategy are stable

---

## Resolved

*(Move entries here with their resolving PR number when fixed. Empty
for now — every open item above is genuinely deferred.)*
