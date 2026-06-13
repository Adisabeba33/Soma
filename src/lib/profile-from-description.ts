// Cold-start intake — turn a free-text description of what someone likes
// into a starting taste profile, so a first-time visitor who doesn't know
// strain names can just say it in their own words.
//
// Sibling of profile-from-experience.ts (which reads NAMED strains the user
// has tried). This one reads natural language: "sweet fruity stuff for the
// daytime, nothing that knocks me out" → preferred aromas/effects, disliked
// effects, a use-time, a rough body-feel. It returns the same InferredProfile
// shape, so the existing editable preview works unchanged.
//
// Deterministic keyword/synonym matching — no model call, no network, fully
// unit-testable. It only SEEDS the profile; the user edits the preview
// before saving. A richer LLM extraction can slot in behind the same
// signature later (Phase 3).

import { AROMAS, FLAVORS, EFFECTS } from "./vocab";
import {
  PRIMARY_AROMA_TOKENS,
  type PrimaryAroma,
  type PrimaryEffect,
  type UseTime,
} from "./profile-target";
import type { InferredProfile } from "./profile-from-experience";

const AROMA_VALUES = new Set(AROMAS.map((o) => o.value));
const FLAVOR_VALUES = new Set(FLAVORS.map((o) => o.value));
const EFFECT_VALUES = new Set(EFFECTS.map((o) => o.value));

// Natural words/phrases → canonical sensory token. A token is added to
// preferredAromas and/or preferredFlavors depending on which vocab it lives
// in (they overlap heavily).
const SMELL_TRIGGERS: ReadonlyArray<[string, RegExp]> = [
  ["gassy", /\b(gas|gassy|fuel|petrol)\b/],
  ["diesel", /\bdiesel\b/],
  ["earthy", /\b(earthy|earth|soil|dank|dirt)\b/],
  ["pine", /\b(pine|forest|woodsy|piney)\b/],
  ["citrus", /\b(citrus|lemon|lime|orange|zest|zesty|grapefruit)\b/],
  ["sweet", /\b(sweet|candy|sugary|sugar|dessert|syrup)\b/],
  ["fruity", /\b(fruity|fruit)\b/],
  ["berry", /\b(berry|berries|blueberry|strawberr|raspberr)\b/],
  ["tropical", /\b(tropical|mango|pineapple|guava|papaya|passion ?fruit)\b/],
  ["grape", /\b(grape)\b/],
  ["floral", /\b(floral|flower|flowery|lavender|perfume)\b/],
  ["herbal", /\b(herbal|herby|herb|tea|sage)\b/],
  ["spicy", /\b(spicy|spice|pepper|peppery)\b/],
  ["woody", /\b(woody|wood|cedar|oak)\b/],
  ["skunky", /\b(skunk|skunky)\b/],
  ["cheese", /\b(cheese|cheesy|funk|funky)\b/],
  ["creamy", /\b(creamy|cream)\b/],
  ["vanilla", /\b(vanilla)\b/],
  ["mint", /\b(mint|minty|menthol)\b/],
  ["nutty", /\b(nutty|nut)\b/],
];

const EFFECT_TRIGGERS: ReadonlyArray<[string, RegExp]> = [
  ["sleepy", /\b(sleep|sleepy|drowsy|tired|knock\w* ?(me )?out|knockout|pass\w* out|nod off|insomnia|zonk\w*|comatose|out cold)\b/],
  ["couch-lock", /\b(couch[- ]?lock\w*|couch|glued|stuck|pin(s|ned)|sedat\w*)\b/],
  ["body-heavy", /\b(heavy|body high|body buzz|body load|in ?the ?body|physical)\b/],
  ["relaxed", /\b(relax\w*|chill|mellow|unwind|wind ?down|calm down|ease)\b/],
  ["calm", /\b(calm|calming|settled|peaceful|anxiety|stress)\b/],
  ["euphoric", /\b(euphor\w*|bliss\w*|high as|zooted|blazed|stoned|ripped|blasted)\b/],
  ["happy", /\b(happy|happiness|good ?mood|cheer\w*|joy|social|sociable|chatty|talkative)\b/],
  ["uplifted", /\b(uplift\w*|lifted|upbeat|elevat\w*)\b/],
  ["giggly", /\b(giggl\w*|laugh\w*)\b/],
  ["focused", /\b(focus\w*|productive|concentrat\w*|clarity|clear ?head\w*|sharp|dialed)\b/],
  ["creative", /\b(creativ\w*|artsy|inspired|ideas)\b/],
  ["energetic", /\b(energ\w*|active|get(ting)? going|motivat\w*|buzz\w*|wired)\b/],
  ["hungry", /\b(hungry|munchies|appetite|hunger)\b/],
  ["head-high", /\b(cerebral|head ?high|heady|in ?my ?head|mental|trippy|psychedelic|racy|paranoi\w*|fry\w* (?:my )?brain)\b/],
];

