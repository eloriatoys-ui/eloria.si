import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

function safeExt(name: string): string {
  const ext = path.extname(name).toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : "";
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "expected multipart/form-data" }, { status: 400 });
  }

  const productId = form.get("productId");
  const file = form.get("file");

  if (typeof productId !== "string" || productId.length === 0) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file too large (max 10 MB)" }, { status: 413 });
  }

  const ext = safeExt(file.name) || (file.type.includes("png") ? ".png" : ".jpg");
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "unsupported file type" }, { status: 415 });
  }

  await ensureUploadsDir();

  const safeId = String(productId).replace(/[^0-9a-zA-Z_-]/g, "");
  const filename = `${safeId}-${Date.now()}${ext}`;
  const dest = path.join(UPLOADS_DIR, filename);

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(dest, buf);

  const url = `/uploads/${filename}`;

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, url, filename });
}
