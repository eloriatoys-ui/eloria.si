import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  stock?: string;
  page?: string;
};

const PAGE_SIZE = 30;

async function loadProducts(sp: SearchParams) {
  const page = Math.max(1, Number(sp.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = supabaseAdmin
    .from("products")
    .select(
      "id, woo_id, slug, name_en, name_sl, price, compare_price, image, stock_status, is_published, created_at, product_categories(categories(name_en))",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (sp.q) {
    const term = sp.q.replace(/[%_]/g, "");
    q = q.or(`name_en.ilike.%${term}%,name_sl.ilike.%${term}%,slug.ilike.%${term}%`);
  }
  if (sp.stock === "instock") q = q.eq("stock_status", "instock");
  if (sp.stock === "outofstock") q = q.neq("stock_status", "instock");

  const { data, count, error } = await q;
  if (error) {
    console.error(error);
    return { rows: [], count: 0, page };
  }
  return { rows: data ?? [], count: count ?? 0, page };
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { rows, count, page } = await loadProducts(searchParams);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const q = searchParams.q ?? "";
  const stock = searchParams.stock ?? "";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink/70">
            {count} {count === 1 ? "product" : "products"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-orange px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
          style={{ color: "#FFFFFF" }}
        >
          <span style={{ color: "#FFFFFF" }}>+ Add product</span>
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-3" action="/admin/products" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name or slug…"
          className="min-w-[200px] flex-1 rounded-full border border-orange-dark/20 bg-pearl px-5 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/30"
        />
        <select
          name="stock"
          defaultValue={stock}
          className="rounded-full border border-orange-dark/20 bg-pearl px-4 py-2.5 text-sm outline-none focus:border-orange"
        >
          <option value="">All stock</option>
          <option value="instock">In stock</option>
          <option value="outofstock">Out of stock</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-pearl hover:bg-orange-dark"
        >
          Filter
        </button>
        {(q || stock) && (
          <Link
            href="/admin/products"
            className="text-[13px] font-bold text-ink/60 hover:text-orange-dark"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-orange-dark/15 bg-pearl">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-orange-dark/15 text-[11px] font-bold uppercase tracking-wider text-ink/60">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Categories</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink/60">
                  No products match.
                </td>
              </tr>
            )}
            {rows.map((p: any) => (
              <tr key={p.id} className="border-b border-orange-dark/10 last:border-0 align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-orange/10 text-lg">
                        🎁
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{p.name_en}</p>
                      <p className="truncate text-[12px] text-ink/60">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/80">
                  {(p.product_categories ?? [])
                    .map((pc: any) => pc.categories?.name_en)
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right font-bold text-ink">
                  €{Number(p.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StockBadge status={p.stock_status} />
                </td>
                <td className="px-4 py-3">
                  {p.is_published ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-800">
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-700">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="rounded-md border border-orange-dark/20 bg-cream px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-orange-dark hover:text-pearl"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} q={q} stock={stock} />
      )}
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    instock: "bg-emerald-100 text-emerald-800",
    outofstock: "bg-red-100 text-red-800",
    onbackorder: "bg-amber-100 text-amber-800",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-700";
  const label = status === "instock" ? "In stock" : status === "outofstock" ? "Out of stock" : status;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${cls}`}>
      {label}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  q,
  stock,
}: {
  page: number;
  totalPages: number;
  q: string;
  stock: string;
}) {
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (stock) params.set("stock", stock);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/products${s ? "?" + s : ""}`;
  };
  return (
    <nav className="mt-6 flex items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        className={`rounded-md border border-orange-dark/20 bg-pearl px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-orange-dark hover:text-pearl ${
          page === 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        ← Prev
      </Link>
      <span className="px-3 text-[12px] font-bold text-ink/70">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        className={`rounded-md border border-orange-dark/20 bg-pearl px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-orange-dark hover:text-pearl ${
          page === totalPages ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}
