import { Section, Reveal } from "@/components/Section"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n"

/** Camadas explodidas em CSS 3D: superfície, núcleo, base. */
function Exploded({ names }: { names: string[] }) {
  const layers = [
    { cls: "pad pad-cloth pad-stitched", color: "#2a3040", z: 2 },
    { cls: "rounded-md border border-white/10", color: "#4a5160", z: 1 },
    { cls: "rounded-md border border-white/10", color: "#1a1c22", z: 0 },
  ]
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-sm" style={{ perspective: "900px" }}>
      {layers.map((l, i) => (
        <div key={i} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <div
            className={`absolute inset-x-8 top-1/2 h-[46%] ${l.cls}`}
            style={{
              background: l.color,
              ["--pad-color" as string]: l.color,
              transform: `translateY(-50%) rotateX(58deg) rotateZ(-28deg) translateZ(${l.z * 52}px)`,
              boxShadow: "0 24px 30px -16px rgba(0,0,0,.9)",
            }}
          />
          <span
            className="absolute left-[72%] font-mono text-[11px] text-muted-foreground"
            style={{ top: `${18 + i * 30}%` }}
          >
            <span className="mr-2 inline-block h-px w-6 bg-primary/60 align-middle" />0{i + 1} {names[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

export function WhatIs() {
  const { t } = useI18n()
  return (
    <Section id="what" eyebrow={t.what.eyebrow} title={t.what.title} lede={t.what.lede}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <Reveal><Exploded names={t.what.layers.map((l) => l.name)} /></Reveal>
        <ol className="flex flex-col divide-y">
          {t.what.layers.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.08}>
              <li className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr]">
                <span className="font-mono text-sm text-primary">0{i + 1}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium">{l.name}</h3>
                    <Badge variant="outline">{l.tag}</Badge>
                  </div>
                  <p className="prose-101 mt-2 text-[15px]">{l.desc}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
      <Reveal className="mt-10 rounded-lg border bg-card p-6 sm:p-8">
        <h3 className="text-lg font-medium">{t.what.edgeTitle}</h3>
        <p className="prose-101 mt-2 max-w-3xl">{t.what.edge}</p>
      </Reveal>
    </Section>
  )
}
