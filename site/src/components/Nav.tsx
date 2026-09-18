import { useEffect, useState } from "react"
import { useI18n } from "@/lib/i18n"

/**
 * No topo da página a nav é uma barra de largura total. Ao rolar, ela se
 * recolhe pra uma pílula centralizada na largura do conteúdo (ref:
 * componentes.design). Raio 32 = controles internos 8 + padding 24.
 */
export function Nav() {
  const { t, locale, setLocale } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <header className={`nav-shell sticky top-0 z-40 ${scrolled ? "pt-4" : "pt-0"}`}>
      <div className={`nav-bar mx-auto flex h-14 items-center justify-between gap-4 border px-6 ${scrolled ? "nav-bar--pill" : ""}`}>
        <a href="#" className="flex items-center gap-2" aria-label="nodal/setup">
          <img src="/logo.png" alt="" width={40} height={40} className="size-10 shrink-0 object-contain" />
          <span className="leading-none">
            <span className="font-heading text-[14px] text-primary">nodal</span>
            <span className="text-base font-medium text-foreground">/setup</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          {/* seletor de produto */}
          <div className="flex items-center rounded-md border p-1 text-xs" role="tablist" aria-label="Product">
            <button role="tab" aria-selected className="rounded-sm bg-muted px-3 py-1 font-medium text-foreground">
              {t.nav.products.mousepads}
            </button>
            <button role="tab" aria-selected={false} disabled className="relative rounded-sm px-3 py-1 text-muted-foreground disabled:cursor-not-allowed">
              {t.nav.products.keyboards}
              <span className="absolute -top-2 -right-1 rounded-full border bg-background px-2 py-0 font-mono text-[8px] uppercase tracking-wider text-primary">
                {t.nav.products.soon}
              </span>
            </button>
          </div>

          {/* idioma */}
          <div className="flex items-center rounded-md border p-1 text-xs">
            {(["en", "pt"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-sm px-2 py-1 font-medium transition-colors ${locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                aria-pressed={locale === l}
              >
                {t.nav.lang[l]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
