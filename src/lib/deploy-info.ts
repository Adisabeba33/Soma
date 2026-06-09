// Build / deploy status surface.
//
// Reads the deployment markers SOMA needs to answer the question
// "is what I'm looking at the latest code?" from a mix of:
//   - In-code version constants (engine, vocab) compiled into the build
//   - Vercel-provided git env vars (commit SHA, message, author, branch)
//
// All values are read server-side and exposed as a single typed object
// so the /stats page can render them without each consumer having to
// know which env var maps to what. On local dev the Vercel vars are
// absent — the helper flags `isLocal=true` so the UI can show a clear
// "local development" badge instead of empty fields.

import { ENGINE_VERSION } from "./taste-engine";
import { VOCAB_VERSION } from "./vocab";

export interface DeployInfo {
  // In-code markers — change when a behaviour-affecting code change
  // ships. Bumped explicitly in src/lib/taste-engine.ts and
  // src/lib/vocab.ts respectively.
  engineVersion: string;
  vocabVersion: string;

  // Vercel git env vars. Each is null when running outside Vercel.
  commitShaShort: string | null;
  commitShaFull: string | null;
  commitMessage: string | null;
  commitAuthor: string | null;
  branch: string | null;

  // "production" | "preview" | "development" from Vercel; null on local.
  vercelEnv: string | null;

  // True when none of the Vercel env vars are set (local dev / test).
  isLocal: boolean;
}

export function getDeployInfo(): DeployInfo {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;
  const isLocal = !process.env.VERCEL;
  return {
    engineVersion: ENGINE_VERSION,
    vocabVersion: VOCAB_VERSION,
    commitShaFull: sha,
    commitShaShort: sha ? sha.slice(0, 7) : null,
    commitMessage: cleanMessage(process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null),
    commitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    isLocal,
  };
}

// Commit messages can carry newlines and a long body. The /stats panel
// only renders the first line (the subject) so we trim aggressively here
// to keep the surface predictable.
function cleanMessage(raw: string | null): string | null {
  if (!raw) return null;
  const firstLine = raw.split(/\r?\n/)[0]?.trim() ?? "";
  return firstLine || null;
}

// GitHub URL for the current commit, when we have enough env data to
// build one. Returns null otherwise — callers should treat null as
// "no clickable source available."
export function commitUrl(info: DeployInfo): string | null {
  if (!info.commitShaFull) return null;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  if (!owner || !slug) return null;
  return `https://github.com/${owner}/${slug}/commit/${info.commitShaFull}`;
}
