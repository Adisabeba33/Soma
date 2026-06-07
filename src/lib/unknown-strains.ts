import type { ParsedMenuItem } from "./parse-menu";
import {
  normalizeGrowerKey,
  normalizeStrainQueryName,
} from "./strain-normalize";
import type { StrainMatch } from "./types";

export interface UnknownStrainPayload {
  userId: string;
  // null when the call originates from /api/compare — Compare doesn't
  // create an AnalysisSession row, but we still want the strain typed
  // by the user counted in the expansion queue. UnknownStrain.sessionId
  // is nullable in the schema for exactly this case.
  sessionId: string | null;
  rawName: string;
  normalizedName: string;
  grower: string | null;
  growerKey: string;
  rawLine: string | null;
}

// Pure helper: build the upsert payloads from the engine output plus the
// parsed-menu items. Kept separate from the DB call so it's unit-testable
// without standing up Prisma.
export function buildUnknownStrainPayloads(
  userId: string,
  sessionId: string | null,
  matches: StrainMatch[],
  items: ParsedMenuItem[],
): UnknownStrainPayload[] {
  const itemByName = new Map<string, ParsedMenuItem>();
  for (const item of items) {
    itemByName.set(item.strainName.toLowerCase(), item);
  }

  const payloads: UnknownStrainPayload[] = [];
  for (const match of matches) {
    if (match.knownStrain) continue;
    const normalizedName = normalizeStrainQueryName(match.strainName);
    if (!normalizedName) continue;
    const item = itemByName.get(match.strainName.toLowerCase()) ?? null;
    const grower = item?.grower ?? null;
    payloads.push({
      userId,
      sessionId,
      rawName: match.strainName,
      normalizedName,
      grower,
      growerKey: normalizeGrowerKey(grower),
      rawLine: item?.rawLine ?? null,
    });
  }
  return payloads;
}
