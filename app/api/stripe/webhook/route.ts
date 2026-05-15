import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createGlsShipment } from "@/lib/gls";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Stripe needs the raw body to verify the signature.
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    console.error("Stripe webhook signature failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillSession(session.id);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function fulfillSession(sessionId: string) {
  // Re-fetch with line items expanded to get the full picture.
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product", "customer_details"],
  });

  if (session.payment_status !== "paid") return;

  // Idempotency: skip if we already have an order for this session.
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (existing) return;

  const email =
    session.customer_details?.email ?? session.customer_email ?? "";
  const name = session.customer_details?.name ?? null;
  const phone = session.customer_details?.phone ?? null;

  // Upsert customer by email.
  let customerId: string | null = null;
  if (email) {
    const { data: existingCust } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingCust) {
      customerId = existingCust.id;
    } else {
      const { data: newCust } = await supabaseAdmin
        .from("customers")
        .insert({ email, name, phone })
        .select("id")
        .single();
      customerId = newCust?.id ?? null;
    }
  }

  const subtotal = (session.amount_subtotal ?? 0) / 100;
  const shipping = (session.shipping_cost?.amount_total ?? 0) / 100;
  const tax = (session.total_details?.amount_tax ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;

  // Stripe moved shipping_details into collected_information in newer API versions.
  const sd =
    (session as any).collected_information?.shipping_details ??
    (session as any).shipping_details ??
    null;
  const shipping_address = sd
    ? {
        name: sd.name,
        line1: sd.address?.line1,
        line2: sd.address?.line2,
        city: sd.address?.city,
        postal_code: sd.address?.postal_code,
        state: sd.address?.state,
        country: sd.address?.country,
      }
    : null;

  const billing_address = session.customer_details?.address
    ? {
        line1: session.customer_details.address.line1,
        line2: session.customer_details.address.line2,
        city: session.customer_details.address.city,
        postal_code: session.customer_details.address.postal_code,
        state: session.customer_details.address.state,
        country: session.customer_details.address.country,
      }
    : null;

  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_id: customerId,
      email,
      status: "paid",
      payment_status: "paid",
      shipping_status: "pending",
      subtotal,
      shipping_cost: shipping,
      tax,
      total,
      currency: (session.currency ?? "eur").toUpperCase(),
      shipping_address,
      billing_address,
      stripe_session_id: sessionId,
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
    })
    .select("id, order_number")
    .single();
  if (orderErr || !order) {
    console.error("Order insert failed:", orderErr);
    return;
  }

  // Insert line items.
  const items = (session.line_items?.data ?? []).map((li) => {
    const product = li.price?.product;
    const meta =
      typeof product === "object" && product && "metadata" in product
        ? (product as Stripe.Product).metadata
        : {};
    const productIdRaw = meta.product_id;
    const productId = productIdRaw ? Number(productIdRaw) : null;
    return {
      order_id: order.id,
      product_id: Number.isFinite(productId) ? productId : null,
      product_name: li.description ?? "",
      product_slug: meta.slug ?? null,
      unit_price: (li.price?.unit_amount ?? 0) / 100,
      quantity: li.quantity ?? 1,
      total: (li.amount_total ?? 0) / 100,
    };
  });

  if (items.length > 0) {
    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(items);
    if (itemsErr) console.error("Order items insert failed:", itemsErr);
  }

  // Fire-and-forget GLS shipment. We intentionally don't await this inside
  // the webhook response path so a transient GLS failure doesn't make Stripe
  // retry the whole order-creation flow.
  fulfillGlsShipment({
    orderId: order.id,
    order_number: (order as any).order_number ?? "",
    email,
    shipping_address: shipping_address as any,
    phone,
  }).catch((err) => {
    console.error("GLS fulfillment crashed:", err);
  });
}

async function fulfillGlsShipment(args: {
  orderId: string;
  order_number: string;
  email: string;
  shipping_address: Record<string, unknown> | null;
  phone: string | null;
}) {
  if (!args.shipping_address) return;
  try {
    const result = await createGlsShipment({
      order_number: args.order_number,
      email: args.email,
      shipping_address: args.shipping_address as any,
      phone: args.phone,
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
      .eq("id", args.orderId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`GLS shipment failed for order ${args.order_number}:`, message);
    await supabaseAdmin
      .from("orders")
      .update({ gls_error: message })
      .eq("id", args.orderId);
  }
}
