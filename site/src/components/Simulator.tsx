import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useI18n } from "@/lib/i18n"

/* ---------- Escala e constantes (ver mousepad_simulacao_superficie.md) ---------- */
const W = 340, H = 230              // px ≈ 38 × 26 cm
const S = 9                          // px por cm
const G = (981 / 1e6) * S            // 9,81 m/s² em px/ms²
const MOUSE = { w: 22, h: 32 }
const RAMP = 250                     // ms da rampa de força da mão
const SLOWMO = 0.4                   // só a reprodução; nenhum número depende disto

type V = { x: number; y: number }
export type Gesture = "vertical" | "diagonal" | "flick"
export type TypeId = "control" | "balanced" | "speed" | "hybrid" | "glass"

export const TYPES: { id: TypeId; mus: number; muk: number; color: string; weave: "cloth" | "hybrid" | "glass" }[] = [
  { id: "control", mus: 0.38, muk: 0.30, color: "#1f2226", weave: "cloth" },
  { id: "balanced", mus: 0.30, muk: 0.24, color: "#22262e", weave: "cloth" },
  { id: "speed", mus: 0.22, muk: 0.18, color: "#262a33", weave: "cloth" },
  { id: "hybrid", mus: 0.26, muk: 0.21, color: "#2a2d33", weave: "hybrid" },
  { id: "glass", mus: 0.14, muk: 0.12, color: "#0f1216", weave: "glass" },
]

const GESTURES: Record<Gesture, { pts: V[]; v0: number }> = {
  vertical: { pts: [{ x: 0.5, y: 0.10 }, { x: 0.5, y: 0.55 }], v0: 0.7 },
  diagonal: { pts: [{ x: 0.08, y: 0.10 }, { x: 0.70, y: 0.65 }], v0: 1.0 },
  flick: { pts: [{ x: 0.25, y: 0.78 }, { x: 0.55, y: 0.05 }, { x: 0.5, y: 0.5 }], v0: 0.9 },
}

function path(pts: V[], t: number): V {
  if (pts.length === 2) {
    const [a, b] = pts
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
  }
  const [p0, p1, p2] = pts
  const u = 1 - t
  return { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y }
}
function endTangent(pts: V[]): V {
  if (pts.length === 2) return { x: pts[1].x - pts[0].x, y: pts[1].y - pts[0].y }
  return { x: 2 * (pts[2].x - pts[1].x), y: 2 * (pts[2].y - pts[1].y) }
}

type Plan = ReturnType<typeof plan>
function plan(type: (typeof TYPES)[number], gesture: Gesture, K: number) {
  const g = GESTURES[gesture]
  const pts = g.pts.map((p) => ({ x: p.x * W, y: p.y * H }))
  const v0 = g.v0 * 0.9                                   // m/s → px/ms
  const tan = endTangent(pts)
  const len = Math.hypot(tan.x, tan.y)
  const dir = { x: tan.x / len, y: tan.y / len }
  const T = (2 * len) / v0                                // windup com easing t²
  const tStick = type.mus * RAMP
  const a = type.muk * G * K
  const dStop = (v0 * v0) / (2 * a)
  const tStop = v0 / a
  const R = pts[pts.length - 1]
  const b = { xmin: MOUSE.w / 2, xmax: W - MOUSE.w / 2, ymin: MOUSE.h / 2, ymax: H - MOUSE.h / 2 }
  let dEdge = Infinity
  if (dir.x > 0) dEdge = Math.min(dEdge, (b.xmax - R.x) / dir.x)
  else if (dir.x < 0) dEdge = Math.min(dEdge, (b.xmin - R.x) / dir.x)
  if (dir.y > 0) dEdge = Math.min(dEdge, (b.ymax - R.y) / dir.y)
  else if (dir.y < 0) dEdge = Math.min(dEdge, (b.ymin - R.y) / dir.y)
  const beyond = dEdge < dStop
  const tEnd = beyond ? (v0 - Math.sqrt(Math.max(0, v0 * v0 - 2 * a * dEdge))) / a : tStop
  return { pts, v0, dir, T, tStick, a, dStop, dStopCm: dStop / S, tEnd, beyond, R, total: tStick + T + tEnd }
}

type Phase = "stick" | "windup" | "brake" | "done"
function stateAt(p: Plan, t: number): { pos: V; phase: Phase } {
  if (t < p.tStick) return { pos: p.pts[0], phase: "stick" }
  if (t < p.tStick + p.T) {
    const tau = (t - p.tStick) / p.T
    return { pos: path(p.pts, tau * tau), phase: "windup" }
  }
  const tb = Math.min(t - p.tStick - p.T, p.tEnd)
  const s = p.v0 * tb - 0.5 * p.a * tb * tb
  return { pos: { x: p.R.x + p.dir.x * s, y: p.R.y + p.dir.y * s }, phase: tb >= p.tEnd ? "done" : "brake" }
}

/* ---------- Desenho ---------- */
function makeBackground(type: (typeof TYPES)[number]) {
  const c = document.createElement("canvas")
  c.width = W; c.height = H
  const ctx = c.getContext("2d")!
  ctx.fillStyle = type.color
  ctx.fillRect(0, 0, W, H)
  if (type.weave !== "glass") {
    ctx.strokeStyle = "rgba(255,255,255,0.05)"
    ctx.lineWidth = 1
    const step = type.weave === "cloth" ? 4 : 6
    for (let i = -H; i < W + H; i += step) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(i, H); ctx.lineTo(i + H, 0); ctx.stroke()
    }
    ctx.setLineDash([4, 3])
    ctx.strokeStyle = "rgba(255,255,255,0.22)"
    ctx.strokeRect(6, 6, W - 12, H - 12)
    ctx.setLineDash([])
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, "rgba(255,255,255,0.16)")
    grad.addColorStop(0.45, "rgba(255,255,255,0.02)")
    grad.addColorStop(1, "rgba(0,0,0,0.25)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = "rgba(255,255,255,0.35)"
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
  }
  const light = ctx.createLinearGradient(0, 0, W, H)
  light.addColorStop(0, "rgba(255,255,255,0.07)")
  light.addColorStop(1, "rgba(0,0,0,0.18)")
  ctx.fillStyle = light
  ctx.fillRect(0, 0, W, H)
  return c
}

