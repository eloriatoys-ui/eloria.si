import "server-only";
import QRCode from "qrcode";

// Slovenian UPN QR payment code generator.
// Spec: ZBS (Združenje bank Slovenije), used by every Slovenian banking app.
// Reference: https://www.zbs-giz.si/wp-content/uploads/2017/12/Tehnicni_standard_UPN_QR.pdf

type UpnInput = {
  amountEur: number;          // e.g. 19.90
  recipientName: string;      // e.g. "JENIX GROUP d.o.o."
  recipientStreet: string;    // e.g. "Dvorje 82A"
  recipientCity: string;      // e.g. "4207 Cerklje na Gorenjskem"
  recipientIban: string;      // e.g. "SI56040000282692279" (no spaces)
  reference: string;          // e.g. "SI00 2026-01005"
  purposeCode?: string;       // 4-letter ISO 20022 purpose, default "OTHR"
  purposeText: string;        // e.g. "Eloria order ELO-2026-01005"
  deadline?: string;          // optional "DD.MM.YYYY"
  payerName?: string;         // customer's name — bank app pre-fills payer
  payerStreet?: string;       // customer's street + house number
  payerCity?: string;         // customer's postal code + city
};

// Pad-or-truncate a string to a fixed width. UPN spec is strict about widths.
function fix(s: string, width: number): string {
  const v = (s ?? "").slice(0, width);
  return v + " ".repeat(Math.max(0, width - v.length));
}

// Strip diacritics — UPN QR uses ISO-8859-2; safer to avoid non-ASCII in critical fields.
function ascii(s: string): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[čć]/gi, (m) => (m === m.toUpperCase() ? "C" : "c"))
    .replace(/š/gi, (m) => (m === m.toUpperCase() ? "S" : "s"))
    .replace(/ž/gi, (m) => (m === m.toUpperCase() ? "Z" : "z"))
    .replace(/đ/gi, (m) => (m === m.toUpperCase() ? "D" : "d"));
}

function formatAmount(eur: number): string {
  const cents = Math.round(eur * 100);
  return cents.toString().padStart(11, "0");
}

function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

// Build the UPN QR text payload (the string we'll encode as a QR code).
// Per the ZBS UPN QR spec: 19 fields separated by \n. Fields ARE truncated to
// their max widths but NOT space-padded — bank apps treat the value as the
// literal content. Field 18 is a 3-digit length-of-head checksum.
export function buildUpnPayload(input: UpnInput): string {
  const lines = [
    "UPNQR",                                  // 1. magic
    "",                                       // 2. payer IBAN (empty — bank fills)
    "",                                       // 3. payer deposit (empty)
    ascii(input.payerName ?? "").slice(0, 33),     // 4. payer name
    ascii(input.payerStreet ?? "").slice(0, 33),   // 5. payer street
    ascii(input.payerCity ?? "").slice(0, 33),     // 6. payer city
    formatAmount(input.amountEur),            // 7. amount (11 digits, in cents)
    "",                                       // 8. payment date (empty)
    "",                                       // 9. urgent flag (empty)
    (input.purposeCode ?? "OTHR").slice(0, 4),// 10. purpose code (4 chars)
    ascii(input.purposeText).slice(0, 42),    // 11. purpose text (≤42 chars)
    input.deadline ?? "",                     // 12. payment deadline (DD.MM.YYYY or empty)
    normalizeIban(input.recipientIban),       // 13. recipient IBAN (≤34)
    input.reference.slice(0, 26),             // 14. reference (≤26 chars)
    ascii(input.recipientName).slice(0, 33),  // 15. recipient name (≤33)
    ascii(input.recipientStreet).slice(0, 33),// 16. recipient street (≤33)
    ascii(input.recipientCity).slice(0, 33),  // 17. recipient city (≤33)
  ];
  const head = lines.join("\n") + "\n";
  // Field 18: control sum — length of head in bytes, 3 digits.
  const checksum = Buffer.byteLength(head, "utf8").toString().padStart(3, "0");
  return head + checksum + "\n";
}

// Build a Slovenian SI00 reference number from the order number.
// SI00 = "non-structured" reference model (any chars allowed). We keep digits
// and dashes from the order number (e.g. ELO-2026-01001 → "2026-01001"), with
// no leading/trailing dashes so bank apps render it cleanly.
export function buildReference(orderNumber: string): string {
  const ref = orderNumber
    .replace(/[^0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  return `SI00 ${ref}`;
}

// Generate a QR code PNG as a data URL (data:image/png;base64,...).
export async function generateUpnQrDataUrl(input: UpnInput): Promise<string> {
  const payload = buildUpnPayload(input);
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    width: 320,
    margin: 1,
    color: { dark: "#0D0F12", light: "#FFFFFF" },
  });
}

// Helper that uses ELORIA_BANK_* env vars to fill recipient fields.
export type OrderForUpn = {
  order_number: string;
  total: number;
  shipping_address?: {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
};

export function generateOrderQr(order: OrderForUpn): Promise<string> {
  const sa = order.shipping_address ?? null;
  const payerStreet = sa?.line1
    ? [sa.line1, sa.line2].filter(Boolean).join(" ")
    : "";
  const payerCity = sa
    ? [sa.postal_code, sa.city].filter(Boolean).join(" ").trim()
    : "";
  return generateUpnQrDataUrl({
    amountEur: order.total,
    recipientName: process.env.ELORIA_BANK_ACCOUNT_NAME ?? "",
    recipientStreet: `${process.env.GLS_SENDER_STREET ?? ""} ${process.env.GLS_SENDER_HOUSE_NUMBER ?? ""}${process.env.GLS_SENDER_HOUSE_NUMBER_INFO ?? ""}`.trim(),
    recipientCity: `${process.env.GLS_SENDER_ZIP ?? ""} ${process.env.GLS_SENDER_CITY ?? ""}`.trim(),
    recipientIban: process.env.ELORIA_BANK_IBAN ?? "",
    reference: buildReference(order.order_number),
    purposeText: `Eloria order ${order.order_number}`,
    payerName: sa?.name ?? "",
    payerStreet,
    payerCity,
  });
}
