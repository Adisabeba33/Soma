// Forced-choice profile dimensions + the "connection formula" that turns
// them into a single scoring target.
//
// The broad multi-selects (preferredAromas / preferredEffects) describe what
// a user *thinks* they like — a noisy, diluted signal. These three
// forced-choice questions ask the same things from a sharper angle:
//   - primaryAroma : the one smell family that stops you
//   - primaryEffect: the one outcome that matters most
//   - useTime      : when you actually reach for it
// Together they pin down a behavioural target directly, instead of leaving
// the engine to infer one from scattered favourites (which drifts on muddy
// or contradictory profiles — see docs/behavioral-layers.md).

import {
  inferProfileArchetype,
  type EffectArchetype,
} from "./effect-archetype";
import { inferProfileTexture, type EffectTexture } from "./effect-texture";
import {
  inferProfileFamily,
  type BehavioralFamily,
} from "./behavioral-family";
import type { Option } from "./vocab";
import type { TasteProfileInput } from "./types";

// ---- Forced-choice option sets (label = exact UI copy) -------------

export const PRIMARY_AROMAS: Option[] = [
  { value: "gas", label: "Gas & fuel" },
  { value: "earthfunk", label: "Earth & funk" },
  { value: "citrus", label: "Citrus & zest" },
  { value: "sweet", label: "Sweet & dessert" },
  { value: "fruit", label: "Fruit & tropical" },
  { value: "pineherb", label: "Pine, herb & spice" },
];

export const PRIMARY_EFFECTS: Option[] = [
  { value: "calm", label: "Calm & settled" },
  { value: "knockout", label: "Knocked out" },
  { value: "social", label: "Happy & social" },
  { value: "lifted", label: "Lifted & energized" },
  { value: "sharp", label: "Sharp & focused" },
];

export const USE_TIMES: Option[] = [
  { value: "morning", label: "Morning — to get going" },
  { value: "daytime", label: "Daytime — social & active" },
  { value: "evening", label: "Evening — to unwind" },
  { value: "bed", label: "Right before bed" },
  // No strong preference — no day/night signal for the target derivation,
  // which falls back to the other answers (handled in deriveProfileTarget).
  { value: "anytime", label: "Any time of day" },
];

// How a person actually consumes — contextual signal (a joint smokes very
// differently from a vape or a bong). Not a sensory-target dimension yet; kept
// for future logic (e.g. potency framing, harshness notes). The five everyday
// methods; "other" catches the rest.
export const SMOKING_METHODS: Option[] = [
  { value: "joint", label: "Joint" },
  { value: "blunt", label: "Blunt" },
  { value: "pipe", label: "Pipe" },
  { value: "bong", label: "Bong" },
  { value: "vape", label: "Vape" },
];

// Bud structure — how the flower looks and feels when the jar opens. Captured
// now; not scored yet (the 454-strain catalog needs these tags curated first),
// so it's a no-op in matching until then.
export const BUD_STRUCTURES: Option[] = [
  { value: "dense", label: "Dense" },
  { value: "airy", label: "Airy" },
  { value: "fluffy", label: "Fluffy" },
  { value: "popcorn", label: "Popcorn" },
  { value: "larfy", label: "Larfy" },
];

// Preferred plant type. A soft, intuitive signal — "any" means no preference.
// strain.type already exists catalog-wide (no curation needed), but kept as a
// no-op in scoring for now until a small type-match bonus is wired in.
export const PREFERRED_TYPES: Option[] = [
  { value: "indica", label: "Indica" },
  { value: "sativa", label: "Sativa" },
  { value: "hybrid", label: "Hybrid" },
  { value: "any", label: "No difference" },
];

export type PrimaryAroma = (typeof PRIMARY_AROMAS)[number]["value"];
export type PrimaryEffect = (typeof PRIMARY_EFFECTS)[number]["value"];
export type UseTime = (typeof USE_TIMES)[number]["value"];
export type SmokingMethod = (typeof SMOKING_METHODS)[number]["value"];
export type BudStructure = (typeof BUD_STRUCTURES)[number]["value"];
export type PreferredType = (typeof PREFERRED_TYPES)[number]["value"];

const PRIMARY_AROMA_VALUES = new Set(PRIMARY_AROMAS.map((o) => o.value));
const PRIMARY_EFFECT_VALUES = new Set(PRIMARY_EFFECTS.map((o) => o.value));
const USE_TIME_VALUES = new Set(USE_TIMES.map((o) => o.value));
const SMOKING_METHOD_VALUES = new Set(SMOKING_METHODS.map((o) => o.value));
const BUD_STRUCTURE_VALUES = new Set(BUD_STRUCTURES.map((o) => o.value));
const PREFERRED_TYPE_VALUES = new Set(PREFERRED_TYPES.map((o) => o.value));

