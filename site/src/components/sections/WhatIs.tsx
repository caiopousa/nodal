import { motion } from "motion/react"
import { Section } from "@/components/Section"
import { useI18n } from "@/lib/i18n"

const LAYERS = [
  { cls: "pad pad-cloth pad-stitched", color: "#2a3040" },
  { cls: "rounded-md border border-white/10", color: "#4a5160" },
  { cls: "rounded-md border border-white/10", color: "#1a1c22" },
]

/** Camada isométrica que sai da pilha (no primeiro tópico) e assenta ao lado do seu tópico. */
function Layer({ i }: { i: number }) {
  const l = LAYERS[i]
  return (
    <div className="relative hidden h-28 sm:block" style={{ perspective: "900px" }}>
      <motion.div
        className={`absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 ${l.cls}`}
        style={{ background: l.color, ["--pad-color" as string]: l.color, rotateX: 60, rotateZ: -35, boxShadow: "0 24px 30px -16px rgba(0,0,0,.9)" }}
        initial={{ y: -i * 150 + i * 14, opacity: 0.6 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  )
}

export function WhatIs() {
  const { t } = useI18n()
  return (
    <Section id="what" eyebrow={t.what.eyebrow} title={t.what.title} lede={t.what.lede}>
      <ol className="flex flex-col gap-12">
        {t.what.layers.map((l, i) => (
          <li key={l.name} className="grid items-center gap-8 sm:grid-cols-[13rem_1fr]">
            <Layer i={i} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="font-mono text-sm text-primary">0{i + 1}</div>
              <h3 className="mt-1 text-lg font-medium">{l.name} <span className="ml-2 text-xs font-normal text-muted-foreground">{l.tag}</span></h3>
              <p className="prose-101 mt-2 text-[15px]">{l.desc}</p>
            </motion.div>
          </li>
        ))}
        <li className="border-t pt-8 sm:ml-[15rem]">
          <h3 className="text-lg font-medium">{t.what.edgeTitle}</h3>
          <p className="prose-101 mt-2 text-[15px]">{t.what.edge}</p>
        </li>
      </ol>
    </Section>
  )
}
