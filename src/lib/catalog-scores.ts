// Shared single-profile catalog scorer (P1). /catalog, /collection and the
// home top-matches each looped scoreStrain over all ~900 strains per render;
// this routes them through one function with a per-instance cache, so the
// second surface in the same window reuses the first one's work. The key
// embeds ENGINE_VERSION, the profile row's id+updatedAt and a feedback
// fingerprint — any change to what can move a score mints a new key.
import { ENGINE_VERSION, scoreStrain } from "./taste-engine";
import { STRAINS } from "./strain-data";
import { toEngineInput, type StoredTasteProfile } from "./engine-input";
import { getOrCompute, fingerprint } from "./match-cache";
import type { CatalogMatch } from "./catalog";
import type { FeedbackSignal } from "./types";

export function catalogScoresForProfile(
  profile: StoredTasteProfile & { id?: string; updatedAt?: Date },
  feedback: FeedbackSignal[],
): Record<string, CatalogMatch> {
  const key = [
    "single",
    ENGINE_VERSION,
    profile.id ?? "anon",
    profile.updatedAt?.getTime() ?? fingerprint(profile),
    fingerprint(feedback),
  ].join("|");
  return getOrCompute(key, () => {
    const p = toEngineInput(profile);
    const matches: Record<string, CatalogMatch> = {};
    for (const strain of STRAINS) {
      const m = scoreStrain(strain.name, p, feedback);
      matches[strain.name] = {
        score: m.matchScore,
        category: m.category,
        // Same composite ordering key the merged path uses: visible score
        // dominates, unclamped raw breaks ties within a band.
        sort: m.matchScore * 1000 + m.unclampedScore,
      };
    }
    return matches;
  });
}
