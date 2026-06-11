// POST /api/profile/from-description — seed a taste profile from a free-text
// description of what the user likes. Like /from-experience, this does NOT
// persist; it returns the inferred profile so the frontend can render an
// editable preview and save via POST /api/profile.

import { NextRequest, NextResponse } from "next/server";
import { inferProfileFromDescription } from "@/lib/profile-from-description";
import type { InferredProfile } from "@/lib/profile-from-experience";

export const dynamic = "force-dynamic";

// Did the description yield any usable signal? If not, the frontend nudges
// the user to the questionnaire instead of showing an empty preview.
function hasSignal(p: InferredProfile): boolean {
  return (
    p.preferredAromas.length > 0 ||
    p.preferredFlavors.length > 0 ||
    p.preferredEffects.length > 0 ||
    p.dislikedEffects.length > 0 ||
    p.useTime !== "" ||
    p.primaryAroma !== "" ||
    p.primaryEffect !== "" ||
    p.bodyFeel !== null
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // Cap the text so a hostile/giant paste doesn't blow up the regex pass.
  const text = typeof body.text === "string" ? body.text.slice(0, 2000) : "";

  const profile = inferProfileFromDescription(text);

  return NextResponse.json({ profile, sufficient: hasSignal(profile) });
}
