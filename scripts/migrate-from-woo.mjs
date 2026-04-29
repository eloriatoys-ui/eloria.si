// scripts/migrate-from-woo.mjs
// Pulls every product from a WooCommerce store via REST API, downloads all
// product images locally, and writes a baked JSON catalog so the site can
// run without WordPress.
//
//   node scripts/migrate-from-woo.mjs
//
// Env (read from .env.local):
//   WOOCOMMERCE_STORE_URL
//   WOOCOMMERCE_CONSUMER_KEY
//   WOOCOMMERCE_CONSUMER_SECRET

import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.local");
const PUBLIC_PRODUCTS = path.join(ROOT, "public", "products");
const PUBLIC_CATALOG_DIR = path.join(ROOT, "public", "catalog"); // for full image set
const OUT_PRODUCTS = path.join(ROOT, "lib", "products.json");
const OUT_CATEGORIES = path.join(ROOT, "lib", "categories.json");

// ── tiny .env.local parser ─────────────────────────────────────────────
async function loadEnv() {
  const raw = await fs.readFile(ENV_PATH, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let value = m[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[m[1]] = value;
  }
  return env;
}

// ── helpers ────────────────────────────────────────────────────────────
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "product";

const num = (s) => {
  if (s === undefined || s === null || s === "") return 0;
  const n = typeof s === "number" ? s : Number(s);
  return Number.isFinite(n) ? n : 0;
};

const badgeFromWC = (p) => {
  if (p.featured) return "BESTSELLER";
  const tags = (p.tags || []).map((t) => (t.name || "").toLowerCase());
  if (tags.includes("new")) return "NEW";
  if (tags.includes("hot")) return "HOT";
  if (tags.includes("limited")) return "LIMITED";
  if (tags.includes("organic")) return "ORGANIC";
  if (p.on_sale) return "SALE";
  return "";
};

const emojiFromCategory = (category) => {
  const c = (category || "").toLowerCase();
  if (c.includes("animal")) return "🦁";
  if (c.includes("vehicle") || c.includes("car")) return "🚗";
  if (c.includes("puzzle")) return "🧩";
  if (c.includes("block") || c.includes("building")) return "🧱";
  if (c.includes("clothes") || c.includes("apparel")) return "👕";
  if (c.includes("educational") || c.includes("learning")) return "🎓";
  if (c.includes("outdoor")) return "⚽";
  if (c.includes("baby")) return "👶";
  return "🎁";
};

function basicAuth(key, secret) {
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

async function fetchAllPages(baseUrl, auth, pathSegment) {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${baseUrl}/wp-json/wc/v3/${pathSegment}?per_page=100&page=${page}`;
    const res = await fetch(url, { headers: { Authorization: auth } });
    if (!res.ok) {
      throw new Error(
        `[woo] ${pathSegment} page ${page} → HTTP ${res.status} ${res.statusText}`,
      );
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return all;
}

async function ensureDir(dir) {
  if (!existsSync(dir)) await fs.mkdir(dir, { recursive: true });
}

async function downloadImage(srcUrl, destPath) {
  if (!srcUrl) return false;
  if (existsSync(destPath)) return true; // already downloaded
  try {
    const res = await fetch(srcUrl);
    if (!res.ok) {
      console.warn(`  [img] HTTP ${res.status} ${srcUrl}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(destPath, buf);
    return true;
  } catch (err) {
    console.warn(`  [img] failed ${srcUrl}: ${err.message}`);
    return false;
  }
}

function extFromUrl(url) {
  try {
    const u = new URL(url);
    const ext = path.extname(u.pathname).toLowerCase().split("?")[0];
    if (
      ext &&
      [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"].includes(
        ext,
      )
    ) {
      return ext;
    }
  } catch {}
  return ".jpg";
}

// ── main ───────────────────────────────────────────────────────────────
async function main() {
  const env = await loadEnv();
  const base = env.WOOCOMMERCE_STORE_URL?.replace(/\/$/, "");
  const key = env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!base || !key || !secret) {
    throw new Error(
      "Missing WOOCOMMERCE_STORE_URL / _CONSUMER_KEY / _CONSUMER_SECRET in .env.local",
    );
  }
  const auth = basicAuth(key, secret);

  console.log(`[woo] store: ${base}`);
  await ensureDir(PUBLIC_PRODUCTS);
  await ensureDir(PUBLIC_CATALOG_DIR);

  // ── categories
  console.log("[woo] fetching categories …");
  const wcCats = await fetchAllPages(base, auth, "products/categories");
  const categories = ["All", ...wcCats.map((c) => c.name).filter(Boolean)];
  await fs.writeFile(OUT_CATEGORIES, JSON.stringify(categories, null, 2));
  console.log(`  → ${wcCats.length} categories saved to lib/categories.json`);

  // ── products
  console.log("[woo] fetching products …");
  const wcProducts = await fetchAllPages(base, auth, "products");
  console.log(`  → ${wcProducts.length} products`);

  const products = [];
  let imgOk = 0;
  let imgSkip = 0;

  for (let i = 0; i < wcProducts.length; i++) {
    const p = wcProducts[i];
    if (p.status !== "publish") continue;

    const sale = num(p.sale_price);
    const regular = num(p.regular_price);
    const current = num(p.price);
    const price = sale > 0 ? sale : current > 0 ? current : regular;
    const comparePrice = regular > 0 ? regular : price;

    const category = p.categories?.[0]?.name || "Uncategorized";
    const slug = slugify(p.slug || p.name || `product-${p.id}`);

    const imagePaths = [];
    if (Array.isArray(p.images) && p.images.length > 0) {
      for (let j = 0; j < p.images.length; j++) {
        const src = p.images[j]?.src;
        if (!src) continue;
        const ext = extFromUrl(src);
        const suffix = j === 0 ? "" : `-${j}`;
        const filename = `${slug}-${p.id}${suffix}${ext}`;
        const destAbs = path.join(PUBLIC_CATALOG_DIR, filename);
        const ok = await downloadImage(src, destAbs);
        if (ok) {
          imagePaths.push(`/catalog/${filename}`);
          imgOk++;
        } else {
          imgSkip++;
        }
      }
    }
    const imagePath = imagePaths[0];

    products.push({
      id: p.id,
      name: p.name,
      slug,
      price,
      comparePrice,
      category,
      categories: p.categories?.map((c) => c.name) || [],
      badge: badgeFromWC(p),
      emoji: emojiFromCategory(category),
      image: imagePath,
      images: imagePaths,
      stockStatus: p.stock_status || "instock",
      permalink: p.permalink,
      shortDescription: p.short_description,
    });

    if ((i + 1) % 25 === 0) {
      console.log(`  … ${i + 1}/${wcProducts.length}`);
    }
  }

  await fs.writeFile(OUT_PRODUCTS, JSON.stringify(products, null, 2));
  console.log(`  → ${products.length} products saved to lib/products.json`);
  console.log(`  → images: ${imgOk} downloaded, ${imgSkip} skipped/failed`);

  console.log("\n✓ migration complete");
}

main().catch((err) => {
  console.error("\n✗ migration failed:", err);
  process.exit(1);
});
