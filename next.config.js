/** @type {import('next').NextConfig} */
// Old English product slugs → new Slovenian slugs (generated during the SL
// URL migration). Each entry 301-redirects /shop/<old> → /trgovina/<new>.
const slugRedirects = require("./slug-redirects.json");

const nextConfig = {
  reactStrictMode: true,
  // Ensure the invoice PDF fonts are bundled into the serverless functions
  // that generate invoices (checkout/webhook routes + admin server actions).
  experimental: {
    outputFileTracingIncludes: {
      "/api/**/*": ["./lib/assets/**"],
      "/admin/**/*": ["./lib/assets/**"],
    },
  },
  async redirects() {
    return [
      // Anyone landing on the *.vercel.app deployment URL (e.g. from a stale
      // Google result) is permanently sent to the real domain. This keeps a
      // single canonical site and lets search engines drop the duplicate.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(.*)\\.vercel\\.app" }],
        destination: "https://www.eloria.si/:path*",
        permanent: true,
      },

      // --- Slovenian URL migration (old English URLs → new) ---
      // Product slugs first, so an exact old-slug match wins over the generic
      // /shop/:path* rule below.
      ...slugRedirects,

      // Route folders. The generic /shop/:path* catches unchanged product
      // slugs and legacy numeric ids (/shop/12345 → /trgovina/12345).
      { source: "/shop", destination: "/trgovina", permanent: true },
      { source: "/shop/:path*", destination: "/trgovina/:path*", permanent: true },
      { source: "/cart", destination: "/kosarica", permanent: true },
      { source: "/cart/:path*", destination: "/kosarica/:path*", permanent: true },
      { source: "/checkout", destination: "/blagajna", permanent: true },
      { source: "/about", destination: "/o-nas", permanent: true },
      { source: "/wooden-toys", destination: "/lesene-igrace", permanent: true },
      // /order/success before the generic /order/:path* so it maps to /uspeh.
      { source: "/order/success", destination: "/narocilo/uspeh", permanent: true },
      { source: "/order/:path*", destination: "/narocilo/:path*", permanent: true },
      { source: "/order", destination: "/narocilo", permanent: true },
    ];
  },
};

module.exports = nextConfig;
