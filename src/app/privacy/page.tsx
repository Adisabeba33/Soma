import Link from "next/link";
import { BackButton } from "@/components/back-button";

export const metadata = {
  title: "Privacy Policy — SŌMA",
  description:
    "What SŌMA collects, why, who it's shared with, and the control you have over your data.",
  robots: { index: true, follow: true },
};

// Last updated date for the policy. Bump whenever the substance changes.
const LAST_UPDATED = "21 June 2026";

// Operator and legal details for SŌMA.
const CONTACT_EMAIL = "Somasensory@somasensory.com";
const OPERATOR = "Rasveda Labs, LLC";
const JURISDICTION = "the State of New York, USA";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <BackButton fallbackHref="/" label="Back" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground" />
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Legal</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">In plain language</p>
        <p className="mt-2">
          SŌMA is a sensory guide for cannabis flower. We collect only what we
          need to build your taste profile and remember your history. We do not
          run ads, we do not sell your data, and we do not track you across
          other sites. You can delete your account and everything tied to it at
          any time.
        </p>
      </div>

      <Section title="Who we are">
        <p>
          SŌMA (&quot;SŌMA&quot;, &quot;we&quot;, &quot;us&quot;) is a sensory
          matching tool that recommends cannabis flower based on your stated
          taste preferences. This policy explains what we collect, why, and the
          control you have. SŌMA Sensory Sommelier is operated by {OPERATOR}.
        </p>
      </Section>

      <Section title="What we collect">
        <p>
          <span className="font-medium text-foreground">Account details.</span>{" "}
          If you register, we store your email address, a username you choose,
          and a securely hashed version of your password. We never store your
          password in readable form. We record whether your email has been
          verified.
        </p>
        <p>
          <span className="font-medium text-foreground">
            Your sensory profile.
          </span>{" "}
          The preferences you enter — favourite strains, aromas, flavours,
          effects, potency, the times you use, and any free-text notes you add.
          This is the core of what SŌMA matches against.
        </p>
        <p>
          <span className="font-medium text-foreground">Activity.</span> The
          menus or strain lists you analyse, the matches we return, and the
          feedback you log on picks (loved / liked / neutral / avoid). This is
          your history, and it sharpens future matches.
        </p>
        <p>
          <span className="font-medium text-foreground">A device cookie.</span>{" "}
          We set a single functional cookie (<code>soma_uid</code>) so that,
          even before you register, your profile and history stay attached to
          your device. It is not used for advertising and is not shared with
          third-party trackers.
        </p>
        <p>
          <span className="font-medium text-foreground">
            Support messages.
          </span>{" "}
          If you email us, we keep that correspondence to answer you.
        </p>
        <p>
          We do <span className="font-medium text-foreground">not</span> collect
          precise location, contacts, or biometric data, and we do not buy
          personal data about you from other sources.
        </p>
      </Section>

      <Section title="How we use it">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To build your taste profile and generate matches.</li>
          <li>To keep your history and improve future recommendations.</li>
          <li>
            To create and secure your account, verify your email, and let you
            reset your password.
          </li>
          <li>
            To understand, in aggregate, whether features work and to fix
            problems.
          </li>
          <li>To respond to you when you contact us.</li>
        </ul>
        <p>
          We do not use your data to serve advertising, and we do not sell or
          rent it.
        </p>
      </Section>

      <Section title="Who we share it with">
        <p>
          We don&apos;t sell your data. We share it only with the service
          providers that run SŌMA, and only so the app can function:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="font-medium text-foreground">Hosting</span> —
            Vercel, which serves the application.
          </li>
          <li>
            <span className="font-medium text-foreground">Database</span> —
            Supabase (PostgreSQL), where your profile and history are stored.
          </li>
          <li>
            <span className="font-medium text-foreground">Email</span> — Resend,
            used only to send account emails (verification and password reset).
          </li>
          <li>
            <span className="font-medium text-foreground">
              Optional AI assistance
            </span>{" "}
            — when enabled, a third-party language model may help interpret
            unfamiliar strain names or phrasing. This feature is off by default;
            when on, only the text needed for that step is sent, never your
            account credentials.
          </li>
        </ul>
        <p>
          We may also disclose information if required by law, or to protect the
          rights, safety, and security of our users and the service.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          SŌMA uses one functional cookie, <code>soma_uid</code>, to keep your
          profile and history attached to your device. We do not use
          advertising cookies or third-party analytics trackers. Because the
          cookie is essential to how the app works, clearing it will detach an
          anonymous profile from your device.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          We keep your account and the data tied to it for as long as your
          account exists. When you delete your account, we delete your profile,
          history, and feedback. Aggregate, non-identifying counts (for example,
          how many analyses were run) may remain, as they are not linked to you.
        </p>
      </Section>

      <Section title="Your choices and rights">
        <p>
          You can view and edit your sensory profile at any time, and you can
          delete past analyses individually. You can delete your entire account
          and everything attached to it from your{" "}
          <Link href="/account" className="text-accent hover:underline">
            account page
          </Link>
          .
        </p>
        <p>
          Depending on where you live, you may have additional rights — to
          access, correct, export, or erase your personal data, or to object to
          certain processing. To make a request, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="Security">
        <p>
          Passwords are stored only as salted hashes, never in plain text.
          Email-verification and password-reset links are stored only as hashes,
          are single-use, and expire. No system is perfectly secure, but we take
          reasonable measures to protect your data.
        </p>
      </Section>

      <Section title="Age requirement">
        <p>
          SŌMA is intended only for adults of legal age (21+ in most places, or
          the legal age where you live) in regions where cannabis is lawful. It
          is not directed to anyone under that age, and we do not knowingly
          collect data from them.
        </p>
      </Section>

      <Section title="International users">
        <p>
          Your data may be processed in countries other than your own, including
          where our service providers operate. Where required, we rely on
          appropriate safeguards for such transfers.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this policy as the product evolves. When we make
          material changes, we will update the date above and, where
          appropriate, notify you in the app.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about your privacy or this policy? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
          . Governing law: {JURISDICTION}.
        </p>
      </Section>

      <p className="mt-12 text-sm text-muted-foreground">
        See also our{" "}
        <Link href="/terms" className="text-accent hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
