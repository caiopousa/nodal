import { useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { Pad, brandColor, surfaceKind } from "@/components/Pad"
import { brandSample } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"

const SAMPLE = brandSample(12)
const CARD_W = 208, GAP = 16, PAD_BOX = 208   // px; caixa fixa pro pad = legendas alinhadas

/**
 * Vitrine de marcas: carrossel arrastável dentro do container do conteúdo,
 * sem barra de rolagem, com setas nas bordas. A trilha é arrastada com mola e
 * fica presa entre o primeiro e o último card.
 */
export function Brands() {
  const { t } = useI18n()
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [min, setMin] = useState(0)            // deslocamento máximo (negativo)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const measure = () => {
      const v = viewport.current, tr = track.current
      if (!v || !tr) return
      const m = Math.min(0, v.clientWidth - tr.scrollWidth)
      setMin(m)
      if (x.get() < m) x.set(m)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (viewport.current) ro.observe(viewport.current)
    return () => ro.disconnect()
  }, [x])

  useMotionValueEvent(x, "change", (v) => setEdge({ start: v >= -1, end: v <= min + 1 }))
  useEffect(() => setEdge({ start: x.get() >= -1, end: x.get() <= min + 1 }), [min, x])

  const go = (dir: 1 | -1) => {
    const step = (CARD_W + GAP) * 2
    const target = Math.max(min, Math.min(0, x.get() - dir * step))
    animate(x, target, { type: "spring", stiffness: 260, damping: 32 })
  }

  const arrow = "absolute z-10 size-10 rounded-full bg-card shadow-md transition-opacity dark:bg-card dark:hover:bg-muted disabled:opacity-0"

  return (
    <Section id="brands" eyebrow={t.brands.eyebrow} title={t.brands.title} lede={t.brands.lede}>
      <div className="relative">
        <div ref={viewport} className="overflow-hidden">
          <motion.div
            ref={track}
            className="flex cursor-grab select-none active:cursor-grabbing"
            style={{ x, gap: GAP, touchAction: "pan-y" }}
            drag="x"
            dragConstraints={{ left: min, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          >
            {SAMPLE.map((m, i) => (
              <motion.figure
                key={m.brand + m.model}
                className="shrink-0"
                style={{ width: CARD_W }}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
              >
                <div className="flex items-end" style={{ height: PAD_BOX }}>
                  <Pad
                    kind={surfaceKind(m.surface)}
                    color={brandColor(m.brand)}
                    stitched={m.edges === "Stitched"}
                    label={m.brand}
                    ratio={m.width && m.length ? Math.min(1.6, Math.max(1.02, m.width / m.length)) : 1.2}
                    className="pointer-events-none w-full"
                  />
                </div>
                <figcaption className="mt-3">
                  <div className="truncate text-sm font-medium">{m.brand} {m.model}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {[m.speed, m.surface, m.thickness ? `${m.thickness} mm` : null].filter(Boolean).join(" · ")}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>

        {/* setas centradas na altura dos pads, encostadas nas bordas do container */}
        <Button variant="outline" size="icon-lg" className={`${arrow} -left-5`} style={{ top: PAD_BOX / 2 - 20 }} onClick={() => go(-1)} disabled={edge.start} aria-label={t.brands.prev}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.5} />
        </Button>
        <Button variant="outline" size="icon-lg" className={`${arrow} -right-5`} style={{ top: PAD_BOX / 2 - 20 }} onClick={() => go(1)} disabled={edge.end} aria-label={t.brands.next}>
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={1.5} />
        </Button>
      </div>
    </Section>
  )
}
