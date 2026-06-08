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
  Sparkles,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CompareBasketTray } from "@/components/compare-basket-tray";
import { SensoryRadar } from "@/components/sensory-radar";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { AROMAS, EFFECTS, FLAVORS } from "@/lib/vocab";
import { knownAsNames } from "@/lib/strain-identity";
import {
  BASKET_EVENT,
  addToBasket,
  isInBasket,
  removeFromBasket,
} from "@/lib/compare-basket";
import type { CatalogEntry } from "@/lib/catalog";
import type { StrainProfile } from "@/lib/types";

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

export interface CatalogMatch {
  score: number;
  category: string;
}

const CATEGORY_TONE: Record<string, string> = {
  "Best Match": "text-accent",
  "Closest Alternative": "text-brass",
  "Worth Trying": "text-foreground",
  Risky: "text-[#b4791f]",
  Avoid: "text-[#a23b2c]",
};

type ViewMode = "list" | "grid";
type SortMode = "curated" | "match" | "name";

// A derived, deterministic "Curated" index (0–100) used for the badge and the
// default sort when the visitor has no taste profile yet. It is NOT a quality
// rating of the flower — it reflects how richly SOMA has characterised the
// strain: detail completeness, sensory richness and identity confidence. Pure
// function of the entry, so the same strain always shows the same number.
export function curatedScore(entry: CatalogEntry): number {
  const s = entry.strain;
  const confBase =
    entry.confidence === "high" ? 86 : entry.confidence === "medium" ? 78 : 70;
  const richness =
    s.aromas.length + s.flavors.length + s.effects.length + s.traits.length;
  const richBonus = Math.max(-4, Math.min(8, Math.round((richness - 14) * 0.6)));
  const idBonus = entry.identity
    ? entry.identity.sourceConfidence === "high"
      ? 6
      : entry.identity.sourceConfidence === "medium"
        ? 3
        : 1
    : 0;
  return Math.max(60, Math.min(98, confBase + richBonus + idBonus));
}

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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");
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

  const expandedEntry =
    view === "grid" && expanded
      ? filtered.find((e) => e.strain.name === expanded)
      : undefined;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[232px_minmax(0,1fr)]">
      {/* ── Filter rail ─────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5 text-brass" />
              Filters
            </p>
            {anyFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            )}
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-10 pl-9 text-sm"
            />
          </div>

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

          <div className="mt-5 border-t border-border pt-4">
            <p className="rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground">
              {filtered.length}{" "}
              {filtered.length === 1 ? "result" : "results"}
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────── */}
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
                isExpanded={expanded === entry.strain.name}
                onToggle={() =>
                  setExpanded(
                    expanded === entry.strain.name ? null : entry.strain.name,
                  )
                }
              />
            ))}
          </ul>
        ) : (
          <>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((entry) => (
                <CatalogCard
                  key={entry.strain.name}
                  entry={entry}
                  match={matches[entry.strain.name]}
                  score={scored.get(entry.strain.name) ?? 0}
                  isActive={expanded === entry.strain.name}
                  onToggle={() =>
                    setExpanded(
                      expanded === entry.strain.name ? null : entry.strain.name,
                    )
                  }
                />
              ))}
            </ul>
            {expandedEntry && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between gap-3 px-5 pt-4">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {expandedEntry.strain.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setExpanded(null)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CatalogDetail entry={expandedEntry} />
              </div>
            )}
          </>
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

// Radar-as-image tile — the sensory diagram stands in for the product photo,
// with the score badge tucked into the corner.
function RadarTile({
  strain,
  score,
  tone,
  size,
  labels = false,
  className,
}: {
  strain: StrainProfile;
  score: number;
  tone: string;
  size: number;
  labels?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted/70 via-card to-card",
        className,
      )}
    >
      <SensoryRadar strain={strain} size={size} labels={labels} />
      <span
        className={cn(
          "absolute left-2 top-2 inline-flex items-center justify-center rounded-lg bg-background/85 px-1.5 py-0.5 font-display text-sm font-semibold leading-none shadow-sm backdrop-blur-sm",
          tone,
        )}
      >
        {score}
      </span>
    </div>
  );
}

