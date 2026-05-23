import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { markShipped, markDelivered, createGlsShipmentForOrder, markAwaitingPaymentAsPaid } from "./actions";
import { getTrackingUrl } from "@/lib/gls";

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

  const ship = markShipped.bind(null, params.id);
  const deliver = markDelivered.bind(null, params.id);
  const createGls = createGlsShipmentForOrder.bind(null, params.id);
  const activatePayment = markAwaitingPaymentAsPaid.bind(null, params.id);
  const sa = order.shipping_address as any;
  const hasGlsParcel = Boolean(order.tracking_number && order.tracking_carrier === "GLS");
  const glsTrackingUrl = hasGlsParcel ? getTrackingUrl(order.tracking_number) : null;

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

          {order.payment_status === "paid" && (
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                GLS shipment
              </h2>
              {hasGlsParcel ? (
                <div className="mt-3 space-y-3 text-[13px]">
                  <p>
                    <span className="text-ink/60">Parcel #</span>{" "}
                    <span className="font-bold text-ink">{order.tracking_number}</span>
                  </p>
                  {order.gls_created_at && (
                    <p className="text-[12px] text-ink/60">
                      Created {new Date(order.gls_created_at).toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    <a
                      href={`/admin/api/orders/${order.id}/label`}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full bg-orange px-4 py-2.5 text-center text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
                      style={{ color: "#FFFFFF" }}
                    >
                      <span style={{ color: "#FFFFFF" }}>Print label (PDF)</span>
                    </a>
                    {glsTrackingUrl && (
                      <a
                        href={glsTrackingUrl}
                        target="_blank"
                        rel="noopener"
                        className="rounded-full border border-orange-dark/25 bg-cream px-4 py-2.5 text-center text-[12px] font-extrabold uppercase tracking-wider text-ink hover:bg-orange-dark hover:text-pearl"
                      >
                        Track parcel
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {order.gls_error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-800">
                      Last error: {order.gls_error}
                    </p>
                  )}
                  <form action={createGls}>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-orange px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
                      style={{ color: "#FFFFFF" }}
                    >
                      <span style={{ color: "#FFFFFF" }}>
                        {order.gls_error ? "Retry GLS shipment" : "Create GLS shipment"}
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </section>
          )}

          {order.payment_status === "paid" && order.shipping_status !== "shipped" && order.shipping_status !== "delivered" && (
            <form action={ship} className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Mark as shipped
              </h2>
              <label className="mt-3 block text-[12px] font-bold text-ink/70">Carrier</label>
              <input
                name="tracking_carrier"
                placeholder="DHL, GLS, Pošta Slovenije…"
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
