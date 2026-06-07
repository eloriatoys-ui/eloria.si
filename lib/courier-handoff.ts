import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendReadyToShipEmail, type OrderEmailData } from "@/lib/email";

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
  await sendReadyToShipEmail(order);
}
