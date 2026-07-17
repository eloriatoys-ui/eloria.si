"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/data";
import { useLang } from "@/components/LangProvider";
import { productName, productShortDescription } from "@/lib/product-i18n";
import { useCart } from "@/lib/cart/cart-context";
import BuyNowButton from "@/components/cart/BuyNowButton";
import { categoryLabel } from "@/lib/category-i18n";
import { trackViewContent, trackAddToCart } from "@/lib/meta-pixel";

type Props = {
  product: Product;
};

// EU children's clothing sizes are the child's height in cm. Approximate age
// for each height, used by the on-page size guide. Covers both the round-ten
// sizes we stock (60/70/80…) and standard EU steps (56/62/68…).
const SIZE_AGE: Record<number, { en: string; sl: string }> = {
  50: { en: "newborn", sl: "novorojenček" },
  56: { en: "0–2 mo", sl: "0–2 mes." },
  60: { en: "0–3 mo", sl: "0–3 mes." },
  62: { en: "2–4 mo", sl: "2–4 mes." },
  68: { en: "4–6 mo", sl: "4–6 mes." },
  70: { en: "6–9 mo", sl: "6–9 mes." },
  74: { en: "6–9 mo", sl: "6–9 mes." },
  80: { en: "9–12 mo", sl: "9–12 mes." },
  86: { en: "1–1.5 yr", sl: "1–1,5 leta" },
  90: { en: "1.5–2 yr", sl: "1,5–2 leti" },
  98: { en: "2–3 yr", sl: "2–3 leta" },
  100: { en: "2–3 yr", sl: "2–3 leta" },
  104: { en: "3–4 yr", sl: "3–4 leta" },
  110: { en: "4–5 yr", sl: "4–5 let" },
  116: { en: "5–6 yr", sl: "5–6 let" },
  120: { en: "5–6 yr", sl: "5–6 let" },
  122: { en: "6–7 yr", sl: "6–7 let" },
  128: { en: "7–8 yr", sl: "7–8 let" },
  130: { en: "7–8 yr", sl: "7–8 let" },
  134: { en: "8–9 yr", sl: "8–9 let" },
  140: { en: "9–10 yr", sl: "9–10 let" },
};

