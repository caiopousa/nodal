import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { en } from "@/content/en"
import { pt } from "@/content/pt"

export type Locale = "en" | "pt"
export type Content = typeof en
const dictionaries: Record<Locale, Content> = { en, pt: pt as Content }

const Ctx = createContext<{ locale: Locale; t: Content; setLocale: (l: Locale) => void }>({
  locale: "en", t: en, setLocale: () => {},
})

function initial(): Locale {
  try {
    const saved = localStorage.getItem("locale")
    if (saved === "en" || saved === "pt") return saved
    if (location.pathname.startsWith("/pt-br")) return "pt"
    if (navigator.language.toLowerCase().startsWith("pt")) return "pt"
  } catch { /* ignore */ }
  return "en"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initial)
  useEffect(() => {
    try { localStorage.setItem("locale", locale) } catch { /* ignore */ }
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en"
  }, [locale])
  const value = useMemo(() => ({ locale, t: dictionaries[locale], setLocale }), [locale])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
