"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PresetPicker } from "@/components/preset-picker";
import { ProfileSimilarityHint } from "@/components/profile-similarity-hint";
import {
  ProfilesSection,
  type ProfileItem,
} from "@/components/account/profiles-section";
import type { Preset } from "@/lib/profile-presets";

// All taste-profile management in one place: create from a preset or from
// scratch, switch the active profile, merge for blending, rename, delete.
// The behaviour is exactly what the account dossier has always done — it
// now lives on its own page instead of halfway down the hub.
export function ProfilesManager() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [limit, setLimit] = useState(3);
  const [loaded, setLoaded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  async function loadProfiles() {
    const d = await fetch("/api/profiles")
      .then((r) => r.json())
      .catch(() => null);
    if (d?.profiles) {
      setProfiles(d.profiles);
      if (typeof d.limit === "number") setLimit(d.limit);
    }
    setLoaded(true);
  }

  useEffect(() => {
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

  if (!loaded) {
    return <p className="mt-10 text-muted-foreground">Loading…</p>;
  }

  return (
    <>
      <ProfileSimilarityHint />

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
    </>
  );
}
