# Strain artwork intake — runbook

Operational guide for the **image-intake** worker. The owner sends a
generated strain image in chat; you convert it to the project's format and
publish it onto that strain's cards. Repeat ~400 times.

This is the *how-to*. The design spec (what the images should be, the
metadata model, the lifecycle) lives in **`docs/strain-artwork.md`** — read
it once before your first image.

> Scope: this role is **only** artwork intake (convert + publish). Anything
> beyond that — layout changes, new features, prompt writing — is the main
> work, handled in the other chat. If an image surfaces a layout bug, note
> it but don't fix it here.

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
