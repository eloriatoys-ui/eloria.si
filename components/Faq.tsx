"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type Item = {
  q: string;
  a: string;
};

const items: Item[] = [
  {
    q: "How long does delivery take?",
    a: "Most orders ship within 24 hours. Delivery within Slovenia takes 1–2 business days; the rest of the EU 3–5 business days; worldwide 5–10 business days. You'll get tracking the moment it leaves our warehouse.",
  },
  {
    q: "Is delivery really free?",
    a: "Yes — free standard delivery on every order over 150 €. Below that, it's a small flat rate that's shown at checkout before you pay.",
  },
  {
    q: "How do returns work?",
    a: "You have 30 days to return anything that isn't a perfect fit. Items must be unworn with tags attached. Start a return from your account or email hello@amareen.si — within Slovenia we provide a prepaid label.",
  },
  {
    q: "Are the materials safe for babies and toddlers?",
    a: "Always. Fabrics are OEKO-TEX certified, dyes are non-toxic and water-based, and every toy is tested for choking-size hazards. Suitable age is printed on each product page.",
  },
  {
    q: "How do I know what size to order?",
    a: "Each product has a detailed size chart with chest, waist, and length in centimetres. If you're between sizes for a fast-growing kid, we recommend going up — that's how parents end up getting two seasons out of a single piece.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "If your order hasn't shipped yet, yes — just reply to your confirmation email or contact us within 2 hours. Once it's on its way, you'll need to use the standard return flow.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Visa, Mastercard, American Express, Apple Pay, Google Pay, and PayPal. Checkout is fully encrypted; we never store your card details on our servers.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Every order is packed in our reusable cream gift box with a hand-tied ribbon. Add a personal note at checkout — totally free.",
  },
];

function Row({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-pearl transition-all"
      style={{
        border: open
          ? "1px solid rgba(194, 65, 12, 0.35)"
          : "1px solid rgba(194, 65, 12, 0.12)",
        boxShadow: open
          ? "0 1px 2px rgba(194, 65, 12, 0.08), 0 14px 30px -14px rgba(194, 65, 12, 0.22)"
          : "0 1px 2px rgba(194, 65, 12, 0.04)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
      >
        <span className="text-[15px] font-extrabold text-ink md:text-[16px]" style={{ letterSpacing: "-0.01em" }}>
          {item.q}
        </span>
        <span
          aria-hidden
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all ${
            open ? "rotate-45 bg-orange text-pearl" : "bg-cream text-orange-dark"
          }`}
          style={{ boxShadow: "inset 0 0 0 1px rgba(124, 45, 18, 0.18)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="border-t border-orange-dark/10 px-5 py-4 text-[14px] leading-relaxed text-slate md:px-6 md:py-5 md:text-[15px]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              Got questions?
              <span className="h-1 w-6 rounded-full bg-orange" />
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-tight text-ink sm:text-4xl md:text-5xl">
              Frequently asked
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate md:text-lg">
              Everything you need to know before ordering — shipping, sizes, materials, returns.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3 md:mt-12">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 60}>
              <Row
                item={it}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-[13px] text-slate">Still need help?</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@amareen.si"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
              style={{ letterSpacing: "0.08em", color: "#FFFFFF" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
              <span style={{ color: "#FFFFFF" }}>Email us</span>
            </a>
            <a
              href="https://instagram.com/amareen.slovenija/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-orange-dark/25 px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl"
              style={{ letterSpacing: "0.08em" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
              </svg>
              DM us on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
