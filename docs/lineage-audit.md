# Catalog lineage audit — genetic parents

> Regenerated 2026-06-15 after the lineage-fill sessions. Source of truth:
> `STRAINS` (src/lib/strain-data.ts) + `getIdentity().lineage` and the derived
> `lineageStatus()` (src/lib/strain-identity.ts). Every strain now resolves to a
> visible status on its catalog page — there are no silent empty gaps.

## Summary (400 strains)

| Status (badge shown on the strain page) | Count |
|---|---:|
| ✅ Documented cross (2+ parents on record) | 258 |
| 〰️ Commonly cited (attributed, not breeder-confirmed) | 27 |
| 🌿 Clone-only phenotype (one parent — correct, a selected clone) | 23 |
| ❓ One parent on record (second genuinely unknown) | 23 |
| 🌍 Landrace (origin strain, parentless by nature) | 4 |
| 📭 Lineage undocumented (checked — genuinely unrecorded) | 14 |
| 🏔 Origin / landrace, no parent cross recorded | 51 |

- **285** strains carry a two-parent cross (documented or commonly cited).
- **331** carry at least one documented parent.
- The rest are honestly labelled: landraces/origin strains (parentless by nature),
  clone-only phenotypes (one parent is correct), or genuinely undocumented
  (heritage / clone-only / market labels with no single recorded cross) — shown
  as such so nobody mistakes an honest unknown for a missing field.

The "Lineage undocumented" and "Landrace" buckets are intentional end-states,
not TODOs.


## Documented cross (258)

