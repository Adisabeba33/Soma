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
import { matchingReadiness } from "@/lib/profile-completeness";
import { CATEGORY_META } from "@/lib/score-taxonomy";
import { labelFor } from "@/lib/vocab";
import type { Category, StrainProfile, TasteProfileInput } from "@/lib/types";

export type TopMatch = {
  name: string;
  slug: string;
  type: string;
  score: number;
  category: Category;
  /** Compact rendering of `category` (src/lib/score-taxonomy.ts). */
  status: string;
  /** Up to three sensory words for the card's one-line character read. */
  descriptors: string[];
  img: string | null;
  focus: string;
  bg: string;
};

// The card's character line. Dominant tags first (the curated primary
// aromas/effects the engine already weights above secondary ones), so the
// three words shown are the ones that actually define the strain.
function descriptorsFor(s: StrainProfile): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const take = (tokens: string[] | undefined) => {
    for (const t of tokens ?? []) {
      if (out.length >= 3) return;
      if (!t || seen.has(t)) continue;
      seen.add(t);
      out.push(labelFor(t));
    }
  };
  take(s.primaryAromas);
  take(s.primaryEffects);
  take(s.aromas);
  take(s.effects);
  return out;
}

export async function getTopMatches(
  userId: string,
  limit = 12,
): Promise<TopMatch[]> {
  try {
    const profile = await getActiveProfile(userId);
    if (!profile) return [];
    const p = profile as unknown as TasteProfileInput;
    if (!matchingReadiness(p).ready) return [];

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
        const category = m.category as Category;
        return {
          name: s.name,
          slug: strainSlug(s.name),
          type: s.type,
          score: m.matchScore,
          category,
          status: CATEGORY_META[category].short,
          descriptors: descriptorsFor(s),
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