const USE_TIME_TRIGGERS: ReadonlyArray<[UseTime, RegExp]> = [
  ["morning", /\b(morning|wake ?up|wake ?[-& ]?and[-& ]?bake|wake ?n ?bake|sunrise|first ?thing|start ?the ?day)\b/],
  ["daytime", /\b(day ?time|daytime|afternoon|midday|during ?the ?day|at ?work|active)\b/],
  ["evening", /\b(evening|after ?work|after ?a ?long ?day|end ?of ?(the )?day|wind ?down|unwind|decompress|nightcap|sunset|dinner)\b/],
  ["bed", /\b(night ?time|nighttime|at ?night|before ?bed|bed ?time|before ?sleep|fall ?asleep|insomnia|late ?night)\b/],
];

// Situation / activity language → the effects (and sometimes a time-of-day)
// it implies. This is how people who DON'T know strain vocabulary actually
// describe what they want: "movie night", "before the gym", "hanging with
// friends" — not "uplifted" or "body-heavy". Each cue maps to one or more
// EFFECT tokens; the optional `time` is voted only as a fallback when no
// explicit time word is present. Cues are read from the POSITIVE part of a
// clause only — we don't infer a *dislike* from a negated activity ("not for
// the gym" doesn't mean "avoid energetic").
const CONTEXT_TRIGGERS: ReadonlyArray<{
  re: RegExp;
  effects: string[];
  time?: UseTime;
}> = [
  // Social / being around people.
  {
    re: /\b(party|parties|friends?|hang(ing)? ?out|hangout|social|kick ?back|get[- ]?together|night ?out|concert|festival|gathering|with ?people)\b/,
    effects: ["happy", "giggly", "euphoric"],
  },
  // Exercise.
  {
    re: /\b(gym|work ?out|workout|exercise|lifting|lift ?weights|pre[- ]?work ?out|cardio|running|go ?for ?a ?run|jog\w*)\b/,
    effects: ["energetic", "uplifted"],
    time: "daytime",
  },
  // Outdoors / activity in nature.
  {
    re: /\b(hik\w*|outdoors?|nature|camp\w*|trail|beach|pool ?side|poolside)\b/,
    effects: ["energetic", "uplifted", "happy"],
    time: "daytime",
  },
  // Gaming.
  {
    re: /\b(video ?game\w*|gaming|gamer|play\w* ?games|controller|esports|locked ?in)\b/,
    effects: ["focused", "happy"],
  },
  // Movie / screen wind-down.
  {
    re: /\b(movie\w*|netflix|binge\w*|cinema|watch\w* ?(?:a ?)?(?:show|film|movie|tv|series))\b/,
    effects: ["relaxed", "body-heavy"],
    time: "evening",
  },
  // Decompress after the day.
  {
    re: /\b(take ?the ?edge ?off|de[- ]?stress|destress|decompress|after ?a ?(?:long|stressful|hard|rough) ?day|chill ?out)\b/,
    effects: ["relaxed", "calm"],
    time: "evening",
  },
  // Romance / intimacy.
  {
    re: /\b(date ?night|romantic|romance|intimacy|intimate|making ?love|sensual)\b/,
    effects: ["euphoric", "relaxed"],
  },
  // Yoga / meditation / mindfulness.
  {
    re: /\b(yoga|medita\w*|mindful\w*|stretch\w*|pilates|breath ?work|grounded)\b/,
    effects: ["calm", "relaxed"],
  },
  // Chores / getting things done.
  {
    re: /\b(clean\w*|chores|housework|errands|tidy\w*|laundry|dishes|productive|get ?(?:stuff|things) ?done|to[- ]?do ?list)\b/,
    effects: ["focused", "energetic"],
  },
  // Study / desk work / reading.
  {
    re: /\b(study\w*|homework|read\w* ?(?:a ?)?book|reading|work ?session|deep ?work)\b/,
    effects: ["focused"],
  },
  // Creative / making art / music.
  {
    re: /\b(paint\w*|draw\w*|music|play\w* ?(?:guitar|piano)|\bart\b|making ?art|jam\w* ?out|produc\w* ?music)\b/,
    effects: ["creative", "euphoric"],
  },
];

