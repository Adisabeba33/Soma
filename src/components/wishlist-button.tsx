"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WISHLIST_EVENT,
  addToWishlist,
  ensureHydrated,
  isWishlisted,
  removeFromWishlist,
} from "@/lib/wishlist-store";

// "Want to try" toggle. Saves a strain to the user's wishlist — a light,
// no-commitment tap that is kept entirely separate from rating (it never
// touches scoring). Rendered as a sibling OVER a card link (not nested inside
// the <a>), mirroring the catalog's CompareToggle, so a tap saves without
// opening the detail page.
//
// `label={false}` renders an icon-only pill (for tight card corners);
// otherwise the text reads "Want to try" / "Wishlisted".
export function WishlistButton({
  name,
  source,
  label = true,
  className,
}: {
  name: string;
  source?: string;
  label?: boolean;
  className?: string;
}) {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const sync = () => setWanted(isWishlisted(name));
    ensureHydrated().then(sync);
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, [name]);

  return (
    <button
      type="button"
      onClick={() => (wanted ? removeFromWishlist(name) : addToWishlist(name, source))}
      aria-pressed={wanted}
      title={wanted ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm transition-colors",
        wanted
          ? "border-brass bg-brass text-white"
          : "border-border bg-background/85 text-muted-foreground hover:border-brass/60 hover:text-foreground",
        className,
      )}
    >
      {wanted ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      {label && (wanted ? "Wishlisted" : "Want to try")}
    </button>
  );
}
