import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { markShipped, markOnTheWay, markDelivered, markAwaitingPaymentAsPaid } from "./actions";
import { getTrackingUrl, DEFAULT_CARRIER } from "@/lib/courier";
import { buildShipmentDraft } from "@/lib/courier/shipment";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const [{ data: order }, { data: items }] = await Promise.all([
    supabaseAdmin.from("orders").select("*").eq("id", params.id).maybeSingle(),
    supabaseAdmin
      .from("order_items")
      .select("id, product_name, product_slug, unit_price, quantity, total")
      .eq("order_id", params.id),
  ]);
  if (!order) notFound();

  // Phone is stored on the customer (Stripe/COD) — pull it so the shipment draft is complete.
  let customerPhone: string | null = null;
  if (order.customer_id) {
    const { data: cust } = await supabaseAdmin
      .from("customers")
      .select("phone")
      .eq("id", order.customer_id)
      .maybeSingle();
    customerPhone = cust?.phone ?? null;
  }

  const ship = markShipped.bind(null, params.id);
  const onTheWay = markOnTheWay.bind(null, params.id);
  const deliver = markDelivered.bind(null, params.id);
  const activatePayment = markAwaitingPaymentAsPaid.bind(null, params.id);
  const sa = order.shipping_address as any;
  const trackingUrl = getTrackingUrl(order.tracking_carrier, order.tracking_number);
  const shipment = buildShipmentDraft(order as any, customerPhone);

  return (
    <div>
      <Link href="/admin/orders" className="text-[13px] font-bold text-orange-dark hover:underline">
        ← Orders
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-extrabold text-ink">{order.order_number}</h1>
        <span className="text-sm text-ink/70">
          {new Date(order.created_at).toLocaleString()}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr,360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">Items</h2>
            <ul className="mt-3 divide-y divide-orange-dark/10">
              {(items ?? []).map((it: any) => (
                <li key={it.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{it.product_name}</p>
                    {it.product_slug && (
                      <p className="text-[12px] text-ink/60">/{it.product_slug}</p>
                    )}
                  </div>
                  <p className="text-[13px] text-ink/70">
                    {it.quantity} × €{Number(it.unit_price).toFixed(2)}
                  </p>
                  <p className="font-bold text-ink">€{Number(it.total).toFixed(2)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-orange-dark/10 pt-4 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink/70">Subtotal</dt>
                <dd className="font-bold text-ink">€{Number(order.subtotal).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Shipping</dt>
                <dd className="font-bold text-ink">€{Number(order.shipping_cost).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Tax</dt>
                <dd className="font-bold text-ink">€{Number(order.tax).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-orange-dark/10 pt-2 text-[16px]">
                <dt className="font-extrabold text-ink">Total</dt>
                <dd className="font-extrabold text-ink">€{Number(order.total).toFixed(2)}</dd>
              </div>
            </dl>
          </section>

          {sa && (
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Shipping address
              </h2>
              <address className="mt-3 not-italic text-[14px] text-ink">
                <p className="font-bold">{sa.name}</p>
                <p>{sa.line1}</p>
                {sa.line2 && <p>{sa.line2}</p>}
                <p>
                  {[sa.postal_code, sa.city, sa.state].filter(Boolean).join(" ")}
                </p>
                <p>{sa.country}</p>
              </address>
            </section>
          )}

          {/* Ready-to-file shipment data for the courier (Express One). */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-blue-900">
                Pošiljka — pripravljeno za oddajo (Express One)
              </h2>
              {shipment.missing.length === 0 ? (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-800">
                  Pripravljeno ✓
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                  Manjka: {shipment.missing.join(", ")}
                </span>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
              <ShipField label="Referenca" value={shipment.reference} />
              <ShipField label="Paketov" value={String(shipment.parcel.count)} />
              <ShipField label="Prejemnik" value={shipment.recipient.name} />
              <ShipField label="Telefon" value={shipment.recipient.phone ?? "—"} />
              <ShipField label="Ulica" value={shipment.recipient.street} />
              <ShipField label="Hišna št." value={[shipment.recipient.houseNumber, shipment.recipient.houseNumberInfo].filter(Boolean).join(" ") || "—"} />
              <ShipField label="Poštna št." value={shipment.recipient.postalCode} />
              <ShipField label="Kraj" value={shipment.recipient.city} />
              <ShipField label="Država" value={shipment.recipient.country} />
              <ShipField label="E-pošta" value={shipment.recipient.email} />
              <ShipField
                label="Odkupnina (COD)"
                value={shipment.cod ? `€${shipment.cod.amount.toFixed(2)}` : "Ni (plačano vnaprej)"}
              />
              <ShipField label="Vsebina" value={shipment.parcel.content} />
            </dl>
            <p className="mt-4 text-[11px] text-blue-900/60">
              Samodejna oddaja se vklopi z <code>COURIER_AUTOFILE_ENABLED=true</code>, ko so
              nastavljeni Express One API dostopi.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
              Customer
            </h2>
            <p className="mt-2 font-bold text-ink">{order.email}</p>
          </section>

          <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">Status</h2>
            <dl className="mt-3 space-y-1 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ink/70">Method</dt>
                <dd className="font-bold text-ink">
                  {order.payment_method === "bank_transfer"
                    ? "Bank transfer"
                    : order.payment_method === "cod"
                    ? "Cash on delivery"
                    : "Card"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Payment</dt>
                <dd className="font-bold text-ink">{order.payment_status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Shipping</dt>
                <dd className="font-bold text-ink">{order.shipping_status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/70">Order</dt>
                <dd className="font-bold text-ink">{order.status}</dd>
              </div>
            </dl>
          </section>

          {order.invoice_url && (
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">Račun</h2>
              <a
                href={order.invoice_url}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-block text-[13px] font-bold text-orange-dark hover:underline"
              >
                Odpri račun (PDF) →
              </a>
            </section>
          )}

          {order.payment_status === "awaiting_payment" && (
            <form
              action={activatePayment}
              className="rounded-2xl border-2 border-amber-500/40 bg-amber-50 p-5"
            >
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-amber-900">
                Awaiting bank transfer
              </h2>
              <p className="mt-2 text-[12px] text-amber-900/80">
                Customer was shown a UPN QR code at checkout. Verify the
                transfer arrived in your OTP account (reference{" "}
                <span className="font-mono">SI00 {order.order_number.replace(/[^0-9-]/g, "")}</span>
                ), then activate the order below. Activation triggers GLS
                shipment automatically.
              </p>
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-amber-600 px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-amber-700"
                style={{ color: "#FFFFFF" }}
              >
                <span style={{ color: "#FFFFFF" }}>✓ Mark as paid · activate order</span>
              </button>
            </form>
          )}

          {(order.payment_status === "paid" || order.payment_method === "cod") && (
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Dostava · Express One
              </h2>
              {order.tracking_number ? (
                <div className="mt-3 space-y-2 text-[13px]">
                  <p>
                    <span className="text-ink/60">{order.tracking_carrier ?? "Express One"} #</span>{" "}
                    <span className="font-bold text-ink">{order.tracking_number}</span>
                  </p>
                  {trackingUrl && (
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-block text-[13px] font-bold text-orange-dark hover:underline"
                    >
                      Track parcel →
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-[12px] text-ink/70">
                  Ustvarite paket v Express One portalu, nato spodaj vnesite sledilno številko.
                </p>
              )}
              <a
                href="https://inet.expressone.si/"
                target="_blank"
                rel="noopener"
                className="mt-3 inline-block text-[12px] font-bold text-ink/60 hover:text-orange-dark hover:underline"
              >
                Odpri Express One portal ↗
              </a>
            </section>
          )}

          {(order.payment_status === "paid" || order.payment_method === "cod") && order.shipping_status === "pending" && (
            <form action={ship} className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Mark as shipped (Poslano kurirju)
              </h2>
              <label className="mt-3 block text-[12px] font-bold text-ink/70">Carrier</label>
              <input
                name="tracking_carrier"
                defaultValue={DEFAULT_CARRIER}
                placeholder="Express One, GLS, Pošta Slovenije…"
                className="mt-1 w-full rounded-lg border border-orange-dark/20 bg-cream px-3 py-2 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
              <label className="mt-3 block text-[12px] font-bold text-ink/70">
                Tracking number
              </label>
              <input
                name="tracking_number"
                className="mt-1 w-full rounded-lg border border-orange-dark/20 bg-cream px-3 py-2 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-orange px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
                style={{ color: "#FFFFFF" }}
              >
                <span style={{ color: "#FFFFFF" }}>Mark as shipped</span>
              </button>
            </form>
          )}

          {order.shipping_status === "shipped" && (
            <form action={onTheWay} className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Mark on the way (Na poti)
              </h2>
              <p className="mt-2 text-[12px] text-ink/70">
                Klikni, ko GLS potrdi prevzem / da je paket na poti.
              </p>
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-blue-700"
                style={{ color: "#FFFFFF" }}
              >
                <span style={{ color: "#FFFFFF" }}>Mark on the way</span>
              </button>
            </form>
          )}

          {(order.shipping_status === "shipped" || order.shipping_status === "in_transit") && (
            <form action={deliver} className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Mark as delivered
              </h2>
              {order.tracking_number && (
                <p className="mt-2 text-[12px] text-ink/70">
                  Tracking: {order.tracking_carrier ?? ""} {order.tracking_number}
                </p>
              )}
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-emerald-700 px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-emerald-800"
                style={{ color: "#FFFFFF" }}
              >
                <span style={{ color: "#FFFFFF" }}>Mark as delivered</span>
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

function ShipField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-blue-900/60">{label}</dt>
      <dd className="mt-0.5 break-words font-semibold text-ink">{value}</dd>
    </div>
  );
}
