import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export const metadata = {
  title: "About — SŌMA",
  description:
    "SŌMA is a sensory sommelier for cannabis — built to help you avoid bad purchases, not to be another strain encyclopedia.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    title: "About — SŌMA",
    description:
      "SŌMA is a sensory sommelier for cannabis — built to help you avoid bad purchases, not to be another strain encyclopedia.",
    url: "/about",
  },
};

const PRINCIPLES = [
  {
    title: "Not enough batch data",
    body: "When the information is thin, SŌMA says so plainly instead of pretending to know.",
  },
  {
    title: "Grower and freshness decide a lot",
    body: "The same strain can be excellent from one brand and flat from another. Packaging date and storage matter.",
  },
  {
    title: "A sensory match, not a guarantee",
    body: "SŌMA compares sensory profiles. It never promises an outcome it cannot see.",
  },
];

const PHASES = [
  {
    tag: "Phase 1 — now",
    items: [
      "Sensory taste profile",
      "Manual entry & pasted menus",
      "Built-in Taste Match Engine",
      "Saved profile & recommendations",
    ],
  },
  {
    tag: "Phase 2",
    items: [
      "Screenshot upload & OCR",
      "Recommendation history",
      "Feedback loop that sharpens matching",
    ],
  },
  {
    tag: "Phase 3 & beyond",
    items: [
      "Dispensary API integration",
      "Batch freshness & grower tracking",
      "Community taste data",
      "A strain memory engine",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-editorial px-5 py-20 sm:px-8">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">About</p>
      <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        A sommelier, not an encyclopedia.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        SŌMA is not a catalogue of cannabis, and it is not another Leafly clone.
        It is a sensory sommelier — built to help one person choose flower that
        suits their own taste, feelings, favourite strains and whatever happens
        to be available.
      </p>

      <div className="mt-14 grid gap-10 border-t border-border pt-12 sm:grid-cols-[1fr_1.3fr] sm:gap-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          The one principle
        </h2>
        <div className="space-y-4 leading-relaxed text-muted-foreground">
          <p>
            SŌMA must never become an ordinary strain encyclopedia. Its single
            purpose is to help people avoid bad purchases through personal
            sensory taste matching.
          </p>
          <p className="font-display text-xl italic text-foreground">
            &ldquo;Is this strain right for this person?&rdquo;
          </p>
          <p>
            That is the value of the product. That is the core of SŌMA.
          </p>
        </div>
      </div>

      <div className="mt-14 border-t border-border pt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          How SŌMA stays honest
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The engine never fantasises. When it cannot know something, it tells
          you so — calmly and clearly.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="font-display text-base font-semibold">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 border-t border-border pt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Where SŌMA is going
        </h2>
        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          {PHASES.map((phase) => (
            <div key={phase.tag}>
              <p className="text-xs uppercase tracking-[0.18em] text-brass">
                {phase.tag}
              </p>
              <ul className="mt-3 space-y-2">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-12">
        <Link href="/taste-match" className={buttonClass("primary", "lg")}>
          Start Taste Match
        </Link>
        <Link href="/profile" className={buttonClass("outline", "lg")}>
          Build your profile
        </Link>
      </div>
    </div>
  );
}
