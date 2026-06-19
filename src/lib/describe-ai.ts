// Conversational intake brain — the constrained LLM extractor (#17).
//
// Turns a person's free description ("makes me wanna clean the house and text
// my ex, lemon-gas smell, nothing that makes my heart race") into SOMA's CLOSED
// tag vocabulary, so it drops straight into the same editable preview + the same
// deterministic engine as the questionnaire. The model is the *understanding*
// layer only; it never recommends and can never emit a token the engine doesn't
// know — output is clipped to the vocab before use.
//
// Safety contract (mirrors strain-inference-ai.ts):
//   - Key-gated: no OPENAI_API_KEY (or DESCRIBE_AI=off) ⇒ never runs; the
//     deterministic keyword parser is used alone, exactly as today.
//   - Used as ENRICHMENT on top of the deterministic parse (a floor): the merge
//     only ever ADDS, so the result is never worse than keywords.
//   - Output clipped to AROMA/FLAVOR/EFFECT/trait/forced-choice vocab.
//   - Never throws / never blocks: any failure returns null and the route falls
//     back to the deterministic profile.
import {
  AROMAS,
  DISLIKED_TRAITS,
  EFFECTS,
  FLAVORS,
  LIKED_TRAITS,
  TEXTURE_PREFERENCES,
} from "./vocab";
import {
  isPrimaryAroma,
  isPrimaryEffect,
  isUseTime,
  PRIMARY_AROMAS,
  PRIMARY_EFFECTS,
  USE_TIMES,
} from "./profile-target";
import type { InferredProfile } from "./profile-from-experience";

const setOf = (opts: { value: string }[]) => new Set(opts.map((o) => o.value));
const AROMA = setOf(AROMAS);
const FLAVOR = setOf(FLAVORS);
const EFFECT = setOf(EFFECTS);
const LTRAIT = setOf(LIKED_TRAITS);
const DTRAIT = setOf(DISLIKED_TRAITS);
const TEX = setOf(TEXTURE_PREFERENCES);
const AROMA_OR_FLAVOR = new Set([...AROMA, ...FLAVOR]);

export function isDescribeAIEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY) && process.env.DESCRIBE_AI !== "off";
}

function clip(value: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string" && allowed.has(v) && !out.includes(v)) out.push(v);
  }
  return out;
}

const SYSTEM_PROMPT = `You translate a person's free description of the cannabis experience they want into SOMA's CLOSED tag vocabulary.
Use ONLY the exact tokens provided — never invent tokens, synonyms or free text inside the arrays.
Understand slang, broken English, metaphor and food/feeling references, and map them to the closest tokens (e.g. "zoomies" → energetic; "melts me into the couch" → couch-lock/body-heavy; "tastes like a Werther's" → creamy/sweet; "don't want my heart racing" → leave effects clean and note it under dislikes).
Capture BOTH what they want and what they want to AVOID.
Only include a field when the text actually supports it; omit or leave empty otherwise — do not pad.
Reply with strict JSON only, matching the requested shape.`;

function userPayload(text: string) {
  return {
    description: text,
    vocab: {
      aromas: [...AROMA],
      flavors: [...FLAVOR],
      effects: [...EFFECT],
      likedTraits: [...LTRAIT],
      dislikedTraits: [...DTRAIT],
      texturePreferences: [...TEX],
      primaryAroma: PRIMARY_AROMAS.map((o) => o.value),
      primaryEffect: PRIMARY_EFFECTS.map((o) => o.value),
      useTime: USE_TIMES.map((o) => o.value),
      potencyPreference: ["mild", "balanced", "strong"],
      lookingFor: ["similar", "new"],
    },
    response_shape: {
      preferredAromas: ["tokens from vocab.aromas"],
      preferredFlavors: ["tokens from vocab.flavors"],
      preferredEffects: ["tokens from vocab.effects"],
      dislikedEffects: ["effects they want to avoid"],
      dislikedAromas: ["aromas/flavours they want to avoid"],
      likedTraits: ["tokens from vocab.likedTraits"],
      dislikedTraits: ["tokens from vocab.dislikedTraits"],
      texturePreferences: ["tokens from vocab.texturePreferences"],
      primaryAroma: "one of vocab.primaryAroma or \"\"",
      primaryEffect: "one of vocab.primaryEffect or \"\"",
      useTime: "one of vocab.useTime or \"\"",
      bodyFeel: "0 (clear/light) to 100 (heavy) or null",
      potencyPreference: "one of vocab.potencyPreference or \"\"",
      lookingFor: "\"similar\" or \"new\"",
    },
  };
}

