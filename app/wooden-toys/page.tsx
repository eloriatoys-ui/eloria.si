import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import T from "@/components/T";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wooden toys · Eloria",
  description:
    "Hand-crafted wooden toys made from sustainably sourced natural wood. No plastic, no compromises — just timeless play.",
};

const benefits = [
  { titleKey: "wt.benefits.b1.title", bodyKey: "wt.benefits.b1.body" },
  { titleKey: "wt.benefits.b2.title", bodyKey: "wt.benefits.b2.body" },
  { titleKey: "wt.benefits.b3.title", bodyKey: "wt.benefits.b3.body" },
];

function formatPrice(n: number) {
  return `${n.toFixed(n % 1 === 0 ? 0 : 2)} €`;
}

function ageLabel(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  const fmt = (m: number) =>
    m < 24 ? `${m}m` : `${Math.round(m / 12)}y`;
  if (min != null && max != null) return `${fmt(min)}–${fmt(max)}`;
  if (min != null) return `${fmt(min)}+`;
  return `up to ${fmt(max!)}`;
}

async function loadWoodenToys() {
  // Pull every product that's linked to the "wooden-toys" category.
  const { data: cat } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", "wooden-toys")
    .maybeSingle();
  if (!cat) return [];

  const { data } = await supabaseAdmin
    .from("product_categories")
    .select(
      "products(id, woo_id, slug, name_en, name_sl, price, compare_price, image, badge, age_min_months, age_max_months, stock_status, is_published, created_at)",
    )
    .eq("category_id", cat.id);

  const rows = (data ?? [])
    .map((r: any) => r.products)
    .filter(
      (p: any) => p && p.is_published && p.stock_status === "instock",
    )
    .sort((a: any, b: any) => (a.created_at < b.created_at ? 1 : -1));
  return rows;
}

export default async function WoodenToysPage() {
  const products = await loadWoodenToys();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="relative overflow-hidden bg-wood-dark py-16 text-pearl md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/hero-bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(254, 215, 170, 0.35) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(251, 207, 232, 0.25) 0%, transparent 45%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-2 md:gap-10 md:px-8">
          <Reveal>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-wood-light">
              <span className="h-1 w-6 rounded-full bg-orange" />
              <T id="wt.eyebrow" />
            </p>
            <h1
              className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              <T id="wt.title" />
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-pearl/80 sm:text-lg">
              <T id="wt.subtitle" />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl shadow-lg shadow-orange/30 transition-transform hover:-translate-y-0.5"
              >
                <T id="wt.cta_browse" />
              </a>
              <a
                href="mailto:hello@eloria.si"
                className="inline-flex items-center gap-2 rounded-full border border-pearl/30 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pearl transition-colors hover:bg-pearl hover:text-ink"
              >
                <T id="wt.cta_custom" />
              </a>
            </div>
          </Reveal>

          {/* Kid — desktop only; mobile keeps the original text-focused hero */}
          <Reveal delay={120} className="relative hidden md:block">
            <div
              className="pointer-events-none absolute inset-x-6 bottom-6 top-10 rounded-full opacity-70 blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, transparent 70%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wooden-kid.webp"
              alt="Otrok se igra z leseno igračo"
              className="relative mx-auto w-full max-w-[440px] drop-shadow-2xl lg:max-w-[500px]"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-5 sm:grid-cols-3 md:gap-6">
            {benefits.map((b, i) => (
              <Reveal key={b.titleKey} delay={i * 80}>
                <div className="h-full rounded-3xl bg-pearl p-6 ring-1 ring-orange-dark/10 transition-shadow hover:shadow-lg">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-wood-light text-wood-dark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-ink">
                    <T id={b.titleKey} />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    <T id={b.bodyKey} />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="collection" className="bg-cream pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                  <span className="h-1 w-6 rounded-full bg-orange" />
                  <T id="wt.coll.eyebrow" />
                </p>
                <h2
                  className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  <T id="wt.coll.title" />
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
                  <T id="wt.coll.subtitle" />
                </p>
              </div>
              <p className="text-[12px] font-bold text-ink/60">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            </div>
          </Reveal>

          {products.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-orange-dark/15 bg-pearl p-10 text-center text-ink/70">
              <p className="text-base">No wooden toys in stock right now.</p>
              <Link
                href="/shop"
                className="mt-4 inline-block text-[13px] font-bold text-orange-dark hover:underline"
              >
                Browse the full shop →
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {products.map((p: any, i: number) => {
                const onSale =
                  typeof p.compare_price === "number" &&
                  Number(p.compare_price) > Number(p.price);
                const discount = onSale
                  ? Math.round(
                      ((Number(p.compare_price) - Number(p.price)) /
                        Number(p.compare_price)) *
                        100,
                    )
                  : 0;
                const age = ageLabel(p.age_min_months, p.age_max_months);
                return (
                  <Reveal key={p.id} delay={(i % 4) * 60}>
                    <Link
                      href={`/shop/${p.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-pearl ring-1 ring-orange-dark/10 transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-square overflow-hidden bg-cream">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.name_en}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-7xl">
                            🧸
                          </div>
                        )}

                        {p.badge && (
                          <span className="absolute right-3 top-3 rounded-full bg-orange px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-pearl shadow">
                            {p.badge}
                          </span>
                        )}

                        {onSale && (
                          <span className="absolute bottom-3 right-3 rounded-full bg-wood-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-pearl shadow">
                            −{discount}%
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-dark">
                            Wooden Toys
                          </span>
                          {age && (
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                              {age}
                            </span>
                          )}
                        </div>

                        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-ink">
                          {p.name_sl ?? p.name_en}
                        </h3>

                        <div className="mt-auto flex items-end justify-between gap-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-extrabold text-ink">
                              {formatPrice(Number(p.price))}
                            </span>
                            {onSale && (
                              <span className="text-xs text-ink/40 line-through">
                                {formatPrice(Number(p.compare_price))}
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-pearl">
                            View
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
