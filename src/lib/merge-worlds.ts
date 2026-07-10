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
import { scoreStrain, analyze, ENGINE_VERSION } from "./taste-engine";
import { getFeedbackSignals } from "./api";
import { getOrCompute, fingerprint } from "./match-cache";
import { STRAINS, findStrain } from "./strain-data";
import type {
  Category,
  StrainMatch,
  AnalysisResult,
  FeedbackSignal,
  StrainProfile,
} from "./types";
import type { CatalogMatch } from "./catalog";
import type { TasteProfile } from "@prisma/client";
import { toEngineInput } from "./engine-input";
import { scoreBlendTarget, type BlendMember } from "./blend-target";

// Pair lean: at full lean a pair member loses at most this many points — a
// tilt, not a switch. Third admix: at lean2=0 the third is dosed down by this
// (still slightly present), at lean2=1 it's a full equal world.
const PAIR_CAP = 25;
const ADMIX_CAP = 30;

// ── Weighted-recipe mode (experimental, env-gated) ─────────────────────────
// BLEND_MODEL=target switches the Taste Blender's best-of merge to the
// weighted-recipe scorer (blend-target.ts): the dials become SHARES of one
// composed taste instead of penalties on separate worlds. Only affects
// blenderActive + best-of runs; balance (bridge) mode and the blender-off
// Harvest merge keep their existing semantics. Unset (default) = no change.
const blendTargetEnabled = () => process.env.BLEND_MODEL === "target";

// Dial → share mapping, consistent with the dials' documented meaning:
//   • the third takes lean2/3 of the total — at lean2=1 it is "a full equal
//     world" (⅓ with a balanced pair), at 0 it vanishes from the recipe;
//   • the pair splits the remaining mass (1+lean1)/2 : (1−lean1)/2, primary
//     on the (1+lean1) side — lean1=0 is an even split.
// Shares are keyed by profile id and sum to 1.
export function leanToShares(
  pair: { id: string }[],
  primaryId: string,
  lean1: number,
  third?: { id: string } | null,
  lean2?: number,
): Record<string, number> {
  const thirdShare = third ? clamp(lean2 ?? 0, 0, 1) / 3 : 0;
  const pairMass = 1 - thirdShare;
  const l = clamp(lean1, -1, 1);
  const shares: Record<string, number> = {};
  for (const p of pair) {
    shares[p.id] = pairMass * (p.id === primaryId ? (1 + l) / 2 : (1 - l) / 2);
  }
  if (third) shares[third.id] = thirdShare;
  return shares;
}

// Category from the score bands alone (thresholds mirror categorize() in
// taste-engine.ts). The weighted-recipe score has no single "winning world"
// whose conflict count could cap the category, so banding is the honest read.
function bandOf(score: number): Category {
  if (score >= 80) return "Best Match";
  if (score >= 66) return "Closest Alternative";
  if (score >= 50) return "Worth Trying";
  if (score >= 36) return "Risky";
  return "Avoid";
}

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
  // Weighted-recipe shares by profile id (sum 1). Present ONLY when the
  // BLEND_MODEL=target flag is on and this is a blenderActive best-of run —
  // consumers switch to scoreBlendTarget when they see it.
  shares?: Record<string, number>;
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
      // id tiebreak so pair/third selection matches the account UI exactly even
      // when two profiles share a createdAt.
      .findMany({ where: { userId }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] })
      .catch(() => [] as TasteProfile[]),
  ]);

  // The merge set, in profile-creation order (the findMany is already ordered
  // by createdAt). First two merged = the adjustable pair; a third merged
  // profile is the "third" that blends in.
  const mergedSorted = all.filter((p) => p.merged);
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
        ...(blendTargetEnabled() && !balance
          ? {
              shares: leanToShares(
                pair,
                primary.id,
                lean1,
                third,
                clamp(user.blenderLean2, 0, 1),
              ),
            }
          : {}),
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
      ...(blendTargetEnabled() && !balance
        ? { shares: leanToShares(pair, primary.id, lean1) }
        : {}),
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

  // Full-catalog blend scoring is pure CPU on inputs that rarely change
  // between requests — cache per instance, keyed on everything that can move
  // a score (see match-cache.ts). Profile updatedAt covers profile edits;
  // penalties/shares/balance cover every blender dial.
  const cacheKey = [
    "merged",
    ENGINE_VERSION,
    fingerprint(spec.profiles.map((p) => [p.id, p.updatedAt?.getTime?.() ?? 0])),
    fingerprint([spec.penalties, spec.shares ?? null, spec.balance, spec.blenderActive]),
    fingerprint(feedback),
  ].join("|");
  const matches = getOrCompute(cacheKey, () =>
    computeMergedMatches(spec, feedback),
  );

  return {
    worlds: spec.worlds,
    matches,
    veto: [...vetoSet(spec.profiles)],
    blenderActive: spec.blenderActive,
  };
}

