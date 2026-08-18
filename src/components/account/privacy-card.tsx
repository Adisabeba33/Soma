import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BotanicalSprig } from "@/components/botanical";

// A statement, not a navigation row — which is why it looks nothing like
// the grid above it. It says what SŌMA promises about the member's data and
// links to the policy that spells it out.
export function PrivacyCard() {
  return (
    <section
      className="relative mt-8 overflow-hidden rounded-3xl border border-brass/20 p-6 sm:p-7"
      style={{
        background:
          "linear-gradient(145deg, hsl(var(--accent)) 0%, hsl(var(--accent-deep)) 70%)",
      }}
    >
      <BotanicalSprig className="pointer-events-none absolute -left-8 -top-4 w-40 text-brass/[0.13]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <span
          aria-hidden
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-brass/40 text-brass"
          style={{ background: "hsl(var(--accent-deep))" }}
        >
          <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Private by design
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Your taste, your data, your rules. Always private. Always yours.
          </p>
        </div>

        <Link
          href="/privacy"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-brass/45 px-5 text-sm font-medium text-brass transition-colors duration-200 ease-out hover:bg-brass/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Learn more
        </Link>
      </div>
    </section>
  );
}
