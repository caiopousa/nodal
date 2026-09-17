import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Pad, type SurfaceKind } from "@/components/Pad"
import { useI18n } from "@/lib/i18n"

/** Esteira decorativa: tamanhos variados como no rabisco, looping contínuo. */
const STRIP: { kind: SurfaceKind; color: string; w: number; ratio: number }[] = [
  { kind: "cloth", color: "#3a2226", w: 200, ratio: 1.15 },
  { kind: "polyester", color: "#22303b", w: 150, ratio: 0.9 },
  { kind: "cloth", color: "#1e3a2f", w: 120, ratio: 1 },
  { kind: "hybrid", color: "#2b2438", w: 120, ratio: 0.85 },
  { kind: "glass", color: "#0f1216", w: 150, ratio: 1.1 },
  { kind: "cloth", color: "#3a2e1c", w: 200, ratio: 1.3 },
  { kind: "polyester", color: "#242a3d", w: 260, ratio: 1.8 },
  { kind: "cloth", color: "#1f2d2d", w: 150, ratio: 1 },
]

/**
 * Curvatura da esteira: cada pad é escalado e elevado conforme a distância
 * horizontal até o centro da tela (t = -1..1). Centro menor e mais baixo,
 * bordas maiores e mais altas, como um anel visto de dentro.
 */
function useCurvedStrip(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const tick = () => {
      const cx = window.innerWidth / 2
      const half = window.innerWidth / 2
      for (const child of Array.from(el.children) as HTMLElement[]) {
        const r = child.getBoundingClientRect()
        const t = Math.max(-1.2, Math.min(1.2, (r.left + r.width / 2 - cx) / half))
        const k = t * t
        const inner = child.firstElementChild as HTMLElement | null
        if (inner) inner.style.transform = `translateY(${(-40 * k).toFixed(1)}px) scale(${(0.74 + 0.38 * k).toFixed(3)}) rotateY(${(-14 * t).toFixed(1)}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ref])
}

export function Hero() {
  const { t } = useI18n()
  const items = [...STRIP, ...STRIP]
  const strip = useRef<HTMLDivElement>(null)
  useCurvedStrip(strip)
  return (
    <section className="pt-20 sm:pt-28">
      <motion.div
        className="container-101 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="eyebrow">{t.hero.eyebrow}</p>
        <h1 className="mt-4 max-w-2xl text-4xl tracking-tight text-balance sm:text-6xl">{t.hero.title}</h1>
        <p className="prose-101 mt-6 max-w-xl">{t.hero.lede}</p>
        <Button size="lg" className="mt-8" nativeButton={false} render={<a href="#what" />}>{t.hero.cta}</Button>
      </motion.div>

      <div className="mt-6 overflow-hidden pt-28 pb-6" aria-hidden style={{ perspective: "1200px" }}>
        <div ref={strip} className="marquee items-end px-4">
          {items.map((p, i) => (
            <div key={i} className="shrink-0" style={{ width: p.w, transformStyle: "preserve-3d" }}>
              <Pad kind={p.kind} color={p.color} ratio={p.ratio} style={{ transformOrigin: "50% 100%", willChange: "transform" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
