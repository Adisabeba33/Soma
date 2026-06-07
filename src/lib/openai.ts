// Optional AI sommelier layer.
// The deterministic engine always produces the structured result first
// (scores, categories, matched sensory data). When an OPENAI_API_KEY is
// present, this layer rewrites only the prose in a warm sommelier voice —
// it never changes scores and never invents batch facts.

import type { AnalysisResult, TasteProfileInput } from "./types";
import { labelList } from "./vocab";

export function isOpenAIEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const SYSTEM_PROMPT = `You are SOMA, a calm and precise cannabis sommelier.
You help a person judge whether a specific flower suits THEIR personal taste —
not what the strain is in general.

Hard rules:
- Keep every numeric score, match score, confidence level and category EXACTLY as given. Never change them.
- Rewrite only the prose fields ("whyItFits", "riskNotes", "explanation") in a warm, editorial, intelligent voice. Confident, never hyped, never stoner slang.
- Never invent batch quality, lab percentages, terpene numbers or facts you cannot know.
- Always keep honest caveats: real quality depends on grower, freshness, packaging date and storage; the same strain varies between brands; this is a sensory match, not a guarantee.
- If sensory data is thin or the strain is unknown, say so plainly and calmly.
- Reply with strict JSON only, matching the requested shape.`;

interface EnhanceItem {
  strainName: string;
  whyItFits?: string;
  riskNotes?: string;
  explanation?: string;
}

export async function enhanceWithOpenAI(
  result: AnalysisResult,
  profile: TasteProfileInput,
): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return result;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const userPayload = {
    task: "Rewrite the prose for each recommendation in a sommelier voice. Keep all scores and categories unchanged.",
    user_profile: {
      favorite_strains: profile.favoriteStrains,
      disliked_strains: profile.dislikedStrains,
      liked_traits: labelList(profile.likedTraits),
      disliked_traits: labelList(profile.dislikedTraits),
      preferred_aromas: labelList(profile.preferredAromas),
      preferred_flavors: labelList(profile.preferredFlavors),
      preferred_effects: labelList(profile.preferredEffects),
      disliked_effects: labelList(profile.dislikedEffects ?? []),
      notes: profile.notes ?? "",
    },
    recommendations: result.recommendations.map((r) => ({
      strainName: r.strainName,
      resolvedName: r.resolvedName,
      knownStrain: r.knownStrain,
      category: r.category,
      matchScore: r.matchScore,
      confidence: r.confidence,
      matchedAromas: r.matchedAromas,
      matchedFlavors: r.matchedFlavors,
      matchedEffects: r.matchedEffects,
      conflicts: r.conflicts,
      draftWhyItFits: r.whyItFits,
      draftRiskNotes: r.riskNotes,
    })),
    response_shape: {
      items: [
        {
          strainName: "string (echo back exactly)",
          whyItFits: "string",
          riskNotes: "string",
          explanation: "string (2-4 sentences, includes a caveat)",
        },
      ],
    },
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 28_000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return result;

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return result;

    const parsed = JSON.parse(content) as { items?: EnhanceItem[] };
    const items = parsed.items ?? [];
    const byName = new Map<string, EnhanceItem>();
    for (const item of items) {
      if (item?.strainName) byName.set(item.strainName.toLowerCase(), item);
    }

    const recommendations = result.recommendations.map((rec) => {
      const enhanced = byName.get(rec.strainName.toLowerCase());
      if (!enhanced) return rec;
      return {
        ...rec,
        whyItFits: enhanced.whyItFits?.trim() || rec.whyItFits,
        riskNotes: enhanced.riskNotes?.trim() || rec.riskNotes,
        explanation: enhanced.explanation?.trim() || rec.explanation,
      };
    });

    return { ...result, recommendations, engine: "openai" };
  } catch {
    // Any failure (network, parse, timeout) falls back to the built-in engine.
    return result;
  }
}
