"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  EllipsisVertical,
  History,
  Layers,
  LayoutGrid,
  Pencil,
  PenLine,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { profileEmblem } from "@/components/aroma-icon";
import { TasteBlenderBlock } from "@/components/taste-blender-block";
import { ProfileSimilarityHint } from "@/components/profile-similarity-hint";
import { PresetPicker } from "@/components/preset-picker";
import type { Preset } from "@/lib/profile-presets";
import { labelFor } from "@/lib/vocab";
import { MATCH_GATE_PERCENT } from "@/lib/profile-completeness";
import { cn } from "@/lib/utils";

// Premium card surface, shared across the dossier.
const CARD =
  "soma-lift rounded-[1.75rem] border border-white/50 bg-[hsl(42_46%_95%)]/42 backdrop-blur-[2px] shadow-[0_30px_60px_-38px_rgba(60,45,20,0.6),0_2px_4px_-2px_rgba(60,45,20,0.25)] hover:shadow-[0_36px_72px_-36px_rgba(60,45,20,0.68),0_3px_6px_-2px_rgba(60,45,20,0.3)]";

// The profile cards read a touch more solid than the rest of the dossier so
// the chips and gilded ring sit on cream rather than the busy backdrop.
const PROFILE_CARD =
  "rounded-[1.6rem] bg-[hsl(43_47%_95.5%)]/92 backdrop-blur-md";

// Soft champagne gold — pale and smooth, the way the reference reads, rather
// than a brassy, high-contrast metal. GOLD_BAND is the gentle sheen that rings
// the medallion (two soft highlights, low contrast = smooth hoop); GOLD_FRAME
// is the polished bezel for the active card; GOLD_PILL is a slightly deeper
// gold for the ACTIVE badge so white text stays legible.
const GOLD_BAND =
  "conic-gradient(from 215deg, #c7ac72 0deg, #ecddb2 95deg, #cbae72 185deg, #e6d2a0 280deg, #c7ac72 360deg)";
const GOLD_FRAME =
  "linear-gradient(135deg, #efe1ba 0%, #d4bd86 26%, #c6a96c 47%, #f0e3bd 54%, #c6a96c 63%, #d4bd86 80%, #efe1ba 100%)";
const GOLD_PILL =
  "linear-gradient(135deg, #ddc17c 0%, #c19a45 50%, #d4b163 100%)";

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

