import { NextRequest, NextResponse } from "next/server";
import { parseMenu } from "@/lib/parse-menu";
import { asText } from "@/lib/api";

export const dynamic = "force-dynamic";

// Phase 1 of the brief: manual entry and pasted menu text. OCR / screenshot
// extraction is a Phase 2 addition that can plug into this same endpoint.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text = asText(body.text, 12_000);
  if (!text) {
    return NextResponse.json({ strains: [] });
  }
  const strains = parseMenu(text).slice(0, 60);
  return NextResponse.json({ strains });
}
