import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FinishProfileNudge } from "@/components/finish-profile-nudge";

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

export const metadata: Metadata = {
  title: "SŌMA — Sensory Sommelier for Cannabis",
  description:
    "SŌMA is an AI cannabis sommelier. Find flower that matches your taste — not just the strain name.",
  // Lets iOS "Add to Home Screen" launch SŌMA full-screen (no Safari chrome),
  // using the apple-icon. The manifest (app/manifest.ts) covers Android.
  appleWebApp: {
    capable: true,
    title: "SŌMA",
    statusBarStyle: "default",
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
        <SiteHeader />
        <FinishProfileNudge />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
