import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { Section } from "@/components/Section"
import { useI18n } from "@/lib/i18n"

const LAYERS = [
  { cls: "pad pad-cloth pad-stitched", color: "#2a3040" },
  { cls: "rounded-md border border-white/10", color: "#4a5160" },
  { cls: "rounded-md border border-white/10", color: "#1a1c22" },
]

/** Uma camada isométrica que se afasta das outras conforme o scroll avança. */
function Layer({ i, spread }: { i: number; spread: MotionValue<number> }) {
  const l = LAYERS[i]
  const y = useTransform(spread, (s) => (i - 1) * 46 * s)
  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 ${l.cls}`}
      style={{
        y,
        background: l.color,
        ["--pad-color" as string]: l.color,
        rotateX: 60,
        rotateZ: -35,
        boxShadow: "0 24px 30px -16px rgba(0,0,0,.9)",
        zIndex: 3 - i,
      }}
    />
  )
}

export function WhatIs() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 30%"] })
  const spread = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <Section id="what" eyebrow={t.what.eyebrow} title={t.what.title} lede={t.what.lede}>
      <div ref={ref} className="grid gap-10 sm:grid-cols-[13rem_1fr]">
        <div className="sticky top-28 hidden h-64 self-start sm:block" style={{ perspective: "900px" }}>
          {LAYERS.map((_, i) => <Layer key={i} i={i} spread={spread} />)}
        </div>
        <ol className="flex flex-col gap-10">
          {t.what.layers.map((l, i) => (
            <motion.li
              key={l.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-mono text-sm text-primary">0{i + 1}</div>
              <h3 className="mt-1 text-lg font-medium">{l.name} <span className="ml-2 text-xs font-normal text-muted-foreground">{l.tag}</span></h3>
              <p className="prose-101 mt-2 text-[15px]">{l.desc}</p>
            </motion.li>
          ))}
          <li className="border-t pt-8">
            <h3 className="text-lg font-medium">{t.what.edgeTitle}</h3>
            <p className="prose-101 mt-2 text-[15px]">{t.what.edge}</p>
          </li>
        </ol>
      </div>
    </Section>
  )
}
