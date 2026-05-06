// Imports lib/products.json + lib/categories.json into Supabase.
// Idempotent: re-running upserts and replaces gallery + category links.
//
// Usage:
//   node scripts/import-products-to-supabase.mjs
//
// Requires:
//   NEXT_PUBLIC_SUPABASE_URL  (in .env.local)
//   SUPABASE_SERVICE_ROLE_KEY (in .env.local)
//   The schema in supabase/schema.sql must be applied first.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(here, "..");

// Load .env.local manually (no extra deps).
async function loadEnv() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Inlined from lib/age.ts so we can run as plain mjs without ts compile.
function extractAge(text) {
  if (!text) return undefined;
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const lower = plain.toLowerCase();
  const range = lower.match(/from\s+(\d+)\s*(?:to|-|–)\s*(\d+)\s*(year|yr|y|month|mo|m)s?/i);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    const y = /^y/.test(range[3]);
    return { minMonths: y ? a * 12 : a, maxMonths: y ? b * 12 : b };
  }
  const dash = lower.match(/(\d+)\s*(?:-|–|to)\s*(\d+)\s*(year|yr|y|month|mo|m)s?\b/i);
  if (dash) {
    const a = Number(dash[1]);
    const b = Number(dash[2]);
    const y = /^y/.test(dash[3]);
    return { minMonths: y ? a * 12 : a, maxMonths: y ? b * 12 : b };
  }
  const plus = lower.match(/\+\s*(\d+)\s*(year|yr|y|month|mo|m)s?\b/i);
  if (plus) {
    const a = Number(plus[1]);
    const y = /^y/.test(plus[2]);
    return { minMonths: y ? a * 12 : a };
  }
  if (/\bnewborn|infant\b/.test(lower)) return { minMonths: 0, maxMonths: 12 };
  if (/\bbab(y|ies)\b/.test(lower)) return { minMonths: 0, maxMonths: 18 };
  if (/\btoddler/.test(lower)) return { minMonths: 12, maxMonths: 36 };
  if (/\bpreschool/.test(lower)) return { minMonths: 36, maxMonths: 60 };
  return undefined;
}

await loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const products = JSON.parse(await readFile(path.join(root, "lib", "products.json"), "utf8"));
const categories = JSON.parse(await readFile(path.join(root, "lib", "categories.json"), "utf8"));
let mainImageOverrides = {};
try {
  mainImageOverrides = JSON.parse(await readFile(path.join(root, "lib", "main-images.json"), "utf8"));
} catch {}

console.log(`→ Importing ${categories.length} categories and ${products.length} products`);

// 1) Categories — collect every distinct one (from list + per-product), upsert.
const allCategoryNames = new Set(categories.filter((c) => c && c !== "All"));
for (const p of products) {
  for (const c of p.categories ?? []) if (c) allCategoryNames.add(c);
}
const catRows = Array.from(allCategoryNames).map((name, i) => ({
  slug: slugify(name),
  name_en: name,
  position: i,
}));

const { data: catData, error: catErr } = await supabase
  .from("categories")
  .upsert(catRows, { onConflict: "slug" })
  .select("id, slug");
if (catErr) {
  console.error("Category upsert failed:", catErr);
  process.exit(1);
}
const catIdBySlug = new Map(catData.map((r) => [r.slug, r.id]));
console.log(`✓ ${catData.length} categories upserted`);

// 2) Products — upsert by woo_id, then refresh gallery + category links.
let okCount = 0;
let failCount = 0;
for (const p of products) {
  const overrideImg = mainImageOverrides[String(p.id)];
  const mainImage = overrideImg ?? p.image ?? null;
  const age = extractAge(p.shortDescription);

  const productRow = {
    woo_id: p.id,
    slug: p.slug ?? slugify(p.name),
    name_en: p.name,
    name_sl: p.name_sl ?? null,
    short_description_en: p.shortDescription ?? null,
    short_description_sl: p.shortDescription_sl ?? null,
    price: p.price,
    compare_price: p.comparePrice ?? null,
    currency: "EUR",
    image: mainImage,
    badge: p.badge ?? null,
    emoji: p.emoji ?? null,
    stock_status: p.stockStatus ?? "instock",
    age_min_months: age?.minMonths ?? null,
    age_max_months: age?.maxMonths ?? null,
    permalink_en: p.permalink ?? null,
    permalink_sl: p.permalink_sl ?? null,
    is_published: true,
  };

  const { data: upserted, error: pErr } = await supabase
    .from("products")
    .upsert(productRow, { onConflict: "woo_id" })
    .select("id")
    .single();
  if (pErr) {
    console.error(`✗ ${p.name}:`, pErr.message);
    failCount++;
    continue;
  }
  const productId = upserted.id;

  // Refresh gallery
  await supabase.from("product_images").delete().eq("product_id", productId);
  const galleryRows = (p.images ?? [])
    .filter(Boolean)
    .map((u, position) => ({ product_id: productId, url: u, position }));
  if (galleryRows.length > 0) {
    const { error: gErr } = await supabase.from("product_images").insert(galleryRows);
    if (gErr) console.warn(`  ! gallery for ${p.name}:`, gErr.message);
  }

  // Refresh category links
  await supabase.from("product_categories").delete().eq("product_id", productId);
  const linkRows = (p.categories ?? [])
    .map((name) => catIdBySlug.get(slugify(name)))
    .filter(Boolean)
    .map((category_id) => ({ product_id: productId, category_id }));
  if (linkRows.length > 0) {
    const { error: lErr } = await supabase.from("product_categories").insert(linkRows);
    if (lErr) console.warn(`  ! categories for ${p.name}:`, lErr.message);
  }

  okCount++;
  if (okCount % 10 === 0) console.log(`  ${okCount}/${products.length}…`);
}

console.log(`\nDone. ${okCount} ok, ${failCount} failed.`);
