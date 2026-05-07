import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  IconBox,
  IconAlert,
  IconCart,
  IconTruck,
  IconChevronRight,
  IconPlus,
} from "@/components/admin/icons";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    { count: productCount },
    { count: publishedCount },
    { count: outOfStockCount },
    { count: orderCount },
    { count: pendingOrderCount },
    { data: recentOrders },
    { data: paidOrders30d },
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
      .select(
        "id, order_number, email, total, currency, status, payment_status, shipping_status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseAdmin
      .from("orders")
      .select("total")
      .eq("payment_status", "paid")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()),
  ]);

  const revenue30d = (paidOrders30d ?? []).reduce(
    (s, o: any) => s + Number(o.total ?? 0),
    0,
  );

  return {
    productCount: productCount ?? 0,
    publishedCount: publishedCount ?? 0,
    outOfStockCount: outOfStockCount ?? 0,
    orderCount: orderCount ?? 0,
    pendingOrderCount: pendingOrderCount ?? 0,
    recentOrders: recentOrders ?? [],
    revenue30d,
  };
}

export default async function AdminDashboard() {
  const s = await getStats();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-orange-dark">
            {today}
          </p>
          <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink/65">
            Here's what's happening across your store today.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
        >
          <IconPlus size={14} />
          <span style={{ color: "#FFFFFF" }}>New product</span>
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          Icon={IconBox}
          label="Products"
          value={s.productCount}
          sub={`${s.publishedCount} live`}
          href="/admin/products"
          tint="orange"
        />
        <Stat
          Icon={IconAlert}
          label="Out of stock"
          value={s.outOfStockCount}
          href="/admin/products?stock=outofstock"
          tint={s.outOfStockCount > 0 ? "amber" : "emerald"}
        />
        <Stat
          Icon={IconCart}
          label="Orders"
          value={s.orderCount}
          sub="all time"
          href="/admin/orders"
          tint="indigo"
        />
        <Stat
          Icon={IconTruck}
          label="To ship"
          value={s.pendingOrderCount}
          href="/admin/orders?status=to-ship"
          tint={s.pendingOrderCount > 0 ? "amber" : "emerald"}
        />
      </div>

      <div className="mt-4 rounded-3xl border border-orange-dark/12 bg-gradient-to-br from-orange via-orange-dark to-orange-deep p-6 text-pearl shadow-sm md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-pearl/85">
              Last 30 days · paid revenue
            </p>
            <p
              className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              €{s.revenue30d.toFixed(2)}
            </p>
          </div>
          <Link
            href="/admin/orders?status=to-ship"
            className="inline-flex items-center gap-2 rounded-full bg-pearl/15 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-pearl/25"
          >
            View pending shipments
            <IconChevronRight size={14} />
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Recent orders
            </h2>
            <p className="mt-1 text-[13px] text-ink/65">
              Latest activity across the store.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-orange-dark hover:underline"
          >
            View all
            <IconChevronRight size={13} />
          </Link>
        </div>

        {s.recentOrders.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-orange-dark/25 bg-pearl p-10 text-center">
            <p className="text-base font-bold text-ink">No orders yet</p>
            <p className="mt-2 text-[13px] text-ink/65">
              Once customers complete checkout, you'll see them here in real time.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-orange-dark/15 bg-pearl">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-orange-dark/15 text-[11px] font-bold uppercase tracking-wider text-ink/55">
                <tr>
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5 text-right">Total</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Shipping</th>
                  <th className="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {s.recentOrders.map((o: any) => (
                  <tr
                    key={o.id}
                    className="border-b border-orange-dark/8 last:border-0"
                  >
                    <td className="px-5 py-3.5 font-bold text-ink">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="hover:text-orange-dark"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-ink/80">{o.email}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-ink">
                      €{Number(o.total).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill text={o.payment_status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill text={o.shipping_status} />
                    </td>
                    <td className="px-5 py-3.5 text-ink/65">
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
  Icon,
  label,
  value,
  sub,
  href,
  tint = "orange",
}: {
  Icon: React.FC<{ size?: number }>;
  label: string;
  value: number;
  sub?: string;
  href?: string;
  tint?: "orange" | "amber" | "emerald" | "indigo";
}) {
  const tints: Record<string, string> = {
    orange: "bg-orange/10 text-orange-dark",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  const inner = (
    <div className="group relative overflow-hidden rounded-2xl border border-orange-dark/12 bg-pearl p-5 transition-all hover:-translate-y-0.5 hover:border-orange-dark/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
            {label}
          </p>
          <p
            className="mt-2 text-3xl font-extrabold tracking-tight text-ink"
            style={{ letterSpacing: "-0.02em" }}
          >
            {value.toLocaleString()}
          </p>
          {sub ? (
            <p className="mt-0.5 text-[12px] font-bold text-ink/55">{sub}</p>
          ) : null}
        </div>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tints[tint]}`}>
          <Icon size={16} />
        </span>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Pill({ text }: { text: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-slate-200 text-slate-700",
  };
  const cls = map[text] ?? "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {text}
    </span>
  );
}
