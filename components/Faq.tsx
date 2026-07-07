"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { useLang } from "./LangProvider";

type Item = {
  qKey: string;
  aKey: string;
};

const items: Item[] = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
  { qKey: "faq.q7", aKey: "faq.a7" },
  { qKey: "faq.q8", aKey: "faq.a8" },
];

function Row({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  const { t } = useLang();
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
          {t(item.qKey)}
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
            {t(item.aKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useLang();

  return (
    <section id="faq" className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              {t("faq.eyebrow")}
              <span className="h-1 w-6 rounded-full bg-orange" />
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-tight text-ink sm:text-4xl md:text-5xl">
              {t("faq.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate md:text-lg">
              {t("faq.subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-3 md:mt-12">
          {items.map((it, i) => (
            <Reveal key={it.qKey} delay={i * 60}>
              <Row
                item={it}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-[13px] text-slate">{t("faq.help")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:eloriatoys@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-colors hover:bg-orange-dark"
              style={{ letterSpacing: "0.08em", color: "#FFFFFF" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
              <span style={{ color: "#FFFFFF" }}>{t("faq.email")}</span>
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
              {t("faq.dm")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
