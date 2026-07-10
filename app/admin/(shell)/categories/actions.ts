"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function text(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function createCategory(formData: FormData) {
  const name_en = text(formData.get("name_en"));
  if (!name_en) throw new Error("Name (English) is required");
  const name_sl = text(formData.get("name_sl"));
  let slug = text(formData.get("slug"));
  if (!slug) slug = slugify(name_en);

  // Avoid slug collisions.
  let unique = slug;
  let i = 1;
  while (true) {
    const { data: existing } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("slug", unique)
      .maybeSingle();
    if (!existing) break;
    i += 1;
    unique = `${slug}-${i}`;
    if (i > 50) break;
  }

  const position = Number(formData.get("position")) || 0;

  const { error } = await supabaseAdmin
    .from("categories")
    .insert({ name_en, name_sl, slug: unique, position });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/trgovina");
}

export async function updateCategory(id: number, formData: FormData) {
  const update = {
    name_en: text(formData.get("name_en")) ?? "",
    name_sl: text(formData.get("name_sl")),
    slug: text(formData.get("slug")) ?? "",
    position: Number(formData.get("position")) || 0,
  };
  if (!update.name_en) throw new Error("Name (English) is required");
  if (!update.slug) throw new Error("Slug is required");

  const { error } = await supabaseAdmin
    .from("categories")
    .update(update)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/trgovina");
}

export async function deleteCategory(id: number) {
  // product_categories rows cascade because of FK ON DELETE CASCADE.
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/trgovina");
}
