import Link from "next/link";
import { labelFor } from "@/lib/vocab";
import { ProfileContradictionBanner } from "@/components/profile-contradiction-banner";
import type { ProfileContradiction } from "@/lib/profile-contradictions";
import type { TasteProfileState } from "@/lib/profile-state";

function Row({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{values.join(", ")}</span>
    </div>
  );
}

export function TasteProfileSummary({
  state,
  showEdit = true,
  contradictions = [],
}: {
  state: TasteProfileState;
  showEdit?: boolean;
  contradictions?: ProfileContradiction[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">
          Your taste profile
        </h3>
        {showEdit && (
          <Link
            href="/profile"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Edit
          </Link>
        )}
      </div>
      <div className="mt-3 space-y-2">
        <Row label="Favourites" values={state.favoriteStrains} />
        <Row
          label="Aromas"
          values={state.preferredAromas.map(labelFor)}
        />
        <Row
          label="Effects"
          values={state.preferredEffects.map(labelFor)}
        />
        <Row label="Likes" values={state.likedTraits.map(labelFor)} />
        <Row
          label="Avoids"
          values={state.dislikedTraits.map(labelFor)}
        />
        <Row
          label="Goal"
          values={[
            state.lookingFor === "new"
              ? "Exploring nearby"
              : "Replacing a favourite",
          ]}
        />
      </div>
      <ProfileContradictionBanner contradictions={contradictions} compact />
    </div>
  );
}
