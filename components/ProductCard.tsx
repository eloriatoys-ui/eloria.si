"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { useLang } from "./LangProvider";

const badgeColor = (badge: string) => {
  switch (badge) {
    case "NEW":
    case "HOT":
    case "SALE":
      return "#E55B47";
    case "BESTSELLER":
    case "ORGANIC":
      return "#F97316";
    case "LIMITED":
      return "#C2410C";
    default:
      return "#F97316";
  }
};

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const { t } = useLang();
  const onSale = product.comparePrice > product.price;
  const href = product.slug ? `/shop/${product.slug}` : `/shop/${product.id}`;

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-pearl transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid #F4DCB7",
        boxShadow:
          "0 1px 2px rgba(194, 65, 12, 0.06), 0 8px 24px -10px rgba(194, 65, 12, 0.18)",
      }}
    >
      {/* IMAGE → links to product page */}
      <a
        href={href}
        aria-label={product.name}
        className="relative block aspect-square w-full overflow-hidden bg-pearl"
      >
        {product.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: badgeColor(product.badge),
              color: "#FFFFFF",
            }}
          >
            {product.badge}
          </span>
        )}
        {onSale && !product.badge && (
          <span
            className="absolute left-3 top-3 z-10 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "#E55B47", color: "#FFFFFF" }}
          >
            {t("card.sale")}
          </span>
        )}

        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-sand">
            <span className="text-[4rem]">{product.emoji}</span>
          </div>
        )}

        {/* "View product" overlay on hover */}
        <span className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex translate-y-2 items-center justify-center gap-2 rounded-full bg-ink/90 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-pearl opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}>
          <span style={{ color: "#FFFFFF" }}>{t("card.view")}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </span>
      </a>

      {/* BODY */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex items-baseline gap-2">
          {onSale && (
            <span
              className="text-[15px] font-extrabold text-ink line-through opacity-55"
              style={{ textDecorationThickness: "1.5px" }}
            >
              {product.comparePrice}€
            </span>
          )}
          <span className="text-[17px] font-extrabold text-ink">
            {product.price}€
          </span>
        </div>

        {/* Product name → links to product page */}
        <a
          href={href}
          className="mt-2 line-clamp-2 min-h-[2.6em] text-[13px] font-medium leading-snug text-ink transition-colors hover:text-orange-dark"
        >
          {product.name}
        </a>

        {/* See product link + wishlist */}
        <div className="mt-3 flex items-center gap-2">
          <a
            href={href}
            className="flex-1 whitespace-nowrap rounded-full px-3 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-wider text-ink transition-colors hover:text-pearl"
            style={{
              backgroundColor: "#F4B73E",
              letterSpacing: "0.08em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F97316")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F4B73E")}
          >
            {t("card.see")}
          </a>
          <button
            type="button"
            aria-label={liked ? t("card.wish_remove") : t("card.wish_add")}
            onClick={() => setLiked((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform hover:scale-110"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={liked ? "#E55B47" : "none"}
              stroke="#E55B47"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
