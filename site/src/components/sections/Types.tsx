import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { Section } from "@/components/Section"
import { Pad, type SurfaceKind } from "@/components/Pad"
import { TYPES, type TypeId } from "@/components/Simulator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/lib/i18n"

const KIND: Record<TypeId, SurfaceKind> = { control: "cloth", balanced: "cloth", speed: "polyester", hybrid: "hybrid", glass: "glass" }

export function Types() {
  const { t } = useI18n()
  const [sel, setSel] = useState<TypeId>("control")
  const type = TYPES.find((x) => x.id === sel)!
  const ref = useRef<HTMLDivElement>(null)
  // pad plano → tombado em perspectiva conforme entra na tela
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 62%", "start 22%"] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 55])
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  return (
    <Section id="types" eyebrow={t.feel.typesEyebrow} title={t.feel.typesTitle} lede={t.feel.typesLede}>
      <div ref={ref} className="mx-auto max-w-md" style={{ perspective: "900px" }}>
        <motion.div style={{ rotateX, scale, transformOrigin: "50% 100%" }}>
          <Pad kind={KIND[sel]} color={type.color} ratio={1.4} label={t.feel.types[sel].name} />
        </motion.div>
      </div>

      <Tabs value={sel} onValueChange={(v) => setSel(v as TypeId)} className="mt-10 items-center">
        <TabsList>
          {TYPES.map((x) => <TabsTrigger key={x.id} value={x.id}>{t.feel.types[x.id].name}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border bg-card p-6">
        <div>
          <h3 className="flex items-center gap-3 text-xl">
            {t.feel.types[sel].name}
            <Badge variant="outline">{t.feel.material[sel]}</Badge>
          </h3>
        </div>
        <p className="prose-101 mt-3 text-base">{t.feel.types[sel].blurb}</p>
      </motion.div>

      <p className="prose-101 mt-8 max-w-2xl text-base"><span className="text-primary">→</span> {t.feel.takeaway}</p>
    </Section>
  )
}
