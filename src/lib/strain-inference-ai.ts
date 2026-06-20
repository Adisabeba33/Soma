// AI strain inference — the optional coverage layer.
//
// When a user enters a strain that is NOT in our curated catalog, the engine
// normally falls back to a crude keyword guess (inferStrain). With an AI
// provider configured (Claude by default, OpenAI as an option), this layer
// instead asks the model for a structured sensory profile for those unknown
// names — but constrained to OUR closed vocabulary, so the result drops
// straight into the same deterministic scoring as a curated strain. The
// provider/model lives in ai-provider.ts.
//
// Safety / honesty contract:
//   - Fully gated: no provider key (or STRAIN_AI=off) ⇒ this never runs and
//     resolveStrain keeps its existing keyword fallback. Zero behaviour change
//     until a key is added.
//   - Output is clipped to AROMA/FLAVOR/EFFECT/trait vocab before use — the
//     model can never inject a token the engine doesn't understand.
//   - Inferred strains stay knownStrain:false (an estimate, not curated), so
//     the UI's "we don't have this one — here's a read" honesty still applies.
//   - Never throws and never blocks: any failure returns what's cached so far,
//     and the engine falls back to the keyword guess for the rest.
//   - In-memory cache means each unique unknown name costs at most one call per
//     warm server instance; popular names get promoted to the curated catalog
//     later (UnknownStrain queue).

import { normalizeStrainName } from "./strain-data";
import { AROMAS, EFFECTS, FLAVORS, LIKED_TRAITS } from "./vocab";
import type { Potency, StrainProfile, StrainType } from "./types";
import { aiExtractJson, isAIEnabled } from "./ai-provider";

const AROMA_SET = new Set(AROMAS.map((o) => o.value));
const FLAVOR_SET = new Set(FLAVORS.map((o) => o.value));
const EFFECT_SET = new Set(EFFECTS.map((o) => o.value));
const TRAIT_SET = new Set(LIKED_TRAITS.map((o) => o.value));
const TYPES = new Set<StrainType>(["indica", "sativa", "hybrid"]);
const POTENCIES = new Set<Potency>(["mild", "moderate", "strong", "very-strong"]);

// Process-lifetime cache of inferred profiles, keyed by normalized name.
const cache = new Map<string, StrainProfile>();

export function isStrainAIEnabled(): boolean {
  return isAIEnabled() && process.env.STRAIN_AI !== "off";
}

function clip(values: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const v of values) {
    if (typeof v === "string" && allowed.has(v) && !out.includes(v)) out.push(v);
  }
  return out;
}

// Validate one model-returned strain into a StrainProfile, or null if it lacks
// the minimum signal (a clipped aroma + effect). primary* are kept only where
// they are a subset of the corresponding full (clipped) list.
function validate(name: string, raw: unknown): StrainProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const aromas = clip(r.aromas, AROMA_SET);
  const effects = clip(r.effects, EFFECT_SET);
  if (aromas.length === 0 || effects.length === 0) return null;

  const flavors = clip(r.flavors, FLAVOR_SET);
  const traits = clip(r.traits, TRAIT_SET);
  const subset = (vals: unknown, full: string[]) =>
    clip(vals, new Set(full));

  const type = TYPES.has(r.type as StrainType) ? (r.type as StrainType) : "hybrid";
  const potency = POTENCIES.has(r.potency as Potency)
    ? (r.potency as Potency)
    : "moderate";

  return {
    name: name.trim(),
    type,
    aromas,
    flavors: flavors.length ? flavors : aromas.filter((a) => FLAVOR_SET.has(a)),
    effects,
    traits: traits.length ? traits : ["terpy"],
    potency,
    primaryAromas: subset(r.primaryAromas, aromas),
    primaryFlavors: subset(r.primaryFlavors, flavors),
    primaryEffects: subset(r.primaryEffects, effects),
  };
}

const SYSTEM_PROMPT = `You are a cannabis sensory data encoder for SOMA.
For each strain name given, return its typical sensory profile using ONLY the
exact tokens from the provided vocabularies. Never invent tokens, never use
synonyms or free text in the token arrays. If you do not know a strain, give
your best estimate from its name and lineage — do not refuse.
Mark the 1-2 most DOMINANT notes per axis in the primary* arrays (a subset of
the full arrays). Reply with strict JSON only.`;

function buildUserPayload(names: string[]) {
  return {
    task: "Encode each strain into SOMA's closed sensory vocabulary.",
    vocab: {
      type: ["indica", "sativa", "hybrid"],
      potency: ["mild", "moderate", "strong", "very-strong"],
      aromas: [...AROMA_SET],
      flavors: [...FLAVOR_SET],
      effects: [...EFFECT_SET],
      traits: [...TRAIT_SET],
    },
    strains: names,
    response_shape: {
      strains: [
        {
          name: "string (echo exactly)",
          type: "one of vocab.type",
          potency: "one of vocab.potency",
          aromas: ["tokens from vocab.aromas"],
          flavors: ["tokens from vocab.flavors"],
          effects: ["tokens from vocab.effects"],
          traits: ["tokens from vocab.traits"],
          primaryAromas: ["1-2 dominant, subset of aromas"],
          primaryFlavors: ["1-2 dominant, subset of flavors"],
          primaryEffects: ["1-2 dominant, subset of effects"],
        },
      ],
    },
  };
}

// Infer profiles for a list of (already-unknown) strain names. Returns a map
// keyed by normalizeStrainName, ready to pass as `overrides` to the engine.
// Only the names not already cached trigger a model call.
export async function inferStrainsAI(
  names: string[],
): Promise<Map<string, StrainProfile>> {
  const out = new Map<string, StrainProfile>();
  if (!isStrainAIEnabled()) return out;

  const needed: string[] = [];
  for (const name of names) {
    const key = normalizeStrainName(name);
    if (!key) continue;
    const cached = cache.get(key);
    if (cached) {
      out.set(key, cached);
    } else if (!needed.some((n) => normalizeStrainName(n) === key)) {
      needed.push(name);
    }
  }
  if (needed.length === 0) return out;
  // Bound prompt size / cost / latency: infer at most a handful of unknowns
  // per request. Anything beyond falls through to the keyword guess. A large
  // menu paste therefore can't trigger a runaway call.
  const batch = needed.slice(0, 12);

  try {
    const parsed = (await aiExtractJson(SYSTEM_PROMPT, buildUserPayload(batch), {
      maxTokens: 2048,
    })) as { strains?: unknown } | null;
    if (!parsed) return out;

    const list = Array.isArray(parsed.strains) ? parsed.strains : [];
    for (const item of list) {
      const itemName =
        item && typeof item === "object"
          ? (item as Record<string, unknown>).name
          : undefined;
      if (typeof itemName !== "string") continue;
      const profile = validate(itemName, item);
      if (!profile) continue;
      const key = normalizeStrainName(itemName);
      cache.set(key, profile);
      out.set(key, profile);
    }
  } catch {
    // Network / parse / abort — return whatever resolved; engine falls back.
    return out;
  }
  return out;
}
