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
  // Merge runs only: which world (profile) produced this pick's score, and the
  // raw pre-lean score in every world, so the leaned result reconciles.
  world?: string;
  perWorld?: Array<{ world: string; score: number }>;
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

export interface RunAuditModeSnapshot {
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
}

// Merge runs only. One snapshot per merged profile (so each world reconciles
// independently), plus the per-run lean. Absent for single-profile runs.
export interface RunAuditMerge {
  bias: number; // −1…+1, + toward the primary profile
  profiles: Array<{
    name: string;
    primary: boolean; // the lean's "Main" end
    profile: TasteProfileInput;
    modeSnapshot: RunAuditModeSnapshot;
  }>;
}

export interface RunAuditEntry {
  runAt: string;
  schemaVersion: 3;
  source: RunAuditSource;
  userId: string;
  // The active profile (top-level, unchanged for single runs). On merge runs
  // every world's snapshot lives under `merge.profiles`.
  profile: TasteProfileInput;
  rawInputs: string[];
  modeSnapshot: RunAuditModeSnapshot;
  items: RunAuditItem[];
  closestName: string;
  // Mode 1 (Taste Match) only. Omitted for Compare runs.
  taste?: RunAuditTasteContext;
  // Present only when two or more profiles were merged for this run.
  merge?: RunAuditMerge;
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

// The per-profile snapshot — derived purely from a profile, so it can be built
// for the active profile and (on merge runs) for every merged world the same way.
function buildModeSnapshot(profile: TasteProfileInput): RunAuditModeSnapshot {
  const target = resolveProfileTarget(profile);
  return {
    trustMode: hasClusteredFavorites(profile),
    targetArchetype: target.archetype,
    targetTexture: target.texture,
    targetFamily: target.family,
    targetSource: target.source,
    reconciledDislikes: reconciledDislikes(profile),
    contradictions: detectProfileContradictions(profile),
    vocabVersion: VOCAB_VERSION,
    engineVersion: ENGINE_VERSION,
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
  // Present only for merge runs. `profiles` are the merged worlds (without the
  // per-world modeSnapshot, which this builder fills in); `breakdown` maps each
  // strain to its raw pre-lean score in every world.
  merge?: {
    bias: number;
    profiles: Array<{ name: string; primary: boolean; profile: TasteProfileInput }>;
    breakdown: Record<string, Array<{ world: string; score: number }>>;
  };
}

export function buildAuditEntry(args: BuildAuditEntryArgs): RunAuditEntry {
  const entry: RunAuditEntry = {
    runAt: new Date().toISOString(),
    schemaVersion: 3,
    source: args.source,
    userId: args.userId,
    profile: args.profile,
    rawInputs: args.rawInputs,
    modeSnapshot: buildModeSnapshot(args.profile),
    // Each match carries its own raw input (strainName). Build items from
    // the matches directly rather than zipping rawInputs by index — the
    // engine sorts/dedups recommendations, so rawInputs[i] does NOT line up
    // with matches[i] (that mismatch swapped raw labels in Taste Match
    // audits). rawInputs is still recorded verbatim at the top level.
    items: args.matches.map((match) => {
      const item = buildAuditItem(match.strainName, match);
      if (args.merge) {
        // On a merge run, record which world won and every world's raw score,
        // so the leaned matchScore reconciles with the per-world sub-scores.
        item.world = match.world;
        item.perWorld = args.merge.breakdown[match.strainName];
      }
      return item;
    }),
    closestName: args.closestName,
  };
  if (args.taste) entry.taste = args.taste;
  if (args.merge) {
    entry.merge = {
      bias: args.merge.bias,
      profiles: args.merge.profiles.map((p) => ({
        name: p.name,
        primary: p.primary,
        profile: p.profile,
        modeSnapshot: buildModeSnapshot(p.profile),
      })),
    };
  }
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
