import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FinishProfileNudge } from "@/components/finish-profile-nudge";
import { JsonLd } from "@/components/json-ld";
import { siteUrl, absoluteUrl } from "@/lib/site-url";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_TITLE = "SŌMA — Sensory Sommelier for Cannabis";
const SITE_DESCRIPTION =
  "SŌMA is a sensory sommelier for cannabis. It scores any menu against your own taste — aroma, effect and feel — to find the flower you'll love, not just a strain name.";

export const metadata: Metadata = {
  // Resolves all relative URLs in metadata (canonical, OG images) against the
  // canonical base, mirroring src/lib/email.ts → baseUrl().
  metadataBase: new URL(siteUrl()),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "cannabis sommelier",
    "strain finder",
    "cannabis flower",
    "terpenes",
    "sensory profile",
    "taste match",
    "dispensary menu",
    "cannabis aromas",
    "cannabis effects",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SŌMA",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: "/hero/hero.png", width: 1200, height: 630, alt: "SŌMA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/hero/hero.png"],
  },
  // Lets iOS "Add to Home Screen" launch SŌMA full-screen (no Safari chrome),
  // using the apple-icon. The manifest (app/manifest.ts) covers Android.
  appleWebApp: {
    capable: true,
    title: "SŌMA",
    statusBarStyle: "default",
  },
};

// Organization structured data — name, site, logo and description, so search
// and AI engines have a canonical entity for SŌMA.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SŌMA",
  url: siteUrl(),
  logo: absoluteUrl("/icon.png"),
  description: SITE_DESCRIPTION,
  email: "Somasensory@somasensory.com",
  contactPoint: {
    "@type": "ContactPoint",
    email: "Somasensory@somasensory.com",
    contactType: "customer support",
  },
};

// WebSite structured data with a SearchAction — tells Google the site is
// searchable (enabling a sitelinks search box) and points at the catalog's
// real query param (/catalog?q=…), which catalog-client.tsx reads.
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SŌMA",
  url: siteUrl(),
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl()}/catalog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const viewport: Viewport = {
  // Tints the mobile browser / status bar to the brand green.
  themeColor: "#334234",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <SiteHeader />
        <FinishProfileNudge />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