function CatalogRow({
  entry,
  match,
  score,
  isExpanded,
  onToggle,
}: {
  entry: CatalogEntry;
  match?: CatalogMatch;
  score: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { strain } = entry;
  const badgeScore = match ? match.score : score;
  const badgeTone = match
    ? CATEGORY_TONE[match.category] ?? "text-foreground"
    : "text-brass";
  const aliasPreview = (strain.aliases ?? []).slice(0, 3).join(" · ");

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-stretch gap-4 p-4 text-left sm:gap-5 sm:p-5"
      >
        <RadarTile
          strain={strain}
          score={badgeScore}
          tone={badgeTone}
          size={108}
          className="hidden h-[120px] w-[120px] shrink-0 sm:flex"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl font-semibold tracking-tight">
              {strain.name}
            </h3>
            <Badge variant="outline" className="capitalize">
              {strain.type}
            </Badge>
            <Badge variant="muted">{strain.potency}</Badge>
          </div>
          {aliasPreview && (
            <p className="mt-1 text-xs text-muted-foreground">
              aka {aliasPreview}
              {(strain.aliases?.length ?? 0) > 3 ? " …" : ""}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {entry.archetype}
          </p>

          <div className="mt-3 space-y-2">
            <TagRow label="Effect" values={strain.effects.slice(0, 5)} kind="effect" />
            <TagRow label="Aroma" values={strain.aromas.slice(0, 5)} kind="aroma" />
            <TagRow label="Flavor" values={strain.flavors.slice(0, 5)} kind="flavor" />
          </div>
        </div>

        <div className="hidden w-36 shrink-0 flex-col items-center justify-between lg:flex">
          <SensoryRadar strain={strain} size={132} labels className="h-32 w-32" />
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">
            {isExpanded ? "Hide details" : "View details"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                isExpanded && "rotate-180",
              )}
            />
          </span>
        </div>
      </button>

      {isExpanded && <CatalogDetail entry={entry} />}
    </li>
  );
}

function CatalogCard({
  entry,
  match,
  score,
  isActive,
  onToggle,
}: {
  entry: CatalogEntry;
  match?: CatalogMatch;
  score: number;
  isActive: boolean;
  onToggle: () => void;
}) {
  const { strain } = entry;
  const badgeScore = match ? match.score : score;
  const badgeTone = match
    ? CATEGORY_TONE[match.category] ?? "text-foreground"
    : "text-brass";

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-2xl border bg-card p-3 text-left transition-colors",
          isActive
            ? "border-accent ring-1 ring-accent"
            : "border-border hover:border-accent/50",
        )}
      >
        <RadarTile
          strain={strain}
          score={badgeScore}
          tone={badgeTone}
          size={150}
          className="aspect-square w-full"
        />
        <h3 className="mt-3 truncate font-display text-base font-semibold tracking-tight">
          {strain.name}
        </h3>
        <p className="mt-0.5 text-xs capitalize text-muted-foreground">
          {strain.type} · {strain.potency}
        </p>
      </button>
    </li>
  );
}

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
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      {values.map((v) => (
        <TagChip key={`${kind}-${v}`} kind={kind} value={v} />
      ))}
    </div>
  );
}

