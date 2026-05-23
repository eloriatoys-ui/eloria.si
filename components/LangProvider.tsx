"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { DEFAULT_LOCALE, type Locale, translate } from "@/lib/i18n";

// Site is Slovenian-only. LangProvider stays in the tree so existing
// components that call useLang() / t() keep working — but locale is
// hard-locked to "sl" and there is no toggle UI.

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LangContext = createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => k,
});

export function useLang(): Ctx {
  return useContext(LangContext);
}

export default function LangProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = "sl";
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale: "sl",
      setLocale: () => {},
      t: (key: string) => translate("sl", key),
    }),
    [],
  );

  return (
    <LangContext.Provider value={value}>{children}</LangContext.Provider>
  );
}
