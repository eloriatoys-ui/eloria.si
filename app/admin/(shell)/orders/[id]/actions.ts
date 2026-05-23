"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createGlsShipment } from "@/lib/gls";

export async function markShipped(id: string, formData: FormData) {
  const trackingCarrier = String(formData.get("tracking_carrier") ?? "").trim() || null;
  const trackingNumber = String(formData.get("tracking_number") ?? "").trim() || null;
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      shipping_status: "shipped",
      status: "fulfilled",
      tracking_carrier: trackingCarrier,
      tracking_number: trackingNumber,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin");
}

export async function markDelivered(id: string) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ shipping_status: "delivered" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
}

export async function markAwaitingPaymentAsPaid(id: string) {
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, email, shipping_address, tracking_number")
    .eq("id", id)
    .maybeSingle();
  if (!existing) throw new Error("Order not found");

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "paid",
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  // If no GLS parcel yet, trigger one in the background. We swallow errors so
  // the admin action returns success even when GLS auth is down; the order
  // detail page exposes a Retry button.
  if (!existing.tracking_number) {
    createGlsShipment({
      order_number: existing.order_number,
      email: existing.email,
      shipping_address: existing.shipping_address as any,
      phone: null,
    })
      .then(async (result) => {
        await supabaseAdmin
          .from("orders")
          .update({
            tracking_carrier: "GLS",
            tracking_number: result.parcelNumber,
            gls_parcel_id: result.parcelId,
            gls_label_pdf: result.labelPdfBase64,
            gls_error: null,
            gls_created_at: new Date().toISOString(),
          })
          .eq("id", id);
      })
      .catch(async (err) => {
        const message = err instanceof Error ? err.message : String(err);
        await supabaseAdmin
          .from("orders")
          .update({ gls_error: message })
          .eq("id", id);
      });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
}

export async function createGlsShipmentForOrder(id: string) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, email, shipping_address")
    .eq("id", id)
    .maybeSingle();
  if (!order) throw new Error("Order not found");

  try {
    const result = await createGlsShipment({
      order_number: order.order_number,
      email: order.email,
      shipping_address: order.shipping_address as any,
      phone: null,
    });
    await supabaseAdmin
      .from("orders")
      .update({
        tracking_carrier: "GLS",
        tracking_number: result.parcelNumber,
        gls_parcel_id: result.parcelId,
        gls_label_pdf: result.labelPdfBase64,
        gls_error: null,
        gls_created_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabaseAdmin.from("orders").update({ gls_error: message }).eq("id", id);
    throw new Error(message);
  }
  revalidatePath("/admin/orders/" + id);
}
