import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { updateProduct, deleteProduct } from "../../actions";
import RichTextEditor from "@/components/admin/RichTextEditor";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const [{ data: product }, { data: cats }, { data: gallery }, { data: links }] =
    await Promise.all([
      supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle(),
      supabaseAdmin
        .from("categories")
        .select("id, name_en")
        .order("name_en", { ascending: true }),
      supabaseAdmin
        .from("product_images")
        .select("url, position")
        .eq("product_id", id)
        .order("position", { ascending: true }),
      supabaseAdmin
        .from("product_categories")
        .select("category_id")
        .eq("product_id", id),
    ]);

  if (!product) notFound();

  const selectedCatIds = new Set((links ?? []).map((l: any) => l.category_id));
  const galleryUrls = (gallery ?? []).map((g: any) => g.url).join("\n");

  const update = updateProduct.bind(null, id);
  const remove = deleteProduct.bind(null, id);

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-[13px] font-bold text-orange-dark hover:underline">
          ← Products
        </Link>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold text-ink">Edit product</h1>
      <p className="mt-1 text-sm text-ink/70">
        Slug: <code className="rounded bg-pearl px-1.5 py-0.5">{product.slug}</code>
        {product.woo_id && (
          <>
            {" · "}WC id: <code className="rounded bg-pearl px-1.5 py-0.5">{product.woo_id}</code>
          </>
        )}
      </p>

      <form action={update} encType="multipart/form-data" className="mt-8 grid gap-8 md:grid-cols-[1fr,320px]">
        {/* Main form */}
        <div className="space-y-6">
          <Card title="Names">
            <Field label="Name (English)">
              <input
                name="name_en"
                defaultValue={product.name_en ?? ""}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Name (Slovenian)">
              <input
                name="name_sl"
                defaultValue={product.name_sl ?? ""}
                className={inputCls}
              />
            </Field>
          </Card>

          <Card title="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (EUR)">
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={Number(product.price).toFixed(2)}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Compare price (was)">
                <input
                  name="compare_price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={
                    product.compare_price != null
                      ? Number(product.compare_price).toFixed(2)
                      : ""
                  }
                  className={inputCls}
                />
              </Field>
            </div>
          </Card>

          <Card title="Description">
            <Field label="Description (English)">
              <RichTextEditor
                name="short_description_en"
                defaultValue={product.short_description_en ?? ""}
              />
            </Field>
            <Field label="Description (Slovenian)">
              <RichTextEditor
                name="short_description_sl"
                defaultValue={product.short_description_sl ?? ""}
              />
            </Field>
          </Card>

          <Card title="Age range (months)">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Min months (e.g. 36 for 3 years)">
                <input
                  name="age_min_months"
                  type="number"
                  min="0"
                  defaultValue={product.age_min_months ?? ""}
                  className={inputCls}
                />
              </Field>
              <Field label="Max months (blank = open-ended)">
                <input
                  name="age_max_months"
                  type="number"
                  min="0"
                  defaultValue={product.age_max_months ?? ""}
                  className={inputCls}
                />
              </Field>
            </div>
          </Card>

          <Card title="Images">
            {product.image && (
              <div className="flex items-center gap-3 rounded-lg border border-orange-dark/15 bg-cream p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt="" className="h-16 w-16 rounded-md object-cover" />
                <p className="break-all text-[12px] text-ink/70">{product.image}</p>
              </div>
            )}
            <Field label="Replace main image — upload">
              <input
                name="image_file"
                type="file"
                accept="image/*"
                className="block w-full text-[12px] file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-pearl hover:file:bg-orange-dark"
              />
            </Field>
            <Field label="…or paste a URL (leave blank to keep current image when nothing is uploaded)">
              <input
                name="image"
                defaultValue={product.image ?? ""}
                placeholder="/catalog/eloria/image1.jpeg"
                className={inputCls}
              />
            </Field>

            <Field label="Add to gallery — upload multiple files">
              <input
                name="gallery_files"
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-[12px] file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[12px] file:font-bold file:text-pearl hover:file:bg-orange-dark"
              />
            </Field>
            <Field label="Gallery URLs (one per line — saving replaces the gallery)">
              <textarea
                name="gallery"
                defaultValue={galleryUrls}
                rows={6}
                className={inputCls + " font-mono text-[12px]"}
              />
            </Field>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card title="Status">
            <Field label="Stock">
              <select
                name="stock_status"
                defaultValue={product.stock_status ?? "instock"}
                className={inputCls}
              >
                <option value="instock">In stock</option>
                <option value="outofstock">Out of stock</option>
                <option value="onbackorder">On backorder</option>
              </select>
            </Field>
            <label className="mt-3 flex items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={!!product.is_published}
                className="h-4 w-4"
              />
              Published (visible on site)
            </label>
          </Card>

          <Card title="Sizes">
            <Field label="Sizes (comma-separated — leave blank for no size picker)">
              <input
                name="sizes"
                defaultValue={(product.sizes ?? []).join(", ")}
                placeholder="80, 90, 100, 110, 120"
                className={inputCls}
              />
            </Field>
            <p className="text-[11px] text-ink/60">
              Shown as pickable chips on the product page. The customer must
              choose one before adding to cart; their choice is saved on the order.
            </p>
          </Card>

          <Card title="Categories">
            <div className="grid max-h-64 grid-cols-1 gap-2 overflow-auto pr-1">
              {(cats ?? []).map((c: any) => (
                <label key={c.id} className="flex items-center gap-2 text-[13px] text-ink">
                  <input
                    type="checkbox"
                    name="category_ids"
                    value={c.id}
                    defaultChecked={selectedCatIds.has(c.id)}
                    className="h-4 w-4"
                  />
                  {c.name_en}
                </label>
              ))}
            </div>
          </Card>

          <Card title="Display">
            <Field label="Badge (e.g. New, Sale)">
              <input name="badge" defaultValue={product.badge ?? ""} className={inputCls} />
            </Field>
            <Field label="Emoji">
              <input name="emoji" defaultValue={product.emoji ?? ""} className={inputCls} />
            </Field>
          </Card>
        </aside>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3 border-t border-orange-dark/15 pt-6">
          <button
            type="submit"
            className="rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Save changes</span>
          </button>
          <Link
            href="/admin/products"
            className="rounded-full border border-orange-dark/25 bg-pearl px-6 py-3 text-[13px] font-bold text-ink hover:bg-cream"
          >
            Cancel
          </Link>
          <span className="flex-1" />
          <a
            href={`/shop/${product.slug}`}
            target="_blank"
            rel="noopener"
            className="text-[13px] font-bold text-orange-dark hover:underline"
          >
            View on store ↗
          </a>
        </div>
      </form>

      <form
        action={remove}
        className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5"
      >
        <h3 className="text-base font-extrabold text-red-800">Danger zone</h3>
        <p className="mt-1 text-[13px] text-red-700">
          Deleting a product also removes its gallery and category links. This can't be undone.
        </p>
        <button
          type="submit"
          className="mt-3 rounded-full border border-red-300 bg-white px-4 py-2 text-[12px] font-bold text-red-700 hover:bg-red-700 hover:text-white"
        >
          Delete product
        </button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-bold text-ink/70">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