- 9 Pound Hammer — Gooberry × Hells OG × Jack the Ripper
- AK-47 — Colombian × Mexican × Thai × Afghani
- AK-48 — Ice × Jock Horror
- Alien Kush — Las Vegas Purple Kush × Alien Tech
- Alien OG — Tahoe OG × Alien Kush
- Aloha White Widow — White Widow × Hawaiian
- Amnesia Haze — Afghani Hawaiian × Laos × Jamaica
- Animal Cookies — Girl Scout Cookies × Granddaddy Purple
- Animal Face — Face Off OG × Animal Mints
- Animal Mints — Animal Cookies × Blue Power
- Appalachia — Green Crack × Tres Dawg
- Apple Fritter — Sour Apple × Animal Cookies
- Apple Gelato — Apple Fritter × Gelato
- Apple Jacks — Jack Herer × White Widow
- Apple Tartz — Apple Fritter × Runtz
- Apples and Bananas — Blue Power × Gelatti × GMO × Banana OG
- Arjan's Haze — G13 × Haze
- B-52 — Big Bud × Skunk #1
- Banana Daddy — Banana OG × Granddaddy Purple
- Banana Kush — Ghost OG × Skunk Haze
- Banana OG — OG Kush × Banana
- Banana Punch — Banana OG × Purple Punch
- Berry White — Blueberry × White Widow
- Big Bud — Afghani × Skunk #1
- Big Skunk Korean — Korean × Skunk #1
- Birthday Cake — Girl Scout Cookies × Cherry Pie
- Biscotti — Gelato 25 × South Florida OG
- Biscotti Sundae — Biscotti × Sundae Driver
- Biskante — Zookies × Biscotti
- Black Cherry Punch — Black Cherry × Purple Punch
- Black Domina — Northern Lights × Ortega × Hash Plant × Afghani
- Blackberry — Black Domina × Raspberry Cough
- Blackberry Kush — Afghani × Blackberry
- Blackwater — Mendo Purps × SFV OG
- Blue Cheese — Blueberry × UK Cheese
- Blue Cookies — Blueberry × Girl Scout Cookies
- Blue Dream — Blueberry × Haze
- Blue Magoo — Blueberry × Major League Bud
- Blue Power — Master Kush × Blueberry × The White
- Blue Zushi — Zkittlez × Kush Mints
- Blueberry — Purple Thai × Afghani
- Blueberry Cupcake — Blueberry Muffin × Wedding Cake
- Blueberry Muffin — Blueberry × Razzleberry
- Boggle Gum — BOG Bubble × Northern Lights #5
- Bruce Banner — OG Kush × Strawberry Diesel
- Cake Crasher — Wedding Cake × Wedding Crasher
- Candy Rain — Gelato × London Pound Cake
- Candyland — Granddaddy Purple × Bay Platinum Cookies
- Cannatonic — MK Ultra × G13
- Cap Junky — Kush Mints 11 × Alien Cookies
- Cataract Kush — LA Confidential × OG Kush
- Cereal Milk — Y Life × Snowman
- Champagne — Boggle Gum × Burmese
- Cheese Quake — UK Cheese × Querkle
- Cheetah Piss — Lemonnade × Gelato 42 × London Pound Cake
- Cherry AK-47 — Cherry × AK-47
- Cherry Cake — Cherry Pie × Wedding Cake
- Cherry Cookies — Cherry Pie × Girl Scout Cookies
- Cherry Lemonade — Cherry Pie OG × Jack the Ripper
- Cherry MAC — MAC × Cherry Pie
- Cherry Pie — Granddaddy Purple × Durban Poison
- Cherry Punch — Cherry AK-47 × Purple Punch
- Chile Verde — OG Kush × Key Lime Pie
- Chocolate Diesel — Chocolate Thai × Sour Diesel
- Chocolope — Chocolate Thai × Cannalope Haze
- Cinderella 99 — Jack Herer × Shiva Skunk
- Cinex — Cinderella 99 × Vortex
- Clementine — Tangie × Lemon Skunk
- Cotton Candy Kush — Lavender × Power Plant
- Critical Kush — Critical Mass × OG Kush
- Critical Mass — Afghani × Skunk #1
- Crystal Locomotive — Trainwreck × Trinity
- Death Star — Sour Diesel × Sensi Star
- Do-Si-Dos — OGKB (GSC) × Face Off OG
- Donny Burger — GMO Cookies × Han-Solo Burger
- E85 — Wedding Cake × Project 4516
- Fire OG — OG Kush × SFV OG
- Forbidden Fruit — Cherry Pie × Tangie
- Frosted Lemonade — 91 Hollywood Pure Kush × Evergladez
- Fruity Pebbles OG — Green Ribbon × Granddaddy Purple × Tahoe OG × Alien Kush
- Garanimals — Grape Pie × Gelato
- Gary Payton — The Y × Snowman
- Gary Poppins — Gary Payton × Sunset Sherbet
- Gas Face — Face Mints × Biscotti
- Gelato — Sunset Sherbet × Thin Mint GSC
- Gelato 33 — Sunset Sherbet × Thin Mint GSC
- Gelato 41 — Sunset Sherbet × Thin Mint GSC
- Gelato 45 — Sunset Sherbet × Thin Mint GSC
- Gelato Cake — Wedding Cake × Gelato 33
- Gelatti — Gelato × OGKB
- Gelonade — Lemon Tree × Gelato 41
- Georgia Pie — Gelatti × Kush Mints
- GG4 — Chem's Sister × Sour Dubb × Chocolate Diesel
- Ghost Train Haze — Ghost OG × Nevil's Wreck
- Girl Scout Cookies — OG Kush × Durban Poison
- GMO Cookies — Chemdog × Girl Scout Cookies
- Goji OG — Nepali OG × Snow Lotus
- Gooberry — Afgooey × Blueberry
- Granddaddy Purple — Purple Urkle × Big Bud
- Grape Ape — Mendocino Purps × Skunk #1 × Afghani
- Grape Gas — Grape Pie × Jet Fuel Gelato
- Grape Pie — Cherry Pie × Grape Stomper
- Grape Soda — Tahoe OG × Granddaddy Purple
- Grape Stomper — Purple Elephant × Chemdawg Sour Diesel
- Grease Monkey — GG4 × Cookies and Cream
- Great White Shark — Super Skunk × Brazilian × South Indian
- Green Ribbon — Trainwreck × Trinity
- Gushers — Gelato 41 × Triangle Kush
- Gushlato — Gushers × Gelato
- Han-Solo Burger — GMO Cookies × Larry OG
- Harlequin — Colombian Gold × Thai
- Hash Plant — Northern Lights × Afghani
- Hawaiian Snow — Hawaiian × Haze
- Headband — OG Kush × Sour Diesel
- Hells OG — OG Kush × Blackberry
- Hippie Crasher — Kush Mints × Wedding Crasher
- Holland's Hope — Afghani × Skunk #1
- Holy Grail Kush — OG #18 × Kosher Kush
- Honey Banana — Strawberry Banana × Honey Boo Boo
- Honey Bun — Gelatti × Honey B
- Hot Sauce — Chile Verde × Pancakes
- Ice — Northern Lights × Skunk #1 × Afghani
- Ice Cream Cake — Wedding Cake × Gelato 33
- Italian Ice — Gelato 45 × Forbidden Fruit
- Jack Flash — Jack Herer × Super Skunk × Haze
- Jack Herer — Haze × Northern Lights #5 × Shiva Skunk
- Jack the Ripper — Jack's Cleaner × Space Queen
- Jealousy — Gelato 41 × Sherbet
- Jet Fuel — Aspen OG × High Country Diesel
- Jet Fuel Gelato — Jet Fuel × Gelato 41
- Jilly Bean — Orange Velvet × Space Queen
- Khalifa Mints — Khalifa Kush × Kush Mints
- King Louis XIII — OG Kush × LA Confidential
- Kush Mints — Bubba Kush × Animal Mints
- LA Confidential — OG LA Affie × California Indica
- LA Kush Cake — Kush Mints × Wedding Cake
- Larry OG — OG Kush × SFV OG
- Lava Cake — Grape Pie × Thin Mint GSC
- Lavender — Super Skunk × Afghani
- Layer Cake — Wedding Cake × GMO Cookies × Triangle Kush × Skunk #1
- Lemon Diesel — California Sour × Lost Coast OG
- Lemon Haze — Lemon Skunk × Silver Haze
- Lemon Pound Cake — Lemon Skunk × UK Cheese
- Lemon Thai — Thai × Hawaiian
- Lemon Tree — Lemon Skunk × Sour Diesel
- Lemonatti — Gelonade × Biscotti
- Lemonchello — The Original Z × Lemonnade
- MAC — Alien Cookies × Starfighter × Columbian
- Mango Haze — Haze × Skunk Haze
- Mango Kush — Mango × Hindu Kush
- Marshmallow OG — Chemdog D × Triangle Kush × Jet Fuel Gelato
- Master Bubba — Master Kush × Bubba Kush
- Master Kush — Hindu Kush × Skunk #1
- Master Yoda — Master Kush × Yoda OG
- Melonade — Watermelon Zkittlez × Lemon Tree
- Mendo Breath — OGKB × Mendo Montage
- Mendo Montage — Mendo Purps × Crystal Locomotive
- Mimosa — Clementine × Purple Punch
- MK Ultra — OG Kush × G13
- Moby Dick — White Widow × Haze
- Mochi — Sunset Sherbet × Thin Mint GSC
- Modified Grapes — GMO Cookies × Purple Punch
- Moonbow — Zkittlez × Do-Si-Dos
- Motorbreath — Chemdog D × SFV OG
- Nepali OG — Nepalese × OG Kush
- Nevil's Wreck — Trainwreck × Neville's Haze
- Neville's Haze — Haze × Northern Lights #5
- NYC Diesel — Sour Diesel × Afghani
- Obama Runtz — Afghani × OG Kush × Runtz
- Orange Cookies — Orange Juice × Girl Scout Cookies
- Orange Creamsicle — Orange Crush × Juicy Fruit
- Orange Daiquiri — Orange Cookies × Grape Pie
- Oreoz — Cookies and Cream × Secret Weapon
- OZ Kush — Zkittlez × OG Kush
- Papaya — Citral × Ice
- Passion Fruit — Sweet Pink Grapefruit × Orange Bud
- Peach Gelato — Peach Rings × Gelato 33
- Peach Rings — Marionberry × Eddy OG
- Peanut Butter Breath — Do-Si-Dos × Mendo Breath
- Permanent Marker — Biscotti × Jealousy × Sherbert
- Pez — Afghani × Pakistani Chitral Kush
- Pineapple Chunk — Pineapple × Skunk #1 × UK Cheese
- Pineapple Express — Trainwreck × Hawaiian
- Pink Certz — Grape Gas × The Menthol
- Pink Champagne — Granddaddy Purple × Cherry Pie
- Pink Panties — Burmese Kush × Florida Kush
- Pink Picasso — Candyland × OZ Kush
- Pink Rozay — Lemonchello × London Pound Cake
- Platinum Puff — Platinum OG × Grateful Puff
- Power Sherbet — Sunset Sherbet × Cookies and Cream
- Project 4516 — Gelato 45 × Platinum Puff
- Purple Gelato — Gelato 33 × Purple Punch
- Purple Kush — Hindu Kush × Purple Afghani
- Purple Punch — Larry OG × Granddaddy Purple
- Querkle — Purple Urkle × Space Queen
- Rainbow Belts — Zkittlez × Moonbow
- Rainbow Sherbet — Champagne × Blackberry
- Raspberry Cough — ICE × Cambodian
- Red Zushi — Zkittlez × Kush Mints
- Ringo's Gift — Harlequin × ACDC
- RS11 — Pink Guava × OZ Kush
- Runtz — Zkittlez × Gelato
- Sherb Crasher — Sunset Sherbet × Wedding Crasher
- Sherbacio — Sunset Sherbet × Biscotti
- Sherbanger — Sunset Sherbet × Headbanger
- Sherblato — Sherbet × Gelato
- Shiva Skunk — Northern Lights #5 × Skunk #1
- Skunk #1 — Afghani × Acapulco Gold × Colombian Gold
- Skunk Haze — Skunk #1 × Haze
- Skunkberry — Skunk #1 × Blueberry
- Skywalker — Mazar × Blueberry
- Skywalker OG — Skywalker × OG Kush
- Slurricane — Do-Si-Dos × Purple Punch
- Snow Lotus — Afgooey × Blockhead
- Soap — Animal Mints × Kush Mints
- Sour Dubb — Sour Diesel × Sour Bubble
- Sour Grape — Sour Diesel × Granddaddy Purple
- Sour OG — Sour Diesel × OG Kush
- Sour Tangie — Sour Diesel × Tangie
- Sour Tsunami — Sour Diesel × NYC Diesel
- Space Queen — Romulan × Cinderella 99
- Stardawg — Chemdawg 4 × Tres Dawg
- Sticky Buns — Kush Mints × Gelatti
- Strawberry Banana — Banana Kush × Strawberry Bubble Gum
- Strawberry Shortcake — Juliet × Strawberry Diesel
- Studio 54 — Sunset Sherbet × OZ Kush
- Sugar Black Rose — Black Domina × Critical Mass
- Sundae Driver — Fruity Pebbles OG × Grape Pie
- Sundae Sherbert — Sundae Driver × Sunset Sherbet
- Sunset Mintz — Sunset Sherbet × Kush Mints
- Sunset Sherbet — Girl Scout Cookies × Pink Panties
- Super Boof — Black Cherry Punch × Tropicana Cookies
- Super Lemon Haze — Lemon Skunk × Super Silver Haze
- Super Silver Haze — Skunk #1 × Northern Lights × Haze
- Super Skunk — Skunk #1 × Afghani
- Sweet Tooth — Afghani × Hawaiian
- Tangie — California Orange × Skunk
- Tangie Banana — Tangie × Banana
- The Menthol — Gelato 45 × White Diesel
- Tiramisu — Sunset Sherbet × Thin Mint GSC
- Trainwreck — Mexican × Thai × Afghani
- Triangle Mints — Triangle Kush × Animal Mints
- Tropicana Banana — Tropicana Cookies × Banana
- Tropicana Cherry — Tropicana Cookies × Cherry Cookies
- Tropicana Cookies — Girl Scout Cookies × Tangie
- Vortex — Apollo 13 × Space Queen
- Watermelon Zkittlez — Zkittlez × Watermelon
- Wedding Cake — Triangle Kush × Animal Mints
- Wedding Crasher — Wedding Cake × Purple Punch
- Wedding Pie — Wedding Cake × Grape Pie
- White Fire OG — Fire OG × The White
- White Runtz — Zkittlez × Gelato
- White Russian — AK-47 × White Widow
- White Tahoe Cookies — Tahoe OG × The White × Girl Scout Cookies
- White Truffle — GG4 × Peanut Butter Breath
- White Widow — Brazilian Sativa × South Indian Indica
- Zkittlez — Grape Ape × Grapefruit
- Zoap — Rainbow Sherbet × Pink Guava

