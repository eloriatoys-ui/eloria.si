"use client";

import { useState } from "react";
import type { CartLine } from "@/lib/cart/cart-context";

type Props = {
  product: Omit<CartLine, "quantity">;
  className?: string;
  label?: string;
};

export default function BuyNowButton({
  product,
  className = "",
  label = "Buy now",
}: Props) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ ...product, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error ?? "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      alert("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex-1 rounded-full bg-orange px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark disabled:opacity-60 ${className}`}
      style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
    >
      <span style={{ color: "#FFFFFF" }}>
        {loading ? "Redirecting…" : label}
      </span>
    </button>
  );
}
