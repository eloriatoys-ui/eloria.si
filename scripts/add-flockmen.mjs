// Adds the Flockmen range (6 products) to Supabase.
// Prices are the client's final retail prices incl. 22 % VAT — no discounts.
// Idempotent: re-running upserts on woo_id and refreshes the galleries.
//
// The two sticker products have no photos yet, so they are created as drafts
// (is_published: false). Add images in /admin and publish them there.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(here, "..");

async function loadEnv() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
await loadEnv();

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// Images live in public/catalog/eloria/<base>.webp, <base>-2.webp, …
const gallery = (base, n) =>
  Array.from({ length: n }, (_, i) => `/catalog/eloria/${base}${i ? `-${i + 1}` : ""}.webp`);

const common = `<p><strong>Kaj je v kompletu:</strong></p>`;
const why = `<p><strong>Zakaj jih otroci in starši vzljubijo:</strong></p>
<ul>
  <li>naravni les in otrokom varne, nestrupene površinske obdelave</li>
  <li>izdelano v Evropi</li>
  <li>odprta igra po navdihu metode Montessori — ni pravil, le domišljija</li>
  <li>razvija fino motoriko, ravnotežje, koncentracijo in prostorsko predstavo</li>
</ul>
<p><em>Opozorilo: vsebuje majhne dele. Ni primerno za otroke, mlajše od 3 let.</em></p>`;

const PRODUCTS = [
  {
    woo_id: 100006,
    slug: "flockmen-half-flock-16-lesenih-figuric",
    name_en: "Flockmen Half Flock – 16 Wooden Figures",
    name_sl: "Flockmen Half Flock – 16 lesenih figuric",
    price: 37.9,
    images: gallery("flockmen-half-flock", 3),
    published: true,
    description_sl: `<p><strong>Mala jata, velike zgodbe.</strong> Flockmen so lesene figurice, ki se zlagajo, prepletajo in nalagajo ena na drugo — v stolpe, mostove, krožne vzorce ali cele vasi. Komplet s 16 figuricami je popoln začetek za male graditelje.</p>
${common}
<ul>
  <li>16 lesenih figuric Flockmen v naravni barvi lesa</li>
  <li>bombažna vrečka za shranjevanje</li>
  <li>kartica z idejami za igro</li>
</ul>
${why}`,
  },
  {
    woo_id: 100007,
    slug: "flockmen-full-flock-32-lesenih-figuric",
    name_en: "Flockmen Full Flock – 32 Wooden Figures",
    name_sl: "Flockmen Full Flock – 32 lesenih figuric",
    price: 57.9,
    images: gallery("flockmen-full-flock", 4),
    published: true,
    description_sl: `<p><strong>Cela jata za največje gradnje.</strong> Z 32 figuricami Flockmen otroci gradijo visoke stolpe, dolge verige in prave lesene svetove — sami ali skupaj s sorojenci in prijatelji.</p>
${common}
<ul>
  <li>32 lesenih figuric Flockmen v naravni barvi lesa</li>
  <li>bombažna vrečka za shranjevanje</li>
  <li>kartice z idejami za igro</li>
</ul>
${why}`,
  },
  {
    woo_id: 100008,
    slug: "flockmen-barvni-27-lesenih-figuric",
    name_en: "Colored Flockmen – 27 Wooden Figures",
    name_sl: "Barvni Flockmen – 27 lesenih figuric",
    price: 61.9,
    images: gallery("flockmen-colored", 5).map((u) =>
      u.endsWith("-4.webp") ? "/catalog/eloria/flockmen-colored-box.webp" : u,
    ),
    published: true,
    description_sl: `<p><strong>Mavrica, ki jo zgradiš sam.</strong> 27 figuric Flockmen v toplih, naravnih barvah odpre še več možnosti: razvrščanje po barvah, vzorci, barvni stolpi in igra vlog.</p>
${common}
<ul>
  <li>27 barvnih lesenih figuric Flockmen</li>
  <li>bombažna vrečka za shranjevanje</li>
  <li>kartice z idejami za igro</li>
</ul>
${why}`,
  },
  {
    woo_id: 100009,
    slug: "flockmen-skin-tone-15-lesenih-figuric",
    name_en: "Flockmen Skin Tone – 15 Wooden Figures",
    name_sl: "Flockmen Skin Tone – 15 lesenih figuric v odtenkih kože",
    price: 45.9,
    images: gallery("flockmen-skin-tone", 4),
    published: true,
    description_sl: `<p><strong>Vsak je del jate.</strong> 15 figuric Flockmen v različnih odtenkih kože — za igro, ki odraža raznolikost sveta okoli nas in otroke nežno uči, da smo si različni, a skupaj močnejši.</p>
${common}
<ul>
  <li>15 lesenih figuric Flockmen v odtenkih kože</li>
  <li>bombažna vrečka za shranjevanje</li>
  <li>kartice z idejami za igro</li>
</ul>
${why}`,
  },
  {
    woo_id: 100010,
    slug: "flockmen-nalepke-za-personalizacijo",
    name_en: "Flockmen Personalisation Stickers",
    name_sl: "Flockmen nalepke za personalizacijo",
    price: 7.9,
    images: [],
    published: false,
    description_sl: `<p>Nalepke, s katerimi vsaka figurica Flockmen dobi svojo osebnost. Otroci lahko svoje figurice označijo, jim dajo vloge in ustvarijo lastne junake za svoje zgodbe.</p>
<p><em>Figurice Flockmen niso vključene.</em></p>`,
  },
  {
    woo_id: 100011,
    slug: "flockmen-barvne-nalepke",
    name_en: "Flockmen Color Stickers",
    name_sl: "Flockmen barvne nalepke",
    price: 7.9,
    images: [],
    published: false,
    description_sl: `<p>Barvne nalepke za figurice Flockmen — za razvrščanje po barvah, ekipe, igre in nove načine gradnje.</p>
<p><em>Figurice Flockmen niso vključene.</em></p>`,
  },
];

for (const p of PRODUCTS) {
  const row = {
    woo_id: p.woo_id,
    slug: p.slug,
    name_en: p.name_en,
    name_sl: p.name_sl,
    short_description_en: null,
    short_description_sl: p.description_sl,
    price: p.price,
    compare_price: null,
    currency: "EUR",
    image: p.images[0] ?? null,
    badge: "NOVO",
    emoji: "🎁",
    stock_status: "instock",
    age_min_months: 36,
    age_max_months: null,
    is_published: p.published,
  };

  const { data, error } = await sb
    .from("products")
    .upsert(row, { onConflict: "woo_id" })
    .select("id")
    .single();
  if (error) {
    console.error(`✗ ${p.name_sl}:`, error.message);
    process.exitCode = 1;
    continue;
  }

  await sb.from("product_images").delete().eq("product_id", data.id);
  if (p.images.length) {
    const { error: gErr } = await sb
      .from("product_images")
      .insert(p.images.map((u, position) => ({ product_id: data.id, url: u, position })));
    if (gErr) console.warn("  ! gallery:", gErr.message);
  }

  console.log(
    `✓ ${p.name_sl} — €${p.price.toFixed(2)}, ${p.images.length} slik${p.published ? "" : " (osnutek)"}`,
  );
}
