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

> **✓ Resolved (2026-06-10).** Identity coverage reached 400/400 and
> `modern-exotic` had ballooned to 60 strains, so the trigger was met. Split
> it into `candy-exotic` (37, sweet/fruity/berry candy), `funky-exotic` (11,
> gas/cheese/diesel funk), `gelato-exotic` (10, MAC/gelato/sherbet creamy-gas)
> and moved the guava-tropical strains into the existing `tropical-fruit`.
> Added sub-family adjacency (candy↔tropical-fruit, candy↔dessert-cookies,
> gelato↔dessert-cookies, gelato↔candy, funky↔gas-og, funky↔garlic-funk) so
> near neighbours still get the partial bonus. Reviewer's gap is closed: a
> White Hot Guava (tropical-fruit) fan no longer gets a same-family bonus on
> Permanent Marker (funky-exotic). Tests in `tests/modern-exotic-split.test.ts`.

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

> **◑ Engine shipped (2026-06-10), curation ongoing.** Added optional
> `primaryAromas` / `primaryFlavors` / `primaryEffects` subsets on
> `StrainProfile`. `setScore` now weights a matched preferred tag 1.5× when
> it lands on a primary token (1.0× secondary), via a bounded coverage
> formula `matchedWeight / (matchedWeight + unmatched)` that reduces exactly
> to the old unweighted score when a strain has no primaries — so it's a
> no-op until curated (existing calibration unchanged). Seeded the first ~10
> reference strains (GG4, Sour Diesel, OG Kush, Chemdawg, Northern Lights,
> Granddaddy Purple, Wedding Cake, Blue Dream, White Hot Guava, Super Lemon
> Haze). **Remaining:** curate primaries onto the rest of the catalogue over
> time — the field is optional, so this can be incremental.

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

> **✓ Resolved (2026-06-10).** Added optional `lineageConfidence` /
> `historicalConfidence` on `StrainIdentity` with `lineageConfidenceOf` /
> `historicalConfidenceOf` helpers that fall back to `sourceConfidence`. The
> strain page surfaces a "Lineage confidence" caption in the Genetics
> section only when it differs from the overall confidence (seeded on Sour
> Diesel, OG Kush, Chemdawg — contested parentage, well-documented strains).
> Community-consensus confidence stays deferred under #4 (needs real data).

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

> **✓ Resolved (2026-06-10).** Added optional `whyItMatters` on
> `StrainIdentity`, rendered as its own "Why it matters" section below the
> Story (only when present). Seeded the first historical anchors: GG4, Sour
> Diesel, OG Kush, Chemdawg, Northern Lights. More anchors can be curated
> over time onto the same field.

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

### #8 — Multi-favourite weighting (sensory-family influence balanced across favourites)

- **Found:** 2026-06-09
- **Source:** External reviewer (live testing review, second pass)
- **What:** When a user has multiple favourites that span sensory
  families (e.g., GG4 + OG Kush + White Hot Guava), the OG/gas-og
  weighting dominates because two of three favourites cluster there.
  White Hot Guava's modern-exotic family ends up under-represented in
  the scoring even though it's a stated anchor.
  
  Related but distinct from #2 (which is about behavioural-family
  dominance over sensoryFamily): this one is about IMBALANCE between
  the user's own favourites, not between different layer signals.

