import "server-only";

// Carrier-agnostic shipment draft: turns a stored order row into the exact
// fields a courier (Express One) needs to file a shipment. This is the
// "information ready in the backend" — surfaced in the admin order page and
// consumed by the (flag-gated) auto-file transport once its API is connected.

export type ShipmentRecipient = {
  name: string;
  street: string;
  houseNumber: string;
  houseNumberInfo?: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string; // ISO-2, e.g. "SI"
  phone?: string;
  email: string;
};

export type ShipmentSender = {
  name: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  country: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
};

export type ShipmentDraft = {
  reference: string; // order number — printed on the label
  sender: ShipmentSender;
  recipient: ShipmentRecipient;
  parcel: {
    count: number;
    weightKg?: number;
    content: string;
  };
  /** Cash the courier must collect on delivery, or null for prepaid orders. */
  cod: { amount: number; currency: string } | null;
  /** Fields that are missing/blank and would block filing. */
  missing: string[];
};

/** Split "Dvorje 82a" → { street: "Dvorje", houseInput: "82a" }. */
function splitStreetAndNumber(line: string): { street: string; houseInput: string } {
  const tokens = String(line).trim().split(/\s+/);
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (/^\d/.test(tokens[i])) {
      return {
        street: tokens.slice(0, i).join(" "),
        houseInput: tokens.slice(i).join(" "),
      };
    }
  }
  return { street: line, houseInput: "" };
}

/** Split "82a" → { number: "82", info: "a" }. */
function splitHouseNumber(input: string): { number: string; info: string } {
  if (!input) return { number: "", info: "" };
  const m = input.trim().match(/^(\d+)\s*(.*)$/);
  if (!m) return { number: "", info: input.trim() };
  return { number: m[1], info: m[2].trim() };
}

function senderFromEnv(): ShipmentSender {
  const e = (k: string) => (process.env[k] ?? "").trim();
  return {
    name: e("GLS_SENDER_NAME") || e("INVOICE_COMPANY_NAME") || "Eloria",
    street: e("GLS_SENDER_STREET"),
    houseNumber: e("GLS_SENDER_HOUSE_NUMBER"),
    city: e("GLS_SENDER_CITY"),
    postalCode: e("GLS_SENDER_ZIP"),
    country: e("GLS_SENDER_COUNTRY") || "SI",
    contactName: e("GLS_SENDER_CONTACT_NAME") || undefined,
    contactPhone: e("GLS_SENDER_CONTACT_PHONE") || undefined,
    contactEmail: e("GLS_SENDER_CONTACT_EMAIL") || undefined,
  };
}

type OrderRow = {
  order_number: string;
  email: string;
  payment_method?: string | null;
  payment_status?: string | null;
  total: number | string;
  currency?: string | null;
  shipping_address: {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    country?: string | null;
    phone?: string | null;
  } | null;
};

/**
 * Build the ready-to-file shipment draft for an order.
 * `phone` can be supplied from the linked customer record when the address
 * JSON doesn't carry one (Stripe stores it on the customer).
 */
export function buildShipmentDraft(order: OrderRow, phone?: string | null): ShipmentDraft {
  const a = order.shipping_address ?? {};
  const { street, houseInput } = splitStreetAndNumber(a.line1 ?? "");
  const hn = splitHouseNumber(houseInput);

  const recipient: ShipmentRecipient = {
    name: (a.name ?? "").trim() || order.email,
    street: street || (a.line1 ?? ""),
    houseNumber: hn.number,
    houseNumberInfo: [hn.info, a.line2].filter(Boolean).join(" ") || undefined,
    addressLine2: a.line2 ?? undefined,
    city: (a.city ?? "").trim(),
    postalCode: (a.postal_code ?? "").trim(),
    country: (a.country ?? "SI").toUpperCase(),
    phone: (a.phone ?? phone ?? "").trim() || undefined,
    email: order.email,
  };

  // COD collects cash equal to the order total; prepaid (card/paid) collects nothing.
  const isCod = order.payment_method === "cod" && order.payment_status !== "paid";
  const cod = isCod
    ? { amount: Number(order.total), currency: (order.currency ?? "EUR").toUpperCase() }
    : null;

  const missing: string[] = [];
  if (!recipient.name) missing.push("ime prejemnika");
  if (!recipient.street) missing.push("ulica");
  if (!recipient.houseNumber) missing.push("hišna številka");
  if (!recipient.postalCode) missing.push("poštna številka");
  if (!recipient.city) missing.push("kraj");
  if (!recipient.phone) missing.push("telefon");

  return {
    reference: order.order_number,
    sender: senderFromEnv(),
    recipient,
    parcel: { count: 1, content: "Igrače / otroška oblačila" },
    cod,
    missing,
  };
}
