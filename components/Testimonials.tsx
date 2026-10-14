"use client";

import Reveal from "./Reveal";
import { useLang } from "./LangProvider";
import type { GoogleReviews } from "@/lib/google-reviews";

function Stars({ value = 5 }: { value?: number }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < full ? "#F4B73E" : "#E5E0D8"}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.4 4.4-17.7 10.7Z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2 1.4-4.6 2.3-7.6 2.3-5.3 0-9.7-3.4-11.3-8L6 32.6C9.3 39.4 16.1 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.5 5.5C42 36.7 44 31.7 44 24c0-1.2-.1-2.4-.4-3.5Z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

const avatarBgs = [
  "linear-gradient(135deg, #F472B6 0%, #C084FC 100%)",
  "linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)",
  "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
];

// "1 ocena", "2 oceni", "3 ocene", "5 ocen" — Slovenian has four plural forms.
function reviewCount(n: number, locale: string) {
  if (locale !== "sl") return `${n} Google review${n === 1 ? "" : "s"}`;
  const m = n % 100;
  const word = m === 1 ? "ocena" : m === 2 ? "oceni" : m === 3 || m === 4 ? "ocene" : "ocen";
  return `${n} ${word} na Googlu`;
}

const pillClass =
  "inline-flex items-center gap-2 rounded-full border border-orange-dark/25 px-5 py-2.5 text-[13px] font-bold text-ink transition-colors hover:border-orange hover:bg-orange hover:text-pearl";

// Real Google reviews only — `data` comes from lib/google-reviews.ts. Until the
// Google Business profile is connected (or has reviews) we show an invitation
// instead of placeholder quotes.
export default function Testimonials({
  data,
  writeUrl,
}: {
  data: GoogleReviews | null;
  writeUrl: string | null;
}) {
  const { t, locale } = useLang();
  const reviews = data?.reviews ?? [];
  const write = data?.writeUrl ?? writeUrl;

  return (
    <section id="testimonials" className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-dark">
              <span className="h-1 w-6 rounded-full bg-orange" />
              {t("rev.eyebrow")}
              <span className="h-1 w-6 rounded-full bg-orange" />
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-tight text-ink sm:text-4xl md:text-5xl">
              {t("rev.title")}
            </h2>

            {data && data.count > 0 ? (
              <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-orange-dark/15 bg-pearl px-5 py-2.5 shadow-soft">
                <GoogleG />
                <span className="text-[13px] font-bold text-ink md:text-[14px]">
                  {data.rating.toFixed(1)}
                </span>
                <Stars value={data.rating} />
                <span className="text-[12px] font-semibold text-slate md:text-[13px]">
                  · {reviewCount(data.count, locale)}
                </span>
              </div>
            ) : null}

            {reviews.length === 0 && (
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink/75">
                {t("rev.empty")}
              </p>
            )}
          </div>
        </Reveal>

        {reviews.length > 0 && (
          <div
            className={`mx-auto mt-10 grid grid-cols-1 gap-5 md:mt-12 md:gap-6 ${
              reviews.length >= 3 ? "md:grid-cols-3" : reviews.length === 2 ? "max-w-3xl md:grid-cols-2" : "max-w-md"
            }`}
          >
            {reviews.map((r, i) => (
              <Reveal key={`${r.author}-${i}`} delay={(i % 3) * 120}>
                <article
                  className="flex h-full flex-col gap-4 rounded-2xl bg-pearl p-6 transition-transform hover:-translate-y-0.5"
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow:
                      "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -10px rgba(0, 0, 0, 0.10)",
                  }}
                >
                  <header className="flex items-start gap-3">
                    {r.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.photo}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-extrabold text-pearl"
                        style={{ background: avatarBgs[i % avatarBgs.length] }}
                      >
                        {r.author.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <a
                        href={r.authorUrl ?? data?.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-[14px] font-bold text-ink hover:text-orange-dark"
                      >
                        {r.author}
                      </a>
                      <p className="truncate text-[12px] text-slate">{r.when}</p>
                    </div>
                    <GoogleG size={16} />
                  </header>

                  <Stars value={r.rating} />

                  <p className="text-[14px] leading-relaxed text-ink/85 md:text-[15px]">
                    {r.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {data && reviews.length > 0 && (
            <a href={data.mapsUrl} target="_blank" rel="noreferrer" className={pillClass}>
              {t("rev.viewall")}
              <Arrow />
            </a>
          )}
          <a
            href={write ?? "/kontakt"}
            {...(write ? { target: "_blank", rel: "noreferrer" } : {})}
            className={pillClass}
          >
            {t(write ? "rev.write" : "rev.write_contact")}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
