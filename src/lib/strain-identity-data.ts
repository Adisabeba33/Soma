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
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Tahoe OG",
    sensoryFamily: "gas-og",
    phenotypeNotes: ["Heavy pine-gas OG cut, body-forward"],
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
    sourceConfidence: "high",
  },
  {
    canonicalName: "Bubba Kush",
    marketNames: ["Bubba"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Coffee / earthy heavy-indica reference"],
    sourceConfidence: "medium",
  },
  {
    canonicalName: "Hindu Kush",
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Pure indica landrace from the Hindu Kush range"],
    sourceConfidence: "high",
  },
  {
    canonicalName: "Afghani",
    marketNames: ["Afghan", "Afghan Kush"],
    sensoryFamily: "kush-classic",
    phenotypeNotes: ["Foundational indica landrace"],
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
    sourceConfidence: "high",
  },
  {
    canonicalName: "Zkittlez",
    marketNames: ["Skittlez", "Skittles", "Island Zkittlez"],
    breeder: "Terphogz / 3rd Gen Family",
    lineage: { parents: ["Grape Ape", "Grapefruit"] },
    sensoryFamily: "modern-exotic",
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