## Commonly cited (27)

- Acai — Sunset Sherbet × Pink Panties
- Afgooey — Afghani × Maui Haze
- Apple Runtz — Runtz × Apple Fritter
- Black Cherry Gelato — Black Cherry Funk × Acai
- Garlic Breath — GMO Cookies × Mendo Breath
- Grape Krush — Blueberry × Haze
- High Octane OG — Chemdawg × Lemon Thai × Hindu Kush
- Jelly Donutz — Hella Jelly × White Runtz
- Las Vegas Purple Kush — Purple Afghani × Hindu Kush
- Lemon Cherry Gelato — Sunset Sherbet × Girl Scout Cookies
- Lemon Cherry Pie — Lemon Cherry Gelato × Cherry Pie
- Lemon Kush — Master Kush × Lemon Joy
- Lemon Up — Lemon G × Do-Si-Dos
- Lemonnade — Lemon OG × Gorilla Haze
- MAC and Cheese — MAC × UK Cheese
- OG Kush — Chemdawg × Hindu Kush
- Pancakes — London Pound Cake × Kush Mints
- Pink Lemonade — Purple Kush × Lemon Skunk
- Pink Runtz — Zkittlez × Gelato
- Platinum Kush — Master Kush × OG Kush
- Platinum OG — Master Kush × OG Kush
- Snowcap — Haze × Snow White
- Sour Apple — Sour Diesel × Cinderella 99
- Sour Diesel — Chemdawg 91 × Super Skunk
- Strawberry Cough — Strawberry Fields × Haze
- Strawberry Runtz — Runtz × Strawberry Fritter
- Yoda OG — OG Kush × Master Kush