- **Why deferred:** Picking the right weighting strategy needs more
  observation data — there are competing intuitions ("each favourite
  is independently valid" vs "favourites cluster organically; the
  cluster IS the signal"). The current "max across favourites" for
  similarity + the new position-weighting from PR #50 covers the
  simpler "first favourite is the primary" case.

- **Potential fix:**
  - Option A: Calculate `sensoryFamilyBonus` from ALL favourites, not
    just any-match — give partial credit when the candidate aligns
    with the user's MINORITY favourite family.
  - Option B: Treat the bonus per-favourite and aggregate the max,
    but boost the boost when one favourite stands alone in its
    family (compensating for being outnumbered).

- **Estimated effort:** 3–4 hours

- **Trigger to revisit:**
  - 2+ weeks of `/stats` data showing many multi-family favourite
    profiles (we don't know if this is common yet)
  - The modern-exotic split from #1 also lands, which may dissolve
    the issue at the source

---

### #9 — Aroma intensity preference (subtle / moderate / loud / offensive)

- **Found:** 2026-06-09
- **Source:** External reviewer (live testing review, second pass)
- **What:** The questionnaire collects which aromas the user wants
  (gassy, citrus, …) but not HOW LOUD they want them. A user who
  selects `gassy` could mean a faintly gassy hybrid or a Gas Face
  style "smell hits the room" loudness. Without an intensity axis the
  engine can't separate Blue Dream from Gas Face when their other
  tags overlap.

- **Why deferred:** Adds a new questionnaire dimension AND a new
  per-strain attribute (intensity is grower-and-pheno specific, not
  just strain-intrinsic). Best done after observation confirms the
  intensity confusion is a real source of bad recommendations.

- **Potential fix:**
  - New profile field `aromaIntensity?: "subtle" | "moderate" | "loud" | "offensive"`
  - New optional `intensityLevel` on `StrainIdentity` (curator estimate)
  - Engine penalty for large intensity mismatch (a "subtle" preferer
    looking at GMO Cookies gets a few points knocked off)

- **Estimated effort:** 4–6 hours code + ongoing curation

- **Trigger to revisit:**
  - We hit a user case where intensity mismatch produced a clearly
    wrong recommendation that affected someone's purchase

---

### #10 — Novelty vs familiarity exploration mode

- **Found:** 2026-06-09
- **Source:** External reviewer (live testing review, second pass)
- **What:** The engine answers "what is closest to my profile?" but a
  user often wants "what is close to my profile but still new?". The
  old `lookingFor: "similar" | "new"` field captured this intent but
  it never made it into scoring — it was a label, not a signal. The
  reviewer's framing is sharper: a 4-state spectrum from "closest"
  → "surprise me", controlling how much the engine should explore
  outside the user's known territory.

- **Why deferred:**
  - Requires a UI / questionnaire choice change AND a real scoring
    change. Not a quick win.
  - It's also unclear whether the right place to inject this is the
    scoring layer or the post-scoring presentation layer (e.g., the
    Compare result page could expose "show me the closest" vs "show
    me one wild card").

- **Potential fix:**
  - Profile field: `explorationMode: "closest" | "near" | "compatible-new" | "surprise"`
  - Engine: when set to compatible-new or surprise, add a bonus for
    strains that are sensory-family ADJACENT to the favourites (not
    exact match), and a small penalty for exact matches. Effectively
    rotates the search axis.

- **Estimated effort:** 5–7 hours

- **Trigger to revisit:**
  - We see users completing Taste Match and immediately running the
    same profile against new menus expecting variety (the data will
    show this pattern in `/stats`)

---

### #11 — Observed Preference Learning (the highest-leverage open item)

- **Found:** 2026-06-09
- **Source:** External reviewer (multi-pass live testing, summary
  observation: "this can be SOMA's single biggest accuracy
  improvement without rebuilding the engine")
- **What:** The current scoring relies on what the user *stated* —
  questionnaire answers + listed Favourites. What's missing is what
  the user *actually demonstrates*: strains they returned to,
  confirmed as good picks, or that consistently rate high after they
  bought them. Example: a profile with GG4 / OG Kush / White Hot
  Guava as anchors, but the user reports repeatedly that Gary Payton
  is one of their actual favourites in practice. The engine has no
  way to fold "Gary Payton works for this person" back into future
  scoring even though that's exactly the signal that would matter
  most.
  
  This is structurally separate from the other deferred items
  because it's an entirely new data axis ("revealed preference")
  rather than tuning of an existing one. The framing the reviewer
  reaches for is the right one: move from
  
  > "we match strains to your profile"
  
  to
  
  > "we know which strains you actually love."

- **What we already have (infrastructure):** Roughly half the work
  is already done quietly.
  
  - `Feedback` table in Prisma (`purchased`, `liked`, `rating`,
    `notes` per Recommendation)
  - `evaluateFeedback()` in `taste-engine.ts` — applies a bounded
    `±12` adjustment to each score based on similarity-weighted
    feedback signals
  - `getFeedbackSignals()` reads feedback at scoring time
  - `scoreStrain()` is already wired: every score reflects accumulated
    feedback if any exists
  - `/api/feedback` saves new entries
  - `FeedbackControl` component (Yes/No purchased + Yes/No liked +
    5-star rating) exists on the `/saved` page
  
  So when a user marks a saved recommendation as `liked: true`, the
  signal already feeds back into future scoring. **Silently and
  invisibly.**

- **Why this hasn't moved the needle yet:** The UX never invites the
  user to actually leave feedback. The only place it can be left
  today is the `/saved` page after explicitly saving a session.
  No prompt appears after a Compare or Taste Match run. The signal
  is therefore mostly empty in production — the engine waits for
  feedback that almost nobody is asked for.

- **What's missing (UX):**
  - Post-Compare prompt: "Did you try any of these? Tell us how it
    went" with a 4-state quick-rate (Loved it / Good / Neutral /
    Would not buy again) per strain
  - Post-TasteMatch follow-up: same pattern on the result page
  - Reminder loop: a return-visit nudge ("you compared 5 strains 4
    days ago — anything stand out?")
  - Visible profile evolution: a small panel on the profile page or
    in `/stats` that reads "based on your feedback, Gary Payton has
    joined your sensory territory" — turns the feedback loop from
    invisible into a reason to keep contributing
  - Maybe a "promote to Favourite" affordance once feedback for a
    strain crosses a threshold

- **What's missing (engine — if we want more than the current ±12
  adjustment):**
  - Stronger weighting once a strain has consistent
    multi-touch positive feedback (treat it like a "soft favourite"
    in `referenceSimilarity` with a smaller position weight than
    explicit Favourites)
  - Possibly a 4-state signal mapped to a numeric weight rather than
    the current binary `liked: boolean`
  - Calibration check: with real feedback flowing, the ±12 cap may
    be too tight or too loose — measure once the data is real

- **Potential fix (staged):**
  1. **Stage 1 — Collect:** Inline 4-state quick-rate on Compare
     results page + a follow-up prompt the next time the user returns.
     Persists to the existing `Feedback` table (extend `liked:
     boolean` to a `verdict: "loved" | "good" | "neutral" | "avoid"`
     enum, falling back to the boolean for old rows).
  2. **Stage 2 — Surface:** Add a small "your evolved profile" panel
     so the user sees the signal isn't going into a void.
  3. **Stage 3 — Tune:** Once enough feedback rows exist (≥ 500
     across users), revisit the magnitude of the feedback adjustment
     and the trust ramp.

- **Estimated effort:**
  - Stage 1: 6–8 hours (UI + schema migration + API tweaks + tests)
  - Stage 2: 3–5 hours
  - Stage 3: gated on data; effort TBD

- **Trigger to revisit:**
  - We're ready to ship a feature that actively asks users for
    feedback (vs the current passive collection)
  - Or when we want to move SOMA's positioning from "sensory guide"
    to "sensory mirror"

- **Priority note:** Of every open item in this journal, this is the
  one with the largest upside per hour invested — partly because
  the engine half is already done. When picking the next non-quick-
  win to fund, **start here**.

---

### #12 — Collectible cards system (verified, owned strains as artifacts)

- **Found:** 2026-06-09
- **Source:** Owner / strategic conversation while reviewing the
  catalog UI redesign mockup. The card layout itself is a near-term
  ship (Stage 1 below); this entry captures the larger product idea
  the card aesthetic unlocks.
- **What:** Turn each strain card from "a search result" into "an
  artifact in the user's personal sensory archive". Three components
  build on each other:

  1. **Photo-verified ownership.** After running Compare or Taste
     Match, the user can attach a photo of the physical product
     (dispensary bag, jar label, package) to a strain. The image
     persists alongside the verdict from #11, marking that strain as
     `owned` on the user's profile.

  2. **Personal collection view.** A page (likely `/profile` or
     `/my/collection`) shows every strain the user has marked owned,
     with their own verdict pill + photo. Reads like a sommelier
     tasting log, not a list of search results.

  3. **Rarity badges.** Per-strain badges based on properties already
     in identity records:
       - `Classic OG` for the gas-og / kush-classic anchors
       - `Modern bx` for recent Cookies/Runtz-line releases
       - `Regional exclusive` when grower / breeder is geographically
         narrow
       - `Rare phenotype` when curatorNote calls out a specific cut
       - `Heritage genetics` for landraces and 80s/90s breeding stock
     Badges aren't gamification for its own sake — they make the
     archive feel curated, like a wine cellar entry vs a barcode.

- **Why this is strategically aligned with SOMA's positioning:**
  - Sommelier framing — "you've tried this, here's what it was, here's
    the verdict you left" is exactly what the project was supposed to
    feel like
  - Engagement multiplier — collected strains give a reason to come
    back beyond "what to buy next"
  - **Strongest possible feedback signal** — a photo + verdict beats
    any star rating or click. Combined with #11, this is the highest-
    integrity data we can collect
  - Solves the "0 users" cold start: people who would otherwise leave
    after one Taste Match come back to log what they actually bought

- **What we already have:**
  - `FeedbackPill` from PR #59 — 4-state verdict per strain
  - `StrainFeedback` table — userId / strainName / verdict already
    persisted with the right unique key
  - `getFeedbackSignals` reads it back into scoring
  - Cards layout from the immediate Stage 1 PR (catalog redesign)
  - sensoryFamily / lineage / curatorNote on every identity record —
    enough metadata to derive most rarity badges programmatically

- **What's missing:**
  - Photo upload endpoint + storage (Vercel Blob, S3, or
    Supabase Storage — same tier of decision)
  - Schema extension on StrainFeedback (or new model) to carry the
    photo reference and `owned` flag
  - Collection page UI
  - Rarity-badge derivation (mostly pure-function over existing data,
    plus a small curator-defined override map)

- **Honest scope:** This is a real product feature, not a one-PR ship.
  Roughly:
  - Stage A: photo attach on FeedbackPill, schema + storage — 4-6h
  - Stage B: collection view on profile — 3-4h
  - Stage C: rarity-badge logic + UI on cards — 4-6h
  - Stage D: moderation surface (when other users' photos show in
    aggregate views — distant future) — gated on social features

- **Trigger to revisit:**
  - Card-redesign Stage 1 ships and the owner wants to push the
    "collectible" framing further
  - We hit a moment where #11 is collecting decent verdict data but
    users aren't returning often enough — photo-attach is a strong
    return-reason
  - A user explicitly asks "where do I keep track of what I've tried"

- **Connection to other open items:**
  - **#11 Observed Preference Learning** — this entry is the natural
    extension. #11 collects a verdict; #12 attaches a verified
    artifact to that verdict. Same `StrainFeedback` table.
  - Card UI redesign (Stage 1, near-term PR) — sets up the visual
    container this feature lives in.

---

### #13 — Lineage / genetics affinity layer

- **Found:** 2026-06-12
- **Source:** Owner's live testing of a GG4 + OG Kush + White Hot Guava
  favourites profile (external expert read), reproduced against the engine.
- **What:** In a favourites-only profile (no explicit preferred tags), every
  sensory sub-score is NEUTRAL (52), so differentiation is dominated by
  `referenceSimilarity` (raw tag-Jaccard with the favourites) plus the small
  sensory-family bonus. A strain that is *genetically* OG/gas kin but whose
  **surface tags have drifted** gets under-rewarded, because lineage is shown
  in the UI but **never scored**.
  - Reproduced (GG4 + OG Kush + White Hot Guava):
    Triangle Kush 77 (ref 97), Larry OG 75 (ref 85), Gary Payton 71 (ref 72),
    Marshmallow OG 57, **Pink Kush 56 (ref 40)**, Garlic Breath 56.
  - Pink Kush is gas-og (same family as the favourites, gets +5) but its
    `floral, sweet, earthy, gassy` tags dilute the Jaccard, so it lands near
    "doesn't fit". Larry OG (a direct OG Kush child) scores fine because its
    tags *also* overlap — but the win is for the wrong reason (tags, not the
    OG Kush parentage).
  - Note: adding White Hot Guava (a third, cross-family favourite) lifted
    Gary Payton 57 → 71 — the multi-modal model (idea 1) working as intended.
    So several apparent anomalies dissolve with a full 3-favourite profile;
    **Pink Kush is the clean residual case** for this layer.

- **Why deferred:** A new scoring layer is calibration-sensitive, and it only
  helps where lineage is curated — and lineage data is currently **sparse**
  (Pink Kush, Triangle Kush, Marshmallow OG have *no* parents recorded). So
  it pairs with curation, and shouldn't be rushed.

- **Potential fix (phased, like the multi-modal work):**
  1. `src/lib/lineage-affinity.ts` — pure: given a candidate and the user's
     favourites, return a bounded affinity from shared parents / shared
     grandparents / same direct line (via the identity `lineage` data).
     No-op (0) when either side has no lineage. + tests.
  2. Engine: add `lineageMod` to `raw` under a gate; no-op when 0, so
     existing calibration is untouched.
  3. Curate lineage for the OG/gas anchors so the layer actually fires
     (Pink Kush → Hindu Kush / OG kin, Triangle Kush → OG line, etc.).

- **Estimated effort:** 4–6 hours engine + ongoing lineage curation.

- **Trigger to revisit:** This entry (owner flagged it). Build when we pick
  up the next engine improvement; it's the "family/genetics" signal the
  expert independently intuited.

- **Follow-up audit (2026-06-12) — it's a design choice, NOT a data/ranking
  bug.** A second expert report flagged Pink Kush as under-scored (43–55%)
  and suspected (1) wrong metadata, (2) a relaxation penalty, (3) a scoring
  bias. We re-ran with the full profile (favs GG4/OG Kush/White Hot Guava;
  preferred aromas gassy,diesel,earthy,pine,skunky,nutty; effects relaxed,
  calm,happy,giggly,uplifted) and the audit refuted all three:
  - **Metadata correct:** Pink Kush = `floral,sweet,earthy,gassy` /
    `relaxed,sleepy,body-heavy,euphoric,calm`, gas-og. Accurate for a sweet,
    sedating kush — not mis-tagged.
  - **No penalty:** `conflicts` is empty.
  - **No anti-Pink-Kush bias:** in the recommended *pure-Kush* test it ranks
    at the **top** of the non-favourites — OG Kush 94 (anchor), **Pink Kush
    55**, Kosher Kush 54, Hindu Kush 50, Purple Kush 43.
  - **55% is honest:** the profile asks for pine/diesel/skunky + happy/giggly/
    uplifted; Pink Kush matches only gassy,earthy and relaxed,calm (it's
    sedating, no upbeat lift), so gassier/pinier kushes legitimately rank
    above it for this gas-forward profile.
  So **don't "fix" Pink Kush data.** Whether it should reach 65–75 is exactly
  the question this #13 layer decides: should OG/Kush *kinship* outweigh the
  user's stated sensory preferences? That's a deliberate call, not a bug.
  (Optional cosmetic: real Pink Kush sometimes shows pine — adding `pine`
  would nudge it a couple of points, but won't reach 65–75.)

---

### #14 — Family preference layer (seek / avoid by strain family)

- **Found:** 2026-06-12
- **Source:** Expert audit (Mint-family test) — distinguishes *sensory*
  preference (Type A) from *family / buying* preference (Type B).
- **What:** The engine models what a user likes to **smell and feel** (Type
  A) very well, but not what they tend to **avoid buying by family** (Type
  B). Concrete case: the user said they avoid Mint-family strains, yet a
  Mint-only test scored them 60–73% — correctly, on sensory overlap. Both are
  true: the smell fits, but the user mentally skips that family. A small,
  bounded family modifier would capture real dispensary behaviour without
  touching the sensory core.
- **Key data nuance (don't key this on `sensoryFamily` alone):** the user's
  "families" are two kinds:
  1. **Sensory clusters** = our `sensoryFamily` (Haze, Purple, Cheese,
     Dessert, Garlic, Gas-OG, Diesel-Chem, Fruit/Candy). These map directly.
  2. **Token / lineage families** that span several sensory families. The 5
     Mint test strains live in funky-exotic / gas-og / gelato-exotic /
     dessert-cookies — but **all carry the `mint` token**. So "avoid Mint"
     cannot be expressed as a single sensoryFamily; likewise "OG line" /
     "Chem line" are lineage, not a cluster.
- **Potential fix:**
  1. A curated **named-family matcher** — each named family (Mint, OG, Chem,
     Haze, Purple, Cheese, Dessert, Fruit, Garlic/Funk, …) defined as a union
     of: sensoryFamily membership ∪ an aroma/flavour token (e.g. `mint`) ∪ a
     name/lineage pattern. (For OG/Chem lines this can reuse the #13 lineage
     data.)
  2. Profile: `preferredFamilies` / `avoidedFamilies` (named-family keys).
  3. Engine: a **bounded** `familyPreferenceMod` (≈ ±4–6 pts, i.e. ±3–7%) —
     additive, NEVER overrides sensory matching; no-op when empty.
  4. UI: "Strain families you seek out / usually avoid" in the profile and
     describe flows.
- **Schema / DB:** new columns `preferredFamilies` / `avoidedFamilies` →
  needs `npm run db:push` (same constraint as the disliked-aromas/potency
  PR B). Could share that migration so the owner runs db:push once.
- **Estimated effort:** 5–7 hours engine + UI + curating the named-family
  matchers (one-time).
- **Trigger to revisit:** This entry. Pairs naturally with #13 (lineage) for
  the OG/Chem line families.

---

## Resolved

### ✓ #5 — Texture participates in scoring (was open)

Resolved in PR #50 (2026-06-09). The `texturePreferences` field
previously collected from the questionnaire but ignored at scoring
time now contributes 3% of the weighted sum via a `textureScore`
helper. Mapping table in `taste-engine.ts` projects the texture
vocab onto existing strain `traits` (e.g. `dense` → `dense-buds`),
dropping labels with no sensible analogue (`fluffy`, `moist`) rather
than scoring noise.

### ✓ #6 — Quality priorities participate in scoring (was open)

Resolved in PR #50 (2026-06-09). `qualityPriorities` (freshness,
potency, aroma, sleep, focus, creativity, body-feel, head-feel,
appearance, …) now contribute 2% via a `qualityScore` helper that
projects each priority onto the closest trait or effect signal on
the strain. Small slice on purpose — tiebreaker, not primary signal.

### ✓ #7 — Favorite order explicit weighting (was open)

Resolved in PR #50 (2026-06-09). `referenceSimilarity` now applies a
position-weighting multiplier `[1.0, 0.95, 0.9, 0.85, 0.8]` during
the best-of search across favourites. A candidate slightly closer to
favourite #3 still reports against favourite #1 unless the gap is
large. Reported `score` stays the RAW similarity to the winner, so
"X sits closest to your taste" reads honestly.
