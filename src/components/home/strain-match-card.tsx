import Link from "next/link";
import type { TopMatch } from "@/lib/top-matches";

// One strain in the collection strip: artwork first, then the facts that
// decide a tap — name, type, the three sensory words that define it, and
// how it scored against this member's profile.
//
// Every value comes from the recommendation engine (src/lib/top-matches.ts);
// nothing here is styling-only copy.
export function StrainMatchCard({ match }: { match: TopMatch }) {
  return (
    <li className="w-[10.5rem] shrink-0 snap-start sm:w-48">
      <Link
        href={`/catalog/${match.slug}`}
        className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-24px_rgba(23,24,21,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {match.img ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={match.img}
              alt={`${match.name} — SŌMA artwork`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: match.focus }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: match.bg }}
              aria-hidden
            />
          )}
          <span className="absolute right-2 top-2 rounded-full bg-accent-deep/90 px-2 py-0.5 font-display text-xs font-semibold text-accent-foreground backdrop-blur-sm">
            {match.score}%
          </span>
        </div>

        <div className="p-3">
          <p className="line-clamp-2 font-display text-[0.95rem] font-semibold leading-tight tracking-tight">
            {match.name}
          </p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
            {match.type}
          </p>
          {match.descriptors.length > 0 && (
            <p className="mt-2 line-clamp-2 text-[0.7rem] leading-snug text-muted-foreground">
              {match.descriptors.join(" · ")}
            </p>
          )}
          <span className="mt-2.5 inline-flex rounded-full border border-brass/35 px-2 py-0.5 text-[0.62rem] font-medium text-brass">
            {match.status}
          </span>
        </div>
      </Link>
    </li>
  );
}
