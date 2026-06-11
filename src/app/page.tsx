import Link from "next/link";
import { ArrowRight, Leaf, ListChecks, PenLine, Sparkles } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

const STEPS = [
  {
    icon: Leaf,
    title: "Build your taste profile",
    body: "Either answer the short sensory questionnaire, or just name a few strains you've already tried — SŌMA reads the profile back from them.",
  },
  {
    icon: ListChecks,
    title: "Drop in what's available",
    body: "Type the strains in front of you, or paste a dispensary menu. SŌMA reads the names and ignores the prices and percentages.",
  },
  {
    icon: Sparkles,
    title: "Get a ranked, explained match",
    body: "Every option is scored against your profile and sorted from Best Match to Avoid — each with the reasoning, and the honest risks.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-editorial px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
        <p className="text-xs uppercase tracking-[0.28em] text-brass">
          Sensory Sommelier
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Find flower that matches{" "}
          <span className="italic text-accent">your taste</span> — not just the
          strain name.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          SŌMA is an AI cannabis sommelier. It learns your personal sensory
          profile and tells you whether a strain on the menu is right for{" "}
          <span className="italic">you</span> — before you spend a cent.
        </p>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Three ways to start
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link
              href="/taste-match"
              className="group rounded-2xl border border-accent bg-accent/5 p-6 text-left transition-colors hover:bg-accent/10"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                <Leaf className="h-3.5 w-3.5" />
                Questionnaire
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Take the full questionnaire
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Sixteen sensory questions. Builds the most thorough profile —
                works even if you can't name strains yet.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Start Taste Match
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/onboarding/experience"
              className="group rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brass">
                <Sparkles className="h-3.5 w-3.5" />
                From experience
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Name strains you've tried
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                List 2–5 strains you've loved, liked or disliked. SŌMA reads
                your profile back from them — you confirm before saving.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brass">
                Try Experience Match
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/onboarding/describe"
              className="group rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brass">
                <PenLine className="h-3.5 w-3.5" />
                In your words
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Describe what you like
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                No strain names needed — say it in a sentence. SŌMA reads it
                into a starting profile you confirm before saving.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brass">
                Describe your taste
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
          <div className="mt-5">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              How it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-[1fr_1.2fr] sm:gap-16">
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight">
              The menu is long. The guidance is not.
            </h2>
            <div className="space-y-4 text-[0.97rem] leading-relaxed text-muted-foreground">
              <p>
                You open a dispensary menu and see dozens of names. Most people
                cannot tell what is genuinely good, what resembles flower they
                already loved, and what will simply be a waste of money.
              </p>
              <p>
                SŌMA does not ask{" "}
                <span className="italic text-foreground">
                  &ldquo;what is this strain?&rdquo;
                </span>{" "}
                It asks the only question that matters:
              </p>
              <p className="font-display text-xl italic text-foreground">
                &ldquo;Is this strain right for this person?&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-editorial px-5 py-20 sm:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          How it works
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-center gap-3">
                <span className="font-display text-sm text-brass">
                  0{i + 1}
                </span>
                <span className="h-px flex-1 bg-border" />
                <step.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-editorial px-5 py-20 sm:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-brass">
            A sample read
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            What a recommendation looks like
          </h2>

          <div className="mt-8 rounded-2xl border border-border bg-background p-7 sm:p-9">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Closest Alternative
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                Confidence: medium
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <h3 className="font-display text-3xl font-semibold tracking-tight">
                Triple Double OG
              </h3>
              <span className="font-display text-3xl font-semibold text-accent">
                82%
              </span>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed text-foreground">
              This option looks close to your profile. It should land in the
              earthy-gas direction you enjoy and give a heavier body effect. The
              risk is that the batch may be less sticky or less loud than a true
              GG4 — so freshness and packaging date matter. This is a sensory
              match, not a guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-editorial px-5 py-24 text-center sm:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight">
          Stop guessing at the counter.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Build your taste profile once. Bring SŌMA to every menu after that.
        </p>
        <div className="mt-8">
          <Link
            href="/taste-match"
            className={buttonClass("primary", "lg")}
          >
            Start Taste Match
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
