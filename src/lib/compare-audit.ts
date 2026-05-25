// Compare audit log — every /api/compare run writes a deterministic JSON
// snapshot to compare-audit/<timestamp>_<userHash>.json so we can replay
// "why did this score come out this way?" later without re-running the
// full session.
//
// Dev-focused: directory is gitignored, no DB schema, no UI. Set
// COMPARE_AUDIT=off in env to disable entirely.
//
// Schema is intentionally rich and verbose. Disk space is fine for dev
// volume; clarity in retrospect is worth more than compactness.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { effectArchetypeOf, inferProfileArchetype } from "./effect-archetype";
import type { EffectArchetype } from "./effect-archetype";
import { effectTextureOf, inferProfileTexture } from "./effect-texture";
import type { EffectTexture } from "./effect-texture";
import {
  behavioralFamilyOf,
  hasClusteredFavorites,
  inferProfileFamily,
} from "./behavioral-family";
import type { BehavioralFamily } from "./behavioral-family";
import { reconciledDislikes, resolveStrain } from "./taste-engine";
import type {
  PurchaseConfidence,
  StrainMatch,
  TasteProfileInput,
} from "./types";

export interface CompareAuditItem {
  raw: string;
  canonical: string;
  known: boolean;
  matchScore: number;
  category: string;
  confidence: string;
  subScores: {
    aroma: number;
    flavor: number;
    effect: number;
    trait: number;
    ref: number;
  };
  behavioralLayers: {
    archetype: EffectArchetype;
    texture: EffectTexture;
    family: BehavioralFamily | null;
  };
  conflicts: string[];
  feedbackAdjustment: number;
  feedbackNote: string | null;
  purchaseConfidence: PurchaseConfidence;
}

export interface CompareAuditEntry {
  runAt: string;
  schemaVersion: 1;
  userId: string;
  profile: TasteProfileInput;
  rawInputs: string[];
  modeSnapshot: {
    trustMode: boolean;
    targetArchetype: EffectArchetype | null;
    targetTexture: EffectTexture | null;
    targetFamily: BehavioralFamily | null;
    // Dislikes that were silenced because the user's own favourites
    // would themselves trigger them — surfaces self-contradicting
    // profiles transparently.
    reconciledDislikes: string[];
  };
  items: CompareAuditItem[];
  closestName: string;
}

export function buildAuditItem(
  raw: string,
  match: StrainMatch,
): CompareAuditItem {
  const { strain, known } = resolveStrain(raw);
  return {
    raw,
    canonical: match.resolvedName,
    known,
    matchScore: match.matchScore,
    category: match.category,
    confidence: match.confidence,
    subScores: {
      aroma: match.aromaMatch,
      flavor: match.flavorMatch,
      effect: match.effectMatch,
      trait: match.traitMatch,
      ref: match.referenceSimilarity,
    },
    behavioralLayers: {
      archetype: effectArchetypeOf(strain),
      texture: effectTextureOf(strain),
      family: behavioralFamilyOf(strain),
    },
    conflicts: match.conflicts,
    feedbackAdjustment: match.feedbackAdjustment,
    feedbackNote: match.feedbackNote,
    purchaseConfidence: match.purchaseConfidence,
  };
}

export function buildAuditEntry(
  userId: string,
  profile: TasteProfileInput,
  rawInputs: string[],
  matches: StrainMatch[],
  closestName: string,
): CompareAuditEntry {
  return {
    runAt: new Date().toISOString(),
    schemaVersion: 1,
    userId,
    profile,
    rawInputs,
    modeSnapshot: {
      trustMode: hasClusteredFavorites(profile),
      targetArchetype: inferProfileArchetype(profile),
      targetTexture: inferProfileTexture(profile),
      targetFamily: inferProfileFamily(profile),
      reconciledDislikes: reconciledDislikes(profile),
    },
    items: rawInputs.map((raw, i) => buildAuditItem(raw, matches[i])),
    closestName,
  };
}

// Fire-and-forget write. Never throws — audit failure must not break
// the compare response. Returns the written path or null when disabled
// or on filesystem error.
export function writeCompareAudit(entry: CompareAuditEntry): string | null {
  if (process.env.COMPARE_AUDIT === "off") return null;
  try {
    const dir = join(process.cwd(), "compare-audit");
    mkdirSync(dir, { recursive: true });
    const ts = entry.runAt.replace(/[:.]/g, "-");
    const userHash = shortHash(entry.userId);
    const path = join(dir, `${ts}_${userHash}.json`);
    writeFileSync(path, JSON.stringify(entry, null, 2) + "\n");
    return path;
  } catch (err) {
    console.error("compare audit write failed", err);
    return null;
  }
}

function shortHash(s: string): string {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}
