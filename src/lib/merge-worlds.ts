// "All my worlds" — merge a user's taste profiles into one recommendation feed.
//
// Each profile is a separate "world" (a distinct side of the same person's
// taste). We run the deterministic engine once PER profile and merge the
// results — we do NOT union the profiles into one, because that dilutes each
// world's signal and cross-contaminates their avoids. The merge rules, locked
// after simulating real profiles:
//
//   • POSITIVE signals → MAX (best-of). A strain is a good pick if it shines
//     in ANY world; it keeps that world's full score and is tagged with it.
//     (You don't smoke in "average mood" — you're in one world at a time, so
//     a skunk gem should score high even if your gas side rates it low.)
//   • NEGATIVE signals → UNION veto. A strain avoided in ANY profile is
//     dropped everywhere: it's the same person consuming it, and merging
//     profiles can't make a dealbreaker enjoyable.
//
// `avgScore` is also returned so the page can offer a secondary "all-rounder"
// sort (strains decent across every world) without recomputing.

import { prisma } from "./prisma";
import { scoreStrain } from "./taste-engine";
import { getFeedbackSignals } from "./api";
import { STRAINS, findStrain } from "./strain-data";
import type { TasteProfileInput } from "./types";

export type WorldScore = { world: string; score: number; category: string };

export type MergedRec = {
  strainName: string;
  score: number; // MAX across worlds — the headline
  avgScore: number; // mean across worlds — for the all-rounder sort
  world: string; // the world that produced the MAX
  category: string;
  perWorld: WorldScore[];
  universal: boolean; // strong in every world
};

export type MergeResult = {
  worlds: string[]; // profile names, in display order
  recs: MergedRec[]; // ranked by MAX score, descending
  vetoed: string[]; // strains globally avoided (union of dislikes)
};

// A strain counts as "universal" (works for every side of you) when it clears
// this in all worlds — drives the "works for both" badge.
const UNIVERSAL_FLOOR = 75;

export async function mergeWorlds(userId: string): Promise<MergeResult | null> {
  const profiles = await prisma.tasteProfile
    .findMany({ where: { userId }, orderBy: { updatedAt: "desc" } })
    .catch(() => []);
  if (profiles.length === 0) return null;

  // Feedback is per-user (not per-profile), so the same signal feeds every
  // world's scoring.
  const feedback = await getFeedbackSignals(userId);

  // Global avoid: the union of every profile's disliked strains, canonicalised
  // so an alias in one profile still vetoes the canonical strain.
  const veto = new Set<string>();
  for (const p of profiles) {
    for (const d of p.dislikedStrains ?? []) {
      veto.add(findStrain(d)?.name ?? d);
    }
  }

  const worlds = profiles.map((p, i) => p.name?.trim() || `Profile ${i + 1}`);

  const recs: MergedRec[] = [];
  for (const strain of STRAINS) {
    if (veto.has(strain.name)) continue; // global veto — never recommended

    const perWorld: WorldScore[] = profiles.map((p, i) => {
      const m = scoreStrain(
        strain.name,
        p as unknown as TasteProfileInput,
        feedback,
      );
      return { world: worlds[i], score: m.matchScore, category: m.category };
    });

    let best = perWorld[0];
    for (const w of perWorld) if (w.score > best.score) best = w;
    const avg =
      perWorld.reduce((sum, w) => sum + w.score, 0) / perWorld.length;

    recs.push({
      strainName: strain.name,
      score: best.score,
      avgScore: Math.round(avg * 10) / 10,
      world: best.world,
      category: best.category,
      perWorld,
      universal: perWorld.every((w) => w.score >= UNIVERSAL_FLOOR),
    });
  }

  recs.sort((a, b) => b.score - a.score);
  return { worlds, recs, vetoed: [...veto] };
}
