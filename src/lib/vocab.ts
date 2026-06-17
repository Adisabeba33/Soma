// Shared sensory vocabulary. The questionnaire, the strain dataset and the
// Taste Match Engine all draw from these canonical option sets so that
// preferences and strain attributes line up exactly.

// Audit log marker — bump when the vocab tokens or labels change in a way
// that affects how older audit entries should be interpreted (additive,
// renamed, subdivided, etc). Audit readers pivot on this to apply
// translation maps or filter to a single vocab era.
export const VOCAB_VERSION = "v3";

export interface Option {
  value: string;
  label: string;
}

export const AROMAS: Option[] = [
  { value: "gassy", label: "Gas / fuel" },
  { value: "diesel", label: "Diesel" },
  { value: "earthy", label: "Earthy" },
  { value: "pine", label: "Pine / forest" },
  { value: "citrus", label: "Citrus" },
  { value: "sweet", label: "Sweet" },
  { value: "fruity", label: "Fruity" },
  { value: "berry", label: "Berry" },
  { value: "tropical", label: "Tropical" },
  { value: "floral", label: "Floral" },
  { value: "herbal", label: "Herbal" },
  { value: "spicy", label: "Spicy / peppery" },
  { value: "woody", label: "Woody" },
  { value: "skunky", label: "Skunky" },
  { value: "cheese", label: "Cheese / funk" },
  { value: "creamy", label: "Creamy / vanilla" },
  // v2: added so strains that tag vanilla aroma (Birthday Cake, Gelato
  // Cake, LA Kush Cake, Moby Dick) are addressable in the questionnaire.
  { value: "vanilla", label: "Vanilla" },
  // v3: mint & grape exist on the palate (FLAVORS) but their *nose* had no
  // token, so menthol-forward strains (Kush Mints, The Menthol) and grape
  // strains parked the aroma in herbal/berry. Added so the aroma is
  // addressable and re-taggable.
  { value: "mint", label: "Mint" },
  { value: "grape", label: "Grape" },
];

export const FLAVORS: Option[] = [
  { value: "gassy", label: "Gassy" },
  { value: "earthy", label: "Earthy" },
  { value: "citrus", label: "Citrus" },
  { value: "sweet", label: "Sweet" },
  { value: "fruity", label: "Fruity" },
  { value: "berry", label: "Berry" },
  { value: "tropical", label: "Tropical" },
  { value: "pine", label: "Pine" },
  { value: "spicy", label: "Spicy" },
  { value: "herbal", label: "Herbal" },
  { value: "creamy", label: "Creamy" },
  { value: "woody", label: "Woody" },
  { value: "nutty", label: "Nutty" },
  { value: "mint", label: "Mint" },
  { value: "grape", label: "Grape" },
  { value: "vanilla", label: "Vanilla" },
  // v2: added so strains that tag diesel/floral/cheese on the palate
  // are addressable in the questionnaire. Previously 18 strains carried
  // these flavor tokens but users could not select them.
  { value: "diesel", label: "Diesel" },
  { value: "floral", label: "Floral" },
  { value: "cheese", label: "Cheese / funk" },
];

export const EFFECTS: Option[] = [
  { value: "relaxed", label: "Relaxed" },
  { value: "calm", label: "Calm head" },
  { value: "sleepy", label: "Sleepy" },
  { value: "body-heavy", label: "Heavy body" },
  { value: "couch-lock", label: "Deep couch-lock" },
  { value: "euphoric", label: "Euphoric" },
  { value: "happy", label: "Happy" },
  { value: "uplifted", label: "Uplifted" },
  { value: "giggly", label: "Giggly" },
  { value: "focused", label: "Focused" },
  { value: "creative", label: "Creative" },
  { value: "energetic", label: "Energetic" },
  { value: "hungry", label: "Hungry" },
  { value: "head-high", label: "Cerebral head-high" },
];

