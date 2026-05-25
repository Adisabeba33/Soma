# Behavioural layers — vocab definitions

SŌMA's scoring engine layers behavioural reasoning on top of the sensory
match formula. Each layer adds bounded ±contribution that nudges the
score, never replaces it. This file is the source of truth for what each
layer term means — when adding a new strain or override, decide which
bucket fits by reading these definitions, not by guessing.

Stability principle: don't redefine an existing term. Add a new one if
the existing vocab can't hold a new distinction.

---

## Layer 1 — Effect archetype

*Broad intent of the high. Source: `src/lib/effect-archetype.ts`.*

| Archetype | Meaning |
| --- | --- |
| `clean-creative-daytime` | Smooth functional uplift, focus and creativity without edge. Best for sober-adjacent productive sessions. *Jack Herer, Durban Poison, Lemon Tree, Tangie, Trainwreck.* |
| `sharp-stimulant` | Pointed dopamine-spike energy. Reads as fast, narrow, sometimes racey. *Green Crack, Ghost Train Haze.* No adjacents — always reads as distinct. |
| `floaty-cerebral` | Head-up, drifty, body disengaged. Classic haze head-high. *Sour Diesel, Amnesia, SSH.* |
| `social-bright` | Giggly, warm, conversational. Light, sociable energy. *Mimosa, Tropicana Cookies, Strawberry Cough.* |
| `introspective-calm` | Quiet, relaxed, low-stim. Not sleepy, just settled. *Zkittlez, Forbidden Fruit, Blueberry.* |
| `smooth-expressive` | Balanced full-bodied hybrid with flavour. *Blue Dream, GG4, Runtz, Gelato.* |
| `dessert-couch-lock` | Sweet/creamy heavy body, sedative dessert. *Wedding Cake, Ice Cream Cake, Gelato Cake.* |
| `garlic-funk` | Savoury pungent, body-forward slow burn. *GMO, Donny Burger, Permanent Marker.* |
| `deep-sleeper` | Couch-lock, sleepy, knock-out indica. *Northern Lights, GDP, Bubba Kush.* |

### Adjacency (Layer 1)

Within a cluster, mismatch doesn't dampen. `sharp-stimulant` has **no
adjacents** — it always feels distinct from everything else.

---

## Layer 2 — Effect texture

*How the high feels in the nervous system. Source:
`src/lib/effect-texture.ts`.*

Two strains can share the same Layer 1 archetype and still feel
completely different in the body — Jack Herer's lucid is not Trainwreck's
chaotic. Layer 2 names that experiential quality.

| Texture | Meaning |
| --- | --- |
| `smooth` | Even, no edges, soft onset and arc. Settles in without surprise. *Tangie, Wedding Cake, Gelato, Maui Wowie.* |
| `dreamy` | Slow, mellow, soft-edged drift. Reality stays present but quieter. *Blue Dream, Forbidden Fruit, Zkittlez.* |
| `floaty` | Weightless, drifty, body disengaged. The head goes somewhere; the body checks out. *SLH, SSH, Amnesia.* |
| `lucid` | Clear-headed, deliberate, functional. You stay you, sharper. *Jack Herer, Durban Poison, Lemon Tree.* |
| `electric` | Racing, restless, persistent energy. Hard to settle. *Green Crack, Bruce Banner.* |
| `sharp` | Pointed, immediate, narrow stimulation. Quick to peak, can over-stim. *NYC Diesel, Ghost Train Haze.* |
| `chaotic` | Unstable, swings, undirected. Can flip register mid-session. *Trainwreck, Sour Diesel at dose.* |
| `grounded` | Settled in the body, present, anchored. Body weight without sedation. *Northern Lights, Bubba Kush, GDP.* |
| `pressure-heavy` | Felt as weight, dense, can be intense. Settles like a coat. *GG4, OG Kush, GMO, Tahoe OG.* |

### Adjacency clusters (Layer 2)

Mismatch within a cluster is free (no penalty). Cross-cluster mismatch
dampens by 3pt.

| Cluster | Members |
| --- | --- |
| Soft | `smooth` · `dreamy` · `floaty` · `lucid` |
| Edgy | `electric` · `sharp` · `chaotic` |
| Heavy | `grounded` · `pressure-heavy` |

---

---

## Layer 3 — Behavioural family

*Which experiential universe a strain belongs to. Source:
`src/lib/behavioral-family.ts`. **Recognition-only — never penalises.***

Layer 3 is a **pure function** of `(archetype, texture)`. Strains are
never tagged with a family directly — it's computed from the two layers
above. This is the single most important architectural invariant of
Layer 3: family vocab cannot drift from archetype/texture vocab because
it doesn't exist as a separate field.

| Family | Composition |
| --- | --- |
| `nighttime-indica` | deep-sleeper × {grounded, pressure-heavy, smooth} · dessert-couch-lock × {smooth, grounded, pressure-heavy} · garlic-funk × {pressure-heavy, grounded} |
| `daytime-functional` | clean-creative-daytime × {lucid, smooth, floaty, dreamy} · social-bright × any · floaty-cerebral × {floaty, dreamy, smooth, lucid} |
| `exotic-modern-hybrid` | smooth-expressive × smooth (Runtz / Gelato wave) |
| `edgy-stimulant` | sharp-stimulant × any · clean-creative-daytime × {chaotic, electric, sharp} · floaty-cerebral × {sharp, electric, chaotic} |
| `contemplative-quiet` | introspective-calm × any · dessert-couch-lock × dreamy |