## Clone-only phenotype (23)

- ACDC — Cannatonic
- Bay 11 — Appalachia
- Black Cherry Pie — Cherry Pie
- Chem's Sister — Chemdawg
- Face Off OG — OG Kush
- Forum Cookies — Girl Scout Cookies
- Ghost OG — OG Kush
- Guava — Gelato
- Key Lime Pie — Girl Scout Cookies
- Khalifa Kush — OG Kush
- Kosher Kush — OG Kush
- Northern Lights #5 — Afghani
- OG #18 — OG Kush
- OGKB — Girl Scout Cookies
- Platinum GSC — Girl Scout Cookies
- Purple Skunk — Skunk #1
- SFV OG — OG Kush
- Snowman — Girl Scout Cookies
- Tahoe OG — OG Kush
- The Original Z — Zkittlez
- Thin Mint GSC — Girl Scout Cookies
- UK Cheese — Skunk #1
- White Gushers — Gushers

## One parent on record (23)

- Apollo 13 — Genius
- Blockhead — Sweet Tooth
- Bubba Kush — OG Kush
- Chem 91 — Chemdawg
- God Bud — Hawaiian
- Grapefruit — Cinderella 99
- Green Crack — Skunk #1
- Jack's Cleaner — Jack Herer
- Lemon Cherry Push Pop — Lemon Cherry Gelato
- Lemon Skunk — Skunk #1
- London Pound Cake — Sunset Sherbet
- Major League Bud — Williams Wonder
- Northern Lights — Afghani
- Orange Bud — Skunk #1
- Orange Juice — California Orange
- Pineapple — Ed Rosenthal Super Bud
- Pink Guava — OZ Kush
- Pink Kush — OG Kush
- Sour Bubble — Bubble Gum
- Sweet Skunk — Skunk #1
- Tres Dawg — Chemdawg
- Triangle Kush — Hindu Kush
- White Rhino — White Widow

