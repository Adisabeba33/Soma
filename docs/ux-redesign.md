# SŌMA UX V2 — simplify the path, sell the outcome

> Owner-driven redesign after extended testing. The engine is now strong
> enough for real use; the next big lever is **the first 30 seconds**, not
> scoring. Goal: turn SŌMA from "a site with a questionnaire" into "a personal
> cannabis sommelier." This doc is the plan; build in phases.

## The core reframe

Today the home page sells **input modes** (Full Questionnaire / Experience
Match / Describe) — our internal architecture, turned outward. A new visitor
doesn't want to pick a mode; they have a **job**:

- "What should I buy from the menu in front of me?"
- "I liked Runtz — what's similar?"
- "I'm new and don't know the names."

**Show the job, not the architecture.** Lead with life scenarios and with the
*outcome* ("stop wasting money on flower you'll never love"), not "create a
profile." A profile is preparation; the product is the **buy decision**.

## The good news: this is mostly reuse, not new engine

Almost every piece already exists — this is IA + copy + a thin guided wrapper.

| V2 piece | Already exists |
|---|---|
| "Choosing from a menu" → Analyze Menu | Taste Match paste-menu input + parser |
| "I know what I love" | `profile-from-experience` parser |
| "I'm new" → 4 questions | `describe` + context parser (effects/aroma/time/negation) |
| "Here's what I think you like" + Looks Right / Adjust | the editable `InferredProfile` preview |
| "Why?" reasons + risk on each result | engine already returns `whyItFits`, `riskNotes`, matched aroma/effect chips |
| 3-tier buy verdict | the verdict tiers we designed (thresholds below) |

The engine is **not** touched.

## Target structure (~10 screens, not 30)

1. **Home** — scenario hero
2. **Menu input** — "What's on the menu?" (paste) → Analyze
3. **Quick onboarding** — 4-question budtender flow (only if no profile)
4. **Generated profile** — "Here's what I think you like" → Looks Right / Adjust
5. **Results** — 3-tier verdicts with "Why?"
6. **Strain detail**
7. **Build from experience**
8. **My Profile** (full questionnaire = fine-tune)
9. **Catalog**
10. **Saved**

## Decisions locked in this round

- **Home scenarios (3 cards), under "What brought you here today?":**
  - 🍃 **I'm choosing from a menu** → *Find My Flower* (→ menu analysis). The
    primary, most-used path.
  - ❤️ **I already know what I love** → *Build From Experience*.
  - 🌱 **I'm new to cannabis** → *Guide Me*.
- **4-question budtender onboarding** (maps directly onto existing parsers):
  1. What are you looking for today? (Happy & Social / Focused / Creative / Deep
     Relaxation / Sleep) → effects
  2. Which jar do you open first? (Candy / Fruit / Citrus / Gas / Pine / Earth)
     → aromas
  3. When do you usually reach for it? (Morning / Daytime / Evening / Before
     Bed) → use-time
  4. What ruins a good session? (Sleepiness / Anxiety / Too Heavy / Head
     Pressure / Nothing) → disliked effects (negation)
- **3-tier buy verdict on results** (owner-set thresholds + labels):
  - 🟢 **Worth Your Money** — 81–100
  - 🟡 **Worth A Shot** — 56–80
  - 🔴 **Save Your Money** — 0–55
  - Each result answers **"Why?"** with ✓ reasons (sweet-fruit profile, similar
    to Runtz, happy social effects, matches daytime…) and a **Potential Risk**
    line ("may feel heavier than your usual picks").
- **Positioning copy** built around the outcome:
  - "Stop wasting money on strains you'll never love."
  - "Know before you buy." · "Find out before you spend." · "Bring SŌMA to the
    dispensary."
- The full questionnaire is **not deleted** — demoted to "My Profile / fine-tune"
  for people who want depth. The 4-Q is the greeting; depth accrues from use and
  feedback (see #23) and the LLM extractor (#17).

## Phasing

- **Phase A — scenario home + outcome copy** (low risk, no engine). Replace the
  three input-mode cards with the three scenario cards routing to the existing
  flows; lead with the outcome headline. **← start here.**
- **Phase B — 4-question budtender onboarding + "Here's what I think you like"
  interpretation** (this is deferred #20 Stage 1). Guided flow → existing
  parsers → editable preview → save.
- **Phase C — make menu-analysis the hero path + 3-tier verdict results** with
  "Why?" reasons (reuses `whyItFits` / `riskNotes`). Decide the Compare-feature
  vs menu-analysis naming here.
- **Phase D (later)** — LLM extractor behind the parsers (#17) for robust
  free-text understanding.

## Honest notes / risks

- "Compare should be the central product" — careful: the central **job** is
  "score the menu I'm looking at", which today is the **Taste Match** analyze
  flow, not the 2–5-strain **Compare** feature. Make the *job* central; keep
  Compare as a secondary tool. Reconcile naming in Phase C.
- A 4-question profile is **coarse** by design — good enough as a cold-start +
  the "Adjust" step, deepened later. Don't oversell it as the whole profile.
- Even the menu path needs a profile to score against — frame the 4 questions as
  *part of getting the answer* ("4 taps so I can read your menu"), not a gate.
- It's the **front door** — high stakes for first impression; phase it, don't
  big-bang it.
