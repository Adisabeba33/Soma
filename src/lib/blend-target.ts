// Weighted-blend scoring — the "mix into one taste" model for the Taste Blender.
//
// The best-of merge answers "which ONE of my profiles does this strain fit
// best?". That never composes flavours: a gassy strain and a gassy-AND-sweet
// strain tie (both win via gas), so a "20% sweet" dial does almost nothing.
//
// This model instead treats the recipe as a TARGET: each profile has a desired
// prominence set by its share (gas 60% → want it strong; sweet 20% → want just
// a light note). For each strain we combine:
//   • fit       — the share-weighted engine fit across all sides (base).
//   • closeness — per side, how near the strain's ACTUAL prominence of that
//                 side's character is to the desired level. OVERSHOOT (a
//                 cloying, sweet-dominant strain when you asked for a hint)
//                 costs most; UNDERSHOOT (the note missing entirely) costs
//                 too, so a strain WITH the light note beats plain gas; and
//                 landing ON TARGET earns a small reward.
//
// The closeness term applies to EVERY side symmetrically — there is no
// "dominant" pick. A 60% side wants its character strong (desired ≈ 0.9,
// which a genuinely fitting strain carries anyway), a 20% side wants a light
// note (≈ 0.3). This keeps equal-share recipes order-independent: an earlier
// revision singled out the largest share as "dominant" (exempt from
// closeness), which made a 50/50 recipe behave asymmetrically depending on
// profile array order.
//
// Fit is computed from the engine's UNCLAMPED score, not the visible
// matchScore — the visible number carries display calibration (favourite
// anchors floored to 94–96, the 89–92 elite-band remap) that would leak
// display artifacts into the blend math.
//
// Constants are calibrated against scripts/blend-target-report.ts (multiple
// recipes over the full catalog), not a single case.

import { scoreStrain, resolveStrain } from "./taste-engine";
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

// Tier-scaled prominence of a set of tokens in a strain: dominant=1,
// present=.66, trace=.33, absent=0. Takes the strongest signal across the
// tokens. Resolves through the same path as the engine (catalog hit, else
// keyword inference), so an off-catalog menu item is measured from its
// inferred profile instead of silently reading as "note absent" — an earlier
// revision used the catalog-only lookup and charged every unknown strain a
// full undershoot for notes it may well carry. Inferred data has no
// primary/trace tiers, so its notes all read as PRESENT, and the caller
// scales the whole closeness term down by UNKNOWN_DATA_WEIGHT.
function characterLevel(
  strainName: string,
  tokens: string[],
): { level: number; known: boolean } {
  const { strain: s, known } = resolveStrain(strainName);
  if (tokens.length === 0) return { level: 0, known };
  const prim = new Set([...(s.primaryAromas ?? []), ...(s.primaryFlavors ?? [])]);
  const pres = new Set([...(s.aromas ?? []), ...(s.flavors ?? [])]);
  const tr = new Set([...(s.traceAromas ?? []), ...(s.traceFlavors ?? [])]);
  let best = 0;
  for (const t of tokens) {
    if (prim.has(t)) best = Math.max(best, 1);
    else if (pres.has(t)) best = Math.max(best, 0.66);
    else if (tr.has(t)) best = Math.max(best, 0.33);
  }
  return { level: best, known };
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

// How each side is scored against its target prominence:
//   • OVERSHOOT — cloying (sweet-dominant when you asked for a hint): heavy cost
//   • UNDERSHOOT — the note is missing entirely: also a cost, so a strain WITH
//     the light note is confidently preferred over plain gas
//   • ON_TARGET — a reward for landing right on the note's desired level.
// Calibrated with scripts/blend-target-report.ts across gas+sweet (20/50%),
// citrus+dessert and 3-way recipes over the full catalog; retune there.
const OVERSHOOT = 34;
const UNDERSHOOT = 30;
const ON_TARGET = 8;
// Closeness weight for strains resolved by name inference (not in the
// catalog): their prominence read is a guess, so it moves the score half as
// much in either direction.
const UNKNOWN_DATA_WEIGHT = 0.5;

export function scoreBlendTarget(
  strainName: string,
  members: BlendMember[],
  feedback: FeedbackSignal[] = [],
): number {
  if (members.length === 0) return 0;

  // Base = share-weighted fit across all sides (the "mix into one taste"),
  // on the engine's unclamped scale so display calibration stays out.
  let weightedFit = 0;
  let wsum = 0;
  for (const m of members) {
    weightedFit += m.share * scoreStrain(strainName, m.profile, feedback).unclampedScore;
    wsum += m.share;
  }
  if (wsum <= 0) return 0;
  weightedFit /= wsum;

  // Add how far each side's actual prominence sits from its target — cloying
  // over-presence and total absence both cost points; landing on the level
  // earns a small reward. Shares are normalised so a recipe whose dials sum
  // to 0.9 or 1.1 still maps 20% → a light note.
  //
  // desired = √share: prominence saturates — even a small admix should be a
  // NOTICEABLE background note. 20% → .45 (between trace .33 and present
  // .66), 50% → .71 (a clear present note), 100% → 1 (dominant). A linear
  // map (share×1.5) put the 20% target at .30, right on the trace tier — so
  // a strain carrying the note as a normal background (present, .66)
  // overshot HARDER than a strain missing it entirely undershot, and the
  // "light sweet touch" dial actively punished background sweetness. With
  // √share the tier ordering at 20% is trace > present > absent > primary:
  // a hint is ideal, a background note still lifts, absence costs, and
  // cloying dominance sinks hardest.
  let penalty = 0;
  for (const m of members) {
    const { level, known } = characterLevel(strainName, signatureTokens(m.profile));
    const desired = clamp01(Math.sqrt(m.share / wsum));
    const onTarget = Math.max(0, 1 - 2 * Math.abs(level - desired)); // 1 = spot on
    const memberPenalty =
      OVERSHOOT * Math.max(0, level - desired) +
      UNDERSHOOT * Math.max(0, desired - level) -
      ON_TARGET * onTarget;
    penalty += (known ? 1 : UNKNOWN_DATA_WEIGHT) * memberPenalty;
  }

  return clamp01((weightedFit - penalty) / 100) * 100;
}
