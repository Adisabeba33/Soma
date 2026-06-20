import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export const SOMA_UID_COOKIE = "soma_uid";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

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
    const uid = verifySessionToken(session);
    if (uid) {
      const user = await prisma.user.findUnique({ where: { id: uid } });
      if (user) return uid;
    }
  }

  const existing = store.get(SOMA_UID_COOKIE)?.value;

  if (existing) {
    await prisma.user.upsert({
      where: { id: existing },
      create: { id: existing },
      update: {},
    });
    return existing;
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
    const uid = verifySessionToken(session);
    if (uid) {
      const user = await prisma.user.findUnique({ where: { id: uid } });
      if (user) return uid;
    }
  }

  return store.get(SOMA_UID_COOKIE)?.value ?? null;
}