function computeMergedMatches(
  spec: BlendSpec,
  feedback: FeedbackSignal[],
): Record<string, CatalogMatch> {
  const veto = vetoSet(spec.profiles);
  const matches: Record<string, CatalogMatch> = {};

  // Weighted-recipe mode (BLEND_MODEL=target): non-vetoed strains score
  // against the recipe as one composed taste. Vetoes keep best-of semantics
  // (sunk to the lowest world) — a dealbreaker is a dealbreaker in any model.
  const engineInputs = spec.profiles.map(toEngineInput);
  const members: BlendMember[] | null = spec.shares
    ? spec.profiles.map((p, i) => ({
        profile: engineInputs[i],
        share: spec.shares![p.id] ?? 0,
      }))
    : null;

  for (const strain of STRAINS) {
    if (members && !veto.has(strain.name)) {
      const t = scoreBlendTarget(strain.name, members, feedback);
      const score = clamp(Math.round(t), 4, 99);
      matches[strain.name] = {
        score,
        category: bandOf(score),
        sort: sortKey(score, t),
      };
      continue;
    }
    const cands = spec.profiles.map((p, i) => {
      const m = scoreStrain(strain.name, engineInputs[i], feedback);
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

  return matches;
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
  // Weighted-recipe mode — same rule as mergedMatches so the detail page
  // agrees with the catalog list.
  if (spec.shares && !veto.has(strainName)) {
    const members: BlendMember[] = spec.profiles.map((p) => ({
      profile: toEngineInput(p),
      share: spec.shares![p.id] ?? 0,
    }));
    const t = scoreBlendTarget(strainName, members, feedback);
    const score = clamp(Math.round(t), 4, 99);
    return { score, category: bandOf(score), sort: sortKey(score, t) };
  }
  const cands = spec.profiles.map((p, i) => {
    const m = scoreStrain(strainName, toEngineInput(p), feedback);
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
//
// When `shares` is present (weighted-recipe mode, BLEND_MODEL=target), the
// matchScore of non-vetoed strains comes from scoreBlendTarget instead of
// best-of; the prose/sub-scores still come from the strongest world (the
// closest single read we have) and mergeBreakdown stays per-world truthful.
export function analyzeMerged(opts: {
  strains: string[];
  profiles: TasteProfile[];
  penalties: Record<string, number>;
  feedback: FeedbackSignal[];
  overrides?: Map<string, StrainProfile>;
  density?: number;
  priorities?: { senses?: number; effect?: number };
  balance?: boolean; // bridge mode: rank by the weakest world (min)
  shares?: Record<string, number>; // weighted-recipe shares by profile id
}): AnalysisResult & { mergeBreakdown: MergeBreakdown } {
  const engineInputs = opts.profiles.map(toEngineInput);
  const per = opts.profiles.map((p, i) => ({
    p,
    world: worldNameOf(p, i),
    penalty: opts.penalties[p.id] ?? 0,
    res: analyze(
      opts.strains,
      engineInputs[i],
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
    // Weighted-recipe score for non-vetoed strains; vetoes keep the
    // lowest-world sink in every model.
    const targetScore =
      opts.shares && !vetoed
        ? scoreBlendTarget(
            key,
            opts.profiles.map((p, i) => ({
              profile: engineInputs[i],
              share: opts.shares![p.id] ?? 0,
            })),
            opts.feedback,
            opts.overrides,
          )
        : null;
    const score =
      targetScore !== null
        ? clamp(Math.round(targetScore), 4, 99)
        : clamp(Math.round(pick.eff), 4, 99);
    const avoidedBy = vetoed
      ? avoidByWorld.filter((a) => a.names.has(resolved)).map((a) => a.world)
      : [];
    recommendations.push({
      ...pick.rec,
      matchScore: score,
      ...(targetScore !== null ? { category: bandOf(score) } : {}),
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
