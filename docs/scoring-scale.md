# SOMA scoring scale — what the % means

The match % is a **0–99 sensory-fit score for *your* profile** — not a
quality rating of the strain. A 55 isn't a "bad strain"; it's "a so-so fit
for what you told us you like." This page documents the bands exactly as the
engine computes them (`categorize` + the calibration clamps in
`src/lib/taste-engine.ts`), so the team and the UI tell the same story.

## Three zones (and the gap)

```
 94–96      ★ Your favourites               (the strains you saved as anchors)
 92.01–93.99 — empty by design              (the visual gap)
 89.00–92.00 ◆ Elite alternatives           (strong non-favourites, shown to 2 decimals)
  4–88      everything else                 (ordinary non-favourites, whole numbers)
```

- **Favourites land at 94–96 — never 100.** A saved favourite is your ground
  truth, so it's floored into 94–96. It is deliberately **not 100** because we
  don't know the *batch*: grower, freshness, cure and storage aren't visible
  to the engine, and even a perfect sensory match can be a bad jar. So 96 is
  the honest ceiling for "this is literally your strain."
- **Strong non-favourites spread across an elite 89–92 band.** A non-favourite
  can't reach 94, but rather than flattening every great alternative onto a
  single 88, the ones that clear 88 are mapped — monotonically in their raw
  pre-calibration score — across **89.00–92.00**, shown **to two decimals**.
  92 is "almost a favourite", 89 the weakest of the strong. The decimals keep
  the leaders distinguishable (Rainbow Belts 91.63 still reads above Apples &
  Bananas 91.57 above RS11 90.44) instead of three identical 88s.
- **So can a strain go from 92 → 94? No.** 92.01–93.99 is an intentional dead
  zone. The only way into 94–96 is to *be* one of your saved favourites. A
  brilliant alternative maxes at 92; to climb higher it has to become an anchor
  (you add it to your favourites).

## The quality bands (the 4–92 range)

These are the engine's actual category thresholds:

| Score | Category | What it means for your profile |
|---|---|---|
| **80–92** | **Best Match** | As close as a *new* strain gets to your favourites — strong, confident pick. Above 88 it enters the elite 89–92 band and shows decimals. |
| **66–79** | **Closest Alternative** | Clearly your territory; a couple of notes off your ideal. A safe try. |
| **50–65** | **Worth Trying** | Real overlap but real differences too — a coin-flip that could land either way. |
| **36–49** | **Risky** | Mostly off-profile; only partial overlap. Buy only if you're exploring. |
| **4–35** | **Avoid** | Not your profile (or a strain you marked disliked / with hard conflicts). |

Rule of thumb for the user:
- **75–92 → strong recommendation** (top of Best Match / the elite 89–92 band).
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
  favourite." The 92 band ceiling + the 92→94 gap keep that promise visible —
  the elite band lets the leaders separate without ever touching anchor range.
- **Profile-relative.** The same strain scores differently for different
  people. The % answers "how well does this fit *you*," not "is this good."
- **Batch-aware humility.** Even your own favourite tops at 96 — the engine
  never claims to know the jar in front of you.

> Source of truth: `categorize()` (thresholds 80/66/50/36), the anchor floor
> `clamp(max(base,94),94,96)`, and the elite-band remap (`matchScore > 88` →
> 89–92, two decimals) in `src/lib/taste-engine.ts`. The display formatter is
> `formatScore()` in `src/lib/utils.ts`. If those change, update this page.
