import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { assertReadableUrl, UnsafeUrlError } from "@/lib/menu/url-guard";
import { getMenuRenderer, MenuReadError } from "@/lib/menu/render";
import { parseMenuLines } from "@/lib/menu/menuText";
import { CANONICAL_WEIGHTS, WEIGHT_PRESENTATION } from "@/lib/menu/types";
import type { ParsedMenuItem } from "@/lib/parse-menu";

export const dynamic = "force-dynamic";

// Reading a menu link.
//
// The link is opened by a browser the reader service owns, not by this process
// and not by the visitor's phone. Nothing about the page is stored: the lines
// are parsed in memory and only the strain names travel on, into this visitor's
// own session. There is no column here for a price, a photograph or a potency
// figure, and none is wanted.
//
// Reading can fail, and the answer to that is never an empty list presented as
// a result. Every failure returns a reason the caller can put in front of a
// person, next to the paste box that always works.

const MAX_LINES = 4000;

/** Copy of the reasons that mean "this is a product, and not flower". */
function isRefusedProduct(reason: string): boolean {
  return reason.startsWith("excluded category:");
}

export async function POST(req: NextRequest) {
  if (!rateLimit(`menu-url:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "RATE_LIMITED", message: "Give it a minute before reading another menu." },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { url?: unknown };
  let url: URL;
  try {
    url = assertReadableUrl(typeof body.url === "string" ? body.url : "");
  } catch (error) {
    if (error instanceof UnsafeUrlError) {
      return NextResponse.json({ error: error.rejection, message: error.message }, { status: 400 });
    }
    throw error;
  }

  const renderer = getMenuRenderer();
  if (!renderer) {
    return NextResponse.json(
      {
        error: "NOT_CONFIGURED",
        message: "Reading links is not switched on here yet — paste the menu text instead.",
      },
      { status: 503 },
    );
  }

  let rendered;
  try {
    rendered = await renderer.read(url, req.signal);
  } catch (error) {
    if (error instanceof MenuReadError) {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 502 });
    }
    throw error;
  }

  const parsed = parseMenuLines(rendered.lines.slice(0, MAX_LINES));

  // The same shapes the paste box already produces, so everything downstream —
  // the preview, the run, the audit — stays as it is. Grower, potency and price
  // are null because this parser does not read them: it reads what is listed
  // and in what size, and says so rather than guessing the rest.
  const items: ParsedMenuItem[] = parsed.entries.map((entry) => ({
    strainName: entry.canonicalName,
    grower: null,
    thcPercent: null,
    price: null,
    weight: WEIGHT_PRESENTATION[entry.packageWeight].ounceLabel,
    rawLine: entry.canonicalName,
    confidence: "high",
    warnings: [],
  }));

  const byWeight = CANONICAL_WEIGHTS.map((weight) => ({
    label: WEIGHT_PRESENTATION[weight].ounceLabel,
    strains: parsed.entries
      .filter((entry) => entry.packageWeight === weight)
      .map((entry) => entry.canonicalName)
      .sort((left, right) => left.localeCompare(right)),
  })).filter((group) => group.strains.length > 0);

  // Two different things end up set aside, and conflating them hides real
  // losses. A line refused as another product class had a name and a shape;
  // page furniture did not.
  const refused = parsed.skipped
    .filter((line) => isRefusedProduct(line.reason))
    .map((line) => ({ line: line.line, reason: line.reason }));
  const unreadCount = parsed.skipped.length - refused.length;

  return NextResponse.json({
    strains: items.map((item) => item.strainName),
    items,
    byWeight,
    refused,
    stats: {
      finalUrl: rendered.finalUrl,
      linesRead: rendered.lines.length,
      strainCount: parsed.entries.length,
      listingCount: parsed.itemCount,
      refusedCount: refused.length,
      unreadCount,
      ambiguousBlocks: parsed.ambiguousBlocks,
      bytes: rendered.bytes,
      durationMs: rendered.durationMs,
    },
  });
}
