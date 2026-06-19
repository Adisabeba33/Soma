# Soft sativa-risk layer — "racy"

A small, opt-in risk dimension that separates *good daytime energy* from *risky
overstimulation*. Some people want energetic, creative, focused daytime flower
but **not** a sharp, nervous, anxiety-prone head high. This layer lets them say
so, and gently steers them away from strains known to run racy — **only for
them**, and **never** by changing the scoring weights.

## How it works

- **Opt-in.** Nothing happens unless the user sets `avoidedRisks: ["racy"]`
  (questionnaire chip: *"Anything in the high you'd rather avoid?"* → *Sharp /
  racy head high*). Users who want intensity are unaffected.
- **Soft penalty, never a category cap.** A matched racy strain loses a few
  points (below), kept out of the hard `conflicts` list so it slips *below*
  cleaner options without being dumped into "Risky".
- **Reconciled.** If one of the user's own favourites carries the same risk,
  the penalty is silenced — we don't penalise their own territory.
- **Weights untouched.** It's an additive, bounded points deduction, not a
  re-weighting.

## Confidence tiers (the penalty scales with how sure we are)

Each tagged strain carries a `confidence` in `src/lib/risk-tags.ts`:

| Tier | Meaning | Penalty | Audit / bartender label |
|---|---|---|---|
| **high** | Documented / strong consensus — *likely* racy | **−5** | "likely racy (you avoid)" |
| **medium** | 50/50, dose-dependent — *may or may not* run racy | **−2** | "possibly racy (you avoid)" |
| *(untagged)* | Clean — no consensus for racy | **0** | — |

Source of these tags is **community/consensus reputation, not lab data**
(`source: "community-consensus"`), so each entry keeps its own `source` +
`confidence` — the provenance idea, applied to one axis.

## Coverage

Curated conservatively (under-tagging beats penalising a clean sativa). As of
this layer: **39 / 450** strains tagged — **19 high**, **20 medium**; the other
**411 are clean (0)**. Tiering and membership live in `src/lib/risk-tags.ts`
and are meant to be curated over time.

## What the AI bartender sees

The OpenAI prose layer receives, per recommendation, the `penalties` list
(including the tier-scaled racy hit) and a tier-aware `riskNotes` draft. The
system prompt tells it how to read them: **−5 = documented racy (a real
watch-out), −2 = partial/dose-dependent (frame as a maybe).** This lets the
bartender explain *why* a pick lost points and break close ties honestly
(e.g. an 82 with "likely racy" vs an 83 with no risk) — without ever restating
or changing the raw score.

## Where it lives

- `src/lib/risk-tags.ts` — the curated overlay (tags + confidence + source).
- `src/lib/taste-engine.ts` — `softRiskAssessment()` (penalty by tier,
  reconciliation, tier-aware note) and the audit label.
- `src/lib/openai.ts` — passes `penalties` to the bartender + interpretation
  guidance in the system prompt.
- `profile.avoidedRisks` (`TasteProfile.avoidedRisks` column) + the
  questionnaire chip — how a user opts out.

## Activation

Engine + UI ship dormant; the layer affects real users once the
`avoidedRisks` column exists — a one-time `db:push` on Supabase. No env keys.
