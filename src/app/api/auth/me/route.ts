import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, email: true, emailVerified: true, passwordHash: true },
  });
  return NextResponse.json({
    registered: Boolean(user?.passwordHash),
    username: user?.username ?? null,
    email: user?.email ?? null,
    emailVerified: Boolean(user?.emailVerified),
  });
}
