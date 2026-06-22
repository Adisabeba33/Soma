import type { StrainIdentity } from "./strain-identity";

// First-cut identity records for well-known strains. Many of the 149 seed
// entries have NO identity record yet — that's deliberate. We grow this
// list gradually and mark uncertain data with sourceConfidence: "low" or
// "medium". Better to admit we don't know than to fabricate lineage.
//
// sourceConfidence guideline:
// - "high": breeder + lineage + marketNames are well-documented
// - "medium": some fields are commonly cited but contested
// - "low":  mostly canonical name + family; the rest is speculative

export const IDENTITIES: StrainIdentity[] = [
  // ── Gas / OG family ──
  {
    canonicalName: "GG4",
    marketNames: ["Original Glue", "Gorilla Glue", "GG#4"],
    breeder: "GG Strains",
    lineage: {
      parents: ["Chem's Sister", "Sour Dubb", "Chocolate Diesel"],
      cross: "Chem's Sister × Sour Dubb × Chocolate Diesel",
      // None of GG4's parents are in our catalog — they're heritage
      // 1990s strains, not consumer sorts. parentDetails paints in the
      // grandparent passport without forcing us to create catalog
      // entries for them.
      parentDetails: {
        "Chem's Sister": {
          lineageBrief: "Chemdawg phenotype",
          type: "hybrid",
        },
        "Sour Dubb": {
          lineageBrief: "Sour Diesel × Sour Bubble",
          type: "sativa",
        },
        "Chocolate Diesel": {
          lineageBrief: "Chocolate Thai × Sour Diesel",
          type: "sativa",
        },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: [
      "Phenos vary in pine vs diesel emphasis",
      "Sticky resin / 'glue your scissors' benchmark",
    ],
    curatorNote:
      "Born from a happy accident — a Chem Sister that threw pollen across a room of Sour Dubb and Chocolate Diesel — GG4 became the strain that 'glued the scissors shut,' and the name stuck. Crack the jar and it's pure solvent: sharp diesel and coffee-tinged chocolate over damp earth, with almost no sweetness to soften the edge. The smoke is heavy and mouth-coating, and the high lands fast — a sinking, behind-the-eyes weight that pulls you into the couch within minutes. It's a closer, not a starter; most who reach for it want the body off-switch at the end of the day, and newer smokers routinely underestimate how flattening it can be. What keeps it a benchmark a decade on is consistency — even an average cut still speaks that unmistakable gas-and-glue language.",
    curatorQuote:
      "Even an average cut still speaks that unmistakable gas-and-glue language.",
    whyItMatters:
      "GG4 (Gorilla Glue #4) proved a happy accident could become a benchmark. Born from a pollination mistake, it swept back-to-back Cannabis Cups in the mid-2010s and became the reference point for sticky, gas-heavy hybrids — the cut people name-check when they talk about resin and couch-lock. A trademark clash with the glue brand forced the rename to 'GG4,' which only added to the legend.",
    tagline: "Couch-bound legend",
    sourceConfidence: "high",
    timeProfile: "night",
    artFileName: "gg4.webp",
    artStatus: "published",
    artVersion: 1,
  },
  {
    canonicalName: "OG Kush",
    breeder: "Origin contested (Florida → LA, early 1990s)",
    lineage: {
      parents: ["Chemdawg", "Hindu Kush"],
      cross: "Chemdawg × Hindu Kush (commonly cited, not verified)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: [
      "Foundation of every 'OG' descendant",
      "Pine-and-gas archetype",
    ],
    curatorNote:
      "OG Kush is the genetic spine of the West Coast — a contested early-90s cut (Chemdawg into a Hindu Kush is the usual telling) whose name launched a thousand 'OGs.' The nose is the textbook reference: sharp pine and lemon-pledge over a backbone of fuel and damp earth, what most people actually mean when they say 'gas.' Effect-wise it's a deceptive hybrid — a heady, euphoric lift that slides into real body weight, social at first and couch-bound if you keep going. It's a benchmark precisely because it's everywhere in everything: half the modern menu carries its pine-and-fuel signature somewhere in the lineage. Newcomers sometimes find the flavour harsh, but for gas lovers it's the original and still the measuring stick.",
    curatorQuote:
      "Half the modern menu carries its pine-and-fuel signature somewhere in the lineage.",
    whyItMatters:
      "OG Kush is the genetic spine of the West Coast — the strain whose name launched an entire 'OG' dynasty. It set the very definition of what people mean by 'gas,' and a huge share of the modern dessert-and-gas menu traces somewhere back to it. Few strains have been bred from more.",
    tagline: "The gas reference",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of the original West Coast gas benchmark — the foundational OG. A monumental Los Angeles canyon hillside at golden dusk: an old weathered concrete-and-chrome fuel depot half-swallowed by dense pine and dry earth, deep roots and rusted pipework woven together as if this place were the source everything else grew from. Sharp pine and fuel haze hangs in the warm air; damp earth and woody resin ground the scene. Palette deep and classic — pine green and fuel-petrol blue over earthy brown and weathered concrete, amber sun on the metal edges fading into a wine-dark dusk sky, a dense resinous sheen. Mood: a heady euphoric lift settling into real body weight — warm and social at first, heavy and rooted as it sinks. Cinematic, painterly, high-contrast, premium editorial poster. Keep the lower third calmer and darker for legible overlay text. The strain name may appear baked into the scene (e.g. cast into concrete or stencilled on metal); no overlaid captions, logos or watermarks; no people, products or cannabis leaves.",
    artFileName: "og-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
    // Foundational and well-known, but the Chemdawg × Hindu Kush cross is
    // "commonly cited, not verified."
    lineageConfidence: "low",
  },
  {
    canonicalName: "Tahoe OG",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush phenotype — clone-only Lake Tahoe cut (second parent unknown)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy pine-gas OG cut, body-forward"],
    curatorNote:
      "Tahoe OG is one of the heavyweight OG cuts — a Northern California phenotype prized for leaning harder into body than head than its SoCal cousins. The nose is classic gas-OG with extra weight: sharp fuel and pine over a thick, earthy musk, dense and a little medicinal. Where some OGs keep you social, Tahoe is a fast sledgehammer — a heavy, warming body wave that arrives quickly and points straight at the couch and the pillow. People keep it for nights, pain and insomnia rather than productivity, and it has a reputation for ending evenings earlier than planned. For the gas crowd who want the indica end of OG, it's a go-to.",
    curatorQuote:
      "Sharp fuel and pine over a thick, earthy musk, dense and a little medicinal.",
    tagline: "Northern sledgehammer",
    sourceConfidence: "medium",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Tahoe OG — a heavyweight Northern California OG Kush phenotype, the clone-only Lake Tahoe cut that leans harder into the body than its SoCal cousins, sharp fuel and pine over thick earthy musk. The scene: a deep alpine night on the shore of a black mirror lake, a weathered timber boat dock jutting into still water, a rusted fuel pump and a chained gas can at the dock's edge, dense pine forest crowding the granite shoreline, fog pooling low between the trunks. Palette of pinewood green, wet granite grey, fuel-petrol teal and a cold silver moon-shimmer on water. Mood: weighted, sinking, sedate — body-heavy stillness easing toward sleep, the water flat as glass, a single ripple the only motion under a deep midnight sky. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'TAHOE OG' routed into a plank of the old dock railing. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Skywalker OG",
    lineage: {
      parents: ["Skywalker", "OG Kush"],
      cross: "Skywalker × OG Kush",
      parentDetails: {
        Skywalker: {
          lineageBrief: "Blueberry × Mazar",
          type: "indica",
        },
      },
    },
    sensoryFamily: "gas-og",
    curatorNote:
      "Skywalker OG is the indica-heavy OG built for sedation — a Skywalker × OG Kush cross that keeps the fuel and adds weight. The nose blends OG's pine and gas with a sweeter, herbal-spice undertone, a touch fruitier than a straight OG cut. The effect is the draw: a quick, dreamy heaviness that wraps the body and quiets the head, firmly an evening and end-of-day strain. It can be genuinely sleepy at higher doses, so it's not one for staying productive, and lighter smokers should respect the potency. For OG lovers chasing the deepest body end of the family, Skywalker delivers.",
    curatorQuote:
      "The nose blends OG's pine and gas with a sweeter, herbal-spice undertone, a touch fruitier than a straight OG cut.",
    tagline: "Sedation hyperspace",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an indica-heavy, sedating gas-OG named Skywalker OG — a dreamy hyperspace sky-walk theme. A glowing trail of light stepping up into the night sky above a sea of clouds, streaking hyperspace stars stretching to a vanishing point overhead, dark pine silhouettes far below; a fuel-pine haze drifts through the dreamy cosmic air with a faint oily petrol-rainbow shimmer. OG's pine and gas with a sweeter herbal-spice undertone. Palette dreamy and cosmic — deep indigo and violet night with streaking white-gold starlight, pine-green silhouettes and a faint petrol shimmer over cloud-silver. Mood: quick, dreamy heaviness — a body-wrapping calm that quiets the head, a deep evening sinker. Cinematic, painterly, high-contrast, premium editorial poster, dreamy and atmospheric. The strain name 'SKYWALKER OG' baked into the scene — carved into a floating sky-stone or etched along the light trail. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no recognizable franchise designs, no cannabis leaves, buds or packaging.",
    artFileName: "skywalker-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── Diesel / Chem family ──
  {
    canonicalName: "Sour Diesel",
    marketNames: ["Sour D"],
    breeder: "Unknown / NYC East-coast origin (1990s)",
    lineage: {
      parents: ["Chemdawg 91", "Super Skunk"],
      cross: "Chemdawg 91 × Super Skunk (commonly cited)",
      parentDetails: {
        "Chemdawg 91": {
          lineageBrief: "Chemdawg phenotype, 1991 cut",
          type: "hybrid",
        },
      },
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["The defining gassy-citrus sativa archetype"],
    curatorNote:
      "Sour Diesel is the East Coast's calling card — a 90s NYC cut of contested parentage (Chemdawg 91 into Super Skunk is the story most growers tell) that defined what 'gassy sativa' even means. The nose is loud and unmistakable: cutting diesel and sour citrus rind with a skunky tail that fills a room the moment the bag opens. Where most heavy strains pull you down, Sour D lifts — a bright, talkative, faintly racy head-high that made it a daytime and creative-work favorite for two decades. The trade-off is real: it can tip toward jittery if you're anxiety-prone or take too much, and the flavor stays acrid rather than pleasant — more fuel than fruit. People don't reach for Sour Diesel to relax; they reach for it to get moving.",
    curatorQuote:
      "People don't reach for Sour Diesel to relax — they reach for it to get moving.",
    whyItMatters:
      "Sour Diesel is the East Coast's defining contribution to modern cannabis — the strain that taught a generation what a 'gassy sativa' is. Through the 1990s and 2000s it was the calling card of New York and the daytime-energetic counterpoint to West Coast OG, and its loud diesel-and-citrus signature still echoes through countless modern crosses.",
    tagline: "Acid bright sativa",
    sourceConfidence: "high",
    // The strain itself is well-documented, but the Chemdawg 91 × Super Skunk
    // parentage is "commonly cited," not verified.
    lineageConfidence: "low",
    timeProfile: "daytime",
    artFileName: "sour-diesel.webp",
    artStatus: "published",
    artVersion: 1,
    // Keep the "SOUR DIESEL" on the tank (right of centre) inside the
    // narrow List crop.
    artFocus: "90% 50%",
  },
  {
    canonicalName: "Chemdawg",
    marketNames: ["Chemdog", "Chem"],
    breeder: "Origin contested (cult bag-seed story, 1990s)",
    sensoryFamily: "diesel-chem",
    phenotypeNotes: [
      "Many sub-cuts (Chem 91, Chem D, Chem 4) with distinct profiles",
    ],
    curatorNote:
      "Chemdawg is the cult bag-seed that quietly rewired modern cannabis — the mythic parent behind both OG Kush and Sour Diesel, with an origin story (a Grateful Dead show, a bag of seeds) more legend than record. Crack it open and it's pure sharp chemical funk: acrid diesel, a metallic tang and sour earth — the 'chem' note an entire family is named after. The high is heavy and cerebral at once: a fast, pressing head-rush that settles into a weighty, slightly dazed body, more potent than its plain looks suggest. It comes in several cuts (Chem 91, Chem D, Chem 4) that aren't interchangeable, so 'Chemdawg' on a label tells you the family, not the exact phenotype. It's a connoisseur's strain — loud, divisive and foundational.",
    curatorQuote:
      "Crack it open and it's pure sharp chemical funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a loud, foundational chem strain named Chemdawg. A lean, battle-scarred junkyard dog standing guard at night in a gritty back-lot, acrid chemical fumes and a sour-green diesel haze rolling low around its legs, metallic vapor catching cold sodium light; the wet asphalt holds an oily fuel-rainbow sheen, sharp and chemical. The air is pure funk — acrid diesel, a metallic tang and sour earth. Palette dark and chemical — toxic acid-green and sour yellow haze over diesel black and bruised metal, cold steel highlights and petrol-slick shimmer on wet ground. Mood: heavy and cerebral at once — a pressing head-rush sinking into a weighty, dazed body, loud and divisive. Cinematic, painterly, high-contrast, premium editorial poster, gritty and atmospheric. The strain name 'CHEMDAWG' baked into the scene — stenciled on a rusted back-lot wall or stamped on the dog's worn metal collar tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "chemdawg.webp",
    artStatus: "published",
    artVersion: 1,
    whyItMatters:
      "Chemdawg is the quiet root of modern cannabis: the cult bag-seed — born of a Grateful Dead-show legend — that parented both OG Kush and Sour Diesel, and through them a huge share of today's menu. The entire 'chem' family is named after its sharp chemical funk.",
    tagline: "The chem origin",
    sourceConfidence: "medium",
    // The strain is foundational, but its actual origin is contested cult lore.
    lineageConfidence: "low",
  },
  {
    canonicalName: "Stardawg",
    lineage: {
      parents: ["Chemdawg 4", "Tres Dawg"],
      cross: "Chemdawg 4 × Tres Dawg",
      parentDetails: {
        "Chemdawg 4": {
          lineageBrief: "Chemdawg phenotype #4",
          type: "hybrid",
        },
        "Tres Dawg": {
          lineageBrief: "Chemdawg × Afghani #1",
          type: "indica",
        },
      },
    },
    sensoryFamily: "diesel-chem",
    curatorNote:
      "Stardawg is a modern Chem standout — a Chemdawg 4 × Tres Dawg cross whose frosty, 'stardust' trichome coat gave it the name. The nose is sharp and classic chem: diesel and sour earth with a piney, chemical bite, loud and unmistakably of the Chemdawg line. The effect leans bright and cerebral for a chem strain — an uplifting, talkative head-buzz with moderate body, more daytime-friendly than its heavier relatives. The flavour stays firmly in fuel-and-funk territory, so it's a strain for gas lovers rather than the candy crowd. As a cleaner, frostier take on the Chem family, it's well-regarded.",
    curatorQuote:
      "Diesel and sour earth with a piney, chemical bite, loud and unmistakably of the Chemdawg line.",
    tagline: "Bright chem signal",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, bright chem strain named Stardawg. A vast night sky where the stars form the glittering shape of a great dog constellation, the brilliant Dog Star blazing at its heart — a fall of silver stardust frost drifting down like trichome glitter, settling over a dark ridge below; a thin diesel haze threads the lower air, catching starlight in faint petrol-rainbow shimmer. Sharp chem in the cold night — diesel and sour earth with a piney, chemical bite. Palette cosmic and frosty — deep indigo and chem-green nebula glow studded with silver-white stardust, an electric blue Dog Star, faint oily shimmer over earthy shadow. Mood: bright and cerebral — an uplifting, talkative head-buzz, the cleaner, frostier side of the Chem family. Cinematic, painterly, high-contrast, premium editorial poster, glittering and atmospheric. The strain name 'STARDAWG' baked into the scene — spelled in bright constellation stars or carved into the ridge stone below. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "stardawg.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── Garlic / funk family ──
  {
    canonicalName: "GMO Cookies",
    marketNames: ["Garlic Cookies", "GMO"],
    breeder: "Mamiko Seeds (commonly credited; origin debated)",
    lineage: {
      parents: ["Chemdog", "Girl Scout Cookies"],
      cross: "Chemdog × GSC",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: [
      "Distinct savoury garlic note on top of chem",
      "Pungent enough that 'Garlic' nicknames stuck on the market",
    ],
    curatorNote:
      "GMO is what happens when Chemdawg's gas meets the richness of Girl Scout Cookies and something genuinely savory falls out — the garlic-and-onion note that earned the 'Garlic Cookies' nickname is real, not marketing. On the nose it reads almost umami: roasted garlic, cracked black pepper and chem funk over a faint cookie-dough sweetness, loud enough to embarrass most jars sitting next to it. The effect is the opposite of that sharp smell — deeply physical, slow and sedating, the kind of heavy that quietly erases an evening's plans. It's a connoisseur's indica: the people who love it love the funk specifically, while newcomers often find the savory profile divisive on a first try. Treat it as a nighttime strain and it rarely disappoints.",
    curatorQuote:
      "Loud enough to embarrass most jars sitting next to it.",
    tagline: "Garlic chem heavy",
    sourceConfidence: "high",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of GMO Cookies — a savory, very-strong indica where Chemdog's diesel gas collides with the richness of Girl Scout Cookies and something genuinely garlic-and-onion falls out, the famous 'Garlic Cookies' funk made visible. The scene: a darkened roadside diner kitchen at night, a cast-iron skillet of roasted garlic cloves and charred shallots steaming under a single hooded bulb, an open jerry can of fuel glinting on a steel prep table, oil-slick floor reflecting amber light. Palette of burnt umber, oily green-black, charred onion-skin bronze and a hot diesel-amber glow, slick and savory. Mood: heavy, sinking, narcotic — relaxed into deep couch-lock and euphoric drowse, smoke curling slow in still air, the only motion the lazy drift of steam under a hard top-down night light. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GMO COOKIES' branded into the seared underside of the cast-iron skillet. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Donny Burger",
    breeder: "Skunk Master Flex",
    lineage: {
      parents: ["GMO Cookies", "Han-Solo Burger"],
      cross: "GMO × Han-Solo Burger",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savoury cheese-and-garlic gas"],
    curatorNote:
      "Donny Burger is a Skunk Master Flex strain — a GMO × Han-Solo Burger cross — that leans hard into savoury, cheesy gas. The nose is pungent and funky: garlic, cheese and sour fuel over an earthy base, loud in the GMO tradition rather than sweet. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, firmly evening territory. It's potent and not subtle, a connoisseur's funk strain more than a crowd-pleaser. For lovers of garlic-and-cheese gas, Donny Burger delivers the savoury end.",
    curatorQuote:
      "Garlic, cheese and sour fuel over an earthy base, loud in the GMO tradition rather than sweet.",
    tagline: "Savoury gas weight",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, savoury cheese-and-garlic gas strain named Donny Burger. A thick, juicy gourmet cheeseburger on a dark diner counter at night, molten cheese oozing down over a charred patty, roasted garlic and savoury smoke curling up under a neon-tinged glow; a faint oily petrol-rainbow shimmer threads the greasy haze, hinting at the sour-fuel funk beneath the savoury richness. Garlic, cheese and sour fuel over an earthy base, loud rather than sweet. Palette rich and moody — charred browns, melted cheddar-gold and sesame tan over a dark gritty counter, savoury smoke and a faint petrol shimmer under a low neon glow. Mood: heavy and relaxing — a euphoric head sinking into a sedating body, firmly evening. Cinematic, painterly, high-contrast, premium editorial poster, appetizing and atmospheric. The strain name 'DONNY BURGER' baked into the scene — lit on a worn diner sign or stamped on the burger wrapper. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "donny-burger.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Permanent Marker",
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Biscotti", "Jealousy", "Sherbert"],
      cross: "Biscotti × Jealousy × Sherbert",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Sharpie-and-soap funk", "'Strain of the year' contender"],
    curatorNote:
      "Permanent Marker is a Seed Junky cross of Biscotti, Jealousy and Sherbert — a 'strain of the year' contender named for its loud, Sharpie-like funk. The nose is exactly that: a sharp, chemical marker-and-soap funk over a sweet, gassy base, unmistakable and a little divisive. The effect is balanced and euphoric — a happy, uplifting head over a relaxed body, versatile but potent. It's very frosty and loud, a flavour-forward modern exotic. For people who want that distinctive Sharpie-soap funk done well, Permanent Marker is the reference.",
    curatorQuote:
      "A sharp, chemical marker-and-soap funk over a sweet, gassy base — unmistakable, and a little divisive.",
    tagline: "Sharpie gas funk",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a loud, frosty modern-exotic hybrid named Permanent Marker — known for its sharp Sharpie-like funk. A bold night scene in a dark back-alley gallery: a single oversized chrome permanent marker stands like a monument, its glossy black-and-electric-blue ink still wet, dripping and glowing across a concrete wall in fresh strokes; chemical marker fumes and a faint petrol haze drift through the cold night air, a crystalline frost catching the light. Palette deep and graphic — near-black indigo night with electric marker-ink blue, violet and chrome, a frosted sheen and a touch of amber. Mood: balanced and euphoric — a happy, uplifting buzz over a relaxed body, bold and vivid, confidently nocturnal. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'PERMANENT MARKER' written in fresh permanent-marker ink on the wall (baked into the scene). Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "permanent-marker.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── Citrus / haze family ──
  {
    canonicalName: "Super Lemon Haze",
    marketNames: ["SLH"],
    breeder: "Green House Seed Co.",
    lineage: {
      parents: ["Lemon Skunk", "Super Silver Haze"],
      cross: "Lemon Skunk × Super Silver Haze",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Lemon-zest-forward phenos are the prized cuts"],
    curatorNote:
      "Super Lemon Haze is Green House's two-time Cannabis Cup winner — a Lemon Skunk × Super Silver Haze cross that took the haze and made it candy-bright. The nose is unmistakable: vivid lemon zest and sherbet over a green, skunky haze backbone, the kind of citrus that makes you smile before you even light it. The effect is energetic and chatty — a buzzy, creative, uptempo sativa lift that suits daytime, conversation and getting things done. The caveats are the usual haze ones: it can run racy or anxious in big doses, and a weak cut loses the lemon and just tastes generically green. Grown right, though, it's one of the most joyful citrus sativas on the shelf.",
    curatorQuote:
      "Vivid lemon zest and sherbet over a green, skunky haze backbone.",
    tagline: "Bright morning lift",
    sourceConfidence: "high",
    // Override: derives to "daytime" (daytime-functional family), but the
    // candy-bright lemon lift reads as a morning strain.
    timeProfile: "morning",
    artFileName: "super-lemon-haze.webp",
    artStatus: "published",
    artVersion: 1,
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Super Lemon Haze — Green House's Cup-winning citrus-haze sativa, candy-bright and grinning. A sun-drenched morning market stall: a marble counter heaped with halved Amalfi lemons, a scoop of pale lemon sherbet melting in a glass coupe, curls of bright zest and a sweating jug of lemonade, dewy and luminous, with a faint green skunky haze drifting in the warm light. Palette of vivid lemon-yellow and sherbet-cream over fresh leaf-green and a pale gold morning glow, high-key and zesty-sweet. Mood: bright, buzzy, uplifting — energetic creative head-high, everything sparkling and awake in fresh early light. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'SUPER LEMON HAZE' painted in bold across the front of a wooden lemon crate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
  },
  {
    canonicalName: "Lemon Haze",
    lineage: { parents: ["Lemon Skunk", "Silver Haze"] },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Lighter, friendlier cousin of Super Lemon Haze"],
    curatorNote:
      "Lemon Haze is a bright citrus sativa — a Lemon Skunk × Silver Haze cross — a lighter, more accessible cousin of Super Lemon Haze. The nose is fresh and zesty: lemon and citrus over a green, herbal haze, clean and lively. The effect is uplifting and energetic — a happy, talkative head with a light body, a daytime and social sativa. It can run a touch racy at high doses, but it's friendlier than the heaviest hazes. For an easy, lemony daytime lift, Lemon Haze is a reliable citrus sativa.",
    curatorQuote:
      "Lemon and citrus over a green, herbal haze, clean and lively.",
    sourceConfidence: "medium",
    tagline: "Easy lemon lift",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Haze — a bright, easygoing citrus sativa, the lighter cousin of Super Lemon Haze. A breezy sunlit lemon grove at midday: a leaning wooden ladder against a lemon tree heavy with fruit, a woven basket of fresh-picked lemons in dappled light, a soft green herbal haze drifting between the leaves, dew still bright on the rind. Palette of fresh lemon-yellow and leaf-green over warm sun-dappled cream, airy and light, more open than a market scene. Mood: cheerful, talkative, light — uplifted happy energy with an easy, accessible lift, leaves fluttering in a warm breeze. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'LEMON HAZE' burned into the side rail of the wooden ladder. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Tangie",
    breeder: "DNA Genetics",
    lineage: {
      parents: ["California Orange", "Skunk"],
      cross: "California Orange × Skunk",
    },
    sensoryFamily: "citrus-haze",
    curatorNote:
      "Tangie is DNA Genetics' citrus showpiece — a California Orange × Skunk cross that became the reference for tangerine-bright cannabis. The nose is exactly what the name promises: fresh tangerine and orange peel, zesty and sweet, with just a whisper of skunk underneath. The effect is uplifting and creative — a bright, buzzy, sociable head-high that suits daytime and conversation, sativa-leaning without being frantic. It's a flavour-first strain; the citrus is the whole point, and a dull cut that loses the orange loses most of its appeal. For people chasing pure, juicy citrus, Tangie is the benchmark.",
    curatorQuote:
      "Fresh tangerine and orange peel, zesty and sweet, with just a whisper of skunk underneath.",
    sourceConfidence: "high",
    tagline: "Pure tangerine zest",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Tangie — DNA Genetics tangerine showpiece, zesty, sweet and unmistakably orange. A bright mid-century California roadside citrus stand at high noon: a sun-bleached turquoise counter piled with ripe tangerines and navel oranges, long curls of orange peel, a glass of fresh-squeezed juice and a chrome hand-juicer catching the light, a faint skunk-green shadow at the edge. Palette of vivid tangerine-orange and sweet marigold over sun-faded turquoise and warm cream, saturated and citrus-bright. Mood: upbeat, buzzy, creative — uplifted energetic focus, everything zesty and awake under hard noon sun. Cinematic, painterly, high-contrast, premium editorial poster. The strain name TANGIE painted in bold retro letters across the front of the wooden orange crate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },

  // ── Kush / classic indica family ──
  {
    canonicalName: "Northern Lights",
    marketNames: ["NL"],
    breeder: "Sensi Seeds (popularised; origin debated)",
    lineage: { parents: ["Afghani"] },
    sensoryFamily: "kush-classic",
    phenotypeNotes: [
      "80s pheno bedrock — many modern indicas trace back to this line",
    ],
    curatorNote:
      "Northern Lights is 1980s bedrock — a nearly pure Afghani indica that Sensi Seeds popularised and that quietly fathered a huge share of modern indicas. The nose is gentle and classic: sweet pine and dusty earth with a soft spicy-resin sweetness, never loud, always comforting. The effect is the definition of a heavy, dreamy body stone — warm, lazy and reliably sleepy, the strain people reach for to switch the day off. Its mildness of flavour is the trade-off: it won't dazzle terp-chasers, and it's been grown so long that cuts vary in punch. But for sheer dependable, sit-down relaxation, it's one of the most trusted names there is.",
    curatorQuote:
      "The strain people reach for to switch the day off.",
    whyItMatters:
      "Northern Lights is 1980s bedrock — the nearly pure Afghani that taught the decade what indica was supposed to feel like. Sensi Seeds popularised it, and a large share of modern indicas trace back to its line; it's one of the foundational sedative cultivars the whole category was built on.",
    tagline: "Old guard sedation",
    sourceConfidence: "high",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Northern Lights — 1980s bedrock, a nearly pure Afghani indica that quietly fathered a huge share of modern indicas, gentle and classic with sweet pine and dusty earth and a soft spicy-resin sweetness. The scene: a still wilderness lake under a sweeping aurora borealis, ribbons of green and violet light rippling across a star-thick sky, a lone snow-dusted spruce on a rocky point, a low cairn of weathered stones at the water's edge. Palette of aurora pine-green, cold spruce-needle teal, dusty earthen brown and soft resin-amber warmth bleeding into deep indigo. Mood: calm, settling, drowsy — happy relaxation drifting toward sleep, the aurora drifting slow and silent overhead, mirrored faintly in the black lake, deep night stillness. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'NORTHERN LIGHTS' carved into a flat face of the largest cairn stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Bubba Kush",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush × an unknown New Orleans indica (commonly cited as a Northern Lights relative — not verified)",
    },
    marketNames: ["Bubba"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Coffee / earthy heavy-indica reference"],
    curatorNote:
      "Bubba Kush is a classic American indica of murky early-2000s origin, beloved for a flavour profile you rarely find elsewhere. The nose is its signature: rich coffee and dark chocolate over sweet hashy earth, almost dessert-like in a savoury way. The effect is heavy and tranquil — a thick, relaxing body weight that quiets everything down and tips toward sleep, a textbook nightcap. It's not a productive or cerebral strain, and that's the point: people reach for Bubba to stop, not to start. For coffee-and-cocoa indica lovers, it remains a comforting reference.",
    curatorQuote:
      "People reach for Bubba to stop, not to start.",
    tagline: "Coffee couch",
    sourceConfidence: "medium",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Bubba Kush — a classic American indica of murky early-2000s origin, OG Kush crossed with an unknown indica, signature rich coffee and dark chocolate over sweet hashy earth, dessert-like in a savory way. The scene: a dim late-night cafe corner, a battered copper espresso pot beside a broken square of dark chocolate on a worn wooden table, a curl of steam rising from a small cup, an oil lamp throwing warm pooled light across spice-dusted brass. Palette of espresso brown, dark cocoa, hashy gold-amber and warm woody umber against deep shadow. Mood: warm, heavy, sedate — calm relaxation collapsing into body-heavy couch-lock and sleep, steam rising slow, the lamp flame steady, a hushed midnight stillness. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'BUBBA KUSH' stamped into the side of the copper espresso pot. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Hindu Kush",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Pure indica landrace from the Hindu Kush range"],
    curatorNote:
      "Hindu Kush is a pure indica landrace from the mountains its name comes from — old-world genetics that helped seed the entire Kush family. The nose is earthy and sweet: sandalwood and incense over a dusty, hashy musk, the smell of classic hashish for a reason. The effect is calm and weighty — a relaxed, grounding body stone without much racing thought, even and dependable rather than dramatic. As a landrace it's hardy and consistent, and its resin made it a traditional hash plant for centuries. For purists who want indica at its origin, it's the source material.",
    curatorQuote:
      "Sandalwood and incense over a dusty, hashy musk, the smell of classic hashish for a reason.",
    sourceConfidence: "high",
    tagline: "Born Of Mountains",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Hindu Kush — a pure indica landrace from the mountains it is named for, old-world genetics that seeded the whole Kush family, earthy and sweet with sandalwood and incense over a dusty hashy musk. The scene: a high mountain night in the Hindu Kush range, jagged moonlit peaks under a vast star field, a weathered stone shrine on a windswept ridge with a worn prayer-flag pole and a brass incense bowl smoking faintly, dusty switchback trail winding down into shadowed valleys. Palette of dusty sandstone brown, sandalwood gold, cold slate-grey rock and a thin incense-amber glow under deep starlit indigo. Mood: ancient, grounded, sedate — deep calm settling into body-heavy stillness and sleep, only a slow ribbon of incense smoke and a faint flag-stir of wind, profound mountain-night quiet. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'HINDU KUSH' chiseled into the face of the shrine's foundation stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Afghani",
    marketNames: ["Afghan", "Afghan Kush"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Foundational indica landrace"],
    curatorNote:
      "Afghani is one of the foundational indica landraces — the broad-leaf, resin-heavy plant that sits in the family tree of countless modern strains. The nose is deep and sweet: earthy musk, incense and a hashy sweetness, classic and unmistakably old-school. The effect is profoundly relaxing — a heavy, warm body calm that settles in and stays, the template for what 'indica' came to mean. It's prized as much for its genetics and resin as for the smoke itself, a building block more than a showpiece. For deep, traditional body relaxation, it's the ancestor everything else borrows from.",
    curatorQuote:
      "Earthy musk, incense and a hashy sweetness, classic and unmistakably old-school.",
    sourceConfidence: "high",
  },

  // ── Purple / berry family ──
  {
    canonicalName: "Granddaddy Purple",
    marketNames: ["GDP", "Grand Daddy Purple", "Granddaddy Purp"],
    breeder: "Ken Estes",
    lineage: {
      parents: ["Purple Urkle", "Big Bud"],
      cross: "Purple Urkle × Big Bud",
      parentDetails: {
        "Big Bud": {
          lineageBrief: "Afghani × Skunk #1 × Northern Lights",
          type: "indica",
        },
      },
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Reference grape-and-floral indica"],
    curatorNote:
      "Ken Estes introduced Granddaddy Purple in 2003 — a Purple Urkle × Big Bud cross — and it's stayed the reference point for what a purple indica should be. It looks the part, dense violet buds under a frost of trichomes, and it smells it too: grape candy and sweet berry over a dusty floral earthiness that reads almost like wine. The effect is unapologetically heavy — a warm, dreamy body weight that drifts toward sleep, which is why it lives on evening, pain and stubborn-insomnia shelves rather than anywhere productive. The caveat is presence over cleverness: this is a sit-down, wind-down strain, and pushing it in the afternoon usually ends in a nap. For the grape-and-couch archetype, it's still the one the others get measured against.",
    curatorQuote:
      "For the grape-and-couch archetype, it's still the one the others get measured against.",
    tagline: "Grape royalty",
    sourceConfidence: "high",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Granddaddy Purple — Ken Estes' 2003 reference purple indica, Purple Urkle crossed with Big Bud, dense violet character that looks the part and smells of grape and sweet berry and floral fruit. The scene: an old hillside vineyard at deep dusk, heavy clusters of dark grapes hanging from gnarled vines on weathered stakes, a wooden harvest crate brimming with violet fruit, distant rolling rows fading into purple haze, a low stone wall edging the field. Palette of deep grape-violet, berry-magenta, floral plum and sweet fruit-bloom over dusky indigo shadow. Mood: lush, heavy, sinking — happy relaxation easing into body-heavy couch-lock and sleep, vines barely stirring, the last warm light gone to violet, a slow nightfall calm. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GRANDDADDY PURPLE' burned into the wood of the harvest crate's front slat. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Purple Punch",
    lineage: {
      parents: ["Larry OG", "Granddaddy Purple"],
      cross: "Larry OG × Granddaddy Purple",
    },
    sensoryFamily: "purple-berry",
    curatorNote:
      "Purple Punch is a dessert indica — a Larry OG × Granddaddy Purple cross that stacks grape candy on top of its purple heritage. The nose is sweet and fruity: grape soda and blueberry candy with a vanilla-tart edge, more candy shop than cannabis funk. The effect is a one-two punch of euphoria then heavy relaxation — a warm, happy lift that quickly turns drowsy, which is why it's an after-dinner and bedtime favourite. It's easy to like and easy to overdo; the sweetness hides the sedation until it lands. For the grape-and-couch crowd who want it sweeter than GDP, Purple Punch fits.",
    curatorQuote:
      "Grape soda and blueberry candy with a vanilla-tart edge, more candy shop than cannabis funk.",
    sourceConfidence: "medium",
    tagline: "Grape Knockout",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Purple Punch — a dessert indica, Larry OG crossed with Granddaddy Purple, stacking grape candy on a purple heritage, sweet and fruity with grape soda and blueberry candy and a vanilla-tart edge, more candy shop than cannabis. The scene: a retro late-night soda fountain counter, a tall frosted glass of fizzing purple grape soda with violet bubbles rising, a scoop of vanilla beside spilled blueberry candies on a checkered chrome-edged counter, a dim neon glow washing over polished steel. Palette of grape-soda violet, blueberry indigo, vanilla cream and a sweet candy-pink neon shimmer against night-dark chrome. Mood: indulgent, mellow, sinking — happy hungry relaxation drifting toward sleep, soda bubbles rising slow, neon humming steady, a sleepy after-hours stillness. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'PURPLE PUNCH' painted in faded script across the soda fountain's enamel sign panel. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },

  // ── Skunk / classic hybrid family ──
  {
    canonicalName: "Skunk #1",
    marketNames: ["Skunk", "Original Skunk"],
    breeder: "Sacred Seed Co. / Sam the Skunkman",
    lineage: {
      parents: ["Afghani", "Acapulco Gold", "Colombian Gold"],
      cross: "Afghani × Acapulco Gold × Colombian Gold",
    },
    sensoryFamily: "skunk-funk",
    phenotypeNotes: [
      "The original 'skunk' aroma reference",
      "Genetic backbone of countless modern hybrids",
    ],
    curatorNote:
      "Skunk #1 is the strain that stabilised modern cannabis — Sam the Skunkman's Afghani × Acapulco Gold × Colombian Gold blend, one of the first truly consistent hybrids and the backbone of countless others. The nose is the original 'skunk': pungent, sweet-sour funk with an earthy, almost rubbery edge that the word itself now describes. The effect is balanced and approachable — a happy, relaxed, gently euphoric hybrid high without extremes, the reason it became a global standard. By today's potency standards it's moderate, and that even-handedness is exactly its character. As living history and a reliable everyday smoke, Skunk #1 still earns its place.",
    curatorQuote:
      "Pungent, sweet-sour funk with an earthy, almost rubbery edge that the word itself now describes.",
    sourceConfidence: "high",
  },

  // ── Dessert / Cookies family ──
  {
    canonicalName: "Wedding Cake",
    marketNames: ["Pink Cookies", "Triangle Mints"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Triangle Kush", "Animal Mints"],
      cross: "Triangle Kush × Animal Mints",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: [
      "Pheno-hunted across many cuts",
      "Vanilla-sweet on the inhale",
    ],
    curatorNote:
      "Wedding Cake — also sold as Triangle Mints or Pink Cookies — is Seed Junky's Triangle Kush × Animal Mints cross and one of the defining dessert hybrids of the last decade. The nose is rich and inviting: vanilla cake and sweet cream over a tangy, peppery gas that keeps the sweetness grounded. The effect is heavy-leaning and euphoric — a warm, happy lift that melts into deep body relaxation, an evening strain more than a productive one. It's potent and frosty, a pheno-hunter's favourite, though the name is now so common that quality swings hard between a true gassy-vanilla cut and a flat, sugary one. For the cake-and-couch crowd, it's a reference point.",
    curatorQuote:
      "Vanilla cake and sweet cream over a tangy, peppery gas — the sweetness, grounded.",
    tagline: "Cake before sleep",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Girl Scout Cookies",
    marketNames: ["GSC", "Cookies"],
    breeder: "Cookies Fam / Berner",
    lineage: {
      parents: ["OG Kush", "Durban Poison"],
      cross: "OG Kush × Durban Poison",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Thin Mint and Forum cuts are the canonical phenos"],
    curatorNote:
      "Girl Scout Cookies (GSC) is the Bay Area cross — OG Kush × Durban Poison — that kicked off the entire modern dessert era; without it there's no Gelato, no Wedding Cake, no Cookies empire. The nose is sweet and complex: dessert-y vanilla and mint over an earthy OG funk, with the Thin Mint and Forum cuts the canonical phenos. The high is famously strong and well-rounded — a euphoric, giggly head paired with a heavy, enveloping body that newcomers routinely underestimate. That potency is the double edge: a little goes a long way, and overdoing GSC is a quick route to the couch. It earned its status honestly, both as a smoke and as the genetic parent of half the shelf.",
    curatorQuote:
      "Dessert-y vanilla and mint over an earthy OG funk, with the Thin Mint and Forum cuts the canonical phenos.",
    sourceConfidence: "high",
    tagline: "The Original Dessert",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Girl Scout Cookies — the Bay Area cross, OG Kush crossed with Durban Poison, that kicked off the entire modern dessert era, sweet and complex with dessert-y vanilla and earthy nutty spice. The scene: a warm late-night home bakery counter, a fresh tray of golden spiced cookies cooling on a wire rack, a cracked vanilla pod and a scatter of toasted nuts and cinnamon sticks beside a dusting of flour, a single pendant lamp pooling warm light over dark butcher-block wood. Palette of golden-brown cookie crust, vanilla cream, toasted nut amber and warm cinnamon spice against deep kitchen shadow. Mood: warm, satisfied, settling — euphoric happy head-high mellowing into body-heavy ease, a last thread of oven steam rising, everything else still, a cozy midnight calm. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GIRL SCOUT COOKIES' carved into the edge of the wooden cutting board. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Gelato",
    marketNames: ["Larry Bird"],
    breeder: "Cookies Fam / Sherbinski",
    lineage: {
      parents: ["Sunset Sherbet", "Thin Mint GSC"],
      cross: "Sunset Sherbet × Thin Mint GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: [
      "#33 ('Larry Bird') is the original prized pheno",
      "Many numbered cuts exist — they're not interchangeable",
    ],
    curatorNote:
      "Gelato came out of the Cookies/Sherbinski camp in the Bay Area, a Sunset Sherbet × Thin Mint GSC cross whose prized #33 pheno earned the 'Larry Bird' nickname. It's the dessert end of the spectrum done right: sweet cream and sherbet up front, a twist of citrus and berry, and a low note of gas underneath that keeps it from turning cloying. The high is balanced and euphoric — a bright, social lift that settles into easy body comfort without knocking you flat, which is exactly why it became the parent of half the modern menu. Be aware the name is everywhere now: numbered cuts vary widely, and plenty of 'Gelato' on shelves is sweetness without the backbone. A true cut is frosty, gassy-sweet, and unmistakably balanced.",
    curatorQuote:
      "A true cut is frosty, gassy-sweet, and unmistakably balanced.",
    tagline: "The balanced exotic",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for the benchmark balanced dessert exotic named Gelato. A single tall, elegant swirl of artisan gelato rising from a chilled cup as the hero — creamy sherbet folds of pink and violet ribboned with citrus-orange and berry-purple, a glistening frosted sheen sweating off the cold swirl, set against a soft warm Italian piazza dusk glowing behind it. The air is sweet and creamy: cream and sherbet with a citrus-berry twist over a low, balancing note of gas. Palette refined and luscious — sherbet pink, cream and violet with bright citrus-orange and berry pops, a frosty silver sheen against a warm amber-rose dusk glow. Mood: bright and social settling into easy body comfort — euphoric, balanced, frosty and gassy-sweet. Cinematic, painterly, high-contrast, premium editorial poster, elegant and appetizing. The strain name 'GELATO' baked into the scene — hand-lettered on a small enamel cup tag or a gelateria sign behind. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gelato.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "high",
  },
  {
    canonicalName: "Biscotti",
    lineage: {
      parents: ["Gelato 25", "South Florida OG"],
      cross: "Gelato 25 × South Florida OG",
    },
    sensoryFamily: "dessert-cookies",
    curatorNote:
      "Biscotti is a darker, gassier corner of the Cookies family — a Gelato 25 × South Florida OG cross that trades candy sweetness for dessert-meets-fuel. The nose is rich and a little savoury: sweet cookie and coffee over a pronounced gassy, peppery funk, more grown-up than the fruity exotics. The effect is relaxed and euphoric with real body weight — a calm, heavy ease that suits late afternoon into evening rather than getting things done. It's potent and frosty, a favourite for people who find pure-candy strains too one-note. For the cookies-and-gas end of the dessert spectrum, Biscotti is a standout.",
    curatorQuote:
      "Sweet cookie and coffee over a pronounced gassy, peppery funk, more grown-up than the fruity exotics.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a darker, gassier, grown-up cookie exotic named Biscotti. A few golden almond biscotti cookies leaning against a small cup of dark espresso on a moody dark surface, warm low café light catching the crumb and the coffee's crema, a curl of coffee steam carrying a faint oily petrol-rainbow shimmer that hints at the gassy, peppery funk, a sugar-frost sparkle on the cookies. Sweet cookie and coffee over a pronounced gassy, peppery funk. Palette rich and grown-up — golden biscotti and espresso brown with deep shadow, a frosty sparkle and a faint petrol shimmer under a moody amber glow. Mood: relaxed and euphoric with body weight — a calm, heavy ease, late-afternoon into evening. Cinematic, painterly, high-contrast, premium editorial poster, lush and atmospheric. The strain name 'BISCOTTI' baked into the scene — hand-lettered on a café chalkboard or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "biscotti.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── Modern exotics ──
  {
    canonicalName: "Runtz",
    marketNames: ["White Runtz", "Pink Runtz"],
    breeder: "Cookies / Runtz Genetics",
    lineage: {
      parents: ["Zkittlez", "Gelato"],
      cross: "Zkittlez × Gelato",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: [
      "Candy-tropical sweetness",
      "White / Pink phenos vary by frost and finish",
    ],
    curatorNote:
      "Runtz is the candy-bag flagship of the exotic era — a Zkittlez × Gelato cross from the Runtz/Cookies camp that turned 'looks like candy, tastes like candy' into a whole aesthetic. The nose is pure confection: sugary tropical fruit and creamy sweetness with barely any funk, loud in a fruity rather than gassy way. The effect is balanced and feel-good — a bright euphoric lift over comfortable body ease, social without being sedating. Its fame is also its curse: 'Runtz' is one of the most counterfeited names on the market, and a lot of it is sweetness without the frost or the balance. A real White or Pink cut is glittering, candied and unmistakably exotic.",
    curatorQuote:
      "'Looks like candy, tastes like candy' became a whole aesthetic.",
    tagline: "Pure candy bag",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a candy-sweet, balanced feel-good exotic hybrid named Runtz — the candy-bag flagship. A glossy spill of glittering hard candy and sugar-dusted tropical fruit tumbling from a torn foil bag across a glassy surface — pastel pinks, purples, mints and creams catching bright studio light, each piece slick with a sugared, frosted sheen, a few translucent jewels glowing like gemstones. Loud fruity confection in the air — sugary tropical fruit and creamy sweetness, no gas. Palette playful and exotic — candy pink, lilac and mint over cream and pearl-white frost, glossy and high-key with bright pops of saturated fruit color. Mood: bright, social, feel-good — a euphoric lift over easy body comfort, fun without sedation. Cinematic, painterly, high-contrast, premium editorial poster, hyper-glossy and candied. The strain name 'RUNTZ' baked into the scene — printed boldly on the torn candy-bag foil. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "runtz.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "high",
  },
  {
    canonicalName: "Zkittlez",
    marketNames: ["Skittlez", "Skittles", "Island Zkittlez"],
    breeder: "Terphogz / 3rd Gen Family",
    lineage: { parents: ["Grape Ape", "Grapefruit"] },
    sensoryFamily: "candy-exotic",
    curatorNote:
      "Zkittlez is the strain that taught a generation to chase fruit — a Terphogz creation (Grape Ape × Grapefruit lineage) whose name is the honest review: it really does taste like a handful of Skittles. The nose is bright and mouth-watering: mixed berry, grape and tropical candy with a clean, almost sour-sweet edge and very little gas. Despite the sativa-sounding fruit, the effect leans calm and contented — a relaxed, happy, low-ceiling body ease that's hard to overdo, good for unwinding without a knockout. The trade-off is power: it's more about flavour and mood than raw potency, which purists sometimes hold against it. As a terpene showcase, though, it's one of the cleanest, most addictive flavours in the catalogue.",
    curatorQuote:
      "Mixed berry, grape and tropical candy with a clean, almost sour-sweet edge and very little gas.",
    sourceConfidence: "high",
  },

  // ── Sweet-haze hybrid ──
  {
    canonicalName: "Blue Dream",
    breeder: "Unknown / Santa Cruz origin",
    lineage: {
      parents: ["Blueberry", "Haze"],
      cross: "Blueberry × Haze",
      parentDetails: {
        Haze: {
          lineageBrief: "Original Haze landrace cross",
          type: "sativa",
        },
      },
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Smooth-berry gateway sativa-leaning hybrid"],
    curatorNote:
      "Blue Dream is the gateway hybrid — a Santa Cruz cross of Blueberry and Haze that became California's best-seller precisely because it asks nothing of you. The aroma is gentle and approachable: ripe blueberry and sweet berry over a soft herbal haze, friendly rather than loud. The effect tells the same easy story — a clear, gently uplifting head-high with just enough body to stay comfortable, rarely overwhelming even at a generous dose. That mildness is also the knock against it among chasers: seasoned smokers sometimes call it boring, and it's grown so widely that quality swings hard between a vivid, berry-bright cut and a flat, generic one. As a daytime all-rounder almost anyone can handle, though, it's still hard to beat.",
    curatorQuote:
      "California's best-seller, precisely because it asks nothing of you.",
    tagline: "Gentle berry float",
    sourceConfidence: "high",
  },

  // ── Pine / spice sativas ──
  {
    canonicalName: "Jack Herer",
    marketNames: ["JH", "The Jack"],
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Haze", "Northern Lights #5", "Shiva Skunk"],
      cross: "Haze × Northern Lights #5 × Shiva Skunk",
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: [
      "Named after activist Jack Herer",
      "Pine/spice sativa benchmark",
    ],
    curatorNote:
      "Named for the activist who wrote 'The Emperor Wears No Clothes,' Jack Herer is Sensi Seeds' tribute strain — a Haze × Northern Lights #5 × Shiva Skunk blend that became the benchmark spicy-pine sativa. The nose is bright and resinous: pine, peppery spice and a lemony incense note that reads clean and almost medicinal. The effect is the reason it's a classic — clear, focused and gently uplifting, a working-day sativa that sharpens rather than scatters. It's well-behaved by haze standards, less likely to tip anxious, which is why it's so often the daytime default people recommend. Many 'Jack' cuts exist and lean differently, but the through-line is always that clear pine-and-spice clarity.",
    curatorQuote:
      "Pine, peppery spice and a lemony incense note that reads clean and almost medicinal.",
    sourceConfidence: "high",
    tagline: "The pine benchmark",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Jack Herer — Sensi Seeds' benchmark spicy-pine sativa named for the cannabis activist and author, bright, clear-headed and creative. A sunlit alpine pine forest at midday: tall resin-bright conifers with shafts of golden light cutting through, a flat granite boulder set with a halved lemon, scattered black peppercorns and a thin curl of incense smoke rising into the clean air, fresh sap glistening on bark. Palette of resinous pine-green and silver-fir, bright lemon-yellow and warm peppercorn-amber against cool forest shadow, crisp and clean. Mood: clear, awake, inventive — uplifted creative focus and bright energy, light flickering through swaying branches, fresh and almost medicinal. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'JACK HERER' carved into the bark of a foreground pine trunk. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Durban Poison",
    marketNames: ["Durban"],
    breeder: "South African landrace",
    sensoryFamily: "pine-spice",
    phenotypeNotes: [
      "Pure sativa landrace",
      "Anise / black licorice undertone",
    ],
    curatorNote:
      "Durban Poison is a pure South African landrace, one of the few classic sativas that never needed crossing to earn its reputation. The nose is distinctive and clean: sweet pine and a sharp anise / black-licorice note that sets it apart from anything in the gas or candy world. The effect is the espresso of cannabis — clear, bright, energetic and focused, with almost no body weight, which is exactly why it's a morning and get-things-done staple. It's also the sativa half of Girl Scout Cookies, so its DNA runs through the modern dessert line despite tasting nothing like it. For people who find most strains too sedating, Durban is the reliable up.",
    curatorQuote:
      "Sweet pine and a sharp anise / black-licorice note that sets it apart from anything in the gas or candy world.",
    tagline: "The espresso sativa",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of a pure South African landrace sativa — Durban Poison, electric and clear-headed. A sun-blasted highveld savanna at bright midday: tall golden grass rippling in dry wind beneath a vast clear sky, a lone flat-topped acacia and distant blue koppies, sharp clean light with no haze. Palette of pine-green and anise-spice over sun-bleached gold and ochre earth, threaded with sweet licorice warmth under a cool citrus-bright sky. The air is crisp and resinous — sharp pine and black-licorice spice carried on dry heat. Mood: awake, focused, kinetic and uplifting — restless daytime clarity, the espresso of cannabis. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'DURBAN POISON' baked into the scene — burned and painted onto a weathered wooden trail sign staked in the grass. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
    sourceConfidence: "high",
  },

  // ── Custom / light data ──
  {
    canonicalName: "White Hot Guava",
    lineage: {
      cross: "A market label — genetics vary by breeder (Stardawg-, Guava- or White Fire-based); no single documented cross",
    },
    marketNames: ["Hot Guava", "WHG"],
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: [
      "Guava-forward gas hybrid",
      "Custom seed entry — limited public lineage data",
    ],
    curatorNote:
      "White Hot Guava is a custom, small-batch hybrid with little public lineage on record — what's consistent is the guava: a sweet, almost tinned-tropical fruit note riding on top of sharp fuel. On the nose it reads candy-and-gas, the guava softening an otherwise pungent diesel funk. The high sits in the middle — a clear, lightly euphoric lift with a loose, comfortable body that won't pin you down. It's bought for the flavour and the frost rather than for knockout potency. A novelty in the best sense: if you find a real cut, the guava note is genuinely hard to source elsewhere.",
    curatorQuote:
      "On the nose it reads candy-and-gas, the guava softening an otherwise pungent diesel funk.",
    tagline: "Tropical evening hybrid",
    shortName: "Hot Guava",
    sourceConfidence: "low",
    timeProfile: "sunset",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of a small-batch tropical-exotic hybrid where sweet guava rides on sharp fuel. A lush, overgrown glasshouse conservatory at golden dusk on the edge of an industrial harbour: heavy ripe guava and tropical fruit glowing among chrome-and-glass structures, with faint refinery pipework and a petrol shimmer dissolving into a wine-dark sunset sky. Palette warm and exotic — guava coral-pink, mango-gold and candy-sweet light against cool petrol-blue and chrome shadow, amber sun catching a frosted, resinous sheen on every surface. Mood: relaxed, gently euphoric, comfortable and unhurried — a soft, drifting evening warmth that lifts without pinning you down. Cinematic, painterly, high-contrast, premium editorial poster. Keep the lower third calmer and darker for legible overlay text. The strain name may appear baked into the scene (e.g. etched into the glass or stencilled on metal); no overlaid captions, logos or watermarks; no people, products or cannabis leaves.",
    artFileName: "white-hot-guava.webp",
    artStatus: "published",
    artVersion: 1,
    // Keep the "WHITE HOT GUAVA" arch (left of centre) inside the narrow
    // List crop.
    artFocus: "40% 50%",
  },

  // ── Dessert / purple / kush expansions ──
  {
    canonicalName: "Animal Mints",
    marketNames: ["Animal Mint", "Mints"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Animal Cookies", "Blue Power"],
      cross: "Animal Cookies × Blue Power",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Minty-gas cookie pheno", "Heavy frost, dense structure"],
    curatorNote:
      "Animal Mints is a Seed Junky creation — an Animal Cookies × Blue Power cross — and a parent of Wedding Cake, so it sits close to the heart of the modern dessert line. The nose is cool and rich: minty, cookie-dough sweetness over a gassy, earthy funk, the kind of profile that reads dessert and fuel at once. The effect is heavy and euphoric — a warm, happy head that sinks into full body relaxation, firmly evening territory rather than productive. It's potent and frosty, and like most cookie crosses the sweetness masks how flattening a big dose can be. For people who love the mint-and-gas corner of the dessert world, it's a benchmark.",
    curatorQuote:
      "Minty, cookie-dough sweetness over a gassy, earthy funk, the kind of profile that reads dessert and fuel at once.",
    tagline: "Cool minted body",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, minty-gas cookie exotic named Animal Mints. A pile of golden animal-shaped cookies (animal crackers) dusted with a glittering mint-green sugar frost, a cool minty vapor curling over them, a faint oily petrol-rainbow shimmer threading the haze to hint at the gas, warm-meets-cool bakery light. Minty, cookie-dough sweetness over a gassy, earthy funk. Palette cosy and cool — golden cookie-brown and cream with mint-green sugar frost and a frosty silver sparkle, a faint petrol shimmer over a soft shadow. Mood: heavy and euphoric — a warm, happy head sinking into full body relaxation, frosty and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'ANIMAL MINTS' baked into the scene — hand-lettered on a cookie-box label or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "animal-mints.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Animal Cookies",
    marketNames: ["Animal Cookie", "ABC"],
    breeder: "Seed Junky / Cookies Fam (contested)",
    lineage: {
      parents: ["Girl Scout Cookies", "Granddaddy Purple"],
      cross: "GSC × Granddaddy Purple",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sweet-and-sour cookie funk", "Backbone of many newer crosses"],
    curatorNote:
      "Animal Cookies is the heavyweight cookie cut — a GSC × Granddaddy Purple cross that fattened the Cookies line and fathered Animal Mints, Do-Si-Dos and more. The nose is dense and sweet-sour: cookie dough and dark berry over a sour, gassy funk, richer and heavier than its GSC parent. The effect matches the smell — a thick, deeply relaxing body stone with a happy euphoric head, the kind of strain that ends an evening comfortably. It's strong and a touch sedating, more nightcap than daytime, and newer smokers should pace it. As a parent strain it's everywhere in the modern dessert family tree.",
    curatorQuote:
      "Cookie dough and dark berry over a sour, gassy funk, richer and heavier than its GSC parent.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sunset Sherbet",
    marketNames: ["Sherbet", "Sherbert"],
    breeder: "Sherbinski",
    lineage: {
      parents: ["Girl Scout Cookies", "Pink Panties"],
      cross: "GSC × Pink Panties",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy-citrus dessert", "Half of Gelato's parentage"],
    curatorNote:
      "Sunset Sherbet is Sherbinski's GSC × Pink Panties cross — and, crossed with Thin Mint GSC, the parent of Gelato, which tells you exactly the lane it sits in. The nose is creamy and bright: sweet sherbet and berry over a candied citrus tang, with a soft cookie funk underneath. The effect is balanced and uplifting — a euphoric, mood-lifting head that eases into gentle body calm, sociable without knocking you out. It leans a touch indica overall, comfortable for late afternoon into evening, and its sweetness makes it very easy to over-enjoy. As the genetic bridge to Gelato, it's a quietly important strain in its own right.",
    curatorQuote:
      "Sweet sherbet and berry over a candied citrus tang, with a soft cookie funk underneath.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Cherry Pie",
    marketNames: ["Cherry Kush"],
    lineage: {
      parents: ["Granddaddy Purple", "Durban Poison"],
      cross: "Granddaddy Purple × Durban Poison",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Tart cherry over earthy sweetness"],
    curatorNote:
      "Cherry Pie is a Granddaddy Purple × Durban Poison cross — the same Durban-and-purple pairing that sits behind Girl Scout Cookies, tilted toward fruit. The nose is its calling card: tart cherry and sweet berry over a dusty, earthy sweetness, dessert-like but not cloying. The effect is balanced and easygoing — a happy, relaxed lift with a clear enough head to stay functional, more afternoon than knockout. It's an approachable hybrid that suits a wide range of smokers, neither racy nor sedating at sensible doses. For people who want fruit and balance rather than gas or pure couch, Cherry Pie is a comfortable pick.",
    curatorQuote:
      "Tart cherry and sweet berry over a dusty, earthy sweetness, dessert-like but not cloying.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a balanced, easygoing fruity hybrid named Cherry Pie. A freshly baked cherry pie cooling on a sun-warmed windowsill in late-afternoon light — golden lattice crust split open with glistening dark-red cherry filling spilling out, a thread of steam curling up, ripe cherries and berries scattered on weathered wood beside it. Warm afternoon sun streams in low and amber, dust motes drifting; the air is sweet with tart cherry and a soft dusty, earthy warmth. Palette inviting and homey — deep cherry red and berry over golden crust and amber afternoon light, dusty earthy browns and a touch of soft purple in the shadows. Mood: happy, relaxed, comfortable — a clear-headed, easygoing afternoon lift, neither racy nor sedating. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'CHERRY PIE' baked into the scene — branded into the wooden sill or a small enamel pie tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cherry-pie.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Do-Si-Dos",
    marketNames: ["Dosidos", "Do Si Dos"],
    breeder: "Archive Seed Bank (popularised)",
    lineage: {
      parents: ["OGKB (GSC)", "Face Off OG"],
      cross: "OGKB (GSC pheno) × Face Off OG",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cookie sweetness over heavy OG gas", "Very frosty"],
    curatorNote:
      "Do-Si-Dos is an OGKB (a Girl Scout Cookies pheno) × Face Off OG cross — cookies sweetness welded to heavy OG gas, and one of the frostiest strains on most shelves. The nose is rich and pungent: sweet cookie dough and floral funk over a thick layer of fuel and earth. The effect is firmly indica — a fast, heavy, deeply sedating body weight with a euphoric head that drifts toward sleep, a classic nightcap. It's potent enough that newcomers routinely underestimate it, so it earns its evening-only reputation. For lovers of gassy, frosty dessert indicas, Do-Si-Dos is a heavy hitter.",
    curatorQuote:
      "Sweet cookie dough and floral funk over a thick layer of fuel and earth.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grape Ape",
    marketNames: ["Grapes"],
    breeder: "Apothecary Genetics / Barney's Farm",
    lineage: {
      parents: ["Mendocino Purps", "Skunk #1", "Afghani"],
      cross: "Mendocino Purps × Skunk × Afghani",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Candy grape over earthy skunk", "Half of Zkittlez's parentage"],
    curatorNote:
      "Grape Ape is a purple classic — a Mendocino Purps × Skunk × Afghani blend best known now as half of Zkittlez's parentage. The nose is sweet and unmistakable: grape candy and berry over an earthy, skunky base, with the colour to match in dense violet buds. The effect is heavily relaxing — a warm, calming body weight that melts tension and tips toward sleep, a straightforward evening indica. It's not a cerebral or productive strain; the appeal is the grape flavour and the easy, sinking calm. For grape lovers who want classic purple heaviness, it's a reliable favourite.",
    curatorQuote:
      "Grape candy and berry over an earthy, skunky base, with the colour to match in dense violet buds.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blueberry",
    marketNames: ["Berry Blue"],
    breeder: "DJ Short",
    lineage: {
      parents: ["Purple Thai", "Afghani"],
      cross: "(Purple Thai × Thai) × Afghani",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["DJ Short heirloom line", "True blueberry sweetness"],
    curatorNote:
      "Blueberry is DJ Short's heirloom line from the 1970s–80s — a Thai-and-Afghani cross that became the reference for true berry flavour and a parent of Blue Dream. The nose is exactly the name: ripe blueberry and sweet berry over a soft earthy base, one of the most genuinely fruit-like profiles in cannabis. The effect is relaxed and happy — a gentle, warming body calm with a pleasant mood lift, comfortable rather than overpowering. It's an older, moderate-potency line, so it's more about flavour and ease than raw strength. For the blueberry flavour at its source, this is where it comes from.",
    curatorQuote:
      "Ripe blueberry and sweet berry over a soft earthy base — one of the most genuinely fruit-like noses in cannabis.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Master Kush",
    marketNames: ["Master Kush Skunk"],
    breeder: "White Label / Dutch origin",
    lineage: {
      parents: ["Hindu Kush", "Skunk #1"],
      cross: "Hindu Kush × Skunk (two landrace lines)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Earthy-citrus hash note", "Old-school Amsterdam staple"],
    curatorNote:
      "Master Kush is an Amsterdam classic — a cross of two landrace lines (Hindu Kush and Skunk) that became a coffeeshop staple for decades. The nose is earthy and rich: hashy, incense-like musk with a faint citrus and pepper edge, understated but deep. The effect is a calm, clear-bodied relaxation — heavy enough to unwind on but less couch-locking than many modern indicas, which made it a dependable all-evening smoke. It won't dazzle terp-chasers and its potency is moderate by today's standards, but its balance is the point. For an old-school, hashy kush that relaxes without flattening, Master Kush still delivers.",
    curatorQuote:
      "Hashy, incense-like musk with a faint citrus and pepper edge, understated but deep.",
    sourceConfidence: "medium",
    tagline: "Amsterdam Standard",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Master Kush — an Amsterdam coffeeshop classic, Hindu Kush crossed with Skunk, two landrace lines made into an understated staple, earthy and rich with hashy incense musk and a faint citrus and pepper edge. The scene: a dim canal-side Amsterdam interior at night, an old brass incense burner trailing smoke on a dark windowsill, narrow gabled houses and a stone bridge glowing across the black canal beyond rain-flecked glass, a small dish of dried citrus peel and peppercorns beside it. Palette of incense brown, hashy bronze, smoky charcoal and a thin warm citrus glow against canal-night black. Mood: settled, mellow, drowsy — happy calm sliding toward sleep, incense smoke coiling slow, canal water barely moving under streetlamp reflections, deep evening hush. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'MASTER KUSH' engraved around the brass incense burner's rim. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },

  // ── Modern hype / exotics ──
  {
    canonicalName: "Gary Payton",
    marketNames: ["GP", "The Glove"],
    breeder: "Cookies / Powerzzzup Genetics",
    lineage: {
      parents: ["The Y", "Snowman"],
      cross: "The Y × Snowman",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Gassy-mint funk, very frosty"],
    curatorNote:
      "Gary Payton — named for the Hall-of-Fame point guard — is a Cookies/Powerzzzup collab crossing The Y (a GSC line) with Snowman, and one of the loudest hype strains of recent years. The nose is sharp and savoury-sweet: diesel and herbal funk over a cool mint-cookie edge, more gas than candy. The effect is balanced and clear-headed — an energetic, focused euphoria over a calm body that keeps it usable through the day, unusual for something this potent. It runs strong, though, so the 'functional' label only holds at a sensible dose. As a frosty, gassy, high-test hybrid, it earned its reputation beyond the marketing.",
    curatorQuote:
      "Diesel and herbal funk over a cool mint-cookie edge, more gas than candy.",
    tagline: "Gassy social bright",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of a loud, frosty, gas-and-mint hype hybrid with sharp, focused energy. A floodlit outdoor street basketball court at electric blue-gold dusk: chrome chain-link nets, a worn backboard and rain-slick painted asphalt, charged with kinetic motion — crisp light streaks and a cool vapour rolling low across the court. Palette cool and high-contrast — minty teal and frosted white against diesel-petrol shadow and warm amber floodlight, sunset bleeding into deep dusk blue, a crystalline frosted sheen on every edge. Mood: energetic, focused and social — fast, alert and confident, a clear-headed buzz rather than a sink. Cinematic, painterly, high-contrast, premium editorial poster. Keep the lower third calmer and darker for legible overlay text. The strain name may appear baked into the scene (e.g. stencilled on the asphalt or the backboard); no overlaid captions, logos or watermarks; no people, products or cannabis leaves.",
    artFileName: "gary-payton.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Kush Mints",
    marketNames: ["Kushmints"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Bubba Kush", "Animal Mints"],
      cross: "Bubba Kush × Animal Mints",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Mint-and-coffee kush", "Parent of newer hype crosses"],
    curatorNote:
      "Kush Mints is a Seed Junky cross of Bubba Kush and Animal Mints — minty cookie sweetness welded to heavy kush, and a parent of newer hype like Jealousy and Animal Face. The nose is cool and rich: mint and cookie dough over earthy coffee kush, sweet and savoury at once. The effect is potent and balanced-leaning-indica — a euphoric head over a heavy, calming body, comfortable for late day into evening. It's very frosty and strong, the kind of strain that creeps if you keep going. For the mint-and-kush crowd it's become a modern staple.",
    curatorQuote:
      "Mint and cookie dough over earthy coffee kush, sweet and savoury at once.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cereal Milk",
    breeder: "Cookies / Powerzzzup Genetics",
    lineage: {
      parents: ["Y Life", "Snowman"],
      cross: "Y Life (GSC × Cherry Pie) × Snowman",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sweet milk-and-cereal flavour"],
    curatorNote:
      "Cereal Milk is a Cookies strain — a cross of Y Life (GSC × Cherry Pie) and Snowman — that nails the 'leftover milk in the bowl' flavour its name promises. The nose is sweet and creamy: sugary milk and berry over a light gas, smooth rather than loud. The effect is balanced and easygoing — a calm, happy lift that relaxes without flattening, suited to afternoons and low-key evenings. It's moderate and approachable for a hyped strain, more about flavour and mood than raw power. For people chasing that creamy, sweet dessert profile, Cereal Milk is a clean example.",
    curatorQuote:
      "Sugary milk and berry over a light gas, smooth rather than loud.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Oreoz",
    marketNames: ["Oreo Cookies", "Oreo"],
    lineage: {
      parents: ["Cookies and Cream", "Secret Weapon"],
      cross: "Cookies and Cream × Secret Weapon",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Chocolate-and-gas, trichome-caked"],
    curatorNote:
      "Oreoz (Oreo Cookies) is a Cookies and Cream × Secret Weapon cross — chocolate-cookie sweetness over a gassy, diesel funk, and one of the frostiest strains you'll see. The nose is rich and indulgent: chocolate, vanilla cream and a sharp fuel edge, dessert with a gas chaser. The effect is heavy and euphoric — a strong, sedating body high with a happy head, firmly an evening strain. It's very potent and trichome-caked, easy to overdo, so it carries a nightcap reputation. For lovers of chocolate-and-gas dessert indicas, Oreoz is a standout.",
    curatorQuote:
      "Chocolate, vanilla cream and a sharp fuel edge, dessert with a gas chaser.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "MAC",
    marketNames: ["MAC 1", "Miracle Alien Cookies", "Capulator's MAC"],
    breeder: "Capulator",
    lineage: {
      parents: ["Alien Cookies", "Starfighter", "Colombian"],
      cross: "Alien Cookies × (Starfighter × Colombian)",
      parentDetails: {
        Colombian: { lineageBrief: "Colombian sativa landrace", type: "sativa" },
      },
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Near-white frost", "Finicky to grow"],
    curatorNote:
      "MAC 1 — Miracle Alien Cookies, cut #1 — is Capulator's prized phenotype of Alien Cookies crossed with a Starfighter/Colombian line, famous for its frosty, almost white look. The nose is complex: creamy citrus and floral sweetness over a diesel-and-spice funk, refined rather than loud. The effect is balanced and bright — a euphoric, creative, uplifting head with a relaxed body, social and versatile. It's a notoriously finicky plant to grow, part of its connoisseur cachet and why genuine MAC 1 is prized. For a smooth, frosty, balanced hybrid, it's one of the modern greats.",
    curatorQuote:
      "Creamy citrus and floral sweetness over a diesel-and-spice funk, refined rather than loud.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Apple Fritter",
    marketNames: ["Apple Fritters"],
    breeder: "Lumpy's Flowers",
    lineage: {
      parents: ["Sour Apple", "Animal Cookies"],
      cross: "Sour Apple × Animal Cookies",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sweet pastry over cheesy gas"],
    curatorNote:
      "Apple Fritter is a Lumpy's Flowers strain — a Sour Apple × Animal Cookies cross — that became a favourite for its pastry-meets-gas profile. The nose is sweet and savoury: green apple and sugary pastry over a cheesy, gassy funk, instantly recognisable. The effect is potent and balanced-leaning-heavy — a euphoric, relaxing high that eases the body without total couch-lock at moderate doses. It's strong and frosty, the kind of hybrid that sneaks up if you push it. For the sweet-and-gas dessert lane, Apple Fritter is a deservedly popular pick.",
    curatorQuote:
      "Green apple and sugary pastry over a cheesy, gassy funk, instantly recognisable.",
    tagline: "Warm pastry sedation",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Ice Cream Cake",
    marketNames: ["ICC"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Wedding Cake", "Gelato 33"],
      cross: "Wedding Cake × Gelato 33",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cheesecake-and-cream, white frost"],
    curatorNote:
      "Ice Cream Cake is a Seed Junky cross of Wedding Cake and Gelato 33 — pure creamy dessert with a frosty, white finish. The nose is sweet and rich: vanilla, cheesecake and sweet cream over a light gas, very much a dessert profile. The effect is heavily relaxing — a warm, sedating body weight with a calm, happy head, a textbook evening and bedtime strain. It's potent and frosty, more couch than productivity, so it earns its nighttime reputation. For lovers of creamy, sweet, sit-down indicas, Ice Cream Cake is a go-to.",
    curatorQuote:
      "Vanilla, cheesecake and sweet cream over a light gas, very much a dessert profile.",
    tagline: "Sweet cream KO",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Peanut Butter Breath",
    marketNames: ["PB Breath", "PBB"],
    breeder: "ThugPug Genetics",
    lineage: {
      parents: ["Do-Si-Dos", "Mendo Breath"],
      cross: "Do-Si-Dos × Mendo Breath",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Nutty, savoury, herbal funk"],
    curatorNote:
      "Peanut Butter Breath is a ThugPug cross of Do-Si-Dos and Mendo Breath — a genuinely unusual nutty, savoury profile that lives up to its name. The nose is earthy and rich: roasted nuts and herbal funk over a sweet, hashy base, more savoury than sweet. The effect is relaxing and dreamy — a slow, calming body high with a euphoric, slightly sedating head that drifts toward rest. It's potent and creeps, so it's an evening strain rather than a daytime one. For people who want something off the candy path, its nutty character stands out.",
    curatorQuote:
      "Roasted nuts and herbal funk over a sweet, hashy base, more savoury than sweet.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemon Cherry Gelato",
    marketNames: ["LCG", "Lemon Cherry"],
    lineage: {
      parents: ["Sunset Sherbet", "Girl Scout Cookies"],
      cross: "Sunset Sherbet × GSC (cherry-citrus lean; contested)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cherry-citrus over creamy gelato", "Heavily counterfeited name"],
    curatorNote:
      "Lemon Cherry Gelato (LCG) is one of the most hyped — and most faked — names in the modern exotic scene, its parentage never cleanly documented but generally placed in the Sunset Sherbet / GSC orbit with a cherry-citrus lean. A genuine cut smells of sweet cherry and lemon zest over a creamy gelato base, with a faint gas underneath. The high is even and good-natured: an uplifting, social head that drifts into relaxed body comfort without flattening you. Because the name sells, quality swings wildly between cuts — colour, frost and a true cherry-lemon nose are the signs of the real thing. Buy it on the flower in front of you, not the label.",
    curatorQuote:
      "Sweet cherry and lemon zest over a creamy gelato base, with a faint gas underneath.",
    tagline: "Tart cherry burst",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Mochi",
    marketNames: ["Mochi Gelato", "Gelato 47"],
    breeder: "Sherbinski",
    lineage: {
      parents: ["Sunset Sherbet", "Thin Mint GSC"],
      cross: "Sunset Sherbet × Thin Mint GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy-mint Gelato sibling"],
    curatorNote:
      "Mochi (Mochi Gelato / Gelato 47) is a Sherbinski cut from the Sunset Sherbet × Thin Mint GSC line — the same parentage as Gelato, selected for a sweeter, creamier expression. The nose is dessert-forward: sweet cream, mint and berry over a light gas, smooth and inviting. The effect is balanced and relaxing — a euphoric lift that eases into comfortable body calm, good for late afternoon into evening. It's frosty and flavourful, leaning a touch indica, with the easy likability of the whole Gelato family. For the creamy-mint end of the Gelato world, Mochi is a refined pick.",
    curatorQuote:
      "Sweet cream, mint and berry over a light gas, smooth and inviting.",
    tagline: "Soft cake exotic",
    sourceConfidence: "medium",
  },

  // ── Gas / OG / diesel expansions ──
  {
    canonicalName: "King Louis XIII",
    marketNames: ["King Louis", "King Louie", "King Louie XIII"],
    lineage: {
      parents: ["OG Kush", "LA Confidential"],
      cross: "OG Kush × LA Confidential",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["One of the loudest pine-gas OG cuts"],
    curatorNote:
      "King Louis XIII (or King Louie) is a heavyweight OG — an OG Kush × LA Confidential cross that's all pine and fuel with a dark, resinous depth. The nose is intense and classic: sharp pine and gas over a damp, earthy forest floor, one of the loudest pine-OG profiles around. The effect is a fast, heavy indica — a sedating body weight that drops you into the couch and on toward sleep, firmly nighttime. It's potent and not subtle, so it's a poor daytime choice and an easy one to overdo. For pine-gas lovers who want OG at its most sedating, King Louis is a benchmark.",
    curatorQuote:
      "Sharp pine and gas over a damp, earthy forest floor, one of the loudest pine-OG profiles around.",
    tagline: "Heavy pine throne",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavyweight, sedating pine-gas OG named King Louis XIII — after the French king. An ornate baroque golden throne sitting deep in a dark, misty pine forest at night, gilded scrollwork and crimson velvet catching low candlelight; a thick pine-and-fuel haze rolls across the damp, earthy forest floor and coils around the throne, an oily petrol-rainbow shimmer threading the resinous dark. Sharp pine and gas over a damp, earthy forest floor, loud and deep. Palette regal and heavy — antique gold and crimson over deep pine-black and earthy shadow, candle-amber glow and a faint petrol shimmer in the misty haze. Mood: fast and sedating — a heavy body weight that drops into the couch and toward sleep, firmly nighttime. Cinematic, painterly, high-contrast, premium editorial poster, opulent and atmospheric. The strain name 'KING LOUIS XIII' baked into the scene — engraved into the throne's crest or a brass plaque at its base. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "king-louis-xiii.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Platinum OG",
    marketNames: ["Platinum Kush", "Platinum OG Kush"],
    lineage: {
      parents: ["Master Kush", "OG Kush"],
      cross: "Master Kush × OG Kush (contested)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Silvery 'platinum' trichome coat"],
    curatorNote:
      "Platinum OG is a frost-caked heavy indica named for the silvery sheen of its trichomes; the parentage is usually given as Master Kush crossed with OG Kush, though it's never been pinned down. The smell is old-school heavy OG — gas and damp earth with a sweet, skunky edge, dense rather than zesty. What it does is simple and reliable: a thick body sedation that arrives quickly and slides toward sleep. There's little cerebral play here — it's a wind-down, lie-down strain. For anyone who wants a frosty, gassy knockout at the end of the day, it does the job.",
    curatorQuote:
      "Gas and damp earth with a sweet, skunky edge, dense rather than zesty.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Fire OG",
    marketNames: ["Fire OG Kush"],
    lineage: {
      parents: ["OG Kush", "SFV OG"],
      cross: "OG Kush × SFV OG",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Red-haired, fiery-looking buds", "Among the most potent OG cuts"],
    curatorNote:
      "Fire OG is one of the most potent OG cuts — an OG Kush × SFV OG cross with red-haired, fiery-looking buds that earned the name. The nose is loud OG: sharp fuel and pine with a lemony, earthy bite, classic gas through and through. The effect is heavy and creeping — a euphoric head that gives way to a strong, sedating body, an evening strain that rewards patience. It's high-test even by OG standards, so it earns respect from experienced smokers and humbles new ones. For the gas crowd chasing the strong end of OG, Fire OG is a favourite.",
    curatorQuote:
      "Sharp fuel and pine with a lemony, earthy bite, classic gas through and through.",
    tagline: "Heavy gas flame",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for one of the most potent, heaviest OG gas cuts named Fire OG. A roaring orange-red flame erupting and twisting upward over a dark pine ridge at night, fed by a thick fuel haze that ignites at its edges — showers of glowing embers rising, the hot air rippling with a faint oily petrol-rainbow shimmer, pine silhouettes lit fiery against the black. Loud OG in the heat — sharp fuel and pine with a lemony, earthy bite. Palette blazing and deep — molten orange-red and ember-gold flame over diesel-black and pine shadow, a lemon-amber glow and faint petrol shimmer in the smoky haze. Mood: heavy and creeping — a euphoric head sinking into a strong, sedating body, a high-test evening strain. Cinematic, painterly, high-contrast, premium editorial poster, fiery and atmospheric. The strain name 'FIRE OG' baked into the scene — seared and glowing in the embers or branded into the ridge stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "fire-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Face Off OG",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush phenotype — a SoCal clone-only cut, stabilized by Archive Seed Bank",
    },
    marketNames: ["Face Off"],
    breeder: "Archive Seed Bank",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Pungent gas OG", "Half of Do-Si-Dos' parentage"],
    curatorNote:
      "Face Off OG is an Archive Seed Bank OG cut — a pungent, gassy OG that became important mostly as a parent (it's half of Do-Si-Dos). The nose is heavy and chemical: sharp fuel, pine and a sour, almost antiseptic funk, loud and unmistakably OG. The effect is a strong, numbing body high with a hazy, sedating head — the 'face off' name fits the heavy, blanketing feel. It's firmly an evening, sit-down strain, potent enough to flatten the unprepared. For OG purists and breeders alike, Face Off earned its reputation as a building block.",
    curatorQuote:
      "Sharp fuel, pine and a sour, almost antiseptic funk, loud and unmistakably OG.",
    tagline: "Pure gas reference",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, blanketing, pungent gas OG named Face Off OG. A surreal, dramatic figure standing in heavy evening shadow as it peels its own face away from its head — lifting the front of its face off like a soft mask and holding that removed face in its hands, and beneath it, where the face was, a second smooth mask is revealed. A thick fuel-and-pine haze coils around the figure, an oily petrol-rainbow shimmer catching the low light, sharp and antiseptic in the gassy dark. Palette dark and dramatic — diesel-black and bruised shadow with sour antiseptic green, fuel-amber rim light and a faint petrol-rainbow sheen in the haze. Mood: heavy and numbing — a hazy, sedating blanket of an evening sit-down OG. Cinematic, painterly, high-contrast, surreal, premium editorial poster. The strain name 'FACE OFF OG' baked into the scene — carved into stone or stenciled on the wall behind the figure. Keep the lower third calmer and darker for legible overlay text. No logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "face-off-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Alien OG",
    marketNames: ["Alien OG Kush", "AOG"],
    lineage: {
      parents: ["Tahoe OG", "Alien Kush"],
      cross: "Tahoe OG × Alien Kush",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Lemony-pine OG with a spacey edge"],
    curatorNote:
      "Alien OG (Alien OG Kush) is a Tahoe OG × Alien Kush cross — a heavy, crystal-coated OG with a slightly otherworldly, lemony-pine twist. The nose is classic gas with a citrus edge: fuel and pine over earthy spice, sharp and resinous. The effect is potent and balanced-leaning-heavy — a fast, dreamy cerebral lift that settles into strong body relaxation, more night than day. It's strong and a touch psychedelic at higher doses, so it's not a casual daytime smoke. For OG lovers who want a lemony, spacey edge on the usual gas, Alien OG fits.",
    curatorQuote:
      "Fuel and pine over earthy spice, sharp and resinous.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, spacey lemony-pine OG hybrid named Alien OG. A lone pine-covered hilltop at dusk beneath a vast, swirling cosmic sky — ribbons of green-gold aurora and distant wheeling stars, a soft otherworldly light hovering low over the treeline; lemon-citrus and pine scent the air with a faint fuel haze drifting through the resinous dark. Palette dreamy and deep — amber and lemon-gold dusk with pine green and a cosmic teal-violet aurora over earthy shadow, a frosted resinous sheen, fading into a wine-dark starlit sky. Mood: a fast, dreamy cerebral lift settling into strong body calm — potent, otherworldly, evening. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'ALIEN OG' baked into the scene — carved into a weathered hilltop stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "alien-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "SFV OG",
    marketNames: ["San Fernando Valley OG", "SFV OG Kush"],
    breeder: "Cali Connection",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush phenotype (SFV cut)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Defining San Fernando Valley gas profile", "Parent of Fire OG and Motorbreath"],
    curatorNote:
      "SFV OG — San Fernando Valley OG — is a Cali Connection OG Kush cut, one of the defining West Coast gas profiles and a parent of Fire OG and Motorbreath. The nose is pure SoCal OG: sharp fuel and pine with a lemony, earthy funk, clean and loud. The effect is a balanced OG high — an uplifting, focused head with a relaxing body that stays usable at moderate doses, a touch more functional than the heaviest OGs. It's potent but not purely sedating, which made it a popular all-rounder. For the classic San Fernando gas profile, SFV OG is the reference cut.",
    curatorQuote:
      "Sharp fuel and pine with a lemony, earthy funk, clean and loud.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of a clean, loud San Fernando Valley gas-OG — the SoCal reference cut. A sun-baked hillside overlooking the sprawling San Fernando Valley at golden dusk: the valley grid hazing out below, palm silhouettes and dry chaparral in the foreground, a weathered chrome-and-fuel garage / refinery edge catching the last light, pine and lemon trees glinting through a faint petrol shimmer in the warm air. Palette warm and resinous — amber and lemon-gold sun on chrome and fuel-blue shadow, pine green and dusty earth deepening into a wine-dark dusk sky. Mood: uplifted, focused and warm yet relaxed — a clean, functional energy, alert but easy, not heavy or sedated. Cinematic, painterly, high-contrast, premium editorial poster. Keep the lower third calmer and darker for legible overlay text. The strain name may appear baked into the scene (e.g. stencilled on chrome or a hillside sign); no overlaid captions, logos or watermarks; no people, products or cannabis leaves.",
    artFileName: "sfv-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Headband",
    marketNames: ["Headband OG", "707 Headband"],
    lineage: {
      parents: ["OG Kush", "Sour Diesel"],
      cross: "OG Kush × Sour Diesel",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Named for the gentle pressure around the temples"],
    curatorNote:
      "Headband is an OG Kush × Sour Diesel cross named for the gentle pressure it leaves around the temples, like a band across the forehead. The nose is gassy and sour: diesel and fuel over a lemony, earthy OG base, loud and unmistakably of the gas family. The effect is the namesake — a long-lasting, relaxing body high with a clear, slightly pressured head, balanced enough for afternoon into evening. It's potent and long-running, more of a slow-burn relaxer than a knockout. For fans of diesel-OG hybrids, Headband is a classic.",
    curatorQuote:
      "Diesel and fuel over a lemony, earthy OG base, loud and unmistakably of the gas family.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a long-running, relaxing diesel-OG hybrid named Headband — named for the gentle band of pressure it leaves around the temples. A glowing taut ring of electric light hovering in a dark, gassy void, encircling empty space where a head would be — faint concentric pressure-ripples radiating out from the band, a diesel fuel haze drifting through it shot with an oily petrol-rainbow shimmer and a lemon-amber glow. Diesel and fuel over a lemony, earthy OG base, loud and gassy. Palette dark and electric — a luminous white-gold band over diesel-black space, lemon-amber light and a faint petrol-rainbow shimmer in the haze, subtle ripples of cool blue pressure. Mood: balanced and long-lasting — a relaxing body weight under a clear, gently pressured head, afternoon into evening. Cinematic, painterly, high-contrast, premium editorial poster, atmospheric and a touch surreal. The strain name 'HEADBAND' baked into the scene — etched along the glowing band itself. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "headband.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chem 91",
    lineage: {
      parents: ["Chemdawg"],
      cross: "An original Chemdawg-line selection from the 1991 'Dog Bud' pack — parents unrecorded (the Skunk VA line)",
    },
    marketNames: ["Chemdawg 91", "Chem '91", "Chem 91 Skunk VA"],
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["The original 1991 Chemdawg phenotype"],
    curatorNote:
      "Chem 91 is one of the original Chemdawg cuts — the specific 1991 phenotype that helped found the entire Chem/diesel line. The nose is sharp and acrid: pungent diesel, sour funk and a metallic, chemical bite, the raw 'chem' smell at its source. The effect is heavy and cerebral — a fast, pressing head-rush over a weighty body, potent and a little overwhelming for the unprepared. It's loud, divisive and historically important, a connoisseur's cut more than a crowd-pleaser. For people chasing the roots of the diesel family, Chem 91 is where much of it begins.",
    curatorQuote:
      "Pungent diesel, sour funk and a metallic, chemical bite, the raw 'chem' smell at its source.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for the original, foundational 1991 chem cut named Chem 91. A weathered vintage early-1990s muscle car idling at dusk in a thick cloud of diesel exhaust, chrome bumpers and grille catching the last sour-amber light; pungent fuel haze rolls off the tailpipe and pools on wet asphalt in an oily petrol-rainbow slick, a metallic, chemical glint cutting through the gritty gloom. Raw chem at its source — pungent diesel, sour funk and a metallic bite. Palette retro and heavy — faded chrome and gunmetal over sour-amber dusk and diesel black, toxic-green exhaust haze with a petrol-rainbow shimmer on the road. Mood: heavy and cerebral — a fast, pressing head-rush over a weighty body, loud, divisive and historic. Cinematic, painterly, high-contrast, premium editorial poster, gritty and atmospheric. The strain name 'CHEM 91' baked into the scene — stamped on a worn vintage 1991 license plate or stenciled on the chrome. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "chem-91.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Motorbreath",
    marketNames: ["Motorbreath #15", "Motor Breath"],
    breeder: "Pisces Genetics",
    lineage: {
      parents: ["Chemdog D", "SFV OG"],
      cross: "Chemdog D × SFV OG Kush",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Brutally pungent fuel funk"],
    curatorNote:
      "Motorbreath is a Pisces Genetics cross of Chemdog D and SFV OG Kush — a brutally pungent gas strain whose name is the honest warning. The nose is intense: heavy diesel, fuel and a sour, almost rubbery funk over earthy OG, one of the loudest gas profiles on any shelf. The effect is strong and sedating — a heavy, relaxing body high with a dreamy head, firmly an evening strain. It's high-test and not subtle, so it's beloved by gas chasers and overwhelming to everyone else. For pure diesel-and-fuel intensity, Motorbreath is hard to beat.",
    curatorQuote:
      "Heavy diesel, fuel and a sour, almost rubbery funk over earthy OG, one of the loudest gas profiles on any shelf.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sour OG",
    marketNames: ["Sour OG Kush"],
    lineage: {
      parents: ["Sour Diesel", "OG Kush"],
      cross: "Sour Diesel × OG Kush",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sour-diesel lift over OG body"],
    curatorNote:
      "Sour OG is a Sour Diesel × OG Kush cross that blends two gas legends into one balanced hybrid. The nose is the best of both parents: sour diesel and lemon over OG's pine and earth, gassy and bright at once. The effect is even-handed — an uplifting, mood-lifting head over a relaxing body, usable across the day rather than purely sedating. It's potent but balanced, which made it a dependable all-rounder for gas lovers. For people who want Sour D's lift with OG's body, Sour OG is the natural meeting point.",
    curatorQuote:
      "Sour diesel and lemon over OG's pine and earth, gassy and bright at once.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a balanced, gassy-bright diesel-OG hybrid named Sour OG. A sun-baked West Coast pine canyon at golden hour, rugged earthy ridges and dark pines under a fierce, electric sour-lemon sun; a gassy heat-haze shimmers up off the hot rock, the air rippling with petrol-rainbow distortion and a low fuel sheen pooling in the shadowed cracks. Sour diesel and lemon ride over OG's pine and earth, bright and gassy at once. Palette electric and warm — acid sour-lemon yellow and citrus gold over deep pine green and sun-baked ochre earth, a faint petrol shimmer rippling through the heat-haze. Mood: even-handed and lively — an uplifting, mood-lifting head over a relaxing body, an all-day gas all-rounder. Cinematic, painterly, high-contrast, premium editorial poster, sun-drenched and atmospheric. The strain name 'SOUR OG' baked into the scene — carved into a sun-bleached canyon rock face or a weathered wooden trail marker. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sour-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── Kush / indica / purple classics ──
  {
    canonicalName: "LA Confidential",
    marketNames: ["LAC", "L.A. Confidential"],
    breeder: "DNA Genetics",
    lineage: {
      parents: ["OG LA Affie", "California Indica"],
      cross: "OG LA Affie × California Indica",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Clean, refined heavy indica"],
    curatorNote:
      "LA Confidential is DNA Genetics' flagship indica — an OG LA Affie × California Indica cross that won early Cannabis Cups and set a standard for clean, heavy relaxation. The nose is earthy and piney with a skunky, hashy depth, classic and understated rather than loud. The effect is a smooth, powerful body stone — deeply relaxing and a little sedating, the kind of indica people reach for to unwind or sleep. It's potent but clean, without the harshness some heavy indicas carry. For a refined, no-nonsense indica, LA Confidential remains a benchmark.",
    curatorQuote:
      "The nose is earthy and piney with a skunky, hashy depth, classic and understated rather than loud.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Kosher Kush",
    lineage: {
      parents: ["OG Kush"],
      cross: "Elite OG Kush phenotype — clone-only LA cut (second parent unknown)",
    },
    marketNames: ["Jew Gold", "Kosher OG"],
    breeder: "Reserva Privada / DNA Genetics",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Award-winning sweet, heavy OG"],
    curatorNote:
      "Kosher Kush is a Reserva Privada / DNA Genetics OG cut — an unknown-parentage OG Kush descendant that won back-to-back Cannabis Cups. The nose is rich OG with a twist: gas and pine over earthy, almost fruity sweetness, heavier and sweeter than a straight OG. The effect is strongly relaxing — a euphoric head that sinks into a heavy, sedating body, firmly an evening and sleep strain. It's potent and couch-leaning, more about deep rest than productivity. For OG lovers who want the sweeter, heavier end of the family, Kosher Kush is a decorated pick.",
    curatorQuote:
      "Gas and pine over earthy, almost fruity sweetness, heavier and sweeter than a straight OG.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blackberry Kush",
    marketNames: ["BBK", "Blackberry OG"],
    lineage: {
      parents: ["Afghani", "Blackberry"],
      cross: "Afghani × Blackberry",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Dark berry over hashy kush"],
    curatorNote:
      "Blackberry Kush is a heavy indica — usually a cross of Afghani and a Blackberry line — prized for stacking dark berry sweetness on a hashy kush base. The nose is rich and fruity: sweet blackberry and grape over earthy, diesel-tinged hash, dessert with a savoury backbone. The effect is fast and sedating — a thick, relaxing body weight that tips quickly toward sleep, a textbook nightcap. It's potent and couch-leaning, more for evenings and rest than anything active. For berry-and-hash indica lovers, Blackberry Kush is a sweet, heavy classic.",
    curatorQuote:
      "Sweet blackberry and grape over earthy, diesel-tinged hash, dessert with a savoury backbone.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Purple Urkle",
    marketNames: ["Purple Urkel", "Urkle"],
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Mendocino purple selection", "A parent of Granddaddy Purple"],
    curatorNote:
      "Purple Urkle is a Northern California grape classic whose exact origins were never written down — most trace it to a Mendocino Purps selection — and it matters as much for its descendants (it's a parent of Granddaddy Purple) as for itself. The nose is the blueprint for 'purple': deep grape and dark berry over a skunky, earthy base. Expect a warm, dreamy heaviness that quiets the mind and settles into the limbs, drifting toward sleep. It's an evening indica through and through, more about letting go than getting anything done. A foundational grape strain that still shows up in countless modern crosses.",
    curatorQuote:
      "Deep grape and dark berry over a skunky, earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "9 Pound Hammer",
    marketNames: ["Nine Pound Hammer", "9LB Hammer"],
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["Gooberry", "Hells OG", "Jack the Ripper"],
      cross: "Gooberry × Hells OG × Jack the Ripper",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Fast, grape-sweet knockout"],
    curatorNote:
      "9 Pound Hammer is a TGA/Subcool cross — Gooberry × Hells OG × Jack the Ripper — built for fast, heavy, grape-sweet sedation. The nose is fruity and earthy: sweet grape and berry over a damp, earthy base, dessert-leaning. The effect is exactly the name — a fast, heavy body blow that drops you toward the couch and sleep, with little cerebral lift. It's a blunt instrument, potent and sedating, made for evenings, pain and insomnia rather than productivity. For people who want grape-sweet knockout, 9 Pound Hammer earns its name.",
    curatorQuote:
      "Sweet grape and berry over a damp, earthy base, dessert-leaning.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Slurricane",
    marketNames: ["Slurricane #7"],
    breeder: "In House Genetics",
    lineage: {
      parents: ["Do-Si-Dos", "Purple Punch"],
      cross: "Do-Si-Dos × Purple Punch",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Grape-and-cream heavy indica"],
    curatorNote:
      "Slurricane is an In House Genetics cross of Do-Si-Dos and Purple Punch — a sweet, heavy indica that became a quiet modern favourite. The nose is rich and fruity: grape, berry and sweet cream over a gassy, earthy funk, dessert with weight behind it. The effect is strongly relaxing — a warm, euphoric calm that sinks into the body and lingers, an evening and end-of-day strain. It's potent and frosty, leaning sedating, easy to over-enjoy because of the sweetness. For lovers of grape-and-cream heavy indicas, Slurricane delivers.",
    curatorQuote:
      "Grape, berry and sweet cream over a gassy, earthy funk, dessert with weight behind it.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Berry White",
    marketNames: ["Berrywhite"],
    lineage: {
      parents: ["Blueberry", "White Widow"],
      cross: "Blueberry × White Widow",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet berry over White Widow resin"],
    curatorNote:
      "Berry White is a Blueberry × White Widow cross — named with a wink at Barry White — that blends sweet berry with resin-heavy potency. The nose is sweet and fruity: ripe blueberry and berry over a faint earthy, skunky base, smooth and inviting. The effect is relaxing and happy — a euphoric, calming body high that eases tension without total knockout at moderate doses. It's potent and balanced-leaning-indica, comfortable for late day into evening. For berry lovers who want some White Widow backbone, Berry White is a sweet, easy pick.",
    curatorQuote:
      "Ripe blueberry and berry over a faint earthy, skunky base, smooth and inviting.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry Punch",
    breeder: "Symbiotic Genetics",
    lineage: {
      parents: ["Cherry AK-47", "Purple Punch"],
      cross: "Cherry AK-47 × Purple Punch (F2)",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Bright cherry-candy sweetness"],
    curatorNote:
      "Cherry Punch is a Symbiotic Genetics cross of Cherry AK-47 and Purple Punch — the cherry is the whole pitch. The nose is bright cherry and berry over a soft floral, earthy base, sweet and clean rather than gassy. The high is even-handed: a cheerful mood-lift with enough relaxation to take the edge off, without much sedation at a sensible dose. It's an approachable, flavour-driven hybrid rather than a heavyweight. For a sweet cherry profile in a balanced package, it's an easy yes.",
    curatorQuote:
      "The nose is bright cherry and berry over a soft floral, earthy base, sweet and clean rather than gassy.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hash Plant",
    marketNames: ["Hashplant"],
    lineage: {
      parents: ["Northern Lights", "Afghani"],
      cross: "Northern Lights × Afghani hash-plant line",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Resin-heavy traditional hash plant"],
    curatorNote:
      "Hash Plant is an old-school indica — a Northern Lights × Afghani hash-plant line — bred specifically for resin and that classic hashish character. The nose is earthy and sweet: incense, sandalwood and a spicy, hashy musk, deep and traditional. The effect is calm and weighty — a relaxing, grounding body stone without much racing thought, dependable rather than flashy. It's a resin-heavy, moderate-potency classic, prized for flavour and for making hash. For lovers of traditional, hashy indica, Hash Plant is a quiet staple.",
    curatorQuote:
      "Incense, sandalwood and a spicy, hashy musk, deep and traditional.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Critical Mass",
    marketNames: ["Critical"],
    lineage: {
      parents: ["Afghani", "Skunk #1"],
      cross: "Afghani × Skunk #1",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Dense, branch-snapping yields"],
    curatorNote:
      "Critical Mass is an Afghani × Skunk #1 cross — named for buds so dense and heavy they can snap their own branches. The nose is sweet and earthy: skunky, honey-ish sweetness over a damp earthy base, classic and mellow. The effect is heavily relaxing — a calm, sedating body high that eases tension and tips toward sleep, a straightforward evening indica. It's a big-yielding, moderate-to-strong indica, more about comfort than complexity. For dependable, sweet, heavy relaxation, Critical Mass is a reliable pick.",
    curatorQuote:
      "Skunky, honey-ish sweetness over a damp earthy base, classic and mellow.",
    sourceConfidence: "medium",
  },

  // ── Gelato / cake / dessert expansions ──
  {
    canonicalName: "Gelato 33",
    marketNames: ["Gelato #33", "Larry Bird"],
    breeder: "Cookies Fam / Sherbinski",
    lineage: {
      parents: ["Sunset Sherbet", "Thin Mint GSC"],
      cross: "Sunset Sherbet × Thin Mint GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["The original prized Gelato pheno"],
    curatorNote:
      "Gelato 33 — the 'Larry Bird' pheno — is the original prized cut of Gelato, a Sunset Sherbet × Thin Mint GSC selection from the Cookies/Sherbinski camp. The nose is the Gelato benchmark: sweet sherbet and cream with a citrus-berry twist over a low note of gas, balanced and inviting. The effect is the reason it parents half the menu — a bright, euphoric, social lift that settles into easy body relaxation without knocking you out. It's frosty, flavourful and remarkably well-rounded, equally at home in the afternoon or evening. As the cut that defined modern Gelato, #33 is the reference everything else chases.",
    curatorQuote:
      "Sweet sherbet and cream with a citrus-berry twist over a low note of gas, balanced and inviting.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet, frosty, well-rounded dessert hybrid named Gelato 33 — the benchmark gelato cut. Lush artisan gelato scoops heaped in a chilled case at golden hour, sherbet pinks and creamy violets swirled with citrus-orange and berry-purple, a frosted icy sheen sweating off the cold scoops, a soft drip catching warm sunset light. The air is sweet and creamy: sherbet and cream with a citrus-berry twist over a faint cool sweetness. Palette luscious and inviting — pastel sherbet pink, cream and violet with bright citrus-orange and berry pops, a frosty silver sheen under a warm amber-gold sunset glow. Mood: bright and social settling into easy relaxation — euphoric, balanced, frosty and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'GELATO 33' baked into the scene — hand-lettered on a gelateria chalkboard sign or stamped on a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gelato-33.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "high",
  },
  {
    canonicalName: "Gelato 41",
    marketNames: ["Gelato #41", "Bacio (sibling)"],
    breeder: "Cookies Fam / Sherbinski",
    lineage: {
      parents: ["Sunset Sherbet", "Thin Mint GSC"],
      cross: "Sunset Sherbet × Thin Mint GSC (gassier pheno)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Gassier Gelato sibling", "Parent of Jealousy"],
    curatorNote:
      "Gelato 41 is a sibling cut from the same Sunset Sherbet × Thin Mint GSC line as Gelato 33 — gassier and a touch heavier, and the parent of hype strains like Jealousy. The nose leans more fuel than its sweeter sibling: sherbet and creamy sweetness over a pronounced gassy funk. The effect is balanced-leaning-relaxed — a euphoric head over comfortable body weight, a little more sedating than #33. It's frosty and potent, a favourite base for breeders chasing gas-and-dessert crosses. For Gelato lovers who want more gas in the mix, 41 is the pick.",
    curatorQuote:
      "Sherbet and creamy sweetness over a pronounced gassy funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Birthday Cake",
    marketNames: ["Birthday Cake Kush", "BDC"],
    lineage: {
      parents: ["Girl Scout Cookies", "Cherry Pie"],
      cross: "GSC × Cherry Pie",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Vanilla cake-batter sweetness"],
    curatorNote:
      "Birthday Cake (Birthday Cake Kush) is a GSC × Cherry Pie cross — sweet, doughy and a little fruity, an easygoing dessert hybrid. The nose is sweet and vanilla-forward: cake batter and a hint of cherry over a soft earthy base, dessert without much gas. The effect is relaxing and happy — a calm, mood-lifting body ease that suits unwinding rather than productivity. It's moderate and approachable, more comfort than knockout at sensible doses. For people who want a gentle, sweet, vanilla-cake profile, Birthday Cake fits.",
    curatorQuote:
      "Cake batter and a hint of cherry over a soft earthy base, dessert without much gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gelato Cake",
    lineage: {
      parents: ["Wedding Cake", "Gelato 33"],
      cross: "Wedding Cake × Gelato 33",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy, gassy dessert indica"],
    curatorNote:
      "Gelato Cake is a cross of Wedding Cake and Gelato 33 — two dessert heavyweights folded into one frosty, creamy indica-leaning hybrid. The nose is rich and sweet: vanilla cake and cream over a gassy, earthy funk, dessert with weight. The effect is relaxing and euphoric — a warm, happy calm that settles into the body, an evening-leaning strain. It's potent and frosty, comfortable rather than racy, easy to enjoy too much. For lovers of creamy, gassy dessert indicas, Gelato Cake is a natural pick.",
    curatorQuote:
      "Vanilla cake and cream over a gassy, earthy funk, dessert with weight.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "LA Kush Cake",
    marketNames: ["Kush Cake", "LA Kush Cake #11"],
    lineage: {
      parents: ["Kush Mints", "Wedding Cake"],
      cross: "Kush Mints × Wedding Cake",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Minty-vanilla over heavy gas"],
    curatorNote:
      "LA Kush Cake is a Kush Mints × Wedding Cake cross — minty, gassy cookie sweetness on a heavy frame. The nose is cool and rich: mint, vanilla and cookie dough over an earthy gas, sweet and savoury at once. The effect is strongly relaxing — a euphoric head sinking into a heavy, calming body, firmly evening territory. It's potent and frosty, leaning sedating, a satisfying nightcap. For the mint-and-cake corner of the dessert world, LA Kush Cake is a rich, heavy option.",
    curatorQuote:
      "Mint, vanilla and cookie dough over an earthy gas, sweet and savoury at once.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "London Pound Cake",
    marketNames: ["London Poundcake 75", "LPC"],
    breeder: "Cookies",
    lineage: {
      parents: ["Sunset Sherbet"],
      cross: "Sunset Sherbet × undisclosed (Cookies line)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Dark berry, gassy dessert"],
    curatorNote:
      "London Pound Cake (London Poundcake 75) is a Cookies strain from the Sunset Sherbet line — dark, berry-forward and gassy, one of the moodier dessert profiles. The nose is rich and a little tart: grape and dark berry over a lemony, gassy funk, sweet but not candy. The effect is relaxing and euphoric — a calming body high with a happy head, an afternoon-into-evening strain. It's potent and frosty, balanced-leaning-indica, satisfying for flavour chasers. For people who like their dessert dark and gassy rather than sugary, London Pound Cake delivers.",
    curatorQuote:
      "Grape and dark berry over a lemony, gassy funk, sweet but not candy.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lava Cake",
    marketNames: ["Lava Cake #11"],
    lineage: {
      parents: ["Grape Pie", "Thin Mint GSC"],
      cross: "Grape Pie × Thin Mint GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Chocolate-and-berry dessert indica"],
    curatorNote:
      "Lava Cake is a Grape Pie × Thin Mint GSC cross — a sweet, chocolatey dessert indica with a frosty finish. The nose is rich and sweet: chocolate, berry and mint over an earthy, doughy base, indulgent and dessert-forward. The effect is relaxing and calming — a warm body ease with a gentle euphoric head, an evening strain more than a productive one. It's potent and comfortable, leaning sedating without being a total knockout. For lovers of chocolate-and-berry dessert indicas, Lava Cake is a cosy pick.",
    curatorQuote:
      "Chocolate, berry and mint over an earthy, doughy base, indulgent and dessert-forward.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sundae Driver",
    marketNames: ["Sunday Driver"],
    breeder: "Cannarado Genetics",
    lineage: {
      parents: ["Fruity Pebbles OG", "Grape Pie"],
      cross: "Fruity Pebbles OG × Grape Pie",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Smooth, creamy breeding parent"],
    curatorNote:
      "Sundae Driver is a Cannarado cross of Fruity Pebbles OG and Grape Pie — a smooth, creamy hybrid that became a popular breeding parent. The nose is sweet and creamy: sugary fruit and grape over a light gas, dessert-leaning and smooth. The effect is balanced and mellow — a calm, contented body ease with a clear-enough head, comfortable across the day. It's gentle and flavour-driven, more about smoothness and mood than raw power. For people who want a creamy, easygoing dessert hybrid, Sundae Driver is a reliable choice.",
    curatorQuote:
      "Sugary fruit and grape over a light gas, dessert-leaning and smooth.",
    tagline: "Smooth sweet ride",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grease Monkey",
    marketNames: ["Grease Monkey OG"],
    breeder: "Exotic Genetix",
    lineage: {
      parents: ["GG4", "Cookies and Cream"],
      cross: "Gorilla Glue #4 × Cookies and Cream",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Gassy glue funk over sweet, nutty cookie"],
    curatorNote:
      "Grease Monkey is an Exotic Genetix cross of GG4 (Gorilla Glue) and Cookies and Cream — gassy glue funk meets sweet, nutty cookie. The nose is heavy and rich: diesel and skunk over sweet vanilla and nut, gas with a dessert chaser. The effect is strongly relaxing — a euphoric head that sinks into a heavy, sedating body, firmly evening territory. It's potent and couch-leaning, the kind of strain that ends the night. For lovers of gas-and-dessert heavy hybrids, Grease Monkey is a satisfying, sleepy pick.",
    curatorQuote:
      "Diesel and skunk over sweet vanilla and nut, gas with a dessert chaser.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Jealousy",
    marketNames: ["Jealousy Cake (sibling)"],
    breeder: "Seed Junky / Powerzzzup",
    lineage: {
      parents: ["Gelato 41", "Sherbet"],
      cross: "Gelato 41 × Sherbet",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Frosty gas-and-sherbet 'strain of the year'"],
    curatorNote:
      "Jealousy is a hype-era cross of Gelato 41 and Sherbet (a Seed Junky/Powerzzzup line) that topped 'strain of the year' lists — frosty, gassy and sweet. The nose is rich and complex: creamy sherbet and sweet fruit over a sharp, gassy funk, candy with a fuel edge. The effect is balanced and euphoric — an uplifting, sociable head over a relaxed body, versatile across the day. It's potent and very frosty, a flavour-forward modern exotic. For people chasing the current Gelato-gas hype done well, Jealousy is a standout.",
    curatorQuote:
      "Creamy sherbet and sweet fruit over a sharp, gassy funk, candy with a fuel edge.",
    tagline: "Pure exotic perfume",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, gassy-sweet 'strain of the year' exotic named Jealousy — playing on 'green with envy.' An ornate, faceted emerald-green perfume bottle glowing on a dark opulent surface, exotic emerald vapor swirling up from its stopper in lavish ribbons — the green smoke glittering with a frosty trichome sparkle and laced with an oily petrol-rainbow shimmer, sweet fruit and candy notes hanging in the rich air with a sharp gassy edge. Creamy sherbet and sweet fruit over a sharp, gassy funk. Palette luxe and envious — deep emerald and jewel-green with frosted silver sparkle, an oily petrol-rainbow sheen and gold accents over a dark, opulent shadow. Mood: balanced and euphoric — an uplifting, sociable head over a relaxed body, lavish and flavour-forward. Cinematic, painterly, high-contrast, premium editorial poster, opulent and atmospheric. The strain name 'JEALOUSY' baked into the scene — embossed on the perfume bottle or a gold plaque at its base. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "jealousy.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── Fruity / tropical ──
  {
    canonicalName: "Pineapple Express",
    marketNames: ["Pineapple"],
    lineage: {
      parents: ["Trainwreck", "Hawaiian"],
      cross: "Trainwreck × Hawaiian",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Bright pineapple over a piney base"],
    curatorNote:
      "Pineapple Express earned its fame from the 2008 movie, but the strain is a real Trainwreck × Hawaiian cross — bright tropical fruit on a sativa-leaning frame. The nose is exactly the name: ripe pineapple and tropical fruit over a piney, earthy base, sweet and lively. The effect is uplifting and energetic — a happy, talkative, mildly buzzy head with enough body to stay comfortable, a daytime and social strain. It's approachable and flavour-forward, not overwhelming, which is part of why it's so widely known. For an easy, juicy tropical sativa, Pineapple Express lives up to the hype.",
    curatorQuote:
      "Ripe pineapple and tropical fruit over a piney, earthy base, sweet and lively.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mimosa",
    marketNames: ["Mimosa Orange Punch"],
    breeder: "Symbiotic Genetics",
    lineage: {
      parents: ["Clementine", "Purple Punch"],
      cross: "Clementine × Purple Punch",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Citrus-forward daytime hybrid"],
    curatorNote:
      "Mimosa is a Symbiotic Genetics cross of Clementine and Purple Punch — a brunch-cocktail name for a bright, citrus-forward hybrid. The nose is sweet and zesty: orange and tangerine over a berry-sweet base, juicy and clean. The effect is uplifting and energetic — a happy, motivating head that suits mornings and daytime, sativa-leaning but not racy. It's flavour-driven and sociable, a popular wake-and-bake pick. For people who want citrus brightness with a gentle lift, Mimosa is a daytime favourite.",
    curatorQuote:
      "Orange and tangerine over a berry-sweet base, juicy and clean.",
    sourceConfidence: "medium",
    tagline: "Bright Brunch Buzz",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Mimosa, the Symbiotic Genetics Clementine × Purple Punch hybrid, a bright, citrus-forward brunch cocktail of orange and sparkling sweetness. Scene: a sunlit brunch table with a tall champagne flute of mimosa, ribbons of bubbles rising through orange juice, fresh clementines and a faint dusk of berry-purple in the background florals, dappled morning light on white linen. Palette and light: radiant orange and tangerine over sparkling champagne-gold, accented with soft berry-purple and clean fizzing whites; bright golden morning daytime light streaming low and warm. Mood and motion: uplifted, energetic and happy lift, bubbles streaming upward and juice glinting, the fresh optimism of a bright morning. Cinematic, painterly, high-contrast, premium editorial poster. The name MIMOSA etched elegantly into the frosted glass of the champagne flute. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Strawberry Banana",
    marketNames: ["Strawnana", "Strawberry Banana Kush"],
    breeder: "Crockett Family Farms",
    lineage: {
      parents: ["Banana Kush", "Strawberry Bubble Gum"],
      cross: "Banana Kush × Strawberry Bubble Gum",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Genuinely fruity, resin-heavy"],
    curatorNote:
      "Strawberry Banana (Strawnana) is a Crockett Family cross — Banana Kush × a Strawberry Bubble Gum line — known for genuinely fruity flavour and heavy resin. The nose is sweet and ripe: strawberry and banana candy over a light earthy base, dessert-fruity and smooth. The effect is relaxing and happy — a euphoric, calming body high that leans indica without total couch-lock at moderate doses. It's potent and frosty, easy to enjoy for its flavour alone. For lovers of sweet, fruity, relaxing hybrids, Strawberry Banana is a tasty staple.",
    curatorQuote:
      "Strawberry and banana candy over a light earthy base, dessert-fruity and smooth.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet, fruity, relaxing indica-leaning hybrid named Strawberry Banana. Ripe strawberries and golden bananas heaped together on warm honeyed wood at late-afternoon golden hour — glistening red berries beaded with juice beside peeled, glossy banana, a soft sugared frost dusting their skins like trichomes, a slow drift of sweet candy steam in the warm light. The air is ripe and dessert-sweet: strawberry and banana candy over a light, soft earthy base. Palette warm and luscious — strawberry red and creamy banana yellow over honey-gold light and soft earthy brown, with a frosted sugary sheen and a mellow amber glow. Mood: relaxing and happy — a euphoric, calming body ease, smooth and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'STRAWBERRY BANANA' baked into the scene — branded into the wooden board or a small enamel fruit-crate tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "strawberry-banana.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Banana Kush",
    marketNames: ["Banana"],
    lineage: {
      parents: ["Ghost OG", "Skunk Haze"],
      cross: "Ghost OG × Skunk Haze",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Creamy banana over a kush base"],
    curatorNote:
      "Banana Kush is a West Coast cross — usually Ghost OG × Skunk Haze — built around a creamy banana sweetness on a kush base. The nose is its signature: ripe banana and tropical sweetness over an earthy, skunky kush, smooth and dessert-like. The effect is relaxing and mellow — a calm, happy body ease with a clear-enough head, comfortable for afternoon into evening. It's moderate and approachable, more about flavour and chill than raw power. For a creamy, banana-sweet, easygoing strain, Banana Kush is a reliable pick.",
    curatorQuote:
      "Ripe banana and tropical sweetness over an earthy, skunky kush, smooth and dessert-like.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Papaya",
    marketNames: ["Papaya Punch (sibling)", "Nirvana Papaya"],
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["Citral", "Ice"],
      cross: "Citral #13 × Ice #2",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Soft tropical-fruit indica"],
    curatorNote:
      "Papaya (Nirvana's Papaya) is an indica-leaning cross of Citral and Ice — named for its tropical, fruity nose. The nose is sweet and tropical: ripe papaya and mango over an earthy, peppery base, fruity but not candy. The effect is relaxing and calming — a mellow, contented body ease that eases tension and leans toward the couch in larger doses. It's moderate and comfortable, an unwind-and-relax strain more than a productive one. For people who want a soft tropical-fruit indica, Papaya is a gentle choice.",
    curatorQuote:
      "Ripe papaya and mango over an earthy, peppery base, fruity but not candy.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a soft, relaxing tropical-fruit indica named Papaya. A ripe papaya sliced open to reveal glistening deep-orange flesh and a cluster of dark seeds, a ripe mango resting beside it, juice beading on the cut fruit in warm tropical golden-hour light, soft palm shadows and a gentle haze in the background. Ripe papaya and mango over an earthy, peppery base, fruity but not candy. Palette warm and tropical — deep papaya orange and mango gold with soft green and earthy brown, a juicy sheen under a honeyed golden glow. Mood: relaxing and calming — a mellow, contented body ease, soft and unwinding. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'PAPAYA' baked into the scene — branded into a wooden board or a small enamel fruit tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "papaya.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Forbidden Fruit",
    marketNames: ["Forbidden Fruit Cherry Pie"],
    lineage: {
      parents: ["Cherry Pie", "Tangie"],
      cross: "Cherry Pie × Tangie",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Dark cherry meets bright citrus", "Frosty, dark buds"],
    curatorNote:
      "Forbidden Fruit is a Cherry Pie × Tangie cross — dark cherry meeting bright citrus in one of the more striking fruit profiles around. The nose is rich and layered: cherry, tangerine and tropical fruit over a piney, earthy base, sweet and complex. The effect is relaxing and euphoric — a happy head sinking into a calming body, an afternoon-into-evening strain that leans indica. It's potent and flavour-forward, beautiful to look at with its dark, frosty buds. For people who want cherry-and-citrus depth in a relaxing hybrid, Forbidden Fruit stands out.",
    curatorQuote:
      "Cherry, tangerine and tropical fruit over a piney, earthy base, sweet and complex.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tropicana Cookies",
    marketNames: ["Tropicanna Cookies", "Trop Cookies"],
    breeder: "Oni Seed Co.",
    lineage: {
      parents: ["Girl Scout Cookies", "Tangie"],
      cross: "GSC × Tangie",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Orange citrus over a cookie base"],
    curatorNote:
      "Tropicana Cookies is an Oni Seed Co cross of GSC and Tangie — cookie richness folded into bright orange citrus. The nose is vivid and sweet: orange and tangerine over a creamy cookie base, juicy with a dessert backbone. The effect is uplifting and energetic — a happy, motivating head with a light body, sativa-leaning and daytime-friendly. It's flavour-forward and lively, a favourite for citrus chasers. For people who want orange brightness with cookie depth, Tropicana Cookies is a standout sativa-leaning hybrid.",
    curatorQuote:
      "Orange and tangerine over a creamy cookie base, juicy with a dessert backbone.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Orange Creamsicle",
    marketNames: ["Creamsicle", "Orange Creamsickle"],
    breeder: "MTG Seeds",
    lineage: {
      parents: ["Orange Crush", "Juicy Fruit"],
      cross: "Orange Crush × Juicy Fruit",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Orange-and-vanilla cream"],
    curatorNote:
      "Orange Creamsicle is an MTG Seeds cross of Orange Crush and Juicy Fruit, and in a good cut it nails the frozen-treat flavour it's named for — bright orange over a vanilla-cream sweetness. The high is light and good-humoured: an easy mood-lift with a relaxed, unhurried body, fine for daytime. It's a flavour-first strain — the appeal is the citrus-and-cream nose more than any heavy punch. Sativa-leaning and polished, it has become a connoisseur citrus pick. For a dessert-citrus that actually tastes like the namesake, it's reliable and approachable.",
    curatorQuote:
      "Bright orange over a vanilla-cream sweetness — the frozen-treat flavour made real.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mango Kush",
    marketNames: ["Mango"],
    lineage: {
      parents: ["Mango", "Hindu Kush"],
      cross: "Mango × Hindu Kush",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Ripe mango on a kush frame", "Late-2000s West Coast cross, widely propagated"],
    curatorNote:
      "Mango Kush pairs a fragrant Mango cut with classic Hindu Kush — a late-2000s West-Coast cross that's since been propagated by so many growers that attribution runs murky. The draw is the nose — ripe mango and tropical fruit sitting over an earthy, piney kush base, sweet with a savoury undertone. The effect is gentle and physical: a calm, contented body ease that slides toward sleepy and hungry if you push the dose. It's a moderate, easygoing strain built around flavour rather than potency. For mango sweetness on a soft kush frame, it's an unfussy, likeable pick.",
    curatorQuote:
      "Ripe mango and tropical fruit sitting over an earthy, piney kush base, sweet with a savoury undertone.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Melonade",
    lineage: {
      parents: ["Watermelon Zkittlez", "Lemon Tree"],
      cross: "Watermelon Zkittlez × Lemon Tree",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Watermelon-and-lemon summer hybrid"],
    curatorNote:
      "Melonade is a Cannarado cross of Watermelon Zkittlez and Lemon Tree, and it tastes exactly like that pairing reads — ripe watermelon candy splashed with sharp lemon. The nose is bright, juicy and clean, with almost none of the funk you'd get from a gassy hybrid. The high leans sativa: a lively, talkative lift that keeps the body comfortable and the head light, ideal for daytime. It's a summer strain through and through, bought for refreshment more than for weight. For sweet melon-and-citrus with an easy lift, it's a standout.",
    curatorQuote:
      "The nose is bright, juicy and clean, with almost none of the funk you'd get from a gassy hybrid.",
    sourceConfidence: "medium",
    tagline: "Watermelon Lemon Splash",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Melonade, the Cannarado Watermelon Zkittlez × Lemon Tree sativa, a juicy, candy-bright cross of ripe watermelon and sharp lemonade. Scene: a sun-soaked summer scene of split ripe watermelon dripping with juice beside a frosted pitcher of lemonade, lemon slices and melon balls glistening, droplets and a playful splash frozen mid-air. Palette and light: vivid watermelon-pink and crimson with juicy melon-green rind, splashed against zesty lemon-yellow and sparkling clear-glass highlights; brilliant summer daytime sun making every droplet glow. Mood and motion: uplifted, energetic and happy buzz, juice splashing and bubbles rising, the joyful brightness of a hot summer day. Cinematic, painterly, high-contrast, premium editorial poster. The name MELONADE painted in bold juicy lettering across the wet melon rind. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },

  // ── Haze / sativa classics ──
  {
    canonicalName: "Amnesia Haze",
    lineage: {
      parents: ["Afghani Hawaiian", "Laos", "Jamaica"],
      cross: "Afghani Hawaiian × Laos × Jamaica (Soma Seeds Haze line)",
      parentDetails: {
        "Afghani Hawaiian": { lineageBrief: "Afghani × Hawaiian", type: "hybrid" },
        Laos: { lineageBrief: "Laotian sativa landrace", type: "sativa" },
        Jamaica: { lineageBrief: "Jamaican sativa landrace", type: "sativa" },
      },
    },
    marketNames: ["Amnesia"],
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Citrus-forward Cup-winning haze"],
    curatorNote:
      "Amnesia Haze is a Cup-winning sativa — a haze-heavy blend of landrace genetics (Jamaican, South Asian and Haze lines) popular across Amsterdam coffeeshops. The nose is bright and complex: lemon and citrus over an earthy, spicy haze, clean and energetic. The effect is a strong, soaring cerebral high — uplifting, euphoric and energetic, a classic daytime and creative sativa. Like most big hazes it can run racy or heady at high doses, so it's not for the easily anxious. For people who want a bright, potent, long-running sativa lift, Amnesia Haze is a benchmark.",
    curatorQuote:
      "Lemon and citrus over an earthy, spicy haze, clean and energetic.",
    sourceConfidence: "medium",
    tagline: "Amsterdam Haze",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Amnesia Haze, a Cup-winning haze-heavy sativa blending Jamaican, South Asian and Haze landrace lines and beloved across Amsterdam coffeeshops. A canal-side Amsterdam morning: narrow leaning gabled brick townhouses reflected in a still canal, an arched stone bridge, a moored bicycle against iron railings and warm citrus-incense haze drifting low over the water. Palette of bright lemon-citrus yellow, warm brick reds, earthy spicy browns and herbal green-grey haze drawn from the citrus-earthy-spicy-herbal profile. The mood is uplifted, happy, energetic and euphoric, haze and canal mist curling slowly upward between the houses, lit by soft bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name AMNESIA HAZE is stencilled across the wooden hull of a small canal boat moored in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Super Silver Haze",
    marketNames: ["SSH"],
    breeder: "Green House Seed Co.",
    lineage: {
      parents: ["Skunk #1", "Northern Lights", "Haze"],
      cross: "Skunk × Northern Lights × Haze",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Three-time Cup winner", "Parent of Super Lemon Haze"],
    curatorNote:
      "Super Silver Haze is a Green House classic — a Skunk × Northern Lights × Haze blend that won three straight Cannabis Cups in the late 90s. The nose is bright and skunky-sweet: lemon and citrus over a spicy, herbal haze, clean and lively. The effect is energetic and uplifting — a long-lasting, creative, talkative head-high with a light body, a daytime sativa staple. It's potent and motivating, the kind of strain for getting things done rather than winding down. As a foundational modern haze and parent of Super Lemon Haze, SSH is a reference sativa.",
    curatorQuote:
      "Lemon and citrus over a spicy, herbal haze, clean and lively.",
    sourceConfidence: "high",
    tagline: "Three-Time Champion",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Super Silver Haze, the Green House three-time Cup champion, an electric Amsterdam classic glittering with silvery frost. The scene is a tarnished silver trophy cup on a dark velvet plinth, its surface frosted with a crystalline silver shimmer, lemon-peel slivers and a faint skunky-spiced haze drifting around it under a single dramatic spotlight. The palette is cold silver and frosted platinum over deep charcoal, sparked by lemon-citrus gold and a spicy herbal green glow, lit by sharp electric highlights and silvery resin sheen. The mood is uplifted, energetic, focused and euphoric, charged and lively with a frosted electric crackle, set in bright clear daytime light breaking the shadows. Cinematic, painterly, high-contrast, premium editorial poster. The name SUPER SILVER HAZE is embossed across the face of the silver trophy cup. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Ghost Train Haze",
    marketNames: ["GTH"],
    breeder: "Rare Dankness",
    lineage: {
      parents: ["Ghost OG", "Nevil's Wreck"],
      cross: "Ghost OG × Nevil's Wreck",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["One of the most potent sativas tested", "Not a beginner's strain"],
    curatorNote:
      "Ghost Train Haze is a Rare Dankness powerhouse — a Ghost OG × Nevil's Wreck cross — famous for being one of the most potent sativas ever tested. The nose is sharp and floral: citrus and pine over an incense-like, slightly sour haze, clean and intense. The effect is a fast, soaring cerebral rush — euphoric, energetic and sometimes overwhelming, definitely not a beginner's sativa. Its potency is the whole story: too much tips quickly into racy or anxious territory. For experienced sativa lovers chasing maximum head-energy, Ghost Train Haze is the deep end.",
    curatorQuote:
      "Citrus and pine over an incense-like, slightly sour haze, clean and intense.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Green Crack",
    marketNames: ["Green Cush", "Cush", "Mango Crack"],
    lineage: {
      parents: ["Skunk #1"],
      cross: "Skunk #1 descendant",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Pure daytime energiser", "Mango-citrus tang"],
    curatorNote:
      "Green Crack — a name Snoop Dogg is said to have coined — is a Skunk #1 descendant prized as a pure daytime energiser (some sellers soften it to 'Green Cush'). The nose is bright and tangy: sharp mango and citrus over a skunky, earthy base, clean and zesty. The effect is exactly the reputation — a sharp, energetic, focused buzz with little body, the closest thing to a cannabis espresso. It can run jittery if you're sensitive or overdo it, and it's a poor choice near bedtime. For a clean, motivating, get-up-and-go sativa, Green Crack is a go-to.",
    curatorQuote:
      "Sharp mango and citrus over a skunky, earthy base, clean and zesty.",
    sourceConfidence: "medium",
    tagline: "Pure daytime jolt",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Green Crack — a Skunk #1 descendant famous as a pure daytime energiser, sharp, zesty and relentlessly awake. A sun-flooded citrus-and-mango grove at first light: dew-bright orange and lime trees heavy with fruit beside a split ripe mango on a weathered wooden crate, a low golden sunrise cutting hard through a fresh skunky-earthy haze, everything sharp-edged and electric. Palette of acid lime-green, bright tangerine and mango-gold over dewy leaf-green and a faint earthy-skunk shadow, high-key and zesty. Mood: wired, restless, exhilarated — a sharp energetic head-high and clean focus, leaves trembling in a crisp morning breeze, motion and brightness everywhere. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GREEN CRACK' stencilled onto the side of the wooden fruit crate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Trainwreck",
    marketNames: ["'Wreck"],
    lineage: {
      parents: ["Mexican", "Thai", "Afghani"],
      cross: "Mexican × Thai × Afghani",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Menthol-pine bite", "Parent of Pineapple Express"],
    curatorNote:
      "Trainwreck is a NorCal classic — Mexican and Thai sativas crossed with Afghani — named for a high that hits like a freight train. The nose is sharp and distinctive: lemon, pine and a spicy, almost menthol bite over earthy sweetness. The effect is a fast, racing cerebral rush — euphoric, energetic and creative, with enough body to keep it grounded. It's potent and quick, beloved for daytime energy but capable of tipping racy at high doses. As a parent of Pineapple Express and many others, Trainwreck is a foundational sativa.",
    curatorQuote:
      "Lemon, pine and a spicy, almost menthol bite over earthy sweetness.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a fast, racing sativa named Trainwreck — a high that hits like a freight train. A powerful vintage freight locomotive thundering straight toward the viewer down the tracks at speed, headlamp blazing, billowing steam and a shower of sparks streaking past in dramatic motion blur, charging through a lemon-pine forest at golden dusk. Lemon, pine and a spicy, almost menthol bite over earthy sweetness. Palette dynamic and energetic — lemon-gold and pine green with hot spark-orange and a cool menthol-blue steam, motion-blurred light over an earthy dusk shadow. Mood: a fast, racing cerebral rush — euphoric, energetic and creative, grounded but quick. Cinematic, painterly, high-contrast, premium editorial poster, dynamic and atmospheric. The strain name 'TRAINWRECK' baked into the scene — stamped on the locomotive's nameplate or a trackside sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "trainwreck.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Bruce Banner",
    marketNames: ["Bruce Banner #3", "OG Banner"],
    breeder: "Dr. Greenthumb / Original Sensible",
    lineage: {
      parents: ["OG Kush", "Strawberry Diesel"],
      cross: "OG Kush × Strawberry Diesel",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Among the strongest by THC", "Strawberry-diesel nose"],
    curatorNote:
      "Bruce Banner — named for the Hulk's alter ego — is a cross of OG Kush and Strawberry Diesel, famous as one of the strongest strains by THC. The nose is sweet and gassy: strawberry and diesel over an earthy OG base, fruity with a fuel edge. The effect is fast and powerful — a euphoric, energetic cerebral rush that settles into a relaxed body, sativa-leaning but heavy-hitting. Its potency is the headline, so a little goes a long way for newer smokers. For people who want a strong, fast, fruity-gas sativa, Bruce Banner lives up to the name.",
    curatorQuote:
      "Strawberry and diesel over an earthy OG base, fruity with a fuel edge.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a fast, ultra-potent fruity-gas sativa named Bruce Banner — after the scientist who turns into raw, unstoppable power. An explosive eruption of green gamma energy bursting up through smashed, fractured concrete — jagged emerald lightning and a violent surge of toxic-green power tearing the ground apart, a diesel haze around it ignited with electric green and laced with a strawberry-red glow and faint petrol-rainbow shimmer. The air is sweet and gassy: strawberry and diesel over an earthy base, fruity with a fuel edge. Palette explosive and electric — radioactive emerald and acid green with crackling lightning, a hot strawberry-red core and diesel shadow, petrol shimmer in the haze. Mood: fast and overwhelming — a euphoric, energetic cerebral rush of raw power settling into a heavy body, sativa but hard-hitting. Cinematic, painterly, high-contrast, premium editorial poster, dynamic and explosive. The strain name 'BRUCE BANNER' baked into the scene — cracked and seared into the smashed concrete. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no comic characters, no cannabis leaves, buds or packaging.",
    artFileName: "bruce-banner.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "AK-47",
    marketNames: ["AK"],
    breeder: "Serious Seeds",
    lineage: {
      parents: ["Colombian", "Mexican", "Thai", "Afghani"],
      cross: "Colombian × Mexican × Thai × Afghani",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Mellow despite the name", "Sour floral funk"],
    curatorNote:
      "AK-47 is a Serious Seeds Cup winner — a blend of Colombian, Mexican, Thai and Afghani landraces — whose name belies a mellow, long-lasting high. The nose is complex: sweet floral and earthy funk with a sour, skunky edge, distinctive and a little spicy. The effect is a steady, relaxed-but-alert cerebral high — uplifting and mellow rather than racy, a sociable all-day hybrid. It's moderate and dependable, more even-keeled than its aggressive name suggests. For a reliable, mellow, sativa-leaning classic, AK-47 has earned decades of loyalty.",
    curatorQuote:
      "Sweet floral and earthy funk with a sour, skunky edge, distinctive and a little spicy.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Maui Wowie",
    marketNames: ["Maui Waui", "Maui"],
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Hawaiian landrace", "Tropical, easygoing"],
    curatorNote:
      "Maui Wowie is a Hawaiian landrace sativa — a 1960s-70s classic that became shorthand for tropical, easygoing island weed. The nose is sweet and tropical: pineapple and citrus over a light earthy base, sunny and clean. The effect is bright and gentle — an uplifting, creative, happy head with a relaxed body, a low-stress daytime sativa. It's moderate by modern standards, more about mood and flavour than overwhelming potency. For a mellow, tropical, feel-good sativa, Maui Wowie is a nostalgic favourite.",
    curatorQuote:
      "Pineapple and citrus over a light earthy base, sunny and clean.",
    sourceConfidence: "medium",
    tagline: "Aloha In Bloom",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Maui Wowie, the 1960s-70s Hawaiian landrace classic, shorthand for tropical, easygoing island sun. The scene is a black volcanic Maui shoreline where turquoise surf meets dark lava rock, a halved pineapple resting on weathered driftwood and palm fronds swaying against a green ridge above the beach. The palette is tropical turquoise and pineapple-gold over volcanic black and sweet fruity coral, washed in bright clean island light and salt sparkle. The mood is uplifted, energetic, happy and creative, breezy and buoyant with rolling surf motion, lit by brilliant tropical daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name MAUI WOWIE is carved into the weathered driftwood beside the pineapple. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Acapulco Gold",
    marketNames: ["Acapulco"],
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Legendary Mexican landrace", "Toffee-caramel nose"],
    curatorNote:
      "Acapulco Gold is a legendary Mexican landrace sativa — one of the most famous strains of the 1960s-70s, named for its golden, resinous buds. The nose is warm and inviting: toffee and burnt caramel over earthy pine and a hint of citrus, distinctive and rich. The effect is a clean, energetic euphoria — uplifting, happy and creative with little anxiety, a classic feel-good sativa. It's moderate and smooth, more about a bright, easy lift than raw power. As a piece of cannabis history and a genuinely pleasant sativa, Acapulco Gold endures.",
    curatorQuote:
      "Toffee and burnt caramel over earthy pine and a hint of citrus, distinctive and rich.",
    sourceConfidence: "medium",
    tagline: "Golden Coast Legend",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Acapulco Gold, the legendary Mexican landrace sativa named for its golden resinous buds, warm with toffee, caramel and earthy spice. Scene: the sun-drenched Acapulco coastline at golden hour, dramatic cliffs and turquoise Pacific bay below a sky burning amber-gold, sun-cured golden grasses and agave on the headland, warm light gilding everything. Palette and light: rich golden-amber and burnt-caramel toffee over earthy woody brown and warm pine, with a faint citrus-gold sparkle on the sea; intense low golden daytime sun saturating the whole scene. Mood and motion: uplifted, energetic and euphoric warmth, golden grasses swaying and surf glinting far below, the radiant glow of a bright tropical afternoon. Cinematic, painterly, high-contrast, premium editorial poster. The name ACAPULCO GOLD carved into a sun-bleached cliffside stone, edges catching the gold light. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Chocolope",
    marketNames: ["D-Line", "Chocoloped"],
    breeder: "DNA Genetics",
    lineage: {
      parents: ["Chocolate Thai", "Cannalope Haze"],
      cross: "Chocolate Thai × Cannalope Haze",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Coffee-and-melon flavour"],
    curatorNote:
      "Chocolope is a DNA Genetics sativa — a Chocolate Thai × Cannalope Haze cross — built to revive an old-school coffee-and-melon flavour. The nose is its signature: rich coffee and cocoa over sweet melon and earth, dessert-like but not sugary. The effect is a bright, dreamy cerebral high — uplifting, euphoric and energising, a strong daytime sativa. It's potent and clear-headed, good for mornings and creative work. For people who want a coffee-chocolate sativa with real lift, Chocolope is a flavourful classic.",
    curatorQuote:
      "Rich coffee and cocoa over sweet melon and earth, dessert-like but not sugary.",
    sourceConfidence: "medium",
  },

  // ── Skunk / cheese / classic hybrids ──
  {
    canonicalName: "Super Skunk",
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Skunk #1", "Afghani"],
      cross: "Skunk #1 × Afghani",
    },
    sensoryFamily: "skunk-funk",
    phenotypeNotes: ["Amplified classic skunk funk"],
    curatorNote:
      "Super Skunk is a Sensi Seeds classic — a Skunk #1 × Afghani cross that amplified the original skunk funk with extra resin and weight. The nose is pungent and sweet: heavy skunk and earthy funk over a sweet, almost fruity base, loud and classic. The effect is relaxing and happy — a mellow, euphoric body-leaning high that suits unwinding, more indica than its Skunk parent. It's moderate-to-strong and dependable, a building block for countless hybrids. For lovers of that classic sweet-skunk funk with body, Super Skunk is a staple.",
    curatorQuote:
      "Heavy skunk and earthy funk over a sweet, almost fruity base, loud and classic.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Lemon Skunk",
    breeder: "DNA Genetics",
    lineage: {
      parents: ["Skunk #1"],
      cross: "Two Skunk phenos selected for lemon",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Parent of Super Lemon Haze"],
    curatorNote:
      "Lemon Skunk is a DNA Genetics strain — two Skunk phenotypes selected for a standout lemon zest — and a parent of Super Lemon Haze. The nose is bright and tangy: fresh lemon and citrus over a sweet, skunky base, clean and lively. The effect is uplifting and happy — an energetic, mood-lifting head with a light body, a sociable daytime hybrid. It's moderate and flavour-forward, easy to enjoy and easy to handle. For a sweet, zesty lemon-skunk, Lemon Skunk is a bright, friendly pick.",
    curatorQuote:
      "Fresh lemon and citrus over a sweet, skunky base, clean and lively.",
    sourceConfidence: "high",
    tagline: "Zest Meets Funk",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Skunk, a bright lemon-zest sativa-leaning hybrid with a clean tangy snap riding over earthy skunk funk. A burst of fresh-cut lemons mid-explosion, peel curling and citrus mist spraying in a sharp electric arc above a dim, mossy cellar-funk underbase. Palette of vivid electric lemon yellow and citrus zest against shadowy musky greens and earthy browns, lit by a crisp high-key citrus flash cutting through low funk-dark gloom. Mood is energetic, uplifted and lively, motion a sharp zesty spray of droplets and peel, lit by bright daytime light catching the spray. Cinematic, painterly, high-contrast, premium editorial poster. The name LEMON SKUNK is stencilled in bold across a battered yellow zest-stained crate in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "NYC Diesel",
    marketNames: ["Soma's NYC Diesel", "NYCD"],
    breeder: "Soma Seeds",
    lineage: {
      parents: ["Sour Diesel", "Afghani"],
      cross: "Sour Diesel × Afghani (Hawaiian)",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Diesel softened with citrus-lime"],
    curatorNote:
      "NYC Diesel is a Soma Seeds classic — a Sour Diesel × Afghani cross — that softened the diesel with a bright citrus-lime sweetness. The nose is distinctive: sour diesel and grapefruit-lime over an earthy base, gassy with a fruity twist. The effect is uplifting and social — a chatty, energetic head with a relaxing body, a balanced sativa-leaning hybrid. It's potent and flavourful, less harsh than straight Sour D. For people who want diesel with a citrus sweetness, NYC Diesel is a flavourful classic.",
    curatorQuote:
      "Sour diesel and grapefruit-lime over an earthy base, gassy with a fruity twist.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an uplifting, social diesel hybrid named NYC Diesel. A New York City street canyon at golden hour — towering Manhattan facades, a yellow cab cutting through, diesel exhaust and white subway-grate steam billowing up from the asphalt and catching low citrus-gold light; the wet street holds an oily petrol-rainbow sheen, and a bright grapefruit-lime glow cuts through the gassy haze. Sour diesel and citrus-lime hang in the warm city air over an earthy base. Palette electric and urban — sour grapefruit-lime green and citrus gold against diesel haze, taxi yellow and brownstone earth, petrol shimmer on wet asphalt under a warm dusk sky. Mood: chatty, energetic, social — an uplifting head over a relaxed body, a flavourful sativa-leaning hitter. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'NYC DIESEL' baked into the scene — set in a classic NYC subway-tile mosaic or stenciled on a street sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "nyc-diesel.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "UK Cheese",
    lineage: {
      parents: ["Skunk #1"],
      cross: "Skunk #1 phenotype — Exodus Cheese, an inbred clone-only selection (early-90s UK)",
    },
    marketNames: ["Exodus Cheese", "Cheese"],
    sensoryFamily: "skunk-funk",
    phenotypeNotes: ["The original 'cheese' Skunk #1 pheno"],
    curatorNote:
      "UK Cheese (Exodus Cheese) is a famous Skunk #1 phenotype from England — the original 'cheese' cut, named for its pungent, dairy-funk aroma. The nose is unmistakable: sharp, tangy cheese and sour funk over an earthy skunk base, loud and savoury. The effect is balanced and happy — a relaxing, mood-lifting body-leaning high that stays mellow rather than racy. It's moderate and well-loved, a UK and European staple for decades. For lovers of that distinctive cheese funk, UK Cheese is the source.",
    curatorQuote:
      "The original 'cheese' cut, named for its pungent, dairy-funk aroma.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Blue Cheese",
    breeder: "Big Buddha Seeds",
    lineage: {
      parents: ["Blueberry", "UK Cheese"],
      cross: "Blueberry × UK Cheese",
    },
    sensoryFamily: "skunk-funk",
    phenotypeNotes: ["Sweet berry over tangy cheese"],
    curatorNote:
      "Blue Cheese is a Big Buddha Seeds cross of Blueberry and UK Cheese — sweet berry folded into that famous tangy cheese funk. The nose is the pairing made real: sweet blueberry over sharp, savoury cheese, sweet-and-funky at once. The effect is relaxing and mellow — a calming, happy body high that leans indica, comfortable for evenings. It's moderate and distinctive, beloved for its unusual sweet-savoury nose. For people who want berry-and-cheese funk, Blue Cheese is a one-of-a-kind classic.",
    curatorQuote:
      "Sweet blueberry over sharp, savoury cheese, sweet-and-funky at once.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "White Widow",
    marketNames: ["Widow"],
    breeder: "Green House / Ingemar (contested)",
    lineage: {
      parents: ["Brazilian Sativa", "South Indian Indica"],
      cross: "Brazilian sativa × South Indian indica",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["1990s Dutch legend", "Blanket of white trichomes"],
    curatorNote:
      "White Widow is a 1990s Dutch legend — a Brazilian sativa × South Indian indica cross — named for the blanket of white trichomes that made it famous. The nose is earthy and sharp: pine, pepper and a faint floral funk over a woody base, classic and understated. The effect is balanced and energetic — a euphoric, sociable head with a relaxing body, a versatile all-rounder. It's moderate by modern standards but historically important, a coffeeshop staple and breeding parent. For a balanced, frosty, old-school hybrid, White Widow endures.",
    curatorQuote:
      "Pine, pepper and a faint floral funk over a woody base, classic and understated.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Strawberry Cough",
    marketNames: ["Strawberry Cough OG"],
    lineage: {
      parents: ["Strawberry Fields", "Haze"],
      cross: "Strawberry Fields × Haze (commonly cited)",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Sweet strawberry sativa"],
    curatorNote:
      "Strawberry Cough is a sativa of murky origin — usually tied to a Strawberry Fields × Haze line — famous for a sweet strawberry flavour and a high that can make you cough. The nose is sweet and fruity: ripe strawberry over a light earthy, skunky base, clean and dessert-bright. The effect is uplifting and clear — a happy, sociable, gently energetic head that suits daytime and easing stress. It's moderate and approachable, more about flavour and mood than raw power. For a sweet strawberry daytime sativa, Strawberry Cough is a friendly classic.",
    curatorQuote:
      "Ripe strawberry over a light earthy, skunky base, clean and dessert-bright.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Moby Dick",
    marketNames: ["Moby"],
    breeder: "Dinafem",
    lineage: {
      parents: ["White Widow", "Haze"],
      cross: "White Widow × Haze",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["High-yield, high-potency haze", "Vanilla-citrus nose"],
    curatorNote:
      "Moby Dick is a Dinafem heavyweight — a White Widow × Haze cross — one of the most potent and high-yielding sativas of its era. The nose is sweet and sharp: vanilla and citrus over a piney, incense-like haze, clean and intense. The effect is a strong, soaring cerebral high — euphoric, energetic and uplifting, a powerful daytime sativa. Its potency is the headline, so it can run heady or racy if overdone. For people who want a big, vanilla-citrus haze with real punch, Moby Dick delivers.",
    curatorQuote:
      "Vanilla and citrus over a piney, incense-like haze, clean and intense.",
    sourceConfidence: "medium",
  },

  // ── Modern exotics (part 1) ──
  {
    canonicalName: "Sherblato",
    lineage: {
      parents: ["Sherbet", "Gelato"],
      cross: "Sherbet × Gelato",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Pure creamy-sherbet dessert"],
    curatorNote:
      "Sherblato is a cross of Sherbet and Gelato — two of the sweetest names in the Cookies family folded together for a pure creamy-dessert profile. The nose is rich and sweet: sherbet, cream and berry over a light gas, candy-forward and smooth. The effect is balanced and euphoric — a happy, uplifting head that eases into relaxed body comfort, versatile across the day. It's frosty and flavour-driven, an easy-to-like modern dessert hybrid. For people who want the creamy Gelato-sherbet lane, Sherblato is a sweet, dependable pick.",
    curatorQuote:
      "Sherbet, cream and berry over a light gas, candy-forward and smooth.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Peach Gelato",
    breeder: "Humboldt Seed Company",
    lineage: {
      parents: ["Peach Rings", "Gelato 33"],
      cross: "Peach Rings × Gelato 33",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Stone-fruit Gelato cross"],
    curatorNote:
      "Peach Gelato is a Humboldt Seed Company cross of Peach Rings and Gelato 33 — stone fruit folded into Gelato's cream. Done right it smells of ripe peach and apricot over a creamy, lightly gassy base. The high is the Gelato family's calling card — an easy euphoric lift that settles into comfortable relaxation, good from late afternoon on. It's frosty and flavour-led, prized for the peach note over raw strength. For stone fruit on a Gelato frame, it's a tasty, gentle option.",
    curatorQuote:
      "Ripe peach and apricot over a creamy, lightly gassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Purple Gelato",
    lineage: {
      parents: ["Gelato 33", "Purple Punch"],
      cross: "Gelato 33 × Purple Punch",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Grape-leaning Gelato cross"],
    curatorNote:
      "Purple Gelato crosses Gelato 33 with Purple Punch, trading some of the cream for grape and a deep violet colour. Expect grape and dark berry over Gelato's sherbet base, with a light gas underneath. It leans toward the relaxing end of the family: a warm, happy ease better suited to evenings than mornings. The appeal is as much the look as the taste — frosty, colourful and dessert-sweet. For Gelato with a purple, grape-leaning twist, it's a pretty and likeable choice.",
    curatorQuote:
      "Grape and dark berry over Gelato's sherbet base, with a light gas underneath.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Strawberry Runtz",
    lineage: {
      parents: ["Runtz", "Strawberry Fritter"],
      cross: "Runtz × Strawberry Fritter (commonly cited; varies by breeder — not verified)",
      parentDetails: {
        "Strawberry Fritter": { lineageBrief: "Strawberry × Apple Fritter line", type: "hybrid" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Strawberry-forward Runtz selection"],
    curatorNote:
      "Strawberry Runtz is a strawberry-led pick in the candy Runtz family — pure confection, very little funk. The nose is ripe strawberry and sugared tropical fruit, the kind of sweet that reads as dessert before you even taste it. The high is bright and good-natured, an easy lift that keeps the body loose and social rather than couch-bound. Like the rest of the line it's about flavour and bag-appeal first; potency is pleasant rather than punishing. For a clean strawberry-candy nose, it delivers.",
    curatorQuote:
      "Ripe strawberry and sugared tropical fruit — sweet enough to read as dessert before you taste it.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Candy Rain",
    breeder: "Cookies",
    lineage: {
      parents: ["Gelato", "London Pound Cake"],
      cross: "Gelato × London Pound Cake",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Sherbet sweetness over gassy dessert"],
    curatorNote:
      "Candy Rain is a Cookies cross of Gelato and London Pound Cake — sweet sherbet meeting dark, gassy dessert. The nose is rich and layered: creamy berry and sweet candy over a gassy, doughy funk, dessert with depth. The effect is relaxing and euphoric — a happy head easing into comfortable body weight, an afternoon-into-evening strain. It's frosty and potent, balanced-leaning-indica. For people who want Gelato sweetness with London Pound Cake's gas, Candy Rain blends both well.",
    curatorQuote:
      "Creamy berry and sweet candy over a gassy, doughy funk, dessert with depth.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Watermelon Zkittlez",
    marketNames: ["Watermelon Skittlez"],
    lineage: {
      parents: ["Zkittlez", "Watermelon"],
      cross: "Zkittlez × Watermelon",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Watermelon-berry candy", "A parent of Melonade"],
    curatorNote:
      "Watermelon Zkittlez is a Zkittlez cross — pairing the candy berry of Zkittlez with a juicy watermelon note — and a parent of Melonade. The nose is sweet and refreshing: watermelon candy and mixed berry over a clean, light base, summery and fruity. The effect is calm and contented — a relaxed, happy body ease that's easy to handle, more mood than knockout. It's flavour-forward like its Zkittlez parent, low on funk and high on candy. For sweet watermelon-berry flavour with an easy calm, it's a refreshing pick.",
    curatorQuote:
      "Watermelon candy and mixed berry over a clean, light base, summery and fruity.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet, summery watermelon-and-candy hybrid named Watermelon Zkittlez. Juicy fresh watermelon wedges with glistening pink-red flesh and bright green rind, scattered with glossy rainbow candy gems and mixed berries, a refreshing splash of juice droplets in bright summer light, a sugar-frost sparkle on the candy. Watermelon candy and mixed berry over a clean, light base. Palette fresh and vivid — watermelon pink-red and rind green with rainbow candy pops and berry color, a juicy sheen and frosty sparkle under bright summery light. Mood: calm and contented — a relaxed, happy body ease, refreshing and easy. Cinematic, painterly, high-contrast, premium editorial poster, juicy and appetizing. The strain name 'WATERMELON ZKITTLEZ' baked into the scene — printed on a candy wrapper or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "watermelon-zkittlez.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grape Gas",
    marketNames: ["Grape Gasoline"],
    breeder: "Compound Genetics",
    lineage: {
      parents: ["Grape Pie", "Jet Fuel Gelato"],
      cross: "Grape Pie × Jet Fuel Gelato",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Candy grape over sharp diesel"],
    curatorNote:
      "Grape Gas — also sold as Grape Gasoline, Compound Genetics' cross of Grape Pie and Jet Fuel Gelato — welds candy grape to a sharp diesel funk, with the colour to match. On the nose, sweet grape and berry sit over a pungent, gassy base; it's loud in a way pure-candy strains aren't. The effect leans heavy: a warm euphoria that sinks into the body and points toward the evening. It's built for people who like their grape with a fuel edge rather than clean sweetness. Frosty, potent and unapologetically gassy.",
    curatorQuote:
      "On the nose, sweet grape and berry sit over a pungent, gassy base; it's loud in a way pure-candy strains aren't.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, frosty grape-and-fuel exotic named Grape Gas — also called Grape Gasoline. A cluster of swollen deep-purple grapes glistening in moody light, slicked with an oily gasoline sheen — petrol-rainbow iridescence dripping off the fruit and pooling below, a sweet grape mist tangled with sharp fuel haze, a faint silver trichome frost dusting the skins. Sweet grape and berry sit over a pungent, gassy base, loud and unapologetic. Palette rich and electric — deep grape purple and berry-violet with an oily petrol-rainbow slick, frosted silver highlights over a dark moody shadow. Mood: heavy and warm — a sinking euphoria that points toward the evening, frosty, potent and gassy. Cinematic, painterly, high-contrast, premium editorial poster, glossy and atmospheric. The strain name 'GRAPE GAS' baked into the scene — stamped on a worn metal plate or embossed in the dark surface. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "grape-gas.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gushers",
    marketNames: ["Fruit Gushers", "White Gushers"],
    breeder: "Cookies",
    lineage: {
      parents: ["Gelato 41", "Triangle Kush"],
      cross: "Gelato 41 × Triangle Kush",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Tropical candy over a gassy OG frame"],
    curatorNote:
      "Gushers (Fruit Gushers) is a Cookies cross of Gelato 41 and Triangle Kush — sweet tropical candy on a gassy, OG-leaning frame. The nose is sweet and fruity: tropical candy and berry over a light gas, dessert-bright with a funky edge. The effect is balanced-leaning-relaxed — a euphoric head over a comfortable, calming body, afternoon into evening. It's frosty and potent, a popular flavour-forward exotic. For people who want fruity candy with some gas backbone, Gushers is a tasty, well-known pick.",
    curatorQuote:
      "Tropical candy and berry over a light gas, dessert-bright with a funky edge.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a fruity candy exotic with a gassy backbone named Gushers. A pile of glossy fruit-candy gushers, one bursting open mid-bite with vivid tropical juice gushing out — bright berry, mango and tropical color spilling and glistening, a sparkling sugar-frost dusting the candy, a faint oily petrol-rainbow shimmer in the sweet mist hinting at the light gas. Tropical candy and berry over a light gas, dessert-bright with a funky edge. Palette vivid and juicy — bright berry-red, mango-orange and tropical-purple with glossy highlights, a frosty sparkle and a faint petrol shimmer over a clean shadow. Mood: balanced-leaning-relaxed — a euphoric head over a comfortable, calming body, fun and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, glossy and appetizing. The strain name 'GUSHERS' baked into the scene — printed boldly on a candy-bag foil or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gushers.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Apples and Bananas",
    marketNames: ["Apples & Bananas", "AB"],
    breeder: "Cookies / Compound Genetics",
    lineage: {
      parents: ["Blue Power × Gelatti", "GMO × Banana OG"],
      cross: "(Blue Power × Gelatti) × (GMO × Banana OG)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Fruit candy layered over savoury gas"],
    curatorNote:
      "Apples and Bananas is a Cookies/Compound collab — a complex cross of (Blue Power × Gelatti) and (GMO × Banana OG) — built to layer fruit over gas. The nose is rich and unusual: green apple and banana candy over a savoury, gassy funk, sweet-and-funky at once. The effect is balanced and euphoric — a happy, uplifting head over a relaxed body, versatile and potent. It's frosty and flavour-forward, one of the more distinctive modern exotics. For people who want fruit-and-gas complexity, Apples and Bananas stands out.",
    curatorQuote:
      "Green apple and banana candy over a savoury, gassy funk, sweet-and-funky at once.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "RS11",
    marketNames: ["Rainbow Sherbet 11", "RS-11"],
    breeder: "Wizard Trees / Doja Exclusive",
    lineage: {
      parents: ["Pink Guava", "OZ Kush"],
      cross: "Pink Guava × OZ Kush",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Guava-sherbet, extremely frosty"],
    curatorNote:
      "RS11 — Rainbow Sherbet #11 — is a Wizard Trees / Doja cut of Pink Guava and OZ Kush, one of the most hyped exotics of recent years. The nose is sweet and creamy: tropical guava and sherbet over a doughy, gassy base, candy with depth. The effect is balanced and relaxing — a euphoric head easing into comfortable body calm, afternoon into evening. It's extremely frosty and flavour-forward, a connoisseur's exotic. For people chasing the current top-shelf guava-sherbet hype, RS11 is a benchmark.",
    curatorQuote:
      "Tropical guava and sherbet over a doughy, gassy base, candy with depth.",
    tagline: "Bright cherry bloom",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Zoap",
    marketNames: ["Soap (sibling)"],
    breeder: "DEO Farms",
    lineage: {
      parents: ["Rainbow Sherbet", "Pink Guava"],
      cross: "Rainbow Sherbet × Pink Guava",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Clean soapy-floral funk", "Heavy bag appeal"],
    curatorNote:
      "Zoap is DEO Farms' Rainbow Sherbet × Pink Guava cross out of Oakland, and one of the strains that made 'soap' a flavour category. The signature is right there in the name: a clean, perfumed, almost soap-and-floral nose over creamy sweetness, unlike the gas or candy most exotics chase. The effect is upbeat and even — a sociable head with a loose, comfortable body that works through the day. Add glassy, colourful, frost-stacked buds and you get a strain sold as much on looks as on feel. For the soap-funk lane, Zoap is the name that started it.",
    curatorQuote:
      "A clean, perfumed, almost soap-and-floral nose over creamy sweetness, unlike the gas or candy most exotics chase.",
    sourceConfidence: "medium",
  },

  // ── Modern exotics (part 2) + fruity / dessert ──
  {
    canonicalName: "Soap",
    lineage: {
      parents: ["Animal Mints", "Kush Mints"],
      cross: "Animal Mints × Kush Mints (Seed Junky / Minntz)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Lighter, soapy-floral sibling of Zoap"],
    curatorNote:
      "Soap takes the same clean, perfumed funk that made Zoap famous and pours it into a lighter, brighter cut. The nose is floral and crisp — think fresh soap with a touch of cream — and only a faint gas underneath. The high is mellow and sociable, a gentle lift that keeps the body easy rather than weighed down. Like its sibling it trades on novelty and bag-appeal: the perfumed profile is the whole point. For people curious about the 'soap' flavour without Zoap's intensity, this is the gentler way in.",
    curatorQuote:
      "Floral and crisp — fresh soap with a touch of cream, only a faint gas underneath.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Garanimals",
    breeder: "Skunktek",
    lineage: {
      parents: ["Grape Pie", "Gelato"],
      cross: "Grape Pie × Gelato",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Grape-and-cream dessert exotic"],
    curatorNote:
      "Garanimals is a Skunktek cross of Grape Pie and Gelato — grape-jam sweetness folded into Gelato's cream, finished with heavy frost. The nose is grape and dark berry over a creamy, lightly gassy base, squarely in dessert territory. The effect leans relaxing: a contented, slightly heavy ease that suits the back half of the day. It's an easy-drinking grape dessert — flavour and frost ahead of brute strength. For the grape-and-cream corner of the Gelato world, it's a likeable, accessible pick.",
    curatorQuote:
      "The nose is grape and dark berry over a creamy, lightly gassy base, squarely in dessert territory.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "White Runtz",
    marketNames: ["Runtz (white pheno)"],
    breeder: "Cookies / Runtz Genetics",
    lineage: {
      parents: ["Zkittlez", "Gelato"],
      cross: "Zkittlez × Gelato (white pheno)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Near-white frost", "Prized Runtz phenotype"],
    curatorNote:
      "White Runtz is the frostiest, palest phenotype of Runtz — the Zkittlez × Gelato candy cross selected for a near-white trichome coat. The nose is pure confection: sugary tropical fruit and creamy sweetness with barely any funk, loud and candied. It smokes the way it smells — an easy, glowing euphoria that keeps you sociable and loose rather than couch-locked. Like everything wearing the Runtz name it's widely faked, so a genuinely frost-white, candy-loud cut is the tell. For the sweetest, most glittering end of the family, this is the prize pheno.",
    curatorQuote:
      "Sugary tropical fruit and creamy sweetness with barely any funk, loud and candied.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cheetah Piss",
    breeder: "Cookies",
    lineage: {
      parents: ["Lemonnade", "Gelato 42", "London Pound Cake"],
      cross: "Lemonnade × Gelato 42 × London Pound Cake",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Sharp, ammonia-tinged sour funk"],
    curatorNote:
      "Cheetah Piss is a Cookies strain — a cross of Lemonnade, Gelato 42 and London Pound Cake — with a name nodding to its sharp, ammonia-tinged funk. The nose is pungent and unusual: sour citrus and a sharp, almost ammonia-like funk over a creamy, gassy base, loud and divisive. The effect is balanced and uplifting — a euphoric, sociable head over a relaxed body, versatile and potent. It's frosty and very loud, a flavour-forward exotic for funk chasers. For people who want a sharp, sour, unusual profile, Cheetah Piss stands out.",
    curatorQuote:
      "Sour citrus and a sharp, almost ammonia-like funk over a creamy, gassy base, loud and divisive.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sharp, sour, frosty funk exotic named Cheetah Piss. A sleek, spotted cheetah prowling at speed through a sharp acid-yellow haze at dusk, its coat catching a sour citrus-yellow glow, a pungent gassy mist swirling around it with a faint oily petrol-rainbow shimmer, a glittering trichome-frost sparkle in the air. Sour citrus and a sharp funk over a creamy, gassy base. Palette sharp and electric — acid lemon-yellow and sour chartreuse with the cheetah's tan-and-black spots, a frosty sparkle and a faint petrol shimmer over a dusky shadow. Mood: balanced and uplifting — a euphoric, sociable head over a relaxed body, loud and divisive. Cinematic, painterly, high-contrast, premium editorial poster, dynamic and atmospheric. The strain name 'CHEETAH PISS' baked into the scene — stenciled on a wall or stamped on a small metal tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cheetah-piss.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Italian Ice",
    breeder: "Cookies",
    lineage: {
      parents: ["Gelato 45", "Forbidden Fruit"],
      cross: "Gelato 45 × Forbidden Fruit",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Creamy gelato with a cherry-citrus twist"],
    curatorNote:
      "Italian Ice is a Cookies cross of Gelato 45 and Forbidden Fruit — creamy gelato sweetness with a fruity, cherry-citrus twist. The nose is rich and sweet: cream and tropical fruit over a light gas, dessert-bright with a fruity edge. The effect is relaxing and euphoric — a happy head easing into comfortable body calm, afternoon into evening. It's frosty and flavourful, balanced-leaning-relaxed. For people who want gelato cream with a fruit lean, Italian Ice is a smooth, tasty pick.",
    curatorQuote:
      "Cream and tropical fruit over a light gas, dessert-bright with a fruity edge.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grape Stomper",
    marketNames: ["Sour Grapes"],
    breeder: "Gage Green Genetics",
    lineage: {
      parents: ["Purple Elephant", "Chemdawg Sour Diesel"],
      cross: "Purple Elephant × Chemdawg Sour Diesel",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Grape candy welded to sharp diesel", "A parent of Grape Pie"],
    curatorNote:
      "Grape Stomper (Sour Grapes) is a Gage Green cross of Purple Elephant and Chemdawg Sour Diesel — sweet grape candy welded to sharp diesel. The nose is the pairing made plain: sweet grape and berry over a pungent, sour diesel funk, candy meeting fuel. The effect is uplifting and euphoric — a bright, happy head with a relaxing body, balanced-leaning-sativa. It's potent and flavour-forward, for people who like grape with a gas backbone. For the grape-diesel lane, Grape Stomper is a classic example.",
    curatorQuote:
      "Sweet grape and berry over a pungent, sour diesel funk, candy meeting fuel.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Banana OG",
    lineage: {
      parents: ["OG Kush", "Banana"],
      cross: "OG Kush × Banana",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Sweet banana over a heavy OG frame", "Creeper potency"],
    curatorNote:
      "Banana OG is an OG Kush × Banana cross — sweet, ripe banana folded onto a heavy OG frame. The nose is its draw: sweet banana and tropical fruit over an earthy, gassy OG base, dessert meeting fuel. The effect is a creeping, heavy indica — a euphoric head that sinks into a strong, sedating body, firmly an evening strain. It's potent and known to sneak up, so it's a nightcap more than a daytime smoke. For lovers of sweet banana on a heavy OG frame, Banana OG is a satisfying, sleepy pick.",
    curatorQuote:
      "Sweet banana and tropical fruit over an earthy, gassy OG base, dessert meeting fuel.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Banana Punch",
    lineage: {
      parents: ["Banana OG", "Purple Punch"],
      cross: "Banana OG × Purple Punch",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Banana-and-grape candy indica"],
    curatorNote:
      "Banana Punch is a cross of Banana OG and Purple Punch — sweet banana and grape candy on a relaxing indica frame. The nose is rich and fruity: ripe banana and grape over a creamy, slightly gassy base, dessert-forward. The effect is relaxing and euphoric — a happy head easing into a calming, sedating body, evening-leaning. It's frosty and flavourful, easy to over-enjoy for its sweetness. For people who want banana-and-grape candy with body, Banana Punch is a tasty, mellow pick.",
    curatorQuote:
      "Ripe banana and grape over a creamy, slightly gassy base, dessert-forward.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Clementine",
    breeder: "Crockett Family Farms",
    lineage: {
      parents: ["Tangie", "Lemon Skunk"],
      cross: "Tangie × Lemon Skunk",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Juicy orange-citrus sativa", "A parent of Mimosa"],
    curatorNote:
      "Clementine is a Crockett Family cross of Tangie and Lemon Skunk — a bright, juicy citrus sativa and a parent of Mimosa. The nose is vivid and sweet: orange and tangerine over a lemony, skunky base, clean and zesty. The effect is uplifting and energetic — a happy, motivating head with a light body, a daytime and creative sativa. It's flavour-forward and lively, an easy citrus pick-me-up. For people who want pure orange-citrus brightness with a lift, Clementine is a benchmark.",
    curatorQuote:
      "Orange and tangerine over a lemony, skunky base, clean and zesty.",
    sourceConfidence: "medium",
    tagline: "Juicy citrus morning",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Clementine — Crockett Family's juicy citrus sativa (Tangie × Lemon Skunk), sweet, bright and motivating. A sunlit breakfast nook at mid-morning: a ceramic bowl heaped with ripe clementines, a scatter of peeled segments and bright spiral peel on a scrubbed wooden table, a small glass of fresh clementine juice glowing in a shaft of window light, a sprig of pine on the sill. Palette of vivid clementine-orange and sweet honey-gold over warm cream and soft pine-green, juicy and luminous. Mood: cheerful, motivated, light — uplifted energetic happiness, a bright easy morning lift, sunlight warm across the table. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'CLEMENTINE' painted around the rim of the ceramic bowl. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Lemon Tree",
    lineage: {
      parents: ["Lemon Skunk", "Sour Diesel"],
      cross: "Lemon Skunk × Sour Diesel",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Sharp lemon over diesel", "A parent of Melonade"],
    curatorNote:
      "Lemon Tree is a Lemon Skunk × Sour Diesel cross — sharp lemon over a gassy diesel base, and a parent of strains like Melonade. The nose is bright and pungent: fresh lemon and citrus over a sour diesel funk, zesty with a fuel edge. The effect is balanced and uplifting — a happy, relaxing high that lifts the mood without heavy sedation, versatile across the day. It's potent and flavour-forward, cleaner than straight diesel. For people who want lemon with a gas backbone, Lemon Tree is a flavourful, balanced pick.",
    curatorQuote:
      "Fresh lemon and citrus over a sour diesel funk, zesty with a fuel edge.",
    sourceConfidence: "medium",
    tagline: "Sharp Lemon Funk",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Tree, a bright Lemon Skunk × Sour Diesel hybrid with a sunlit citrus character and a gassy diesel undercurrent. Scene: a sun-flooded Mediterranean courtyard with a single laden lemon tree, ripe lemons glowing against glossy leaves, a cracked stone wall and a faint shimmer of diesel-fuel haze rising from warm flagstones. Palette and light: vivid lemon-yellow and zesty chartreuse over earthy stone ochre and sweet honeyed amber, with a sour metallic glint of blue-grey fuel; high midday sun casting crisp hard shadows. Mood and motion: relaxed yet euphoric and uplifted energy, leaves and citrus fronds stirring in a focused breeze, the bright clarity of full daytime. Cinematic, painterly, high-contrast, premium editorial poster. The name LEMON TREE carved into the courtyard's stone wall, weathered and sun-bleached. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Grape Pie",
    breeder: "Cannarado Genetics",
    lineage: {
      parents: ["Cherry Pie", "Grape Stomper"],
      cross: "Cherry Pie × Grape Stomper",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Grape-and-pastry breeding parent", "Behind Sundae Driver & Lava Cake"],
    curatorNote:
      "Grape Pie is a Cannarado cross of Cherry Pie and Grape Stomper — sweet grape and berry on a dessert frame, and a parent of Sundae Driver and Lava Cake. The nose is sweet and fruity: grape and dark berry over a doughy, earthy base, dessert-forward. The effect is relaxing and happy — a calming body ease with a euphoric head, evening-leaning. It's frosty and flavourful, a popular breeding parent for grape dessert lines. For grape-and-pastry lovers, Grape Pie is a sweet, comfortable pick.",
    curatorQuote:
      "Grape and dark berry over a doughy, earthy base, dessert-forward.",
    sourceConfidence: "medium",
  },

  // ── Fruity / dessert tail + classics ──
  {
    canonicalName: "Peach Rings",
    marketNames: ["Peach Ringz"],
    breeder: "Dying Breed Seeds",
    lineage: {
      parents: ["Marionberry", "Eddy OG"],
      cross: "Marionberry × Eddy OG",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Sour-peach candy profile"],
    curatorNote:
      "Peach Rings — spelled Peach Ringz by its breeder, Dying Breed Seeds — is a Marionberry × Eddy OG cross that lives up to its gummy-candy name. The nose is bright and tart, sour peach and tropical sweetness over a light creamy base, more candy than cannabis. The high is balanced and cheerful: a mood-lift that keeps you functional without much sedation, easy in the daytime. It's bought for the flavour; the potency is moderate and friendly. For a sweet-and-sour peach candy profile, it hits the brief.",
    curatorQuote:
      "The nose is bright and tart, sour peach and tropical sweetness over a light creamy base, more candy than cannabis.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Passion Fruit",
    lineage: {
      parents: ["Sweet Pink Grapefruit", "Orange Bud"],
      cross: "Sweet Pink Grapefruit × Orange Bud (Dutch Passion)",
      parentDetails: {
        "Sweet Pink Grapefruit": { lineageBrief: "grapefruit-leaning clone", type: "hybrid" },
      },
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Tangy tropical sativa lean"],
    curatorNote:
      "Passion Fruit is a tropical, sativa-leaning hybrid built around its namesake — sweet-tart passionfruit over a faint floral base. The nose is exotic and clean, juicy without the gas or candy of the modern exotics. The high is light and sociable: a gentle, mildly energetic lift that stays comfortable in the body, good for daytime company. It's a moderate, flavour-driven strain rather than a heavy hitter. For a tangy tropical lift, it's a refreshing change of pace.",
    curatorQuote:
      "The nose is exotic and clean, juicy without the gas or candy of the modern exotics.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Tropicana Cherry",
    lineage: {
      parents: ["Tropicana Cookies", "Cherry Cookies"],
      cross: "Tropicana Cookies × Cherry Cookies",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Orange citrus meets dark cherry"],
    curatorNote:
      "Tropicana Cherry is a cross of Tropicana Cookies and Cherry Cookies — bright orange citrus meeting dark cherry on a cookie base. The nose is rich and fruity: orange and cherry over a creamy, slightly gassy cookie funk, sweet and layered. The effect is balanced and uplifting — a happy, euphoric head with a relaxing body, versatile across the day. It's frosty and flavour-forward, a colourful modern fruit hybrid. For people who want citrus-and-cherry depth, Tropicana Cherry stands out.",
    curatorQuote:
      "Orange and cherry over a creamy, slightly gassy cookie funk, sweet and layered.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pink Lemonade",
    lineage: {
      parents: ["Purple Kush", "Lemon Skunk"],
      cross: "Purple Kush × Lemon Skunk (commonly cited, not verified; multiple pedigrees exist)",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Sweet pink-lemonade citrus"],
    curatorNote:
      "Pink Lemonade aims for the sweet-tart drink it's named after, usually built on a Lemon OG-type base. The nose is candied lemon with a berry edge over a light earthy note — citrus dessert rather than sharp fuel. The high is mellow and even: a gentle mood-lift that eases into a comfortable body, fine at any time of day. It's a flavour-first strain; the strength is moderate and forgiving. For sweet lemon-and-berry citrus, it's an easy choice.",
    curatorQuote:
      "Candied lemon with a berry edge over a light earthy note — citrus dessert, not sharp fuel.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Blueberry Muffin",
    breeder: "Humboldt Seed Company",
    lineage: {
      parents: ["Blueberry", "Razzleberry"],
      cross: "Blueberry × Razzleberry",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Baked-goods blueberry sweetness"],
    curatorNote:
      "Blueberry Muffin is a Humboldt Seed Co cross of Blueberry and Razzleberry — built to taste like a fresh-baked muffin, sweet berry over a doughy warmth. The nose is rich and sweet: ripe blueberry and baked-goods sweetness over a light earthy base, dessert-bright. The effect is relaxing and happy — a calming, mood-lifting body ease that leans comfortable rather than knockout. It's flavour-forward and approachable, an easy berry-dessert pick. For lovers of sweet blueberry-muffin flavour, it's a tasty, mellow choice.",
    curatorQuote:
      "Ripe blueberry and baked-goods sweetness over a light earthy base, dessert-bright.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blueberry Cupcake",
    breeder: "Humboldt Seed Company",
    lineage: {
      parents: ["Blueberry Muffin", "Wedding Cake"],
      cross: "Blueberry Muffin × Wedding Cake",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Blueberry over a vanilla-cake base"],
    curatorNote:
      "Blueberry Cupcake is a Humboldt Seed Company cross of Blueberry Muffin and Wedding Cake — ripe blueberry over a vanilla, doughy sweetness, the cake half as much in the flavour as the name. The nose is jammy blueberry and batter with only a faint gas underneath. The high is soft and comforting: a relaxed body ease and a quietly happy head, best suited to a slow evening. It's a sweet, gentle strain rather than a heavy hitter. For blueberry on a cake frame, it's a cosy, approachable choice.",
    curatorQuote:
      "The nose is jammy blueberry and batter with only a faint gas underneath.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Candyland",
    breeder: "Ken Estes",
    lineage: {
      parents: ["Granddaddy Purple", "Bay Platinum Cookies"],
      cross: "Granddaddy Purple × Bay Platinum Cookies",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cup-winning sweet sativa-lean"],
    curatorNote:
      "Candyland is a Ken Estes cross of Granddaddy Purple and Bay Platinum Cookies — a Cup-winning sativa-leaning hybrid with sweet, candy flavour. The nose is sweet and earthy: sugary candy and berry over a spicy, earthy base, dessert with depth. The effect is uplifting and happy — an energetic, sociable head with a light body, a daytime and creative strain. It's moderate and pleasant, more about a bright lift than heavy sedation. For people who want sweet candy flavour with a sativa lift, Candyland is a tasty pick.",
    curatorQuote:
      "Sugary candy and berry over a spicy, earthy base, dessert with depth.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemon Pound Cake",
    lineage: {
      parents: ["Lemon Skunk", "UK Cheese"],
      cross: "Lemon Skunk × Cheese (Heavyweight Genetics)",
    },
    marketNames: ["Lemon Poundcake"],
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Lemon cake over a creamy base"],
    curatorNote:
      "Lemon Pound Cake sits in the cake family but leans citrus — sweet lemon icing over a buttery, doughy base. The nose is bright lemon and vanilla cake with a faint gas, smooth rather than sharp. The high is gentle and even: a small uplift that mellows into easy comfort, fine across the day. It's a flavour-first strain with moderate, forgiving strength. For lemon-and-cake sweetness without much weight, it's a pleasant, undemanding pick.",
    curatorQuote:
      "Bright lemon and vanilla cake with a faint gas, smooth rather than sharp.",
    sourceConfidence: "low",
    tagline: "Sweet Lemon Comfort",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Pound Cake, a gentle Lemon Skunk × Cheese hybrid with the warm, doughy character of a citrus dessert. Scene: a cozy artisan bakery interior, a golden lemon pound cake cooling on a marble counter, lemon icing dripping in glossy ribbons, vanilla beans and dusted sugar scattered nearby, soft steam curling from the fresh loaf. Palette and light: buttery golden-yellow and creamy vanilla ivory over warm caramel and soft lemon-zest brightness, with a faint tangy gas-blue shadow; warm honeyed daylight pouring through a frosted bakery window. Mood and motion: uplifted, happy and energetic ease, sugar dust drifting and icing slowly flowing, the bright cheer of a mid-morning daytime kitchen. Cinematic, painterly, high-contrast, premium editorial poster. The name LEMON POUND CAKE piped in delicate lemon icing across the cake's golden top. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Cotton Candy Kush",
    marketNames: ["Cotton Candy"],
    breeder: "Delicious Seeds",
    lineage: {
      parents: ["Lavender", "Power Plant"],
      cross: "Lavender × Power Plant",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Spun-sugar, floral-sweet"],
    curatorNote:
      "Cotton Candy Kush is a Delicious Seeds cross of Lavender and Power Plant — built around a sweet, sugary, almost floral candy flavour. The nose is sweet and floral: spun-sugar sweetness and berry over a light floral, earthy base, dessert with a perfumed edge. The effect is relaxing and happy — a calming, mood-lifting body ease that leans comfortable, good for unwinding. It's moderate and flavour-driven, more about taste and calm than raw power. For people who want sweet, floral candy, Cotton Candy Kush is a soft, pleasant pick.",
    curatorQuote:
      "Spun-sugar sweetness and berry over a light floral, earthy base, dessert with a perfumed edge.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gas Face",
    lineage: {
      parents: ["Face Mints", "Biscotti"],
      cross: "Face Mints × (Biscotti × Sherbet) backcross (Seed Junky)",
      parentDetails: {
        "Face Mints": { lineageBrief: "Face Off OG × Kush Mints", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Fuel-forward, little sweetness"],
    curatorNote:
      "Gas Face is built for one thing — fuel. Lineage is loosely tied to the OG/diesel world, but the draw is the nose: sharp diesel and raw fuel over a skunky, earthy base, with almost no sweetness to round it off. The high is just as direct — a quick euphoric wash that drops into a heavy, sedating body, firmly an evening hit. It's potent and unsubtle, made for people who want gas over candy. If pure fuel is the goal, it earns the name.",
    curatorQuote:
      "Sharp diesel and raw fuel over a skunky, earthy base, with almost no sweetness to round it off.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a pure-fuel gas-OG hybrid named Gas Face — all diesel, no candy. The interior of a vast, near-empty underground concrete parking structure at night: rows of square pillars receding into darkness under flickering sodium lights, a heavy fuel haze drifting low through the cold air, oily petrol-rainbow puddles spreading across the worn concrete floor and catching the lights. Palette raw and nocturnal — near-black concrete and cold diesel-petrol blue with sodium-amber pools of light and an oily iridescent sheen on the wet floor. Mood: heavy and direct — a quick euphoric rush dropping into deep, sedating stillness, firmly evening. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GAS FACE' baked into the scene — stencilled on a concrete pillar. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gas-face.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Purple Haze",
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Colourful retro sativa", "Hendrix namesake"],
    curatorNote:
      "Purple Haze is a classic purple sativa — immortalised by Jimi Hendrix and usually tied to a Purple Thai × Haze line — known for colourful buds and an energetic head. The nose is sweet and earthy: berry and grape over a spicy, herbal haze, sweet with a sativa edge. The effect is uplifting and creative — a bright, euphoric, energetic head with a light body, a daytime and creative sativa. It's moderate and nostalgic, more about a pleasant lift than overwhelming potency. For a colourful, energetic retro sativa, Purple Haze endures.",
    curatorQuote:
      "Berry and grape over a spicy, herbal haze, sweet with a sativa edge.",
    sourceConfidence: "medium",
  },

  // ── Final batch: remaining OG / dessert / classics ──
  {
    canonicalName: "Triple Double OG",
    lineage: {
      cross: "Lineage not clearly documented — a heavy OG cut, distinct from the better-known Triple OG",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy, fuel-forward OG"],
    curatorNote:
      "Triple Double OG is a heavy, OG-leaning indica that puts potency ahead of nuance. The nose is loud, classic OG — sharp fuel and pine over damp earth, all gas and no candy. Expect a fast euphoric head that gives way to a weighted, sedating body and, eventually, the pillow. There's not much daytime in it; this is a nightcap. For OG and gas lovers chasing a simple, heavy knockout, it fits the bill.",
    curatorQuote:
      "Sharp fuel and pine over damp earth, all gas and no candy.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, fuel-forward knockout OG indica named Triple Double OG — its name a basketball stat. A deserted outdoor basketball court at night under buzzing floodlights, a worn ball resting at center as a thick fuel haze rolls low across the cracked asphalt; the wet ground holds an oily petrol-rainbow sheen, pine-and-fuel funk hanging heavy in the cold floodlit air, all gas and no candy. Palette dark and gritty — sodium-amber floodlight over diesel-black asphalt and chain-link shadow, sharp pine green and a petrol-rainbow shimmer on the wet court. Mood: heavy and sedating — a fast euphoric head sinking into a weighted body, a pure nightcap. Cinematic, painterly, high-contrast, premium editorial poster, gritty and atmospheric. The strain name 'TRIPLE DOUBLE OG' baked into the scene — lit up on a worn courtside scoreboard or stenciled on the asphalt. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "triple-double-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Cake Crasher",
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Wedding Cake", "Wedding Crasher"],
      cross: "Wedding Cake × Wedding Crasher",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Vanilla cake with a grape-gas edge"],
    curatorNote:
      "Cake Crasher is a Seed Junky cross of Wedding Cake and Wedding Crasher — vanilla cake sweetness meeting the grape-leaning, gassy 'crasher' side. The nose is vanilla cake and grape over a clear gas note, dessert with some funk behind it. The effect settles in comfortably: a happy lift that melts into body weight, better suited to evenings. It's frosty and balanced toward the indica side, sweet without being one-note. For cake flavour with a gassy, grape twist, it's a satisfying choice.",
    curatorQuote:
      "The nose is vanilla cake and grape over a clear gas note, dessert with some funk behind it.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sticky Buns",
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Kush Mints", "Gelatti"],
      cross: "Kush Mints × Gelatti",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cinnamon-pastry over minty gas"],
    curatorNote:
      "Sticky Buns is a Seed Junky cross of Kush Mints and Gelatti — sweet, doughy pastry over a gassy, minty base. The nose is rich and sweet: cinnamon-bun pastry and vanilla over an earthy gas, dessert-forward with funk. The effect is relaxing and euphoric — a happy head sinking into comfortable body calm, evening-leaning. It's very frosty and potent, a flavour-forward dessert exotic. For people who want pastry-and-gas sweetness, Sticky Buns is a rich, indulgent pick.",
    curatorQuote:
      "Cinnamon-bun pastry and vanilla over an earthy gas, dessert-forward with funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a rich, frosty pastry-and-gas dessert exotic named Sticky Buns. A tray of glossy cinnamon sticky buns glistening with caramel-glaze drizzle and vanilla icing in warm bakery light, the swirls sticky and golden, a curl of sweet cinnamon steam carrying a faint oily petrol-rainbow shimmer that hints at the earthy gas beneath, a sugar-frost sparkle on the glaze. Cinnamon-bun pastry and vanilla over an earthy gas, dessert-forward with funk. Palette warm and luscious — golden caramel and cinnamon brown with creamy vanilla-white icing, a glossy sticky sheen and a faint petrol shimmer under a honeyed glow. Mood: relaxing and euphoric — a happy head sinking into comfortable body calm, indulgent and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'STICKY BUNS' baked into the scene — hand-lettered on a bakery sign or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sticky-buns.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pancakes",
    breeder: "Seed Junky Genetics / Cookies",
    lineage: {
      parents: ["London Pound Cake", "Kush Mints"],
      cross: "London Pound Cake #75 × Kush Mints #11 (commonly cited)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Buttery, syrup-and-batter sweetness"],
    curatorNote:
      "Pancakes is a Seed Junky / Cookies hybrid, widely cited as London Pound Cake #75 crossed with Kush Mints #11 (the real cross was never officially published). It leans on the breakfast-plate idea — buttery, syrup-sweet batter over a minty, gassy cookie base. The nose is warm and sweet, vanilla and butter with an earthy gas and a cool mint edge underneath. The high is calm and good-natured: an easy body relaxation with a contented head, pointed at the evening. Frosty and comforting rather than racy, it's a cosy, low-drama dessert pick.",
    curatorQuote:
      "The nose is warm and sweet, vanilla and butter with an earthy gas and a cool mint edge underneath.",
    tagline: "Warm syrup comfort",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a calm, comforting buttery-sweet dessert hybrid named Pancakes. A tall stack of golden fluffy pancakes with a glossy pour of maple syrup cascading down the sides and a melting pat of butter on top, warm morning kitchen light, a curl of sweet vanilla steam carrying a faint oily petrol-rainbow shimmer that hints at the earthy gas, a sugar-frost sparkle on the surface. Vanilla and butter with an earthy gas and a cool mint edge. Palette warm and cosy — golden pancake brown and amber maple syrup with creamy butter-yellow, a sugar-frost sparkle and a faint petrol shimmer under a honeyed glow. Mood: calm and good-natured — an easy body relaxation with a contented head, comforting and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'PANCAKES' baked into the scene — hand-lettered on a diner sign or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "pancakes.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Jet Fuel",
    marketNames: ["Jet Fuel G6", "G6"],
    breeder: "303 Seeds",
    lineage: {
      parents: ["Aspen OG", "High Country Diesel"],
      cross: "Aspen OG × High Country Diesel",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Loud fuel with a daytime lift"],
    curatorNote:
      "Jet Fuel (G6) is a 303 Seeds cross of Aspen OG and High Country Diesel — a sharp, fuel-forward sativa-leaning hybrid that lives up to its name. The nose is loud and gassy: heavy diesel and fuel over an earthy, pine base, all gas with little sweetness. The effect is fast and energetic — an uplifting, heady rush with a light body, more daytime than sedating despite the heavy nose. It's potent and clear, beloved by diesel lovers who want energy rather than couch. For pure fuel with a lift, Jet Fuel delivers.",
    curatorQuote:
      "Heavy diesel and fuel over an earthy, pine base, all gas with little sweetness.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a fast, energetic, fuel-forward diesel sativa named Jet Fuel. A sleek jet streaking steeply upward into a bright sky, afterburners blazing with a fiery exhaust trail, a heavy fuel haze and heat-shimmer pouring off it laced with an oily petrol-rainbow sheen, vapor cones and speed streaks, a pine treeline far below. Heavy diesel and fuel over an earthy, pine base, all gas. Palette dynamic and energetic — steel grey and sky blue with hot afterburner orange and a petrol-rainbow shimmer in the fuel haze, pine-green far below. Mood: fast and energetic — an uplifting, heady rush with a light body, a daytime gas lift. Cinematic, painterly, high-contrast, premium editorial poster, dynamic and atmospheric. The strain name 'JET FUEL' baked into the scene — stenciled on the fuselage or a runway marking. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "jet-fuel.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Space Queen",
    lineage: {
      parents: ["Romulan", "Cinderella 99"],
      cross: "Romulan × Cinderella 99",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Fruity, creative sativa-lean"],
    curatorNote:
      "Space Queen is a Romulan × Cinderella 99 cross — a fruity, sativa-leaning hybrid with a sweet-and-funky nose. The nose is bright and fruity: pineapple, apple and a sweet vanilla edge over a light earthy base, juicy and clean. The effect is uplifting and energetic — a euphoric, creative, slightly heady high with a relaxed body, a daytime and creative strain. It's potent and flavour-forward, lively rather than sedating. For people who want a fruity, creative sativa, Space Queen is a bright pick.",
    curatorQuote:
      "Pineapple, apple and a sweet vanilla edge over a light earthy base, juicy and clean.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "MAC and Cheese",
    marketNames: ["Mac and Cheese", "Mac & Cheese"],
    lineage: {
      parents: ["MAC", "UK Cheese"],
      cross: "MAC × Cheese (commonly cited)",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Creamy MAC meets tangy cheese funk"],
    curatorNote:
      "MAC and Cheese folds the creamy, floral refinement of MAC into a sharp, tangy cheese funk — an unusual sweet-and-savoury pairing. The nose is creamy citrus and floral over a pungent, dairy-cheese funk, loud and a little divisive. The high is upbeat and balanced: a sociable, uplifting head with a relaxed body, and real potency behind it. It's frosty and flavour-forward, aimed at people who want MAC's polish with a savoury edge. A distinctive exotic for funk chasers rather than candy lovers.",
    curatorQuote:
      "The nose is creamy citrus and floral over a pungent, dairy-cheese funk, loud and a little divisive.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Orange Bud",
    breeder: "Dutch Passion",
    lineage: {
      parents: ["Skunk #1"],
      cross: "Stabilised Skunk #1 selection",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["1980s Dutch citrus-skunk classic"],
    curatorNote:
      "Orange Bud is a Dutch Passion classic — a stabilised Skunk selection from the 1980s — named for its orange pistils and citrus-sweet nose. The nose is bright and sweet: orange and citrus over a skunky, earthy base, clean and classic. The effect is balanced and happy — an uplifting, mood-lifting high with a relaxed body, a versatile all-rounder. It's moderate and dependable, an old-school flavour-forward skunk. For a sweet citrus-skunk classic, Orange Bud has endured for decades.",
    curatorQuote:
      "Orange and citrus over a skunky, earthy base, clean and classic.",
    sourceConfidence: "medium",
    tagline: "Classic Dutch Citrus",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Orange Bud, a classic Dutch skunk orange-citrus hybrid, a stabilised 1980s Skunk selection with vintage Amsterdam swagger. A bright stack of fresh oranges spilling across a sunlit Dutch market crate beside a canal-side brick wall, peel and pith catching crisp light. Palette of vivid bright orange and citrus gold over warm skunky earth-browns against clean Dutch daylight neutrals, lit by sharp clear northern sun. Mood is uplifted, happy and energetic, motion a bright rolling tumble of oranges, lit by clear daytime light of a brisk market morning. Cinematic, painterly, high-contrast, premium editorial poster. The name ORANGE BUD is stencilled in bold vintage type across the front of the wooden market crate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Sour Tangie",
    breeder: "DNA Genetics",
    lineage: {
      parents: ["Sour Diesel", "Tangie"],
      cross: "Sour Diesel × Tangie",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Orange citrus welded to sharp diesel"],
    curatorNote:
      "Sour Tangie is a DNA Genetics cross of Sour Diesel and Tangie — bright orange citrus welded to sharp diesel funk. The nose is the pairing made plain: fresh tangerine and orange over a sour diesel base, zesty with a fuel edge. The effect is uplifting and energetic — a creative, talkative, heady sativa lift with a light body, a daytime strain. It's potent and flavour-forward, cleaner and brighter than straight Sour D. For people who want citrus with a diesel backbone, Sour Tangie is a vivid pick.",
    curatorQuote:
      "Fresh tangerine and orange over a sour diesel base, zesty with a fuel edge.",
    sourceConfidence: "medium",
    tagline: "Citrus Meets Fuel",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Sour Tangie, a DNA Genetics cross of Sour Diesel and Tangie welding bright orange citrus to sharp diesel funk. A sun-baked industrial citrus depot: stacked orange crates and a vintage fuel pump beside a chrome tanker truck on cracked asphalt, heat haze shimmering and ripe tangerines spilling across an oil-stained loading dock. Palette of electric tangerine and zesty orange against gritty diesel chrome, asphalt grey, earthy rust and sour spicy ochre from the citrus-diesel-earthy-spicy nose. The mood is uplifted, happy, energetic and creative, fuel vapour and citrus oil shimmering upward in restless heat motion, lit by harsh bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name SOUR TANGIE is hand-painted in bold weathered letters across the side of the chrome tanker truck. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Platinum Kush",
    marketNames: ["Platinum OG Kush"],
    lineage: {
      parents: ["Master Kush", "OG Kush"],
      cross: "Master Kush × OG Kush (contested)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Silvery, frosty heavy indica"],
    curatorNote:
      "Platinum Kush is a frost-heavy indica cut from the same silvery mould as its Platinum OG cousin, generally placed on a Master Kush × OG Kush line. The nose leans hashy and earthy — kush and gas with a faint fruit sweetness underneath, dense rather than bright. The effect comes on as a slow, thickening body weight that pulls toward the couch and then the pillow. It's a quiet, heavy strain with little head-play — squarely a nightcap. For hashy, frosty, lights-out indica, it delivers without fuss.",
    curatorQuote:
      "Kush and gas with a faint fruit sweetness underneath, dense rather than bright.",
    sourceConfidence: "low",
  },

  // ── Newly added strains (catalog expansion) ──
  {
    canonicalName: "Triangle Kush",
    lineage: {
      parents: ["Hindu Kush"],
      cross: "Neville's Hindu Kush × an unknown Emerald Triangle female — an accidental Florida cross (~1990), held as a clone",
    },
    marketNames: ["Triangle", "Triangle OG"],
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Florida OG cut", "Behind Wedding Cake & Triangle Mints"],
    curatorNote:
      "Triangle Kush is a legendary Florida OG cut — the 'triangle' nods to the state's three cannabis hubs — and one of the most important parents in modern genetics, behind Wedding Cake and Triangle Mints. The nose is pure heavy OG: sharp fuel and pine over a damp, earthy funk, loud and classic. The effect is a strong, relaxing indica-leaning high — a euphoric head sinking into a heavy body, firmly evening territory. It's potent and couch-leaning, prized as much for breeding as for smoking. For OG purists and lovers of gassy, heavy genetics, Triangle Kush is foundational.",
    curatorQuote:
      "Sharp fuel and pine over a damp, earthy funk, loud and classic.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy Florida OG indica named Triangle Kush — the 'triangle' nods to the state's three cannabis hubs. A lone weathered triangular metal road sign standing at a misty Everglades crossroads at dusk, three tall cypress trees rising behind it in a clear triangle formation; a humid, fuel-amber haze hangs over still swamp water that throws back an oily petrol-rainbow sheen. Palette deep and classic — fuel-petrol blue and cypress-pine green over damp earthy brown, warm amber dusk light catching the haze and the water, fading into a wine-dark sky. Mood: strong and relaxing — a euphoric warmth sinking into a heavy, grounded stillness, firmly evening. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'TRIANGLE KUSH' baked into the scene — embossed on the triangular sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "triangle-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pink Kush",
    lineage: {
      parents: ["OG Kush"],
      cross: "Derived from OG Kush — virtually an OG Kush, selected and stabilized by Barney's Farm (second parent unrecorded)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Sweet, floral OG indica", "Pink-hued pistils"],
    curatorNote:
      "Pink Kush is a heavy West Coast indica — an OG Kush descendant with pink-hued pistils — beloved across British Columbia and beyond. The nose is rich and sweet: floral vanilla and sweet candy over an earthy, gassy kush base, dessert meeting OG. The effect is profoundly relaxing — a euphoric head that sinks into a heavy, sedating body, a textbook nightcap. It's potent and couch-leaning, known to bring on sleep and the munchies. For lovers of sweet, heavy OG indicas, Pink Kush is a frosty favourite.",
    curatorQuote:
      "Floral vanilla and sweet candy over an earthy, gassy kush base, dessert meeting OG.",
    sourceConfidence: "medium",
    tagline: "Sweet And Heavy",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Pink Kush — a heavy West Coast OG Kush descendant with pink-hued pistils, beloved across British Columbia, rich and sweet with floral vanilla and candy over an earthy gassy kush base, dessert meeting fuel. The scene: a misty Pacific Northwest forest clearing at night, a single wild rose bush in pink bloom catching faint light, an old steel fuel canister leaning against a moss-furred stump, low fog drifting between towering dark firs, dew beading on petals. Palette of soft rose-pink, vanilla cream, deep forest-green and a cool petrol-blue gas sheen against night fog. Mood: soft, lush, sinking — euphoric calm easing into body-heavy sleep, fog rolling slow and low, petals utterly still, a quiet West Coast midnight. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'PINK KUSH' embossed into a small enamel tag wired to the rose bush stake. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
  },
  {
    canonicalName: "Mendo Breath",
    breeder: "Gage Green Genetics",
    lineage: {
      parents: ["OGKB", "Mendo Montage"],
      cross: "OGKB (GSC cut) × Mendo Montage",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Vanilla-caramel gas", "A parent of Peanut Butter Breath"],
    curatorNote:
      "Mendo Breath is a Gage Green cross of OGKB (a GSC cut) and Mendo Montage — a sweet, gassy indica and the parent of Peanut Butter Breath. The nose is rich and dessert-like: vanilla, caramel and grape over an earthy, gassy base, sweet with funk. The effect is heavily relaxing — a warm, euphoric body weight that tips toward sleep, an evening and end-of-day strain. It's potent and couch-leaning, comforting rather than active. For lovers of sweet, gassy, sleepy indicas, Mendo Breath is a cosy pick.",
    curatorQuote:
      "Vanilla, caramel and grape over an earthy, gassy base, sweet with funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Yoda OG",
    lineage: {
      parents: ["OG Kush", "Master Kush"],
      cross: "OG Kush × Master Kush (commonly cited; also described as an OG Kush phenotype — not verified)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy LA OG phenotype"],
    curatorNote:
      "Yoda OG is an LA-born OG Kush phenotype, dense and gassy in the classic Southern California mould. The nose is loud and earthy — fuel and pine over a damp, woody funk, almost no sweetness. It hits like a proper heavy OG: a brief euphoric lift, then a sinking, sedating body that settles you in for the night. There's nothing fancy here — just reliable, gassy weight. For OG lovers who want a no-frills heavy indica, Yoda OG is a dependable pick.",
    curatorQuote:
      "Fuel and pine over a damp, woody funk, almost no sweetness.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Afgooey",
    marketNames: ["Afgoo", "Afgooey OG"],
    lineage: {
      parents: ["Afghani", "Maui Haze"],
      cross: "Afghani × Maui Haze (commonly cited)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Sticky, resin-heavy 'gooey' indica"],
    curatorNote:
      "Afgooey (Afgoo) is a resin-heavy indica — an Afghani-dominant cross usually tied to a Maui Haze line — named for its sticky, 'gooey' trichomes. The nose is earthy and sweet: hashy musk and pine over a faint fruity sweetness, classic and deep. The effect is heavily relaxing — a calm, sedating body weight that eases tension and leans toward sleep, a dependable evening indica. It's resin-rich and moderate-to-strong, prized for hash as well as flower. For traditional, sticky, hashy relaxation, Afgooey is a reliable pick.",
    curatorQuote:
      "Hashy musk and pine over a faint fruity sweetness, classic and deep.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Ice",
    marketNames: ["I.C.E.", "Iced"],
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["Northern Lights", "Skunk #1", "Afghani"],
      cross: "Northern Lights × Skunk × Afghani",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Glittering trichome coat", "A parent of Papaya"],
    curatorNote:
      "Ice is a frosty Nirvana indica — a Northern Lights × Skunk × Afghani blend named for its glittering trichome coat — and a parent of Papaya. The nose is earthy and sweet: skunky, hashy musk over a faint floral sweetness, classic and understated. The effect is heavily relaxing — a calm, sedating body high that tips toward sleep, a straightforward evening indica. It's frosty and moderate-to-strong, dependable rather than flashy. For lovers of classic, frosty, relaxing indica, Ice is a solid choice.",
    curatorQuote:
      "Skunky, hashy musk over a faint floral sweetness, classic and understated.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Domina",
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Northern Lights", "Ortega", "Hash Plant", "Afghani"],
      cross: "Northern Lights × Ortega × Hash Plant × Afghani",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Dark, dense, resinous buds"],
    curatorNote:
      "Black Domina is a Sensi Seeds indica — a four-way Afghani/Northern Lights/Ortega/Hash Plant blend — bred for dark, dense, resinous buds. The nose is rich and spicy: peppery hash and earthy musk over a faint sweet-coffee note, deep and old-world. The effect is profoundly relaxing — a heavy, sedating body stone that points straight at sleep, a powerful nightcap. It's potent and couch-locking, more medicine than party. For deep, hashy, knock-out indica, Black Domina is a heavyweight.",
    curatorQuote:
      "Peppery hash and earthy musk over a faint sweet-coffee note, deep and old-world.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Critical Kush",
    breeder: "Barney's Farm",
    lineage: {
      parents: ["Critical Mass", "OG Kush"],
      cross: "Critical Mass × OG Kush",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Big, dense, heavy-hitting buds"],
    curatorNote:
      "Critical Kush is a Barney's Farm cross of Critical Mass and OG Kush — big, dense buds with a heavy, relaxing punch. The nose is earthy and sweet: hashy spice and gas over a honeyed, skunky base, rich and classic. The effect is strongly sedating — a calming body weight with a euphoric head, firmly an evening and sleep strain. It's potent and couch-leaning, a popular pick for unwinding and rest. For lovers of heavy, earthy kush indicas, Critical Kush is a dependable nightcap.",
    curatorQuote:
      "Hashy spice and gas over a honeyed, skunky base, rich and classic.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Master Yoda",
    lineage: {
      parents: ["Master Kush", "Yoda OG"],
      cross: "Master Kush × Yoda OG",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Hashy, gassy heavy indica"],
    curatorNote:
      "Master Yoda crosses Master Kush into a Yoda OG line, stacking two heavy, hashy parents into one deeply relaxing indica. The nose is earthy and gassy — hashy kush and fuel over a faint sweetness, dense and old-school. Expect a slow, blanketing body calm that eases tension and tips steadily toward sleep. It's a low-cerebral, evening-only strain built for switching off. For people who want hashy, gassy heaviness with no surprises, it's a sleepy, satisfying choice.",
    curatorQuote:
      "Hashy kush and fuel over a faint sweetness, dense and old-school.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pink Runtz",
    lineage: {
      parents: ["Zkittlez", "Gelato"],
      cross: "Zkittlez × Gelato — a Runtz phenotype selected for colour (some attribute Pink Panties × Rainbow Sherbet — not verified)",
    },
    marketNames: ["Runtz (pink pheno)"],
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy-sweet pink Runtz phenotype"],
    curatorNote:
      "Pink Runtz is a candy-sweet phenotype of the Runtz family — a pink-hued cut prized for sugary, fruity flavour and heavy frost. The nose is pure confection: sweet berry and tropical candy with barely any funk, loud and sugary. The effect is balanced and feel-good — a bright euphoric lift over comfortable body ease, social without sedation. Like all Runtz it's widely counterfeited, so a true frosty pink cut stands out. For the candy-sweet end of Runtz, Pink Runtz is a prized pick.",
    curatorQuote:
      "Sweet berry and tropical candy with barely any funk, loud and sugary.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a candy-sweet, frosty pink phenotype named Pink Runtz. A glossy spill of glittering pink hard candy and sugar-dusted pink berries tumbling across a glassy surface, every piece slick and jewel-bright in dominant bubblegum and rose pink, a sugary trichome-frost sparkle coating the candy, bright high-key studio light. Sweet berry and tropical candy, loud and sugary with barely any funk. Palette pink and playful — bubblegum pink, rose and candy-magenta with pearly white frost sparkle, glossy and high-key over a soft pink shadow. Mood: bright and feel-good — a euphoric lift over easy body comfort, social and fun. Cinematic, painterly, high-contrast, premium editorial poster, hyper-glossy and candied. The strain name 'PINK RUNTZ' baked into the scene — printed boldly on a pink candy-bag foil. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "pink-runtz.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Apple Runtz",
    lineage: {
      parents: ["Runtz", "Apple Fritter"],
      cross: "Runtz × Apple Fritter (commonly cited; not breeder-verified)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Green-apple Runtz selection"],
    curatorNote:
      "Apple Runtz is widely described as Runtz crossed with Apple Fritter, though no breeder has published a verified recipe — so treat the lineage as the common story rather than gospel. Either way it brings a green-apple twist to the candy Runtz family: sweet-tart apple laid over the line's creamy confection. The nose is bright — crisp green apple and sugared tropical fruit with barely any funk. The smoke is easy and upbeat, a light euphoria that keeps things sociable rather than sleepy. As with the rest of the Runtz crowd, flavour and frost lead the way over raw strength. For a sweet-and-sour apple candy profile, it's a fun, approachable pick.",
    curatorQuote:
      "Crisp green apple and sugared tropical fruit with barely any funk.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Obama Runtz",
    lineage: {
      parents: ["Afghani", "OG Kush", "Runtz"],
      cross: "Obama Kush (Afghani × OG Kush) × Runtz",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy-and-gas Runtz-orbit exotic"],
    curatorNote:
      "Obama Runtz is a hype-named member of the Runtz orbit, its exact lineage never settled but generally gassier and heavier than the pure-candy cuts. The nose mixes berry candy and grape with an earthy, gassy funk — sweet with a fuel edge. The effect leans relaxing: a warm, happy ease that settles into the body more than the head. It's a bag-appeal strain, bought for frost and flavour as much as anything. For Runtz character with a gassy lean, it's a popular choice.",
    curatorQuote:
      "The nose mixes berry candy and grape with an earthy, gassy funk — sweet with a fuel edge.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Layer Cake",
    breeder: "Swamp Boys Seeds",
    lineage: {
      parents: ["Wedding Cake", "GMO Cookies", "Triangle Kush", "Skunk #1"],
      cross: "Wedding Cake × GMO × (Triangle Kush × Skunk)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Vanilla cake over GMO garlic-gas"],
    curatorNote:
      "Layer Cake is a Swamp Boys Seeds hybrid that stacks four cornerstones — Wedding Cake, GMO, Triangle Kush and Skunk — so vanilla-cake sweetness sits on top of a heavy garlic-and-gas funk. The nose is rich: cream and cake up front, savoury diesel and earth underneath. The high is a comfortable sink — a happy lift that gives way to body weight, pointed firmly at the evening. It's frosty, potent and indica-leaning, sweet without going soft. For cake flavour with serious GMO gas behind it, it's a rich, heavy choice.",
    curatorQuote:
      "Cream and cake up front, savoury diesel and earth underneath.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a rich, heavy vanilla-cake-over-gas dessert hybrid named Layer Cake. A tall slice of multi-layered vanilla cake standing in cross-section, neat stacked sponge and cream frosting layers glistening, a glossy drip down the side in warm light, a sugar-frost sparkle on top; a faint curl of savoury vapor carries an oily petrol-rainbow shimmer hinting at the garlic-diesel funk beneath the sweetness. Cream and cake up front, savoury diesel and earth underneath. Palette warm and rich — creamy vanilla-ivory and golden sponge with caramel, a frosty sparkle and a faint petrol shimmer over a moody shadow. Mood: a comfortable sink — a happy lift giving way to body weight, frosty and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'LAYER CAKE' baked into the scene — hand-lettered on a small enamel dessert tag or a cake board. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "layer-cake.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hippie Crasher",
    lineage: {
      parents: ["Kush Mints", "Wedding Crasher"],
      cross: "Kush Mints × Wedding Crasher",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Minty cookie over grape-gas"],
    curatorNote:
      "Hippie Crasher crosses Kush Mints with Wedding Crasher, marrying cool minty cookie to grape-and-gas funk. The nose is layered — mint and cookie up front, grape and fuel underneath, sweet and savoury at the same time. The effect is balanced and unhurried: a clear euphoric head that drifts into easy body comfort, good from afternoon on. It's very frosty and flavour-forward, the kind of cut connoisseurs hunt. For mint-and-grape gas done well, it's a tasty pick.",
    curatorQuote:
      "Mint and cookie up front, grape and fuel underneath, sweet and savoury at the same time.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, mint-and-grape gas exotic named Hippie Crasher. A retro 1970s flower-power camper van parked at a warm desert sunset, its painted panels swirling with tie-dye in cool mint green and grape purple, beaded curtains and groovy chrome catching the golden light; a soft incense-and-fuel haze drifts around it, threaded with a faint oily petrol-rainbow shimmer, a glittering frost sparkle on the windows. Mint and cookie up front, grape and fuel underneath — sweet and savoury at once. Palette psychedelic and warm — swirling mint green and grape violet over a honey-amber sunset and dusty desert gold, chrome glints and a faint petrol shimmer in the hazy air. Mood: balanced and unhurried — a clear euphoric head drifting into easy body comfort, groovy and mellow. Cinematic, painterly, high-contrast, premium editorial poster, retro and atmospheric. The strain name 'HIPPIE CRASHER' baked into the scene — hand-painted in groovy 70s lettering on the van or a roadside wooden sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "hippie-crasher.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry Lemonade",
    breeder: "Subcool's The Dank (TGA)",
    lineage: {
      parents: ["Cherry Pie OG", "Jack the Ripper"],
      cross: "Cherry Pie OG × Jack the Ripper",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Cherry from Cherry Pie, citrus from Jack the Ripper"],
    curatorNote:
      "Cherry Lemonade is a Subcool's The Dank cross of Cherry Pie OG and Jack the Ripper — the Cherry Pie brings the cherry, Jack the Ripper the sharp lemon-citrus lift. The nose is candy-bright and juicy, a sour-sweet snap of cherry and citrus with little funk. The high is cheerful and light: a mood-lift that keeps the body relaxed and the day moving. It's a flavour-first strain, moderate and forgiving in strength. For sweet cherry-and-lemon brightness, it's a refreshing, easy pick.",
    curatorQuote:
      "The nose is candy-bright and juicy, a sour-sweet snap of cherry and citrus with little funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Honey Bun",
    breeder: "Cookies",
    lineage: {
      parents: ["Gelatti", "Honey B"],
      cross: "Gelatti × Honey B",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Honeyed pastry over frosty gas"],
    curatorNote:
      "Honey Bun is a Cookies hybrid of Gelatti and Honey B, wrapping honeyed-pastry sweetness around a heavy, frosty Gelato-line core. The nose is rich and dessert-like — honey and vanilla pastry over an earthy gas. The effect leans heavy and warm: a happy head that melts into real body weight, best kept for the evening. It's potent and indica-leaning, indulgent in both flavour and feel. For sweet pastry with a gassy backbone, it's a satisfying, sleepy choice.",
    curatorQuote:
      "Honey and vanilla pastry over an earthy gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Strawberry Shortcake",
    lineage: {
      parents: ["Juliet", "Strawberry Diesel"],
      cross: "Juliet × Strawberry Diesel (Dark Horse cut; varies by breeder)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Strawberry-and-cream dessert", "Several unrelated cuts share the name"],
    curatorNote:
      "Strawberry Shortcake is a name several breeders share, so genetics vary — the most documented version, from Dark Horse Genetics, is Juliet × Strawberry Diesel, which explains the strawberry-diesel sparkle in many cuts. Whichever cut you find, it leans dessert: ripe strawberry over a vanilla-cream, doughy sweetness. The high is gentle and even — a small lift that settles into easy comfort, fine across the day. It's frosty and flavour-led, an approachable berry sweet. For strawberry-and-cream flavour, it's a tasty, undemanding pick.",
    curatorQuote:
      "Ripe strawberry over a vanilla-cream, doughy sweetness.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pink Champagne",
    marketNames: ["Phantom OG", "Ken's Kush", "Phantom"],
    breeder: "Ken Estes",
    lineage: {
      parents: ["Granddaddy Purple", "Cherry Pie"],
      cross: "Granddaddy Purple × Cherry Pie",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Colourful grape-and-cherry fruit"],
    curatorNote:
      "Pink Champagne — also sold as Phantom OG or Ken's Kush — is a Bay Area Ken Estes hybrid, the same Grand Daddy Purp camp behind GDP itself, crossing Granddaddy Purple with Cherry Pie. The nose is sweet and berry-led: grape and cherry over a light earthy base. The effect is soft and relaxing — a calming body ease with a quietly happy head, pointed at the evening. It's moderate in strength and easy to enjoy, prized partly for its frosty, pink-flecked looks. For sweet grape-and-cherry fruit with a relaxed body, it's a pretty, mellow pick.",
    curatorQuote:
      "Grape and cherry over a light earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Cherry Punch",
    lineage: {
      parents: ["Black Cherry", "Purple Punch"],
      cross: "Black Cherry × Purple Punch",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Dark cherry and grape candy"],
    curatorNote:
      "Black Cherry Punch crosses Black Cherry with Purple Punch, doubling down on dark fruit. The nose is deep and sweet — dark cherry and grape over a creamy, faintly gassy base. The effect is a relaxing slide: a happy head that gives way to a calming, sedating body, evening-leaning. It's frosty and sweet enough to over-pour if you're not careful. For dark-cherry candy with real body, it's a tasty, mellow indica-lean.",
    curatorQuote:
      "Dark cherry and grape over a creamy, faintly gassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cap Junky",
    marketNames: ["Capjunky", "Cap Junkie"],
    breeder: "Capulator / Seed Junky Genetics",
    lineage: {
      parents: ["Kush Mints 11", "Alien Cookies"],
      cross: "Kush Mints 11 × Alien Cookies",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Extremely potent and loud", "Sour, soapy-mint funk"],
    curatorNote:
      "Cap Junky is a hype-era heavyweight — a Capulator and Seed Junky collab crossing Kush Mints 11 and Alien Cookies — one of the loudest, most potent exotics of recent years. The nose is sharp and savoury-sweet: mint, gas and a sour, almost soapy funk over a creamy base, intense and unusual. The effect is fast and powerful — a euphoric, heady rush that settles into a heavy body, potent enough to humble experienced smokers. It's extremely frosty and very loud, a true connoisseur's exotic. For people chasing maximum potency and funk, Cap Junky is the deep end.",
    curatorQuote:
      "Mint, gas and a sour, almost soapy funk over a creamy base, intense and unusual.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an extremely potent, loud, frosty exotic named Cap Junky. A frost-caked metal crown bottle-cap blasting off in a violent burst at night — an explosive eruption of mint-green vapor and sour, soapy iridescent foam, the cap and spray rimed in glittering trichome frost, an oily petrol-rainbow shimmer streaking the chaotic gritty dark. Loud and savoury-sweet in the air: mint, gas and a sour, soapy funk over a creamy base. Palette intense and electric — frost-white and mint green with soapy iridescent rainbow and petrol shimmer over a dark gritty backdrop, sour acid-green pops and creamy highlights. Mood: fast and overwhelming — a euphoric, heady rush sinking into a heavy body, extremely frosty, loud and humbling. Cinematic, painterly, high-contrast, premium editorial poster, explosive and atmospheric. The strain name 'CAP JUNKY' baked into the scene — stamped across the metal bottle-cap. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cap-junky.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Truffle",
    lineage: {
      cross: "A market label — genetics differ by breeder (White Truffle × Pure Michigan, or Gelato 33 × unknown); no single documented cross",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savoury, earthy truffle-and-gas funk"],
    curatorNote:
      "Black Truffle is one of the savoury exotics — dark, frosty buds carrying an earthy, almost mushroom-and-truffle funk rather than candy. The nose is rich and savoury: gassy, earthy truffle over a faint berry sweetness, pungent and unusual. The effect leans relaxing and potent — a happy head that sinks into body weight, better kept for the evening. It's loud and frost-heavy, squarely for funk chasers. For a savoury, gassy profile well off the candy path, it stands out.",
    curatorQuote:
      "Gassy, earthy truffle over a faint berry sweetness, pungent and unusual.",
    tagline: "Earth mushroom funk",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a savoury, frosty, gassy exotic named Black Truffle. A prized dark, knobbly black truffle resting on rich damp forest soil under dramatic low light — its rough surface dusted with glittering silver frost like trichomes, an earthy savoury haze curling around it laced with a faint oily petrol-rainbow shimmer, a hint of dark berry in the deep shadow. Gassy, earthy truffle over a faint berry sweetness, pungent and unusual. Palette dark and rich — deep earthy browns and truffle-black with frosted silver highlights, a faint petrol shimmer and a touch of berry-violet in the moody shadow. Mood: relaxing and potent — a happy head sinking into body weight, a loud, savoury evening pick. Cinematic, painterly, high-contrast, premium editorial poster, moody and atmospheric. The strain name 'BLACK TRUFFLE' baked into the scene — branded into a wooden crate or stamped on a small enamel tag beside it. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "black-truffle.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Frosted Lemonade",
    breeder: "GreenFire Genetics",
    lineage: {
      parents: ["91 Hollywood Pure Kush", "Evergladez"],
      cross: "91 Hollywood Pure Kush × Evergladez (a Zkittlez line)",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Candy-citrus over a kushy base", "Name is sweeter than the genetics suggest"],
    curatorNote:
      "Frosted Lemonade is a GreenFire Genetics cross of 91 Hollywood Pure Kush and Evergladez (a Zkittlez line) — so despite the citrusy name, it's really candy-and-kush with a light lemon lift rather than a sharp-fuel lemon. The nose is sweet and creamy, candied fruit and a soft citrus note over a frost-stacked kush base. The high is bright but easy: a small, cheerful lift with a relaxed body, fine through the day. It's a flavour-and-frost strain, approachable in strength. For sweet, creamy lemonade-leaning flavour, it's a refreshing, undemanding pick.",
    curatorQuote:
      "The nose is sweet and creamy, candied fruit and a soft citrus note over a frost-stacked kush base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sherbanger",
    marketNames: ["Sherbanger 22"],
    breeder: "Karma Genetics",
    lineage: {
      parents: ["Sunset Sherbet", "Headbanger"],
      cross: "Sunset Sherbet × Headbanger",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sherbet sweetness over diesel"],
    curatorNote:
      "Sherbanger is a Karma Genetics cross of Sunset Sherbet and Headbanger — sherbet cream laid over a sour, diesel-leaning base. The nose is sweet and tangy: creamy sherbet and citrus cut by a gassy funk. The effect is even and upbeat — a clear, uplifting head with a relaxed body that holds up through the day. It's frosty and flavourful, balanced rather than sedating. For sherbet sweetness with a diesel backbone, it's a tasty, well-built pick.",
    curatorQuote:
      "Creamy sherbet and citrus cut by a gassy funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Triangle Mints",
    marketNames: ["Triangle Mintz"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Triangle Kush", "Animal Mints"],
      cross: "Triangle Kush × Animal Mints",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Same parentage as Wedding Cake", "Minty gas dessert"],
    curatorNote:
      "Triangle Mints is a Seed Junky cross of Triangle Kush and Animal Mints — the very same pairing behind Wedding Cake, of which it's effectively a sibling. The nose is rich and cool: minty cookie and vanilla over a gassy, earthy funk, sweet and savoury. The effect is heavy-leaning and euphoric — a happy head sinking into deep body relaxation, an evening strain. It's potent and frosty, a pheno-hunter's favourite. For the mint-and-gas dessert lane, Triangle Mints is a benchmark cut.",
    curatorQuote:
      "Minty cookie and vanilla over a gassy, earthy funk, sweet and savoury.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty mint-and-gas dessert hybrid named Triangle Mints — cool, sweet and savoury. A frosted mint garden at night with a triangular polished marble monument at its centre: cool mint-green bioluminescence threads through the plants, vanilla-cream mist drifts low, sugar-frost crystals glint on dark cocoa-brown earth, and a faint gassy haze hangs in the cold air. Palette deep and cool — night indigo and mint green with vanilla cream and frost white over dark cocoa brown, a crystalline frosted sheen everywhere. Mood: heavy and relaxing — a happy euphoric head sinking into deep body calm, evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'TRIANGLE MINTS' baked into the scene — carved into the triangular marble. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "triangle-mints.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemonatti",
    breeder: "Connected Cannabis Co.",
    lineage: {
      parents: ["Gelonade", "Biscotti"],
      cross: "Gelonade × Biscotti",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sharp lemon over a creamy Biscotti base"],
    curatorNote:
      "Lemonatti is Connected Cannabis Co.'s cross of Gelonade (Lemon Tree × Gelato 41) and Biscotti — sharp lemon laid over a creamy, gassy cookie base. The nose is bright and rich: lemon citrus on top, cookie and a light gas underneath, sweet and zesty at once. The effect is gentle and balanced: a small uplift that mellows into easy comfort across the day. It's frosty and refined, a citrus dessert rather than a heavy hitter. For lemon over a cookie base, it's a bright, tasty pick.",
    curatorQuote:
      "Lemon citrus on top, cookie and a light gas underneath, sweet and zesty at once.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cinex",
    lineage: {
      parents: ["Cinderella 99", "Vortex"],
      cross: "Cinderella 99 × Vortex",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Bright, citrus-sweet daytime sativa"],
    curatorNote:
      "Cinex is a Colorado sativa — a Cinderella 99 × Vortex cross — built for a bright, energetic, citrus-sweet daytime high. The nose is sweet and zesty: lemon and citrus over a floral, earthy base, clean and lively. The effect is uplifting and focused — a happy, talkative, energetic head with a light body, a daytime and creative sativa. It's flavour-forward and motivating, more lift than sedation. For people who want a clean, citrusy daytime sativa, Cinex is a bright pick.",
    curatorQuote:
      "Lemon and citrus over a floral, earthy base, clean and lively.",
    sourceConfidence: "medium",
    tagline: "Zest In Motion",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Cinex, a bright Colorado sativa cross of Cinderella 99 and Vortex built for a zesty, energetic, citrus-sweet daytime lift. A sun-drenched Rocky Mountain morning: a fresh lemon-citrus grove on a high open plateau, dewy leaves and a coiling spiral of citrus mist (a nod to the Vortex parent) twisting up into clean blue air over distant snow-capped peaks. Palette of sweet lemon-yellow, lively zesty orange, clean pine green and soft earthy floral tones from the citrus-sweet-pine profile. The mood is uplifted, happy, focused and electric, dew and pollen lifting in a swirling energetic updraft, lit by a sharp bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name CINEX is stencilled in crisp letters on the weathered side panel of an old grove irrigation crate in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Sour Apple",
    lineage: {
      parents: ["Sour Diesel", "Cinderella 99"],
      cross: "Sour Diesel × Cinderella 99 (commonly cited)",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Sour green-apple tang", "A parent of Apple Fritter"],
    curatorNote:
      "Sour Apple is a tangy, sativa-leaning hybrid — most often a Sour Diesel × Cinderella 99 cross, and the green-apple half of Apple Fritter's parentage. The nose is sour and bright: crisp green apple and citrus over a gassy diesel base. The high is up and lively — an energetic, mood-lifting head with a comfortable body, well suited to daytime. It's flavour-forward and zesty, gas and fruit at once. For sour-apple tang with a diesel edge, it's a sharp, cheerful pick.",
    curatorQuote:
      "Crisp green apple and citrus over a gassy diesel base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a tangy, zesty, sativa-leaning fruit-gas hybrid named Sour Apple. A crisp, glossy green apple sliced open mid-splash, electric-sour juice spraying off it in bright droplets under hard daylight, beads of moisture glistening on the vivid skin; a faint oily petrol-rainbow shimmer threads the zesty mist, hinting at the gassy diesel base. Crisp green apple and citrus over a gassy diesel base. Palette electric and fresh — vivid acid green and lime with bright citrus-gold highlights, a faint petrol-rainbow shimmer over a clean, sunlit shadow. Mood: up and lively — an energetic, mood-lifting head with a comfortable body, a zesty daytime pick. Cinematic, painterly, high-contrast, premium editorial poster, glossy and appetizing. The strain name 'SOUR APPLE' baked into the scene — embossed on a worn metal plate or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sour-apple.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tangie Banana",
    lineage: {
      parents: ["Tangie", "Banana"],
      cross: "Tangie × Banana",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Orange citrus meets creamy banana"],
    curatorNote:
      "Tangie Banana pairs Tangie's bright orange with sweet, creamy banana — citrus and tropical fruit in one nose. The smell is juicy and sweet: orange and tangerine over ripe banana, dessert-bright. The high leans sativa: a creative, sociable lift with a relaxed body, friendly for daytime. It's flavour-led and lively rather than heavy. For an orange-and-banana fruit profile, it's a bright, sweet pick.",
    curatorQuote:
      "Orange and tangerine over ripe banana, dessert-bright.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lemon Tek",
    lineage: {
      cross: "Lineage not publicly documented — a lemon-forward cut with no recorded cross",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Sharp, clean lemon sativa lean"],
    curatorNote:
      "Lemon Tek is a citrus-forward, sativa-leaning hybrid built on sharp, sweet lemon. The nose is clean and zesty — fresh lemon over a light herbal, earthy base. The effect is up and talkative: an energetic, clear head with a light body, suited to daytime and creative work. It's flavour-forward and approachable, more lift than weight. For a clean lemon daytime sativa, it's a zesty, easy pick.",
    curatorQuote:
      "Fresh lemon over a light herbal, earthy base.",
    sourceConfidence: "low",
    tagline: "Sharp And Gassy",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Tek, a citrus-forward sativa-leaning hybrid built on sharp, sweet lemon over a gassy skunky base. A bright roadside lemonade stand fused with a working fuel station at the edge of a sunlit highway: a galvanised metal counter heaped with halved lemons, a row of glass bottles glinting, an old gas pump and a faint waver of fuel vapour rising off warm tarmac. Palette of vivid sweet lemon-yellow and white pith, clean glass glints, gassy blue-grey vapour and earthy skunk-brown undertones from the citrus-gassy-skunky-sweet profile. The mood is up, happy, talkative and energetic, lemon zest mist and heat shimmer lifting in lively upward motion, lit by sharp bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name LEMON TEK is hand-painted in cheerful bold letters across the front board of the metal counter stand. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Bay 11",
    breeder: "Grand Daddy Purp Genetics",
    lineage: {
      parents: ["Appalachia"],
      cross: "Appalachia-derived cut",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Cannabis Cup-winning frosty sativa"],
    curatorNote:
      "Bay 11 is a Grand Daddy Purp Genetics sativa — an Appalachia-derived cut that took a High Times Cannabis Cup — known for unusually frosty buds for a sativa. The nose is sweet and earthy: floral, piney sweetness over a skunky, herbal base. The effect is up and creative — an energetic, happy head with a light body, built for daytime. It's potent and motivating, with more trichome shine than most sativas. For a frosty, award-winning daytime lift, it's a solid pick.",
    curatorQuote:
      "Floral, piney sweetness over a skunky, herbal base.",
    sourceConfidence: "low",
  },

  // ── ROUND 4: NEW 2024–2026 DISPENSARY RELEASES ──
  {
    canonicalName: "White Truffle",
    marketNames: ["WT", "White Truffle Gelato"],
    breeder: "BeLeaf (Gorilla Butter cut; orig. Fresh Coast)",
    lineage: {
      parents: ["GG4", "Peanut Butter Breath"],
      cross: "Gorilla Butter phenotype (GG4 × Peanut Butter Breath)",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savoury truffle-and-mushroom funk over gas", "Bone-white frost on dark bud"],
    curatorNote:
      "White Truffle is a standout phenotype of Gorilla Butter — itself a cross of GG4 and Peanut Butter Breath — selected by BeLeaf around 2021 and now one of the defining savoury exotics. The nose is unusual and pungent: earthy truffle and mushroom funk over heavy gas, with almost none of the candy sweetness modern exotics chase. The effect is firmly indica-leaning — a euphoric head that sinks into a heavy, relaxing body, an evening strain. It's frosty, sticky and high-test, prized as much by hash makers as smokers. For a genuinely savoury, gassy profile off the candy path, White Truffle stands alone.",
    curatorQuote:
      "Earthy truffle and mushroom funk over heavy gas — almost no candy sweetness at all.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a savoury, heavy, frost-caked gas indica named White Truffle. A prized pale white gourmet truffle resting on dark damp earth under dramatic low light, its knobbly surface buried under a thick bone-white blanket of glittering trichome frost, an earthy, savoury mushroom haze curling around it laced with an oily petrol-rainbow shimmer for the heavy gas. Earthy truffle and mushroom funk over heavy gas, almost no sweetness. Palette dark and savoury — bone-white and silver frost dominating over deep earthy black and brown, a faint petrol shimmer and cold pale highlight in the moody shadow. Mood: heavy and relaxing — a euphoric head sinking into a sedating body, a savoury evening indica. Cinematic, painterly, high-contrast, premium editorial poster, moody and atmospheric. The strain name 'WHITE TRUFFLE' baked into the scene — branded into a wooden crate or stamped on a small enamel tag beside it. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "white-truffle.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Animal Face",
    marketNames: ["Animal Face #10"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Face Off OG", "Animal Mints"],
      cross: "Face Off OG × Animal Mints",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Piney-fuel OG over cookie sweetness", "2022 Emerald Cup winner"],
    curatorNote:
      "Animal Face is a Seed Junky cross of Face Off OG and Animal Mints that took first at the 2022 Emerald Cup — piney OG fuel welded to cookie sweetness. The nose is sharp and gassy: pine and fuel over a sweet, doughy cookie base, loud and frosty. The effect is potent and balanced-leaning-up — a euphoric, creative head with a relaxed body, versatile across the day. It runs very strong, so a little goes a long way for newer smokers. For gassy cookies done at competition level, Animal Face is a benchmark.",
    curatorQuote:
      "Pine and fuel over a sweet, doughy cookie base — loud and frosty.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a potent, frosty gas-cookie OG named Animal Face. A powerful wild wolf prowling out of a dark pine forest at dusk, its thick fur crusted in glittering silver frost like a trichome coat, breath steaming in the cold; a piney fuel haze drifts low between the trunks, catching the last amber light with a faint oily shimmer, the air loud with pine and gas over a sweet undertone. Palette deep and frosty — pine green and silver-white trichome frost over earthy shadow, an amber-gold dusk glow and faint petrol haze threading the trees. Mood: potent and balanced-leaning-up — a euphoric, creative head over a relaxed body, very strong and frosty. Cinematic, painterly, high-contrast, premium editorial poster, atmospheric and detailed. The strain name 'ANIMAL FACE' baked into the scene — carved into a weathered wooden forest sign or cut into mossy stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "animal-face.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "high",
  },
  {
    canonicalName: "Project 4516",
    marketNames: ["4516"],
    breeder: "Grandiflora Genetics",
    lineage: {
      parents: ["Gelato 45", "Platinum Puff"],
      cross: "Gelato #45 × Platinum Puff",
      parentDetails: {
        "Gelato 45": { lineageBrief: "Sunset Sherbet × Thin Mint GSC", type: "hybrid" },
        "Platinum Puff": { lineageBrief: "Platinum OG × Grateful Puff", type: "indica" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy gelato over earthy gas", "Trichome-caked, very potent"],
    curatorNote:
      "Project 4516 is a Grandiflora Genetics hybrid — Gelato #45 crossed with Platinum Puff — built for creamy dessert over a gassy, earthy base. The nose is rich: sweet gelato cream and berry cut by a fuel funk, frosty and dense. The effect leans relaxing and heavy — a euphoric head easing into real body weight, an afternoon-into-evening strain. It's high-test and trichome-caked, a connoisseur's dessert cut. For creamy-gas exotics with weight behind them, 4516 delivers.",
    curatorQuote:
      "Sweet gelato cream and berry cut by a fuel funk, frosty and dense.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Modified Grapes",
    marketNames: ["Modified Grape"],
    breeder: "Symbiotic Genetics",
    lineage: {
      parents: ["GMO Cookies", "Purple Punch"],
      cross: "GMO × Purple Punch F2",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Garlic-gas funk over grape candy"],
    curatorNote:
      "Modified Grapes is a Symbiotic Genetics cross of GMO and Purple Punch — savoury garlic-gas funk meeting grape candy. The nose is pungent and unusual: garlic and diesel over sweet grape and berry, loud and divisive. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, firmly an evening strain. It's potent, frosty and not subtle, a connoisseur's funk cut. For people who want GMO's savoury punch with a grape sweetness, Modified Grapes is a standout.",
    curatorQuote:
      "Garlic and diesel over sweet grape and berry — loud and divisive.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Snowman",
    marketNames: ["Snowman Cookies"],
    breeder: "Cookies Fam / Berner",
    lineage: {
      parents: ["Girl Scout Cookies"],
      cross: "Girl Scout Cookies phenotype",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Snow-white trichome coverage", "A parent of Gary Payton"],
    curatorNote:
      "Snowman is a prized phenotype of Girl Scout Cookies — selected by the Cookies Fam for extreme, snow-white trichome coverage — and a parent of Gary Payton. The nose is sweet and classic: vanilla cookie and earthy sweetness with a piney lift. The effect is balanced and bright — a euphoric, creative head with a relaxed body, sociable and versatile. It's frosty and potent, the GSC genome at its most resinous. For a frosty, sweet cookie cut with real pedigree, Snowman earns its name.",
    curatorQuote:
      "Vanilla cookie and earthy sweetness with a piney lift.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "The White",
    marketNames: ["Triangle", "The White Triangle"],
    breeder: "Clone-only (Krome / Florida)",
    lineage: {
      cross: "Unknown — Florida clone-only (Krome cut)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Confectioners'-sugar frost", "Unusually faint nose"],
    curatorNote:
      "The White — once passed around as 'Triangle' for Florida's golden-triangle region — is a clone-only legend whose lineage was never documented, credited to a grower known as Krome. Its calling card is the look: buds so caked in trichomes they resemble confectioners' sugar, paired with an unusually faint nose. What scent there is reads earthy and piney, more kush than candy. The effect is a heavy, relaxing body high that leans toward sleep, an evening strain. Prized for resin and as breeding stock, The White is famous for frost rather than flavour.",
    curatorQuote:
      "Buds so caked in trichomes they resemble confectioners' sugar.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sherb Crasher",
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Sunset Sherbet", "Wedding Crasher"],
      cross: "Sunset Sherbet × Wedding Crasher",
      parentDetails: {
        "Wedding Crasher": { lineageBrief: "Wedding Cake × Purple Punch", type: "hybrid" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sherbet cream over grape-gas cake"],
    curatorNote:
      "Sherb Crasher is a Seed Junky cross of Sunset Sherbet and Wedding Crasher — creamy sherbet folded into grape-and-gas cake. The nose is sweet and layered: sherbet cream and berry over a grape, gassy funk. The effect is relaxing and euphoric — a happy head easing into comfortable body weight, evening-leaning. It's frosty, potent and dessert-forward, easy to like. For sherbet sweetness with a grape-gas backbone, Sherb Crasher is a tasty pick.",
    curatorQuote:
      "Sherbet cream and berry over a grape, gassy funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "E85",
    breeder: "Grandiflora Genetics",
    lineage: {
      parents: ["Wedding Cake", "Project 4516"],
      cross: "Wedding Cake × Project 4516",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Vanilla cake over sharp diesel", "Limited-drop hype strain"],
    curatorNote:
      "E85 is a Grandiflora Genetics hybrid — Wedding Cake crossed with their own Project 4516 — named for high-octane fuel and built to match. The nose is rich and gassy: vanilla cake sweetness over a sharp diesel funk, dessert with a fuel chaser. The effect is potent and balanced-leaning-relaxed — a euphoric head over a comfortable body, versatile but strong. It's frosty and loud, a limited-drop hype strain. For gassy dessert with real horsepower, E85 lives up to the name.",
    curatorQuote:
      "Vanilla cake sweetness over a sharp diesel funk — dessert with a fuel chaser.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a gassy vanilla-cake dessert hybrid named E85 — after high-octane racing fuel. A bold yellow-and-black E85 racing fuel-grade badge mounted on slick chrome, a slice of creamy vanilla cake sitting beside it on the metal, fuel fumes and heat-haze rising with an oily petrol-rainbow sheen pooling on the chrome, a sugar-frost sparkle on the cake. Vanilla cake sweetness over a sharp diesel funk, dessert with a fuel chaser. Palette high-octane and rich — racing yellow and black with creamy vanilla-white cake and chrome, a petrol-rainbow shimmer and heat haze over a dark shadow. Mood: potent and balanced-leaning-relaxed — a euphoric head over a comfortable body, frosty and loud. Cinematic, painterly, high-contrast, premium editorial poster, glossy and atmospheric. The strain name 'E85' baked into the scene — printed boldly on the yellow fuel-grade badge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "e85.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sundae Sherbert",
    breeder: "Cannarado Genetics",
    lineage: {
      parents: ["Sundae Driver", "Sunset Sherbet"],
      cross: "Sundae Driver × Sunset Sherbet",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy, fruity, easy-drinking dessert"],
    curatorNote:
      "Sundae Sherbert is a Cannarado cross of Sundae Driver and Sunset Sherbet — two dessert smoothies in one glass. The nose is sweet and creamy: fruity sherbet and grape over a soft, piney earth. The effect is balanced and mellow — a happy, relaxing ease with a clear-enough head, comfortable across the day. It's smooth, frosty and easy-drinking rather than heavy. For creamy, fruity dessert without a knockout, Sundae Sherbert is a gentle pick.",
    curatorQuote:
      "Fruity sherbet and grape over a soft, piney earth.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a creamy, fruity, easy-drinking dessert hybrid named Sundae Sherbert. A tall sundae glass piled with scoops of colourful fruity sherbet — orange, raspberry-pink and grape-purple — drizzled with glossy grape sauce, a frosted sheen sweating off the cold scoops in soft cool light, a faint sweet vapor with a whisper of petrol-rainbow shimmer for the soft earthy base. Fruity sherbet and grape over a soft, piney earth. Palette bright and creamy — sherbet orange, raspberry pink and grape purple with cream, a frosty silver sheen and a faint petrol shimmer over a soft glow. Mood: balanced and mellow — a happy, relaxing ease with a clear head, smooth and easy-drinking. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'SUNDAE SHERBERT' baked into the scene — hand-lettered on a small enamel dessert tag or the glass. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sundae-sherbert.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry MAC",
    marketNames: ["Cherry MAC Pie"],
    breeder: "MAC line (Capulator-derived)",
    lineage: {
      parents: ["MAC", "Cherry Pie"],
      cross: "MAC × Cherry Pie (cherry-MAC line)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Cherry fruit tempering MAC diesel funk", "A line, not a fixed cut"],
    curatorNote:
      "Cherry MAC is less one strain than a line — MAC crossed with a cherry-leaning parent, most often Cherry Pie — built to temper MAC's diesel funk with red fruit. The nose is bright and complex: sweet cherry and floral fruit over MAC's creamy, gassy funk. The effect is balanced and euphoric — an uplifting, creative head with a relaxed body, sociable and potent. It's frosty and resin-heavy, keeping MAC's bag appeal. For cherry fruit on a MAC frame, it's a flavourful exotic.",
    curatorQuote:
      "Sweet cherry and floral fruit over MAC's creamy, gassy funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Studio 54",
    breeder: "Doja Pak / Deep East Farms",
    lineage: {
      parents: ["Sunset Sherbet", "OZ Kush"],
      cross: "Sunset Sherbet × OZ Kush (#54 pheno)",
      parentDetails: {
        "OZ Kush": { lineageBrief: "Zkittlez × OG Kush line", type: "hybrid" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Guava-sherbet exotic", "Sibling cut of RS11"],
    curatorNote:
      "Studio 54 is a Doja Pak / Deep East Farms exotic — Sunset Sherbet crossed with OZ Kush and pheno-hunted by Wizard Trees — a sibling of the hyped RS11 from the same project. The nose is sweet and tropical: guava and sherbet cream over a light gas. The effect is balanced and euphoric — an uplifting head settling into easy body comfort, versatile across the day. It's glassy, colourful and very frosty, a top-shelf bag-appeal cut. For guava-sherbet exotics in the RS11 family, Studio 54 is a prize.",
    curatorQuote:
      "Guava and sherbet cream over a light gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pink Picasso",
    breeder: "Wonderbrett",
    lineage: {
      parents: ["Candyland", "OZ Kush"],
      cross: "Candyland × OZ Kush",
      parentDetails: {
        "OZ Kush": { lineageBrief: "Zkittlez × OG Kush line", type: "hybrid" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy-grape boutique exotic", "Colour- and terp-selected"],
    curatorNote:
      "Pink Picasso is a Wonderbrett exotic — Candyland crossed with OZ Kush — a boutique LA cut known for colour and complex dessert terps. The nose is sweet and fruity: candy berry and grape over a soft floral base. The effect is bright and balanced — a euphoric, creative head with a relaxed body, sociable and potent. It's colourful, frosty and resin-heavy, built for looks as much as feel. For candy-grape exotics with craft pedigree, Pink Picasso stands out.",
    curatorQuote:
      "Candy berry and grape over a soft floral base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Power Sherbet",
    marketNames: ["Power Sherb"],
    breeder: "Exotic Genetix",
    lineage: {
      parents: ["Sunset Sherbet", "Cookies and Cream"],
      cross: "Sunset Sherbet × Cookies and Cream IX3",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["GSC-family cream, indica-heavy"],
    curatorNote:
      "Power Sherbet — sold as Power Sherb — is an Exotic Genetix indica crossing Sunset Sherbet with Cookies and Cream IX3, both from the GSC family. The nose is sweet and creamy: sherbet and vanilla over a nutty, earthy base with a faint gas. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, an evening and end-of-day strain. It's frosty, potent and couch-leaning. For creamy GSC sweetness with real weight, Power Sherbet delivers.",
    curatorQuote:
      "Sherbet and vanilla over a nutty, earthy base with a faint gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "High Octane OG",
    marketNames: ["Hi-Octane OG", "Octane", "Heirloom OG"],
    breeder: "Clone-only Strains",
    lineage: {
      parents: ["Chemdawg", "Lemon Thai", "Hindu Kush"],
      cross: "Chemdawg × Lemon Thai × Hindu Kush (commonly cited, not verified — clone-only OG, lineage contested)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy fuel-and-pine OG", "Deeply sedating nightcap"],
    curatorNote:
      "High Octane OG (also passed as Heirloom OG) is a clone-only OG whose exact parents were never settled — variously tied to a Chemdawg/Lemon Thai/Hindu Kush build or a stack of West Coast OG cuts. What's consistent is the profile: heavy fuel and pine over damp earth, loud and unmistakably OG. The effect is a fast, sedating body weight that points straight at the couch and sleep. It's high-test and not subtle, an evening nightcap. For a heavy, gassy OG with old-school pedigree, High Octane delivers.",
    curatorQuote:
      "Heavy fuel and pine over damp earth — loud and unmistakably OG.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, sedating fuel-and-pine OG named High Octane OG — a high-octane racing theme. A sleek race car idling on a dark night track under hot floodlights, heat shimmer and fuel fumes pouring off it, the wet asphalt slicked with an oily petrol-rainbow sheen, a redline glow and a dark pine treeline beyond the barriers, fuel-pine haze hanging heavy in the air. Heavy fuel and pine over damp earth, loud and unmistakably OG. Palette dark and high-octane — gunmetal and racing-red with hot amber floodlight, a petrol-rainbow shimmer on the wet track and pine-green shadow. Mood: fast then sedating — a heavy body weight that points straight at the couch, a potent nightcap. Cinematic, painterly, high-contrast, premium editorial poster, gritty and atmospheric. The strain name 'HIGH OCTANE OG' baked into the scene — stenciled on the track or stamped on the car's nose. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "high-octane-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry Cake",
    marketNames: ["Cherry Cake OG"],
    breeder: "Purple Caper Seeds (one of several)",
    lineage: {
      parents: ["Cherry Pie", "Wedding Cake"],
      cross: "Cherry Pie × Wedding Cake (Purple Caper; varies by breeder)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cherry fruit on a cake-sweet base", "Several regional cuts share the name"],
    curatorNote:
      "Cherry Cake is a name several breeders share, so genetics vary — the most cited build, from Purple Caper, is Cherry Pie crossed with Wedding Cake. That pairing reads in the nose: sweet cherry and berry over a vanilla, cake-sweet base. The effect is relaxing and easygoing — a happy mood-lift settling into comfortable calm, fine from afternoon on. It's frosty and flavour-led, moderate in its demands. For cherry-and-cake sweetness in a balanced hybrid, Cherry Cake is a tasty pick.",
    curatorQuote:
      "Sweet cherry and berry over a vanilla, cake-sweet base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a relaxing, easygoing cherry-and-cake dessert hybrid named Cherry Cake. A slice of vanilla cake topped with glossy ripe cherries and a glistening cherry-berry glaze dripping down the cream frosting, warm bakery light catching the soft crumb, a sugar-frost sparkle on top and a faint sweet vapor. Sweet cherry and berry over a vanilla, cake-sweet base. Palette warm and luscious — deep cherry red and berry over creamy vanilla-ivory and golden sponge, a sugar-frost sparkle under a honeyed glow. Mood: relaxing and easygoing — a happy mood-lift settling into comfortable calm, sweet and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'CHERRY CAKE' baked into the scene — hand-lettered on a small enamel dessert tag or a cake board. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cherry-cake.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Hot Sauce",
    breeder: "In House Genetics",
    lineage: {
      parents: ["Chile Verde", "Pancakes"],
      cross: "Chile Verde × Pancakes",
      parentDetails: {
        "Chile Verde": { lineageBrief: "OG Kush × (Key Lime Pie × Lavender)", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Gassy and spicy rather than sweet"],
    curatorNote:
      "Hot Sauce is an In House Genetics cross of Chile Verde and Pancakes — an unusual pairing that lands gassy and spicy rather than sweet. The nose is pungent: sharp gas and pepper-spice over an earthy, herbal base. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, firmly an evening strain. It's frosty, potent and loud. For a spicy, gassy indica-leaning cut off the dessert path, Hot Sauce brings the heat.",
    curatorQuote:
      "Sharp gas and pepper-spice over an earthy, herbal base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a gassy, spicy indica-leaning cut named Hot Sauce. Glossy fiery-red chili peppers and a dramatic splash of red hot sauce caught mid-pour against a dark moody backdrop, a spicy heat-haze rising with a faint oily petrol-rainbow shimmer hinting at the gas, a glittering trichome-frost dusting the peppers. Sharp gas and pepper-spice over an earthy, herbal base. Palette fiery and dark — molten chili red and ember-orange over charred black and earthy shadow, a frosty silver sparkle and a faint petrol shimmer in the spicy haze. Mood: heavy and relaxing — a euphoric head sinking into a sedating body, loud and potent, an evening strain. Cinematic, painterly, high-contrast, premium editorial poster, dramatic and appetizing. The strain name 'HOT SAUCE' baked into the scene — printed on a hot-sauce bottle label or stamped on a small tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "hot-sauce.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Orange Daiquiri",
    breeder: "Cannarado Genetics (pop. Jungle Boys)",
    lineage: {
      parents: ["Orange Cookies", "Grape Pie"],
      cross: "Orange Cookies × Grape Pie",
      parentDetails: {
        "Orange Cookies": { lineageBrief: "Orange Juice × GSC", type: "hybrid" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Sweet orange over a piney, gassy base"],
    curatorNote:
      "Orange Daiquiri is a Cannarado cross of Orange Cookies and Grape Pie, popularised by Jungle Boys — bright citrus over a sweet, gassy dessert base. The nose is juicy and sweet: orange and tropical fruit with a piney, diesel edge underneath. The effect is uplifting and lively — a happy, energetic head with a relaxed body, a daytime-friendly hybrid. It's terpy and frosty, flavour-forward rather than sedating. For sweet orange citrus with a gassy backbone, Orange Daiquiri is a refreshing pick.",
    curatorQuote:
      "Orange and tropical fruit with a piney, diesel edge underneath.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Georgia Pie",
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Gelatti", "Kush Mints"],
      cross: "Gelatti × Kush Mints",
      parentDetails: {
        "Gelatti": { lineageBrief: "Gelato × OGKB", type: "hybrid" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Peach-cobbler sweetness on a cookie frame"],
    curatorNote:
      "Georgia Pie is a Seed Junky cross of Gelatti and Kush Mints, named for the peach-cobbler sweetness it leans into. The nose is sweet and rich: ripe stone-fruit and sugar over a creamy, cookie base. The effect is relaxing and euphoric — a happy head easing into comfortable body weight, evening-leaning. It's frosty, potent and dessert-forward. For sweet peach-cobbler flavour on a cookie frame, Georgia Pie is a standout.",
    curatorQuote:
      "Ripe stone-fruit and sugar over a creamy, cookie base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Rainbow Belts",
    breeder: "Archive Seed Bank",
    lineage: {
      parents: ["Zkittlez", "Moonbow"],
      cross: "Zkittlez × Moonbow #112",
      parentDetails: {
        "Moonbow": { lineageBrief: "Zkittlez × Do-Si-Dos", type: "hybrid" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Pure candy, very little funk"],
    curatorNote:
      "Rainbow Belts is an Archive Seed Bank cross of Zkittlez and Moonbow — pure candy, built on the fruitiest side of the exotic shelf. The nose is sweet and loud: mixed berry and tropical candy with a grape tail, almost no funk. The effect is bright and feel-good — a euphoric, giggly head over an easy body, social and approachable. It's frosty, colourful and flavour-first. For sugar-sweet candy exotics, Rainbow Belts is a fan favourite.",
    curatorQuote:
      "Mixed berry and tropical candy with a grape tail, almost no funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Khalifa Kush",
    marketNames: ["KK", "Wiz Khalifa OG"],
    breeder: "Wiz Khalifa (private OG cut)",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush phenotype",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Lemon-pine OG, heavy and dense"],
    curatorNote:
      "Khalifa Kush (KK) is rapper Wiz Khalifa's private OG Kush cut, an indica-leaning gas strain that went commercial through Cookies. The nose is sharp and classic: lemon-pine and fuel over a damp, earthy OG base. The effect is heavy and relaxing — a euphoric head sinking into a strong, sedating body, an evening strain. It's potent, dense and gassy, a name-brand OG. For a lemony, heavy OG with celebrity pedigree, Khalifa Kush delivers.",
    curatorQuote:
      "Lemon-pine and fuel over a damp, earthy OG base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, lemony-pine evening OG indica named Khalifa Kush — 'Khalifa' meaning caliph, a ruler. A grand caliph's palace courtyard at sunset: scalloped Moorish arches, inlaid geometric mosaic, a still reflecting pool catching the gold-amber sky, brass lanterns glowing low. The warm air shimmers with a faint fuel haze drifting between the columns, and lemon-citrus and pine cut through the heavy dusk; the polished stone has an oily, resinous sheen where the last light pools. Palette regal and deep — amber and lemon-gold sunset over earthy ochre stone, brass and emerald tilework, sinking into a wine-dark indigo evening. Mood: royal, opulent, sedating — a euphoric head sinking into a strong, heavy body, an evening crown. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'KHALIFA KUSH' baked into the scene — carved and gilded into the palace stone above the central arch. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "khalifa-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── ROUND 5: PARENT-LINE FILL + MORE 2024–2026 RELEASES ──
  {
    canonicalName: "Wedding Crasher",
    breeder: "Symbiotic Genetics",
    lineage: {
      parents: ["Wedding Cake", "Purple Punch"],
      cross: "Wedding Cake × Purple Punch",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Vanilla cake over grape candy", "A parent of Sherb Crasher and Hippie Crasher"],
    curatorNote:
      "Wedding Crasher is a Symbiotic Genetics cross of Wedding Cake and Purple Punch — vanilla-cake sweetness lifted by grape candy. The nose is bright and sweet: grape and berry over a soft vanilla, earthy base, more fruit than gas. The effect is unusually up for a Purple Punch cross — a happy, uplifting head with a relaxed body, good across the day. It's frosty and flavour-forward, and it shows up as a parent across the modern 'crasher' line. For sweet grape-and-vanilla without the couch, Wedding Crasher is a bright pick.",
    curatorQuote:
      "Grape and berry over a soft vanilla, earthy base — more fruit than gas.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Gelatti",
    breeder: "Cookies / Connected",
    lineage: {
      parents: ["Gelato", "OGKB"],
      cross: "Gelato × OGKB",
      parentDetails: {
        "OGKB": { lineageBrief: "OG Kush Breath — a GSC cut", type: "hybrid" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy gas Gelato cross", "A parent of Georgia Pie and Sticky Buns"],
    curatorNote:
      "Gelatti is a Cookies/Connected cross of Gelato and OGKB — Gelato's cream married to a cookie-gas funk. The nose is sweet and rich: creamy gelato over an earthy, gassy base, smooth rather than loud. The effect is balanced and easy — a euphoric, relaxed high that settles the body without flattening the head. It's frosty, potent and versatile, which is why it parents so many modern dessert crosses (Georgia Pie, Sticky Buns). For creamy Gelato with a little gas, Gelatti is a reliable building block.",
    curatorQuote:
      "Creamy gelato over an earthy, gassy base, smooth rather than loud.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a creamy, frosty cookie-gas dessert cross named Gelatti. A golden waffle cone piled high with creamy swirled gelato and crumbled cookie pieces, standing tall on a sunny Italian cobblestone street, a slow melt-drip catching warm afternoon light, a glistening frosted sheen on the cold cream; a faint curl of vapor carries an oily petrol-rainbow shimmer that hints at the gas underneath. Creamy gelato over an earthy, gassy base, smooth rather than loud. Palette warm and luscious — cream and caramel-gold with cookie-brown crumble over honeyed Italian street light, a frosty silver sheen and a faint petrol shimmer in the air. Mood: balanced and easy — a euphoric, relaxed high that settles the body, smooth and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'GELATTI' baked into the scene — hand-lettered on a gelateria sign or a small enamel cone tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gelatti.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "OZ Kush",
    marketNames: ["OZK"],
    breeder: "OZ Kushman",
    lineage: {
      parents: ["Zkittlez", "OG Kush"],
      cross: "Zkittlez × OG Kush",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy fruit over OG gas", "A parent of RS11, Studio 54 and Pink Picasso"],
    curatorNote:
      "OZ Kush is OZ Kushman's Zkittlez × OG Kush — candy fruit folded onto a gassy OG frame, and one of the quiet workhorses of the modern exotic scene. The nose is sweet and tropical with a fuel undertone: berry and tropical candy over earthy gas. The effect is balanced and euphoric — an uplifting head over a relaxed body, sociable and potent. It's frosty and resin-heavy, prized less for its own fame than for the heavyweights it parents (RS11, Studio 54, Pink Picasso). For candy-and-gas genetics at the source, OZ Kush is foundational.",
    curatorQuote:
      "Berry and tropical candy over earthy gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty candy-and-gas exotic named OZ Kush — a playful nod to a magical land of Oz. A glowing emerald city rising on the horizon at the end of a golden winding path through candy-bright fields of berry and tropical color, a magical green-gold sky above; a fuel-gas haze drifts low across the path with a faint oily petrol-rainbow shimmer, a glittering trichome-frost sparkle in the air. Berry and tropical candy over earthy gas. Palette magical and vivid — emerald green and gold with candy berry-pink and tropical hues, a frosty sparkle and a faint petrol shimmer over a dreamy glow. Mood: balanced and euphoric — an uplifting head over a relaxed body, sociable and potent. Cinematic, painterly, high-contrast, premium editorial poster, whimsical and atmospheric. The strain name 'OZ KUSH' baked into the scene — carved into a roadside archway or a wooden trail sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no recognizable franchise designs, no cannabis leaves, buds or packaging.",
    artFileName: "oz-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Moonbow",
    marketNames: ["Moonbow #112"],
    breeder: "Archive Seed Bank",
    lineage: {
      parents: ["Zkittlez", "Do-Si-Dos"],
      cross: "Zkittlez × Do-Si-Dos",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy berry over a heavy Do-Si-Dos body", "A parent of Rainbow Belts"],
    curatorNote:
      "Moonbow is an Archive Seed Bank cross of Zkittlez and Do-Si-Dos — candy berry sweetness welded to a heavy, frosty indica body. The nose is sweet and fruity: mixed berry and grape over a faint gas, candy-forward. The effect leans relaxing — a euphoric head that eases into real body weight, more evening than day. It's frosty and potent, and it passes its candy nose down to Rainbow Belts. For sweet fruit with an indica backbone, Moonbow is a flavourful pick.",
    curatorQuote:
      "Mixed berry and grape over a faint gas, candy-forward.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Orange Cookies",
    breeder: "Franchise Genetics",
    lineage: {
      parents: ["Orange Juice", "Girl Scout Cookies"],
      cross: "Orange Juice × GSC",
      parentDetails: {
        "Orange Juice": { lineageBrief: "Orange-citrus selection", type: "hybrid" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Orange citrus on a GSC base", "A parent of Orange Daiquiri"],
    curatorNote:
      "Orange Cookies is a Franchise Genetics cross of Orange Juice and GSC — bright orange citrus laid over a cookie base. The nose is juicy and sweet: orange and tangerine over a creamy, earthy cookie funk. The effect is uplifting and happy — a sociable, lightly energetic head with a relaxed body, daytime-friendly. It's flavour-forward and approachable, and it carries the orange into crosses like Orange Daiquiri. For sweet citrus with cookie depth, Orange Cookies is a tasty hybrid.",
    curatorQuote:
      "Orange and tangerine over a creamy, earthy cookie funk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chile Verde",
    breeder: "In House Genetics",
    lineage: {
      parents: ["OG Kush", "Key Lime Pie"],
      cross: "OG Kush × (Key Lime Pie × Lavender)",
      parentDetails: {
        "Key Lime Pie": { lineageBrief: "GSC phenotype", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Gassy and spicy rather than sweet", "A parent of Hot Sauce"],
    curatorNote:
      "Chile Verde is an In House Genetics OG cross — OG Kush over a Key Lime Pie and Lavender base — that lands gassy and herbal-spicy. The nose is pungent: sharp gas and pepper-spice over an earthy, herbal floor. The effect is relaxing and heavy — a euphoric head sinking toward the body, an evening-leaning strain. It's frosty and potent, and it passes its gas-and-spice down to Hot Sauce. For a savoury, gassy OG off the candy path, Chile Verde delivers.",
    curatorQuote:
      "Sharp gas and pepper-spice over an earthy, herbal floor.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a savoury, gassy-and-spicy OG hybrid named Chile Verde — green chile, not candy. A Southwest cantina courtyard at night: thick ristras of glossy green chiles hang against a weathered adobe wall, a low gas-blue flame roasts peppers in the corner and sends fragrant smoke drifting through the warm night air, strung lanterns and an ember glow lighting the scene. Palette deep and savoury — night indigo and chile green with ember-amber and a gas-blue flame, earthy adobe brown, a frosty sheen and a faint petrol haze in the smoke. Mood: relaxing and heavy — a euphoric warmth sinking toward the body, evening-leaning and unhurried. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'CHILE VERDE' baked into the scene — hand-painted on the adobe wall or a wooden sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "chile-verde.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Gelato 45",
    marketNames: ["Gelato #45"],
    breeder: "Cookies Fam / Sherbinski",
    lineage: {
      parents: ["Sunset Sherbet", "Thin Mint GSC"],
      cross: "Sunset Sherbet × Thin Mint GSC (gassier pheno)",
      parentDetails: {
        "Thin Mint GSC": { lineageBrief: "Peppermint GSC phenotype", type: "hybrid" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["A gassier Gelato pheno", "A parent of Project 4516"],
    curatorNote:
      "Gelato 45 is a gassier numbered cut from the same Sunset Sherbet × Thin Mint GSC line as the rest of Gelato — selected for more fuel under the cream. The nose is sweet and rich: sherbet cream and berry over a pronounced gas. The effect is balanced-leaning-relaxed — a euphoric head over a comfortable body, versatile and potent. It's very frosty, and it shows up as a parent of Project 4516. For Gelato with extra gas, #45 is a flavourful cut.",
    curatorQuote:
      "Sherbet cream and berry over a pronounced gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a gassier numbered Gelato cut named Gelato 45 — Gelato with the fuel turned up. Scoops of creamy sherbet gelato in a brushed-steel gelato tin, the cold cream glistening under a pronounced oily petrol-rainbow gas sheen, a heavier fuel haze rising off it than a normal Gelato, berry-sherbet swirls and a frosted sheen catching cool light. Sherbet cream and berry over a pronounced gas. Palette creamy and electric — sherbet pink, cream and berry-violet slicked with a strong oily petrol-rainbow shimmer over brushed steel, a frosty silver sheen and gassy haze. Mood: balanced-leaning-relaxed — a euphoric head over a comfortable body, very frosty and gassy. Cinematic, painterly, high-contrast, premium editorial poster, glossy and atmospheric. The strain name 'GELATO 45' baked into the scene — stamped on the steel tin or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gelato-45.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Platinum Puff",
    breeder: "Grateful Farms / Grandiflora",
    lineage: {
      parents: ["Platinum OG", "Grateful Puff"],
      cross: "Platinum OG × Grateful Puff",
      parentDetails: {
        "Grateful Puff": { lineageBrief: "GSC × OG line", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy, frosty, gassy-sweet indica", "A parent of Project 4516"],
    curatorNote:
      "Platinum Puff is a heavy indica cross of Platinum OG and Grateful Puff — frosty, gassy and sweet, built for weight. The nose is dense: gas and damp earth with a sweet, skunky edge. The effect is strongly sedating — a euphoric head that sinks fast into a heavy body, firmly an evening strain. It's potent and couch-leaning, and it lends that weight to Project 4516. For a frosty, gassy knockout indica, Platinum Puff fits.",
    curatorQuote:
      "Gas and damp earth with a sweet, skunky edge.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Jet Fuel Gelato",
    marketNames: ["Jet Fuel Gelato 41"],
    breeder: "Compound Genetics",
    lineage: {
      parents: ["Jet Fuel", "Gelato 41"],
      cross: "Jet Fuel × Gelato 41",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["High-octane diesel over gelato cream", "A parent of Grape Gas"],
    curatorNote:
      "Jet Fuel Gelato is a Compound Genetics cross of Jet Fuel and Gelato 41 — sharp diesel meeting gelato cream, all high-octane uplift. The nose is loud and gassy: heavy diesel and fuel over a sweet, creamy base. The effect is energetic and clear — a euphoric, focused head with a light body, more daytime than couch despite the heavy nose. It's potent and frosty, and it lends its gas to Grape Gas. For diesel with a sweet edge and a real lift, Jet Fuel Gelato delivers.",
    curatorQuote:
      "Heavy diesel and fuel over a sweet, creamy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an energetic, high-octane diesel-gelato hybrid named Jet Fuel Gelato. A swirl of creamy gelato in a brushed-steel dish slicked with a heavy oily petrol-rainbow fuel sheen, an energetic jet-exhaust vapor trail and heat-shimmer streaking off it across a bright daytime sky, a frosted sheen on the cold cream. Heavy diesel and fuel over a sweet, creamy base. Palette bright and high-octane — creamy ivory and sherbet pastel slicked with a strong petrol-rainbow shimmer over steel and sky-blue, a frosty sheen and energetic exhaust streaks. Mood: energetic and clear — a euphoric, focused head with a light body, a daytime gas lift. Cinematic, painterly, high-contrast, premium editorial poster, glossy and dynamic. The strain name 'JET FUEL GELATO' baked into the scene — stamped on the steel dish or a runway-style marking. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "jet-fuel-gelato.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pink Guava",
    breeder: "OZ Kushman",
    lineage: {
      parents: ["OZ Kush"],
      cross: "An OZ Kush F2 selection (DEO Farms / OZ Kushman; behind RS11 and the soap-funk exotics)",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Tropical guava sweetness", "Behind RS11 and the soap-funk exotics"],
    curatorNote:
      "Pink Guava is an OZ Kushman guava selection — a clone-line whose exact recipe stays in-house, prized for a clean tropical-fruit nose. The smell is sweet and exotic: ripe guava and tropical fruit over a soft floral base, with little gas. The effect is balanced and easy — a euphoric, relaxed high that stays comfortable across the day. It matters as much for its descendants — it's behind RS11 and the soap-funk exotics — as for itself. For pure guava sweetness, Pink Guava is the source cut.",
    curatorQuote:
      "Ripe guava and tropical fruit over a soft floral base, with little gas.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Rainbow Sherbet",
    marketNames: ["Rainbow Sherbert"],
    breeder: "Sherbinski",
    lineage: {
      parents: ["Champagne", "Blackberry"],
      cross: "Champagne #11 × Blackberry",
      parentDetails: {
        "Champagne": { lineageBrief: "Boggle Gum × Burmese", type: "hybrid" },
        "Blackberry": { lineageBrief: "Black Domina × Raspberry Cough line", type: "hybrid" },
      },
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Creamy fruit-sherbet", "Colourful, dessert-forward"],
    curatorNote:
      "Rainbow Sherbet is a Sherbinski cross of Champagne and Blackberry — creamy fruit-sherbet with colourful, candy-bright buds. The nose is sweet and creamy: mixed berry and fruit over a soft, ice-cream sweetness. The effect is happy and easy — a giggly, uplifting head over a relaxed body, sociable and gentle. It's frosty and flavour-led rather than heavy, prized for its colour and taste. For creamy berry-sherbet sweetness, Rainbow Sherbet is a cheerful pick.",
    curatorQuote:
      "Mixed berry and fruit over a soft, ice-cream sweetness.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blue Zushi",
    breeder: "Ten Co",
    lineage: {
      parents: ["Zkittlez", "Kush Mints"],
      cross: "Zkittlez × Kush Mints #11",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy fruit with a minty gas tail", "Very frosty, 30%+ THC cuts"],
    curatorNote:
      "Blue Zushi is a Ten Co cross of Zkittlez and Kush Mints #11 — candy fruit up front, minty gas underneath, and frost for days. The nose is sweet and loud: berry and grape candy over a cool mint and light gas. The effect leans relaxing — a euphoric head easing into a calm, heavy body, evening-friendly. It's very potent and trichome-caked, part of the colourful 'Zushi' line. For candy fruit with a minty-gas backbone, Blue Zushi is a standout.",
    curatorQuote:
      "Berry and grape candy over a cool mint and light gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Super Boof",
    marketNames: ["Superboof", "Blockberry"],
    breeder: "Blockhead / Mobilejay",
    lineage: {
      parents: ["Black Cherry Punch", "Tropicana Cookies"],
      cross: "Black Cherry Punch × Tropicana Cookies",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Cherry-citrus candy", "Leafly Strain of the Year 2024"],
    curatorNote:
      "Super Boof — first bred as 'Blockberry' by Blockhead, then renamed and popularised by Mobilejay — is a Black Cherry Punch × Tropicana Cookies cross that took Leafly's 2024 Strain of the Year. The nose is bright and fruity: dark cherry and orange citrus over a sweet, berry base. The effect is balanced and lively — a euphoric, happy head with enough body to stay comfortable, versatile across the day. It's frosty, very potent and easy to love. For cherry-citrus candy with award pedigree, Super Boof earns the hype.",
    curatorQuote:
      "Dark cherry and orange citrus over a sweet, berry base.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Apple Tartz",
    lineage: {
      parents: ["Apple Fritter", "Runtz"],
      cross: "Apple Fritter × Runtz",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Sweet apple-pastry over candy"],
    curatorNote:
      "Apple Tartz pairs Apple Fritter's sweet-and-savoury pastry with Runtz candy — green-apple dessert with a faint gas edge. The nose is bright and sweet: green apple and sugary pastry over a light fruity gas. The effect is balanced and feel-good — a euphoric, creative head with a relaxed body, sociable and approachable. It's frosty and flavour-forward, an easy-drinking modern exotic. For sweet apple-and-candy character, Apple Tartz is a tasty pick.",
    curatorQuote:
      "Green apple and sugary pastry over a light fruity gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemon Cherry Push Pop",
    marketNames: ["Push Pop"],
    breeder: "Backpack Boyz (LCG line)",
    lineage: {
      parents: ["Lemon Cherry Gelato"],
      cross: "Lemon Cherry Gelato selection",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Cherry-lemon candy", "Heavy bag appeal, hype name"],
    curatorNote:
      "Lemon Cherry Push Pop is a Lemon Cherry Gelato selection from the Backpack Boyz orbit — pure candy, named for the frozen sweet. The nose is bright and fruity: sweet cherry and lemon over a creamy gelato base, candy-forward. The effect is balanced and easy — a euphoric, happy head over a relaxed body, sociable and gentle. Like LCG it trades heavily on bag appeal and flavour, and like LCG it's widely imitated. For cherry-lemon candy in the hyped exotic lane, Push Pop is a sweet pick.",
    curatorQuote:
      "Sweet cherry and lemon over a creamy gelato base, candy-forward.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pink Certz",
    marketNames: ["Certz"],
    breeder: "Compound Genetics",
    lineage: {
      parents: ["Grape Gas", "The Menthol"],
      cross: "Grape Gasoline × The Menthol",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Grape gas with a menthol-mint snap"],
    curatorNote:
      "Pink Certz is a Compound Genetics cross of Grape Gasoline and The Menthol — grape candy and diesel cut by a cool menthol-mint edge. The nose is sweet and sharp: grape and berry over a gassy base with a fresh, minty top note. The effect is relaxing and euphoric — a happy head easing into a comfortable body, balanced but potent. It's very frosty and loud, a flavour-forward modern exotic. For grape gas with a menthol twist, Pink Certz stands out.",
    curatorQuote:
      "Grape and berry over a gassy base with a fresh, minty top note.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty grape-gas exotic with a menthol snap named Pink Certz — its name a nod to pink candy mints. A glossy spill of pink candy mint lozenges scattered with deep-purple grapes, a cool menthol vapor curling off them in the chilled light, a glittering trichome-frost dusting the candy; an oily petrol-rainbow shimmer threads the minty haze, hinting at the grape-gas underneath. Grape and berry over a gassy base with a fresh, minty top note. Palette cool and candy — bubblegum pink and grape-purple with mint-green vapor and frost-silver sparkle, an oily petrol shimmer over a soft cool shadow. Mood: relaxing and euphoric — a happy head easing into a comfortable body, balanced, frosty and loud. Cinematic, painterly, high-contrast, premium editorial poster, glossy and atmospheric. The strain name 'PINK CERTZ' baked into the scene — printed on a candy-roll wrapper or stamped on a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "pink-certz.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Guava",
    marketNames: ["Guava Cake"],
    breeder: "Cookies",
    lineage: {
      parents: ["Gelato"],
      cross: "Gelato phenotype",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Tropical guava Gelato pheno"],
    curatorNote:
      "Guava is a Cookies-camp Gelato phenotype selected for a bright tropical-fruit nose rather than the usual sherbet. The smell is sweet and juicy: ripe guava and tropical fruit over Gelato's creamy base. The effect is balanced and easy — a euphoric, relaxed high that stays comfortable across the day. It's frosty and flavour-led, an approachable dessert cut. For tropical guava on a Gelato frame, it's a sweet, likeable pick.",
    curatorQuote:
      "Ripe guava and tropical fruit over Gelato's creamy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Cherry Gelato",
    lineage: {
      parents: ["Black Cherry Funk", "Acai"],
      cross: "Black Cherry Funk × Acai (First Class Genetics, clone-only; genetics vary by grower — not verified)",
      parentDetails: {
        "Black Cherry Funk": { type: "indica" },
      },
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Dark cherry over Gelato cream", "Genetics vary by grower"],
    curatorNote:
      "Black Cherry Gelato is a dark-fruit Gelato cross whose exact parents vary by grower — what's consistent is the cherry. The nose is rich and sweet: dark cherry and berry over a creamy, faintly gassy base. The effect leans relaxing — a euphoric head easing into a calm, heavy body, evening-friendly. It's frosty and flavour-forward, a comfortable dessert indica-lean. For dark cherry on a Gelato base, it's a tasty, mellow pick.",
    curatorQuote:
      "Dark cherry and berry over a creamy, faintly gassy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "The Menthol",
    breeder: "Compound Genetics",
    lineage: {
      parents: ["Gelato 45", "White Diesel"],
      cross: "Gelato 45 × (White Diesel × (High Octane × Jet Fuel)) — Compound Genetics",
      parentDetails: {
        "Gelato 45": { lineageBrief: "Gelato phenotype", type: "hybrid" },
        "White Diesel": { type: "sativa" },
      },
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Cool menthol over gas funk", "A parent of Pink Certz"],
    curatorNote:
      "The Menthol is a Compound Genetics cut whose recipe stays in-house — named for an unusual cooling, menthol-mint note over gas. The nose is distinctive: cool mint and herbal sharpness over an earthy, gassy funk, unlike most candy exotics. The effect is balanced and easy — a euphoric, relaxed high, potent but versatile. It's very frosty and loud, prized for the menthol character it passes to crosses like Pink Certz. For a genuinely minty, gassy profile, The Menthol is a one-off.",
    curatorQuote:
      "Cool mint and herbal sharpness over an earthy, gassy funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a cooling, frosty, gassy exotic named The Menthol. A dark surface sheathed in glittering mint-green ice crystals, a cold menthol vapor curling off it like an icy breath, frost feathering across frozen glass; beneath the chill an earthy, gassy funk smolders — a faint warm haze and oily petrol shimmer bleeding up through the cold, mint-sharp light against gassy shadow. Cool mint and herbal sharpness sit over an earthy, gassy funk. Palette icy and electric — cool mint and frost-white crystal with menthol cyan over a smoky earthy black, a faint petrol-rainbow shimmer warming the gassy depths. Mood: balanced and easy — a euphoric, relaxed high, very frosty and loud, cooling yet potent. Cinematic, painterly, high-contrast, premium editorial poster, crystalline and atmospheric. The strain name 'THE MENTHOL' baked into the scene — etched into frosted glass or frozen into the mint-green ice. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "the-menthol.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Wedding Pie",
    breeder: "Cannarado Genetics",
    lineage: {
      parents: ["Wedding Cake", "Grape Pie"],
      cross: "Wedding Cake × Grape Pie",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Grape-and-vanilla cake", "Relaxing, dessert-forward"],
    curatorNote:
      "Wedding Pie is a Cannarado cross of Wedding Cake and Grape Pie — vanilla cake sweetness over dark grape. The nose is rich and sweet: grape and berry over a doughy, vanilla base. The effect is relaxing and happy — a euphoric head settling into a comfortable, slightly heavy body, evening-leaning. It's frosty and flavour-forward, easy to enjoy. For grape-and-vanilla cake in a mellow package, Wedding Pie is a satisfying pick.",
    curatorQuote:
      "Grape and berry over a doughy, vanilla base.",
    sourceConfidence: "medium",
  },

  // ── ROUND 6: CLASSIC PARENT-LINE FILL + LEGENDS ──
  {
    canonicalName: "Cinderella 99",
    marketNames: ["Cindy 99", "C99"],
    breeder: "Brothers Grimm",
    lineage: {
      parents: ["Jack Herer", "Shiva Skunk"],
      cross: "Jack Herer × Shiva Skunk",
      parentDetails: {
        "Shiva Skunk": { lineageBrief: "Northern Lights #5 × Skunk #1", type: "indica" },
      },
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Tropical-fruit 'dream' sativa", "Parent of Cinex, Sour Apple and Space Queen"],
    curatorNote:
      "Cinderella 99 (Cindy 99) is a Brothers Grimm legend from the late 90s — a Jack Herer × Shiva Skunk cross famed for a tropical-fruit nose rare in its day. The smell is sweet and bright: pineapple and citrus over a light floral haze. The effect is a fast, dreamy cerebral lift — euphoric, energetic and creative, a true daytime sativa. It's potent and uplifting, and its sweet terps run through Cinex, Sour Apple and Space Queen. For fruity sativa genetics at the source, C99 is foundational.",
    curatorQuote:
      "Pineapple and citrus over a light floral haze.",
    sourceConfidence: "medium",
    tagline: "Stroke of Magic",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Cinderella 99 \"Cindy\", a dreamy fairytale sativa with the air of a glass-slippered heroine slipping away at the turn of midnight. A radiant golden coach drawn through a moonlit cobblestone courtyard, pumpkin-curved and lantern-lit, trailing a comet-tail of pineapple-gold sparks and drifting petals. Palette of sweet pineapple yellow, ripe tropical-fruit amber and citrus blush against deep twilight violets, lit by a warm shimmering fairy-glow. Mood is euphoric, uplifted and creatively buoyant, motion sweeping and weightless, lit by clear daytime light breaking gold at dawn's edge. Cinematic, painterly, high-contrast, premium editorial poster. The name CINDERELLA 99 is carved into the gilded coach door panel as ornate raised filigree, part of the scene itself. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Vortex",
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["Apollo 13", "Space Queen"],
      cross: "Apollo 13 × Space Queen",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Spun-citrus sativa", "A parent of Cinex"],
    curatorNote:
      "Vortex is a TGA/Subcool cross of Apollo 13 and Space Queen — a bright, sativa-leaning hybrid built around tropical citrus. The nose is zesty and sweet: lemon and tropical fruit over a light herbal base. The effect is energetic and clear — an uplifting, creative head with a focused edge, a daytime strain. It's terpy and potent, and it lends its citrus lift to Cinex. For a clean, spun-citrus sativa, Vortex is a flavourful classic.",
    curatorQuote:
      "Lemon and tropical fruit over a light herbal base.",
    sourceConfidence: "medium",
    tagline: "Citrus cyclone",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Vortex — TGA Subcool's bright sativa-hybrid (Apollo 13 × Space Queen), zesty, tropical and spinning with energy. A luminous spiralling vortex over a sunlit tropical sea at midday: a towering whirlwind of citrus mist, lemon peel, orange slices and tropical petals caught spinning in a glowing funnel of light, sea spray catching the sun, sky bright and electric. Palette of lemon-gold, tropical orange and zesty lime-green swirling against pale sea-blue and bright cloud-white, saturated and kinetic. Mood: fast, soaring, exhilarated — energetic creative euphoria in constant spin, everything swept upward and bright. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'VORTEX' carved into a weathered driftwood plank resting on the calm sand in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Appalachia",
    breeder: "Bodhi Seeds",
    lineage: {
      parents: ["Green Crack", "Tres Dawg"],
      cross: "Green Crack × Tres Dawg",
      parentDetails: {
        "Tres Dawg": { lineageBrief: "Chemdawg × (Afghani × Chemdawg)", type: "hybrid" },
      },
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Gassy, energetic chem cross", "A parent of Bay 11"],
    curatorNote:
      "Appalachia is a Bodhi Seeds cross of Green Crack and Tres Dawg — chem gas with an energetic, citrus lift. The nose is sharp and gassy: diesel and sour earth with a bright citrus edge. The effect is up and lively — an uplifting, happy head with enough body to stay grounded, daytime-leaning despite the gas. It's frosty and potent, and it passes its frost and lift to Bay 11. For energetic chem genetics, Appalachia is a solid parent line.",
    curatorQuote:
      "Diesel and sour earth with a bright citrus edge.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an energetic, gassy chem hybrid named Appalachia — after the blue-ridge mountains. Layered Appalachian ridgelines rolling to the horizon at bright early morning, forested slopes fading from green to hazy blue; a low diesel-tinged haze pools in the valleys and catches the rising sun in oily amber-gold streaks, citrus-bright light breaking sharp over the nearest ridge. Sour earth and fuel funk hang in the cool air with a zesty citrus edge. Palette crisp and energetic — fresh forest green and ridge-blue under a lemon-gold sunrise, with a sour amber haze and faint petrol shimmer threading the valleys. Mood: uplifting, lively, grounded — a happy energetic head with steady body, a daytime gas hitter. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'APPALACHIA' baked into the scene — carved into a weathered wooden ridge-trail sign or cut into the nearest rock face. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "appalachia.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mendo Montage",
    marketNames: ["Montage"],
    breeder: "Gage Green Genetics",
    lineage: {
      parents: ["Mendo Purps", "Crystal Locomotive"],
      cross: "Mendo Purps × Crystal Locomotive",
      parentDetails: {
        "Mendo Purps": { lineageBrief: "Mendocino purple selection", type: "indica" },
        "Crystal Locomotive": { lineageBrief: "Trainwreck × Trinity", type: "hybrid" },
      },
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet purple workhorse", "A parent of Mendo Breath"],
    curatorNote:
      "Mendo Montage is a Gage Green cross of Mendo Purps and Crystal Locomotive — a sweet, frosty purple line from Northern California. The nose is sweet and fruity: berry and grape over an earthy base. The effect is relaxing and pleasant — a happy, calming high that leans comfortable rather than knockout. It's frosty and resin-heavy, and it's the purple half behind Mendo Breath. For sweet purple genetics, Mendo Montage is a dependable parent.",
    curatorQuote:
      "Berry and grape over an earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry AK-47",
    marketNames: ["Cherry AK"],
    breeder: "Selective cut",
    lineage: {
      parents: ["Cherry", "AK-47"],
      cross: "Cherry × AK-47",
      parentDetails: {
        "Cherry": { lineageBrief: "cherry-leaning selection", type: "hybrid" },
      },
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Cherry-sweet AK selection", "A parent of Cherry Punch"],
    curatorNote:
      "Cherry AK-47 is a cherry-leaning selection of the classic AK-47 — sweet red fruit over AK's floral funk. The nose is sweet and fruity: cherry and berry over an earthy, skunky base. The effect is balanced and uplifting — a happy, sociable head with a relaxed body, mellow despite the AK name. It's terpy and approachable, and it carries the cherry into Cherry Punch. For sweet-cherry character on a mellow classic, Cherry AK is a likeable parent.",
    curatorQuote:
      "Cherry and berry over an earthy, skunky base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Fruity Pebbles OG",
    marketNames: ["FPOG", "Fruity Pebbles", "Fruity OG"],
    breeder: "Alien Genetics",
    lineage: {
      parents: ["Green Ribbon", "Granddaddy Purple", "Tahoe OG", "Alien Kush"],
      cross: "(Green Ribbon × Granddaddy Purple) × (Tahoe OG × Alien Kush)",
      parentDetails: {
        "Green Ribbon": { lineageBrief: "Trainwreck × Trinity × Aloha White Widow", type: "hybrid" },
        "Alien Kush": { lineageBrief: "Las Vegas Purple Kush × Alien Tech", type: "hybrid" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Cereal-sweet exotic", "A parent of Sundae Driver"],
    curatorNote:
      "Fruity Pebbles OG is an Alien Genetics exotic — a four-way blend of Green Ribbon, Granddaddy Purple, Tahoe OG and Alien Kush — named for its breakfast-cereal sweetness. The nose is loud and fruity: mixed berry and tropical candy over a faint earthy gas. The effect is balanced and happy — a euphoric, creative head with a relaxed body, sociable and potent. It's frosty and flavour-forward, and it's the fruity half behind Sundae Driver. For cereal-sweet exotic genetics, FPOG is a building block.",
    curatorQuote:
      "Mixed berry and tropical candy over a faint earthy gas.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Larry OG",
    marketNames: ["Lemon Larry", "Lemon Larry OG"],
    breeder: "Holy Grail / Liberty Reach",
    lineage: {
      parents: ["OG Kush", "SFV OG"],
      cross: "OG Kush × SFV OG",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Lemony, gassy OG", "A parent of Purple Punch"],
    curatorNote:
      "Larry OG (Lemon Larry) is a lemony OG Kush × SFV OG cross — clean gas with a citrus lift. The nose is bright OG: lemon and pine over fuel and damp earth. The effect is balanced-leaning-relaxed — a euphoric head with a comfortable body, usable through the day. It's gassy, dense and potent, and it's the OG half behind Purple Punch. For a clean, lemony gas OG, Larry is a quiet classic.",
    curatorQuote:
      "Lemon and pine over fuel and damp earth.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a clean, lemony gas-OG hybrid named Larry OG (Lemon Larry). A sun-faded California lemon grove at golden dusk: rows of lemon trees heavy with bright yellow fruit, a weathered wooden crate and a dirt track running through, a faint fuel haze and an oily petrol-sheen puddle catching the last light, dark pines at the orchard's edge. Palette bright and warm — lemon-yellow and gold with pine green over earthy brown and a petrol-blue shadow, amber dusk light, a frosted sheen, fading into a wine-dark sky. Mood: balanced and easy — a euphoric lift over a comfortable body, clean and relaxed. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'LARRY OG' baked into the scene — stencilled on the wooden crate or an orchard sign. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "larry-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Cherry Pie",
    breeder: "Cherry Pie selection",
    lineage: {
      parents: ["Cherry Pie"],
      cross: "Dark-fruit Cherry Pie phenotype",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Dark cherry pheno", "A parent of Black Cherry Punch"],
    curatorNote:
      "Black Cherry Pie is a dark-fruit phenotype of Cherry Pie, selected for deeper cherry and a richer, jammier nose. The smell is sweet and dark: black cherry and grape over an earthy, faintly gassy base. The effect leans relaxing — a euphoric head easing into a comfortable, heavy body, evening-friendly. It's frosty and flavour-forward, and it's the cherry behind Black Cherry Punch. For dark-cherry indica-lean character, it's a tasty parent cut.",
    curatorQuote:
      "Black cherry and grape over an earthy, faintly gassy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Key Lime Pie",
    breeder: "Cookies (GSC pheno)",
    lineage: {
      parents: ["Girl Scout Cookies"],
      cross: "Girl Scout Cookies phenotype (lime-forward)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Lime-and-earth GSC pheno", "A parent of Chile Verde"],
    curatorNote:
      "Key Lime Pie is a lime-leaning phenotype of Girl Scout Cookies — the GSC funk with a bright citrus-lime twist. The nose is sweet and zesty: lime and citrus over GSC's earthy, doughy base. The effect is balanced-leaning-relaxed — a euphoric head settling into a comfortable body, afternoon into evening. It's frosty and flavourful, and it lends its citrus to Chile Verde. For a lime-forward cookie cut, Key Lime Pie is a tasty GSC selection.",
    curatorQuote:
      "Lime and citrus over GSC's earthy, doughy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Champagne",
    marketNames: ["Champagne Kush"],
    breeder: "Sherbinski",
    lineage: {
      parents: ["Boggle Gum", "Burmese"],
      cross: "Boggle Gum × Burmese",
      parentDetails: {
        "Boggle Gum": { lineageBrief: "bubblegum-leaning selection", type: "hybrid" },
        "Burmese": { lineageBrief: "Burmese landrace", type: "indica" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Floral-fruit hybrid", "A parent of Rainbow Sherbet"],
    curatorNote:
      "Champagne is a Sherbinski hybrid of Boggle Gum and Burmese — a soft, floral-fruit strain that became important mostly as a parent (it's half of Rainbow Sherbet). The nose is sweet and floral: light berry and bubblegum over an earthy base. The effect is gentle and mellow — a happy, relaxing high that stays comfortable, moderate rather than overwhelming. It's smooth and flavour-led, and it passes its sweetness down to Rainbow Sherbet. For soft, floral-sweet genetics, Champagne is a pretty parent line.",
    curatorQuote:
      "Light berry and bubblegum over an earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a soft, floral-fruit, gentle hybrid named Champagne. An elegant crystal champagne flute fizzing with rising golden bubbles, caught in warm celebratory light — soft berry-pink petals and a faint bubblegum-sweet mist drifting around the glass, a delicate frosted chill sweating on the crystal, tiny effervescent sparkles glittering upward. Light berry and bubblegum over an earthy base, soft and floral. Palette elegant and warm — champagne gold and soft rose-pink with crystal highlights, a frosty sparkle and gentle floral glow over a soft warm shadow. Mood: gentle and mellow — a happy, relaxing high that stays comfortable, smooth and refined. Cinematic, painterly, high-contrast, premium editorial poster, elegant and atmospheric. The strain name 'CHAMPAGNE' baked into the scene — etched on the flute or an elegant label. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "champagne.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "OGKB",
    marketNames: ["OG Kush Breath", "OGKB 2.1"],
    breeder: "Cookies (GSC pheno)",
    lineage: {
      parents: ["Girl Scout Cookies"],
      cross: "Girl Scout Cookies phenotype (OG Kush Breath)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Heavy, gassy GSC pheno", "Parent of Gelatti, Do-Si-Dos and Mendo Breath"],
    curatorNote:
      "OGKB — OG Kush Breath — is one of the most important phenotypes of Girl Scout Cookies, a heavier, gassier cut that became a breeding cornerstone. The nose is earthy and rich: doughy cookie and gas over a faint sweetness, more savoury than candy. The effect is relaxing and heavy — a euphoric head sinking into a sedating body, evening-leaning. It's frosty and potent, and its DNA runs through Gelatti, Do-Si-Dos and Mendo Breath. For the heavy, gassy side of the cookie genome, OGKB is foundational.",
    curatorQuote:
      "Doughy cookie and gas over a faint sweetness, more savoury than candy.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Thin Mint GSC",
    marketNames: ["Thin Mint", "Thin Mints"],
    breeder: "Cookies Fam (GSC pheno)",
    lineage: {
      parents: ["Girl Scout Cookies"],
      cross: "Girl Scout Cookies phenotype (Thin Mint)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["The minty GSC cut behind Gelato"],
    curatorNote:
      "Thin Mint GSC is the minty, frosty phenotype of Girl Scout Cookies — alongside Forum, the canonical GSC cut, and the parent of the entire Gelato line. The nose is sweet and cool: mint and vanilla cookie over an earthy sweetness. The effect is balanced and bright — a euphoric, happy head with a relaxed body, sociable and versatile. It's frosty and potent, and crossing it with Sunset Sherbet gave us Gelato. For the mint side of the cookie genome, Thin Mint is the reference.",
    curatorQuote:
      "Mint and vanilla cookie over an earthy sweetness.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Sour Dubb",
    marketNames: ["Sour Dubble", "Sour Double"],
    lineage: {
      parents: ["Sour Diesel", "Sour Bubble"],
      cross: "Sour Diesel × Sour Bubble",
      parentDetails: {
        "Sour Bubble": { lineageBrief: "Bubble Gum IBL", type: "indica" },
      },
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sour-diesel funk", "One of the parents of GG4"],
    curatorNote:
      "Sour Dubb (Sour Dubble) is a sour-diesel cross — Sour Diesel into Sour Bubble — and one of the three parents that gave us GG4. The nose is loud and gassy: sharp diesel and sour funk over a sweet, earthy base. The effect is balanced and potent — a euphoric, uplifting head with a relaxing body. It's sticky, gassy and resin-heavy, an important piece of modern gas genetics. For sour-diesel funk at the root of the Glue line, Sour Dubb matters.",
    curatorQuote:
      "Sharp diesel and sour funk over a sweet, earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of a loud, sticky sour-diesel funk — root genetics of the Glue line. A resin-slick industrial fuel yard at dusk: weathered chem drums and diesel barrels, tangled pipework and dripping amber oil pooling on cracked concrete, a sour acidic haze hanging thick in the warm air over a sweet, earthy ground. Palette loud and resinous — acid sour-yellow and skunky chartreuse against diesel-petrol blue and rust-brown, sticky amber highlights glistening on every surface, sunset bleeding into a wine-dark dusk sky. Mood: balanced and potent — an uplifting euphoric head over a relaxing, resin-heavy body, loud and a little raw. Cinematic, painterly, high-contrast, premium editorial poster. Keep the lower third calmer and darker for legible overlay text. The strain name may appear baked into the scene (e.g. stencilled on a barrel or chem drum); no overlaid captions, logos or watermarks; no people, products or cannabis leaves.",
    artFileName: "sour-dubb.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chem's Sister",
    marketNames: ["Chem Sister", "Chemdawg Sister"],
    lineage: {
      parents: ["Chemdawg"],
      cross: "Chemdawg phenotype (female Chem seed)",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sativa-leaning Chem cut", "One of the parents of GG4"],
    curatorNote:
      "Chem's Sister is a sativa-leaning female found in a pack of Chemdawg seeds — a cleaner, citrus-tinged take on the chem funk, and one of the three parents of GG4. The nose is sharp and bright: diesel and sour earth with a lemony lift. The effect is up and heady — a euphoric, talkative cerebral high with a light body. It's gassy, loud and potent, the sativa side of the Glue lineage. For a brighter cut of the Chem family, Chem's Sister is a key parent.",
    curatorQuote:
      "Diesel and sour earth with a lemony lift.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a bright, sativa-leaning citrus-chem cut named Chem's Sister — the lithe, lemony sister to Chemdawg's guard dog. A sleek, poised wildcat prowling through a sunlit back-lot at midday, lean and elegant where the dog was heavy; a bright lemon-gold light cuts through a thin sour-diesel haze, the cat's fur catching a faint silvery frost, an oily petrol-rainbow sheen shimmering on the warm asphalt. Sharp and bright in the air — diesel and sour earth with a lemony lift. Palette clean and electric — sour lemon-gold and citrus over cool gunmetal and chem-green haze, a sleek silver sheen with petrol-rainbow shimmer in the light. Mood: up and heady — a euphoric, talkative cerebral lift with a light body, gassy, loud and bright. Cinematic, painterly, high-contrast, premium editorial poster, sleek and atmospheric. The strain name 'CHEM'S SISTER' baked into the scene — stenciled on a sunlit back-lot wall or stamped on the cat's slim metal collar tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "chem-s-sister.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Bubble Gum",
    marketNames: ["Bubblegum", "Indiana Bubblegum"],
    breeder: "Serious Seeds (from an Indiana cut)",
    lineage: {
      cross: "Indiana Bubblegum line (origin private)",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["True pink-bubblegum sweetness", "Mellow, even high"],
    curatorNote:
      "Bubble Gum is an Indiana classic, refined into stable seed form by Serious Seeds — famous for genuinely tasting like pink bubblegum. The nose is sweet and candy-bright: bubblegum and berry over a light floral base. The effect is mellow and cheerful — a happy, relaxed, gently euphoric high without extremes, moderate in strength. It's smooth and well-mannered, a flavour-first throwback. For true bubblegum sweetness, this is the reference.",
    curatorQuote: "Sweet bubblegum candy, smooth and nostalgic.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Purple Kush",
    marketNames: ["PK"],
    lineage: {
      parents: ["Hindu Kush", "Purple Afghani"],
      cross: "Hindu Kush × Purple Afghani",
      parentDetails: {
        "Purple Afghani": { lineageBrief: "purple Afghani landrace", type: "indica" },
      },
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Pure indica, grape-earth and heavy"],
    curatorNote:
      "Purple Kush is a pure indica — Hindu Kush crossed with Purple Afghani — out of the Oakland area, prized for colour and sedation. The nose is earthy and sweet: grape and dark berry over a sandalwood, hashy base. The effect is heavily relaxing — a warm, dreamy body weight that tips toward sleep, with little cerebral play. It's dense, frosty and potent, a textbook evening indica. For grape-earth heaviness with no surprises, Purple Kush is a dependable classic.",
    curatorQuote:
      "Grape and dark berry over a sandalwood, hashy base.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Grape Soda",
    breeder: "Cali Connection",
    lineage: {
      parents: ["Tahoe OG", "Granddaddy Purple"],
      cross: "Tahoe OG × Granddaddy Purple",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Fizzy grape candy over OG weight"],
    curatorNote:
      "Grape Soda is a Cali Connection cross of Tahoe OG and Granddaddy Purple — fizzy grape candy laid over heavy OG. The nose is sweet and fruity: grape soda and berry over an earthy, gassy base. The effect is relaxing and warm — a happy head easing into a comfortable, heavy body, evening-leaning. It's frosty and potent, sweet with real weight. For grape-candy flavour on an OG frame, Grape Soda is a satisfying indica-lean.",
    curatorQuote:
      "Grape soda and berry over an earthy, gassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Red Zushi",
    breeder: "Ten Co / Gas House",
    lineage: {
      parents: ["Zkittlez", "Kush Mints"],
      cross: "Zkittlez × Kush Mints (Zushi colour pheno)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Red-hued Zushi colour pheno"],
    curatorNote:
      "Red Zushi is a colour-selected cut from the same Zkittlez × Kush Mints line as Blue Zushi — picked for red-purple buds and a fruitier lean. The nose is sweet and loud: berry and grape candy over a cool mint and faint gas. The effect leans relaxing — a euphoric head easing into a calm body, evening-friendly. It's very frosty and flavour-forward, part of the colourful Zushi family. For candy fruit with a minty tail and red bag appeal, Red Zushi delivers.",
    curatorQuote:
      "Berry and grape candy over a cool mint and faint gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, fruity-mint candy exotic named Red Zushi — part of the colourful Zushi family. Glossy crimson-red candied gems and red-purple berries arranged on a sleek red Japanese lacquer surface, a cool mint vapor curling over them, a glittering trichome-frost dusting the candy; an oily petrol-rainbow shimmer threads the minty haze, hinting at the faint gas. Berry and grape candy over a cool mint and faint gas. Palette bold and elegant — deep crimson and ruby red with grape-purple and mint-green vapor, frost-silver sparkle and a faint petrol shimmer over glossy red lacquer. Mood: relaxing — a euphoric head easing into a calm body, evening-friendly, frosty and loud. Cinematic, painterly, high-contrast, premium editorial poster, sleek and atmospheric. The strain name 'RED ZUSHI' baked into the scene — embossed on the lacquer or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "red-zushi.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "G13",
    marketNames: ["G-13", "Government Indica"],
    breeder: "Clone-only (origin contested)",
    lineage: {
      cross: "Clone-only Afghani-type indica (origin legend)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Mythic 'government' indica", "Heavy, resinous"],
    curatorNote:
      "G13 is a clone-only legend wrapped in myth — the story claims a government lab selected the most potent Afghani indica, though no record confirms it. What's real is the flower: dense, resin-heavy buds with an earthy, pine-and-sweet nose. The effect is a heavy, relaxing body stone that drifts toward sleep, a classic evening indica. It's potent and frosty, prized as much for the legend as the smoke. For old-school heavy indica with a story, G13 endures.",
    curatorQuote:
      "Dense, resin-heavy buds with an earthy, pine-and-sweet nose.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Apollo 13",
    marketNames: ["Apollo 13 BX"],
    breeder: "Brothers Grimm",
    lineage: {
      parents: ["Genius"],
      cross: "Genius × P75 (Princess select)",
      parentDetails: {
        "Genius": { lineageBrief: "Jack Herer phenotype select", type: "sativa" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Fast, fruity sativa", "A parent of Vortex"],
    curatorNote:
      "Apollo 13 is a Brothers Grimm sativa from the same camp as Cinderella 99 — a Genius-and-Princess select known for speed and a tangy fruit nose. The smell is sweet and zesty: tropical fruit and citrus over a light herbal base. The effect is fast and clear — an energetic, creative, uplifting head with little body, a daytime strain. It's terpy and potent, and it's the bright half behind Vortex. For a quick, fruity sativa, Apollo 13 is a classic parent line.",
    curatorQuote:
      "Tropical fruit and citrus over a light herbal base.",
    sourceConfidence: "low",
    tagline: "Tangy fruit liftoff",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Apollo 13 — Brothers Grimm's fast, tangy sativa from the Cinderella 99 camp, zesty and electric. A retro 1970s launchpad at first light: a slender white rocket on its gantry trailing a plume of citrus-gold exhaust as it lifts, against a sky streaked tangerine, mango and grapefruit-pink over distant palms and a coastal haze. Palette of bright citrus-orange, tropical mango-gold and zesty grapefruit-pink against pale dawn-blue and steel-white, saturated and luminous. Mood: fast, soaring, exhilarated — energetic creative euphoria with liftoff motion, everything bright and accelerating into the morning sky. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'APOLLO 13' stencilled boldly down the side of the rocket fuselage. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },

  // ── ROUND 7: DEEP PARENT-LINE FILL + CLASSICS ──
  {
    canonicalName: "Chocolate Diesel",
    lineage: {
      parents: ["Chocolate Thai", "Sour Diesel"],
      cross: "Chocolate Thai × Sour Diesel",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Coffee-tinged diesel", "The third parent of GG4"],
    curatorNote:
      "Chocolate Diesel is a Chocolate Thai × Sour Diesel cross — sour fuel with a dark, coffee-and-cocoa undertone — and the third parent of GG4. The nose is loud and gassy: sharp diesel and sour earth with a faint chocolate sweetness. The effect is up and racy — an energetic, heady cerebral lift with little body, a daytime sativa. It's potent and very loud, and its gas runs through the Glue line. For diesel with a cocoa edge, Chocolate Diesel is a distinctive parent cut.",
    curatorQuote:
      "Sharp diesel and sour earth with a faint chocolate sweetness.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a racy, gassy diesel sativa with a cocoa edge named Chocolate Diesel. A glossy pour of molten dark chocolate and coffee cascading over a slick surface, its rich brown sheen laced with an oily petrol-rainbow shimmer where the light catches it — sour fuel haze and warm coffee steam curling up together, decadent and chemical at once. Sharp diesel and sour earth ride over a dark chocolate sweetness. Palette rich and electric — deep cocoa brown and espresso black with an oily petrol-rainbow slick, sour-amber fuel highlights and a glossy molten sheen. Mood: up and racy — an energetic, heady cerebral lift with little body, a loud daytime sativa. Cinematic, painterly, high-contrast, premium editorial poster, glossy and atmospheric. The strain name 'CHOCOLATE DIESEL' baked into the scene — embossed in the chocolate or stamped on a worn metal plate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "chocolate-diesel.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Shiva Skunk",
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Northern Lights #5", "Skunk #1"],
      cross: "Northern Lights #5 × Skunk #1",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Resin-heavy NL5 × Skunk", "A parent of Cinderella 99"],
    curatorNote:
      "Shiva Skunk is a Sensi Seeds cross of Northern Lights #5 and Skunk #1 — a resin-heavy indica that helped seed the modern catalogue (it's a parent of Cinderella 99). The nose is classic and sweet: skunky funk and pine over an earthy base. The effect is relaxing and weighty — a calm, body-leaning high that drifts toward sleep. It's dense, frosty and dependable, an 80s-90s building block. For old-school NL-and-skunk genetics, Shiva Skunk is a quiet workhorse.",
    curatorQuote:
      "Skunky funk and pine over an earthy base.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Mendo Purps",
    marketNames: ["Mendocino Purps", "Purps"],
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Mendocino purple clone-only", "Behind Mendo Montage and Grape Ape"],
    curatorNote:
      "Mendo Purps is a Mendocino County clone-only — a sweet, deeply purple indica whose exact origins were never recorded, and a foundation of the Northern California purple scene. The nose is sweet and fruity: grape and dark berry over a soft, earthy base. The effect is relaxing and pleasant — a happy, calming high that leans comfortable rather than couch-locking. It's dense, frosty and colourful, and its DNA runs through Mendo Montage and Grape Ape. For classic Mendo purple, this is a source cut.",
    curatorQuote:
      "Grape and dark berry over a soft, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tres Dawg",
    marketNames: ["Tres Dog"],
    breeder: "Bodhi Seeds",
    lineage: {
      parents: ["Chemdawg"],
      cross: "Chemdawg × (Afghani × Chemdawg) — triple Chem",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Triple-Chem indica", "Parent of Stardawg and Appalachia"],
    curatorNote:
      "Tres Dawg is a Bodhi Seeds indica — Chemdawg backcrossed through Afghani — a heavier, denser take on the chem funk. The nose is loud and gassy: diesel and sour earth with a piney edge. The effect leans relaxing — a euphoric head sinking into a weighty body, evening-friendly. It's sticky, potent and resin-heavy, and it parents both Stardawg and Appalachia. For a heavy, stable cut of the Chem family, Tres Dawg is a key line.",
    curatorQuote:
      "Diesel and sour earth with a piney edge.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy diesel-chem indica named Tres Dawg — literally 'three dogs.' Three muscular pitbulls dressed as old-school mafia bosses in sharp tailored pinstripe suits, sitting confidently around a dim back-room table at night, calmly smoking fat cigars; thick cigar smoke blends with a warm haze of diesel-petrol fumes drifting through amber lamplight. Setting: a moody noir speakeasy / garage back room — mahogany, leather, brass and weathered chrome, a faint oil-slick petrol-rainbow sheen on the floor. Palette deep and smoky — diesel-petrol blue and dark green over mahogany brown, brass and amber lamp glow fading into near-black shadow. Mood: relaxed, weighty and quietly powerful — calm, grounded, evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'TRES DAWG' baked into the scene — engraved on a brass nameplate, etched into glass, or carved into the table. Keep the lower third calmer and darker for legible overlay text. No human people, no logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "tres-dawg.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Alien Kush",
    breeder: "Alien Genetics",
    lineage: {
      parents: ["Las Vegas Purple Kush", "Alien Tech"],
      cross: "Las Vegas Purple Kush × Alien Tech",
      parentDetails: {
        "Las Vegas Purple Kush": { lineageBrief: "purple Kush selection", type: "indica" },
        "Alien Tech": { lineageBrief: "Alien Genetics OG line", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Earthy-gas OG kush", "A parent of Fruity Pebbles OG"],
    curatorNote:
      "Alien Kush is an Alien Genetics cross of Las Vegas Purple Kush and Alien Tech — an earthy, gassy OG-kush type that became important as a parent (it's part of Fruity Pebbles OG). The nose is classic and deep: earthy gas and pine with a herbal edge. The effect is relaxing and heavy — a euphoric head sinking into a comfortable body, evening-leaning. It's frosty and potent, and it lends OG weight to FPOG. For earthy OG-kush genetics, Alien Kush is a solid building block.",
    curatorQuote:
      "Earthy gas and pine with a herbal edge.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, earthy gas-OG kush hybrid named Alien Kush — purple-tinged and otherworldly. A frost-dusted clearing in a dark pine forest at dusk on an alien world: a strange smooth monolith half-buried in the earth, faint purple bioluminescence threading through the trees, a low fuel-and-earth haze drifting under a violet dusk sky where a pale second moon hangs. Palette deep, cold-meets-warm — amethyst purple and pine green over earthy brown and gas-petrol shadow, amber dusk warmth catching the frost, fading into a wine-dark violet sky; a crystalline frosted sheen on every surface. Mood: relaxing and heavy — a euphoric calm sinking into a comfortable, grounded body, evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster. The strain name may appear baked into the scene (e.g. etched into the monolith). Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "alien-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Green Ribbon",
    lineage: {
      parents: ["Trainwreck", "Trinity"],
      cross: "Trainwreck × Trinity × Aloha White Widow",
      parentDetails: {
        "Trinity": { lineageBrief: "Pacific Northwest clone-only", type: "sativa" },
      },
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet pine-citrus sativa", "A parent of Fruity Pebbles OG"],
    curatorNote:
      "Green Ribbon is a NorCal sativa blend — Trainwreck and Trinity with Aloha White Widow — known for a clean, sweet pine-and-citrus nose. The smell is bright: sweet citrus and pine over a light herbal base. The effect is up and creative — an uplifting, energetic head with a relaxed body, daytime-leaning. It's terpy and potent, and it's the sativa half behind Fruity Pebbles OG. For clean, sweet sativa genetics, Green Ribbon is a flavourful parent.",
    curatorQuote:
      "Sweet citrus and pine over a light herbal base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Sour Bubble",
    breeder: "BOG Seeds",
    lineage: {
      parents: ["Bubble Gum"],
      cross: "Bubble Gum IBL",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sour-gas Bubble Gum IBL", "A parent of Sour Dubb"],
    curatorNote:
      "Sour Bubble is a BOG Seeds inbred line of Bubble Gum — a sticky, sour-gas indica far from its sweet parent, and one half of Sour Dubb. The nose is loud: sharp diesel and sour funk over a faint berry sweetness. The effect is relaxing and potent — a euphoric head easing into a weighty body. It's extremely sticky and resin-heavy, prized by breeders for structure. For sour-gas genetics behind the Glue line, Sour Bubble matters.",
    curatorQuote:
      "Sharp diesel and sour funk over a faint berry sweetness.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sticky, sour-gas indica named Sour Bubble. A single huge gum bubble blown taut in dim, gritty light — its surface a slick of oily petrol-rainbow iridescence, diesel sheen swirling pink-violet-green across the stretched film, on the trembling edge of bursting. Around it the air hangs heavy and resinous: a faint sour-berry haze and sharp fuel funk, the dark backdrop streaked with the same oily rainbow where light catches it. Palette moody and chemical — deep diesel blacks and bruised purples lit by petrol-slick rainbow highlights, a sour magenta-and-acid-green glow over berry shadow, sticky and wet-looking. Mood: loud, sticky, sedating — a euphoric head easing into a weighty body, an evening sour-gas hitter. Cinematic, painterly, high-contrast, premium editorial poster, glossy and resinous. The strain name 'SOUR BUBBLE' baked into the scene — stretched and warped across the curve of the bubble film. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sour-bubble.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Northern Lights #5",
    marketNames: ["NL5", "NL #5"],
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Afghani"],
      cross: "Northern Lights #5 — Afghani × Thai phenotype",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["The prized NL pheno", "Parent of Shiva Skunk and Jack Herer"],
    curatorNote:
      "Northern Lights #5 is the most celebrated phenotype of Northern Lights — an Afghani-and-Thai cut that won early Cannabis Cups and seeded a huge share of modern genetics. The nose is sweet and resinous: pine and earth with a spicy sweetness. The effect is heavy and dreamy — a relaxing body stone that drifts toward sleep. It's dense, frosty and dependable, and it parents Shiva Skunk and Jack Herer. For NL at its most prized, #5 is the reference cut.",
    curatorQuote:
      "Pine and earth with a spicy sweetness.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Chocolate Thai",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Cocoa-noted Thai landrace", "Parent of Chocolate Diesel and Chocolope"],
    curatorNote:
      "Chocolate Thai is a 1960s-70s Thai landrace named for an unusual cocoa-and-coffee note — a slow, airy sativa from a different era. The nose is earthy and sweet: cocoa and spice over a woody, herbal base. The effect is gentle and clear — a bright, creative, low-anxiety head with little body, classic old-school sativa. It's mild by modern standards but historically important, parenting Chocolate Diesel and Chocolope. For the source of cannabis 'chocolate' flavour, this landrace is it.",
    curatorQuote:
      "Cocoa and spice over a woody, herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Skywalker",
    breeder: "Dutch Passion",
    lineage: {
      parents: ["Mazar", "Blueberry"],
      cross: "Mazar × Blueberry",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet berry indica-lean", "A parent of Skywalker OG"],
    curatorNote:
      "Skywalker is a Dutch Passion cross of Mazar and Blueberry — sweet berry over a hashy Afghan base, and the non-OG parent of Skywalker OG. The nose is sweet and fruity: blueberry and berry over an earthy, hashy floor. The effect is relaxing and happy — a euphoric head easing into a comfortable, heavy body, evening-leaning. It's dense, frosty and approachable. For sweet-berry indica genetics, Skywalker is a likeable parent line.",
    curatorQuote:
      "Blueberry and berry over an earthy, hashy floor.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Trinity",
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Pacific Northwest clone-only", "Behind Green Ribbon and Crystal Locomotive"],
    curatorNote:
      "Trinity is a Pacific Northwest clone-only sativa — a rare, lightly documented cut prized for a clean pine-and-citrus nose. The smell is bright and fresh: pine and lemon over a sweet, earthy base. The effect is up and clear — an uplifting, energetic head with a smooth body, daytime-friendly. It's terpy and smooth, and it shows up behind Green Ribbon and Crystal Locomotive. For clean NW sativa character, Trinity is a quiet parent line.",
    curatorQuote: "Bright pine and lemon, clean and uplifting.",
    sourceConfidence: "low",
    tagline: "Misty Coast Clone",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Trinity, a rare Pacific Northwest clone-only sativa with a clean pine-and-citrus nose, prized and lightly documented. Scene: a misty Oregon coastline at the edge of an old-growth pine forest, fog rolling between towering evergreens onto a rocky shore, a single weathered sea-stack rising from the surf, bright lemon light breaking through the mist. Palette and light: deep pine-green and misty silver-grey over earthy driftwood-brown, lifted by a clean lemon-citrus glow and skunky slate-blue; cool diffuse Pacific-Northwest daytime light cutting through coastal fog. Mood and motion: uplifted, euphoric and clear energy, fog drifting and waves rolling, the fresh crispness of a bright coastal day. Cinematic, painterly, high-contrast, premium editorial poster. The name TRINITY carved into a salt-weathered driftwood plank on the shore. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Lemon G",
    marketNames: ["Lemon G13"],
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Ohio clone-only", "One of the loudest true-lemon cuts"],
    curatorNote:
      "Lemon G is an Ohio clone-only — an Athens-area cut whose exact lineage stayed local, famous for one of the cleanest, loudest lemon noses in cannabis. The smell is pure citrus: sharp lemon and zest over a light earthy base. The effect is up and clear — an energetic, focused, uplifting head, a daytime sativa. It's terpy and potent, prized purely for that lemon. For true-lemon flavour with a clone-only legend behind it, Lemon G is a connoisseur cut.",
    curatorQuote:
      "Sharp lemon and zest over a light earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Han-Solo Burger",
    lineage: {
      parents: ["GMO Cookies", "Larry OG"],
      cross: "GMO Cookies × Larry OG (Skunk House Genetics)",
    },
    marketNames: ["Han Solo Burger"],
    breeder: "Skunk Master Flex",
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savoury cheese-gas burger cut", "A parent of Donny Burger"],
    curatorNote:
      "Han-Solo Burger is a Skunk Master Flex cut — a savoury, cheesy-gas strain in the GMO 'burger' family, and a parent of Donny Burger. The nose is pungent and savoury: cheese, gas and earth with a peppery edge, more umami than sweet. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, an evening strain. It's frosty, loud and potent, a connoisseur's funk cut. For savoury cheese-gas behind the burger line, Han-Solo delivers.",
    curatorQuote:
      "Cheese, gas and earth with a peppery edge, more umami than sweet.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lemonnade",
    lineage: {
      parents: ["Lemon OG", "Gorilla Haze"],
      cross: "Lemon OG × Gorilla Haze (Growing Passion — breeder-secret, not verified)",
      parentDetails: {
        "Lemon OG": { lineageBrief: "Lemon Skunk × OG Kush line", type: "hybrid" },
        "Gorilla Haze": { type: "sativa" },
      },
    },
    marketNames: ["Lemonade"],
    breeder: "Cookies / Lemonnade",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Bright lemon, daytime-leaning"],
    curatorNote:
      "Lemonnade is the Cookies-affiliated lemon line — a bright, sweet citrus sativa-lean built around clean lemon flavour. The nose is fresh and zesty: lemon and citrus over a soft, sweet herbal base. The effect is uplifting and happy — an energetic, sociable head with a light body, daytime-friendly. It's terpy and flavour-forward, and it lends its lemon to crosses like Cheetah Piss. For clean, sweet lemon citrus, Lemonnade is a reliable pick.",
    curatorQuote:
      "Lemon and citrus over a soft, sweet herbal base.",
    sourceConfidence: "low",
    tagline: "Pure Lemon Pop",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemonnade, the bright sweet Cookies-affiliated lemon line built around clean, zesty citrus joy. The scene is a frosted glass bottle of homemade lemonade on a sun-bleached counter, condensation beading down its sides, a coil of lemon peel curling out of the neck while fizzing soda bubbles catch the light. The palette is electric lemon-yellow and sugar-white over soft herbal sage-green, washed in clean fizzy highlights and zesty citrus sparkle. The mood is uplifting, happy and energetic, full of effervescent upward motion, lit by bright midday daytime sun pouring through the frame. Cinematic, painterly, high-contrast, premium editorial poster. The name LEMONNADE is etched into the frosted glass of the bottle, reading clearly across its curved face. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Garlic Juice",
    lineage: {
      cross: "An In House Genetics cut in the GMO savoury-funk family — the exact cross isn't documented",
    },
    breeder: "In House Genetics",
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Loud GMO-style savoury gas"],
    curatorNote:
      "Garlic Juice is an In House Genetics cut in the GMO savoury-funk family — loud garlic-and-gas with little sweetness. The nose is pungent: roasted garlic and diesel over an earthy, herbal base, unmistakably umami. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, firmly evening. It's frosty, potent and very loud, a connoisseur's funk strain. For garlic-gas intensity, Garlic Juice brings the volume.",
    curatorQuote:
      "Roasted garlic and diesel over an earthy, herbal base, unmistakably umami.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Gary Poppins",
    lineage: {
      parents: ["Gary Payton", "Sunset Sherbet"],
      cross: "Gary Payton × Sunset Sherbet",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Gassy-mint with a creamy lift"],
    curatorNote:
      "Gary Poppins pairs Gary Payton's gassy mint with Sunset Sherbet's cream — a frosty modern exotic that softens GP's edge. The nose is layered: cool mint and gas over a sweet, creamy base. The effect is balanced and euphoric — an uplifting, creative head with a relaxed body, sociable and potent. It's very frosty and flavour-forward, keeping Gary Payton's bag appeal. For gassy-mint with a creamy lift, Gary Poppins is a tasty exotic.",
    curatorQuote:
      "Cool mint and gas over a sweet, creamy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, gassy-mint creamy exotic named Gary Poppins — a playful nod to the magical floating-umbrella nanny. A classic open umbrella drifting magically through a dreamy sky at golden hour, carried on the breeze with a vintage carpet bag floating beside it, soft mint-and-cream clouds parting around them; a faint oily petrol-rainbow shimmer threads the whimsical haze, a glittering trichome-frost sparkle in the air. Cool mint and gas over a sweet, creamy base. Palette dreamy and whimsical — soft mint green and cream with sherbet-gold sunset clouds, frost-silver sparkle and a faint petrol shimmer in the breezy sky. Mood: balanced and euphoric — an uplifting, creative head with a relaxed body, sociable and light. Cinematic, painterly, high-contrast, premium editorial poster, whimsical and atmospheric. The strain name 'GARY POPPINS' baked into the scene — lettered on the floating carpet bag or a drifting tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no recognizable characters, no cannabis leaves, buds or packaging.",
    artFileName: "gary-poppins.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Jelly Donutz",
    lineage: {
      parents: ["Hella Jelly", "White Runtz"],
      cross: "Hella Jelly × White Runtz (Humboldt Seed Company — not verified)",
      parentDetails: {
        "Hella Jelly": { type: "sativa" },
      },
    },
    marketNames: ["Jelly Donuts"],
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Berry-pastry sweetness over light gas"],
    curatorNote:
      "Jelly Donutz is a sweet berry-pastry exotic — jammy fruit over a doughy, lightly gassy base, built for dessert flavour. The nose is sweet and rich: mixed berry jam and sugar over a faint gas. The effect is relaxing and happy — a euphoric head easing into a comfortable body, afternoon into evening. It's frosty and flavour-forward, an easy-drinking dessert cut. For berry-and-pastry sweetness, Jelly Donutz is a tasty pick.",
    curatorQuote:
      "Mixed berry jam and sugar over a faint gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet berry-pastry dessert exotic named Jelly Donutz. A plump sugar-dusted jelly donut split open with glossy mixed-berry jam oozing out, golden fried dough crackling with a sparkling sugar-frost coating in warm bakery light, a curl of sweet steam carrying a faint oily petrol-rainbow shimmer that hints at the light gas. Mixed berry jam and sugar over a doughy, faintly gassy base. Palette warm and luscious — golden fried dough and powdered-sugar white with deep berry-red jam, a sparkling sugar-frost sheen and a faint petrol shimmer under a honeyed glow. Mood: relaxing and happy — a euphoric head easing into a comfortable body, sweet and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'JELLY DONUTZ' baked into the scene — hand-lettered on a bakery sign or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "jelly-donutz.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Watermelon",
    lineage: {
      cross: "A market label — several distinct versions (Watermelon Zkittlez / OG / Gelato); the original cross is undisclosed",
    },
    marketNames: ["Watermelon OG"],
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Sweet watermelon-candy, indica-lean"],
    curatorNote:
      "Watermelon is a sweet, fruit-forward indica-lean built around its namesake melon-candy flavour. The nose is sweet and juicy: watermelon and berry over a soft, earthy base, refreshing rather than gassy. The effect is mellow and happy — a relaxing, contented body ease with a clear head, comfortable for unwinding. It's frosty and flavour-led, moderate in its demands. For sweet melon-candy with an easy body, Watermelon is a gentle pick.",
    curatorQuote:
      "Watermelon and berry over a soft, earthy base, refreshing rather than gassy.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Crystal Locomotive",
    lineage: {
      parents: ["Trainwreck", "Trinity"],
      cross: "Trainwreck × Trinity",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Pine-citrus sativa", "A parent of Mendo Montage"],
    curatorNote:
      "Crystal Locomotive is a Trainwreck × Trinity cross — a frosty, pine-and-citrus sativa from the same NorCal pool as Green Ribbon. The nose is bright and clean: pine and lemon over a sweet, earthy base. The effect is up and energetic — an uplifting, creative head with a relaxed body, daytime-leaning. It's terpy and potent, and it's the sativa side behind Mendo Montage. For clean pine-citrus sativa genetics, Crystal Locomotive is a flavourful parent.",
    curatorQuote: "Pine and citrus over sweet earth, fast and frosty.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Mazar",
    marketNames: ["Mazar-i-Sharif", "Mazar I Sharif"],
    breeder: "Dutch Passion (from Afghan landrace)",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Afghan hash landrace", "A parent of Skywalker"],
    curatorNote:
      "Mazar is an Afghan landrace from the Mazar-i-Sharif region — a dense, resin-heavy indica traditionally grown for hashish, refined into seed form by Dutch Passion. The nose is deep and earthy: sandalwood and incense over a sweet, spicy hash sweetness. The effect is heavily relaxing — a warm, sedating body weight that tips toward sleep, classic landrace indica. It's potent and hash-rich, and it's the Afghan half behind Skywalker. For traditional Afghan hash-plant genetics, Mazar is a source.",
    curatorQuote:
      "Sandalwood and incense over a sweet, spicy hash sweetness.",
    sourceConfidence: "medium",
  },

  // ── ROUND 8: LANDRACE / HAZE ROOTS + MODERN EXOTICS ──
  {
    canonicalName: "Haze",
    marketNames: ["Original Haze"],
    breeder: "Haze Brothers / Sam the Skunkman",
    lineage: {
      cross: "Colombian × Mexican × Thai × South Indian landraces",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["The root sativa-haze", "Behind Blue Dream, SSH and Jack Herer"],
    curatorNote:
      "Haze is the original — a 1970s Santa Cruz blend of Colombian, Mexican, Thai and South Indian landraces that became the spine of nearly every modern sativa. The nose is bright and complex: citrus and incense over a spicy, earthy base. The effect is a long, soaring cerebral high — energetic, creative and almost psychedelic, with little body. It's slow to grow and not for the impatient, but its DNA runs through Blue Dream, Super Silver Haze and Jack Herer. For the source of haze genetics, this is it.",
    curatorQuote:
      "Citrus and incense over a spicy, earthy base.",
    sourceConfidence: "high",
    tagline: "Where It Began",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Haze, the original 1970s Santa Cruz landrace blend that became the spine of nearly every modern sativa. The scene is a sun-drenched Santa Cruz coastal bluff at golden hour, rolling fog drifting off the Pacific over wind-bent grasses and weathered cliffs, distant surf glowing through a luminous golden mist. The palette is golden amber and foggy coastal gold over earthy ochre and bright citrus-incense yellow, lit by warm sun-drenched light cutting through drifting sea haze. The mood is energetic, euphoric, uplifted and creative, expansive and soaring with slow rolling fog motion, under luminous daytime light. Cinematic, painterly, high-contrast, premium editorial poster. The name HAZE is carved into a weathered wooden bluff-top marker post overlooking the sea. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Ghost OG",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush phenotype (Ghost cut)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Bright, citrusy OG cut", "Parent of Ghost Train Haze and Banana Kush"],
    curatorNote:
      "Ghost OG is a celebrated phenotype of OG Kush — a brighter, more citrus-forward cut than most OGs, and a productive parent. The nose is classic gas with a lift: fuel and pine over a lemony, earthy base. The effect is balanced — a euphoric, happy head with a relaxing body, usable across the day. It's gassy, frosty and potent, and it's behind Ghost Train Haze and Banana Kush. For a brighter cut of OG genetics, Ghost OG is a key line.",
    curatorQuote:
      "Fuel and pine over a lemony, earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a bright, citrus-forward gas-OG hybrid named Ghost OG. A fog-shrouded old stone manor on a pine hill at dusk: pale luminous spectral mist drifts like wisps between weathered iron gates and trees, lemon-gold dusk light breaking through, a faint fuel-and-pine haze hanging in the cold air. Palette luminous, cool-meets-warm — pale ghost-white and blue mist with lemon-gold dusk and pine green over petrol-earth shadow, a frosted sheen, fading into a wine-dark sky. Mood: balanced and bright — a euphoric, happy lift over an easy relaxing body, ethereal and calm. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GHOST OG' baked into the scene — carved into a weathered stone gate or marker. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "ghost-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Colombian Gold",
    marketNames: ["Colombian"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Santa Marta landrace", "A parent of Skunk #1"],
    curatorNote:
      "Colombian Gold is a landrace from the Santa Marta mountains of Colombia — a sweet, energetic sativa that helped found modern genetics as a parent of Skunk #1. The nose is sweet and earthy: honeyed grass and citrus with a faint skunk. The effect is up and clear — an energetic, happy, creative head with little weight, a classic daytime sativa. It's mild by modern standards but historically huge. For old-world sativa sweetness at the root of Skunk, Colombian Gold is foundational.",
    curatorQuote:
      "Honeyed grass and citrus with a faint skunk.",
    sourceConfidence: "high",
    tagline: "Mountain Sun Legend",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Colombian Gold, a legendary Santa Marta golden landrace with the dignity of an old equatorial heirloom. Terraced hillside fields on the Sierra Nevada de Santa Marta coast, where dry honeyed grasses ripple down toward a glittering Caribbean shoreline below sun-bronzed peaks. Palette of golden honey amber, sun-baked earth ochre, citrus highlights and a faint smoky skunk-green undertone, against deep coastal blues, lit by hard tropical midday sun. Mood is energetic, uplifted and clear-headed, motion warm and wind-swept across swaying grass, lit by bright daytime light blazing high overhead. Cinematic, painterly, high-contrast, premium editorial poster. The name COLOMBIAN GOLD is stencilled into a weathered wooden coastal trail marker planted in the foreground earth. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Hawaiian",
    marketNames: ["Hawaiian Sativa"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Tropical island landrace", "A parent of Pineapple Express"],
    curatorNote:
      "Hawaiian is the island landrace behind a generation of tropical strains — a sweet, fruity sativa grown in the Hawaiian sun, and a parent of Pineapple Express. The nose is bright and tropical: pineapple and citrus over a light, sweet base. The effect is uplifting and gentle — a happy, creative, low-stress head, an easy daytime sativa. It's moderate and mellow, more about mood and flavour than power. For sunny tropical-sativa genetics, Hawaiian is a source.",
    curatorQuote:
      "Pineapple and citrus over a light, sweet base.",
    sourceConfidence: "medium",
    tagline: "Endless Island Summer",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Hawaiian, a classic sweet tropical island sativa with the easy radiance of an endless summer. A lush emerald Hawaiian valley folding down to a turquoise lagoon, waterfalls threading volcanic ridges, palms and ripe tropical fruit catching the light. Palette of vivid pineapple yellow, ripe mango orange, citrus bright and saturated jungle greens against turquoise sea and warm sky, lit by glowing tropical sunshine. Mood is happy, uplifted and euphoric, motion gentle and breezy with swaying fronds and mist, lit by clear daytime light of a bright island afternoon. Cinematic, painterly, high-contrast, premium editorial poster. The name HAWAIIAN is carved into a smooth volcanic-stone marker at the valley mouth, mossed at the edges. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "California Orange",
    lineage: {
      cross: "1970s California heritage — original parents never documented (a balanced citrus hybrid)",
    },
    marketNames: ["Cali O", "Cali Orange"],
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["1980s citrus classic", "A parent of Tangie and Orange Crush"],
    curatorNote:
      "California Orange (Cali O) is a 1980s citrus classic of murky origin — a balanced hybrid prized for clean orange flavour, and the parent that gave Tangie and Orange Crush their nose. The smell is exactly the name: sweet orange and tangerine over a soft, earthy base. The effect is uplifting and easy — a happy, sociable high with a relaxed body, comfortable across the day. It's moderate and approachable, a flavour-first throwback. For the source of citrus genetics, Cali O is foundational.",
    curatorQuote:
      "Sweet orange and tangerine over a soft, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Strawberry Fields",
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet strawberry line", "A parent of Strawberry Cough"],
    curatorNote:
      "Strawberry Fields is a sweet, strawberry-leaning line best known as a parent of Strawberry Cough. The nose is bright and fruity: ripe strawberry and berry over a light earthy base. The effect is balanced and pleasant — a happy, relaxing high that lifts the mood without much weight. It's flavour-led and approachable, moderate in strength. For sweet strawberry genetics, Strawberry Fields is the parent cut.",
    curatorQuote:
      "Ripe strawberry and berry over a light earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet, mood-lifting strawberry hybrid named Strawberry Fields. A sunlit field of strawberry plants rolling to the horizon at golden hour, rows heavy with ripe glossy red strawberries glistening among green leaves and white blossoms, a warm hazy glow and soft light over the gentle hills. Ripe strawberry and berry over a light earthy base. Palette warm and fruity — strawberry red and leaf green over golden-hour amber and soft earthy brown, a sweet luminous haze. Mood: balanced and pleasant — a happy, relaxing high that lifts the mood, bright and approachable. Cinematic, painterly, high-contrast, premium editorial poster, lush and atmospheric. The strain name 'STRAWBERRY FIELDS' baked into the scene — carved into a weathered wooden field sign at the edge of the rows. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "strawberry-fields.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pink Panties",
    breeder: "Sherbinski",
    lineage: {
      parents: ["Burmese Kush", "Florida Kush"],
      cross: "Burmese Kush × Florida Kush (Sherbinski) — the matriarch of the Sherbet/Gelato family",
      parentDetails: {
        "Florida Kush": { lineageBrief: "OG-adjacent Florida kush", type: "indica" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Floral Burmese Kush pheno", "A parent of Sunset Sherbet"],
    curatorNote:
      "Pink Panties is a Sherbinski selection — a floral, sweet Burmese Kush phenotype that matters most as a parent of Sunset Sherbet (and so, indirectly, of Gelato). The nose is sweet and floral: berry and flowers over a soft, earthy base. The effect is relaxing and gentle — a happy, calming high that leans comfortable. It's frosty and pretty, a quiet but important parent line. For the floral side of the Sherbet genome, Pink Panties is the source.",
    curatorQuote:
      "Berry and flowers over a soft, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Nevil's Wreck",
    lineage: {
      parents: ["Trainwreck", "Neville's Haze"],
      cross: "Arcata Trainwreck × Neville's Haze (Rare Dankness)",
      parentDetails: {
        "Neville's Haze": { lineageBrief: "((Haze × Haze) × NL#5) × (Haze × Haze)", type: "sativa" },
      },
    },
    marketNames: ["Nevils Wreck"],
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Pungent haze cut", "A parent of Ghost Train Haze"],
    curatorNote:
      "Nevil's Wreck is a pungent haze-leaning cut — a sharp, citrus-pine sativa that Rare Dankness used to build Ghost Train Haze. The nose is loud and clean: citrus and pine over a spicy, incense-like base. The effect is a fast, soaring cerebral rush — energetic and heady, potent enough to overwhelm. It's frosty and very strong, the sativa half behind one of the most potent strains around. For intense haze genetics, Nevil's Wreck is a key parent.",
    curatorQuote: "Citrus and pine over sharp spice, classic Haze.",
    sourceConfidence: "low",
    tagline: "Sharp and Soaring",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Nevil's Wreck, a sharp piney-spicy haze cut, an Arcata Trainwreck crossed with Neville's Haze, loud and clean and soaring. A dense towering pine forest split by a shaft of hard light, sharp green needles and drifting resin-incense smoke amid jagged shattered timber and a faint distant rail-line wreck of splintered wood. Palette of sharp pine green and citrus-bright accents over spicy incense-greys against deep forest shadow, lit by a piercing cold light beam. Mood is fast, soaring and cerebral, motion sharp rushing air and snapping needles, lit by bright daytime light cutting hard through the canopy. Cinematic, painterly, high-contrast, premium editorial poster. The name NEVIL'S WRECK is carved deep into a splintered fallen pine trunk in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Las Vegas Purple Kush",
    lineage: {
      parents: ["Purple Afghani", "Hindu Kush"],
      cross: "Purple Afghani × Hindu Kush (commonly cited, clone-only — not verified)",
      parentDetails: {
        "Purple Afghani": { type: "indica" },
      },
    },
    marketNames: ["LVPK", "Vegas Purple Kush"],
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Purple Vegas indica", "A parent of Alien Kush"],
    curatorNote:
      "Las Vegas Purple Kush is a deeply purple Nevada indica — sweet, frosty and heavy, and a parent of Alien Kush. The nose is sweet and fruity: grape and berry over an earthy, hashy base. The effect is heavily relaxing — a warm, dreamy body weight that drifts toward sleep, a classic evening indica. It's dense, colourful and potent. For purple Kush genetics with a Vegas pedigree, LVPK is a solid parent line.",
    curatorQuote:
      "Grape and berry over an earthy, hashy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Acai",
    lineage: {
      parents: ["Sunset Sherbet", "Pink Panties"],
      cross: "Sunset Sherbet × Pink Panties (Sherbinskis; some cite Gelato #49 × Pink Panties — not verified)",
    },
    marketNames: ["Acai Berry Gelato"],
    breeder: "Sherbinski",
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Dark berry over Gelato cream"],
    curatorNote:
      "Acai (Acai Berry Gelato) is a Sherbinski berry-forward gelato cut — dark, jammy fruit over a creamy base. The nose is rich and sweet: acai and dark berry over sherbet cream. The effect is relaxing and euphoric — a happy head easing into a comfortable body, evening-leaning. It's frosty and flavour-forward, and it shows up behind dark-fruit crosses like Black Cherry Gelato. For deep berry-gelato sweetness, Acai is a tasty cut.",
    curatorQuote:
      "Acai and dark berry over sherbet cream.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lamb's Bread",
    marketNames: ["Lamb's Breath", "Lambsbread"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Jamaican landrace", "Bright, grassy, energising"],
    curatorNote:
      "Lamb's Bread (Lamb's Breath) is a Jamaican landrace famously favoured by Bob Marley — a bright, grassy sativa with an uplifting reputation. The nose is earthy and herbal: fresh grass and citrus over a faint skunk. The effect is up and clear — an energetic, creative, mood-lifting head with little body, a daytime classic. It's moderate and clean, more lift than weight. For old-world Jamaican sativa, Lamb's Bread is a piece of history.",
    curatorQuote:
      "Fresh grass and citrus over a faint skunk.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Panama Red",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Panamanian landrace legend", "1970s soaring sativa"],
    curatorNote:
      "Panama Red is a Panamanian landrace and a genuine 1960s-70s legend — a slow-growing, near-pure sativa that defined an era before hybrids took over. The nose is earthy and sweet: spicy, woody sweetness over a herbal base. The effect is a clean, soaring, creative high with almost no body, a true daytime classic. It's rare now and moderate by modern potency, prized for heritage and a clear, social lift. For pure old-school sativa, Panama Red is a relic worth knowing.",
    curatorQuote: "Spicy, woody sweetness — a 1970s sativa legend.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Kali Mist",
    breeder: "Serious Seeds",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Clean spicy-citrus haze hybrid"],
    curatorNote:
      "Kali Mist is a Serious Seeds haze hybrid — a clean, spicy-citrus sativa that won early Cups and earned a 'queen of sativas' reputation. The nose is sharp and fresh: citrus and spice over a herbal, earthy base. The effect is up and focused — an energetic, creative, clear head with little body, a daytime strain. It's potent and clean, beloved for a smooth, anxiety-light lift. For a refined, spicy-citrus sativa, Kali Mist is a connoisseur classic.",
    curatorQuote:
      "Citrus and spice over a herbal, earthy base.",
    sourceConfidence: "medium",
    tagline: "Queen Of Sativas",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Kali Mist, a Serious Seeds haze hybrid crowned the regal 'queen of sativas' for its clean, spicy-citrus clarity. A serene temple courtyard at the top of high stone steps: weathered carved pillars, brass incense burners trailing thin ribbons of fragrant smoke, scattered fresh herbs and citrus on a stone altar and a misty mountain valley beyond. Palette of cool herbal sage greens, spicy saffron and incense amber, earthy stone greys, pine and a sharp fresh citrus accent from the spicy-herbal-earthy-sweet-pine nose. The mood is up, focused and euphoric, incense mist rising in tall graceful upward coils, lit by clear bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name KALI MIST is engraved into the stone lintel above the courtyard's central archway. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Pink Rozay",
    breeder: "Cookies",
    lineage: {
      parents: ["Lemonchello", "London Pound Cake"],
      cross: "Lemonchello 10 × LPC 75",
      parentDetails: {
        "Lemonchello": { lineageBrief: "The Original Z × Lemonnade", type: "hybrid" },
      },
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Floral-berry Cookies dessert"],
    curatorNote:
      "Pink Rozay is a Cookies cross of Lemonchello and London Pound Cake — a floral, berry-sweet dessert with rosé-pink looks. The nose is sweet and floral: berry and flowers over a creamy, doughy base. The effect is relaxing and happy — a euphoric head easing into a comfortable body, afternoon into evening. It's frosty and flavour-forward, an elegant Cookies cut. For floral-berry dessert sweetness, Pink Rozay is a pretty pick.",
    curatorQuote:
      "Berry and flowers over a creamy, doughy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a floral, berry-sweet dessert hybrid named Pink Rozay — a nod to blush rosé wine. An elegant glass of blush-pink rosé glowing in soft warm light, delicate berries and rose petals drifting around the bowl of the glass, a gentle frosted chill sweating on the crystal, a creamy floral mist in the air. Berry and flowers over a creamy, doughy base. Palette elegant and soft — blush rosé pink and rose-petal red with creamy highlights and crystal glints, a frosty sparkle and floral glow over a soft warm shadow. Mood: relaxing and happy — a euphoric head easing into a comfortable body, elegant and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, refined and atmospheric. The strain name 'PINK ROZAY' baked into the scene — etched on the glass or an elegant label. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "pink-rozay.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Garlic Breath",
    lineage: {
      parents: ["GMO Cookies", "Mendo Breath"],
      cross: "GMO × Mendo Breath (commonly cited)",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savoury garlic-gas indica"],
    curatorNote:
      "Garlic Breath is a savoury, gassy indica in the GMO family — usually cited as GMO crossed with Mendo Breath — built around a pungent garlic funk. The nose is loud and umami: roasted garlic and gas over an earthy, hashy base. The effect is heavy and relaxing — a euphoric head sinking into a sedating body, firmly evening. It's frosty, potent and very loud. For garlic-gas funk in a heavy indica, Garlic Breath delivers.",
    curatorQuote:
      "Roasted garlic and gas over an earthy, hashy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Tropicana Banana",
    lineage: {
      parents: ["Tropicana Cookies", "Banana"],
      cross: "Tropicana Cookies × a banana cut",
      parentDetails: {
        "Banana": { lineageBrief: "banana-flavour selection", type: "hybrid" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Orange citrus over creamy banana"],
    curatorNote:
      "Tropicana Banana pairs Tropicana Cookies' bright orange with a creamy banana cut — citrus and tropical fruit in one juicy nose. The smell is sweet and zesty: orange and tangerine over ripe banana. The effect is uplifting and lively — a happy, creative head with a relaxed body, daytime-friendly. It's terpy and frosty, flavour-forward rather than heavy. For an orange-and-banana fruit profile, Tropicana Banana is a bright pick.",
    curatorQuote:
      "Orange and tangerine over ripe banana.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Biskante",
    lineage: {
      parents: ["Zookies", "Biscotti"],
      cross: "Zookies × Biscotti (Alien Labs)",
      parentDetails: {
        Zookies: { lineageBrief: "Animal Cookies × GG4", type: "hybrid" },
      },
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Creamy cookie over a gassy base"],
    curatorNote:
      "Biskante is a Biscotti-leaning exotic — creamy cookie sweetness over a gassy, earthy base. The nose is rich and sweet: cookie and cream cut by a light gas. The effect is balanced and relaxing — a euphoric head easing into a comfortable body, versatile and potent. It's frosty and flavour-forward, in the polished Biscotti lane. For creamy cookie-gas dessert, Biskante is a smooth pick.",
    curatorQuote:
      "Cookie and cream cut by a light gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a creamy, frosty cookie-gas dessert exotic named Biskante. Elegant golden cookies stacked and dipped into a glossy pour of cream on a polished marble counter in warm Italian café light — rich cream ribboning over caramel-gold cookie, a soft dusting of sugar frost, a thin curl of vapor catching a faint oily petrol-rainbow shimmer that hints at the gas underneath. Cookie and cream cut by a light gas over an earthy base. Palette refined and warm — creamy ivory and caramel-gold over pale marble, a frosty silver sheen and a faint petrol shimmer under a honeyed amber glow. Mood: balanced and relaxing — a euphoric head easing into a comfortable body, polished and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, elegant and appetizing. The strain name 'BISKANTE' baked into the scene — hand-lettered on a small enamel café tag or etched into the marble. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "biskante.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Sunset Mintz",
    lineage: {
      parents: ["Sunset Sherbet", "Kush Mints"],
      cross: "Sunset Sherbet × Kush Mints",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Minty-sweet sherbet cross"],
    curatorNote:
      "Sunset Mintz pairs Sunset Sherbet's cream with Kush Mints' cool mint and gas — a frosty, minty-sweet exotic. The nose is layered: sweet sherbet and cream over a cool mint and light gas. The effect is balanced and relaxing — a euphoric head easing into a calm body, evening-leaning. It's frosty and flavour-forward, easy to like. For minty-sweet sherbet character, Sunset Mintz is a tasty pick.",
    curatorQuote:
      "Sweet sherbet and cream over a cool mint and light gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, minty-sweet sherbet exotic named Sunset Mintz. A dreamy sherbet-toned sunset sky in soft pink, peach and cream melting down to a cool mint-green misty meadow below — the warm dessert-colored clouds meeting a frosty mint haze where they touch, a glittering trichome-frost sparkle drifting in the still air with a faint oily petrol-rainbow shimmer hinting at the light gas. Sweet sherbet and cream over a cool mint and light gas. Palette dreamy and two-toned — sherbet pink, peach and cream above, cool mint green and frost-silver below, with a faint petrol shimmer in the haze. Mood: balanced and relaxing — a euphoric head easing into a calm body, evening-leaning and serene. Cinematic, painterly, high-contrast, premium editorial poster, soft and atmospheric. The strain name 'SUNSET MINTZ' baked into the scene — carved into a weathered wooden sign or stone at the meadow's edge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sunset-mintz.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Apple Gelato",
    lineage: {
      parents: ["Apple Fritter", "Gelato"],
      cross: "Apple Fritter × Gelato",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Sweet-apple over Gelato cream"],
    curatorNote:
      "Apple Gelato folds Apple Fritter's sweet-and-savoury pastry into Gelato's cream — green-apple dessert with a light gas. The nose is bright and sweet: green apple and sugar over a creamy, gassy base. The effect is balanced and feel-good — a euphoric, creative head with a relaxed body, sociable and potent. It's frosty and flavour-forward, an easy-drinking exotic. For apple-and-cream dessert character, Apple Gelato is a tasty pick.",
    curatorQuote:
      "Green apple and sugar over a creamy, gassy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Malawi",
    marketNames: ["Malawi Gold"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["African landrace (Malawi Gold)", "Pure soaring sativa"],
    curatorNote:
      "Malawi (Malawi Gold) is a celebrated African landrace from the highlands of Malawi — a pure, long-flowering sativa known for resin and a clean, soaring high. The nose is earthy and sweet: spicy, woody sweetness with a faint citrus. The effect is energetic and creative — a clear, almost relentless cerebral lift with no body, a true heritage sativa. It's potent and pure, prized by collectors and hash makers alike. For old-world African sativa, Malawi is a landrace worth knowing.",
    curatorQuote:
      "Spicy, woody sweetness with a faint citrus.",
    sourceConfidence: "medium",
    tagline: "Highland Gold",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Malawi (Malawi Gold), a celebrated long-flowering African landrace from the Malawi highlands known for resin and a clean, soaring high. A vast sweep of the Central African highlands above the shores of Lake Malawi: rolling golden-grass uplands, terraced red-earth slopes catching morning light, the great silver lake glittering below and acacia silhouettes on the ridgeline. Palette of sun-cured straw gold, sweet amber, spicy woody browns, herbal sage greens and faint floral-citrus warmth from the earthy-sweet-spicy-floral nose. The mood is energetic, euphoric and uplifting, heat shimmer and dust rising in soaring vertical motion off the warm hills, lit by clear bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name MALAWI is carved into a weathered wooden boundary marker post planted at the crest of the foreground ridge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },

  // ── ROUND 9: MORE PARENT-FILL + LANDRACES + CLASSICS ──
  {
    canonicalName: "Jack the Ripper",
    marketNames: ["JTR"],
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["Jack's Cleaner", "Space Queen"],
      cross: "Jack's Cleaner × Space Queen",
      parentDetails: {
        "Jack's Cleaner": { lineageBrief: "Jack Herer × NL5 Haze", type: "sativa" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Lemony haze sativa", "A parent of Cherry Lemonade"],
    curatorNote:
      "Jack the Ripper is a TGA/Subcool sativa — Jack's Cleaner crossed with Space Queen — built around a sharp lemon-and-spice nose. The smell is bright and pungent: lemon and pine over a spicy, herbal base. The effect is fast and heady — an energetic, creative cerebral rush with little body, a daytime strain. It's terpy and potent, and it's the citrus half behind Cherry Lemonade. For lemony haze genetics with a bite, Jack the Ripper is a flavourful parent.",
    curatorQuote:
      "Lemon and pine over a spicy, herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gelonade",
    breeder: "Connected Cannabis Co.",
    lineage: {
      parents: ["Lemon Tree", "Gelato 41"],
      cross: "Lemon Tree × Gelato 41",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Lemon over gelato cream", "A parent of Lemonatti"],
    curatorNote:
      "Gelonade is a Connected Cannabis Co. cross of Lemon Tree and Gelato 41 — sharp lemon laid over gelato cream. The nose is bright and rich: lemon and citrus over a creamy, lightly gassy base. The effect is uplifting and balanced — a happy, creative head with a relaxed body, versatile across the day. It's terpy and frosty, and it's the lemon half behind Lemonatti. For lemon-over-gelato character, Gelonade is a tasty parent line.",
    curatorQuote:
      "Lemon and citrus over a creamy, lightly gassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemonchello",
    marketNames: ["Limoncello", "Lemonchello 10"],
    breeder: "Cookies",
    lineage: {
      parents: ["The Original Z", "Lemonnade"],
      cross: "The Original Z × Lemonnade",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Bright lemon candy", "A parent of Pink Rozay"],
    curatorNote:
      "Lemonchello (Limoncello) is a Cookies cross of The Original Z and Lemonnade — a bright, sweet lemon-candy hybrid. The nose is zesty and sweet: candied lemon and fruit over a creamy, earthy base. The effect is uplifting and easy — a happy, sociable head with a relaxed body, daytime-leaning. It's terpy and frosty, and it lends its lemon to Pink Rozay. For sweet lemon-candy character, Lemonchello is a flavourful parent.",
    curatorQuote:
      "Candied lemon and fruit over a creamy, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Thai",
    marketNames: ["Thai Stick", "Thai Landrace"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Southeast Asian landrace", "A root of Haze and NL #5"],
    curatorNote:
      "Thai is the Southeast Asian landrace behind 'Thai stick' and a root of modern sativa genetics — part of both Haze and Northern Lights #5. The nose is bright and clean: citrus and spice over an earthy, herbal base. The effect is a clear, soaring, almost electric cerebral high with no body, classic equatorial sativa. It's slow to flower and moderate in potency, but historically immense. For old-world Thai sativa genetics, this landrace is foundational.",
    curatorQuote: "Bright citrus and spice, soaring and clear.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Mexican",
    marketNames: ["Mexican Sativa", "Michoacán"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Mexican landrace", "A root of Haze, Skunk #1 and Trainwreck"],
    curatorNote:
      "Mexican is the landrace sativa from the highlands of Michoacán and Guerrero — a sweet, energetic plant that seeded Haze, Skunk #1 and Trainwreck. The nose is sweet and earthy: honeyed grass and citrus over a faint spice. The effect is up and social — an energetic, happy, creative head with little body, a daytime classic. It's mild by modern standards but historically central. For old-world Mexican sativa at the root of countless hybrids, this is a source.",
    curatorQuote: "Honeyed grass and citrus, light and uplifting.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Forum Cookies",
    marketNames: ["Forum Cut", "Forum GSC"],
    breeder: "Cookies Fam (GSC pheno)",
    lineage: {
      parents: ["Girl Scout Cookies"],
      cross: "Girl Scout Cookies phenotype (Forum cut)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["The gassier GSC cut", "Behind Wedding Cake and many dessert crosses"],
    curatorNote:
      "Forum Cookies is the Forum cut of Girl Scout Cookies — alongside Thin Mint, the canonical GSC phenotype, gassier and denser than most. The nose is rich and earthy: sweet cookie dough and gas over a spicy, herbal base. The effect is balanced-leaning-heavy — a euphoric head settling into a comfortable body, afternoon into evening. It's frosty and potent, and its DNA underpins Wedding Cake and a wave of dessert crosses. For the gassy side of the cookie genome, the Forum cut is essential.",
    curatorQuote:
      "Sweet cookie dough and gas over a spicy, herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Orange Juice",
    lineage: {
      parents: ["California Orange"],
      cross: "California Orange-leaning citrus selection",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Juicy orange citrus", "A parent of Orange Cookies"],
    curatorNote:
      "Orange Juice is a juicy, orange-forward citrus cut in the California Orange family — best known now as a parent of Orange Cookies. The nose is sweet and zesty: fresh orange and tangerine over a light earthy base. The effect is uplifting and happy — a sociable, lightly energetic head with a relaxed body, daytime-friendly. It's smooth and flavour-led, moderate in strength. For clean orange-citrus genetics, Orange Juice is a bright parent line.",
    curatorQuote:
      "Fresh orange and tangerine over a light earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "The Original Z",
    marketNames: ["Original Zkittlez", "OGZ"],
    lineage: {
      parents: ["Zkittlez"],
      cross: "Original Zkittlez cut",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["The original Zkittlez clone", "A parent of Lemonchello"],
    curatorNote:
      "The Original Z is the original clone-only cut of Zkittlez — the candy-fruit benchmark before the name spread everywhere, and a parent of Lemonchello. The nose is sweet and loud: mixed berry and tropical candy with a clean, sour-sweet edge. The effect is calm and contented — a relaxed, happy body ease that's hard to overdo. It's frosty and flavour-first, the genuine article behind a heavily-copied name. For true Zkittlez candy genetics, The Original Z is the source cut.",
    curatorQuote:
      "Mixed berry and tropical candy with a clean, sour-sweet edge.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Boggle Gum",
    lineage: {
      parents: ["BOG Bubble", "Northern Lights #5"],
      cross: "BOG Bubble × Northern Lights #5 (BOG Seeds)",
      parentDetails: {
        "BOG Bubble": { lineageBrief: "BOG Seeds bubblegum line", type: "hybrid" },
      },
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Bubblegum-leaning cut", "A parent of Champagne"],
    curatorNote:
      "Boggle Gum is a sweet, bubblegum-leaning cut best known as a parent of Sherbinski's Champagne (and so, indirectly, Rainbow Sherbet). The nose is sweet and candy-bright: bubblegum and berry over a light floral base. The effect is gentle and happy — a relaxing, mood-lifting high that stays comfortable, moderate in strength. It's smooth and flavour-led, a quiet parent line. For sweet bubblegum genetics behind the sherbet world, Boggle Gum is a source.",
    curatorQuote: "Bubblegum sweetness with a floral, fruity lift.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Aloha White Widow",
    marketNames: ["Aloha WW"],
    lineage: {
      parents: ["White Widow", "Hawaiian"],
      cross: "White Widow × Hawaiian",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Tropical White Widow cross", "A parent of Green Ribbon"],
    curatorNote:
      "Aloha White Widow is a White Widow × Hawaiian cross — the frosty resin of White Widow with a sweet, tropical lift. The nose is sweet and fruity: pineapple and tropical fruit over a piney, earthy base. The effect is balanced and up — a happy, creative head with a relaxed body, daytime-leaning. It's frosty and potent, and it's part of Green Ribbon's blend. For a tropical take on White Widow, Aloha is a flavourful parent line.",
    curatorQuote:
      "Pineapple and tropical fruit over a piney, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "White Russian",
    breeder: "Serious Seeds",
    lineage: {
      parents: ["AK-47", "White Widow"],
      cross: "AK-47 × White Widow",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Frosty, potent 90s classic"],
    curatorNote:
      "White Russian is a Serious Seeds cross of AK-47 and White Widow — a frost-caked, very potent hybrid that topped late-90s potency charts. The nose is earthy and sweet: pine and skunk over a sweet, herbal base. The effect is strong and balanced — a euphoric, heady high with a relaxing body, more punch than most of its era. It's dense, frosty and dependable, a coffeeshop classic. For a heavy, frosty old-school hybrid, White Russian endures.",
    curatorQuote:
      "Pine and skunk over a sweet, herbal base.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Querkle",
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["Purple Urkle", "Space Queen"],
      cross: "Purple Urkle × Space Queen",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet grape over a relaxing body"],
    curatorNote:
      "Querkle is a TGA/Subcool cross of Purple Urkle and Space Queen — sweet grape from the Urkle side with a fruity lift from Space Queen. The nose is sweet and fruity: grape and berry over a light earthy base. The effect leans relaxing — a happy, calming high with a comfortable body, evening-friendly. It's frosty and colourful, easy to enjoy. For sweet purple-grape genetics with a fruity edge, Querkle is a tasty hybrid.",
    curatorQuote:
      "Grape and berry over a light earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Jilly Bean",
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["Orange Velvet", "Space Queen"],
      cross: "Orange Velvet × Space Queen",
      parentDetails: {
        "Orange Velvet": { lineageBrief: "orange-citrus selection", type: "hybrid" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Orange-mango candy sativa-lean"],
    curatorNote:
      "Jilly Bean is a TGA/Subcool cross of Orange Velvet and Space Queen — a bright, jelly-bean-sweet citrus hybrid. The nose is sweet and fruity: orange and mango candy over a light earthy base. The effect is uplifting and happy — a creative, sociable head with a relaxed body, daytime-friendly. It's terpy and flavour-forward, an easy mood-lifter. For orange-mango candy character, Jilly Bean is a cheerful pick.",
    curatorQuote:
      "Orange and mango candy over a light earthy base.",
    sourceConfidence: "medium",
    tagline: "Sweet Little Riot",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Jilly Bean, a playful orange-and-mango jelly-bean candy hybrid with the mischief of a sugar rush. A toppling glass candy jar spilling a glossy cascade of orange and mango jelly beans across a polished countertop, each candy catching tiny reflected highlights like wet glass. Palette of bright orange, mango gold, sugary candy-pink and tropical fruit tones against creamy warm neutrals, lit by bouncy bright bonbon-shop light. Mood is uplifted, happy and creatively giddy, motion bouncing and scattering mid-tumble, lit by cheerful daytime light flooding a candy-shop window. Cinematic, painterly, high-contrast, premium editorial poster. The name JILLY BEAN is painted in glossy enamel script across the curved glass face of the candy jar. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Holy Grail Kush",
    marketNames: ["HGK"],
    breeder: "DNA Genetics / Reserva Privada",
    lineage: {
      parents: ["OG #18", "Kosher Kush"],
      cross: "OG #18 × Kosher Kush",
      parentDetails: {
        "OG #18": { lineageBrief: "OG Kush phenotype #18", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Award-winning heavy gas-OG"],
    curatorNote:
      "Holy Grail Kush is a DNA Genetics cross of OG #18 and Kosher Kush — two heavyweight OGs combined into a Cannabis Cup winner. The nose is loud OG: fuel and pine over a damp, earthy funk with a lemony edge. The effect is strong and relaxing — a euphoric head sinking into a heavy body, evening-leaning. It's gassy, dense and very potent, a connoisseur's OG. For a heavy, decorated gas-OG, Holy Grail Kush lives up to the name.",
    curatorQuote:
      "Fuel and pine over a damp, earthy funk with a lemony edge.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, award-winning gas-OG hybrid named Holy Grail Kush. An ancient stone temple ruin deep in a pine forest at dusk: a luminous golden chalice — the grail — rests on a moss-grown stone altar, shafts of divine amber light breaking through broken arches, a fuel-and-pine haze drifting reverently through the cold air. Palette rich and sacred — amber and lemon-gold divine light with pine green over damp earthy stone and petrol-fuel shadow, a frosted resinous sheen, fading into a wine-dark dusk sky. Mood: strong and relaxing — a euphoric head sinking into a heavy body, reverent and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'HOLY GRAIL KUSH' baked into the scene — carved into the stone altar. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "holy-grail-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Nepalese",
    marketNames: ["Nepali", "Nepalese Highland"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Himalayan highland landrace", "Traditional charas plant"],
    curatorNote:
      "Nepalese is a Himalayan highland landrace traditionally grown for charas (hand-rubbed hash) — an earthy-sweet, long-flowering sativa. The nose is deep and warm: earthy spice and sweetness over a woody, incense-like base. The effect is uplifting and creative — a clear, happy head with a gently relaxing body, an unusual landrace that isn't pure race. It's resin-rich and smooth, prized for hash and heritage. For old-world Himalayan genetics, Nepalese is a classic.",
    curatorQuote:
      "Earthy spice and sweetness over a woody, incense-like base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Swazi Gold",
    marketNames: ["Swazi"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Eswatini (Swaziland) landrace", "Clean equatorial sativa"],
    curatorNote:
      "Swazi Gold is an African landrace from the highlands of Eswatini (Swaziland) — a clean, energetic equatorial sativa famous for resilience and a bright high. The nose is earthy and sweet: spicy, grassy sweetness with a faint citrus. The effect is up and clear — an energetic, creative, social head with no body, a true daytime landrace. It's hardy and moderate, prized for heritage and a clean lift. For old-world African sativa, Swazi Gold is a source.",
    curatorQuote: "Spicy, grassy sweetness with a citrus edge — African sativa.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pakistani Chitral Kush",
    marketNames: ["Chitral Kush", "PCK"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Chitral Valley landrace", "Pure hash-plant indica"],
    curatorNote:
      "Pakistani Chitral Kush (PCK) is a landrace from the Chitral Valley of the Hindu Kush — a pure, resin-heavy indica traditionally grown for hashish. The nose is deep and earthy: sandalwood and sweet spice over a hashy, woody base. The effect is heavily relaxing — a warm, grounding body weight that tips toward sleep, classic landrace indica. It's dense, frosty and potent, prized by purists and hash makers. For traditional Hindu Kush hash genetics, PCK is the source.",
    curatorQuote:
      "Sandalwood and sweet spice over a hashy, woody base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Marshmallow OG",
    lineage: {
      parents: ["Chemdog D", "Triangle Kush", "Jet Fuel Gelato"],
      cross: "(Chemdog D × Triangle Kush) × Jet Fuel Gelato (Compound Genetics)",
      parentDetails: {
        "Chemdog D": { lineageBrief: "Chemdawg 'D' cut", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Sweet, creamy OG indica"],
    curatorNote:
      "Marshmallow OG is a sweet, creamy take on the OG mould — vanilla-marshmallow softness over a gassy, earthy base. The nose is unusual for an OG: sweet cream and vanilla over fuel and earth. The effect is relaxing and heavy — a euphoric head sinking into a sedating body, an evening strain. It's frosty and potent, a comfortable, dessert-leaning OG. For sweet-creamy gas in a heavy indica, Marshmallow OG is a cosy pick.",
    curatorQuote:
      "Sweet cream and vanilla over fuel and earth.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Khalifa Mints",
    lineage: {
      parents: ["Khalifa Kush", "Kush Mints"],
      cross: "Khalifa Kush × Kush Mints",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Gassy-mint, heavy OG-lean"],
    curatorNote:
      "Khalifa Mints crosses Wiz Khalifa's OG cut with Kush Mints — sharp OG gas welded to cool mint and cookie. The nose is loud and layered: lemon-pine gas over a cool mint and earthy base. The effect is heavy and relaxing — a euphoric head sinking into a strong body, evening-leaning. It's frosty, dense and very potent. For gassy-mint genetics with OG weight, Khalifa Mints is a heavy pick.",
    curatorQuote:
      "Lemon-pine gas over a cool mint and earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, frosty, gassy-mint OG named Khalifa Mints — 'Khalifa' meaning caliph, a ruler. A grand caliph's palace courtyard at night under cool mint-green and silver moonlight: scalloped Moorish arches and inlaid geometric tilework rimed in glittering frost, a still reflecting pool catching the icy glow, brass lanterns burning low. A cool minty vapor curls between the columns, threaded with a faint lemon-pine fuel haze and an oily petrol-rainbow shimmer. Lemon-pine gas rides over a cool mint and earthy base. Palette regal and icy — cool mint green and frost-silver over deep indigo night and earthy stone, brass accents and a faint petrol shimmer in the haze. Mood: heavy and relaxing — a euphoric head sinking into a strong body, an opulent evening crown. Cinematic, painterly, high-contrast, premium editorial poster, frosty and atmospheric. The strain name 'KHALIFA MINTS' baked into the scene — carved and gilded into the palace stone above the central arch. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "khalifa-mints.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lemon Cherry Pie",
    lineage: {
      parents: ["Lemon Cherry Gelato", "Cherry Pie"],
      cross: "Lemon Cherry Gelato × Cherry Pie (commonly cited)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Cherry-lemon dessert in the LCG lane"],
    curatorNote:
      "Lemon Cherry Pie sits in the Lemon Cherry Gelato lane — a cherry-and-lemon dessert with the same hyped, candy-forward profile. The nose is bright and fruity: sweet cherry and lemon over a creamy, faintly gassy base. The effect is balanced and easy — a euphoric, happy head with a relaxed body, sociable and gentle. It's frosty and flavour-forward, trading on LCG's bag appeal. For cherry-lemon candy in the hyped lane, Lemon Cherry Pie is a sweet pick.",
    curatorQuote:
      "Sweet cherry and lemon over a creamy, faintly gassy base.",
    sourceConfidence: "low",
  },

  // ── ROUND 10: PARENT-FILL + LANDRACES + CBD CLASSICS ──
  {
    canonicalName: "Jack's Cleaner",
    breeder: "Tom Hill",
    lineage: {
      parents: ["Jack Herer"],
      cross: "Jack Herer × NL5 Haze",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Lemon-floor-cleaner haze", "A parent of Jack the Ripper"],
    curatorNote:
      "Jack's Cleaner is a Tom Hill sativa — Jack Herer crossed back into NL5 Haze — named for a nose so sharp it reads like lemon floor cleaner. The smell is intense and clean: lemon and pine over a spicy, herbal haze. The effect is a fast, soaring cerebral high — energetic and creative with little body, a daytime strain. It's terpy and potent, and it's the sativa behind Jack the Ripper. For loud lemon-haze genetics, Jack's Cleaner is a connoisseur parent line.",
    curatorQuote:
      "Lemon and pine over a spicy, herbal haze.",
    sourceConfidence: "medium",
    tagline: "Lemon-pine cleaner",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Jack's Cleaner — Tom Hill's blisteringly sharp sativa (Jack Herer × NL5 Haze), so lemon-pine clean it reads like floor cleaner. A gleaming sunlit tiled hall at midday, just-mopped and spotless: a battered metal pail of water with halved lemons and fresh pine sprigs, an old wooden mop leaning in a streak of hard light, a sharp citrus-pine vapor hanging crisp in the air, every surface reflecting bright. Palette of acid lemon-yellow and clean pine-green over cold white tile and chrome, hyper-clean and high-key with a sharp medicinal edge. Mood: fast, soaring, electric — energetic creative clarity, almost antiseptic in its brightness, light bouncing hard off wet stone. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'JACK'S CLEANER' stencilled across the side of the metal pail. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Orange Velvet",
    lineage: {
      cross: "MzJill clone-only — a Skunk-forward PNW elite whose parents were kept private",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Creamy orange-citrus cut", "A parent of Jilly Bean"],
    curatorNote:
      "Orange Velvet is a creamy, orange-forward cut best known as a parent of Jilly Bean. The nose is sweet and smooth: orange and tangerine over a soft, creamy base. The effect is uplifting and easy — a happy, sociable head with a relaxed body, daytime-friendly. It's smooth and flavour-led, moderate in strength. For creamy orange-citrus genetics, Orange Velvet is a pleasant parent line.",
    curatorQuote:
      "Orange and tangerine over a soft, creamy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "OG #18",
    marketNames: ["OG Kush #18"],
    breeder: "Reserva Privada / DNA Genetics",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush phenotype #18",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["A prized numbered OG cut", "A parent of Holy Grail Kush"],
    curatorNote:
      "OG #18 is a prized numbered phenotype of OG Kush from Reserva Privada — a loud, frosty cut that became important breeding stock (it's half of Holy Grail Kush). The nose is classic OG: fuel and pine over a damp, earthy funk with a lemony lift. The effect is balanced-leaning-heavy — a euphoric head settling into a relaxing body. It's gassy, dense and very potent. For a select cut of OG genetics, #18 is a strong parent line.",
    curatorQuote:
      "Fuel and pine over a damp, earthy funk with a lemony lift.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a prized, numbered gas-OG phenotype named OG #18 — a select reserve cut. A dim, premium reserve vault at dusk: a single spotlit stone pedestal bears a polished brass plate engraved 'OG #18', rows of arched stone alcoves receding into shadow behind it, a fuel-petrol haze and a faint pine mist drifting through amber light. Palette rich and select — amber and brass gold with pine green over stone grey and petrol-blue shadow, a frosted sheen, fading into deep dusk. Mood: balanced and heavy — a euphoric head settling into a relaxing body, reserved and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'OG #18' baked into the scene — engraved on the brass plate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "og-18.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Burmese Kush",
    marketNames: ["Burmese"],
    breeder: "TH Seeds",
    lineage: {
      cross: "Burmese landrace selection",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Burmese landrace cut", "Behind Pink Panties and Champagne"],
    curatorNote:
      "Burmese Kush is a TH Seeds selection from a Burmese landrace — a sweet, spicy indica that became a quiet parent across the Sherbinski world (Pink Panties, Champagne). The nose is earthy and sweet: spice and sandalwood over a woody base. The effect is relaxing and warm — a happy, calming high with a comfortable body, evening-leaning. It's dense and frosty, an old-world building block. For Burmese landrace genetics, this is a source cut.",
    curatorQuote:
      "Spice and sandalwood over a woody base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Romulan",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Pine-heavy North American indica", "A parent of Space Queen"],
    curatorNote:
      "Romulan is a pine-heavy North American indica of contested origin — a potent, sedating cut named for the Star Trek aliens, and a parent of Space Queen. The nose is sharp and green: pine and earth over a skunky, woody base. The effect is deeply relaxing — a heavy body stone that quiets the mind and drifts toward sleep. It's dense, frosty and strong, prized for numbing body relaxation. For heavy pine-indica genetics, Romulan is a classic parent line.",
    curatorQuote:
      "Pine and earth over a skunky, woody base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Big Bud",
    lineage: {
      parents: ["Afghani", "Skunk #1"],
      cross: "Afghani × Skunk × Northern Lights",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Huge-yielding indica", "A parent of Granddaddy Purple"],
    curatorNote:
      "Big Bud is an Afghani/Skunk/Northern Lights blend famous for enormous, heavy colas — a commercial workhorse and a parent of Granddaddy Purple. The nose is sweet and earthy: skunky sweetness over a spicy, earthy base. The effect is relaxing and weighty — a calm, body-leaning high that eases toward sleep. It's a big-yielding, moderate-to-strong indica, more comfort than complexity. For classic heavy-indica genetics behind GDP, Big Bud is a building block.",
    curatorQuote:
      "Skunky sweetness over a spicy, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sensi Star",
    breeder: "Paradise Seeds",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Award-winning frosty indica", "Metallic-citrus nose"],
    curatorNote:
      "Sensi Star is a Paradise Seeds indica of undisclosed lineage — a multiple Cup winner known for a unique metallic-citrus nose and heavy frost. The smell is sharp and earthy: lemon and metal over a spicy, herbal base. The effect is strongly relaxing — a euphoric head sinking into a heavy, numbing body, an evening strain. It's dense, very frosty and potent, a connoisseur's indica. For a distinctive, award-decorated indica, Sensi Star endures.",
    curatorQuote:
      "Lemon and metal over a spicy, herbal base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an award-winning, heavy, frosty indica named Sensi Star. A single radiant crystalline star suspended in deep indigo night — faceted like a frost-coated metallic gem, glittering silver-white with a sharp lemon-gold glint and a cool chrome sheen across its edges, soft cosmic dust and a faint spicy-herbal haze drifting around it. Lemon and metal over a spicy, herbal base. Palette cosmic and metallic — frost-silver and chrome with a lemon-gold glint over deep indigo and violet night, glittering trichome-frost sparkle and a cool metallic shine. Mood: strongly relaxing — a euphoric head sinking into a heavy, numbing body, a dense evening indica. Cinematic, painterly, high-contrast, premium editorial poster, luminous and atmospheric. The strain name 'SENSI STAR' baked into the scene — etched into the star's metallic facets or the dark below. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sensi-star.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "God Bud",
    breeder: "BC Bud Depot",
    lineage: {
      parents: ["Hawaiian"],
      cross: "Hawaiian × Purple Skunk × God",
      parentDetails: {
        "Hawaiian": { lineageBrief: "Hawaiian landrace sativa", type: "sativa" },
      },
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Sweet, heavy BC indica"],
    curatorNote:
      "God Bud is a BC Bud Depot classic — a Hawaiian, Purple Skunk and 'God' blend that won early Cups for its sweet nose and heavy body. The smell is sweet and fruity: berry and tropical sweetness over an earthy base. The effect is deeply relaxing — a euphoric head sinking into a sedating body, an evening and sleep strain. It's dense, frosty and potent, a Canadian heavyweight. For sweet, heavy BC-bud genetics, God Bud is a reliable classic.",
    curatorQuote:
      "Berry and tropical sweetness over an earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Harlequin",
    lineage: {
      parents: ["Colombian Gold", "Thai"],
      cross: "Colombian Gold × Thai × Swiss landrace",
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["High-CBD sativa", "Clear, gentle, functional"],
    curatorNote:
      "Harlequin is one of the defining high-CBD strains — a Colombian Gold, Thai and Swiss landrace blend bred for a roughly balanced CBD:THC ratio. The nose is earthy and sweet: mango and citrus over a woody, herbal base. The effect is clear and gentle — relaxed and focused with little intoxication, the strain people reach for to stay functional. It's smooth and mild, prized for calm without the high. For a clear-headed CBD sativa, Harlequin is the benchmark.",
    curatorQuote:
      "Mango and citrus over a woody, herbal base.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "ACDC",
    marketNames: ["AC/DC"],
    lineage: {
      parents: ["Cannatonic"],
      cross: "Cannatonic phenotype (high-CBD)",
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Very high CBD, near-zero high"],
    curatorNote:
      "ACDC is a high-CBD phenotype of Cannatonic with a CBD:THC ratio so lopsided there's almost no intoxication at all. The nose is mild and earthy: sweet, woody pine over a faint herbal base. The effect is barely a 'high' — a clear, calm, focused ease that leaves the head functional. It's smooth and gentle, one of the most-recommended therapeutic CBD cuts. For calm with essentially no high, ACDC is a go-to.",
    curatorQuote:
      "Sweet, woody pine over a faint herbal base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a near-zero-high, calming CBD pine cut named ACDC — its name an electric current, its effect serene. Soft blue-white electric arcs flowing calmly through a misty pine forest at dusk, gentle ribbons of current threading between the trunks like quiet lightning that soothes rather than strikes, a clean glow settling over the woody ground. Sweet, woody pine over a faint herbal base in the cool, still air. Palette cool and clean — electric blue and soft white current over deep pine green and woody shadow, a calm teal glow and gentle luminous mist. Mood: clear, calm, focused — a barely-there high, smooth, gentle and grounding. Cinematic, painterly, high-contrast, premium editorial poster, serene and atmospheric. The strain name 'ACDC' baked into the scene — traced in the glowing electric arc or carved into pine woodgrain. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no band imagery, no cannabis leaves, buds or packaging.",
    artFileName: "acdc.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cannatonic",
    breeder: "Resin Seeds",
    lineage: {
      parents: ["MK Ultra", "G13"],
      cross: "MK Ultra × G13 Haze",
      parentDetails: {
        "MK Ultra": { lineageBrief: "OG Kush × G13", type: "indica" },
      },
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["The foundational CBD strain"],
    curatorNote:
      "Cannatonic is a Resin Seeds cross of MK Ultra and G13 Haze — the foundational high-CBD strain that parented ACDC and much of the therapeutic world. The nose is earthy and citrus-sweet: lemon and wood over a soft herbal base. The effect is mellow and clear — a relaxed, lightly uplifting calm with only mild intoxication. It's smooth and gentle, bred for balance rather than potency. As the source of so many CBD cuts, Cannatonic is a cornerstone.",
    curatorQuote:
      "Lemon and wood over a soft herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Charlotte's Web",
    marketNames: ["CW", "Hippie's Disappointment"],
    breeder: "Stanley Brothers",
    lineage: {
      cross: "High-CBD industrial-hemp selection",
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Famous CBD hemp", "Almost no THC"],
    curatorNote:
      "Charlotte's Web is the Stanley Brothers' famous high-CBD hemp line — named for Charlotte Figi, whose story put CBD on the map, and so low in THC it's effectively non-intoxicating. The nose is earthy and clean: pine and wood over a herbal, faintly floral base. The effect is barely psychoactive — a calm, focused, grounding ease with no real high. It's smooth and mild, a therapeutic cultivar more than a recreational one. For CBD with essentially zero high, Charlotte's Web is the icon.",
    curatorQuote:
      "Pine and wood over a herbal, faintly floral base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a calm, barely-psychoactive high-CBD hemp named Charlotte's Web. A delicate spider's web strung between pine boughs at soft dawn, every strand beaded with glistening morning dew that catches the first gentle light like tiny prisms; calm mist drifts through the quiet pine wood behind it, herbal and clean, a faint floral softness in the cool still air. Pine and wood over a herbal, faintly floral base. Palette serene and natural — soft sage green and dewy silver over warm pine wood and a pale gold dawn, gentle and luminous with delicate light. Mood: calm, focused, grounding — a clear, gentle ease with no real high, smooth and therapeutic. Cinematic, painterly, high-contrast, premium editorial poster, delicate and atmospheric. The strain name 'CHARLOTTE'S WEB' baked into the scene — carved into a weathered pine branch or woodgrain at the edge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "charlotte-s-web.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "high",
  },
  {
    canonicalName: "Ringo's Gift",
    lineage: {
      parents: ["Harlequin", "ACDC"],
      cross: "Harlequin × ACDC",
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["CBD-dominant blend", "Named for Lawrence Ringo"],
    curatorNote:
      "Ringo's Gift is a CBD-dominant cross of Harlequin and ACDC — named for CBD pioneer Lawrence Ringo, and built to push the ratio even further toward CBD. The nose is earthy and sweet: herbal pine and a light citrus over a woody base. The effect is gentle and clear — a relaxed, focused calm with minimal intoxication, functional and soothing. It's smooth and mild, a favourite for daytime therapeutic use. For a CBD-forward blend with a clear head, Ringo's Gift is a standout.",
    curatorQuote:
      "Herbal pine and a light citrus over a woody base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a gentle, clear-headed CBD-dominant blend named Ringo's Gift. A peaceful pine clearing at warm mid-morning, soft golden sunbeams streaming through the trees and forming glowing concentric rings of light in the herbal haze — a gift of warm calm light pooling on the woody forest floor, a faint citrus brightness and herbal pine softness in the still air. Herbal pine and light citrus over a woody base. Palette warm and serene — gentle gold and sage green over warm woody browns, luminous halos of soft sunlight and a clear citrus glow, calm and natural. Mood: gentle, focused, soothing — a relaxed, clear calm with minimal intoxication, functional and daytime-therapeutic. Cinematic, painterly, high-contrast, premium editorial poster, warm and atmospheric. The strain name 'RINGO'S GIFT' baked into the scene — carved into a weathered wooden trail post or woodgrain at the edge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "ringo-s-gift.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sour Tsunami",
    lineage: {
      parents: ["Sour Diesel", "NYC Diesel"],
      cross: "Sour Diesel × NYC Diesel",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["One of the first CBD-rich strains"],
    curatorNote:
      "Sour Tsunami is a Lawrence Ringo creation — Sour Diesel crossed with NYC Diesel and selected over years for CBD — one of the first strains bred deliberately for it. The nose is gassy and bright: sour diesel and citrus over an earthy base. The effect is mild and clear — a relaxed, calm, lightly uplifting ease with little of the usual diesel rush. It's smooth and functional, a pioneering CBD cut with real flavour. For a gassy CBD strain, Sour Tsunami is a flavourful classic.",
    curatorQuote:
      "Sour diesel and citrus over an earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a smooth, mild, gassy CBD diesel named Sour Tsunami. A towering ocean wave curling at dawn, its glassy barrel catching low golden light — sea spray hanging in the air shot through with a faint oily petrol-rainbow shimmer, sour citrus-gold glow rippling across the water's face, the curl smooth and powerful but unbroken. Sour diesel and citrus drift over a clean, earthy sea-salt base. Palette fresh and luminous — sour citrus-gold and lime-green over deep ocean teal and foam-white spray, a faint diesel shimmer threading the mist under a soft dawn sky. Mood: calm, clear, lightly uplifting — a relaxed, smooth ease with little rush, mellow and functional. Cinematic, painterly, high-contrast, premium editorial poster, fluid and atmospheric. The strain name 'SOUR TSUNAMI' baked into the scene — carved into a wet dark rock or weathered driftwood at the water's edge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sour-tsunami.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lebanese",
    marketNames: ["Lebanese Landrace"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Bekaa Valley landrace", "Traditional red-hash plant"],
    curatorNote:
      "Lebanese is a landrace from the Bekaa Valley — a hardy, resin-rich indica traditionally harvested late and pressed into the famous red and blonde Lebanese hash. The nose is earthy and sweet: spice and dried fruit over a woody, hashy base. The effect is calm and relaxing — a mellow, grounding body ease, moderate rather than overwhelming. It's dense and well-cured by nature, prized for hash and heritage. For old-world Middle Eastern hash genetics, Lebanese is a source.",
    curatorQuote:
      "Spice and dried fruit over a woody, hashy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Moroccan",
    marketNames: ["Ketama", "Moroccan Landrace"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Rif Mountains landrace", "Classic kif and hash plant"],
    curatorNote:
      "Moroccan is the Rif Mountains landrace behind centuries of kif and hash — a hardy, early indica grown across northern Morocco's Ketama region. The nose is earthy and sweet: herbal spice and a dry, hashy sweetness. The effect is calm and gently relaxing — a mellow, social body ease, moderate and traditional. It's grown for resin first, a cornerstone of the hashish world. For classic Moroccan hash genetics, this landrace is foundational.",
    curatorQuote:
      "Herbal spice and a dry, hashy sweetness.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Congolese",
    marketNames: ["Congo"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Central African landrace", "Clean equatorial sativa"],
    curatorNote:
      "Congolese is a Central African landrace — a clean, energetic equatorial sativa used by breeders like Ace Seeds to add vigour and a bright high. The nose is earthy and sweet: spicy, incense-like sweetness with a faint citrus. The effect is up and clear — an energetic, creative, social head with no body, a true daytime landrace. It's hardy and moderate, prized for heritage and a relentless lift. For old-world African sativa, Congolese is a source.",
    curatorQuote:
      "Spicy, incense-like sweetness with a faint citrus.",
    sourceConfidence: "medium",
    tagline: "Equator Awakened",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Congolese, a clean, energetic Central African equatorial landrace prized by breeders for vigour and a bright high. A towering equatorial rainforest in the Congo basin at mid-morning: colossal buttressed tree trunks vanishing into the green canopy, dense ferns and broad leaves, a river of golden light cutting through the humid mist and faint drifting incense-like haze between the trunks. Palette of deep rainforest green, sweet earthy browns, resinous pine, spicy incense ambers and a faint citrus glow from the earthy-sweet-pine-spicy-citrus profile. The mood is uplifting, euphoric and creative, mist and pollen rising in slow energetic columns through the light shafts, lit by warm bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name CONGOLESE is carved into the smooth bark of the great buttress-rooted tree dominating the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Oaxacan",
    marketNames: ["Oaxacan Highland"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Mexican highland landrace", "Sweet, soaring sativa"],
    curatorNote:
      "Oaxacan is a Mexican highland landrace from the mountains of Oaxaca — a sweet, soaring sativa that fed early American imports and Haze breeding. The nose is sweet and earthy: honeyed grass and citrus over a faint spice. The effect is up and creative — an energetic, happy, almost psychedelic head with no body, a heritage daytime strain. It's mild by modern standards but historically rich. For old-world Mexican highland sativa, Oaxacan is a classic source.",
    curatorQuote: "Sweet citrus-grass with a faint earthy spice.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Williams Wonder",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Fast, frosty Afghani-derived indica"],
    curatorNote:
      "Williams Wonder is an old-school, Afghani-derived indica famous in the 80s-90s for fast flowering, heavy resin and serious potency. The nose is earthy and sweet: skunky sweetness over a woody, hashy base. The effect is heavily relaxing — a warm, sedating body weight that drifts toward sleep, a classic nightcap. It's dense, frosty and strong, a breeder's favourite for speed and frost. For fast, heavy Afghani indica genetics, Williams Wonder is a quiet classic.",
    curatorQuote:
      "Skunky sweetness over a woody, hashy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sherbacio",
    lineage: {
      parents: ["Sunset Sherbet", "Biscotti"],
      cross: "Sunset Sherbet × Biscotti",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Creamy sherbet over a gassy cookie base"],
    curatorNote:
      "Sherbacio crosses Sunset Sherbet with Biscotti — creamy sherbet sweetness laid over a gassy, coffee-tinged cookie. The nose is rich and sweet: sherbet and cream over a gassy, earthy cookie funk. The effect is relaxing and euphoric — a happy head easing into a comfortable body, afternoon into evening. It's frosty and flavour-forward, in the polished Cookies/Sherbinski lane. For sherbet-and-cookie dessert character, Sherbacio is a smooth pick.",
    curatorQuote:
      "Sherbet and cream over a gassy, earthy cookie funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a creamy, frosty sherbet-cookie dessert exotic named Sherbacio. Smooth scoops of pastel sherbet — pistachio green and sherbet pink swirled with cream — quenelled in an elegant coupe with a golden biscotti cookie standing upright in it, a glistening frosted sheen sweating off the cold sorbet in soft cool light; a faint curl of vapor carries an oily petrol-rainbow shimmer hinting at the gassy cookie base. Sherbet and cream over a gassy, earthy cookie funk. Palette fresh and creamy — pastel pistachio green and sherbet pink with caramel-gold biscotti, a frosty silver sheen and a faint petrol shimmer over a soft pale glow. Mood: relaxing and euphoric — a happy head easing into a comfortable body, smooth and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, elegant and appetizing. The strain name 'SHERBACIO' baked into the scene — hand-lettered on a small enamel dessert tag or the coupe. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sherbacio.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── ROUND 11: PARENT-FILL + LANDRACES + CLASSICS ──
  {
    canonicalName: "MK Ultra",
    breeder: "TH Seeds",
    lineage: {
      parents: ["OG Kush", "G13"],
      cross: "OG Kush × G13",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Hypnotic heavy indica", "A parent of Cannatonic"],
    curatorNote:
      "MK Ultra is a TH Seeds cross of OG Kush and G13 — a Cup-winning indica named for its near-hypnotic potency. The nose is gassy and earthy: fuel and pine over a skunky, herbal base. The effect is heavy and dazing — a fast euphoric head that sinks into a couch-locking body, firmly a nightcap. It's dense, frosty and very strong, and it's a parent of the CBD foundation strain Cannatonic. For heavy, hypnotic OG-G13 genetics, MK Ultra is a classic.",
    curatorQuote:
      "Fuel and pine over a skunky, herbal base.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Purple Skunk",
    lineage: {
      parents: ["Skunk #1"],
      cross: "Skunk #1 purple phenotype",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Purple Skunk selection", "A parent of God Bud"],
    curatorNote:
      "Purple Skunk is a purple-hued selection of Skunk #1 — sweet grape over the classic skunk funk, and a parent of God Bud. The nose is sweet and fruity: grape and berry over a skunky, earthy base. The effect is balanced and happy — a relaxing, mood-lifting high with a comfortable body. It's frosty and colourful, a flavour-led skunk variant. For purple skunk genetics, this is a likeable parent line.",
    curatorQuote:
      "Grape and berry over a skunky, earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, fruity purple skunk variant named Purple Skunk. A striking skunk with deep purple-and-silver fur prowling at dusk through a grape-violet haze, its bold white stripe catching the low light, ripe grapes and berries scattered in the earthy underbrush around it, a skunky funk mist curling through the air with a glittering trichome-frost sparkle. Grape and berry over a skunky, earthy base. Palette rich and colourful — deep grape purple and berry-violet with silver-white fur highlights over an earthy dusk shadow, a frosty sparkle in the hazy air. Mood: balanced and happy — a relaxing, mood-lifting high with a comfortable body, frosty and colourful. Cinematic, painterly, high-contrast, premium editorial poster, atmospheric and detailed. The strain name 'PURPLE SKUNK' baked into the scene — carved into a weathered wooden sign or mossy stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "purple-skunk.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lavender",
    marketNames: ["Lavender Kush"],
    breeder: "Soma Seeds",
    lineage: {
      parents: ["Super Skunk", "Afghani"],
      cross: "Super Skunk × Big Skunk Korean × Afghani Hawaiian",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Floral-spice indica", "A parent of Chile Verde"],
    curatorNote:
      "Lavender is a Soma Seeds indica — a Super Skunk, Korean Skunk and Afghani-Hawaiian blend — named for its genuinely floral, lavender-like nose. The smell is unusual and sweet: flowers and spice over a herbal, hashy base. The effect is relaxing and warm — a euphoric head sinking into a heavy body, evening-leaning. It's frosty, purple-tinged and potent, and it lends its floral funk to Chile Verde. For a genuinely floral indica, Lavender stands apart.",
    curatorQuote:
      "Flowers and spice over a herbal, hashy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blue Power",
    breeder: "Sin City Seeds",
    lineage: {
      parents: ["Master Kush", "Blueberry", "The White"],
      cross: "Master Kush × The White × Blueberry × Sour Double",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Frosty blue hybrid", "A parent of Animal Mints and Apples and Bananas"],
    curatorNote:
      "Blue Power is a Sin City Seeds hybrid — a Master Kush, The White, Blueberry and Sour Double blend — frosty and sweet, and an important modern parent (Animal Mints, Apples and Bananas). The nose is sweet and fruity: blueberry and berry over a faint gas. The effect is balanced and relaxing — a euphoric head easing into a comfortable body. It's extremely frosty and potent, prized as breeding stock. For frosty blue-fruit genetics behind the cookie world, Blue Power is a key line.",
    curatorQuote:
      "Blueberry and berry over a faint gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an extremely frosty, sweet blue-fruit hybrid named Blue Power. A cluster of plump frosted blueberries crackling with raw electric-blue energy — jagged power arcs and a charged blue surge leaping between the fruit, glittering trichome-frost riming their skins, a faint oily petrol-rainbow shimmer threading the charged dark. Blueberry and berry over a faint gas. Palette electric and cool — deep blueberry blue and indigo with crackling electric cyan-white, frosted silver sparkle and a faint petrol shimmer over a dark dramatic shadow. Mood: balanced and relaxing — a euphoric head easing into a comfortable body, frosty and potent. Cinematic, painterly, high-contrast, premium editorial poster, charged and atmospheric. The strain name 'BLUE POWER' baked into the scene — crackling in the electric arc or stamped on a dark metal plate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "blue-power.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sweet Tooth",
    marketNames: ["Sweetooth"],
    breeder: "Barney's Farm",
    lineage: {
      parents: ["Afghani", "Hawaiian"],
      cross: "Afghani × Nepali × Hawaiian",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Candy-sweet mellow indica"],
    curatorNote:
      "Sweet Tooth is a Barney's Farm indica — an Afghani, Nepali and Hawaiian blend — a Cup winner famous for genuinely candy-sweet flavour. The nose is sweet and floral: berry and fruit over a soft, earthy base. The effect is mellow and happy — a relaxing, mood-lifting high that stays comfortable, moderate rather than crushing. It's frosty and approachable, a flavour-first classic. For candy-sweet indica genetics, Sweet Tooth is a likeable name.",
    curatorQuote:
      "Berry and fruit over a soft, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pineapple",
    lineage: {
      parents: ["Ed Rosenthal Super Bud"],
      cross: "An Ed Rosenthal Super Bud (ERSB) F2 selection (Sensi Seeds)",
      parentDetails: {
        "Ed Rosenthal Super Bud": { lineageBrief: "Jamaican × South Asian × Mexican × Afghani", type: "hybrid" },
      },
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Tropical pineapple Skunk selection"],
    curatorNote:
      "Pineapple is a tropical, fruit-forward selection in the Skunk family — bright pineapple flavour over a sweet base, and a relative of Pineapple Express's nose. The smell is juicy and sweet: ripe pineapple and tropical fruit over a light earthy floor. The effect is uplifting and easy — a happy, creative head with a relaxed body, daytime-friendly. It's smooth and flavour-led, moderate in strength. For clean tropical-pineapple character, it's a cheerful pick.",
    curatorQuote:
      "Ripe pineapple and tropical fruit over a light earthy floor.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lemon Up",
    lineage: {
      parents: ["Lemon G", "Do-Si-Dos"],
      cross: "Lemon G × Do-Si-Dos (a Lemon Tree × Purple Punch × Trop Cookies version is also sold — not verified)",
    },
    breeder: "Cookies",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Bright Cookies lemon cut"],
    curatorNote:
      "Lemon Up is a Cookies-camp lemon cut — a bright, zesty citrus hybrid built around clean lemon flavour. The nose is fresh and sharp: lemon and citrus over a light sweet, earthy base. The effect is uplifting and focused — an energetic, happy head with a light body, daytime-leaning. It's terpy and frosty, flavour-forward rather than heavy. For clean lemon citrus from the Cookies world, Lemon Up is a zesty pick.",
    curatorQuote:
      "Lemon and citrus over a light sweet, earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Punto Rojo",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Colombian highland landrace", "Red-haired soaring sativa"],
    curatorNote:
      "Punto Rojo is a Colombian highland landrace — a red-haired, long-flowering sativa from the same heritage that gave us Colombian Gold. The nose is earthy and sweet: spicy, grassy sweetness with a faint citrus. The effect is up and clear — an energetic, creative, almost psychedelic head with no body, a true heritage daytime sativa. It's moderate and pure, prized by landrace collectors. For old-world Colombian sativa, Punto Rojo is a classic source.",
    curatorQuote: "Grassy spice and faint citrus, a Colombian highland sativa.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Luang Prabang",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Laotian landrace", "Bright electric sativa"],
    curatorNote:
      "Luang Prabang is a Laotian landrace from the highlands of northern Laos — a bright, electric equatorial sativa prized by Southeast Asian landrace hunters. The nose is sharp and clean: citrus and spice over an earthy, herbal base. The effect is fast and heady — an energetic, almost buzzy cerebral high with no body, a pure daytime landrace. It's long-flowering and moderate, a heritage rarity. For old-world Laotian sativa, Luang Prabang is a source.",
    curatorQuote: "Citrus and spice over herbal earth, a highland Lao sativa.",
    sourceConfidence: "medium",
    tagline: "Mekong Temple Sativa",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Luang Prabang, a Laotian landrace sativa from the highlands of northern Laos, bright, electric and equatorial. Scene: the temple town of Luang Prabang on the Mekong, gilded tiered temple roofs and ornate stupas rising above misty river bends, longboats on jade-green water, lemongrass and herbal foliage in the foreground. Palette and light: bright citrus-gold and temple-saffron over jade river-green and earthy teak-brown, with spicy ochre and herbal sage accents; clear bright Southeast-Asian daytime sun with soft river haze. Mood and motion: energetic, creative and euphoric head-lift, incense and river mist drifting, palm and lemongrass swaying in a warm breeze, the luminous clarity of midday. Cinematic, painterly, high-contrast, premium editorial poster. The name LUANG PRABANG carved into a gilded temple lintel above the riverside steps. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Aceh",
    marketNames: ["Atjeh"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Sumatran landrace", "Earthy-sweet tropical sativa"],
    curatorNote:
      "Aceh is a Sumatran landrace from the Aceh region of Indonesia — an earthy-sweet tropical sativa grown in the equatorial heat. The nose is warm and sweet: spicy, woody sweetness over a herbal base. The effect is uplifting and gentle — a happy, creative head with a faint relaxing edge, an unusual not-quite-pure-race landrace. It's smooth and moderate, prized for heritage. For old-world Indonesian sativa, Aceh is a source.",
    curatorQuote: "Sweet spice over herbal earth, a tropical Sumatran sativa.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Kilimanjaro",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Tanzanian landrace", "Fierce, clean sativa"],
    curatorNote:
      "Kilimanjaro is a Tanzanian landrace from the slopes of its namesake mountain — locally called 'elephant flattener' for its fierce, clean energy. The nose is bright and earthy: citrus and spice over a sweet, grassy base. The effect is intensely up — an energetic, alert, almost relentless head with no body, a pure equatorial daytime sativa. It's hardy and moderate, prized by landrace collectors. For old-world East African sativa, Kilimanjaro is a striking source.",
    curatorQuote:
      "Citrus and spice over a sweet, grassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Zamal",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Réunion Island landrace", "Rare soaring tropical sativa"],
    curatorNote:
      "Zamal is a landrace from Réunion Island in the Indian Ocean — a rare, soaring tropical sativa with French-island heritage. The nose is clean and bright: citrus and herbs over an earthy, spicy base. The effect is fast and clear — an energetic, creative, heady high with no body, a pure equatorial daytime strain. It's long-flowering and moderate, a true rarity. For old-world island sativa genetics, Zamal is a collector's source.",
    curatorQuote:
      "Citrus and herbs over an earthy, spicy base.",
    sourceConfidence: "medium",
    tagline: "Volcano Rising",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Zamal, a rare soaring tropical sativa landrace from Réunion Island in the Indian Ocean with French-island heritage. A dramatic Réunion volcanic landscape: black basalt lava ridges of the Piton highlands plunging toward turquoise tropical sea, lush green ravines, banana and palm fronds clinging to the slopes and faint volcanic steam threading the air. Palette of bright citrus yellow and lime, deep volcanic black and ash-grey, spicy woody browns and warm tropical greens from the citrus-woody-spicy-tropical nose. The mood is fast, clear and euphoric, sea spray and warm thermals rising in a quick soaring updraft off the cliffs, lit by brilliant equatorial bright daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name ZAMAL is chiselled into a flat slab of black volcanic rock wedged in the foreground lava field. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Grape Krush",
    lineage: {
      parents: ["Blueberry", "Haze"],
      cross: "A DJ Short Blueberry-line cross (Blueberry × Haze; details sparse — not verified)",
    },
    marketNames: ["Grape Crush"],
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Fizzy grape indica"],
    curatorNote:
      "Grape Krush is a sweet grape indica — fizzy grape-soda flavour over a relaxing body. The nose is sweet and fruity: grape and dark berry over an earthy base. The effect leans relaxing — a happy, calming high with a comfortable body, evening-friendly. It's frosty and flavour-led, an easy grape pick. For fizzy grape-candy character with a soft body, Grape Krush is a likeable indica.",
    curatorQuote:
      "Grape and dark berry over an earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "White Fire OG",
    marketNames: ["WiFi OG", "WiFi"],
    breeder: "OG Raskal Seeds",
    lineage: {
      parents: ["Fire OG", "The White"],
      cross: "Fire OG × The White",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Frosty, gassy, balanced OG"],
    curatorNote:
      "White Fire OG (WiFi OG) is an OG Raskal cross of Fire OG and The White — the gas of Fire OG with The White's extreme frost. The nose is loud OG: fuel and pine over an earthy, lemony funk. The effect is balanced — a euphoric, creative head with a relaxing body, usable across the day unlike many heavy OGs. It's extremely frosty and potent, a connoisseur's gas hybrid. For a frosty, balanced cut of OG genetics, WiFi is a modern favourite.",
    curatorQuote:
      "Fuel and pine over an earthy, lemony funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, gassy, balanced OG named White Fire OG. A ghostly white-blue flame burning impossibly cold over a dark, frost-crusted ridge at night — the fire the palest white-hot blue, throwing silver light across glittering trichome-frost on the pines below, fuel haze feeding the flame and shimmering with a faint petrol-rainbow edge. Loud OG in the cold air — fuel and pine over an earthy, lemony funk. Palette stark and electric — white-hot and icy blue flame over silver frost and deep pine-black, a touch of lemon-gold in the embers and faint oily shimmer in the haze. Mood: balanced and potent — a euphoric, creative head over a relaxing body, extremely frosty and gassy. Cinematic, painterly, high-contrast, premium editorial poster, dramatic and atmospheric. The strain name 'WHITE FIRE OG' baked into the scene — branded into the frosted ridge stone or seared in glowing embers. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "white-fire-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Biscotti Sundae",
    lineage: {
      parents: ["Biscotti", "Sundae Driver"],
      cross: "Biscotti × Sundae Driver",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Gassy cookie over creamy fruit"],
    curatorNote:
      "Biscotti Sundae crosses Biscotti with Sundae Driver — gassy, coffee-tinged cookie meeting smooth, creamy fruit. The nose is rich and layered: sweet cookie and gas over a creamy, fruity base. The effect is relaxing and euphoric — a happy head easing into a comfortable body, afternoon into evening. It's frosty and flavour-forward, in the polished dessert lane. For gassy cookie with a creamy lift, Biscotti Sundae is a smooth pick.",
    curatorQuote:
      "Sweet cookie and gas over a creamy, fruity base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, flavour-forward gassy-cookie dessert hybrid named Biscotti Sundae. A decadent ice cream sundae in a tall glass crowned with golden biscotti cookies, creamy swirls drizzled with fruity-berry sauce and a dusting of coffee-cocoa, a glistening frosted sheen sweating off the cold cream in warm late-afternoon light. The air is rich and layered: sweet cookie and a faint gas note over a creamy, fruity base. Palette luscious and warm — creamy ivory and caramel-gold biscotti with berry-red and cocoa-brown, a frosty silver sheen under a honeyed amber glow. Mood: relaxing and euphoric — a happy head easing into a comfortable body, afternoon into evening. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'BISCOTTI SUNDAE' baked into the scene — hand-lettered on a small enamel dessert tag or the glass. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "biscotti-sundae.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Goji OG",
    breeder: "Bodhi Seeds",
    lineage: {
      parents: ["Nepali OG", "Snow Lotus"],
      cross: "Nepali OG × Snow Lotus",
      parentDetails: {
        "Nepali OG": { lineageBrief: "Nepalese × OG Kush", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Berry-licorice sativa-lean", "A Bodhi classic"],
    curatorNote:
      "Goji OG is a Bodhi Seeds cross of Nepali OG and Snow Lotus — a sativa-leaning hybrid with an unusual berry-and-licorice nose. The smell is sweet and complex: red berry and cherry-licorice over a piney, earthy base. The effect is up and warm — an uplifting, happy, energetic head with a relaxing body, daytime-friendly. It's terpy and potent, one of Bodhi's most beloved releases. For berry-licorice genetics with an OG lift, Goji OG is a modern classic.",
    curatorQuote:
      "Red berry and cherry-licorice over a piney, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "White Gushers",
    lineage: {
      parents: ["Gushers"],
      cross: "Gushers phenotype (white, frost-selected)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Frosty white Gushers pheno"],
    curatorNote:
      "White Gushers is a frost-selected, near-white phenotype of Gushers — the tropical candy of Gushers with extra trichome coverage. The nose is sweet and fruity: tropical candy and berry over a light gas. The effect is balanced and feel-good — a euphoric head with a relaxed body, sociable and potent. It's extremely frosty and flavour-forward, the prized cut of the Gushers line. For candy fruit with maximum frost, White Gushers is a standout.",
    curatorQuote:
      "Tropical candy and berry over a light gas.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an extremely frosty, near-white candy phenotype named White Gushers. Glossy tropical fruit-candy gushers caked and rimed in a thick, glittering blanket of pure white trichome frost — the heavy snow-white frost dominating, soft tropical berry and fruit colors barely glowing through the ice, a faint oily petrol-rainbow shimmer in the cold sweet mist. Tropical candy and berry over a light gas, buried under maximum frost. Palette icy and pale — dominant frost-white and silver-white sparkle with muted pastel berry, magenta and mango glowing faintly beneath, a faint petrol shimmer over a soft cool shadow. Mood: balanced and feel-good — a euphoric head with a relaxed body, sociable and ultra-frosty. Cinematic, painterly, high-contrast, premium editorial poster, glittering and appetizing. The strain name 'WHITE GUSHERS' baked into the scene — hand-lettered on a small enamel dessert tag or etched into the frost. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "white-gushers.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Snow Lotus",
    breeder: "Bodhi Seeds",
    lineage: {
      parents: ["Afgooey", "Blockhead"],
      cross: "Afgooey × Blockhead",
      parentDetails: {
        "Blockhead": { lineageBrief: "Sweet Tooth × ... (Subcool line)", type: "hybrid" },
      },
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Frosty, sweet breeding male", "Behind Goji OG and many Bodhi crosses"],
    curatorNote:
      "Snow Lotus is a Bodhi Seeds cross of Afgooey and Blockhead — a frosty, sweet-and-earthy plant that became one of Bodhi's most-used breeding males (it's behind Goji OG). The nose is sweet and earthy: berry and resin over a piney base. The effect is balanced and relaxing — a euphoric head with a comfortable body. It's resin-heavy and potent, prized for the frost and complexity it passes to its offspring. For Bodhi's foundational breeding genetics, Snow Lotus is a key line.",
    curatorQuote:
      "Berry and resin over a piney base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, sweet-and-earthy resin-heavy hybrid named Snow Lotus. A luminous white lotus flower blooming amid alpine snow at cold dawn, every petal rimed in glittering ice and a heavy resinous, trichome-like frost, soft berry-pink blush at the petal tips and dark pine boughs framing the still, snowy scene; a faint cold mist drifts low, a wet resin sheen catching the pale light. Berry and resin over a piney base, sweet and earthy. Palette serene and icy — frost-white and silver with soft berry pink and deep pine green over a pale blue-gold dawn, glittering ice sparkle and a resinous sheen. Mood: balanced and relaxing — a euphoric head with a comfortable body, frosty and complex. Cinematic, painterly, high-contrast, premium editorial poster, delicate and atmospheric. The strain name 'SNOW LOTUS' baked into the scene — carved into frosted stone or ice at the flower's base. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "snow-lotus.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Blue Magoo",
    marketNames: ["Blue Magoob"],
    lineage: {
      parents: ["Blueberry", "Major League Bud"],
      cross: "DJ Short Blueberry × Major League Bud",
      parentDetails: {
        "Major League Bud": { lineageBrief: "William's Wonder × ... selection", type: "indica" },
      },
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet berry, gentle body"],
    curatorNote:
      "Blue Magoo is a Blueberry cross — DJ Short's Blueberry into Major League Bud — a sweet, berry-floral indica-lean with a gentle reputation. The nose is sweet and fruity: blueberry and floral berry over a soft earthy base. The effect is mellow and happy — a relaxing, mood-lifting body ease that stays comfortable, not crushing. It's frosty and smooth, flavour-first. For sweet berry character with a gentle body, Blue Magoo is a likeable pick.",
    curatorQuote:
      "Blueberry and floral berry over a soft earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sugar Black Rose",
    breeder: "Delicious Seeds",
    lineage: {
      parents: ["Black Domina", "Critical Mass"],
      cross: "Black Domina × Critical Mass",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet-floral heavy indica"],
    curatorNote:
      "Sugar Black Rose is a Delicious Seeds indica — Black Domina crossed with Critical Mass — a sweet, floral-fruit cut on a heavy frame. The nose is sweet and floral: berry and rose-like florals over an earthy, hashy base. The effect is strongly relaxing — a euphoric head sinking into a heavy, sedating body, an evening strain. It's frosty, dense and potent, a flavourful heavyweight. For sweet-floral heavy indica genetics, Sugar Black Rose is a tasty pick.",
    curatorQuote:
      "Berry and rose-like florals over an earthy, hashy base.",
    sourceConfidence: "medium",
  },

  // ── ROUND 12: PARENT-FILL + LANDRACES + CLASSICS ──
  {
    canonicalName: "Nepali OG",
    lineage: {
      parents: ["Nepalese", "OG Kush"],
      cross: "Nepalese × OG Kush",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Earthy-gas hash-OG", "A parent of Goji OG"],
    curatorNote:
      "Nepali OG is a cross of a Nepalese landrace and OG Kush — old-world hash genetics married to West Coast gas, and a parent of Bodhi's Goji OG. The nose is earthy and gassy: fuel and pine over a spicy, hashy base. The effect is relaxing and warm — a euphoric head sinking into a comfortable body, evening-leaning. It's frosty and potent, and it lends its earthy depth to Goji OG. For hash-tinged OG genetics, Nepali OG is a flavourful parent line.",
    curatorQuote:
      "Fuel and pine over a spicy, hashy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an earthy, hash-tinged gas-OG hybrid named Nepali OG — old-world hash meets West Coast gas. A remote Himalayan monastery perched on a cliff at night beneath snow-capped peaks and a vast starry sky: strings of prayer flags sway in the cold air, warm butter-lamp light glows from the stone walls, fragrant smoke and a faint fuel haze drift through dark pines. Palette deep, warm-meets-cold — night indigo and snow-blue peaks with warm amber lamplight and pine green over earthy stone and a petrol shadow, a frosted sheen, fading into a starlit sky. Mood: relaxing and warm — a euphoric head sinking into a comfortable, grounded body, evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'NEPALI OG' baked into the scene — carved into a stone prayer wall. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "nepali-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blockhead",
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["Sweet Tooth"],
      cross: "Sweet Tooth #3 × B-52 (Subcool line)",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet, frosty Subcool hybrid", "A parent of Snow Lotus"],
    curatorNote:
      "Blockhead is a TGA/Subcool hybrid built off Sweet Tooth — a frosty, sweet-and-earthy plant that became a useful breeding line (it's a parent of Bodhi's Snow Lotus). The nose is sweet and fruity: berry and candy over a piney, earthy base. The effect is balanced and happy — a euphoric, creative head with a relaxing body. It's terpy and resin-heavy, prized as breeding stock. For sweet, frosty hybrid genetics, Blockhead is a solid parent.",
    curatorQuote:
      "Berry and candy over a piney, earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Major League Bud",
    marketNames: ["MLB"],
    lineage: {
      parents: ["Williams Wonder"],
      cross: "William's Wonder-derived indica",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Heavy old-school indica", "A parent of Blue Magoo"],
    curatorNote:
      "Major League Bud is a heavy, William's Wonder-derived indica — a dense, resinous old-school cut best known as a parent of Blue Magoo. The nose is earthy and sweet: skunky sweetness over a woody base. The effect is strongly relaxing — a heavy body weight that drifts toward sleep, a classic nightcap. It's dense and potent, prized for the weight it passes to its offspring. For heavy indica breeding genetics, MLB is a quiet parent line.",
    curatorQuote:
      "Skunky sweetness over a woody base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Alien Tech",
    lineage: {
      cross: "A pure Afghan indica landrace (seeds reportedly brought back from Afghanistan) — no recorded cross",
    },
    breeder: "Alien Genetics",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Gassy OG breeding line", "A parent of Alien Kush"],
    curatorNote:
      "Alien Tech is an Alien Genetics OG-leaning line — a gassy, earthy plant used mainly for breeding (it's half of Alien Kush). The nose is classic gas: fuel and pine over an earthy, herbal base. The effect is relaxing and heavy — a euphoric head sinking into a comfortable body, evening-leaning. It's frosty and potent, valued for the OG structure it passes on. For gassy OG breeding genetics, Alien Tech is a building block.",
    curatorQuote:
      "Fuel and pine over an earthy, herbal base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of a heavy, gassy OG breeding line with an otherworldly streak. A derelict, overgrown research outpost at dusk on a strange frontier: weathered fuel tanks, chrome pipework and dark pine forest reclaiming cracked concrete, lit by a faint eerie green-gold glow leaking from within, petrol haze drifting through still evening air. Palette deep and resinous — fuel-petrol blue and pine-green over earthy brown, an uncanny alien teal-green light against an amber-into-wine-dark dusk sky, a frosted crystalline sheen on every surface. Mood: relaxing and heavy, quiet and grounded — a slow euphoric sink into stillness, evening-leaning and potent. Cinematic, painterly, high-contrast, premium editorial poster. Keep the lower third calmer and darker for legible overlay text. The strain name may appear baked into the scene (e.g. stencilled on a fuel tank or stamped into metal); no overlaid captions, logos or watermarks; no people, products or cannabis leaves.",
    artFileName: "alien-tech.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Skunk Haze",
    lineage: {
      parents: ["Skunk #1", "Haze"],
      cross: "Skunk #1 × Haze",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Bright skunky-citrus haze", "A parent of Banana Kush"],
    curatorNote:
      "Skunk Haze is a Skunk #1 × Haze cross — the funk of Skunk lifted by haze's bright citrus, and a parent of Banana Kush. The nose is clean and sharp: citrus and spice over a skunky, earthy base. The effect is up and energetic — an uplifting, creative head with a light body, daytime-leaning. It's terpy and potent, and it's the sativa side behind Banana Kush. For bright skunk-haze genetics, this is a flavourful parent line.",
    curatorQuote:
      "Citrus and spice over a skunky, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hells OG",
    marketNames: ["Hell's OG"],
    lineage: {
      parents: ["OG Kush", "Blackberry"],
      cross: "OG Kush × Blackberry",
      parentDetails: {
        "Blackberry": { lineageBrief: "Black Domina × Raspberry Cough line", type: "hybrid" },
      },
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy gas OG", "A parent of 9 Pound Hammer"],
    curatorNote:
      "Hells OG (Hell's OG) is an OG Kush × Blackberry cross — heavy OG gas with a faint dark-fruit edge, and a parent of 9 Pound Hammer. The nose is loud OG: fuel and pine over an earthy funk with a berry note underneath. The effect is strongly relaxing — a euphoric head sinking into a heavy body, firmly an evening strain. It's gassy, frosty and very potent, and it lends weight to 9 Pound Hammer. For heavy gas-OG genetics, Hells OG fits.",
    curatorQuote:
      "Fuel and pine over an earthy funk with a berry note underneath.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, gassy evening OG named Hells OG — an infernal theme. A smoldering hellscape at night: cracked black volcanic rock split by glowing molten-red lava fissures, brimstone smoke and a fuel-pine haze rising and igniting at the edges, an oily petrol-rainbow shimmer flickering in the heat, a dark berry-purple glow bleeding through the smoke. Fuel and pine over an earthy funk with a berry note underneath. Palette infernal and heavy — molten lava red and ember-orange over charred black rock, brimstone smoke with a berry-violet undertone and a faint petrol shimmer. Mood: strongly relaxing — a euphoric head sinking into a heavy body, a potent evening sinker. Cinematic, painterly, high-contrast, premium editorial poster, fiery and atmospheric. The strain name 'HELLS OG' baked into the scene — seared and glowing in the molten cracks or branded into the black rock. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "hells-og.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gooberry",
    lineage: {
      parents: ["Afgooey", "Blueberry"],
      cross: "Afgoo × Blueberry",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet berry indica", "A parent of 9 Pound Hammer"],
    curatorNote:
      "Gooberry is an Afgoo × Blueberry cross — sweet berry over a sticky, resin-heavy Afghan body, and a parent of 9 Pound Hammer. The nose is sweet and fruity: blueberry and berry over an earthy base. The effect is heavily relaxing — a euphoric head sinking into a sedating body, evening-leaning. It's dense, frosty and potent, and it's the berry half behind 9 Pound Hammer. For sweet-berry indica genetics, Gooberry is a tasty parent line.",
    curatorQuote:
      "Blueberry and berry over an earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grapefruit",
    lineage: {
      parents: ["Cinderella 99"],
      cross: "Cinderella 99-derived citrus selection",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Juicy pink-grapefruit sativa"],
    curatorNote:
      "Grapefruit is a Cinderella 99-derived citrus sativa — bright pink-grapefruit flavour over a sweet, tropical base. The nose is juicy and zesty: grapefruit and citrus over a sweet, light base. The effect is uplifting and happy — an energetic, creative head with a relaxed body, a sociable daytime strain. It's terpy and flavour-forward, an easy citrus pick-me-up. For clean grapefruit-citrus character, it's a cheerful sativa.",
    curatorQuote:
      "Grapefruit and citrus over a sweet, light base.",
    sourceConfidence: "medium",
    tagline: "Ruby Citrus Rush",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Grapefruit, a bright Cinderella 99-derived citrus sativa bursting with juicy pink-grapefruit flavour. The scene is a sun-drenched citrus orchard at peak ripeness, a single ruby grapefruit sliced open in the foreground revealing glistening pink segments, dewy leaves and laden branches glowing behind it. The palette is ruby-pink and blush-coral over sweet citrus gold and tropical leaf-green, washed in juicy, zesty highlights and dewy orchard sparkle. The mood is uplifted, happy, euphoric and energetic, fresh and tingling with bright upward fizz, lit by clear midday daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name GRAPEFRUIT is branded into the wooden crate of fruit beside the sliced grapefruit. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Cherry Bomb",
    lineage: {
      cross: "Contested — different breeders cite different parents (Cherry Pie × THC Bomb, Big Bud × cherry, etc.); no consensus",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet cherry-candy hybrid"],
    curatorNote:
      "Cherry Bomb is a sweet, cherry-forward hybrid built around bright red-fruit flavour. The nose is candy-sweet: cherry and berry over a light earthy base. The effect is balanced and cheerful — a happy, uplifting head with a relaxed body, easy across the day. It's terpy and approachable, more flavour than weight. For sweet cherry-candy character in a balanced package, Cherry Bomb is a fun pick.",
    curatorQuote:
      "Cherry and berry over a light earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Holland's Hope",
    lineage: {
      parents: ["Afghani", "Skunk #1"],
      cross: "Afghani × Skunk #1 (Netherlands, 1980s — Dutch Passion)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["One of the first Dutch outdoor strains"],
    curatorNote:
      "Holland's Hope is one of the earliest Dutch outdoor strains — a hardy, mould-resistant Afghani selection bred for the cool, wet Dutch climate in the early 80s. The nose is earthy and sweet: spice and hash over a woody base. The effect is calm and relaxing — a mellow, grounding body ease, moderate rather than overwhelming. It's dense and dependable, a piece of Dutch cannabis history. For old-world Dutch outdoor genetics, Holland's Hope is a classic.",
    curatorQuote: "Spice and hash over woody earth — a hardy Dutch classic.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Vietnamese Black",
    marketNames: ["Vietnam Black"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Vietnamese highland landrace", "Fierce, spicy sativa"],
    curatorNote:
      "Vietnamese Black is a highland landrace from Vietnam — a fierce, long-flowering equatorial sativa with dark stems and a spicy nose. The smell is earthy and warm: spice and sweetness over a woody base. The effect is intensely up — an energetic, heady, almost relentless cerebral high with no body, a true daytime landrace. It's a slow, demanding grow and moderate in potency, prized for heritage. For old-world Southeast Asian sativa, Vietnamese Black is a striking source.",
    curatorQuote: "Dark spice and sweetness over woody earth.",
    sourceConfidence: "medium",
    tagline: "Dark Highland Fire",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Vietnamese Black, a fierce long-flowering highland landrace from Vietnam with dark stems and a warm spicy nose. A misty Southeast-Asian mountain highland at dawn: emerald terraced rice paddies stepping down a steep slope, dark wet stone, low cloud snagged on jagged karst peaks and a lone weathered shrine post on the trail. Palette of deep blackened greens and near-black woody stems, warm spice ochres, citrus-amber light and tropical-herbal accents drawn from the earthy-spicy-citrus-woody profile. The mood is intensely up, energetic and creatively charged, mist tearing upward off the terraces in swift focused motion, lit by a cool bright daytime sun breaking through cloud. Cinematic, painterly, high-contrast, premium editorial poster. The name VIETNAMESE BLACK is brush-painted in dark vertical strokes down the side of the wooden shrine post in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Ethiopian Highland",
    marketNames: ["Ethiopian"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["East African highland landrace", "Clean, spicy sativa"],
    curatorNote:
      "Ethiopian Highland is an East African landrace from the highlands of Ethiopia — a clean, spicy equatorial sativa with deep heritage. The nose is earthy and bright: spice and sweetness with a faint citrus. The effect is energetic and clear — an uplifting, creative, social head with no body, a pure daytime landrace. It's hardy and moderate, prized by collectors for its rarity. For old-world African sativa genetics, Ethiopian Highland is a source.",
    curatorQuote: "Spice and sweetness with a faint citrus, a highland sativa.",
    sourceConfidence: "medium",
    tagline: "Highland Coffee Country",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Ethiopian Highland, an East African landrace sativa from the high plateaus of Ethiopia, earthy, spicy and rooted in deep coffee-country heritage. Scene: a sweeping Ethiopian highland plateau, terraced coffee fields and acacia trees on red-earth ridges, distant escarpments fading into thin highland air, scattered ripe coffee cherries glowing on a stone ledge. Palette and light: warm earthen terracotta and deep umber over spicy cinnamon-brown and woody olive-green, lifted by a faint citrus-gold horizon; bright thin high-altitude daytime sun with long clean shadows. Mood and motion: energetic, creative and clear focus, grasses rippling across the plateau and a fresh highland wind, the crisp brilliance of midday. Cinematic, painterly, high-contrast, premium editorial poster. The name ETHIOPIAN HIGHLAND carved into a weathered basalt boulder on the ridge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Sinai",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Egyptian Sinai landrace", "Traditional hashish indica"],
    curatorNote:
      "Sinai is a landrace from Egypt's Sinai Peninsula — a hardy, desert-adapted indica traditionally grown by Bedouin communities for hashish. The nose is earthy and sweet: dry spice and a hashy sweetness over a woody base. The effect is calm and relaxing — a mellow, grounding body ease, moderate and traditional. It's dense and resin-rich, a rare Middle Eastern landrace. For old-world Egyptian hash genetics, Sinai is a source.",
    curatorQuote:
      "Dry spice and a hashy sweetness over a woody base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tiramisu",
    lineage: {
      parents: ["Sunset Sherbet", "Thin Mint GSC"],
      cross: "Sunset Sherbet × Thin Mint GSC (The Cali Connection)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Coffee-and-cream dessert"],
    curatorNote:
      "Tiramisu is a coffee-and-cream dessert cut named for the Italian sweet — sweet vanilla and cocoa over a nutty, earthy base. The nose is rich and sweet: cream and vanilla with a coffee-nut depth. The effect is relaxing and happy — a euphoric head easing into a comfortable body, afternoon into evening. It's frosty and flavour-forward, a dessert strain through and through. For coffee-cream sweetness, Tiramisu is an indulgent pick.",
    curatorQuote:
      "Cream and vanilla with a coffee-nut depth.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a rich coffee-and-cream dessert cut named Tiramisu. A elegant slice of tiramisu on a dark plate, layered coffee-soaked ladyfingers and silky mascarpone cream with a generous cocoa-powder dusting on top, a curl of warm coffee steam and a faint oily petrol-rainbow shimmer in it hinting at the earthy depth, warm Italian café light. Cream and vanilla with a coffee-nut depth. Palette warm and indulgent — cocoa brown and espresso with creamy mascarpone ivory and caramel, a soft cocoa-dust frost and a faint petrol shimmer under a moody amber glow. Mood: relaxing and happy — a euphoric head easing into a comfortable body, indulgent and afternoon-into-evening. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'TIRAMISU' baked into the scene — hand-lettered on a café chalkboard or dusted in cocoa on the plate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "tiramisu.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Banana Cream",
    lineage: {
      cross: "Sold by several breeders with different genetics (Banana OG × Cookies and Cream, or Animal Sherbet × Banana OG); no single documented cross",
    },
    marketNames: ["Banana Cream Cake"],
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Creamy banana dessert indica"],
    curatorNote:
      "Banana Cream is a creamy banana dessert indica-lean — sweet ripe banana over a vanilla, cream base. The nose is sweet and fruity: banana and tropical fruit over a soft cream. The effect is relaxing and happy — a calming body ease with a euphoric head, evening-leaning. It's frosty and flavour-forward, an easy dessert cut. For creamy banana-and-vanilla character, Banana Cream is a cosy pick.",
    curatorQuote:
      "Banana and tropical fruit over a soft cream.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Blue Cookies",
    lineage: {
      parents: ["Blueberry", "Girl Scout Cookies"],
      cross: "Blueberry × GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sweet berry over a cookie base"],
    curatorNote:
      "Blue Cookies crosses Blueberry with Girl Scout Cookies — sweet berry fruit folded into a cookie base. The nose is sweet and fruity: blueberry and berry over an earthy, doughy cookie funk. The effect is relaxing and euphoric — a happy head easing into a comfortable body, afternoon into evening. It's frosty and potent, a flavourful berry dessert. For blueberry-and-cookie character, Blue Cookies is a tasty pick.",
    curatorQuote:
      "Blueberry and berry over an earthy, doughy cookie funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet blueberry-and-cookie dessert hybrid named Blue Cookies. A stack of golden cookies studded with plump blue-purple blueberries oozing glossy berry juice, a blueberry resting on top, warm bakery light catching the crumb with a sugar-frost sparkle and a soft blue-violet tint in the shadows. Blueberry and berry over an earthy, doughy cookie funk. Palette warm-meets-cool — golden cookie-brown and cream with deep blueberry blue and berry-violet, a sugar-frost sparkle under a honeyed glow. Mood: relaxing and euphoric — a happy head easing into a comfortable body, sweet and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'BLUE COOKIES' baked into the scene — hand-lettered on a bakery sign or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "blue-cookies.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Apple Jacks",
    marketNames: ["Applejack"],
    lineage: {
      parents: ["Jack Herer", "White Widow"],
      cross: "Jack Herer × White Widow",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Bright apple-citrus, very potent"],
    curatorNote:
      "Apple Jacks is a Jack Herer × White Widow cross — bright apple-and-citrus flavour on a very potent frame. The nose is sweet and zesty: green apple and citrus over a piney, earthy base. The effect is up and strong — an energetic, euphoric, creative head with enough body to stay grounded, a potent daytime hybrid. It's terpy and frosty, flavour-forward and high-test. For bright apple-citrus character with real punch, Apple Jacks delivers.",
    curatorQuote:
      "Green apple and citrus over a piney, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "White Tahoe Cookies",
    marketNames: ["WTC"],
    lineage: {
      parents: ["Tahoe OG", "The White", "Girl Scout Cookies"],
      cross: "Tahoe OG × The White × GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Frosty, gassy cookie indica"],
    curatorNote:
      "White Tahoe Cookies blends Tahoe OG, The White and GSC — heavy OG gas, extreme frost and cookie sweetness in one cut. The nose is rich and gassy: sweet cookie and fuel over an earthy, herbal base. The effect is strongly relaxing — a euphoric head sinking into a heavy body, firmly an evening strain. It's extremely frosty and very potent, a dense dessert-OG. For frosty, gassy cookie genetics, White Tahoe Cookies is a heavy pick.",
    curatorQuote:
      "Sweet cookie and fuel over an earthy, herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cheese Quake",
    breeder: "TGA Subcool Seeds",
    lineage: {
      parents: ["UK Cheese", "Querkle"],
      cross: "UK Cheese × Querkle",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Tangy cheese over sweet grape"],
    curatorNote:
      "Cheese Quake is a TGA/Subcool cross of UK Cheese and Querkle — tangy dairy funk meeting sweet purple grape. The nose is unusual and loud: cheese and sour funk over a sweet grape-berry base. The effect is balanced and relaxing — a euphoric head easing into a comfortable body, versatile across the day. It's frosty and flavour-forward, a savoury-sweet oddity. For cheese-and-grape character, Cheese Quake is a distinctive pick.",
    curatorQuote:
      "Cheese and sour funk over a sweet grape-berry base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a savoury-sweet cheese-and-grape exotic named Cheese Quake — playing on a quake. A massive wedge of tangy aged cheese splitting apart along a dramatic earthquake fissure, deep-purple grapes and berries spilling and tumbling out of the jagged crack, dust and a funky haze rising from the rupture, a glittering trichome-frost dusting the surfaces. Cheese and sour funk over a sweet grape-berry base. Palette bold and unusual — golden aged-cheese yellow and grape purple with berry-violet, a frosty silver sparkle and a dusty funk haze over a dramatic dark shadow. Mood: balanced and relaxing — a euphoric head easing into a comfortable body, savoury-sweet and loud. Cinematic, painterly, high-contrast, premium editorial poster, dramatic and appetizing. The strain name 'CHEESE QUAKE' baked into the scene — stamped on a wooden crate or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cheese-quake.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pez",
    lineage: {
      parents: ["Afghani", "Pakistani Chitral Kush"],
      cross: "Afghani × Pakistani landrace — a clone-only PNW indica (Lopez Island, late 90s)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy-sweet exotic"],
    curatorNote:
      "Pez is a candy-sweet exotic named for the dispenser sweet — bright, sugary fruit flavour with little funk. The nose is sweet and fruity: mixed berry and citrus candy over a clean base. The effect is happy and easy — a giggly, uplifting head over a relaxed body, social and gentle. It's frosty and flavour-first, a bag-appeal modern cut. For sugar-sweet candy character, Pez is a cheerful pick.",
    curatorQuote:
      "Mixed berry and citrus candy over a clean base.",
    sourceConfidence: "low",
  },

  // ── ROUND 13: PARENT-FILL + LANDRACES + CLASSICS ──
  {
    canonicalName: "Blackberry",
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["Black Domina", "Raspberry Cough"],
      cross: "Black Domina × Raspberry Cough",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Dark berry hybrid", "A parent of Blackberry Kush"],
    curatorNote:
      "Blackberry is a Nirvana cross of Black Domina and Raspberry Cough — dark, jammy berry over a heavy indica base, and a parent of Blackberry Kush. The nose is sweet and fruity: blackberry and grape over an earthy base. The effect is relaxing and warm — a euphoric head easing into a comfortable body, evening-leaning. It's frosty and flavour-forward, and it lends its dark fruit to Blackberry Kush. For sweet dark-berry genetics, Blackberry is a tasty parent line.",
    curatorQuote:
      "Blackberry and grape over an earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Raspberry Cough",
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["ICE", "Cambodian"],
      cross: "ICE × Cambodian",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Bright berry sativa", "A parent of Blackberry"],
    curatorNote:
      "Raspberry Cough is a Nirvana cross of ICE and Cambodian — a bright, berry-sweet sativa with a clean lift, and the berry half of Blackberry. The nose is sweet and fruity: raspberry and berry over a light herbal base. The effect is uplifting and clear — an energetic, creative head with a relaxed body, daytime-leaning. It's smooth and flavour-led, moderate in strength. For sweet berry-sativa genetics, Raspberry Cough is a flavourful parent line.",
    curatorQuote:
      "Raspberry and berry over a light herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "B-52",
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["Big Bud", "Skunk #1"],
      cross: "Big Bud × Skunk #1",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Heavy-yielding skunky indica"],
    curatorNote:
      "B-52 is a Nirvana cross of Big Bud and Skunk #1 — a big-yielding, skunky indica built for resin and weight. The nose is sweet and earthy: skunky sweetness over a spicy, herbal base. The effect is relaxing and heavy — a euphoric head sinking into a comfortable body, evening-leaning. It's dense, potent and dependable, a commercial workhorse. For heavy skunk-indica genetics, B-52 is a solid classic.",
    curatorQuote: "Skunky sweetness over spicy herb — big and resinous.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Power Plant",
    breeder: "Dutch Passion",
    lineage: {
      cross: "A South African sativa landrace, selected and inbred by Dutch Passion (never hybridised)",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sharp South African sativa", "A parent of Cotton Candy Kush"],
    curatorNote:
      "Power Plant is a Dutch Passion sativa selected from South African genetics — a sharp, energetic plant that became a European staple and a parent of Cotton Candy Kush. The nose is earthy and sweet: spicy, woody sweetness over a herbal base. The effect is up and clear — an energetic, uplifting, creative head with a light body, a daytime strain. It's potent and reliable, more lift than weight. For clean, energetic sativa genetics, Power Plant is a dependable parent.",
    curatorQuote: "Woody, peppery sweetness, sharp and energetic.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Big Skunk Korean",
    breeder: "Soma Seeds",
    lineage: {
      parents: ["Korean", "Skunk #1"],
      cross: "Korean indica × Skunk #1",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Korean skunk cross", "A parent of Lavender"],
    curatorNote:
      "Big Skunk Korean is a Soma Seeds cross of a Korean landrace and Skunk #1 — an earthy, skunky indica used mainly for breeding (it's a parent of Lavender). The nose is earthy and sweet: skunky funk over a spicy, herbal base. The effect is relaxing and warm — a euphoric head easing into a comfortable body, evening-leaning. It's dense and frosty, valued for the body it passes on. For Korean-skunk genetics behind Lavender, this is a parent line.",
    curatorQuote:
      "Skunky funk over a spicy, herbal base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an earthy, skunky Korean-landrace indica named Big Skunk Korean. A traditional Korean mountain landscape at dusk — misty layered peaks with a curved-roof hanok pavilion silhouette among pines, and a bold black-and-white skunk prowling through the herbal underbrush in the foreground, a spicy-earthy skunky haze drifting over the scene with a glittering frost sparkle. Skunky funk over a spicy, herbal base. Palette earthy and serene — deep pine green and misty blue-grey with warm dusk amber, the skunk's black-white stripe accent and a frosty sparkle in the haze. Mood: relaxing and warm — a euphoric head easing into a comfortable body, dense and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster, atmospheric and detailed. The strain name 'BIG SKUNK KOREAN' baked into the scene — carved into a weathered wooden sign or mountain stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "big-skunk-korean.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "White Rhino",
    breeder: "Green House Seed Co.",
    lineage: {
      parents: ["White Widow"],
      cross: "White Widow × a North American indica",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Frosty, heavy White Widow cross"],
    curatorNote:
      "White Rhino is a Green House cross of White Widow and a heavy North American indica — frostier and more sedating than its Widow parent. The nose is earthy and sweet: pine and wood over a light sweetness. The effect is strongly relaxing — a euphoric head sinking into a heavy, numbing body, an evening strain. It's dense, frost-caked and very potent, a Cup-winning classic. For a heavier, frostier take on White Widow, White Rhino delivers.",
    curatorQuote:
      "Pine and wood over a light sweetness.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Great White Shark",
    marketNames: ["White Shark", "Peacemaker"],
    breeder: "Green House Seed Co.",
    lineage: {
      parents: ["Super Skunk", "Brazilian", "South Indian"],
      cross: "Super Skunk × Brazilian × South Indian",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Frost-caked Cup classic"],
    curatorNote:
      "Great White Shark is a Green House blend of Super Skunk, a Brazilian sativa and a South Indian indica — a multiple Cup winner famous for extreme frost. The nose is earthy and sweet: skunky funk and pine over a sweet, herbal base. The effect is balanced and strong — a euphoric head with a relaxing body, potent and well-rounded. It's dense, very frosty and dependable, a 90s Amsterdam staple. For a frost-caked, balanced classic, Great White Shark endures.",
    curatorQuote:
      "Skunky funk and pine over a sweet, herbal base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frost-caked, balanced Cup-classic named Great White Shark. A powerful great white shark surging up through deep blue ocean water, breaking the surface in an explosion of glittering white foam and spray that reads like a coat of frost, shafts of light cutting down through the dark water, a cold herbal-pine mist over the churn. Skunky funk and pine over a sweet, herbal base. Palette deep and icy — dark ocean blue and slate with brilliant frost-white foam and spray, silver light shafts and a cold herbal glow. Mood: balanced and strong — a euphoric head with a relaxing body, potent and dense. Cinematic, painterly, high-contrast, premium editorial poster, dramatic and atmospheric. The strain name 'GREAT WHITE SHARK' baked into the scene — etched on a weathered metal buoy plate or stamped in the foam. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "great-white-shark.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Jack Flash",
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Jack Herer", "Super Skunk", "Haze"],
      cross: "Jack Herer × Super Skunk × Haze",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Clear spicy-citrus sativa"],
    curatorNote:
      "Jack Flash is a Sensi Seeds sativa — Jack Herer crossed with Super Skunk and Haze — built for a clear, fast, spicy-citrus high. The nose is bright and sharp: citrus and pine over a spicy, herbal base. The effect is up and clean — an energetic, creative, focused head with little body, a daytime strain. It's terpy and potent, a refined Jack-and-haze blend. For clear spicy-citrus sativa genetics, Jack Flash is a flavourful classic.",
    curatorQuote:
      "Citrus and pine over a spicy, herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pineapple Chunk",
    breeder: "Barney's Farm",
    lineage: {
      parents: ["Pineapple", "Skunk #1", "UK Cheese"],
      cross: "Pineapple × Skunk #1 × Cheese",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Sweet-tropical with a cheesy tail"],
    curatorNote:
      "Pineapple Chunk is a Barney's Farm blend of Pineapple, Skunk #1 and UK Cheese — sweet tropical fruit with a pungent, cheesy funk underneath. The nose is loud and layered: pineapple and tropical sweetness over a tangy cheese-skunk base. The effect is heavy and relaxing — a euphoric head sinking into a strong body, evening-leaning. It's dense, frosty and very potent. For sweet-tropical fruit with a funky, heavy body, Pineapple Chunk is a flavourful pick.",
    curatorQuote:
      "Pineapple and tropical sweetness over a tangy cheese-skunk base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sweet Skunk",
    marketNames: ["Sweet Pink Grapefruit"],
    lineage: {
      parents: ["Skunk #1"],
      cross: "Sweet Skunk #1 selection",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweeter, fruitier Skunk cut"],
    curatorNote:
      "Sweet Skunk is a sweeter, fruitier selection of Skunk #1 — the classic funk softened with a citrus-fruit edge. The nose is sweet and tangy: fruit and citrus over a skunky, earthy base. The effect is uplifting and easy — a happy, sociable head with a relaxed body, daytime-friendly. It's smooth and approachable, moderate in strength. For a friendlier, sweeter cut of skunk genetics, Sweet Skunk is a likeable pick.",
    curatorQuote:
      "Fruit and citrus over a skunky, earthy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Kandahar",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Afghan landrace from Kandahar", "Heavy hash plant"],
    curatorNote:
      "Kandahar is an Afghan landrace from the southern province of the same name — a dense, resin-heavy indica traditionally grown for hashish. The nose is earthy and sweet: spice and sandalwood over a hashy, woody base. The effect is heavily relaxing — a warm, sedating body weight that drifts toward sleep, classic landrace indica. It's dense, frosty and potent, prized by purists and hash makers. For traditional Afghan hash genetics, Kandahar is a source.",
    curatorQuote:
      "Spice and sandalwood over a hashy, woody base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mullumbimby Madness",
    marketNames: ["Mullum Madness"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Australian sativa landrace", "NSW heritage strain"],
    curatorNote:
      "Mullumbimby Madness is an Australian sativa landrace from the Mullumbimby region of New South Wales — a bright, soaring heritage strain of the 70s-80s. The nose is sweet and earthy: honeyed sweetness and citrus over a faint spice. The effect is up and creative — an energetic, happy, almost psychedelic head with no body, a true daytime landrace. It's moderate and rare, a piece of Australian cannabis history. For old-world Aussie sativa, Mullumbimby Madness is a collector's source.",
    curatorQuote:
      "Honeyed sweetness and citrus over a faint spice.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Angola Roja",
    marketNames: ["Angolan Red"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Angolan red landrace", "Hardy equatorial sativa"],
    curatorNote:
      "Angola Roja (Angolan Red) is a landrace from Angola — a hardy, red-haired equatorial sativa with deep African heritage. The nose is earthy and warm: spice and sweetness over a woody base. The effect is up and clear — an energetic, creative head with no body, a pure daytime landrace. It's resilient and moderate, prized by collectors for its rarity. For old-world Angolan sativa genetics, Angola Roja is a source.",
    curatorQuote: "Sweet spice over woody earth — African heritage sativa.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Cambodian",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Cambodian landrace", "A parent of Raspberry Cough"],
    curatorNote:
      "Cambodian is a Southeast Asian landrace from Cambodia — a clean, electric equatorial sativa used by breeders to add vigour and a bright high (it's a parent of Raspberry Cough). The nose is earthy and sweet: spice and citrus over a herbal base. The effect is fast and heady — an energetic, almost buzzy cerebral high with no body, a pure daytime landrace. It's long-flowering and moderate, a heritage rarity. For old-world Cambodian sativa, this is a source.",
    curatorQuote:
      "Spice and citrus over a herbal base.",
    sourceConfidence: "medium",
    tagline: "Temple Of Light",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Cambodian, a clean, electric equatorial landrace carrying Angkor temple and Southeast Asian heritage. The scene is the weathered stone towers of an Angkor temple at the edge of jungle, carved sandstone reliefs and a serene moss-softened doorway framed by floral creepers and tropical foliage in still morning air. The palette is sun-warmed sandstone ochre and deep jungle green over soft floral pink-white and earthy spice-brown, lit by clear equatorial light filtering through the canopy. The mood is energetic, euphoric, focused and uplifted, a bright soaring head-high stillness with shafts of rising light, set in crisp daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name CAMBODIAN is chiselled into the carved sandstone lintel above the temple doorway. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Brazilian",
    marketNames: ["Brazilian Sativa"],
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Brazilian sativa landrace", "Behind White Widow and Great White Shark"],
    curatorNote:
      "Brazilian is a South American sativa landrace — a sweet, energetic plant that crossed into both White Widow and Great White Shark via Amsterdam breeding. The nose is sweet and earthy: honeyed fruit and spice over a herbal base. The effect is up and social — an energetic, happy, creative head with little body, a heritage daytime sativa. It's moderate and clean, historically important to Dutch genetics. For old-world Brazilian sativa, this is a foundational source.",
    curatorQuote:
      "Honeyed fruit and spice over a herbal base.",
    sourceConfidence: "medium",
    tagline: "Atlantic Coast Heat",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Brazilian, a sweet, energetic South American landrace with Atlantic-forest and Rio coastal heritage. The scene is a lush Mata Atlantica hillside tumbling down toward a sweeping Rio coastline, granite peaks and palm canopy above a curving golden beach, tropical fruit and spice plants catching light along the slope. The palette is verdant rainforest green and honeyed fruit-gold over warm coastal sand and spiced amber, lit by humid tropical sunlight and shimmering ocean haze. The mood is energetic, uplifted, euphoric and creative, alive with carnival-bright buoyancy and rolling sea breeze, under vivid daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name BRAZILIAN is carved into a weathered wooden trail sign on the forest hillside. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "South Indian",
    marketNames: ["South Indian Indica"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["South Indian indica landrace", "A parent of White Widow"],
    curatorNote:
      "South Indian is an indica landrace from the south of India — a hashy, resin-heavy plant that gave White Widow and Great White Shark their frost and body. The nose is earthy and sweet: spice and hash over a woody base. The effect is relaxing and weighty — a calm, grounding body ease that leans toward sleep, classic landrace indica. It's dense, resin-rich and moderate, a key Dutch breeding parent. For old-world South Indian indica, this is a source.",
    curatorQuote: "Hashy spice over a woody, earthy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Korean",
    marketNames: ["Korean Landrace"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Korean indica landrace", "Behind Big Skunk Korean"],
    curatorNote:
      "Korean is a rare East Asian landrace indica from the Korean peninsula — an earthy, calm plant used by Soma to build Big Skunk Korean (and so, indirectly, Lavender). The nose is earthy and mild: spice and sweetness over a herbal base. The effect is calm and relaxing — a mellow, grounding body ease, moderate and traditional. It's dense and well-cured by nature, a heritage rarity. For old-world Korean landrace genetics, this is a quiet source.",
    curatorQuote:
      "Spice and sweetness over a herbal base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Banana Daddy",
    lineage: {
      parents: ["Banana OG", "Granddaddy Purple"],
      cross: "Banana OG × Granddaddy Purple",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Banana-and-grape heavy indica"],
    curatorNote:
      "Banana Daddy crosses Banana OG with Granddaddy Purple — sweet ripe banana over dark grape, on a heavy frame. The nose is rich and fruity: banana and grape over an earthy, gassy base. The effect is strongly relaxing — a euphoric head sinking into a heavy, sedating body, firmly an evening strain. It's frosty and very potent, a flavourful heavyweight. For banana-and-grape character with real weight, Banana Daddy is a satisfying pick.",
    curatorQuote:
      "Banana and grape over an earthy, gassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gushlato",
    lineage: {
      parents: ["Gushers", "Gelato"],
      cross: "Gushers × Gelato",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Tropical candy over gelato cream"],
    curatorNote:
      "Gushlato crosses Gushers with Gelato — tropical fruit candy laid over gelato cream. The nose is sweet and fruity: tropical candy and berry over a creamy, lightly gassy base. The effect is relaxing and euphoric — a happy head easing into a comfortable body, afternoon into evening. It's frosty and flavour-forward, an easy-drinking dessert exotic. For candy fruit over cream, Gushlato is a tasty pick.",
    curatorQuote:
      "Tropical candy and berry over a creamy, lightly gassy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty, fruity-cream dessert exotic named Gushlato — Gushers candy crossed with Gelato. Glossy tropical fruit-candy gushers bursting open mid-air, vivid juice splashing in a dynamic spray over a swirl of creamy gelato below — tropical berry and mango-bright juice exploding against soft cream, a frosted sheen on the cold gelato, a faint oily petrol-rainbow shimmer in the sweet mist. Tropical candy and berry over a creamy, lightly gassy base. Palette vivid and luscious — bright tropical magenta, mango-orange and berry-purple juice over creamy ivory and gelato pastels, a frosty silver sheen with a faint petrol shimmer. Mood: relaxing and euphoric — a happy head easing into a comfortable body, fun and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, glossy and appetizing. The strain name 'GUSHLATO' baked into the scene — hand-lettered on a small enamel dessert tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "gushlato.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "low",
  },
  {
    canonicalName: "Honey Banana",
    lineage: {
      parents: ["Strawberry Banana", "Honey Boo Boo"],
      cross: "Strawberry Banana × Honey Boo Boo (DNA Genetics)",
      parentDetails: {
        "Honey Boo Boo": { lineageBrief: "Bubba Kush × Captain Krypt OG", type: "indica" },
      },
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Honeyed banana indica"],
    curatorNote:
      "Honey Banana is a honeyed banana indica-lean — sweet ripe banana over a soft, earthy-cream base. The nose is sweet and fruity: banana and honey over a light earthy floor. The effect is relaxing and happy — a calming body ease with a euphoric head, evening-leaning. It's frosty and flavour-forward, a cosy dessert cut. For sweet honey-banana character, it's a gentle, tasty pick.",
    curatorQuote:
      "Banana and honey over a light earthy floor.",
    sourceConfidence: "low",
  },

  // ── ROUND 14: HAZE/CLASSIC PARENT-FILL + LANDRACES (catalog → 400) ──
  {
    canonicalName: "Neville's Haze",
    marketNames: ["Nevil's Haze"],
    breeder: "Greenhouse / Nevil",
    lineage: {
      parents: ["Haze", "Northern Lights #5"],
      cross: "Haze × Northern Lights #5",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Towering, electric haze", "Behind Ghost Train Haze and Hawaiian Snow"],
    curatorNote:
      "Neville's Haze is Nevil Schoenmakers' towering haze — Haze crossed back into Northern Lights #5 for a more vigorous, even more electric sativa. The nose is sharp and clean: citrus and pine over a spicy, incense-like base. The effect is a long, soaring, almost overwhelming cerebral high — energetic and psychedelic with no body. It's a slow, demanding grow and very potent, the engine behind Ghost Train Haze and Hawaiian Snow. For maximum haze intensity, Neville's Haze is a legend.",
    curatorQuote: "Incense, citrus and pine — towering, racy Haze.",
    sourceConfidence: "high",
    tagline: "Electric Haze Legend",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Neville's Haze, Nevil Schoenmakers' towering near-pure Haze × Northern Lights #5 sativa rooted in Dutch seed-bank heritage, sharp, spicy and incense-like. Scene: a soaring cathedral-tall haze plant silhouette beside a weathered Dutch seed-bank altar, brass apothecary jars and curling ribbons of fragrant incense smoke against tall pine boughs, a clean northern sky. Palette and light: bright citrus-yellow and deep pine-green over spicy clove-brown and herbal grey-violet, with luminous incense-smoke whites; clean high-key daytime light cutting sharp through the smoke. Mood and motion: energetic, euphoric, creative and electric head-rush, incense spiralling fast upward and pine swaying, the vivid clarity of full day. Cinematic, painterly, high-contrast, premium editorial poster. The name NEVILLE'S HAZE stencilled in austere serif across the worn altar plinth. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Death Star",
    lineage: {
      parents: ["Sour Diesel", "Sensi Star"],
      cross: "Sour Diesel × Sensi Star",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy diesel funk, deeply sedating"],
    curatorNote:
      "Death Star is a Sour Diesel × Sensi Star cross out of Ohio — sour fuel funk welded to a heavy, sedating body. The nose is loud and gassy: diesel and sour earth over a skunky base. The effect is strongly relaxing — a euphoric head sinking fast into a couch-locking body, firmly a nightcap. It's pungent, dense and very potent. For heavy diesel genetics with a knockout body, Death Star earns the name.",
    curatorQuote:
      "Diesel and sour earth over a skunky base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, sedating diesel knockout named Death Star. A colossal dark metallic sphere looming menacingly in deep space — a planet-sized battle-orb of riveted gunmetal panels, an ominous glowing energy ring banding its equator, a sour-green and amber diesel-tinged nebula haze swirling around it shot with an oily petrol-rainbow shimmer. Diesel and sour earth over a skunky base, loud and gassy. Palette dark and ominous — gunmetal black and steel with a menacing sour-green and amber glow, a petrol-rainbow shimmer in the cosmic diesel haze over deep space shadow. Mood: strongly relaxing — a euphoric head sinking fast into a couch-locking body, a pure heavy nightcap. Cinematic, painterly, high-contrast, premium editorial poster, menacing and atmospheric. The strain name 'DEATH STAR' baked into the scene — etched into the metallic hull or stamped on a worn plate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no recognizable franchise designs, no cannabis leaves, buds or packaging.",
    artFileName: "death-star.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemon Diesel",
    lineage: {
      parents: ["California Sour", "Lost Coast OG"],
      cross: "California Sour × Lost Coast OG",
      parentDetails: {
        "California Sour": { lineageBrief: "Sour Diesel-leaning hybrid", type: "hybrid" },
        "Lost Coast OG": { lineageBrief: "OG Kush phenotype", type: "hybrid" },
      },
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sharp lemon over diesel"],
    curatorNote:
      "Lemon Diesel is a California Sour × Lost Coast OG cross — sharp lemon citrus laid over a sour diesel base. The nose is bright and gassy: lemon and citrus over a fuel, earthy funk. The effect is balanced and lively — an uplifting, energetic head with a relaxing body, usable across the day. It's terpy and potent, cleaner than straight diesel. For lemon with a diesel backbone, Lemon Diesel is a zesty pick.",
    curatorQuote:
      "Lemon and citrus over a fuel, earthy funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a bright, zesty diesel hybrid named Lemon Diesel. Ripe lemons piled and sliced across slick wet chrome under hard midday sun — a thin film of fuel-rainbow sheen pooling beneath them on the oily metal, citrus mist and heat haze rising, lemon-yellow light cutting sharp against greasy shadow. The air is bright and gassy: zesty lemon citrus laid over a fuel, earthy funk. Palette electric and clean — vivid lemon yellow and acid-green over slick gunmetal chrome and petrol-rainbow shimmer, high-key sunlit highlights against oily diesel shadow. Mood: uplifting, energetic, lively — an alert citrus head over a relaxed body, an all-day zesty hitter. Cinematic, painterly, high-contrast, premium editorial poster, glossy and wet-looking. The strain name 'LEMON DIESEL' baked into the scene — stamped into the chrome or a worn metal plate. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "lemon-diesel.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Skunkberry",
    lineage: {
      parents: ["Skunk #1", "Blueberry"],
      cross: "Skunk #1 × Blueberry",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet berry over a skunky base"],
    curatorNote:
      "Skunkberry is a Skunk #1 × Blueberry cross — sweet berry fruit softening the classic skunk funk. The nose is sweet and fruity: blueberry and berry over a skunky, earthy base. The effect is relaxing and happy — a euphoric, calming high with a comfortable body, evening-leaning. It's frosty and smooth, an easy berry-skunk hybrid. For sweet berry over skunk, Skunkberry is a likeable pick.",
    curatorQuote:
      "Blueberry and berry over a skunky, earthy base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet berry-over-skunk hybrid named Skunkberry. A glistening cluster of plump blueberries and dark berries heaped in the foreground, dusted with a glittering trichome-frost, a dusky skunky haze drifting behind them where a small black-and-white skunk's striped silhouette lurks half-hidden in the earthy dusk shadow. Blueberry and berry over a skunky, earthy base. Palette deep and fruity — rich blueberry blue and berry-violet with frosted silver sparkle, a dusky earthy haze and the skunk's black-white stripe accent over an evening shadow. Mood: relaxing and happy — a euphoric, calming high with a comfortable body, frosty and evening-leaning. Cinematic, painterly, high-contrast, premium editorial poster, atmospheric and appetizing. The strain name 'SKUNKBERRY' baked into the scene — carved into a wooden sign or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "skunkberry.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blackwater",
    lineage: {
      parents: ["Mendo Purps", "SFV OG"],
      cross: "Mendo Purps × SFV OG Kush",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Grape over gas, deeply relaxing"],
    curatorNote:
      "Blackwater is a Mendo Purps × SFV OG cross — sweet grape from the Purps side over San Fernando OG gas. The nose is sweet and fruity: grape and dark berry over an earthy, gassy base. The effect is heavily relaxing — a euphoric head sinking into a sedating body, firmly an evening strain. It's dense, frosty and potent, a grape-and-gas heavyweight. For purple-grape character on a heavy OG frame, Blackwater is a satisfying indica.",
    curatorQuote:
      "Grape and dark berry over an earthy, gassy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry Cookies",
    lineage: {
      parents: ["Cherry Pie", "Girl Scout Cookies"],
      cross: "Cherry Pie × GSC",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cherry fruit over a cookie base"],
    curatorNote:
      "Cherry Cookies crosses Cherry Pie with Girl Scout Cookies — sweet cherry fruit folded into a cookie base. The nose is sweet and fruity: cherry and berry over an earthy, doughy cookie funk. The effect is balanced and euphoric — a happy head with a relaxing body, versatile across the day. It's frosty and flavour-forward, an easy cherry dessert. For cherry-and-cookie character, Cherry Cookies is a tasty pick.",
    curatorQuote:
      "Cherry and berry over an earthy, doughy cookie funk.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet cherry-and-cookie dessert hybrid named Cherry Cookies. A stack of golden-baked cookies studded with glossy ripe cherries, rich cherry juice glistening and a cherry resting on top, warm bakery light catching the crumb and a sparkling sugar-frost dusting; a curl of sweet steam in the air. Cherry and berry over an earthy, doughy cookie funk. Palette warm and luscious — deep cherry red and berry with golden cookie-brown and cream, a sugar-frost sparkle under a honeyed glow. Mood: balanced and euphoric — a happy head with a relaxing body, sweet and indulgent. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'CHERRY COOKIES' baked into the scene — hand-lettered on a bakery sign or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cherry-cookies.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Platinum GSC",
    marketNames: ["Platinum Cookies"],
    lineage: {
      parents: ["Girl Scout Cookies"],
      cross: "Girl Scout Cookies phenotype (Platinum)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Frosty Platinum GSC pheno"],
    curatorNote:
      "Platinum GSC (Platinum Cookies) is a frosty, silver-tinged phenotype of Girl Scout Cookies — sweeter and even more trichome-caked than the standard cut. The nose is sweet and earthy: candy cookie and fruit over a spicy, herbal base. The effect is relaxing and euphoric — a happy head settling into a comfortable, heavy body, evening-leaning. It's very frosty and potent, a prized GSC selection. For a frostier cut of the cookie genome, Platinum GSC is a strong pick.",
    curatorQuote:
      "Candy cookie and fruit over a spicy, herbal base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mango Haze",
    breeder: "Mr Nice Seeds",
    lineage: {
      parents: ["Haze", "Skunk Haze"],
      cross: "Haze × KC33 × Skunk Haze",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet mango over a spicy haze"],
    curatorNote:
      "Mango Haze is a Mr Nice Seeds sativa — a Haze blend with a tropical, mango-sweet lean. The nose is sweet and fruity: ripe mango and tropical fruit over a spicy haze base. The effect is up and creative — an energetic, uplifting, clear head with a light body, a daytime strain. It's terpy and potent, one of the prettier haze flavours. For sweet mango on a classic haze frame, Mango Haze is a flavourful pick.",
    curatorQuote:
      "Ripe mango and tropical fruit over a spicy haze base.",
    sourceConfidence: "medium",
    tagline: "Ripe and Soaring",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Mango Haze, a ripe-mango sativa rising through a warm spicy haze. A tropical mango grove heavy with sun-blushed ripe fruit, golden pollen-haze and incense-like smoke drifting in soft beams between broad leaves. Palette of ripe mango orange and sunset gold, sweet tropical tones and warm spice-amber against hazy soft greens, lit by a glowing diffused haze of low warm light. Mood is euphoric, uplifted and clear-headed creative, motion slow drifting smoke and warm rising air, lit by bright daytime sun filtered to a hazy tropical glow. Cinematic, painterly, high-contrast, premium editorial poster. The name MANGO HAZE is carved into the weathered bark of a leaning grove tree trunk. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Highland Thai",
    marketNames: ["Highland Thailand"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Highland Thai landrace"],
    curatorNote:
      "Highland Thai is a mountain-grown phenotype of the Thai landrace — a bright, soaring sativa from the cooler highlands of northern Thailand. The nose is clean and sharp: citrus and spice over an earthy, herbal base. The effect is a fast, electric cerebral high with no body, a pure equatorial daytime strain. It's long-flowering and moderate, a heritage rarity. For old-world highland Thai sativa, this is a collector's source.",
    curatorQuote: "Lemon-spice over earthy herb, a classic Thai lift.",
    sourceConfidence: "medium",
    tagline: "Mountain Stick Heritage",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Highland Thai, a bright, soaring mountain-grown Thai landrace with classic Thai-stick heritage. The scene is a misty terraced ridge in the cool highlands of northern Thailand, tall bamboo groves and stalks of lemongrass swaying on the slope, layered blue mountains receding into morning haze beyond the terraces. The palette is fresh bamboo-green and lemongrass citrus-gold over cool highland blue and earthy spice-brown, lit by crisp clear mountain light breaking through thin mist. The mood is energetic, euphoric, uplifted and creative, a fast electric soaring lift carried on cool rising air, set in bright daytime mountain sun. Cinematic, painterly, high-contrast, premium editorial poster. The name HIGHLAND THAI is burned into a length of bamboo standing in the foreground. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Persian",
    marketNames: ["Persian Landrace", "Iranian"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Iranian landrace", "Ancient hashish indica"],
    curatorNote:
      "Persian is an Iranian landrace indica — one of the oldest hashish plants, grown for millennia across the Persian plateau for charas and pressed hash. The nose is earthy and sweet: dry spice and sandalwood over a hashy base. The effect is calm and grounding — a mellow, relaxing body ease, moderate and traditional. It's dense, resin-rich and well-cured by nature, a foundational hash genetic. For old-world Persian hash genetics, this is a deep source.",
    curatorQuote:
      "Dry spice and sandalwood over a hashy base.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Manipuri",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Northeast Indian landrace"],
    curatorNote:
      "Manipuri is a landrace from the state of Manipur in northeast India — a clean, spicy equatorial sativa from the hills near the Myanmar border. The nose is earthy and bright: spice and sweetness with a faint citrus. The effect is energetic and clear — an uplifting, creative head with no body, a pure daytime landrace. It's hardy and moderate, prized by collectors for its rarity. For old-world northeast Indian sativa, Manipuri is a source.",
    curatorQuote: "Sweet spice and citrus, a north-east Indian hill sativa.",
    sourceConfidence: "medium",
    tagline: "Highland Spice Light",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Manipuri, a clean spicy equatorial landrace from the Manipur hills of northeast India near the Myanmar border. Layered green Himalayan foothills wreathed in cool morning mist, terraced ridgelines and wild flowering hill-slopes rolling toward distant blue peaks. Palette of floral pinks and pale citrus over earthy hill-greens and warm spice-browns against soft Himalayan blue-greys, lit by clean cool mountain light. Mood is energetic, uplifted and bright-minded, motion drifting valley mist and swaying highland blooms, lit by clear daytime light of a crisp hill morning. Cinematic, painterly, high-contrast, premium editorial poster. The name MANIPURI is carved into a mossy stone hillside boundary marker among the wild flowers. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Lemon Thai",
    lineage: {
      parents: ["Thai", "Hawaiian"],
      cross: "Thai × Hawaiian",
    },
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Zesty lemon-mint heritage sativa"],
    curatorNote:
      "Lemon Thai is a 1970s heritage cross of Thai and Hawaiian genetics — a zesty, lemon-and-mint sativa that featured in early American cannabis lore. The nose is bright and clean: lemon and mint over a spicy, herbal base. The effect is up and creative — an energetic, clear, talkative head with little body, a daytime classic. It's terpy and moderate, a piece of cannabis history. For old-world lemon-Thai sativa, this is a flavourful heritage strain.",
    curatorQuote:
      "Lemon and mint over a spicy, herbal base.",
    sourceConfidence: "medium",
    tagline: "Lemon-mint heritage",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Thai — a 1970s Thai × Hawaiian heritage sativa, zesty and clean with lemon and cool mint. A sun-dappled tropical herb garden at midday: stalks of lemongrass and fresh mint sprigs beside halved lemons and kaffir limes on a weathered teak tray, banana-leaf shadows and a lush jungle backdrop, a thread of bright steam rising as if from cool tea. Palette of lemon-yellow and cool mint-green over deep tropical leaf-green and warm teak-brown, fresh and clean. Mood: bright, talkative, creative — energetic uplifted clarity with a cool herbal lift, dappled light shifting through swaying leaves. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'LEMON THAI' carved into the edge of the teak tray. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Arjan's Haze",
    lineage: {
      parents: ["G13", "Haze"],
      cross: "G13 × Haze (Arjan's Haze #1, Green House Seeds; the #2/#3 cuts use different Haze lines)",
    },
    breeder: "Green House Seed Co.",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Sweet, spicy Greenhouse haze"],
    curatorNote:
      "Arjan's Haze is a Green House haze line named for founder Arjan Roskam — a sweet, spicy, energising sativa that won multiple Cups across its numbered cuts. The nose is bright and warm: citrus and spice over a sweet, herbal base. The effect is up and clear — an energetic, creative, focused head with a light body, a daytime strain. It's terpy and potent, a polished modern haze. For a sweet, refined haze, Arjan's Haze is a flavourful pick.",
    curatorQuote:
      "Citrus and spice over a sweet, herbal base.",
    sourceConfidence: "low",
    tagline: "Amsterdam Cup Royalty",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Arjan's Haze, the Green House Cup-winning haze named for founder Arjan Roskam, a sweet, spicy, energising Amsterdam pedigree. The scene is a narrow Amsterdam canal house facade with leaded windows, a brass nameplate by the door and threads of fragrant incense smoke drifting past hanging citrus and crates of spice in a warm interior glow. The palette is amber and warm pine-green over spiced ochre and zesty citrus gold, lit by glowing window light and curling incense haze. The mood is energetic, euphoric and creative, with a soaring head-high lift suggested in rising smoke and bright reflections on the canal, set in clear daytime light. Cinematic, painterly, high-contrast, premium editorial poster. The name ARJAN'S HAZE is engraved into the brass nameplate beside the canal-house door. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Hawaiian Snow",
    breeder: "Green House Seed Co.",
    lineage: {
      parents: ["Hawaiian", "Haze"],
      cross: "Hawaiian × Laos × Haze",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Frosty, soaring tropical haze"],
    curatorNote:
      "Hawaiian Snow is a Green House sativa — Hawaiian and Laotian genetics crossed into Haze — a frosty, soaring tropical haze that won multiple Cups. The nose is bright and sweet: citrus and tropical fruit over a spicy haze base. The effect is a long, energetic, creative cerebral high with little body, a powerful daytime sativa. It's frosty and very potent, unusually resinous for a haze. For a tropical, frost-caked haze, Hawaiian Snow is a standout.",
    curatorQuote:
      "Citrus and tropical fruit over a spicy haze base.",
    sourceConfidence: "medium",
    tagline: "Frosty Tropical Soar",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Hawaiian Snow, the Green House Seed Co. Hawaiian × Laos × Haze sativa, a frosty, soaring tropical haze of contrasts. Scene: a towering Hawaiian volcanic peak crowned with glittering snow-frost above lush emerald jungle slopes, tropical fruit and pine fronds in the foreground rimed with sparkling crystalline frost, a faint warm haze drifting over the caldera. Palette and light: vivid tropical teal and emerald with sweet papaya-orange, set against icy frost-white and pale glacial blue, edged with pine-green and a spicy amber glow; brilliant equatorial daytime sun glinting off frost. Mood and motion: energetic, euphoric and uplifting head-soar, frost crystals shimmering and tropical leaves swaying fast in trade winds, the dazzling clarity of full day. Cinematic, painterly, high-contrast, premium editorial poster. The name HAWAIIAN SNOW etched in frost-rime across a dark volcanic rock face. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Cataract Kush",
    marketNames: ["LA OG"],
    breeder: "DNA Genetics",
    lineage: {
      parents: ["LA Confidential", "OG Kush"],
      cross: "LA Confidential × OG Kush",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy gas, deeply couch-locking"],
    curatorNote:
      "Cataract Kush is a DNA Genetics cross of LA Confidential and OG Kush — two heavy hitters combined for serious sedation. The nose is loud OG: fuel and pine over a damp, skunky earth. The effect is profoundly relaxing — a euphoric head sinking into a numbing, couch-locking body, firmly an evening and sleep strain. It's gassy, dense and very potent, not one for the unprepared. For a heavy, couch-locking gas-OG, Cataract Kush delivers.",
    curatorQuote:
      "Fuel and pine over a damp, skunky earth.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a heavy, couch-locking gas-OG named Cataract Kush — a cataract being a great rushing waterfall. A powerful waterfall crashing down into a dark pine gorge at dusk, thick heavy mist billowing up and rolling across the wet black rock, a fuel-and-pine haze threading the spray with a faint oily petrol-rainbow shimmer, the whole scene blurred and clouded by dense fog. Fuel and pine over a damp, skunky earth, loud and gassy. Palette dark and heavy — deep pine green and wet slate-black with billowing silver-grey mist, a faint petrol shimmer and cool blue gloom in the gorge. Mood: profoundly relaxing — a euphoric head sinking into a numbing, couch-locking body, a heavy sleep strain. Cinematic, painterly, high-contrast, premium editorial poster, moody and atmospheric. The strain name 'CATARACT KUSH' baked into the scene — carved into the wet gorge stone. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "cataract-kush.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },
  {
    canonicalName: "AK-48",
    lineage: {
      parents: ["Ice", "Jock Horror"],
      cross: "Ice × Jock Horror (Nirvana Seeds)",
      parentDetails: {
        "Jock Horror": { lineageBrief: "Northern Lights × Skunk × Haze", type: "hybrid" },
      },
    },
    breeder: "Nirvana Seeds",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Fast-flowering AK selection"],
    curatorNote:
      "AK-48 is a Nirvana selection in the AK-47 family, named for a roughly 48-day flowering time — a fast, mellow, sweet-and-skunky hybrid. The nose is sweet and earthy: skunky sweetness over a spicy, herbal base. The effect is balanced and easy — an uplifting, happy head with a relaxed body, sociable and approachable. It's smooth and moderate-to-strong, bred for speed and ease. For a quick, mellow AK-style hybrid, AK-48 is a friendly pick.",
    curatorQuote: "Skunky-sweet and spicy, fast and pungent.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lemon Kush",
    lineage: {
      parents: ["Master Kush", "Lemon Joy"],
      cross: "Master Kush × Lemon Joy (commonly cited; also given as Afghani × Master Kush — not verified)",
      parentDetails: {
        "Lemon Joy": { type: "hybrid" },
      },
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Bright lemon over an earthy kush"],
    curatorNote:
      "Lemon Kush is a lemon-forward kush hybrid of contested lineage — bright citrus laid over an earthy, kushy body. The nose is fresh and sweet: lemon and citrus over an earthy, piney base. The effect is balanced and uplifting — a happy, energetic head with a relaxing body, versatile across the day. It's terpy and frosty, flavour-forward and potent. For clean lemon over a kush frame, Lemon Kush is a bright, easy pick.",
    curatorQuote:
      "Lemon and citrus over an earthy, piney base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Master Bubba",
    lineage: {
      parents: ["Master Kush", "Bubba Kush"],
      cross: "Master Kush × Bubba Kush",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Coffee-and-hash heavy indica"],
    curatorNote:
      "Master Bubba crosses Master Kush with Bubba Kush — two hashy, coffee-noted indicas folded into one heavy cut. The nose is rich and earthy: coffee and hash over a sweet, spicy base. The effect is strongly relaxing — a warm, sedating body weight that drifts toward sleep, a textbook nightcap. It's dense, frosty and potent. For coffee-and-hash heavy indica genetics, Master Bubba is a cosy, sleepy pick.",
    curatorQuote:
      "Coffee and hash over a sweet, spicy base.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Snowcap",
    lineage: {
      parents: ["Haze", "Snow White"],
      cross: "Haze × Snow White (commonly cited; multiple versions exist — not verified)",
      parentDetails: {
        "Snow White": { lineageBrief: "Cat Piss × Jack Herer line", type: "hybrid" },
      },
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Frosty minty-citrus sativa"],
    curatorNote:
      "Snowcap is a frosty, minty-citrus sativa-lean — a bright, energising hybrid named for its snow-white trichome coat. The nose is clean and sharp: citrus and pine with a cool, minty edge. The effect is up and focused — an energetic, creative, clear head with a light body, a daytime strain. It's frosty and terpy, flavour-forward and potent. For a crisp, minty-citrus sativa, Snowcap is a refreshing pick.",
    curatorQuote:
      "Citrus and pine with a cool, minty edge.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Highland Guatemalan",
    marketNames: ["Guatemalan"],
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["Central American highland landrace"],
    curatorNote:
      "Highland Guatemalan is a Central American landrace from the highlands of Guatemala — a clean, spicy equatorial sativa with deep heritage. The nose is earthy and warm: spice and sweetness with a faint citrus. The effect is energetic and creative — an uplifting, social head with no body, a pure daytime landrace. It's hardy and moderate, prized by collectors for its rarity. For old-world Central American sativa, Highland Guatemalan is a source.",
    curatorQuote: "Spiced sweetness with a citrus lift, a mountain sativa.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Sour Grape",
    marketNames: ["Sour Grapes"],
    lineage: {
      parents: ["Sour Diesel", "Granddaddy Purple"],
      cross: "Sour Diesel × Granddaddy Purple",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Grape candy over a sour-diesel base"],
    curatorNote:
      "Sour Grape is a Sour Diesel × Granddaddy Purple cross — sweet grape candy laid over a sour-diesel funk. The nose is sweet and tangy: grape and berry over a gassy, sour base. The effect is balanced and easy — a euphoric, happy head with a relaxing body, versatile across the day. It's frosty and flavour-forward, gas and fruit at once. For grape candy with a sour-diesel edge, Sour Grape is a tasty pick.",
    curatorQuote:
      "Grape and berry over a gassy, sour base.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a frosty grape-candy hybrid with a sour-diesel edge named Sour Grape. A cluster of plump deep-purple grapes bursting with an electric-sour splash of juice, tangy droplets spraying off them with a sour-green acid glow at the edges, a glittering trichome-frost dusting the skins; a faint oily petrol-rainbow shimmer threads the tangy mist, hinting at the sour-diesel base. Grape and berry over a gassy, sour base. Palette rich and electric — deep grape purple and berry-violet with zingy sour-green and acid highlights, a frosty silver sparkle and a faint petrol shimmer over a dark shadow. Mood: balanced and easy — a euphoric, happy head with a relaxing body, frosty and tangy. Cinematic, painterly, high-contrast, premium editorial poster, glossy and appetizing. The strain name 'SOUR GRAPE' baked into the scene — embossed on a worn metal plate or a small enamel tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "sour-grape.webp",
    artStatus: "published",
    artVersion: 1,
    sourceConfidence: "medium",
  },

  // ── MISSING PARENT STRAINS (catalog-expansion #24) ──
  {
    canonicalName: "91 Hollywood Pure Kush",
    marketNames: ["Hollywood Pure Kush", "HPK", "LA Pure Kush"],
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Clone-only SoCal OG cut"],
    curatorNote:
      "91 Hollywood Pure Kush (HPK) is a clone-only Southern California OG cut with undocumented origins — a Kush-forward OG Kush expression more than a bred seed line. The nose is thick and hashy: fuel and pine over a sour-diesel funk. The effect is a warm cerebral lift sinking into a heavy, sedating body, firmly an evening strain. It's a parent of Frosted Lemonade.",
    curatorQuote: "Thick, hashy OG gas — fuel and pine over sour-diesel funk.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Aspen OG",
    breeder: "303 Seeds",
    lineage: {
      parents: ["Sour Cream", "SFV OG"],
      cross: "Sour Cream × SFV OG",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Pine-and-lemon gas OG"],
    curatorNote:
      "Aspen OG is a 303 Seeds hybrid — Sour Cream crossed with SFV OG — leaning a touch sativa. The nose is bright pine and lemon over earthy diesel, rounding into sweet berry. The effect is clear, upbeat and creative with a steadily relaxing finish. It's a parent of Jet Fuel.",
    curatorQuote: "Bright pine and lemon over earthy diesel.",
    lineageConfidence: "medium",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Cherry Funk",
    lineage: {
      parents: ["Blueberry", "Black Cherry Soda"],
      cross: "DJ Short's Blueberry × Black Cherry Soda",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Clone-only cherry-berry funk"],
    curatorNote:
      "Black Cherry Funk is a clone-only balanced hybrid, most often cited as DJ Short's Blueberry crossed with Black Cherry Soda, though its lineage is contested. The nose is dessert-like: dark cherry and blueberry sweetness wrapped in a musky, skunky funk. The effect opens as an uplifting head buzz before easing toward a sleepy body. It's a parent of Black Cherry Gelato.",
    curatorQuote: "Dark cherry and blueberry over a musky, skunky funk.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "BOG Bubble",
    marketNames: ["BogBubble"],
    breeder: "BOG Seeds",
    lineage: {
      parents: ["Bubble Gum"],
      cross: "Bubble Gum-derived (BOG selection)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Stabilized Bubblegum line"],
    curatorNote:
      "BOG Bubble is an indica-leaning Bubblegum derivative from boutique breeder BOG Seeds (the 'Bushy Older Grower'). Rather than reinventing Bubblegum, BOG stabilized it for resin and frost. The nose is candy-sweet bubblegum and berry over earth; the effect is a gentle cerebral lift settling into calm body bliss. It's a parent of Boggle Gum.",
    curatorQuote: "Candy-sweet bubblegum and berry over earth.",
    lineageConfidence: "low",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "California Indica",
    marketNames: ["Cali Indica"],
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Orange Bud", "Afghani"],
      cross: "Orange Bud × Afghani Hash Plant",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Citrus-and-hash indica"],
    curatorNote:
      "California Indica is a Sensi Seeds indica-dominant hybrid — the citrus-forward Orange Bud crossed with a true Afghani Hash Plant, marrying West Coast and Afghan roots. The nose is sweet, sour-orange citrus over warm hashish. The effect is soothing and body-relaxing without heavy couch-lock, lifted by happiness. It's a parent of LA Confidential.",
    curatorQuote: "Sweet, sour-orange citrus over warm hashish.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "California Sour",
    marketNames: ["Cali Sour"],
    lineage: {
      cross: "Mexican sativa × Afghani indica",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Balanced diesel hybrid"],
    curatorNote:
      "California Sour is an elusive, balanced hybrid of uncertain origin — generally described as a Mexican sativa combined with an Afghani indica, and credited as an ancestor of Lemon Diesel. The nose is diesel-tinged with fruity accents and a peppery Afghani edge. The effect is daytime-friendly, sharpening focus and lifting mood as a relaxing body buzz settles in.",
    curatorQuote: "Diesel-tinged with fruity accents and a peppery edge.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Citral",
    marketNames: ["Citral #13"],
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["Pakistani Chitral Kush", "Super Skunk"],
      cross: "Pakistani × Super Skunk",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Citrus-skunk indica"],
    curatorNote:
      "Citral (Citral #13) is a Nirvana Seeds indica named for Pakistan's Chitral region — a Pakistani landrace crossed with Super Skunk. The nose is sweet citrus-lemon over a skunky base. Despite the indica roots the high opens with a tingly cerebral lift before settling into heavy, couch-locking relaxation. It's a parent of Papaya.",
    curatorQuote: "Sweet citrus-lemon over a skunky base.",
    lineageConfidence: "medium",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Ed Rosenthal Super Bud",
    marketNames: ["ERSB"],
    breeder: "Sensi Seeds",
    lineage: {
      cross: "Afghani × Thai × African × Mexican (multi-landrace)",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Pineapple-led polyhybrid"],
    curatorNote:
      "Ed Rosenthal Super Bud is a Sensi Seeds hybrid released in 2006 to honour the cultivation author, tracing to a multi-landrace project (Afghani, Thai, African, Mexican). The nose is pineapple-led with citrus, floral and pine. It layers a sativa-like uplifting headspace over a classic indica body-stone; exact parent ratios are undocumented. It's a parent of Pineapple.",
    curatorQuote: "Pineapple-led, with citrus, floral and pine.",
    lineageConfidence: "low",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Eddy OG",
    marketNames: ["OG Eddy Lepp", "Eddy Lepp OG"],
    breeder: "Apothecary Genetics",
    lineage: {
      cross: "OG-family cut (undocumented)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["OG named for Eddy Lepp"],
    curatorNote:
      "Eddy OG (OG Eddy Lepp) is an OG-family California indica named for cannabis activist Eddy Lepp, tied to a ~2004 Apothecary Genetics collaboration, though its exact parents were never documented. The nose is woody, earthy and fuel-forward with a surprisingly tropical taste. It builds from a calming lift into deep, couch-lock-leaning relaxation. It's a parent of Peach Rings.",
    curatorQuote: "Woody, earthy fuel with a surprisingly tropical taste.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Evergladez",
    breeder: "GreenFire Genetics",
    lineage: {
      parents: ["Zkittlez"],
      cross: "Zkittlez × ZOZ (ZOZ BX Zkittlez)",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Zkittlez backcross"],
    curatorNote:
      "Evergladez is a GreenFire Genetics creation built as a Zkittlez backcross (ZOZ BX Zkittlez), folding OG Eddy Lepp into the Zkittlez family. The nose leans candy-sweet, juicy fruit and berry from the Zkittlez side. The effect is balanced and sugary, relaxing into an easy calm. It's a parent of Frosted Lemonade.",
    curatorQuote: "Candy-sweet, juicy fruit and berry.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Face Mints",
    marketNames: ["Mint Face Off", "Face Off Mints"],
    lineage: {
      parents: ["Animal Face", "Kush Mints"],
      cross: "Animal Face × Kush Mints",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Minty gas cut (lineage contested)"],
    curatorNote:
      "Face Mints is an indica-leaning cut most often reported as Animal Face crossed with Kush Mints, though the original breeder is unclear. The nose is sharp menthol-mint and citrus over an earthy, slightly nutty, gassy base. The effect opens with fast cerebral euphoria and settles into heavy, couch-leaning relaxation. It's a parent of Gas Face.",
    curatorQuote: "Sharp menthol-mint and citrus over earthy gas.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Florida Kush",
    lineage: {
      cross: "OG Kush-type Florida cut (uncertain)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Florida OG cut"],
    curatorNote:
      "Florida Kush is an OG-Kush-style hybrid tied to Florida's scene, but its exact parents and breeder are contested. The nose is sharp citrus and fruit over earthy, gassy OG. Reviewers report a deeply calming experience that trends toward sleep. It's a parent of Pink Panties.",
    curatorQuote: "Sharp citrus and fruit over earthy, gassy OG.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Genius",
    marketNames: ["The Genius"],
    breeder: "Brothers Grimm Seeds",
    lineage: {
      parents: ["Jack Herer"],
      cross: "Jack Herer phenotype (clone-only)",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Jack Herer phenotype"],
    curatorNote:
      "Genius is a clone-only Jack Herer phenotype selected by Brothers Grimm Seeds — named for the strong, introspective cerebral high it produced. The nose is herbal, woody and citrus-spice with a creative, energetic lift settling into euphoric calm. It's best known as the mother of Apollo 11 and Apollo 13 — a parent of Apollo 13.",
    curatorQuote: "Herbal, woody and citrus-spice, clear and creative.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
    tagline: "Quiet Brilliance",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Genius, a clone-only Jack Herer phenotype prized for a strong, introspective, almost scholarly cerebral high. A cluttered inventor's attic study at the top of a tall house: an antique brass orrery and open ledgers on a heavy oak desk, a single window throwing a hard shaft of light across drifting motes and pinned botanical-spice sketches. Palette of warm pine-needle greens, herbal ochres, woody walnut browns and a bright lemon-citrus glint catching the brass, evoking the spicy-herbal-citrus-pine nose. The air feels charged with energetic, creative, focused thought, motes spiralling upward in slow euphoric motion, lit by a clear bright daytime sun raking through the glass. Cinematic, painterly, high-contrast, premium editorial poster. The name GENIUS is engraved into the worn brass nameplate screwed to the front of the oak desk, catching the light. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Grateful Puff",
    lineage: {
      parents: ["Grateful Breath", "Cherry Puff"],
      cross: "Grateful Breath × Cherry Puff (cut-dependent)",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Sweet Cookies/OGKB-adjacent cut"],
    curatorNote:
      "Grateful Puff is a sweet, fruity Cookies/OGKB-adjacent hybrid; Gage Green's version is listed as Grateful Breath × Cherry Puff, while Grandiflora uses a select cut as a foundational parent. The nose is sweet berry over a gassy, earthy base. The effect is relaxing and euphoric. It's a parent of Platinum Puff.",
    curatorQuote: "Sweet berry over a gassy, earthy base.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Headbanger",
    marketNames: ["Headbanger Kush"],
    breeder: "Karma Genetics",
    lineage: {
      parents: ["Sour Diesel", "Biker Kush"],
      cross: "Sour Diesel × Biker Kush",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sour-diesel gas hybrid"],
    curatorNote:
      "Headbanger is a sativa-dominant Karma Genetics hybrid of Sour Diesel × Biker Kush — Sour D's sour-diesel nose and head-focused punch over dense Kush structure. The flavour leans citrusy-sweet over a skunky base, with creative, focused, euphoric effects. It's a parent of Sherbanger.",
    curatorQuote: "Sour-diesel nose, citrus-sweet over skunk.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hella Jelly",
    marketNames: ["Jelly Rancher"],
    breeder: "Humboldt Seed Company",
    lineage: {
      parents: ["Notorious THC", "Very Cherry"],
      cross: "Notorious THC × Very Cherry",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Candy-jelly sativa"],
    curatorNote:
      "Hella Jelly is a sativa-dominant Humboldt Seed Company strain (originally Jelly Rancher) from Notorious THC and Very Cherry, stabilized by backcrossing. The nose is candy and jelly fruit-berry; the effect is an uplifting, energetic head high. It won HSC's 2019 phenotype mega-hunt and is a parent of Jelly Donutz.",
    curatorQuote: "Candy-jelly fruit and berry, bright and energetic.",
    lineageConfidence: "medium",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "High Country Diesel",
    breeder: "303 Seeds",
    lineage: {
      parents: ["Sour Diesel", "OG Kush"],
      cross: "East Coast Sour Diesel × OG Kush family",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Heavy fuel cut"],
    curatorNote:
      "High Country Diesel is an indica-leaning 303 Seeds cut in the East Coast Sour Diesel and OG Kush family, with a pungent fuel-and-earth profile. The effect builds from a mellow lift into heavy, sedating relaxation. It's a parent of Jet Fuel.",
    curatorQuote: "Pungent fuel and earth, heavy and sedating.",
    lineageConfidence: "medium",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Honey Boo Boo",
    marketNames: ["Honey Boo"],
    breeder: "DNA Genetics",
    lineage: {
      parents: ["Captain Krypt OG", "Bubba Kush"],
      cross: "Captain Krypt OG × Bubba Kush",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Honeyed indica with purple tips"],
    curatorNote:
      "Honey Boo Boo is a limited DNA Genetics indica (~80%) — a Captain Krypt OG male over a Bubba Kush female. It smells of honeyed sweet lemon and candied fruit with grape and earth, often finishing with purple tips. The effect is a heavy, relaxing body euphoria. It's a parent of Honey Banana.",
    curatorQuote: "Honeyed sweet lemon and candied fruit.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Jamaica",
    marketNames: ["Jamaican", "Jamaican Lamb's Bread"],
    lineage: {
      cross: "landrace",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Jamaican landrace sativa"],
    curatorNote:
      "Jamaica is pure sativa landrace cannabis native to the island, shaped by an equatorial climate (kin to Lamb's Bread). The nose is earthy-sweet and tropical; the effect is energetic, uplifting and creative — a classic daytime sativa. Jamaican genetics feed Amnesia Haze and many Haze lines.",
    curatorQuote: "Earthy-sweet and tropical, energetic and uplifting.",
    lineageConfidence: "high",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Jock Horror",
    marketNames: ["Jock Horror #1"],
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["Haze", "Skunk #1", "Northern Lights"],
      cross: "Haze × Skunk × Northern Lights",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Jack-Herer-style sativa"],
    curatorNote:
      "Jock Horror is a sativa-dominant Nirvana Seeds hybrid of Haze × Skunk × Northern Lights — modeled on Jack Herer (the name is a play on it). The nose is sweet citrus-grapefruit and fruit; the effect is fast, energetic and uplifting after a long flower. It's a parent of AK-48.",
    curatorQuote: "Sweet citrus-grapefruit, fast and energetic.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Juicy Fruit",
    marketNames: ["Fruity Juice", "Juicy Fruit Thai"],
    breeder: "Sensi Seeds",
    lineage: {
      parents: ["Afghani", "Thai"],
      cross: "Afghani × Thai",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet fruit hybrid"],
    curatorNote:
      "Juicy Fruit (sold by Sensi Seeds as Fruity Juice) is a sativa-leaning hybrid of a pure Afghani over a pure Thai. The nose is sugary sweet-and-sour fruit, like the chewing gum it's named for, with tropical and citrus notes. The effect opens cerebral and uplifting before easing into a calmer body. It's a parent of Orange Creamsicle.",
    curatorQuote: "Sugary sweet-and-sour fruit, tropical and bright.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Juliet",
    lineage: {
      parents: ["Cinderella 99", "NYC Diesel"],
      cross: "Cinderella 99 × NYC Diesel",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Sweet berry-diesel sativa"],
    curatorNote:
      "Juliet is a sativa-dominant hybrid crossing Cinderella 99 with NYC Diesel, though the originating breeder isn't clearly documented. The nose is sweet berry with citrus and a subtle diesel undertone. The effect is an uplifting, focus-sharpening cerebral buzz for daytime. It's a parent of Strawberry Shortcake.",
    curatorQuote: "Sweet berry with citrus and a subtle diesel edge.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Laos",
    marketNames: ["Laotian", "Lao"],
    lineage: {
      cross: "landrace",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Laotian highland landrace"],
    curatorNote:
      "Laos is a pure-sativa landrace from the semi-tropical highlands of Laos, preserved by heritage seedbanks. The aroma is tropical and complex — mango, papaya, guava and floral notes. The high is energizing, uplifting and creativity-promoting, a daytime sativa. Its genetics feed Amnesia Haze and the Haze family.",
    curatorQuote: "Tropical and complex — mango, papaya and floral.",
    lineageConfidence: "high",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Lemon Joy",
    lineage: {
      cross: "uncertain (often cited Lemon Skunk × Pineapple Joy)",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Bright lemon sativa"],
    curatorNote:
      "Lemon Joy is a sativa-dominant hybrid with no firmly documented breeder; sources most often cite a Lemon Skunk × Pineapple Joy cross. The nose is bright, sugary lemon-citrus with herbal and spicy notes. The effect is fast-acting, energetic and uplifting with mental clarity. It's a parent of Lemon Kush.",
    curatorQuote: "Bright, sugary lemon-citrus, fast and clear.",
    lineageConfidence: "low",
    sourceConfidence: "low",
    tagline: "Sunny Little Lift",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) capturing the spirit of Lemon Joy, a cheerful, fast-acting sweet-lemon hybrid radiating sunny domestic warmth. The scene is a cozy kitchen windowsill in the morning, a ceramic bowl of bright lemons beside a steaming mug and a small wooden cutting board, gingham cloth and a vase of yellow blooms warmed by light spilling across the counter. The palette is buttery lemon-yellow and warm honeyed wood over soft cream and a touch of spice-brown, glowing with cheerful sugary citrus light. The mood is happy, uplifted, focused and energetic, an easy domestic brightness with gentle rising warmth, lit by cheerful clear daytime sun. Cinematic, painterly, high-contrast, premium editorial poster. The name LEMON JOY is painted in tidy lettering across the front of the ceramic bowl. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "published",
  },
  {
    canonicalName: "Lemon OG",
    marketNames: ["Lemon OG Kush"],
    breeder: "DNA Genetics",
    lineage: {
      parents: ["Lemon Skunk", "OG #18"],
      cross: "Las Vegas Lemon Skunk × OG #18",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Lemon-gas OG"],
    curatorNote:
      "Lemon OG Kush is a DNA Genetics indica-dominant hybrid — the Las Vegas Lemon Skunk cut crossed with The OG #18. The nose is tangy, pungent lemon over skunky earth. The effect begins uplifting and clear-headed before settling into deep body relaxation. It's a parent of Lemonnade.",
    curatorQuote: "Tangy, pungent lemon over skunky earth.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lost Coast OG",
    marketNames: ["Lost Coast OG Kush"],
    lineage: {
      parents: ["Chemdawg", "Lemon Thai"],
      cross: "Chemdawg 4 × Pakistani Kush × Lemon Thai",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Emerald Triangle OG"],
    curatorNote:
      "Lost Coast OG is a California (Emerald Triangle) indica-dominant hybrid, most often described as Chemdawg 4 crossed with Pakistani Kush and Lemon Thai, though its clone origin keeps the lineage uncertain. The nose is sour citrus, pine and earthy OG. The high opens cerebral and buzzy before mellowing. It's a parent of Lemon Diesel.",
    curatorQuote: "Sour citrus, pine and earthy OG.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Marionberry",
    marketNames: ["Marionberry Kush", "Marion Berry"],
    breeder: "Heroes of the Farm",
    lineage: {
      parents: ["Raspberry Kush", "Space Queen"],
      cross: "Raspberry Kush × Space Queen",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Sweet-berry hybrid"],
    curatorNote:
      "Marionberry (Marionberry Kush) is an indica-leaning hybrid from Heroes of the Farm — Raspberry Kush crossed with Space Queen. The nose is sweet, earthy berry with plum and apricot. The effect starts with a mental uplift before easing into body relaxation. It's a parent of Peach Rings.",
    curatorQuote: "Sweet, earthy berry with plum and apricot.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "OG LA Affie",
    marketNames: ["LA Affie"],
    breeder: "DNA Genetics",
    lineage: {
      cross: "Afghani / Hindu Kush heirloom (undocumented)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Afghani-rooted indica"],
    curatorNote:
      "OG LA Affie is a heavily indica strain associated with DNA Genetics, who obtained it as a female cutting; its exact parentage is undocumented but rooted in Afghani/Hindu Kush landrace genetics. The nose is earthy, pungent and slightly spicy with sweet hashy pine. The effect begins cerebral before settling into heavy body relaxation. It's a parent of LA Confidential.",
    curatorQuote: "Earthy, pungent and spicy with sweet hashy pine.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Orange Crush",
    marketNames: ["Orange Krush"],
    breeder: "BC Growers Association",
    lineage: {
      parents: ["California Orange", "Blueberry"],
      cross: "California Orange × Blueberry",
    },
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["Citrus-forward hybrid"],
    curatorNote:
      "Orange Crush is a hybrid of California Orange and Blueberry, widely attributed to the Canadian BC Growers Association. It's known for a sweet, tangy citrus-forward aroma with earthy undertones. The effect is uplifting and cerebral, leaning energetic and mood-boosting. It's a parent of Orange Creamsicle.",
    curatorQuote: "Sweet, tangy citrus over earth.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Ortega",
    marketNames: ["Maple Leaf", "Maple Leaf Indica"],
    lineage: {
      cross: "Afghani landrace (Mazar-i-Sharif)",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Afghan resin indica"],
    curatorNote:
      "Ortega is described as a pure Afghan indica from Mazar-i-Sharif — reportedly passed to Nevil Schoenmakers and also known as Maple Leaf Indica; some commercial versions instead cite Northern Lights heritage, so lineage is contested. The nose is earthy and sweet, and it's prized for heavy resin. It's a parent of Black Domina.",
    curatorQuote: "Earthy and sweet, prized for heavy resin.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Purple Elephant",
    marketNames: ["Elephant Purple"],
    lineage: {
      parents: ["Purple Urkle"],
      cross: "Purple Urkle × undisclosed",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Clone-only purple hybrid"],
    curatorNote:
      "Purple Elephant is a rare clone-only purple hybrid descending from the Purple Urkle line crossed with an undisclosed strain. It's known for deep purple coloring and a sweet, grape-forward berry aroma. The effect is relaxed and happy. Gage Green famously used it to breed Grape Stomper.",
    curatorQuote: "Deep purple, sweet grape-forward berry.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Razzleberry",
    marketNames: ["The Razz"],
    breeder: "Humboldt Seed Company",
    lineage: {
      cross: "uncertain",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Jammy berry selection"],
    curatorNote:
      "Razzleberry ('The Razz') is a berry-forward selection maintained by Humboldt Seed Company; its own parent genetics aren't publicly documented. It's named for a sweet, jammy mixed-berry profile. HSC crossed it with Purple Panty Dropper to create Blueberry Muffin — making it a parent of Blueberry Muffin.",
    curatorQuote: "Sweet, jammy mixed berry.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Secret Weapon",
    lineage: {
      parents: ["Cheese Quake", "White Widow"],
      cross: "Cheese Quake × White Widow",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Cheese-and-berry funk"],
    curatorNote:
      "Secret Weapon is most documented as an award-winning Cheese Quake phenotype crossed with White Widow, though several breeders have used the name. The nose is tangy cheese and sweet over earth. The effect is balanced and uplifting, leaning focused. It's a parent of Oreoz.",
    curatorQuote: "Tangy cheese and sweet over earth.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Snow White",
    marketNames: ["Snowwhite"],
    breeder: "Nirvana Seeds",
    lineage: {
      parents: ["White Widow", "Northern Lights"],
      cross: "White Widow × Northern Lights",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Frosty WW × NL"],
    curatorNote:
      "Snow White is a Nirvana Seeds indica-dominant hybrid — a White Widow mother crossed with a Northern Lights father, named for its heavy frosty trichome coat. The nose is citrus and pine over earth. The White Widow side gives resin; Northern Lights adds density. It's a parent of Snowcap.",
    curatorQuote: "Citrus and pine under a heavy frost coat.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "South Florida OG",
    marketNames: ["SFLA OG", "South Florida OG Kush"],
    lineage: {
      cross: "OG Kush clone line (uncertain)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Early-90s Florida OG"],
    curatorNote:
      "South Florida OG is a clone-only OG Kush expression rooted in the early-1990s South Florida underground — regarded by some as a definitive original OG cut, though its seed parentage isn't firmly documented. It delivers classic gassy, earthy-pine OG with potent relaxing effects. Cookies Fam crossed it with Gelato #25 to make Biscotti.",
    curatorQuote: "Classic gassy, earthy-pine OG.",
    lineageConfidence: "low",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Starfighter",
    marketNames: ["Star Fighter"],
    breeder: "Alien Genetics",
    lineage: {
      parents: ["Lemon Alien Dawg", "Tahoe Alien"],
      cross: "Lemon Alien Dawg × Tahoe Alien",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Starry-frost citrus gas"],
    curatorNote:
      "Starfighter is an Alien Genetics indica-dominant hybrid of Lemon Alien Dawg and Tahoe Alien, noted for a star-like trichome coat and a raspberry-sorbet-with-lemon aroma. The original cut is largely discontinued, with phenos resurrected by other breeders. It's a documented parent of MAC.",
    curatorQuote: "Raspberry-sorbet and lemon under starry frost.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "White Diesel",
    marketNames: ["White Diesel Haze"],
    breeder: "White Label / Sensi Seeds",
    lineage: {
      parents: ["White Widow", "NYC Diesel"],
      cross: "White Widow × NYC Diesel",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Frosty diesel hybrid"],
    curatorNote:
      "White Diesel is most commonly documented as a White Widow × NYC Diesel hybrid by White Label (a Sensi Seeds partner), though other versions exist. It combines the frosty resin of the 'White' family with a pungent diesel-citrus nose. The effect is uplifting and energetic with a relaxing base. It's a parent of The Menthol.",
    curatorQuote: "Frosty resin over a pungent diesel-citrus nose.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Y Life",
    marketNames: ["Y-Life"],
    breeder: "Cookies",
    lineage: {
      parents: ["Girl Scout Cookies", "Cherry Pie"],
      cross: "GSC × Cherry Pie",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cookies-family dessert cut"],
    curatorNote:
      "Y Life is a Cookies-family cut commonly documented as GSC crossed with Cherry Pie, carrying dessert-like sweet, fruity aromas. It's reported to give a relaxing-but-not-sleepy effect. It's a parent of Cereal Milk (Y Life × Snowman).",
    curatorQuote: "Dessert-sweet and fruity, relaxing but clear.",
    lineageConfidence: "medium",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Zookies",
    marketNames: ["Animal Cookies x GG4"],
    breeder: "Alien Labs",
    lineage: {
      parents: ["Animal Cookies", "GG4"],
      cross: "Animal Cookies × Original Glue (GG4)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cookie-gas cut"],
    curatorNote:
      "Zookies is an Alien Labs cut — Animal Cookies crossed with Original Glue (GG4). The nose is sweet, nutty cookie with peppery diesel from the Glue side. Effects start cerebral and settle into full-body relaxation. It's a parent of Biskante.",
    curatorQuote: "Sweet, nutty cookie with peppery diesel.",
    lineageConfidence: "high",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Paw Paw",
    marketNames: ["PawPaw", "Pawpaw"],
    breeder: "Skunk House Genetics",
    lineage: {
      parents: ["Indigo Bubblegum", "Modified Bananas"],
      cross: "Indigo Bubblegum × Modified Bananas",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Creamy tropical bubblegum", "Banana-driven depth"],
    curatorNote:
      "Paw Paw is an almost evenly balanced hybrid from Skunk House Genetics — Indigo Bubblegum crossed with Modified Bananas — named for the custardy mango-banana pawpaw fruit. The nose is sweet tropical fruit and creamy bubblegum over a hint of spice and earth, with a banana-driven depth from the Modified side. The effect comes on fast and stays balanced: an uplifting, creative, giggly mood-lift that melts into gentle body relaxation without couch-lock — good for social moments or an easy unwind. It runs potent and frosty (NY shelves show it north of 30% THC), a flavour-forward modern hybrid.",
    curatorQuote: "Creamy tropical bubblegum with a banana-driven depth.",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a creamy, tropical, balanced hybrid named Paw Paw — after the custardy mango-banana pawpaw fruit. A ripe pawpaw fruit sliced open to reveal glistening golden-custard flesh and a row of large dark seeds, ripe bananas and a swirl of creamy bubblegum-pink softness beside it, warm tropical golden-hour light, a soft sugared frost dusting the cut fruit and a gentle sweet vapor in the air. Creamy tropical bubblegum with a banana-driven depth over a light earthy base. Palette warm and luscious — golden-custard yellow and banana cream with tropical green leaves and a soft bubblegum-pink swirl, a frosty sheen under a honeyed glow. Mood: uplifting and creative easing into gentle body calm — balanced, sweet and indulgent, never couch-locked. Cinematic, painterly, high-contrast, premium editorial poster, lush and appetizing. The strain name 'PAW PAW' baked into the scene — branded into a wooden board or a small enamel fruit tag. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artFileName: "paw-paw.webp",
    artStatus: "published",
    artVersion: 1,
    lineageConfidence: "medium",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mandarin Cookies",
    lineage: {
      parents: ["Forum Cookies", "Mandarin Sunset"],
      cross: "Forum Cookies × Mandarin Sunset",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Sharp tangerine and orange-peel nose over doughy cookie base", "Sweet-gas undertone with a hint of pine on the back end", "Limonene-forward; bright, eye-opening lift", "Sativa-leaning hybrid energy that settles into functional ease"],
    curatorNote:
      "Born from the Forum Cookies cut bred into the citrus-soaked Mandarin Sunset, Mandarin Cookies opens like peeling a ripe clementine over a tray of fresh-baked cookies. The nose is all sharp tangerine and sweet orange zest, with a doughy, herbal cookie warmth underneath and the faintest whiff of sweet gasoline keeping it from being too pretty. On the palate that tangy citrus carries a nutty, almond-cookie finish. The arc is bright and cerebral up top, a frenzied little rush of motivation and creativity, before it loosens into a warm, relaxed body that never tips into sedation. A morning strain for people who like their wake-up loud, sweet, and useful.",
    curatorQuote:
      "Peel the clementine, raid the cookie jar.",
    tagline: "Sweet-citrus wake-up",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a bright, citrus-forward sativa-leaning hybrid named Mandarin Cookies, intended as premium editorial poster art. The scene: a single mandarin orange caught mid-peel, its zest curling outward in a glowing spiral over a rustic wooden table dusted with cookie crumbs and powdered sugar, droplets of citrus oil suspended and catching the light. Palette of vivid tangerine and warm orange against doughy cream and golden-brown, with a thin thread of pale pine-green for lift. Light is clean early-morning sun raking low across the table, long soft shadows and a fresh, energetic glow with a faint motion of the peel still unspooling, suggesting the bright cerebral rush. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'MANDARIN COOKIES' baked subtly into the scene along the table edge. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Red Velvet",
    lineage: {
      parents: ["Lemon Cherry Gelato", "Pina Acai"],
      cross: "Lemon Cherry Gelato × Pina Acai",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy vanilla overtone with tart cherry and berry", "Tropical, pastry-like sweetness from the Pina Acai side", "Subtle earthy-gas finish underneath the dessert notes", "Soothing, full-bodied with creative mental stimulation"],
    curatorNote:
      "A cross of the cult-favorite Lemon Cherry Gelato and the tropical Pina Acai, Red Velvet earns its name honestly: it smells and tastes like dessert. The nose is creamy and rich, tart cherries and a bouquet of fresh fruit folded into a vanilla-pastry sweetness, with just enough earthy gas at the bottom to keep it grown-up. The palate is smooth and berry-pastry sweet with a citrus edge. Effects come on soothing and full-bodied, a tingly sense of happiness and creative stimulation that lifts the mood before the body eases down into relaxation. A daytime indulgence for anyone who treats flavor as the main event.",
    curatorQuote:
      "Cake for the senses, calm for the head.",
    tagline: "Dessert in bloom",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a creamy, dessert-sweet euphoric hybrid named Red Velvet, intended as premium editorial poster art. The scene: a luscious slice of deep-crimson red velvet cake with thick swirls of cream-cheese frosting, a glossy tart cherry perched on top and a few berries tumbling beside it, ribbons of vanilla cream caught mid-pour. Palette of rich velvet crimson and berry-red against soft vanilla cream and warm beige, with a faint earthy-brown shadow grounding it. Light is soft, diffuse daytime studio glow, warm and inviting, the cream catching gentle highlights with a slow luxurious drip of frosting suggesting the soothing, full-bodied ease. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'RED VELVET' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Jokerz",
    lineage: {
      parents: ["White Runtz", "Jet Fuel Gelato"],
      cross: "White Runtz × Jet Fuel Gelato",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Sour cheese-candy nose with creamy, floral sweetness", "Pungent diesel and peppery fuel on the exhale", "Caryophyllene-driven spice over candy and earth", "Relaxed, euphoric, focused before a sleepy drift"],
    curatorNote:
      "Compound Genetics' Jokerz crosses White Runtz with Jet Fuel Gelato, and the contradiction is the whole point. The nose is funky and unhinged, sour cheese and candy up front, creamy and floral underneath, then the jet fuel detonates on the exhale into pungent, peppery diesel. It opens smooth and sweet and finishes gassy and earthy, a flavor that keeps the palate guessing from first hit to last. The effect lands relaxed and euphoric with a surprising window of focus before it tips, slow and heavy, toward sleep. A nighttime indica for connoisseurs who want their candy with a dangerous edge.",
    curatorQuote:
      "Sweet on the inhale, gas on the punchline.",
    tagline: "Candy with teeth",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a funky, gas-and-candy indica-dominant hybrid named Jokerz, intended as premium editorial poster art. The scene: a single twisted candy wrapper unfurling to reveal a glossy sweet inside, while a thin curl of dark fuel-vapor coils up behind it and catches a sodium-lamp glint, the whole thing balanced between playful and menacing. Palette of acid-yellow and electric purple candy tones against oily charcoal and diesel-blue shadow, a sour-cream cream accent threading through. Light is moody late-night, a single hard spotlight raking across the scene with deep blacks around it, slow drifting vapor giving a heavy, hypnotic motion that mirrors the relaxed-then-sleepy slide. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'JOKERZ' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Truffle Butter",
    lineage: {
      parents: ["Gelato", "Chocolate Kush"],
      cross: "Gelato × Chocolate Kush",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Caramel, coffee and dark-chocolate dessert notes", "Fruity, nutty inhale with a tart-gas, minty finish", "Dark berry edge over an earthy-fuel base", "Euphoric lift fading into sedative couch-lock"],
    curatorNote:
      "Truffle Butter folds Gelato into Chocolate Kush, and the result is the richest, most decadent corner of the menu. The nose is sweet and doughy with a dark berry edge over an earthy fuel base; the palate is where it shows off, rich chestnut and coffee on the inhale, mouthfuls of caramel and cocoa, then a lingering mint and tart-gas finish. Effects open uplifted and happy with a rush of euphoria before they melt, unhurried, into an unfocused, deeply sedative couch-lock. This is a late-night dessert strain, the one you reach for when the day is done and you want flavor and gravity in equal measure.",
    curatorQuote:
      "Caramel, cocoa, and a soft landing.",
    tagline: "Decadent and done",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a rich, dessert-heavy sedative indica named Truffle Butter, intended as premium editorial poster art. The scene: a single dark chocolate truffle split open to reveal a molten caramel center, a thread of melted chocolate pulling away, a scatter of dark berries and coffee beans glistening on a slab of dark stone. Palette of deep cocoa brown and burnt caramel gold against near-black, with a bruised dark-berry purple and a faint mint-green glint. Light is warm, low and intimate, a single candle-like glow pooling on the truffle and falling off fast into shadow, slow viscous drip of caramel suggesting the melt into couch-lock. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'TRUFFLE BUTTER' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Granddaddy Pluto",
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Flowery violet overtone with fruity blueberry", "Spicy anise and pipe-tobacco accents", "Sweet-fruity, faintly spicy palate", "Weighty, sedative nighttime calm with hunger"],
    curatorNote:
      "Granddaddy Pluto is a deep-purple nighttime indica that smells like a violet sachet tucked into a bowl of blueberries. The nose leads with flowery violet and ripe berry, threaded with spicy anise and a curl of pipe tobacco; the palate follows sweet and fruity with a peppery edge. The effect is unapologetically heavy, settling into mind and body a few minutes after the exhale with a weighty, dreamy calm that drifts toward hunger and then sleep. There is little pretense of productivity here. This is the last strain of the evening, for winding all the way down.",
    curatorQuote:
      "Violets, berries, and the long way down.",
    tagline: "Deep space sleep",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sedative, berry-and-floral nighttime indica named Granddaddy Pluto, intended as premium editorial poster art. The scene: a cluster of dusky violets and plump blueberries floating in a dark cosmic field, a small distant planet hanging low like a fruit, faint stardust drifting between them. Palette of deep indigo and royal violet against bruised plum and near-black, with blueberry-blue highlights and a faint spice-amber glint. Light is dim, nocturnal and cosmic, a soft moon-blue rim glow with vast shadow around it, slow weightless drift of petals and dust suggesting the heavy, dreamy sedation of deep night. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'GRANDDADDY PLUTO' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Watermelon Gelato",
    lineage: {
      parents: ["Watermelon Zkittlez", "Gelato 45"],
      cross: "Watermelon Zkittlez × Gelato 45",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Juicy watermelon and tropical fruit over creamy gelato", "Doughy cream and a faint floral gas accent", "Limonene and caryophyllene forward", "Instant uplift into focused, creative motivation"],
    curatorNote:
      "Watermelon Zkittlez bred into Gelato 45 gives Watermelon Gelato its summer-stand sweetness, all juicy melon and tropical fruit poured over a scoop of doughy, creamy gelato with a faint floral gas keeping it honest. The flavor delivers exactly what the nose promises, sweet melon and cream with a citrus brightness. The effect arrives the moment you exhale, an immediate body ease that gives way to a lifted, focused, happy motivation, the kind that suits creative work or easy conversation. A daytime hybrid for bright afternoons and good company.",
    curatorQuote:
      "Summer in a scoop.",
    tagline: "Juicy and lifted",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a juicy, uplifting tropical hybrid named Watermelon Gelato, intended as premium editorial poster art. The scene: a glistening wedge of ripe watermelon balanced against a melting scoop of pale gelato, droplets of melon juice arcing through the air, a few tropical petals scattered nearby. Palette of vivid watermelon pink and red against fresh mint-green rind and creamy off-white, with a sunny citrus-yellow sparkle. Light is bright midday daytime sun, crisp and clean with sparkling highlights on the juice, lively splashing motion that mirrors the instant uplift and focused energy. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'WATERMELON GELATO' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Cherry Cola",
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Spiced cherry-syrup cola profile", "Sweet fruity cherry over herbal, spicy dank", "Fresh spicy-berry accents", "Giggly, happy lift into a mellow sleepy finish"],
    curatorNote:
      "Cherry Cola pours exactly like its name, a spiced cherry-syrup cola in flower form. The nose is sweet and fruity, ripe cherries and fresh berry sitting over a spicy, herbal dank that gives it that fizzy soda-fountain character. The palate is much the same, sugary cherry drink with a peppery edge. The effect settles in a few minutes after the exhale, a happy, giggly lightness that edges out the noise before a gentle physical relaxation eases you toward a mellow, sleepy finish. A nighttime indica for unwinding with a smile rather than a thud.",
    curatorQuote:
      "Fizzy cherry, soft landing.",
    tagline: "Spiced cherry pour",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a sweet, spiced cherry-cola nighttime indica named Cherry Cola, intended as premium editorial poster art. The scene: a tall frosted glass of dark cherry cola fizzing over crushed ice, a glossy cherry bobbing on top, ribbons of caramel-dark soda and rising bubbles caught mid-fizz against a moody bar-top. Palette of deep cherry red and cola brown against warm amber and near-black, with bright ruby highlights on the cherry. Light is dim, warm late-night glow, a single soft lamp catching the fizz and the cherry while shadow swallows the edges, lazy rising bubbles giving a slow, mellow motion toward the sleepy finish. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'CHERRY COLA' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Strawberry Guava",
    lineage: {
      parents: ["Strawberry Banana", "Papaya"],
      cross: "Strawberry Banana × Papaya",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Loud strawberry-jam nose over ripe guava nectar", "Tropical custard note of papaya and banana cream", "Limonene-dominant with a crisp citrus sparkle", "Happy, relaxed body with euphoric creative buzz"],
    curatorNote:
      "Strawberry Banana crossed with Papaya makes Strawberry Guava one of the loudest noses on the shelf: a burst of strawberry jam layered over ripe guava nectar, candy-sweet like berry taffy, with a tropical custard whisper of papaya and banana cream underneath. Limonene runs the show, lending a crisp citrus sparkle that lifts the whole tropical tangle. The palate carries that berry-and-guava sweetness straight through. The effect is a happy, relaxed body high paired with a euphoric, creative cerebral buzz, easy enough for a daytime session whether you are making something or just enjoying the ride.",
    curatorQuote:
      "Loud fruit, easy company.",
    tagline: "Loud tropical jam",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a loud, limonene-bright tropical hybrid named Strawberry Guava, intended as premium editorial poster art. The scene: a halved guava glowing pink at its core nestled against ripe strawberries, a drizzle of strawberry jam ribboning across them with a slice of papaya and a citrus twist catching the light. Palette of hot strawberry red and guava coral-pink against tropical papaya orange and a crisp citrus-yellow sparkle, with creamy off-white accents. Light is vivid, sun-drenched daytime, saturated and lively with juicy highlights, a bright splash of jam mid-pour giving energetic motion that mirrors the happy creative buzz. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'STRAWBERRY GUAVA' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Banana Runtz",
    lineage: {
      parents: ["Banana OG", "Runtz"],
      cross: "Banana OG × Runtz",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Overripe banana-candy nose, almost artificial", "Creamy, doughy Runtz sweetness with a tart-gas finish", "Notes of tobacco and tree fruit underneath", "Uplifting, euphoric lift with relaxed body ease"],
    curatorNote:
      "Banana OG bred into Runtz gives Banana Runtz a nose that is unmistakable and a little ridiculous in the best way: overripe banana so sweet it reads almost artificial, like banana candy, riding on the creamy, doughy sweetness Runtz is famous for. The smoke is smooth and tropical with a distinct tart-gas finish and faint tobacco and tree-fruit shadows. The effect leans bright, an uplifting, euphoric mental energy with body tingles, balanced by enough relaxation to free up the shoulders without dragging you down. A daytime candy strain for keeping the mood light and the motivation flowing.",
    curatorQuote:
      "Banana candy, cranked to exotic.",
    tagline: "Pure banana candy",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for a candy-sweet, uplifting exotic hybrid named Banana Runtz, intended as premium editorial poster art. The scene: a glossy spill of bright banana-yellow hard candies and a single peeled ripe banana, glittering sugar crystals scattered around them, a swirl of creamy ribbon weaving through the pile. Palette playful and exotic, vivid banana yellow against candy pastels and creamy white, with a faint tropical-gold sparkle. Light is bright, social and cheerful daytime glow, glossy candy-shell highlights everywhere, a lively tumbling motion of candies that mirrors the uplifting euphoric lift. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'BANANA RUNTZ' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Blue Sherbert",
    lineage: {
      parents: ["Blue Cookies", "Sunset Sherbet"],
      cross: "Blue Cookies × Sunset Sherbet",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Sweet blueberry and citrus over creamy vanilla", "Dessert-like berry sweetness with a pine-earth base", "Creamy Sunset Sherbet smoothness on the palate", "Uplifting, euphoric and creative before relaxation"],
    curatorNote:
      "The Plug Genetics' Blue Sherbert marries Blue Cookies with Sunset Sherbet, and the result is dessert with a berry heart. The nose is sweet and fruity, blueberry and citrus folded into creamy vanilla, with a quiet pine-and-earth backbone that gives it structure. The palate is smooth and creamy, berries and vanilla all the way through. The effect is bright and cerebral first, uplifting and euphoric with a creative, conversational energy that lifts the mood, before it eases gradually into a relaxed body. A versatile daytime hybrid that flatters both the working hours and the social ones.",
    curatorQuote:
      "Berries and cream with a clear head.",
    tagline: "Berry cream lift",
    artPrompt:
      "Vertical 3:4 poster artwork (768x1024) for an uplifting, berry-cream gelato hybrid named Blue Sherbert, intended as premium editorial poster art. The scene: a swirling scoop of pale violet-blue sherbet melting at the edges, studded with glistening blueberries and a curl of citrus zest, soft drips of vanilla cream pooling beneath it. Palette of cool blueberry blue and soft lavender against creamy vanilla white and a thread of pine-green and citrus-yellow. Light is bright, clear daytime studio glow, fresh and airy with gentle highlights on the cream, a slow elegant melt and lift of zest suggesting the uplifting creative buzz. Cinematic, painterly, high-contrast, premium editorial poster. The strain name 'BLUE SHERBERT' baked subtly into the scene. Keep the lower third calmer and darker for legible overlay text. No people, logos or watermarks, no cannabis leaves, buds or packaging.",
    artStatus: "prompt",
    sourceConfidence: "high",
  },
  {
    canonicalName: "True OG",
    marketNames: ["The True OG"],
    breeder: "Elemental Seeds",
    lineage: {
      parents: ["OG Kush"],
      cross: "OG Kush self-cross (select phenotype)",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Select OG Kush cut isolated for heavy resin and pure fuel-pine profile.", "Multiple Cannabis Cup wins since 2010, including Best Indica honors."],
    curatorNote:
      "This is OG distilled to its truest self, with none of the modern sweetening that softened so many of its descendants. Crack a jar and the fuel hits first, raw and gassy, before pine and a cool citrus edge settle in over damp earth. The smoke is dense and resinous, leaning heavy and physical, the kind of slow descent into the couch that earned its Cup hardware. It is unapologetically old-school, a benchmark indica for those who want the lineage spoken plainly rather than dressed up.",
    curatorQuote:
      "OG with the volume turned all the way up and nothing else added.",
    tagline: "Pure Fuel Lineage",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Golden GMO",
    marketNames: ["Golden Garlic Cookies"],
    lineage: {
      parents: ["GMO"],
      cross: "GMO (Garlic Cookies) selection; specific Golden cross not documented",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Documented as a GMO-family selection; sparse standalone records, so profile follows the GMO consensus.", "Savory garlic-diesel funk over frosty, dense indica structure."],
    curatorNote:
      "A GMO at heart, which means the nose announces itself before the jar is fully open: savory garlic and aged cheese riding on a thick diesel undertone, with skunky earth filling the room. The smoke is heavy and unmistakably funky, the kind of savory pungency that splits a room into devotees and the bewildered. Expect a slow, weighty settling into the body that leans sedative and hungry as it deepens. Documentation on this particular selection is thin, so treat the precise pedigree as best-guess while the savory GMO signature itself is reliable.",
    curatorQuote:
      "Garlic-funk royalty wearing the family crest.",
    tagline: "Savory Garlic Funk",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Garlic Budder",
    marketNames: ["Garlic Butter"],
    breeder: "Humboldt Seed Co.",
    lineage: {
      parents: ["GMO", "Fortune Cookies"],
      cross: "GMO x Fortune Cookies",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Selected in a 2019 Humboldt Seed Co. pheno hunt.", "Indica-leaning genetics that paradoxically reads more uplifting and clear-headed than its pedigree suggests."],
    curatorNote:
      "Garlic Budder takes the savory GMO funk and rounds it with something richer and more buttery, a blue-cheese-and-nut creaminess layered over the expected garlic-and-fuel base. Where its GMO parent sledgehammers, this one is more conversational: an uplifting, clear opening that keeps the head light and focused before any body weight arrives. The result is a funk-lover's daytime option, terpy and loud but more sociable than sedative. A genuinely well-built modern cross from a breeder that knows its Humboldt funk.",
    curatorQuote:
      "GMO's funk with the butter dish passed around.",
    tagline: "Buttery Garlic Funk",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Sherb-burger",
    marketNames: ["Sherburger", "Sherb Burger"],
    lineage: {
      parents: ["Sherbert", "Cheeseburger"],
      cross: "Sherbert x Cheeseburger (inferred from name; not formally documented)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["No dedicated database listing found; profile inferred from the Sherbert and Cheeseburger parents implied by the name.", "Reads as a creamy dessert cross with a savory cheese-and-fuel undertone from the burger side."],
    curatorNote:
      "Read this one as a marriage of two cookie-family lineages: the sweet, creamy vanilla-and-berry lift of Sherbert meeting the savory, cheesy fuel of a Cheeseburger cut. The result leans dessert-forward, smooth and sugary up top, with a funkier nutty-cheese tail that keeps it from being one-note. Effects track that balance, an easy euphoric happiness easing toward relaxation without flattening you. Be warned that this strain is barely documented as a distinct cultivar, so the pedigree here is inferred from the name and the profile is a best-consensus read rather than a verified record.",
    curatorQuote:
      "Dessert up front, savory funk on the finish.",
    tagline: "Creamy Funky Dessert",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Half Moonana",
    marketNames: ["Half Moonana"],
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Banana-forward, creamy dessert nose with a soft berry backnote.", "Pedigree (Half Moon Bay Gelato x Strawberry Banana) is inferred from a single dispensary listing, not breeder-confirmed."],
    curatorNote:
      "Half Moonana is a banana-and-cream dessert hybrid most visible through the Find brand and a handful of East Coast dispensary menus, where batches have tested in the high 20s for THC. The widely repeated lineage of Half Moon Bay Gelato crossed with Strawberry Banana traces to a single retail listing rather than any breeder documentation, so treat it as plausible-but-unverified. What is consistent across sources is the sensory read: tropical banana, sweet cream, light berry, and a frosty, terpy bag appeal. I am confident on the profile, cautious on the pedigree.",
    curatorQuote:
      "Banana split in a jar, with the lights dimmed.",
    tagline: "Creamy banana dessert",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Tourist Trap",
    marketNames: ["Tourist Trap"],
    breeder: "Find",
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Bright citrus-berry rose nose over light earth and herbal spice.", "Marketed by Find; some menus label it sativa, but body character reads as a Gelato/rose-leaning hybrid."],
    curatorNote:
      "Tourist Trap is a Find-brand exotic that surfaced in New York's competitive market with no public breeding credit. Lab batches commonly land 22 to 26 percent THC, occasionally higher. There is no documented lineage; grower consensus suspects a Pink Rozay or rose-leaning Gelato-family input based on the chilled-champagne-and-wild-berry top note, so I have not asserted parents. Classification is contested, sativa on some menus but a euphoric hybrid in practice. The citrus-berry-rose profile is the consistent thread.",
    curatorQuote:
      "Sweet rose and citrus that lures you in, then keeps you.",
    tagline: "Citrus berry rose",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Zowah",
    marketNames: ["Zowahh", "Zowahh 2.0"],
    breeder: "Karma Genetics",
    lineage: {
      parents: ["Zkittlez", "Karma Sour D BX"],
      cross: "Zkittlez x Karma Sour D BX",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Sour-diesel fuel layered over candy-sweet Zkittlez fruit.", "Zowahh 2.0 uses an improved Original Z BX2 mother over the same Karma Sour D BX father."],
    curatorNote:
      "Zowahh is a well-documented Karma Genetics release (launched in regular seed form around 2020) pairing Zkittlez with Karma's Sour Diesel BX. It is the rare modern exotic with a clear breeder paper trail, and SeedFinder, Leafly, and Karma's own shop agree on the cross. Expect loud sour-fuel gas marrying sweet candied fruit, leaning indica-ish in growth with potent, body-forward effects. The 2.0 swaps in a refined Z mother. Strong sourcing here, hence higher confidence than most of this set.",
    curatorQuote:
      "Sour diesel dipped in candy.",
    tagline: "Sour candy gas",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Astro GMO",
    marketNames: ["Astro GMO"],
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savory garlic-onion-sulfur funk with Chem-derived fuel and rubber underneath.", "GMO (Garlic Cookies = GSC x Chemdawg) is the documented backbone; the 'Astro' parent/cut is not breeder-confirmed, so the full cross is inferred."],
    curatorNote:
      "Astro GMO is a gas-forward, GMO-Cookies-driven exotic prized for heavy resin and a deeply savory, garlic-and-fuel nose. The GMO heritage (GSC x Chemdawg via Garlic Cookies) is well established, but what 'Astro' contributes is not documented across the sources I found, so I have not listed a full cross. Effects read as a slow creeper into spaced-out euphoria and muscular, couch-locking body weight, classic late-afternoon-into-evening material. Profile is solid; the precise pedigree is the soft spot.",
    curatorQuote:
      "Garlic, fuel, and a one-way ticket to the couch.",
    tagline: "Savory gas funk",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Atomic Breath",
    marketNames: ["Atomic Breath"],
    breeder: "Grassroots",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Fuel and earth up front with doughy, nutty 'Breath'-family sweetness behind.", "Multiple cuts exist: vendors variously cite Motorbreath (Chem D x SFV OG) or a Mendo/Peanut Butter Breath parent, so parentage is region-dependent and not asserted here."],
    curatorNote:
      "Atomic Breath is commonly seen as a Grassroots production and exists as more than one cut, which is exactly why I have left the lineage open. Some regions justify the fuel and resin density with a Motorbreath influence; others point to a Mendo Breath or Peanut Butter Breath parent to explain the nutty, doughy sweetness. Both stories are credible and neither is firmly documented. What is reliable is the read: pungent fuel-and-earth on the nose, nutty Breath sweetness underneath, a fast euphoric onset settling into calm body weight.",
    curatorQuote:
      "Fuel on the inhale, peanut-butter calm on the comedown.",
    tagline: "Fuel meets dough",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Novarine",
    marketNames: ["Novarine", "Novarine THCV"],
    breeder: "Elite Seeds",
    lineage: {
      parents: ["Caprichosa Thai", "Thai THCV landrace"],
      cross: "Caprichosa Thai x Thai THCV landrace",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["THCV-rich with a near 1:1 THC:THCV ratio; clear-headed, appetite-suppressing daytime effect.", "Orange-citrus and chestnut-nutty notes over earthy, woody spice from a terpinolene-leaning profile."],
    curatorNote:
      "Novarine is an Elite Seeds sativa-dominant cultivar built specifically for high THCV, with a documented Caprichosa Thai by Thai-landrace cross on SeedFinder. The standout is the cannabinoid profile: a near-balanced THC to THCV ratio that drives a clear, energetic, focused head experience and notably curbs appetite rather than triggering it, making it a genuine daytime productivity strain. Expect citrus-orange and chestnut-nutty flavors over earthy, woody spice. Higher doses can edge toward anxiety in sensitive users. Well-sourced for a niche release.",
    curatorQuote:
      "Clear, sharp, and zero snack attack.",
    tagline: "THCV daytime focus",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Jungle Gemz",
    marketNames: ["Jungle Gemz"],
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Mango and citrus-zest nose with creamy sweetness over a soft earthy-herbal finish.", "Despite the name, not a confirmed Jungle Boys release; appears to be a curated, producer-specific product with no documented lineage."],
    curatorNote:
      "Jungle Gemz is best understood as a marketed product name rather than a fixed, breeder-defined cultivar. Despite the Jungle Boys-adjacent naming, sources find no official Jungle Boys release, and different producers (seen via Leal and others) sell it under their own banners with no documented genetics. I am not asserting any lineage or Jungle Boys connection. The consistent description is a balanced, uplifting tropical hybrid: mango, citrus zest, creamy sweetness, gentle body relaxation suitable day or night. Treat the name as branding, the profile as the reliable part.",
    curatorQuote:
      "A handful of tropical gems, name first, genetics unknown.",
    tagline: "Tropical citrus cream",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Stank Breath",
    marketNames: ["Stank Breath"],
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Pungent garlic-savory funk with skunky, earthy gas; aptly named.", "Most-cited lineage is GMO x a Mendo Breath descendant (OGKB influence), but an alternate Sharksbreath x OG Kush story circulates; clone-only with no single-breeder attribution."],
    curatorNote:
      "Stank Breath is a clone-only, indica-dominant funk bomb that has passed through several hands, so its lineage is genuinely contested. The most repeated cross is GMO (Garlic Cookies) with a Mendo Breath descendant carrying OGKB traits, while other sources push a Sharksbreath by OG Kush origin. Without single-breeder attribution I have left the cross out of the structured fields and flagged both stories. What everyone agrees on: savory garlic-skunk gas, roughly 22 to 24 percent THC, and a heavy, numbing, couch-locking body high that drifts toward sleep. Buy it for the funk and the body weight.",
    curatorQuote:
      "Earns the name on the open, earns the couch by the finish.",
    tagline: "Garlic skunk funk",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Agent Z",
    marketNames: ["Agent-Z"],
    breeder: "unknown",
    lineage: {
      parents: ["Agent X", "Orange Z"],
      cross: "Agent X x Orange Z",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Lime-green and deep purple foliage with orange hairs and milky calyxes.", "Daytime-leaning despite candy-fruit nose."],
    curatorNote:
      "Agent Z reads as a citrus-candy daytime exotic, documented by Leafly as Agent X x Orange Z with above-average THC and an energizing, creative tilt. The Orange Z parent anchors the bright citrus-candy nose. Reasonably sourced for an obscure cut, but terpene and effect data come from limited samples, so treat the energetic profile as consensus rather than gospel.",
    curatorQuote:
      "Citrus-candy clarity for a working afternoon.",
    tagline: "Bright candy daytime",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Bomboloni",
    marketNames: ["Bomboloni Doughnut"],
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Named for the Italian filled doughnut; dense resinous buds with pastry-sweet nose.", "Lineage varies by label; one circulated cut is Notorious T.H.C. x Jelly Breath (inferred, not confirmed)."],
    curatorNote:
      "Bomboloni is a dessert-leaning indica named after the Italian cream-filled doughnut, and that is exactly what the nose promises: sweet, creamy pastry with soft fruit. Multiple labels carry the name with differing pedigrees, so I have not asserted fixed parents; the most-cited path is Notorious T.H.C. x Jelly Breath but that is unverified. Sensory consensus (sweet-creamy, relaxing) is solid; lineage is not, hence low confidence.",
    curatorQuote:
      "A cream-filled nightcap in flower form.",
    tagline: "Sweet pastry indica",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Modified Goat",
    marketNames: ["Mod Goat"],
    lineage: {
      parents: ["GMO", "Golden Goat"],
      cross: "GMO x Golden Goat",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["GMO garlic-gas funk collides with Golden Goat citrus energy; loud, dough-and-diesel nose.", "Trichome-heavy buds; high THC (reported 25-28%)."],
    curatorNote:
      "Modified Goat marries GMO's savory garlic-gas funk to Golden Goat's bright citrus lift, and the result is a loud, high-THC hybrid that opens cerebral before settling into body calm. Per the garlic mapping I have routed the GMO funk to gassy/cheese/earthy. Lineage is consistently reported but the breeder of record is unclear and THC figures come from marketing copy, so I keep this at medium.",
    curatorQuote:
      "Garlic gas with a citrus afterburner.",
    tagline: "Funky citrus gas",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Secret Stash",
    marketNames: ["Secret Stash OG"],
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Lemon-lime and pepper over a flowery diesel base; caryophyllene-forward.", "Multiple lineages circulate; Archive Seed Bank lists White Fire x Face Off BX2 (not universally confirmed)."],
    curatorNote:
      "Secret Stash is a lift-then-sink hybrid: buzzy citrus euphoria up front, couch-bound calm on the back end. Sources cluster it around Chem/OG and Cookies heritage, with Archive Seed Bank's White Fire x Face Off BX2 the most concrete claim, but the name is used loosely across markets so I leave parents out of the structured fields. Sensory profile (lemon-lime, pepper, diesel) is well attested; lineage is muddy.",
    curatorQuote:
      "Lemon-pepper diesel that drops you gently.",
    tagline: "Citrus diesel unwind",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Slapz",
    marketNames: ["Slappz"],
    breeder: "Exotic Genetix",
    lineage: {
      parents: ["Runtz", "Grease Monkey"],
      cross: "Runtz x Grease Monkey",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Face-smacking skunk-diesel-pine nose over candy sweetness from the Runtz side.", "High THC (reported 20-30%); fast, knockout body onset."],
    curatorNote:
      "Slapz is Exotic Genetix's Runtz x Grease Monkey, and it earns its name with a face-slap of skunk, diesel, and pine layered over Runtz candy. The high hits fast and euphoric before collapsing into heavy body sedation. Breeder and lineage are well documented here, and the loud gassy-candy profile is consistent across sources, so this one rates high.",
    curatorQuote:
      "A candy-coated slap of pure gas.",
    tagline: "Loud gassy knockout",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Guava Runtz",
    marketNames: ["Guava Runts"],
    breeder: "Cookies Fam",
    lineage: {
      parents: ["Guava", "Runtz"],
      cross: "Guava x Runtz",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Tropical-fruit candy over a light diesel funk; talkative, giggly lift.", "Guava is a Gelato phenotype; Runtz is Zkittlez x Gelato."],
    curatorNote:
      "Guava Runtz, from Cookies Fam, pairs the tropical Guava (a Gelato pheno) with candy-sweet Runtz for a fruity-gassy exotic that runs balanced: uplifting and giggly first, gently relaxing later. Lineage is well documented and the tropical-candy-diesel profile is consistent across Leafly and dispensary sources, so I rate it high.",
    curatorQuote:
      "Tropical candy with a giggle on top.",
    tagline: "Tropical candy lift",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Black Scotti",
    marketNames: ["Black Biscotti"],
    lineage: {
      parents: ["Biscotti", "Zhit"],
      cross: "Biscotti x Zhit",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy vanilla and almond inhale with peppery, piney exhale; grape undertone.", "Biscotti-line indica (~70% indica); dark, frosty buds."],
    curatorNote:
      "Black Scotti is a Biscotti-line indica (reported Biscotti x Zhit) that leads with creamy-nutty cookie sweetness and a grape edge, then settles into chill, content relaxation that can tip toward couch-lock. The Biscotti pedigree and the nutty-sweet-grape profile are reasonably documented on Leafly and dispensary pages, though the Zhit parent is less firmly sourced, so medium confidence.",
    curatorQuote:
      "Cookie cream with a grape shadow.",
    tagline: "Dark cookie indica",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cookie Burger",
    marketNames: ["Cookie Burgerz"],
    lineage: {
      parents: ["Girl Scout Cookies", "Johnny Burger"],
      cross: "Girl Scout Cookies x Johnny Burger",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Skunky, savory meat-like overtone with sour citrusy nutty cookies; pungent and dank.", "Indica-dominant (~70%); very high THC (reported 28-30%)."],
    curatorNote:
      "Cookie Burger crosses Girl Scout Cookies with Johnny Burger into a pungent, savory indica-dominant hybrid: skunky meat-and-funk over sour-citrus nutty cookies, with a heady-happy lift sliding into body calm. Lineage and the loud savory-cookie profile are documented on AllBud; THC figures are marketing-grade. Medium confidence.",
    curatorQuote:
      "Savory funk wrapped in citrus cookies.",
    tagline: "Savory cookie funk",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grape Scotti",
    marketNames: ["Grape Biscotti"],
    lineage: {
      parents: ["Biscotti", "Grape Pie"],
      cross: "Biscotti x Grape Pie",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Bakery-and-fuel base layered with grape-jam sweetness; dense resinous flowers.", "Biscotti-line indica; lineage varies (Biscotti x Grape Pie or Grape Ape)."],
    curatorNote:
      "Grape Scotti sits in the Biscotti family with a grape-forward twist, most often cited as Biscotti x Grape Pie (sometimes Grape Ape). It reads indica: grape-jam sweetness over a bakery-fuel base, drifting toward sleepy and hungry. The grape-cookie profile is consistent, but the exact grape parent is breeder-dependent, so I rate this medium and flag the variable cross.",
    curatorQuote:
      "Grape jam folded into warm cookies.",
    tagline: "Grape cookie indica",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Insane Pound Cake",
    marketNames: ["Insane Poundcake"],
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Buttery cake and vanilla frosting with zesty citrus and a faint herbal-gas finish.", "Traces to London Pound Cake neighborhood; one cited cut is Pound Cake x Kush Mints (inferred)."],
    curatorNote:
      "Insane Pound Cake is a pound-cake dessert hybrid in the London Pound Cake lineage, delivering buttery vanilla-cake sweetness with citrus zest and an easy slide from clear euphoria to body comfort. Breeder of record varies by market and the Pound Cake x Kush Mints cross is only one reported path, so I keep lineage out of the structured fields. Dessert profile is consistent; pedigree is not, hence low confidence.",
    curatorQuote:
      "A double slice of buttery calm.",
    tagline: "Buttery cake calm",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Mango Runtz",
    marketNames: ["Mango Runts"],
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Ripe mango pulp over candy sweetness with orange zest and a sherbet-cream finish.", "Multiple cuts exist; Mephisto's autoflower is (Creme de la Chem x Mango Smile) x White Runtz."],
    curatorNote:
      "Mango Runtz is a tropical Runtz-family exotic built on ripe mango and candy sweetness with a creamy sherbet finish, running creative and easy-going at lower doses and more body-forward higher up. Several distinct cuts share the name (Mephisto's autoflower has a documented pedigree; the dispensary photo-period cuts are looser), so I leave parents unstructured. Sensory consensus is strong; lineage depends on which cut you get, so medium.",
    curatorQuote:
      "Fresh-cut mango dipped in sherbet.",
    tagline: "Tropical mango candy",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Perm Li Hi",
    marketNames: ["Permanent Lee Hi", "Perm Lee"],
    breeder: "Stardust Cultivation",
    lineage: {
      parents: ["Permanent Marker", "Supreme Lee Hi"],
      cross: "Permanent Marker x Supreme Lee Hi",
    },
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["Fruit, licorice, and chemical funk with sherb-cream and inky gas echoing Permanent Marker.", "Indica-dominant; above-average THC; very frosty."],
    curatorNote:
      "Perm Li Hi (Permanent Lee Hi) is Stardust Cultivation's Permanent Marker x Supreme Lee Hi, a frosty, funk-forward indica that opens upbeat and euphoric before melting into body-forward calm. Expect Permanent Marker's signature inky-gas-and-cream funk with fruity, licorice-chemical edges. Breeder and lineage are documented on Leafly, though it is a newer cut with limited reviews, so medium confidence.",
    curatorQuote:
      "Marker funk with a fruity-gas core.",
    tagline: "Frosty funk indica",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry Maui Wowie",
    marketNames: ["Cherry Maui"],
    breeder: "Rythm",
    lineage: {
      parents: ["Cherry Pie", "Maui Wowie"],
      cross: "Cherry Pie x Maui Wowie",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Candy-cherry inhale with tropical pineapple and sweet-and-sour funk; conical bright-green buds.", "Energetic, social daytime tilt from the Maui line; up to ~28% THC."],
    curatorNote:
      "Cherry Maui Wowie, released by Rythm, crosses Cherry Pie with the Hawaiian Maui Wowie line, pairing candy-cherry sweetness with tropical pineapple energy. It leans upbeat, social, and creative with a grounded body relaxation underneath. Lineage and the cherry-tropical profile are well documented on Leafly and Rythm pages, so this rates high.",
    curatorQuote:
      "Cherry candy on a tropical breeze.",
    tagline: "Cherry tropical daytime",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Donut Trip",
    marketNames: ["Donut Trip"],
    breeder: "Rythm",
    lineage: {
      parents: ["FC4N x VCP-S2", "Donutz Triploid"],
      cross: "(FC4N x VCP-S2) x Donutz Triploid",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Sweet doughnut nose with vanilla and cinnamon; dessert-forward.", "Triploid-influenced Rythm cut; effect data limited."],
    curatorNote:
      "Donut Trip is a Rythm dessert hybrid with a sweet vanilla-and-cinnamon doughnut profile, built on a triploid Donutz cross ((FC4N x VCP-S2) x Donutz Triploid). The flavor is well described, but published effect data is thin, so the relaxed-happy read is partly inferred from the broader donut/dessert family. Lineage is documented by Rythm; reviews are sparse, so medium confidence.",
    curatorQuote:
      "Cinnamon-sugar doughnut in a jar.",
    tagline: "Cinnamon doughnut dessert",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "L'Orange",
    marketNames: ["L Orange", "LOrange"],
    breeder: "Cannabiotix",
    lineage: {
      parents: ["Orange Crush", "Lemonburst"],
      cross: "Orange Crush x Lemonburst",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Fresh-squeezed orange and tangerine zest with a clean citrus-oil, faintly menthol finish.", "Terpinolene/limonene-forward sativa; bright focused daytime high."],
    curatorNote:
      "L'Orange is Cannabiotix's citrus showcase, a sativa cross of Orange Crush and Lemonburst that smells like fresh-squeezed oranges and tangerine zest with a clean, faintly menthol finish. The high is bright, focused, and motivating. Breeder lineage and the citrus profile are well documented; THC figures vary widely by batch (15% to high-20s), so I anchor potency at strong and rate the entry high.",
    curatorQuote:
      "Fresh-squeezed focus in a glass.",
    tagline: "Zesty citrus sativa",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Taffy Twist",
    marketNames: ["Taffy Twist"],
    breeder: "Rythm",
    lineage: {
      parents: ["Lomelo 18", "Sour Animal Cherries"],
      cross: "Lomelo 18 x Sour Animal Cherries",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Sweet-and-sour, citrus-forward candy profile with a berry-cherry edge.", "Indica-leaning Rythm cut; dense frosty buds."],
    curatorNote:
      "Taffy Twist is an indica-leaning Rythm release that blends its parents' sweet-and-sour candy character, citrus-forward with a sour-cherry berry edge per the taffy mapping. It runs relaxed and happy. Leafly lists the cross as Lomelo 18 x Sour Animal Cherries, but reviews are limited and the obscure parents are hard to corroborate, so I rate this medium and lean on the candy sensory consensus.",
    curatorQuote:
      "Sour-sweet candy that winds you down.",
    tagline: "Sour candy indica",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Strawberry Slushie",
    marketNames: ["Strawberry Slush", "Strawberry Slushy"],
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Ripe strawberry and syrupy sweetness over a fuel-forward diesel base; frost-heavy buds.", "No single accepted pedigree; a family of strawberry x dessert/slushie crosses."],
    curatorNote:
      "Strawberry Slushie is best understood as a family of strawberry-anchored dessert crosses rather than one fixed strain: the berry side ranges across Strawberry Cough/Banana/Sherbet and the slushie side traces to Gushers/Gelato/Slurricane-type genetics. It reads upbeat, giggly, and creative with ripe strawberry over diesel. Sensory profile is consistent; lineage is genuinely unsettled, so I assign low confidence and assert no parents.",
    curatorQuote:
      "A frozen strawberry rush with a fuel kick.",
    tagline: "Strawberry candy slush",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pistachio",
    marketNames: ["Pistachio Ice Cream"],
    breeder: "Humboldt Seed Company",
    lineage: {
      parents: ["P-61", "Fortune Cookies"],
      cross: "P-61 x Fortune Cookies",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Creamy, gassy, nutty notes with vanilla ice cream and a hint of fruit; tall sparkling green buds.", "Slightly indica-dominant (~65%); THC reported 25-30%."],
    curatorNote:
      "Pistachio is Humboldt Seed Company's nutty dessert cut, a P-61 x Fortune Cookies selection from their 2019 pheno hunt that delivers creamy, gassy, nutty flavor with vanilla-ice-cream sweetness. Per the pistachio/nut mapping the lead flavor is nutty/creamy. Effects skew euphoric and focused-energizing despite the slight indica lean. Breeder and lineage are well documented, so this rates high.",
    curatorQuote:
      "Pistachio gelato with a gassy finish.",
    tagline: "Creamy nutty dessert",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Lemon Skrilla",
    marketNames: ["Lemon Skrilla"],
    breeder: "Angry Bears",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["House-brand (Angry Bears) — pedigree unverified", "Sun-grown; lemon-forward citrus nose with a soft earthy backbone"],
    curatorNote:
      "Lemon Skrilla is a sun-grown house product from Angry Bears rather than a documented genetic line, so we built this profile from the name and the brand's outdoor style. Expect a bright lemon-citrus lead over earthy, herbal sweetness — pleasant and approachable, but treat the lineage as unverified.",
    curatorQuote:
      "Sunshine in a citrus wrapper.",
    tagline: "Bright sun-grown lemon",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Cookie Dough",
    marketNames: ["Cookie Dough", "Cookie Dough OG"],
    breeder: "Flavour Chasers",
    lineage: {
      parents: ["GSC", "Do-Si-Dos"],
      cross: "GSC x Do-Si-Dos",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Cookies-family dessert hybrid bred by Flavour Chasers", "Sweet doughy nose with a cool minty edge; caryophyllene-dominant"],
    curatorNote:
      "A genuine Cookies-family cultivar from Flavour Chasers, Cookie Dough crosses GSC with Do-Si-Dos for a rich, doughy-sweet profile with vanilla and a cool minty lift. The high is the classic relaxed, euphoric Cookies sit-down. Well-documented genetics carried here by Herb.",
    curatorQuote:
      "Sweet enough to eat raw.",
    tagline: "Sweet Cookies dough",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Lemon Berry Kush",
    marketNames: ["Lemon Berry Kush", "Lemonberry Kush"],
    breeder: "Plug Pack",
    lineage: {
      parents: ["LemonBerry", "Kush"],
      cross: "LemonBerry x Kush",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Citrus-berry Kush cross; lineage loosely documented (LemonBerry x Kush line)", "Sold as infused pre-ground, so milled aroma reads sweeter and softer"],
    curatorNote:
      "Lemon Berry Kush leans on a recognizable citrus-and-berry Kush concept (the LemonBerry x Kush family), though Plug Pack's exact source isn't fully nailed down. Offered as an infused pre-ground, so expect a sweeter, softer milled nose with lemon and berry over an earthy Kush base.",
    curatorQuote:
      "Lemon and berry, ground and ready.",
    tagline: "Citrus-berry Kush",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Uptown Haze",
    marketNames: ["Uptown Haze", "NYC Piff", "Piff"],
    breeder: "Plug Pack",
    lineage: {
      parents: ["Northern Lights #5", "Haze"],
      cross: "Northern Lights #5 x Haze",
    },
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["NYC 'Piff' Haze lineage (NL5 x Haze family)", "Incense-like herbal/citrus nose; soaring sativa head-high"],
    curatorNote:
      "Uptown Haze is the legendary NYC 'Piff' — a Northern Lights #5 x Haze sativa famous in Harlem and Washington Heights for its church-incense, herbal-citrus nose and soaring, racy head-high. Documented as a Haze family line, here offered by Plug Pack as an infused pre-ground.",
    curatorQuote:
      "That uptown incense bag.",
    tagline: "NYC Piff Haze",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grape Nuts",
    marketNames: ["Grape Nuts"],
    breeder: "Hashtag Honey",
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["House-brand (Hashtag Honey) — pedigree unverified", "Grape-berry sweetness with a toasty nutty close; lineage listed as unknown across databases"],
    curatorNote:
      "Grape Nuts is a brand product from Hashtag Honey; despite appearing in a few databases, its lineage is consistently listed as unknown, so we treat it as unverified. The name and consensus notes point to a sweet grape-and-berry indica with a toasty, nutty finish and a relaxed, sleepy lean.",
    curatorQuote:
      "Grape jam with a toasty crust.",
    tagline: "Grape, sweet, nutty",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Garlic Bud",
    marketNames: ["Garlic Bud", "Garlic"],
    breeder: "Hudson Cannabis",
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Classic Sensi Seeds Afghani-derived garlic phenotype", "Savory garlic-funk over spicy hash earth; heavy indica body"],
    curatorNote:
      "Garlic Bud is a true classic — an Afghani-derived indica popularized by Sensi Seeds for its savory, garlic-funk pungency. Hudson Cannabis grows it sun-style here. Expect a gassy, cheesy, spicy-earth nose and a heavy, sedating body stone. Genetics are documented to Afghani hash-plant stock.",
    curatorQuote:
      "Savory funk you can taste.",
    tagline: "Savory garlic funk",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Lemon OG Haze",
    marketNames: ["Lemon OG Haze"],
    breeder: "Hudson Cannabis",
    lineage: {
      parents: ["Lemon OG", "Haze"],
      cross: "Lemon OG x Haze",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Documented Lemon OG x Haze line (Nirvana)", "Lemon-forward with Haze herbal lift and OG pine; balanced head-and-body"],
    curatorNote:
      "Lemon OG Haze is a documented cross of Lemon OG and Haze (released by Nirvana) that marries OG Kush's piney, body-kind backbone with bright lemon and an uplifting Haze head. Hudson Cannabis's sun-grown take should read citrus-forward and energizing. Solid, traceable genetics.",
    curatorQuote:
      "Lemon zest with a Haze kick.",
    tagline: "Lemon Haze lift",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hickory Hash",
    marketNames: ["Hickory Hash"],
    breeder: "Find",
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["House-brand (Find) — pedigree unverified", "Smoky, hickory-nutty earthiness over a hashy spice; consensus from name only"],
    curatorNote:
      "Hickory Hash is a Find brand product with no documented genetics, so this profile is built from the name and Find's funky, hash-leaning style. Expect a smoky, nutty, hickory-earth character with a hashy spice and a calm, weighty finish. Treat lineage as unverified.",
    curatorQuote:
      "Smoked nut and hash spice.",
    tagline: "Smoky nutty hash",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Muffin Grease",
    marketNames: ["Muffin Grease"],
    breeder: "Find",
    sensoryFamily: "funky-exotic",
    phenotypeNotes: ["House-brand (Find) — pedigree unverified", "Sweet baked-muffin nose wrapped in a greasy gas funk; name-driven consensus"],
    curatorNote:
      "Muffin Grease is a Find brand name without verified genetics, so we read it off the name and Find's gassy-dessert style. The concept is a sweet, doughy baked-muffin top over a greasy, gassy base — rich and dessert-forward with a relaxing payoff. Lineage unconfirmed.",
    curatorQuote:
      "Sweet muffin, greasy finish.",
    tagline: "Sweet greasy dessert",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Gas Lit",
    marketNames: ["Gas Lit"],
    breeder: "Find",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["House-brand (Find) — pedigree unverified", "Loud fuel-and-diesel funk with a piney OG edge; consensus from name only"],
    curatorNote:
      "Gas Lit is a Find brand product with no documented pedigree; the profile here follows the name and Find's gas-forward house style. Expect a loud, fuel-and-diesel funk with a piney, OG-leaning edge and a heavy, euphoric finish. Genetics unverified.",
    curatorQuote:
      "Loud fuel, lights out.",
    tagline: "Loud gas funk",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Sour Glue",
    marketNames: ["Sour Glue", "Sour GG4"],
    breeder: "Hudson Cannabis",
    lineage: {
      parents: ["Sour Diesel", "GG4"],
      cross: "Sour Diesel x GG4",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Documented Sour Diesel x GG4 (Original Glue) cross", "Sharp chemical diesel with sour citrus; resin-heavy and potent"],
    curatorNote:
      "Sour Glue is a documented cross of Sour Diesel and GG4 (Original Glue), combining razor-sharp diesel funk with the resin-soaked potency of Glue. Hudson Cannabis's version should hit with pungent fuel, sour citrus, and a heavy, gluey euphoria. Well-traced, high-potency genetics.",
    curatorQuote:
      "Sour fuel that sticks.",
    tagline: "Sour diesel glue",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Black Mamba",
    marketNames: ["Black Mamba", "Black Mamba #6"],
    breeder: "Untitled",
    lineage: {
      parents: ["Granddaddy Purple", "Black Domina"],
      cross: "Granddaddy Purple x Black Domina",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Widely cited as GDP x Black Domina; origin breeder unknown", "Grape-and-berry sweetness with floral earth; sedating indica body"],
    curatorNote:
      "Black Mamba (a.k.a. #6) is an indica widely cited as Granddaddy Purple x Black Domina, though the original breeder is unknown — hence a medium confidence. Expect a grape-and-berry, floral-earthy nose and a relaxing, sleepy body stone. Here grown under the Untitled label.",
    curatorQuote:
      "A grape-dark coil of calm.",
    tagline: "Grape indica sedation",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Baller Mints",
    marketNames: ["Baller Mints"],
    breeder: "Grocery",
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["House-brand (Grocery) — pedigree unverified", "Cool minty-cookie sweetness with a gassy edge; name-driven consensus"],
    curatorNote:
      "Baller Mints is a Grocery brand name without documented genetics (distinct from the unrelated 'Baller's Game' / 'Ballerz' lines), so we read it off the name and the Mints/dessert style it evokes. Expect cool mint over creamy-sweet cookie with a faint gas edge and a relaxed, euphoric lean. Lineage unverified.",
    curatorQuote:
      "Cool mint, sweet finish.",
    tagline: "Minty dessert exotic",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Slapaya",
    marketNames: ["Slapaya"],
    breeder: "Grocery",
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["House-brand (Grocery) — pedigree unverified", "Tropical papaya-sweet fruit over a light gas funk; name-driven consensus"],
    curatorNote:
      "Slapaya is a Grocery brand name that riffs on the 'Slapz' and papaya themes but isn't a documented genetic line, so this is a best-consensus read from the name. Expect a tropical, papaya-sweet fruitiness over a light gassy funk with a bright, giggly, euphoric lift. Treat lineage as unverified.",
    curatorQuote:
      "Tropical fruit with a slap.",
    tagline: "Tropical papaya punch",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Space Burger",
    marketNames: ["Space Burger"],
    breeder: "Grocery",
    lineage: {
      parents: ["Space Queen", "Donny Burger"],
      cross: "Space Queen x Donny Burger",
    },
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Loosely documented as Space Queen x Donny Burger", "Savory garlic-gas funk with a peppery, slightly sweet edge"],
    curatorNote:
      "Space Burger is offered by Grocery and is loosely documented as Space Queen x Donny Burger, putting it in the GMO-adjacent garlic-burger camp. Expect a savory, garlic-gas funk with peppery spice and a faint sweetness, plus a relaxing, munchie-friendly body. Genetics are community-cited, so medium confidence.",
    curatorQuote:
      "Garlic-gas burger from orbit.",
    tagline: "Savory garlic gas",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Animal Tsunami",
    marketNames: ["Animal Tsunami"],
    breeder: "Papa's Herb",
    lineage: {
      parents: ["Animal Cookies", "Caramel Tsunami"],
      cross: "Animal Cookies x Caramel Tsunami",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Documented as Animal Cookies x Caramel Tsunami", "Sweet caramel-cookie nose with gassy earth; heavy indica-dominant body"],
    curatorNote:
      "Animal Tsunami is an indica-dominant hybrid documented as Animal Cookies x Caramel Tsunami, pairing the dessert-leaning Animal/Cookies line with a sweeter, caramelized Tsunami parent. Papa's Herb's version should be sweet and creamy over gassy earth, with a heavy, sedating body. Strong, traceable genetics.",
    curatorQuote:
      "A sweet wave of couch.",
    tagline: "Sweet cookie tsunami",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Singapore Sling",
    marketNames: ["Singapore Sling"],
    breeder: "Papa's Herb",
    lineage: {
      parents: ["Creamsicle", "Tiki Cookies"],
      cross: "Creamsicle x Tiki Cookies",
    },
    sensoryFamily: "tropical-fruit",
    phenotypeNotes: ["Documented as Creamsicle x Tiki Cookies (Tiki Madman)", "Citrus-creamsicle and tropical fruit; bright, energetic sativa high"],
    curatorNote:
      "Singapore Sling is a documented Tiki Madman sativa, crossing Creamsicle with Tiki Cookies for a bright citrus-creamsicle and tropical-fruit profile. Papa's Herb's run should deliver an uplifting, energetic, creative high with high potency. Clear genetics and a refreshing daytime lean.",
    curatorQuote:
      "A tropical cocktail buzz.",
    tagline: "Tropical citrus sativa",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Baked Limez",
    marketNames: ["Baked Limez", "Baked Limes"],
    breeder: "Knack",
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["House-brand (Knack) — pedigree unverified", "Lime-candy citrus with a sweet doughy finish; official lineage listed 'coming soon'"],
    curatorNote:
      "Baked Limez is a Knack brand product whose lineage is officially 'coming soon' — i.e., undocumented — so we built this from the name and Knack's candy-citrus style. Expect a zesty lime candy nose with sweet, doughy depth and a calming, lightly uplifting effect. Treat genetics as unverified.",
    curatorQuote:
      "Lime candy, fresh-baked.",
    tagline: "Candy lime zest",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pinnacle",
    marketNames: ["Pinnacle"],
    breeder: "Rolling Green",
    lineage: {
      parents: ["Slurty3", "Gush Mints"],
      cross: "Slurty3 x Gush Mints",
    },
    sensoryFamily: "gelato-exotic",
    phenotypeNotes: ["Modern Purple City Genetics line: Slurty3 x Gush Mints", "Sweet gelato-mint with a gassy edge; frosty, high-potency indica lean"],
    curatorNote:
      "Pinnacle from Rolling Green is the modern Purple City Genetics cultivar — Slurty3 x Gush Mints — known for frosty, purple-tinged buds and high potency. Expect sweet gelato-and-mint with a gassy edge and a relaxing, euphoric body lean. Documented modern genetics (a separate legacy Blue Dream x Hindu Kush 'Pinnacle' also exists).",
    curatorQuote:
      "Frosty peak of gelato-mint.",
    tagline: "Frosty gelato mint",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Clockwork Orange",
    marketNames: ["Clockwork Orange", "Clockwork"],
    breeder: "Dank By Definition",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Clone-only original later released by Riot Seeds; exact lineage uncertain (G13/Black Widow theories)", "Orange-citrus forward with earthy spice; balanced euphoric high"],
    curatorNote:
      "Clockwork Orange is a recognized but genetically murky cultivar — a clone-only original later seeded by Riot Seeds, with disputed lineage (G13/Black Widow and Haze theories circulate, but nothing is confirmed). Carried here by Dank By Definition, it reads orange-citrus forward over earthy spice with a balanced, euphoric high. Medium confidence given the uncertain pedigree.",
    curatorQuote:
      "Citrus clockwork, well wound.",
    tagline: "Orange-citrus enigma",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Soap x Purple Punch",
    marketNames: ["Soap x Purple Punch"],
    breeder: "Grocery",
    lineage: {
      parents: ["The Soap", "Purple Punch"],
      cross: "The Soap x Purple Punch",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Cross of two documented parents: The Soap (Animal Mints x Kush Mints) and Purple Punch (Larry OG x GDP)", "Clean floral-soapy lift over grape-berry candy; relaxing body"],
    curatorNote:
      "This is a Grocery cross of two well-documented parents — The Soap (Animal Mints x Kush Mints, Seed Junky) and Purple Punch (Larry OG x Granddaddy Purple). The combination should pair Soap's clean, floral-minty lift with Purple Punch's grape-berry candy sweetness and a relaxing, euphoric body. Both parents are real, so medium confidence on the cross.",
    curatorQuote:
      "Clean floral meets grape candy.",
    tagline: "Soapy grape punch",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chiesel x Burnham Redeye",
    marketNames: ["Chiesel x Burnham Redeye"],
    breeder: "Black Pheasant Farm",
    lineage: {
      parents: ["Chiesel", "Burnham Redeye"],
      cross: "Chiesel x Burnham Redeye",
    },
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["Cross with one documented parent (Chiesel = Big Buddha Cheese x NYC Diesel) and one undocumented Maine clone-only parent (Burnham Redeye)", "Grapefruit-diesel meets skunky cheese funk; lively hybrid lift"],
    curatorNote:
      "This Black Pheasant Farm cross pairs Chiesel — a documented Big Buddha Cheese x NYC Diesel — with Burnham Redeye, a regional Maine clone-only line whose genetics are undocumented. Because one parent's pedigree can't be verified, confidence is low. Expect the Chiesel side to lead: skunky cheese funk with sharp grapefruit-diesel and a lively, uplifting hybrid effect.",
    curatorQuote:
      "Cheese and fuel, eyes wide.",
    tagline: "Cheesy diesel cross",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Pinyatti",
    marketNames: ["Pinata", "Pinata Candy", "Piñata Candy", "Pinyata"],
    breeder: "Compound Genetics",
    lineage: {
      parents: ["Birthday Cake", "Jet Fuel Gelato"],
      cross: "Birthday Cake x Jet Fuel Gelato",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Brand spelling of Piñata Candy", "Vanilla-cake sweetness over a gassy, sour-citrus candy backbone"],
    curatorNote:
      "Cheevo's 'Pinyatti' is a phonetic rebrand of Piñata Candy, the Compound Genetics cross of Birthday Cake and Jet Fuel Gelato. It lives up to the candy name: a sweet vanilla-cake overtone layered with sour-citrus and fruity candy notes, all riding on a funky, gassy chassis from the Jet Fuel side. The effect is the festive part of the package, a fast euphoric, giggly mood lift that settles into easygoing relaxation without locking you down, making it a sociable evening hybrid. Densely built and frosty, it reads as a true dessert-candy exotic rather than a sleeper.",
    curatorQuote:
      "Smash the piñata and out spills vanilla-cake candy on a bed of gas.",
    tagline: "Sweet candy gas",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Mint Snackz",
    marketNames: ["Mintz Snackz", "Snackz"],
    breeder: "Dying Breed Seeds",
    lineage: {
      parents: ["London Pound Cake", "Wedding Cake x Greasy Runtz"],
      cross: "London Pound Cake x (Wedding Cake x Greasy Runtz)",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Find. brand cut of the Snackz / Mintz Snackz line", "Minty dessert profile with chocolate-cream undertones"],
    curatorNote:
      "Find.'s Mint Snackz traces to the Snackz line from Dying Breed Seeds, a London Pound Cake crossed onto a Wedding Cake x Greasy Runtz mother. The signature here is a minty dessert: cool spearmint-cream up front giving way to sweet, doughy cake and a whisper of chocolate, all wrapped in a soft, earthy finish. Myrcene-forward and indica-leaning in feel, it lands as a mellow, happy relaxer rather than a knockout, keeping the mind light while easing the body. A polished, well-cured dessert hybrid for unwinding.",
    curatorQuote:
      "Cool mint folded into warm cake batter.",
    tagline: "Minty dessert calm",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Bubba Mints",
    marketNames: ["Bubba Kush Mints"],
    breeder: "Grocery",
    lineage: {
      parents: ["Bubba Kush", "Animal Mints"],
      cross: "Bubba Kush x Animal Mints",
    },
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Bubba Kush backbone with a Mints-family mint top note", "Cocoa-coffee earthiness lifted by cool menthol"],
    curatorNote:
      "Grocery's Bubba Mints pairs a Bubba Kush backbone with the trendy Mints family, most commonly reported as Bubba Kush crossed with Animal Mints. The result reads classic-kush at its core, warm roasted-coffee and cocoa-nib earthiness over sweet soil, with a distinctly cool, peppermint-menthol lift on top. Effects stay true to Bubba: a deeply relaxing, couch-friendly indica that eases into sleepy, body-heavy calm, with the mint giving it a crisp, refined finish. Dense and smooth, it is a comforting end-of-day indica with a modern minty twist.",
    curatorQuote:
      "Old-school kush comfort with an icy mint exhale.",
    tagline: "Minty kush comfort",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grape Cake",
    marketNames: ["Grape Cake Head"],
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Grape Stomper", "Cherry Pie", "Wedding Cake"],
      cross: "Grape Stomper x Cherry Pie x Wedding Cake F4",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Seed Junky cross with grape-forward sweetness and gassy cake undertones", "Indica-leaning hybrid"],
    curatorNote:
      "LEAL's Grape Cake is the Seed Junky Genetics cross of Grape Stomper, Cherry Pie, and Wedding Cake. It is grape-forward and unmistakable: juicy purple-grape and dark berry up front, sweetened by Wedding Cake's bakery richness and grounded by a gassy, earthy undertone. The high is the relaxed, happy euphoria you expect from this dessert-and-fruit lineage, an indica-leaning lift that mellows into calm, eventually sleepy comfort. Dense, frosty, and terpy, it is a flavor-chaser's grape exotic with real backbone.",
    curatorQuote:
      "Grape soda poured over warm cake and a splash of fuel.",
    tagline: "Grape dessert gas",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cookie Stash",
    marketNames: ["Cookie Stash CST", "CST"],
    breeder: "Ethos Genetics",
    lineage: {
      parents: ["Grandpa's Stash", "Ethos Cookies"],
      cross: "Grandpa's Stash x Ethos Cookies",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["LivWell flower cut of Cookie Stash", "Incense and sweet-pine nose with citric flavor and skunk undertones"],
    curatorNote:
      "LivWell's Cookie Stash (CST) is documented as a sativa-dominant cross of Grandpa's Stash and Ethos Cookies. It runs against the dessert-cookie grain you might expect from the name, leading instead with incense and sweet pine, citric flavors, and a skunky undertone, a complex, classic-cannabis bouquet. The effect leans upbeat and clear: an uplifting, euphoric head lift that keeps you light and focused with just enough body ease to round it off. Loud-smelling and terpy, it is a daytime sativa for energy and mood rather than sedation.",
    curatorQuote:
      "Sweet pine and incense with a bright citrus snap.",
    tagline: "Bright pine sativa",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Strawberry OG Cookies",
    marketNames: ["Strawberry Cookies", "Strawberry OG Cookies"],
    breeder: "Connoisseur Genetics",
    lineage: {
      parents: ["Animal Cookies", "Strawberry Fields"],
      cross: "Animal Cookies x Strawberry Fields",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Leafly-documented alias of Strawberry Cookies", "Sweet strawberry-berry over a doughy cookie base"],
    curatorNote:
      "LivWell's Strawberry OG Cookies is a documented alias of Strawberry Cookies, the Connoisseur Genetics cross of Animal Cookies and Strawberry Fields. It delivers a bright, sweet strawberry-berry nose over a doughy, earthy cookie base, with a faint herbal-spice edge from the Cookies side. Leaning sativa in its effect, it brings an euphoric, uplifted mood and a creative head lift before easing toward gentle relaxation. Frosty, dense, and terpy, it is a flavorful, balanced hybrid that pairs dessert sweetness with real berry character.",
    curatorQuote:
      "Fresh strawberries crumbled over warm cookie dough.",
    tagline: "Sweet berry cookies",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Blue Lobster",
    breeder: "Cipher Genetics",
    lineage: {
      parents: ["Apples and Bananas", "Eye Candy"],
      cross: "Apples and Bananas × Eye Candy",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Pheno hunted by the Maine Trees team from a Cipher Genetics cross", "Tests 26-30% THC"],
    curatorNote:
      "Blue Lobster pours out blueberry-candy sweetness wrapped in a soft layer of gas, frosty and dense in the jar. The first pull lifts the mood fast before a calming wave rolls through the body without dragging you under. A dessert-leaning indica for unwinding while still feeling pleasantly clear.",
    tagline: "Blueberry candy with a gas kick",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Orange Z",
    marketNames: ["Orange Zkittlez", "Orange ZKZ"],
    breeder: "3rd Gen Family",
    lineage: {
      parents: ["Agent Orange", "Zkittlez"],
      cross: "Agent Orange × Zkittlez",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Limonene-dominant, reported up to ~2.5%", "Released by Grassroots as Orange Z / Orange ZKZ"],
    curatorNote:
      "Orange Z is a burst of fresh tangerine and orange-candy sweetness, loud in the nose and clean on the exhale. The high runs cheerful and clear-headed, sparking conversation and creativity with just enough body ease to stay relaxed. A bright, citrus-forward exotic for daytime smiles.",
    tagline: "Fresh orange candy, clear-headed lift",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Thai Sunrise",
    breeder: "Find.",
    lineage: {
      parents: ["Chem 4 OG", "The White", "Mandarin Cookies", "Cambodian Thai"],
      cross: "(Chem 4 OG × The White) × Mandarin Cookies × Cambodian Thai",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Released by the Find. brand", "Carries Cambodian Thai landrace genetics for a soaring sativa lift"],
    curatorNote:
      "Thai Sunrise opens on bright citrus zest threaded with herbal baking spice, a nod to its Cambodian Thai landrace roots. The effect is soaring and energetic, clear and motivated, built for creative mornings and busy daytime hours. A spicy-citrus sativa that lives up to its name.",
    tagline: "Bright citrus, soaring Thai energy",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Grapple Pie",
    breeder: "Compound Genetics",
    lineage: {
      parents: ["Apple Fritter", "Grape Gasoline"],
      cross: "Apple Fritter × Grape Gasoline",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Bred by Compound Genetics", "Deep purple buds with orange hairs and heavy frost"],
    curatorNote:
      "Grapple Pie marries grape-soda sweetness with baked-apple and vanilla-custard richness, all riding a faint thread of gas. The deep-purple, frost-caked buds deliver a soothing, happy calm that settles into the body as a nightcap. A dessert-leaning indica for easing into the evening.",
    tagline: "Grape soda meets baked apple pie",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Sapphire Haze",
    breeder: "The Plug Pack",
    sensoryFamily: "sweet-haze",
    phenotypeNotes: ["House-brand (The Plug Pack) — pedigree unverified"],
    curatorNote:
      "A vivid, jewel-toned outdoor hybrid that leads with candied berry sweetness over a gentle herbal-earth base. The lift is bright and sociable, all uplifted euphoria with a creative edge rather than heaviness. Smooth enough for daytime sipping.",
    tagline: "Bright berries, breezy lift",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Miami Heat",
    breeder: "Exotic Genetix",
    lineage: {
      parents: ["Miami Haze", "Triple OG"],
      cross: "Miami Haze × Triple OG",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["70/30 sativa-leaning hybrid", "Tests 28%+ THC"],
    curatorNote:
      "A 70/30 sativa-leaning hybrid from Exotic Genetix that hits like a fast break — a rush of uplifting, energetic euphoria that tips into sharp creative focus. Lemon and herb dominate the nose, framed by Triple OG's sweet earthiness. A connoisseur's daytime sprinter.",
    tagline: "Fast-break citrus energy",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Black Panther",
    marketNames: ["Black Panther OG"],
    breeder: "Angry Bears",
    sensoryFamily: "pine-spice",
    phenotypeNotes: ["House-brand (Angry Bears) — pedigree unverified"],
    curatorNote:
      "A sativa-leaning hybrid that pairs sweet-sour fruit with crisp pine and a flash of black-pepper spice. The high runs energetic and heady — uplifted, euphoric, and mood-brightening — with just enough body softness to keep it comfortable. A lively, daytime-forward smoke.",
    tagline: "Fruity pine, prowling energy",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Gorilla Zkittlez",
    marketNames: ["Gorilla Skittlez"],
    breeder: "Barney's Farm",
    lineage: {
      parents: ["Gorilla Glue #4", "Zkittlez"],
      cross: "Gorilla Glue #4 × Zkittlez",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["60/40 indica-dominant hybrid"],
    curatorNote:
      "Barney's Farm's heavy hitter marries Original Glue's resin and gas to Zkittlez's candy-sweet fruit, an indica-leaning 60/40 hybrid. It opens cerebral and uplifting, then melts into intense physical sedation — a true nighttime strain. Expect frosty, sticky buds and a terpene burst of mango, pineapple and tangerine laced with pine and spice.",
    tagline: "Candy fruit, couch gravity",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Angie",
    breeder: "LivWell",
    lineage: {
      parents: ["Red Headed Stranger", "Ginger Ale"],
      cross: "Red Headed Stranger × Ginger Ale",
    },
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Terpinolene-dominant, followed by limonene and beta-caryophyllene"],
    curatorNote:
      "A terpinolene-forward sativa that opens with sparkling citrus and a gingery pepper bite. The high is clean and lifting, energizing the mind without the heavy edge, finishing on a faint herbal warmth. One for daytime creativity and conversation.",
    tagline: "Citrus zest with a peppery kick",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chronic Tonic",
    breeder: "Leal",
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["House-brand (Leal) — pedigree unverified", "Certified-organic flower; often tests 26-30% THC"],
    curatorNote:
      "A sativa-leaning hybrid that pours on bright citrus and garden-fresh herbs with a clean piney finish. The effect is energized but composed, lifting mood and sharpening focus while a gentle body ease keeps it grounded. A refreshing, high-potency daytime pour.",
    tagline: "Bright citrus, clean herbal lift",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Dulce de Uva",
    marketNames: ["Grape Candy"],
    breeder: "Bloom Seed Co",
    lineage: {
      parents: ["Grape Pie", "OG Kush"],
      cross: "Grape Pie × OG Kush",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Limonene-forward with myrcene and caryophyllene support", "~21-24% THC"],
    curatorNote:
      "Spanish for grape candy, this indica-dominant cross delivers exactly that: jammy purple grape and sugary sweetness wrapped in creamy vanilla. The body settles into a warm, giggly calm while the mind stays light and content. A dessert-leaning evening unwind with genuine grape character.",
    tagline: "Sweet grape candy in a jar",
    artStatus: "none",
    sourceConfidence: "high",
  },
  {
    canonicalName: "LA Purple Popz",
    marketNames: ["LA Purple Push Pop"],
    lineage: {
      parents: ["LA Pop Rocks", "Purple Pop"],
      cross: "LA Pop Rocks × Purple Pop",
    },
    sensoryFamily: "candy-exotic",
    phenotypeNotes: ["Deep purple-and-green coloring with heavy trichome frost"],
    curatorNote:
      "A purple candy bomb that opens with grape soda and hard-candy berry before melting into a creamy vanilla finish. Cerebral euphoria leads, then eases into a calm, stress-free body glow without heavy sedation. A crowd-pleasing dessert indica for sweet-tooth sippers.",
    tagline: "Grape candy in purple bloom",
    artStatus: "none",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chopped Cheese",
    breeder: "The Plug Pack",
    sensoryFamily: "skunk-funk",
    phenotypeNotes: ["House-brand (The Plug Pack) — pedigree unverified", "Named for the NYC bodega sandwich; savory cheesy-gas funk"],
    curatorNote:
      "A savory-gas indica that leans cheesy, meaty, and peppery rather than fruity or sweet. The euphoric head lift sharpens mood briefly before a deep, melting body relaxation takes over, making it a true nighttime smoke. For funk-chasers who want loud skunk and diesel over dessert.",
    tagline: "Savory gas, bodega funk",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Berry Cake",
    breeder: "PC Nursery",
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["House-brand (PC Nursery) — pedigree unverified", "Cake-family creamy vanilla base with berry-forward terpene expression"],
    curatorNote:
      "A dessert-leaning indica that marries ripe berry brightness with a creamy vanilla-frosting cake base. Strong euphoria rolls into balanced, sinking body relaxation and a lingering fruity-cream aftertaste. An easy evening pick for fans of sweet, doughy berry profiles.",
    tagline: "Berries baked in cream",
    artStatus: "none",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Jelly Cake",
    marketNames: ["Jellie Cake"],
    breeder: "Matter",
    lineage: {
      parents: ["Chauffeur", "Wedding Cake", "Jealousy"],
      cross: "Chauffeur × Wedding Cake × Jealousy",
    },
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Top terpenes myrcene, beta-caryophyllene, limonene"],
    curatorNote:
      "An indica-dominant dessert cross of Chauffeur, Wedding Cake, and Jealousy that pours on sweet, jammy fruit over a creamy cake body. Myrcene and caryophyllene drive a heavy, calming relaxation that drifts toward sleep, lifted by an early euphoric glow. A rich, sedating nightcap strain.",
    tagline: "Jammy fruit, creamy cake",
    artStatus: "none",
    sourceConfidence: "high",
  },
];
