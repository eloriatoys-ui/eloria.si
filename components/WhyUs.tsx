"use client";

import Reveal from "./Reveal";
import { useLang } from "./LangProvider";

const iconClass = "h-7 w-7";
const stroke = "#7C2D12";

const features = [
  {
    titleKey: "why.crafted.title",
    bodyKey: "why.crafted.body",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    titleKey: "why.safe.title",
    bodyKey: "why.safe.body",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    titleKey: "why.last.title",
    bodyKey: "why.last.body",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.6 13.6 17 22l-5-3-5 3 1.4-8.4" />
      </svg>
    ),
  },
  {
    titleKey: "why.delivery.title",
    bodyKey: "why.delivery.body",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="14" height="11" rx="1" />
        <path d="M15 9h4l3 4v4h-7V9Z" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
  },
];

export default function WhyUs() {
  const { t } = useLang();
  return (
    <section id="why" className="wood-dark relative overflow-hidden py-16 md:py-24">
      {/* Soft warm overlays so headlines pop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(255, 220, 170, 0.22) 0%, transparent 60%)",
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

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber">
              <span className="h-1 w-6 rounded-full bg-amber" />
              {t("why.eyebrow")}
              <span className="h-1 w-6 rounded-full bg-amber" />
            </p>
            <h2
              className="font-display mt-3 text-3xl tracking-tight sm:text-4xl md:text-5xl"
              style={{
                color: "#FFFFFF",
                textShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
              }}
            >
              {t("why.title")}
            </h2>
            <p
              className="mx-auto mt-3 max-w-xl text-base md:text-lg"
              style={{
                color: "rgba(255, 247, 237, 0.85)",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
              }}
            >
              {t("why.subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.titleKey} delay={i * 100}>
              <div
                className="group flex h-full flex-col gap-4 rounded-2xl p-6 transition-transform hover:-translate-y-1"
                style={{
                  background: "rgba(255, 247, 237, 0.96)",
                  border: "1px solid rgba(124, 45, 18, 0.18)",
                  boxShadow:
                    "0 1px 2px rgba(0, 0, 0, 0.18), 0 16px 30px -14px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #FED7AA 0%, #F4DCB7 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(124, 45, 18, 0.15)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="text-[18px] font-extrabold leading-tight text-ink md:text-[19px]" style={{ letterSpacing: "-0.015em" }}>
                  {t(f.titleKey)}
                </h3>
                <p className="text-[14px] leading-relaxed text-slate md:text-[15px]">
                  {t(f.bodyKey)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
