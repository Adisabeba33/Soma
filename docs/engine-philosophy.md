# SŌMA — Engine philosophy, the score scale, and why feedback matters

This document captures, honestly, what the SŌMA Taste Match engine *is*, how its
scores should be read, how it compares to a human sommelier, and why user
feedback is the thing that makes it genuinely good over time.

It is written to be the **source material for a public "How it works" page**
(plain-language sections below are meant to be lifted almost verbatim). It is
deliberately candid — the goal is to be more trustworthy than the confident
hand-waving common in this space, not to oversell.

---

## 1. What the engine is — and what it isn't

SŌMA's engine is a **transparent, rule-based sensory matcher**. For a given
taste profile and a menu of named strains, it scores how well each *named*
strain fits *your stated preferences*, and shows its full reasoning (Audit mode).

It is **not** an AI that "understands" cannabis, and it does not perceive: it
never smells or tastes anything. It matches the **labels** humans have assigned
to each strain (aroma, flavour, effect, structure, lineage) against the labels
in your profile. That distinction matters and we should never blur it.

Two hard ceilings, stated plainly:

1. **It judges the name on the menu, not the flower in the jar.** A real
   sommelier evaluates the actual product in front of them — this batch, its
   freshness, cure, trichomes. The engine can't see any of that.
2. **The ground truth is noisy.** The same strain varies enormously by grower,
   phenotype and batch; effect depends on dose, tolerance, set and setting. So
   even perfect logic operates on shaky data. This is the nature of the domain,
   not a bug — and it is the engine's main ceiling.

This is why the product says, everywhere, *"a sensory match, not a guarantee —
real quality depends on the grower, freshness, packaging date and storage."*
That honesty is a feature, not a disclaimer to bury.

---

## 2. How to read a score (the scale)

Every recommendation gets a 0–99 match score against *your* profile. The bands:

| Score | Category | Read it as |
|------:|----------|------------|
| 80–99 | **Best Match** | Strongly fits what you've told us |
| 66–79 | **Closest Alternative** | A solid, near-fit |
| 50–65 | **Worth Trying** | Partial fit — right on some axes, off on others |
| 36–49 | **Risky** | Mostly off, or conflicts with your dislikes |
| < 36 | **Avoid** | Wrong direction for you |

A few things people should understand:

- **The score is about *you*, not the strain's general quality.** A famous,
  excellent strain can score 61 for you if its effect or character isn't what
  *you* asked for. (Sour Diesel smells exactly like a gas lover wants, but its
  energetic head-high scores low for someone who wants to relax — that's the
  engine being right, not wrong.)
- **What drives the number:** how close the strain is to your *favourites*
  (weighted most when you have a clear cluster of them), how well its **effect**
  fits the experience you want, then **aroma**, **flavour**, and softer signals
  (texture, bud structure, families). Penalties apply only when a strain carries
  something you said you want to avoid.
- **The top end is compressed on purpose.** Your saved favourites sit at 94–96
  (never 100 — grower/batch/storage can always disappoint). Strong non-favourite
  matches spread across an "elite" 89–92 band so the best alternatives are
  ordered, not flattened onto one ceiling.
- **Uncertainty is labelled, not hidden.** Soft, grow-dependent data (like bud
  density) carries an explicit confidence level — *presumed → low → medium →
  high* — and the engine nudges the score only as much as its confidence
  warrants. Where we don't know, we say so and add nothing.

---

## 3. Engine vs. a human sommelier — the honest comparison

The right framing is **different jobs, not better/worse**:

- A **sommelier judges the wine in the glass.**
- **SŌMA judges the name on the menu.**

Where the engine genuinely competes — and often beats an average budtender:

- **Consistency.** It never tires, never pushes what it needs to sell, never
  forgets a strain. Same profile → same honest read, every time.
- **Transparency.** Audit mode shows exactly why, line by line. No human
  explains "this'll suit you" with that precision.
- **Personalisation + memory at scale.** It remembers everything you've rated
  and tunes to *you*.
- **Honesty about uncertainty.** Most people in this space overclaim; the
  engine states its confidence.

Where it can't compete, and shouldn't pretend to:

- It can't **perceive** the actual product (freshness, cure, this batch).
- **Effect prediction** — the most valuable part — is the hardest and where the
  engine is weakest, because effect is so person- and context-dependent.

Bottom line: SŌMA is **not a "digital sommelier."** It's a sharp, consistent,
personal **shortlisting guide** — and in that role it's genuinely strong. Its
edge isn't being "smarter than a human"; it's being consistent, transparent and
honest about what it doesn't know, in a field where people mostly guess
confidently.

The one honest risk to manage: **false precision.** Numbers like 61 or 92 can
look more exact than the noisy underlying data supports. Audit mode, confidence
levels and the caveats are what keep that in check — keep them prominent.

---

## 4. Why feedback is the whole game (and the user-facing pitch)

The single thing that lets the engine break past the "noisy data" ceiling is
**your feedback.** When you tell it how a pick actually landed (loved / good /
neutral / avoid), it stops matching *labels* and starts calibrating to
*reality* — your reality.

This is the message the public page should lead with, framed for the user:

> **This engine is yours, and it gets sharper every time you rate a pick.**
> Tell it how something actually landed and it learns *your* real taste — not
> the marketing on the jar. The more you rate, the fewer ties, the more
> confident the picks.

And — important — **make missing feel safe and useful, not like a failure:**

> **A miss is not the engine being wrong — it's the engine learning.** Even a
> real sommelier misses; that's exactly how they discover what you actually
> like and stop suggesting the wrong thing next time. Every "nah, not for me"
> teaches SŌMA to not put that in front of you again. The misses are how it
> earns the hits.

Mechanically this is real: confirmed likes/dislikes feed back into every future
score for that user, with a diminishing-returns taper so confirmed signal fills
the gaps the profile missed rather than inflating what it already knew. At
scale, this is the only true moat — an engine calibrated by thousands of honest
"it landed / it didn't" verdicts becomes something a single human can't match.

---

## 5. Notes for the public "How it works" page

- Lead with **§4 (feedback)** — that's the behaviour we want to encourage.
- Use **§2 (the scale)** to defuse the #1 confusion: "why did my favourite
  strain only score 61?" Answer: the score is about *you*, not the strain.
- Use **§3 (vs sommelier)** as the trust-builder: be upfront that it judges the
  menu, not the jar. Honesty here reads as credibility.
- Keep the tone of this doc: calm, precise, no hype. Under-promise.
- Cross-link from the score badges and from the Audit panel so the explanation
  is one tap away from where confusion happens.
