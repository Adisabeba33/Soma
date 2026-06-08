"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  GitCompareArrows,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SensoryRadar } from "@/components/sensory-radar";
import { RADAR_AXES, buildRadar } from "@/lib/sensory-radar";
import { cn } from "@/lib/utils";
import { labelFor } from "@/lib/vocab";
import { knownAsNames } from "@/lib/strain-identity";
import { strainSlug } from "@/lib/catalog";
import {
  BASKET_EVENT,
  addToBasket,
  isInBasket,
  removeFromBasket,
} from "@/lib/compare-basket";
import type {
  CatalogEntry,
  CatalogMatch,
  SimilarStrainEntry,
} from "@/lib/catalog";

const CATEGORY_TONE: Record<string, string> = {
  "Best Match": "text-accent",
  "Closest Alternative": "text-brass",
  "Worth Trying": "text-foreground",
  Risky: "text-[#b4791f]",
  Avoid: "text-[#a23b2c]",
};

export interface LineageParent {
  name: string;
  slug: string | null;
}

export function StrainDetail({
  entry,
  match,
  curatedScore,
  similar,
  lineageParents,
}: {
  entry: CatalogEntry;
  match?: CatalogMatch;
  curatedScore: number;
  similar: SimilarStrainEntry[];
  lineageParents: LineageParent[];
}) {
  const { strain, identity } = entry;
  const knownAs = knownAsNames(strain.aliases, identity);
  const radar = buildRadar(strain, { size: 10 });
  const badgeScore = match ? match.score : curatedScore;
  const badgeTone = match
    ? CATEGORY_TONE[match.category] ?? "text-foreground"
    : "text-brass";

  const lead =
    identity?.curatorNote?.split(/(?<=\.)\s/)[0] ??
    entry.archetype ??
    strain.note ??
    "";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Radar-as-hero on an abstract, aroma-tinted ground */}
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border"
            style={{
              background: `radial-gradient(120% 120% at 30% 20%, ${radar.fill}, hsl(var(--card)) 70%)`,
            }}
          >
            <SensoryRadar
              strain={strain}
              size={240}
              labels
              className="h-[88%] w-[88%]"
            />
            <span
              className={cn(
                "absolute left-4 top-4 inline-flex flex-col items-center rounded-xl bg-background/85 px-2.5 py-1 shadow-sm backdrop-blur-sm",
                badgeTone,
              )}
            >
              <span className="font-display text-2xl font-semibold leading-none">
                {badgeScore}
              </span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                {match ? "match" : "curated"}
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-[0.24em] text-brass">
              {identity?.sensoryFamily ?? "Strain"}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {strain.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {strain.type}
              </Badge>
              <Badge variant="muted">{strain.potency}</Badge>
              {identity && (
                <Badge variant="accent">
                  identity: {identity.sourceConfidence}
                </Badge>
              )}
            </div>
            {lead && (
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                {lead}
              </p>
            )}
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <Link
                href={`/taste-match?strain=${encodeURIComponent(strain.name)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                Use in Taste Match
              </Link>
              <CompareButton name={strain.name} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          {identity?.curatorNote && (
            <Section title="The Story">
              <p className="font-display text-lg italic leading-relaxed text-foreground/90">
                {identity.curatorNote}
              </p>
            </Section>
          )}

          {lineageParents.length > 0 && (
            <Section title="Genetics">
              <Genetics
                parents={lineageParents}
                cross={identity?.lineage?.cross}
                child={strain.name}
              />
            </Section>
          )}

          <Section title="Effects & experience">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {RADAR_AXES.map((ax, i) => (
                <EffectBar
                  key={ax.label}
                  label={ax.label}
                  value={radar.values[i]}
                />
              ))}
            </div>
            {strain.effects.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {strain.effects.map((e) => (
                  <TagChip key={e} kind="effect" value={e} />
                ))}
              </div>
            )}
          </Section>

          <Section title="Aroma & flavour">
            <div className="grid gap-4 sm:grid-cols-2">
              <TagBlock label="Aroma" values={strain.aromas} kind="aroma" />
              <TagBlock label="Flavour" values={strain.flavors} kind="flavor" />
            </div>
            {identity?.phenotypeNotes && identity.phenotypeNotes.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-foreground/90">
                {identity.phenotypeNotes.map((note, i) => (
                  <li key={i}>— {note}</li>
                ))}
              </ul>
            )}
          </Section>

          {strain.traits.length > 0 && (
            <Section title="Texture & cure">
              <TagBlock label="" values={strain.traits} kind="trait" />
            </Section>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground">
            Sensory data is a curated, hand-mapped seed; detail completeness is{" "}
            <strong className="text-foreground">{entry.confidence}</strong>.{" "}
            {identity ? (
              <>
                Identity confidence is{" "}
                <strong className="text-foreground">
                  {identity.sourceConfidence}
                </strong>
                .{" "}
              </>
            ) : (
              <>No identity record yet for this strain. </>
            )}
            The diagram is this strain&apos;s own sensory radar, not a photo.
            Batch quality still depends on grower, freshness and storage — none
            of which is captured here.
          </p>
        </div>

        {/* ── Side rail ───────────────────────────────────────── */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Section title="Key facts">
            <dl className="space-y-2.5 text-sm">
              <Fact label="Type" value={strain.type} capitalize />
              <Fact label="Strength" value={strain.potency} />
              {identity?.breeder && (
                <Fact label="Breeder" value={identity.breeder} />
              )}
              {identity?.lineage?.cross && (
                <Fact label="Cross" value={identity.lineage.cross} />
              )}
              {identity?.sensoryFamily && (
                <Fact label="Family" value={identity.sensoryFamily} />
              )}
              {knownAs.length > 0 && (
                <Fact label="Known as" value={knownAs.join(" · ")} />
              )}
            </dl>
          </Section>

          {similar.length > 0 && (
            <Section title="Similar strains">
              <ul className="space-y-2">
                {similar.map((s) => (
                  <li key={s.name}>
                    <Link
                      href={`/catalog/${strainSlug(s.name)}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 hover:border-accent"
                    >
                      <SensoryRadar
                        strain={s.strain}
                        size={40}
                        className="h-10 w-10 shrink-0"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {s.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {Math.round(s.score * 100)}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Fact({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={cn("text-right text-foreground", capitalize && "capitalize")}>
        {value}
      </dd>
    </div>
  );
}

function EffectBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{Math.round(value * 100)}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

function Genetics({
  parents,
  cross,
  child,
}: {
  parents: LineageParent[];
  cross?: string;
  child: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {parents.map((p, i) => (
          <span key={p.name} className="flex items-center gap-2">
            {p.slug ? (
              <Link
                href={`/catalog/${p.slug}`}
                className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
              >
                {p.name}
              </Link>
            ) : (
              <span className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground">
                {p.name}
              </span>
            )}
            {i < parents.length - 1 && (
              <span className="text-brass">×</span>
            )}
          </span>
        ))}
      </div>
      <div className="my-2 flex justify-center">
        <span className="text-muted-foreground">↓</span>
      </div>
      <div className="flex justify-center">
        <span className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
          {child}
        </span>
      </div>
      {cross && (
        <p className="mt-3 text-center text-xs text-muted-foreground">{cross}</p>
      )}
    </div>
  );
}

function TagBlock({
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
      {label && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
      )}
      {values.length === 0 ? (
        <p className="mt-1 text-xs italic text-muted-foreground">(no data)</p>
      ) : (
        <div className={cn("flex flex-wrap gap-1.5", label && "mt-2")}>
          {values.map((v) => (
            <TagChip key={`${kind}-${v}`} kind={kind} value={v} />
          ))}
        </div>
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

function CompareButton({ name }: { name: string }) {
  const [inBasket, setInBasket] = useState(false);

  useEffect(() => {
    setInBasket(isInBasket(name));
    const handler = () => setInBasket(isInBasket(name));
    window.addEventListener(BASKET_EVENT, handler);
    return () => window.removeEventListener(BASKET_EVENT, handler);
  }, [name]);

  return (
    <button
      type="button"
      onClick={() => (inBasket ? removeFromBasket(name) : addToBasket(name))}
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
