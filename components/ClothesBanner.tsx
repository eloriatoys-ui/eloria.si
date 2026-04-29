"use client";

import Reveal from "./Reveal";
import { useLang } from "./LangProvider";

export default function ClothesBanner() {
  const { t } = useLang();
  return (
    <section className="bg-cream py-8 md:py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div
            className="group relative block overflow-hidden rounded-3xl"
            style={{
              boxShadow:
                "0 1px 2px rgba(194, 65, 12, 0.06), 0 14px 36px -12px rgba(194, 65, 12, 0.25)",
            }}
          >
            <div
              className="relative grid min-h-[300px] grid-cols-1 items-center md:min-h-[360px] md:grid-cols-2"
              style={{
                background:
                  "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 40%, #FDBA74 80%, #F4B73E 100%)",
              }}
            >
              {/* Decorative paper-cut shapes */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-10 top-6 h-32 w-32 rounded-full opacity-50 blur-2xl"
                style={{ background: "rgba(255, 255, 255, 0.6)" }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 bottom-0 h-40 w-40 rounded-full opacity-40 blur-2xl"
                style={{ background: "rgba(194, 65, 12, 0.4)" }}
              />

              {/* TEXT SIDE */}
              <div className="relative z-10 p-8 md:p-12 lg:p-16">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-deep">
                  <span className="h-1 w-6 rounded-full bg-orange-dark" />
                  {t("cb.eyebrow")}
                </p>
                <h2
                  className="mt-3 text-[34px] font-extrabold leading-[1.05] text-ink sm:text-[44px] md:text-[52px]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {t("cb.title")}
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/80 md:text-[16px]">
                  {t("cb.subtitle")}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="/shop?category=Dresses"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-extrabold uppercase tracking-wider text-pearl transition-transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "#1C1917",
                      color: "#FFFFFF",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <span style={{ color: "#FFFFFF" }}>{t("cb.cta_dresses")}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="13 6 19 12 13 18" />
                    </svg>
                  </a>
                  <a
                    href="/shop?category=Clothing+sets+AMAREEN"
                    className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-[13px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-pearl/40"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    {t("cb.cta_sets")}
                  </a>
                </div>

                {/* Tiny perks row */}
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-semibold text-ink/80">
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("cb.perk_organic")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("cb.perk_returns")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("cb.perk_sizes")}
                  </span>
                </div>
              </div>

              {/* VISUAL SIDE — looping clothing video */}
              <div className="relative h-full min-h-[260px] overflow-hidden">
                <div className="absolute inset-3 overflow-hidden rounded-2xl ring-1 ring-pearl/60 md:inset-5">
                  <video
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src="/videos/v-clothes.mp4"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
