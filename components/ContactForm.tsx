"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setError(data?.error ?? "Napaka. Poskusite znova.");
      }
    } catch {
      setStatus("error");
      setError("Napaka v omrežju. Poskusite znova.");
    }
  };

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-orange-dark/15 bg-pearl p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-700 text-2xl">✓</div>
        <h3 className="mt-4 text-xl font-extrabold text-ink">Hvala za sporočilo!</h3>
        <p className="mt-2 text-ink/70">Odgovorili vam bomo v najkrajšem možnem času.</p>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-orange-dark/20 bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30";
  const label = "block text-[12px] font-bold text-ink/70 mb-1";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-orange-dark/15 bg-pearl p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Ime in priimek</label>
          <input required value={form.name} onChange={set("name")} className={input} />
        </div>
        <div>
          <label className={label}>E-pošta</label>
          <input required type="email" value={form.email} onChange={set("email")} className={input} />
        </div>
      </div>
      <div className="mt-4">
        <label className={label}>Zadeva (neobvezno)</label>
        <input value={form.subject} onChange={set("subject")} placeholder="Sodelovanje, mediji, veleprodaja…" className={input} />
      </div>
      <div className="mt-4">
        <label className={label}>Sporočilo</label>
        <textarea required rows={6} value={form.message} onChange={set("message")} className={input} />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-800">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full rounded-full bg-orange px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark disabled:opacity-60"
        style={{ color: "#FFFFFF", letterSpacing: "0.08em" }}
      >
        <span style={{ color: "#FFFFFF" }}>{status === "sending" ? "Pošiljanje…" : "Pošlji sporočilo"}</span>
      </button>
    </form>
  );
}
