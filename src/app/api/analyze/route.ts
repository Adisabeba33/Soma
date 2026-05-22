import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { asArray, asText } from "@/lib/api";
import { analyze } from "@/lib/taste-engine";
import { enhanceWithOpenAI, isOpenAIEnabled } from "@/lib/openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));

  const strains = asArray(body.strains, 60);
  const inputType = body.inputType === "paste" ? "paste" : "manual";
  const rawInput = asText(body.rawInput, 12_000) ?? strains.join("\n");

  if (strains.length === 0) {
    return NextResponse.json(
      { error: "Add at least one strain to analyze." },
      { status: 400 },
    );
  }

  const profile = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Build your taste profile before running an analysis." },
      { status: 400 },
    );
  }

  // Deterministic engine first — it always produces the structured result.
  let result = analyze(strains, profile);
  // The optional AI layer only rewrites prose; scores stay untouched.
  if (isOpenAIEnabled()) {
    result = await enhanceWithOpenAI(result, profile);
  }

  const session = await prisma.analysisSession.create({
    data: {
      userId,
      tasteProfileId: profile.id,
      inputType,
      rawInput,
      engine: result.engine,
      recommendations: {
        create: result.recommendations.map((r) => ({
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
        })),
      },
    },
    include: { recommendations: true },
  });

  const recommendations = result.recommendations.map((r) => ({
    ...r,
    id: session.recommendations.find((d) => d.strainName === r.strainName)?.id,
  }));

  return NextResponse.json({
    session: {
      id: session.id,
      title: session.title,
      saved: session.saved,
      engine: session.engine,
      inputType: session.inputType,
      createdAt: session.createdAt,
      strainCount: session.recommendations.length,
    },
    recommendations,
    engine: result.engine,
  });
}