## Landrace (4)

- Alien Tech
- Burmese Kush
- Haze
- Power Plant

## Lineage undocumented (14)

- Banana Cream
- Black Truffle
- Bubble Gum
- California Orange
- Charlotte's Web
- Cherry Bomb
- G13
- Garlic Juice
- Lemon Tek
- Orange Velvet
- The White
- Triple Double OG
- Watermelon
- White Hot Guava

## Origin / landrace (no recorded parents) (51)

- Acapulco Gold
- Aceh
- Afghani
- Angola Roja
- Brazilian
- Cambodian
- Chemdawg
- Chocolate Thai
- Colombian Gold
- Congolese
- Durban Poison
- Ethiopian Highland
- Hawaiian
- Highland Guatemalan
- Highland Thai
- Hindu Kush
- Kali Mist
- Kandahar
- Kilimanjaro
- Korean
- Lamb's Bread
- Lebanese
- Lemon G
- Luang Prabang
- Malawi
- Manipuri
- Maui Wowie
- Mazar
- Mendo Purps
- Mexican
- Moroccan
- Mullumbimby Madness
- Nepalese
- Oaxacan
- Pakistani Chitral Kush
- Panama Red
- Persian
- Punto Rojo
- Purple Haze
- Purple Urkle
- Romulan
- Sensi Star
- Sinai
- South Indian
- Strawberry Fields
- Swazi Gold
- Thai
- Trinity
- Vietnamese Black
- Williams Wonder
- Zamal

## How to extend this

The genetics live in `src/lib/strain-identity-data.ts` under each record's
`lineage` block (`parents`, `cross`, optional `parentDetails`). To document a
strain currently marked "Lineage undocumented", add its `parents` from a single
reliable source (Seedfinder / breeder page) and a `cross` string; mark contested
crosses "commonly cited, not verified" so the badge reads honestly. Re-run the
generator to refresh these numbers.
