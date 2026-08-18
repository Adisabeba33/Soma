"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { LoungePage } from "@/components/account/lounge-page";
import { MemberCard } from "@/components/account/member-card";
import { AccountNavGrid } from "@/components/account/account-nav-grid";
import { PrivacyCard } from "@/components/account/privacy-card";
import type { ProfileItem } from "@/components/account/profiles-section";

// My Account — the private lounge's front door. The whole /account tree
// runs on the [data-theme="soma-private"] token set (graphite, deep forest,
// antique gold): a LOCAL dark surface, not a global dark mode, because the
// contrast with the ivory rest of SŌMA is the point.
//
// This page is a hub: who you are, and where everything lives. Each section
// (profiles, blender, privacy & data, settings, help) is its own page under
// /account, and each of those returns here.

type Me = {
  registered: boolean;
  username: string | null;
  email: string | null;
  emailVerified: boolean;
  createdAt: string | null;
};

export default function AccountPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe(null));
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((d) => setProfiles(d?.profiles ?? []))
      .catch(() => setProfiles([]));
  }, []);

  if (!me) {
    return (
      <LoungePage eyebrow="My account" title="Private lounge" back={false}>
        <p className="mt-8 text-muted-foreground">Loading…</p>
      </LoungePage>
    );
  }

  if (!me.registered) {
    return (
      <LoungePage
        eyebrow="My account"
        title="Your private lounge"
        intro="You're browsing anonymously — your taste profile and history are saved on this device. Create an account to keep them across devices and claim a member name."
        back={false}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className={buttonClass("primary", "lg")}>
            Create account
          </Link>
          <Link href="/login" className={buttonClass("outline", "lg")}>
            Sign in
          </Link>
        </div>
      </LoungePage>
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
  const scoring =
    blendSet.length >= 2 ? blendSet : profiles.filter((p) => p.isActive);
  const blendScore = scoring.length
    ? Math.round(scoring.reduce((sum, p) => sum + p.percent, 0) / scoring.length)
    : 0;

  return (
    <LoungePage eyebrow="My account" back={false}>
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

      <PrivacyCard />
    </LoungePage>
  );
}
