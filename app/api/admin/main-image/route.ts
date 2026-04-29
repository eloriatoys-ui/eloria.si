import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

const OVERRIDES_PATH = path.join(process.cwd(), "lib", "main-images.json");

async function readOverrides(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

async function writeOverrides(data: Record<string, string>) {
  await fs.writeFile(OVERRIDES_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const productId = body.productId;
  const imageUrl = body.imageUrl;
  const clear = body.clear === true;

  if (productId === undefined || productId === null) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  if (!clear && (typeof imageUrl !== "string" || imageUrl.length === 0)) {
    return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
  }

  const overrides = await readOverrides();
  const key = String(productId);

  if (clear) {
    delete overrides[key];
  } else {
    overrides[key] = imageUrl;
  }

  await writeOverrides(overrides);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, overrides });
}

export async function GET() {
  const overrides = await readOverrides();
  return NextResponse.json({ overrides });
}
