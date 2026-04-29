"use client";

import { useMemo } from "react";
import ProductScroller from "./ProductScroller";
import Reveal from "./Reveal";
import { products as staticProducts, type Product } from "@/lib/data";

type Props = { products?: Product[]; manual?: Product[] };

export default function NewArrivals({
  products: productsProp,
  manual,
}: Props = {}) {
  const all = productsProp ?? staticProducts;

  const visible = useMemo(() => {
    if (manual && manual.length > 0) return manual.slice(0, 12);
    const newOnes = all.filter((p) => p.badge === "NEW");
    const hots = all.filter((p) => p.badge === "HOT" || p.badge === "ORGANIC");
    const rest = all.filter(
      (p) => p.badge !== "NEW" && p.badge !== "HOT" && p.badge !== "ORGANIC",
    );
    return [...newOnes, ...hots, ...rest].slice(0, 12);
  }, [all, manual]);

  return (
    <section className="bg-cream py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span className="h-1 w-6 rounded-full bg-orange" />
                Just landed
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                New Arrivals
              </h2>
              <p className="mt-2 text-sm text-slate md:text-base">
                Fresh out of the workshop — be the first to play.
              </p>
            </div>
            <a
              href="/shop?category=New"
              className="hidden items-center gap-1.5 self-start rounded-full border border-orange-dark/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
            >
              View all new →
            </a>
          </div>
        </Reveal>

        <div className="mt-8 md:mt-10">
          <ProductScroller products={visible} />
        </div>
      </div>
    </section>
  );
}
