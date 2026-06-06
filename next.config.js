/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ];
  },
};

module.exports = nextConfig;
