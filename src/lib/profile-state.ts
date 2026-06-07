export interface TasteProfileState {
  favoriteStrains: string[];
  dislikedStrains: string[];
  likedTraits: string[];
  dislikedTraits: string[];
  preferredAromas: string[];
  preferredFlavors: string[];
  preferredEffects: string[];
  texturePreferences: string[];
  qualityPriorities: string[];
  referenceStrain: string;
  lookingFor: "similar" | "new";
  // Forced-choice dimensions. "" = not answered yet; bodyFeel null = no pick.
  primaryAroma: string;
  primaryEffect: string;
  useTime: string;
  bodyFeel: number | null;
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
  texturePreferences: [],
  qualityPriorities: [],
  referenceStrain: "",
  lookingFor: "similar",
  primaryAroma: "",
  primaryEffect: "",
  useTime: "",
  bodyFeel: null,
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
  texturePreferences?: string[] | null;
  qualityPriorities?: string[] | null;
  referenceStrain?: string | null;
  lookingFor?: string | null;
  primaryAroma?: string | null;
  primaryEffect?: string | null;
  useTime?: string | null;
  bodyFeel?: number | null;
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
      texturePreferences: raw.texturePreferences ?? [],
      qualityPriorities: raw.qualityPriorities ?? [],
      referenceStrain: raw.referenceStrain ?? "",
      lookingFor: raw.lookingFor === "new" ? "new" : "similar",
      primaryAroma: raw.primaryAroma ?? "",
      primaryEffect: raw.primaryEffect ?? "",
      useTime: raw.useTime ?? "",
      bodyFeel: typeof raw.bodyFeel === "number" ? raw.bodyFeel : null,
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
