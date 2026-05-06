import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = { status?: string; page?: string };
const PAGE_SIZE = 50;

async function loadOrders(sp: SearchParams) {
  const page = Math.max(1, Number(sp.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = supabaseAdmin
    .from("orders")
    .select(
      "id, order_number, email, total, currency, status, payment_status, shipping_status, tracking_number, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (sp.status === "to-ship") q = q.eq("shipping_status", "pending").eq("payment_status", "paid");
  else if (sp.status === "shipped") q = q.eq("shipping_status", "shipped");
  else if (sp.status === "delivered") q = q.eq("shipping_status", "delivered");

  const { data, count } = await q;
  return { rows: data ?? [], count: count ?? 0, page };
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { rows, count } = await loadOrders(searchParams);
  const status = searchParams.status ?? "";

  const tabs = [
    { key: "", label: "All" },
    { key: "to-ship", label: "To ship" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink/70">
        {count} {count === 1 ? "order" : "orders"}
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => {
          const active = status === t.key;
          const href = t.key ? `/admin/orders?status=${t.key}` : "/admin/orders";
          return (
            <Link
              key={t.key}
              href={href}
              className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider ${
                active
                  ? "bg-ink text-pearl"
                  : "border border-orange-dark/20 bg-pearl text-ink hover:bg-cream"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-orange-dark/15 bg-pearl">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-orange-dark/15 text-[11px] font-bold uppercase tracking-wider text-ink/60">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Shipping</th>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-ink/60">
                  No orders {status ? "in this status" : "yet"}.
                </td>
              </tr>
            )}
            {rows.map((o: any) => (
              <tr key={o.id} className="border-b border-orange-dark/10 last:border-0">
                <td className="px-4 py-3 font-bold text-ink">
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-orange-dark">
                    {o.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/80">{o.email}</td>
                <td className="px-4 py-3 text-right font-bold text-ink">
                  €{Number(o.total).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <Pill text={o.payment_status} kind="payment" />
                </td>
                <td className="px-4 py-3">
                  <Pill text={o.shipping_status} kind="shipping" />
                </td>
                <td className="px-4 py-3 text-ink/80">
                  {o.tracking_number || "—"}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(o.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pill({ text, kind }: { text: string; kind: "payment" | "shipping" }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-slate-200 text-slate-800",
  };
  const cls = map[text] ?? "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${cls}`}>
      {text}
    </span>
  );
}
