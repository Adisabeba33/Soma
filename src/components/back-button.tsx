"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * A visible "back" control for drill-down reading pages (a Learn article, a
 * strain page, How it works…). It prefers the browser's own history so "back"
 * lands exactly where the reader opened this page from — the Learn hub at the
 * right scroll position, a related-article link, an in-app search result — and
 * only falls back to the section hub when there's nothing useful to go back to
 * (a direct hit from Google or a pasted link, where history would leave the
 * site entirely).
 */
export function BackButton({
  fallbackHref,
  label,
  className,
}: {
  fallbackHref: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();

  function handleClick() {
    const ref = typeof document !== "undefined" ? document.referrer : "";
    let sameOrigin = false;
    try {
      sameOrigin = !!ref && new URL(ref).origin === window.location.origin;
    } catch {
      sameOrigin = false;
    }
    // Came from inside the app when there's history AND the entry referrer is
    // either same-origin or empty (an in-app SPA navigation leaves the referrer
    // untouched). A cross-origin referrer means a direct external hit — go to
    // the hub instead of bouncing back off-site.
    const cameFromApp =
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      (sameOrigin || ref === "");

    if (cameFromApp) router.back();
    else router.push(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
