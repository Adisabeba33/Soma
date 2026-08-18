import { BackButton } from "@/components/back-button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

// The shell every private-lounge page wears: the graphite theme, the
// editorial container, and — on the sub-pages — a back control that
// returns to the account hub.
//
// The back control prefers real history, so leaving a sub-page lands the
// member exactly where they came from (usually the hub, at the scroll
// position they left it), and falls back to /account on a direct hit.
export function LoungePage({
  eyebrow,
  title,
  intro,
  back = true,
  children,
}: {
  eyebrow: string;
  /** Omitted on the hub, where the member card carries the identity — the
   *  page still gets an h1, visually hidden, so the heading order holds. */
  title?: string;
  intro?: string;
  /** Off for the hub itself, which has nowhere to go back to. */
  back?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-theme="soma-private"
      className="min-h-[calc(100vh-70px)] bg-background sm:min-h-[calc(100vh-76px)]"
    >
      <div className="mx-auto w-full max-w-editorial px-5 pb-20 pt-6 sm:px-8 sm:pt-8">
        {back && (
          <BackButton
            fallbackHref="/account"
            label="Account"
            className="-ml-1 inline-flex min-h-[44px] items-center gap-1.5 pr-2 text-sm text-muted-foreground transition-colors hover:text-brass"
          />
        )}

        <header className={back ? "mt-2" : undefined}>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          {title ? (
            <h1 className="mt-3 font-display text-[2.15rem] font-semibold leading-tight tracking-tight sm:text-4xl">
              {title}
            </h1>
          ) : (
            <h1 className="sr-only">{eyebrow}</h1>
          )}
          {intro && (
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              {intro}
            </p>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