function ageForSize(size: string, locale: string): string | null {
  const n = parseInt(size, 10);
  const a = SIZE_AGE[n];
  return a ? (locale === "sl" ? a.sl : a.en) : null;
}

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
  const [showGuide, setShowGuide] = useState(false);
  // EU shoe sizes come prefixed "EU"; everything else in [50,176] is a
  // height-in-cm clothing size (hats/slippers/socks fall outside that range).
  const isShoe = sizes.some((s) => /^eu/i.test(s));
  const heightCm =
    !isShoe &&
    sizes.length > 0 &&
    sizes.every((s) => {
      const n = parseInt(s, 10);
      return Number.isFinite(n) && n >= 50 && n <= 176;
    });

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
    // Meta Pixel: fire AddToCart only after the item is actually added.
    trackAddToCart({ id: product.id, name, price: product.price, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Meta Pixel: ViewContent once per product. The ref guard survives React
  // Strict Mode's double-invoke of effects in development.
  const viewedRef = useRef<number | null>(null);
  useEffect(() => {
    if (viewedRef.current === product.id) return;
    viewedRef.current = product.id;
    trackViewContent({ id: product.id, name, price: product.price });
  }, [product.id, name, product.price]);

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

  // Prefer the Slovenian short description; only fall back to the (English)
  // WooCommerce long description when no Slovenian copy exists.
  const description =
    productShortDescription(product, locale) || longDesc || null;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Heading */}
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-dark">
          {categoryLabel(product.category)}
        </p>
        <h1
          className="mt-2 text-[28px] font-extrabold leading-tight text-ink md:text-[36px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {name}
        </h1>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2 text-[13px] text-slate">
          <span aria-label="5 od 5" className="flex items-center gap-0.5 text-[#F4B73E]">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </span>
          <span className="font-bold text-ink">4.9</span>
          <span>·</span>
          <a href="#reviews" className="hover:text-orange-dark">128 mnenj</a>
          <span>·</span>
          <span className="text-[12px]">Šifra #{product.id}</span>
        </div>
      </div>

      {/* Price card */}
      <div
        className="rounded-2xl bg-cream p-5"
        style={{ border: "1px solid rgba(194, 65, 12, 0.10)" }}
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[36px] font-extrabold leading-none text-ink">
            {product.price.toFixed(2)}€
          </span>
          {onSale && (
            <>
              <span
                className="text-[18px] font-bold leading-none text-slate line-through"
                style={{ textDecorationThickness: "2px" }}
              >
                {product.comparePrice.toFixed(2)}€
              </span>
              <span className="rounded bg-[#E55B47] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-pearl">
                Prihranek {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </span>
            </>
          )}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#047857]">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          Na zalogi — odpošljemo v 24 urah
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

          {(heightCm || isShoe) && (
            <p className="mt-2.5 text-[12px] text-ink/60">
              {isShoe
                ? locale === "sl"
                  ? "EU številke čevljev."
                  : "EU shoe sizes."
                : locale === "sl"
                ? "Velikost pomeni višino otroka v cm."
                : "Sizes are the child's height in cm."}
              {heightCm && (
                <button
                  type="button"
                  onClick={() => setShowGuide((v) => !v)}
                  className="ml-1.5 font-bold text-orange-dark underline underline-offset-2 hover:text-orange"
                >
                  {locale === "sl" ? "Vodič velikosti" : "Size guide"}
                </button>
              )}
            </p>
          )}

          {heightCm && showGuide && (
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl border border-orange-dark/15 bg-cream p-3 text-[12px] sm:grid-cols-3">
              {sizes.map((s) => {
                const age = ageForSize(s, locale);
                return (
                  <li key={s} className="flex justify-between gap-2">
                    <span className="font-bold text-ink">
                      {s.replace("-", "–")} cm
                    </span>
                    {age && <span className="text-ink/60">{age}</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Quantity + CTAs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-orange-dark/25 bg-pearl">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Zmanjšaj količino"
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
            aria-label="Povečaj količino"
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
          aria-label="Dodaj med želje"
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
          <span>Varno za otroke</span>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="14" height="11" rx="1" />
            <path d="M15 9h4l3 4v4h-7V9Z" />
            <circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" />
          </svg>
          <span>Brezplačno v Sloveniji</span>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9" />
            <path d="m3 12 4-4M3 12l4 4" />
          </svg>
          <span>30 dni za vračilo</span>
        </li>
        <li className="flex flex-col items-start gap-1.5 rounded-xl border border-orange-dark/10 bg-pearl p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M16 11h-3v3" />
            <circle cx="9" cy="12" r="2" />
          </svg>
          <span>Varno plačilo</span>
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
                ? "Opis"
                : t === "details"
                ? "Podrobnosti"
                : "Dostava in vračila"}
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
                {name} — {categoryLabel(product.category).toLowerCase()}.
              </p>
            )
          )}
          {tab === "details" && (
            <ul className="flex flex-col gap-3 text-[14px] text-ink/85">
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Šifra</span>
                <span className="font-semibold">#{product.id}</span>
              </li>
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Kategorija</span>
                <span className="font-semibold">{categoryLabel(product.category)}</span>
              </li>
              {product.categories && product.categories.length > 0 && (
                <li className="grid grid-cols-[120px_1fr] gap-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Oznake</span>
                  <span className="flex flex-wrap gap-1.5">
                    {product.categories.slice(0, 12).map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink/75"
                      >
                        {categoryLabel(c)}
                      </span>
                    ))}
                  </span>
                </li>
              )}
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Materiali</span>
                <span className="font-semibold">Certifikat OEKO-TEX, netoksični zaključki</span>
              </li>
              <li className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-dark">Nega</span>
                <span className="font-semibold">Strojno pranje na 30 °C, ne belite</span>
              </li>
            </ul>
          )}
          {tab === "shipping" && (
            <ul className="flex flex-col gap-3 text-[14px] leading-relaxed text-slate md:text-[15px]">
              <li>
                <strong className="text-ink">Dostava:</strong> 1–2 delovna dneva po Sloveniji,
                3–5 dni po EU, 5–10 po svetu. Brezplačno po celi Sloveniji.
              </li>
              <li>
                <strong className="text-ink">Vračila:</strong> 30 dni, nenošeno s pritrjenimi
                etiketami. Priložimo predplačano nalepko.
              </li>
              <li>
                <strong className="text-ink">Embalaža:</strong> Darilna škatla za večkratno uporabo
                z ročno zavezanim trakom — brez doplačila.
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
