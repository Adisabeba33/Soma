import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { asArray, asText } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getUserId();
  const profile = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ profile });
}

async function upsertProfile(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const data = {
    favoriteStrains: asArray(body.favoriteStrains),
    dislikedStrains: asArray(body.dislikedStrains),
    likedTraits: asArray(body.likedTraits),
    dislikedTraits: asArray(body.dislikedTraits),
    preferredAromas: asArray(body.preferredAromas),
    preferredFlavors: asArray(body.preferredFlavors),
    preferredEffects: asArray(body.preferredEffects),
    texturePreferences: asArray(body.texturePreferences),
    qualityPriorities: asArray(body.qualityPriorities),
    referenceStrain: asText(body.referenceStrain, 120),
    lookingFor: asText(body.lookingFor, 20) === "new" ? "new" : "similar",
    notes: asText(body.notes, 2000),
  };

  const existing = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const profile = existing
    ? await prisma.tasteProfile.update({ where: { id: existing.id }, data })
    : await prisma.tasteProfile.create({ data: { ...data, userId } });

  return NextResponse.json({ profile });
}

export const POST = upsertProfile;
export const PUT = upsertProfile;
