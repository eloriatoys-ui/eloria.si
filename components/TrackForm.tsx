"use client";

import { useState } from "react";
import OrderProgress from "./OrderProgress";

type TrackedOrder = {
  order_number: string;
  total: number;
  currency?: string;
  payment_method?: string | null;
  payment_status?: string | null;
  shipping_status?: string | null;
  created_at?: string | null;
  paid_at?: string | null;
  shipped_at?: string | null;
  in_transit_at?: string | null;
  delivered_at?: string | null;
  tracking_carrier?: string | null;
  tracking_number?: string | null;
};

type Item = { product_name: string; quantity: number; unit_price: number; total: number };

export default function TrackForm({ initialOrderNumber = "" }: { initialOrderNumber?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ order: TrackedOrder; items: Item[] } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Prišlo je do napake.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Prišlo je do napake. Poskusite znova.");
    } finally {
      setLoading(false);
    }
  }

  const o = result?.order;
  const glsUrl =
    o?.tracking_number && o.tracking_carrier === "GLS"
      ? `https://gls-group.eu/SI/sl/sledenje-posiljk?match=${encodeURIComponent(o.tracking_number)}`
      : null;

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-orange-dark/15 bg-pearl p-6"
      >
        <label className="block text-[12px] font-bold uppercase tracking-wider text-ink/70">
          Številka naročila
        </label>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="ELO-2026-00042"
          required
          className="mt-1 w-full rounded-lg border border-orange-dark/20 bg-cream px-3 py-2.5 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
        <label className="mt-4 block text-[12px] font-bold uppercase tracking-wider text-ink/70">
          E-naslov (uporabljen pri naročilu)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ime@primer.si"
          required
          className="mt-1 w-full rounded-lg border border-orange-dark/20 bg-cream px-3 py-2.5 text-sm focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark disabled:opacity-60"
          style={{ color: "#FFFFFF" }}
        >
          <span style={{ color: "#FFFFFF" }}>{loading ? "Iščem…" : "Poišči naročilo"}</span>
        </button>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-800">{error}</p>
        )}
      </form>

      {result && o && (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-ink">{o.order_number}</h2>
            <p className="mt-1 text-[14px] font-bold text-ink/70">
              €{Number(o.total).toFixed(2)}
            </p>
          </div>

          <OrderProgress order={o} />

          {o.tracking_number && (
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-6">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Dostava
              </h3>
              <p className="mt-2 text-[14px] text-ink">
                {o.tracking_carrier ?? "Kurir"} ·{" "}
                <span className="font-bold">{o.tracking_number}</span>
              </p>
              {glsUrl && (
                <a
                  href={glsUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 inline-block text-[13px] font-bold text-orange-dark hover:underline"
                >
                  Sledite paketu →
                </a>
              )}
            </section>
          )}

          {result.items.length > 0 && (
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-6">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Izdelki
              </h3>
              <ul className="mt-3 divide-y divide-orange-dark/10">
                {result.items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 py-2.5 text-[14px]">
                    <span className="text-ink">{it.product_name}</span>
                    <span className="text-ink/70">
                      {it.quantity} × €{Number(it.unit_price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
