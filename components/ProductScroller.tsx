"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

type Props = {
  products: Product[];
};

export default function ProductScroller({ products }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.clientWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Prev */}
      <button
        aria-label="Previous"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        className={`absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-pearl text-ink shadow-lift transition-opacity duration-200 hover:bg-orange hover:text-pearl ${
          canPrev ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ border: "1px solid #F4DCB7" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 6 9 12 15 18" />
        </svg>
      </button>

      {/* Next */}
      <button
        aria-label="Next"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        className={`absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-pearl text-ink shadow-lift transition-opacity duration-200 hover:bg-orange hover:text-pearl ${
          canNext ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ border: "1px solid #F4DCB7" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-5"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {products.map((p) => (
          <div
            key={p.id}
            data-card
            className="shrink-0 snap-start"
            style={{
              width: "calc((100% - 4 * 1.25rem) / 5)",
              minWidth: "200px",
              maxWidth: "260px",
            }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
