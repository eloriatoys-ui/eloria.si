import "server-only";
import crypto from "crypto";

// Meta Conversions API (server-side) — Purchase event.
//
// Sends a server-verified Purchase to Meta with the SAME event_id as the
// browser pixel Purchase, so Meta deduplicates the two into one conversion.
// Never throws: any failure is logged and swallowed so it can't affect order
// processing. Requires META_CONVERSIONS_API_TOKEN (secret, server-only).

const GRAPH_VERSION = "v21.0";

const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "887907974366896").trim();

/** Lower-case, trim, then SHA-256 hex — Meta's required normalization for PII. */
function hash(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/** Digits only (strip +, spaces, dashes) before hashing a phone number. */
function hashPhone(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export type CapiPurchaseInput = {
  eventId: string;
  eventTimeSeconds?: number;
  value: number;
  currency: string;
  contentIds: (string | number)[];
  numItems: number;
  email?: string | null;
  phone?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  eventSourceUrl?: string | null;
};

export async function sendPurchaseEvent(input: CapiPurchaseInput): Promise<boolean> {
  const token = process.env.META_CONVERSIONS_API_TOKEN?.trim();
  if (!token) {
    console.warn("[meta-capi] META_CONVERSIONS_API_TOKEN not set — skipping CAPI Purchase");
    return false;
  }

  const userData: Record<string, unknown> = {};
  const em = hash(input.email);
  const ph = hashPhone(input.phone);
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const event: Record<string, unknown> = {
    event_name: "Purchase",
    event_time: input.eventTimeSeconds ?? Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency: input.currency,
      value: Math.round((input.value + Number.EPSILON) * 100) / 100,
      content_ids: input.contentIds.map((v) => String(v)),
      content_type: "product",
      num_items: input.numItems,
    },
  };
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;

  const body: Record<string, unknown> = { data: [event] };
  const testCode = process.env.META_TEST_EVENT_CODE?.trim();
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[meta-capi] Purchase HTTP ${res.status}: ${text.slice(0, 400)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[meta-capi] Purchase send failed:", err);
    return false;
  }
}
