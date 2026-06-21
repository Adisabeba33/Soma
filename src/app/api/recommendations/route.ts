import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { asText, dbRecToView } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getUserId();
  const sessions = await prisma.analysisSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      // The profile this run was scored against, so History can show which
      // sensory profile each recommendation belongs to. Nullable: older runs
      // (or ones whose profile was later deleted) carry no link.
      tasteProfile: { select: { name: true } },
      recommendations: {
        orderBy: { matchScore: "desc" },
        include: { feedback: { where: { userId } } },
      },
    },
  });

  const serialized = sessions.map((session) => ({
    id: session.id,
    title: session.title,
    saved: session.saved,
    engine: session.engine,
    inputType: session.inputType,
    createdAt: session.createdAt,
    profileName: session.tasteProfile?.name ?? null,
    strainCount: session.recommendations.length,
    recommendations: session.recommendations.map((r) =>
      dbRecToView(r, r.feedback[0] ?? null),
    ),
  }));

  return NextResponse.json({ sessions: serialized });
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserId();
  const body = await req.json().catch(() => ({}));
  const sessionId = asText(body.sessionId, 80);

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id." }, { status: 400 });
  }

  const session = await prisma.analysisSession.findUnique({
    where: { id: sessionId },
  });
  if (!session || session.userId !== userId) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const data: { saved?: boolean; title?: string | null } = {};
  if (typeof body.saved === "boolean") data.saved = body.saved;
  if ("title" in body) data.title = asText(body.title, 120);

  const updated = await prisma.analysisSession.update({
    where: { id: sessionId },
    data,
  });

  return NextResponse.json({
    session: { id: updated.id, title: updated.title, saved: updated.saved },
  });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing session id." }, { status: 400 });
  }

  const session = await prisma.analysisSession.findUnique({ where: { id } });
  if (!session || session.userId !== userId) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  await prisma.analysisSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
