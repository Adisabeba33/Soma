// "All my worlds" — one recommendation feed merged across the user's taste
// profiles. Each profile is a separate "world"; the engine runs per profile
// and we merge best-of (see lib/merge-worlds for the rules). Cards are tagged
// with the world that earned their score, so a pick from your skunk side reads
// as "via <that profile>" rather than getting buried by your other side.

import Link from "next/link";
import { ArrowLeft, Globe, Sparkles } from "lucide-react";
import { buildCatalog, curatedScore } from "@/lib/catalog";
import type { CatalogEntry } from "@/lib/catalog";
import { getUserIdReadOnly } from "@/lib/user";
import { mergeWorlds } from "@/lib/merge-worlds";
import { CatalogCollectibleCard } from "@/components/catalog-collectible-card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Worlds — SŌMA",
  description:
    "One recommendation feed merged across all your taste profiles — the best of each world, tagged by where it came from.",
};

const SHOWN = 36; // cards rendered — favourites + the strongest discoveries

export default async function WorldsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const allRounder = sort === "allrounder";

  const userId = await getUserIdReadOnly();
  const result = userId ? await mergeWorlds(userId) : null;

  const entryByName = new Map(
    buildCatalog().map((e) => [e.strain.name, e] as const),
  );

  // Gate: the feature only means something with two or more worlds to merge.
  if (!result || result.worlds.length < 2) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <BackToProfile />
        <Header worlds={result?.worlds ?? []} />
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">My Worlds</strong> blends your
            taste profiles into one feed — so a strain your gas side loves and
            one your skunk side loves can sit together at the top, each tagged
            by where it came from. You have{" "}
            {result?.worlds.length === 1 ? "only one profile" : "no profiles"} so
            far. Create a second taste profile — a different side of how you
            smoke — and this feed unlocks.
          </p>
          <Link
            href="/profile"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Build another profile
          </Link>
        </div>
      </div>
    );
  }

  const recs = allRounder
    ? [...result.recs].sort((a, b) => b.avgScore - a.avgScore)
    : result.recs;
  const shown = recs.slice(0, SHOWN);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <BackToProfile />
      <Header worlds={result.worlds} />

      {/* Sort: best-of each world (default) vs all-rounder (decent everywhere) */}
      <div className="mt-6 inline-flex overflow-hidden rounded-xl border border-border text-sm">
        <SortTab label="Best of each world" active={!allRounder} href="/worlds" />
        <SortTab
          label="All-rounder"
          active={allRounder}
          href="/worlds?sort=allrounder"
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {allRounder
          ? "Ranked by average across every world — strains that work for all your sides at once."
          : "Ranked by each strain's best world — surfaces gems one side loves even if another doesn't."}
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((rec) => {
          const entry = entryByName.get(rec.strainName) as CatalogEntry;
          const displayScore = allRounder ? rec.avgScore : rec.score;
          return (
            <CatalogCollectibleCard
              key={rec.strainName}
              entry={entry}
              match={{ score: displayScore, category: rec.category }}
              score={curatedScore(entry)}
              worldLabel={rec.universal ? "Both worlds" : `via ${rec.world}`}
            />
          );
        })}
      </ul>

      {result.vetoed.length > 0 && (
        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Hidden from every world (you marked them avoid in one profile, so
          they&apos;re vetoed across all):{" "}
          <span className="text-foreground">{result.vetoed.join(", ")}</span>.
        </p>
      )}
    </div>
  );
}

function Header({ worlds }: { worlds: string[] }) {
  return (
    <>
      <p className="mt-5 flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-brass">
        <Globe className="h-3.5 w-3.5" /> All my worlds
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        One feed, every side of you
      </h1>
      {worlds.length >= 2 && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" />
          Merging{" "}
          <span className="font-medium text-foreground">
            {worlds.join(" · ")}
          </span>
        </p>
      )}
    </>
  );
}

function SortTab({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 transition-colors",
        active
          ? "bg-accent/10 font-medium text-accent"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function BackToProfile() {
  return (
    <Link
      href="/profile"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to profile
    </Link>
  );
}
