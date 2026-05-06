// Adds the 5 new Eloria products from NEW PRODUCTS.docx into Supabase.
// Idempotent: re-running upserts.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(here, "..");

async function loadEnv() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
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

// Image dir served from /public — images already copied to public/catalog/eloria/
const IMG = (n) => `/catalog/eloria/image${n}.jpeg`;

const PRODUCTS = [
  {
    woo_id: 100001,
    slug: "ai-mini-thermal-printer",
    name_en: "AI Mini Thermal Printer with Voice Control",
    name_sl: "AI mini termalni tiskalnik z glasovnim upravljanjem – pametni žepni tiskalnik",
    price: 34.90,
    compare_price: null,
    age_min_months: 72, // 6+ years
    age_max_months: null,
    images: [1, 2, 3, 4],
    description_sl: `<p>AI žepni termalni tiskalnik, ki ga boš uporabljal vsak dan. Pozabi na drage kartuše, zapletene nastavitve in velike naprave. Ta mini tiskalnik je narejen za <strong>takojšnje ideje, hitro ustvarjanje in zabavo</strong> – kjerkoli si.</p>
<p><strong>Predstavljaj si:</strong><br>v 5 sekundah natisneš svojo fotografijo, seznam opravil, nalepko za zvezek ali zabavno sporočilo… kar direktno iz telefona ali celo z glasom.</p>
<p><strong>Kaj vse lahko delaš z njim:</strong></p>
<ul>
  <li>tiskaš fotke za spomine</li>
  <li>ustvarjaš nalepke</li>
  <li>organiziraš zapiske (šola, služba)</li>
  <li>delaš »cute« journaling</li>
  <li>zabavaš otroke ali prijatelje</li>
  <li>narediš unikatna mini darila</li>
</ul>
<p>Vzemi zdaj in začni tiskati svoje ideje v nekaj sekundah.</p>`,
  },
  {
    woo_id: 100002,
    slug: "wooden-magnetic-color-counting-game",
    name_en: "Wooden Magnetic Game for Colors, Counting and Motor Skills",
    name_sl: "Lesena magnetna igra za učenje barv, štetja in motorike za otroke",
    price: 29.90,
    compare_price: null,
    age_min_months: 36,
    age_max_months: 72,
    images: [5, 6, 7],
    description_sl: `<p><strong>Učna igra, ki otroka zabava… in hkrati uči.</strong> Pozabi na zaslone in brezciljno igranje. Ta magnetna igra je zasnovana tako, da otrok skozi igro razvija <strong>logiko, koncentracijo in fino motoriko</strong> – popolnoma naravno.</p>
<p>Ko otrok prvič prime magnetno pisalo… se začne igra, ki ga dejansko pritegne. Premikanje barvnih kroglic po labirintu ustvarja občutek uspeha, radovednosti in fokusa — brez da bi se tega sploh zavedal.</p>
<p>To ni še ena stvar, ki bo po dveh dneh pozabljena v kotu. To je igra, ki otroka res potegne noter — in ga hkrati razvija.</p>
<p><strong>Ko se otrok igra… se v resnici uči:</strong></p>
<ul>
  <li>izboljšuje koncentracijo</li>
  <li>razvija fino motoriko</li>
  <li>spodbuja logično razmišljanje</li>
  <li>uči barve in štetje</li>
</ul>`,
  },
  {
    woo_id: 100003,
    slug: "didactic-finger-counting-game",
    name_en: "Didactic Finger Counting Game",
    name_sl: "Didaktična igra za učenje štetja s prsti",
    price: 19.90,
    compare_price: null,
    age_min_months: 36,
    age_max_months: 72,
    images: [8, 9, 10],
    description_sl: `<p><strong>Naj otrok vzljubi matematiko že danes!</strong></p>
<p>Se vaš otrok dolgočasi ob številkah ali hitro izgubi zanimanje? S tem matematičnim kompletom se učenje spremeni v pravo zabavo!</p>
<p>Barvite »rokice« in številke otroku omogočajo, da <strong>računa s prsti na vizualen in otipljiv način</strong>, kar mu pomaga hitreje razumeti seštevanje in odštevanje – brez pritiska in brez solz.</p>
<p><strong>Učenje skozi igro, ki deluje.</strong> Ta didaktična igra temelji na <strong>Montessori metodi</strong>, kjer otrok:</p>
<ul>
  <li>sam raziskuje in odkriva rešitve</li>
  <li>razvija logično razmišljanje</li>
  <li>izboljšuje koncentracijo in motoriko</li>
  <li>gradi samozavest pri učenju</li>
</ul>
<p><strong>Zakaj starši takoj opazijo spremembo?</strong></p>
<ul>
  <li>več zanimanja za učenje</li>
  <li>manj odpora do matematike</li>
  <li>hitrejše razumevanje osnov</li>
  <li>več samozavesti pri reševanju nalog</li>
</ul>
<p>To ni samo igrača – je orodje, ki gradi temelje za šolski uspeh.</p>`,
  },
  {
    woo_id: 100004,
    slug: "wooden-didactic-activity-board",
    name_en: "Wooden Didactic Activity Board for Fine Motor Skills",
    name_sl: "Lesena didaktična aktivnostna tabla za razvoj fine motorike",
    price: 32.90,
    compare_price: null,
    age_min_months: 12,
    age_max_months: 48,
    images: [11, 12],
    description_sl: `<p>Imate doma radovednega malčka, ki želi raziskovati vse okoli sebe? Ta čudovita aktivnostna tabla je ustvarjena prav za to – <strong>varno raziskovanje, učenje in zabavo v enem!</strong></p>
<p>Otrok lahko vrti volan, premika stikala, odpira vratca, premika gumbe in raziskuje različne mehanizme – tako razvija ključne spretnosti skozi igro.</p>
<p><strong>To ni le igrača – to je mini svet odkrivanja!</strong></p>
<p><strong>Vsak element ima svoj namen:</strong></p>
<ul>
  <li>volan spodbuja domišljijsko igro</li>
  <li>stikala učijo vzrok–posledica</li>
  <li>drsniki in gumbi razvijajo natančnost prstov</li>
</ul>
<p><strong>Zakaj je boljša od drugih podobnih izdelkov?</strong></p>
<ul>
  <li>premišljena Montessori zasnova (ni naključnih elementov)</li>
  <li>dovolj raznolika, da se je otrok ne naveliča hitro</li>
  <li>kompaktna – idealna za dom ali potovanja</li>
  <li>estetski lesen dizajn (brez kičastih barv in plastike)</li>
</ul>
<p><strong>Investicija v razvoj, ne le zabavo.</strong> Z vsakim dotikom otrok krepi motoriko, razvija samostojnost, gradi samozavest in se uči reševanja problemov.</p>`,
  },
  {
    woo_id: 100005,
    slug: "sensory-travel-book-bag",
    name_en: "Sensory Travel Book in a Bag",
    name_sl: "Senzorična potovalna knjiga v torbi – zabavna učna aktivnost za malčke",
    price: 32.90,
    compare_price: null,
    age_min_months: 12,
    age_max_months: 60,
    images: [13, 14, 15, 16, 17, 18, 19, 20, 21],
    description_sl: `<p>Poznaš tisti scenarij: »Mami, dolgčas mi je!« — in potem iščeš rešitev? Ta senzorična knjiga v torbi ni le še ena stvar… <strong>je tvoj skrivni adut, ko potrebuješ mir, otrok pa zabavo.</strong></p>
<p><strong>Zakaj jo otroci TAKOJ vzljubijo?</strong> Ker jim daje občutek, da »delajo nekaj pomembnega«:</p>
<ul>
  <li>zapenjajo kot veliki</li>
  <li>razvrščajo kot raziskovalci</li>
  <li>rešujejo kot mali geniji</li>
</ul>
<p>In najboljše? Ne opazijo, da se vmes učijo.</p>
<p><strong>Ena torba = nešteto možnosti.</strong> Vsaka stran prinese novo presenečenje. Ni ponavljanja, ni naveličanosti – samo vedno nova radovednost.</p>
<p><strong>Uporabna v realnih situacijah:</strong></p>
<ul>
  <li>v avtu</li>
  <li>na kosilu</li>
  <li>pri zdravniku</li>
  <li>na potovanju</li>
</ul>
<p><strong>Kaj naredi razliko?</strong> Ni glasna. Ni vsiljiva. Ni odvisna od baterij. Je preprosto… učinkovita.</p>
<p>Vsaka stran skriva novo nalogo, ki otroka pritegne kot magnet:</p>
<ul>
  <li>zapenjanje, vezanje in odpenjanje</li>
  <li>razvrščanje oblik in barv</li>
  <li>sestavljanje in premikanje elementov</li>
  <li>preproste logične naloge</li>
</ul>
<p><strong>Mehka, varna in premišljena.</strong> Narejena iz prijetnih materialov, brez ostrih robov in z elementi, ki so prilagojeni malim rokam. Zadrga in ročaj poskrbita, da jo otrok lahko nosi kar sam – kot svoj mali zaklad.</p>
<p>En izdelek, ki rešuje dolgčas, spodbuja učenje in ti podari nekaj mirnih trenutkov.</p>`,
  },
];

