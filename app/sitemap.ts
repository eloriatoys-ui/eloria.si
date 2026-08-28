import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { SITE } from "@/lib/seo";

// Build the sitemap at request time so it always lists every live product.
// The product read underneath is cached (5 min), so this stays cheap — and
// search engines fetch the sitemap only occasionally.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/trgovina`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/lesene-igrace`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/o-nas`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kontakt`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/sledenje`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  let products: Awaited<ReturnType<typeof getCatalogProducts>> = [];
  try {
    products = await getCatalogProducts();
  } catch {
    // If the DB is briefly unreachable, still return the static routes.
  }

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${base}/trgovina/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes];
}
