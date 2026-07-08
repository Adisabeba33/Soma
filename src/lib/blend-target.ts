// Weighted-blend scoring — the "mix into one taste" model for the Taste Blender.
//
// The best-of merge answers "which ONE of my profiles does this strain fit
// best?". That never composes flavours: a gassy strain and a gassy-AND-sweet
// strain tie (both win via gas), so a "20% sweet" dial does almost nothing.
//
// This model instead treats the recipe as a TARGET: each profile has a desired
// prominence set by its share (gas 60% → want it strong; sweet 20% → want just
// a light note). For each strain we combine, per profile:
//   • fit      — how well the strain matches that profile (the existing engine)
//   • closeness — how near the strain's ACTUAL prominence of that profile's
//                 character is to the desired level, penalising OVERSHOOT
//                 (a cloying, sweet-dominant strain when you asked for a hint).
// Minor profiles lean on closeness (so cloying sinks); the dominant leans on
// fit (so it still needs to nail the main character). Constants are calibrated
// against scripts/stress.

import { scoreStrain } from "./taste-engine";
import { findStrain } from "./strain-data";
import { primaryAromaTokens } from "./profile-target";
import type { TasteProfileInput, FeedbackSignal } from "./types";

// Sweetness spans more than one forced-choice family (sweet ↔ fruit), so a
// minor "sweet" side must also count fruity/creamy/candy prominence — else a
// creamy-dessert strain slips the "not too sweet" penalty. Broad sensory
// groups used only to MEASURE a side's prominence (never to match).
const SENSORY_GROUPS: Record<string, string[]> = {
  sweet: ["sweet", "creamy", "vanilla", "candy", "dessert", "fruity", "berry", "tropical", "grape"],
  fruit: ["fruity", "berry", "tropical", "grape", "sweet"],
  gas: ["gassy", "diesel"],
  earthfunk: ["earthy", "skunky", "cheese", "woody"],
  citrus: ["citrus"],
  pineherb: ["pine", "herbal", "spicy", "floral"],
};

export type BlendMember = { profile: TasteProfileInput; share: number }; // shares sum to ~1

// Tier-scaled prominence of a set of tokens in a strain: dominant=1, present=.66,
// trace=.33, absent=0. Takes the strongest signal across the tokens.
function characterLevel(strainName: string, tokens: string[]): number {
  const s = findStrain(strainName);
  if (!s || tokens.length === 0) return 0;
  const prim = new Set([...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])]);
  const pres = new Set([...(s.aromas ?? []), ...(s.flavors ?? [])]);
  const tr = new Set([...(s.traceAromas ?? []), ...(s.traceFlavors ?? [])]);
  let best = 0;
  for (const t of tokens) {
    if (prim.has(t)) best = Math.max(best, 1);
    else if (pres.has(t)) best = Math.max(best, 0.66);
    else if (tr.has(t)) best = Math.max(best, 0.33);
  }
  return best;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Tokens used to MEASURE a side's prominence in a strain: the profile's own
// preferred aromas/flavours, widened to the whole sensory group of its
// forced-choice primary aroma (so "sweet" also catches creamy/fruity/candy).
function signatureTokens(p: TasteProfileInput): string[] {
  const own = [...(p.preferredAromas ?? []), ...(p.preferredFlavors ?? [])];
  const famKey = p.primaryAroma && SENSORY_GROUPS[p.primaryAroma] ? p.primaryAroma : null;
  const group = famKey ? SENSORY_GROUPS[famKey] : primaryAromaTokens(p);
  return Array.from(new Set([...own, ...group]));
}

// How a MINOR side is scored against its target prominence:
//   • OVERSHOOT — cloying (sweet-dominant when you asked for a hint): heavy cost
//   • UNDERSHOOT — the note is missing entirely: also a cost, so a strain WITH
//     the light note is confidently preferred over plain gas
//   • ON_TARGET — a reward for landing right on the light note, so
//     "gas + a light sweet touch" rises to the very top at a 20% dial.
// Calibrated on the gas+20%-sweet case; retune broadly against scripts/stress.
const OVERSHOOT = 46;
const UNDERSHOOT = 42;
const ON_TARGET = 10;

export function scoreBlendTarget(
  strainName: string,
  members: BlendMember[],
  feedback: FeedbackSignal[] = [],
): number {
  if (members.length === 0) return 0;
  // The dominant side (largest share) sets the main character; every other
  // side is a "minor" whose prominence must land near its target level.
  const domIdx = members.reduce(
    (best, m, i) => (m.share > members[best].share ? i : best),
    0,
  );

  // Base = share-weighted fit across all sides (the "mix into one taste").
  let weightedFit = 0;
  let wsum = 0;
  for (const m of members) {
    weightedFit += m.share * scoreStrain(strainName, m.profile, feedback).matchScore;
    wsum += m.share;
  }
  weightedFit = wsum > 0 ? weightedFit / wsum : 0;

  // Subtract how far each minor side's actual prominence sits from its target
  // — cloying over-presence and total absence both cost points.
  let penalty = 0;
  members.forEach((m, i) => {
    if (i === domIdx) return;
    const level = characterLevel(strainName, signatureTokens(m.profile)); // 0..1
    const desired = clamp01(m.share * 1.5); // 20%→.30 (light), 33%→.50, 60%→.90
    const onTarget = Math.max(0, 1 - 2 * Math.abs(level - desired)); // 1 = spot on
    penalty +=
      OVERSHOOT * Math.max(0, level - desired) +
      UNDERSHOOT * Math.max(0, desired - level) -
      ON_TARGET * onTarget;
  });

  return clamp01((weightedFit - penalty) / 100) * 100;
}
