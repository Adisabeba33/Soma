import { Info } from "lucide-react";
import type { ProfileContradiction } from "@/lib/profile-contradictions";

// Honest, non-blocking inline note. Renders nothing when there are no
// contradictions. Tone is informational — this is not an error or a
// validation failure, it's transparency about what the engine read.
export function ProfileContradictionBanner({
  contradictions,
  compact = false,
}: {
  contradictions: ProfileContradiction[];
  compact?: boolean;
}) {
  if (contradictions.length === 0) return null;

  if (compact) {
    // Tight one-liner for the profile summary card.
    return (
      <p className="mt-3 flex items-start gap-2 rounded-lg bg-brass/10 px-3 py-2 text-xs leading-relaxed text-foreground/80">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
        <span>
          Engine reconciled {contradictions.length} contradiction
          {contradictions.length === 1 ? "" : "s"} in your profile —{" "}
          {contradictions.map((c) => `“${c.trigger}”`).join(", ")} silenced
          because your favourites already carry it.
        </span>
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-brass/30 bg-brass/5 p-4">
      <div className="flex items-start gap-2">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
        <p className="text-sm font-medium text-foreground">
          We noticed{" "}
          {contradictions.length === 1
            ? "a contradiction"
            : `${contradictions.length} contradictions`}{" "}
          in your profile
        </p>
      </div>
      <ul className="mt-3 space-y-3">
        {contradictions.map((c) => (
          <li
            key={c.trigger}
            className="rounded-lg bg-background/60 p-3 text-sm leading-relaxed"
          >
            <p className="text-foreground">{c.description}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {c.resolution}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
