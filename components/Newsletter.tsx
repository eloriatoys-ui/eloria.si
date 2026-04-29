"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { useLang } from "./LangProvider";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLang();

  return (
    <section
      id="newsletter"
      className="wood-dark relative overflow-hidden py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(255, 220, 170, 0.18) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.30) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber">
            <span className="h-1 w-6 rounded-full bg-amber" />
            {t("nl.eyebrow")}
            <span className="h-1 w-6 rounded-full bg-amber" />
          </p>
          <h2
            className="font-display mt-3 text-3xl tracking-tight sm:text-4xl md:text-5xl"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
            }}
          >
            {t("nl.title")}
          </h2>
          <p
            className="mt-3 text-base md:text-lg"
            style={{
              color: "rgba(255, 247, 237, 0.9)",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
            }}
          >
            {t("nl.subtitle")}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubmitted(true);
            }}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-3xl glass p-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("nl.placeholder")}
              className="flex-1 rounded-full bg-pearl px-5 py-3.5 text-base font-medium text-ink placeholder:text-slate/70 outline-none ring-2 ring-transparent focus:ring-amber"
            />
            <button
              type="submit"
              className="btn-magic rounded-full px-7 py-3.5 text-base font-bold"
            >
              {submitted ? t("nl.cta_done") : t("nl.cta")}
            </button>
          </form>

          <p className="mt-4 text-xs text-pearl/70">
            {t("nl.privacy")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
