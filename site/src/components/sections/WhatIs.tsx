import { useLayoutEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { Section } from "@/components/Section"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"

const LAYERS = [
  { cls: "pad pad-cloth pad-stitched", color: "#2a3040" },
  { cls: "rounded-md border border-white/10", color: "#9ca3ae" },
  { cls: "rounded-md border border-white/10", color: "#1a1c22" },
]

/**
 * Camada isométrica. Começa empilhada sobre o primeiro tópico (deslocada
 * -offset px, com um leve degrau pra parecer um pad fechado) e, conforme o
 * scroll avança, desce até a linha do seu próprio tópico.
 */
function Layer({ i, offset, progress }: { i: number; offset: number; progress: MotionValue<number> }) {
  const l = LAYERS[i]
  const y = useTransform(progress, [0, 1], [-offset, 0])
  return (
    <div data-layer className="relative hidden h-28 sm:block" style={{ zIndex: 3 - i }}>
      <motion.div
        className={`absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 ${l.cls}`}
        style={{ y, background: l.color, ["--pad-color" as string]: l.color, rotateX: 60, rotateZ: -35, boxShadow: "0 24px 30px -16px rgba(0,0,0,.9)" }}
      />
    </div>
  )
}

export function WhatIs() {
  const { t } = useI18n()
  const listRef = useRef<HTMLOListElement>(null)
  const [offsets, setOffsets] = useState([0, 0, 0])

  // distância de cada camada até a primeira, medida nos próprios contêineres das camadas
  useLayoutEffect(() => {
    const measure = () => {
      const els = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-layer]") ?? [])
      const tops = els.map((el) => el.getBoundingClientRect().top)
      if (tops.length) setOffsets(tops.map((top) => top - tops[0]))
    }
    measure()
    const t1 = setTimeout(measure, 300)
    document.fonts?.ready.then(measure)
    window.addEventListener("resize", measure)
    return () => { clearTimeout(t1); window.removeEventListener("resize", measure) }
  }, [t])

  // 0 = lista entrando na tela (pilha fechada) → 1 = lista no meio (camadas nos tópicos)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "start 20%"] })

  return (
    <Section id="what" eyebrow={t.what.eyebrow} title={t.what.title} lede={t.what.lede}>
      <ol ref={listRef} className="flex flex-col gap-12">
        {t.what.layers.map((l, i) => (
          <li key={l.name} className="relative grid items-center gap-8 sm:grid-cols-[13rem_1fr]" style={{ zIndex: 3 - i }}>
            <Layer i={i} offset={offsets[i]} progress={scrollYProgress} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h3 className="flex items-center gap-3 text-lg font-medium">{l.name} <Badge variant="outline">{l.tag}</Badge></h3>
              <p className="prose-101 mt-2 text-base">{l.desc}</p>
            </motion.div>
          </li>
        ))}
        <li className="border-t pt-8 sm:ml-[15rem]">
          <h3 className="text-lg font-medium">{t.what.edgeTitle}</h3>
          <p className="prose-101 mt-2 text-base">{t.what.edge}</p>
        </li>
      </ol>
    </Section>
  )
}
