import { cn } from "@/lib/utils";

// The small uppercase gold label that opens a section ("YOUR COLLECTION",
// "MY ACCOUNT"). One component so tracking and size never drift between
// Home and Account.
export function SectionEyebrow({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  return (
    <Tag
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.24em] text-brass",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
