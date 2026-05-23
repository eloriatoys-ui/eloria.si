import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createGlsShipment } from "@/lib/gls";

type IncomingLine = {
  productId: number;
  slug: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type IncomingAddress = {
  name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
  email: string;
};

type IncomingBody = {
  lines?: IncomingLine[];
  method?: "card" | "bank_transfer" | "cod";
  address?: IncomingAddress;
};

function codSurcharge(): number {
  return Number(process.env.ELORIA_COD_SURCHARGE_EUR ?? "2.00");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as IncomingBody;
    const lines = body.lines ?? [];
    const method = body.method ?? "card";
    if (lines.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // Re-validate prices against the database — never trust client-supplied prices.
    const productIds = lines.map((l) => l.productId);
    const wooIds = productIds.filter((id) => id < 1_000_000);
    const internalIds = productIds
      .filter((id) => id >= 1_000_000)
      .map((id) => id - 1_000_000);

    const [{ data: byWoo }, { data: byInternal }] = await Promise.all([
      wooIds.length
        ? supabaseAdmin
            .from("products")
            .select("id, woo_id, slug, name_en, price, image, stock_status, is_published")
            .in("woo_id", wooIds)
        : Promise.resolve({ data: [] as any[] }),
      internalIds.length
        ? supabaseAdmin
            .from("products")
            .select("id, woo_id, slug, name_en, price, image, stock_status, is_published")
            .in("id", internalIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const dbProducts = [...(byWoo ?? []), ...(byInternal ?? [])];
    const byPublicId = new Map<number, (typeof dbProducts)[number]>();
    for (const p of dbProducts) {
      const pubId = p.woo_id ?? 1_000_000 + p.id;
      byPublicId.set(pubId, p);
    }

    // Build a normalized list of validated lines with current prices.
    const validated: Array<{
      product_id: number;
      slug: string;
      name: string;
      image: string | null;
      unit_price: number;
      quantity: number;
      line_total: number;
    }> = [];
    for (const l of lines) {
      const dbp = byPublicId.get(l.productId);
      if (!dbp) {
        return NextResponse.json(
          { error: `Product ${l.productId} not found` },
          { status: 400 },
        );
      }
      if (!dbp.is_published || dbp.stock_status !== "instock") {
        return NextResponse.json(
          { error: `${dbp.name_en} is no longer available.` },
          { status: 400 },
        );
      }
      const qty = Math.max(1, Math.min(99, Math.floor(l.quantity)));
      const unit = Number(dbp.price);
      validated.push({
        product_id: dbp.id,
        slug: dbp.slug,
        name: dbp.name_en,
        image: dbp.image ?? null,
        unit_price: unit,
        quantity: qty,
        line_total: unit * qty,
      });
    }

    const subtotal = validated.reduce((s, l) => s + l.line_total, 0);
    const surcharge = method === "cod" ? codSurcharge() : 0;
    const total = subtotal + surcharge;

    // Card flow: hand off to Stripe Checkout (existing behavior).
    if (method === "card") {
      const origin = new URL(req.url).origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: validated.map((v) => ({
          quantity: v.quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(v.unit_price * 100),
            product_data: {
              name: v.name,
              images: v.image ? [absoluteUrl(req, v.image)] : undefined,
              metadata: { product_id: String(v.product_id), slug: v.slug },
            },
          },
        })),
        currency: "eur",
        shipping_address_collection: {
          allowed_countries: ["SI", "AT", "HR", "IT", "DE", "HU", "BE", "NL", "FR"],
        },
        billing_address_collection: "auto",
        phone_number_collection: { enabled: true },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "eur" },
              display_name: "Standard shipping (5–7 days)",
            },
          },
        ],
        automatic_tax: { enabled: false },
        success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart?cancelled=1`,
      });
      return NextResponse.json({ url: session.url });
    }

    // Bank transfer + COD: create the order directly in our DB, no Stripe.
    const addr = body.address;
    if (!addr?.email || !addr?.name || !addr?.street || !addr?.city || !addr?.postal_code) {
      return NextResponse.json(
        { error: "Shipping address is required for this payment method." },
        { status: 400 },
      );
    }

    const shipping_address = {
      name: addr.name,
      line1: addr.street,
      line2: null,
      city: addr.city,
      postal_code: addr.postal_code,
      state: null,
      country: (addr.country ?? "SI").toUpperCase(),
    };

    // Upsert customer.
    let customerId: string | null = null;
    {
      const { data: existingCust } = await supabaseAdmin
        .from("customers")
        .select("id")
        .eq("email", addr.email)
        .maybeSingle();
      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const { data: newCust } = await supabaseAdmin
          .from("customers")
          .insert({ email: addr.email, name: addr.name, phone: addr.phone ?? null })
          .select("id")
          .single();
        customerId = newCust?.id ?? null;
      }
    }

    const payment_status =
      method === "bank_transfer" ? "awaiting_payment" : "cod_pending";
    const order_status =
      method === "bank_transfer" ? "pending" : "paid"; // COD treats the order as committed; payment is collected on delivery.

    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_id: customerId,
        email: addr.email,
        status: order_status,
        payment_status,
        shipping_status: "pending",
        payment_method: method,
        subtotal,
        shipping_cost: 0,
        tax: 0,
        cod_surcharge: surcharge,
        total,
        currency: "EUR",
        shipping_address,
        billing_address: shipping_address,
      })
      .select("id, order_number")
      .single();
    if (orderErr || !order) {
      console.error("Order insert failed:", orderErr);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    const items = validated.map((v) => ({
      order_id: order.id,
      product_id: v.product_id,
      product_name: v.name,
      product_slug: v.slug,
      unit_price: v.unit_price,
      quantity: v.quantity,
      total: v.line_total,
    }));
    if (items.length > 0) {
      const { error: itemsErr } = await supabaseAdmin
        .from("order_items")
        .insert(items);
      if (itemsErr) console.error("Order items insert failed:", itemsErr);
    }

    // COD orders: kick off GLS shipment immediately (with COD service so courier
    // collects cash). Bank-transfer orders wait for admin to confirm payment.
    if (method === "cod") {
      fulfillCodShipment(order.id, {
        order_number: order.order_number,
        email: addr.email,
        shipping_address,
        phone: addr.phone ?? null,
        cod_amount_eur: total,
      }).catch((err) => console.error("COD GLS shipment crashed:", err));
    }

    return NextResponse.json({
      url: `/order/${order.order_number}`,
      order_number: order.order_number,
    });
  } catch (err: any) {
    console.error("checkout error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout failed" },
      { status: 500 },
    );
  }
}

async function fulfillCodShipment(
  orderId: string,
  forShipping: Parameters<typeof createGlsShipment>[0],
) {
  try {
    const result = await createGlsShipment(forShipping);
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
      .eq("id", orderId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`COD GLS shipment failed for ${forShipping.order_number}:`, message);
    await supabaseAdmin.from("orders").update({ gls_error: message }).eq("id", orderId);
  }
}

function absoluteUrl(req: Request, pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  const origin = new URL(req.url).origin;
  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
