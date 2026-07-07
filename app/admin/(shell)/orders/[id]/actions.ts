"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { handoffToCourier } from "@/lib/courier-handoff";

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
  // Best-effort timestamp — ignored if the migration hasn't added the column yet.
  await supabaseAdmin
    .from("orders")
    .update({ shipped_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin");
}

export async function markOnTheWay(id: string) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ shipping_status: "in_transit" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  // Best-effort timestamp — ignored if the migration hasn't added the column yet.
  await supabaseAdmin
    .from("orders")
    .update({ in_transit_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
}

export async function markDelivered(id: string) {
  const { data: ord } = await supabaseAdmin
    .from("orders")
    .select("paid_at")
    .eq("id", id)
    .maybeSingle();

  // Delivered → book revenue. For COD the cash is collected on delivery, so
  // this is the moment it counts as paid; card/bank are already paid (no-op).
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      shipping_status: "delivered",
      payment_status: "paid",
      paid_at: ord?.paid_at ?? new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  // Best-effort timestamp — ignored if the migration hasn't added the column yet.
  await supabaseAdmin
    .from("orders")
    .update({ delivered_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
  revalidatePath("/admin");
}

export async function markAwaitingPaymentAsPaid(id: string) {
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, email, shipping_address, tracking_number, total, payment_method")
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

  // Payment confirmed → hand off to courier (stamp status + email the shop).
  const { data: lineItems } = await supabaseAdmin
    .from("order_items")
    .select("product_name, quantity, unit_price, total")
    .eq("order_id", id);
  await handoffToCourier(id, {
    order_number: existing.order_number,
    email: existing.email,
    total: Number(existing.total),
    currency: "EUR",
    payment_method: existing.payment_method,
    shipping_address: existing.shipping_address as any,
    items: (lineItems ?? []).map((it: any) => ({
      product_name: it.product_name,
      quantity: it.quantity,
      unit_price: Number(it.unit_price),
      total: Number(it.total),
    })),
  });
  // Shipment is created manually in the Express One portal — no auto-courier API.

  revalidatePath("/admin/orders");
  revalidatePath("/admin/orders/" + id);
}

