import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Dict, type Locale } from "./en";
import { ar } from "./ar";

const dicts: Record<Locale, Dict> = { en, ar };

type Ctx = {
  locale: Locale;
  t: Dict;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  dir: "ltr" | "rtl";
};

const I18nCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "auh.locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    return saved === "ar" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      t: dicts[locale],
      setLocale: setLocaleState,
      toggle: () => setLocaleState((l) => (l === "en" ? "ar" : "en")),
      dir: locale === "ar" ? "rtl" : "ltr",
    }),
    [locale]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
