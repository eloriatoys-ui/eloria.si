"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart/cart-context";

type Method = "card" | "cod";

const COD_SURCHARGE = 2.0;

export default function CheckoutPage() {
  const {
    lines,
    subtotal,
    discountEligible,
    discountPercent,
    discount,
    discountedSubtotal,
    clear,
  } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<Method>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address state — only needed for bank_transfer + cod (Stripe collects its own).
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    postal_code: "",
    city: "",
    country: "SI",
  });

  const surcharge = method === "cod" ? COD_SURCHARGE : 0;
  const total = discountedSubtotal + surcharge;

  const requiresForm = method === "cod";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      setError("Vaša košarica je prazna.");
      return;
    }
    if (requiresForm) {
      for (const k of ["name", "email", "street", "postal_code", "city"] as const) {
        if (!form[k].trim()) {
          setError("Prosimo, izpolnite vsa polja za dostavo.");
          return;
        }
      }
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          method,
          address: requiresForm ? form : undefined,
        }),
      });
      const data = await res.json();
      if (!data?.url) {
        setError(data?.error ?? "Nakup ni uspel.");
        setLoading(false);
        return;
      }
      if (method !== "card") {
        clear();
      }
      // External Stripe URL (full https://...) → window.location, internal → router.push
      if (data.url.startsWith("http")) {
        window.location.href = data.url;
      } else {
        router.push(data.url);
      }
    } catch {
      setError("Napaka v omrežju. Poskusite znova.");
      setLoading(false);
    }
  };

  if (lines.length === 0) {
    return (
      <main className="min-h-screen bg-cream">
        <Navbar />
        <section className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-20">
          <h1 className="text-3xl font-extrabold text-ink">Vaša košarica je prazna</h1>
          <p className="mt-3 text-ink/70">Pred zaključkom nakupa dodajte izdelek.</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-full bg-orange px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl hover:bg-orange-dark"
            style={{ color: "#FFFFFF" }}
          >
            <span style={{ color: "#FFFFFF" }}>Pojdi v trgovino</span>
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">Zaključek nakupa</h1>

        <form onSubmit={submit} className="mt-8 grid gap-8 md:grid-cols-[1fr,360px]">
          <div className="space-y-6">
            {/* Payment method picker */}
            <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                Način plačila
              </h2>
              <div className="mt-4 space-y-3">
                <MethodRadio
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                  title="Kreditna / debetna kartica"
                  subtitle="Visa, Mastercard, Amex prek Stripe — takojšnja potrditev"
                />
                <MethodRadio
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  title="Plačilo po povzetju"
                  subtitle="Plačajte z gotovino kurirju GLS ob dostavi — strošek povzetja +2,00 €"
                />
              </div>
            </section>

            {requiresForm && (
              <section className="rounded-2xl border border-orange-dark/15 bg-pearl p-5">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink/70">
                  Naslov za dostavo
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Ime in priimek" value={form.name} onChange={(v) => setForm({ ...form, name: v })} className="sm:col-span-2" />
                  <Field label="E-pošta" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label="Telefon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Field label="Ulica in hišna številka" value={form.street} onChange={(v) => setForm({ ...form, street: v })} className="sm:col-span-2" />
                  <Field label="Poštna številka" value={form.postal_code} onChange={(v) => setForm({ ...form, postal_code: v })} />
                  <Field label="Kraj" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
                  <Field label="Država" value={form.country} onChange={(v) => setForm({ ...form, country: v.toUpperCase().slice(0, 2) })} />
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-orange-dark/15 bg-pearl p-6">
            <h2 className="text-lg font-extrabold text-ink">Povzetek naročila</h2>
            <ul className="mt-4 divide-y divide-orange-dark/10 text-[13px]">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between gap-4 py-2">
                  <span className="min-w-0 truncate text-ink">
                    {l.name} × {l.quantity}
                  </span>
                  <span className="font-bold text-ink whitespace-nowrap">
                    €{(l.price * l.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-orange-dark/10 pt-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-ink/70">Vmesni seštevek</dt>
                <dd className="font-bold text-ink">€{subtotal.toFixed(2)}</dd>
              </div>
              {discountEligible && (
                <div className="flex justify-between text-green-700">
                  <dt className="font-bold">Popust (−{discountPercent}%)</dt>
                  <dd className="font-bold">−€{discount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/70">Dostava</dt>
                <dd className="font-bold text-ink">Brezplačno</dd>
              </div>
              {method === "cod" && (
                <div className="flex justify-between">
                  <dt className="text-ink/70">Strošek povzetja</dt>
                  <dd className="font-bold text-ink">+€{COD_SURCHARGE.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-orange-dark/10 pt-3 text-[16px]">
                <dt className="font-extrabold text-ink">Skupaj</dt>
                <dd className="font-extrabold text-ink">€{total.toFixed(2)}</dd>
              </div>
            </dl>
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-800">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-full bg-orange px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark disabled:opacity-60"
              style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
            >
              <span style={{ color: "#FFFFFF" }}>
                {loading
                  ? "Obdelava…"
                  : method === "card"
                  ? "Plačaj s kartico"
                  : "Oddaj naročilo — plačilo po povzetju"}
              </span>
            </button>
            <Link
              href="/cart"
              className="mt-3 block text-center text-[12px] font-bold text-ink/60 hover:text-orange-dark"
            >
              ← Nazaj v košarico
            </Link>
          </aside>
        </form>
      </section>
      <Footer />
    </main>
  );
}

function MethodRadio({
  checked,
  onChange,
  title,
  subtitle,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
        checked
          ? "border-orange bg-orange/5"
          : "border-orange-dark/15 bg-cream hover:border-orange-dark/30"
      }`}
    >
      <input
        type="radio"
        name="payment_method"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 accent-orange"
      />
      <div className="min-w-0">
        <p className="text-[14px] font-extrabold text-ink">{title}</p>
        <p className="mt-0.5 text-[12px] text-ink/70">{subtitle}</p>
      </div>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-bold text-ink/70">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-orange-dark/20 bg-cream px-3 py-2 text-sm text-ink focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
      />
    </div>
  );
}
