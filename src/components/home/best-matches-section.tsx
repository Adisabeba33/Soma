import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StrainMatchCard } from "@/components/home/strain-match-card";
import type { TopMatch } from "@/lib/top-matches";

// The member's own shelf preview — the engine's highest-scoring strains for
// their current profile or blend. Renders nothing when the profile isn't
// ready to match; an empty strip would be a promise SŌMA can't keep yet.
export function BestMatchesSection({ matches }: { matches: TopMatch[] }) {
  if (matches.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="best-matches-heading">
      <div className="flex items-center justify-between gap-4">
        <SectionEyebrow>Your collection</SectionEyebrow>
        <Link
          href="/catalog"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          See all
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <h2
        id="best-matches-heading"
        className="mt-2 font-display text-[1.5rem] font-semibold leading-tight tracking-tight sm:text-[1.75rem]"
      >
        Best matches for your taste
      </h2>

      {/* Horizontal shelf: cards are sized so the next one always peeks in,
          which is what tells a thumb there is more to the right. */}
      <ul className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
        {matches.map((m) => (
          <StrainMatchCard key={m.slug} match={m} />
        ))}
      </ul>
    </section>
  );
}
