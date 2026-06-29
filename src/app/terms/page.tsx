import Link from "next/link";
import { BackButton } from "@/components/back-button";

export const metadata = {
  title: "Terms of Service — SŌMA",
  description:
    "The terms you agree to when using SŌMA — what it is, what it isn't, and the rules of the road.",
  robots: { index: true, follow: true },
};

// Last updated date for the terms. Bump whenever the substance changes.
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <BackButton fallbackHref="/" label="Back" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground" />
      <p className="text-xs uppercase tracking-[0.24em] text-brass">Legal</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">In plain language</p>
        <p className="mt-2">
          SŌMA helps you find cannabis flower that fits your taste. It is a guide,
          not a guarantee, not medical advice, and not a shop — we don&apos;t
          sell cannabis or help you buy it. You must be of legal age and follow
          the laws where you live.
        </p>
      </div>

      <Section title="1. Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) are a binding agreement
          between you and {OPERATOR} (&quot;SŌMA&quot;, &quot;we&quot;,
          &quot;us&quot;). By accessing or using SŌMA, you agree to these Terms.
          If you do not agree, do not use the service.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>
          You may use SŌMA only if you are an adult of legal age to access
          cannabis information where you live (21+ in most places) and only where
          doing so is lawful. By using SŌMA you confirm that you meet this
          requirement. SŌMA is not intended for minors.
        </p>
      </Section>

      <Section title="3. What SŌMA is — and isn't">
        <p>
          SŌMA is a <span className="font-medium text-foreground">sensory
          guidance tool</span>. It estimates how well a strain may fit your
          stated taste preferences. It is informational only.
        </p>
        <p>SŌMA is explicitly not:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            a marketplace — we do not sell, supply, or facilitate the purchase of
            cannabis or any other product;
          </li>
          <li>
            medical, health, or professional advice — nothing here is a
            substitute for a qualified professional;
          </li>
          <li>
            a guarantee of quality, effect, safety, or legality of any strain.
          </li>
        </ul>
        <p>
          Real-world quality depends on the grower, freshness, packaging date,
          and storage, none of which SŌMA can verify. You are responsible for
          your own choices and for complying with all laws that apply to you.
        </p>
      </Section>

      <Section title="4. Your account">
        <p>
          You can use SŌMA anonymously or create an account. If you register, you
          are responsible for keeping your credentials secure and for activity
          under your account. Provide accurate information, and let us know if you
          suspect unauthorised access. You can delete your account at any time
          from your{" "}
          <Link href="/account" className="text-accent hover:underline">
            account page
          </Link>
          .
        </p>
      </Section>

      <Section title="5. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>use SŌMA for any unlawful purpose or in any unlawful place;</li>
          <li>
            attempt to disrupt, reverse-engineer, scrape at scale, or gain
            unauthorised access to the service or its data;
          </li>
          <li>
            misuse the service to harm, harass, or impersonate others, or to
            submit content you have no right to submit.
          </li>
        </ul>
      </Section>

      <Section title="6. Your content">
        <p>
          Your sensory profile, notes, and the menus you analyse remain yours. By
          submitting them, you grant us a limited licence to store and process
          them solely to operate and improve SŌMA for you, as described in our{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
          . We do not claim ownership of your content.
        </p>
      </Section>

      <Section title="7. Service &quot;as is&quot;">
        <p>
          SŌMA is provided on an &quot;as is&quot; and &quot;as available&quot;
          basis, without warranties of any kind, whether express or implied,
          including fitness for a particular purpose and accuracy of
          recommendations. We do not warrant that the service will be
          uninterrupted, error-free, or that any match will meet your
          expectations.
        </p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by law, SŌMA and its operator will not
          be liable for any indirect, incidental, or consequential damages, or
          for any decision you make based on the information SŌMA provides. Your
          use of cannabis, and any consequences of it, are your responsibility.
        </p>
      </Section>

      <Section title="9. Suspension and termination">
        <p>
          We may suspend or end access to SŌMA, in whole or in part, at any time
          — for example, to comply with the law, to protect the service, or in
          response to misuse. You may stop using SŌMA and delete your account at
          any time.
        </p>
      </Section>

      <Section title="10. Changes to these Terms">
        <p>
          We may update these Terms as the product changes. When we make material
          changes, we will update the date above and, where appropriate, notify
          you in the app. Continuing to use SŌMA after changes take effect means
          you accept the updated Terms.
        </p>
      </Section>

      <Section title="11. Governing law">
        <p>
          These Terms are governed by the laws of {JURISDICTION}, without regard
          to conflict-of-laws rules. Nothing in these Terms limits any rights you
          have that cannot be waived under the law that applies to you.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about these Terms? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <p className="mt-12 text-sm text-muted-foreground">
        See also our{" "}
        <Link href="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
