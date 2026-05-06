"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

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
