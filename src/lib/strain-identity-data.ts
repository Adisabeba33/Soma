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
      "Lemon Cherry Gelato (LCG) is a hyped exotic of contested parentage — usually traced to a Sunset Sherbet × GSC line with a citrus-cherry lean — popularised through the Bay Area exotic scene. The nose is bright and fruity: sweet cherry and citrus over a creamy gelato base, candy-forward with a gassy undertone. The effect is balanced and euphoric — a happy, uplifting head settling into relaxed body comfort, sociable without knocking you out. Like most hyped exotics it's heavily counterfeited, so lineage and quality vary widely between cuts. A real LCG is colourful, frosty and unmistakably fruity.",
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
      "Platinum OG is a frosty, heavy indica of contested parentage — usually cited as a Master Kush × OG Kush line — named for its silvery, trichome-platinum coat. The nose is classic heavy-OG: gas and earth with a sweet, skunky edge, dense rather than bright. The effect is strongly sedating — a thick body relaxation that settles fast and tips toward sleep, a straightforward evening strain. It's potent and couch-leaning, more about switching off than doing anything. For lovers of frosty, gassy, knock-out indicas, Platinum OG delivers exactly that.",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Chem 91",
    marketNames: ["Chemdawg 91", "Chem '91", "Chem 91 Skunk VA"],
    sensoryFamily: "diesel-chem",
    phenotypeNotes: ["The original 1991 Chemdawg phenotype"],
    curatorNote:
      "Chem 91 is one of the original Chemdawg cuts — the specific 1991 phenotype that helped found the entire Chem/diesel line. The nose is sharp and acrid: pungent diesel, sour funk and a metallic, chemical bite, the raw 'chem' smell at its source. The effect is heavy and cerebral — a fast, pressing head-rush over a weighty body, potent and a little overwhelming for the unprepared. It's loud, divisive and historically important, a connoisseur's cut more than a crowd-pleaser. For people chasing the roots of the diesel family, Chem 91 is where much of it begins.",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Purple Urkle",
    marketNames: ["Purple Urkel", "Urkle"],
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Mendocino purple selection", "A parent of Granddaddy Purple"],
    curatorNote:
      "Purple Urkle is a Northern California purple classic of murky origin — likely a Mendocino Purps selection — and a parent of Granddaddy Purple. The nose is deep and sweet: grape and dark berry over a skunky, earthy base, the template purple aroma. The effect is heavily relaxing — a warm, dreamy body weight that calms and tips toward sleep, a classic evening indica. It's couch-leaning and sedating, more about winding down than doing anything. As the grandparent of much of the purple line, Purple Urkle is a foundational grape indica.",
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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Cherry Punch",
    lineage: {
      parents: ["Cherry AK", "Purple Punch"],
      cross: "Cherry AK × Purple Punch",
    },
    sensoryFamily: "purple-berry",
    phenotypeNotes: ["Bright cherry-candy sweetness"],
    curatorNote:
      "Cherry Punch is a fruity hybrid — commonly a Cherry AK × Purple Punch cross — built around bright cherry sweetness. The nose is candy-forward: sweet cherry and berry over a light floral, earthy base, dessert-leaning and clean. The effect is balanced and uplifting — a happy, relaxing high that lifts the mood without heavy sedation at sensible doses. It's approachable and flavour-driven, more about mood and taste than raw power. For people chasing a sweet cherry profile in a balanced hybrid, Cherry Punch fits.",
    sourceConfidence: "low",
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
    sourceConfidence: "medium",
  },
];
