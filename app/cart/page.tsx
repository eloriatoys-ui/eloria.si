"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart/cart-context";

export default function CartPage() {
  const {
    lines,
    subtotal,
    discountEligible,
    discountPercent,
    discount,
    discountedSubtotal,
    setQuantity,
    remove,
    clear,
  } = useCart();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Vaša košarica</h1>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-orange-dark/15 bg-pearl p-8 text-center">
            <p className="text-base text-ink/80">Vaša košarica je prazna.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
              style={{ color: "#FFFFFF" }}
            >
              <span style={{ color: "#FFFFFF" }}>Pojdi v trgovino</span>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr,360px]">
            <ul className="divide-y divide-orange-dark/10 rounded-2xl border border-orange-dark/15 bg-pearl">
              {lines.map((l) => (
                <li
                  key={`${l.productId}-${l.size ?? ""}`}
                  className="flex items-center gap-4 p-4 md:gap-5 md:p-5"
                >
                  {l.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.image}
                      alt={l.name}
                      className="h-20 w-20 flex-shrink-0 rounded-xl object-cover md:h-24 md:w-24"
                    />
                  ) : (
                    <div className="grid h-20 w-20 flex-shrink-0 place-items-center rounded-xl bg-orange/10 text-2xl md:h-24 md:w-24">
                      🎁
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${l.slug}`}
                      className="line-clamp-2 text-[14px] font-extrabold text-ink hover:text-orange-dark md:text-[15px]"
                    >
                      {l.name}
                    </Link>
                    <p className="mt-1 text-[13px] font-bold text-ink/70">
                      €{l.price.toFixed(2)}
                    </p>
                    {l.size && (
                      <p className="mt-1 text-[12px] font-bold text-ink/60">
                        Velikost: <span className="text-ink">{l.size}</span>
                      </p>
                    )}

                    <div className="mt-3 inline-flex items-center rounded-full border border-orange-dark/25 bg-cream">
                      <button
                        onClick={() => setQuantity(l.productId, l.quantity - 1, l.size)}
                        className="grid h-8 w-8 place-items-center text-ink hover:text-orange-dark"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-[13px] font-bold text-ink">
                        {l.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(l.productId, l.quantity + 1, l.size)}
                        className="grid h-8 w-8 place-items-center text-ink hover:text-orange-dark"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-[14px] font-extrabold text-ink md:text-[15px]">
                      €{(l.price * l.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => remove(l.productId, l.size)}
                      className="text-[12px] font-bold text-ink/60 hover:text-orange-dark"
                    >
                      Odstrani
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-orange-dark/15 bg-pearl p-6">
              <h2 className="text-lg font-extrabold text-ink">Povzetek naročila</h2>
              <dl className="mt-5 space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink/70">Vmesni seštevek</dt>
                  <dd className="font-bold text-ink">€{subtotal.toFixed(2)}</dd>
                </div>
                {discountEligible && (
                  <div className="flex justify-between text-green-700">
                    <dt className="font-bold">Popust (−{discountPercent}%)</dt>
                    <dd className="font-bold">−€{discount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink/70">Dostava</dt>
                  <dd className="font-bold text-ink">Brezplačno</dd>
                </div>
                <div className="flex justify-between border-t border-orange-dark/10 pt-3 text-[16px]">
                  <dt className="font-extrabold text-ink">Skupaj</dt>
                  <dd className="font-extrabold text-ink">
                    €{discountedSubtotal.toFixed(2)}
                  </dd>
                </div>
              </dl>
              {discountEligible ? (
                <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-[12px] font-bold text-green-700">
                  ✓ Upoštevan <strong>40% popust</strong> + <strong>brezplačna dostava</strong> ob nakupu več izdelkov.
                </p>
              ) : (
                <p className="mt-3 rounded-lg bg-orange/10 px-3 py-2 text-[12px] font-bold text-orange-dark">
                  🎁 Dodajte še en izdelek in prejmite <strong>40% popust</strong> + brezplačno dostavo na celotno naročilo!
                </p>
              )}
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-orange px-6 py-3.5 text-center text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
                style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
              >
                <span style={{ color: "#FFFFFF" }}>Na blagajno</span>
              </Link>
              <button
                onClick={clear}
                className="mt-3 w-full text-[12px] font-bold text-ink/60 hover:text-orange-dark"
              >
                Izprazni košarico
              </button>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
