import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LoungePage } from "@/components/account/lounge-page";
import { DeleteAccountControl } from "@/components/account/delete-account-control";
import { IconTile } from "@/components/ui/icon-tile";

export const metadata = { title: "Privacy & data — SŌMA" };

// The member-facing side of privacy: what SŌMA holds on them, where the
// full policy is, and the one control that erases it all. The policy text
// itself is NOT duplicated here — this page links to it.
const HELD = [
  {
    title: "Your taste profiles",
    body: "The aromas, effects, favourites and dislikes you entered. This is what every match is scored against.",
  },
  {
    title: "Your shelf and reads",
    body: "Verdicts you left on strains, and past Taste Match runs you saved.",
  },
  {
    title: "Account basics",
    body: "Member name, email address and verification state — used to sign you in and reach you about the account.",
  },
];

export default function AccountPrivacyPage() {
  return (
    <LoungePage
      eyebrow="Privacy & data"
      title="Control your information"
      intro="SŌMA is private by design: your profile is never sold and never used for advertising. Here is exactly what it holds for you."
    >
      <section className="mt-8 space-y-3">
        {HELD.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h2 className="font-medium text-foreground">{item.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <IconTile Icon={ShieldCheck} />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              The full policy
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Who runs SŌMA&apos;s infrastructure, how long data is kept, and
              the rights you can exercise — written out in plain language.
            </p>
            <Link
              href="/privacy"
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-brass transition-colors hover:text-foreground"
            >
              Read the Privacy Policy
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <DeleteAccountControl />
    </LoungePage>
  );
}
