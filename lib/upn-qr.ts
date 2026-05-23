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
// ZBS UPN QR spec — 19 fields separated by \n in this exact order:
//   1  UPNQR
//   2  IBAN plačnika           (payer IBAN — empty, bank fills from logged-in account)
//   3  Polog                   (deposit indicator — empty)
//   4  Referenca plačnika      (payer's own reference — empty)
//   5  Ime plačnika
//   6  Ulica plačnika
//   7  Mesto plačnika
//   8  Znesek                  (11-digit amount in cents)
//   9  Datum plačila           (DDMMYYYY or empty)
//   10 Nujno                   (X if urgent, else empty)
//   11 Koda namena             (4-char ISO 20022 purpose code)
//   12 Namen plačila           (purpose text, ≤42 chars)
//   13 Rok plačila             (deadline DDMMYYYY or empty)
//   14 IBAN prejemnika         (recipient IBAN)
//   15 Referenca prejemnika    (SI<model> <reference>)
//   16 Ime prejemnika
//   17 Ulica prejemnika
//   18 Mesto prejemnika
//   19 Kontrolna vsota         (3-digit byte-length of lines 1-18 with their \n)
//
// Earlier version omitted line 4, shifting fields 5-18 by one position — that
// caused bank apps to render the IBAN as a street address, etc.
export function buildUpnPayload(input: UpnInput): string {
  const lines = [
    "UPNQR",                                       // 1
    "",                                            // 2  payer IBAN
    "",                                            // 3  polog
    "",                                            // 4  payer reference  ← was missing
    ascii(input.payerName ?? "").slice(0, 33),     // 5  payer name
    ascii(input.payerStreet ?? "").slice(0, 33),   // 6  payer street
    ascii(input.payerCity ?? "").slice(0, 33),     // 7  payer city
    formatAmount(input.amountEur),                 // 8  amount (11 digits, cents)
    "",                                            // 9  payment date
    "",                                            // 10 urgent
    (input.purposeCode ?? "OTHR").slice(0, 4),     // 11 purpose code
    ascii(input.purposeText).slice(0, 42),         // 12 purpose text
    input.deadline ?? "",                          // 13 deadline
    normalizeIban(input.recipientIban),            // 14 recipient IBAN
    input.reference.slice(0, 26),                  // 15 reference
    ascii(input.recipientName).slice(0, 33),       // 16 recipient name
    ascii(input.recipientStreet).slice(0, 33),     // 17 recipient street
    ascii(input.recipientCity).slice(0, 33),       // 18 recipient city
  ];
  const head = lines.join("\n") + "\n";
  // Field 19: kontrolna vsota — total byte length of lines 1-18 (incl. their \n), 3 digits.
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
