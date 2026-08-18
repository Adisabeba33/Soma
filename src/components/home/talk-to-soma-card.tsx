import { Mic, Wand2 } from "lucide-react";
import { IconTile } from "@/components/ui/icon-tile";

// The conversational quick-pick, not yet built. Deliberately quieter than
// Taste Match and deliberately inert: no link, no button, no pretence of
// working. It states what it will do and that it is not here yet.
export function TalkToSomaCard() {
  return (
    <section
      aria-label="Talk to SŌMA — coming soon"
      className="rounded-3xl border border-border bg-muted/50 p-6 sm:p-7"
    >
      <div className="flex items-center gap-3">
        <IconTile
          Icon={Wand2}
          className="border-border bg-card text-muted-foreground"
        />
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground/75">
            Talk to SŌMA
          </h2>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Coming soon
          </p>
        </div>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
        No time for the profile? Just say what you&apos;re after —
        &ldquo;something mellow for an evening film&rdquo; — and SŌMA builds a
        one-off read on the spot and picks for you.
      </p>

      <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
        <Mic className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
        Voice-driven, no profile needed
      </p>
    </section>
  );
}
