import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Mail } from "lucide-react";
import { LoungePage } from "@/components/account/lounge-page";
import { IconTile } from "@/components/ui/icon-tile";

export const metadata = { title: "Help & support — SŌMA" };

// Support is a person at an inbox, plus the pages that answer most
// questions before one needs writing. Everything here points at something
// that already exists.
const SUPPORT_EMAIL = "Somasensory@somasensory.com";

const READS = [
  {
    href: "/how-it-works",
    title: "How SŌMA reads a menu",
    body: "What the score means, why a strain is a Best Match or an Avoid, and what SŌMA can't know about the jar in front of you.",
    Icon: Compass,
  },
  {
    href: "/learn",
    title: "Learn",
    body: "Aroma families, effects and the vocabulary SŌMA scores in — the background behind your profile.",
    Icon: BookOpen,
  },
];

export default function AccountHelpPage() {
  return (
    <LoungePage
      eyebrow="Help & support"
      title="Get help when you need it"
      intro="Something not behaving, or a question the app doesn't answer? Write to us — a person reads it."
    >
      <section className="mt-8 rounded-3xl border border-brass/25 bg-card p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <IconTile Icon={Mail} />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Email support
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Tell us what you were doing and what happened. If it&apos;s about
              a specific match, the strain name helps.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 break-all text-sm font-medium text-brass transition-colors hover:text-foreground"
            >
              {SUPPORT_EMAIL}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {READS.map(({ href, title, body, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-[background-color,border-color] duration-200 ease-out hover:border-brass/30 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0 text-brass"
              strokeWidth={1.6}
              aria-hidden
            />
            <div className="min-w-0">
              <h2 className="font-medium text-foreground">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
            <ArrowRight
              className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden
            />
          </Link>
        ))}
      </section>
    </LoungePage>
  );
}
