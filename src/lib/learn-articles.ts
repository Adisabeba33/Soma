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
];

export function getArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}

export function articleSlugs(): string[] {
  return LEARN_ARTICLES.map((a) => a.slug);
}