// Returns the vocab-validated partial profile, or null if disabled / failed.
export async function inferProfileAI(text: string): Promise<Partial<InferredProfile> | null> {
  if (!isDescribeAIEnabled() || !text.trim()) return null;
  const apiKey = process.env.OPENAI_API_KEY!;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28_000);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(userPayload(text)) },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const p = JSON.parse(content) as Record<string, unknown>;

    const out: Partial<InferredProfile> = {
      preferredAromas: clip(p.preferredAromas, AROMA),
      preferredFlavors: clip(p.preferredFlavors, FLAVOR),
      preferredEffects: clip(p.preferredEffects, EFFECT),
      dislikedEffects: clip(p.dislikedEffects, EFFECT),
      dislikedAromas: clip(p.dislikedAromas, AROMA_OR_FLAVOR),
      likedTraits: clip(p.likedTraits, LTRAIT),
      dislikedTraits: clip(p.dislikedTraits, DTRAIT),
      texturePreferences: clip(p.texturePreferences, TEX),
    };
    if (isPrimaryAroma(p.primaryAroma)) out.primaryAroma = p.primaryAroma;
    if (isPrimaryEffect(p.primaryEffect)) out.primaryEffect = p.primaryEffect;
    if (isUseTime(p.useTime)) out.useTime = p.useTime;
    if (typeof p.bodyFeel === "number" && !Number.isNaN(p.bodyFeel)) {
      out.bodyFeel = Math.max(0, Math.min(100, Math.round(p.bodyFeel)));
    }
    if (p.potencyPreference === "mild" || p.potencyPreference === "balanced" || p.potencyPreference === "strong") {
      out.potencyPreference = p.potencyPreference;
    }
    if (p.lookingFor === "new" || p.lookingFor === "similar") out.lookingFor = p.lookingFor;
    return out;
  } catch {
    return null;
  }
}

const uni = (a: string[] = [], b: string[] = []): string[] => Array.from(new Set([...a, ...b]));

// Merge the AI enrichment onto the deterministic floor: union every list (AI
// only ever ADDS), fill empty forced-choice scalars from the AI. Never removes
// what the keyword parser already found.
export function mergeInferred(base: InferredProfile, ai: Partial<InferredProfile>): InferredProfile {
  return {
    ...base,
    preferredAromas: uni(base.preferredAromas, ai.preferredAromas),
    preferredFlavors: uni(base.preferredFlavors, ai.preferredFlavors),
    preferredEffects: uni(base.preferredEffects, ai.preferredEffects),
    dislikedEffects: uni(base.dislikedEffects, ai.dislikedEffects),
    dislikedAromas: uni(base.dislikedAromas, ai.dislikedAromas),
    likedTraits: uni(base.likedTraits, ai.likedTraits),
    dislikedTraits: uni(base.dislikedTraits, ai.dislikedTraits),
    texturePreferences: uni(base.texturePreferences, ai.texturePreferences),
    primaryAroma: base.primaryAroma || ai.primaryAroma || "",
    primaryEffect: base.primaryEffect || ai.primaryEffect || "",
    useTime: base.useTime || ai.useTime || "",
    bodyFeel: base.bodyFeel ?? ai.bodyFeel ?? null,
    potencyPreference: base.potencyPreference || ai.potencyPreference || "",
    lookingFor: base.lookingFor === "new" ? "new" : ai.lookingFor ?? base.lookingFor,
  };
}
