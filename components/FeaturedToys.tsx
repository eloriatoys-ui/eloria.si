"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import {
  categories as staticCategories,
  products as staticProducts,
  type Product,
} from "@/lib/data";

type Props = {
  products?: Product[];
  categories?: string[];
  hideHeader?: boolean;
};

export default function FeaturedToys({
  products: productsProp,
  categories: categoriesProp,
  hideHeader = false,
}: Props = {}) {
  const products = productsProp ?? staticProducts;
  const categories = categoriesProp ?? staticCategories;
  const [active, setActive] = useState("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">(
    "featured",
  );

  const visible = useMemo(() => {
    let list =
      active === "All"
        ? [...products]
        : products.filter((p) => p.category === active);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [active, sort]);

  return (
    <section id="toys" className={`bg-cream ${hideHeader ? "pb-16 pt-4 md:pb-24 md:pt-6" : "py-16 md:py-24"}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {!hideHeader && (
          <Reveal>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                  <span className="h-1 w-6 rounded-full bg-orange" />
                  Nakupuj kolekcijo
                </p>
                <h2 className="font-display mt-3 text-3xl tracking-tight text-ink sm:text-4xl md:text-5xl">
                  Najbolje prodajano
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate md:text-base">
                  Izdelano s skrbnostjo — narejeno, da traja in da ga vzljubite.
                </p>
              </div>

              <a
                href="/trgovina"
                className="hidden items-center gap-1.5 self-start rounded-full border border-orange-dark/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
              >
                Poglej vse igrače
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </a>
            </div>
          </Reveal>
        )}

        <Reveal delay={100}>
          <div className="mt-7 flex flex-col gap-3 border-y border-orange-dark/15 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
              <div className="flex min-w-max items-center gap-1">
                {categories.map((c) => {
                  const isActive = c === active;
                  const count =
                    c === "All"
                      ? products.length
                      : products.filter((p) => p.category === c).length;
                  return (
                    <button
                      key={c}
                      onClick={() => setActive(c)}
                      className={[
                        "relative whitespace-nowrap rounded-md px-3 py-2 text-[13px] font-bold transition-colors",
                        isActive
                          ? "text-ink"
                          : "text-slate hover:text-ink",
                      ].join(" ")}
                    >
                      {c}
                      <span
                        className={`ml-1.5 text-[10px] font-bold ${
                          isActive ? "text-orange" : "text-slate/70"
                        }`}
                      >
                        {count}
                      </span>
                      {isActive && (
                        <span className="absolute -bottom-[14px] left-3 right-3 h-[2px] rounded-full bg-orange" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[13px]">
              <label className="font-semibold text-slate">Razvrsti po:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-md border border-orange-dark/20 bg-pearl px-2 py-1.5 font-semibold text-ink outline-none focus:border-orange"
              >
                <option value="featured">Priporočeno</option>
                <option value="price-asc">Cena: nizka → visoka</option>
                <option value="price-desc">Cena: visoka → nizka</option>
              </select>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:mt-12 md:grid-cols-4 md:gap-x-6 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-12 text-center text-slate">
            V tej kategoriji še ni igrač — vrnite se kmalu.
          </p>
        )}

        <div className="mt-10 flex items-center justify-center md:hidden">
          <a
            href="/trgovina"
            className="inline-flex items-center gap-2 rounded-full border border-orange-dark/20 px-5 py-3 text-sm font-bold text-ink"
          >
            Poglej vse igrače
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </a>
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-slate">
          Prikazano {visible.length} od {products.length} izdelkov
        </p>
      </div>
    </section>
  );
}
