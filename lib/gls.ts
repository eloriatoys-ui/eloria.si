import "server-only";
import { createHash } from "node:crypto";

// myGLS Slovenia REST JSON API.
// Docs: https://api.mygls.si/ (PDF: docs/MyGLS_API.pdf)

const GLS_BASE = process.env.GLS_API_BASE ?? "https://api.mygls.si";

function env(name: string, required = true): string {
  const v = process.env[name];
  if (!v && required) throw new Error(`Missing env var: ${name}`);
  return v ?? "";
}

// Password must be sent as a JSON array of bytes (SHA-512 hash of UTF-8 password).
// Cached because the hash is the same for every request.
let _passwordBytes: number[] | null = null;
function passwordBytes(): number[] {
  if (_passwordBytes) return _passwordBytes;
  const pw = env("GLS_PASSWORD");
  const hash = createHash("sha512").update(pw, "utf8").digest();
  _passwordBytes = Array.from(hash);
  return _passwordBytes;
}

function authBase() {
  const clientNumber = Number(env("GLS_CLIENT_NUMBER"));
  if (!Number.isFinite(clientNumber)) {
    throw new Error("GLS_CLIENT_NUMBER must be a number");
  }
  return {
    Username: env("GLS_USERNAME"),
    Password: passwordBytes(),
    ClientNumberList: [clientNumber],
    WebshopEngine: env("GLS_WEBSHOP_ENGINE", false) || "Eloria",
  };
}

// GLS requires HouseNumber to be digits only. Split "82a" → {number:"82", info:"a"}.
export function splitHouseNumber(input: string | null | undefined): {
  number: string;
  info: string;
} {
  if (!input) return { number: "", info: "" };
  const m = String(input).trim().match(/^(\d+)\s*(.*)$/);
  if (!m) return { number: "", info: String(input).trim() };
  return { number: m[1], info: m[2].trim() };
}

type GlsAddress = {
  Name: string;
  Street: string;
  HouseNumber: string;
  HouseNumberInfo?: string;
  City: string;
  ZipCode: string;
  CountryIsoCode: string;
  ContactName?: string;
  ContactPhone?: string;
  ContactEmail?: string;
};

function senderAddress(): GlsAddress {
  return {
    Name: env("GLS_SENDER_NAME"),
    Street: env("GLS_SENDER_STREET"),
    HouseNumber: env("GLS_SENDER_HOUSE_NUMBER"),
    HouseNumberInfo: env("GLS_SENDER_HOUSE_NUMBER_INFO", false) || undefined,
    City: env("GLS_SENDER_CITY"),
    ZipCode: env("GLS_SENDER_ZIP"),
    CountryIsoCode: env("GLS_SENDER_COUNTRY"),
    ContactName: env("GLS_SENDER_CONTACT_NAME", false) || undefined,
    ContactPhone: env("GLS_SENDER_CONTACT_PHONE", false) || undefined,
    ContactEmail: env("GLS_SENDER_CONTACT_EMAIL", false) || undefined,
  };
}

export type OrderForShipping = {
  order_number: string;
  email: string;
  shipping_address: {
    name?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    postal_code?: string | null;
    state?: string | null;
    country?: string | null;
  };
  phone?: string | null;
  // If set, GLS courier collects this amount in cash on delivery.
  cod_amount_eur?: number | null;
};

function deliveryAddressFor(order: OrderForShipping): GlsAddress {
  const a = order.shipping_address;
  if (!a) throw new Error(`Order ${order.order_number} has no shipping address`);
  if (!a.line1) throw new Error(`Order ${order.order_number} has no street`);

  // shipping_address.line1 from Stripe is usually "Dvorje 82a" — street + number in one string.
  // GLS needs them split. We split on the last whitespace before a digit-leading token.
  const { street, houseInput } = splitStreetAndNumber(a.line1);
  const hn = splitHouseNumber(houseInput);

  return {
    Name: a.name ?? order.email,
    Street: street || a.line1,
    HouseNumber: hn.number || "0",
    HouseNumberInfo: [hn.info, a.line2].filter(Boolean).join(" ") || undefined,
    City: a.city ?? "",
    ZipCode: a.postal_code ?? "",
    CountryIsoCode: (a.country ?? "SI").toUpperCase(),
    ContactName: a.name ?? undefined,
    ContactPhone: order.phone ?? undefined,
    ContactEmail: order.email,
  };
}

