import { prisma } from "@/lib/prisma";
import type { StrainMatch } from "@/lib/types";

// The single account allowed to see engine internals — "Audit mode" on
// results and the /api/audit/export dump. Set SOMA_OWNER_USERNAME in the
// environment to override; defaults to the project owner so the gate works
// without extra config. Matched case-insensitively against the @username.
const OWNER_USERNAME = (process.env.SOMA_OWNER_USERNAME ?? "Adisabeba")
  .trim()
  .toLowerCase();

// Pure check against a known username (no DB round-trip). Used where the
// caller already has the username in hand (e.g. /api/auth/me).
export function isOwnerUsername(username: string | null | undefined): boolean {
  return Boolean(username && username.trim().toLowerCase() === OWNER_USERNAME);
}

// Resolve ownership from a user id. Anonymous users (no username) are never
// owners, so the audit surface is invisible to everyone but the owner account.
export async function isOwner(userId: string): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });
  return isOwnerUsername(user?.username);
}

// Neutralise the engine-internal "Audit mode" fields (see StrainMatch in
// types.ts) so they carry no information for non-owners. The public match —
// score, category, matched tags, why-it-fits, purchase confidence — is left
// untouched; only the reverse-engineering surface (raw pre-feedback score,
// per-channel and bonus breakdown, per-tag match/penalty point strengths,
// missing tags and the feedback math) is blanked. Applied server-side before
// the response leaves the server, so non-owners never receive the data and
// Audit mode cannot be reconstructed from the network payload.
export function redactAuditFields<T extends StrainMatch>(item: T): T {
  return {
    ...item,
    baseScore: item.matchScore,
    feedbackPotential: 0,
    feedbackDecay: 0,
    matchStrengths: [],
    penaltyStrengths: [],
    missingTags: { critical: [], secondary: [], effect: [] },
    channels: {
      ref: { score: 0, contribution: 0 },
      effect: { score: 0, contribution: 0 },
      aroma: { score: 0, contribution: 0 },
      flavor: { score: 0, contribution: 0 },
    },
    bonuses: {
      family: 0,
      archetype: 0,
      texture: 0,
      sensory: 0,
      potency: 0,
      familyPref: 0,
      density: 0,
    },
  };
}
