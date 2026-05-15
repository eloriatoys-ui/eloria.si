// One-off recovery script: replays what the Stripe webhook handler would have
// done for a checkout.session.completed event that was never delivered (e.g.
// because the webhook was misconfigured at the time of payment).
//
// Usage:
//   node scripts/recover-stripe-order.mjs <stripe_session_id>
// Example:
//   node scripts/recover-stripe-order.mjs cs_live_a10KqIs...
//
// Reads STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// from .env.local.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const envText = fs.readFileSync(envPath, "utf8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sessionId = process.argv[2];
if (!sessionId) {
  console.error("Usage: node scripts/recover-stripe-order.mjs <session_id>");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const session = await stripe.checkout.sessions.retrieve(sessionId, {
  expand: ["line_items.data.price.product", "customer_details"],
});

if (session.payment_status !== "paid") {
  console.error(`Session ${sessionId} payment_status=${session.payment_status} — not paid, aborting.`);
  process.exit(1);
}

const { data: existing } = await supabase
  .from("orders")
  .select("id, order_number")
  .eq("stripe_session_id", sessionId)
  .maybeSingle();
if (existing) {
  console.log(`Order already exists for this session: ${existing.order_number} (id=${existing.id})`);
  process.exit(0);
}

const email = session.customer_details?.email ?? session.customer_email ?? "";
const name = session.customer_details?.name ?? null;
const phone = session.customer_details?.phone ?? null;

let customerId = null;
if (email) {
  const { data: existingCust } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existingCust) {
    customerId = existingCust.id;
  } else {
    const { data: newCust, error: custErr } = await supabase
      .from("customers")
      .insert({ email, name, phone })
      .select("id")
      .single();
    if (custErr) console.warn("customer insert failed:", custErr);
    customerId = newCust?.id ?? null;
  }
}

const subtotal = (session.amount_subtotal ?? 0) / 100;
const shipping = (session.shipping_cost?.amount_total ?? 0) / 100;
const tax = (session.total_details?.amount_tax ?? 0) / 100;
const total = (session.amount_total ?? 0) / 100;

const sd =
  session.collected_information?.shipping_details ??
  session.shipping_details ??
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

const { data: order, error: orderErr } = await supabase
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
  process.exit(1);
}

const items = (session.line_items?.data ?? []).map((li) => {
  const product = li.price?.product;
  const meta =
    typeof product === "object" && product && "metadata" in product
      ? product.metadata
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
  const { error: itemsErr } = await supabase.from("order_items").insert(items);
  if (itemsErr) console.error("Order items insert failed:", itemsErr);
}

console.log(`✅ Recovered order ${order.order_number} (id=${order.id})`);
console.log(`   Email:    ${email}`);
console.log(`   Total:    ${total} ${(session.currency ?? "eur").toUpperCase()}`);
console.log(`   Items:    ${items.length}`);
console.log(`   Note: GLS shipment is NOT created by this script — use the`);
console.log(`   admin "Create GLS shipment" button or re-run the webhook handler.`);
