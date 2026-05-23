"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartLine } from "@/lib/cart/cart-context";

type Props = {
  product: Omit<CartLine, "quantity">;
  className?: string;
  label?: string;
};

export default function BuyNowButton({
  product,
  className = "",
  label = "Kupi zdaj",
}: Props) {
  const router = useRouter();
  const { add } = useCart();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    // Add this product to the cart (so it's there if the user backs out of
    // /checkout), then send them to the payment-method picker — same flow
    // as clicking Checkout from the basket.
    add(product, 1);
    router.push("/checkout");
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
        {loading ? "Preusmerjanje…" : label}
      </span>
    </button>
  );
}
