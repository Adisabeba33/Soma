// Client-side "compare basket" for picking strains in the catalog and
// carrying them over to the Compare page in one step.
//
// Storage is localStorage so the basket survives a hard refresh and
// works across catalog filter changes. A custom event lets multiple
// components (catalog rows, the floating tray) stay in sync without
// prop drilling.

"use client";

export const BASKET_KEY = "soma_compare_basket";
export const BASKET_EVENT = "soma_compare_basket:changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BASKET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

function write(next: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BASKET_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(BASKET_EVENT));
}

export function getBasket(): string[] {
  return read();
}

export function isInBasket(name: string): boolean {
  const lc = name.toLowerCase();
  return read().some((s) => s.toLowerCase() === lc);
}

export function addToBasket(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const current = read();
  const lc = trimmed.toLowerCase();
  if (current.some((s) => s.toLowerCase() === lc)) return;
  write([...current, trimmed]);
}

export function removeFromBasket(name: string) {
  const lc = name.toLowerCase();
  write(read().filter((s) => s.toLowerCase() !== lc));
}

export function clearBasket() {
  write([]);
}
