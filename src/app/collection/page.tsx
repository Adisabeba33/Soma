// Your Collection — the personal "shelf".
//
// Phase 1 of the collection feature: a visual gallery of every strain the
// user has given a verdict to (loved / good / neutral / avoid). It reads the
// SAME StrainFeedback rows that drive scoring — a card is *earned* by leaving
// an honest verdict, never bought or faked. The shelf is private (scoped to
// this user's id), so there is nothing to game: it is a taste diary, not a
// public score.
//
// Presentation only — management (removing a verdict) still lives on
// /profile/feedback, which this page links to. Wishlist ("want to try") is a
// separate Phase 2 layer and deliberately absent here.

import Link from "next/link";
import { ArrowLeft, Bookmark, Heart, Meh, Smile, ThumbsDown } from "lucide-react";
import { buildCatalog, curatedScore, strainSlug } from "@/lib/catalog";
import type { CatalogEntry, CatalogMatch } from "@/lib/catalog";
import { getUserIdReadOnly } from "@/lib/user";
import { getActiveProfile } from "@/lib/active-profile";
import { getFeedbackSignals } from "@/lib/api";
import { scoreStrain } from "@/lib/taste-engine";
import { prisma } from "@/lib/prisma";
import { CatalogCollectibleCard } from "@/components/catalog-collectible-card";
import { cn } from "@/lib/utils";
import type { TasteProfileInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Collection — SŌMA",
  description:
    "Your personal shelf — every strain you've tried, framed by your own verdict. Earned by honest feedback, private to you.",
};

type Verdict = "loved" | "good" | "neutral" | "avoid";

type Row = { strainName: string; verdict: Verdict; updatedAt: Date };

// Display order (most positive first) + per-verdict shelf framing. The frame
// is what makes the shelf read as a trophy case rather than a search result:
// loved cards glow, avoid cards dim, the middle stays neutral.
const GROUPS: Array<{
  value: Verdict;
  label: string;
  Icon: typeof Heart;
  tone: string;
  blurb: string;
  frame: string;
}> = [
  {
    value: "loved",
    label: "Loved",
    Icon: Heart,
    tone: "text-accent",
    blurb: "Your strongest yes. The heart of the shelf.",
    frame: "rounded-2xl ring-2 ring-accent/50 shadow-lg shadow-accent/10",
  },
  {
    value: "good",
    label: "Good",
    Icon: Smile,
    tone: "text-accent/80",
    blurb: "A softer yes — you'd reach for it again.",
    frame: "rounded-2xl ring-1 ring-accent/20",
  },
  {
    value: "neutral",
    label: "Neutral",
    Icon: Meh,
    tone: "text-muted-foreground",
    blurb: "Tried it, no strong feeling. Kept for the record.",
    frame: "",
  },
  {
    value: "avoid",
    label: "Avoid",
    Icon: ThumbsDown,
    tone: "text-[#a23b2c]",
    blurb: "A no — part of your honest record all the same.",
    frame: "opacity-60 saturate-[0.65]",
  },
];

const VALID = new Set<Verdict>(["loved", "good", "neutral", "avoid"]);

// Wishlist cards read as "ghosts": present but faded, since they haven't been
// tried yet. They brighten on hover so they still feel reachable.
const GHOST_FRAME = "rounded-2xl opacity-70 transition-opacity hover:opacity-100";

