import Reveal from "./Reveal";
import { topOffers, type TopOffer } from "@/lib/data";

const themeAccent = {
  sky: "text-orange",
  coral: "text-orange-dark",
  leaf: "text-amber",
} as const;

const themeBg = {
  sky: "bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA]",
  coral: "bg-gradient-to-br from-[#FFEDD5] to-[#FDBA74]",
  leaf: "bg-gradient-to-br from-[#FEF3E2] to-[#FFE4B5]",
} as const;

function DiscountChip({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pearl">
      {label}
    </span>
  );
}

function OfferCard({ offer }: { offer: TopOffer }) {
  const onSale = offer.price !== undefined &&
    offer.comparePrice !== undefined &&
    offer.comparePrice > offer.price;

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-pearl transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid #F4DCB7",
        boxShadow:
          "0 1px 2px rgba(194, 65, 12, 0.06), 0 8px 24px -10px rgba(194, 65, 12, 0.18)",
      }}
    >
      {/* IMAGE — full width, square */}
      <div
        className={`relative aspect-square w-full overflow-hidden ${themeBg[offer.theme]}`}
      >
        {/* Floating sale tag — top-left */}
        {(offer.discountLabel || onSale) && (
          <div className="absolute left-3 top-3 z-10">
            {offer.discountLabel ? (
              <DiscountChip label={offer.discountLabel} />
            ) : onSale ? (
              <DiscountChip
                label={`−${Math.round(
                  ((offer.comparePrice! - offer.price!) /
                    offer.comparePrice!) *
                    100,
                )}%`}
              />
            ) : null}
          </div>
        )}

        {/* 360° chip */}
        {offer.spinLabel && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-pearl/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm backdrop-blur-sm">
            ↻ 360°
          </span>
        )}

        {offer.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.image}
            alt={offer.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span
              className="text-[5.5rem]"
              style={{
                filter: "drop-shadow(0 14px 18px rgba(194, 65, 12, 0.30))",
              }}
            >
              {offer.emoji}
            </span>
          </div>
        )}
      </div>

      {/* INFO — clean typography below the image */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand label */}
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.22em] ${themeAccent[offer.theme]}`}
        >
          {offer.brand}
        </p>

        {/* Product name */}
        <h3
          className="text-[16px] font-bold leading-tight text-ink"
          style={{ letterSpacing: "-0.015em" }}
        >
          {offer.title}
        </h3>

        {/* Subtitle */}
        {offer.subtitle && (
          <p className="text-[12px] leading-relaxed text-slate">
            {offer.subtitle}
          </p>
        )}

        {/* Price row */}
        {offer.price !== undefined && (
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="text-[20px] font-extrabold text-ink"
              style={{ letterSpacing: "-0.02em" }}
            >
              {offer.price} €
            </span>
            {onSale && (
              <span className="text-[12px] font-medium text-slate line-through">
                {offer.comparePrice} €
              </span>
            )}
          </div>
        )}

        {/* CTA — full width, prominent */}
        <a
          href={offer.ctaHref}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[12px] font-bold text-pearl transition-colors hover:bg-orange"
          style={{ color: "#FFFFFF" }}
        >
          <span style={{ color: "#FFFFFF" }}>{offer.ctaLabel}</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function TopOffers() {
  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span className="h-1 w-6 rounded-full bg-orange" />
                Top picks
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                From the catalog
              </h2>
            </div>
            <a
              href="/shop"
              className="hidden items-center gap-1.5 rounded-full border border-orange-dark/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
            >
              Browse all →
            </a>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
          {topOffers.map((o, i) => (
            <Reveal key={o.id} delay={(i % 4) * 90}>
              <OfferCard offer={o} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
