import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendNewOrderEmails } from "@/lib/email";
import { handoffToCourier } from "@/lib/courier-handoff";
import { computeDiscount } from "@/lib/cart/discount";

type IncomingLine = {
  productId: number;
  slug: string;
  name: string;
  image?: string;
  price: number;
  size?: string;
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
      return NextResponse.json({ error: "Košarica je prazna." }, { status: 400 });
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
            .select("id, woo_id, slug, name_en, price, image, stock_status, sizes, is_published")
            .in("woo_id", wooIds)
        : Promise.resolve({ data: [] as any[] }),
      internalIds.length
        ? supabaseAdmin
            .from("products")
            .select("id, woo_id, slug, name_en, price, image, stock_status, sizes, is_published")
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
      // Public catalog id (woo_id or 1_000_000+id) — the same id the storefront
      // and Meta Pixel use, kept consistent across all pixel/CAPI events.
      public_id: number;
      slug: string;
      name: string;
      image: string | null;
      size: string | null;
      unit_price: number;
      quantity: number;
      line_total: number;
    }> = [];
    for (const l of lines) {
      const dbp = byPublicId.get(l.productId);
      if (!dbp) {
        return NextResponse.json(
          { error: `Izdelek ${l.productId} ni najden` },
          { status: 400 },
        );
      }
      if (!dbp.is_published || dbp.stock_status !== "instock") {
        return NextResponse.json(
          { error: `${dbp.name_en} ni več na voljo.` },
          { status: 400 },
        );
      }
      // When a product is offered in sizes, require a valid one — never trust
      // an arbitrary client-supplied size.
      const dbSizes: string[] = Array.isArray(dbp.sizes) ? dbp.sizes : [];
      let size: string | null = null;
      if (dbSizes.length > 0) {
        const chosen = typeof l.size === "string" ? l.size.trim() : "";
        if (!chosen || !dbSizes.includes(chosen)) {
          return NextResponse.json(
            { error: `Izberite velikost za ${dbp.name_en}.` },
            { status: 400 },
          );
        }
        size = chosen;
      }
      const qty = Math.max(1, Math.min(99, Math.floor(l.quantity)));
      const unit = Number(dbp.price);
      validated.push({
        product_id: dbp.id,
        public_id: l.productId,
        slug: dbp.slug,
        name: dbp.name_en,
        image: dbp.image ?? null,
        size,
        unit_price: unit,
        quantity: qty,
        line_total: unit * qty,
      });
    }

    const subtotal = validated.reduce((s, l) => s + l.line_total, 0);
    const itemCount = validated.reduce((n, l) => n + l.quantity, 0);
    // Automatic 40% promo when the cart holds more than one item. Recomputed
    // here on the server so the charged amount never trusts the client.
    const { eligible: discountEligible, percent: discountPercent, discount, discountedSubtotal } =
      computeDiscount(itemCount, subtotal);
    const surcharge = method === "cod" ? codSurcharge() : 0;
    const total = discountedSubtotal + surcharge;

    // Card flow: hand off to Stripe Checkout (existing behavior).
    if (method === "card") {
      const origin = new URL(req.url).origin;
      // Apply the promo as a real Stripe coupon so the hosted checkout page
      // shows the "−40%" discount line explicitly and charges the net amount.
      const discounts = discountEligible
        ? [
            {
              coupon: (
                await stripe.coupons.create({
                  percent_off: discountPercent,
                  duration: "once",
                  name: `${discountPercent}% popust (nakup več izdelkov)`,
                })
              ).id,
            },
          ]
        : undefined;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        // Show the hosted payment page in Slovenian — SI shoppers hesitate to
        // enter card details on an English checkout for an unfamiliar brand.
        locale: "sl",
        // Force EUR everywhere — disable Stripe Adaptive Pricing so the customer
        // is never shown a local currency (e.g. AED) with a conversion fee.
        adaptive_pricing: { enabled: false },
        discounts,
        line_items: validated.map((v) => ({
          quantity: v.quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(v.unit_price * 100),
            product_data: {
              name: v.name,
              description: v.size ? `Velikost: ${v.size}` : undefined,
              images: v.image ? [absoluteUrl(req, v.image)] : undefined,
              metadata: {
                product_id: String(v.product_id),
                public_id: String(v.public_id),
                slug: v.slug,
                size: v.size ?? "",
              },
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
        success_url: `${origin}/narocilo/uspeh?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/kosarica?cancelled=1`,
      });
      return NextResponse.json({ url: session.url });
    }

    // Bank transfer + COD: create the order directly in our DB, no Stripe.
    const addr = body.address;
    if (!addr?.email || !addr?.name || !addr?.street || !addr?.city || !addr?.postal_code) {
      return NextResponse.json(
        { error: "Za ta način plačila je obvezen naslov za dostavo." },
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
        { error: "Naročila ni bilo mogoče ustvariti" },
        { status: 500 },
      );
    }

    const items = validated.map((v) => ({
      order_id: order.id,
      product_id: v.product_id,
      product_name: v.name,
      product_slug: v.slug,
      size: v.size,
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

    // Notify the shop + confirm to the customer. Best-effort, never blocks.
    const orderEmail = {
      order_number: order.order_number,
      email: addr.email,
      subtotal,
      discount,
      total,
      currency: "EUR",
      payment_method: method,
      shipping_address,
      items: validated.map((v) => ({
        product_name: v.name,
        size: v.size,
        quantity: v.quantity,
        unit_price: v.unit_price,
        total: v.line_total,
      })),
    };
    await sendNewOrderEmails(orderEmail);

    // COD is committed on order (paid on delivery) → hand off to courier now.
    // Bank transfer waits until the admin confirms payment.
    // COD is committed on order (paid on delivery) → hand off to courier now.
    // Bank transfer waits until the admin confirms payment. Shipments are
    // created manually in the Express One portal (no auto-GLS API).
    if (method === "cod") {
      await handoffToCourier(order.id, orderEmail);
    }

    return NextResponse.json({
      url: `/narocilo/${order.order_number}`,
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

function absoluteUrl(req: Request, pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  const origin = new URL(req.url).origin;
  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
