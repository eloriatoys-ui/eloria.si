import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { data: cats } = await supabaseAdmin
    .from("categories")
    .select("id, slug, name_en, name_sl, position")
    .order("position", { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-ink">Categories</h1>
      <p className="mt-1 text-sm text-ink/70">{cats?.length ?? 0} categories</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-orange-dark/15 bg-pearl">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-orange-dark/15 text-[11px] font-bold uppercase tracking-wider text-ink/60">
            <tr>
              <th className="px-4 py-3">Name (EN)</th>
              <th className="px-4 py-3">Name (SL)</th>
              <th className="px-4 py-3">Slug</th>
            </tr>
          </thead>
          <tbody>
            {(cats ?? []).map((c) => (
              <tr key={c.id} className="border-b border-orange-dark/10 last:border-0">
                <td className="px-4 py-3 font-bold text-ink">{c.name_en}</td>
                <td className="px-4 py-3 text-ink/80">{c.name_sl ?? "—"}</td>
                <td className="px-4 py-3 text-ink/60">/{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-ink/60">
        Editing categories from the UI is coming next.
      </p>
    </div>
  );
}
