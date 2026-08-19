// Central SEO config + structured-data (JSON-LD) builders.
// Used by the sitemap, robots, root metadata, and product pages so search
// engines and AI answer engines understand the store, its products, and its
// location (Slovenia) consistently.

export const SITE = {
  url: "https://www.eloria.si",
  name: "Eloria",
  legalName: "JENIX GROUP d.o.o.",
  tagline: "Kjer domišljija raste naravno",
  description:
    "Eloria — ročno izdelane lesene igrače in organska otroška oblačila. 100 % naravni materiali, otrokom prijazne obdelave in brezplačna dostava po vsej Sloveniji.",
  locale: "sl_SI",
  language: "sl-SI",
  email: "eloriatoys@gmail.com",
  addressLocality: "Cerklje na Gorenjskem",
  postalCode: "4207",
  country: "SI",
  // Default share image (branded). Swap for a dedicated 1200×630 file later.
  ogImage: "/brand/eloria.webp",
  logo: "/brand/eloria.webp",
  // Social profiles help "same entity" recognition — set the real URLs via env.
  sameAs: [
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  ].filter(Boolean) as string[],
} as const;

/** Turn a /public path or already-absolute URL into an absolute URL. */
export function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return SITE.url + (pathOrUrl.startsWith("/") ? "" : "/") + pathOrUrl;
}

/** Store/Organization — the brand entity, its location and reach. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    image: absoluteUrl(SITE.ogImage),
    description: SITE.description,
    email: SITE.email,
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card, Cash on Delivery",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.addressLocality,
      postalCode: SITE.postalCode,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "Country", name: "Slovenia" },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

/** WebSite entity + a search action (enables the Google sitelinks search box). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.language,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/trgovina?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

type ProductLike = {
  id: number | string;
  name: string;
  price: number;
  comparePrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  stockStatus?: string;
  shortDescription_sl?: string;
  shortDescription?: string;
};

function cleanText(s?: string): string {
  return (s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Product rich result: price, availability, brand, images. */
export function productSchema(product: ProductLike, pageUrl: string) {
  const inStock = (product.stockStatus ?? "instock") === "instock";
  const imgs = (product.images && product.images.length
    ? product.images
    : product.image
    ? [product.image]
    : []
  )
    .map((i) => absoluteUrl(i))
    .filter(Boolean) as string[];
  const desc =
    cleanText(product.shortDescription_sl || product.shortDescription) ||
    `${product.name} — iz Eloria kolekcije.`;
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: desc.slice(0, 300),
    ...(imgs.length ? { image: imgs } : {}),
    sku: String(product.id),
    brand: { "@type": "Brand", name: SITE.name },
    ...(product.category ? { category: product.category } : {}),
    offers: {
      "@type": "Offer",
      url: pageUrl,
      priceCurrency: "EUR",
      price: Number(product.price).toFixed(2),
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": `${SITE.url}/#organization` },
    },
  };
}

/** Breadcrumb trail for a page. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
