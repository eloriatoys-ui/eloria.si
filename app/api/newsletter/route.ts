import { NextResponse } from "next/server";
import { sendNewsletterWelcome } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Neveljaven e-poštni naslov." }, { status: 400 });
    }

    const sent = await sendNewsletterWelcome(email);
    if (!sent) {
      console.log("[newsletter] signup (email not sent):", email);
      return NextResponse.json(
        { error: "Prijave trenutno ne moremo obdelati. Poskusite znova kasneje." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter error:", err);
    return NextResponse.json({ error: "Napaka. Poskusite znova." }, { status: 500 });
  }
}
