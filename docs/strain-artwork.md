# Strain artwork system

How SOMA gives each strain an image that conveys its **full sensory
experience** — not just aroma, but the time of day, mood, energy and
weight of the strain. Images are generated separately and dropped in over
time; this document is the contract so every batch stays consistent.

**Guiding principle.** Every image must visualise the *full sensory and
behavioural identity* of the strain it represents — its **atmosphere**, its
**character**, and its **culture of behaviour** (how it makes people feel
and act). We take everything the strain delivers to a person — smell,
taste, the arc and texture of the high, its origin and reputation — and
translate it into a single picture. The image *is* the strain's experience
made visible. The art prompts that drive this (and how to write them) live
in `docs/strain-artwork-intake.md`.

Related: `docs/deferred-improvements.md` #12 (Collectible cards) — the
product direction this artwork visually serves.

## The four time-of-day categories

Every strain has a `timeProfile`, one of:

| Mood | Feel | Palette |
|---|---|---|
| **morning** | light, fresh, awake | pale gold + dewy green |
| **daytime** | active, bright, social | open midday blue |
| **sunset** | warm, flavourful, relaxed | amber into wine-dark dusk |
| **night** | deep, heavy, sedative | indigo into near-black |

The point: the catalog should read as a spread of moods, not a uniformly
dark wall.

### How a strain gets its mood

`timeProfile` is **derived automatically** for every strain from its
behavioural family (`deriveTimeProfile` in `src/lib/strain-art.ts`):

- `nighttime-indica` → night
- `daytime-functional` → daytime
- `edgy-stimulant` → morning
- `contemplative-quiet`, `exotic-modern-hybrid` → sunset
- no clear family → by type (indica → night, sativa → daytime, hybrid → sunset)

So the whole catalog gets a sensible mood with zero curation. To override a
specific strain, set `timeProfile` on its record in
`src/lib/strain-identity-data.ts` (e.g. Super Lemon Haze is forced to
`morning` even though it derives to `daytime`).

## Image generation rules

- **Format:** WebP, vertical **3:4** (e.g. **768×1024**).
- **Text policy (updated June 2026):** text *may* appear when it's **baked
  artistically into the scene itself** — e.g. the strain name engraved on a
  tank, carved in stone, painted on a wall as part of the artwork (see Sour
  Diesel's refinery tank). What's **not** allowed is **UI-style text laid
  over the top** — a floating slogan, caption, or the name dropped on as a
  separate label. The app overlays the name and card data itself, so the
  image must not duplicate that as an overlay. No brand logos or watermarks.
- Cinematic scenes, creatures, cityscapes and industrial settings are
  welcome (GG4's throne, Sour Diesel's refinery). Avoid literal product
  shots, packaging, people, and cannabis leaves/buds; no smoke clichés.
- The image should match the strain's `timeProfile` mood and, where it
  helps, its `sensoryFamily` character.

`buildArtPrompt(strain, identity)` produces a default prompt embedding all
of these constraints. Store a hand-tuned override in `artPrompt` on the
identity record when the default misses the strain.

## File naming

The filename mirrors the URL slug (`strainSlug`) plus `.webp`:

- `GG4` → `gg4.webp`
- `White Hot Guava` → `white-hot-guava.webp`

Files live in `public/strains/` and are served at `/strains/<file>`. Set
`artFileName` on the identity record only to override the default.

## Metadata fields (on `StrainIdentity`)

All optional; live in `src/lib/strain-identity-data.ts` next to `tagline`.

| Field | Meaning | Default |
|---|---|---|
| `timeProfile` | mood override | derived from behavioural family |
| `artFileName` | image filename override | `${slug}.webp` |
| `artStatus` | lifecycle (below) | `none` |
| `artVersion` | regeneration counter | `1` |
| `artPrompt` | generation prompt override | built by `buildArtPrompt` |
| `artFocus` | crop focus (`object-position`) so a baked-in name survives the narrow List crop | `"50% 50%"` |

Note: the card "slogan" is the existing `tagline` field — no separate
field. Examples: GG4 → "Couch-bound legend", Sour Diesel → "Acid bright
sativa".

## artStatus lifecycle

```
none ──▶ prompt ──▶ generated ──▶ published
```

- **none** — no art yet. The card shows the time-of-day gradient.
- **prompt** — `artPrompt` written, image not generated.
- **generated** — image produced, in review (file may exist, not shown).
- **published** — live: the WebP renders on the card and detail page.

The image only renders at `published`, so metadata can land safely before
the art exists.

## How to publish an image (per strain)

1. Generate the image from `buildArtPrompt(strain, identity)` (or a tuned
   `artPrompt`).
2. Save it to `public/strains/<slug>.webp` (3:4, no text — see rules above).
3. In `src/lib/strain-identity-data.ts`, set the strain's
   `artStatus: "published"` (bump `artVersion` when regenerating).

## Where it renders

- Catalog grid card — `src/components/catalog-collectible-card.tsx`
- Catalog list row mini-poster — `src/app/catalog/catalog-client.tsx`
  (`CatalogRow`)
- Strain detail hero — `src/app/catalog/[slug]/strain-detail.tsx`

All three fall back to the `paletteForTime` gradient until a strain is
`published`.
