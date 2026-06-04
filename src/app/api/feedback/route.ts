import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { asText, toFeedbackData } from "@/lib/api";

export const dynamic = "force-dynamic";

function asBool(value: unknown): boolean | null {
  if (value === true || value === false) return value;
  return null;
}

function asRating(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(5, Math.round(n)));
}

// The feedback loop: once a person has actually bought and tried a pick,
// their verdict is stored so future matching can lean on real outcomes.
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));
  const recommendationId = asText(body.recommendationId, 80);

  if (!recommendationId) {
    return NextResponse.json(
      { error: "Missing recommendation reference." },
      { status: 400 },
    );
  }

  const recommendation = await prisma.recommendation.findUnique({
    where: { id: recommendationId },
    include: { session: true },
  });

  if (!recommendation || recommendation.session.userId !== userId) {
    return NextResponse.json(
      { error: "Recommendation not found." },
      { status: 404 },
    );
  }

  const data = {
    purchased: asBool(body.purchased),
    liked: asBool(body.liked),
    rating: asRating(body.rating),
    notes: asText(body.notes, 1000),
  };

  const existing = await prisma.feedback.findFirst({
    where: { userId, recommendationId },
  });

  const feedback = existing
    ? await prisma.feedback.update({ where: { id: existing.id }, data })
    : await prisma.feedback.create({
        data: { ...data, userId, recommendationId },
      });

  return NextResponse.json({ feedback: toFeedbackData(feedback) });
}