// A gilded completeness medallion — a thick, sculpted gold torus carrying the
// progress, with a recessed cream centre for the percent. Layers: a metallic
// gold band, the incomplete slice painted in a soft track tone, a diagonal
// gloss, an etched outer rim, and a debossed cream well.
function Ring({ percent, size = 64 }: { percent: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const deg = pct * 3.6;
  const band = Math.round(size * 0.13); // thin gold hoop, large cream centre
  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow:
          "0 14px 26px -14px rgba(120,92,40,0.55), 0 2px 4px -2px rgba(120,92,40,0.35)",
      }}
    >
      {/* Smooth champagne-gold hoop */}
      <div className="absolute inset-0 rounded-full" style={{ background: GOLD_BAND }} />
      {/* Incomplete arc — covers the remaining slice in a soft track tone */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(transparent ${deg}deg, hsl(42 20% 84%) ${deg}deg)` }}
      />
      {/* Gentle top-left sheen — adds a soft bevel without darkening the gold */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.3) 100%)",
        }}
      />
      {/* Recessed cream well — soft debossed shadow + a faint gold lip */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-full bg-[hsl(44_46%_96.5%)]"
        style={{
          inset: band,
          boxShadow:
            "inset 0 2px 5px rgba(110,82,32,0.28), inset 0 -1px 2px rgba(255,255,255,0.8), 0 0 0 1px rgba(150,118,55,0.2)",
        }}
      >
        <span
          className="font-display font-semibold leading-none text-foreground"
          style={{ fontSize: size * 0.33 }}
        >
          {pct}
        </span>
        <span className="mt-0.5 text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
          %
        </span>
      </div>
    </div>
  );
}

function Tick({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] bg-accent text-accent-foreground">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      {children}
    </li>
  );
}

function AromaChip({ token }: { token: string }) {
  return (
    <span className="rounded-full bg-brass/[0.14] px-3.5 py-1.5 text-[13px] font-medium text-brass ring-1 ring-inset ring-brass/15">
      {labelFor(token)}
    </span>
  );
}
function EffectChip({ token }: { token: string }) {
  return (
    <span className="rounded-full bg-[hsl(40_14%_88%)]/80 px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground ring-1 ring-inset ring-black/[0.04]">
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
    fetch("/api/discoveries")
      .then((r) => r.json())
      .then((d) => setDiscoveries(Array.isArray(d?.matches) ? d.matches : []))
      .catch(() => {});
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
    <div className="relative">
      {/* Lounge backdrop — embossed plaster + gilded leaves. Fixed to the
          viewport so it "sticks" while the cards scroll over it; a light wash
          keeps any off-card text readable. The footer's own opaque background
          closes it off at the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <img
          src="/textures/lounge.webp"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/25" />
      </div>

      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      {/* ── Header row — name left, membership card top-right ───── */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-brass">
            Private Lounge
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="mt-1 font-display text-5xl font-medium tracking-tight">
            @{me.username}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Your private tasting room
            <span className="text-muted-foreground/60">
              {" "}
              — taste identity, palates and discoveries, kept to yourself.
            </span>
          </p>
        </div>

        {/* Membership */}
        <div className={cn(CARD, "w-full p-6 sm:p-7 lg:w-[20rem] lg:shrink-0")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Member since
              </p>
              <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
                {memberSince ?? "—"}
              </p>
            </div>
            {/* The SŌMA wax-seal — the house mark, in place of a plain initial. */}
            <img
              src="/brand/soma-seal.png"
              alt="SŌMA — Sensory Sommelier seal"
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-brass/30 shadow-[0_14px_28px_-10px_rgba(110,80,30,0.6),0_3px_6px_-2px_rgba(110,80,30,0.45)]"
            />
          </div>
          <ul className="mt-5 space-y-3 border-t border-brass/25 pt-4 text-sm">
            <Tick>
              {me.emailVerified ? "Verified member" : "Email not verified"}
            </Tick>
            <Tick>
              {profiles.length} {profiles.length === 1 ? "profile" : "profiles"} ·{" "}
              {active ? "1 active" : "none active"}
            </Tick>
            <Tick>Private by design</Tick>
          </ul>
          {/* House signature — signs off the membership card, bottom-right. */}
          <div className="mt-5 flex justify-end">
            <img
              src="/brand/soma-signature.png"
              alt="SŌMA signature"
              className="h-12 w-auto opacity-90"
            />
          </div>
        </div>
      </div>

      {/* ── Taste identity — wide card, prominent artwork ──────── */}
      <div className={cn(CARD, "mt-8 overflow-hidden")}>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_15rem]">
          <div className="p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
              Your taste identity
            </p>
            <div className="mt-4 flex items-center gap-4">
              <Ring percent={active?.percent ?? 0} size={72} />
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">
                  {active?.name ?? "No active profile"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Your preferences in focus
                </p>
              </div>
            </div>
            {active && active.topAromas.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Top aromas
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {active.topAromas.map((a) => (
                    <AromaChip key={a} token={a} />
                  ))}
                </div>
              </div>
            )}
            {active && active.topEffects.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Top effects
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {active.topEffects.map((e) => (
                    <EffectChip key={e} token={e} />
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Prominent bud artwork — full strength, blends at the seam. */}
          <div className="relative h-40 sm:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/evening.webp"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 hidden sm:block"
              style={{
                background:
                  "linear-gradient(to right, hsl(var(--card)) 2%, transparent 45%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Sensory profiles ───────────────────────────────────── */}
      <div className="mt-16 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
            Sensory profiles
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Each profile defines what SŌMA searches under. Switch or merge
            anytime.
          </p>
        </div>
        {profiles.length < limit && (
          <button
            onClick={() => setShowPicker(true)}
            className="soma-ease inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-brass/50 hover:text-brass"
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
        {profiles.map((p, idx) => {
          const ready = p.percent >= MATCH_GATE_PERCENT;
          const Emblem = profileEmblem(p.topAromas, p.topEffects);
          const menuOpen = openMenuId === p.id;

          // Footer actions, in the reference's order — rendered as an evenly
          // divided button bar with hairline separators between them.
          const act =
            "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium soma-ease transition-colors";
          const actions: React.ReactNode[] = [];
          if (!p.isActive) {
            actions.push(
              ready ? (
                <button
                  key="activate"
                  type="button"
                  onClick={() => activateProfile(p.id)}
                  className={cn(act, "text-brass hover:text-foreground")}
                >
                  <Sparkles className="h-3.5 w-3.5" /> Set active
                </button>
              ) : (
                <span key="finish" className={cn(act, "text-muted-foreground")}>
                  Finish to {MATCH_GATE_PERCENT}%
                </span>
              ),
            );
          }
          if (ready) {
            actions.push(
              <button
                key="merge"
                type="button"
                onClick={() => toggleMerge(p.id, !p.merged)}
                className={cn(
                  act,
                  p.merged ? "text-accent" : "text-foreground hover:text-brass",
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                {p.merged ? "Unmerge" : "Merge"}
              </button>,
            );
          }
          actions.push(
            <button
              key="rename"
              type="button"
              onClick={() => renameProfile(p.id, p.name)}
              className={cn(act, "text-foreground hover:text-brass")}
            >
              <PenLine className="h-3.5 w-3.5" /> Rename
            </button>,
          );
          if (profiles.length > 1) {
            actions.push(
              <button
                key="delete"
                type="button"
                onClick={() => removeProfile(p.id, p.name)}
                className={cn(act, "text-[#a23b2c] hover:text-[#8f3326]")}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>,
            );
          }

          const card = (
            <div
              key={p.id}
              className={cn(
                "relative p-6 sm:p-7",
                PROFILE_CARD,
                !p.isActive &&
                  "soma-lift border border-white/60 shadow-[0_26px_54px_-34px_rgba(60,45,20,0.6),0_2px_4px_-2px_rgba(60,45,20,0.25)] hover:shadow-[0_34px_66px_-32px_rgba(60,45,20,0.66),0_3px_6px_-2px_rgba(60,45,20,0.3)]",
              )}
            >
              {/* Profile number + overflow menu — its own top line, so a long
                  profile name below can use the full card width (as the
                  reference does) without colliding with the corner. */}
              <div className="mb-3 flex items-center justify-end gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                  Profile {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Profile menu"
                    aria-expanded={menuOpen}
                    onClick={() => setOpenMenuId(menuOpen ? null : p.id)}
                    className="soma-ease -mr-1 grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brass/10 hover:text-brass"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </button>
                  {menuOpen && (
                    <>
                      <button
                        type="button"
                        aria-hidden
                        tabIndex={-1}
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-9 z-50 w-44 overflow-hidden rounded-xl border border-border/70 bg-card py-1 shadow-[0_20px_44px_-18px_rgba(60,45,20,0.6)]">
                        <Link
                          href={`/profile?id=${p.id}`}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-brass/10 hover:text-brass"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit details
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            renameProfile(p.id, p.name);
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-brass/10 hover:text-brass"
                        >
                          <PenLine className="h-3.5 w-3.5" /> Rename
                        </button>
                        {profiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              removeProfile(p.id, p.name);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#a23b2c] hover:bg-[#a23b2c]/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-5">
                <Ring percent={p.percent} size={76} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <Emblem
                      className="h-7 w-7 shrink-0 text-brass"
                      strokeWidth={1.5}
                    />
                    <Link
                      href={`/profile?id=${p.id}`}
                      className="soma-ease truncate font-display text-xl font-semibold tracking-tight transition-colors hover:text-brass sm:text-2xl"
                    >
                      {p.name}
                    </Link>
                    {p.isActive && (
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_6px_14px_-6px_rgba(120,90,30,0.7),inset_0_1px_1px_rgba(255,255,255,0.5)] [text-shadow:0_1px_1px_rgba(90,60,10,0.35)]"
                        style={{ background: GOLD_PILL }}
                      >
                        Active <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                  {p.merged && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                      <Layers className="h-3 w-3" /> Merged
                    </span>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {ready
                      ? `${p.percent}% complete`
                      : `${p.percent}% — finish to ${MATCH_GATE_PERCENT}% to use`}
                  </p>
                </div>
              </div>

              {(p.topAromas.length > 0 || p.topEffects.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.topAromas.map((a) => (
                    <AromaChip key={`a-${a}`} token={a} />
                  ))}
                  {p.topEffects.map((e) => (
                    <EffectChip key={`e-${e}`} token={e} />
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/50 pt-4 text-[13px]">
                {actions.map((node, i) => (
                  <div key={i} className="flex flex-1 justify-center">
                    {node}
                  </div>
                ))}
              </div>
            </div>
          );

          // The active profile gets a glossy gold bezel with a glint hanging
          // off its lower-left edge; the others sit on plain cream.
          return p.isActive ? (
            <div
              key={p.id}
              className="soma-lift relative rounded-[1.75rem] p-[3px] shadow-[0_34px_64px_-30px_rgba(110,82,35,0.6),0_0_26px_-8px_rgba(206,176,108,0.45)]"
              style={{ background: GOLD_FRAME }}
            >
              {/* Soft golden ambient glow pooling under the active card. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] opacity-60 blur-xl"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 60%, rgba(206,176,108,0.4), transparent 75%)",
                }}
              />
              {/* Crisp sparkle glint hanging off the bezel's lower-left edge. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-3.5 bottom-12 z-20 h-14 w-14"
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,252,240,0.98) 0%, rgba(245,226,156,0.5) 30%, transparent 68%)",
                  }}
                />
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-14 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />
                <span className="absolute left-1/2 top-1/2 h-14 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white to-transparent" />
                <span className="absolute left-1/2 top-1/2 h-9 w-[1px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-b from-transparent via-white/70 to-transparent" />
                <span className="absolute left-1/2 top-1/2 h-9 w-[1px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-b from-transparent via-white/70 to-transparent" />
              </span>
              {card}
            </div>
          ) : (
            card
          );
        })}

      </div>

      {/* New-profile picker — presets (instant) or build your own. */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => !creatingId && setShowPicker(false)}
        >
          <div
            className="my-8 w-full max-w-2xl rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
                  New profile
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                  Pick a taste to start
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose an archetype (instant) or build your own. Add two or
                  three to blend them.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !creatingId && setShowPicker(false)}
                aria-label="Close"
                className="soma-ease grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
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

      <ProfileSimilarityHint />

      <TasteBlenderBlock />

      {/* ── Last matches & discoveries ─────────────────────────── */}
      {discoveries.length > 0 && (
        <div className="mt-16">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-brass">
                Last matches &amp; discoveries
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Tonight&apos;s strongest picks for your taste.
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {discoveries.map((d) => (
              <Link
                key={d.slug}
                href={`/catalog/${d.slug}`}
                className={cn(CARD, "flex items-center gap-3 p-4")}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass/10 font-display text-sm font-semibold text-brass">
                  {d.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold tracking-tight">
                  {d.name}
                </span>
                <span className="shrink-0 font-display text-base font-semibold text-brass">
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
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-8">
        <button
          onClick={logout}
          className={buttonClass("outline", "md", "rounded-full")}
        >
          Sign out
        </button>
        {!confirmDelete ? (
          <div className="text-right">
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm font-medium text-[#a23b2c] hover:underline"
            >
              Delete account
            </button>
            <p className="mt-0.5 text-xs text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
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
    </div>
  );
}
