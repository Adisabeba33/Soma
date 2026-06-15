# SOMA changelog — notable engine & audit changes

A running, human-readable log of meaningful behaviour changes. Not every
commit — just the ones that change how the engine scores or how the audit
reads. Newest first.

---

## Audit Mode → a full engine-tuning tool (PRs #188–#190, #192, #195)

Audit Mode used to say *that* a strain matched; now it shows *how much*, *what
it cost*, *what was missing*, and *how confident each match is*. The audit is
shared by Taste Match and Compare.

- **Per-token strength (#188).** Every match shows its point value
  (`Gassy +12, Euphoric +9`) and every penalty its hit
  (`Cerebral head-high −15`). Points are the sensory-tag share of the score:
  each matched tag's slice of its category's coverage, weighted by category.
  Scoring math is unchanged — this only exposes the breakdown.
- **"Missing" column (#189).** Lists the preferred tags the user asked for
  that a strain matched in *no* category — so a low rank is explainable, not a
  black box.
- **Missing grouped by sense (#190).** Split into **Critical** (aromas, the
  nose), **Secondary** (flavors), **Effect** (effects). A tag covered in any
  category isn't missing; aroma claims a tag shared with flavor so it shows
  once.
- **Copy audit (#192).** One tap copies the whole audit as plain text (every
  match, penalty, and missing group) to paste back for tuning. Clipboard API
  with a hidden-textarea fallback for insecure contexts.
- **Trace shown as partial (#195).** A trace match (see below) renders dimmed
  with a `trace` label and `~+N`, distinct from a small full match. The copy
  appends `(trace)`.
- **Copy ↔ visual parity (#196).** The panel no longer truncates the match /
  missing lists to 6; it shows everything, exactly like the copied text, so
  the two never disagree.

## Skunky calibration (PRs #193–#194)

Triggered by profile testing: gas-forward favourites kept showing
`Critical missing: Skunky` yet still ranked high, raising the question "is
skunky underweighted?"

- **Diagnosis.** Skunky was **not** underweighted — it weighs the same as any
  aroma. The real issue was **data**: only 31/439 strains carried the tag, and
  none of the Chemdog/Sour-Diesel family (whose skunk-diesel funk is a defining
  trait) had it. So "missing skunky" was uniform noise that couldn't separate
  strains.
- **Data fix (#193).** Tagged `skunky` on 9 strains where the note is primary
  and documented on a direct Chemdog or Sour Diesel line: Chemdawg (= Chem D),
  Chem 91, Chem's Sister, Tres Dawg, Stardawg, GMO Cookies, Sour OG, Headband,
  Motorbreath. Deliberately *not* added to gas/cookie strains without a
  documented skunk note (Animal Face, Gas Face, Permanent Marker) — their
  "missing skunky" is accurate.
- **Trace tags (#194).** New third tag state between present and absent: a
  **trace** note the strain carries only faintly or phenotype/grower-dependent.
  A trace match counts at **33%** (`TRACE_TAG_WEIGHT`) of a full match and is
  **not** treated as missing. Applied `skunky` as a trace to 12
  phenotype-variable / secondary-skunk strains (Sour-Diesel & Skunk-cross
  lines), excluding cheese/garlic strains whose funk is already encoded.
  New optional field `StrainProfile.traceAromas`.

### How trace scores

For a preferred token, presence is full (weight 1, or 1.5 on a primary token),
trace (0.33), or absent (0). A lone trace yields exactly its fraction of the
bonus a full match earns over the no-match baseline:

| state | aroma sub-score (skunky alone) | bonus over baseline |
| ----- | ------------------------------ | ------------------- |
| full  | 100                            | 74 (100%)           |
| trace | 50                             | 24 (≈33%)           |
| absent| 26                             | 0                   |
