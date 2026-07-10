import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readSections, writeSections } from "@/lib/sections-server";
import { SECTION_KEYS, type SectionKey } from "@/lib/sections";

export async function GET() {
  const sections = await readSections();
  return NextResponse.json({ sections });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const section = body.section as string | undefined;
  const productId = Number(body.productId);
  const enabled = body.enabled;

  if (!section || !SECTION_KEYS.includes(section as SectionKey)) {
    return NextResponse.json({ error: "invalid section" }, { status: 400 });
  }
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "invalid productId" }, { status: 400 });
  }

  const sections = await readSections();
  const key = section as SectionKey;
  const list = sections[key];
  const idx = list.indexOf(productId);

  if (enabled === true) {
    if (idx === -1) list.push(productId);
  } else if (enabled === false) {
    if (idx !== -1) list.splice(idx, 1);
  } else {
    return NextResponse.json({ error: "enabled must be boolean" }, { status: 400 });
  }

  await writeSections(sections);

  revalidatePath("/");
  revalidatePath("/trgovina");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, sections });
}
