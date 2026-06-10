# Strain artwork intake — runbook

Operational guide for the **image-intake** worker. Two jobs:

1. **Write the art prompt** for a strain — a vivid brief an artist/generator
   turns into the image (see *Writing the art prompt* below).
2. **Publish** the image the owner sends back: convert it to the project's
   format and wire it onto that strain's cards.

Repeat across ~400 strains.

This is the *how-to*. The design spec (what the images should be, the
metadata model, the lifecycle) lives in **`docs/strain-artwork.md`** — read
it once before your first image.

> Scope: this role is artwork — **prompt-writing + convert + publish**.
> Anything beyond that — layout changes, new features, scoring/logic — is
> the main work, handled in the other chat. If an image surfaces a layout
> bug, note it but don't fix it here.

---

## The image rules (quick version)

- **Vertical 3:4**, output **768×1024 WebP**.
- **Text:** allowed only when **baked into the scene** (e.g. the strain name
  on a tank, carved in stone). **Not** allowed: UI-style text laid on top —
  floating slogans/captions or a name dropped on as a label. No brand logos
  or watermarks. (See `docs/strain-artwork.md` → Text policy.)
- If an image clearly breaks these (a plain caption overlaid, a real brand
  logo), flag it to the owner before publishing rather than shipping it.

---

## Writing the art prompt

**The core principle.** Every image must visualise the *full sensory and
behavioural identity* of the strain it represents — its **atmosphere**, its
**character**, and its **culture of behaviour** (how it makes people feel
and act). We take everything the strain delivers to a person — smell,
taste, the arc and texture of the high, its origin and reputation — and
translate that into a single picture. The image is the strain's experience
made visible, not a generic weed graphic.

**Pull the brief from the strain's own data** (`src/lib/strain-data.ts` +
its identity record in `src/lib/strain-identity-data.ts`):

- `aromas` / `flavors` → the palette, materials, light (diesel + sour
  citrus → acid yellow-green, petrol haze, chrome).
- `effects` + `entry.archetype` → the energy and motion (energetic,
  talkative, racy → kinetic, bright, restless; sedative → heavy, still,
  dark).
- `timeProfile` (morning / daytime / sunset / night) → the time of day and
  overall lighting mood.
- `sensoryFamily` → the world it lives in (gas-og, diesel-chem, citrus-haze…).
- `curatorNote`, `tagline`, `lineage`/origin → the character and culture
  (East-Coast NYC roots → industrial skyline; couch-lock legend → heavy
  throne).

**Structure** (this is the shape of the Sour Diesel brief):

1. Format + intent — `Vertical 3:4 poster artwork (768×1024) capturing the
   spirit of …`.
2. The scene/subject that embodies the strain's character.
3. Palette + light drawn from aroma/flavour.
4. Mood + motion drawn from the effect/behaviour.
5. Style — cinematic, painterly, premium editorial; high contrast.
6. Composition note — *keep the lower third calmer/darker so the interface
   can overlay the name legibly.*
7. Negatives — see the text policy: a baked-in name in the scene is fine;
   no UI-overlay captions, no brand logos/watermarks; no literal product
   shots, people, or cannabis leaves.

