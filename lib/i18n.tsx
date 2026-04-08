"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "ja" | "en";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "ja",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang;
    if (stored === "en") setLangState("en");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function useT(dict: Record<string, { ja: string; en: string }>) {
  const { lang } = useLang();
  return (key: string) => dict[key]?.[lang] ?? dict[key]?.ja ?? key;
}

// Language toggle button component
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${className}`}
    >
      {lang === "ja" ? "EN" : "JP"}
    </button>
  );
}
