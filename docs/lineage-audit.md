# Catalog lineage audit — genetic parents

> Generated 2026-06-14. Source of truth: `STRAINS` (src/lib/strain-data.ts) +
> `lineage.parents` from `getIdentity()` (src/lib/strain-identity-data.ts).
> To regenerate, re-run the audit script (see "How this was produced" below).

## Summary (400 strains)

| Status | Count | Share |
|---|---:|---:|
| ✅ Complete (2+ parents) | 252 | 63% |
| ⚠️ Partial (1 parent) | 36 | 9% |
| ❌ Empty (0 parents) | 112 | 28% |
| — of which landrace/heritage (parentless **by nature**, OK) | 52 | |
| — of which **real gaps** (modern hybrids missing parents) | 60 | |

**Actionable work = 36 partial + 60 real gaps = 96 strains.**

The landrace/heritage split is best-effort (curated name set in the generator);
move a name between buckets if you disagree.

---

## ⚠️ Partial — one parent known, second missing (36)

Fastest wins: you only need the **second** parent. Some are legitimately
near-pure lines (e.g. Northern Lights → Afghani) where one parent is correct —
mark those "keep".

- **SFV OG** — has `OG Kush`, needs 2nd: `____`
- **Northern Lights** — has `Afghani`, needs 2nd: `____`
- **London Pound Cake** — has `Sunset Sherbet`, needs 2nd: `____`
- **Green Crack** — has `Skunk #1`, needs 2nd: `____`
- **Bay 11** — has `Appalachia`, needs 2nd: `____`
- **Lemon Skunk** — has `Skunk #1`, needs 2nd: `____`
- **Orange Bud** — has `Skunk #1`, needs 2nd: `____`
- **Snowman** — has `Girl Scout Cookies`, needs 2nd: `____`
- **Khalifa Kush** — has `OG Kush`, needs 2nd: `____`
- **Lemon Cherry Push Pop** — has `Lemon Cherry Gelato`, needs 2nd: `____`
- **Guava** — has `Gelato`, needs 2nd: `____`
- **Black Cherry Pie** — has `Cherry Pie`, needs 2nd: `____`
- **Key Lime Pie** — has `Girl Scout Cookies`, needs 2nd: `____`
- **OGKB** — has `Girl Scout Cookies`, needs 2nd: `____`
- **Thin Mint GSC** — has `Girl Scout Cookies`, needs 2nd: `____`
- **Chem's Sister** — has `Chemdawg`, needs 2nd: `____`
- **Apollo 13** — has `Genius`, needs 2nd: `____`
- **Tres Dawg** — has `Chemdawg`, needs 2nd: `____`
- **Sour Bubble** — has `Bubble Gum`, needs 2nd: `____`
- **Northern Lights #5** — has `Afghani`, needs 2nd: `____`
- **Ghost OG** — has `OG Kush`, needs 2nd: `____`
- **Forum Cookies** — has `Girl Scout Cookies`, needs 2nd: `____`
- **Orange Juice** — has `California Orange`, needs 2nd: `____`
- **The Original Z** — has `Zkittlez`, needs 2nd: `____`
- **Jack's Cleaner** — has `Jack Herer`, needs 2nd: `____`
- **OG #18** — has `OG Kush`, needs 2nd: `____`
- **God Bud** — has `Hawaiian`, needs 2nd: `____`
- **ACDC** — has `Cannatonic`, needs 2nd: `____`
- **Purple Skunk** — has `Skunk #1`, needs 2nd: `____`
- **White Gushers** — has `Gushers`, needs 2nd: `____`
- **Blockhead** — has `Sweet Tooth`, needs 2nd: `____`
- **Major League Bud** — has `Williams Wonder`, needs 2nd: `____`
- **Grapefruit** — has `Cinderella 99`, needs 2nd: `____`
- **White Rhino** — has `White Widow`, needs 2nd: `____`
- **Sweet Skunk** — has `Skunk #1`, needs 2nd: `____`
- **Platinum GSC** — has `Girl Scout Cookies`, needs 2nd: `____`

---

## ❌ Real gaps — modern hybrids with no parents (60)

These should have a documented cross. Fill `PARENT_A × PARENT_B`:

- **Tahoe OG**: `____ × ____`
- **Face Off OG**: `____ × ____`
- **Chem 91**: `____ × ____`
- **Gas Face**: `____ × ____`
- **Triple Double OG**: `____ × ____`
- **Triangle Kush**: `____ × ____`
- **Bubba Kush**: `____ × ____`
- **Kosher Kush**: `____ × ____`
- **Pink Kush**: `____ × ____`
- **Yoda OG**: `____ × ____`
- **Strawberry Runtz**: `____ × ____`
- **Pink Runtz**: `____ × ____`
- **Obama Runtz**: `____ × ____`
- **Soap**: `____ × ____`
- **Black Truffle**: `____ × ____`
- **Passion Fruit**: `____ × ____`
- **Pink Lemonade**: `____ × ____`
- **White Hot Guava**: `____ × ____`
- **Amnesia Haze**: `____ × ____`
- **Lemon Tek**: `____ × ____`
- **UK Cheese**: `____ × ____`
- **Lemon Pound Cake**: `____ × ____`
- **The White**: `____ × ____`
- **High Octane OG**: `____ × ____`
- **Pink Guava**: `____ × ____`
- **Black Cherry Gelato**: `____ × ____`
- **The Menthol**: `____ × ____`
- **Bubble Gum**: `____ × ____`
- **Han-Solo Burger**: `____ × ____`
- **Lemonnade**: `____ × ____`
- **Garlic Juice**: `____ × ____`
- **Jelly Donutz**: `____ × ____`
- **Watermelon**: `____ × ____`
- **Mazar**: `____ × ____`
- **California Orange**: `____ × ____`
- **Strawberry Fields**: `____ × ____`
- **Pink Panties**: `____ × ____`
- **Nevil's Wreck**: `____ × ____`
- **Las Vegas Purple Kush**: `____ × ____`
- **Acai**: `____ × ____`
- **Biskante**: `____ × ____`
- **Boggle Gum**: `____ × ____`
- **Marshmallow OG**: `____ × ____`
- **Orange Velvet**: `____ × ____`
- **Charlotte's Web**: `____ × ____`
- **Pineapple**: `____ × ____`
- **Lemon Up**: `____ × ____`
- **Grape Krush**: `____ × ____`
- **Alien Tech**: `____ × ____`
- **Cherry Bomb**: `____ × ____`
- **Holland's Hope**: `____ × ____`
- **Tiramisu**: `____ × ____`
- **Banana Cream**: `____ × ____`
- **Pez**: `____ × ____`
- **Power Plant**: `____ × ____`
- **Honey Banana**: `____ × ____`
- **Arjan's Haze**: `____ × ____`
- **AK-48**: `____ × ____`
- **Lemon Kush**: `____ × ____`
- **Snowcap**: `____ × ____`

---

## 🌍 Empty but parentless by nature — landraces & heritage (52)

No action needed — these ARE the origins. Listed for completeness so nobody
"fixes" them.

Chemdawg, Hindu Kush, Afghani, Purple Urkle, Purple Haze, Durban Poison, Maui Wowie, Acapulco Gold, G13, Mendo Purps, Chocolate Thai, Trinity, Lemon G, Haze, Colombian Gold, Hawaiian, Lamb's Bread, Panama Red, Kali Mist, Malawi, Thai, Mexican, Nepalese, Swazi Gold, Pakistani Chitral Kush, Burmese Kush, Romulan, Sensi Star, Lebanese, Moroccan, Congolese, Oaxacan, Williams Wonder, Punto Rojo, Luang Prabang, Aceh, Kilimanjaro, Zamal, Vietnamese Black, Ethiopian Highland, Sinai, Kandahar, Mullumbimby Madness, Angola Roja, Cambodian, Brazilian, South Indian, Korean, Highland Thai, Persian, Manipuri, Highland Guatemalan

---

## ✅ Complete — 2+ parents already documented (252)

<details><summary>Full list</summary>

