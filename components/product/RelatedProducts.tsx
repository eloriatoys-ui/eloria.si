import type { Product } from "@/lib/data";
import { categoryLabel } from "@/lib/category-i18n";

export default function RelatedProducts({
  products,
  heading = "Morda vam bo všeč",
}: {
  products: Product[];
  heading?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="bg-cream py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              Predlagano
            </p>
            <h2
              className="mt-2 text-[26px] font-extrabold tracking-tight text-ink md:text-[32px]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {heading}
            </h2>
          </div>
          <a
            href="/trgovina"
            className="hidden rounded-full border border-orange-dark/25 px-4 py-2 text-[12px] font-bold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
          >
            Poglej vse izdelke →
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((p) => {
            const onSale = p.comparePrice > p.price;
            const href = p.slug ? `/trgovina/${p.slug}` : `/trgovina/${p.id}`;
            return (
              <a
                key={p.id}
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-pearl transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid #F4DCB7",
                  boxShadow:
                    "0 1px 2px rgba(194, 65, 12, 0.06), 0 8px 24px -10px rgba(194, 65, 12, 0.18)",
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-pearl">
                  {p.badge && (
                    <span
                      className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
                    >
                      {p.badge}
                    </span>
                  )}
                  {onSale && !p.badge && (
                    <span
                      className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: "#E55B47", color: "#FFFFFF" }}
                    >
                      Akcija
                    </span>
                  )}
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-sand">
                      <span className="text-[4rem]">{p.emoji}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                  <div className="flex items-baseline gap-2">
                    {onSale && (
                      <span
                        className="text-[14px] font-extrabold text-ink line-through opacity-55"
                        style={{ textDecorationThickness: "1.5px" }}
                      >
                        {p.comparePrice}€
                      </span>
                    )}
                    <span className="text-[16px] font-extrabold text-ink">
                      {p.price}€
                    </span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-snug text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate">
                    {categoryLabel(p.category)}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
