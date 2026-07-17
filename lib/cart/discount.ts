// Cart-level automatic promotion.
//
// DISABLED (2026-07-17): the 40% promotion is now applied directly to product
// prices in the database — every product's `price` is 40% below its
// `compare_price`, so the storefront shows the original struck through and the
// discounted price, and the customer is charged the discounted price whether
// they buy one item or ten.
//
// The old rule here gave 40% off the whole cart when it held more than one
// item. Leaving it active on top of the new product-level pricing would stack
// into 64% off, so it is switched off rather than deleted — flip
// CART_PROMO_ACTIVE back to true (and revert the product prices) to restore it.
//
// This module stays the single source of truth for the cart UI, the checkout
// UI and the server-side checkout route, so the displayed and charged amounts
// can never drift apart.

const CART_PROMO_ACTIVE = false;

export const MULTI_ITEM_DISCOUNT_RATE = 0.4;

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** More than one item in the cart (total quantity ≥ 2) unlocked the discount. */
export function isDiscountEligible(itemCount: number): boolean {
  return CART_PROMO_ACTIVE && itemCount > 1;
}

export type CartDiscount = {
  eligible: boolean;
  /** Fractional rate actually applied (0 while the cart promo is off). */
  rate: number;
  /** Percentage form for display. */
  percent: number;
  /** Amount subtracted from the subtotal, in euros. */
  discount: number;
  /** Subtotal after the discount, in euros. */
  discountedSubtotal: number;
};

export function computeDiscount(itemCount: number, subtotal: number): CartDiscount {
  const eligible = isDiscountEligible(itemCount);
  const rate = eligible ? MULTI_ITEM_DISCOUNT_RATE : 0;
  const discount = round2(subtotal * rate);
  return {
    eligible,
    rate,
    percent: Math.round(rate * 100),
    discount,
    discountedSubtotal: round2(subtotal - discount),
  };
}
