// Quick-start taste presets — eight ready-made profiles a new user can pick in
// one tap instead of filling the full questionnaire. Each one fills enough of
// the profile to clear the match gate (MATCH_GATE_PERCENT) and read a real
// taste, and can be refined afterwards. The ninth option ("Custom") is the
// full questionnaire. All strains here resolve in the catalogue, and every
// aroma / flavour / effect token is a real vocab value, so a preset anchors
// cleanly.

import { EMPTY_PROFILE, type TasteProfileState } from "./profile-state";

export type Preset = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  aromaChips: string[]; // for the card (raw tokens, labelled in the UI)
  effectChips: string[];
  profile: TasteProfileState;
};

function build(over: Partial<TasteProfileState>): TasteProfileState {
  return { ...EMPTY_PROFILE, lookingFor: "new", ...over };
}

export const PRESETS: Preset[] = [
  {
    id: "gas",
    name: "Gas Head",
    emoji: "🛢️",
    tagline: "Loud diesel & fuel, heavy and euphoric.",
    aromaChips: ["gassy", "diesel", "earthy"],
    effectChips: ["relaxed", "euphoric", "happy"],
    profile: build({
      favoriteStrains: ["GG4", "Gary Payton", "Chemdawg", "OG Kush"],
      preferredAromas: ["gassy", "diesel", "earthy", "pine"],
      preferredFlavors: ["gassy", "diesel", "earthy"],
      preferredEffects: ["relaxed", "euphoric", "happy", "calm"],
      dislikedAromas: ["floral", "mint"],
      primaryAroma: "gas",
      primaryEffect: "calm",
      useTime: "evening",
      preferredType: "hybrid",
      bodyFeel: 65,
      potencyPreference: "strong",
      likedTraits: ["terpy", "loud-smell", "sticky"],
    }),
  },
  {
    id: "funk",
    name: "Loud Funk",
    emoji: "🧀",
    tagline: "Skunky, cheesy, classic and social.",
    aromaChips: ["skunky", "cheese", "earthy"],
    effectChips: ["happy", "uplifted", "giggly"],
    profile: build({
      favoriteStrains: ["Skunk #1", "Sour Diesel", "GMO", "Cheese"],
      preferredAromas: ["skunky", "cheese", "earthy", "diesel"],
      preferredFlavors: ["skunky", "cheese", "earthy"],
      preferredEffects: ["happy", "uplifted", "giggly", "euphoric"],
      dislikedAromas: ["mint"],
      primaryAroma: "earthfunk",
      primaryEffect: "social",
      useTime: "anytime",
      preferredType: "hybrid",
      bodyFeel: 50,
      potencyPreference: "balanced",
      likedTraits: ["terpy", "loud-smell", "well-cured"],
    }),
  },
  {
    id: "candy",
    name: "Candy & Fruit",
    emoji: "🍬",
    tagline: "Sweet, fruity, juicy modern hybrids.",
    aromaChips: ["sweet", "fruity", "berry"],
    effectChips: ["euphoric", "happy", "relaxed"],
    profile: build({
      favoriteStrains: ["Zkittlez", "Runtz", "Gelato", "Sherbet"],
      preferredAromas: ["sweet", "fruity", "berry", "tropical"],
      preferredFlavors: ["sweet", "fruity", "berry"],
      preferredEffects: ["euphoric", "happy", "relaxed", "giggly"],
      dislikedAromas: ["diesel", "gassy"],
      primaryAroma: "sweet",
      primaryEffect: "lifted",
      useTime: "anytime",
      preferredType: "hybrid",
      bodyFeel: 45,
      potencyPreference: "balanced",
      likedTraits: ["terpy", "frosty", "smooth"],
    }),
  },
  {
    id: "citrus",
    name: "Citrus Lift",
    emoji: "🍋",
    tagline: "Zesty, piney sativas for the daytime.",
    aromaChips: ["citrus", "pine", "sweet"],
    effectChips: ["energetic", "focused", "creative"],
    profile: build({
      favoriteStrains: ["Super Lemon Haze", "Jack Herer", "Tangie", "Durban Poison"],
      preferredAromas: ["citrus", "pine", "sweet"],
      preferredFlavors: ["citrus", "sweet"],
      preferredEffects: ["energetic", "focused", "creative", "uplifted"],
      dislikedEffects: ["sleepy", "couch-lock"],
      primaryAroma: "citrus",
      primaryEffect: "sharp",
      useTime: "daytime",
      preferredType: "sativa",
      bodyFeel: 25,
      potencyPreference: "balanced",
      likedTraits: ["terpy", "smooth", "loud-smell"],
    }),
  },
  {
    id: "kush",
    name: "Kush & Pine",
    emoji: "🌲",
    tagline: "Earthy, piney indicas for nightfall.",
    aromaChips: ["earthy", "pine", "woody"],
    effectChips: ["relaxed", "sleepy", "calm"],
    profile: build({
      favoriteStrains: ["OG Kush", "Bubba Kush", "Northern Lights", "Granddaddy Purple"],
      preferredAromas: ["earthy", "pine", "woody"],
      preferredFlavors: ["earthy", "pine"],
      preferredEffects: ["relaxed", "sleepy", "calm", "body-heavy"],
      primaryAroma: "pineherb",
      primaryEffect: "knockout",
      useTime: "bed",
      preferredType: "indica",
      bodyFeel: 80,
      potencyPreference: "strong",
      likedTraits: ["terpy", "sticky", "well-cured"],
    }),
  },
  {
    id: "dessert",
    name: "Dessert & Cream",
    emoji: "🍰",
    tagline: "Creamy, vanilla, nutty bakery notes.",
    aromaChips: ["creamy", "vanilla", "sweet"],
    effectChips: ["relaxed", "euphoric", "happy"],
    profile: build({
      favoriteStrains: ["Wedding Cake", "Cereal Milk", "Biscotti", "Ice Cream Cake"],
      preferredAromas: ["creamy", "vanilla", "nutty", "sweet"],
      preferredFlavors: ["creamy", "vanilla", "sweet"],
      preferredEffects: ["relaxed", "euphoric", "happy", "calm"],
      dislikedAromas: ["gassy", "skunky"],
      primaryAroma: "sweet",
      primaryEffect: "calm",
      useTime: "evening",
      preferredType: "hybrid",
      bodyFeel: 60,
      potencyPreference: "balanced",
      likedTraits: ["smooth", "frosty", "well-cured"],
    }),
  },
  {
    id: "floral",
    name: "Floral & Exotic",
    emoji: "💜",
    tagline: "Grape, lavender and exotic purples.",
    aromaChips: ["floral", "grape", "berry"],
    effectChips: ["calm", "euphoric", "relaxed"],
    profile: build({
      favoriteStrains: ["Granddaddy Purple", "Grape Ape", "Lavender", "Zkittlez"],
      preferredAromas: ["floral", "grape", "berry", "sweet"],
      preferredFlavors: ["grape", "berry", "sweet"],
      preferredEffects: ["calm", "euphoric", "relaxed", "happy"],
      dislikedAromas: ["diesel"],
      primaryAroma: "fruit",
      primaryEffect: "calm",
      useTime: "evening",
      preferredType: "indica",
      bodyFeel: 65,
      potencyPreference: "strong",
      likedTraits: ["terpy", "frosty", "smooth"],
    }),
  },
  {
    id: "tropical",
    name: "Tropical",
    emoji: "🏝️",
    tagline: "Mango, guava, pineapple — beachy lift.",
    aromaChips: ["tropical", "fruity", "citrus"],
    effectChips: ["uplifted", "happy", "energetic"],
    profile: build({
      favoriteStrains: ["Pineapple Express", "Maui Wowie", "Guava", "Mango"],
      preferredAromas: ["tropical", "fruity", "citrus", "sweet"],
      preferredFlavors: ["tropical", "fruity"],
      preferredEffects: ["uplifted", "happy", "energetic", "euphoric"],
      dislikedEffects: ["couch-lock"],
      primaryAroma: "fruit",
      primaryEffect: "lifted",
      useTime: "daytime",
      preferredType: "sativa",
      bodyFeel: 30,
      potencyPreference: "balanced",
      likedTraits: ["terpy", "loud-smell", "smooth"],
    }),
  },
];