export const isPrimaryAroma = (v: unknown): v is PrimaryAroma =>
  typeof v === "string" && PRIMARY_AROMA_VALUES.has(v);
export const isPrimaryEffect = (v: unknown): v is PrimaryEffect =>
  typeof v === "string" && PRIMARY_EFFECT_VALUES.has(v);
export const isUseTime = (v: unknown): v is UseTime =>
  typeof v === "string" && USE_TIME_VALUES.has(v);
export const isSmokingMethod = (v: unknown): v is SmokingMethod =>
  typeof v === "string" && SMOKING_METHOD_VALUES.has(v);
export const isBudStructure = (v: unknown): v is BudStructure =>
  typeof v === "string" && BUD_STRUCTURE_VALUES.has(v);
export const isPreferredType = (v: unknown): v is PreferredType =>
  typeof v === "string" && PREFERRED_TYPE_VALUES.has(v);

// Maps each primary-aroma family to the sensory tokens it covers. Used for
// the aroma boost and the half-damper (a strain whose nose matches the
// user's primary aroma is only half-penalised when its archetype is off).
export const PRIMARY_AROMA_TOKENS: Record<PrimaryAroma, string[]> = {
  gas: ["gassy", "diesel"],
  earthfunk: ["earthy", "skunky", "cheese", "woody"],
  citrus: ["citrus"],
  sweet: ["sweet", "creamy"],
  fruit: ["fruity", "berry", "tropical"],
  pineherb: ["pine", "herbal", "spicy", "floral"],
};

export function primaryAromaTokens(profile: TasteProfileInput): string[] {
  const key = profile.primaryAroma;
  return key && isPrimaryAroma(key) ? PRIMARY_AROMA_TOKENS[key] : [];
}

// ---- The connection formula ----------------------------------------

export interface ProfileTarget {
  archetype: EffectArchetype;
  texture: EffectTexture;
  family: BehavioralFamily;
}

// Derive a behavioural target from the forced-choice answers. Returns null
// unless BOTH the primary effect and the use-time are present — those two
// fix the day/night axis and the experiential character; the primary aroma
// only refines flavour within that. Without them we have no sharper signal
// than the broad selects, so we let the legacy inference run instead.
export function deriveProfileTarget(
  profile: TasteProfileInput,
): ProfileTarget | null {
  const eff = profile.primaryEffect;
  const time = profile.useTime;
  if (!isPrimaryEffect(eff) || !isUseTime(time)) return null;
  const aroma = isPrimaryAroma(profile.primaryAroma)
    ? profile.primaryAroma
    : null;

  const night = time === "bed" || eff === "knockout";
  const day =
    (time === "morning" || time === "daytime") &&
    (eff === "sharp" || eff === "lifted" || eff === "social");

  if (night) {
    return aroma === "sweet"
      ? { archetype: "dessert-couch-lock", texture: "grounded", family: "nighttime-indica" }
      : { archetype: "deep-sleeper", texture: "grounded", family: "nighttime-indica" };
  }

  if (day) {
    let archetype: EffectArchetype;
    if (aroma === "citrus" || aroma === "pineherb") {
      archetype = "clean-creative-daytime";
    } else if (eff === "social") {
      archetype = "social-bright";
    } else if (aroma === "gas") {
      archetype = "sharp-stimulant";
    } else {
      archetype = "clean-creative-daytime";
    }
    return { archetype, texture: "lucid", family: "daytime-functional" };
  }

  // Evening / mid sessions.
  if (eff === "calm") {
    if (aroma === "gas" || aroma === "earthfunk") {
      return { archetype: "garlic-funk", texture: "pressure-heavy", family: "nighttime-indica" };
    }
    if (aroma === "sweet") {
      return { archetype: "smooth-expressive", texture: "smooth", family: "exotic-modern-hybrid" };
    }
    return { archetype: "introspective-calm", texture: "dreamy", family: "contemplative-quiet" };
  }
  if (eff === "social") {
    return { archetype: "social-bright", texture: "smooth", family: "daytime-functional" };
  }
  return { archetype: "smooth-expressive", texture: "smooth", family: "exotic-modern-hybrid" };
}

// Single source of truth for "what target is this profile aiming at" —
// forced-choice answers win; otherwise fall back to the legacy inference
// from favourites/preferences. Used by both the scoring engine and the
// audit log so they never disagree.
export interface ResolvedTarget {
  archetype: EffectArchetype | null;
  texture: EffectTexture | null;
  family: BehavioralFamily | null;
  source: "forced" | "inferred";
}

export function resolveProfileTarget(
  profile: TasteProfileInput,
): ResolvedTarget {
  const derived = deriveProfileTarget(profile);
  if (derived) return { ...derived, source: "forced" };
  return {
    archetype: inferProfileArchetype(profile),
    texture: inferProfileTexture(profile),
    family: inferProfileFamily(profile),
    source: "inferred",
  };
}
