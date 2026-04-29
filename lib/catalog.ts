import fs from "node:fs/promises";
import path from "node:path";
import { products as staticProducts, type Product } from "./data";
import { readSections } from "./sections-server";
import type { SectionKey } from "./sections";
import { extractAge } from "./age";

// Pre-compute parsed age once per process — products.json is a static import.
const PRODUCTS_WITH_AGE: Product[] = (staticProducts as Product[]).map((p) => {
  const age = extractAge(p.shortDescription);
  if (!age) return p;
  return {
    ...p,
    ageMinMonths: age.minMonths,
    ageMaxMonths: age.maxMonths,
  };
});

const OVERRIDES_PATH = path.join(process.cwd(), "lib", "main-images.json");

export type ProductWithGallery = Product & {
  images?: string[];
  mainImage?: string;
};

async function loadOverrides(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function isPublishable(p: Product): boolean {
  const n = p.name?.toLowerCase() ?? "";
  if (n.startsWith("test ") || n.includes("paypal") || n.includes("test product")) {
    return false;
  }
  if (p.stockStatus && p.stockStatus !== "instock") return false;
  return true;
}

export async function getCatalogProducts(): Promise<ProductWithGallery[]> {
  const overrides = await loadOverrides();
  return (PRODUCTS_WITH_AGE as ProductWithGallery[])
    .filter(isPublishable)
    .map((p) => {
      const override = overrides[String(p.id)];
      return override ? { ...p, image: override, mainImage: override } : p;
    });
}

export async function getAllCatalogProducts(): Promise<ProductWithGallery[]> {
  const overrides = await loadOverrides();
  return (PRODUCTS_WITH_AGE as ProductWithGallery[]).map((p) => {
    const override = overrides[String(p.id)];
    return override ? { ...p, image: override, mainImage: override } : p;
  });
}

/**
 * Returns the products manually pinned to a home-page section, in the order
 * they were added. Excludes anything that's no longer publishable. An empty
 * array means "no manual selection — caller should fall back to defaults."
 */
export async function findProductBySlug(
  slug: string,
): Promise<ProductWithGallery | null> {
  const overrides = await loadOverrides();
  const wanted = slug.toLowerCase();
  for (const p of PRODUCTS_WITH_AGE as ProductWithGallery[]) {
    if (p.slug && p.slug.toLowerCase() === wanted) {
      const override = overrides[String(p.id)];
      return override ? { ...p, image: override, mainImage: override } : p;
    }
  }
  // Allow numeric id as a fallback (e.g. /shop/60326)
  const asId = Number(slug);
  if (Number.isFinite(asId)) {
    for (const p of PRODUCTS_WITH_AGE as ProductWithGallery[]) {
      if (p.id === asId) {
        const override = overrides[String(p.id)];
        return override ? { ...p, image: override, mainImage: override } : p;
      }
    }
  }
  return null;
}

export async function getRelatedProducts(
  current: ProductWithGallery,
  limit = 8,
): Promise<ProductWithGallery[]> {
  const overrides = await loadOverrides();
  const sameCategory = (PRODUCTS_WITH_AGE as ProductWithGallery[])
    .filter(
      (p) =>
        p.id !== current.id &&
        isPublishable(p) &&
        p.category === current.category,
    )
    .map((p) => {
      const override = overrides[String(p.id)];
      return override ? { ...p, image: override, mainImage: override } : p;
    })
    .slice(0, limit);

  if (sameCategory.length >= limit) return sameCategory;

  // Fill from any other publishable products if same-category is thin.
  const seen = new Set([current.id, ...sameCategory.map((p) => p.id)]);
  const filler = (PRODUCTS_WITH_AGE as ProductWithGallery[])
    .filter((p) => !seen.has(p.id) && isPublishable(p))
    .map((p) => {
      const override = overrides[String(p.id)];
      return override ? { ...p, image: override, mainImage: override } : p;
    })
    .slice(0, limit - sameCategory.length);

  return [...sameCategory, ...filler];
}

export async function getSectionProducts(
  key: SectionKey,
): Promise<ProductWithGallery[]> {
  const [overrides, sections] = await Promise.all([
    loadOverrides(),
    readSections(),
  ]);
  const ids = sections[key] ?? [];
  if (ids.length === 0) return [];
  const byId = new Map<number, ProductWithGallery>();
  for (const p of PRODUCTS_WITH_AGE as ProductWithGallery[]) {
    byId.set(p.id, p);
  }
  const out: ProductWithGallery[] = [];
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) continue;
    if (!isPublishable(p)) continue;
    const override = overrides[String(p.id)];
    out.push(override ? { ...p, image: override, mainImage: override } : p);
  }
  return out;
}
