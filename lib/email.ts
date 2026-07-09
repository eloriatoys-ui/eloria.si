import "server-only";
import { Resend } from "resend";

// Transactional email via Resend. Sends an admin "new order" alert and a
// customer order confirmation. Everything is best-effort: if the API key is
// missing or a send fails, we log and move on — email must never block or
// crash order creation.

const SITE_URL = (process.env.ELORIA_SITE_URL ?? "https://eloria.si").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM ?? "Eloria <eloriatoys@gmail.com>";
const ADMIN_TO = process.env.ADMIN_ORDER_EMAIL ?? "eloriatoys@gmail.com";
// Replies go to the real shop inbox even when sending from a different verified domain.
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "eloriatoys@gmail.com";

let _resend: Resend | null = null;
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

export type OrderEmailData = {
  order_number: string;
  email: string;
  /** Gross subtotal before the discount, in euros. Optional. */
  subtotal?: number;
  /** Discount amount applied to the order, in euros. Optional. */
  discount?: number;
  total: number;
  currency?: string;
  payment_method?: "card" | "bank_transfer" | "cod" | string | null;
  shipping_address?: {
    name?: string;
    line1?: string;
    line2?: string | null;
    city?: string;
    postal_code?: string;
    country?: string;
  } | null;
  items: Array<{
    product_name: string;
    size?: string | null;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
};

function eur(n: number): string {
  return `€${Number(n).toFixed(2)}`;
}

function paymentLabel(method: string | null | undefined): string {
  if (method === "bank_transfer") return "Bančno nakazilo (UPN)";
  if (method === "cod") return "Po povzetju (plačilo ob dostavi)";
  return "Kartica";
}

function itemsTableHtml(items: OrderEmailData["items"]): string {
  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(it.product_name)}${
          it.size ? ` <span style="color:#C2410C;font-weight:bold;">(${escapeHtml(it.size)})</span>` : ""
        }</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${it.quantity}×</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${eur(it.total)}</td>
      </tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>`;
}

/** Subtotal + discount (when present) + bold grand total. */
function totalsHtml(o: OrderEmailData): string {
  const hasDiscount = typeof o.discount === "number" && o.discount > 0;
  const subtotalRow =
    hasDiscount && typeof o.subtotal === "number"
      ? `<p style="text-align:right;font-size:13px;color:#777;margin:12px 0 0;">Vmesni seštevek: ${eur(o.subtotal)}</p>
         <p style="text-align:right;font-size:13px;color:#2e7d32;font-weight:bold;margin:2px 0 0;">Popust: −${eur(o.discount as number)}</p>`
      : "";
  return `${subtotalRow}
    <p style="text-align:right;font-size:16px;font-weight:bold;margin:${hasDiscount ? "6px" : "12px"} 0 0;">Skupaj: ${eur(o.total)}</p>`;
}

function addressHtml(a: OrderEmailData["shipping_address"]): string {
  if (!a) return "—";
  return [
    a.name,
    a.line1,
    a.line2 || null,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    a.country,
  ]
    .filter(Boolean)
    .map((l) => escapeHtml(String(l)))
    .join("<br>");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function customerHtml(o: OrderEmailData): string {
  const trackUrl = `${SITE_URL}/order/${encodeURIComponent(o.order_number)}`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2b2b2b;">
    <h1 style="font-size:22px;">Hvala za vaše naročilo! 🧸</h1>
    <p style="font-size:15px;line-height:1.5;">
      Vaše naročilo <strong>${escapeHtml(o.order_number)}</strong> smo prejeli in ga pripravljamo.
      O vsaki spremembi statusa (oddano, dostavljeno) vas bomo obvestili.
    </p>
    <div style="margin:20px 0;padding:16px;background:#faf6ef;border-radius:12px;">
      ${itemsTableHtml(o.items)}
      ${totalsHtml(o)}
      <p style="font-size:13px;color:#777;margin:4px 0 0;">Način plačila: ${paymentLabel(o.payment_method)}</p>
    </div>
    <p style="font-size:14px;">
      Stanje naročila lahko kadar koli spremljate tukaj:<br>
      <a href="${trackUrl}" style="color:#d2691e;font-weight:bold;">${trackUrl}</a>
    </p>
    <p style="font-size:14px;">Lahko pa vnesete številko naročila in svoj e-naslov na strani <a href="${SITE_URL}/sledenje" style="color:#d2691e;">${SITE_URL}/sledenje</a>.</p>
    <p style="font-size:13px;color:#999;margin-top:28px;">Lep pozdrav,<br>Ekipa Eloria</p>
  </div>`;
}

