import { randomUUID } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { SESSION_COOKIE, verifySessionClaims } from "./session";

export const SOMA_UID_COOKIE = "soma_uid";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

// Session-epoch gate, deliberately FAIL-OPEN: only a SUCCESSFUL read showing a
// mismatched epoch revokes the token. A DB hiccup must never downgrade a
// logged-in member to a fresh anonymous user (the "Run Taste Match logs me
// out" bug) — so on any error we trust the signed token, exactly as before
// the epoch existed. react cache() memoises per request, so pages that
// resolve identity several times pay for one SELECT.
const epochValid = cache(async (uid: string, epoch: number): Promise<boolean> => {
  try {
    const row = await prisma.user.findUnique({
      where: { id: uid },
      select: { sessionEpoch: true },
    });
    if (!row) return true; // unknown row → keep prior semantics, downstream handles it
    return row.sessionEpoch === epoch;
  } catch {
    return true; // fail-open by design
  }
});

// Registered-account guard for the ANONYMOUS cookie path, also memoised. The
// soma_uid cookie is an unsigned raw id — possession must stop equalling
// account access the moment the row gains credentials, otherwise anyone who
// ever learned the id (e.g. planted it pre-registration — cookie fixation)
// owns the account forever. Fail-open on DB error: worst case is the
// pre-guard behaviour.
const isRegisteredRow = cache(async (uid: string): Promise<boolean> => {
  try {
    const row = await prisma.user.findUnique({
      where: { id: uid },
      select: { passwordHash: true },
    });
    return Boolean(row?.passwordHash);
  } catch {
    return false; // fail-open by design
  }
});

// Resolves the current SOMA visitor.
//   1. A valid authenticated session cookie wins — that's a registered user.
//   2. Otherwise the anonymous cookie keeps a person's taste profile and
//      history tied to them (set lazily on first use). When a visitor later
//      registers, the account is written onto this same User row, so the
//      anonymous history carries over with no migration.
export async function getUserId(): Promise<string> {
  const store = await cookies();

  const session = store.get(SESSION_COOKIE)?.value;
  if (session) {
    const claims = verifySessionClaims(session);
    // A valid signed (HMAC) token IS the authentication — the epoch gate is
    // fail-open, so a database hiccup still never downgrades a logged-in
    // member. Only a confirmed epoch mismatch (password was reset) rejects.
    if (claims && (await epochValid(claims.uid, claims.epoch))) return claims.uid;
  }

  const existing = store.get(SOMA_UID_COOKIE)?.value;

  if (existing) {
    // An anonymous cookie may not claim a row that has registered credentials
    // — that account is reachable only through a signed session. Fall through
    // and mint a fresh anonymous identity instead (same as a new visitor).
    if (!(await isRegisteredRow(existing))) {
      await prisma.user.upsert({
        where: { id: existing },
        create: { id: existing },
        update: {},
      });
      return existing;
    }
  }

  const id = randomUUID();
  await prisma.user.create({ data: { id } });
  store.set(SOMA_UID_COOKIE, id, COOKIE_OPTIONS);
  return id;
}

// Read-only identity resolution for server COMPONENTS (pages), which may not
// set cookies. Mirrors getUserId's precedence — a valid auth session wins, then
// the anonymous cookie — but never creates a user or writes a cookie. Returns
// null when there's no identity yet (a brand-new visitor with no profile).
// Use this anywhere a page renders per-user data (e.g. catalog match scores) so
// a logged-in user is read by their account, not a stale anonymous cookie.
export async function getUserIdReadOnly(): Promise<string | null> {
  const store = await cookies();

  const session = store.get(SESSION_COOKIE)?.value;
  if (session) {
    const claims = verifySessionClaims(session);
    // Same fail-open epoch gate as getUserId — a Supabase blip never reads a
    // logged-in member as anonymous.
    if (claims && (await epochValid(claims.uid, claims.epoch))) return claims.uid;
  }

  const anon = store.get(SOMA_UID_COOKIE)?.value ?? null;
  if (anon && (await isRegisteredRow(anon))) return null;
  return anon;
}
