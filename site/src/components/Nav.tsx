import { useI18n } from "@/lib/i18n"

export function Nav() {
  const { t, locale, setLocale } = useI18n()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md">
      <div className="container-wide flex h-14 items-center justify-between gap-4">
        <a href="#" className="text-[15px] font-medium tracking-tight" aria-label="everything.setup">
          everything<span className="text-primary">.</span><span className="font-heading text-[17px] leading-none">setup</span>
        </a>

        <div className="flex items-center gap-3">
          {/* seletor de produto */}
          <div className="flex items-center rounded-lg border p-0.5 text-xs" role="tablist" aria-label="Product">
            <button role="tab" aria-selected className="rounded-md bg-muted px-3 py-1.5 font-medium text-foreground">
              {t.nav.products.mousepads}
            </button>
            <button role="tab" aria-selected={false} disabled className="relative rounded-md px-3 py-1.5 text-muted-foreground disabled:cursor-not-allowed">
              {t.nav.products.keyboards}
              <span className="absolute -top-2 -right-1 rounded-full border bg-background px-1.5 py-px font-mono text-[9px] uppercase tracking-wider text-primary">
                {t.nav.products.soon}
              </span>
            </button>
          </div>

          {/* idioma */}
          <div className="flex items-center rounded-lg border p-0.5 text-xs">
            {(["en", "pt"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-md px-2 py-1.5 font-medium transition-colors ${locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
