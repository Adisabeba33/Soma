# Cold-start parser — test log & fix backlog

Running log for testing `inferProfileFromDescription`
(`src/lib/profile-from-description.ts`, the "Describe your taste" onboarding
intake). We collect issues here as we probe it, then fix them in **one
batched pass** with tests, rather than one-off patches.

> Status legend: 🔴 open · 🟡 in progress · 🟢 fixed (PR #…)

## How to reproduce a parse

```bash
npx tsx -e '
import { inferProfileFromDescription as P } from "./src/lib/profile-from-description";
const r = P("YOUR DESCRIPTION HERE");
console.dir(r, { depth: null });
'
```

Or hit the live endpoint: `POST /api/profile/from-description { "text": "…" }`.

Reminder: the parser is **English-only**, deterministic (keyword/synonym),
and only **seeds an editable preview** — the user can fix chips before
saving, so a wrong first pass is recoverable, not fatal.

---

## Issues

### 🔴 ISSUE-1 — Negation scope is whole-clause, not forward-scope
- **Found via:** *"…keeps me social and giggly **without** frying my brain."*
- **Observed:** `giggly` landed in `dislikedEffects`; `citrus` and
  `tropical` from the same clause were dropped entirely.
- **Expected:** `giggly` is a **wanted** effect; `citrus`/`tropical` are
  **wanted** aromas. Only "frying my brain" (the thing after *without*)
  should be negated.
- **Root cause:** `clauses()` splits on `[,.;:!?]`, `but`, `except`. A
  negation cue (`not/without/no/…`) anywhere in a clause flags the **entire
  clause** as negated, so positives that appear *before* the cue get flipped
  (effects) or discarded (aromas).
- **Proposed fix:** Move from clause-level to **forward-scope** negation:
  a token is negated only if a negation cue appears **before it** within the
  clause (e.g. split the clause at the cue, or track the cue's index and
  compare to each match's index). Words before the cue stay positive.
- **Nuances / risks:**
  - A clause can flip mid-way ("relaxed but not sleepy" already works via the
    `but` split; "relaxed without the couch-lock" must keep `relaxed`
    positive and only negate `couch-lock`).
  - Multiple cues per clause are possible.
  - Keep the existing `but`/`except` clause split — forward-scope is layered
    on top within each clause.

### 🔴 ISSUE-2 — No "disliked aromas" channel
- **Found via:** *"Cannot stand anything floral or soapy."*
- **Observed:** `floral` was silently excluded from preferred; nothing
  recorded as a negative. `soapy` isn't in the vocab so it's invisible.
- **Expected:** A way to record "actively dislikes floral" so the engine can
  penalise floral-forward strains, not just decline to reward them.
- **Root cause:** The profile model has `dislikedEffects` but **no
  disliked-aroma field**; the parser has nowhere to put a negated smell, so
  it drops it.
- **Proposed fix:** Two parts —
  1. Engine/profile: add an optional `dislikedAromas` (and maybe
     `dislikedFlavors`) channel and wire a penalty into scoring (mirror
     `dislikedEffects`). *(Larger — touches the engine + profile schema.)*
  2. Parser: route negated smell tokens into `dislikedAromas`.
- **Nuances / risks:**
  - This is bigger than a parser tweak — it changes the profile schema and
    the scoring weights, so it needs its own calibration check. Could be
    split into its own PR after ISSUE-1.
  - Decide whether disliked aromas are a hard penalty or a soft demotion.

### 🔴 ISSUE-3 — Some intent words aren't in the trigger vocab
- **Found via:** *"frying my brain"* (meant: avoid too-cerebral/heady);
  *"social"* (meant: wants a social/happy effect).
- **Observed:** "frying my brain" matched nothing (so the thing the user
  wanted to avoid wasn't captured even before scope). "social" matched
  nothing as a wanted effect (it's only a forced-choice `primaryEffect`
  bucket, not an EFFECT token).
- **Expected:** "social" → a wanted social/happy signal; "fry my brain /
  too heady / paranoid / anxious / racy" → an effect to avoid.
- **Root cause:** Synonym coverage gaps. EFFECT_TRIGGERS has no entry for
  "social" (no matching vocab token — closest is `happy`/`giggly`), and
  `head-high` triggers don't include "brain / fry / racy / paranoid".
- **Proposed fix:**
  - Map "social"/"sociable"/"chatty"/"talkative" → `happy` (and/or set
    `primaryEffect: social`).
  - Extend `head-high` triggers: add `fry\w* (my )?brain`, `racy`,
    `paranoi\w*`, `anxious` (note: "anxious/paranoid" usually appear as
    *things to avoid* → interacts with ISSUE-1 forward-scope).
- **Nuances / risks:**
  - "anxious/paranoid" are almost always negated ("nothing that makes me
    anxious"); with forward-scope they should route to `dislikedEffects`,
    not preferred. Add the synonyms only together with the ISSUE-1 fix so
    they don't create false positives.

---

## Tested inputs (for regression once fixed)

These should all parse cleanly after the batch fix; keep as test fixtures.

1. `"Honestly I am all over the place: I love loud gassy diesel funk to melt
   into the couch at night, but in the daytime I want bright citrus and
   tropical stuff that keeps me social and giggly without frying my brain.
   Cannot stand anything floral or soapy, and please nothing that makes me
   sleepy during work. Surprise me a bit."`
   - Expect: aromas {gassy, diesel, cheese, citrus, tropical};
     wanted effects include {giggly, happy}; disliked effects {sleepy} (and
     ideally the "frying my brain"/heady avoid); disliked aromas {floral};
     useTime blank (day+night conflict, multi-modal-safe); lookingFor "new";
     primaryAroma "gas".

*(Add more tricky inputs here as we test them.)*
