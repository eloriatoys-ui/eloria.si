"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";

export default function CartIcon({ className = "" }: { className?: string }) {
  const { itemCount } = useCart();
  return (
    <Link
      href="/kosarica"
      aria-label={`Košarica (${itemCount} izdelkov)`}
      className={`relative grid h-10 w-10 place-items-center rounded-full border border-orange-dark/25 bg-pearl text-ink transition-colors hover:bg-orange hover:text-pearl ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-orange px-1 text-[11px] font-bold text-white shadow">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
