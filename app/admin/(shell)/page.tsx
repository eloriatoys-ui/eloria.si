import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    { count: productCount },
    { count: publishedCount },
    { count: outOfStockCount },
    { count: orderCount },
    { count: pendingOrderCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .neq("stock_status", "instock"),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("shipping_status", "pending")
      .eq("payment_status", "paid"),
    supabaseAdmin
      .from("orders")
      .select("id, order_number, email, total, currency, status, shipping_status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    productCount: productCount ?? 0,
    publishedCount: publishedCount ?? 0,
    outOfStockCount: outOfStockCount ?? 0,
    orderCount: orderCount ?? 0,
    pendingOrderCount: pendingOrderCount ?? 0,
    recentOrders: recentOrders ?? [],
  };
}

export default async function AdminDashboard() {
  const s = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/70">Welcome back. Here's a snapshot of your store.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Products" value={s.productCount} sub={`${s.publishedCount} published`} href="/admin/products" />
        <Stat label="Out of stock" value={s.outOfStockCount} tone={s.outOfStockCount > 0 ? "warn" : "ok"} href="/admin/products?stock=outofstock" />
        <Stat label="Orders" value={s.orderCount} href="/admin/orders" />
        <Stat label="To ship" value={s.pendingOrderCount} tone={s.pendingOrderCount > 0 ? "warn" : "ok"} href="/admin/orders?status=to-ship" />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Recent orders</h2>
          <Link href="/admin/orders" className="text-[13px] font-bold text-orange-dark hover:underline">
            View all →
          </Link>
        </div>

        {s.recentOrders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-orange-dark/15 bg-pearl p-8 text-center text-sm text-ink/70">
            No orders yet. Once customers complete checkout, they'll show up here.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-orange-dark/15 bg-pearl">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-orange-dark/15 text-[11px] font-bold uppercase tracking-wider text-ink/60">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {s.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-orange-dark/10 last:border-0">
                    <td className="px-4 py-3 font-bold text-ink">
                      <Link href={`/admin/orders/${o.id}`} className="hover:text-orange-dark">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink/80">{o.email}</td>
                    <td className="px-4 py-3 font-bold text-ink">€{Number(o.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge text={o.shipping_status} />
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "default",
  href,
}: {
  label: string;
  value: number;
  sub?: string;
  tone?: "default" | "warn" | "ok";
  href?: string;
}) {
  const ring =
    tone === "warn"
      ? "border-amber-300 bg-amber-50"
      : tone === "ok"
      ? "border-emerald-200 bg-emerald-50"
      : "border-orange-dark/15 bg-pearl";
  const inner = (
    <div className={`rounded-2xl border ${ring} p-4 transition hover:shadow-sm`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/60">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-ink">{value}</p>
      {sub ? <p className="mt-0.5 text-[12px] font-bold text-ink/60">{sub}</p> : null}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Badge({ text }: { text: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-emerald-100 text-emerald-800",
  };
  const cls = map[text] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${cls}`}>
      {text}
    </span>
  );
}