// Merged aroma + flavour palette. For cannabis, smell ≈ taste, so the
// questionnaire asks once and feeds the selection into BOTH preferredAromas
// and preferredFlavors. The scoring engine still keeps the two dimensions
// separate; a token that doesn't exist on one side simply never matches
// there. Union of AROMAS and FLAVORS, one clean label each.
export const AROMA_FLAVOR: Option[] = [
  { value: "gassy", label: "Gas / fuel" },
  { value: "diesel", label: "Diesel" },
  { value: "earthy", label: "Earthy" },
  { value: "skunky", label: "Skunky" },
  { value: "cheese", label: "Cheese / funk" },
  { value: "woody", label: "Woody" },
  { value: "pine", label: "Pine / forest" },
  { value: "herbal", label: "Herbal" },
  { value: "mint", label: "Mint" },
  { value: "spicy", label: "Spicy / peppery" },
  { value: "citrus", label: "Citrus" },
  { value: "sweet", label: "Sweet" },
  { value: "fruity", label: "Fruity" },
  { value: "berry", label: "Berry" },
  { value: "grape", label: "Grape" },
  { value: "tropical", label: "Tropical" },
  { value: "floral", label: "Floral" },
  { value: "creamy", label: "Creamy" },
  { value: "vanilla", label: "Vanilla" },
  { value: "nutty", label: "Nutty" },
];

export const LIKED_TRAITS: Option[] = [
  { value: "gassy", label: "Gassy" },
  { value: "earthy", label: "Earthy" },
  { value: "sticky", label: "Sticky" },
  { value: "loud-smell", label: "Loud / strong smell" },
  { value: "smooth", label: "Smooth taste" },
  { value: "heavy-body", label: "Heavy body feel" },
  { value: "dense-buds", label: "Dense buds" },
  { value: "frosty", label: "Frosty / trichome-rich" },
  { value: "potent", label: "High potency" },
  { value: "well-cured", label: "Well cured" },
  { value: "terpy", label: "Terpy / flavorful" },
];

export const DISLIKED_TRAITS: Option[] = [
  { value: "dry-flower", label: "Dry flower" },
  { value: "weak-smell", label: "Weak smell" },
  { value: "hay-smell", label: "Hay / grassy smell" },
  { value: "harsh", label: "Harsh smoke" },
  { value: "sharp-citrus", label: "Sharp citrus" },
  { value: "too-light", label: "Too light / airy" },
  { value: "too-heavy", label: "Too heavy / sedating" },
  { value: "bland-taste", label: "Bland taste" },
  { value: "seedy", label: "Seeds / stems" },
];

export const QUALITY_PRIORITIES: Option[] = [
  { value: "freshness", label: "Freshness" },
  { value: "moisture", label: "Moisture" },
  { value: "aroma", label: "Aroma" },
  { value: "taste", label: "Taste" },
  { value: "potency", label: "Potency" },
  { value: "body-feel", label: "Body feel" },
  { value: "head-feel", label: "Head feel" },
  { value: "sleep", label: "Sleep" },
  { value: "focus", label: "Focus" },
  { value: "creativity", label: "Creativity" },
  { value: "appearance", label: "Appearance" },
];

export const TEXTURE_PREFERENCES: Option[] = [
  { value: "sticky", label: "Sticky" },
  { value: "dense", label: "Dense" },
  { value: "frosty", label: "Frosty" },
  { value: "moist", label: "Moist / fresh" },
  { value: "well-cured", label: "Well cured" },
  { value: "fluffy", label: "Light & fluffy" },
];

// Batch / handling related complaints. These are not strain-intrinsic — they
// depend on grower, freshness and storage, so the engine surfaces them as
// risk language rather than penalising a strain's sensory match.
export const BATCH_QUALITY_TRAITS = new Set([
  "dry-flower",
  "weak-smell",
  "hay-smell",
  "harsh",
  "bland-taste",
  "seedy",
]);

const ALL_OPTIONS: Option[] = [
  ...AROMAS,
  ...FLAVORS,
  ...EFFECTS,
  ...LIKED_TRAITS,
  ...DISLIKED_TRAITS,
  ...QUALITY_PRIORITIES,
  ...TEXTURE_PREFERENCES,
];

const LABEL_MAP = new Map(ALL_OPTIONS.map((o) => [o.value, o.label]));

export function labelFor(value: string): string {
  return (
    LABEL_MAP.get(value) ??
    value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function labelList(values: string[]): string {
  return values.map(labelFor).join(", ");
}
