import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SOMA_UID_COOKIE = "soma_uid";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

// Resolves the anonymous SOMA visitor. No auth in the MVP — a signed
// cookie keeps a person's taste profile and history tied to them. The
// cookie is set lazily on the first API call that needs it.
export async function getUserId(): Promise<string> {
  const store = await cookies();
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
