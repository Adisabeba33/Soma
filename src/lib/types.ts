export type StrainType = "indica" | "sativa" | "hybrid";
export type Potency = "mild" | "moderate" | "strong" | "very-strong";

export interface StrainProfile {
  name: string;
  aliases?: string[];
  type: StrainType;
  aromas: string[];
  flavors: string[];
  effects: string[];
  traits: string[];
  potency: Potency;
  note?: string;
}

export type Category =
  | "Best Match"
  | "Closest Alternative"
  | "Worth Trying"
  | "Risky"
  | "Avoid";

export type Confidence = "low" | "medium" | "high";

export interface TasteProfileInput {
  favoriteStrains: string[];
  dislikedStrains: string[];
  likedTraits: string[];
  dislikedTraits: string[];
  preferredAromas: string[];
  preferredFlavors: string[];
  preferredEffects: string[];
  texturePreferences: string[];
  qualityPriorities: string[];
  referenceStrain?: string | null;
  lookingFor?: string | null;
  notes?: string | null;
}

export interface StrainMatch {
  strainName: string;
  resolvedName: string;
  knownStrain: boolean;
  category: Category;
  matchScore: number;
  confidence: Confidence;
  aromaMatch: number;
  flavorMatch: number;
  effectMatch: number;
  traitMatch: number;
  referenceSimilarity: number;
  matchedAromas: string[];
  matchedFlavors: string[];
  matchedEffects: string[];
  conflicts: string[];
  whyItFits: string;
  riskNotes: string;
  explanation: string;
  feedbackAdjustment: number;
  feedbackNote: string | null;
}

// A confirmed like/dislike on a past recommendation, fed back into scoring.
export interface FeedbackSignal {
  strainName: string;
  liked: boolean;
  rating: number | null;
}

export interface AnalysisResult {
  recommendations: StrainMatch[];
  engine: "builtin" | "openai";
  generatedAt: string;
}

export interface FeedbackData {
  id: string;
  purchased: boolean | null;
  liked: boolean | null;
  rating: number | null;
  notes: string | null;
}

export interface SessionRecommendation extends StrainMatch {
  id: string;
  feedback: FeedbackData | null;
}

export interface SessionSummary {
  id: string;
  title: string | null;
  saved: boolean;
  engine: string;
  inputType: string;
  createdAt: string;
  strainCount: number;
}

export interface SessionDetail extends SessionSummary {
  recommendations: SessionRecommendation[];
}

export interface ComparisonItem extends StrainMatch {
  strainType: StrainType;
  potency: Potency;
  aromas: string[];
  flavors: string[];
  effects: string[];
  useCase: string;
}
