# Testing SŌMA on real dispensary menus

This guide walks you from a fresh clone to manually validating SŌMA against
real menus, end-to-end. Follow it top to bottom the first time — you don't
need to be a developer.

---

## 1. Setup from zero

### Prerequisites

- Node.js **20+** (22 is what we develop on)
- A PostgreSQL database — either local Postgres or a free
  [Supabase](https://supabase.com) project
- `git` and a terminal

### Steps

```bash
# 1. Clone and enter the repo
git clone https://github.com/Adisabeba33/Soma.git
cd Soma

# 2. Configure environment
cp .env.example .env
```

Open `.env` and set `DATABASE_URL` to your connection string.

For **Supabase**: Project Settings → Database → Connection string (URI). Use
the *Session* pooler (port `5432`), not the transaction pooler. Example:

```
DATABASE_URL="postgresql://postgres.xxxxx:YOURPASS@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?schema=public"
```

For **local Postgres**:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/soma?schema=public"
```

`OPENAI_API_KEY` is **optional** — without it SŌMA uses the deterministic
engine and skips the AI rewrite layer. Leave it blank if you don't have one.

```bash
# 3. Install dependencies
npm install

# 4. Apply the schema to your database
npm run db:push

# 5. Launch the dev server
npm run dev
```

Open <http://localhost:3000>.

---

## 2. Where to paste menus

1. From the home page, click **Start Taste Match**.
2. First visit: fill in the short sensory questionnaire and save it. Every
   match afterwards is scored against this profile.
3. On the *What's on the menu?* screen, you have two ways to add strains:
   - Type each name into the tag input and press Enter.
   - Paste a dispensary menu into the **Paste a dispensary menu** textarea,
     then click **Extract strains**.
4. After extraction, a **Parsed menu preview** appears with detected grower /
   THC / price / weight per line, plus warnings for unclear rows. Sanity-check
   it before running the analysis.
5. Click **Run Taste Match**.

---

## 3. How to test recommendations

On the results screen you'll see:

- **Menu quality** card — totals for parsed / unclear / unknown / known, plus
  an overall confidence percentage.
- **Recommendation cards**, ranked best to worst, each showing:
  - the match score and category (Best Match → Avoid)
  - aroma / flavor / effect sub-scores
  - "Why it suits you" and "What to watch" notes
  - a constant batch-quality disclaimer (grower / freshness / package date
    aren't captured)

To validate a recommendation, ask:

- Does the top pick line up with what you'd actually choose given the profile?
- Are conflicts surfaced for risky picks?
- For unknown strains: is the confidence honestly marked as `low`?

---

## 4. How to view Saved sessions

- Click **Save results** on a results screen to mark a session for keeping.
- Visit `/saved` (link at the top of the page) to see saved + recent
  history.
- Click any row to expand the full recommendations, including per-strain
  feedback controls (purchased / liked / rating / notes).
- Logging feedback here feeds back into future scoring (bounded modifier,
  capped at ±12 points).

---

## 5. How to export JSON

Two entry points, both produce the same payload:

- **From results screen** — click **Export JSON**.
- **From `/saved`** — click the download icon next to any session.

The downloaded `soma-session-<id>.json` contains:

- session metadata (id, engine, inputType, createdAt)
- the raw input
- parsed items (every line with grower / THC / price / weight / confidence)
- parser warnings
- menu quality numbers
- the taste profile snapshot used for scoring
- every recommendation with its current feedback
- all unknown strains logged against the session

Keep these dumps. They're the ground truth for any later tuning.

---

## 6. How to run automated tests

```bash
npm test
```

Runs the `node:test` suite via `tsx`. Covers the menu parser, the strain
name normalizer, and the unknown-strain payload builder. ~30 assertions,
finishes in under a second. Use it as a smoke check before pushing.

---

## 7. Real-world sample menus

Paste these into the menu textarea on the Taste Match page to exercise
different parser paths.

### Sample A — Clean dispensary menu

```
Wedding Cake
Blue Dream
Northern Lights
GG4
Sour Diesel
Granddaddy Purple
Jack Herer
Gelato
Runtz
Pineapple Express
```

Expected: 10 high-confidence rows, all known strains, no warnings.

### Sample B — Messy / noisy menu

```
Top Shelf
Wedding Cake by Jungle Boys 3.5g 28% $60
Stiiizy: Gelato 3.5g $40
Sour Diesel (Cookies) - 22% - $55
1. Northern Lights 7g — $80
GG4 1/8 $50
Do-Si-Dos 1/8 $45
Gelato #33 3.5g 25% $50
GMO Cookies, Forbidden Fruit, Runtz, Pineapple Express
EDIBLES
```

Expected: 13 rows extracted, category headings (`Top Shelf`, `EDIBLES`)
dropped, grower / THC / price / weight populated where present, all known.

### Sample C — Promo-heavy menu with unknowns

```
🔥 SPECIAL TODAY ONLY 🔥
Wedding Cake by Jungle Boys — 28% — was $70 now $55
GELATO 41 - 3.5G - 27% - $60
Cosmic Garlic Funk 28% $65
Frosted Reverie by Local Farm 3.5g $50
Mac 1 - 3.5g - $50 - BUY 2 GET 1
OG Kush (Cookies / Stiiizy) 3.5g $55
Lemon Cherry Gelato — 30% THC — $70
Some Random Strain Name That Is Way Too Long With Extra Promo Text 20% off today
Zkittlez
GG4
```

Expected: 10 rows, 2 unknown strains (`Cosmic Garlic Funk`,
`Frosted Reverie`), 1–2 low-confidence rows flagged with warnings, the
promo header dropped or surfaced as unclear.

---

## 8. Manual validation checklist

Walk this list while testing. Mark a row failed if behaviour differs from
the expectation — and capture the menu text + exported JSON.

### Parser

- [ ] Strain names extracted from `strain — type — THC — price` lines.
- [ ] List markers (`1.`, `-`, `•`) stripped from the beginning.
- [ ] Fraction weights (`1/8`, `1/4`) and gram weights (`3.5g`, `7g`)
      removed from the name but captured in the `weight` field.
- [ ] Category headings (`Top Shelf`, `EDIBLES`, `Specials`) dropped.
- [ ] Comma-separated single-line lists expanded into multiple items.
- [ ] Dedupe is case-insensitive (`Gelato` and `gelato` collapse).

### Grower extraction

- [ ] `Strain by Grower …` captured.
- [ ] Trailing `(Grower)` captured.
- [ ] `BRAND: Strain` prefix captured as grower and removed from the name.
- [ ] No grower detected → field is `null`, row still extracts.

### THC / price / weight

- [ ] `28%` / `THC 24%` / `24% THC` all parse to the numeric `thcPercent`.
- [ ] `$45` / `$ 45` / `$45.00` parse to the numeric `price`.
- [ ] `3.5g`, `7g`, `1/8`, `1/4` parse to the `weight` field.
- [ ] Missing values stay `null` — never invented.

### Unknown strain behaviour

- [ ] Strain not in the seed DB still produces a recommendation
      (inferred from name), marked `confidence: low`.
- [ ] Recommendation card carries an "inferred from name" note.
- [ ] The strain shows up in the exported JSON under `unknownStrains`,
      with `grower` and `rawLine` populated where the parser caught them.
- [ ] Re-running the same menu against the same user bumps the existing
      row's `occurrences` and `lastSeenAt` — does **not** create
      duplicate rows.

### Menu quality scoring

- [ ] `totalParsed` matches the number of extracted lines.
- [ ] `unclearRows` matches the count of rows with `confidence !== "high"`.
- [ ] `unknownStrains` equals the number of inferred recommendations.
- [ ] `avgConfidence` is between 0 and 1 and behaves sensibly (high for
      clean menus, drops for messy ones).

### Recommendation quality

- [ ] The top result fits the profile that was just filled in.
- [ ] Conflicts (e.g., disliked aroma present) surface in "What to watch".
- [ ] Sub-scores (aroma / flavor / effect) match the strain's listed
      attributes.
- [ ] Categories step down monotonically with `matchScore` (no Avoid
      above a Worth Trying with a higher score).

### Export JSON validity

- [ ] Downloaded file parses as JSON.
- [ ] Contains `session`, `tasteProfile`, `recommendations`,
      `unknownStrains`, `menuQuality`, `parsedItems`, `parserWarnings`.
- [ ] `recommendations[*].feedback` reflects the latest like/dislike
      logged in `/saved` (re-export after changing feedback).

### Saved session integrity

- [ ] **Save results** marks the session as saved on `/saved`.
- [ ] Expanding a saved session shows the original recommendations.
- [ ] Deleting a session removes it from `/saved` and from the export
      endpoint.

### Feedback loop behaviour

- [ ] Marking a strain *liked* nudges later recommendations toward
      similar strains (within the ±12 point cap).
- [ ] Marking a strain *disliked* nudges away.
- [ ] A single rating doesn't move scores by more than ~3–4 points
      (anti-overfit damping is doing its job).
- [ ] The "feedback note" callout (with a Sparkles icon) appears on
      cards where feedback shifted the score by ≥3 points.

---

## 9. Known limitations

These are deliberate. SŌMA optimises for honest, deterministic sensory
matching, not for being a strain encyclopedia.

- **No OCR.** Menu photos and screenshots aren't supported — you paste
  text.
- **No web scraping.** SŌMA never fetches menus from dispensary sites.
- **No terpene database.** Aroma / flavor / effect vocab is the only
  sensory signal; specific terpene profiles aren't modelled.
- **No ML / LLM reasoning in scoring.** The optional OpenAI layer only
  rewrites prose. Scores are 100% deterministic.
- **No batch freshness understanding.** Package date, cure quality,
  storage conditions, grow medium — none of these are captured. Every
  recommendation card says this out loud.
- **Recommendations are deterministic.** Same profile + same menu +
  same feedback history → same scores, every time. There is no
  randomness or vector similarity layer.

---

## 10. Next phase

Short list, in order:

1. **Real menu testing.** Run SŌMA against menus from at least 5–10
   actual dispensaries. Save sessions and export JSON for each.
2. **Collect unknown strains.** Review the `UnknownStrain` table
   (or the export bundles) for frequently seen names that aren't in
   the seed DB. Add the ones that recur to `src/lib/strain-data.ts`.
3. **Improve recommendation logic from feedback.** Once we have real
   like/dislike data, tune the bounded modifier (currently ±12pt cap,
   damping constant 2) against observed user behavior.
4. **Eventually: terpene / sensory expansion.** Only after the above
   has produced enough validation data to justify the added complexity.

No new architecture work until step 1 produces real usage data.
