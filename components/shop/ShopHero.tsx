"use client";

import { useState } from "react";

type Props = {
  productCount: number;
  onSaleCount: number;
  categoryCount: number;
};

const PROMO_CODE = "MAGIC15";

export default function ShopHero({
  productCount,
  onSaleCount,
  categoryCount,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not allowed — ignore */
    }
  }

  return (
    <section className="bg-cream pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 35%, #FDBA74 75%, #F4B73E 100%)",
            border: "1px solid rgba(194, 65, 12, 0.15)",
            boxShadow:
              "0 1px 2px rgba(194, 65, 12, 0.06), 0 14px 36px -12px rgba(194, 65, 12, 0.25)",
          }}
        >
          {/* Decorative blobs */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-12 h-56 w-56 rounded-full opacity-50 blur-2xl"
            style={{ background: "rgba(255, 255, 255, 0.7)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-20 -bottom-16 h-72 w-72 rounded-full opacity-40 blur-2xl"
            style={{ background: "rgba(194, 65, 12, 0.35)" }}
          />

          <div className="relative grid grid-cols-1 gap-8 p-7 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:p-10 lg:p-12">
            {/* TEXT */}
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-deep">
                <span className="h-1 w-6 rounded-full bg-orange-dark" />
                The full collection
              </p>
              <h1
                className="font-display mt-3 text-[36px] leading-[1.05] tracking-tight text-ink sm:text-[44px] md:text-[52px]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Shop everything
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink/80 md:text-[15px]">
                Every product, in stock, ready to ship. Filter by category and
                price, sort the way you like — and use code{" "}
                <span className="font-extrabold text-orange-deep">
                  {PROMO_CODE}
                </span>{" "}
                for 15% off your first order.
              </p>

              {/* Stat chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pearl/80 px-3 py-1.5 text-[12px] font-bold text-ink backdrop-blur-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  {productCount} products
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pearl/80 px-3 py-1.5 text-[12px] font-bold text-ink backdrop-blur-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                  {categoryCount} categories
                </span>
                {onSaleCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E55B47] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {onSaleCount} on sale
                  </span>
                )}
              </div>
            </div>

            {/* PROMO CARD */}
            <div className="relative">
              <div
                className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-pearl p-6 md:p-7"
                style={{
                  border: "1.5px dashed rgba(194, 65, 12, 0.45)",
                  boxShadow:
                    "0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 26px -10px rgba(194, 65, 12, 0.30)",
                }}
              >
                {/* Ticket notches */}
                <span
                  aria-hidden
                  className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cream"
                  style={{ border: "1.5px dashed rgba(194, 65, 12, 0.45)" }}
                />
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cream"
                  style={{ border: "1.5px dashed rgba(194, 65, 12, 0.45)" }}
                />

                <div className="flex items-center gap-2">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-pearl"
                    style={{
                      background:
                        "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2 3 11l9 9 9-9V2h-9Z" />
                      <circle cx="15" cy="8" r="1.5" />
                    </svg>
                  </span>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-dark">
                    First-order perk
                  </p>
                </div>

                <div>
                  <p className="text-[26px] font-extrabold leading-tight text-ink md:text-[30px]" style={{ letterSpacing: "-0.02em" }}>
                    15% off your first order
                  </p>
                  <p className="mt-1 text-[13px] text-slate">
                    Free delivery on orders over 150 €.
                  </p>
                </div>

                {/* Code copy */}
                <div className="flex items-stretch gap-0 overflow-hidden rounded-full" style={{ border: "1px solid rgba(194, 65, 12, 0.35)" }}>
                  <code className="flex-1 bg-cream/80 px-4 py-2.5 text-[15px] font-extrabold uppercase tracking-[0.18em] text-ink">
                    {PROMO_CODE}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-1.5 px-4 text-[12px] font-extrabold uppercase tracking-wider text-pearl transition-colors"
                    style={{
                      background: copied
                        ? "linear-gradient(135deg, #10B981 0%, #047857 100%)"
                        : "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
                      color: "#FFFFFF",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ color: "#FFFFFF" }}>Copied</span>
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </svg>
                        <span style={{ color: "#FFFFFF" }}>Copy code</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate/85">
                  Valid on first order. Cannot be combined with other offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
