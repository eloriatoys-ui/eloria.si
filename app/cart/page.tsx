"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart/cart-context";

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove, clear } = useCart();

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Your cart</h1>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-orange-dark/15 bg-pearl p-8 text-center">
            <p className="text-base text-ink/80">Your cart is empty.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
              style={{ color: "#FFFFFF" }}
            >
              <span style={{ color: "#FFFFFF" }}>Browse shop</span>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr,360px]">
            <ul className="divide-y divide-orange-dark/10 rounded-2xl border border-orange-dark/15 bg-pearl">
              {lines.map((l) => (
                <li
                  key={l.productId}
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

                    <div className="mt-3 inline-flex items-center rounded-full border border-orange-dark/25 bg-cream">
                      <button
                        onClick={() => setQuantity(l.productId, l.quantity - 1)}
                        className="grid h-8 w-8 place-items-center text-ink hover:text-orange-dark"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-[13px] font-bold text-ink">
                        {l.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(l.productId, l.quantity + 1)}
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
                      onClick={() => remove(l.productId)}
                      className="text-[12px] font-bold text-ink/60 hover:text-orange-dark"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-orange-dark/15 bg-pearl p-6">
              <h2 className="text-lg font-extrabold text-ink">Order summary</h2>
              <dl className="mt-5 space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-ink/70">Subtotal</dt>
                  <dd className="font-bold text-ink">€{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/70">Shipping</dt>
                  <dd className="font-bold text-ink">Free</dd>
                </div>
                <div className="flex justify-between border-t border-orange-dark/10 pt-3 text-[16px]">
                  <dt className="font-extrabold text-ink">Total</dt>
                  <dd className="font-extrabold text-ink">
                    €{subtotal.toFixed(2)}
                  </dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-orange px-6 py-3.5 text-center text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
                style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
              >
                <span style={{ color: "#FFFFFF" }}>Checkout</span>
              </Link>
              <button
                onClick={clear}
                className="mt-3 w-full text-[12px] font-bold text-ink/60 hover:text-orange-dark"
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
