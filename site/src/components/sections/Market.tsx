import { Section, Reveal } from "@/components/Section"
import { catalog, count, SPEED_ORDER } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"

type Row = { label: string; n: number }

function Bars({ title, rows, total }: { title: string; rows: Row[]; total: number }) {
  const max = Math.max(...rows.map((r) => r.n))
  return (
    <div className="rounded-lg border bg-card p-5 sm:p-6">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="truncate text-muted-foreground">{r.label}</span>
            <span className="h-2 rounded-full bg-muted"><span className="bar block" style={{ width: `${(r.n / max) * 100}%` }} /></span>
            <span className="text-right font-mono text-xs tabular-nums">{Math.round((r.n / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const total = catalog.length
const surface = count("surface", (v) => {
  if (!v) return null
  if (v === "Cloth" || v === "Polyester") return v
  if (v.includes("Glass") && !v.includes("cloth")) return "Glass"
  if (v === "Hybrid" || v.includes("coated")) return "Hybrid"
  return "Other"
})
const speed = SPEED_ORDER.map((label) => ({ label, n: catalog.filter((m) => m.speed === label).length }))
const thickness = count("thickness", (v) => (v === null ? null : `${v} mm`)).slice(0, 6)
const edges = count("edges")
const base = count("base").slice(0, 6)

export function Market() {
  const { t } = useI18n()
  return (
    <Section id="market" eyebrow={t.market.eyebrow} title={t.market.title} lede={t.market.lede}>
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal><Bars title={t.market.surface} rows={surface} total={total} /></Reveal>
        <Reveal delay={0.05}><Bars title={t.market.speed} rows={speed} total={total} /></Reveal>
        <Reveal delay={0.1}><Bars title={t.market.thickness} rows={thickness} total={total} /></Reveal>
        <Reveal delay={0.15}><Bars title={t.market.base} rows={base} total={total} /></Reveal>
        <Reveal delay={0.2} className="md:col-span-2">
          <div className="grid gap-5 rounded-lg border bg-card p-5 sm:grid-cols-[1fr_2fr] sm:p-6">
            <div>
              <h3 className="text-sm font-medium">{t.market.edges}</h3>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full">
                {edges.map((e, i) => (
                  <span key={e.label} className="h-full" style={{ width: `${(e.n / total) * 100}%`, background: `var(--chart-${i + 1})` }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {edges.map((e, i) => (
                  <li key={e.label} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: `var(--chart-${i + 1})` }} />
                    {e.label} {Math.round((e.n / total) * 100)}%
                  </li>
                ))}
              </ul>
            </div>
            <p className="self-end text-xs text-muted-foreground">{t.market.source}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
