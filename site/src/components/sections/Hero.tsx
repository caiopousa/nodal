import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Pad, type SurfaceKind } from "@/components/Pad"
import { useI18n } from "@/lib/i18n"

/** Esteira decorativa: tamanhos variados como no rabisco, looping contínuo. */
const STRIP: { kind: SurfaceKind; color: string }[] = [
  { kind: "cloth", color: "#3a2226" },
  { kind: "polyester", color: "#22303b" },
  { kind: "cloth", color: "#1e3a2f" },
  { kind: "hybrid", color: "#2b2438" },
  { kind: "glass", color: "#0f1216" },
  { kind: "cloth", color: "#3a2e1c" },
  { kind: "polyester", color: "#242a3d" },
  { kind: "cloth", color: "#1f2d2d" },
]

/**
 * Curvatura da esteira: cada pad é escalado e elevado conforme a distância
 * horizontal até o centro da tela (t = -1..1): desce nas bordas e gira
 * no plano em direção ao centro, como cartas numa roda. Sem escala.
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
        if (inner) inner.style.transform = `translateY(${(70 * k).toFixed(1)}px) rotate(${(22 * t).toFixed(1)}deg)`
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

      <div className="mt-6 overflow-hidden pt-10 pb-24" aria-hidden>
        <div ref={strip} className="marquee items-end px-4">
          {items.map((p, i) => (
            <div key={i} className="w-44 shrink-0">
              <Pad kind={p.kind} color={p.color} ratio={1.4} style={{ transformOrigin: "50% 50%", willChange: "transform" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