function CatalogDetail({ entry }: { entry: CatalogEntry }) {
  const { strain, similar, identity, familyMembers } = entry;
  const knownAs = knownAsNames(strain.aliases, identity);

  return (
    <div className="border-t border-border bg-muted/30 p-5">
      {identity?.curatorNote && (
        <figure className="mb-5 border-l-2 border-brass/50 pl-4">
          <figcaption className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brass">
            Curator&apos;s note
          </figcaption>
          <p className="mt-2 font-display text-[15px] italic leading-relaxed text-foreground/90">
            {identity.curatorNote}
          </p>
        </figure>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <DetailColumn label="Aroma" values={strain.aromas} kind="aroma" />
        <DetailColumn label="Flavor" values={strain.flavors} kind="flavor" />
        <DetailColumn label="Effect" values={strain.effects} kind="effect" />
        <DetailColumn label="Texture / cure" values={strain.traits} kind="trait" />
      </div>

      {knownAs.length > 0 && (
        <PassportBlock label="Known as">
          <p className="text-sm text-foreground">{knownAs.join(" · ")}</p>
        </PassportBlock>
      )}

      {identity?.breeder && (
        <PassportBlock label="Breeder">
          <p className="text-sm text-foreground">{identity.breeder}</p>
        </PassportBlock>
      )}

      {identity?.lineage &&
        (identity.lineage.cross ||
          (identity.lineage.parents && identity.lineage.parents.length > 0)) && (
          <PassportBlock label="Lineage">
            {identity.lineage.cross && (
              <p className="text-sm text-foreground">{identity.lineage.cross}</p>
            )}
            {identity.lineage.parents &&
              identity.lineage.parents.length > 0 &&
              !identity.lineage.cross && (
                <p className="text-sm text-foreground">
                  {identity.lineage.parents.join(" × ")}
                </p>
              )}
          </PassportBlock>
        )}

      {identity?.sensoryFamily && (
        <PassportBlock label="Sensory family">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {identity.sensoryFamily}
            </span>
            {familyMembers.length > 0 && (
              <span className="text-xs text-muted-foreground">
                also: {familyMembers.slice(0, 6).join(" · ")}
                {familyMembers.length > 6 ? " …" : ""}
              </span>
            )}
          </div>
        </PassportBlock>
      )}

      {identity?.phenotypeNotes && identity.phenotypeNotes.length > 0 && (
        <PassportBlock label="Phenotype notes">
          <ul className="mt-1 space-y-1 text-sm text-foreground/90">
            {identity.phenotypeNotes.map((note, i) => (
              <li key={i} className="leading-relaxed">
                — {note}
              </li>
            ))}
          </ul>
        </PassportBlock>
      )}

      {identity?.growerVariants && identity.growerVariants.length > 0 && (
        <PassportBlock label="Grower variants">
          <p className="text-sm text-foreground">
            {identity.growerVariants.join(" · ")}
          </p>
        </PassportBlock>
      )}

      {strain.note && (
        <PassportBlock label="Internal note">
          <p className="text-sm leading-relaxed text-foreground/90">
            {strain.note}
          </p>
        </PassportBlock>
      )}

      <PassportBlock label="Nearby in sensory space">
        <ul className="flex flex-wrap gap-1.5">
          {similar.map((s) => (
            <li key={s.name}>
              <Link
                href={`/catalog?q=${encodeURIComponent(s.name)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground hover:border-accent hover:text-accent"
              >
                {s.name}
                <span className="text-muted-foreground">
                  {Math.round(s.score * 100)}%
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PassportBlock>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Sensory data: curated seed (hand-mapped); detail completeness is{" "}
        <strong className="text-foreground">{entry.confidence}</strong>.{" "}
        {identity ? (
          <>
            Identity data confidence is{" "}
            <strong className="text-foreground">{identity.sourceConfidence}</strong>
            .{" "}
          </>
        ) : (
          <>No identity record yet — lineage, breeder and family aren&apos;t available for this strain.{" "}</>
        )}
        Batch quality still depends on grower, freshness and storage — none of
        which is captured here.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Link
          href={`/taste-match?strain=${encodeURIComponent(strain.name)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          Use in Taste Match
        </Link>
        <AddToCompareButton name={strain.name} />
      </div>
    </div>
  );
}

function AddToCompareButton({ name }: { name: string }) {
  const [inBasket, setInBasket] = useState(false);

  useEffect(() => {
    setInBasket(isInBasket(name));
    const handler = () => setInBasket(isInBasket(name));
    window.addEventListener(BASKET_EVENT, handler);
    return () => window.removeEventListener(BASKET_EVENT, handler);
  }, [name]);

  const toggle = () => {
    if (inBasket) removeFromBasket(name);
    else addToBasket(name);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={inBasket}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
        inBasket
          ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/15"
          : "border-border bg-transparent text-foreground hover:bg-muted",
      )}
    >
      {inBasket ? (
        <>
          <Check className="h-4 w-4" />
          In Compare basket
        </>
      ) : (
        <>
          <GitCompareArrows className="h-4 w-4" />
          Add to Compare
        </>
      )}
    </button>
  );
}

function PassportBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function DetailColumn({
  label,
  values,
  kind,
}: {
  label: string;
  values: string[];
  kind: "aroma" | "flavor" | "effect" | "trait";
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {values.length === 0 ? (
        <p className="mt-1 text-xs italic text-muted-foreground">
          (no data)
        </p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <li key={`${kind}-${v}`}>
              <TagChip kind={kind} value={v} />
            </li>
          ))}
        </ul>
      )}
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs",
        tone,
      )}
    >
      {labelFor(value)}
    </span>
  );
}
