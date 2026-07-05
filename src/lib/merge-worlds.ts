// "Merge" / "Taste Blender" — blend a user's taste profiles into one result.
//
// Each profile is a separate "world" (a distinct side of the same person's
// taste). We run the deterministic engine once PER profile and merge the
// per-strain results — never unioning the profiles into one (which dilutes
// each world and cross-contaminates avoids). Rules, locked with the user:
//
//   • POSITIVE → MAX (best-of), after subtracting each world's lean penalty.
//     A strain keeps the score of its best (penalised) world; ties on the
//     visible score break on the engine's unclamped raw (CatalogMatch.sort).
//   • NEGATIVE → UNION veto. A strain avoided in ANY world is pushed to its
//     LOWEST world: same person consuming it, merging can't fix a dealbreaker.
//
// `resolveBlend` is the single brain that decides which profiles take part and
// each one's penalty:
//   • base pair  = the profiles flagged `merged`. ≥2 → there's something to
//     blend; the optional per-run pair lean penalises one side.
//   • Taste Blender = when there are exactly 3 profiles (2 merged + 1 third)
//     and User.blenderActive, the third joins as an admixed world (lean2) on
//     top of the pair (lean1), and the whole blend drives every surface.

import { prisma } from "./prisma";
import { scoreStrain, analyze } from "./taste-engine";
import { getFeedbackSignals } from "./api";
import { STRAINS, findStrain } from "./strain-data";
import type {
  TasteProfileInput,
  StrainMatch,
  AnalysisResult,
  FeedbackSignal,
  StrainProfile,
} from "./types";
import type { CatalogMatch } from "./catalog";
import type { TasteProfile } from "@prisma/client";

// Pair lean: at full lean a pair member loses at most this many points — a
// tilt, not a switch. Third admix: at lean2=0 the third is dosed down by this
// (still slightly present), at lean2=1 it's a full equal world.
const PAIR_CAP = 25;
const ADMIX_CAP = 30;

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

const worldNameOf = (p: TasteProfile, i: number) =>
  p.name?.trim() || `Profile ${i + 1}`;

// Composite sort key: visible score dominates (×1000), unclamped raw breaks
// ties within a band. Ordering only; the displayed number stays score.
const sortKey = (score: number, unclamped: number) => score * 1000 + unclamped;

export type MergeBreakdown = Record<
  string,
  Array<{ world: string; score: number }>
>;

export type MergedMatches = {
  worlds: string[]; // names of the participating worlds, display order
  matches: Record<string, CatalogMatch>; // per-strain best-of (or vetoed-low)
  veto: string[]; // strains globally avoided (union of dislikes)
  blenderActive: boolean; // true when the 3-way Taste Blender is driving this
};

// The resolved blend: which worlds take part and each one's penalty.
export type BlendSpec = {
  profiles: TasteProfile[]; // 2 (pair) or 3 (pair + third)
  penalties: Record<string, number>; // per-profile penalty points (≥0)
  primaryId: string; // the pair's "Main" end
  worlds: string[]; // names aligned with `profiles`
  pairLean: number; // the applied pair lean (for the audit)
  lean2: number; // the third-admix recipe value (0 when no third)
  blenderActive: boolean; // 3-way Taste Blender on
  balance: boolean; // true = bridge mode (min across worlds); false = best-of
  thirdName?: string; // present in blender mode
};

// Distribute the pair lean as a penalty on one side. lean>0 favours primary
// (penalise the other pair member); lean<0 penalises primary.
function applyPairLean(
  penalties: Record<string, number>,
  pair: TasteProfile[],
  primaryId: string,
  lean: number,
) {
  const l = clamp(lean, -1, 1);
  if (l === 0) return;
  for (const p of pair) {
    const isPrimary = p.id === primaryId;
    if (l > 0 && !isPrimary) penalties[p.id] = l * PAIR_CAP;
    else if (l < 0 && isPrimary) penalties[p.id] = -l * PAIR_CAP;
  }
}