function draw(ctx: CanvasRenderingContext2D, bg: HTMLCanvasElement, p: Plan, t: number) {
  ctx.clearRect(0, 0, W, H)
  ctx.drawImage(bg, 0, 0)
  const { pos, phase } = stateAt(p, t)

  // trajeto do gesto, pontilhado
  ctx.strokeStyle = "rgba(255,255,255,0.18)"
  ctx.setLineDash([2, 5])
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= 40; i++) {
    const q = path(p.pts, i / 40)
    if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // rastro de frenagem
  if (phase === "brake" || phase === "done") {
    ctx.strokeStyle = "rgba(193, 140, 255, 0.95)"
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(p.R.x, p.R.y); ctx.lineTo(pos.x, pos.y); ctx.stroke()
    ctx.fillStyle = "rgba(193, 140, 255, 0.95)"
    ctx.beginPath(); ctx.arc(p.R.x, p.R.y, 3, 0, Math.PI * 2); ctx.fill()
  }

  // mouse
  const squash = phase === "stick" ? 1 - 0.06 * Math.min(1, t / Math.max(1, p.tStick)) : 1
  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.scale(1, squash)
  ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4
  ctx.fillStyle = "#d9d9de"
  roundRect(ctx, -MOUSE.w / 2, -MOUSE.h / 2, MOUSE.w, MOUSE.h, 9)
  ctx.fill()
  ctx.shadowColor = "transparent"
  ctx.fillStyle = "rgba(0,0,0,0.18)"
  ctx.fillRect(-MOUSE.w / 2 + 3, -MOUSE.h / 2 + 4, MOUSE.w - 6, 1.5)
  ctx.restore()
}
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/* ---------- Canvas do tipo selecionado ---------- */
function Lane({ type, gesture, K, runId, onDone }: { type: (typeof TYPES)[number]; gesture: Gesture; K: number; runId: number; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const bg = useMemo(() => makeBackground(type), [type])
  const p = useMemo(() => plan(type, gesture, K), [type, gesture, K])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = W * dpr; canvas.height = H * dpr
    const ctx = canvas.getContext("2d")!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (runId === 0) { draw(ctx, bg, p, 0); return }
    const start = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const elapsed = (now - start) * SLOWMO
      draw(ctx, bg, p, elapsed)
      if (elapsed >= p.total) { onDone(); return }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [runId, p, bg, onDone])

  return <canvas ref={ref} style={{ width: "100%", aspectRatio: `${W} / ${H}` }} className="rounded-md" />
}

export function Simulator() {
  const { t, locale } = useI18n()
  const [sel, setSel] = useState<TypeId>("control")
  const [gesture, setGesture] = useState<Gesture>("vertical")
  const [runId, setRunId] = useState(0)
  const [done, setDone] = useState(false)
  const K = 1
  const type = TYPES.find((x) => x.id === sel)!
  const fmt = (cm: number) => cm.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })
  const results = useMemo(() => Object.fromEntries(TYPES.map((x) => [x.id, plan(x, gesture, K)])) as Record<TypeId, Plan>, [gesture, K])
  const reset = () => { setRunId(0); setDone(false) }
  const onDone = useCallback(() => setDone(true), [])

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
        <Lane type={type} gesture={gesture} K={K} runId={runId} onDone={onDone} />
        <ul className="flex flex-col gap-1" role="tablist">
          {TYPES.map((x) => {
            const r = results[x.id]
            const active = sel === x.id
            return (
              <li key={x.id}>
                <button
                  role="tab" aria-selected={active}
                  onClick={() => { setSel(x.id); reset() }}
                  className={`flex w-full items-baseline justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <span>{t.feel.types[x.id].name}</span>
                  <span className={`font-mono text-xs tabular-nums ${done ? "text-primary" : "text-muted-foreground/40"}`}>{done ? `${fmt(r.dStopCm)}` : "—"}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t pt-5">
        <div>
          <div className="text-sm font-medium">{t.feel.types[sel].name} <span className="ml-2 rounded-md border px-1.5 py-px font-mono text-[11px] text-muted-foreground">{t.feel.material[sel]}</span></div>
          <div className="mt-2 text-xs text-muted-foreground">{t.feel.stoppingPower}</div>
          <div className={`font-mono text-3xl tabular-nums ${done ? "text-primary" : "text-muted-foreground/40"}`}>
            {done ? `${fmt(results[sel].dStopCm)} cm` : "— cm"}
            {done && results[sel].beyond && <span className="ml-2 font-sans text-xs text-muted-foreground">{t.feel.beyond}</span>}
          </div>
        </div>
        <Button size="lg" onClick={() => { setDone(false); setRunId((n) => n + 1) }}>{runId === 0 ? t.feel.release : t.feel.replay}</Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ToggleGroup value={[gesture]} onValueChange={(v) => { const g = v[0] as Gesture | undefined; if (g) { setGesture(g); reset() } }} variant="outline">
          {(Object.keys(GESTURES) as Gesture[]).map((g) => <ToggleGroupItem key={g} value={g}>{t.feel.gestures[g]}</ToggleGroupItem>)}
        </ToggleGroup>
      </div>
    </div>
  )
}
