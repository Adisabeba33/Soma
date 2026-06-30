"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  GitCompareArrows,
  LayoutGrid,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CatalogCollectibleCard } from "@/components/catalog-collectible-card";
import { CompareBasketTray } from "@/components/compare-basket-tray";
import { WishlistButton } from "@/components/wishlist-button";
import { FitText } from "@/components/fit-text";
import { effectIconFor } from "@/components/effect-icon";
import { paletteForTime } from "@/lib/sensory-family-palette";
import { timeProfileOf, artImageSrc, artFocusOf } from "@/lib/strain-art";
import { tierOf } from "@/lib/collection-tier";
import {
  BASKET_EVENT,
  addToBasket,
  getBasket,
  removeFromBasket,
} from "@/lib/compare-basket";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { AROMAS, EFFECTS, FLAVORS } from "@/lib/vocab";
import { curatedScore, strainSlug } from "@/lib/catalog";
import type { CatalogEntry, CatalogMatch } from "@/lib/catalog";

// ── Filter vocab (drawn from the canonical sensory vocab so the catalog and
//    the questionnaire/engine always line up) ──────────────────────────────
const TYPE_OPTIONS = ["all", "indica", "sativa", "hybrid"] as const;
type TypeFilter = (typeof TYPE_OPTIONS)[number];

// Potency, weakest → strongest. The Strength slider sets a *minimum* level:
// index 0 = Any, 1..4 = that potency and above.
const POTENCY_ORDER = ["mild", "moderate", "strong", "very-strong"] as const;
const STRENGTH_LABELS = [
  "Any",
  "Mild +",
  "Moderate +",
  "Strong +",
  "Very strong",
] as const;

const AROMA_FILTERS = AROMAS;
const FLAVOR_FILTERS = FLAVORS;
const EFFECT_FILTERS = EFFECTS;

type ViewMode = "list" | "grid";
type SortMode = "curated" | "match" | "name";