export async function resolveBlend(
  userId: string,
  opts?: { pairBias?: number },
): Promise<BlendSpec | null> {
  const [user, all] = await Promise.all([
    prisma.user
      .findUnique({
        where: { id: userId },
        select: {
          blenderActive: true,
          blenderLean1: true,
          blenderLean2: true,
          blenderBalance: true,
        },
      })
      .catch(() => null),
    prisma.tasteProfile
      .findMany({ where: { userId }, orderBy: { createdAt: "asc" } })
      .catch(() => [] as TasteProfile[]),
  ]);

  // The merge set, ordered by when each profile joined it (legacy rows fall
  // back to createdAt). First two merged = the adjustable pair; a third merged
  // profile is the "third" that blends in.
  const mergedSorted = all
    .filter((p) => p.merged)
    .sort(
      (a, b) =>
        (a.mergedAt ?? a.createdAt).getTime() -
        (b.mergedAt ?? b.createdAt).getTime(),
    );
  if (mergedSorted.length < 2) return null; // no base pair → no blend

  const penalties: Record<string, number> = {};

  // ── Taste Blender ON — the merge set drives every surface via the recipe ──
  if (user?.blenderActive) {
    const balance = Boolean(user.blenderBalance);
    const lean1 = clamp(user.blenderLean1, -1, 1);

    // 3-way: pair (first two merged) + a third (last merged) blended in.
    if (mergedSorted.length >= 3) {
      const pair = mergedSorted.slice(0, 2);
      const third = mergedSorted[mergedSorted.length - 1];
      const primary = pair.find((p) => p.isActive) ?? pair[0];
      // Balance (bridge) mode weighs every world equally — no lean penalties,
      // so min() finds strains strong across ALL sides at once.
      if (!balance) {
        const lean2 = clamp(user.blenderLean2, 0, 1);
        applyPairLean(penalties, pair, primary.id, lean1);
        penalties[third.id] = (1 - lean2) * ADMIX_CAP; // dosed admix
      }
      const profiles = [...pair, third];
      return {
        profiles,
        penalties,
        primaryId: primary.id,
        worlds: profiles.map(worldNameOf),
        pairLean: balance ? 0 : lean1,
        lean2: clamp(user.blenderLean2, 0, 1),
        blenderActive: true,
        balance,
        thirdName: worldNameOf(third, 2),
      };
    }

    // 2-way: exactly two merged — a blend of the pair, pair lean only.
    const pair = mergedSorted;
    const primary = pair.find((p) => p.isActive) ?? pair[0];
    if (!balance) applyPairLean(penalties, pair, primary.id, lean1);
    return {
      profiles: pair,
      penalties,
      primaryId: primary.id,
      worlds: pair.map(worldNameOf),
      pairLean: balance ? 0 : lean1,
      lean2: 0,
      blenderActive: true,
      balance,
    };
  }

  // ── Blender OFF — plain merge of the full merged set (Harvest), with the
  //    optional per-run pair lean. Keeps every merged profile in play. ───────
  const primary = mergedSorted.find((p) => p.isActive) ?? mergedSorted[0];
  const pairLean = clamp(opts?.pairBias ?? 0, -1, 1);
  applyPairLean(penalties, mergedSorted, primary.id, pairLean);
  return {
    profiles: mergedSorted,
    penalties,
    primaryId: primary.id,
    worlds: mergedSorted.map(worldNameOf),
    pairLean,
    lean2: 0,
    blenderActive: false,
    balance: false,
  };
}

// Pick the representative world for one strain. Normally the highest penalised
// score (best-of). When `low` — a vetoed strain, or balance/bridge mode — the
// LOWEST world instead: for a veto it sinks the strain, for balance it IS the
// bridge score (a strain is only as good as its weakest side). Ties break on
// the engine's unclamped raw. Generic so callers keep their own fields.
function pickWorld<T extends { eff: number; unclamped: number }>(
  cands: T[],
  low: boolean,
): T {
  let pick = cands[0];
  for (const c of cands) {
    const better = low
      ? c.eff < pick.eff || (c.eff === pick.eff && c.unclamped < pick.unclamped)
      : c.eff > pick.eff || (c.eff === pick.eff && c.unclamped > pick.unclamped);
    if (better) pick = c;
  }
  return pick;
}

function vetoSet(profiles: TasteProfile[]): Set<string> {
  const veto = new Set<string>();
  for (const p of profiles) {
    for (const d of p.dislikedStrains ?? []) veto.add(findStrain(d)?.name ?? d);
  }
  return veto;
}

// The canonical names a single profile avoids, for "who vetoed this" reporting.
function avoidNamesOf(p: TasteProfile): Set<string> {
  return new Set((p.dislikedStrains ?? []).map((d) => findStrain(d)?.name ?? d));
}

