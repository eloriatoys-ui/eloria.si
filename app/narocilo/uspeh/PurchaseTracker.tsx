"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/meta-pixel";

// Fires the browser-side Meta Pixel Purchase, using server-verified order data
// passed as props (never the client cart, which is cleared here). The eventId
// matches the server Conversions API Purchase for deduplication. A sessionStorage
// guard + a ref stop it from re-firing on refresh or React Strict Mode remounts.
type Props = {
  eventId: string;
  value: number;
  currency: string;
  contentIds: (string | number)[];
  numItems: number;
};

export default function PurchaseTracker({ eventId, value, currency, contentIds, numItems }: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const key = `eloria.purchase.tracked.${eventId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}

    trackPurchase({ contentIds, value, numItems, currency }, eventId);
  }, [eventId, value, currency, contentIds, numItems]);

  return null;
}
