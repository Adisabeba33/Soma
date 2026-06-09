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
    sourceConfidence: "high",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tahoe OG",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy pine-gas OG cut, body-forward"],
    curatorNote:
      "Tahoe OG is one of the heavyweight OG cuts — a Northern California phenotype prized for leaning harder into body than head than its SoCal cousins. The nose is classic gas-OG with extra weight: sharp fuel and pine over a thick, earthy musk, dense and a little medicinal. Where some OGs keep you social, Tahoe is a fast sledgehammer — a heavy, warming body wave that arrives quickly and points straight at the couch and the pillow. People keep it for nights, pain and insomnia rather than productivity, and it has a reputation for ending evenings earlier than planned. For the gas crowd who want the indica end of OG, it's a go-to.",
    curatorQuote:
      "Sharp fuel and pine over a thick, earthy musk, dense and a little medicinal.",
    sourceConfidence: "medium",
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
    sourceConfidence: "high",
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
    sourceConfidence: "medium",
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
    sourceConfidence: "high",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Permanent Marker",
    breeder: "Seed Junky Genetics",
    lineage: {
      parents: ["Biscotti", "Jealousy", "Sherbert"],
      cross: "Biscotti × Jealousy × Sherbert",
    },
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Sharpie-and-soap funk", "'Strain of the year' contender"],
    curatorNote:
      "Permanent Marker is a Seed Junky cross of Biscotti, Jealousy and Sherbert — a 'strain of the year' contender named for its loud, Sharpie-like funk. The nose is exactly that: a sharp, chemical marker-and-soap funk over a sweet, gassy base, unmistakable and a little divisive. The effect is balanced and euphoric — a happy, uplifting head over a relaxed body, versatile but potent. It's very frosty and loud, a flavour-forward modern exotic. For people who want that distinctive Sharpie-soap funk done well, Permanent Marker is the reference.",
    curatorQuote:
      "A sharp, chemical marker-and-soap funk over a sweet, gassy base — unmistakable, and a little divisive.",
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
    sourceConfidence: "high",
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
    sourceConfidence: "high",
  },
  {
    canonicalName: "Bubba Kush",
    marketNames: ["Bubba"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Coffee / earthy heavy-indica reference"],
    curatorNote:
      "Bubba Kush is a classic American indica of murky early-2000s origin, beloved for a flavour profile you rarely find elsewhere. The nose is its signature: rich coffee and dark chocolate over sweet hashy earth, almost dessert-like in a savoury way. The effect is heavy and tranquil — a thick, relaxing body weight that quiets everything down and tips toward sleep, a textbook nightcap. It's not a productive or cerebral strain, and that's the point: people reach for Bubba to stop, not to start. For coffee-and-cocoa indica lovers, it remains a comforting reference.",
    curatorQuote:
      "People reach for Bubba to stop, not to start.",
    sourceConfidence: "medium",
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
    sourceConfidence: "high",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: [
      "Candy-tropical sweetness",
      "White / Pink phenos vary by frost and finish",
    ],
    curatorNote:
      "Runtz is the candy-bag flagship of the exotic era — a Zkittlez × Gelato cross from the Runtz/Cookies camp that turned 'looks like candy, tastes like candy' into a whole aesthetic. The nose is pure confection: sugary tropical fruit and creamy sweetness with barely any funk, loud in a fruity rather than gassy way. The effect is balanced and feel-good — a bright euphoric lift over comfortable body ease, social without being sedating. Its fame is also its curse: 'Runtz' is one of the most counterfeited names on the market, and a lot of it is sweetness without the frost or the balance. A real White or Pink cut is glittering, candied and unmistakably exotic.",
    curatorQuote:
      "'Looks like candy, tastes like candy' became a whole aesthetic.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Zkittlez",
    marketNames: ["Skittlez", "Skittles", "Island Zkittlez"],
    breeder: "Terphogz / 3rd Gen Family",
    lineage: { parents: ["Grape Ape", "Grapefruit"] },
    sensoryFamily: "modern-exotic",
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
    sourceConfidence: "high",
  },

  // ── Custom / light data ──
  {
    canonicalName: "White Hot Guava",
    marketNames: ["Hot Guava", "WHG"],
    sensoryFamily: "modern-exotic",
    phenotypeNotes: [
      "Guava-forward gas hybrid",
      "Custom seed entry — limited public lineage data",
    ],
    curatorNote:
      "White Hot Guava is a custom, small-batch hybrid with little public lineage on record — what's consistent is the guava: a sweet, almost tinned-tropical fruit note riding on top of sharp fuel. On the nose it reads candy-and-gas, the guava softening an otherwise pungent diesel funk. The high sits in the middle — a clear, lightly euphoric lift with a loose, comfortable body that won't pin you down. It's bought for the flavour and the frost rather than for knockout potency. A novelty in the best sense: if you find a real cut, the guava note is genuinely hard to source elsewhere.",
    curatorQuote:
      "On the nose it reads candy-and-gas, the guava softening an otherwise pungent diesel funk.",
    sourceConfidence: "low",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Gassy-mint funk, very frosty"],
    curatorNote:
      "Gary Payton — named for the Hall-of-Fame point guard — is a Cookies/Powerzzzup collab crossing The Y (a GSC line) with Snowman, and one of the loudest hype strains of recent years. The nose is sharp and savoury-sweet: diesel and herbal funk over a cool mint-cookie edge, more gas than candy. The effect is balanced and clear-headed — an energetic, focused euphoria over a calm body that keeps it usable through the day, unusual for something this potent. It runs strong, though, so the 'functional' label only holds at a sensible dose. As a frosty, gassy, high-test hybrid, it earned its reputation beyond the marketing.",
    curatorQuote:
      "Diesel and herbal funk over a cool mint-cookie edge, more gas than candy.",
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
      parents: ["Alien Cookies", "Starfighter × Columbian"],
      cross: "Alien Cookies × (Starfighter × Columbian)",
    },
    sensoryFamily: "modern-exotic",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Face Off OG",
    marketNames: ["Face Off"],
    breeder: "Archive Seed Bank",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Pungent gas OG", "Half of Do-Si-Dos' parentage"],
    curatorNote:
      "Face Off OG is an Archive Seed Bank OG cut — a pungent, gassy OG that became important mostly as a parent (it's half of Do-Si-Dos). The nose is heavy and chemical: sharp fuel, pine and a sour, almost antiseptic funk, loud and unmistakably OG. The effect is a strong, numbing body high with a hazy, sedating head — the 'face off' name fits the heavy, blanketing feel. It's firmly an evening, sit-down strain, potent enough to flatten the unprepared. For OG purists and breeders alike, Face Off earned its reputation as a building block.",
    curatorQuote:
      "Sharp fuel, pine and a sour, almost antiseptic funk, loud and unmistakably OG.",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chem 91",
    marketNames: ["Chemdawg 91", "Chem '91", "Chem 91 Skunk VA"],
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["The original 1991 Chemdawg phenotype"],
    curatorNote:
      "Chem 91 is one of the original Chemdawg cuts — the specific 1991 phenotype that helped found the entire Chem/diesel line. The nose is sharp and acrid: pungent diesel, sour funk and a metallic, chemical bite, the raw 'chem' smell at its source. The effect is heavy and cerebral — a fast, pressing head-rush over a weighty body, potent and a little overwhelming for the unprepared. It's loud, divisive and historically important, a connoisseur's cut more than a crowd-pleaser. For people chasing the roots of the diesel family, Chem 91 is where much of it begins.",
    curatorQuote:
      "Pungent diesel, sour funk and a metallic, chemical bite, the raw 'chem' smell at its source.",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Frosty gas-and-sherbet 'strain of the year'"],
    curatorNote:
      "Jealousy is a hype-era cross of Gelato 41 and Sherbet (a Seed Junky/Powerzzzup line) that topped 'strain of the year' lists — frosty, gassy and sweet. The nose is rich and complex: creamy sherbet and sweet fruit over a sharp, gassy funk, candy with a fuel edge. The effect is balanced and euphoric — an uplifting, sociable head over a relaxed body, versatile across the day. It's potent and very frosty, a flavour-forward modern exotic. For people chasing the current Gelato-gas hype done well, Jealousy is a standout.",
    curatorQuote:
      "Creamy sherbet and sweet fruit over a sharp, gassy funk, candy with a fuel edge.",
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
  },

  // ── Haze / sativa classics ──
  {
    canonicalName: "Amnesia Haze",
    marketNames: ["Amnesia"],
    sensoryFamily: "haze-sativa",
    phenotypeNotes: ["Citrus-forward Cup-winning haze"],
    curatorNote:
      "Amnesia Haze is a Cup-winning sativa — a haze-heavy blend of landrace genetics (Jamaican, South Asian and Haze lines) popular across Amsterdam coffeeshops. The nose is bright and complex: lemon and citrus over an earthy, spicy haze, clean and energetic. The effect is a strong, soaring cerebral high — uplifting, euphoric and energetic, a classic daytime and creative sativa. Like most big hazes it can run racy or heady at high doses, so it's not for the easily anxious. For people who want a bright, potent, long-running sativa lift, Amnesia Haze is a benchmark.",
    curatorQuote:
      "Lemon and citrus over an earthy, spicy haze, clean and energetic.",
    sourceConfidence: "medium",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "UK Cheese",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Candy grape over sharp diesel"],
    curatorNote:
      "Grape Gas — also sold as Grape Gasoline, Compound Genetics' cross of Grape Pie and Jet Fuel Gelato — welds candy grape to a sharp diesel funk, with the colour to match. On the nose, sweet grape and berry sit over a pungent, gassy base; it's loud in a way pure-candy strains aren't. The effect leans heavy: a warm euphoria that sinks into the body and points toward the evening. It's built for people who like their grape with a fuel edge rather than clean sweetness. Frosty, potent and unapologetically gassy.",
    curatorQuote:
      "On the nose, sweet grape and berry sit over a pungent, gassy base; it's loud in a way pure-candy strains aren't.",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Tropical candy over a gassy OG frame"],
    curatorNote:
      "Gushers (Fruit Gushers) is a Cookies cross of Gelato 41 and Triangle Kush — sweet tropical candy on a gassy, OG-leaning frame. The nose is sweet and fruity: tropical candy and berry over a light gas, dessert-bright with a funky edge. The effect is balanced-leaning-relaxed — a euphoric head over a comfortable, calming body, afternoon into evening. It's frosty and potent, a popular flavour-forward exotic. For people who want fruity candy with some gas backbone, Gushers is a tasty, well-known pick.",
    curatorQuote:
      "Tropical candy and berry over a light gas, dessert-bright with a funky edge.",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Guava-sherbet, extremely frosty"],
    curatorNote:
      "RS11 — Rainbow Sherbet #11 — is a Wizard Trees / Doja cut of Pink Guava and OZ Kush, one of the most hyped exotics of recent years. The nose is sweet and creamy: tropical guava and sherbet over a doughy, gassy base, candy with depth. The effect is balanced and relaxing — a euphoric head easing into comfortable body calm, afternoon into evening. It's extremely frosty and flavour-forward, a connoisseur's exotic. For people chasing the current top-shelf guava-sherbet hype, RS11 is a benchmark.",
    curatorQuote:
      "Tropical guava and sherbet over a doughy, gassy base, candy with depth.",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Sharp, ammonia-tinged sour funk"],
    curatorNote:
      "Cheetah Piss is a Cookies strain — a cross of Lemonnade, Gelato 42 and London Pound Cake — with a name nodding to its sharp, ammonia-tinged funk. The nose is pungent and unusual: sour citrus and a sharp, almost ammonia-like funk over a creamy, gassy base, loud and divisive. The effect is balanced and uplifting — a euphoric, sociable head over a relaxed body, versatile and potent. It's frosty and very loud, a flavour-forward exotic for funk chasers. For people who want a sharp, sour, unusual profile, Cheetah Piss stands out.",
    curatorQuote:
      "Sour citrus and a sharp, almost ammonia-like funk over a creamy, gassy base, loud and divisive.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Italian Ice",
    breeder: "Cookies",
    lineage: {
      parents: ["Gelato 45", "Forbidden Fruit"],
      cross: "Gelato 45 × Forbidden Fruit",
    },
    sensoryFamily: "modern-exotic",
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
    marketNames: ["Lemon Poundcake"],
    sensoryFamily: "dessert-cookies",
    phenotypeNotes: ["Lemon cake over a creamy base"],
    curatorNote:
      "Lemon Pound Cake sits in the cake family but leans citrus — sweet lemon icing over a buttery, doughy base. The nose is bright lemon and vanilla cake with a faint gas, smooth rather than sharp. The high is gentle and even: a small uplift that mellows into easy comfort, fine across the day. It's a flavour-first strain with moderate, forgiving strength. For lemon-and-cake sweetness without much weight, it's a pleasant, undemanding pick.",
    curatorQuote:
      "Bright lemon and vanilla cake with a faint gas, smooth rather than sharp.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Cotton Candy Kush",
    marketNames: ["Cotton Candy"],
    breeder: "Delicious Seeds",
    lineage: {
      parents: ["Lavender", "Power Plant"],
      cross: "Lavender × Power Plant",
    },
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Spun-sugar, floral-sweet"],
    curatorNote:
      "Cotton Candy Kush is a Delicious Seeds cross of Lavender and Power Plant — built around a sweet, sugary, almost floral candy flavour. The nose is sweet and floral: spun-sugar sweetness and berry over a light floral, earthy base, dessert with a perfumed edge. The effect is relaxing and happy — a calming, mood-lifting body ease that leans comfortable, good for unwinding. It's moderate and flavour-driven, more about taste and calm than raw power. For people who want sweet, floral candy, Cotton Candy Kush is a soft, pleasant pick.",
    curatorQuote:
      "Spun-sugar sweetness and berry over a light floral, earthy base, dessert with a perfumed edge.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Gas Face",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Fuel-forward, little sweetness"],
    curatorNote:
      "Gas Face is built for one thing — fuel. Lineage is loosely tied to the OG/diesel world, but the draw is the nose: sharp diesel and raw fuel over a skunky, earthy base, with almost no sweetness to round it off. The high is just as direct — a quick euphoric wash that drops into a heavy, sedating body, firmly an evening hit. It's potent and unsubtle, made for people who want gas over candy. If pure fuel is the goal, it earns the name.",
    curatorQuote:
      "Sharp diesel and raw fuel over a skunky, earthy base, with almost no sweetness to round it off.",
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
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy, fuel-forward OG"],
    curatorNote:
      "Triple Double OG is a heavy, OG-leaning indica that puts potency ahead of nuance. The nose is loud, classic OG — sharp fuel and pine over damp earth, all gas and no candy. Expect a fast euphoric head that gives way to a weighted, sedating body and, eventually, the pillow. There's not much daytime in it; this is a nightcap. For OG and gas lovers chasing a simple, heavy knockout, it fits the bill.",
    curatorQuote:
      "Sharp fuel and pine over damp earth, all gas and no candy.",
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
    sensoryFamily: "modern-exotic",
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
    marketNames: ["Triangle", "Triangle OG"],
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Florida OG cut", "Behind Wedding Cake & Triangle Mints"],
    curatorNote:
      "Triangle Kush is a legendary Florida OG cut — the 'triangle' nods to the state's three cannabis hubs — and one of the most important parents in modern genetics, behind Wedding Cake and Triangle Mints. The nose is pure heavy OG: sharp fuel and pine over a damp, earthy funk, loud and classic. The effect is a strong, relaxing indica-leaning high — a euphoric head sinking into a heavy body, firmly evening territory. It's potent and couch-leaning, prized as much for breeding as for smoking. For OG purists and lovers of gassy, heavy genetics, Triangle Kush is foundational.",
    curatorQuote:
      "Sharp fuel and pine over a damp, earthy funk, loud and classic.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pink Kush",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Sweet, floral OG indica", "Pink-hued pistils"],
    curatorNote:
      "Pink Kush is a heavy West Coast indica — an OG Kush descendant with pink-hued pistils — beloved across British Columbia and beyond. The nose is rich and sweet: floral vanilla and sweet candy over an earthy, gassy kush base, dessert meeting OG. The effect is profoundly relaxing — a euphoric head that sinks into a heavy, sedating body, a textbook nightcap. It's potent and couch-leaning, known to bring on sleep and the munchies. For lovers of sweet, heavy OG indicas, Pink Kush is a frosty favourite.",
    curatorQuote:
      "Floral vanilla and sweet candy over an earthy, gassy kush base, dessert meeting OG.",
    sourceConfidence: "medium",
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
    marketNames: ["Runtz (pink pheno)"],
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Candy-sweet pink Runtz phenotype"],
    curatorNote:
      "Pink Runtz is a candy-sweet phenotype of the Runtz family — a pink-hued cut prized for sugary, fruity flavour and heavy frost. The nose is pure confection: sweet berry and tropical candy with barely any funk, loud and sugary. The effect is balanced and feel-good — a bright euphoric lift over comfortable body ease, social without sedation. Like all Runtz it's widely counterfeited, so a true frosty pink cut stands out. For the candy-sweet end of Runtz, Pink Runtz is a prized pick.",
    curatorQuote:
      "Sweet berry and tropical candy with barely any funk, loud and sugary.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Apple Runtz",
    lineage: {
      parents: ["Runtz", "Apple Fritter"],
      cross: "Runtz × Apple Fritter (commonly cited; not breeder-verified)",
    },
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Green-apple Runtz selection"],
    curatorNote:
      "Apple Runtz is widely described as Runtz crossed with Apple Fritter, though no breeder has published a verified recipe — so treat the lineage as the common story rather than gospel. Either way it brings a green-apple twist to the candy Runtz family: sweet-tart apple laid over the line's creamy confection. The nose is bright — crisp green apple and sugared tropical fruit with barely any funk. The smoke is easy and upbeat, a light euphoria that keeps things sociable rather than sleepy. As with the rest of the Runtz crowd, flavour and frost lead the way over raw strength. For a sweet-and-sour apple candy profile, it's a fun, approachable pick.",
    curatorQuote:
      "Crisp green apple and sugared tropical fruit with barely any funk.",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Obama Runtz",
    sensoryFamily: "modern-exotic",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hippie Crasher",
    lineage: {
      parents: ["Kush Mints", "Wedding Crasher"],
      cross: "Kush Mints × Wedding Crasher",
    },
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Minty cookie over grape-gas"],
    curatorNote:
      "Hippie Crasher crosses Kush Mints with Wedding Crasher, marrying cool minty cookie to grape-and-gas funk. The nose is layered — mint and cookie up front, grape and fuel underneath, sweet and savoury at the same time. The effect is balanced and unhurried: a clear euphoric head that drifts into easy body comfort, good from afternoon on. It's very frosty and flavour-forward, the kind of cut connoisseurs hunt. For mint-and-grape gas done well, it's a tasty pick.",
    curatorQuote:
      "Mint and cookie up front, grape and fuel underneath, sweet and savoury at the same time.",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Extremely potent and loud", "Sour, soapy-mint funk"],
    curatorNote:
      "Cap Junky is a hype-era heavyweight — a Capulator and Seed Junky collab crossing Kush Mints 11 and Alien Cookies — one of the loudest, most potent exotics of recent years. The nose is sharp and savoury-sweet: mint, gas and a sour, almost soapy funk over a creamy base, intense and unusual. The effect is fast and powerful — a euphoric, heady rush that settles into a heavy body, potent enough to humble experienced smokers. It's extremely frosty and very loud, a true connoisseur's exotic. For people chasing maximum potency and funk, Cap Junky is the deep end.",
    curatorQuote:
      "Mint, gas and a sour, almost soapy funk over a creamy base, intense and unusual.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Black Truffle",
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Savoury, earthy truffle-and-gas funk"],
    curatorNote:
      "Black Truffle is one of the savoury exotics — dark, frosty buds carrying an earthy, almost mushroom-and-truffle funk rather than candy. The nose is rich and savoury: gassy, earthy truffle over a faint berry sweetness, pungent and unusual. The effect leans relaxing and potent — a happy head that sinks into body weight, better kept for the evening. It's loud and frost-heavy, squarely for funk chasers. For a savoury, gassy profile well off the candy path, it stands out.",
    curatorQuote:
      "Gassy, earthy truffle over a faint berry sweetness, pungent and unusual.",
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
    sensoryFamily: "citrus-haze",
    phenotypeNotes: ["Sharp, clean lemon sativa lean"],
    curatorNote:
      "Lemon Tek is a citrus-forward, sativa-leaning hybrid built on sharp, sweet lemon. The nose is clean and zesty — fresh lemon over a light herbal, earthy base. The effect is up and talkative: an energetic, clear head with a light body, suited to daytime and creative work. It's flavour-forward and approachable, more lift than weight. For a clean lemon daytime sativa, it's a zesty, easy pick.",
    curatorQuote:
      "Fresh lemon over a light herbal, earthy base.",
    sourceConfidence: "low",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
      cross: "Clone-only OG — lineage contested",
    },
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy fuel-and-pine OG", "Deeply sedating nightcap"],
    curatorNote:
      "High Octane OG (also passed as Heirloom OG) is a clone-only OG whose exact parents were never settled — variously tied to a Chemdawg/Lemon Thai/Hindu Kush build or a stack of West Coast OG cuts. What's consistent is the profile: heavy fuel and pine over damp earth, loud and unmistakably OG. The effect is a fast, sedating body weight that points straight at the couch and sleep. It's high-test and not subtle, an evening nightcap. For a heavy, gassy OG with old-school pedigree, High Octane delivers.",
    curatorQuote:
      "Heavy fuel and pine over damp earth — loud and unmistakably OG.",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Candy fruit over OG gas", "A parent of RS11, Studio 54 and Pink Picasso"],
    curatorNote:
      "OZ Kush is OZ Kushman's Zkittlez × OG Kush — candy fruit folded onto a gassy OG frame, and one of the quiet workhorses of the modern exotic scene. The nose is sweet and tropical with a fuel undertone: berry and tropical candy over earthy gas. The effect is balanced and euphoric — an uplifting head over a relaxed body, sociable and potent. It's frosty and resin-heavy, prized less for its own fame than for the heavyweights it parents (RS11, Studio 54, Pink Picasso). For candy-and-gas genetics at the source, OZ Kush is foundational.",
    curatorQuote:
      "Berry and tropical candy over earthy gas.",
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
    sensoryFamily: "modern-exotic",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Pink Guava",
    breeder: "OZ Kushman",
    lineage: {
      cross: "OZ Kushman guava selection",
    },
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
    sensoryFamily: "modern-exotic",
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
      cross: "Black-cherry-leaning Gelato cross",
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
      cross: "Compound Genetics select (lineage undisclosed)",
    },
    sensoryFamily: "modern-exotic",
    phenotypeNotes: ["Cool menthol over gas funk", "A parent of Pink Certz"],
    curatorNote:
      "The Menthol is a Compound Genetics cut whose recipe stays in-house — named for an unusual cooling, menthol-mint note over gas. The nose is distinctive: cool mint and herbal sharpness over an earthy, gassy funk, unlike most candy exotics. The effect is balanced and easy — a euphoric, relaxed high, potent but versatile. It's very frosty and loud, prized for the menthol character it passes to crosses like Pink Certz. For a genuinely minty, gassy profile, The Menthol is a one-off.",
    curatorQuote:
      "Cool mint and herbal sharpness over an earthy, gassy funk.",
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
];
