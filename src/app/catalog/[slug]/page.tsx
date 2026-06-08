import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  curatedScore,
  getCatalogEntryBySlug,
  similarWithProfiles,
  strainSlug,
  type CatalogMatch,
} from "@/lib/catalog";
import { STRAINS } from "@/lib/strain-data";
import { getIdentity } from "@/lib/strain-identity";
import { prisma } from "@/lib/prisma";
import { SOMA_UID_COOKIE } from "@/lib/user";
import { getFeedbackSignals } from "@/lib/api";
import { scoreStrain } from "@/lib/taste-engine";
import type { StrainType, TasteProfileInput } from "@/lib/types";
import { StrainDetail, type LineageParent } from "./strain-detail";

export const dynamic = "force-dynamic";

const STRAIN_NAMES = new Set(STRAINS.map((s) => s.name));
const STRAIN_TYPE_BY_NAME = new Map<string, StrainType>(
  STRAINS.map((s) => [s.name, s.type]),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCatalogEntryBySlug(slug);
  if (!entry) return { title: "Strain — SŌMA" };
  return {
    title: `${entry.strain.name} — SŌMA`,
    description:
      entry.identity?.curatorNote ??
      `${entry.strain.name}: sensory profile, genetics and nearest matches in the SŌMA catalog.`,
  };
}

async function loadMatch(strainName: string): Promise<CatalogMatch | undefined> {
  const store = await cookies();
  const userId = store.get(SOMA_UID_COOKIE)?.value;
  if (!userId) return undefined;

  const profile = await prisma.tasteProfile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  if (!profile) return undefined;

  const feedback = await getFeedbackSignals(userId);
  const m = scoreStrain(
    strainName,
    profile as unknown as TasteProfileInput,
    feedback,
  );
  return { score: m.matchScore, category: m.category };
}

export default async function StrainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCatalogEntryBySlug(slug);
  if (!entry) notFound();

  const match = await loadMatch(entry.strain.name);
  const similar = similarWithProfiles(entry.similar);

  // Enrich each parent with what we already know about it. Lookup
  // priority: our own catalog → identity.lineage.parentDetails fallback
  // → just the name. That way you only have to paint in details for
  // historical / non-catalog parents — anything in the catalog comes
  // through automatically as the catalog grows.
  const parentDetails = entry.identity?.lineage?.parentDetails ?? {};
  const lineageParents: LineageParent[] = (
    entry.identity?.lineage?.parents ?? []
  ).map((name) => {
    const known = STRAIN_NAMES.has(name);
    const parentIdentity = known ? getIdentity(name) : null;
    const fallback = parentDetails[name];
    return {
      name,
      slug: known ? strainSlug(name) : null,
      lineageBrief:
        parentIdentity?.lineage?.cross ?? fallback?.lineageBrief ?? null,
      type: known
        ? STRAIN_TYPE_BY_NAME.get(name) ?? null
        : fallback?.type ?? null,
    };
  });

  return (
    <StrainDetail
      entry={entry}
      match={match}
      curatedScore={curatedScore(entry)}
      similar={similar}
      lineageParents={lineageParents}
    />
  );
}