function splitStreetAndNumber(line: string): {
  street: string;
  houseInput: string;
} {
  // Find the LAST token that starts with a digit — that's the house number.
  const tokens = line.trim().split(/\s+/);
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

async function callGls<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const url = `${GLS_BASE}/ParcelService.svc/json/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GLS ${method} HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

export type CreateShipmentResult = {
  parcelId: number;
  parcelNumber: string;
  labelPdfBase64: string;
};

type PrintLabelsResponse = {
  Labels: number[] | null;
  PrintLabelsErrorList: Array<{
    ErrorCode: number;
    ErrorDescription: string;
    ClientReferenceList?: string[];
    ParcelIdList?: number[];
  }> | null;
  PrintLabelsInfoList: Array<{
    ClientReference: string;
    ParcelId: number;
    ParcelNumber: number;
  }> | null;
};

export async function createGlsShipment(
  order: OrderForShipping,
): Promise<CreateShipmentResult> {
  const clientNumber = Number(env("GLS_CLIENT_NUMBER"));

  const isCod = (order.cod_amount_eur ?? 0) > 0;
  const body = {
    ...authBase(),
    PrintPosition: 1,
    ShowPrintDialog: false,
    TypeOfPrinter: "A4_2x2",
    ParcelList: [
      {
        ClientNumber: clientNumber,
        ClientReference: order.order_number,
        Count: 1,
        Content: `Eloria order ${order.order_number}`,
        PickupAddress: senderAddress(),
        DeliveryAddress: deliveryAddressFor(order),
        ServiceList: isCod ? [{ Code: "COD" }] : [],
        ...(isCod
          ? {
              CODAmount: Number(order.cod_amount_eur),
              CODReference: order.order_number,
              CODCurrency: "EUR",
            }
          : {}),
      },
    ],
  };

  const resp = await callGls<PrintLabelsResponse>("PrintLabels", body);

  const errors = resp.PrintLabelsErrorList ?? [];
  if (errors.length > 0) {
    const e = errors[0];
    throw new Error(`GLS error ${e.ErrorCode}: ${e.ErrorDescription}`);
  }

  const info = resp.PrintLabelsInfoList?.[0];
  if (!info) throw new Error("GLS returned no PrintLabelsInfo");
  if (!resp.Labels || resp.Labels.length === 0) {
    throw new Error("GLS returned no label PDF");
  }

  const labelPdfBase64 = Buffer.from(resp.Labels).toString("base64");

  return {
    parcelId: info.ParcelId,
    parcelNumber: String(info.ParcelNumber),
    labelPdfBase64,
  };
}

// Public, no-auth tracking URL. Customers open this to see their parcel status.
export function getTrackingUrl(parcelNumber: string | number): string {
  return `https://gls-group.eu/SI/sl/sledenje-posiljk?match=${encodeURIComponent(String(parcelNumber))}`;
}

// Re-fetch the label PDF for an already-created parcel (admin "reprint" flow).
type GetPrintedLabelsResponse = {
  Labels: number[] | null;
  GetPrintedLabelsErrorList: Array<{
    ErrorCode: number;
    ErrorDescription: string;
  }> | null;
};

export async function getLabelPdfBase64(parcelId: number): Promise<string> {
  const body = {
    ...authBase(),
    ParcelIdList: [parcelId],
    PrintPosition: 1,
    ShowPrintDialog: false,
    TypeOfPrinter: "A4_2x2",
  };
  const resp = await callGls<GetPrintedLabelsResponse>("GetPrintedLabels", body);
  const errors = resp.GetPrintedLabelsErrorList ?? [];
  if (errors.length > 0) {
    const e = errors[0];
    throw new Error(`GLS error ${e.ErrorCode}: ${e.ErrorDescription}`);
  }
  if (!resp.Labels || resp.Labels.length === 0) {
    throw new Error("GLS returned no label PDF");
  }
  return Buffer.from(resp.Labels).toString("base64");
}

// Parcel status events — for showing tracking timeline in admin or customer pages.
type ParcelStatusResponse = {
  ClientReference: string;
  ParcelNumber: number;
  DeliveryCountryCode: string;
  DeliveryZipCode: string;
  ParcelStatusList: Array<{
    DepotCity: string;
    DepotNumber: string;
    StatusCode: string;
    StatusDate: string;
    StatusDescription: string;
    StatusInfo: string;
  }> | null;
  GetParcelStatusErrors: Array<{
    ErrorCode: number;
    ErrorDescription: string;
  }> | null;
  Weight: number | null;
};

export async function getParcelStatus(parcelNumber: string | number) {
  const body = {
    ...authBase(),
    ParcelNumber: Number(parcelNumber),
    ReturnPOD: false,
    LanguageIsoCode: "SL",
  };
  return callGls<ParcelStatusResponse>("GetParcelStatuses", body);
}
