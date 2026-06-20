import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  ListChecks,
  Sparkles,
  Heart,
  Sprout,
  User,
  BookOpen,
  ChevronDown,
} from "lucide-react";
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
      {/* ── Greeting — a full-screen "meeting the sommelier" moment. ──────
          A portrait shot of the SŌMA apothecary; object-top keeps the branded
          sign + jars in frame while the card sits over the counter below. The
          gradient is a fallback behind the photo. */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-end justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#e9e1d2] via-[#d9cdb8] to-[#cdbfa6]"
          aria-hidden
        />
        <img
          src="/hero/hero.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        {/* Gentle bottom scrim so the cream card reads over the light counter. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-4 mb-14 w-full max-w-md rounded-[1.75rem] border border-white/40 bg-[#f4eee2]/85 p-7 text-center shadow-2xl backdrop-blur-xl sm:mb-20 sm:p-8">
          <h1 className="font-display text-[2.1rem] font-semibold leading-[1.1] tracking-tight text-[#2a2018] sm:text-4xl">
            Your private cannabis sommelier.
          </h1>

          <div className="mx-auto mt-4 flex items-center gap-2 text-brass/70">
            <span className="h-px w-8 bg-current opacity-50" />
            <Sparkles className="h-3.5 w-3.5" />
            <span className="h-px w-8 bg-current opacity-50" />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#5c5040]">
            Hi, I&apos;m <span className="font-medium text-[#2a2018]">SŌMA</span>,
            a professional cannabis sommelier. My job is to save you money on
            flower you were never going to love.
          </p>

          <div className="mt-7 space-y-3">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#2a2018]/20 bg-white/50 px-5 py-3.5 text-sm font-medium text-[#2a2018] transition-colors hover:bg-white/70"
            >
              <User className="h-4 w-4" />
              I already have an account
            </Link>
            <Link
              href="/onboarding/quick"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2a2018] px-5 py-3.5 text-sm font-semibold text-[#f4eee2] transition-colors hover:bg-[#3a2e1f]"
            >
              <Sparkles className="h-4 w-4 text-brass" />
              I&apos;m new — continue
            </Link>
            <a
              href="#learn-more"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium text-[#5c5040] transition-colors hover:bg-white/40"
            >
              <BookOpen className="h-4 w-4" />
              Learn more about the product
            </a>
          </div>
        </div>

        {/* Scroll hint — same destination as "Learn more". */}
        <a
          href="#learn-more"
          aria-label="Learn more"
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </section>

      {/* ── Learn more — the project, explained, for anyone who wants the
          full story before they start. ─────────────────────────────────── */}
      <section
        id="learn-more"
        className="scroll-mt-20 border-y border-border bg-card"
      >
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

      {/* Branch — for anyone who'd rather pick their own path. */}
      <section className="mx-auto max-w-editorial px-5 py-20 sm:px-8">
        <p className="font-display text-2xl font-semibold tracking-tight">
          What brought you here today?
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Primary path — most visitors are standing at a menu. */}
          <Link
            href="/taste-match"
            className="group flex flex-col rounded-2xl border border-accent bg-accent/5 p-6 text-left transition-colors hover:bg-accent/10"
          >
            <Leaf className="h-6 w-6 text-accent" />
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
              I&apos;m choosing from a menu
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              &ldquo;I have strains in front of me.&rdquo;
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Find My Flower
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/onboarding/experience"
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-accent/40"
          >
            <Heart className="h-6 w-6 text-brass" />
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
              I already know what I love
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              &ldquo;I want similar recommendations.&rdquo;
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brass">
              Build From Experience
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/onboarding/quick"
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-accent/40"
          >
            <Sprout className="h-6 w-6 text-brass" />
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
              I&apos;m new to cannabis
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              &ldquo;I need help discovering my taste.&rdquo;
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brass">
              Guide Me
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-editorial px-5 py-24 text-center sm:px-8">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight">
            Stop guessing at the counter.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Build your taste profile once. Bring SŌMA to every menu after that.
          </p>
          <div className="mt-8">
            <Link href="/onboarding/quick" className={buttonClass("primary", "lg")}>
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
