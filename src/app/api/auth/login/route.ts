import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { normalizeEmail, verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");

  // Guard the credential lookup: if the database is briefly unreachable
  // (e.g. Supabase pausing), return an honest "service waking up" message
  // instead of a 500 that the client surfaces as a vague "Network error".
  let user;
  try {
    user = await prisma.user.findFirst({ where: { email } });
  } catch (err) {
    console.error("login: database unreachable", err);
    return NextResponse.json(
      { error: "SŌMA is waking up — please try again in a moment." },
      { status: 503 },
    );
  }
  const ok = user?.passwordHash ? verifyPassword(password, user.passwordHash) : false;
  // Generic message — never reveal whether the email exists.
  if (!user || !ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  if (!user.emailVerified) {
    return NextResponse.json(
      { error: "Please verify your email before signing in.", needsVerification: true },
      { status: 403 },
    );
  }

  const token = createSessionToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "Sign-in isn't configured yet (AUTH_SECRET)." }, { status: 503 });
  }
  (await cookies()).set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return NextResponse.json({ ok: true, username: user.username });
}
