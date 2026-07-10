import { NextResponse, type NextRequest } from "next/server";
import { isAllowedOrigin } from "./lib/origin-check";

// Cross-origin write protection for the API surface — see lib/origin-check.ts
// for the rules. Scoped to /api/* so pages, assets and prefetches never pass
// through this code.
export function middleware(req: NextRequest) {
  const allowed = isAllowedOrigin({
    method: req.method,
    origin: req.headers.get("origin"),
    requestHost: req.headers.get("host"),
    publicAppUrl: process.env.NEXT_PUBLIC_APP_URL,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Cross-origin request rejected." },
      { status: 403 },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
