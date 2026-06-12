# SOMA scoring scale — what the % means

The match % is a **0–99 sensory-fit score for *your* profile** — not a
quality rating of the strain. A 55 isn't a "bad strain"; it's "a so-so fit
for what you told us you like." This page documents the bands exactly as the
engine computes them (`categorize` + the calibration clamps in
`src/lib/taste-engine.ts`), so the team and the UI tell the same story.

## Three zones (and the gap)

```
 94–96   ★ Your favourites          (the strains you saved as anchors)
 89–93   — empty by design          (the visual gap)
  4–88   everything else            (every non-favourite tops out at 88)
```

- **Favourites land at 94–96 — never 100.** A saved favourite is your ground
  truth, so it's floored into 94–96. It is deliberately **not 100** because we
  don't know the *batch*: grower, freshness, cure and storage aren't visible
  to the engine, and even a perfect sensory match can be a bad jar. So 96 is
  the honest ceiling for "this is literally your strain."
- **Everything that isn't a saved favourite is capped at 88.** No matter how
  close the sensory match, a new strain cannot score 89–96. That band is
  reserved so the gap between *"your strain"* and *"a great alternative"* is
  always visible at a glance.
- **So can a strain go from 88 → 94? No.** 89–93 is an intentional dead zone.
  The only way into 94–96 is to *be* one of your saved favourites. A brilliant
  alternative maxes at 88; to climb higher it has to become an anchor (you add
  it to your favourites).

## The quality bands (the 4–88 range)

These are the engine's actual category thresholds:

| Score | Category | What it means for your profile |
|---|---|---|
| **80–88** | **Best Match** | As close as a *new* strain gets to your favourites — strong, confident pick. |
| **66–79** | **Closest Alternative** | Clearly your territory; a couple of notes off your ideal. A safe try. |
| **50–65** | **Worth Trying** | Real overlap but real differences too — a coin-flip that could land either way. |
| **36–49** | **Risky** | Mostly off-profile; only partial overlap. Buy only if you're exploring. |
| **4–35** | **Avoid** | Not your profile (or a strain you marked disliked / with hard conflicts). |

Rule of thumb for the user:
- **75–88 → strong recommendation** (top of Best Match / upper Closest Alt).
- **65–75 → solid, middle-of-the-road.**
- **50–60 → a gamble** (overlaps, but expect differences).
- **below 50 → a miss for *your* profile** (not necessarily a bad strain).

## Conflict caps (a low score can be forced)

Sensory fit isn't the only thing. If a candidate carries something you said
you avoid (a disliked effect/aroma, a clashing trait), the **category is
capped** regardless of the raw number:

- **1 conflict** → can't rank above **Closest Alternative**.
- **2+ conflicts** → can't rank above **Risky**.
- A strain on your **disliked** list → **Avoid** outright.

Each conflict also subtracts points (−15 each, up to −42), so a strain that
matches your nose but, say, knocks you out when you wanted daytime energy can
fall from a high number into the Risky/Avoid band.

## Why it's built this way

- **Honest, not flattering.** A new strain never poses as "basically your
  favourite." The 88 ceiling + the 89–93 gap keep that promise visible.
- **Profile-relative.** The same strain scores differently for different
  people. The % answers "how well does this fit *you*," not "is this good."
- **Batch-aware humility.** Even your own favourite tops at 96 — the engine
  never claims to know the jar in front of you.

> Source of truth: `categorize()` (thresholds 80/66/50/36), the anchor floor
> `clamp(max(base,94),94,96)`, and `NON_ANCHOR_CEILING = 88` in
> `src/lib/taste-engine.ts`. If those change, update this page.