async function load(): Promise<{
  rows: Row[];
  wishlist: string[];
  entryByName: Map<string, CatalogEntry>;
  matchByName: Record<string, CatalogMatch>;
  hasProfile: boolean;
}> {
  const entries = buildCatalog();
  const entryByName = new Map(entries.map((e) => [e.strain.name, e] as const));

  const userId = await getUserIdReadOnly();
  if (!userId) {
    return { rows: [], wishlist: [], entryByName, matchByName: {}, hasProfile: false };
  }

  // Graceful degrade if the StrainFeedback table hasn't been provisioned yet
  // (a deploy that ran `next build` without `prisma db push`) — an empty
  // shelf beats a 500.
  const raw = await prisma.strainFeedback
    .findMany({
      where: { userId },
      select: { strainName: true, verdict: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => [] as Array<{ strainName: string; verdict: string; updatedAt: Date }>);

  const rows: Row[] = raw
    .filter((r): r is Row => VALID.has(r.verdict as Verdict))
    .map((r) => ({ ...r, verdict: r.verdict as Verdict }));

  // The "want to try" layer — kept in its own table, never scored. Disjoint
  // from rows by construction (a verdict graduates a strain off the wishlist).
  const wishRaw = await prisma.wishlist
    .findMany({
      where: { userId },
      select: { strainName: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => [] as Array<{ strainName: string }>);
  const wishlist = wishRaw.map((w) => w.strainName);

  // Personal match % on each card when a profile exists — computed only for
  // the collected strains (cheap), so the shelf shows *your* score, not the
  // curated index. Falls back to the curated score otherwise.
  const profile = await getActiveProfile(userId);
  const matchByName: Record<string, CatalogMatch> = {};
  if (profile) {
    const feedback = await getFeedbackSignals(userId);
    for (const row of rows) {
      if (!entryByName.has(row.strainName)) continue;
      const m = scoreStrain(
        row.strainName,
        profile as unknown as TasteProfileInput,
        feedback,
      );
      matchByName[row.strainName] = { score: m.matchScore, category: m.category };
    }
  }

  return { rows, wishlist, entryByName, matchByName, hasProfile: Boolean(profile) };
}

export default async function CollectionPage() {
  const { rows, wishlist, entryByName, matchByName } = await load();
  const total = rows.length;
  const wishCount = wishlist.length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <p className="mt-5 text-xs uppercase tracking-[0.24em] text-brass">
        Your shelf
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        Your collection
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Every strain you&apos;ve tried and rated, framed by your own verdict —
        earned by honest feedback, not bought. It&apos;s private to you, so
        there&apos;s nothing to prove and no one to impress: a taste diary you
        build one verdict at a time. Tap a card to revisit the strain, or{" "}
        <Link href="/profile/feedback" className="text-accent hover:underline">
          manage your verdicts
        </Link>
        .
      </p>

      {total === 0 && wishCount === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Your shelf is empty. Rate a strain anywhere — the catalog, Compare,
            or Taste Match — and it lands here. Tap{" "}
            <span className="whitespace-nowrap font-medium text-foreground">
              Want to try
            </span>{" "}
            on any strain to start a wishlist.
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Browse the catalog
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {total > 0 &&
            GROUPS.map((g) => {
              const items = rows.filter((r) => r.verdict === g.value);
              if (items.length === 0) return null;
              return (
                <section key={g.value}>
                  <div className="flex items-baseline gap-2">
                    <g.Icon className={cn("h-4 w-4", g.tone)} aria-hidden />
                    <h2 className={cn("font-display text-xl font-semibold", g.tone)}>
                      {g.label}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {g.blurb}
                  </p>
                  <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((row) => {
                      const entry = entryByName.get(row.strainName);
                      if (!entry) {
                        return (
                          <UncataloguedCard
                            key={row.strainName}
                            name={row.strainName}
                            frame={g.frame}
                          />
                        );
                      }
                      return (
                        <CatalogCollectibleCard
                          key={row.strainName}
                          entry={entry}
                          match={matchByName[row.strainName]}
                          score={curatedScore(entry)}
                          className={g.frame}
                        />
                      );
                    })}
                  </ul>
                </section>
              );
            })}

          {/* Wishlist — "want to try". A separate layer: not yet tried, never
              scored. Ghost cards keep it visibly distinct from the shelf. */}
          {wishCount > 0 && (
            <section>
              <div className="flex items-baseline gap-2">
                <Bookmark className="h-4 w-4 text-brass" aria-hidden />
                <h2 className="font-display text-xl font-semibold text-brass">
                  Wishlist
                </h2>
                <span className="text-sm text-muted-foreground">{wishCount}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Strains you want to try. Rate one and it graduates onto the shelf
                above. Doesn&apos;t touch your recommendations.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                {wishlist.map((name) => {
                  const entry = entryByName.get(name);
                  if (!entry) {
                    return (
                      <UncataloguedCard
                        key={name}
                        name={name}
                        frame={GHOST_FRAME}
                      />
                    );
                  }
                  return (
                    <CatalogCollectibleCard
                      key={name}
                      entry={entry}
                      score={curatedScore(entry)}
                      className={GHOST_FRAME}
                      wishlist
                      wishlistSource="collection"
                    />
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// A verdict can land on a strain that isn't in the curated catalog (e.g. a
// menu name the engine had to infer). Rather than drop it from the shelf, show
// a minimal poster so the record stays complete.
function UncataloguedCard({ name, frame }: { name: string; frame: string }) {
  return (
    <li className={cn("relative", frame)}>
      <Link
        href={`/catalog?q=${encodeURIComponent(name)}`}
        className="group flex aspect-[3/4] h-full flex-col justify-end overflow-hidden rounded-2xl border border-border bg-muted/40 p-5 transition-colors hover:border-accent/40"
      >
        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
          {name}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Not in catalog
        </p>
      </Link>
    </li>
  );
}
