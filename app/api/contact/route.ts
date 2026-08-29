import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim();
    const subject = (body.subject ?? "").trim() || undefined;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Prosimo, izpolnite ime, e-pošto in sporočilo." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Neveljaven e-poštni naslov." }, { status: 400 });
    }

    const sent = await sendContactMessage({ name, email, subject, message });
    if (!sent) {
      // Email delivery not configured — don't lose the message silently.
      console.log("[contact] message (email not sent):", { name, email, subject, message });
      return NextResponse.json(
        { error: "Sporočila trenutno ne moremo poslati. Pišite nam na eloriatoys@gmail.com." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "Napaka. Poskusite znova." }, { status: 500 });
  }
}
