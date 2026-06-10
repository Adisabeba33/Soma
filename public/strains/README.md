# Strain artwork

Generated strain images live here. Each file is served at
`/strains/<name>` (e.g. `public/strains/gg4.webp` → `/strains/gg4.webp`).

See `docs/strain-artwork.md` for the full system. Quick rules:

- **Format:** WebP, vertical **3:4**, e.g. **768×1024**.
- **Filename:** the strain slug + `.webp` (lowercase, hyphenated):
  - `GG4` → `gg4.webp`
  - `White Hot Guava` → `white-hot-guava.webp`
  - `Super Lemon Haze` → `super-lemon-haze.webp`
  - (override per strain with `artFileName` in `strain-identity-data.ts`)
- **No text on the image** — no letters, numbers, logos, watermarks or strain
  names. No people, products, packaging, or cannabis leaves/buds. The site
  overlays the name and data; the image is pure atmosphere.
- **Mood:** the image should match the strain's `timeProfile`
  (morning · daytime · sunset · night).

## How to publish an image

1. Generate the image (use `buildArtPrompt(strain, identity)` as a starting
   prompt, or a hand-tuned `artPrompt` on the identity record).
2. Save it here as `<slug>.webp`.
3. In `src/lib/strain-identity-data.ts`, set the strain's
   `artStatus: "published"` (and bump `artVersion` on a regenerate).

Until `artStatus` is `"published"`, the catalog shows the time-of-day
gradient instead of an image — so it's safe to land metadata before the
art exists.
