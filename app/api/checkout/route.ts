import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

type IncomingLine = {
  productId: number;
  slug: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { lines?: IncomingLine[] };
    const lines = body.lines ?? [];
    if (lines.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    // Re-validate prices against the database — never trust client-supplied prices.
    const productIds = lines.map((l) => l.productId);
    // productId is the *public* id (woo_id when present, else 1_000_000+supabase id).
    // Look up by woo_id first; fall back to the high-id mapping if needed.
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

    const lineItems: Array<{
      quantity: number;
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: {
          name: string;
          images?: string[];
          metadata?: Record<string, string>;
        };
      };
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
      lineItems.push({
        quantity: Math.max(1, Math.min(99, Math.floor(l.quantity))),
        price_data: {
          currency: "eur",
          unit_amount: Math.round(Number(dbp.price) * 100),
          product_data: {
            name: dbp.name_en,
            images: dbp.image
              ? [absoluteUrl(req, dbp.image)]
              : undefined,
            metadata: {
              product_id: String(dbp.id),
              slug: dbp.slug,
            },
          },
        },
      });
    }

    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      currency: "eur",
      // Collect shipping + billing — Stripe handles validation + region.
      shipping_address_collection: {
        allowed_countries: ["SI", "AT", "HR", "IT", "DE", "HU", "BE", "NL", "FR"],
      },
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      // Free shipping for now; the user can edit this rate in Stripe later
      // or we can read it from a settings table.
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
