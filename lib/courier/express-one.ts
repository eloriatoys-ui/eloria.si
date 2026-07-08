import "server-only";
import type { ShipmentDraft } from "./shipment";

// Express One automatic shipment filing.
//
// Wiring is complete and flag-gated: handoffToCourier() calls fileWithExpressOne()
// on each paid/COD order ONLY when COURIER_AUTOFILE_ENABLED=true and the
// Express One credentials are set. Everything is best-effort and falls back to
// the existing manual flow (ready-to-ship email) on any failure.
//
// The one piece to finalize once we have Express One's API docs is the request
// mapping inside fileWithExpressOne(): endpoint path, auth header, field names,
// and how the tracking number / label come back in the response.

export type FiledShipment = {
  trackingNumber: string;
  carrier: string;
  parcelId?: string | null;
  /** Base64 PDF label, when the API returns one. */
  labelPdfBase64?: string | null;
};

const CARRIER = "Express One";

function env(key: string): string {
  return (process.env[key] ?? "").trim();
}

/** True only when auto-filing is switched on AND the API is configured. */
export function isAutoFileEnabled(): boolean {
  return (
    process.env.COURIER_AUTOFILE_ENABLED === "true" &&
    !!env("EXPRESS_ONE_API_URL") &&
    !!env("EXPRESS_ONE_API_TOKEN")
  );
}

/**
 * File a shipment on Express One and return the tracking number + label.
 * Throws on any error so the caller can fall back to the manual flow.
 */
export async function fileWithExpressOne(draft: ShipmentDraft): Promise<FiledShipment> {
  const apiUrl = env("EXPRESS_ONE_API_URL");
  const token = env("EXPRESS_ONE_API_TOKEN");
  if (!apiUrl || !token) {
    throw new Error("Express One API not configured (EXPRESS_ONE_API_URL / EXPRESS_ONE_API_TOKEN)");
  }

  // The order info is fully prepared in `draft` (sender, recipient, parcel, COD).
  // The exact request shape below must be aligned with Express One's API spec
  // once received — this is the single remaining integration point.
  throw new Error(
    "Express One transport not implemented yet — awaiting API spec. Draft ready: " +
      draft.reference,
  );

  // Reference for the eventual implementation:
  // const res = await fetch(`${apiUrl}/shipments`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //   body: JSON.stringify(mapDraftToExpressOne(draft)),
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error(`Express One HTTP ${res.status}: ${await res.text()}`);
  // const data = await res.json();
  // return { trackingNumber: data.trackingNumber, carrier: CARRIER, parcelId: data.id, labelPdfBase64: data.labelPdf };
}

export { CARRIER as EXPRESS_ONE_CARRIER };
