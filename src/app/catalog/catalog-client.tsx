"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  GitCompareArrows,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CompareBasketTray } from "@/components/compare-basket-tray";
import { SensoryRadar } from "@/components/sensory-radar";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { knownAsNames } from "@/lib/strain-identity";
import {
  BASKET_EVENT,
  addToBasket,
  isInBasket,
  removeFromBasket,
} from "@/lib/compare-basket";
import type { CatalogEntry } from "@/lib/catalog";

const AROMA_FILTERS = [
  "gassy",
  "earthy",
  "citrus",
  "sweet",
  "skunky",
  "creamy",
  "fruity",
  "pine",
] as const;

const EFFECT_FILTERS = [
  "relaxed",
  "sleepy",
  "focused",
  "creative",
  "energetic",
  "euphoric",
] as const;

export function CatalogClient({ entries }: { entries: CatalogEntry[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [aromaFilters, setAromaFilters] = useState<Set<string>>(new Set());
  const [effectFilters, setEffectFilters] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  // Deep-link seed (e.g. from a "Nearby in sensory space" link).
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (q) {
        const haystack = [
          e.strain.name.toLowerCase(),
          ...(e.strain.aliases ?? []).map((a) => a.toLowerCase()),
        ];
        if (!haystack.some((h) => h.includes(q))) return false;
      }
      if (aromaFilters.size > 0) {
        const has = e.strain.aromas.some((a) => aromaFilters.has(a));
        if (!has) return false;
      }
      if (effectFilters.size > 0) {
        const has = e.strain.effects.some((eff) => effectFilters.has(eff));
        if (!has) return false;
      }
      return true;
    });
  }, [entries, query, aromaFilters, effectFilters]);

  function toggleAroma(value: string) {
    setAromaFilters((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function toggleEffect(value: string) {
    setEffectFilters((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function clearAll() {
    setQuery("");
    setAromaFilters(new Set());
    setEffectFilters(new Set());
  }

  const anyFilter =
    query !== "" || aromaFilters.size > 0 || effectFilters.size > 0;

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or alias (GG4, Pink Cookies…)"
            className="pl-10"
          />
        </div>

        <FilterGroup
          label="Aroma"
          options={AROMA_FILTERS}
          selected={aromaFilters}
          onToggle={toggleAroma}
        />
        <FilterGroup
          label="Effect"
          options={EFFECT_FILTERS}
          selected={effectFilters}
          onToggle={toggleEffect}
        />

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <span>
            {filtered.length} of {entries.length} strains
          </span>
          {anyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing matches those filters. Try removing one.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((entry) => (
            <CatalogRow
              key={entry.strain.name}
              entry={entry}
              isExpanded={expanded === entry.strain.name}
              onToggle={() =>
                setExpanded(
                  expanded === entry.strain.name ? null : entry.strain.name,
                )
              }
            />
          ))}
        </ul>
      )}

      <CompareBasketTray />
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                active
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {labelFor(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CatalogRow({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: CatalogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { strain } = entry;
  const aliasPreview = (strain.aliases ?? []).slice(0, 3).join(" · ");

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            isExpanded && "rotate-180",
          )}
        />
        <SensoryRadar
          strain={strain}
          size={56}
          className="mt-0.5 h-14 w-14 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl font-semibold tracking-tight">
              {strain.name}
            </h3>
            <Badge variant="outline">{strain.type}</Badge>
            <Badge variant="muted">{strain.potency}</Badge>
            <Badge variant="accent">curated</Badge>
            <ConfidenceBadge confidence={entry.confidence} />
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
          <div className="mt-3 flex flex-wrap gap-1.5">
            {strain.aromas.slice(0, 5).map((a) => (
              <TagChip key={`a-${a}`} kind="aroma" value={a} />
            ))}
            {strain.effects.slice(0, 4).map((e) => (
              <TagChip key={`e-${e}`} kind="effect" value={e} />
            ))}
          </div>
        </div>
      </button>

      {isExpanded && <CatalogDetail entry={entry} />}
    </li>
  );
}

function CatalogDetail({ entry }: { entry: CatalogEntry }) {
  const { strain, similar, identity, familyMembers } = entry;
  const knownAs = knownAsNames(strain.aliases, identity);

  return (
    <div className="border-t border-border bg-muted/30 p-5">
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

function ConfidenceBadge({
  confidence,
}: {
  confidence: "high" | "medium" | "low";
}) {
  const tone =
    confidence === "high"
      ? "bg-accent/10 text-accent"
      : confidence === "medium"
        ? "bg-brass/15 text-brass"
        : "bg-[#a23b2c]/10 text-[#a23b2c]";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      detail: {confidence}
    </span>
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
