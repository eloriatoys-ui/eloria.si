"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";

function num(v: FormDataEntryValue | null): number | null {
  if (v === null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function int(v: FormDataEntryValue | null): number | null {
  const n = num(v);
  return n === null ? null : Math.round(n);
}

function text(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function updateProduct(id: number, formData: FormData) {
  const update = {
    name_en: text(formData.get("name_en")) ?? "",
    name_sl: text(formData.get("name_sl")),
    short_description_en: text(formData.get("short_description_en")),
    short_description_sl: text(formData.get("short_description_sl")),
    price: num(formData.get("price")) ?? 0,
    compare_price: num(formData.get("compare_price")),
    image: text(formData.get("image")),
    stock_status: text(formData.get("stock_status")) ?? "instock",
    age_min_months: int(formData.get("age_min_months")),
    age_max_months: int(formData.get("age_max_months")),
    is_published: formData.get("is_published") === "on",
    badge: text(formData.get("badge")),
    emoji: text(formData.get("emoji")),
  };

  const { error } = await supabaseAdmin.from("products").update(update).eq("id", id);
  if (error) throw new Error(error.message);

  // Sync category links
  const selectedCategoryIds = formData
    .getAll("category_ids")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));

  await supabaseAdmin.from("product_categories").delete().eq("product_id", id);
  if (selectedCategoryIds.length > 0) {
    await supabaseAdmin
      .from("product_categories")
      .insert(selectedCategoryIds.map((cid) => ({ product_id: id, category_id: cid })));
  }

  // Sync gallery from comma/newline separated URLs
  const galleryRaw = String(formData.get("gallery") ?? "");
  const urls = galleryRaw
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter(Boolean);
  await supabaseAdmin.from("product_images").delete().eq("product_id", id);
  if (urls.length > 0) {
    await supabaseAdmin
      .from("product_images")
      .insert(urls.map((url, position) => ({ product_id: id, url, position })));
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/" + id + "/edit");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
