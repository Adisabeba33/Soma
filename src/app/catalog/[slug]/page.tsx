import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  curatedScore,
  getCatalogEntryBySlug,
  similarWithProfiles,
  strainSlug,
} from "@/lib/catalog";
import { STRAINS } from "@/lib/strain-data";
import { getIdentity } from "@/lib/strain-identity";
import { labelFor } from "@/lib/vocab";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site-url";
import type { CatalogEntry } from "@/lib/catalog";
import type { StrainType } from "@/lib/types";
import { StrainDetail, type LineageParent } from "./strain-detail";

// Statically generate every strain page so they index well and load fast.
// Personalisation (the visitor's match score and prior verdict) moved to the
// client — see strain-detail.tsx + /api/strain-match — so no per-request data
// is read here and the page can be prerendered.
export function generateStaticParams() {
  return STRAINS.map((s) => ({ slug: strainSlug(s.name) }));
}

// Allow on-demand rendering for any future strain not in the prerender set.
export const dynamicParams = true;

const STRAIN_NAMES = new Set(STRAINS.map((s) => s.name));
const STRAIN_TYPE_BY_NAME = new Map<string, StrainType>(
  STRAINS.map((s) => [s.name, s.type]),
);

// "lemon, pine and earth" from vocab tokens (lower-cased common nouns).
function readableList(tokens: string[]): string {
  const labels = tokens.map((t) => labelFor(t).toLowerCase());
  return joinReadable(labels);
}

// Same join but preserves casing — for proper nouns like strain names.
function joinReadable(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function metaDescription(entry: CatalogEntry): string {
  if (entry.identity?.curatorNote) {
    const note = entry.identity.curatorNote.trim();
    return note.length > 200 ? `${note.slice(0, 197).trimEnd()}…` : note;
  }
  const s = entry.strain;
  const aromas = readableList(s.aromas.slice(0, 3));
  return `${s.name}: a ${s.type} strain${
    aromas ? ` with ${aromas} aromas` : ""
  }. Explore its sensory profile, effects and nearest matches in the SŌMA catalog.`;
}

// Data-derived FAQ — shown on the page and emitted as FAQPage JSON-LD. Built
// only from what the catalog actually knows; no fabricated figures.
export interface StrainFaqItem {
  q: string;
  a: string;
}

function buildFaq(entry: CatalogEntry): StrainFaqItem[] {
  const s = entry.strain;
  const faq: StrainFaqItem[] = [];

  const aromas = readableList(s.aromas.slice(0, 4));
  const flavors = readableList(s.flavors.slice(0, 4));
  if (aromas || flavors) {
    faq.push({
      q: `What does ${s.name} smell and taste like?`,
      a: `${s.name} is typically described with${
        aromas ? ` aromas of ${aromas}` : ""
      }${aromas && flavors ? " and" : ""}${
        flavors ? ` flavours of ${flavors}` : ""
      }. Aroma and flavour vary with grower, batch and freshness.`,
    });
  }

  const effects = readableList(s.effects.slice(0, 4));
  if (effects) {
    faq.push({
      q: `What effects is ${s.name} associated with?`,
      a: `${s.name} is commonly associated with effects such as ${effects}. Effects are subjective and depend on dose, setting and the individual — this is sensory guidance, not a guarantee.`,
    });
  }

  faq.push({
    q: `Is ${s.name} an indica or a sativa?`,
    a: `${s.name} is classified as ${s.type} in the SŌMA catalog. These labels are a loose shorthand rather than a precise prediction of effect; the plant's full chemistry and how it was grown matter more.`,
  });

  const similarNames = entry.similar.slice(0, 3).map((x) => x.name);
  if (similarNames.length) {
    faq.push({
      q: `What strains are similar to ${s.name}?`,
      a: `By sensory profile, the closest strains in the SŌMA catalog include ${joinReadable(
        similarNames,
      )}. SŌMA matches on aroma, flavour and effect rather than name alone.`,
    });
  }

  return faq;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCatalogEntryBySlug(slug);
  if (!entry) return { title: "Strain — SŌMA" };
  const url = `/catalog/${slug}`;
  const title = `${entry.strain.name} — SŌMA`;
  const description = metaDescription(entry);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StrainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getCatalogEntryBySlug(slug);
  if (!entry) notFound();

  const similar = similarWithProfiles(entry.similar);

  // Enrich each parent with what we already know about it. Lookup
  // priority: our own catalog → identity.lineage.parentDetails fallback
  // → just the name.
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

  const url = absoluteUrl(`/catalog/${slug}`);
  const faq = buildFaq(entry);
  const description = metaDescription(entry);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${entry.strain.name}: sensory profile and matches`,
    description,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "SŌMA" },
    publisher: {
      "@type": "Organization",
      name: "SŌMA",
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Harvest",
        item: absoluteUrl("/catalog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.strain.name,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />
      <StrainDetail
        entry={entry}
        curatedScore={curatedScore(entry)}
        similar={similar}
        lineageParents={lineageParents}
        faq={faq}
      />
    </>
  );
}
