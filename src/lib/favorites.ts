// Union of every profile's favourite strains for a user — canonicalised and
// de-duped. Favourites are the user's declared anchors: they live on the
// Collection shelf and are deliberately kept OUT of the discovery feeds (the
// match-sorted catalog, the dashboard carousel), so recommendations stay about
// what's NEW, not what the user already chose.

import { prisma } from "./prisma";
import { findStrain } from "./strain-data";

export async function getFavoriteStrainNames(userId: string): Promise<string[]> {
  const rows = await prisma.tasteProfile
    .findMany({ where: { userId }, select: { favoriteStrains: true } })
    .catch(() => [] as Array<{ favoriteStrains: string[] }>);
  const set = new Set<string>();
  for (const r of rows) {
    for (const f of r.favoriteStrains ?? []) set.add(findStrain(f)?.name ?? f);
  }
  return [...set];
}
