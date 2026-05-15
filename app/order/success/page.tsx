import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClearCartOnMount from "./ClearCartOnMount";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getTrackingUrl } from "@/lib/gls";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  let summary: { email?: string; total?: number; currency?: string } = {};
  let tracking: { number: string; url: string } | null = null;
  if (sessionId) {
    try {
      const s = await stripe.checkout.sessions.retrieve(sessionId);
      summary = {
        email: s.customer_details?.email ?? undefined,
        total: (s.amount_total ?? 0) / 100,
        currency: (s.currency ?? "eur").toUpperCase(),
      };
    } catch {}
    const { data: orderRow } = await supabaseAdmin
      .from("orders")
      .select("tracking_number, tracking_carrier")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (orderRow?.tracking_number && orderRow.tracking_carrier === "GLS") {
      tracking = {
        number: orderRow.tracking_number,
        url: getTrackingUrl(orderRow.tracking_number),
      };
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <ClearCartOnMount />
      <section className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8 md:py-20">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-orange text-pearl">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-ink md:text-4xl">
          Thank you for your order!
        </h1>
        <p className="mt-3 text-base text-ink/80">
          {summary.email
            ? `A confirmation has been sent to ${summary.email}.`
            : "Your payment was successful."}
        </p>
        {summary.total ? (
          <p className="mt-1 text-sm font-bold text-ink/70">
            Total paid: {summary.currency === "EUR" ? "€" : ""}
            {summary.total.toFixed(2)}
          </p>
        ) : null}
        {tracking && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-orange-dark/15 bg-pearl p-5 text-left">
            <p className="text-[12px] font-bold uppercase tracking-wider text-ink/70">
              Tracking
            </p>
            <p className="mt-2 text-[14px] text-ink">
              GLS · <span className="font-bold">{tracking.number}</span>
            </p>
            <a
              href={tracking.url}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block text-[13px] font-bold text-orange-dark hover:underline"
            >
              Follow your parcel →
            </a>
          </div>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Continue shopping</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-orange-dark/25 bg-pearl px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-ink hover:bg-orange-dark hover:text-pearl"
          >
            Back to home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
