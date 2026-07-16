// Client-side Meta Pixel helper.
//
// Thin, typed wrapper around window.fbq. Every call is a no-op during server
// rendering and when the pixel script hasn't loaded, so it's always safe to
// import and call from client components. The base pixel + PageView are
// installed in app/layout.tsx; this file only adds the standard e-commerce
// events (ViewContent, AddToCart, InitiateCheckout, Purchase).

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const META_PIXEL_ID = (
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "887907974366896"
).trim();

/** Meta prefers content_ids as strings. */
type Id = string | number;

function toIds(ids: Id[]): string[] {
  return ids.map((v) => String(v));
}

function fbq(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq(...args);
}

/** Round to 2 decimals and guarantee a plain number (never a formatted string). */
function money(n: number): number {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

export function trackViewContent(p: {
  id: Id;
  name: string;
  price: number;
  currency?: string;
}): void {
  fbq("track", "ViewContent", {
    content_ids: toIds([p.id]),
    content_name: p.name,
    content_type: "product",
    value: money(p.price),
    currency: p.currency ?? "EUR",
  });
}

export function trackAddToCart(p: {
  id: Id;
  name: string;
  price: number;
  quantity: number;
  currency?: string;
}): void {
  fbq("track", "AddToCart", {
    content_ids: toIds([p.id]),
    content_name: p.name,
    content_type: "product",
    value: money(p.price * p.quantity),
    currency: p.currency ?? "EUR",
    num_items: p.quantity,
  });
}

export function trackInitiateCheckout(p: {
  contentIds: Id[];
  value: number;
  numItems: number;
  currency?: string;
}): void {
  fbq("track", "InitiateCheckout", {
    content_ids: toIds(p.contentIds),
    content_type: "product",
    value: money(p.value),
    currency: p.currency ?? "EUR",
    num_items: p.numItems,
  });
}

export function trackPurchase(
  p: {
    contentIds: Id[];
    value: number;
    numItems: number;
    currency?: string;
  },
  eventId: string,
): void {
  fbq(
    "track",
    "Purchase",
    {
      content_ids: toIds(p.contentIds),
      content_type: "product",
      value: money(p.value),
      currency: p.currency ?? "EUR",
      num_items: p.numItems,
    },
    // eventID must match the server-side Conversions API event for dedup.
    { eventID: eventId },
  );
}
