// Automatic multi-item promotion.
//
// "40% POPUST OB NAKUPU VEČ KOT ENEGA IZDELKA" — 40% off the whole order when
// the cart holds more than one item (any mix of products/quantities). This is
// the single source of truth used by the cart UI, the checkout UI, and the
// server-side checkout route so the client and the charged amount can never
// drift apart.

export const MULTI_ITEM_DISCOUNT_RATE = 0.4;

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** More than one item in the cart (total quantity ≥ 2) unlocks the discount. */
export function isDiscountEligible(itemCount: number): boolean {
  return itemCount > 1;
}

export type CartDiscount = {
  eligible: boolean;
  /** Fractional rate actually applied (0 or 0.4). */
  rate: number;
  /** Percentage form for display (0 or 40). */
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
