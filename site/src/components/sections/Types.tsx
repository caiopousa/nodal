import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { Section } from "@/components/Section"
import { Pad, type SurfaceKind } from "@/components/Pad"
import { TYPES, type TypeId } from "@/components/Simulator"
import { useI18n } from "@/lib/i18n"

const KIND: Record<TypeId, SurfaceKind> = { control: "cloth", balanced: "cloth", speed: "polyester", hybrid: "hybrid", glass: "glass" }

export function Types() {
  const { t } = useI18n()
  const [sel, setSel] = useState<TypeId>("control")
  const type = TYPES.find((x) => x.id === sel)!
  const ref = useRef<HTMLDivElement>(null)
  // pad plano → tombado em perspectiva conforme entra na tela
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 35%"] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 55])
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  return (
    <Section id="types" eyebrow={t.feel.typesEyebrow} title={t.feel.typesTitle} lede={t.feel.typesLede}>
      <div ref={ref} className="mx-auto max-w-md" style={{ perspective: "900px" }}>
        <motion.div style={{ rotateX, scale, transformOrigin: "50% 100%" }}>
          <Pad kind={KIND[sel]} color={type.color} ratio={1.4} label={t.feel.types[sel].name} />
        </motion.div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist">
        {TYPES.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={sel === x.id}
            onClick={() => setSel(x.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${sel === x.id ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.feel.types[x.id].name}
          </button>
        ))}
      </div>

      <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border bg-card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="flex items-center gap-3 text-xl">
            {t.feel.types[sel].name}
            <span className="rounded-md border px-1.5 py-px font-mono text-[11px] font-normal text-muted-foreground">{t.feel.material[sel]}</span>
          </h3>
          <span className="font-mono text-xs text-muted-foreground">μs {type.mus.toFixed(2)} · μk {type.muk.toFixed(2)}</span>
        </div>
        <p className="prose-101 mt-3 text-[15px]">{t.feel.types[sel].blurb}</p>
      </motion.div>

      <p className="prose-101 mt-8 max-w-2xl text-[15px]"><span className="text-primary">→</span> {t.feel.takeaway}</p>
    </Section>
  )
}
