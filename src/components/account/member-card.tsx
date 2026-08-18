import { BotanicalSprig } from "@/components/botanical";

// The lounge's first block: who this member is, since when, and the three
// numbers that describe their setup. Every value is passed in from live
// account data — there is no decorative placeholder here.
export function MemberCard({
  username,
  memberSince,
  profileCount,
  activeCount,
  blendScore,
}: {
  username: string | null;
  /** Pre-formatted "June 2026", or null while unknown. */
  memberSince: string | null;
  profileCount: number;
  activeCount: number;
  /** Mean completeness of the profiles currently driving matches. */
  blendScore: number;
}) {
  const monogram = (username?.trim()?.[0] ?? "S").toUpperCase();

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-brass/20 p-6 sm:p-7"
      style={{
        background:
          "linear-gradient(145deg, hsl(var(--accent)) 0%, hsl(var(--accent-deep)) 62%, hsl(var(--accent-deep)) 100%)",
      }}
    >
      {/* Texture, not illustration — barely there behind the identity. */}
      <BotanicalSprig className="pointer-events-none absolute -right-6 top-2 w-40 text-brass/[0.14] sm:right-4 sm:w-48" />

      <div className="relative flex items-center gap-4 sm:gap-5">
        <span
          aria-hidden
          className="grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-full border border-brass/60 font-display text-3xl font-medium text-brass"
          style={{ background: "hsl(var(--accent-deep))" }}
        >
          {monogram}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
            {username ? `@${username}` : "Member"}
          </h2>
          <p className="mt-0.5 text-sm text-brass">Private Lounge Member</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Member since{" "}
            <span className="text-foreground/80">{memberSince ?? "—"}</span>
          </p>
        </div>
      </div>

      <dl className="relative mt-6 grid grid-cols-3 divide-x divide-brass/20 rounded-2xl border border-brass/20 py-4">
        <Stat label="Profiles" value={profileCount} />
        <Stat label="Active" value={activeCount} />
        <Stat
          label="Blend score"
          value={blendScore}
          title="How complete the profiles currently driving your matches are."
        />
      </dl>
    </section>
  );
}

function Stat({
  label,
  value,
  title,
}: {
  label: string;
  value: number;
  title?: string;
}) {
  return (
    <div className="px-2 text-center" title={title}>
      <dd className="font-display text-2xl font-semibold leading-none text-foreground">
        {value}
      </dd>
      <dt className="mt-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:text-[10px] sm:tracking-[0.16em]">
        {label}
      </dt>
    </div>
  );
}
