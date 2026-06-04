import type { TasteProfileInput } from "../../src/lib/types";

// Seven synthetic archetypes used for stress-testing the engine.
// Every field uses exact vocab values from src/lib/vocab.ts so scoring
// behaves the same as a real saved profile.
//
// Archetypes are intentionally distinct: if the engine is reasoning per
// person, GG4 should read very differently for `heavy-sleeper` than for
// `daytime-creative`.

export interface Archetype {
  key: string;
  label: string;
  description: string;
  profile: TasteProfileInput;
}

function profile(p: Partial<TasteProfileInput>): TasteProfileInput {
  return {
    favoriteStrains: [],
    dislikedStrains: [],
    likedTraits: [],
    dislikedTraits: [],
    preferredAromas: [],
    preferredFlavors: [],
    preferredEffects: [],
    texturePreferences: [],
    qualityPriorities: [],
    referenceStrain: null,
    lookingFor: "similar",
    notes: null,
    ...p,
  };
}

export const ARCHETYPES: Archetype[] = [
  {
    key: "chill-evening",
    label: "Chill evening",
    description: "Wind-down, soft body, no edge",
    profile: profile({
      preferredAromas: ["sweet", "creamy", "berry", "floral"],
      preferredFlavors: ["sweet", "creamy", "berry", "vanilla"],
      preferredEffects: ["relaxed", "calm", "happy", "body-heavy"],
      likedTraits: ["smooth", "well-cured", "dense-buds", "terpy"],
      dislikedTraits: ["harsh", "too-light", "sharp-citrus"],
      texturePreferences: ["dense", "well-cured", "moist"],
      qualityPriorities: ["body-feel", "taste", "freshness"],
      favoriteStrains: ["Wedding Cake"],
    }),
  },
  {
    key: "daytime-creative",
    label: "Daytime creative",
    description: "Focus, clean head-up, no couch",
    profile: profile({
      preferredAromas: ["citrus", "pine", "herbal", "tropical"],
      preferredFlavors: ["citrus", "pine", "herbal", "tropical"],
      preferredEffects: [
        "uplifted",
        "focused",
        "creative",
        "energetic",
        "head-high",
      ],
      likedTraits: ["loud-smell", "terpy", "dense-buds"],
      dislikedTraits: ["too-heavy", "hay-smell", "harsh"],
      texturePreferences: ["dense", "frosty"],
      qualityPriorities: ["head-feel", "focus", "creativity", "aroma"],
      favoriteStrains: ["Super Lemon Haze"],
      lookingFor: "similar",
    }),
  },
  {
    key: "heavy-sleeper",
    label: "Heavy sleeper",
    description: "Deep body, knock-out, end of day",
    profile: profile({
      preferredAromas: ["earthy", "woody", "sweet", "spicy"],
      preferredFlavors: ["earthy", "woody", "sweet", "grape"],
      preferredEffects: ["sleepy", "couch-lock", "body-heavy", "relaxed"],
      likedTraits: ["heavy-body", "dense-buds", "potent", "sticky"],
      dislikedTraits: ["too-light", "sharp-citrus", "weak-smell"],
      texturePreferences: ["dense", "sticky", "frosty"],
      qualityPriorities: ["sleep", "body-feel", "potency"],
      favoriteStrains: ["Granddaddy Purple", "Northern Lights"],
    }),
  },
  {
    key: "sour-citrus-head",
    label: "Sour citrus head",
    description: "Loud diesel-and-zest, head-forward",
    profile: profile({
      preferredAromas: ["citrus", "diesel", "gassy", "skunky"],
      preferredFlavors: ["citrus", "gassy", "spicy"],
      preferredEffects: ["energetic", "head-high", "uplifted", "euphoric"],
      likedTraits: ["loud-smell", "terpy", "gassy", "potent"],
      dislikedTraits: ["too-heavy", "weak-smell", "bland-taste"],
      texturePreferences: ["sticky", "frosty"],
      qualityPriorities: ["aroma", "potency", "head-feel"],
      favoriteStrains: ["Sour Diesel"],
    }),
  },
  {
    key: "dessert-couch-lock",
    label: "Dessert couch-lock",
    description: "Sweet/creamy nose, settled body",
    profile: profile({
      preferredAromas: ["sweet", "creamy", "fruity", "tropical"],
      preferredFlavors: ["sweet", "creamy", "vanilla", "fruity"],
      preferredEffects: [
        "relaxed",
        "euphoric",
        "body-heavy",
        "happy",
        "couch-lock",
      ],
      likedTraits: ["frosty", "sticky", "terpy", "potent"],
      dislikedTraits: ["harsh", "sharp-citrus", "hay-smell"],
      texturePreferences: ["sticky", "frosty", "dense"],
      qualityPriorities: ["taste", "body-feel", "potency"],
      favoriteStrains: ["Runtz", "Wedding Cake"],
    }),
  },
  {
    key: "cheese-funk",
    label: "Cheese / funk",
    description: "Pungent, hungry, sociable",
    profile: profile({
      preferredAromas: ["cheese", "skunky", "earthy", "herbal"],
      preferredFlavors: ["earthy", "spicy", "herbal"],
      preferredEffects: ["relaxed", "happy", "hungry", "giggly"],
      likedTraits: ["loud-smell", "earthy", "gassy"],
      dislikedTraits: ["too-light", "dry-flower", "bland-taste"],
      texturePreferences: ["dense", "moist"],
      qualityPriorities: ["aroma", "taste"],
      favoriteStrains: ["GMO Cookies"],
    }),
  },
  {
    key: "blank-slate",
    label: "Blank slate",
    description: "Almost no preferences expressed (exploration)",
    profile: profile({
      preferredAromas: ["sweet"],
      preferredEffects: ["happy"],
      lookingFor: "new",
    }),
  },
];