**Worked example — Sour Diesel** (diesel-chem, daytime, "Acid bright
sativa"):

> Vertical 3:4 poster artwork (768×1024) capturing the spirit of an
> electric, fuel-bright sativa. A radiant early-morning industrial skyline
> on the edge of a 1990s East-Coast city: weathered steel refinery towers,
> fuel tanks and tangled pipework rising into an acid-bright sky, charged
> with kinetic energy — hard golden sunlight cutting through a shimmering
> haze of diesel vapour. Palette sour and electric: acid lemon-yellow and
> citrus-green against cold chrome-blue steel and petrol shadow, sunrise
> gold on the metal edges. A mist of citrus-oil spray and rising fumes gives
> the air a racy shimmer. Mood: awake, restless, talkative, charged with
> motion — bright daytime adrenaline. Cinematic, painterly, high-contrast,
> premium editorial poster. Keep the lower third calmer and darker for
> legible overlay text. The strain name may appear baked into the scene
> (e.g. stencilled on a fuel tank); no overlaid captions, logos or
> watermarks; no people, products or cannabis leaves.

**Store it.** `buildArtPrompt(strain, identity)` in `src/lib/strain-art.ts`
gives a default skeleton you can start from. When you've written a strain's
prompt but the image doesn't exist yet, save it to the strain's `artPrompt`
field and set `artStatus: "prompt"` — then it's recorded in the project and
flips to `"published"` once the image lands (see Step 3).

---

## Step 1 — Find the strain slug

The filename = the strain's URL slug + `.webp`. The slug is produced by
`strainSlug()` in `src/lib/catalog.ts`: lowercase, spaces → hyphens,
punctuation stripped. Examples:

| Strain | Slug | File |
|---|---|---|
| GG4 | `gg4` | `gg4.webp` |
| Sour Diesel | `sour-diesel` | `sour-diesel.webp` |
| White Hot Guava | `white-hot-guava` | `white-hot-guava.webp` |

If unsure, the slug is whatever is in the catalog URL `/catalog/<slug>` for
that strain. You can confirm by searching the strain's `canonicalName` in
`src/lib/strain-identity-data.ts`.

## Step 2 — Convert the image

`sharp` is already installed. Run this, substituting the uploaded image
path and the slug:

```bash
SRC="/path/to/uploaded-image.png"   # the file the owner sent
SLUG="sour-diesel"                   # from step 1
node -e '
const sharp = require("sharp");
const [src, slug] = [process.env.SRC, process.env.SLUG];
sharp(src).resize(768, 1024, { fit: "cover", position: "centre" })
  .webp({ quality: 82 })
  .toFile("public/strains/" + slug + ".webp")
  .then(i => console.log("written public/strains/" + slug + ".webp", i.width + "x" + i.height, i.size + " bytes"))
  .catch(e => { console.error(e); process.exit(1); });
'
```

Notes:
- `fit: "cover"` fills the 3:4 frame and crops the overflow (centre). Most
  uploads are already ~3:4 so the crop is minimal. If the owner sends a
  non-3:4 image and asks to keep it whole, switch to
  `fit: "inside"` — but default is cover.
- Quality 82 is the house setting (GG4 ≈ 135 KB, Sour Diesel ≈ 157 KB).

## Step 3 — Publish in the data

Open `src/lib/strain-identity-data.ts`, find the record with the matching
`canonicalName`, and set its artwork fields:

```ts
artFileName: "sour-diesel.webp",
artStatus: "published",   // ← this is what makes the image render
artVersion: 1,            // bump to 2, 3… only when REGENERATING an image
```

- **`artStatus: "published"`** is the switch. Without it the card shows the
  time-of-day gradient instead of the image.
- `timeProfile` is **optional** — it's auto-derived from the strain's
  behavioural family. Only set/keep it if the owner wants a specific mood
  (e.g. Super Lemon Haze is pinned to `morning`). Don't touch it otherwise.
- **No identity record yet?** Most strains have one. If a strain is missing
  from this file, add a minimal record:

  ```ts
  {
    canonicalName: "Exact Strain Name",   // must match StrainProfile.name in strain-data.ts
    sourceConfidence: "low",
    artFileName: "exact-strain-name.webp",
    artStatus: "published",
    artVersion: 1,
  },
  ```

## Step 4 — Verify

```bash
npx tsc --noEmit            # types clean
npm test                    # strain-art tests stay green
```

Optional live check (confirms the file serves and the page references it):

```bash
(PORT=3120 npm run dev >/tmp/dev.log 2>&1 &) ; \
  for i in $(seq 1 50); do grep -qE "Ready in" /tmp/dev.log && break; sleep 0.5; done; \
  curl -s "http://localhost:3120/catalog/<slug>" | grep -o "/strains/<slug>.webp" | head -1; \
  curl -s -o /dev/null -w "img %{http_code}\n" "http://localhost:3120/strains/<slug>.webp"; \
  pkill -f "next dev"
```

Expect the page to reference `/strains/<slug>.webp` and the image to return
`200`.

## Step 5 — Ship

```bash
git add public/strains/<slug>.webp src/lib/strain-identity-data.ts
git commit -m "Publish <Strain> artwork"
git push -u origin <your-branch>
```

Then open a PR to `main` and merge it (the owner deploys from `main`). You
can batch several strains into one PR if the owner sends a run of images at
once — one commit per strain, then a single PR.

---

## Per-image checklist

1. [ ] Slug derived correctly (`/catalog/<slug>`).
2. [ ] Image fits the text rule (baked-in text OK, no UI overlay).
3. [ ] Converted to `public/strains/<slug>.webp` (768×1024).
4. [ ] `artFileName` + `artStatus: "published"` + `artVersion` set on the
       identity record (created the record if it was missing).
5. [ ] `npx tsc --noEmit` and `npm test` green.
6. [ ] Committed, pushed, PR opened + merged.
