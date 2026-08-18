"use client";

import Link from "next/link";
import {
  EllipsisVertical,
  Layers,
  Pencil,
  PenLine,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { profileEmblem } from "@/components/aroma-icon";
import { labelFor } from "@/lib/vocab";
import { cn } from "@/lib/utils";

export type ProfileItem = {
  id: string;
  name: string;
  isActive: boolean;
  merged: boolean;
  percent: number;
  // Matching readiness from the API — the gate for activate/merge/use.
  ready: boolean;
  topAromas: string[];
  topEffects: string[];
};

// The member's taste profiles: create, switch, merge, rename, delete. The
// behaviour is unchanged from the original account page — this is the same
// machinery wearing the lounge's palette, extracted so the page itself
// stays readable.
export function ProfilesSection({
  profiles,
  limit,
  openMenuId,
  onOpenMenu,
  onAdd,
  onActivate,
  onToggleMerge,
  onRename,
  onRemove,
}: {
  profiles: ProfileItem[];
  limit: number;
  openMenuId: string | null;
  onOpenMenu: (id: string | null) => void;
  onAdd: () => void;
  onActivate: (id: string) => void;
  onToggleMerge: (id: string, on: boolean) => void;
  onRename: (id: string, current: string) => void;
  onRemove: (id: string, name: string) => void;
}) {
  const mergedCount = profiles.filter((p) => p.merged).length;

  return (
    <section id="profiles" className="mt-12 scroll-mt-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionEyebrow>Sensory profiles</SectionEyebrow>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Each profile defines what SŌMA searches under. Switch or merge
            anytime.
          </p>
        </div>
        {profiles.length < limit && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-medium transition-colors duration-200 ease-out hover:border-brass/40 hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add profile
          </button>
        )}
      </div>

      {mergedCount > 0 && (
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brass/25 bg-brass/10 px-3 py-1.5 text-xs text-brass">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          {mergedCount >= 2
            ? `${mergedCount} profiles merged — Harvest is blending them now.`
            : "1 profile merged — add one more to start blending."}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {profiles.map((p, idx) => (
          <ProfileCard
            key={p.id}
            profile={p}
            index={idx}
            canDelete={profiles.length > 1}
            menuOpen={openMenuId === p.id}
            onOpenMenu={onOpenMenu}
            onActivate={onActivate}
            onToggleMerge={onToggleMerge}
            onRename={onRename}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}

function ProfileCard({
  profile: p,
  index,
  canDelete,
  menuOpen,
  onOpenMenu,
  onActivate,
  onToggleMerge,
  onRename,
  onRemove,
}: {
  profile: ProfileItem;
  index: number;
  canDelete: boolean;
  menuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onActivate: (id: string) => void;
  onToggleMerge: (id: string, on: boolean) => void;
  onRename: (id: string, current: string) => void;
  onRemove: (id: string, name: string) => void;
}) {
  const Emblem = profileEmblem(p.topAromas, p.topEffects);
  const act =
    "inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium";

  const actions: React.ReactNode[] = [];
  if (!p.isActive) {
    actions.push(
      p.ready ? (
        <button
          key="activate"
          type="button"
          onClick={() => onActivate(p.id)}
          className={cn(act, "text-brass hover:text-foreground")}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Set active
        </button>
      ) : (
        <span key="finish" className={cn(act, "text-muted-foreground")}>
          Needs core answers
        </span>
      ),
    );
  }
  if (p.ready) {
    actions.push(
      <button
        key="merge"
        type="button"
        onClick={() => onToggleMerge(p.id, !p.merged)}
        className={cn(
          act,
          p.merged ? "text-brass" : "text-foreground hover:text-brass",
        )}
      >
        <Layers className="h-3.5 w-3.5" aria-hidden />
        {p.merged ? "Unmerge" : "Merge"}
      </button>,
    );
  }
  actions.push(
    <button
      key="rename"
      type="button"
      onClick={() => onRename(p.id, p.name)}
      className={cn(act, "text-foreground hover:text-brass")}
    >
      <PenLine className="h-3.5 w-3.5" aria-hidden /> Rename
    </button>,
  );
  if (canDelete) {
    actions.push(
      <button
        key="delete"
        type="button"
        onClick={() => onRemove(p.id, p.name)}
        className={cn(act, "text-danger hover:opacity-80")}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
      </button>,
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card p-5",
        p.isActive ? "border-brass/45" : "border-border",
      )}
    >
      <div className="mb-3 flex items-center justify-end gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
          Profile {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative">
          <button
            type="button"
            aria-label={`Profile menu for ${p.name}`}
            aria-expanded={menuOpen}
            onClick={() => onOpenMenu(menuOpen ? null : p.id)}
            className="-mr-1 grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-surface-hover hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <EllipsisVertical className="h-4 w-4" aria-hidden />
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => onOpenMenu(null)}
              />
              <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-[0_20px_44px_-18px_rgba(0,0,0,0.7)]">
                <Link
                  href={`/profile?id=${p.id}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surface-hover hover:text-brass"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit details
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onOpenMenu(null);
                    onRename(p.id, p.name);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-surface-hover hover:text-brass"
                >
                  <PenLine className="h-3.5 w-3.5" aria-hidden /> Rename
                </button>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenMenu(null);
                      onRemove(p.id, p.name);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ScoreRing
          value={p.percent}
          size={58}
          showSuffix={false}
          label={`${p.name} completeness`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <Emblem
              className="h-[22px] w-[22px] shrink-0 text-brass"
              strokeWidth={1.8}
            />
            <Link
              href={`/profile?id=${p.id}`}
              className="truncate font-display text-lg font-semibold tracking-tight transition-colors hover:text-brass"
            >
              {p.name}
            </Link>
            {p.isActive && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brass px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                Active
              </span>
            )}
            {p.merged && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brass/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-brass">
                <Layers className="h-3 w-3" aria-hidden /> Merged
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {p.ready
              ? `${p.percent}% complete`
              : `${p.percent}% — add the core answers to use`}
          </p>
        </div>
      </div>

      {(p.topAromas.length > 0 || p.topEffects.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.topAromas.map((a) => (
            <span
              key={`a-${a}`}
              className="rounded-full bg-brass/10 px-2.5 py-1 text-xs font-medium text-brass"
            >
              {labelFor(a)}
            </span>
          ))}
          {p.topEffects.map((e) => (
            <span
              key={`e-${e}`}
              className="rounded-full px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border"
            >
              {labelFor(e)}
            </span>
          ))}
        </div>
      )}

      {/* Actions wrap instead of squeezing: at 320px four of them no longer
          fit on one line, and a row that overflows the card would make the
          whole page scroll sideways. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 border-t border-border pt-1 text-sm">
        {actions}
      </div>
    </div>
  );
}
