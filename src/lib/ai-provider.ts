// Provider-agnostic AI layer. Claude (Anthropic) is the primary provider;
// OpenAI is kept as a selectable option. Every runtime AI layer (sommelier
// prose, unknown-strain inference, the describe extractor) goes through
// aiExtractJson() so the vendor and model live in exactly one place.
//
// Selection: AI_PROVIDER ("claude" | "openai", default "claude") picks the
// preferred provider; each is gated on its own key, and we fall back to the
// other when the preferred one has no key. With neither key set the layers
// stay dormant and the deterministic paths run unchanged.
//
//   AI_PROVIDER     claude | openai          (default claude)
//   ANTHROPIC_API_KEY / CLAUDE_MODEL         (default claude-haiku-4-5)
//   OPENAI_API_KEY    / OPENAI_MODEL         (default gpt-4o-mini)
import Anthropic from "@anthropic-ai/sdk";

export type AIProvider = "claude" | "openai";

export function activeProvider(): AIProvider | null {
  const pref = (process.env.AI_PROVIDER || "claude").toLowerCase();
  const hasClaude = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  if (pref === "openai") {
    if (hasOpenAI) return "openai";
    if (hasClaude) return "claude";
  } else {
    if (hasClaude) return "claude";
    if (hasOpenAI) return "openai";
  }
  return null;
}

export function isAIEnabled(): boolean {
  return activeProvider() !== null;
}

const JSON_ONLY =
  "Reply with strict JSON only — no prose, no explanation, no markdown code fences.";

function parseJsonLoose(text: string): Record<string, unknown> | null {
  let t = text.trim();
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  try {
    const v = JSON.parse(t);
    return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

let anthropicClient: Anthropic | null = null;
function anthropic(): Anthropic {
  if (!anthropicClient) anthropicClient = new Anthropic({ timeout: 28_000 });
  return anthropicClient;
}

async function claudeJson(
  system: string,
  userPayload: unknown,
  maxTokens: number,
): Promise<Record<string, unknown> | null> {
  const model = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
  const res = await anthropic().messages.create({
    model,
    max_tokens: maxTokens,
    temperature: 0.2,
    system: `${system}\n${JSON_ONLY}`,
    messages: [{ role: "user", content: JSON.stringify(userPayload) }],
  });
  const block = res.content.find((b) => b.type === "text");
  return block && block.type === "text" ? parseJsonLoose(block.text) : null;
}

async function openaiJson(
  system: string,
  userPayload: unknown,
  maxTokens: number,
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 28_000);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${system}\n${JSON_ONLY}` },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    return content ? parseJsonLoose(content) : null;
  } finally {
    clearTimeout(timeout);
  }
}

// System prompt + a user JSON payload → a parsed JSON object, or null on any
// failure (no provider, network error, unparseable output). Callers validate
// and clip the result against the closed vocab as before — the model is the
// understanding layer, never trusted to stay in-vocab on its own.
export async function aiExtractJson(
  system: string,
  userPayload: unknown,
  opts?: { maxTokens?: number },
): Promise<Record<string, unknown> | null> {
  const provider = activeProvider();
  if (!provider) return null;
  const maxTokens = opts?.maxTokens ?? 1024;
  try {
    return provider === "claude"
      ? await claudeJson(system, userPayload, maxTokens)
      : await openaiJson(system, userPayload, maxTokens);
  } catch {
    return null;
  }
}
