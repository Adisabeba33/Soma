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

### 🟢 ISSUE-1 (fixed, PR A) — Negation scope is whole-clause, not forward-scope
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

### 🟢 ISSUE-2 (fixed, PR B) — No "disliked aromas" channel
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

### 🟢 ISSUE-3 (fixed, PR A) — Some intent words aren't in the trigger vocab
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

### 🟢 ISSUE-4 (fixed, PR A) — `couch-lock` trigger is too strict (recurring)
- **Found via:** *"melt **into the couch**"* (phrase 1) and *"**pins me to
  the couch**"* (phrase 2) — both missed.
- **Observed:** Neither produced `couch-lock` (nor `body-heavy`).
- **Expected:** Any "…the couch" body-lock phrasing → `couch-lock`.
- **Root cause:** The regex only matches `couch ?lock|couch ?locked|glued|
  stuck|sedat\w*|pinned|in ?the ?couch`. It misses "into the couch",
  "to the couch", "pins" (vs "pinned"), "glued to the couch".
- **Also (phrase 3):** the canonical hyphenated term **"couch-lock" itself
  is missed** — `couch ?lock` matches "couch lock"/"couchlock" but not the
  hyphenated "couch-lock". The hyphen must be allowed: `couch[- ]?lock`.
- **Proposed fix:** Broaden to catch `couch` in a lock context, e.g.
  `\bcouch[- ]?lock\w*\b` OR `\b(into|to|on|in|glued ?to|stuck ?to|pin\w* ?(me )?(in|to)) ?the couch\b`, or simply treat the bare word `couch`
  (when not "couch surfing" etc.) as couch-lock — short descriptions rarely
  mention a couch for any other reason.
- **Nuances / risks:** Bare `couch` is a strong, low-false-positive signal in
  this domain. Also feeds `bodyFeel` (heavy) — keep that mapping in sync.

### 🟢 ISSUE-5 (fixed, PR A) — Indirect / slang time expressions not recognised
- **Found via:** *"**after a long day**"* (→ evening) and *"**wake-and-bake**"*
  (→ morning) — both missed; `useTime` stayed blank from a *miss*, not from
  an intentional multi-modal conflict.
- **Observed:** `useTime: ""` with no time detected at all.
- **Expected:** "after a long day" / "end of the day" / "nightcap" → evening
  (or bed); "wake and bake" / "wake-and-bake" / "first thing" → morning.
- **Root cause:** USE_TIME_TRIGGERS only covers literal time words. Common
  idioms aren't listed; "wake-and-bake" doesn't contain "wake up", so the
  morning regex misses it.
- **Proposed fix:** Add idioms to USE_TIME_TRIGGERS:
  - morning: `wake ?[-& ]?and[-& ]?bake`, `wake ?n ?bake`, `first ?thing`
  - evening: `after ?a? ?long ?day`, `end ?of ?the ?day`, `after ?work`,
    `nightcap`, `to ?decompress`
  - bed: `before ?(i ?)?sleep`, `pass out`, `nightcap` (overlap — pick one)
- **Nuances / risks:** Watch overlap (a phrase matching two times still
  yields blank by the single-time rule, which is the desired multi-modal
  behaviour — but make sure both are at least *detected* so the conflict is
  real, not a silent miss).

### 🟢 ISSUE-3a (fixed, PR A) — More slang effect synonyms (extends ISSUE-3)
- **Found via:** *"zonk out"* (→ sleepy) missed.
- **Proposed fix:** add `zonk\w*`, `knock\w* out` (have), `pass\w* out`
  (have), `ko'?d`, `comatose` → `sleepy`; `couch` → see ISSUE-4.
- **Also (phrase 3 batch):** `zooted`, `blazed`, `ripped`, `stoned`,
  `blasted` → `euphoric`/`head-high` (very-high slang).

### 🟢 ISSUE-6 (fixed, PR B) — No potency / intensity preference channel
- **Found via:** *"something **strong** n fruity"* and *"**not too potent**,
  **mild**"*.
- **Observed:** "strong" / "potent" / "mild" produce nothing. `bodyFeel` is
  about body-vs-head, not overall strength, so there's no home for "how
  hard-hitting" the user wants it.
- **Expected:** "strong/potent/heavy-hitting" → wants high potency;
  "mild/light/easy/beginner" → wants low potency.
- **Root cause:** No potency-preference field in the description output (the
  questionnaire has `qualityPriorities` incl. "potency", but that's a
  *what-I-judge-on* flag, not a target level).
- **Proposed fix (options):**
  - Light: map "strong/potent" → add `"potency"` to `qualityPriorities`
    (signals they care about strength). Cheap, no schema change.
  - Fuller: a real `potencyPreference: "mild" | "balanced" | "strong"` axis
    on the profile + engine handling. Bigger — own PR, like ISSUE-2.
- **Nuances / risks:** "not too potent" is negated → needs ISSUE-1
  forward-scope to land as *low* potency, not high.

### 🟢 ISSUE-7 (fixed, PR A) — Comparatives ("more X than Y") treated as two equal wants
- **Found via:** *"**more relaxing than energizing**"*.
- **Observed:** both `relaxed` AND `energetic` added as wanted effects.
- **Expected:** `relaxed` is the want; `energizing` is the de-emphasised
  comparison — it should be dropped or down-weighted, not added as a peer.
- **Root cause:** No handling of comparative structure ("more X than Y",
  "X rather than Y", "X over Y", "X not so much Y"). Both sides match their
  triggers and both land positive.
- **Proposed fix:** Detect `more ___ than ___` / `___ rather than ___` /
  `___ over ___` and treat the token(s) after `than/over/rather than` as
  *de-emphasised* (exclude, or move toward dislikedEffects if clearly "not").
- **Nuances / risks:** "more X than Y" means "prefer X"; it does NOT
  necessarily mean "dislike Y" — safest is to just exclude Y from preferred,
  not push it to disliked.

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

2. `"After a long day I just want to zonk out — something super gassy and
   dank that pins me to the couch, ideally a fat sherbet dessert vibe too.
   Wake-and-bake I would rather stay clear-headed and productive, give me
   that creative flow, no munchies though."`
   - Expect: aromas {gassy, earthy, sweet}; wanted effects {sleepy (zonk),
     couch-lock (couch), focused, creative}; disliked effects {hungry};
     useTime blank (evening "long day" + morning "wake-and-bake" conflict —
     but both should at least be *detected*); primaryEffect ambiguous.

3. `"just gimme something strong n fruity, zaza exotic that gets me zooted"`
   - Expect: aromas {fruity}; potency = strong (ISSUE-6); wanted effects
     {euphoric/head-high} (zooted). ("zaza/exotic" may stay unmapped.)
4. `"I prefer cerebral, energetic sativas with citrus and pine notes; I avoid
   heavy indicas that cause couch-lock."`
   - Expect: aromas {citrus, pine}; wanted {head-high, energetic}; disliked
     {body-heavy, couch-lock} — note "couch-lock" hyphen must be caught
     (ISSUE-4).
5. `"more relaxing than energizing, lowkey not too potent, mild and smooth,
   good for unwinding after work"`
   - Expect: wanted {relaxed} (NOT energetic — ISSUE-7); potency = mild/low
     (ISSUE-6); useTime evening; bodyFeel low.

*(Add more tricky inputs here as we test them.)*
