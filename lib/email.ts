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

function orderDate(): string {
  try {
    return new Intl.DateTimeFormat("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

/** Itemised rows for the customer receipt: name (+ size), qty, unit price, line total. */
function customerItemsHtml(items: OrderEmailData["items"]): string {
  const head = `
    <tr>
      <th align="left"   style="padding:0 0 8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9a9186;font-weight:700;border-bottom:2px solid #ede4d6;">Izdelek</th>
      <th align="center" style="padding:0 0 8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9a9186;font-weight:700;border-bottom:2px solid #ede4d6;">Kol.</th>
      <th align="right"  style="padding:0 0 8px 12px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9a9186;font-weight:700;border-bottom:2px solid #ede4d6;">Cena</th>
      <th align="right"  style="padding:0 0 8px 12px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9a9186;font-weight:700;border-bottom:2px solid #ede4d6;">Skupaj</th>
    </tr>`;
  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid #f0e9dd;font-size:14px;color:#2b2b2b;font-weight:600;">
          ${escapeHtml(it.product_name)}${
            it.size
              ? `<br><span style="font-size:12px;font-weight:600;color:#c2410c;">Velikost: ${escapeHtml(it.size)}</span>`
              : ""
          }
        </td>
        <td align="center" style="padding:11px 0;border-bottom:1px solid #f0e9dd;font-size:14px;color:#6b645b;">${it.quantity}</td>
        <td align="right"  style="padding:11px 0 11px 12px;border-bottom:1px solid #f0e9dd;font-size:14px;color:#6b645b;white-space:nowrap;">${eur(it.unit_price)}</td>
        <td align="right"  style="padding:11px 0 11px 12px;border-bottom:1px solid #f0e9dd;font-size:14px;color:#2b2b2b;font-weight:700;white-space:nowrap;">${eur(it.total)}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${head}${rows}</table>`;
}

/** Right-aligned summary rows: subtotal, discount, delivery, COD surcharge, grand total. */
function summaryRows(o: OrderEmailData): string {
  const line = (label: string, value: string, opts: { strong?: boolean; color?: string } = {}) => `
    <tr>
      <td style="padding:3px 0;font-size:${opts.strong ? "16px" : "13px"};color:${opts.color ?? (opts.strong ? "#2b2b2b" : "#6b645b")};${opts.strong ? "font-weight:800;" : ""}">${label}</td>
      <td align="right" style="padding:3px 0;font-size:${opts.strong ? "16px" : "13px"};color:${opts.color ?? (opts.strong ? "#2b2b2b" : "#2b2b2b")};font-weight:${opts.strong ? "800" : "600"};white-space:nowrap;">${value}</td>
    </tr>`;

  const hasDiscount = typeof o.discount === "number" && o.discount > 0;
  const netItems = (o.subtotal ?? o.total) - (o.discount ?? 0);
  const surcharge = Math.max(0, Number((o.total - netItems).toFixed(2)));

  let rows = "";
  if (typeof o.subtotal === "number") rows += line("Vmesni seštevek", eur(o.subtotal));
  if (hasDiscount) rows += line("Popust", `−${eur(o.discount as number)}`, { color: "#2e7d32" });
  rows += line("Dostava", "Brezplačno", { color: "#2e7d32" });
  if (surcharge > 0) rows += line("Strošek po povzetju", eur(surcharge));
  rows += `<tr><td colspan="2" style="padding:6px 0 0;"><div style="border-top:2px solid #ede4d6;"></div></td></tr>`;
  rows += line("Skupaj", eur(o.total), { strong: true });

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`;
}

function customerHtml(o: OrderEmailData): string {
  const trackUrl = `${SITE_URL}/order/${encodeURIComponent(o.order_number)}`;
  const date = orderDate();
  const preheader = `Potrdilo naročila ${o.order_number} · Skupaj ${eur(o.total)}`;
  return `
  <div style="background:#f4efe7;margin:0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none!important;opacity:0;color:#f4efe7;font-size:1px;line-height:1px;max-height:0;max-width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;border-collapse:collapse;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(120,80,20,.08);">

          <!-- Header -->
          <tr><td style="background:#c2410c;padding:26px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:24px;font-weight:800;letter-spacing:.14em;color:#ffffff;">ELORIA</td>
              <td align="right" style="font-size:12px;color:#ffe6d3;">Potrdilo naročila</td>
            </tr></table>
          </td></tr>

          <!-- Greeting -->
          <tr><td style="padding:32px 32px 8px;">
            <h1 style="margin:0;font-size:22px;color:#2b2b2b;">Hvala za vaše naročilo! 🧸</h1>
            <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#5a534b;">
              Pozdravljeni${o.shipping_address?.name ? ` ${escapeHtml(o.shipping_address.name.split(" ")[0])}` : ""}, vaše naročilo smo uspešno prejeli in ga že pripravljamo.
              O oddaji in dostavi vas bomo sproti obveščali po e-pošti.
            </p>
          </td></tr>

          <!-- Order meta -->
          <tr><td style="padding:18px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#faf6ef;border-radius:12px;">
              <tr>
                <td style="padding:14px 16px;font-size:13px;color:#6b645b;">Št. naročila<br><span style="font-size:15px;font-weight:800;color:#2b2b2b;">${escapeHtml(o.order_number)}</span></td>
                ${date ? `<td style="padding:14px 16px;font-size:13px;color:#6b645b;">Datum<br><span style="font-size:15px;font-weight:700;color:#2b2b2b;">${date}</span></td>` : ""}
                <td style="padding:14px 16px;font-size:13px;color:#6b645b;">Plačilo<br><span style="font-size:15px;font-weight:700;color:#2b2b2b;">${escapeHtml(paymentLabel(o.payment_method))}</span></td>
              </tr>
            </table>
          </td></tr>

          <!-- Items -->
          <tr><td style="padding:26px 32px 0;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9a9186;font-weight:700;">Povzetek naročila</p>
            ${customerItemsHtml(o.items)}
          </td></tr>

          <!-- Totals -->
          <tr><td style="padding:16px 32px 0;">
            ${summaryRows(o)}
          </td></tr>

          <!-- Shipping address -->
          <tr><td style="padding:24px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr>
                <td valign="top" style="padding:16px;background:#faf6ef;border-radius:12px;font-size:13px;line-height:1.6;color:#5a534b;">
                  <span style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#9a9186;font-weight:700;">Naslov za dostavo</span><br>
                  ${addressHtml(o.shipping_address)}
                </td>
              </tr>
            </table>
            <p style="margin:12px 2px 0;font-size:13px;color:#6b645b;">🚚 Brezplačna dostava po celi Sloveniji — dostava v 1–2 delovnih dneh.</p>
          </td></tr>

          <!-- CTA -->
          <tr><td align="center" style="padding:28px 32px 8px;">
            <a href="${trackUrl}" style="display:inline-block;background:#c2410c;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;padding:14px 30px;border-radius:999px;">Spremljaj naročilo →</a>
            <p style="margin:14px 0 0;font-size:12px;color:#9a9186;">Naročilo lahko spremljate tudi na <a href="${SITE_URL}/sledenje" style="color:#c2410c;">${SITE_URL.replace(/^https?:\/\//, "")}/sledenje</a> z vašo št. naročila in e-naslovom.</p>
          </td></tr>

          <!-- Footer -->
          <tr><td style="padding:24px 32px 30px;border-top:1px solid #f0e9dd;">
            <p style="margin:0;font-size:13px;color:#6b645b;line-height:1.6;">
              Potrebujete pomoč? Odgovorite na to sporočilo ali nam pišite na
              <a href="mailto:${REPLY_TO}" style="color:#c2410c;font-weight:700;">${REPLY_TO}</a>.
            </p>
            <p style="margin:14px 0 0;font-size:12px;color:#a9a196;">Lep pozdrav, <strong style="color:#6b645b;">ekipa Eloria</strong><br>
              <a href="${SITE_URL}" style="color:#a9a196;">${SITE_URL.replace(/^https?:\/\//, "")}</a> · Otroška oblačila in igrače
            </p>
          </td></tr>

        </table>
      </td></tr>
    </table>
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
