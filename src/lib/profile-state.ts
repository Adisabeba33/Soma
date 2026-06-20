export interface TasteProfileState {
  favoriteStrains: string[];
  dislikedStrains: string[];
  likedTraits: string[];
  dislikedTraits: string[];
  preferredAromas: string[];
  preferredFlavors: string[];
  preferredEffects: string[];
  dislikedEffects: string[];
  avoidedRisks: string[];
  texturePreferences: string[];
  qualityPriorities: string[];
  referenceStrain: string;
  lookingFor: "similar" | "new";
  // Forced-choice dimensions. "" = not answered yet; bodyFeel null = no pick.
  primaryAroma: string;
  primaryEffect: string;
  useTime: string;
  smokingMethods: string[];
  budStructure: string;
  bodyFeel: number | null;
  potencyPreference: string;
  dislikedAromas: string[];
  preferredFamilies: string[];
  avoidedFamilies: string[];
  notes: string;
}

export const EMPTY_PROFILE: TasteProfileState = {
  favoriteStrains: [],
  dislikedStrains: [],
  likedTraits: [],
  dislikedTraits: [],
  preferredAromas: [],
  preferredFlavors: [],
  preferredEffects: [],
  dislikedEffects: [],
  avoidedRisks: [],
  texturePreferences: [],
  qualityPriorities: [],
  referenceStrain: "",
  lookingFor: "similar",
  primaryAroma: "",
  primaryEffect: "",
  useTime: "",
  smokingMethods: [],
  budStructure: "",
  bodyFeel: null,
  potencyPreference: "",
  dislikedAromas: [],
  preferredFamilies: [],
  avoidedFamilies: [],
  notes: "",
};

interface RawProfile {
  favoriteStrains?: string[] | null;
  dislikedStrains?: string[] | null;
  likedTraits?: string[] | null;
  dislikedTraits?: string[] | null;
  preferredAromas?: string[] | null;
  preferredFlavors?: string[] | null;
  preferredEffects?: string[] | null;
  dislikedEffects?: string[] | null;
  avoidedRisks?: string[] | null;
  texturePreferences?: string[] | null;
  qualityPriorities?: string[] | null;
  referenceStrain?: string | null;
  lookingFor?: string | null;
  primaryAroma?: string | null;
  primaryEffect?: string | null;
  useTime?: string | null;
  smokingMethods?: string[] | null;
  budStructure?: string | null;
  bodyFeel?: number | null;
  potencyPreference?: string | null;
  dislikedAromas?: string[] | null;
  preferredFamilies?: string[] | null;
  avoidedFamilies?: string[] | null;
  notes?: string | null;
}

export function profileFromApi(raw: RawProfile | null | undefined): {
  state: TasteProfileState;
  exists: boolean;
} {
  if (!raw) return { state: { ...EMPTY_PROFILE }, exists: false };
  return {
    exists: true,
    state: {
      favoriteStrains: raw.favoriteStrains ?? [],
      dislikedStrains: raw.dislikedStrains ?? [],
      likedTraits: raw.likedTraits ?? [],
      dislikedTraits: raw.dislikedTraits ?? [],
      preferredAromas: raw.preferredAromas ?? [],
      preferredFlavors: raw.preferredFlavors ?? [],
      preferredEffects: raw.preferredEffects ?? [],
      dislikedEffects: raw.dislikedEffects ?? [],
      avoidedRisks: raw.avoidedRisks ?? [],
      texturePreferences: raw.texturePreferences ?? [],
      qualityPriorities: raw.qualityPriorities ?? [],
      referenceStrain: raw.referenceStrain ?? "",
      lookingFor: raw.lookingFor === "new" ? "new" : "similar",
      primaryAroma: raw.primaryAroma ?? "",
      primaryEffect: raw.primaryEffect ?? "",
      useTime: raw.useTime ?? "",
      smokingMethods: raw.smokingMethods ?? [],
      budStructure: raw.budStructure ?? "",
      bodyFeel: typeof raw.bodyFeel === "number" ? raw.bodyFeel : null,
      potencyPreference: raw.potencyPreference ?? "",
      dislikedAromas: raw.dislikedAromas ?? [],
      preferredFamilies: raw.preferredFamilies ?? [],
      avoidedFamilies: raw.avoidedFamilies ?? [],
      notes: raw.notes ?? "",
    },
  };
}

// Has the person given the engine enough to work with?
export function profileHasSignal(state: TasteProfileState): boolean {
  return (
    state.favoriteStrains.length > 0 ||
    state.preferredAromas.length > 0 ||
    state.preferredEffects.length > 0 ||
    state.likedTraits.length > 0
  );
}

export const POPULAR_STRAINS = [
  "GG4",
  "Blue Dream",
  "OG Kush",
  "Gelato",
  "Northern Lights",
  "Wedding Cake",
  "Sour Diesel",
  "Zkittlez",
  "Granddaddy Purple",
  "Runtz",
];
