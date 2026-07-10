import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateOrderQr, buildReference } from "@/lib/upn-qr";
import { getTrackingUrl } from "@/lib/courier";
import OrderProgress from "@/components/OrderProgress";
import ClearCartOnMount from "../uspeh/ClearCartOnMount";

export const dynamic = "force-dynamic";

export default async function PublicOrderPage({
  params,
}: {
  params: { order_number: string };
}) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", params.order_number)
    .maybeSingle();
  if (!order) notFound();

  const isBank = order.payment_method === "bank_transfer";
  const isCod = order.payment_method === "cod";
  const isPaid = order.payment_status === "paid";

  const qrDataUrl =
    isBank && !isPaid ? await generateOrderQr({
      order_number: order.order_number,
      total: Number(order.total),
      shipping_address: order.shipping_address as any,
    }) : null;

  const tracking =
    order.tracking_number
      ? {
          carrier: order.tracking_carrier ?? "Express One",
          number: order.tracking_number,
          url: getTrackingUrl(order.tracking_carrier, order.tracking_number)!,
        }
      : null;

  const bankIban = (process.env.ELORIA_BANK_IBAN ?? "").replace(/(.{4})/g, "$1 ").trim();
  const bankName = process.env.ELORIA_BANK_ACCOUNT_NAME ?? "";
  const bankBic = process.env.ELORIA_BANK_BIC ?? "";

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <ClearCartOnMount />
      <section className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange text-pearl">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-ink md:text-4xl">
            {isBank && !isPaid ? "Naročilo prejeto — prosimo, plačajte" : "Hvala za vaše naročilo!"}
          </h1>
          <p className="mt-2 text-[15px] font-bold text-ink/70">
            {order.order_number} · €{Number(order.total).toFixed(2)}
          </p>
        </div>

        <div className="mt-10">
          <OrderProgress order={order as any} />
        </div>

        {isBank && !isPaid && qrDataUrl && (
          <section className="mt-10 rounded-2xl border border-orange-dark/15 bg-pearl p-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
              Plačilo z bančnim nakazilom
            </h2>
            <p className="mt-2 text-[14px] text-ink/80">
              Skenirajte UPN QR kodo z bančno aplikacijo (NLB, OTP, Intesa, A Bank …). Naročilo odpošljemo, ko prejmemo plačilo.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-[auto,1fr] md:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="UPN QR koda" className="h-64 w-64 rounded-xl bg-white p-2 shadow-sm" />
              <dl className="space-y-2 text-[13px]">
                <Row label="Prejemnik" value={bankName} />
                <Row label="IBAN" value={bankIban} mono />
                <Row label="BIC / SWIFT" value={bankBic} mono />
                <Row label="Znesek" value={`€${Number(order.total).toFixed(2)}`} />
                <Row label="Sklic" value={buildReference(order.order_number)} mono />
                <Row label="Namen" value={`Eloria naročilo ${order.order_number}`} />
              </dl>
            </div>
            <p className="mt-6 text-[12px] text-ink/60">
              Ne morete skenirati? Ročno vnesite IBAN, znesek in sklic v bančno aplikacijo ali spletno banko.
            </p>
          </section>
        )}

        {isCod && (
          <section className="mt-10 rounded-2xl border border-orange-dark/15 bg-pearl p-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
              Plačilo po povzetju
            </h2>
            <p className="mt-2 text-[14px] text-ink/80">
              Plačajte <span className="font-bold">€{Number(order.total).toFixed(2)}</span> z gotovino kurirju GLS ob dostavi paketa. Prosimo, pripravite točen znesek.
            </p>
            <p className="mt-1 text-[12px] text-ink/60">
              Vključuje strošek povzetja €{Number(order.cod_surcharge ?? 0).toFixed(2)}.
            </p>
          </section>
        )}

        {tracking && (
          <section className="mt-6 rounded-2xl border border-orange-dark/15 bg-pearl p-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
              Dostava
            </h2>
            <p className="mt-2 text-[14px] text-ink">
              {tracking.carrier} · <span className="font-bold">{tracking.number}</span>
            </p>
            <a
              href={tracking.url}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block text-[13px] font-bold text-orange-dark hover:underline"
            >
              Sledite paketu →
            </a>
          </section>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/trgovina"
            className="rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Nadaljuj nakupovanje</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-orange-dark/25 bg-pearl px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-ink hover:bg-orange-dark hover:text-pearl"
          >
            Nazaj na domačo stran
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink/60">{label}</dt>
      <dd className={`font-bold text-ink ${mono ? "font-mono text-[12px]" : ""}`}>{value}</dd>
    </div>
  );
}
