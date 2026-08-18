"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { TasteBlenderBlock } from "@/components/taste-blender-block";
import { ProfileSimilarityHint } from "@/components/profile-similarity-hint";
import { PresetPicker } from "@/components/preset-picker";
import { MemberCard } from "@/components/account/member-card";
import { AccountNavGrid } from "@/components/account/account-nav-grid";
import { PrivacyCard } from "@/components/account/privacy-card";
import { AccountActions } from "@/components/account/account-actions";
import {
  ProfilesSection,
  type ProfileItem,
} from "@/components/account/profiles-section";
import type { Preset } from "@/lib/profile-presets";

// My Account — the private lounge. The whole page runs on the
// [data-theme="soma-private"] token set (graphite, deep forest, antique
// gold): a LOCAL dark surface, not a global dark mode, because the contrast
// with the ivory rest of SŌMA is the point.
//
// Everything the old dossier could do still happens here — profiles,
// blending, membership state, sign out, account deletion — reorganised so
// the member sees who they are and where everything lives in one screen.

type Me = {
  registered: boolean;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
  createdAt: string | null;
};

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [limit, setLimit] = useState(3);
  const [showPicker, setShowPicker] = useState(false);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

  // Quick-start a new profile from a preset: create the named profile, then
  // save the preset's taste data into it. Great for assembling a Blender out
  // of two or three archetypes without the questionnaire.
  async function pickPreset(preset: Preset) {
    setCreatingId(preset.id);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: preset.name }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Couldn't create the profile.");
        return;
      }
      const p = await res.json();
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...preset.profile, profileId: p.id }),
      });
      await loadProfiles();
      setShowPicker(false);
    } finally {
      setCreatingId(null);
    }
  }

  // Build my own: create an empty named profile and open the full questionnaire.
  async function buildCustom() {
    setBusy(true);
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New profile" }),
    });
    setBusy(false);
    if (res.ok) {
      const p = await res.json();
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
      <Lounge>
        <p className="py-20 text-muted-foreground">Loading…</p>
      </Lounge>
    );
  }

  if (!me.registered) {
    return (
      <Lounge>
        <div className="max-w-md py-8">
          <SectionEyebrow>My account</SectionEyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Your private lounge
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            You&apos;re browsing anonymously — your taste profile and history
            are saved on this device. Create an account to keep them across
            devices and claim a member name.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonClass("primary", "lg")}>
              Create account
            </Link>
            <Link href="/login" className={buttonClass("outline", "lg")}>
              Sign in
            </Link>
          </div>
        </div>
      </Lounge>
    );
  }

  const memberSince = me.createdAt
    ? new Date(me.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  // The blend score reads the profiles actually driving matches — the merge
  // set once it can blend, otherwise the active profile — and reports how
  // completely they describe a taste. Derived, never stored or invented.
  const blendSet = profiles.filter((p) => p.merged);
  const scoring = blendSet.length >= 2 ? blendSet : profiles.filter((p) => p.isActive);
  const blendScore = scoring.length
    ? Math.round(scoring.reduce((sum, p) => sum + p.percent, 0) / scoring.length)
    : 0;

  return (
    <Lounge>
      <SectionEyebrow>My account</SectionEyebrow>

      <div className="mt-4">
        <MemberCard
          username={me.username}
          memberSince={memberSince}
          profileCount={profiles.length}
          activeCount={profiles.filter((p) => p.isActive).length}
          blendScore={blendScore}
        />
      </div>

      <AccountNavGrid />

      <ProfilesSection
        profiles={profiles}
        limit={limit}
        openMenuId={openMenuId}
        onOpenMenu={setOpenMenuId}
        onAdd={() => setShowPicker(true)}
        onActivate={activateProfile}
        onToggleMerge={toggleMerge}
        onRename={renameProfile}
        onRemove={removeProfile}
      />

      <ProfileSimilarityHint />

      <div id="blender" className="scroll-mt-24">
        <TasteBlenderBlock />
      </div>

      <PrivacyCard />

      <AccountActions
        onSignOut={logout}
        onDeleteAccount={deleteAccount}
        confirming={confirmDelete}
        onConfirmChange={setConfirmDelete}
        deleting={deleting}
        email={me.email}
        emailVerified={me.emailVerified}
      />

      {/* New-profile picker — presets (instant) or build your own. */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => !creatingId && setShowPicker(false)}
        >
          <div
            data-theme="soma-private"
            className="my-8 w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionEyebrow>New profile</SectionEyebrow>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  Pick a taste to start
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose an archetype (instant) or build your own. Add two or
                  three to blend them.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !creatingId && setShowPicker(false)}
                aria-label="Close"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-5">
              <PresetPicker
                onPick={pickPreset}
                onCustom={buildCustom}
                busyId={creatingId}
              />
            </div>
            {busy && (
              <p className="mt-3 text-sm text-muted-foreground">
                Opening the questionnaire…
              </p>
            )}
          </div>
        </div>
      )}
    </Lounge>
  );
}

// The dark room everything sits in. Paints its own ground so the themed
// subtree never shows the ivory body through it, and stretches to the
// viewport so short states (loading, signed out) stay dark too.
function Lounge({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="soma-private"
      className="min-h-[calc(100vh-70px)] bg-background sm:min-h-[calc(100vh-76px)]"
    >
      <div className="mx-auto w-full max-w-editorial px-5 pb-20 pt-8 sm:px-8 sm:pt-10">
        {children}
      </div>
    </div>
  );
}