export async function mergedMatches(
  userId: string,
): Promise<MergedMatches | null> {
  const spec = await resolveBlend(userId);
  if (!spec) return null;

  const feedback = await getFeedbackSignals(userId);
  const veto = vetoSet(spec.profiles);
  const matches: Record<string, CatalogMatch> = {};

  for (const strain of STRAINS) {
    const cands = spec.profiles.map((p, i) => {
      const m = scoreStrain(strain.name, p as unknown as TasteProfileInput, feedback);
      return {
        world: spec.worlds[i],
        eff: m.matchScore - (spec.penalties[p.id] ?? 0),
        unclamped: m.unclampedScore,
        category: m.category,
      };
    });
    const pick = pickWorld(cands, veto.has(strain.name) || spec.balance);
    const score = clamp(Math.round(pick.eff), 4, 99);
    matches[strain.name] = {
      score,
      category: pick.category,
      sort: sortKey(score, pick.unclamped),
    };
  }

  return {
    worlds: spec.worlds,
    matches,
    veto: [...veto],
    blenderActive: spec.blenderActive,
  };
}

// Single-strain version for the catalog detail page, so it agrees with the list.
export async function mergedMatchForStrain(
  userId: string,
  strainName: string,
): Promise<CatalogMatch | null> {
  const spec = await resolveBlend(userId);
  if (!spec) return null;

  const feedback = await getFeedbackSignals(userId);
  const veto = vetoSet(spec.profiles);
  const cands = spec.profiles.map((p, i) => {
    const m = scoreStrain(strainName, p as unknown as TasteProfileInput, feedback);
    return {
      world: spec.worlds[i],
      eff: m.matchScore - (spec.penalties[p.id] ?? 0),
      unclamped: m.unclampedScore,
      category: m.category,
    };
  });
  const pick = pickWorld(cands, veto.has(strainName) || spec.balance);
  const score = clamp(Math.round(pick.eff), 4, 99);
  return { score, category: pick.category, sort: sortKey(score, pick.unclamped) };
}

// Taste Match across a blend. Each profile is analysed in full (prose,
// sub-scores), then merged best-of after subtracting each world's penalty.
// The winning world's recommendation is kept; only matchScore reflects the
// blend, and `world` tags its origin. `mergeBreakdown` carries raw per-world
// scores for the audit.
export function analyzeMerged(opts: {
  strains: string[];
  profiles: TasteProfile[];
  penalties: Record<string, number>;
  feedback: FeedbackSignal[];
  overrides?: Map<string, StrainProfile>;
  density?: number;
  priorities?: { senses?: number; effect?: number };
  balance?: boolean; // bridge mode: rank by the weakest world (min)
}): AnalysisResult & { mergeBreakdown: MergeBreakdown } {
  const per = opts.profiles.map((p, i) => ({
    p,
    world: worldNameOf(p, i),
    penalty: opts.penalties[p.id] ?? 0,
    res: analyze(
      opts.strains,
      p as unknown as TasteProfileInput,
      opts.feedback,
      opts.overrides,
      opts.density,
      opts.priorities,
    ),
  }));

  const veto = vetoSet(opts.profiles);
  // Per-world avoid sets, so a vetoed strain can name WHICH worlds avoid it.
  const avoidByWorld = per.map((pp) => ({ world: pp.world, names: avoidNamesOf(pp.p) }));
  const maps = per.map(
    (pp) => new Map(pp.res.recommendations.map((r) => [r.strainName, r])),
  );
  const keys = per[0].res.recommendations.map((r) => r.strainName);

  const recommendations: StrainMatch[] = [];
  const mergeBreakdown: MergeBreakdown = {};
  for (const key of keys) {
    const cands = per.map((pp, idx) => {
      const rec = maps[idx].get(key)!;
      return {
        rec,
        world: pp.world,
        eff: rec.matchScore - pp.penalty,
        unclamped: rec.unclampedScore,
        category: rec.category,
      };
    });
    mergeBreakdown[key] = cands.map((c) => ({ world: c.world, score: c.rec.matchScore }));

    const resolved = cands[0].rec.resolvedName;
    const vetoed = veto.has(resolved);
    const pick = pickWorld(cands, vetoed || Boolean(opts.balance));
    const score = clamp(Math.round(pick.eff), 4, 99);
    const avoidedBy = vetoed
      ? avoidByWorld.filter((a) => a.names.has(resolved)).map((a) => a.world)
      : [];
    recommendations.push({
      ...pick.rec,
      matchScore: score,
      world: pick.world,
      avoidedBy: avoidedBy.length > 0 ? avoidedBy : undefined,
    });
  }

  recommendations.sort(
    (a, b) => b.matchScore - a.matchScore || b.unclampedScore - a.unclampedScore,
  );
  return {
    recommendations,
    engine: per[0].res.engine,
    generatedAt: per[0].res.generatedAt,
    mergeBreakdown,
  };
}
