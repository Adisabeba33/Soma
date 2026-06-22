// Renders a structured-data <script type="application/ld+json"> block from a
// plain object. Server component (no client JS). Used for Organization markup
// in the layout and Article / FAQPage / BreadcrumbList markup on Learn
// articles, so Google and AI engines can parse our content reliably.
//
// The JSON is serialised with `<` escaped to < so a stray angle bracket
// in any string field can never break out of the <script> tag.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // Structured data is not user-generated; content is escaped above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
