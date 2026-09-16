import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export function Nav() {
  const { t, locale, setLocale } = useI18n()
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md">
      <div className="container-101 flex h-14 items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="inline-block h-3 w-4 rounded-[2px] bg-primary" aria-hidden />
          {t.nav.brand}
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {t.nav.items.map((it) => (
            <Button key={it.id} variant="ghost" size="sm" nativeButton={false} render={<a href={`#${it.id}`} />}>{it.label}</Button>
          ))}
        </nav>
        <div className="flex items-center rounded-lg border p-0.5 text-xs">
          {(["en", "pt"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`rounded-md px-2 py-1 font-medium transition-colors ${locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              aria-pressed={locale === l}
            >
              {t.nav.lang[l]}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
