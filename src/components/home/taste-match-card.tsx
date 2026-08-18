import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { ScoreRing } from "@/components/ui/score-ring";
import { IconTile } from "@/components/ui/icon-tile";

// The primary action on Home. Everything else on the screen is quieter than
// this card by design: it carries the icon, the promise, the live state of
// the member's profile, and the one button that starts a run.
export function TasteMatchCard({
  percent,
  ready,
}: {
  /** Real profile completeness (src/lib/profile-completeness.ts). */
  percent: number;
  /** Real matching readiness — the gate, not the percentage. */
  ready: boolean;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_18px_40px_-32px_rgba(23,24,21,0.55)] sm:p-7">
      <div className="flex items-center gap-3">
        <IconTile Icon={Leaf} />
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Taste Match
        </h2>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
        Score any menu against your saved sensory profile — ranked Best Match
        to Avoid, with the reasoning and the honest risks.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <ScoreRing value={percent} size={76} label="Profile completeness" />
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold tracking-tight">
            {percent}% profile
          </p>
          <p className="text-sm text-muted-foreground">
            {ready ? "Ready to match" : "Core answers needed"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {/* Both stay on one line down to 320px: the row is the CTA, and a
            wrapped button reads as a mistake. */}
        <Link
          href={ready ? "/taste-match" : "/profile"}
          className={buttonClass(
            "primary",
            "lg",
            "flex-[1.2] whitespace-nowrap px-3.5 text-sm sm:flex-none sm:px-7",
          )}
        >
          {ready ? "Find my flower" : "Finish my profile"}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <Link
          href="/profile"
          className={buttonClass(
            "outline",
            "lg",
            "flex-1 whitespace-nowrap px-3.5 text-sm sm:flex-none sm:px-7",
          )}
        >
          Sensory profile
        </Link>
      </div>
    </section>
  );
}