const NEGATION = /\b(not|no|nothing|without|avoid|hate|hates|don'?t|doesn'?t|can'?t|cannot|never|dislike|less)\b/;

// Weight / potency / novelty cue groups. Lifted to named constants so the
// describe coverage pass (describeLeftoverTerms) recognises the same words the
// inferring pass consumes — otherwise "strong" or "mild" would be flagged as
// an unrecognised leftover term.
const HEAVY_RE = /\b(heavy|body|couch|sedat\w*|knock\w*|pinned|in ?the ?body|physical|stone)\b/;
const LIGHT_RE = /\b(light|clear ?head\w*|functional|not ?heavy|daytime|productive|energ\w*|clean)\b/;
const MILD_RE = /\b(mild|easy[- ]?going|easy|beginner|low ?key|lowkey|gentle|microdose|not ?too ?(strong|potent|heavy)|nothing ?too ?(strong|potent|heavy))\b/;
const STRONG_RE = /\b(strong|potent|heavy[- ]?hit\w*|hard[- ]?hit\w*|pack\w* a punch|high ?tolerance)\b/;
const NOVELTY_RE = /\b(new|different|surprise|explore|adventurous|something ?else|try ?something|branch ?out)\b/;

// Effect → forced-choice primaryEffect bucket.
const EFFECT_TO_PRIMARY: Record<string, PrimaryEffect> = {
  sleepy: "knockout",
  "couch-lock": "knockout",
  "body-heavy": "knockout",
  relaxed: "calm",
  calm: "calm",
  happy: "social",
  giggly: "social",
  euphoric: "social",
  uplifted: "lifted",
  energetic: "lifted",
  focused: "sharp",
  creative: "sharp",
  "head-high": "sharp",
};

// aroma token → primaryAroma family.
const AROMA_TO_PRIMARY: Record<string, PrimaryAroma> = (() => {
  const m: Record<string, PrimaryAroma> = {};
  for (const [fam, tokens] of Object.entries(PRIMARY_AROMA_TOKENS)) {
    for (const t of tokens) m[t] = fam as PrimaryAroma;
  }
  return m;
})();

function emptyProfile(notes: string): InferredProfile {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    referenceStrain: "",
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    dislikedEffects: [],
    dislikedAromas: [],
    texturePreferences: [],
    qualityPriorities: [],
    primaryAroma: "",
    primaryEffect: "",
    useTime: "",
    bodyFeel: null,
    potencyPreference: "",
    preferredFamilies: [],
    avoidedFamilies: [],
    lookingFor: "similar",
    notes,
  };
}

// Split into clauses so negation stays local ("sweet but not heavy" →
// "sweet" positive, "heavy" negated). "and" does NOT start a new clause.
function clauses(text: string): string[] {
  return text
    .split(/[,.;:!?]|\bbut\b|\bexcept\b|\bjust ?not\b/)
    .map((c) => c.trim())
    .filter(Boolean);
}

// The single highest-count key, or null when there's no clear winner (no
// entries, or a tie at the top — in which case we don't force a choice).
function topByCount(counts: Map<string, number>): string | null {
  let best: string | null = null;
  let bestN = 0;
  let tied = false;
  for (const [k, n] of counts) {
    if (n > bestN) {
      best = k;
      bestN = n;
      tied = false;
    } else if (n === bestN && bestN > 0) {
      tied = true;
    }
  }
  return tied ? null : best;
}

