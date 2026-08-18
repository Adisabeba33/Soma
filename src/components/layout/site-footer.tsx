import Link from "next/link";
import { BotanicalSprig } from "@/components/botanical";

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
    <footer className="relative overflow-hidden border-t border-border bg-muted/45">
      {/* Faint engraving in the corner — the only decoration down here. */}
      <BotanicalSprig className="pointer-events-none absolute -bottom-4 right-2 w-40 text-accent/[0.06] sm:right-10 sm:w-56" />
      <div className="relative mx-auto max-w-editorial px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-14">
          <div className="max-w-xs">
            <p className="font-display text-xl font-medium tracking-[0.06em] text-foreground">
              SŌMA
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              A sensory sommelier for cannabis — flower matched to your taste,
              not an encyclopedia.
            </p>
          </div>
          {/* Three columns hold from 320px: equal tracks, tight gaps. */}
          <nav className="grid grid-cols-3 gap-x-4 gap-y-8 sm:flex sm:gap-14">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex min-w-0 flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brass">
                  {col.heading}
                </span>
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-1.5 border-t border-border pt-6 text-[11px] leading-relaxed text-muted-foreground/75">
          <p className="max-w-xl">
            SŌMA is an educational resource for the sensory qualities of
            cannabis — aroma, flavor and effect. We do not sell cannabis, are
            not affiliated with any dispensary or retailer, and do not direct
            anyone where to buy. Sensory guidance only, not a guarantee — real
            quality depends on grower, freshness and storage. Nothing here is
            medical or legal advice. For adults 21+ where cannabis is legal.
          </p>
          <p>© {new Date().getFullYear()} SŌMA</p>
        </div>
      </div>
    </footer>
  );
}
