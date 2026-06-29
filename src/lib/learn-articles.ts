// Typed registry for the Learn section. One entry per article drives the hub
// grid (/learn), the static article pages (/learn/[slug]) and their metadata,
// plus the Article / FAQPage / BreadcrumbList JSON-LD. Keeping the content
// here — rather than in many page files — means the sitemap, the hub and the
// articles all read from one source of truth.
//
// NOTE FOR THE OWNER: the factual claims below (humidity %, temperature,
// storage specifics) are an editorial DRAFT. Please verify for accuracy
// before merging. Nothing here is medical or legal advice; SŌMA is an
// information guide for adults 21+ where cannabis is legal.

// A paragraph is either plain prose or a heading that introduces a subsection.
export interface ArticleBlock {
  // "h2"/"h3" render headings; "p" renders a paragraph; "ul" renders a list.
  kind: "h2" | "h3" | "p" | "ul";
  // Text for h2/h3/p; list items for ul.
  text?: string;
  items?: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface LearnArticle {
  slug: string;
  // H1 / base for the SEO <title>.
  title: string;
  // Meta description and the card blurb on the hub.
  description: string;
  // Human-readable reading time, e.g. "5 min read".
  readingTime: string;
  // ISO date (YYYY-MM-DD) used for lastModified in the sitemap and the
  // dateModified in Article JSON-LD.
  updated: string;
  // Lead paragraphs shown under the H1, before the first H2.
  intro: string[];
  // Ordered body blocks (headings, paragraphs, lists).
  body: ArticleBlock[];
  // 3–5 questions. Rendered on the page AND emitted as FAQPage JSON-LD.
  faq: FaqItem[];
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: "how-to-store-cannabis",
    title: "How to store cannabis so it keeps its strength",
    description:
      "Jar versus bag, the right humidity, temperature and light — and why a shop's storage habits tell you as much about freshness as any label.",
    readingTime: "6 min read",
    updated: "2026-06-22",
    intro: [
      "Cannabis flower is a living, perishable thing. From the moment it is cured, its aroma, flavour and potency begin a slow decline — and how it is stored decides whether that takes years or weeks. The good news is that the variables are few and the fixes are cheap.",
      "This guide covers the four things that matter most — container, humidity, temperature and light — and what a dispensary's own storage habits quietly tell you about what you are buying.",
    ],
    body: [
      { kind: "h2", text: "Container: glass jar, not plastic bag" },
      {
        kind: "p",
        text: "An airtight glass jar is the simplest upgrade you can make. A sealed jar limits the oxygen that oxidises cannabinoids and terpenes, and glass — unlike thin plastic — does not carry a static charge that strips the delicate resin (the trichomes) off the flower. Plastic bags are fine for a day or two of transport; they are a poor home for anything you want to keep.",
      },
      {
        kind: "p",
        text: "Fill the jar so there is a little headroom but not a lot of empty air, and open it only when you need to. Every opening swaps the conditioned air inside for whatever is in the room.",
      },
      { kind: "h2", text: "Humidity: aim for a stable mid-range" },
      {
        kind: "p",
        text: "Humidity is the variable most people get wrong. Too dry and the flower turns harsh and dusty, and fragile terpenes evaporate; too damp and you risk mould. A common target range for stored flower is roughly 55–62% relative humidity, and two-way humidity packs (Boveda and similar brands sell 58% and 62% versions) hold a jar near a set point by either releasing or absorbing moisture as needed.",
      },
      {
        kind: "p",
        text: "Which number you choose is a matter of taste: 62% keeps flower a touch springier, 58% gives a drier, sometimes smoother draw. Either way, the point is stability — a steady mid-range beats a jar that swings wet and dry.",
      },
      { kind: "h3", text: "A note on the freezer and fridge" },
      {
        kind: "p",
        text: "The fridge is a trap: it runs humid, its temperature swings each time the door opens, and condensation invites mould. Long-term freezing can preserve potency but makes trichomes brittle, so they snap off if the flower is handled while frozen. For most people, a cool, dark cupboard beats both.",
      },
      { kind: "h2", text: "Temperature and light" },
      {
        kind: "p",
        text: "Heat speeds up every form of degradation and, above roughly 25°C, encourages mould. Cool and consistent is the goal — a drawer or cupboard away from appliances and sunny windows. Light, especially direct UV, is the single fastest way to break down cannabinoids, which is why quality flower is kept in opaque or tinted containers and out of the sun.",
      },
      { kind: "h2", text: "Why a shop's storage habits signal freshness" },
      {
        kind: "p",
        text: "You can read a dispensary the way you read a fishmonger. Flower kept in sealed, opaque containers, away from hot display lights, with a visible packaging or harvest date, is flower someone is treating as perishable — because it is. Big clear jars baking under bright lights, or product with no date at all, tell their own story.",
      },
      {
        kind: "p",
        text: "This is also why the same strain can disappoint: a careless supply chain undoes good genetics. Storage is not a detail at the end — it is part of the quality you are paying for.",
      },
      { kind: "h2", text: "A simple checklist" },
      {
        kind: "ul",
        items: [
          "Airtight glass jar, kept mostly full and opened sparingly.",
          "A 58% or 62% two-way humidity pack inside the jar.",
          "Cool and stable — a dark cupboard, not the fridge.",
          "Out of direct light; opaque or tinted container.",
          "Check the packaging or harvest date before you buy.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does cannabis flower stay good?",
        a: "Stored well — airtight, cool, dark and at a stable mid-range humidity — well-cured flower can hold most of its aroma and potency for six months to a year, and often longer. Stored badly, in a bag on a warm sunny shelf, it can noticeably fade within a few weeks.",
      },
      {
        q: "Should I keep cannabis in the fridge or freezer?",
        a: "Generally no. The fridge runs humid and swings in temperature, which invites mould, and freezing makes the resinous trichomes brittle so they break off when handled. A cool, dark cupboard is more reliable for everyday storage.",
      },
      {
        q: "What humidity is best for storing cannabis?",
        a: "A stable mid-range, commonly cited as roughly 55–62% relative humidity. Two-way humidity packs sold at 58% or 62% hold a jar near that set point. The exact number is a matter of preference; consistency matters more than the precise figure.",
      },
      {
        q: "Why does the same strain feel weaker than last time?",
        a: "Often it is storage and handling rather than the genetics. Light, heat, air and time degrade cannabinoids and terpenes, so flower that sat in a clear jar under display lights will feel flatter than the same strain kept sealed and cool.",
      },
    ],
  },
  {
    slug: "why-the-same-strain-feels-different",
    title: "Why the same strain can feel different",
    description:
      "Grower, phenotype, batch, age and storage all shift how a single strain name actually performs — which is why a name alone is a weak promise.",
    readingTime: "5 min read",
    updated: "2026-06-22",
    intro: [
      "You loved a strain once and bought it again, and it felt like a different plant. You are not imagining it. A strain name is a label on a wide range of real outcomes, and several independent factors move that outcome around.",
      "Understanding them is the whole reason SŌMA matches on sensory qualities rather than names — the aroma and effect you actually want are more reliable than the word on the jar.",
    ],
    body: [
      { kind: "h2", text: "The grower" },
      {
        kind: "p",
        text: "Genetics set a range; cultivation decides where in that range a plant lands. Light, nutrients, the timing of harvest, and how carefully the flower is dried and cured all shape the final aroma, potency and smoothness. Two farms growing the same cutting can produce noticeably different jars.",
      },
      { kind: "h2", text: "Phenotype" },
      {
        kind: "p",
        text: "Most strains are not a single fixed plant but a family of expressions. Grow ten seeds of one strain and you may get several distinct phenotypes — different aroma profiles, different structure, different effects. Even from clones, the chosen mother plant determines which expression you actually receive.",
      },
      { kind: "h2", text: "The batch" },
      {
        kind: "p",
        text: "Cannabis is an agricultural product, so it varies harvest to harvest the way wine varies vintage to vintage. Weather, the exact harvest window and small processing differences mean this month's batch of a strain is not last month's. The name is constant; the crop is not.",
      },
      { kind: "h2", text: "Age and storage" },
      {
        kind: "p",
        text: "Time and conditions keep working after harvest. Terpenes — the aromatic compounds that shape much of the experience — are volatile and fade first, so older or poorly stored flower can smell and feel muted even when the genetics are identical. (See our guide on storing cannabis for the details.)",
      },
      { kind: "h2", text: "What to do about it" },
      {
        kind: "p",
        text: "Treat the strain name as a rough starting point, not a guarantee. Pay attention to what you can actually observe — aroma, freshness, the harvest date — and track the sensory qualities you respond to rather than collecting names. That is exactly what a taste profile is for.",
      },
    ],
    faq: [
      {
        q: "Is a strain name a reliable guide to the experience?",
        a: "Only loosely. The same name covers different growers, phenotypes and batches, each of which shifts aroma, potency and effect. It is a starting point, not a promise.",
      },
      {
        q: "What is a phenotype?",
        a: "A phenotype is a particular expression of a strain's genetics. Many strains produce several distinct phenotypes — varying in aroma, structure and effect — so which one you get depends on the specific plant a grower selected.",
      },
      {
        q: "Why does flower from two shops labelled the same differ?",
        a: "Because growing, harvest timing, curing, batch and storage all vary independently of the name. Two jars sharing a label can come from different farms and different harvests, and will feel different.",
      },
      {
        q: "How do I get a more consistent experience?",
        a: "Match on sensory qualities — aroma, flavour and the effects you actually want — and note freshness and harvest date, rather than relying on the strain name alone. Building a taste profile makes those preferences repeatable.",
      },
    ],
  },
  {
    slug: "how-to-read-a-dispensary-menu",
    title: "How to read a dispensary menu",
    description:
      "What the numbers and labels on a menu really mean, and the quieter signals — dates, storage, descriptions — that point to quality.",
    readingTime: "6 min read",
    updated: "2026-06-22",
    intro: [
      "A dispensary menu can read like a spreadsheet: percentages, category tags, dense rows of names. Most of it is noise; a few things genuinely help. Here is how to find the signal.",
    ],
    body: [
      { kind: "h2", text: "Look past the THC number" },
      {
        kind: "p",
        text: "The headline THC percentage is the most over-weighted number on any menu. A high figure does not reliably predict how strong or enjoyable flower will feel — the mix of cannabinoids and aromatic terpenes shapes the experience as much as raw potency. Chasing the biggest number is the most common way to be disappointed.",
      },
      { kind: "h2", text: "Indica, sativa and hybrid are loose labels" },
      {
        kind: "p",
        text: "These tags are a rough shorthand, not a precise prediction. They describe traditions and tendencies more than guaranteed effects, and a given plant's chemistry can cut across the label. Treat them as a hint, then look at the aroma and effect description for something more specific.",
      },
      { kind: "h2", text: "Find the dates" },
      {
        kind: "p",
        text: "The most useful number on the menu is often the one buried: the harvest or packaging date. Fresher flower keeps more of its aromatic terpenes, which fade with time. A clear, recent date is a good sign; no date at all is itself a signal.",
      },
      { kind: "h2", text: "Read the description, not just the stats" },
      {
        kind: "p",
        text: "A listing that names specific aromas and effects — citrus, pine, calm, focus — tells you more than one padded with marketing superlatives. Specific, sensory language usually means someone actually paid attention to the flower.",
      },
      { kind: "h3", text: "Signals of a careful shop" },
      {
        kind: "ul",
        items: [
          "Visible harvest or packaging dates on listings.",
          "Concrete aroma and effect notes, not just hype.",
          "Flower stored sealed, cool and out of bright light.",
          "Staff who ask what you want from the experience, not just how strong you want it.",
        ],
      },
      { kind: "h2", text: "Ask the right question" },
      {
        kind: "p",
        text: "Instead of asking for the strongest thing on the menu, describe the experience you are after — the aromas you like, the effect you want, the time of day. That is the question a good budtender can actually answer, and it is the same question SŌMA is built around.",
      },
    ],
    faq: [
      {
        q: "Does a higher THC percentage mean better cannabis?",
        a: "Not reliably. THC percentage measures one cannabinoid, but the overall experience depends on the full mix of cannabinoids and aromatic terpenes, plus freshness. High numbers do not guarantee a better — or even stronger-feeling — experience.",
      },
      {
        q: "Are indica and sativa labels accurate?",
        a: "They are loose shorthand rather than precise predictions. They describe broad tendencies, but a plant's actual chemistry can cut across the label, so use them as a hint and lean on aroma and effect descriptions instead.",
      },
      {
        q: "What is the most useful thing to check on a menu?",
        a: "The harvest or packaging date, where it is shown. Fresher flower retains more of the aromatic terpenes that shape the experience, so a recent date is one of the better quality signals available.",
      },
      {
        q: "What should I ask a budtender?",
        a: "Describe the experience you want — the aromas you enjoy, the effect, the time of day — rather than just asking for the strongest option. That gives them something specific to match you to.",
      },
    ],
  },
  {
    slug: "sensory-vocabulary-aromas-and-effects",
    title: "A sensory vocabulary: aromas and effects",
    description:
      "A plain-language guide to the aromas and effects that describe cannabis — and how a sensory vocabulary powers SŌMA's Taste Match.",
    readingTime: "5 min read",
    updated: "2026-06-22",
    intro: [
      "Talking about cannabis gets easier when you have words for what you sense. A small, shared vocabulary of aromas and effects lets you describe what you liked — and ask for more of it — without relying on strain names.",
      "It is also the foundation of how SŌMA works. Our Taste Match compares flower on these sensory qualities, so the better you can name what you want, the better the match.",
    ],
    body: [
      { kind: "h2", text: "The language of aroma" },
      {
        kind: "p",
        text: "Much of what we call flavour is actually aroma, carried by terpenes — the same family of aromatic compounds found across the plant world. A handful of families cover most of what you will smell:",
      },
      {
        kind: "ul",
        items: [
          "Earthy and woody — pine, soil, fresh-cut timber.",
          "Citrus and fruit — lemon, orange, berry, tropical.",
          "Floral and herbal — lavender, sage, tea.",
          "Sweet and dessert — vanilla, cream, candy.",
          "Fuel, spice and funk — diesel, pepper, sharp cheese.",
        ],
      },
      {
        kind: "p",
        text: "None of these is better than another; they are simply preferences. Noticing which families you reach for is the start of a useful profile.",
      },
      { kind: "h2", text: "The language of effect" },
      {
        kind: "p",
        text: "Effect words describe how flower tends to feel rather than how it smells. People commonly reach for terms like calm, uplifted, focused, sleepy, creative or social. They are subjective and vary with dose, setting and the individual — but as shared shorthand they make preferences communicable.",
      },
      { kind: "h2", text: "Aroma and effect are linked, loosely" },
      {
        kind: "p",
        text: "There are gentle associations between certain aromas and certain felt experiences, but they are tendencies, not rules — shaped by the whole chemistry of the plant and by you. Treat the link as a helpful prior, not a guarantee.",
      },
      { kind: "h2", text: "How SŌMA uses this" },
      {
        kind: "p",
        text: "Because names are unreliable, SŌMA describes every strain in this same sensory language and matches it against your stated preferences. You tell us the aromas and effects you favour; Taste Match finds flower whose sensory profile lines up, and the more you log what you like, the sharper it gets.",
      },
    ],
    faq: [
      {
        q: "What are terpenes?",
        a: "Terpenes are aromatic compounds found throughout the plant world, including in cannabis, and they account for much of what we perceive as a strain's smell and flavour. They are central to describing flower by its sensory profile.",
      },
      {
        q: "Do aromas predict effects?",
        a: "Only loosely. There are gentle associations between certain aromas and certain felt effects, but they are tendencies shaped by the plant's full chemistry and by the individual — useful as a prior, not a guarantee.",
      },
      {
        q: "Why describe cannabis by sensory qualities instead of strain names?",
        a: "Because a name covers many growers, phenotypes and batches, whereas aroma and effect describe the experience you actually want. Matching on sensory qualities is more reliable and more repeatable.",
      },
      {
        q: "How does this connect to SŌMA's Taste Match?",
        a: "Taste Match profiles every strain in a shared sensory vocabulary and compares it to the aromas and effects you prefer, so it recommends flower by how it is likely to feel and smell rather than by name alone.",
      },
    ],
  },
  {
    slug: "what-are-terpenes",
    title: "What are terpenes, and why they shape your experience",
    description:
      "Terpenes are the aromatic compounds behind a strain's smell and much of its character — here is what the main families are and why they matter more than a single percentage.",
    readingTime: "5 min read",
    updated: "2026-06-29",
    intro: [
      "Ask what makes one strain smell like lemon and another like diesel, and the answer is mostly terpenes — the aromatic compounds the cannabis plant shares with citrus peel, pine needles, lavender and pepper. They are why two batches with the same THC number can feel like different plants.",
      "You do not need chemistry to use them. A working sense of the main aroma families is enough to describe what you like and find more of it.",
    ],
    body: [
      { kind: "h2", text: "What terpenes actually are" },
      {
        kind: "p",
        text: "Terpenes are volatile aromatic molecules produced across the plant world; in cannabis they are made in the same resin glands as the cannabinoids. Because they are volatile, they are also the first thing to fade as flower ages or is stored badly — which is why freshness shows up first in the nose.",
      },
      { kind: "h2", text: "The main aroma families" },
      {
        kind: "p",
        text: "Rather than memorise individual terpene names, it helps to think in families you can actually smell:",
      },
      {
        kind: "ul",
        items: [
          "Earthy and herbaceous — soil, musk, cloves, a settled heaviness.",
          "Pine and woody — fresh forest, sawn timber, resin.",
          "Citrus — lemon, orange, grapefruit; bright and lifting.",
          "Floral — lavender, rose, a soft perfumed edge.",
          "Pepper and spice — black pepper, a warm sharpness.",
          "Fuel and funk — diesel, gas, sharp cheese.",
        ],
      },
      { kind: "h2", text: "Aroma, flavour and the “entourage” idea" },
      {
        kind: "p",
        text: "There is a popular idea — often called the entourage effect — that terpenes and cannabinoids work together, so the whole is more than the sum of the parts. It is a plausible and widely discussed hypothesis rather than a settled fact, and the science is still developing. Treat it as a reason to pay attention to the full aromatic picture, not as a formula.",
      },
      { kind: "h2", text: "Why this beats chasing a percentage" },
      {
        kind: "p",
        text: "A single THC figure tells you almost nothing about how flower will smell, taste or feel. The terpene picture — what you can actually sense — is a richer guide. Noticing which families you reach for again and again is the start of a profile you can use.",
      },
      {
        kind: "p",
        text: "That is exactly how SŌMA works: it describes strains in this aroma language and matches them to the families you prefer.",
      },
    ],
    faq: [
      {
        q: "What are terpenes in simple terms?",
        a: "They are the aromatic compounds responsible for a strain's smell and much of its flavour — the same kind of molecules that make citrus, pine and lavender smell the way they do. In cannabis they are produced in the same resin glands as the cannabinoids.",
      },
      {
        q: "Do terpenes get you high?",
        a: "Terpenes are aromatic compounds, not the intoxicating cannabinoid (THC). They shape aroma and flavour and are thought by some to influence the character of the experience, but they are not what produces the high.",
      },
      {
        q: "Is the entourage effect real?",
        a: "It is a widely discussed hypothesis that terpenes and cannabinoids interact to shape the overall experience. It is plausible and much talked about, but the science is still developing — treat it as a reason to consider the full aroma picture, not as an established rule.",
      },
      {
        q: "Why do terpenes matter more than the THC percentage?",
        a: "Because the THC number does not predict smell, flavour or how flower will feel, whereas the terpene picture — what you can actually sense — describes the experience you are choosing. It is a more useful guide than a single figure.",
      },
    ],
  },
  {
    slug: "indica-sativa-hybrid-explained",
    title: "Indica, sativa and hybrid: what the labels really mean",
    description:
      "The indica/sativa/hybrid split is the most common shorthand on any menu — and the most misunderstood. Here is what it does and does not tell you.",
    readingTime: "5 min read",
    updated: "2026-06-29",
    intro: [
      "Almost every menu sorts cannabis into indica, sativa or hybrid, and almost every newcomer is told indica means “relaxing” and sativa means “energising.” It is a useful starting vocabulary — and a shaky predictor. Here is how to hold it.",
    ],
    body: [
      { kind: "h2", text: "Where the labels come from" },
      {
        kind: "p",
        text: "The terms began as botanical descriptions of plants that grew in different regions and looked different — broad versus narrow leaves, short versus tall. Over decades of crossbreeding, almost everything on a modern menu is a hybrid, and the original botanical lines have largely blurred.",
      },
      { kind: "h2", text: "What they loosely signal" },
      {
        kind: "p",
        text: "As shorthand, the labels still carry rough associations: “indica” for a heavier, settling feel, “sativa” for a brighter, more active one, “hybrid” for somewhere between. Plenty of people find these hints directionally useful, especially when paired with the aroma and effect notes on a listing.",
      },
      { kind: "h2", text: "Why they are unreliable on their own" },
      {
        kind: "p",
        text: "The trouble is that effect is driven by the plant's actual chemistry — its mix of cannabinoids and terpenes — plus dose, setting and you. Two “sativas” can feel nothing alike, and a given plant can cut right across the label. The category is a hint, not a guarantee.",
      },
      { kind: "h3", text: "A more reliable approach" },
      {
        kind: "ul",
        items: [
          "Read the aroma and effect description, not just the category.",
          "Note the experiences you actually want — calm, focus, social, sleep.",
          "Track what worked by its sensory profile, not only its label.",
        ],
      },
      { kind: "h2", text: "How SŌMA treats the labels" },
      {
        kind: "p",
        text: "SŌMA records the type for orientation but matches on sensory qualities — aroma, flavour and effect — because that describes the experience far more precisely than a three-way split ever could.",
      },
    ],
    faq: [
      {
        q: "Is indica always relaxing and sativa always energising?",
        a: "No. Those associations are a rough shorthand, not a rule. The felt effect depends on the plant's full chemistry plus dose, setting and the individual, so the label is a hint rather than a guarantee.",
      },
      {
        q: "What is a hybrid?",
        a: "A hybrid is a cross between different lineages, which today describes the large majority of cannabis on the market. Decades of crossbreeding mean most strains are hybrids to some degree.",
      },
      {
        q: "If the labels are unreliable, why do menus still use them?",
        a: "Because they are a simple, familiar starting vocabulary. They give a broad sense of direction; they just should not be treated as a precise prediction of how flower will feel.",
      },
      {
        q: "What should I rely on instead?",
        a: "Lean on the aroma and effect description and on the experiences you actually want, and track what worked by its sensory profile. That is more reliable than the indica/sativa/hybrid split alone.",
      },
    ],
  },
  {
    slug: "why-freshness-matters",
    title: "Why freshness matters: harvest date and the cure",
    description:
      "Cannabis is perishable, and freshness shapes aroma, smoothness and strength. Here is what curing does, why the harvest date matters, and how to read freshness.",
    readingTime: "5 min read",
    updated: "2026-06-29",
    intro: [
      "Cannabis is an agricultural product, and like coffee or tea it is at its best within a window rather than forever. Two things decide where flower sits in that window: how well it was cured after harvest, and how long ago that was.",
    ],
    body: [
      { kind: "h2", text: "What curing does" },
      {
        kind: "p",
        text: "After harvest and an initial dry, flower is cured — rested in controlled conditions over a period of time. A careful cure lets harshness mellow and the aroma settle and deepen. A rushed or careless cure leaves flower that smells flat or feels rough, no matter how good the genetics were.",
      },
      { kind: "h2", text: "Why the harvest date matters" },
      {
        kind: "p",
        text: "Once flower is finished, time keeps working on it. The aromatic terpenes are volatile and fade first, so the nose dulls before anything else. That is why a harvest or packaging date is one of the most useful pieces of information on a label — it tells you roughly where in the window you are buying.",
      },
      { kind: "h3", text: "Reading freshness for yourself" },
      {
        kind: "ul",
        items: [
          "A clear, recent harvest or packaging date.",
          "A lively, distinct aroma rather than a faint or hay-like one.",
          "Flower that is neither crumbling-dry nor damp to the touch.",
          "Storage that protects it — sealed, cool and out of bright light.",
        ],
      },
      { kind: "h2", text: "Freshness is part of quality" },
      {
        kind: "p",
        text: "It is worth remembering that the same strain can be excellent from one source and flat from another, largely because of curing, freshness and storage. Good genetics are a starting point; freshness is what carries them to you.",
      },
      {
        kind: "p",
        text: "Once you have fresh flower, storing it well keeps it that way — see our guide on storing cannabis — and matching by sensory qualities helps you recognise what good actually smells like.",
      },
    ],
    faq: [
      {
        q: "Does cannabis go bad?",
        a: "It does not spoil like food overnight, but it is perishable: aroma, smoothness and potency decline over time, especially if it is stored warm, bright or in air. Improperly stored damp flower can also develop mould.",
      },
      {
        q: "What does curing do?",
        a: "Curing rests flower in controlled conditions after the initial dry, letting harshness mellow and the aroma settle and deepen. A careful cure is a large part of why some flower smells and smokes far better than another batch of the same strain.",
      },
      {
        q: "Why is the harvest date important?",
        a: "Because the volatile aromatic terpenes fade with time, so the harvest or packaging date tells you roughly how fresh the flower is. A clear, recent date is one of the better quality signals on a label.",
      },
      {
        q: "How can I tell if flower is fresh?",
        a: "Look for a recent date, a lively and distinct aroma, and flower that is neither crumbling-dry nor damp. Storage that keeps it sealed, cool and out of light is another good sign.",
      },
    ],
  },
  {
    slug: "how-to-taste-cannabis",
    title: "How to taste cannabis like a sommelier",
    description:
      "A simple, repeatable way to assess cannabis by appearance, aroma and flavour — the same sensory approach behind SŌMA's Taste Match.",
    readingTime: "5 min read",
    updated: "2026-06-29",
    intro: [
      "Wine has a tasting ritual; so does coffee. Cannabis rewards the same kind of attention. Slowing down to actually observe what is in front of you turns a vague impression into something you can describe, remember and ask for again.",
      "Here is a simple, repeatable sequence — no special equipment, just your senses.",
    ],
    body: [
      { kind: "h2", text: "1. Look" },
      {
        kind: "p",
        text: "Start with the eyes. Note the colour and the frosting of resin on the surface. Well-kept flower looks alive rather than dull or grey. This is observation, not judgement — you are building a habit of noticing.",
      },
      { kind: "h2", text: "2. Smell" },
      {
        kind: "p",
        text: "Aroma is where most of the character lives. Take a gentle sniff and try to place it in a family — earthy, citrus, pine, floral, fuel, spice. Then look for a second and third note underneath the first. Naming what you smell is the single most useful tasting skill.",
      },
      { kind: "h2", text: "3. Note the flavour" },
      {
        kind: "p",
        text: "Flavour often echoes aroma but not always — sometimes a citrus nose carries a peppery or earthy taste. Ask whether the flavour matches the smell, and which notes stand out.",
      },
      { kind: "h2", text: "4. Record it" },
      {
        kind: "p",
        text: "The step most people skip. Jot down a few words — the aroma family, what stood out, how it felt and when you used it. Over a handful of entries a pattern appears: the qualities you reliably enjoy. That record is worth more than any strain name.",
      },
      { kind: "h2", text: "Turning notes into matches" },
      {
        kind: "p",
        text: "This is the method SŌMA is built around. Taste Match captures the aromas and effects you respond to and finds flower whose sensory profile lines up — so your own palate, not a label, does the choosing.",
      },
    ],
    faq: [
      {
        q: "How do I taste cannabis properly?",
        a: "Move through the senses in order: look at the flower, smell it and try to name the aroma families, note whether the flavour matches the smell, and record a few words afterwards. Slowing down and naming what you sense is the core of it.",
      },
      {
        q: "What should I smell for?",
        a: "Try to place the aroma in a family — earthy, citrus, pine, floral, fuel or spice — and then look for secondary notes underneath the first. Identifying these families is the most useful sensory skill.",
      },
      {
        q: "Do I need any special equipment?",
        a: "No. The approach uses only your eyes and nose and a place to jot a few notes. The discipline is in paying attention and writing it down, not in any tool.",
      },
      {
        q: "How does this relate to SŌMA's Taste Match?",
        a: "Taste Match is the same idea, organised: it captures the aromas and effects you respond to and matches flower with a similar sensory profile, so your palate guides the choice rather than a strain name.",
      },
    ],
  },
];

export function getArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}

export function articleSlugs(): string[] {
  return LEARN_ARTICLES.map((a) => a.slug);
}
