import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { profileCompleteness } from "@/lib/profile-completeness";
import type { TasteProfileInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// Up to three named profiles per account.
const MAX_PROFILES = 3;

const cleanName = (v: unknown, fallback: string): string =>
  (typeof v === "string" ? v : "").trim().slice(0, 40) || fallback;

// List every profile with its name, active flag and completeness %.
export async function GET() {
  const userId = await getUserId();
  const profiles = await prisma.tasteProfile.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({
    limit: MAX_PROFILES,
    profiles: profiles.map((p) => ({
      id: p.id,
      name: p.name ?? "Main",
      isActive: p.isActive,
      percent: profileCompleteness(p as unknown as TasteProfileInput).percent,
    })),
  });
}

// Create a new (empty, inactive) profile. Enforces the 3-profile cap.
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));
  const name = cleanName(body.name, "New profile");

  const count = await prisma.tasteProfile.count({ where: { userId } });
  if (count >= MAX_PROFILES) {
    return NextResponse.json(
      { error: `You can have up to ${MAX_PROFILES} profiles.` },
      { status: 400 },
    );
  }

  const profile = await prisma.tasteProfile.create({
    data: {
      userId,
      name,
      isActive: false,
      favoriteStrains: [],
      dislikedStrains: [],
      likedTraits: [],
      dislikedTraits: [],
      preferredAromas: [],
      preferredFlavors: [],
      preferredEffects: [],
      texturePreferences: [],
      qualityPriorities: [],
    },
  });
  return NextResponse.json({
    id: profile.id,
    name: profile.name,
    isActive: false,
    percent: 0,
  });
}
