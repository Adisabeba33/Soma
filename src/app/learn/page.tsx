import Link from "next/link";
import type { Metadata } from "next";
import { LEARN_ARTICLES } from "@/lib/learn-articles";

// Static content hub. Style mirrors /privacy and /about: brass eyebrow,
// font-display H1, prose in muted-foreground, generous max width.
export const metadata: Metadata = {
  title: "Learn — SŌMA",
  description:
    "Plain-language guides to choosing, reading and storing cannabis flower — freshness, sensory vocabulary, and how to read a dispensary menu.",
  alternates: { canonical: "/learn" },
  openGraph: {
    type: "website",
    title: "Learn — SŌMA",
    description:
      "Plain-language guides to choosing, reading and storing cannabis flower.",
    url: "/learn",
  },
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Learn</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Field notes
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Short, plain-language guides to the things that actually shape your
        experience of cannabis flower — how to keep it fresh, why the same
        strain can feel different, how to read a menu, and the sensory
        vocabulary behind SŌMA&apos;s matching. Information only; for adults 21+
        where legal.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LEARN_ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
          >
            <h2 className="font-display text-lg font-semibold leading-snug tracking-tight group-hover:text-accent">
              {article.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {article.description}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-brass">
              {article.readingTime}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Ready to put it to use? Build your{" "}
        <Link href="/taste-match" className="text-accent hover:underline">
          Taste Match
        </Link>{" "}
        or browse the{" "}
        <Link href="/catalog" className="text-accent hover:underline">
          Harvest
        </Link>
        .
      </p>
    </div>
  );
}
