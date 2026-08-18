"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

// Everything that sits below the page content. The footer is the light,
// editorial close of a public page — the private lounge ends with its own
// actions and the tab bar instead, so it is withheld there. The footer is
// passed in as a rendered server component; this wrapper only decides
// whether it appears.
export function SiteChrome({ footer }: { footer: React.ReactNode }) {
  const pathname = usePathname();
  const inPrivateLounge = Boolean(pathname?.startsWith("/account"));

  // The private lounge is a route-local dark surface, but the document
  // itself must carry it too — otherwise the ivory body shows through the
  // space reserved for the tab bar and below short pages.
  useEffect(() => {
    const body = document.body;
    if (inPrivateLounge) body.dataset.theme = "soma-private";
    else delete body.dataset.theme;
    return () => {
      delete body.dataset.theme;
    };
  }, [inPrivateLounge]);

  return (
    <>
      {!inPrivateLounge && footer}
      <MobileBottomNav />
    </>
  );
}
