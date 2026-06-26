import Link from "next/link";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/taste-match", label: "Taste Match" },
      { href: "/compare", label: "Compare" },
      { href: "/catalog", label: "Harvest" },
      { href: "/profile", label: "My Profile" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/learn", label: "Learn" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/saved", label: "History" },
      { href: "/about", label: "About" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-lg font-medium tracking-tight text-foreground/90">
              SŌMA
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground/80">
              A sensory sommelier for cannabis — flower matched to your taste,
              not an encyclopedia.
            </p>
          </div>
          <nav className="flex gap-10 sm:gap-14">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
                  {col.heading}
                </span>
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-[13px] text-muted-foreground/85 transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-1.5 border-t border-border/50 pt-6 text-[11px] leading-relaxed text-muted-foreground/60">
          <p className="max-w-xl">
            SŌMA provides sensory guidance, not a guarantee. Real quality
            depends on grower, freshness and storage. For use by adults 21+
            where legal.
          </p>
          <p>© {new Date().getFullYear()} SŌMA</p>
        </div>
      </div>
    </footer>
  );
}
