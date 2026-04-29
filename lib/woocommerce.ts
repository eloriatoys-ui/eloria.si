// WooCommerce REST API client.
// Set WOOCOMMERCE_STORE_URL / _CONSUMER_KEY / _CONSUMER_SECRET in .env.local
// to enable. When unset (or any error occurs), callers should fall back to
// the static catalog in `lib/data.ts`.

import type { Product } from "./data";

const REVALIDATE_SECONDS = 300; // ISR — refresh catalog every 5 min

type WCImage = { id: number; src: string; alt?: string };
type WCCategory = { id: number; name: string; slug: string };

type WCProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  on_sale: boolean;
  price: string; // current price (sale or regular) as string
  regular_price: string;
  sale_price: string;
  stock_status: string;
  categories: WCCategory[];
  images: WCImage[];
  tags: { name: string }[];
};

function envConfig() {
  const base = process.env.WOOCOMMERCE_STORE_URL?.replace(/\/$/, "");
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!base || !key || !secret) return null;
  return { base, key, secret };
}

// We've baked the catalog locally with `npm run migrate`. Force the page
// to use the static JSON so the site has zero runtime dependency on WP.
// Flip this back to using `envConfig()` if you ever want live fetching again.
export function isWooConfigured(): boolean {
  return false;
}

function _isWooConfigured_unused(): boolean {
  return envConfig() !== null;
}

function basicAuthHeader(key: string, secret: string) {
  const token = Buffer.from(`${key}:${secret}`).toString("base64");
  return `Basic ${token}`;
}

function num(s: string | number | undefined | null): number {
  if (s === undefined || s === null || s === "") return 0;
  const n = typeof s === "number" ? s : Number(s);
  return Number.isFinite(n) ? n : 0;
}

function badgeFromWC(p: WCProduct): string {
  if (p.featured) return "BESTSELLER";
  const lcTags = p.tags?.map((t) => t.name.toLowerCase()) ?? [];
  if (lcTags.includes("new")) return "NEW";
  if (lcTags.includes("hot")) return "HOT";
  if (lcTags.includes("limited")) return "LIMITED";
  if (lcTags.includes("organic")) return "ORGANIC";
  if (p.on_sale) return "SALE";
  return "";
}

function emojiFromCategory(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("animal")) return "🦁";
  if (c.includes("vehicle") || c.includes("car")) return "🚗";
  if (c.includes("puzzle")) return "🧩";
  if (c.includes("block") || c.includes("building")) return "🧱";
  if (c.includes("clothes") || c.includes("apparel")) return "👕";
  if (c.includes("educational") || c.includes("learning")) return "🎓";
  if (c.includes("outdoor")) return "⚽";
  if (c.includes("baby")) return "👶";
  return "🎁";
}

function mapWCToProduct(p: WCProduct): Product {
  const sale = num(p.sale_price);
  const regular = num(p.regular_price);
  const current = num(p.price);
  const price = sale > 0 ? sale : current > 0 ? current : regular;
  const comparePrice = regular > 0 ? regular : price;
  const category = p.categories?.[0]?.name || "Uncategorized";
  const image = p.images?.[0]?.src;
  return {
    id: p.id,
    name: p.name,
    price,
    comparePrice,
    category,
    badge: badgeFromWC(p),
    emoji: emojiFromCategory(category),
    image,
  };
}

/**
 * Fetch all (published, in-stock) products from WooCommerce.
 * Returns [] when env is missing or the request fails — caller decides
 * whether to fall back to a static catalog.
 */
export async function fetchWCProducts(): Promise<Product[]> {
  const cfg = envConfig();
  if (!cfg) return [];

  const url = `${cfg.base}/wp-json/wc/v3/products?per_page=100&status=publish&stock_status=instock`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: basicAuthHeader(cfg.key, cfg.secret) },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(
        `[woocommerce] fetch failed ${res.status} ${res.statusText}`,
      );
      return [];
    }
    const data = (await res.json()) as WCProduct[];
    return data.map(mapWCToProduct);
  } catch (err) {
    console.error("[woocommerce] fetch threw:", err);
    return [];
  }
}

/** Derive a unique, ordered category list from a product array. */
export function deriveCategories(products: Product[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.category && set.add(p.category));
  return ["All", ...Array.from(set)];
}