export function inferProfileFromDescription(input: string): InferredProfile {
  const raw = (input ?? "").trim();
  const profile = emptyProfile(raw);
  if (!raw) return profile;

  const text = raw.toLowerCase();
  const aromaSet = new Set<string>();
  const flavorSet = new Set<string>();
  const effectSet = new Set<string>();
  const dislikedEffectSet = new Set<string>();
  const dislikedAromaSet = new Set<string>();
  const aromaFamilyCounts = new Map<string, number>();
  const primaryEffectCounts = new Map<string, number>();
  // Time-of-day implied by an activity ("movie" → evening), used only as a
  // fallback when no explicit time word is present.
  const contextTimeVotes = new Set<UseTime>();

  for (const clause of clauses(text)) {
    // Forward-scope negation: a cue ("not / without / no / avoid …") negates
    // everything from its position to the END of the clause — not the whole
    // clause. So "social and giggly without frying my brain" keeps social +
    // giggly positive and only negates "frying my brain".
    const negMatch = clause.match(NEGATION);
    const negIdx = negMatch?.index ?? -1;
    const positivePart = negIdx === -1 ? clause : clause.slice(0, negIdx);
    const negatedPart = negIdx === -1 ? "" : clause.slice(negIdx);

    // Comparative ("more X than Y" / "X instead of Y"): the part AFTER
    // than/instead-of is the de-emphasised side — drop it from the positive
    // signal entirely (don't prefer it, but don't mark it disliked either).
    const cmp = positivePart.match(/\b(than|instead of)\b/);
    const positiveMain =
      cmp?.index != null ? positivePart.slice(0, cmp.index) : positivePart;

    // SMELLS — wanted from the positive head, avoided from the negated tail.
    for (const [token, re] of SMELL_TRIGGERS) {
      if (re.test(positiveMain)) {
        if (AROMA_VALUES.has(token)) aromaSet.add(token);
        if (FLAVOR_VALUES.has(token)) flavorSet.add(token);
        const fam = AROMA_TO_PRIMARY[token];
        if (fam) aromaFamilyCounts.set(fam, (aromaFamilyCounts.get(fam) ?? 0) + 1);
      } else if (negatedPart && re.test(negatedPart)) {
        if (AROMA_VALUES.has(token) || FLAVOR_VALUES.has(token)) {
          dislikedAromaSet.add(token);
        }
      }
    }

    // EFFECTS — wanted from the positive head, avoided from the negated tail.
    for (const [token, re] of EFFECT_TRIGGERS) {
      if (!EFFECT_VALUES.has(token)) continue;
      if (re.test(positiveMain)) {
        effectSet.add(token);
        const pe = EFFECT_TO_PRIMARY[token];
        if (pe) primaryEffectCounts.set(pe, (primaryEffectCounts.get(pe) ?? 0) + 1);
      } else if (negatedPart && re.test(negatedPart)) {
        dislikedEffectSet.add(token);
      }
    }

    // CONTEXT / ACTIVITY — situational language ("party", "before the gym",
    // "movie night") → the effects it implies. Positive part only; a context
    // adds at most one vote per primary-effect bucket so it stays balanced
    // against the direct effect words above (a single "party" shouldn't
    // outweigh three explicit feelings).
    for (const { re, effects, time } of CONTEXT_TRIGGERS) {
      if (!re.test(positiveMain)) continue;
      const bucketsVoted = new Set<string>();
      for (const token of effects) {
        if (!EFFECT_VALUES.has(token)) continue;
        effectSet.add(token);
        const pe = EFFECT_TO_PRIMARY[token];
        if (pe && !bucketsVoted.has(pe)) {
          bucketsVoted.add(pe);
          primaryEffectCounts.set(pe, (primaryEffectCounts.get(pe) ?? 0) + 1);
        }
      }
      if (time) contextTimeVotes.add(time);
    }
  }

  // A token can't be both wanted and unwanted — explicit dislike wins.
  for (const d of dislikedEffectSet) effectSet.delete(d);
  for (const d of dislikedAromaSet) {
    aromaSet.delete(d);
    flavorSet.delete(d);
  }

  profile.preferredAromas = [...aromaSet];
  profile.preferredFlavors = [...flavorSet];
  profile.preferredEffects = [...effectSet];
  profile.dislikedEffects = [...dislikedEffectSet];
  profile.dislikedAromas = [...dislikedAromaSet];

  // Use-time: only set when a SINGLE time is indicated. Conflicting times
  // (a multi-mode describer) are left blank so the engine can stay
  // multi-modal rather than being forced onto one target.
  const times = USE_TIME_TRIGGERS.filter(([, re]) => re.test(text)).map(([t]) => t);
  if (times.length === 1) {
    profile.useTime = times[0];
  } else if (times.length === 0 && contextTimeVotes.size === 1) {
    // No explicit time word, but a single activity implied one (movie →
    // evening). Conflicting context votes stay blank, like explicit times.
    profile.useTime = [...contextTimeVotes][0];
  }

  // Primary aroma: the dominant smell family, when there's a clear winner.
  const famWinner = topByCount(aromaFamilyCounts);
  if (famWinner) profile.primaryAroma = famWinner as PrimaryAroma;

  // Primary effect: the dominant outcome, when there's a clear winner.
  const peWinner = topByCount(primaryEffectCounts);
  if (peWinner) profile.primaryEffect = peWinner as PrimaryEffect;

  // Body-feel: rough slider from explicit weight language.
  const heavy = HEAVY_RE.test(text);
  const light = LIGHT_RE.test(text);
  if (heavy && !light) profile.bodyFeel = 72;
  else if (light && !heavy) profile.bodyFeel = 30;

  // Potency preference: how hard-hitting they want it. "not too strong" reads
  // as mild; an unqualified "strong/potent" as strong. Mild wins ties: its
  // cues are more specific and include "(not) too strong", which also trips
  // the bare-"strong" check.
  if (MILD_RE.test(text)) profile.potencyPreference = "mild";
  else if (STRONG_RE.test(text)) profile.potencyPreference = "strong";

  // Looking-for: explicit appetite for novelty.
  if (NOVELTY_RE.test(text)) profile.lookingFor = "new";

  return profile;
}

