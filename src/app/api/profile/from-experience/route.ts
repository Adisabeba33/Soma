// POST /api/profile/from-experience — reverse-derive a taste profile
// from 2-7 strains the user has actually tried. This endpoint does NOT
// persist; it returns the inferred profile so the frontend can render a
// preview and let the user edit before saving via POST /api/profile.

import { NextRequest, NextResponse } from "next/server";
import { inferProfileFromExperience } from "@/lib/profile-from-experience";
import { asArray } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // Caps at 10 per axis so a hostile/typo'd input doesn't blow up the
  // inference loop. asArray already trims, dedupes, length-clamps.
  const loved = asArray(body.loved, 10);
  const liked = asArray(body.liked, 10);
  const disliked = asArray(body.disliked, 10);

  const result = inferProfileFromExperience({ loved, liked, disliked });

  return NextResponse.json(result);
}