- GG4 — Chem's Sister × Sour Dubb × Chocolate Diesel
- OG Kush — Chemdawg × Hindu Kush
- Sour Diesel — Chemdawg 91 × Super Skunk
- Skywalker OG — Skywalker × OG Kush
- GMO Cookies — Chemdog × Girl Scout Cookies
- King Louis XIII — OG Kush × LA Confidential
- Platinum OG — Master Kush × OG Kush
- Fire OG — OG Kush × SFV OG
- Alien OG — Tahoe OG × Alien Kush
- Headband — OG Kush × Sour Diesel
- Motorbreath — Chemdog D × SFV OG
- Sour OG — Sour Diesel × OG Kush
- Donny Burger — GMO Cookies × Han-Solo Burger
- Permanent Marker — Biscotti × Jealousy × Sherbert
- Granddaddy Purple — Purple Urkle × Big Bud
- Master Kush — Hindu Kush × Skunk #1
- LA Confidential — OG LA Affie × California Indica
- Critical Mass — Afghani × Skunk #1
- 9 Pound Hammer — Gooberry × Hells OG × Jack the Ripper
- Do-Si-Dos — OGKB (GSC) × Face Off OG
- Slurricane — Do-Si-Dos × Purple Punch
- Mendo Breath — OGKB × Mendo Montage
- Afgooey — Afghani × Maui Haze
- Ice — Northern Lights × Skunk #1 × Afghani
- Black Domina — Northern Lights × Ortega × Hash Plant × Afghani
- Critical Kush — Critical Mass × OG Kush
- Master Yoda — Master Kush × Yoda OG
- Purple Punch — Larry OG × Granddaddy Purple
- Grape Ape — Mendocino Purps × Skunk #1 × Afghani
- Blackberry Kush — Afghani × Blackberry
- Blueberry — Purple Thai × Afghani
- Berry White — Blueberry × White Widow
- Cherry Pie — Granddaddy Purple × Durban Poison
- Cherry Punch — Cherry AK-47 × Purple Punch
- Girl Scout Cookies — OG Kush × Durban Poison
- Wedding Cake — Triangle Kush × Animal Mints
- Sunset Sherbet — Girl Scout Cookies × Pink Panties
- Animal Cookies — Girl Scout Cookies × Granddaddy Purple
- Animal Mints — Animal Cookies × Blue Power
- Biscotti — Gelato 25 × South Florida OG
- Gary Payton — The Y × Snowman
- Kush Mints — Bubba Kush × Animal Mints
- Cereal Milk — Y Life × Snowman
- Mochi — Sunset Sherbet × Thin Mint GSC
- Oreoz — Cookies and Cream × Secret Weapon
- Lava Cake — Grape Pie × Thin Mint GSC
- Cake Crasher — Wedding Cake × Wedding Crasher
- LA Kush Cake — Kush Mints × Wedding Cake
- Sticky Buns — Kush Mints × Gelatti
- Pancakes — London Pound Cake × Kush Mints
- Birthday Cake — Girl Scout Cookies × Cherry Pie
- Gelato Cake — Wedding Cake × Gelato 33
- Ice Cream Cake — Wedding Cake × Gelato 33
- Peanut Butter Breath — Do-Si-Dos × Mendo Breath
- Grease Monkey — GG4 × Cookies and Cream
- Gelato — Sunset Sherbet × Thin Mint GSC
- Gelato 33 — Sunset Sherbet × Thin Mint GSC
- Gelato 41 — Sunset Sherbet × Thin Mint GSC
- Lemon Cherry Gelato — Sunset Sherbet × Girl Scout Cookies
- Sherblato — Sherbet × Gelato
- Peach Gelato — Peach Rings × Gelato 33
- Italian Ice — Gelato 45 × Forbidden Fruit
- Purple Gelato — Gelato 33 × Purple Punch
- Runtz — Zkittlez × Gelato
- Candy Rain — Gelato × London Pound Cake
- Apple Runtz — Runtz × Apple Fritter
- Layer Cake — Wedding Cake × GMO Cookies × Triangle Kush × Skunk #1
- Hippie Crasher — Kush Mints × Wedding Crasher
- Cherry Lemonade — Cherry Pie OG × Jack the Ripper
- Honey Bun — Gelatti × Honey B
- Strawberry Shortcake — Juliet × Strawberry Diesel
- Pink Champagne — Granddaddy Purple × Cherry Pie
- Zkittlez — Grape Ape × Grapefruit
- Watermelon Zkittlez — Zkittlez × Watermelon
- Grape Gas — Grape Pie × Jet Fuel Gelato
- Black Cherry Punch — Black Cherry × Purple Punch
- MAC — Alien Cookies × Starfighter × Columbian
- Jealousy — Gelato 41 × Sherbet
- Gushers — Gelato 41 × Triangle Kush
- Apples and Bananas — Blue Power × Gelatti × GMO × Banana OG
- RS11 — Pink Guava × OZ Kush
- Zoap — Rainbow Sherbet × Pink Guava
- Sundae Driver — Fruity Pebbles OG × Grape Pie
- Garanimals — Grape Pie × Gelato
- Apple Fritter — Sour Apple × Animal Cookies
- Grape Pie — Cherry Pie × Grape Stomper
- Jet Fuel — Aspen OG × High Country Diesel
- Space Queen — Romulan × Cinderella 99
- Lemon Tree — Lemon Skunk × Sour Diesel
- Melonade — Watermelon Zkittlez × Lemon Tree
- Cap Junky — Kush Mints 11 × Alien Cookies
- Frosted Lemonade — 91 Hollywood Pure Kush × Evergladez
- Sherbanger — Sunset Sherbet × Headbanger
- Triangle Mints — Triangle Kush × Animal Mints
- Lemonatti — Gelonade × Biscotti
- Pineapple Express — Trainwreck × Hawaiian
- Mimosa — Clementine × Purple Punch
- Blue Dream — Blueberry × Haze
- Strawberry Banana — Banana Kush × Strawberry Bubble Gum
- Banana Kush — Ghost OG × Skunk Haze
- Mango Kush — Mango × Hindu Kush
- Banana OG — OG Kush × Banana
- Banana Punch — Banana OG × Purple Punch
- Papaya — Citral × Ice
- Peach Rings — Marionberry × Eddy OG
- Forbidden Fruit — Cherry Pie × Tangie
- Tangie — California Orange × Skunk
- Tropicana Cookies — Girl Scout Cookies × Tangie
- Tropicana Cherry — Tropicana Cookies × Cherry Cookies
- Orange Creamsicle — Orange Crush × Juicy Fruit
- Blueberry Muffin — Blueberry × Razzleberry
- Blueberry Cupcake — Blueberry Muffin × Wedding Cake
- Super Lemon Haze — Lemon Skunk × Super Silver Haze
- Lemon Haze — Lemon Skunk × Silver Haze
- Super Silver Haze — Skunk #1 × Northern Lights × Haze
- Ghost Train Haze — Ghost OG × Nevil's Wreck
- Clementine — Tangie × Lemon Skunk
- Cinex — Cinderella 99 × Vortex
- Sour Apple — Sour Diesel × Cinderella 99
- Tangie Banana — Tangie × Banana
- Jack Herer — Haze × Northern Lights #5 × Shiva Skunk
- Trainwreck — Mexican × Thai × Afghani
- Bruce Banner — OG Kush × Strawberry Diesel
- AK-47 — Colombian × Mexican × Thai × Afghani
- Strawberry Cough — Strawberry Fields × Haze
- Chocolope — Chocolate Thai × Cannalope Haze
- Moby Dick — White Widow × Haze
- Candyland — Granddaddy Purple × Bay Platinum Cookies
- Skunk #1 — Afghani × Acapulco Gold × Colombian Gold
- Super Skunk — Skunk #1 × Afghani
- NYC Diesel — Sour Diesel × Afghani
- Stardawg — Chemdawg 4 × Tres Dawg
- Blue Cheese — Blueberry × UK Cheese
- White Widow — Brazilian Sativa × South Indian Indica
- White Runtz — Zkittlez × Gelato
- MAC and Cheese — MAC × UK Cheese
- Grape Stomper — Purple Elephant × Chemdawg Sour Diesel
- Cotton Candy Kush — Lavender × Power Plant
- Sour Tangie — Sour Diesel × Tangie
- Platinum Kush — Master Kush × OG Kush
- Hash Plant — Northern Lights × Afghani
- Cheetah Piss — Lemonnade × Gelato 42 × London Pound Cake
- White Truffle — GG4 × Peanut Butter Breath
- Animal Face — Face Off OG × Animal Mints
- Project 4516 — Gelato 45 × Platinum Puff
- Modified Grapes — GMO Cookies × Purple Punch
- Sherb Crasher — Sunset Sherbet × Wedding Crasher
- E85 — Wedding Cake × Project 4516
- Sundae Sherbert — Sundae Driver × Sunset Sherbet
- Cherry MAC — MAC × Cherry Pie
- Studio 54 — Sunset Sherbet × OZ Kush
- Pink Picasso — Candyland × OZ Kush
- Power Sherbet — Sunset Sherbet × Cookies and Cream
- Cherry Cake — Cherry Pie × Wedding Cake
- Hot Sauce — Chile Verde × Pancakes
- Orange Daiquiri — Orange Cookies × Grape Pie
- Georgia Pie — Gelatti × Kush Mints
- Rainbow Belts — Zkittlez × Moonbow
- Wedding Crasher — Wedding Cake × Purple Punch
- Gelatti — Gelato × OGKB
- OZ Kush — Zkittlez × OG Kush
- Moonbow — Zkittlez × Do-Si-Dos
- Orange Cookies — Orange Juice × Girl Scout Cookies
- Chile Verde — OG Kush × Key Lime Pie
- Gelato 45 — Sunset Sherbet × Thin Mint GSC
- Platinum Puff — Platinum OG × Grateful Puff
- Jet Fuel Gelato — Jet Fuel × Gelato 41
- Rainbow Sherbet — Champagne × Blackberry
- Blue Zushi — Zkittlez × Kush Mints
- Super Boof — Black Cherry Punch × Tropicana Cookies
- Apple Tartz — Apple Fritter × Runtz
- Pink Certz — Grape Gas × The Menthol
- Wedding Pie — Wedding Cake × Grape Pie
- Cinderella 99 — Jack Herer × Shiva Skunk
- Vortex — Apollo 13 × Space Queen
- Appalachia — Green Crack × Tres Dawg
- Mendo Montage — Mendo Purps × Crystal Locomotive
- Cherry AK-47 — Cherry × AK-47
- Fruity Pebbles OG — Green Ribbon × Granddaddy Purple × Tahoe OG × Alien Kush
- Larry OG — OG Kush × SFV OG
- Champagne — Boggle Gum × Burmese
- Sour Dubb — Sour Diesel × Sour Bubble
- Purple Kush — Hindu Kush × Purple Afghani
- Grape Soda — Tahoe OG × Granddaddy Purple
- Red Zushi — Zkittlez × Kush Mints
- Chocolate Diesel — Chocolate Thai × Sour Diesel
- Shiva Skunk — Northern Lights #5 × Skunk #1
- Alien Kush — Las Vegas Purple Kush × Alien Tech
- Green Ribbon — Trainwreck × Trinity
- Skywalker — Mazar × Blueberry
- Gary Poppins — Gary Payton × Sunset Sherbet
- Crystal Locomotive — Trainwreck × Trinity
- Pink Rozay — Lemonchello × London Pound Cake
- Garlic Breath — GMO Cookies × Mendo Breath
- Tropicana Banana — Tropicana Cookies × Banana
- Sunset Mintz — Sunset Sherbet × Kush Mints
- Apple Gelato — Apple Fritter × Gelato
- Jack the Ripper — Jack's Cleaner × Space Queen
- Gelonade — Lemon Tree × Gelato 41
- Lemonchello — The Original Z × Lemonnade
- Aloha White Widow — White Widow × Hawaiian
- White Russian — AK-47 × White Widow
- Querkle — Purple Urkle × Space Queen
- Jilly Bean — Orange Velvet × Space Queen
- Holy Grail Kush — OG #18 × Kosher Kush
- Khalifa Mints — Khalifa Kush × Kush Mints
- Lemon Cherry Pie — Lemon Cherry Gelato × Cherry Pie
- Big Bud — Afghani × Skunk #1
- Harlequin — Colombian Gold × Thai
- Cannatonic — MK Ultra × G13
- Ringo's Gift — Harlequin × ACDC
- Sour Tsunami — Sour Diesel × NYC Diesel
- Sherbacio — Sunset Sherbet × Biscotti
- MK Ultra — OG Kush × G13
- Lavender — Super Skunk × Afghani
- Blue Power — Master Kush × Blueberry × The White
- Sweet Tooth — Afghani × Hawaiian
- White Fire OG — Fire OG × The White
- Biscotti Sundae — Biscotti × Sundae Driver
- Goji OG — Nepali OG × Snow Lotus
- Snow Lotus — Afgooey × Blockhead
- Blue Magoo — Blueberry × Major League Bud
- Sugar Black Rose — Black Domina × Critical Mass
- Nepali OG — Nepalese × OG Kush
- Skunk Haze — Skunk #1 × Haze
- Hells OG — OG Kush × Blackberry
- Gooberry — Afgooey × Blueberry
- Blue Cookies — Blueberry × Girl Scout Cookies
- Apple Jacks — Jack Herer × White Widow
- White Tahoe Cookies — Tahoe OG × The White × Girl Scout Cookies
- Cheese Quake — UK Cheese × Querkle
- Blackberry — Black Domina × Raspberry Cough
- Raspberry Cough — ICE × Cambodian
- B-52 — Big Bud × Skunk #1
- Big Skunk Korean — Korean × Skunk #1
- Great White Shark — Super Skunk × Brazilian × South Indian
- Jack Flash — Jack Herer × Super Skunk × Haze
- Pineapple Chunk — Pineapple × Skunk #1 × UK Cheese
- Banana Daddy — Banana OG × Granddaddy Purple
- Gushlato — Gushers × Gelato
- Neville's Haze — Haze × Northern Lights #5
- Death Star — Sour Diesel × Sensi Star
- Lemon Diesel — California Sour × Lost Coast OG
- Skunkberry — Skunk #1 × Blueberry
- Blackwater — Mendo Purps × SFV OG
- Cherry Cookies — Cherry Pie × Girl Scout Cookies
- Mango Haze — Haze × Skunk Haze
- Lemon Thai — Thai × Hawaiian
- Hawaiian Snow — Hawaiian × Haze
- Cataract Kush — LA Confidential × OG Kush
- Master Bubba — Master Kush × Bubba Kush
- Sour Grape — Sour Diesel × Granddaddy Purple

