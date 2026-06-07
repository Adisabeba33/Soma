// Profile contradiction detector — surfaces inconsistencies between
// what the user labels (preferences, disliked traits/effects) and what
// their favourites empirically demonstrate they enjoy.
//
// Currently two kinds:
//   - disliked-trait-vs-favorite: user marks "too-heavy" as disliked
//     but favourites carry heavy-body / couch-lock.
//   - disliked-effect-vs-favorite: user picks "couch-lock" as an
//     effect to avoid but a favourite directly delivers couch-lock.
//
// Engine reconciles both silently in scoring (lived experience > label),
// but the user should see what we noticed and what we're doing about it.
//
// Each Contradiction carries enough context that:
//   - the UI can render an honest banner
//   - the compare-audit log can write a stable record for later review
//   - users can decide to fix their profile or accept the resolution

import { findStrain } from "./strain-data";
import { reconciledDislikes } from "./taste-engine";
import { labelFor } from "./vocab";
import type { StrainProfile, TasteProfileInput } from "./types";

export type ContradictionKind =
  | "disliked-trait-vs-favorite"
  | "disliked-effect-vs-favorite";

export interface ProfileContradiction {
  kind: ContradictionKind;
  // The user-facing dislike label that's being silenced
  trigger: string;
  // Plain-English description fit for a banner
  description: string;
  // Which favourites empirically prove the user tolerates this trait
  evidenceFavorites: string[];
  // What the engine does about it (one-sentence resolution)
  resolution: string;
  severity: "info" | "warning";
}

// Maps dislike vocab to a human "what favourites carry to trigger this"
// description. Keep in sync with favoriteTriggers() in taste-engine.ts.
const DISLIKE_HUMAN: Record<string, { label: string; carrier: string }> = {
  "too-heavy": {
    label: "too heavy / sedating",
    carrier: "heavy-body / couch-lock indica character",
  },
  "too-light": {
    label: "too light / airy",
    carrier: "light, heady sativa character",
  },
  "sharp-citrus": {
    label: "sharp citrus",
    carrier: "citrus-forward aroma or flavor",
  },
};

export function detectProfileContradictions(
  profile: TasteProfileInput,
): ProfileContradiction[] {
  const silenced = new Set(reconciledDislikes(profile));
  if (silenced.size === 0) return [];

  const resolvedFavs = profile.favoriteStrains
    .map((f) => findStrain(f))
    .filter((s): s is StrainProfile => Boolean(s));

  const out: ProfileContradiction[] = [];

  // Trait-axis contradictions (e.g. "too-heavy" silenced because favourites
  // are heavy indicas). Carrier description comes from DISLIKE_HUMAN — the
  // trigger token doesn't appear on the strain directly, so we have to spell
  // out which sensory features make a favourite "trigger" that dislike.
  for (const d of profile.dislikedTraits) {
    if (!silenced.has(d)) continue;
    const meta = DISLIKE_HUMAN[d];
    if (!meta) continue;
    const evidence = resolvedFavs
      .filter((f) => favoriteCarriesDislike(d, f))
      .map((f) => f.name);
    if (evidence.length === 0) continue;
    out.push({
      kind: "disliked-trait-vs-favorite",
      trigger: d,
      description: `You marked “${meta.label}” as disliked, but ${evidence.length === 1 ? "your favourite" : "your favourites"} ${humanList(evidence)} ${evidence.length === 1 ? "carries" : "carry"} ${meta.carrier}.`,
      evidenceFavorites: evidence,
      resolution: `SŌMA is treating your favourites as the stronger signal — “${meta.label}” is silenced for scoring so similar strains aren't unfairly penalised. To restore the dislike, either remove it from the questionnaire or remove the contradicting favourite.`,
      severity: "info",
    });
  }

  // Effect-axis contradictions. Tokens come straight from the EFFECTS vocab
  // so the "carrier" is the effect itself — favourite directly delivers
  // exactly the effect the user said they want to avoid.
  for (const e of profile.dislikedEffects ?? []) {
    if (!silenced.has(e)) continue;
    const evidence = resolvedFavs
      .filter((f) => f.effects.includes(e))
      .map((f) => f.name);
    if (evidence.length === 0) continue;
    const label = labelFor(e).toLowerCase();
    out.push({
      kind: "disliked-effect-vs-favorite",
      trigger: e,
      description: `You marked “${label}” as an effect to avoid, but ${evidence.length === 1 ? "your favourite" : "your favourites"} ${humanList(evidence)} directly ${evidence.length === 1 ? "delivers" : "deliver"} it.`,
      evidenceFavorites: evidence,
      resolution: `SŌMA is treating your favourites as the stronger signal — “${label}” is silenced for scoring so similar strains aren't unfairly penalised. To restore the dislike, either remove it from the questionnaire or remove the contradicting favourite.`,
      severity: "info",
    });
  }

  return out;
}

// Helper duplicating the logic in taste-engine.favoriteTriggers, kept
// inline here to give per-favourite evidence rather than just a boolean.
function favoriteCarriesDislike(d: string, f: StrainProfile): boolean {
  const has = (...tags: string[]) =>
    tags.some(
      (t) =>
        f.aromas.includes(t) ||
        f.flavors.includes(t) ||
        f.effects.includes(t) ||
        f.traits.includes(t),
    );
  if (d === "sharp-citrus") {
    return f.aromas.includes("citrus") || f.flavors.includes("citrus");
  }
  if (d === "too-light") {
    return (
      f.type === "sativa" && !has("body-heavy", "heavy-body", "couch-lock")
    );
  }
  if (d === "too-heavy") {
    return has("couch-lock", "heavy-body", "body-heavy", "sleepy");
  }
  return false;
}

function humanList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
