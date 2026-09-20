import type { ReactNode } from "react"
import { Section, Reveal } from "@/components/Section"
import { Badge } from "@/components/ui/badge"
import { catalog, count, SPEED_ORDER } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"

/* ---------- Dados (tudo sai do catálogo) ---------- */
const TOTAL = catalog.length
const pct = (n: number) => Math.round((n / TOTAL) * 100)

type Row = { label: string; n: number; other?: boolean }

// superfície: categorias sem ordem natural → ranking, "Outros" sempre por último
const surfaceRows = (other: string): Row[] => {
  const rows = count("surface", (v) => {
    if (!v) return null
    if (v === "Cloth" || v === "Polyester") return v
    if (v.includes("Glass") && !v.includes("cloth")) return "Glass"
    if (v === "Hybrid" || v.includes("coated")) return "Hybrid"
    return "__other"
  })
  const main = rows.filter((r) => r.label !== "__other")
  const rest = rows.find((r) => r.label === "__other")
  return [...main, ...(rest ? [{ label: other, n: rest.n, other: true }] : [])]
}

// base: cinco maiores + a cauda somada em "Outros", pra fechar 100%
const baseRows = (other: string): Row[] => {
  const rows = count("base")
  const top = rows.slice(0, 5)
  const rest = rows.slice(5).reduce((s, r) => s + r.n, 0)
  return [...top, ...(rest ? [{ label: other, n: rest, other: true }] : [])]
}

// speed: escala ordenada; lado control, Balanced no meio, lado speed
const SPEED = SPEED_ORDER.map((label) => ({ label, n: catalog.filter((m) => m.speed === label).length }))
const MID = SPEED_ORDER.indexOf("Balanced")
const side = (i: number) => (i < MID ? "cool" : i > MID ? "warm" : "neutral")
const SPEED_SPLIT = {
  cool: SPEED.slice(0, MID).reduce((s, r) => s + r.n, 0),
  neutral: SPEED[MID].n,
  warm: SPEED.slice(MID + 1).reduce((s, r) => s + r.n, 0),
}

// espessura: é número, então faixas em mm na ordem do eixo
const THICK_BINS: { test: (mm: number) => boolean; lo: number | null; hi: number | null }[] = [
  { test: (mm) => mm < 3, lo: null, hi: 2.9 },
  { test: (mm) => mm === 3, lo: 3, hi: 3 },
  { test: (mm) => mm > 3 && mm < 4, lo: 3.1, hi: 3.9 },
  { test: (mm) => mm === 4, lo: 4, hi: 4 },
  { test: (mm) => mm > 4 && mm < 6, lo: 4.1, hi: 5.9 },
  { test: (mm) => mm >= 6, lo: 6, hi: null },
]
const THICK = THICK_BINS.map((b) => catalog.filter((m) => m.thickness !== null && b.test(m.thickness)).length)
const PEAK = THICK.indexOf(Math.max(...THICK))

const EDGES = count("edges")
const STITCHED = EDGES.find((e) => e.label === "Stitched")?.n ?? 0

/* ---------- Peças ---------- */
const SERIES = {
  primary: "var(--primary)",
  cool: "var(--chart-cool)",
  warm: "var(--chart-warm)",
  neutral: "var(--chart-neutral)",
}

/** Contagem absoluta de modelos, sempre no mesmo formato. */
function Count({ n }: { n: number }) {
  return <Badge variant="secondary" className="font-mono tabular-nums">{n}</Badge>
}

