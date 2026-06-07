import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// Public order lookup. Requires BOTH the order number and the email used on the
// order, so a guessed order code alone can't expose someone's details.
export async function POST(req: Request) {
  let body: { order_number?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neveljavna zahteva." }, { status: 400 });
  }

  const orderNumber = String(body.order_number ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Vnesite številko naročila in e-naslov." },
      { status: 400 },
    );
  }

  // select("*") so the lookup keeps working even if the shipped_at/delivered_at
  // migration hasn't been applied yet (missing columns just come back absent).
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  // Generic message either way — don't reveal whether the order number exists.
  if (!order || String(order.email ?? "").trim().toLowerCase() !== email) {
    return NextResponse.json(
      { error: "Naročila s temi podatki ni mogoče najti. Preverite številko in e-naslov." },
      { status: 404 },
    );
  }

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("product_name, quantity, unit_price, total")
    .eq("order_id", order.id);

  // Return only customer-safe fields (never Stripe IDs, GLS label blob, email, etc.).
  const o = order as Record<string, any>;
  const safe = {
    order_number: o.order_number,
    total: o.total,
    currency: o.currency,
    payment_method: o.payment_method,
    payment_status: o.payment_status,
    shipping_status: o.shipping_status,
    created_at: o.created_at,
    paid_at: o.paid_at ?? null,
    shipped_at: o.shipped_at ?? null,
    in_transit_at: o.in_transit_at ?? null,
    delivered_at: o.delivered_at ?? null,
    tracking_carrier: o.tracking_carrier ?? null,
    tracking_number: o.tracking_number ?? null,
  };
  return NextResponse.json({ order: safe, items: items ?? [] });
}