// 1) Upsert "Wooden Toys" category
const { data: catRow, error: catErr } = await sb
  .from("categories")
  .upsert(
    { slug: "wooden-toys", name_en: "Wooden Toys", name_sl: "Lesene igrače", position: 100 },
    { onConflict: "slug" },
  )
  .select("id")
  .single();
if (catErr) {
  console.error("Category upsert failed:", catErr);
  process.exit(1);
}
const woodenToysId = catRow.id;
console.log(`✓ Wooden Toys category id=${woodenToysId}`);

// 2) Upsert each product + gallery + category link
for (const p of PRODUCTS) {
  const productRow = {
    woo_id: p.woo_id,
    slug: p.slug,
    name_en: p.name_en,
    name_sl: p.name_sl,
    short_description_en: null,
    short_description_sl: p.description_sl,
    price: p.price,
    compare_price: p.compare_price,
    currency: "EUR",
    image: IMG(p.images[0]),
    badge: "New",
    emoji: "🎁",
    stock_status: "instock",
    age_min_months: p.age_min_months,
    age_max_months: p.age_max_months,
    is_published: true,
  };

  const { data: up, error: pErr } = await sb
    .from("products")
    .upsert(productRow, { onConflict: "woo_id" })
    .select("id")
    .single();
  if (pErr) {
    console.error(`✗ ${p.name_en}:`, pErr.message);
    continue;
  }
  const pid = up.id;

  // Refresh gallery
  await sb.from("product_images").delete().eq("product_id", pid);
  const gal = p.images.map((n, i) => ({ product_id: pid, url: IMG(n), position: i }));
  const { error: gErr } = await sb.from("product_images").insert(gal);
  if (gErr) console.warn(`  ! gallery:`, gErr.message);

  // Link to Wooden Toys
  await sb.from("product_categories").delete().eq("product_id", pid).eq("category_id", woodenToysId);
  await sb.from("product_categories").insert({ product_id: pid, category_id: woodenToysId });

  console.log(`✓ ${p.name_en} (${p.images.length} images)`);
}

console.log("\nDone.");