function Card({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`h-full rounded-lg border bg-card p-5 sm:p-6 ${className}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}

/** Coluna com tooltip no hover; a área de acerto é a coluna inteira, não só a barra. */
function Column({ n, max, color, tip }: { n: number; max: number; color: string; tip: string }) {
  return (
    <div className="group relative flex h-full flex-1 flex-col justify-end" title={tip}>
      <span className="flex justify-center"><Count n={n} /></span>
      <div className="mt-1 w-full rounded-t-[4px] transition-opacity group-hover:opacity-80" style={{ height: `${Math.max(2, (n / max) * 100)}%`, background: color }} />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
        {tip}
      </span>
    </div>
  )
}

function Ranked({ rows, models }: { rows: Row[]; models: string }) {
  const max = Math.max(...rows.map((r) => r.n))
  return (
    <ul className="flex flex-col gap-2" role="img" aria-label={rows.map((r) => `${r.label} ${pct(r.n)}%`).join(", ")}>
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[6rem_1fr_auto_2.5rem] items-center gap-2 text-sm" title={`${r.label}: ${r.n} ${models}`}>
          <span className="truncate text-muted-foreground">{r.label}</span>
          <span className="h-2 rounded-full bg-muted">
            <span className="block h-2 rounded-full" style={{ width: `${(r.n / max) * 100}%`, background: r.other ? SERIES.neutral : SERIES.primary }} />
          </span>
          <Count n={r.n} />
          <span className="text-right font-mono text-xs tabular-nums">{pct(r.n)}%</span>
        </li>
      ))}
    </ul>
  )
}

/** Legenda: cor, rótulo, contagem em modelos e a fatia em porcentagem. */
function Swatch({ color, label, n }: { color: string; label: string; n: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-2 rounded-[2px]" style={{ background: color }} aria-hidden />
      {label}
      <Count n={n} />
      <span className="font-mono tabular-nums text-foreground">{pct(n)}%</span>
    </span>
  )
}

/* ---------- Seção ---------- */
export function Market() {
  const { t, locale } = useI18n()
  const m = t.market
  const num = (v: number) => v.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 1 })
  const binLabel = (b: (typeof THICK_BINS)[number]) =>
    b.lo === null ? `≤${num(b.hi!)}` : b.hi === null ? `≥${num(b.lo)}` : b.lo === b.hi ? num(b.lo) : `${num(b.lo)}–${num(b.hi)}`
  const speedMax = Math.max(...SPEED.map((r) => r.n))
  const thickMax = Math.max(...THICK)

  return (
    <Section id="market" eyebrow={m.eyebrow} title={m.title} lede={m.lede}>
      <div className="grid gap-5 md:grid-cols-2">
        {/* Speed: escala ordenada → colunas na ordem + barra divergente centrada em Balanced */}
        <Reveal className="md:col-span-2">
          <Card title={m.speed}>
            <div className="flex h-32 items-end gap-1" role="img" aria-label={SPEED.map((r) => `${r.label} ${pct(r.n)}%`).join(", ")}>
              {SPEED.map((r, i) => (
                <Column key={r.label} n={r.n} max={speedMax} color={SERIES[side(i)]} tip={`${r.label}: ${r.n} ${m.models} · ${pct(r.n)}%`} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{m.slower}</span><span>Balanced</span><span>{m.faster}</span>
            </div>
            <div className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={`${m.controlSide} ${pct(SPEED_SPLIT.cool)}%, Balanced ${pct(SPEED_SPLIT.neutral)}%, ${m.speedSide} ${pct(SPEED_SPLIT.warm)}%`}>
              <span style={{ width: `${(SPEED_SPLIT.cool / TOTAL) * 100}%`, background: SERIES.cool }} />
              <span style={{ width: `${(SPEED_SPLIT.neutral / TOTAL) * 100}%`, background: SERIES.neutral }} />
              <span style={{ width: `${(SPEED_SPLIT.warm / TOTAL) * 100}%`, background: SERIES.warm }} />
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <Swatch color={SERIES.cool} label={m.controlSide} n={SPEED_SPLIT.cool} />
              <Swatch color={SERIES.neutral} label="Balanced" n={SPEED_SPLIT.neutral} />
              <Swatch color={SERIES.warm} label={m.speedSide} n={SPEED_SPLIT.warm} />
            </div>
          </Card>
        </Reveal>

        {/* Espessura: número em destaque + colunas num eixo em mm, pico no acento */}
        <Reveal delay={0.05}>
          <Card title={m.thickness}>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl tabular-nums">{pct(THICK[PEAK])}%</span>
              <span className="text-sm text-muted-foreground">{m.thicknessHero.replace("{mm}", binLabel(THICK_BINS[PEAK]))}</span>
            </div>
            <div className="mt-4 flex h-24 items-end gap-2" role="img" aria-label={THICK_BINS.map((b, i) => `${binLabel(b)} mm ${pct(THICK[i])}%`).join(", ")}>
              {THICK.map((n, i) => (
                <Column key={i} n={n} max={thickMax} color={i === PEAK ? SERIES.primary : SERIES.neutral} tip={`${binLabel(THICK_BINS[i])} mm: ${n} ${m.models} · ${pct(n)}%`} />
              ))}
            </div>
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              {THICK_BINS.map((b, i) => <span key={i} className="flex-1 text-center tabular-nums">{binLabel(b)}</span>)}
            </div>
            <p className="mt-1 text-right text-xs text-muted-foreground">mm</p>
          </Card>
        </Reveal>

        {/* Bordas: uma proporção dominante → número + medidor */}
        <Reveal delay={0.1}>
          <Card title={m.edges}>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl tabular-nums">{Math.round((STITCHED / TOTAL) * 10)} {m.outOf10}</span>
              <span className="text-sm text-muted-foreground">{m.edgesHero}</span>
            </div>
            <div className="mt-6 flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={EDGES.map((e) => `${e.label} ${pct(e.n)}%`).join(", ")}>
              <span style={{ width: `${(STITCHED / TOTAL) * 100}%`, background: SERIES.primary }} />
              <span className="flex-1" style={{ background: SERIES.neutral }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {EDGES.map((e) => (
                <Swatch key={e.label} color={e.label === "Stitched" ? SERIES.primary : SERIES.neutral} label={e.label} n={e.n} />
              ))}
            </div>
          </Card>
        </Reveal>

        {/* Superfície e base: categorias sem ordem → barras ordenadas, uma cor */}
        <Reveal delay={0.15}>
          <Card title={m.surface}><Ranked rows={surfaceRows(m.other)} models={m.models} /></Card>
        </Reveal>
        <Reveal delay={0.2}>
          <Card title={m.base}><Ranked rows={baseRows(m.other)} models={m.models} /></Card>
        </Reveal>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {m.source.intro}
        <a href="https://www.eloshapes.com/mousepads/browse" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">EloShapes</a>
        {m.source.mid}
        <a href="https://prosettings.net/gear/lists/mousepads/" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">ProSettings</a>
        {m.source.outro}
      </p>
    </Section>
  )
}
