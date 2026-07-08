import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendReadyToShipEmail, type OrderEmailData } from "@/lib/email";
import { issueInvoice } from "@/lib/issue-invoice";
import { buildShipmentDraft } from "@/lib/courier/shipment";
import { fileWithExpressOne, isAutoFileEnabled } from "@/lib/courier/express-one";

// Called the moment an order becomes paid/committed (card paid, bank transfer
// confirmed, or COD placed). Stamps courier_notified_at — which lights up the
// "Oddano kurirju (GLS)" step on the customer timeline — and emails the shop a
// "ready to ship" notice with the delivery address. Best-effort: never throws,
// and the timestamp write is ignored if the column isn't there yet.
export async function handoffToCourier(
  orderId: string,
  order: OrderEmailData,
): Promise<void> {
  try {
    await supabaseAdmin
      .from("orders")
      .update({ courier_notified_at: new Date().toISOString() })
      .eq("id", orderId);
  } catch (err) {
    console.error("[courier-handoff] timestamp update failed:", err);
  }
  // Issue the PDF invoice → Google Drive (best-effort), then notify the shop.
  await issueInvoice(orderId, order);

  // Automatic courier filing (flag-gated, default OFF). When enabled and the
  // Express One API is configured, file the shipment and store the tracking
  // number + parcel id so the customer timeline lights up automatically. Any
  // failure falls through to the manual "ready to ship" email below.
  const autoFiled = await tryAutoFile(orderId);

  if (!autoFiled) await sendReadyToShipEmail(order);
}

async function tryAutoFile(orderId: string): Promise<boolean> {
  if (!isAutoFileEnabled()) return false;
  try {
    const { data: row } = await supabaseAdmin
      .from("orders")
      .select("order_number, email, payment_method, payment_status, total, currency, shipping_address, customer_id")
      .eq("id", orderId)
      .maybeSingle();
    if (!row) return false;

    let phone: string | null = null;
    if (row.customer_id) {
      const { data: cust } = await supabaseAdmin
        .from("customers")
        .select("phone")
        .eq("id", row.customer_id)
        .maybeSingle();
      phone = cust?.phone ?? null;
    }

    const draft = buildShipmentDraft(row as any, phone);
    if (draft.missing.length > 0) {
      console.warn(`[courier-handoff] auto-file skipped for ${draft.reference} — missing: ${draft.missing.join(", ")}`);
      return false;
    }

    const filed = await fileWithExpressOne(draft);
    await supabaseAdmin
      .from("orders")
      .update({
        shipping_status: "shipped",
        shipped_at: new Date().toISOString(),
        tracking_carrier: filed.carrier,
        tracking_number: filed.trackingNumber,
      })
      .eq("id", orderId);
    console.log(`[courier-handoff] auto-filed ${draft.reference} → ${filed.carrier} #${filed.trackingNumber}`);
    return true;
  } catch (err) {
    console.error("[courier-handoff] auto-file failed, falling back to manual:", err);
    return false;
  }
}
