"use client";

import { useMemo } from "react";
import ProductScroller from "./ProductScroller";
import Reveal from "./Reveal";
import { products as staticProducts, type Product } from "@/lib/data";
import { useLang } from "./LangProvider";

type Props = { products?: Product[]; manual?: Product[] };

export default function Trending({
  products: productsProp,
  manual,
}: Props = {}) {
  const all = productsProp ?? staticProducts;
  const { t } = useLang();

  const visible = useMemo(() => {
    if (manual && manual.length > 0) return manual.slice(0, 12);
    const sellers = all.filter((p) => p.badge === "BESTSELLER");
    const limited = all.filter((p) => p.badge === "LIMITED");
    const rest = all.filter(
      (p) => p.badge !== "BESTSELLER" && p.badge !== "LIMITED",
    );
    return [...sellers, ...limited, ...rest].slice(0, 12);
  }, [all, manual]);

  return (
    <section className="bg-pearl py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
                <span aria-hidden>🔥</span>
                {t("trend.eyebrow")}
              </p>
              <h2
                className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl"
                style={{ letterSpacing: "-0.025em" }}
              >
                {t("trend.title")}
              </h2>
              <p className="mt-2 text-sm text-slate md:text-base">
                {t("trend.subtitle")}
              </p>
            </div>
            <a
              href="/trgovina?onSale=1"
              className="hidden items-center gap-1.5 self-start rounded-full border border-orange-dark/25 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl md:inline-flex"
            >
              {t("trend.viewall")}
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
