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

> **🔴 Shipped then REVERTED (2026-06-12).** `src/lib/lineage-affinity.ts`
> was wired into scoring as `lineageMod` (PR #135) but **over-fired**: walking
> two levels of ancestry and counting shared ancestors meant ~84/400 strains
> (common ancestors OG Kush / Chemdawg / Hindu Kush) got a bonus, crowding
> gas-forward profiles' tops into the 88 ceiling. The scoring hook was
> **disabled** (the module + tests stay; `lineageAffinity` tightened to
> DIRECT parent/child only for the future). Note from the revert: even
> direct-only barely moved the ≥88 count, because the OG/gas kin were already
> at 88 from sensory+family — the real "too many at 88" is **ceiling
> compression** (see #15), not lineage. Re-enable only with a small magnitude
> + curation, and ideally alongside #15 spreading the top tier.

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

> **🟡 Shipped on branch `claude/cold-start-pr-b` (PR #135), pending
> `db:push` + merge.** `src/lib/strain-families.ts` (named-family matcher:
> sensoryFamily ∪ token ∪ name) + `preferredFamilies`/`avoidedFamilies`
> columns + a bounded ±5 `familyPreferenceMod` + seek/avoid selectors in the
> describe preview. Verified: Mint matches all 5 mint strains; avoid-mint
> −5, seek-OG +5. No-op when unset.

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

### ✓ #15 — Elite 89–92 band for strong non-anchor alternatives (RESOLVED)

- **Resolved:** 2026-06-14, on `claude/project-review-status-1j09yv`. Real
  testing on a fruity-candy profile surfaced the exact symptom this idea
  anticipated: Rainbow Belts (raw 97.66), Apples & Bananas (97.42) and RS11
  (93.27) all flattened onto 88, hiding the order among the leaders.
- **What shipped (differs from the original strict-gate sketch below):**
  instead of a conjunctive gate that promotes only a handful, the hard
  `matchScore > 88 → 88` clamp is replaced with a **smooth, monotonic remap**
  of every non-anchor that clears 88 into **89.00–92.00**, carried **to two
  decimals** so even near-ties stay distinguishable (the decimals do the job
  the cluster-rank badge would have). 92.01–93.99 stays an empty gap; 94–96
  remains anchor-only. Owner picked the window: 89 = weakest of the strong, 92
  = almost-a-favourite. Display via `formatScore()`; see `docs/scoring-scale.md`.
- Pure engine + UI, no `db:push`.

<details><summary>Original idea (for history)</summary>

- **Found:** 2026-06-12
- **Source:** Owner idea.
- **What:** Today 89–93 is an intentional empty gap (favourites sit 94–96,
  every non-favourite caps at 88 — see `docs/scoring-scale.md`). Idea: open
  89–93 as a narrow **elite "almost your favourite"** tier, so a truly
  exceptional non-favourite match can rise above the 88 crowd. 94–96 stays
  reserved for actual saved favourites.
- **Sketch (needs more reasoning + calibration math before building):**
  - Strict, conjunctive gate so only a handful qualify — e.g. the raw score
    already at the 88 ceiling **AND** `referenceSimilarity` very high
    (≥ ~90) **AND** exact `sensoryFamily` match with a favourite **AND** zero
    conflicts.
  - Bounded promotion 88 → max 93 from convergent "exceptional" points
    (ref ≥ 90/95, exact sensoryFamily, exact archetype or lineage affinity
    from #13).
  - e.g. Triangle Kush on a GG4 + OG Kush profile (ref 97) currently caps at
    88 but arguably deserves ~92.
- **Trade-off:** Deliberately softens the "a new strain never poses as
  basically your favourite" promise — the non-favourite ceiling becomes 93
  (for the elite few) instead of 88. 94–96 still reserved, so the
  favourite-vs-rest gap survives as `94–96 vs ≤93`.
- **Why deferred:** Calibration-sensitive (some 88s become 90–93). Needs the
  gate thresholds and the promotion curve worked out and validated so it
  stays rare and doesn't inflate. **Pure engine** (no new fields / no
  `db:push`), shippable to main once designed.
- **Open questions:** gate strictness (ref ≥ 90 vs ≥ 88); just let the number
  into 89–93 (category stays "Best Match") vs add a distinct **"Top Match"**
  category (touches the `Category` type + UI).
- **Estimated effort:** 2–4 hours once the numbers are decided + tests.
- **Trigger to revisit:** When we choose to invest in the band; revisit the
  thresholds together first.

</details>

---

### #16 — Vocabulary precision: over-dominant tokens + a missing "character of the high" layer

- **Found:** 2026-06-13
- **Source:** Owner question — "should we add words to the vocab so the engine
  matches more precisely?" Investigated the actual token distribution before
  answering.
- **What (the finding, with data):** The vocab and the strain dataset are
  currently in **perfect lockstep** — every token a user can pick is carried by
  real strains, and no strain carries a token the user can't pick. So we are
  **not** missing words in the "dead option / hidden token" sense that drove the
  `v1 → v2` vocab bump. The real precision problem is the **opposite**: a handful
  of tokens are so common they barely discriminate. Measured over all 400
  strains (`src/lib/strain-data.ts`):

  | Token | Carried by | Note |
  |---|---|---|
  | `sweet` (aroma) | 308 / 400 (77%) | near-universal; collapses candy, dessert, fruit-sweet, floral-sweet into one |
  | `sweet` (flavor) | 307 / 400 | same |
  | `euphoric` | 347 / 400 (87%) | almost no signal |
  | `happy` | 325 / 400 | same |
  | `relaxed` | 303 / 400 | same |

  When a token sits on three-quarters of the catalog it is close to noise for the
  engine. Two genuinely different strains can share `sweet + euphoric + happy +
  relaxed` yet feel nothing alike. Adding *more flat words* does not fix this; the
  fix is (a) a new discriminating **axis**, and (b) splitting the few dominant
  tokens.

- **How to reproduce the finding:** token-frequency scan over `strain-data.ts`
  (regex-collect `aromas:` / `flavors:` / `effects:` arrays, count each token).
  Re-run it any time the dataset changes — if a token climbs past ~70% coverage,
  it has stopped discriminating and is a split candidate.

- **Potential fix (in priority order — do ONE layer well, don't scatter):**

  1. **"Character of the high" layer (highest ROI).** Today the 14 `EFFECTS`
     describe the *direction* of the high (relaxed ↔ energetic) but never its
     *texture*. The blind spot is exactly where similar-looking profiles diverge
     in real life. Add a small, mostly-orthogonal axis — candidates:
     - `clear-headed ↔ foggy/stoney` (the big one)
     - `fast-onset ↔ creeper`
     - `gentle ↔ intense`
     Two strains with identical effect tokens split cleanly on this axis, and
     "fits me / doesn't fit me" tracks it closely. Treat it as a **separate
     scoring dimension** (its own weight in `W`), not just more `EFFECTS` tokens,
     so it can't be drowned by the near-universal effect words.

  2. **Unload `sweet` (cheaper, do first as a warm-up).** Split the 308-strong
     `sweet` bucket with a couple of real sub-axes that also already correspond
     to distinct experiences:
     - `sour` — sour-vs-sweet is a true axis (Sour Diesel, sour-candy strains).
     - `dessert` / `chocolate` / `coffee` — peel the Gelato/Mochi/GMO-type
       sweetness off the generic `sweet`.
     - optional: `pungent` / `dank` — "loudness/funk" separate from gas/cheese.
     This immediately raises discrimination among desserts and sour strains
     without touching the effect model.

- **Hard constraint — do NOT subdivide for recall-loss:** splitting a *parent*
  category like `citrus → lemon/lime/orange` **hurts**. A user who picks "lemon"
  stops matching a strain tagged the parent `citrus`, so recall collapses. Only
  add tokens that represent a genuinely distinct experience (sour, dessert,
  clear-vs-foggy), or — if a hierarchy is ever wanted — keep the parent token AND
  the child so the parent still matches (hierarchical, not replacement).

- **Why deferred (the real cost):** any of these = **re-annotating up to 400
  strains by hand** (a new axis means every strain needs a value), plus a
  `VOCAB_VERSION` bump (currently `v2`, see `src/lib/vocab.ts`), plus engine
  wiring (new dimension → new weight in `W`, calibration so it doesn't unbalance
  existing scores) and tests. This is deliberate, sit-down work, not a one-line
  change. It is **pure engine + data** though — no Prisma schema change, no
  `db:push`; the profile axes already accept arbitrary token arrays.

- **Estimated effort:** sweet-unload ≈ half a day (annotate + 2 tokens + vocab
  bump). "Character of the high" layer ≈ 1–2 days (new dimension + 400-strain
  annotation + weight calibration + tests).

- **Trigger to revisit:** when we choose to invest in match precision; or sooner
  if the token scan shows another token crossing ~70% coverage. Start with the
  `sweet`-unload to get a feel for the annotation cost before committing to the
  full "character of the high" dimension.

---

### #17 — Constrained-LLM extractor behind the `describe` parser (Phase 3)

- **Found:** 2026-06-13
- **Source:** Owner — "how do we make the describe feature maximally accurate at
  turning a person's language into our tags?" The deterministic parser
  (`profile-from-description.ts`) was already broadened with a situation/activity
  layer (PR for the gym/party/movie/etc. cues); this entry records the *ceiling*
  beyond what keyword matching can reach.
- **What:** The deterministic parser is fast, offline and fully testable, but it
  can only ever recognise language it has a regex for. Open-ended phrasing,
  metaphor, food/brand references ("tastes like a Werther's", "melts me into the
  couch", "gives me the zoomies") will always slip past. The ceiling-raiser is an
  LLM extractor that reads free text and emits **only tokens from our closed
  vocabulary**, slotted behind the *same* `inferProfileFromDescription` signature
  so the editable preview and the rest of the flow are unchanged.
- **Design (the important constraints):**
  - **Output locked to the enum.** The model is given the exact vocab (aroma /
    flavor / effect / use-time / potency tokens + their human labels, ideally the
    real strain-tag definitions) and must return *only* those tokens via a JSON
    schema / tool-call with `enum` constraints. It can never invent a tag that
    isn't on a strain — that is the whole point ("transform language → our tags").
  - **Validate anyway.** Clip the model output against `AROMA_VALUES` /
    `FLAVOR_VALUES` / `EFFECT_VALUES` (already exported) before use — never trust
    the model to have stayed in-vocab.
  - **Deterministic parser stays** as (a) the offline/failure fallback and (b) a
    floor: union the two, or use the LLM only to fill gaps the regex left, so a
    network/API outage degrades gracefully instead of breaking cold-start.
  - Use the latest Claude model for the extraction call (see CLAUDE/AGENTS guidance
    on model ids); few-shot the system prompt with real phrasings → token sets.
- **Why deferred:** Architectural decision, not a code tweak. Needs an API key, a
  runtime network call (we have a network policy — confirm it allows the provider),
  latency + per-call cost budgeting, and a fallback contract. Everything else in
  the engine is deterministic/offline today; this is the first runtime model
  dependency, so it's a deliberate step.
- **Estimated effort:** ~1 day for a first cut behind a feature flag (prompt +
  schema + validate + fallback + a fixture test set of phrases), plus tuning.
- **Trigger to revisit:** when describe-input telemetry (#18) shows a meaningful
  miss rate the keyword layer can't economically close, or when we decide to add
  a runtime model dependency for other reasons.

---

### #18 — Describe-input telemetry: log phrases + parser misses to grow the vocab

> **✓ Implemented (2026-06-13).** Chose the dedicated-model route (cleaner for
> the future, indexable, isolates anonymous intake text from engine-run audits).
> Shipped: `DescribeAudit` Postgres model (no User FK — anonymous,
> aggregate-only); `describeLeftoverTerms()` in `profile-from-description.ts`
> (deterministic unrecognised-word extraction, reusing the same trigger tables);
> `src/lib/describe-audit.ts` (`buildDescribeAuditEntry` + `writeDescribeAudit`,
> mirroring run-audit's Postgres-default / file-fallback / off switches);
> fire-and-forget hook in `/api/profile/from-description`; and `/api/stats` now
> returns `describe: { total, misses, missRate, topUnrecognisedTerms }`. Needs a
> `db:push` for the new model. **Still a process, not code:** the semi-automatic
> review loop below (human approves which top leftover terms become triggers)
> and an optional `/stats` UI surface for the term list (API-only for now).

- **Found:** 2026-06-13
- **Source:** Owner — "like the stats we built for compare, capture which
  words/phrases the describe parser picks up (and which it misses) and feed them
  back in." This is the data loop that tells us *what* to add to the parser/vocab.
- **What:** Today `/api/profile/from-description` runs the parser and returns the
  profile, but **records nothing** — we're blind to what people actually type and
  what we failed to understand. Mirror the existing run-audit pattern
  (`src/lib/run-audit.ts`: Postgres `RunAudit` by default, `*.json` file backend
  for dev, fire-and-forget, no PII beyond a hashed id) with a *describe-intake*
  audit so misses become visible and fixable.
- **What to capture per describe submission (privacy-first):**
  - `rawText` (already capped at 2000 chars) — the actual phrasing is the value.
  - `matchedTokens` — aromas/flavors/effects/use-time/potency the parser resolved.
  - `matchedTriggers` — which trigger groups fired (so we see coverage).
  - `leftoverTerms` — content words in the text that mapped to **nothing** (the
    gold: these are the candidate new synonyms). Compute by tokenising the text,
    dropping stopwords + any word that contributed to a match, keeping the rest.
  - `hadSignal` — did it yield a usable profile at all (the existing `hasSignal`).
  - `vocabVersion` so eras are separable, like run-audit.
  - No userId/profile content beyond a short hash; this is intake text, treat it
    as sensitive and keep it aggregate-only on any surfaced view.
- **How it works end to end:** add `writeDescribeAudit(entry)` alongside
  `writeRunAudit`; call it fire-and-forget from the `from-description` route after
  inference (never block or fail the response on logging). Default Postgres
  (`DescribeAudit` model, or reuse `RunAudit` with `source: "describe"` and the
  payload in `snapshot` — cheaper, no migration). For dev, the same
  `RUN_AUDIT_BACKEND=file` switch writes `run-audit/*.json`. A small `/stats`
  addition (or a `/stats/describe` view) aggregates: top `leftoverTerms` by
  frequency, miss rate (`hadSignal=false` share), most common matched tokens.
- **The "automatic" part — be honest about the limit:** we can **surface** the
  top unrecognised terms automatically, but **mapping a new word to the correct
  token is a human call** ("loud" → `loud-smell` trait? `gassy`? intensity?).
  Auto-inserting words into the vocab/triggers would silently mis-map and
  poison matching. So the realistic loop is: log misses → rank by frequency →
  human reviews the top N each cycle → add the safe ones to `CONTEXT_TRIGGERS` /
  `SMELL_TRIGGERS` with a test. Semi-automatic, not blind auto-add. (A future
  step could use #17's LLM to *propose* a token for each leftover term for a
  human to approve — suggestion, never silent commit.)
- **Why deferred:** small but not zero — a model (or reused `RunAudit` source),
  a route hook, the leftover-term extraction, and a stats view. Reusing
  `RunAudit` with `source: "describe"` avoids a `db:push`; a dedicated
  `DescribeAudit` model would need one. Decide that first.
- **Estimated effort:** ~half a day reusing `RunAudit`; ~1 day with a dedicated
  model + stats view.
- **Trigger to revisit:** as soon as we want evidence-driven parser growth rather
  than guessing at synonyms — pairs naturally with #16 (vocab precision) and #17
  (LLM extractor) as the feedback loop that feeds both.

---

### #19 — Voice input for the describe flow (speech → same parser)

- **Found:** 2026-06-13
- **Source:** Owner question — "are we talking voice or typed?" Decided: log as a
  future idea; typed stays the current path.
- **What:** Today `describe` is typed (a textarea → `/api/profile/from-description`).
  Voice is **not a different brain** — it's a different *input method* that
  produces the same text the parser already consumes:
  `🎤 speech → speech-to-text → TEXT → (parser or LLM #17) → tags`. The "smarts"
  live in the brain (regex today, LLM in #17), not in how the words arrive.
- **Potential fix:**
  - **Web Speech API** (`SpeechRecognition`) — browser-native, free, no server
    dependency; a mic button that dictates into the existing textarea, then the
    normal flow runs. Lowest cost, but support/quality vary by browser.
  - **Whisper / hosted STT** — more accurate and consistent, but adds an external
    runtime dependency (network policy + cost), like #17.
- **Why deferred:** Pure additive UI on top of whatever brain we pick; no reason
  to build it before the brain decision (#17). Pairs naturally with #17 — if we
  add the LLM extractor, dictated text flows through it unchanged.
- **Estimated effort:** ~half a day for a Web Speech mic button + transcript
  preview; more if we go hosted STT.
- **Trigger to revisit:** after the describe brain is settled (deterministic vs
  LLM), or if users ask to speak rather than type.

---

### #20 — Conversational "budtender" intake (the profile becomes a conversation, not a form)

- **Found:** 2026-06-14
- **Source:** Owner strategy session after testing many profiles. The headline
  realisation: **SŌMA is turning from a strain catalog into a product.** The
  defensible core isn't the scoring table (anyone can copy a formula) — it's the
  **translation of *sensations* into *strains*.** Most people know what they
  liked, what they didn't, and how they felt — but **not why.** If SŌMA is the
  translator between feeling and flower, that's its strongest moat. With the
  engine now distinguishing real taste territories (OG/Gas vs Daytime-Focus give
  genuinely different results), the quality bottleneck has **moved off scoring
  and onto intake** — how well we actually understand the person.

- **The problem:** the questionnaire works, but it still *feels* like a
  questionnaire. A good budtender never hands you a form. They ask: *What are you
  after today? What did you like last time? What are you doing later? What's a
  hard no? How do you want to feel?* That's how people actually think. The end
  state should feel like **a conversation with an experienced budtender**, not
  form-filling.

- **Vision (owner's hybrid model):**
  1. **A short conversation** — "What are you looking for today?" + a few follow-ups.
  2. **SŌMA proposes a profile** from the answers.
  3. **The user confirms or corrects it.**
  So the person never feels they filled out a form — they feel they talked to a
  sommelier who then said "here's what I'm hearing — right?"

- **Architectural principles (how I see it working — keep these intact):**
  - **Conversation on top, deterministic profile + scoring underneath.** Do NOT
    turn this into a pure LLM chat that both understands *and* recommends — that
    throws away the explainability and predictability that make SŌMA trustworthy
    ("why this strain"). The recommender stays deterministic and auditable.
  - **An LLM, if used, is an *extractor* (text → structured tags), never the
    recommender.** It converts the conversation into the same structured profile
    the engine already reads. This is exactly the role #17 sketches.
  - **The *feeling* of a conversation does NOT require an LLM.** The felt
    experience comes from the *interaction design* — asking the right questions,
    proposing, confirming. Understanding *accuracy* is what an LLM improves. So
    the experience can ship deterministically first and the brain can be upgraded
    later — the two are decoupled.
  - **A few targeted questions beat both a form and a single free-text box.** In
    front of an empty "describe yourself" box, people don't know what to say. The
    budtender's power is asking the *right* questions; 3–4 pointed prompts
    out-perform either extreme.

- **What already exists (~70% of the hybrid is built):**
  - `profile-from-description.ts` already does free text → `InferredProfile`
    (same shape as the questionnaire), shown as an **editable preview** before
    saving — that is literally Steps 2–3 of the hybrid, for the describe path.
  - `profile-from-experience.ts` reads named strains the user has tried.
  - Describe telemetry (#18) is live, collecting real phrases + parser misses to
    grow the vocab and inform the LLM decision.
  - So the missing pieces are the **conversational framing** and (later) the
    **understanding brain** (#17).

- **Staged plan:**
  - **Stage 1 — guided budtender dialogue over the existing parsers (deterministic,
    no LLM, low risk).** Replace/augment the front door with a short multi-step
    conversation, ~3–4 questions (see design below). Answers feed the existing
    `describe` + `from-experience` parsers; SŌMA shows the assembled profile to
    confirm/edit. Mostly UX assembly on code we already have — delivers the
    "consultation" feel immediately.
  - **Stage 2 — the brain (#17).** Slot a constrained LLM extractor behind the
    same interface so free-text understanding gets robust (closing the vocab
    misses #18 is logging). Decide by the telemetry data, not by guess.
  - **Stage 3 — flip the front door.** Conversation becomes the default entry; the
    structured questionnaire is demoted to a "fine-tune / adjust" surface (the
    hybrid's Step 3), not the first thing a visitor sees. The form isn't the
    enemy — it's a great *editing* surface and a bad *greeting*. Keep it, demote it.

- **Stage 1 concrete design (how the conversation maps to the profile):**
  - **Q1 — "What are you after today?"** (free text) → `describe` parser →
    preferred aromas/flavors/effects, use-time, body-feel, potency. The richest
    single signal.
  - **Q2 — "What did you love last time? (name it or describe it)"** → if a strain
    name, `from-experience` (favorite anchor + its sensory fingerprint); if prose,
    `describe`. Feeds `favoriteStrains` / preferred tags.
  - **Q3 — "Anything that's a hard no?"** (free text) → negated tags →
    `dislikedEffects` / `dislikedAromas` / `dislikedStrains` (reuses the
    negation-scope work just shipped).
  - **Q4 — "What are you doing later / how do you want to feel?"** → context +
    effect language (the situation/activity triggers already in the parser:
    "movie night", "before the gym", "wind down") → effects + use-time.
  - Then **"Here's what I'm hearing:"** → render the assembled `InferredProfile`
    (the existing editable preview) → user confirms or tweaks → save. Each Q is
    optional/skippable; even Q1 alone yields a usable profile.
  - Tone: one question at a time, conversational copy, SŌMA "reflecting back" what
    it heard ("Sounds like you want bright, citrus-forward daytime flower and
    nothing that knocks you out — that right?").

- **Risks / things to watch:**
  - Don't let the conversation become a long interrogation — 3–4 questions max,
    all skippable. The form's one virtue is speed for people who know the vocab;
    keep a "just show me the form" escape hatch.
  - Keep the deterministic profile as the single source of truth so scoring stays
    explainable regardless of how the profile was gathered.
  - Stage 2's LLM adds a network/runtime dependency + cost (network policy) —
    same caveat as #17; the extractor must degrade to the deterministic parser.

- **Dependencies / relatives:** built on the `describe` parser (this doc's #16,
  #17, #18) and `from-experience`; pairs with #19 (voice = just another way to
  answer the same questions). Stage 2 *is* #17.
- **Estimated effort:** Stage 1 ~1–2 days (UX assembly + copy + wiring existing
  parsers, deterministic). Stage 2 = #17's estimate. Stage 3 ~half a day of
  routing/IA once Stage 1 is trusted.
- **Trigger to revisit:** Owner wants to return to this **soon** — it's flagged as
  the next big quality lever (intake, not scoring). Revisit Stage 1's exact
  questions + copy together before building.

---

### #21 — Weighted (graded-intensity) tags on strains

- **Found:** 2026-06-14
- **Source:** Owner idea. Today a strain's tags are binary — it *is* sweet /
  tropical / euphoric, or it isn't. The engine knows the *presence* of a trait,
  not its *strength*. Idea: give each tag an **intensity** so the engine knows a
  strain is **intensely** piney vs **faintly** piney, or gives euphoria
  **strongly** vs **mildly**.
- **Why it matters:** this attacks within-cluster sameness **at the data level**,
  not just the display. Rainbow Belts ("candy-dominant, fruity-present") would
  separate *in score* from Apples & Bananas ("fruity-dominant, candy-present"),
  not just by the 89–92 band decimals. It sharpens the core moat — translating
  *how much* of a sensation a user wants into the right flower.

- **The hard part — sourcing the numbers (decided: NOT a free 0–100):**
  - There is **no ground-truth measurement** of intensity. "Smells like pine at
    88" — nobody measured 88. A free 0–100 scale would be **false precision**:
    a confident number with nothing behind it, which is exactly the trap the 88
    ceiling was (pretty, but not real).
  - Intensity genuinely **varies by phenotype, grower and batch** — the same
    strain differs between producers.
  - It also **varies by the perceiver** (owner's point): "strongly gassy for me
    might be half-gassy for someone else." So a strain-level number can only ever
    be a **population baseline**, never a personal truth.

- **Decision — ordinal tiers, not 0–100:** three levels per tag —
  **dominant / present / subtle** — mapped internally to weights (e.g.
  1.0 / 0.6 / 0.3). This is honest (no fake precision), cheap and consistent to
  curate (drop a tag in one of three boxes), and captures nearly all the gain
  ("intensely gassy" vs "a hint of gas" is already distinguishable). A continuous
  0–100 may live *internally* as the weight, but curation and any display stay
  tiered.

- **Sourcing the tiers (cheapest → best):**
  1. **Free, now:** a weak prior we already have — **tag order** (first aroma ≈
     dominant) and the existing `primaryAroma` / `primaryEffect`. Start with
     "first tag = dominant, rest = present."
  2. **Better:** an **LLM proposes tiers** from curator notes / lineage, and the
     **curator confirms/edits** — scalable and accurate enough. (Same extractor
     role as #17 — proposer, not oracle.)
  3. **Long-term:** blend in **community-review frequencies** (e.g. "68% report
     euphoria") as a real, defensible weight signal.

- **The other half — intensity must also live in the profile:** weighted strain
  tags need something to match *against*. "I want **strongly** gassy" ≠ "I want
  **a hint** of gas." Because intensity is subjective, the **strain tier is the
  baseline** and the **person's preferred intensity** (captured in intake, and
  refined by the feedback loop) personalises it. This is exactly what a
  conversation captures naturally ("really candy-forward" vs "a touch sweet"), so
  **#21 and #20 are two sides of one coin.** Close relative of **#16**
  (over-dominant tokens + "character of the high").

- **Scope (design first, build in phases):** this is a **data-model change** — a
  tag stops being a `string` and becomes `{ token, weight }` (or `{ token, tier }`).
  Touches: `strain-data` (the catalog), the engine's `similarity` / aroma /
  effect / flavour scoring, the profile shape (preferred-intensity), and curation
  tooling. Backwards-compatible migration: untagged-intensity defaults to
  "present" so nothing breaks while tiers are filled in.
- **Estimated effort:** multi-phase. Data-model + engine plumbing ~2–3 days;
  tiering the catalog is ongoing curation (LLM-assisted); profile-side intensity
  rides with #20. Not an evening's work.
- **Trigger to revisit:** Owner wants to **examine this deeper** soon, alongside
  #20 (intake) and #16 (vocab precision) — they're the same theme: resolution of
  *how much*, not just *what*.

---

### #22 — Full PWA service worker (offline + Android install prompt)

- **Found:** 2026-06-14
- **Source:** Owner — after shipping the installable manifest, decided to leave
  the service worker for later ("пока пусть на экран только добавляем").
- **Context (what already shipped):** the web manifest + apple meta + 192/512 +
  maskable icons are live (PR #163 / `app/manifest.ts`), so SŌMA can already be
  **manually** added to the home screen on iOS and Android and launches
  standalone. What's missing is a service worker.
- **What this adds (the SW unlocks):**
  - **Android's automatic "Install app" prompt** (`beforeinstallprompt`) instead
    of the manual "Add to Home Screen" menu — much higher install conversion.
  - **Offline / flaky-network resilience** — cache the app shell + static assets
    so SŌMA opens without a connection and feels native.
  - Foundation for later niceties (background sync, push) if ever wanted.
- **Sketch:**
  - A small service worker (hand-rolled, or `next-pwa` / Serwist for the Next App
    Router) registered on load; cache-first for static assets + the app shell,
    network-first for API/data so recommendations stay fresh.
  - A light "Install SŌMA" affordance that fires the captured
    `beforeinstallprompt` on Android.
  - Be careful with caching on a `force-dynamic`, cookie-personalised app — never
    cache per-user API responses (profile, feedback, matches); only the shell and
    public static assets.
- **Why deferred:** the manual add-to-home-screen already covers the immediate
  need; the owner wants to watch usage first. SW caching is easy to get subtly
  wrong on a personalised, server-rendered app, so it deserves its own focused
  pass.
- **Estimated effort:** ~half a day to a day (SW + registration + cache strategy
  + install button + testing the offline/stale edges).
- **Trigger to revisit:** when we want a proper installable, offline PWA — or if
  testers ask for an app-store-like install on Android.

---

### #23 — Learn the profile from confirmed feedback (controlled lane-widening)

- **Found:** 2026-06-15
- **Source:** Owner observation — "Biscotti with positive feedback still ranks
  below Gelato." A simulation on the fruity-candy profile settled it: the
  ~25-point gap is a **real sensory mismatch** (Biscotti aroma/flavour match 63
  vs Gelato 100), so Gelato on top is honest, and feedback (bounded ±12, and it
  lifts neighbours too) correctly can't and shouldn't flip it. Resolved the
  immediate UX with a "You loved it / You rated it Good" badge on result cards
  (surfaces the confirmation without distorting rank).
- **The deeper signal:** if a user *repeatedly* confirms (loved/good) strains
  that sit **outside their stated profile** (e.g. several gassy picks on a
  sweet-fruity profile), that's evidence the **profile itself is too narrow** —
  not that feedback is too weak. The fix is to let confirmed feedback **gently
  widen the taste lane over time**, not to crank the feedback ceiling (which
  re-introduces the noise we deliberately bounded).
- **Design principles (keep intact):**
  - **One off-profile love = an exception** (don't move the profile). **A
    repeated pattern = widen the lane** — only act on corroboration.
  - Widening is **bounded and explainable** ("you keep reaching for gassy picks
    — added a touch of gas to your profile?") and ideally **confirmed by the
    user**, not silent.
  - The recommender stays deterministic; this adjusts the *profile* the engine
    reads, not the scoring formula.
- **Relatives:** this is the "controlled expansion" half of the feedback design
  (see #20 conversational intake and #21 weighted tags). Direct verdicts could
  also feed a stronger *self*-confirmation for the rated strain (distinct from
  the gentle neighbour propagation), but the sim showed that's secondary — the
  real lever is profile-learning.
- **Why deferred:** needs the corroboration threshold + the widening curve
  designed and validated so it stays rare and never silently rewrites taste.
- **Trigger to revisit:** alongside #20/#21, or once enough feedback accrues to
  see real off-profile-love patterns in the data.

---

### ✓ #24 — Add the 39 missing parent strains to the catalog (DONE)

- **Resolved:** 2026-06-15. All 39 added to `STRAINS` with type / aromas /
  flavors / effects / traits / potency / note (sensory data from knowledge of
  each). Catalog 400 → **439**; parent coverage now **274/274 (100%)** — every
  lineage parent resolves to a real, clickable page. Rich identity (lineage /
  curator note / artwork) can follow later per strain. The list below is kept
  for the record.
- **Found:** 2026-06-15
- **Source:** Parent-coverage audit. Of **273** unique parent strains referenced
  across the 400 catalog entries' lineage, **234 (86%) are already in the
  catalog**; these **39 are not** (each referenced by exactly one child). They
  came from documenting that child's cross during the lineage-fill batches
  (sources: Seedfinder + breeder pages). They currently show on the child's page
  with a short `parentDetails` hint but have **no page of their own** (not
  clickable). Adding them would make lineage fully clickable and grow the catalog
  to ~439.
- **The 39 (parent → the catalog strain that references it):**

  | Missing parent | Referenced by |
  |---|---|
  | 91 Hollywood Pure Kush | Frosted Lemonade |
  | Aspen OG | Jet Fuel |
  | Black Cherry Funk | Black Cherry Gelato |
  | BOG Bubble | Boggle Gum |
  | California Indica | LA Confidential |
  | California Sour | Lemon Diesel |
  | Citral | Papaya |
  | Ed Rosenthal Super Bud | Pineapple |
  | Eddy OG | Peach Rings |
  | Evergladez | Frosted Lemonade |
  | Face Mints | Gas Face |
  | Florida Kush | Pink Panties |
  | Genius | Apollo 13 |
  | Grateful Puff | Platinum Puff |
  | Headbanger | Sherbanger |
  | Hella Jelly | Jelly Donutz |
  | High Country Diesel | Jet Fuel |
  | Honey Boo Boo | Honey Banana |
  | Jamaica | Amnesia Haze |
  | Jock Horror | AK-48 |
  | Juicy Fruit | Orange Creamsicle |
  | Juliet | Strawberry Shortcake |
  | Laos | Amnesia Haze |
  | Lemon Joy | Lemon Kush |
  | Lemon OG | Lemonnade |
  | Lost Coast OG | Lemon Diesel |
  | Marionberry | Peach Rings |
  | OG LA Affie | LA Confidential |
  | Orange Crush | Orange Creamsicle |
  | Ortega | Black Domina |
  | Purple Elephant | Grape Stomper |
  | Razzleberry | Blueberry Muffin |
  | Secret Weapon | Oreoz |
  | Snow White | Snowcap |
  | South Florida OG | Biscotti |
  | Starfighter | MAC |
  | White Diesel | The Menthol |
  | Y Life | Cereal Milk |
  | Zookies | Biskante |

- **Note:** several are themselves landraces/heritage (Jamaica, Laos, Colombian,
  Citral) or breeder one-offs — when added, each needs sensory data + a curator
  note like any catalog strain. Batchable like the artwork / lineage work.
- **Trigger to revisit:** when expanding the catalog; re-run the parent-coverage
  audit afterwards to confirm connectivity climbs toward 100%.

---

### #25 — Aroma-core coverage vs effect/reference compensation (calibration)

- **Found:** 2026-06-16
- **Source:** Owner observation off the new Critical/Secondary/Effect-Missing
  audit — strains that miss a large part of the aroma core still land close to
  strains that cover it. Example (gassy/diesel/skunky/pine/earthy/woody profile,
  clustered favourites):

  | Strain | Final | aroma | effect | flavor | ref |
  |---|---|---|---|---|---|
  | Stardawg | 85 | **79** | 88 | 100 | 65 |
  | Ghost OG | 82 | **58** | 75 | 75 | **87** |
  | Larry OG | 82 | **58** | 75 | 75 | **87** |
  | MAC | 78 | **47** | 88 | 51 | 66 |

- **Diagnosis (not a bug):** the aroma sub-score *already* separates well — 79
  vs 58 vs 47 is a 32-point spread. It gets **diluted in the weighted sum**:
  with a clustered-favourite profile the engine runs in **trust mode**, where
  `ref` (overall similarity to favourites) weighs **0.34** and `aroma` only
  **0.17**. So Ghost OG / Larry OG hold 82 largely through `ref = 87` (they
  resemble a favourite as a whole) despite a weak aroma core — exactly the
  owner's concern that a strain can match "mainly through effects/similarity"
  while missing the aroma identity. Effect is high and near-identical across the
  set (75–88), so it barely separates.
- **The real lever** is the **aroma vs ref/effect weight ratio**, not the
  penalty machinery. Options to weigh later:
  - **A. Raise aroma weight** — simplest, but global; shifts every profile.
  - **B. Aroma-core coverage term** *(recommended)* — a small, **non-linear**
    penalty (or score scaler) that grows once a large fraction of the user's
    **critical** (aroma) tags is missing. Targets this case precisely and stays
    explainable in the audit ("missed 4/5 of your aroma core").
  - **C. Cap ref/effect compensation** when aroma coverage is low — prevents a
    high `ref` from fully rescuing a strain that misses the nose.
- **Blocker / hygiene first:** `nutty` is **not** a valid aroma (it's a FLAVOR;
  absent from `AROMAS`). In the observed profile it sits in `preferredAromas`,
  so it is **permanently** Critical-Missing on every strain — inflating the
  miss count and skewing any "missed aroma fraction" math. Before tuning weights
  on this signal, fix how `nutty` lands in the aroma list (likely the intake
  parser miscategorising it) so the coverage fraction is honest.
- **Why deferred:** the owner explicitly wants to **monitor 20–30 test
  sessions** before any weighting change — small, broad weight moves are easy to
  over-correct. Lever B needs its curve + threshold designed and validated.
- **Trigger to revisit:** after the monitoring window, or if a clear pattern
  emerges where high-`ref` strains with weak aroma cores rank above true
  aroma-identity matches. Fix the `nutty`-as-aroma issue independently and
  sooner.

---

### #26 — Switch AI layers to Claude (Anthropic) as primary, OpenAI as option

> **◑ Shipped (2026-06-20).** Provider abstraction `src/lib/ai-provider.ts`
> built on `@anthropic-ai/sdk`: `activeProvider()` picks Claude by default
> (`AI_PROVIDER` env, `claude` | `openai`), each gated on its own key
> (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY`) with fallback to the other, and
> `aiExtractJson()` is the single entry point. The two AI layers present on
> this branch — `src/lib/openai.ts` (sommelier prose) and
> `src/lib/strain-inference-ai.ts` (unknown-strain inference) — now route
> through it; both gate on `isAIEnabled()` and stay dormant with no key.
> `.env.example` documents `AI_PROVIDER` / `ANTHROPIC_API_KEY` / `CLAUDE_MODEL`
> (default `claude-haiku-4-5`). Tests cover provider selection + fallback and
> the no-key/`STRAIN_AI=off` dormancy. **Still open / deferred:** the
> `describe-ai.ts` extractor (lives on the unmerged `claude/describe-ai`
> branch — re-point it to `aiExtractJson` when that lands) and the
> enum-constrained structured-output upgrade (today's `json_object` + post-hoc
> clip is kept as belt-and-suspenders).

- **Found:** 2026-06-20
- **Source:** Owner — prefers Anthropic as the primary AI vendor; OpenAI stays
  selectable as a fallback/option. **Primary = Claude, secondary = OpenAI.**
- **What:** All three runtime AI layers currently call OpenAI's
  `chat.completions` (raw `fetch`, `response_format: json_object`):
  `src/lib/openai.ts` (sommelier prose), `src/lib/strain-inference-ai.ts`
  (unknown-strain inference), `src/lib/describe-ai.ts` (the #17 conversational
  extractor). Re-point them at the Anthropic **Messages API** with OpenAI kept
  behind a provider switch.
- **Recommended shape:**
  - **One provider-abstraction client** (`src/lib/ai-provider.ts`) the three
    layers call, so the model/vendor lives in one place. `AI_PROVIDER` env
    (`claude` | `openai`, default `claude`) selects; each provider gated on its
    own key (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY`), falling back to the
    deterministic path when neither is set (unchanged dormancy contract).
  - **SDK:** `@anthropic-ai/sdk` (Anthropic guidance is to use the official SDK
    in a TS project, not raw fetch). New dependency.
  - **Model:** `claude-haiku-4-5` for the extraction/inference work (cheapest
    Claude, well-suited). Honest cost note: Haiku 4.5 is **$1 / $5 per 1M
    tokens** — ~6–8× gpt-4o-mini's $0.15 / $0.60, so this is NOT a cost win;
    absolute cost is still pennies and **prompt caching** (cache reads ~0.1×)
    on the fixed vocab system prompt narrows the gap a lot.
  - **Structured output upgrade:** use Claude **enum-constrained structured
    outputs** (`output_config.format` JSON-schema, or strict tool use) so the
    closed-vocab tokens are constrained at generation — cleaner than today's
    `json_object` + post-hoc clip. Keep the clip as a belt-and-suspenders.
  - Prose layer (openai.ts) ports the same way (system prompt → top-level
    `system`, `max_tokens` required, json_object → `output_config.format`).
- **Account note:** an Anthropic **API** key (console.anthropic.com, its own
  prepaid billing) is required — a Claude.ai subscription does NOT grant API
  access (same gotcha as ChatGPT vs the OpenAI API).
- **Estimated effort:** ~1 day — add the SDK, write the provider abstraction,
  port the 3 layers, enum schemas, tests, keep OpenAI selectable.
- **Trigger to revisit:** owner wants this next on a dedicated branch
  (`claude/ai-provider-anthropic`), built so Claude is primary and OpenAI an
  option. Pairs with #17/#20 (the conversational brain runs through the same
  provider client).

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
