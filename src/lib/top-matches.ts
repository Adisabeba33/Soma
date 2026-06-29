// Top catalog matches for a user — the dashboard carousel + the account
// "discoveries" strip share this so they never disagree. Blend-aware (merged
// profiles / Taste Blender drive it), favourites excluded (they anchor near the
// top and these surfaces are for DISCOVERY). Never throws — returns [] if the
// profile is too thin or the DB hiccups.

import { getActiveProfile } from "@/lib/active-profile";
import { getFeedbackSignals } from "@/lib/api";
import { mergedMatches } from "@/lib/merge-worlds";
import { STRAINS, findStrain, normalizeStrainName } from "@/lib/strain-data";
import { scoreStrain } from "@/lib/taste-engine";
import { strainSlug } from "@/lib/catalog";
import { getIdentity } from "@/lib/strain-identity";
import { artImageSrc, artFocusOf, timeProfileOf } from "@/lib/strain-art";
import { paletteForTime } from "@/lib/sensory-family-palette";
import {
  profileCompleteness,
  MATCH_GATE_PERCENT,
} from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";

export type TopMatch = {
  name: string;
  slug: string;
  type: string;
  score: number;
  category: string;
  img: string | null;
  focus: string;
  bg: string;
};

export async function getTopMatches(
  userId: string,
  limit = 12,
): Promise<TopMatch[]> {
  try {
    const profile = await getActiveProfile(userId);
    if (!profile) return [];
    const p = profile as unknown as TasteProfileInput;
    if (profileCompleteness(p).percent < MATCH_GATE_PERCENT) return [];

    const feedback = await getFeedbackSignals(userId);
    const merged = await mergedMatches(userId);
    const favourites = new Set(
      (p.favoriteStrains ?? [])
        .map((f) => normalizeStrainName(findStrain(f)?.name ?? f))
        .filter(Boolean),
    );

    return STRAINS.filter((s) => !favourites.has(normalizeStrainName(s.name)))
      .map((s) => {
        const mm = merged?.matches[s.name];
        const m = mm
          ? { matchScore: mm.score, category: mm.category }
          : scoreStrain(s.name, p, feedback);
        const identity = getIdentity(s.name);
        return {
          name: s.name,
          slug: strainSlug(s.name),
          type: s.type,
          score: m.matchScore,
          category: m.category,
          img: artImageSrc(s, identity),
          focus: artFocusOf(identity),
          bg: paletteForTime(timeProfileOf(s, identity)).background,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (err) {
    console.error("getTopMatches failed", err);
    return [];
  }
}
