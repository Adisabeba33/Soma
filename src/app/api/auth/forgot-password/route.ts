import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/password";
import { createAuthToken, PASSWORD_RESET_TTL_MS } from "@/lib/auth-tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`forgot:${clientIp(req)}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(String(body.email ?? ""));

  const user = await prisma.user.findFirst({ where: { email } });
  if (user?.passwordHash) {
    const raw = await createAuthToken(user.id, "password_reset", PASSWORD_RESET_TTL_MS);
    await sendPasswordResetEmail(email, raw);
  }
  // Always ok — never reveal whether the email is registered.
  return NextResponse.json({ ok: true });
}
