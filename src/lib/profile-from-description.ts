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

const NEGATION = /\b(not|no|nothing|without|avoid|hate|hates|don'?t|doesn'?t|can'?t|cannot|never|dislike|less)\b/;

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
  if (times.length === 1) profile.useTime = times[0];

  // Primary aroma: the dominant smell family, when there's a clear winner.
  const famWinner = topByCount(aromaFamilyCounts);
  if (famWinner) profile.primaryAroma = famWinner as PrimaryAroma;

  // Primary effect: the dominant outcome, when there's a clear winner.
  const peWinner = topByCount(primaryEffectCounts);
  if (peWinner) profile.primaryEffect = peWinner as PrimaryEffect;

  // Body-feel: rough slider from explicit weight language.
  const heavy = /\b(heavy|body|couch|sedat\w*|knock\w*|pinned|in ?the ?body|physical|stone)\b/.test(text);
  const light = /\b(light|clear ?head\w*|functional|not ?heavy|daytime|productive|energ\w*|clean)\b/.test(text);
  if (heavy && !light) profile.bodyFeel = 72;
  else if (light && !heavy) profile.bodyFeel = 30;

  // Potency preference: how hard-hitting they want it. "not too strong" reads
  // as mild; an unqualified "strong/potent" as strong.
  const wantsMild =
    /\b(mild|easy[- ]?going|easy|beginner|low ?key|lowkey|gentle|microdose|not ?too ?(strong|potent|heavy)|nothing ?too ?(strong|potent|heavy))\b/.test(
      text,
    );
  const wantsStrong =
    /\b(strong|potent|heavy[- ]?hit\w*|hard[- ]?hit\w*|pack\w* a punch|high ?tolerance)\b/.test(
      text,
    );
  // Mild wins ties: its cues are more specific and include "(not) too
  // strong", which also trips the bare-"strong" check below.
  if (wantsMild) profile.potencyPreference = "mild";
  else if (wantsStrong) profile.potencyPreference = "strong";

  // Looking-for: explicit appetite for novelty.
  if (/\b(new|different|surprise|explore|adventurous|something ?else|try ?something|branch ?out)\b/.test(text)) {
    profile.lookingFor = "new";
  }

  return profile;
}
