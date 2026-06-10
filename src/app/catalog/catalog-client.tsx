"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  GitCompareArrows,
  LayoutGrid,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CatalogCollectibleCard } from "@/components/catalog-collectible-card";
import { CompareBasketTray } from "@/components/compare-basket-tray";
import { effectIconFor } from "@/components/effect-icon";
import { paletteForTime } from "@/lib/sensory-family-palette";
import { timeProfileOf, artImageSrc } from "@/lib/strain-art";
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
}: {
  entries: CatalogEntry[];
  matches?: Record<string, CatalogMatch>;
  hasProfile?: boolean;
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = entries.filter((e) => {
      if (q) {
        const haystack = [
          e.strain.name.toLowerCase(),
          ...(e.strain.aliases ?? []).map((a) => a.toLowerCase()),
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

    const sorted = [...list];
    if (hasProfile && sortBy === "match") {
      sorted.sort(
        (a, b) =>
          (matches[b.strain.name]?.score ?? -1) -
          (matches[a.strain.name]?.score ?? -1),
      );
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
  ]);

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
            {filtered.map((entry) => (
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
            {filtered.map((entry) => (
              <CatalogCollectibleCard
                key={entry.strain.name}
                entry={entry}
                match={matches[entry.strain.name]}
                score={scored.get(entry.strain.name) ?? 0}
              />
            ))}
          </ul>
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
  const aliasPreview = (strain.aliases ?? []).slice(0, 3).join(" · ");

  return (
    <li className="relative">
      <CompareToggle
        name={strain.name}
        className="absolute right-4 top-4 z-10"
      />
      <Link
        href={`/catalog/${strainSlug(strain.name)}`}
        className="flex items-stretch overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/50"
      >
        {/* Artwork column — flush to the card's left/top/bottom edges (no
            inner border or padding), so the image *is* the start of the
            block and flows straight into the content. A fixed-width left
            panel that fills the full row height: the art is cropped to fill
            (object-cover) rather than shown whole, because a full-height 3:4
            portrait would blow the row up to a full screen and hide the
            strain's own data. Without art it's the time-of-day gradient. */}
        <div
          className="relative w-[124px] shrink-0 self-stretch overflow-hidden sm:w-[160px]"
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
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0) 80%)",
                }}
              />
            </>
          )}
          <span className="absolute left-2 top-2 z-10 inline-flex h-9 w-9 flex-col items-center justify-center rounded-full bg-white/95 text-foreground shadow-md">
            <span className="font-display text-xs font-semibold leading-none">
              {badgeValue}
            </span>
            <span className="text-[6px] uppercase tracking-[0.14em] text-muted-foreground">
              {badgeLabel}
            </span>
          </span>
          {identity?.tagline && (
            <span
              className="absolute bottom-2 left-2 right-2 z-10 font-display text-[10px] italic leading-tight"
              style={{ color: palette.accent }}
            >
              {identity.tagline}
            </span>
          )}
        </div>

        {/* Main info column */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {/* pr reserves room for the absolute Compare control top-right so
              the potency badge never slides under it. */}
          <div className="flex flex-wrap items-center gap-1.5 pr-28">
            <Badge variant="outline" className="capitalize">
              {strain.type}
            </Badge>
            <Badge className="border-transparent bg-brass/15 capitalize text-brass">
              {strain.potency.replace("-", " ")}
            </Badge>
          </div>
          <h3 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight">
            {strain.name}
          </h3>
          {aliasPreview && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              aka {aliasPreview}
              {(strain.aliases?.length ?? 0) > 3 ? " …" : ""}
            </p>
          )}
          <p className="mt-2 inline-flex items-start gap-1.5 text-sm font-medium italic text-brass">
            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {entry.archetype}
          </p>

          {/* Effect glyphs with labels */}
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Effect
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-2">
              {strain.effects.slice(0, 4).map((e) => {
                const Icon = effectIconFor(e);
                return (
                  <li
                    key={`effect-${e}`}
                    className="flex flex-col items-center gap-1 text-[10px] text-muted-foreground"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/40">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {labelFor(e)}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Aroma / Flavor chips — single column at every width, matching
              the reference (no separate desktop rail). */}
          <div className="mt-3 space-y-2">
            <TagRow label="Aroma" values={strain.aromas.slice(0, 4)} kind="aroma" />
            <TagRow label="Flavor" values={strain.flavors.slice(0, 3)} kind="flavor" />
          </div>
        </div>
      </Link>
    </li>
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
