# Strain image prompts — generation guide

Atmospheric scene images for the catalog cards. You generate them
(Midjourney / DALL·E / whatever you like), drop the files in, and the
cards pick them up automatically.

## How it works

1. Generate an image for a strain using the prompts below.
2. Save it as `public/strains/<slug>.webp` (or `.jpg`/`.png`/`.avif`).
   The **slug** is the strain name lowercased with spaces → hyphens.
   Examples: `GG4` → `gg4.webp`, `King Louis XIII` → `king-louis-xiii.webp`,
   `White Hot Guava` → `white-hot-guava.webp`.
3. Run `npm run images:sync` — this scans `public/strains/` and updates
   the manifest the cards read from.
4. Commit the images + the regenerated `src/lib/strain-images.ts`.

Cards with no image just keep the family gradient — so you can roll
these out a few at a time, no rush.

## Specs

- **Aspect:** vertical **3:4** (e.g. 768×1024). The card is a tall
  poster, so portrait orientation matters.
- **Format:** WebP preferred (smallest). ~30–60 KB each is plenty —
  these display small. JPG/PNG also fine.
- **No text, no people, no products, no cannabis plants/leaves.** The
  image is mood/atmosphere only; the strain name and tags are drawn by
  the UI on top. A dark scrim is applied automatically so text stays
  legible — generate scenes that read well even with darkened top &
  bottom edges.

## Shared style suffix

Append this to every prompt so the whole set looks consistent:

> — cinematic atmospheric landscape, moody dramatic lighting, painterly
> depth, no text, no people, no products, no cannabis plants or leaves,
> vertical 3:4 composition, dark premium editorial aesthetic

---

## Anchor strains (do these first — 31)

| Strain | File | Scene prompt (add the style suffix) |
|---|---|---|
| GG4 | `gg4.webp` | A dense fog-soaked pine forest at dusk, faint fuel-blue haze drifting between dark trunks, sticky resinous air, deep greens and charcoal |
| OG Kush | `og-kush.webp` | A misty California canyon at twilight, sharp pine ridges, lemon-grey fog, a faint petrol shimmer in the air |
| Sour Diesel | `sour-diesel.webp` | A neon-lit city street at dawn, diesel haze rising off wet asphalt, sodium-yellow glow, restless electric energy |
| Chemdawg | `chemdawg.webp` | A rain-slick alley at night, sharp chemical-metallic glow, acrid diesel mist, gritty origin energy |
| Stardawg | `stardawg.webp` | A starry night sky over a dark ridge, bright chemical-silver glints, sharp clear cosmic air |
| GMO Cookies | `gmo-cookies.webp` | A dark earthy cellar with hanging garlic, savoury umami atmosphere, chem-green shadows, heavy and pungent |
| Permanent Marker | `permanent-marker.webp` | A dark industrial loft cut by a single sharp light, chemical-blue haze, sleek funky modern, ink-black shadows |
| Donny Burger | `donny-burger.webp` | A dark smoky grill at night, savoury char-smoke haze, heavy gas-funk shadows, dense and rich |
| Black Truffle | `black-truffle.webp` | A dark damp forest floor scattered with mushrooms, deep earthy black-brown tones, funky truffle mist |
| King Louis XIII | `king-louis-xiii.webp` | A towering moonlit pine forest, regal and heavy, deep emerald shadows, a throne of ancient trees, full moon |
| Face Off OG | `face-off-og.webp` | A foggy fuel depot at night, pure petrol-blue haze, stark industrial, heavy gas atmosphere |
| Tahoe OG | `tahoe-og.webp` | Heavy snowfall over dark Tahoe pines at dusk, dense fog, sedating cold stillness, deep blue-grey |
| Skywalker OG | `skywalker-og.webp` | A deep-space starfield warping into hyperspace, dark cosmic blues, sedating drift, otherworldly |
| Fire OG | `fire-og.webp` | Embers and smoke rising through a dark forest, warm orange flame-glow against gas-blue haze, intense and heavy |
| Northern Lights | `northern-lights.webp` | The aurora borealis over a still dark pine forest, deep indigo sky, snow on the ground, calm and sedating |
| Bubba Kush | `bubba-kush.webp` | A dim cozy room at night, rich coffee-brown tones, a single warm lamp, dark-chocolate atmosphere, deep rest |
| Granddaddy Purple | `granddaddy-purple.webp` | A moonlit vineyard at night, deep violet grapes heavy on the vine, dusty purple haze, regal stillness |
| Blue Dream | `blue-dream.webp` | A soft blue dawn over a misty blueberry field, gentle pastel light, dreamy haze, floating calm |
| Gelato | `gelato.webp` | A creamy pastel sunset over rolling hills, sherbet-pink and orange clouds, smooth and balanced, soft glow |
| Wedding Cake | `wedding-cake.webp` | A warm dim patisserie at night, soft vanilla-cream light, a dusting of sugar-frost, cozy amber glow |
| Sundae Driver | `sundae-driver.webp` | A smooth pastel highway at golden hour, creamy sunset, easy cruising mood, soft warm light |
| Apple Fritter | `apple-fritter.webp` | A warm autumn orchard at dusk, golden apple light, cinnamon-pastry haze, cozy sedating glow |
| Animal Mints | `animal-mints.webp` | A cool minty-blue frosted forest at dawn, crisp menthol mist, silvery-green chill |
| Ice Cream Cake | `ice-cream-cake.webp` | A soft frozen pastel landscape, cream and white frost, dreamy sweet, heavy quiet stillness |
| Mochi | `mochi.webp` | A soft pastel zen garden, mochi-pink and cream tones, gentle exotic calm, dreamy |
| Runtz | `runtz.webp` | A candy-coloured surreal dreamscape, glossy pink and purple haze, sugar-glass reflections, playful exotic |
| Jealousy | `jealousy.webp` | A luxe dark emerald-green haze shot with golden shimmer, perfumed exotic glamour, glossy and rich |
| Gary Payton | `gary-payton.webp` | A bright energetic city plaza at dusk, gassy-blue and warm light mixing, social electric vibe |
| RS11 | `rs11.webp` | A cherry-blossom grove at golden dawn, vivid pink-red bloom, exotic fresh light |
| Lemon Cherry Gelato | `lemon-cherry-gelato.webp` | A vivid sunset of lemon-yellow and cherry-red clouds, juicy tart burst of colour, exotic glow |
| Pancakes | `pancakes.webp` | A warm breakfast-golden morning, soft syrup-amber tones, cozy comforting glow |

