"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  History,
  Layers,
  LayoutGrid,
  Mail,
  Pencil,
  PenLine,
  Plus,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { ProfileProgressRing } from "@/components/profile-progress";
import { TasteBlenderBlock } from "@/components/taste-blender-block";
import { ProfileSimilarityHint } from "@/components/profile-similarity-hint";
import { MATCH_GATE_PERCENT } from "@/lib/profile-completeness";
import { cn } from "@/lib/utils";

// Frosted "apothecary" panel — translucent cream over the botanical backdrop.
const PANEL =
  "rounded-3xl border border-border/60 bg-card/70 shadow-[0_1px_4px_rgba(40,49,40,0.05)] backdrop-blur-sm";

// Apothecary backdrop behind the whole page (see public/textures). The photo
// is moody/dark, so a soft cream veil sits on top to keep header text and the
// frosted panels readable. Fixed so it stays put as the page scrolls.
function ApothecaryBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/textures/account-bg.webp')" }}
      />
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}

type Me = {
  registered: boolean;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
};

type ProfileItem = {
  id: string;
  name: string;
  isActive: boolean;
  merged: boolean;
  percent: number;
};

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
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
      <>
        <ApothecaryBg />
        <div className="mx-auto max-w-md px-5 py-20 text-muted-foreground">
          Loading…
        </div>
      </>
    );
  }

  if (!me.registered) {
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <ApothecaryBg />
        <h1 className="font-display text-4xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          You're browsing anonymously — your taste profile and history are saved
          on this device. Create an account to keep them across devices and pick
          a public username.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup" className={buttonClass("primary", "md")}>Create account</Link>
          <Link href="/login" className={buttonClass("outline", "md")}>Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <ApothecaryBg />
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        @{me.username}
      </h1>

      <div className={cn("mt-8 space-y-2 p-3", PANEL)}>
        <DetailRow icon={<User className="h-4 w-4" />} label="Username">
          <span className="font-medium">@{me.username}</span>
        </DetailRow>
        <DetailRow icon={<Mail className="h-4 w-4" />} label="Email">
          <span className="truncate font-medium">{me.email}</span>
        </DetailRow>
        <DetailRow icon={<ShieldCheck className="h-4 w-4" />} label="Email status">
          {me.emailVerified ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-accent">
              <Check size={15} /> Verified
            </span>
          ) : (
            <span className="font-medium text-brass">Not verified</span>
          )}
        </DetailRow>
      </div>

      {/* Sensory Profiles — up to `limit` named profiles; the active one drives
          every match. A profile must reach 60% before it can be made active. */}
      <div className="mt-10 flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-brass">
          Sensory Profiles
        </p>
        <span className="text-xs text-muted-foreground">
          {profiles.length} / {limit}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick which profile SŌMA searches under. Switch anytime. Or{" "}
        <strong className="text-foreground">Merge</strong> two or more — Harvest
        then blends them, each strain taking its best world.
      </p>
      {(() => {
        const n = profiles.filter((p) => p.merged).length;
        if (n === 0) return null;
        return (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs text-accent">
            <Layers className="h-3.5 w-3.5" />
            {n >= 2
              ? `${n} profiles merged — Harvest is blending them now.`
              : "1 profile merged — add one more to start blending."}
          </p>
        );
      })()}

      <div className="mt-3 space-y-3">
        {profiles.map((p) => {
          const ready = p.percent >= MATCH_GATE_PERCENT;
          return (
            <div
              key={p.id}
              className={cn(
                "p-4",
                PANEL,
                p.isActive && "border-brass/50 ring-1 ring-brass/30",
              )}
            >
              <div className="flex items-center gap-3">
                <ProfileProgressRing percent={p.percent} size={52} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display text-base font-semibold tracking-tight">
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
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-3 text-sm">
                <Link
                  href={`/profile?id=${p.id}`}
                  className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                {!p.isActive &&
                  (ready ? (
                    <button
                      type="button"
                      onClick={() => activateProfile(p.id)}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-brass" /> Set active
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
      </div>

      {profiles.length < limit &&
        (adding ? (
          <div className="mt-3 flex items-center gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addProfile()}
              placeholder="Profile name, e.g. Morning sativa"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={addProfile}
              disabled={busy || !newName.trim()}
              className={buttonClass("primary", "md")}
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
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-brass/40 bg-card/40 px-4 py-3 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-brass/60 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add profile
          </button>
        ))}

      <ProfileSimilarityHint />

      <TasteBlenderBlock />

      {/* Collection — the personal shelf, on its own page. */}
      <p className="mt-10 text-xs uppercase tracking-[0.24em] text-brass">
        Collection
      </p>
      <Link
        href="/collection"
        className={cn(
          "mt-3 flex items-center gap-4 p-5 transition-colors hover:border-brass/40",
          PANEL,
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass">
          <LayoutGrid className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-display text-lg font-semibold tracking-tight">
            Your shelf
          </span>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Every strain you&apos;ve tried, as a visual collection — plus your
            wishlist.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      {/* History — past Taste Match runs and bookmarked picks. */}
      <p className="mt-10 text-xs uppercase tracking-[0.24em] text-brass">
        History
      </p>
      <Link
        href="/saved"
        className={cn(
          "mt-3 flex items-center gap-4 p-5 transition-colors hover:border-brass/40",
          PANEL,
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass">
          <History className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-display text-lg font-semibold tracking-tight">
            Your reads
          </span>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Past Taste Match runs and the picks you bookmarked.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>

      <button onClick={logout} className={buttonClass("outline", "md", "mt-8")}>
        Sign out
      </button>

      {/* Danger zone — permanent account deletion with a confirm step. */}
      <div className="mt-12 border-t border-border pt-8">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm font-medium text-[#a23b2c] hover:underline"
          >
            Delete account
          </button>
        ) : (
          <div className="rounded-2xl border border-[#a23b2c]/30 bg-[#a23b2c]/5 p-5">
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
                className="inline-flex items-center rounded-xl bg-[#a23b2c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8f3326] disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-card disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// One row inside the frosted account-info panel: a tinted icon chip, a label,
// and the value pushed to the right.
function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/40 px-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brass/10 text-brass">
        {icon}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto min-w-0 truncate text-right text-sm">
        {children}
      </span>
    </div>
  );
}
