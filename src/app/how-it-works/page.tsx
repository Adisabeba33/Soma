import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { buttonClass } from "@/components/ui/button";

export const metadata = {
  title: "How SŌMA works — reading your matches",
  description:
    "What your match score means, how SŌMA thinks about taste, and why rating your picks makes it sharper — in plain language.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/how-it-works" },
};

// The score bands, high → low. Ranges track the engine's real categories;
// copy is deliberately plain-language for everyday readers.
const BANDS: {
  range: string;
  name: string;
  blurb: string;
  tone: string;
  dot: string;
}[] = [
  {
    range: "94–96",
    name: "Your anchors",
    blurb:
      "Strains you've told us you love. As close as it gets — we never go higher, because no two jars are ever identical.",
    tone: "border-accent/40 bg-accent/5",
    dot: "bg-accent",
  },
  {
    range: "80–92",
    name: "Best Match",
    blurb:
      "A really strong fit for your taste. If the flower itself is fresh and well grown, this is worth your money.",
    tone: "border-accent/30 bg-accent/5",
    dot: "bg-accent",
  },
  {
    range: "66–79",
    name: "Closest Alternative",
    blurb:
      "Not a bullseye, but close. The smart pick when your usual isn't on the menu.",
    tone: "border-brass/40 bg-brass/5",
    dot: "bg-brass",
  },
  {
    range: "50–65",
    name: "Worth Trying",
    blurb:
      "There's a lean here. Right on some things, off on others — a maybe, not a yes.",
    tone: "border-border bg-card",
    dot: "bg-muted-foreground",
  },
  {
    range: "36–49",
    name: "Risky",
    blurb:
      "Mostly not your thing, or it clashes with something you said you avoid.",
    tone: "border-[#a23b2c]/25 bg-[#a23b2c]/5",
    dot: "bg-[#a23b2c]/70",
  },
  {
    range: "Under 36",
    name: "Avoid",
    blurb: "Wrong direction for you. SŌMA would rather be honest than polite.",
    tone: "border-[#a23b2c]/30 bg-[#a23b2c]/5",
    dot: "bg-[#a23b2c]",
  },
];

