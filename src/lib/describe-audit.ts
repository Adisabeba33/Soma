// Describe-intake telemetry — every /api/profile/from-description submission
// writes a compact, anonymous snapshot: the raw phrasing, the tokens the
// parser understood, and the content words it did NOT (the growth signal for
// new synonyms). See docs/deferred-improvements.md #18.
//
// Mirrors run-audit.ts: default backend is Postgres (DescribeAudit model) so
// it survives serverless deploys; RUN_AUDIT_BACKEND=file writes
// run-audit/*.json for dev; RUN_AUDIT=off disables. Fire-and-forget — logging
// must never block or break the describe response. Deliberately stores no
// userId: this is anonymous intake text, kept aggregate-only.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describeLeftoverTerms } from "./profile-from-description";
import { VOCAB_VERSION } from "./vocab";
import type { InferredProfile } from "./profile-from-experience";

export interface DescribeAuditEntry {
  rawText: string;
  matchedTokens: string[];
  leftoverTerms: string[];
  hadSignal: boolean;
  vocabVersion: string;
  createdAt: string;
}

// The sensory/effect tokens the parser resolved, flattened for stats. Scalar
// forced-choices are namespaced ("time:evening") so they don't collide with
// effect tokens of the same spelling.
function matchedTokensOf(profile: InferredProfile): string[] {
  const tokens = new Set<string>([
    ...profile.preferredAromas,
    ...profile.preferredFlavors,
    ...profile.preferredEffects,
    ...profile.dislikedEffects.map((t) => `disliked:${t}`),
    ...profile.dislikedAromas.map((t) => `disliked:${t}`),
  ]);
  if (profile.useTime) tokens.add(`time:${profile.useTime}`);
  if (profile.primaryEffect) tokens.add(`primaryEffect:${profile.primaryEffect}`);
  if (profile.primaryAroma) tokens.add(`primaryAroma:${profile.primaryAroma}`);
  if (profile.potencyPreference) tokens.add(`potency:${profile.potencyPreference}`);
  return [...tokens];
}

export function buildDescribeAuditEntry(
  rawText: string,
  profile: InferredProfile,
  hadSignal: boolean,
): DescribeAuditEntry {
  return {
    rawText,
    matchedTokens: matchedTokensOf(profile),
    leftoverTerms: describeLeftoverTerms(rawText),
    hadSignal,
    vocabVersion: VOCAB_VERSION,
    createdAt: new Date().toISOString(),
  };
}

// Fire-and-forget write. Honours the same env switches as run-audit.
export async function writeDescribeAudit(
  entry: DescribeAuditEntry,
): Promise<string | null> {
  if (process.env.RUN_AUDIT === "off" || process.env.COMPARE_AUDIT === "off") {
    return null;
  }
  const backend =
    process.env.RUN_AUDIT_BACKEND ?? process.env.COMPARE_AUDIT_BACKEND;
  if (backend === "file") return writeToFile(entry);
  return writeToDb(entry);
}

async function writeToDb(entry: DescribeAuditEntry): Promise<string | null> {
  try {
    const { prisma } = await import("./prisma");
    const row = await prisma.describeAudit.create({
      data: {
        rawText: entry.rawText,
        matchedTokens: entry.matchedTokens,
        leftoverTerms: entry.leftoverTerms,
        hadSignal: entry.hadSignal,
        vocabVersion: entry.vocabVersion,
        createdAt: new Date(entry.createdAt),
      },
      select: { id: true },
    });
    return row.id;
  } catch (err) {
    console.error("describe audit DB write failed", err);
    return null;
  }
}

function writeToFile(entry: DescribeAuditEntry): string | null {
  try {
    const dir = join(process.cwd(), "run-audit");
    mkdirSync(dir, { recursive: true });
    const ts = entry.createdAt.replace(/[:.]/g, "-");
    const path = join(dir, `${ts}_describe.json`);
    writeFileSync(path, JSON.stringify(entry, null, 2) + "\n");
    return path;
  } catch (err) {
    console.error("describe audit file write failed", err);
    return null;
  }
}