---

## Family fallbacks (for everything else)

If you don't want a unique scene per strain, reuse the family scene for
every strain in that `sensoryFamily`. Less unique, but instantly covers
the whole catalog. (You can name the file per strain slug but use the
same prompt.)

| Family | Scene prompt (add the style suffix) |
|---|---|
| `gas-og` | A misty fog-soaked pine forest at dusk, faint fuel-blue haze, sticky resin air, deep greens and charcoal |
| `diesel-chem` | A neon-lit rain-slick city street at dawn, diesel haze off wet asphalt, sodium-yellow electric glow |
| `garlic-funk` | A dark earthy cellar, savoury umami shadows, chem-green funk mist, heavy and pungent |
| `kush-classic` | A warm dim hashish caravan tent at night, amber lamplight, dusty earthy calm, deep sedation |
| `purple-berry` | A moonlit vineyard, deep violet grapes, dusty purple haze, regal night stillness |
| `dessert-cookies` | A warm dim patisserie at night, vanilla-cream light, sugar-frost dusting, cozy amber glow |
| `citrus-haze` | A golden lemon grove at dawn, bright citrus-oil light, zesty fresh haze, uplifting |
| `sweet-haze` | A soft blue dawn over a misty berry field, gentle pastel light, dreamy floating calm |
| `pine-spice` | A crisp fresh pine ridge at morning, sharp resin air, cool green clarity, mountain light |
| `modern-exotic` | A candy-coloured surreal dreamscape, glossy pink and purple haze, sugar-glass reflections, playful exotic |

---

## Tips for a consistent set

- Generate the whole anchor batch in one session with the same model and
  the same style suffix so they share a look.
- Keep them **dark** — the cards are dark and the scrim darkens edges
  further; a bright image will fight the white text.
- Avoid recognisable landmarks or logos — these are moods, not places.
- If a result has accidental text or a leaf, regenerate; we keep the
  "no text / no leaf" rule strict so the UI owns all the labelling.
