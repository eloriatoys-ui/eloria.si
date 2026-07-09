"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { uploadProductImage, uploadProductImages } from "@/lib/admin/storage";

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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function fileFromForm(formData: FormData, name: string): File | null {
  const v = formData.get(name);
  if (v instanceof File && v.size > 0 && v.name) return v;
  return null;
}

function filesFromForm(formData: FormData, name: string): File[] {
  return formData.getAll(name).filter((v): v is File => v instanceof File && v.size > 0 && !!v.name);
}

function parseUrlList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((u) => u.trim())
    .filter(Boolean);
}

/** Parse the admin "Sizes" field (comma / newline separated) into an ordered,
 *  de-duplicated list. Empty input → [] (no size picker on the storefront). */
function parseSizes(raw: FormDataEntryValue | null): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of String(raw ?? "").split(/[\n,]+/)) {
    const v = s.trim();
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

async function syncCategories(productId: number, categoryIds: number[]) {
  await supabaseAdmin.from("product_categories").delete().eq("product_id", productId);
  if (categoryIds.length > 0) {
    await supabaseAdmin
      .from("product_categories")
      .insert(categoryIds.map((cid) => ({ product_id: productId, category_id: cid })));
  }
}

async function syncGallery(productId: number, urls: string[]) {
  await supabaseAdmin.from("product_images").delete().eq("product_id", productId);
  if (urls.length > 0) {
    await supabaseAdmin
      .from("product_images")
      .insert(urls.map((url, position) => ({ product_id: productId, url, position })));
  }
}

function commonProductFields(formData: FormData) {
  return {
    name_en: text(formData.get("name_en")) ?? "",
    name_sl: text(formData.get("name_sl")),
    short_description_en: text(formData.get("short_description_en")),
    short_description_sl: text(formData.get("short_description_sl")),
    price: num(formData.get("price")) ?? 0,
    compare_price: num(formData.get("compare_price")),
    stock_status: text(formData.get("stock_status")) ?? "instock",
    sizes: parseSizes(formData.get("sizes")),
    age_min_months: int(formData.get("age_min_months")),
    age_max_months: int(formData.get("age_max_months")),
    is_published: formData.get("is_published") === "on",
    badge: text(formData.get("badge")),
    emoji: text(formData.get("emoji")),
  };
}

export async function createProduct(formData: FormData) {
  const fields = commonProductFields(formData);
  if (!fields.name_en) throw new Error("Name (English) is required");
  if (!fields.price) throw new Error("Price is required");

  let slug = text(formData.get("slug"));
  if (!slug) slug = slugify(fields.name_en);
  // Ensure unique slug — append -2, -3 etc. if needed
  let unique = slug;
  let i = 1;
  while (true) {
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", unique)
      .maybeSingle();
    if (!existing) break;
    i += 1;
    unique = `${slug}-${i}`;
    if (i > 50) break;
  }

  // Upload main image (file > URL fallback).
  const mainFile = fileFromForm(formData, "image_file");
  let imageUrl = mainFile
    ? await uploadProductImage(mainFile, unique)
    : text(formData.get("image"));

  // Upload gallery files + merge with pasted URLs.
  const galleryFiles = filesFromForm(formData, "gallery_files");
  const uploadedGallery = await uploadProductImages(galleryFiles, unique);
  const pastedGallery = parseUrlList(String(formData.get("gallery") ?? ""));
  const finalGallery = [...uploadedGallery, ...pastedGallery];
  // If no main image but we have gallery, use the first gallery item as main.
  if (!imageUrl && finalGallery.length > 0) imageUrl = finalGallery[0];

  const { data: inserted, error } = await supabaseAdmin
    .from("products")
    .insert({
      ...fields,
      slug: unique,
      currency: "EUR",
      image: imageUrl,
    })
    .select("id")
    .single();
  if (error || !inserted) throw new Error(error?.message ?? "Insert failed");

  const categoryIds = formData
    .getAll("category_ids")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));
  await syncCategories(inserted.id, categoryIds);
  await syncGallery(inserted.id, finalGallery);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect(`/admin/products/${inserted.id}/edit`);
}

export async function updateProduct(id: number, formData: FormData) {
  const fields = commonProductFields(formData);

  // Look up the slug — needed for storage paths if files are uploaded.
  const { data: existing } = await supabaseAdmin
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();
  const slug = existing?.slug ?? "uploads";

  // Main image: prefer newly uploaded file, fall back to URL field.
  const mainFile = fileFromForm(formData, "image_file");
  let imageUrl: string | null = null;
  if (mainFile) {
    imageUrl = await uploadProductImage(mainFile, slug);
  } else {
    imageUrl = text(formData.get("image"));
  }

  // Gallery: uploaded files + pasted URLs.
  const galleryFiles = filesFromForm(formData, "gallery_files");
  const uploadedGallery = await uploadProductImages(galleryFiles, slug);
  const pastedGallery = parseUrlList(String(formData.get("gallery") ?? ""));
  const finalGallery = [...uploadedGallery, ...pastedGallery];

  const { error } = await supabaseAdmin
    .from("products")
    .update({ ...fields, image: imageUrl })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const categoryIds = formData
    .getAll("category_ids")
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));
  await syncCategories(id, categoryIds);
  await syncGallery(id, finalGallery);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
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
