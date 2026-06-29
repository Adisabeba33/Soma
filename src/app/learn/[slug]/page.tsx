import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site-url";
import {
  LEARN_ARTICLES,
  getArticle,
  type ArticleBlock,
} from "@/lib/learn-articles";

// Statically generate every article at build time (option B: typed registry +
// dynamic route). Style mirrors /privacy: brass eyebrow, font-display H1,
// prose in muted-foreground.
export function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

// Fail the build / return 404 for any slug not in the registry.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `/learn/${article.slug}`;
  return {
    title: `${article.title} — SŌMA`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-10 font-display text-xl font-semibold tracking-tight">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-6 font-display text-lg font-medium tracking-tight">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-muted-foreground">
          {block.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    default:
      return (
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
  }
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = absoluteUrl(`/learn/${article.slug}`);

  // Article JSON-LD — headline, dates and publisher Organization.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.updated,
    dateModified: article.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "SŌMA" },
    publisher: {
      "@type": "Organization",
      name: "SŌMA",
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
    },
  };

  // FAQPage JSON-LD — mirrors the on-page FAQ exactly.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // BreadcrumbList JSON-LD — Home → Learn → article.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: absoluteUrl("/learn"),
      },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <JsonLd data={articleLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Back to where the reader opened this article from (the Learn hub at
          the right scroll, a related link…), falling back to the hub on a
          direct hit. The breadcrumb trail still lives in the JSON-LD above. */}
      <BackButton fallbackHref="/learn" label="Back to Learn" />

      <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight">
        {article.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{article.readingTime}</p>

      <div className="mt-8 space-y-3">
        {article.intro.map((para, i) => (
          <p key={i} className="leading-relaxed text-muted-foreground">
            {para}
          </p>
        ))}
      </div>

      {article.body.map((block, i) => (
        <Block key={i} block={block} />
      ))}

      {/* FAQ — also emitted as FAQPage JSON-LD above. */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-6">
          {article.faq.map((f, i) => (
            <div key={i}>
              <h3 className="font-display text-base font-medium tracking-tight text-foreground">
                {f.q}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-2xl border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">Keep exploring</p>
        <p className="mt-2">
          Put this into practice: build your{" "}
          <Link href="/taste-match" className="text-accent hover:underline">
            Taste Match
          </Link>{" "}
          to find flower by how it actually smells and feels, or browse the{" "}
          <Link href="/catalog" className="text-accent hover:underline">
            Harvest
          </Link>{" "}
          catalog. More guides on the{" "}
          <Link href="/learn" className="text-accent hover:underline">
            Learn
          </Link>{" "}
          hub.
        </p>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Information only — not medical or legal advice. For adults 21+ where
        cannabis is legal.
      </p>
    </article>
  );
}