Compositions outside these rules return `null` — honest signal that this
strain doesn't have a clear experiential universe (e.g. Blue Dream =
smooth-expressive × dreamy → null). Don't force a fit.

### Profile family inference

- ≥ 2 favourites in the same family → that family is the target.
- Scattered favourites across families → `null` (no fake target).
- No favourites + preferred effects/aromas → inferred from a synthetic
  strain via the same composition rule.
- Empty profile → `null`.

### Bonus mechanics (evidence-density scaling)

Family layer adds 0 to +12pt. Family match is the gate; without it, the
bonus is 0. With it, secondary signals scale the reward:

| Signals | Bonus | Meaning |
| --- | --- | --- |
| Family only | +3 | Minimal recognition |
| Family + effect overlap | +6 | Behavioural alignment |
| Family + effect + sensory overlap | +9 | Strong alignment |
| Family + all three secondary | +12 | Full evidence — same world |

Secondary signals:
- **Effect overlap**: `effect.matched.length ≥ 2` OR `effect.score ≥ 60`
- **Sensory overlap**: `aroma.matched.length ≥ 1` OR `flavor.matched.length ≥ 1`
- **Reference similarity**: `ref.score ≥ 40`

The bonus **never goes negative**. A different-family strain gets 0,
which means it doesn't get rescue, but Layer 1+2 still apply their
dampeners. This is intentional separation of concerns: Layers 1+2 punish,
Layer 3 recognises.

---

## How layers compose in scoring

Each layer is a bounded modifier on top of the weighted-sum. Anchor floor
(94–96) and disliked cap (≤18) win over any layer.

| Layer | Mechanism | Max contribution |
| --- | --- | --- |
| Layer 1 archetype | Mismatch dampens effect contribution to 60% | ≈ −11pt (worst case) |
| Layer 1 archetype | Match + strong aroma/flavor → bonus | +4pt |
| Layer 2 texture | Match → bonus | +3pt |
| Layer 2 texture | Cross-cluster mismatch → dampener | −3pt |
| Layer 3 family | Recognition (gate + evidence density) | 0 to +12pt |

Combined worst-case downward swing ≈ −14pt; upward ≈ +19pt. Anchor floor
always overrides. Maximum non-anchor score in best case ≈ 99 (clamp).

---

## Trust-favorites mode (formula reweighting)

A separate architectural switch from the three layers above. Fires when
**≥ 2 of the user's resolved favourites land in the same behavioural
family** (`hasClusteredFavorites(profile)`). When it fires, the scoring
formula re-weights to make reference-similarity the dominant signal:

| Weight | Default mode | Trust mode |
| --- | --- | --- |
| effect | 0.27 | 0.22 |
| aroma | 0.23 | 0.18 |
| flavor | 0.18 | 0.14 |
| trait | 0.14 | 0.10 |
| ref (similarity to favourites) | 0.18 | **0.36** |
| Sum | 1.00 | 1.00 |

The shift is roughly: each surface-tag weight × 0.78, ref weight ×2.
Enumerated preferences (aromas, effects, flavours) still contribute —
they're just no longer the dominant arbiter.

### Why it exists

A user can fill in favourites that describe their lived experience
("Northern Lights, GDP, Bubba Kush") and then tick preference boxes that
contradict that experience ("citrus, pine, focused, creative" — those
boxes feel right at the time but don't actually match their pattern).
In default mode, the weighted-sum gives boxes-ticked the same authority
as favourites, and surface-tag overlap wins.

Trust mode says: if you gave us a clear cluster of favourites, that's
the empirical anchor. Boxes-ticked become supporting interpretation,
not primary truth.

### Why it isn't a Layer 3 dampener

Layer 3 (family) is recognition-only — it never penalises. Trust-mode
isn't a Layer 3 mechanic at all; it's a base-formula reweighting that
applies to **all** strains under the new mode, including cross-family
ones. A cross-family strain with genuinely exceptional ref similarity
still wins in trust-mode — favourite-similarity is the new strongest
signal, not family alignment per se.

### Threshold rationale

Two favourites in the same family is the minimum that prevents single
favourites from accidentally triggering a major formula rewrite. Three
would be more conservative but unresponsive — a typical user who lists
their two go-to indicas shouldn't have to add a third just to be heard.

---

## Adding a new strain or override

1. Find the term whose definition above best describes the lived
   experience. If nothing fits, **don't invent a new one inline** — open
   a discussion to add a new bucket.
2. If the default classifier in the module would already produce the
   right value, leave it as a fallback. Only add an explicit `OVERRIDES`
   entry when the default would be wrong.
3. Add a test in the corresponding test file with a concrete assertion
   — a strain you cared enough to override deserves a regression check.
