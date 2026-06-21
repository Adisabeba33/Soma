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
  Mic,
  Wand2,
  Bookmark,
  Search,
  GitCompareArrows,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { getUserIdReadOnly } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import {
  profileCompleteness,
  MATCH_GATE_PERCENT,
} from "@/lib/profile-completeness";
import { ProfileProgressRing } from "@/components/profile-progress";
import type { TasteProfileInput } from "@/lib/types";
import { STRAINS } from "@/lib/strain-data";
import { scoreStrain } from "@/lib/taste-engine";
import { getFeedbackSignals } from "@/lib/api";
import { strainSlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type TopMatch = {
  name: string;
  slug: string;
  type: string;
  score: number;
  category: string;
};

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

// The home page adapts to who's here: anonymous / first-time visitors get the
// "meet the sommelier" marketing greeting; a registered, logged-in user lands on
// their account dashboard instead — no re-running the questionnaire or login.
export default async function HomePage() {
  const userId = await getUserIdReadOnly();
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true, username: true },
      })
    : null;

  if (user?.passwordHash) {
    const profile = await prisma.tasteProfile.findFirst({
      where: { userId: userId! },
      orderBy: { updatedAt: "desc" },
    });
    const percent = profile
      ? profileCompleteness(profile as unknown as TasteProfileInput).percent
      : 0;

    // Top catalog matches for the carousel — only once the profile clears the
    // gate, so we never show a "best match" off a too-thin profile.
    let topMatches: TopMatch[] = [];
    if (profile && percent >= MATCH_GATE_PERCENT) {
      const feedback = await getFeedbackSignals(userId!);
      const p = profile as unknown as TasteProfileInput;
      topMatches = STRAINS.map((s) => {
        const m = scoreStrain(s.name, p, feedback);
        return {
          name: s.name,
          slug: strainSlug(s.name),
          type: s.type,
          score: m.matchScore,
          category: m.category,
        };
      })
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);
    }

    return (
      <LoggedInHome
        username={user.username}
        percent={percent}
        topMatches={topMatches}
      />
    );
  }

  return <AnonymousHome />;
}

// Registered users' dashboard: the deterministic engine on their saved profile,
// plus a placeholder for the conversational/voice LLM quick-pick (ships once the
// AI layer is activated — it builds a throwaway profile from a description, not
// the saved one).
function LoggedInHome({
  username,
  percent,
  topMatches,
}: {
  username: string | null;
  percent: number;
  topMatches: TopMatch[];
}) {
  const canMatch = percent >= MATCH_GATE_PERCENT;
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* Soft apothecary backdrop; frosted cards float over it. */}
      <img
        src="/hero/dashboard.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/75"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-editorial flex-1 flex-col px-5 py-12 sm:px-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brass">
          Sensory Sommelier
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome back{username ? `, @${username}` : ""}.
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-foreground/70">
          Two ways to find your flower.
        </p>

        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          {/* Element 1 — the deterministic engine on the saved profile. */}
          <div className="flex flex-col rounded-2xl border border-accent/40 bg-white/60 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-accent" />
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Taste Match
              </h2>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Score any menu against your saved sensory profile — ranked Best
              Match to Avoid, with the reasoning and the honest risks.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <ProfileProgressRing percent={percent} size={52} />
              <div className="text-sm">
                <p className="font-medium">{percent}% profile</p>
                <p className="text-muted-foreground">
                  {canMatch
                    ? "Ready to match"
                    : `Need ${MATCH_GATE_PERCENT}% to match`}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={canMatch ? "/taste-match" : "/profile"}
                className={buttonClass("primary", "md")}
              >
                {canMatch ? "Find my flower" : `Finish to ${MATCH_GATE_PERCENT}%`}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-white/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/80"
              >
                Sensory profile
              </Link>
            </div>
          </div>

          {/* Element 2 — conversational / voice LLM quick-pick (stub). */}
          <div className="relative flex flex-col rounded-2xl border border-white/55 bg-white/45 p-6 shadow-xl backdrop-blur-md">
            <span className="absolute right-4 top-4 rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Coming soon
            </span>
            <div className="flex items-center gap-3">
              <Wand2 className="h-6 w-6 text-brass" />
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Talk to SŌMA
              </h2>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              No time for the profile? Just say what you&apos;re after —
              &ldquo;something mellow for an evening film&rdquo; — and SŌMA builds
              a one-off read on the spot and picks for you. Voice &amp; AI,
              landing soon.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Mic className="h-4 w-4" />
              <span>Voice-driven, no profile needed</span>
            </div>
          </div>
        </div>

        {/* Tab bar — frosted, icon + label. */}
        <div className="mt-8">
          <nav className="flex items-center justify-around rounded-2xl border border-white/55 bg-white/55 px-2 py-2 shadow-lg backdrop-blur-md">
            <TabLink href="/compare" icon={GitCompareArrows} label="Compare" />
            <TabLink href="/catalog" icon={Search} label="Harvest" />
            <TabLink href="/saved" icon={Bookmark} label="Saved" />
            <TabLink href="/account" icon={User} label="Account" />
          </nav>
        </div>

        {/* Best matches carousel — horizontal scroll, compact frosted cards. */}
        {topMatches.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Best match for your sensory profile
            </h2>
            <div className="mt-4 -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
              {topMatches.map((m) => (
                <Link
                  key={m.slug}
                  href={`/catalog/${m.slug}`}
                  className="flex w-36 shrink-0 snap-start flex-col rounded-2xl border border-white/55 bg-white/55 p-4 shadow-md backdrop-blur-md transition-colors hover:bg-white/80 sm:w-40"
                >
                  <span className="text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {m.type}
                  </span>
                  <span className="mt-1 line-clamp-2 font-display text-sm font-semibold leading-tight tracking-tight">
                    {m.name}
                  </span>
                  <span className="mt-4 font-display text-2xl font-semibold text-accent">
                    {m.score}%
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">
                    {m.category}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

function TabLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Leaf;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="h-5 w-5" />
      <span className="text-[0.7rem] font-medium">{label}</span>
    </Link>
  );
}

function AnonymousHome() {
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
            Your personal cannabis sommelier.
          </h1>

          <div className="mt-4 flex items-center justify-center gap-2 text-brass/70">
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