// ── Describe-intake telemetry support (see docs/deferred-improvements #18) ──

// Generic filler that carries no sensory/effect meaning. Removed before
// computing leftover terms so the growth signal is just real candidate words.
const DESCRIBE_STOPWORDS = new Set([
  "the", "and", "for", "with", "without", "but", "just", "really", "very",
  "something", "some", "stuff", "thing", "things", "want", "wanna", "looking",
  "look", "like", "kind", "sort", "more", "less", "not", "nothing", "good",
  "nice", "get", "getting", "feel", "feeling", "mood", "vibe", "vibes",
  "smoke", "strain", "strains", "weed", "bud", "flower", "being", "after",
  "before", "during", "when", "what", "which", "need", "prefer", "love",
  "enjoy", "make", "makes", "can", "could", "would", "help", "helps", "day",
  "time", "one", "out", "off", "too", "are", "was", "were", "does", "going",
  "that", "this", "your", "you", "their", "them", "into", "from", "about",
]);

// Every trigger regex the parser consults — used only to mark which words a
// description "used up", so the rest can be reported as unrecognised.
const ALL_TRIGGER_REGEXES: readonly RegExp[] = [
  ...SMELL_TRIGGERS.map(([, re]) => re),
  ...EFFECT_TRIGGERS.map(([, re]) => re),
  ...CONTEXT_TRIGGERS.map((c) => c.re),
  ...USE_TIME_TRIGGERS.map(([, re]) => re),
  HEAVY_RE, LIGHT_RE, MILD_RE, STRONG_RE, NOVELTY_RE,
];

// Words consumed by any trigger over the text (lowercased, split on
// non-letters). A global clone of each regex collects every occurrence.
function coveredWords(text: string): Set<string> {
  const covered = new Set<string>();
  for (const re of ALL_TRIGGER_REGEXES) {
    const g = new RegExp(re.source, "gi");
    let m: RegExpExecArray | null;
    while ((m = g.exec(text)) !== null) {
      for (const w of m[0].toLowerCase().split(/[^a-z]+/)) {
        if (w) covered.add(w);
      }
      if (m.index === g.lastIndex) g.lastIndex++; // guard zero-length matches
    }
  }
  return covered;
}

// Content words in a description that mapped to NOTHING — the candidates for
// new synonyms. Deterministic; deduped; order preserved. This is the gold the
// telemetry collects so the parser can be grown from real misses.
export function describeLeftoverTerms(input: string): string[] {
  const text = (input ?? "").toLowerCase();
  if (!text.trim()) return [];
  const covered = coveredWords(text);
  const seen = new Set<string>();
  const leftover: string[] = [];
  for (const w of text.split(/[^a-z]+/)) {
    if (w.length < 3) continue; // drop tiny words ("tv", "go") and empties
    if (DESCRIBE_STOPWORDS.has(w)) continue;
    if (covered.has(w)) continue;
    if (seen.has(w)) continue;
    seen.add(w);
    leftover.push(w);
  }
  return leftover;
}
