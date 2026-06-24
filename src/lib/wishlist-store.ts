// Client-side mirror of the user's server-side wishlist.
//
// Unlike the compare basket (localStorage), the wishlist is persisted per user
// in Postgres via /api/wishlist. This module keeps a single in-memory copy so
// every WishlistButton on a page stays in sync and we hydrate with ONE GET,
// not one per button. A custom event broadcasts changes; toggles update the
// set optimistically, then reconcile with the server.

"use client";

export const WISHLIST_EVENT = "soma_wishlist:changed";

// Lowercased canonical names currently on the wishlist.
let set = new Set<string>();
let hydrating: Promise<void> | null = null;

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
  }
}

// Fetch the wishlist once. Subsequent callers await the same promise. Safe to
// call from every button's mount effect.
export function ensureHydrated(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (hydrating) return hydrating;
  hydrating = fetch("/api/wishlist")
    .then((r) => r.json())
    .then((d: { wishlist?: Array<{ strainName: string }> } | null) => {
      set = new Set(
        (d?.wishlist ?? []).map((w) => w.strainName.toLowerCase()),
      );
      emit();
    })
    .catch(() => {
      // Leave the set empty; buttons simply render as "not wanted".
    });
  return hydrating;
}

export function isWishlisted(name: string): boolean {
  return set.has(name.trim().toLowerCase());
}

export function addToWishlist(name: string, source?: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  set.add(trimmed.toLowerCase());
  emit();
  fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strainName: trimmed, source }),
  })
    .then((r) => r.json())
    .then((d: { alreadyCollected?: boolean } | null) => {
      // The strain was already rated (on the shelf) — it can't be wished for,
      // so drop the optimistic entry to match the server.
      if (d?.alreadyCollected) {
        set.delete(trimmed.toLowerCase());
        emit();
      }
    })
    .catch(() => {
      // Network failure: roll back so the UI doesn't lie.
      set.delete(trimmed.toLowerCase());
      emit();
    });
}

export function removeFromWishlist(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  set.delete(trimmed.toLowerCase());
  emit();
  fetch("/api/wishlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ strainName: trimmed }),
  }).catch(() => {
    // Roll back on failure.
    set.add(trimmed.toLowerCase());
    emit();
  });
}
