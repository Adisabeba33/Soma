// Engine run audit log — every successful /api/analyze (Taste Match) and
// /api/compare (Compare) run writes a deterministic snapshot. The same
// schema is used for both entry paths; the `source` discriminator and
// the optional `taste` context block distinguish them in retrospect.
//
// Persistence: default is Postgres (RunAudit model). Set
// RUN_AUDIT_BACKEND=file (or legacy COMPARE_AUDIT_BACKEND=file) to write
// run-audit/*.json instead. Set RUN_AUDIT=off (or COMPARE_AUDIT=off) to
// disable. Disk fallback is dev-only — Vercel filesystem is ephemeral.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { effectArchetypeOf } from "./effect-archetype";
import type { EffectArchetype } from "./effect-archetype";
import { effectTextureOf } from "./effect-texture";
import type { EffectTexture } from "./effect-texture";
import { behavioralFamilyOf, hasClusteredFavorites } from "./behavioral-family";
import { resolveProfileTarget } from "./profile-target";
import type { BehavioralFamily } from "./behavioral-family";
import {
  detectProfileContradictions,
  type ProfileContradiction,
} from "./profile-contradictions";
import {
  ENGINE_VERSION,
  reconciledDislikes,
  resolveStrain,
} from "./taste-engine";
import { VOCAB_VERSION } from "./vocab";
import type { ParsedMenuItem } from "./parse-menu";
import type {
  MenuQuality,
  PurchaseConfidence,
  StrainMatch,
  TasteProfileInput,
} from "./types";

export type RunAuditSource = "compare" | "taste-match";

export interface RunAuditItem {
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

// Mode 1 (Taste Match) carries additional context that Compare doesn't:
// the AnalysisSession id, the input type, parsed menu items and the
// computed menu-quality summary. Nested so Compare entries simply omit
// the block instead of carrying a pile of nulls.
export interface RunAuditTasteContext {
  sessionId: string;
  inputType: "manual" | "paste";
  parsedItems: ParsedMenuItem[] | null;
  menuQuality: MenuQuality | null;
  engine: "builtin" | "openai";
}

export interface RunAuditEntry {
  runAt: string;
  schemaVersion: 2;
  source: RunAuditSource;
  userId: string;
  profile: TasteProfileInput;
  rawInputs: string[];
  modeSnapshot: {
    trustMode: boolean;
    targetArchetype: EffectArchetype | null;
    targetTexture: EffectTexture | null;
    targetFamily: BehavioralFamily | null;
    // How the target was decided: "forced" (from the primaryAroma/
    // primaryEffect/useTime answers) or "inferred" (legacy, from
    // favourites/preferences).
    targetSource: "forced" | "inferred";
    // Dislikes silenced because the user's own favourites would
    // themselves trigger them — surfaces self-contradicting profiles.
    reconciledDislikes: string[];
    // Structured records, one per detected contradiction. Always
    // present — empty array means "no contradictions detected."
    contradictions: ProfileContradiction[];
    // Version markers — let audit readers pivot on era without git
    // archaeology. vocabVersion bumps when sensory tokens change,
    // engineVersion bumps when the scoring formula changes.
    vocabVersion: string;
    engineVersion: string;
  };
  items: RunAuditItem[];
  closestName: string;
  // Mode 1 only. Omitted for Compare runs.
  taste?: RunAuditTasteContext;
}

export function buildAuditItem(
  raw: string,
  match: StrainMatch,
): RunAuditItem {
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

export interface BuildAuditEntryArgs {
  source: RunAuditSource;
  userId: string;
  profile: TasteProfileInput;
  rawInputs: string[];
  matches: StrainMatch[];
  closestName: string;
  taste?: RunAuditTasteContext;
}

export function buildAuditEntry(args: BuildAuditEntryArgs): RunAuditEntry {
  const target = resolveProfileTarget(args.profile);
  const entry: RunAuditEntry = {
    runAt: new Date().toISOString(),
    schemaVersion: 2,
    source: args.source,
    userId: args.userId,
    profile: args.profile,
    rawInputs: args.rawInputs,
    modeSnapshot: {
      trustMode: hasClusteredFavorites(args.profile),
      targetArchetype: target.archetype,
      targetTexture: target.texture,
      targetFamily: target.family,
      targetSource: target.source,
      reconciledDislikes: reconciledDislikes(args.profile),
      contradictions: detectProfileContradictions(args.profile),
      vocabVersion: VOCAB_VERSION,
      engineVersion: ENGINE_VERSION,
    },
    // Each match carries its own raw input (strainName). Build items from
    // the matches directly rather than zipping rawInputs by index — the
    // engine sorts/dedups recommendations, so rawInputs[i] does NOT line up
    // with matches[i] (that mismatch swapped raw labels in Taste Match
    // audits). rawInputs is still recorded verbatim at the top level.
    items: args.matches.map((match) =>
      buildAuditItem(match.strainName, match),
    ),
    closestName: args.closestName,
  };
  if (args.taste) entry.taste = args.taste;
  return entry;
}

// Fire-and-forget write. Default backend is Postgres so audits survive
// serverless deploys. Set RUN_AUDIT_BACKEND=file to write to disk
// instead. Set RUN_AUDIT=off to disable. Legacy env vars
// (COMPARE_AUDIT, COMPARE_AUDIT_BACKEND) still honoured.
export async function writeRunAudit(
  entry: RunAuditEntry,
): Promise<string | null> {
  if (
    process.env.RUN_AUDIT === "off" ||
    process.env.COMPARE_AUDIT === "off"
  ) {
    return null;
  }
  const backend =
    process.env.RUN_AUDIT_BACKEND ?? process.env.COMPARE_AUDIT_BACKEND;
  if (backend === "file") return writeRunAuditToFile(entry);
  return writeRunAuditToDb(entry);
}

async function writeRunAuditToDb(
  entry: RunAuditEntry,
): Promise<string | null> {
  try {
    const { prisma } = await import("./prisma");
    const row = await prisma.runAudit.create({
      data: {
        userId: entry.userId,
        source: entry.source,
        runAt: new Date(entry.runAt),
        snapshot: entry as unknown as object as never,
      },
      select: { id: true },
    });
    return row.id;
  } catch (err) {
    console.error("run audit DB write failed", err);
    return null;
  }
}

function writeRunAuditToFile(entry: RunAuditEntry): string | null {
  try {
    const dir = join(process.cwd(), "run-audit");
    mkdirSync(dir, { recursive: true });
    const ts = entry.runAt.replace(/[:.]/g, "-");
    const userHash = shortHash(entry.userId);
    const path = join(dir, `${ts}_${entry.source}_${userHash}.json`);
    writeFileSync(path, JSON.stringify(entry, null, 2) + "\n");
    return path;
  } catch (err) {
    console.error("run audit file write failed", err);
    return null;
  }
}

function shortHash(s: string): string {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
}
