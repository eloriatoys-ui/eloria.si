"use client";

import { useState } from "react";
import { useCart, type CartLine } from "@/lib/cart/cart-context";

type Props = {
  product: Omit<CartLine, "quantity">;
  variant?: "primary" | "outline";
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  product,
  variant = "primary",
  className = "",
  label = "Add to cart",
}: Props) {
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  const onClick = () => {
    add(product, 1);
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  const base =
    "flex-1 rounded-full px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider transition-colors";
  const styles =
    variant === "primary"
      ? "bg-ink text-pearl hover:bg-orange-dark"
      : "border border-orange-dark/25 bg-pearl text-ink hover:bg-orange hover:text-pearl";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
      style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
    >
      <span style={{ color: "#FFFFFF" }}>
        {adding ? "Added ✓" : label}
      </span>
    </button>
  );
}