export function CatalogClient({
  entries,
  matches = {},
  hasProfile = false,
  favorites = [],
}: {
  entries: CatalogEntry[];
  matches?: Record<string, CatalogMatch>;
  hasProfile?: boolean;
  // The user's favourites across all profiles — hidden from the "Your match"
  // ranking (they live on the Collection shelf), but still findable via search.
  favorites?: string[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [strengthMin, setStrengthMin] = useState(0);
  const [aromaFilters, setAromaFilters] = useState<Set<string>>(new Set());
  const [flavorFilters, setFlavorFilters] = useState<Set<string>>(new Set());
  const [effectFilters, setEffectFilters] = useState<Set<string>>(new Set());
  const [view, setView] = useState<ViewMode>("list");
  // Filters collapsed by default. Most visits don't need them — search +
  // sort handle the common cases. The toggle below the search opens them
  // when actually needed.
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Default to ranking by the user's match when we have a profile, else the
  // curated index.
  const [sortBy, setSortBy] = useState<SortMode>(
    hasProfile ? "match" : "curated",
  );

  // How many filtered cards we render in the DOM. The list paginates client-
  // side: filters still apply across the full 888 entries (so a hit on row
  // 700 still surfaces), but only the first N are mounted at any time. A
  // "Load more" button extends the window by PAGE_SIZE. Without this the
  // page mounted ~888 React subtrees + fired ~888 lazy <img> requests on
  // first paint, which dominated the perceived load time.
  const PAGE_SIZE = 40;
  const [pageCount, setPageCount] = useState(1);
  const visibleCount = pageCount * PAGE_SIZE;

  // Deep-link seed (e.g. from a "Nearby in sensory space" link).
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const scored = useMemo(
    () =>
      new Map(entries.map((e) => [e.strain.name, curatedScore(e)] as const)),
    [entries],
  );

  const favSet = useMemo(
    () => new Set(favorites.map((f) => f.toLowerCase())),
    [favorites],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = entries.filter((e) => {
      if (q) {
        const haystack = [
          e.strain.name.toLowerCase(),
          ...(e.strain.aliases ?? []).map((a) => a.toLowerCase()),
          ...(e.identity?.marketNames ?? []).map((m) => m.toLowerCase()),
        ];
        if (!haystack.some((h) => h.includes(q))) return false;
      }
      if (typeFilter !== "all" && e.strain.type !== typeFilter) return false;
      if (strengthMin > 0) {
        const lvl = POTENCY_ORDER.indexOf(
          e.strain.potency as (typeof POTENCY_ORDER)[number],
        );
        if (lvl < strengthMin - 1) return false;
      }
      if (aromaFilters.size > 0) {
        if (!e.strain.aromas.some((a) => aromaFilters.has(a))) return false;
      }
      if (flavorFilters.size > 0) {
        if (!e.strain.flavors.some((f) => flavorFilters.has(f))) return false;
      }
      if (effectFilters.size > 0) {
        if (!e.strain.effects.some((eff) => effectFilters.has(eff)))
          return false;
      }
      return true;
    });

    // In the "Your match" ranking, hide the user's favourites — they're known
    // anchors that otherwise pad the top, and they live on the Collection shelf.
    // Kept when searching (q present), so a favourite is still findable by name.
    const discoverable =
      hasProfile && sortBy === "match" && q === "" && favSet.size > 0
        ? list.filter((e) => !favSet.has(e.strain.name.toLowerCase()))
        : list;

    const sorted = [...discoverable];
    if (hasProfile && sortBy === "match") {
      // Prefer the optional `sort` key (merged profiles set it to break
      // visible-score ties on the engine's raw); fall back to the score.
      const key = (name: string) =>
        matches[name]?.sort ?? matches[name]?.score ?? -1;
      sorted.sort((a, b) => key(b.strain.name) - key(a.strain.name));
    } else if (sortBy === "curated") {
      sorted.sort(
        (a, b) =>
          (scored.get(b.strain.name) ?? 0) - (scored.get(a.strain.name) ?? 0),
      );
    }
    // "name" keeps the source order, which buildCatalog already sorts A→Z.
    return sorted;
  }, [
    entries,
    query,
    typeFilter,
    strengthMin,
    aromaFilters,
    flavorFilters,
    effectFilters,
    hasProfile,
    sortBy,
    matches,
    scored,
    favSet,
  ]);

  // Any filter / sort / search change resets the visible window to page 1, so
  // the user sees results from the top instead of staring at empty space
  // because their previous window was past the new filtered length.
  useEffect(() => {
    setPageCount(1);
  }, [
    query,
    typeFilter,
    strengthMin,
    aromaFilters,
    flavorFilters,
    effectFilters,
    sortBy,
  ]);

  const visibleEntries = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll — when the sentinel div near the bottom of the list
  // crosses into the viewport, bump pageCount to reveal another PAGE_SIZE
  // cards. rootMargin keeps the trigger ahead of the actual bottom so the
  // next page is already mounting by the time the user reaches it.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPageCount((n) => n + 1);
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visibleCount]);

  function makeToggle(setter: typeof setAromaFilters) {
    return (value: string) =>
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
  }
  const toggleAroma = makeToggle(setAromaFilters);
  const toggleFlavor = makeToggle(setFlavorFilters);
  const toggleEffect = makeToggle(setEffectFilters);

  function clearAll() {
    setQuery("");
    setTypeFilter("all");
    setStrengthMin(0);
    setAromaFilters(new Set());
    setFlavorFilters(new Set());
    setEffectFilters(new Set());
  }

  const anyFilter =
    query !== "" ||
    typeFilter !== "all" ||
    strengthMin > 0 ||
    aromaFilters.size > 0 ||
    flavorFilters.size > 0 ||
    effectFilters.size > 0;

  // Count of active *non-query* filters — drives the badge on the
  // "Filters" toggle so the user can see at a glance what's narrowing
  // the results even when the rail is collapsed.
  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (strengthMin > 0 ? 1 : 0) +
    aromaFilters.size +
    flavorFilters.size +
    effectFilters.size;

  return (
    <div className="mt-8 space-y-4">
      {/* ── Top bar: search + filters toggle + sort + view ─────── */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search strains…"
              className="h-10 pl-9 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors",
              filtersOpen
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-foreground hover:bg-muted",
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                filtersOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          {anyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Filter panel (collapsed by default) ─────────────────── */}
      {filtersOpen && (
        <div className="rounded-2xl border border-border bg-card p-4">
          {/* Type */}
          <FilterSection label="Type">
            <div className="grid grid-cols-2 gap-1.5">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-xs capitalize transition-colors",
                    typeFilter === t
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Strength */}
          <FilterSection label="Strength">
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={strengthMin}
              onChange={(e) => setStrengthMin(Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent))]"
              aria-label="Minimum strength"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Any</span>
              <span className="font-medium text-foreground">
                {STRENGTH_LABELS[strengthMin]}
              </span>
              <span>Very</span>
            </div>
          </FilterSection>

          {/* Effect */}
          <FilterSection label="Effect">
            <ul className="space-y-1.5">
              {EFFECT_FILTERS.map((opt) => {
                const active = effectFilters.has(opt.value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => toggleEffect(opt.value)}
                      className="flex w-full items-center gap-2 text-left text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span
                        className={cn(
                          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                          active
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border",
                        )}
                      >
                        {active && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span className={cn(active && "text-foreground")}>
                        {opt.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FilterSection>

          {/* Aroma */}
          <FilterSection label="Aroma">
            <ChipGrid
              options={AROMA_FILTERS}
              selected={aromaFilters}
              onToggle={toggleAroma}
            />
          </FilterSection>

          {/* Flavor */}
          <FilterSection label="Flavor">
            <ChipGrid
              options={FLAVOR_FILTERS}
              selected={flavorFilters}
              onToggle={toggleFlavor}
            />
          </FilterSection>

        </div>
      )}

      {/* ── Results header: count + sort + view toggle ───────────── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "strain" : "strains"} found
          </p>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              Sort by
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="curated">Curated</option>
                {hasProfile && <option value="match">Your match</option>}
                <option value="name">Name (A–Z)</option>
              </select>
            </label>

            {/* View toggle */}
            <div className="inline-flex overflow-hidden rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                title="List view"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors",
                  view === "list"
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Rows3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                title="Grid view"
                className={cn(
                  "flex items-center gap-1.5 border-l border-border px-2.5 py-1.5 text-xs transition-colors",
                  view === "grid"
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {!hasProfile && (
          <Link
            href="/profile"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground hover:border-accent"
          >
            <span>
              Build your taste profile to see your{" "}
              <strong className="text-accent">match %</strong> on every strain.
            </span>
            <span className="shrink-0 text-accent">→</span>
          </Link>
        )}

        {filtered.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nothing matches those filters. Try removing one.
          </p>
        ) : view === "list" ? (
          <ul className="mt-5 space-y-3">
            {visibleEntries.map((entry) => (
              <CatalogRow
                key={entry.strain.name}
                entry={entry}
                match={matches[entry.strain.name]}
                score={scored.get(entry.strain.name) ?? 0}
              />
            ))}
          </ul>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {visibleEntries.map((entry) => (
              <CatalogCollectibleCard
                key={entry.strain.name}
                entry={entry}
                match={matches[entry.strain.name]}
                score={scored.get(entry.strain.name) ?? 0}
                wishlist
                wishlistSource="catalog"
              />
            ))}
          </ul>
        )}

        {hasMore && (
          // Sentinel — IntersectionObserver triggers the next page when this
          // node enters the viewport (with a generous rootMargin so the new
          // cards are already mounting by the time the user reaches them).
          // A small spinner sits inside as a visible "loading more…" cue.
          <div
            ref={sentinelRef}
            className="mt-10 flex flex-col items-center gap-3 py-4"
          >
            <span
              className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brass/25 border-t-brass"
              aria-hidden
            />
            <p className="text-xs text-muted-foreground">
              Showing {visibleEntries.length} of {filtered.length}
            </p>
          </div>
        )}
      </div>

      <CompareBasketTray />
    </div>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function ChipGrid({
  options,
  selected,
  onToggle,
}: {
  options: readonly { value: string; label: string }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.has(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Quick "add to Compare" toggle. Rendered as a sibling OVER the card link
// (not nested inside the <a>, which would be invalid) so a tap queues the
// strain into the compare basket without opening the detail page. Compare
// holds five at most, so it disables once the basket is full.
function CompareToggle({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const [inBasket, setInBasket] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const sync = () => {
      const basket = getBasket();
      const present = basket.some((s) => s.toLowerCase() === name.toLowerCase());
      setInBasket(present);
      setFull(!present && basket.length >= 5);
    };
    sync();
    window.addEventListener(BASKET_EVENT, sync);
    return () => window.removeEventListener(BASKET_EVENT, sync);
  }, [name]);

  return (
    <button
      type="button"
      onClick={() => (inBasket ? removeFromBasket(name) : addToBasket(name))}
      disabled={full}
      aria-pressed={inBasket}
      title={
        full
          ? "Compare holds five at most"
          : inBasket
            ? "Remove from compare"
            : "Add to compare"
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm transition-colors",
        inBasket
          ? "border-accent bg-accent text-accent-foreground"
          : full
            ? "cursor-not-allowed border-border bg-background/85 text-muted-foreground/50"
            : "border-border bg-background/85 text-muted-foreground hover:border-accent/60 hover:text-foreground",
        className,
      )}
    >
      {inBasket ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <GitCompareArrows className="h-3.5 w-3.5" />
      )}
      {inBasket ? "In compare" : "Compare"}
    </button>
  );
}

// Editorial list row — mirrors the collectible-card design language:
// a mini gradient poster on the left (family palette + match pip), and
// a structured info column on the right. Layout follows the owner's
// mockup: badges row, big display name, "aka" line, a lightning-led
// archetype one-liner, effect glyphs with labels, and (on wider
// screens) AROMA / FLAVOR chip groups in a bordered right rail.
function CatalogRow({
  entry,
  match,
  score,
}: {
  entry: CatalogEntry;
  match?: CatalogMatch;
  score: number;
}) {
  const { strain, identity } = entry;
  const palette = paletteForTime(timeProfileOf(strain, identity));
  const artSrc = artImageSrc(strain, identity);
  const badgeValue = match ? match.score : score;
  const badgeLabel = match ? "MATCH" : "CURATED";
  const tier = tierOf(strain.name);
  const tagline = identity?.tagline;

  return (
    <li className="relative">
      <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
        <WishlistButton name={strain.name} source="catalog" label={false} />
        <CompareToggle name={strain.name} />
      </div>
      <Link
        href={`/catalog/${strainSlug(strain.name)}`}
        className="group flex items-stretch overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg active:scale-[0.995]"
      >
        {/* Art cover — carries the match score and tagline only; name/tier and
            the data live on the cream info panel to the right. */}
        <div
          className="relative w-[32%] min-w-[108px] max-w-[180px] shrink-0 self-stretch overflow-hidden text-white"
          style={{ background: palette.background }}
        >
          {artSrc && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artSrc}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:brightness-[1.08]"
                style={{ objectPosition: artFocusOf(identity) }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 78%)",
                }}
              />
            </>
          )}
          <span className="absolute left-2 top-2 z-10 inline-flex h-10 w-10 flex-col items-center justify-center rounded-full bg-white/95 text-foreground shadow-md">
            <span className="font-display text-sm font-semibold leading-none">
              {Math.round(badgeValue)}
            </span>
            <span className="text-[6px] uppercase tracking-[0.14em] text-muted-foreground">
              {badgeLabel}
            </span>
          </span>
          {tagline && (
            <span
              className="absolute inset-x-2.5 bottom-2.5 z-10 font-display text-[11px] italic leading-snug"
              style={{
                color: artSrc
                  ? undefined
                  : palette.contentTone === "light"
                    ? undefined
                    : palette.accent,
              }}
            >
              {tagline}
            </span>
          )}
        </div>

        {/* Info panel — name + tier, then a three-column sensory teaser, then
            an explore affordance (the whole card is the link). */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="pr-24">
            <Badge variant="outline" className="capitalize">
              {strain.type}
            </Badge>
            <h3 className="mt-1.5 font-display font-semibold leading-tight tracking-tight">
              <FitText text={strain.name} maxPx={24} minPx={13} />
            </h3>
            {tier && (
              <span className="mt-1.5 inline-block rounded-full border border-brass/40 bg-brass/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-brass">
                {tier}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <TeaserColumn label="Top effects">
              {strain.effects.slice(0, 3).map((e) => {
                const Icon = effectIconFor(e);
                return (
                  <li
                    key={`effect-${e}`}
                    className="flex items-center gap-1.5 text-xs text-foreground"
                  >
                    <Icon
                      className="h-3 w-3 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="truncate">{labelFor(e)}</span>
                  </li>
                );
              })}
            </TeaserColumn>
            <TeaserColumn label="Aroma">
              {strain.aromas.slice(0, 3).map((a) => (
                <li key={`aroma-${a}`}>
                  <span className="inline-block rounded-full bg-brass/10 px-2 py-0.5 text-[10px] text-brass">
                    {labelFor(a)}
                  </span>
                </li>
              ))}
            </TeaserColumn>
            <TeaserColumn label="Flavor">
              {strain.flavors.slice(0, 3).map((f) => (
                <li key={`flavor-${f}`}>
                  <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                    {labelFor(f)}
                  </span>
                </li>
              ))}
            </TeaserColumn>
          </div>

          <span className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-medium text-foreground transition-colors group-hover:border-accent/40 group-hover:bg-card">
            Explore full profile →
          </span>
        </div>
      </Link>
    </li>
  );
}

// One column of the row card's sensory teaser (label + a short list).
function TeaserColumn({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <ul className="mt-1.5 space-y-1">{children}</ul>
    </div>
  );
}

// Removed CatalogCard — Grid view now uses CatalogCollectibleCard
// (atmospheric-gradient collectible layout).

function TagRow({
  label,
  values,
  kind,
}: {
  label: string;
  values: string[];
  kind: "aroma" | "flavor" | "effect";
}) {
  if (values.length === 0) return null;
  return (
    <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden">
      <span className="w-9 shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </span>
      {values.map((v) => (
        <TagChip key={`${kind}-${v}`} kind={kind} value={v} />
      ))}
    </div>
  );
}

function TagChip({
  kind,
  value,
}: {
  kind: "aroma" | "flavor" | "effect" | "trait";
  value: string;
}) {
  const tone =
    kind === "aroma"
      ? "bg-brass/10 text-brass"
      : kind === "flavor"
        ? "bg-accent/10 text-accent"
        : kind === "effect"
          ? "bg-foreground/5 text-foreground"
          : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px]",
        tone,
      )}
    >
      {labelFor(value)}
    </span>
  );
}
