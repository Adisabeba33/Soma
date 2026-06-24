// "Merge" — blend a user's taste profiles into one set of catalog matches.
//
// Each profile flagged `merged` is a separate "world" (a distinct side of the
// same person's taste). We run the deterministic engine once PER profile and
// merge the per-strain results — we do NOT union the profiles into one, which
// dilutes each world's signal and cross-contaminates their avoids (verified by
// simulation). Merge rules, locked with the user:
//
//   • POSITIVE → MAX (best-of). A strain keeps the score of its best world, so
//     a pick one side loves isn't dragged down by another side that doesn't.
//     Ties on the visible score break on the engine's unclamped raw (same as
//     analyze()), surfaced via CatalogMatch.sort so the catalog orders close
//     picks instead of dumping them into flat clusters.
//   • NEGATIVE → UNION veto. A strain avoided in ANY profile is pushed to its
//     LOWEST world score everywhere: it's the same person consuming it, and
//     merging can't make a dealbreaker enjoyable.
//
// Drives the catalog (Harvest) when two or more profiles are merged; returns
// null otherwise, so callers fall back to the single active profile.

import { prisma } from "./prisma";
import { scoreStrain } from "./taste-engine";
import { getFeedbackSignals } from "./api";
import { STRAINS, findStrain } from "./strain-data";
import type { TasteProfileInput } from "./types";
import type { CatalogMatch } from "./catalog";

export type MergedMatches = {
  worlds: string[]; // names of the merged profiles, display order
  matches: Record<string, CatalogMatch>; // per-strain best-of (or vetoed-low)
  veto: string[]; // strains globally avoided (union of dislikes)
};

// Composite sort key: visible score dominates (×1000), unclamped raw breaks
// ties within a band. Used only for ordering; the displayed number stays
// CatalogMatch.score.
const sortKey = (score: number, unclamped: number) => score * 1000 + unclamped;

export async function mergedMatches(
  userId: string,
): Promise<MergedMatches | null> {
  const profiles = await prisma.tasteProfile
    .findMany({
      where: { userId, merged: true },
      orderBy: { createdAt: "asc" },
    })
    .catch(() => []);
  // Merge only means something with two or more worlds to blend.
  if (profiles.length < 2) return null;

  const feedback = await getFeedbackSignals(userId);

  // Global avoid: union of every merged profile's disliked strains, canonical.
  const veto = new Set<string>();
  for (const p of profiles) {
    for (const d of p.dislikedStrains ?? []) {
      veto.add(findStrain(d)?.name ?? d);
    }
  }

  const worlds = profiles.map((p, i) => p.name?.trim() || `Profile ${i + 1}`);
  const matches: Record<string, CatalogMatch> = {};

  for (const strain of STRAINS) {
    const perWorld = profiles.map((p) => {
      const m = scoreStrain(
        strain.name,
        p as unknown as TasteProfileInput,
        feedback,
      );
      return { score: m.matchScore, unclamped: m.unclampedScore, category: m.category };
    });

    let pick = perWorld[0];
    if (veto.has(strain.name)) {
      // Vetoed: take the LOWEST world (the avoiding side wins), so it ranks low
      // everywhere rather than riding its best world.
      for (const w of perWorld) {
        if (w.score < pick.score || (w.score === pick.score && w.unclamped < pick.unclamped)) {
          pick = w;
        }
      }
    } else {
      // Best-of: highest world, ties broken on unclamped.
      for (const w of perWorld) {
        if (w.score > pick.score || (w.score === pick.score && w.unclamped > pick.unclamped)) {
          pick = w;
        }
      }
    }

    matches[strain.name] = {
      score: pick.score,
      category: pick.category,
      sort: sortKey(pick.score, pick.unclamped),
    };
  }

  return { worlds, matches, veto: [...veto] };
}

// Single-strain merged match, for the catalog detail page — same best-of /
// veto rules as mergedMatches, scoring just one strain so the detail view
// agrees with the list. Returns null when fewer than two profiles are merged.
export async function mergedMatchForStrain(
  userId: string,
  strainName: string,
): Promise<CatalogMatch | null> {
  const profiles = await prisma.tasteProfile
    .findMany({ where: { userId, merged: true }, orderBy: { createdAt: "asc" } })
    .catch(() => []);
  if (profiles.length < 2) return null;

  const feedback = await getFeedbackSignals(userId);
  const vetoed = profiles.some((p) =>
    (p.dislikedStrains ?? []).some(
      (d) => (findStrain(d)?.name ?? d) === strainName,
    ),
  );

  const perWorld = profiles.map((p) => {
    const m = scoreStrain(
      strainName,
      p as unknown as TasteProfileInput,
      feedback,
    );
    return { score: m.matchScore, unclamped: m.unclampedScore, category: m.category };
  });

  let pick = perWorld[0];
  for (const w of perWorld) {
    const better = vetoed
      ? w.score < pick.score || (w.score === pick.score && w.unclamped < pick.unclamped)
      : w.score > pick.score || (w.score === pick.score && w.unclamped > pick.unclamped);
    if (better) pick = w;
  }
  return { score: pick.score, category: pick.category, sort: sortKey(pick.score, pick.unclamped) };
}
