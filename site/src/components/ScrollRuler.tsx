import { useEffect, useMemo, useRef, useState } from "react"
import { useI18n } from "@/lib/i18n"

const TICKS = 48                          // traços na régua
const IDS = ["what", "types", "feel", "choose", "price", "brands", "market", "glossary"] as const

/**
 * Régua lateral de navegação: traços curtos ao longo da página, traços longos
 * onde começa cada seção, marcador na posição atual do scroll. Hover mostra o
 * nome da seção; clique rola até ela.
 */
export function ScrollRuler() {
  const { t } = useI18n()
  const titles = useMemo<Record<(typeof IDS)[number], string>>(() => ({
    what: t.what.title, types: t.feel.typesTitle, feel: t.feel.title, choose: t.choose.title,
    price: t.price.title, brands: t.brands.title, market: t.market.title, glossary: t.glossary.title,
  }), [t])

  const [sections, setSections] = useState<{ id: string; frac: number }[]>([])
  const [progress, setProgress] = useState(0)
  const [hover, setHover] = useState<string | null>(null)
  const [open, setOpen] = useState(false)                       // mouse sobre a régua: mostra todos os nomes
  const current = Math.round(progress * (TICKS - 1))           // traço que representa o scroll atual
  const raf = useRef(0)

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setSections(IDS.flatMap((id) => {
        const el = document.getElementById(id)
        if (!el) return []
        const top = el.getBoundingClientRect().top + window.scrollY
        return [{ id, frac: Math.min(1, Math.max(0, (top - 96) / max)) }]   // 96 = scroll-margin da seção
      }))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
      })
    }
    measure(); onScroll()
    const t1 = setTimeout(measure, 500)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => { clearTimeout(t1); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", measure) }
  }, [t])

  // qual seção cai em cada traço (o mais próximo)
  const tickSection = (i: number) => {
    const f = i / (TICKS - 1)
    let best: { id: string; d: number } | null = null
    for (const s of sections) {
      const d = Math.abs(s.frac - f)
      if (d <= 0.5 / (TICKS - 1) && (!best || d < best.d)) best = { id: s.id, d }
    }
    return best?.id ?? null
  }

  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 py-4 pl-8 lg:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => { setOpen(false); setHover(null) }}
    >
      <div className="relative flex flex-col justify-between" style={{ height: 320 }}>
        {Array.from({ length: TICKS }, (_, i) => {
          const id = tickSection(i)
          const label = id ? titles[id as keyof typeof titles] : null
          const isCurrent = i === current
          const color = isCurrent ? "bg-primary" : id ? (hover === id ? "bg-primary" : "bg-foreground") : "bg-foreground/35"
          const width = isCurrent ? 32 : id ? 24 : 12
          return (
            <span key={i} className="relative flex h-px items-center justify-end">
              {id ? (
                <button
                  type="button"
                  aria-label={label ?? id}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  className="-my-2 flex h-4 items-center"
                >
                  <span className={`block h-px transition-[width,background-color] duration-150 ${color}`} style={{ width }} />
                </button>
              ) : (
                <span className={`block h-px transition-[width,background-color] duration-150 ${color}`} style={{ width }} />
              )}
              {id && label && (
                <span
                  className={`pointer-events-none absolute right-10 whitespace-nowrap text-xs leading-4 transition-opacity duration-150 ${open ? "opacity-100" : "opacity-0"} ${hover === id || (isCurrent && id) ? "text-primary" : "text-foreground"}`}
                >
                  {label}
                </span>
              )}
            </span>
          )
        })}
      </div>
    </nav>
  )
}
