import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/password";
import { consumeAuthToken } from "@/lib/auth-tokens";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`reset:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  const err = validatePassword(password);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  if (!token) return NextResponse.json({ error: "Missing reset token." }, { status: 400 });

  const userId = await consumeAuthToken(token, "password_reset");
  if (!userId) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }
  // Resetting via emailed link proves email ownership, so mark it verified too.
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashPassword(password), emailVerified: new Date() },
  });
  return NextResponse.json({ ok: true });
}
