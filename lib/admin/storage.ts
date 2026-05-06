import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET = "product-images";

function safeName(name: string): string {
  // Strip path separators and tame weird characters; keep extension.
  const base = name.split(/[/\\]/).pop() ?? "image";
  return base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "image";
}

/**
 * Uploads a single File to product-images and returns the public URL.
 * Path layout: {productSlug}/{timestamp}-{originalName}
 */
export async function uploadProductImage(
  file: File,
  productSlug: string,
): Promise<string> {
  const ext = (file.name.match(/\.[a-zA-Z0-9]+$/)?.[0] ?? ".jpg").toLowerCase();
  const path = `${productSlug || "uploads"}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}-${safeName(file.name).replace(/\.[a-zA-Z0-9]+$/, "")}${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buf, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Best-effort upload of many files. Returns the public URLs in order.
 * Files with empty .name (no file selected) are skipped.
 */
export async function uploadProductImages(
  files: File[],
  productSlug: string,
): Promise<string[]> {
  const real = files.filter((f) => f && f.size > 0 && f.name);
  const results: string[] = [];
  for (const f of real) {
    results.push(await uploadProductImage(f, productSlug));
  }
  return results;
}
