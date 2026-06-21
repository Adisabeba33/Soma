import { prisma } from "./prisma";

// The single profile that drives all matching for a user: the one flagged
// isActive, falling back to the most recently updated row (covers pre-backfill
// data and any edge where nothing is active). Returns null if the user has no
// profile at all.
export async function getActiveProfile(userId: string) {
  const active = await prisma.tasteProfile.findFirst({
    where: { userId, isActive: true },
    orderBy: { updatedAt: "desc" },
  });
  if (active) return active;
  return prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}
