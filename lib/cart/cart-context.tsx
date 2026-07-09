"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { computeDiscount } from "./discount";

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  image?: string;
  price: number;
  /** Chosen size (undefined for products sold without sizes). */
  size?: string;
  quantity: number;
};

/**
 * A cart line is identified by product *and* size, so the same product in
 * two sizes lives on two separate lines.
 */
function lineKey(productId: number, size?: string): string {
  return `${productId}|${size ?? ""}`;
}

type CartState = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  /** True when the multi-item promo applies (more than one item in the cart). */
  discountEligible: boolean;
  /** Percentage off for display (0 or 40). */
  discountPercent: number;
  /** Amount subtracted from the subtotal, in euros. */
  discount: number;
  /** Subtotal after the automatic discount, in euros. */
  discountedSubtotal: number;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQuantity: (productId: number, qty: number, size?: string) => void;
  remove: (productId: number, size?: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "eloria.cart.v1";
const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, qty = 1) => {
      const key = lineKey(line.productId, line.size);
      setLines((prev) => {
        const idx = prev.findIndex(
          (l) => lineKey(l.productId, l.size) === key,
        );
        if (idx === -1) return [...prev, { ...line, quantity: qty }];
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      });
    },
    [],
  );

  const setQuantity = useCallback(
    (productId: number, qty: number, size?: string) => {
      const key = lineKey(productId, size);
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => lineKey(l.productId, l.size) !== key)
          : prev.map((l) =>
              lineKey(l.productId, l.size) === key ? { ...l, quantity: qty } : l,
            ),
      );
    },
    [],
  );

  const remove = useCallback((productId: number, size?: string) => {
    const key = lineKey(productId, size);
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.size) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const { eligible, percent, discount, discountedSubtotal } = computeDiscount(
      itemCount,
      subtotal,
    );
    return {
      lines,
      itemCount,
      subtotal,
      discountEligible: eligible,
      discountPercent: percent,
      discount,
      discountedSubtotal,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