function adminHtml(o: OrderEmailData): string {
  const adminUrl = `${SITE_URL}/admin/orders`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2b2b2b;">
    <h1 style="font-size:20px;">🛎️ Novo naročilo: ${escapeHtml(o.order_number)}</h1>
    <p style="font-size:14px;">Način plačila: <strong>${paymentLabel(o.payment_method)}</strong> · Kupec: ${escapeHtml(o.email)}</p>
    <div style="margin:16px 0;padding:16px;background:#f5f5f5;border-radius:12px;">
      ${itemsTableHtml(o.items)}
      ${totalsHtml(o)}
    </div>
    <p style="font-size:14px;"><strong>Naslov za dostavo</strong><br>${addressHtml(o.shipping_address)}</p>
    <p style="font-size:14px;"><a href="${adminUrl}" style="color:#d2691e;font-weight:bold;">Odpri v skrbniški plošči →</a></p>
  </div>`;
}

/** Send admin alert + customer confirmation for a newly created order. Never throws. */
export async function sendNewOrderEmails(order: OrderEmailData): Promise<void> {
  const resend = client();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping order emails for", order.order_number);
    return;
  }
  const tasks: Promise<unknown>[] = [];

  // Admin alert
  tasks.push(
    resend.emails
      .send({
        from: FROM,
        to: ADMIN_TO,
        replyTo: REPLY_TO,
        subject: `Novo naročilo ${order.order_number} · ${eur(order.total)}`,
        html: adminHtml(order),
      })
      .catch((err) => console.error("[email] admin alert failed:", err)),
  );

  // Customer confirmation
  if (order.email) {
    tasks.push(
      resend.emails
        .send({
          from: FROM,
          to: order.email,
          replyTo: REPLY_TO,
          subject: `Potrditev naročila ${order.order_number} — Eloria`,
          html: customerHtml(order),
        })
        .catch((err) => console.error("[email] customer confirmation failed:", err)),
    );
  }

  await Promise.allSettled(tasks);
}

function readyToShipHtml(o: OrderEmailData): string {
  const adminUrl = `${SITE_URL}/admin/orders`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2b2b2b;">
    <h1 style="font-size:20px;">📦 Pripravi pošiljko: ${escapeHtml(o.order_number)}</h1>
    <p style="font-size:14px;">Naročilo je plačano/potrjeno. <strong>Ustvarite pošiljko v GLS portalu</strong> na spodnji naslov, nato v skrbniški plošči kliknite «Mark as shipped» in vnesite GLS sledilno številko.</p>
    <p style="font-size:14px;margin:14px 0 4px;"><strong>Naslov za dostavo (GLS)</strong></p>
    <div style="padding:14px;background:#f5f5f5;border-radius:10px;font-size:14px;line-height:1.5;">${addressHtml(o.shipping_address)}</div>
    <div style="margin:16px 0;padding:16px;background:#faf6ef;border-radius:12px;">
      ${itemsTableHtml(o.items)}
      ${totalsHtml(o)}
      <p style="font-size:13px;color:#777;margin:4px 0 0;">Plačilo: ${paymentLabel(o.payment_method)} · Kupec: ${escapeHtml(o.email)}</p>
    </div>
    <p style="font-size:14px;"><a href="${adminUrl}" style="color:#d2691e;font-weight:bold;">Odpri naročilo →</a></p>
  </div>`;
}

/** "Ready to ship" notice to the shop inbox — fired when an order is paid/committed. Never throws. */
export async function sendReadyToShipEmail(order: OrderEmailData): Promise<void> {
  const resend = client();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping ready-to-ship for", order.order_number);
    return;
  }
  await resend.emails
    .send({
      from: FROM,
      to: ADMIN_TO,
      replyTo: REPLY_TO,
      subject: `📦 Pripravi pošiljko: ${order.order_number} (plačano)`,
      html: readyToShipHtml(order),
    })
    .catch((err) => console.error("[email] ready-to-ship failed:", err));
}
