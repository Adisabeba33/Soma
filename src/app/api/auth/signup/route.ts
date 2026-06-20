import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import {
  hashPassword,
  normalizeEmail,
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/password";
import { createAuthToken, EMAIL_VERIFY_TTL_MS } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`signup:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const username = String(body.username ?? "").trim();
  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");

  const err = validateUsername(username) ?? validateEmail(email) ?? validatePassword(password);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  // The account is written onto the visitor's existing (anonymous) row so their
  // taste profile and history carry over with no migration.
  const userId = await getUserId();
  const me = await prisma.user.findUnique({ where: { id: userId } });
  if (me?.passwordHash) {
    return NextResponse.json({ error: "You already have an account. Please log in." }, { status: 400 });
  }

  const emailTaken = await prisma.user.findFirst({
    where: { email, NOT: { id: userId } },
    select: { id: true },
  });
  if (emailTaken) return NextResponse.json({ error: "That email is already registered." }, { status: 400 });

  const nameTaken = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" }, NOT: { id: userId } },
    select: { id: true },
  });
  if (nameTaken) return NextResponse.json({ error: "That username is taken." }, { status: 400 });

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { username, email, passwordHash: hashPassword(password), emailVerified: null },
    });
  } catch {
    return NextResponse.json({ error: "That email or username is already in use." }, { status: 400 });
  }

  const raw = await createAuthToken(userId, "email_verify", EMAIL_VERIFY_TTL_MS);
  await sendVerificationEmail(email, raw);

  return NextResponse.json({ ok: true, needsVerification: true });
}
