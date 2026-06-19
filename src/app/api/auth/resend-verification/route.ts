import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/password";
import { createAuthToken, EMAIL_VERIFY_TTL_MS } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`resend:${clientIp(req)}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(String(body.email ?? ""));

  const user = await prisma.user.findFirst({ where: { email } });
  if (user?.passwordHash && !user.emailVerified) {
    const raw = await createAuthToken(user.id, "email_verify", EMAIL_VERIFY_TTL_MS);
    await sendVerificationEmail(email, raw);
  }
  // Always ok — never reveal whether the email exists or is already verified.
  return NextResponse.json({ ok: true });
}
