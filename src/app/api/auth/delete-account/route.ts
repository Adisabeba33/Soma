import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getUserId, SOMA_UID_COOKIE } from "@/lib/user";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

export const dynamic = "force-dynamic";

// Permanently delete the current user and everything tied to them. Every
// related model (taste profiles, sessions, recommendations, feedback, tokens…)
// is onDelete: Cascade, so one delete removes the lot. Then both identity
// cookies are cleared so the next visit starts as a fresh anonymous visitor.
export async function POST() {
  const userId = await getUserId();
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    // Already gone (double-submit / race) — clearing cookies below is enough.
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  store.set(SOMA_UID_COOKIE, "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
