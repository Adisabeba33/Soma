import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  (await cookies()).set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  return NextResponse.json({ ok: true });
}
