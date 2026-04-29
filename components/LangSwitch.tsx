"use client";

import { useLang } from "./LangProvider";
import { LOCALES } from "@/lib/i18n";

export default function LangSwitch({
  className = "",
}: {
  className?: string;
}) {
  const { locale, setLocale } = useLang();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-0.5 rounded-full border border-orange-dark/20 bg-pearl/90 p-0.5 text-[11px] font-bold uppercase tracking-[0.16em] shadow-sm backdrop-blur-md ${className}`}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              active
                ? "bg-orange text-pearl"
                : "text-ink/70 hover:text-ink"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