const THINKS: { title: string; body: string }[] = [
  {
    title: "It learns your taste first",
    body: "You tell SŌMA what you like — the smells, the flavours, the kind of high you're after, the strains you already love. That's the yardstick everything is measured against.",
  },
  {
    title: "It weighs the vibe most",
    body: "The effect — relaxed, clear-headed, sleepy, social — matters most, because it's what you actually feel. A strain that smells perfect but does the opposite of what you want won't score well.",
  },
  {
    title: "It checks the smell & taste",
    body: "Does the nose and the flavour line up with what you enjoy? For cannabis, smell and taste come from the same place, so SŌMA treats them together.",
  },
  {
    title: "It leans on what you already love",
    body: "The closer a strain sits to your saved favourites, the more SŌMA trusts it. Your lived experience is the strongest signal there is.",
  },
  {
    title: "It shows its work",
    body: "Every score can be opened up and explained — what matched, what was missing, what pulled it down. No black box, no hand-waving.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <BackButton fallbackHref="/" label="Back" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground" />
      <p className="text-xs uppercase tracking-[0.24em] text-brass">
        How it works
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Reading your matches
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        SŌMA is like a friend who happens to remember every strain and exactly
        what you like — then tells you, honestly, which ones are worth your
        money. Here's how to read what it gives you, and the one thing that
        makes it smarter every time you use it.
      </p>

      {/* The scale */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          What the score means
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Every pick gets a score out of 100 — but here's the important part:{" "}
          <span className="font-medium text-foreground">
            the score is about you, not about how good the strain is in general.
          </span>{" "}
          A famous, excellent strain can score in the 60s for you simply because
          its effect or character isn't what you asked for. That's SŌMA being
          honest, not wrong.
        </p>

        <div className="mt-8 space-y-3">
          {BANDS.map((b) => (
            <div
              key={b.name}
              className={`flex gap-4 rounded-2xl border p-4 ${b.tone}`}
            >
              <div className="flex w-16 shrink-0 flex-col items-center justify-center text-center">
                <span className={`h-2.5 w-2.5 rounded-full ${b.dot}`} />
                <span className="mt-1.5 font-mono text-xs font-semibold tabular-nums">
                  {b.range}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-semibold tracking-tight">
                  {b.name}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {b.blurb}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Your own saved favourites sit right at the top (94–96) — never a
          perfect 100, because grower, freshness and storage can always surprise
          you. The strongest non-favourites cluster just below, so the best
          alternatives stay in order instead of all bunching at one number.
        </p>
      </section>

      {/* How it thinks */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          How SŌMA thinks
        </h2>
        <div className="mt-6 space-y-5">
          {THINKS.map((t, i) => (
            <div key={t.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brass/10 font-display text-sm font-semibold text-brass">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-medium">{t.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {t.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profile depth — why honest, complete answers matter */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">
          Where the accuracy comes from
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          The more honestly you fill your profile, the sharper the picks
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          SŌMA can only be as precise as what you tell it. It's not about
          answering <em>more</em> questions — it's about answering them{" "}
          <span className="font-medium text-foreground">
            honestly and specifically
          </span>
          . Pick the aromas you actually chase, the effects you're really after,
          and — just as important — the things that ruin a session for you.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-medium text-foreground">
              A thin profile → everything looks similar
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If you only say “I like sweet and relaxed,” half the menu fits
              that — so half the menu scores about the same and the results
              bunch into a cluster of near-identical numbers. There's nothing
              for the engine to separate them by.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <p className="font-medium text-accent">
              A thorough profile → a real ranking
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Add the nose you reach for, the family you skip, the heads you
              hate (racy, foggy), the textures you like — and strains start
              pulling apart. Your dislikes do half the work: they push the wrong
              flower <em>down</em>, so the right flower stands out.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-brass/30 bg-brass/[0.06] p-6">
          <p className="font-display text-lg font-semibold tracking-tight text-brass">
            Want to see the level? Look at the quick-start profiles.
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            The one-tap presets (Gas Head, Citrus Lift, Dessert &amp; Cream…)
            aren't just a couple of favourites — each one carries its aromas and
            flavours, the effects it wants, the aromas and families it avoids,
            the risks to steer clear of, and the texture and quality it cares
            about. That's the depth that makes a ranking meaningful. Two or
            three real favourites is plenty —{" "}
            <span className="font-medium text-foreground">
              depth comes from the rest of the answers, not a long list of
              strains
            </span>
            . Start from a preset and adjust it, or fill the full questionnaire;
            either way, the more of <em>you</em> that's in there, the better the
            match.
          </p>
        </div>
      </section>

      {/* Honest caveat */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          One honest thing: it reads the menu, not the jar
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          SŌMA can tell you a strain <em>should</em> suit your taste on paper.
          What it can't do is smell the actual flower in front of you, see how
          fresh it is, or know how it was grown — and those make a real
          difference. The same strain can be wonderful from one grower and flat
          from another.
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          So read a high score as{" "}
          <span className="font-medium text-foreground">
            “worth a serious look,”
          </span>{" "}
          not a guarantee. A great budtender judges the bud in the jar; SŌMA
          judges the name on the menu and your taste. Different jobs — and we'd
          rather be upfront about it than pretend.
        </p>
      </section>

      {/* Feedback — the big one */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">
          The part that matters most
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          It gets sharper every time you rate a pick
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          This is your engine. The single thing that makes it better isn't more
          data about strains — it's <span className="font-medium text-foreground">your feedback on the picks it gives you.</span>{" "}
          After a recommendation, tell it how it actually landed:
          loved it, liked it, meh, or nope. That one tap teaches SŌMA your{" "}
          <em>real</em> taste, not the marketing on the jar.
        </p>

        <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <p className="font-display text-lg font-semibold tracking-tight text-accent">
            A miss isn't a failure — it's the engine learning.
          </p>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Even a great human sommelier guesses wrong sometimes — that's
            exactly how they figure out what you actually like and stop putting
            the wrong thing in front of you. Every “not for me” you log does the
            same here: it tunes the next round, so SŌMA earns the hits by
            learning from the misses.
          </p>
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">
          The more you rate, the fewer close-call ties, the more confident the
          picks — and all of it is tuned to you and nobody else. Rate the
          recommendations, not just the strains: it's the feedback on the{" "}
          <span className="font-medium text-foreground">picks SŌMA made</span>{" "}
          that closes the loop.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/taste-match" className={buttonClass("primary", "md")}>
            Run a Taste Match
          </Link>
          <Link href="/saved" className={buttonClass("outline", "md")}>
            See your history
          </Link>
        </div>
      </section>

      <p className="mt-16 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
        SŌMA gives sensory guidance, not a guarantee — real quality still
        depends on the grower, freshness, packaging date and storage. For adults
        21+ where legal.
      </p>
    </div>
  );
}

