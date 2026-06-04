import { NextRequest, NextResponse } from "next/server";
import { parseMenuRich } from "@/lib/parse-menu";
import { asText } from "@/lib/api";

export const dynamic = "force-dynamic";

// Phase 1 of the brief: manual entry and pasted menu text. OCR / screenshot
// extraction is a Phase 2 addition that can plug into this same endpoint.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text = asText(body.text, 12_000);
  if (!text) {
    return NextResponse.json({ strains: [], items: [] });
  }
  const items = parseMenuRich(text).slice(0, 60);
  const strains = items.map((i) => i.strainName);
  return NextResponse.json({ strains, items });
}
