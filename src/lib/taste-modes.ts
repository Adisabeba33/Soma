// Multi-modal taste model (deferred-improvements idea 1 / #8).
//
// The engine used to fold every favourite into ONE scoring target
// (resolveProfileTarget → one archetype/texture/behavioural-family). For a
// user whose favourites span different worlds — say a candy-daytime strain
// AND a heavy gas-night strain — that average is mush: each candidate is
// measured against a blurred centre that fits neither side well.
//
// deriveTasteModes splits the favourites into 1–3 "taste modes", each with
// its own target, so the scorer can credit a candidate against whichever
// mode it fits best (max-over-modes) instead of one muddy average.
//
// Safety: when the favourites don't actually span families (the common
// case — 0/1 favourite, or all in one family), this returns a SINGLE mode
// whose target equals resolveProfileTarget(profile). The scorer's
// single-mode path is then byte-identical to the pre-change behaviour, so
// calibration is untouched. Multi-modal scoring only kicks in for profiles
// that genuinely span families.

import { findStrain } from "./strain-data";
import { behavioralFamilyOf, type BehavioralFamily } from "./behavioral-family";
import { resolveProfileTarget, type ResolvedTarget } from "./profile-target";
import type { StrainProfile, TasteProfileInput } from "./types";

// Cap on how many modes we score against. Keeps the per-candidate cost
// bounded and matches reality (very few users name 4+ favourites spanning
// 4+ families). Extra families beyond the cap still contribute through the
// global referenceSimilarity / sensoryFamilyBonus signals, which already
// take the max across ALL favourites.
const MAX_MODES = 3;

export interface TasteMode {
  // Favourite strain names that anchor this mode (canonical StrainProfile
  // names, resolved through findStrain).
  favorites: string[];
  // The behavioural family the cluster centres on (null for a single
  // "no resolved family" group).
  family: BehavioralFamily | null;
  // Scoring target derived from THIS cluster alone — each mode aims at its
  // own archetype/texture/family.
  target: ResolvedTarget;
  // Short label for explanations, e.g. "nighttime-indica".
  label: string;
}

function labelFor(family: BehavioralFamily | null, target: ResolvedTarget): string {
  return family ?? target.family ?? target.archetype ?? "your taste";
}

// Build the single whole-profile mode — the pre-change behaviour.
function singleMode(
  profile: TasteProfileInput,
  favorites: string[],
  family: BehavioralFamily | null,
): TasteMode[] {
  const target = resolveProfileTarget(profile);
  return [{ favorites, family, target, label: labelFor(family, target) }];
}

export function deriveTasteModes(profile: TasteProfileInput): TasteMode[] {
  // Forced-choice answers pin a SINGLE explicit target (resolveProfileTarget
  // returns source "forced"); the user has named one mode, so don't split.
  const whole = resolveProfileTarget(profile);

  const resolved = profile.favoriteStrains
    .map((name) => {
      const s = findStrain(name);
      return s ? { name: s.name, strain: s } : null;
    })
    .filter((x): x is { name: string; strain: StrainProfile } => x !== null);

  const allNames = resolved.map((r) => r.name);

  if (whole.source === "forced" || resolved.length < 2) {
    return singleMode(profile, allNames, null);
  }

  // Group favourites by behavioural family, preserving first-appearance order.
  const groups = new Map<string, { family: BehavioralFamily | null; names: string[] }>();
  for (const { name, strain } of resolved) {
    const fam = behavioralFamilyOf(strain);
    const key = fam ?? "__none__";
    if (!groups.has(key)) groups.set(key, { family: fam, names: [] });
    groups.get(key)!.names.push(name);
  }

  // A single group (all favourites share a family, or all unresolved) is not
  // multi-modal — fall back to the whole-profile target so the scorer stays
  // on its unchanged single-mode path.
  if (groups.size < 2) {
    const only = [...groups.values()][0];
    return singleMode(profile, allNames, only?.family ?? null);
  }

  // Largest groups first (ties keep first-appearance order via stable sort),
  // capped at MAX_MODES. Each mode's target comes from a sub-profile holding
  // only that cluster's favourites, reusing the existing inference.
  const ordered = [...groups.values()].sort((a, b) => b.names.length - a.names.length);
  return ordered.slice(0, MAX_MODES).map(({ family, names }) => {
    const subProfile: TasteProfileInput = { ...profile, favoriteStrains: names };
    const target = resolveProfileTarget(subProfile);
    return { favorites: names, family, target, label: labelFor(family, target) };
  });
}
