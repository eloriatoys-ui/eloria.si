"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export default function NavbarCart() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className="relative inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-pearl shadow-glow transition-transform hover:scale-105"
      style={{
        background:
          "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1.5" />
        <circle cx="18" cy="21" r="1.5" />
        <path d="M3 3h2l2.6 12.6a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
      </svg>
      <span className="rounded-full bg-pearl/95 px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-orange-dark">
        {itemCount}
      </span>
    </Link>
  );
}
