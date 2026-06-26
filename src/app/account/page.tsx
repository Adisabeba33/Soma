"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  History,
  Layers,
  LayoutGrid,
  Lock,
  Pencil,
  PenLine,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { TasteBlenderBlock } from "@/components/taste-blender-block";
import { ProfileSimilarityHint } from "@/components/profile-similarity-hint";
import { labelFor } from "@/lib/vocab";
import { MATCH_GATE_PERCENT } from "@/lib/profile-completeness";
import { cn } from "@/lib/utils";

// Premium card surface, shared across the dossier.
const CARD =
  "soma-lift rounded-[1.75rem] border border-border/70 bg-card shadow-[0_28px_60px_-42px_rgba(60,45,20,0.45)] hover:shadow-[0_34px_70px_-40px_rgba(60,45,20,0.55)]";

type Me = {
  registered: boolean;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
  createdAt: string | null;
};

type ProfileItem = {
  id: string;
  name: string;
  isActive: boolean;
  merged: boolean;
  percent: number;
  topAromas: string[];
  topEffects: string[];
};

type Discovery = { name: string; slug: string; score: number };

// A thin brass completeness ring.
function Ring({ percent, size = 64 }: { percent: number; size?: number }) {
  const deg = Math.max(0, Math.min(100, percent)) * 3.6;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(hsl(var(--brass)) ${deg}deg, hsl(var(--border)) ${deg}deg)`,
        }}
      />
      <div className="absolute inset-[4px] flex flex-col items-center justify-center rounded-full bg-card">
        <span className="font-display font-semibold leading-none" style={{ fontSize: size * 0.28 }}>
          {percent}
        </span>
        <span className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">
          %
        </span>
      </div>
    </div>
  );
}

function AromaChip({ token }: { token: string }) {
  return (
    <span className="rounded-full bg-brass/10 px-2.5 py-1 text-xs font-medium text-brass">
      {labelFor(token)}
    </span>
  );
}
function EffectChip({ token }: { token: string }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-border">
      {labelFor(token)}
    </span>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [limit, setLimit] = useState(3);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadProfiles() {
    const d = await fetch("/api/profiles")
      .then((r) => r.json())
      .catch(() => null);
    if (d?.profiles) {
      setProfiles(d.profiles);
      if (typeof d.limit === "number") setLimit(d.limit);
    }
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe(null));
    loadProfiles();
    fetch("/api/discoveries")
      .then((r) => r.json())
      .then((d) => setDiscoveries(Array.isArray(d?.matches) ? d.matches : []))
      .catch(() => {});
  }, []);

  async function addProfile() {
    const name = newName.trim();
    if (!name) return;
    setBusy(true);
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (res.ok) {
      const p = await res.json();
      setAdding(false);
      setNewName("");
      router.push(`/profile?id=${p.id}`);
    } else {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Couldn't create the profile.");
    }
  }

  async function renameProfile(id: string, current: string) {
    const name = window.prompt("Rename profile", current);
    if (name == null || !name.trim()) return;
    await fetch(`/api/profiles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename", name: name.trim() }),
    });
    loadProfiles();
  }

  async function activateProfile(id: string) {
    const res = await fetch(`/api/profiles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "activate" }),
    });
    if (res.ok) {
      await loadProfiles();
      router.refresh();
    } else {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Couldn't activate that profile.");
    }
  }

  async function toggleMerge(id: string, on: boolean) {
    const res = await fetch(`/api/profiles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "merge", on }),
    });
    if (res.ok) {
      await loadProfiles();
      router.refresh();
    } else {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Couldn't update the merge.");
    }
  }

  async function removeProfile(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    loadProfiles();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await fetch("/api/auth/delete-account", { method: "POST" });
      router.refresh();
      router.push("/");
    } catch {
      setDeleting(false);
    }
  }

  if (!me) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!me.registered) {
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">Account</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Your dossier
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          You&apos;re browsing anonymously — your taste profile and history are
          saved on this device. Create an account to keep them across devices
          and claim a member name.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup" className={buttonClass("primary", "md")}>
            Create account
          </Link>
          <Link href="/login" className={buttonClass("outline", "md")}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const active = profiles.find((p) => p.isActive);
  const memberSince = me.createdAt
    ? new Date(me.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <p className="text-xs uppercase tracking-[0.3em] text-brass">Account</p>
      <h1 className="mt-3 font-display text-5xl font-medium tracking-tight">
        @{me.username}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Your private member dossier
        <span className="text-muted-foreground/60">
          {" "}
          — your taste identity at a glance.
        </span>
      </p>

      {/* ── Top row: membership + taste identity ───────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Membership */}
        <div className={cn(CARD, "p-6 sm:p-7")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Member since
              </p>
              <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
                {memberSince ?? "—"}
              </p>
            </div>
            {/* Brass seal medallion */}
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-xl font-semibold text-[#2a1d06] shadow-[inset_0_0_0_1px_rgba(247,236,198,0.5),0_8px_20px_-10px_rgba(169,128,63,0.7)]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #f3e3b6, #c99a4e 45%, #8a6a2c 100%)",
              }}
            >
              S
            </span>
          </div>
          <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-sm">
            <li className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-accent" />
              {me.emailVerified ? "Verified member" : "Email not verified"}
            </li>
            <li className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-accent" />
              {profiles.length} {profiles.length === 1 ? "profile" : "profiles"} ·{" "}
              {active ? "1 active" : "none active"}
            </li>
            <li className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-accent" />
              Private by design
            </li>
          </ul>
        </div>

        {/* Taste identity */}
        <div className={cn(CARD, "relative overflow-hidden p-6 sm:p-7")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/evening.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-6 top-0 h-full w-40 object-cover opacity-25 [mask-image:linear-gradient(to_left,black,transparent)]"
          />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
              Your taste identity
            </p>
            <div className="mt-3 flex items-center gap-4">
              <Ring percent={active?.percent ?? 0} size={64} />
              <div>
                <p className="font-display text-lg font-semibold tracking-tight">
                  {active?.name ?? "No active profile"}
                </p>
                <p className="text-sm text-muted-foreground">
                  identity complete
                </p>
              </div>
            </div>
            {active && (active.topAromas.length > 0 || active.topEffects.length > 0) && (
              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {active.topAromas.map((a) => (
                    <AromaChip key={a} token={a} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {active.topEffects.map((e) => (
                    <EffectChip key={e} token={e} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sensory profiles ───────────────────────────────────── */}
      <div className="mt-14 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
            Sensory profiles
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Your palates
          </h2>
        </div>
        {profiles.length < limit && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="soma-ease inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brass/50 hover:text-brass"
          >
            <Plus className="h-4 w-4" /> Add profile
          </button>
        )}
      </div>

      {(() => {
        const n = profiles.filter((p) => p.merged).length;
        if (n === 0) return null;
        return (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs text-accent">
            <Layers className="h-3.5 w-3.5" />
            {n >= 2
              ? `${n} profiles merged — Harvest is blending them now.`
              : "1 profile merged — add one more to start blending."}
          </p>
        );
      })()}

      <div className="mt-4 space-y-4">
        {profiles.map((p) => {
          const ready = p.percent >= MATCH_GATE_PERCENT;
          return (
            <div
              key={p.id}
              className={cn(
                CARD,
                "p-5 sm:p-6",
                p.isActive && "border-brass/50 ring-1 ring-brass/25",
              )}
            >
              <div className="flex items-center gap-4">
                <Ring percent={p.percent} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-display text-lg font-semibold tracking-tight">
                      {p.name}
                    </span>
                    {p.isActive && (
                      <span className="shrink-0 rounded-full bg-brass/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brass">
                        Active
                      </span>
                    )}
                    {p.merged && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                        <Layers className="h-3 w-3" /> Merged
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {ready
                      ? `${p.percent}% complete`
                      : `${p.percent}% — finish to ${MATCH_GATE_PERCENT}% to use`}
                  </p>
                </div>
                <Link
                  href={`/profile?id=${p.id}`}
                  className="soma-ease grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brass/10 hover:text-brass"
                  aria-label="Edit profile"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>

              {(p.topAromas.length > 0 || p.topEffects.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.topAromas.map((a) => (
                    <AromaChip key={`a-${a}`} token={a} />
                  ))}
                  {p.topEffects.map((e) => (
                    <EffectChip key={`e-${e}`} token={e} />
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3 text-sm">
                {!p.isActive &&
                  (ready ? (
                    <button
                      type="button"
                      onClick={() => activateProfile(p.id)}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-brass"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-brass" /> Set active
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Finish to {MATCH_GATE_PERCENT}% to activate
                    </span>
                  ))}
                {ready && (
                  <button
                    type="button"
                    onClick={() => toggleMerge(p.id, !p.merged)}
                    className={cn(
                      "inline-flex items-center gap-1.5 font-medium hover:underline",
                      p.merged ? "text-accent" : "text-foreground",
                    )}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    {p.merged ? "Unmerge" : "Merge"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => renameProfile(p.id, p.name)}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <PenLine className="h-3.5 w-3.5" /> Rename
                </button>
                {profiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProfile(p.id, p.name)}
                    className="inline-flex items-center gap-1.5 text-[#a23b2c] hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {adding && (
          <div className={cn(CARD, "flex items-center gap-2 p-4")}>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProfile()}
              placeholder="Profile name, e.g. Morning sativa"
              className="soma-ease flex-1 rounded-xl border border-border/60 bg-background/50 px-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-accent/10"
            />
            <button
              onClick={addProfile}
              disabled={busy || !newName.trim()}
              className={buttonClass("primary", "md", "rounded-full")}
            >
              {busy ? "Creating…" : "Create"}
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewName("");
              }}
              className="px-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <ProfileSimilarityHint />

      <TasteBlenderBlock />

      {/* ── Last matches & discoveries ─────────────────────────── */}
      {discoveries.length > 0 && (
        <div className="mt-14">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
                Last matches &amp; discoveries
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Worth a look tonight
              </h2>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {discoveries.map((d) => (
              <Link
                key={d.slug}
                href={`/catalog/${d.slug}`}
                className={cn(CARD, "flex items-center justify-between gap-3 p-4")}
              >
                <span className="min-w-0 truncate font-display text-base font-semibold tracking-tight">
                  {d.name}
                </span>
                <span className="shrink-0 font-display text-lg font-semibold text-brass">
                  {d.score}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick links ────────────────────────────────────────── */}
      <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/collection" className={cn(CARD, "flex items-center gap-4 p-5")}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass">
            <LayoutGrid className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="font-display text-base font-semibold tracking-tight">
              Your shelf
            </span>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Every strain you&apos;ve tried, plus your wishlist.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
        <Link href="/saved" className={cn(CARD, "flex items-center gap-4 p-5")}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass">
            <History className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="font-display text-base font-semibold tracking-tight">
              Your reads
            </span>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Past Taste Match runs and bookmarked picks.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      </div>

      {/* ── Account actions ────────────────────────────────────── */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-8">
        <button
          onClick={logout}
          className={buttonClass("outline", "md", "rounded-full")}
        >
          Sign out
        </button>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm font-medium text-[#a23b2c] hover:underline"
          >
            Delete account
          </button>
        ) : null}
      </div>

      {confirmDelete && (
        <div className="mt-4 rounded-2xl border border-[#a23b2c]/30 bg-[#a23b2c]/5 p-5">
          <p className="text-sm font-medium text-[#a23b2c]">
            Permanently delete your account?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This erases your account, taste profiles and history for good. It
            can&apos;t be undone.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={deleteAccount}
              disabled={deleting}
              className="inline-flex items-center rounded-full bg-[#a23b2c] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8f3326] disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-card disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
