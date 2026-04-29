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

type WCImage = { id: number; src: string; alt?: string; name?: string };
type WCMeta = { id?: number; key: string; value: unknown };
type WCProduct = {
  id: number;
  name: string;
  images: WCImage[];
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

  // 1) Scan meta_data for any key/value containing a video URL
  for (const m of p.meta_data ?? []) {
    const keyLower = (m.key ?? "").toLowerCase();
    if (typeof m.value === "string") {
      if (
        keyLower.includes("video") ||
        /\.(mp4|webm|mov|m4v)(\?|$)/i.test(m.value) ||
        /(youtube\.com|youtu\.be|vimeo\.com)/i.test(m.value)
      ) {
        const matches = m.value.match(/https?:\/\/[^\s"'<>]+/g);
        if (matches) matches.forEach((u) => found.add(u));
        else if (/^https?:/i.test(m.value)) found.add(m.value);
      }
    }
  }

  // 2) Scan descriptions for embedded video URLs / iframes
  const haystack = `${p.description ?? ""}\n${p.short_description ?? ""}`;
  const urlRegex = /https?:\/\/[^\s"'<>]+/g;
  const urls = haystack.match(urlRegex) ?? [];
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

export async function GET(
  _req: Request,
  ctx: { params: { productId: string } },
) {
  const id = ctx.params.productId;
  const uploads = await listUploads(id);

  const cfg = envConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "WooCommerce not configured (.env.local)", uploads },
      { status: 500 },
    );
  }

  const url = `${cfg.base}/wp-json/wc/v3/products/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: basicAuth(cfg.key, cfg.secret) },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `WC fetch failed: ${res.status} ${res.statusText}`, uploads },
        { status: 502 },
      );
    }
    const p = (await res.json()) as WCProduct;
    const images = (p.images ?? [])
      .map((img) => img.src)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    const videos = extractVideoUrls(p);

    return NextResponse.json({
      id: p.id,
      name: p.name,
      images,
      videos,
      uploads,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "fetch failed", uploads },
      { status: 500 },
    );
  }
}
