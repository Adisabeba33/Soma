import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

export const dynamic = "force-dynamic";

// One-click debug dump for a single analysis session. Returns the raw input,
// parsed items, parser warnings, computed menu quality, every recommendation
// with its current feedback, and any unknown strains logged against the
// session. Owner-only.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  const { id } = await params;

  const session = await prisma.analysisSession.findUnique({
    where: { id },
    include: {
      recommendations: {
        orderBy: { matchScore: "desc" },
        include: { feedback: { where: { userId } } },
      },
      unknownStrains: { orderBy: { createdAt: "asc" } },
      tasteProfile: true,
    },
  });

  if (!session || session.userId !== userId) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    session: {
      id: session.id,
      title: session.title,
      saved: session.saved,
      engine: session.engine,
      inputType: session.inputType,
      createdAt: session.createdAt,
      rawInput: session.rawInput,
      parsedItems: session.parsedItems,
      parserWarnings: session.parserWarnings,
      menuQuality: session.menuQuality,
    },
    tasteProfile: session.tasteProfile
      ? {
          id: session.tasteProfile.id,
          favoriteStrains: session.tasteProfile.favoriteStrains,
          dislikedStrains: session.tasteProfile.dislikedStrains,
          likedTraits: session.tasteProfile.likedTraits,
          dislikedTraits: session.tasteProfile.dislikedTraits,
          preferredAromas: session.tasteProfile.preferredAromas,
          preferredFlavors: session.tasteProfile.preferredFlavors,
          preferredEffects: session.tasteProfile.preferredEffects,
          texturePreferences: session.tasteProfile.texturePreferences,
          qualityPriorities: session.tasteProfile.qualityPriorities,
          referenceStrain: session.tasteProfile.referenceStrain,
          lookingFor: session.tasteProfile.lookingFor,
          updatedAt: session.tasteProfile.updatedAt,
        }
      : null,
    recommendations: session.recommendations.map((r) => ({
      id: r.id,
      strainName: r.strainName,
      resolvedName: r.resolvedName,
      knownStrain: r.knownStrain,
      category: r.category,
      matchScore: r.matchScore,
      confidence: r.confidence,
      aromaMatch: r.aromaMatch,
      flavorMatch: r.flavorMatch,
      effectMatch: r.effectMatch,
      whyItFits: r.whyItFits,
      riskNotes: r.riskNotes,
      explanation: r.explanation,
      feedbackNote: r.feedbackNote,
      purchaseConfidence: r.purchaseConfidence,
      feedback: r.feedback[0]
        ? {
            purchased: r.feedback[0].purchased,
            liked: r.feedback[0].liked,
            rating: r.feedback[0].rating,
            notes: r.feedback[0].notes,
            createdAt: r.feedback[0].createdAt,
          }
        : null,
    })),
    unknownStrains: session.unknownStrains.map((u) => ({
      rawName: u.rawName,
      grower: u.grower,
      rawLine: u.rawLine,
      createdAt: u.createdAt,
    })),
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="soma-session-${session.id}.json"`,
    },
  });
}
