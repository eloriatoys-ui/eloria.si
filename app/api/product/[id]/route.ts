import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function listUploads(productId: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(UPLOADS_DIR);
    const safeId = productId.replace(/[^0-9a-zA-Z_-]/g, "");
    return entries
      .filter((f) => f.startsWith(`${safeId}-`))
      .sort()
      .map((f) => `/uploads/${f}`);
  } catch {
    return [];
  }
}

type WCImage = { src: string };
type WCMeta = { key: string; value: unknown };
type WCProduct = {
  id: number;
  name: string;
  images?: WCImage[];
  description?: string;
  short_description?: string;
  meta_data?: WCMeta[];
};

function envConfig() {
  const base = process.env.WOOCOMMERCE_STORE_URL?.replace(/\/$/, "");
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  if (!base || !key || !secret) return null;
  return { base, key, secret };
}

function basicAuth(key: string, secret: string) {
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

function extractVideoUrls(p: WCProduct): string[] {
  const found = new Set<string>();
  for (const m of p.meta_data ?? []) {
    if (typeof m.value === "string") {
      const v = m.value;
      if (
        (m.key ?? "").toLowerCase().includes("video") ||
        /\.(mp4|webm|mov|m4v)(\?|$)/i.test(v) ||
        /(youtube\.com|youtu\.be|vimeo\.com)/i.test(v)
      ) {
        const matches = v.match(/https?:\/\/[^\s"'<>]+/g);
        if (matches) matches.forEach((u) => found.add(u));
        else if (/^https?:/i.test(v)) found.add(v);
      }
    }
  }
  const haystack = `${p.description ?? ""}\n${p.short_description ?? ""}`;
  const urls = haystack.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
  for (const u of urls) {
    if (
      /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u) ||
      /(youtube\.com\/(?:watch|embed)|youtu\.be\/|vimeo\.com\/)/i.test(u)
    ) {
      found.add(u);
    }
  }
  return Array.from(found);
}

const REVALIDATE_SECONDS = 60 * 60; // 1h cache for product detail

export async function GET(
  _req: Request,
  ctx: { params: { id: string } },
) {
  const id = ctx.params.id;
  const uploads = await listUploads(id);
  const cfg = envConfig();
  if (!cfg) {
    return NextResponse.json({ images: [], videos: [], uploads, description: null });
  }
  try {
    const res = await fetch(
      `${cfg.base}/wp-json/wc/v3/products/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: basicAuth(cfg.key, cfg.secret) },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) {
      return NextResponse.json({ images: [], videos: [], uploads, description: null });
    }
    const p = (await res.json()) as WCProduct;
    const images = (p.images ?? [])
      .map((img) => img.src)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    const videos = extractVideoUrls(p);
    return NextResponse.json({
      images,
      videos,
      uploads,
      description: p.description ?? null,
    });
  } catch {
    return NextResponse.json({ images: [], videos: [], uploads, description: null });
  }
}
