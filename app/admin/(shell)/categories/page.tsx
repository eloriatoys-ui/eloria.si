import { supabaseAdmin } from "@/lib/supabase/server";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { data: cats } = await supabaseAdmin
    .from("categories")
    .select("id, slug, name_en, name_sl, position")
    .order("position", { ascending: true })
    .order("name_en", { ascending: true });

  const { data: counts } = await supabaseAdmin
    .from("product_categories")
    .select("category_id");

  const productCountByCat = new Map<number, number>();
  for (const row of counts ?? []) {
    productCountByCat.set(
      row.category_id,
      (productCountByCat.get(row.category_id) ?? 0) + 1,
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-ink">Categories</h1>
      <p className="mt-1 text-sm text-ink/70">{cats?.length ?? 0} categories</p>

      <section className="mt-6 rounded-2xl border border-orange-dark/15 bg-pearl p-5">
        <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
          Add new
        </h2>
        <form action={createCategory} className="mt-3 grid gap-3 md:grid-cols-[1.5fr,1.5fr,1fr,80px,auto]">
          <input
            name="name_en"
            required
            placeholder="Name (English)"
            className={inputCls}
          />
          <input
            name="name_sl"
            placeholder="Name (Slovenian)"
            className={inputCls}
          />
          <input
            name="slug"
            placeholder="slug (auto)"
            className={inputCls + " font-mono text-[12px]"}
          />
          <input
            name="position"
            type="number"
            placeholder="0"
            defaultValue={0}
            className={inputCls + " text-center"}
          />
          <button
            type="submit"
            className="rounded-full bg-orange px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Add</span>
          </button>
        </form>
      </section>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-orange-dark/15 bg-pearl">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-orange-dark/15 text-[11px] font-bold uppercase tracking-wider text-ink/60">
            <tr>
              <th className="px-3 py-3">Name (EN)</th>
              <th className="px-3 py-3">Name (SL)</th>
              <th className="px-3 py-3">Slug</th>
              <th className="px-3 py-3 text-center">Order</th>
              <th className="px-3 py-3 text-center">Products</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(cats ?? []).map((c) => (
              <CategoryRow
                key={c.id}
                cat={c}
                productCount={productCountByCat.get(c.id) ?? 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({
  cat,
  productCount,
}: {
  cat: { id: number; slug: string; name_en: string; name_sl: string | null; position: number };
  productCount: number;
}) {
  const update = updateCategory.bind(null, cat.id);
  const remove = deleteCategory.bind(null, cat.id);
  return (
    <tr className="border-b border-orange-dark/10 last:border-0 align-middle">
      <td colSpan={6} className="p-0">
        <form action={update} className="grid gap-2 px-3 py-3 md:grid-cols-[1.5fr,1.5fr,1fr,80px,80px,auto]">
          <input
            name="name_en"
            defaultValue={cat.name_en}
            required
            className={inputCls}
          />
          <input
            name="name_sl"
            defaultValue={cat.name_sl ?? ""}
            className={inputCls}
          />
          <input
            name="slug"
            defaultValue={cat.slug}
            required
            className={inputCls + " font-mono text-[12px]"}
          />
          <input
            name="position"
            type="number"
            defaultValue={cat.position}
            className={inputCls + " text-center"}
          />
          <span className="grid place-items-center text-[12px] font-bold text-ink/70">
            {productCount}
          </span>
          <div className="flex items-center justify-end gap-2">
            <button
              type="submit"
              className="rounded-md border border-orange-dark/20 bg-cream px-3 py-1.5 text-[12px] font-bold text-ink hover:bg-orange-dark hover:text-pearl"
            >
              Save
            </button>
          </div>
        </form>
        <form action={remove} className="px-3 pb-3 text-right">
          <button
            type="submit"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700 hover:bg-red-700 hover:text-white"
          >
            Delete
          </button>
        </form>
      </td>
    </tr>
  );
}

const inputCls =
  "w-full rounded-lg border border-orange-dark/20 bg-cream px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30";