</details>

---

## How to fill it in (painless workflow)

The genetics live in **`src/lib/strain-identity-data.ts`**, one record per
strain. The relevant shape:

```ts
{
  canonicalName: "Wedding Cake",
  lineage: {
    parents: ["Triangle Kush", "Animal Mints"],   // the two (or more) parents
    cross: "Triangle Kush × Animal Mints",          // human-readable, optional
    // Only needed when a parent is NOT itself in our catalog:
    parentDetails: {
      "Animal Mints": { lineageBrief: "GSC × Blue Power", type: "hybrid" },
    },
  },
  // ...rest of the identity record
}
```

**To add parents to a strain:**
1. Find its record by `canonicalName` in `strain-identity-data.ts`.
2. If it has no `lineage`, add the block; if it has one, add/extend `parents`.
3. Add `cross` (nice-to-have for the UI copy).
4. If a parent isn't a strain we already carry, add a `parentDetails` entry so
   the UI can still show a short hint (otherwise just the name shows).

**The low-effort way (recommended — like the artwork batches):**
- **Don't touch code yourself.** Fill the plain-text blanks in this file
  (`PARENT_A × PARENT_B`) from a single reliable source, then hand the filled
  list back — the edits get applied to `strain-identity-data.ts` in batches,
  with a typecheck after each batch.
- **Work by family, not alphabetically.** Crosses repeat: do all the
  GSC/Cookies descendants together, then the OG family, then Runtz/Zkittlez,
  then Gelato. You build momentum and reuse the same parent names.
- **Do the 36 partials first.** One missing parent each = the
  cheapest progress.
- **One source, consistently.** Seedfinder / a breeder page / Leafly — pick one
  and note contested crosses as "commonly cited, not verified" (the data already
  uses that honesty convention).
- **Pace:** a focused person does ~30–50 well-sourced crosses an hour once
  warmed up, so the full ~96-strain backlog is
  a few sittings, not a project.

**After applying a batch:** `npx tsc --noEmit` must stay clean, and the strain's
catalog detail page renders the new parents automatically (no UI work).

## How this was produced

A script iterates `STRAINS`, reads `getIdentity(name).lineage.parents`, and
buckets by parent count; the landrace/heritage set above is curated by hand.
Re-run it after a fill batch to watch the numbers move.
