import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-editorial px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-semibold">SŌMA</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A sensory sommelier for cannabis. SŌMA matches flower to your
              personal taste — it is not a strain encyclopedia.
            </p>
          </div>
          <nav className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Product
              </span>
              <Link href="/taste-match" className="hover:text-accent">
                Taste Match
              </Link>
              <Link href="/compare" className="hover:text-accent">
                Compare
              </Link>
              <Link href="/catalog" className="hover:text-accent">
                Harvest
              </Link>
              <Link href="/profile" className="hover:text-accent">
                My Profile
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                More
              </span>
              <Link href="/learn" className="hover:text-accent">
                Learn
              </Link>
              <Link href="/saved" className="hover:text-accent">
                History
              </Link>
              <Link href="/about" className="hover:text-accent">
                About
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Legal
              </span>
              <Link href="/privacy" className="hover:text-accent">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent">
                Terms
              </Link>
            </div>
          </nav>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            SŌMA provides sensory guidance, not a guarantee. Real quality
            depends on grower, freshness, packaging date and storage. For use
            by adults 21+ where legal. Consume responsibly.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} SŌMA</p>
        </div>
      </div>
    </footer>
  );
}
