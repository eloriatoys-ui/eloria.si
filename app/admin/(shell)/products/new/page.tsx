import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createProduct } from "../actions";
import RichTextEditor from "@/components/admin/RichTextEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add product · Eloria Admin" };

export default async function NewProductPage() {
  const { data: cats } = await supabaseAdmin
    .from("categories")
    .select("id, name_en")
    .order("name_en", { ascending: true });

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-[13px] font-bold text-orange-dark hover:underline">
          ← Products
        </Link>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold text-ink">Add product</h1>

      <form action={createProduct} encType="multipart/form-data" className="mt-8 grid gap-8 md:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <Card title="Names">
            <Field label="Name (English)" required>
              <input name="name_en" required className={inputCls} />
            </Field>
            <Field label="Name (Slovenian)">
              <input name="name_sl" className={inputCls} />
            </Field>
            <Field label="Slug (auto-generated if blank)">
              <input
                name="slug"
                placeholder="e.g. wooden-magnetic-game"
                className={inputCls + " font-mono"}
              />
            </Field>
          </Card>

          <Card title="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (EUR)" required>
                <input name="price" type="number" step="0.01" min="0" required className={inputCls} />
              </Field>
              <Field label="Compare price (was)">
                <input name="compare_price" type="number" step="0.01" min="0" className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card title="Description">
            <Field label="Description (English)">
              <RichTextEditor name="short_description_en" />
            </Field>
            <Field label="Description (Slovenian)">
              <RichTextEditor name="short_description_sl" />
            </Field>
          </Card>

          <Card title="Age range (months)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Min months (e.g. 36 for 3 years)">
                <input name="age_min_months" type="number" min="0" className={inputCls} />
              </Field>
              <Field label="Max months (blank = open-ended)">
                <input name="age_max_months" type="number" min="0" className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card title="Images">
            <Field label="Main image — upload">
              <input
                name="image_file"
                type="file"
                accept="image/*"
                className="block w-full text-[12px] file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-pearl hover:file:bg-orange-dark"
              />
            </Field>
            <Field label="…or paste a URL (skip if you uploaded above)">
              <input name="image" placeholder="/catalog/.../image.jpg or https://…" className={inputCls} />
            </Field>

            <Field label="Gallery — upload multiple files">
              <input
                name="gallery_files"
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-[12px] file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-pearl hover:file:bg-orange-dark"
              />
            </Field>
            <Field label="…or paste extra gallery URLs (one per line)">
              <textarea name="gallery" rows={4} className={inputCls + " font-mono text-[12px]"} />
            </Field>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Status">
            <Field label="Stock">
              <select name="stock_status" defaultValue="instock" className={inputCls}>
                <option value="instock">In stock</option>
                <option value="outofstock">Out of stock</option>
                <option value="onbackorder">On backorder</option>
              </select>
            </Field>
            <label className="mt-3 flex items-center gap-2 text-sm font-bold text-ink">
              <input type="checkbox" name="is_published" defaultChecked className="h-4 w-4" />
              Published (visible on site)
            </label>
          </Card>

          <Card title="Categories">
            <div className="grid max-h-64 grid-cols-1 gap-2 overflow-auto pr-1">
              {(cats ?? []).map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-[13px] text-ink">
                  <input type="checkbox" name="category_ids" value={c.id} className="h-4 w-4" />
                  {c.name_en}
                </label>
              ))}
            </div>
          </Card>

          <Card title="Display">
            <Field label="Badge (e.g. New, Sale)">
              <input name="badge" defaultValue="New" className={inputCls} />
            </Field>
            <Field label="Emoji">
              <input name="emoji" defaultValue="🎁" className={inputCls} />
            </Field>
          </Card>
        </aside>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3 border-t border-orange-dark/15 pt-6">
          <button
            type="submit"
            className="rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Create product</span>
          </button>
          <Link
            href="/admin/products"
            className="rounded-full border border-orange-dark/25 bg-pearl px-6 py-3 text-[13px] font-bold text-ink hover:bg-cream"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-orange-dark/20 bg-cream px-4 py-2.5 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/30";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-bold text-ink/70">
        {label} {required && <span className="text-orange-dark">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
