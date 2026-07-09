"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/data";
import { useLang } from "@/components/LangProvider";
import { productName, productShortDescription } from "@/lib/product-i18n";
import { useCart } from "@/lib/cart/cart-context";
import BuyNowButton from "@/components/cart/BuyNowButton";

type Props = {
  product: Product;
};

export default function ProductInfo({ product }: Props) {
  const { locale } = useLang();
  const name = productName(product, locale);
  const onSale = product.comparePrice > product.price;
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "details" | "shipping">("description");
  const [longDesc, setLongDesc] = useState<string | null>(null);
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const sizes = product.sizes ?? [];
  const needsSize = sizes.length > 0;
  const [size, setSize] = useState<string | undefined>(undefined);
  const [sizeError, setSizeError] = useState(false);

  const cartLine = {
    productId: product.id,
    slug: product.slug ?? String(product.id),
    name,
    image: product.image,
    price: product.price,
    size,
  };

  const onAddToCart = () => {
    if (needsSize && !size) {
      setSizeError(true);
      return;
    }
    add(cartLine, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  useEffect(() => {
    let alive = true;
    fetch(`/api/product/${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setLongDesc(data.description ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [product.id]);

  const description =
    longDesc || productShortDescription(product, locale) || null;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Heading */}
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-dark">
          {product.category}
        </p>
        <h1
          className="mt-2 text-[28px] font-extrabold leading-tight text-ink md:text-[36px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {name}
        </h1>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-[13px] text-slate">
          <span aria-label="5 out of 5" className="flex items-center gap-0.5 text-[#F4B73E]">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </span>
          <span className="font-bold text-ink">4.9</span>
          <span>·</span>
          <a href="#reviews" className="hover:text-orange-dark">128 reviews</a>
          <span>·</span>
          <span className="text-[12px]">SKU #{product.id}</span>
        </div>
      </div>

      {/* Price card */}
      <div
        className="rounded-2xl bg-cream p-5"
        style={{ border: "1px solid rgba(194, 65, 12, 0.10)" }}
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[36px] font-extrabold leading-none text-ink">
            {product.price}€
          </span>
          {onSale && (
            <>
              <span
                className="text-[18px] font-bold leading-none text-slate line-through"
                style={{ textDecorationThickness: "2px" }}
              >
                {product.comparePrice}€
              </span>
              <span className="rounded bg-[#E55B47] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-pearl">
                Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </span>
            </>
          )}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#047857]">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          In stock — ships within 24 hours
        </p>
      </div>

      {/* Size selector */}
      {needsSize && (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-ink">
              {locale === "sl" ? "Velikost" : "Size"}
              {size && <span className="ml-2 font-bold text-orange-dark">{size}</span>}
            </p>
            {sizeError && !size && (
              <span className="text-[12px] font-bold text-[#E55B47]">
                {locale === "sl" ? "Izberite velikost" : "Please choose a size"}
              </span>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {sizes.map((s) => {
              const selected = s === size;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={selected}
                  className={[
                    "min-w-[3rem] rounded-full border px-4 py-2.5 text-[13px] font-bold transition-colors",
                    selected
                      ? "border-orange bg-orange text-pearl"
                      : "border-orange-dark/25 bg-pearl text-ink hover:border-orange-dark/50",
                  ].join(" ")}
                  style={selected ? { color: "#FFFFFF" } : undefined}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + CTAs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-orange-dark/25 bg-pearl">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid h-12 w-12 place-items-center rounded-l-full text-ink hover:bg-orange/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="min-w-[2.5rem] text-center text-[15px] font-extrabold text-ink">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="grid h-12 w-12 place-items-center rounded-r-full text-ink hover:bg-orange/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex-1 rounded-full bg-ink px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
          style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
        >
          <span style={{ color: "#FFFFFF" }}>{added ? "Dodano ✓" : "Dodaj v košarico"}</span>
        </button>
        <BuyNowButton
          product={cartLine}
          disabled={needsSize && !size}
          onDisabledClick={() => setSizeError(true)}
        />
        <button
          type="button"
          aria-label="Add to wishlist"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-orange-dark/25 bg-pearl text-orange-dark transition-colors hover:bg-orange hover:text-pearl"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Trust badges */}
      <ul className="grid grid-cols-2 gap-3 text-[12px] font-semibold text-ink/85 md:grid-cols-4">
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>Child-safe</span>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="14" height="11" rx="1" />
            <path d="M15 9h4l3 4v4h-7V9Z" />
            <circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" />
          </svg>
          <span>Free in Slovenia</span>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9" />
            <path d="m3 12 4-4M3 12l4 4" />
          </svg>
          <span>30-day returns</span>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M16 11h-3v3" />
            <circle cx="9" cy="12" r="2" />
          </svg>
          <span>Secure checkout</span>
        </li>
      </ul>

      {/* Tabs */}
      <div className="mt-2">
        <div className="flex flex-wrap items-center gap-1 border-b border-orange-dark/15">
          {(["description", "details", "shipping"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "relative px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider transition-colors",
                tab === t ? "text-ink" : "text-slate hover:text-ink",
              ].join(" ")}
            >
              {t === "description"
                ? "Description"
                : t === "details"
                ? "Details"
                : "Shipping & returns"}
              {tab === t && (
                <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-orange" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {tab === "description" && (
            description ? (
              <div
                className="prose prose-sm max-w-none text-[14px] leading-relaxed text-ink/85 [&_p]:my-3 [&_strong]:text-ink md:text-[15px]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-[14px] leading-relaxed text-slate">
                {name} — {product.category.toLowerCase()}.
              </p>
            )
          )}
          {tab === "details" && (
            <ul className="flex flex-col gap-3 text-[14px] text-ink/85">
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">SKU</span>
                <span className="font-semibold">#{product.id}</span>
              </li>
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Category</span>
                <span className="font-semibold">{product.category}</span>
              </li>
              {product.categories && product.categories.length > 0 && (
                <li className="grid grid-cols-[120px_1fr] gap-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Tags</span>
                  <span className="flex flex-wrap gap-1.5">
                    {product.categories.slice(0, 12).map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink/75"
                      >
                        {c}
                      </span>
                    ))}
                  </span>
                </li>
              )}
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Materials</span>
                <span className="font-semibold">OEKO-TEX certified, non-toxic finishes</span>
              </li>
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Care</span>
                <span className="font-semibold">Machine-washable at 30°C, do not bleach</span>
              </li>
            </ul>
          )}
          {tab === "shipping" && (
            <ul className="flex flex-col gap-3 text-[14px] leading-relaxed text-slate md:text-[15px]">
              <li>
                <strong className="text-ink">Delivery:</strong> 1–2 business days in Slovenia,
                3–5 days across the EU, 5–10 worldwide. Free throughout Slovenia.
              </li>
              <li>
                <strong className="text-ink">Returns:</strong> 30 days, unworn with tags
                attached. Prepaid label provided.
              </li>
              <li>
                <strong className="text-ink">Packaging:</strong> Reusable cream gift box
                with hand-tied ribbon — no extra cost.
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
