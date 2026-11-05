// Creates the "Lesene igrače" (wooden-toys) category — the /lesene-igrace page
// lists every published, in-stock product linked to it — and links the
// wooden products. Idempotent: safe to re-run. New wooden products can also
// be ticked into this category in /admin.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const root = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const raw = await readFile(path.join(root, ".env.local"), "utf8");
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// Product ids (products.id) of the wooden toys.
const WOODEN_IDS = [
  199, // Flockmen Half Flock
  200, // Flockmen Full Flock
  201, // Barvni Flockmen
  202, // Flockmen Skin Tone
  211, // Čarobna morska hišica
  212, // Gozdna družina veveric
  213, // Pravljični ranč – Noelino
  214, // Sedem gozdnih palčkov – Noelino
  215, // Skrivnostna hišica – Noelino
];

const { data: cat, error: catErr } = await sb
  .from("categories")
  .upsert(
    { slug: "wooden-toys", name_en: "Wooden Toys", name_sl: "Lesene igrače", position: 10 },
    { onConflict: "slug" },
  )
  .select("id")
  .single();
if (catErr) {
  console.error("Category upsert failed:", catErr.message);
  process.exit(1);
}
console.log(`✓ Lesene igrače category id=${cat.id}`);

const { data: products, error: pErr } = await sb
  .from("products")
  .select("id, name_sl")
  .in("id", WOODEN_IDS);
if (pErr) {
  console.error("Product lookup failed:", pErr.message);
  process.exit(1);
}

for (const p of products) {
  await sb.from("product_categories").delete().eq("product_id", p.id).eq("category_id", cat.id);
  const { error } = await sb.from("product_categories").insert({ product_id: p.id, category_id: cat.id });
  console.log(error ? `✗ ${p.name_sl}: ${error.message}` : `✓ ${p.name_sl}`);
}
const missing = WOODEN_IDS.filter((id) => !products.some((p) => p.id === id));
if (missing.length) console.warn("! not found:", missing.join(", "));
