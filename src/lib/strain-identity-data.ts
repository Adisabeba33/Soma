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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tahoe OG",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy pine-gas OG cut, body-forward"],
    curatorNote:
      "Tahoe OG is one of the heavyweight OG cuts — a Northern California phenotype prized for leaning harder into body than head than its SoCal cousins. The nose is classic gas-OG with extra weight: sharp fuel and pine over a thick, earthy musk, dense and a little medicinal. Where some OGs keep you social, Tahoe is a fast sledgehammer — a heavy, warming body wave that arrives quickly and points straight at the couch and the pillow. People keep it for nights, pain and insomnia rather than productivity, and it has a reputation for ending evenings earlier than planned. For the gas crowd who want the indica end of OG, it's a go-to.",
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
    sourceConfidence: "high",
  },
  {
    canonicalName: "Donny Burger",
    sensoryFamily: "garlic-funk",
    sourceConfidence: "low",
  },
  {
    canonicalName: "Permanent Marker",
    sensoryFamily: "garlic-funk",
    phenotypeNotes: ["Sharpie-on-paper savoury gas note"],
    sourceConfidence: "low",
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
    sourceConfidence: "high",
  },
  {
    canonicalName: "Lemon Haze",
    lineage: { parents: ["Lemon Skunk", "Silver Haze"] },
    sensoryFamily: "citrus-haze",
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
    sourceConfidence: "high",
  },
  {
    canonicalName: "Bubba Kush",
    marketNames: ["Bubba"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Coffee / earthy heavy-indica reference"],
    curatorNote:
      "Bubba Kush is a classic American indica of murky early-2000s origin, beloved for a flavour profile you rarely find elsewhere. The nose is its signature: rich coffee and dark chocolate over sweet hashy earth, almost dessert-like in a savoury way. The effect is heavy and tranquil — a thick, relaxing body weight that quiets everything down and tips toward sleep, a textbook nightcap. It's not a productive or cerebral strain, and that's the point: people reach for Bubba to stop, not to start. For coffee-and-cocoa indica lovers, it remains a comforting reference.",
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hindu Kush",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Pure indica landrace from the Hindu Kush range"],
    curatorNote:
      "Hindu Kush is a pure indica landrace from the mountains its name comes from — old-world genetics that helped seed the entire Kush family. The nose is earthy and sweet: sandalwood and incense over a dusty, hashy musk, the smell of classic hashish for a reason. The effect is calm and weighty — a relaxed, grounding body stone without much racing thought, even and dependable rather than dramatic. As a landrace it's hardy and consistent, and its resin made it a traditional hash plant for centuries. For purists who want indica at its origin, it's the source material.",
    sourceConfidence: "high",
  },
  {
    canonicalName: "Afghani",
    marketNames: ["Afghan", "Afghan Kush"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Foundational indica landrace"],
    curatorNote:
      "Afghani is one of the foundational indica landraces — the broad-leaf, resin-heavy plant that sits in the family tree of countless modern strains. The nose is deep and sweet: earthy musk, incense and a hashy sweetness, classic and unmistakably old-school. The effect is profoundly relaxing — a heavy, warm body calm that settles in and stays, the template for what 'indica' came to mean. It's prized as much for its genetics and resin as for the smoke itself, a building block more than a showpiece. For deep, traditional body relaxation, it's the ancestor everything else borrows from.",
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
    sourceConfidence: "low",
  },
];
