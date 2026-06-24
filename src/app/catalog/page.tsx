import { Suspense } from "react";
import Link from "next/link";
import { buildCatalog, type CatalogMatch } from "@/lib/catalog";
import { getActiveProfile } from "@/lib/active-profile";
import { getUserIdReadOnly } from "@/lib/user";
import { getFeedbackSignals } from "@/lib/api";
import { mergedMatches } from "@/lib/merge-worlds";
import { scoreStrain } from "@/lib/taste-engine";
import { STRAINS } from "@/lib/strain-data";
import type { TasteProfileInput } from "@/lib/types";
import { CatalogClient } from "./catalog-client";
import { FeedbackReset } from "@/components/feedback-reset";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Harvest — SŌMA",
  description:
    "Every strain SOMA knows about. Sensory data, aliases, archetype and nearest matches — the same source the Taste Match Engine reads.",
};

// Read-only cookie lookup. We never set the cookie here (that's only legal
// in a route handler / server action) — a first-time visitor simply has no
// profile yet, so no per-strain match is shown.
async function loadMatches(): Promise<{
  matches: Record<string, CatalogMatch>;
  hasProfile: boolean;
  mergedWorlds: string[]; // non-empty when the catalog is blending profiles
  blenderActive: boolean; // the 3-way Taste Blender is driving it
}> {
  const userId = await getUserIdReadOnly();
  if (!userId)
    return { matches: {}, hasProfile: false, mergedWorlds: [], blenderActive: false };

  // Blend mode wins: when profiles are merged (or Taste Blender is on), Harvest
  // scores every strain best-of across them instead of the single profile.
  const merged = await mergedMatches(userId);
  if (merged) {
    return {
      matches: merged.matches,
      hasProfile: true,
      mergedWorlds: merged.worlds,
      blenderActive: merged.blenderActive,
    };
  }

  const profile = await getActiveProfile(userId);
  if (!profile)
    return { matches: {}, hasProfile: false, mergedWorlds: [], blenderActive: false };

  const feedback = await getFeedbackSignals(userId);
  const matches: Record<string, CatalogMatch> = {};
  for (const strain of STRAINS) {
    const m = scoreStrain(
      strain.name,
      profile as unknown as TasteProfileInput,
      feedback,
    );
    matches[strain.name] = { score: m.matchScore, category: m.category };
  }
  return { matches, hasProfile: true, mergedWorlds: [], blenderActive: false };
}

export default async function CatalogPage() {
  const entries = buildCatalog();
  const { matches, hasProfile, mergedWorlds, blenderActive } = await loadMatches();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Harvest</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        What SŌMA knows
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        The full curated reference set the Taste Match Engine reads from.
        Every entry is hand-mapped to canonical sensory vocab — the diagram on
        each card is that strain&apos;s own sensory radar, not a photo. Use this
        view to see what we know about each strain, where data is thin, and
        which strains sit near each other in sensory space.
      </p>

      {mergedWorlds.length >= 2 && (
        <p className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-xl border border-brass/30 bg-brass/5 px-4 py-2.5 text-sm text-foreground">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brass">
            {blenderActive ? "Taste Blender" : "Merged"}
          </span>
          Matches blend{" "}
          <span className="font-medium">{mergedWorlds.join(" · ")}</span> — each
          strain takes its best world. Manage in{" "}
          <Link href="/account" className="text-accent hover:underline">
            your account
          </Link>
          .
        </p>
      )}

      <FeedbackReset />

      <Suspense fallback={null}>
        <CatalogClient
          entries={entries}
          matches={matches}
          hasProfile={hasProfile}
        />
      </Suspense>
    </div>
  );
}
