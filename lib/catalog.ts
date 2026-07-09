import "server-only";
import { cache } from "react";
import { supabaseAdmin } from "./supabase/server";
import type { Product } from "./data";
import { readSections } from "./sections-server";
import type { SectionKey } from "./sections";

export type ProductWithGallery = Product & {
  images?: string[];
  mainImage?: string;
};

type Row = {
  id: number;
  woo_id: number | null;
  slug: string;
  name_en: string;
  name_sl: string | null;
  short_description_en: string | null;
  short_description_sl: string | null;
  price: string | number;
  compare_price: string | number | null;
  image: string | null;
  badge: string | null;
  emoji: string | null;
  stock_status: string;
  sizes: string[] | null;
  age_min_months: number | null;
  age_max_months: number | null;
  permalink_en: string | null;
  permalink_sl: string | null;
  is_published: boolean;
  product_images: { url: string; position: number }[] | null;
  product_categories: { categories: { name_en: string } | null }[] | null;
};

const SELECT = `
  id, woo_id, slug, name_en, name_sl,
  short_description_en, short_description_sl,
  price, compare_price, image, badge, emoji,
  stock_status, sizes, age_min_months, age_max_months,
  permalink_en, permalink_sl, is_published,
  product_images(url, position),
  product_categories(categories(name_en))
`;

function mapRow(r: Row): ProductWithGallery {
  const gallery = (r.product_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((i) => i.url);
  const cats = (r.product_categories ?? [])
    .map((pc) => pc.categories?.name_en)
    .filter((x): x is string => Boolean(x));
  // Public id: prefer woo_id (keeps legacy URL/section refs working),
  // fall back to a high-numbered Supabase id so they don't collide.
  const publicId = r.woo_id ?? 1_000_000 + r.id;
  return {
    id: publicId,
    name: r.name_en,
    price: Number(r.price),
    comparePrice: Number(r.compare_price ?? r.price),
    category: cats[0] ?? "",
    categories: cats,
    badge: r.badge ?? "",
    emoji: r.emoji ?? "",
    image: r.image ?? undefined,
    slug: r.slug,
    stockStatus: r.stock_status,
    sizes: r.sizes ?? [],
    permalink: r.permalink_en ?? undefined,
    shortDescription: r.short_description_en ?? undefined,
    images: gallery,
    mainImage: r.image ?? undefined,
    ageMinMonths: r.age_min_months ?? undefined,
    ageMaxMonths: r.age_max_months ?? undefined,
    name_sl: r.name_sl ?? undefined,
    shortDescription_sl: r.short_description_sl ?? undefined,
    permalink_sl: r.permalink_sl ?? undefined,
  };
}

function isPublishable(name: string): boolean {
  const n = name.toLowerCase();
  if (n.startsWith("test ") || n.includes("paypal") || n.includes("test product"))
    return false;
  return true;
}

export const getCatalogProducts = cache(async (): Promise<ProductWithGallery[]> => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(SELECT)
    .eq("is_published", true)
    .eq("stock_status", "instock")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error || !data) {
    console.error("getCatalogProducts:", error);
    return [];
  }
  return (data as unknown as Row[])
    .filter((r) => isPublishable(r.name_en))
    .map(mapRow);
});

export const getAllCatalogProducts = cache(async (): Promise<ProductWithGallery[]> => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error || !data) {
    console.error("getAllCatalogProducts:", error);
    return [];
  }
  return (data as unknown as Row[]).map(mapRow);
});

export async function findProductBySlug(
  slug: string,
): Promise<ProductWithGallery | null> {
  const wanted = slug.toLowerCase();
  const { data: bySlug } = await supabaseAdmin
    .from("products")
    .select(SELECT)
    .eq("slug", wanted)
    .maybeSingle();
  if (bySlug) return mapRow(bySlug as unknown as Row);

  const asId = Number(slug);
  if (Number.isFinite(asId)) {
    const { data: byWoo } = await supabaseAdmin
      .from("products")
      .select(SELECT)
      .eq("woo_id", asId)
      .maybeSingle();
    if (byWoo) return mapRow(byWoo as unknown as Row);
  }
  return null;
}

export async function getRelatedProducts(
  current: ProductWithGallery,
  limit = 8,
): Promise<ProductWithGallery[]> {
  const all = await getCatalogProducts();
  const same = all
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, limit);
  if (same.length >= limit) return same;
  const seen = new Set([current.id, ...same.map((p) => p.id)]);
  const filler = all
    .filter((p) => !seen.has(p.id))
    .slice(0, limit - same.length);
  return [...same, ...filler];
}

export async function getSectionProducts(
  key: SectionKey,
): Promise<ProductWithGallery[]> {
  const [sections, all] = await Promise.all([
    readSections(),
    getCatalogProducts(),
  ]);
  const ids = sections[key] ?? [];
  if (ids.length === 0) return [];
  const byId = new Map<number, ProductWithGallery>();
  for (const p of all) byId.set(p.id, p);
  const out: ProductWithGallery[] = [];
  for (const id of ids) {
    const p = byId.get(id);
    if (p) out.push(p);
  }
  return out;
}
