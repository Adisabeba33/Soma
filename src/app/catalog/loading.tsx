// Shown by Next.js INSTANTLY when /catalog is requested, while the server is
// still building the page (cold-start cost, profile lookup, match scoring).
// Without this the user clicks "Harvest" and stares at the previous page or a
// blank screen for several seconds — looks like the app froze. The skeleton
// mirrors the real page header so the transition feels seamless when the
// real content arrives.
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Harvest</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        What SŌMA knows
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        The full curated reference set the Taste Match Engine reads from.
      </p>

      {/* Animated brass progress mark — pulses gently so the user knows the
          page is still working, not frozen. */}
      <div
        role="status"
        aria-label="Loading the catalog"
        className="mt-16 flex flex-col items-center gap-4"
      >
        <span
          className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-brass/25 border-t-brass"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">
          Tuning the harvest to your taste…
        </p>
      </div>

      {/* Faint placeholder cards so the layout doesn't snap when content lands. */}
      <ul
        aria-hidden
        className="mt-10 space-y-3 opacity-50"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-border bg-card/40"
          />
        ))}
      </ul>
    </div>
  );
}
