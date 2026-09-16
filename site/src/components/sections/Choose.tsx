import { Section, Reveal } from "@/components/Section"
import { Pad } from "@/components/Pad"
import { useI18n } from "@/lib/i18n"

/** Miniaturas por critério, todas construídas com o pad procedural. */
function Visual({ k }: { k: string }) {
  switch (k) {
    case "feel":
      return (
        <div className="flex items-end gap-3">
          <Pad kind="cloth" color="#3a2226" label="Control" className="w-24" />
          <Pad kind="cloth" color="#1e3a2f" label="Speed" className="w-24" />
        </div>
      )
    case "material":
      return (
        <div className="flex items-end gap-3">
          <Pad kind="cloth" label="Cloth" className="w-24" />
          <Pad kind="glass" label="Glass" className="w-24" />
        </div>
      )
    case "size":
      return (
        <div className="flex items-end gap-2">
          <Pad kind="cloth" label="M" className="w-12" ratio={1.15} />
          <Pad kind="cloth" label="L" className="w-16" ratio={1.15} />
          <Pad kind="cloth" label="XL" className="w-28" ratio={2.1} />
        </div>
      )
    case "thickness":
      return (
        <div className="flex items-end gap-4">
          {[2, 3, 4, 6].map((mm) => (
            <div key={mm} className="flex flex-col items-center gap-1">
              <div className="w-10 rounded-sm bg-gradient-to-b from-[#3a3f4a] to-[#141518]" style={{ height: mm * 5 }} />
              <span className="text-[10px] text-muted-foreground">{mm} mm</span>
            </div>
          ))}
        </div>
      )
    case "base":
      return (
        <div className="relative w-28" style={{ perspective: "600px" }}>
          <div className="h-3 rounded-sm bg-[#141518]" style={{ transform: "rotateX(55deg) translateY(28px)" }} />
          <Pad kind="cloth" className="w-28" style={{ transform: "rotateX(55deg)" }} />
        </div>
      )
    default:
      return (
        <div className="flex items-end gap-3">
          <Pad kind="cloth" label="Stitched" className="w-24" />
          <Pad kind="cloth" stitched={false} label="Flat" className="w-24" />
        </div>
      )
  }
}

export function Choose() {
  const { t } = useI18n()
  return (
    <Section id="choose" eyebrow={t.choose.eyebrow} title={t.choose.title} lede={t.choose.lede}>
      <ol className="grid gap-5 md:grid-cols-2">
        {t.choose.items.map((it, i) => (
          <Reveal key={it.key} delay={(i % 2) * 0.08}>
            <li className="flex h-full flex-col rounded-lg border bg-card p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-sm text-primary">0{i + 1}</span>
                  <h3 className="mt-1 text-xl font-medium">{it.title}</h3>
                </div>
                <div className="shrink-0 pt-1"><Visual k={it.key} /></div>
              </div>
              <p className="prose-101 mt-4 text-[15px]">{it.body}</p>
              <p className="mt-auto pt-5 text-sm text-foreground"><span className="text-primary">→</span> {it.tip}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
