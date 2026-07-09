# Trace-enrichment backlog

Status: **71% of the catalog now carries a trace (faint-note) layer** (636/895).
The visible slice (top-60 in any engine run) is fully done; this backlog is the
remaining low-visibility tail.

## Remaining strains without a trace layer: 259

These have a dominant + secondary character but no verified faint third tier yet.
Enriching them only ever ADDS faint notes (never changes dominant matching), so it
is safe and incremental. Some will legitimately stay empty — not every strain has a
documented third tier.

## How to resume (cheaply)

Research for ~56 of these batches is ALREADY CACHED under workflow run
`wf_3c81655a-4fb`. Re-invoking that run replays cached research for free and only
needs to run the verify stage + any un-run batches — much cheaper than a cold run.

1. Regenerate the queue:  `npx tsx scripts/emit-queue-all.ts > queue-all.json`
2. Resume:  Workflow({scriptPath:"scripts/enrich-workflow.js", resumeFromRunId:"wf_3c81655a-4fb", args:{queuePath, total:259, batchSize:5}})
3. Salvage only VERIFIED batches (both stages) and run scripts/generate-trace-overlay.ts.

Note: the workflow spends ~40k tokens/agent; a full tail pass is large, so it is
paced against the session token limit (resets periodically). Cached research makes
each resume progressively cheaper.

## The remaining list

- Critical Mass
- 9 Pound Hammer
- Slurricane
- Pink Kush
- Mendo Breath
- Yoda OG
- Afgooey
- Ice
- Black Domina
- Master Yoda
- Purple Punch
- Purple Urkle
- Grape Ape
- Blackberry Kush
- Blueberry
- Purple Haze
- Berry White
- Girl Scout Cookies
- Animal Cookies
- Animal Mints
- Biscotti
- London Pound Cake
- Kush Mints
- Oreoz
- Lava Cake
- Cake Crasher
- LA Kush Cake
- Lemon Cherry Gelato
- Sherblato
- Peach Gelato
- Italian Ice
- Strawberry Runtz
- Candy Rain
- Apple Runtz
- Obama Runtz
- Layer Cake
- Hippie Crasher
- Cherry Lemonade
- Strawberry Shortcake
- Pink Champagne
- Black Cherry Punch
- Jealousy
- Apples and Bananas
- RS11
- Soap
- Garanimals
- Grape Pie
- Space Queen
- Melonade
- Black Truffle
- Frosted Lemonade
- Sherbanger
- Triangle Mints
- Lemonatti
- Pineapple Express
- Mimosa
- Banana OG
- Peach Rings
- Passion Fruit
- Tropicana Cookies
- Tropicana Cherry
- Blueberry Muffin
- Lemon Haze
- Amnesia Haze
- Super Silver Haze
- Ghost Train Haze
- Clementine
- Cinex
- Sour Apple
- Tangie Banana
- Lemon Tek
- Green Crack
- Trainwreck
- Bruce Banner
- Strawberry Cough
- Moby Dick
- Candyland
- Bay 11
- Super Skunk
- Blue Cheese
- Lemon Pound Cake
- Grape Stomper
- Cotton Candy Kush
- Orange Bud
- Platinum Kush
- Hash Plant
- White Truffle
- Project 4516
- Modified Grapes
- Sherb Crasher
- E85
- Cherry MAC
- Power Sherbet
- Cherry Cake
- Hot Sauce
- Orange Daiquiri
- Wedding Crasher
- OZ Kush
- Platinum Puff
- Pink Guava
- Rainbow Sherbet
- Blue Zushi
- Super Boof
- Lemon Cherry Push Pop
- Black Cherry Gelato
- The Menthol
- Wedding Pie
- Cinderella 99
- Vortex
- Mendo Montage
- Cherry AK-47
- Larry OG
- Black Cherry Pie
- Champagne
- Thin Mint GSC
- Bubble Gum
- Purple Kush
- Grape Soda
- Red Zushi
- Apollo 13
- Shiva Skunk
- Mendo Purps
- Green Ribbon
- Northern Lights #5
- Chocolate Thai
- Skywalker
- Trinity
- Han-Solo Burger
- Lemonnade
- Watermelon
- Crystal Locomotive
- Ghost OG
- Hawaiian
- California Orange
- Strawberry Fields
- Las Vegas Purple Kush
- Lamb's Bread
- Pink Rozay
- Garlic Breath
- Tropicana Banana
- Gelonade
- Lemonchello
- Thai
- Mexican
- Forum Cookies
- Orange Juice
- The Original Z
- Boggle Gum
- Aloha White Widow
- Querkle
- Jilly Bean
- Holy Grail Kush
- Swazi Gold
- Pakistani Chitral Kush
- Marshmallow OG
- Lemon Cherry Pie
- Orange Velvet
- OG #18
- Burmese Kush
- Romulan
- Big Bud
- Sensi Star
- God Bud
- Congolese
- Oaxacan
- Williams Wonder
- MK Ultra
- Purple Skunk
- Blue Power
- Sweet Tooth
- Lemon Up
- Punto Rojo
- Luang Prabang
- Aceh
- Kilimanjaro
- Zamal
- Grape Krush
- White Fire OG
- Goji OG
- Blue Magoo
- Sugar Black Rose
- Nepali OG
- Skunk Haze
- Grapefruit
- Cherry Bomb
- Vietnamese Black
- Ethiopian Highland
- Apple Jacks
- Cheese Quake
- Pez
- Raspberry Cough
- Pineapple Chunk
- Sweet Skunk
- Mullumbimby Madness
- Angola Roja
- Cambodian
- Brazilian
- South Indian
- Korean
- Skunkberry
- Blackwater
- Mango Haze
- Highland Thai
- Persian
- Hawaiian Snow
- AK-48
- Lemon Kush
- Sour Grape
- Black Cherry Funk
- California Indica
- California Sour
- Evergladez
- Florida Kush
- Grateful Puff
- Hella Jelly
- Honey Boo Boo
- Jock Horror
- Juicy Fruit
- Juliet
- Laos
- Lemon Joy
- Lemon OG
- Marionberry
- OG LA Affie
- Ortega
- Purple Elephant
- Razzleberry
- Snow White
- South Florida OG
- Y Life
- Zookies
- Paw Paw
- Mandarin Cookies
- Truffle Butter
- Granddaddy Pluto
- Banana Runtz
- Blue Sherbert
- True OG
- Sherb-burger
- Tourist Trap
- Atomic Breath
- Novarine
- Cookie Dough
- Lemon Berry Kush
- Grape Nuts
- Muffin Grease
- Black Mamba
- Baller Mints
- Space Burger
- Animal Tsunami
- Singapore Sling
- Baked Limez
- Pinnacle
- Soap x Purple Punch
- Pandora's Box
- Strawberry Cheesecake
- Sour Candy
- Love Potion #9
- Garlic Patties
