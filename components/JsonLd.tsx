// Renders a JSON-LD structured-data block. Server component (no client JS).
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, server-built JSON — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
