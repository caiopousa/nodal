import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/lib/i18n"

/* ---------- Escala e constantes (ver mousepad_simulacao_superficie.md) ---------- */
const W = 340, H = 230              // px ≈ 38 × 26 cm
const S = 9                          // px por cm
const G = (981 / 1e6) * S            // 9,81 m/s² em px/ms²
const MOUSE = { w: 26, h: 46 }       // proporção do GPRO Superlight (63,5 × 125 mm ≈ 0,51)
const RAMP = 250                     // ms da rampa de força da mão
const PAD = 8                        // folga entre o mouse e a borda da caixa
const SLOWMO = 0.4                   // só a reprodução; nenhum número depende disto

type V = { x: number; y: number }
export type Gesture = "vertical" | "diagonal" | "flick" | "custom"
/** Soltura medida do arrasto do usuário: ponto, direção unitária, velocidade em px/ms. */
export type Custom = { R: V; dir: V; v0: number }
export type TypeId = "control" | "balanced" | "speed" | "hybrid" | "glass"

export const TYPES: { id: TypeId; mus: number; muk: number; color: string; weave: "cloth" | "hybrid" | "glass" }[] = [
  { id: "control", mus: 0.38, muk: 0.30, color: "#1f2226", weave: "cloth" },
  { id: "balanced", mus: 0.30, muk: 0.24, color: "#22262e", weave: "cloth" },
  { id: "speed", mus: 0.22, muk: 0.18, color: "#262a33", weave: "cloth" },
  { id: "hybrid", mus: 0.26, muk: 0.21, color: "#2a2d33", weave: "hybrid" },
  { id: "glass", mus: 0.14, muk: 0.12, color: "#0f1216", weave: "glass" },
]


const GESTURES: Record<Exclude<Gesture, "custom">, { pts: V[]; v0: number }> = {
  // soltura perto do meio da caixa, pra sobrar espaço de frenagem visível
  vertical: { pts: [{ x: 0.5, y: 0.14 }, { x: 0.5, y: 0.42 }], v0: 0.7 },
  diagonal: { pts: [{ x: 0.10, y: 0.14 }, { x: 0.50, y: 0.46 }], v0: 1.0 },
  flick: { pts: [{ x: 0.25, y: 0.78 }, { x: 0.55, y: 0.05 }, { x: 0.5, y: 0.40 }], v0: 0.9 },
}

function path(pts: V[], t: number): V {
  if (pts.length === 1) return pts[0]
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
function plan(type: (typeof TYPES)[number], gesture: Gesture, K: number, custom?: Custom | null) {
  let pts: V[], v0: number, dir: V, T: number, tStick: number
  if (gesture === "custom") {
    // sem windup nem descolamento: a mão do usuário já fez os dois
    const c = custom ?? { R: { x: W / 2, y: H / 2 }, dir: { x: 0, y: 1 }, v0: 0.001 }
    pts = [c.R]; v0 = c.v0; dir = c.dir; T = 0; tStick = 0
  } else {
    const g = GESTURES[gesture]
    pts = g.pts.map((p) => ({ x: p.x * W, y: p.y * H }))
    v0 = g.v0 * 0.9                                       // m/s → px/ms
    const tan = endTangent(pts)
    const len = Math.hypot(tan.x, tan.y)
    dir = { x: tan.x / len, y: tan.y / len }
    T = (2 * len) / v0                                    // windup com easing t²
    tStick = type.mus * RAMP
  }
  const a = type.muk * G * K
  const dStop = (v0 * v0) / (2 * a)
  const tStop = v0 / a
  const R = pts[pts.length - 1]
  const b = { xmin: MOUSE.w / 2 + PAD, xmax: W - MOUSE.w / 2 - PAD, ymin: MOUSE.h / 2 + PAD, ymax: H - MOUSE.h / 2 - PAD }
  let dEdge = Infinity
  if (dir.x > 0) dEdge = Math.min(dEdge, (b.xmax - R.x) / dir.x)
  else if (dir.x < 0) dEdge = Math.min(dEdge, (b.xmin - R.x) / dir.x)
  if (dir.y > 0) dEdge = Math.min(dEdge, (b.ymax - R.y) / dir.y)
  else if (dir.y < 0) dEdge = Math.min(dEdge, (b.ymin - R.y) / dir.y)
  const beyond = dEdge < dStop
  const tEnd = beyond ? (v0 - Math.sqrt(Math.max(0, v0 * v0 - 2 * a * dEdge))) / a : tStop
  return { pts, v0, dir, T, tStick, a, dStop, dStopCm: dStop / S, tStop, tEnd, beyond, R, total: tStick + T + tEnd }
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
function makeBackground(type: (typeof TYPES)[number], label: string) {
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
  // nome do tipo no canto inferior direito, como no pad das outras seções
  ctx.font = "500 9px Inter, ui-sans-serif, system-ui, sans-serif"
  ctx.letterSpacing = "1px"
  ctx.textAlign = "right"; ctx.textBaseline = "alphabetic"
  ctx.fillStyle = "rgba(255,255,255,0.55)"
  ctx.fillText(label.toUpperCase(), W - 16, H - 14)
  return c
}

function draw(ctx: CanvasRenderingContext2D, bg: HTMLCanvasElement, p: Plan, t: number, override?: V) {
  ctx.clearRect(0, 0, W, H)
  ctx.drawImage(bg, 0, 0)
  const st = override ? { pos: override, phase: "drag" as const } : stateAt(p, t)
  const { pos, phase } = st

  // trajeto do gesto, pontilhado
  if (p.pts.length > 1) {
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
  }

  // rastro de frenagem
  if (phase === "brake" || phase === "done") {
    ctx.strokeStyle = "rgba(162, 89, 255, 0.95)"
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(p.R.x, p.R.y); ctx.lineTo(pos.x, pos.y); ctx.stroke()
    ctx.fillStyle = "rgba(162, 89, 255, 0.95)"
    ctx.beginPath(); ctx.arc(p.R.x, p.R.y, 3, 0, Math.PI * 2); ctx.fill()
  }

  // mouse
  const squash = phase === "stick" ? 1 - 0.06 * Math.min(1, t / Math.max(1, p.tStick)) : 1
  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.scale(1, squash)
  ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4
  ctx.fillStyle = "#ececef"
  mouseShape(ctx)
  ctx.fill()
  ctx.shadowColor = "transparent"
  ctx.save(); mouseShape(ctx); ctx.clip()
  const w = MOUSE.w, h = MOUSE.h
  // sombra suave no lombo, pra dar volume
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0)
  g.addColorStop(0, "rgba(0,0,0,0.10)"); g.addColorStop(0.5, "rgba(255,255,255,0.10)"); g.addColorStop(1, "rgba(0,0,0,0.12)")
  ctx.fillStyle = g; ctx.fillRect(-w, -h, w * 2, h * 2)
  // linhas dos botões: divisão central e recorte inferior côncavo
  ctx.strokeStyle = "rgba(0,0,0,0.28)"; ctx.lineWidth = 0.8
  ctx.beginPath(); ctx.moveTo(0, -h * 0.52); ctx.lineTo(0, -h * 0.08); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(-w * 0.46, -h * 0.10); ctx.quadraticCurveTo(0, -h * 0.05, w * 0.46, -h * 0.10); ctx.stroke()
  // roda alongada
  ctx.fillStyle = "rgba(0,0,0,0.55)"
  roundRect(ctx, -w * 0.08, -h * 0.40, w * 0.16, h * 0.18, w * 0.08); ctx.fill()
  // ponto de status
  ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(0, h * 0.02, 0.7, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  // botões laterais (lado esquerdo), fora do clip
  ctx.fillStyle = "rgba(0,0,0,0.18)"
  roundRect(ctx, -w * 0.5 - 0.8, -h * 0.06, 1.4, h * 0.09, 0.7); ctx.fill()
  roundRect(ctx, -w * 0.5 - 0.8, h * 0.05, 1.4, h * 0.09, 0.7); ctx.fill()
  ctx.restore()
}
/**
 * Vista de cima do GPRO Superlight: frente quase reta, ombros logo abaixo,
 * cintura suave, lombo largo perto da traseira e traseira arredondada.
 * Coordenadas normalizadas: x em [-0.5, 0.5]·w, y em [-0.5, 0.5]·h (topo negativo).
 */
function mouseShape(ctx: CanvasRenderingContext2D) {
  const w = MOUSE.w, h = MOUSE.h
  const P = (x: number, y: number): [number, number] => [x * w, y * h]
  ctx.beginPath()
  ctx.moveTo(...P(-0.34, -0.46))
  ctx.bezierCurveTo(...P(-0.18, -0.54), ...P(0.18, -0.54), ...P(0.34, -0.46))     // frente, convexa
  ctx.bezierCurveTo(...P(0.46, -0.40), ...P(0.50, -0.32), ...P(0.49, -0.22))      // ombro direito, mais largo
  ctx.bezierCurveTo(...P(0.475, -0.10), ...P(0.46, -0.02), ...P(0.46, 0.10))      // cintura
  // lombo + traseira: um semicírculo de raio = meia largura, tangente às laterais
  const r = 0.48 * w
  const yc = 0.5 * h - r
  ctx.bezierCurveTo(...P(0.475, 0.16), ...P(0.48, yc / h - 0.04), r, yc)          // lateral chega tangente ao arco
  ctx.arc(0, yc, r, 0, Math.PI)                                                    // traseira circular
  ctx.bezierCurveTo(...P(-0.48, yc / h - 0.04), ...P(-0.475, 0.16), ...P(-0.46, 0.10))
  ctx.bezierCurveTo(...P(-0.46, -0.02), ...P(-0.475, -0.10), ...P(-0.49, -0.22))
  ctx.bezierCurveTo(...P(-0.50, -0.32), ...P(-0.46, -0.40), ...P(-0.34, -0.46))
  ctx.closePath()
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
type LaneProps = {
  type: (typeof TYPES)[number]; gesture: Gesture; K: number; runId: number; custom: Custom | null
  onDone: () => void; onDragStart: () => void; onDragEnd: (c: Custom) => void
}
function Lane({ type, gesture, K, runId, custom, onDone, onDragStart, onDragEnd }: LaneProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { t } = useI18n()
  const bg = useMemo(() => makeBackground(type, t.feel.types[type.id].name), [type, t])
  const p = useMemo(() => plan(type, gesture, K, custom), [type, gesture, K, custom])
  const drag = useRef<{ samples: { x: number; y: number; t: number }[] } | null>(null)

  const getCtx = () => {
    const canvas = ref.current!
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (canvas.width !== W * dpr) { canvas.width = W * dpr; canvas.height = H * dpr }
    const ctx = canvas.getContext("2d")!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return ctx
  }

  useEffect(() => {
    if (!ref.current) return
    const ctx = getCtx()
    if (runId === 0 || drag.current) { draw(ctx, bg, p, 0); return }
    const start = performance.now()
    let raf = 0
    const loop = (now: number) => {
      if (drag.current) return
      const elapsed = (now - start) * SLOWMO
      draw(ctx, bg, p, elapsed)
      if (elapsed >= p.total) { onDone(); return }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [runId, p, bg, onDone])

  // posição do ponteiro em coordenadas do canvas, presa dentro da caixa
  const toCanvas = (e: React.PointerEvent<HTMLCanvasElement>): V => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    return { x: Math.max(MOUSE.w / 2 + PAD, Math.min(W - MOUSE.w / 2 - PAD, x)), y: Math.max(MOUSE.h / 2 + PAD, Math.min(H - MOUSE.h / 2 - PAD, y)) }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const pos = toCanvas(e)
    drag.current = { samples: [{ ...pos, t: performance.now() }] }
    onDragStart()
    draw(getCtx(), bg, p, 0, pos)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return
    const pos = toCanvas(e)
    const now = performance.now()
    const samples = drag.current.samples
    samples.push({ ...pos, t: now })
    while (samples.length > 2 && now - samples[0].t > 90) samples.shift()   // janela curta: só o fim do gesto conta
    draw(getCtx(), bg, p, 0, pos)
  }
  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return
    const samples = drag.current.samples
    drag.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    const a = samples[0], b = samples[samples.length - 1]
    const dt = Math.max(1, b.t - a.t)
    const vx = (b.x - a.x) / dt, vy = (b.y - a.y) / dt
    const speed = Math.hypot(vx, vy)
    if (speed < 0.05) { draw(getCtx(), bg, p, 0, { x: b.x, y: b.y }); return }   // soltou parado: nada a frear
    const v0 = Math.min(speed, 3.0 * 0.9)                                        // teto de 3 m/s
    onDragEnd({ R: { x: b.x, y: b.y }, dir: { x: vx / speed, y: vy / speed }, v0 })
  }

  return (
    <canvas
      ref={ref}
      style={{ width: "100%", aspectRatio: `${W} / ${H}`, touchAction: "none" }}
      className="cursor-grab rounded-md active:cursor-grabbing"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
    />
  )
}

/* ---------- Raias: uma por tipo, mesma escala, todas ao mesmo tempo ---------- */
type RaceProps = { gesture: Gesture; K: number; custom: Custom | null; runId: number; sel: TypeId; onSelect: (id: TypeId) => void }
function Race({ gesture, K, custom, runId, sel, onSelect }: RaceProps) {
  const { t, locale } = useI18n()
  const plans = useMemo(() => TYPES.map((x) => plan(x, gesture, K, custom)), [gesture, K, custom])
  const maxD = Math.max(...plans.map((p) => p.dStop))          // a raia inteira = a maior frenagem
  const dots = useRef<(HTMLSpanElement | null)[]>([])
  const [done, setDone] = useState(false)
  const fmt = (cm: number) => cm.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 })

  useEffect(() => {
    setDone(false)
    const set = (i: number, frac: number) => { const el = dots.current[i]; if (el) el.style.left = `${(frac * 100).toFixed(2)}%` }
    if (runId === 0) { plans.forEach((_, i) => set(i, 0)); return }
    const start = performance.now()
    const total = Math.max(...plans.map((p) => p.tStick + p.T + p.tStop))
    let raf = 0
    const loop = (now: number) => {
      const t = (now - start) * SLOWMO
      plans.forEach((p, i) => {
        const tb = Math.max(0, Math.min(t - p.tStick - p.T, p.tStop))  // só a frenagem, sem a borda
        const sPx = p.v0 * tb - 0.5 * p.a * tb * tb
        set(i, sPx / maxD)
      })
      if (t >= total) { setDone(true); return }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [runId, plans, maxD])

  return (
    <ul className="flex flex-col justify-between sm:absolute sm:inset-0" role="tablist">
      {TYPES.map((x, i) => {
        const active = sel === x.id
        return (
          <li key={x.id}>
            <button
              role="tab" aria-selected={active}
              onClick={() => onSelect(x.id)}
              className={`w-full rounded-md px-3 pt-2 pb-3 text-left text-sm transition-colors ${active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span>{t.feel.types[x.id].name}</span>
                <span className={`font-mono text-xs tabular-nums transition-opacity ${done ? "opacity-100" : "opacity-0"}`}>{fmt(plans[i].dStopCm)} cm</span>
              </span>
              <span className="relative mt-2 block h-1 rounded-full bg-muted">
                <span ref={(el) => { dots.current[i] = el }} className="absolute top-1/2 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" style={{ left: 0 }} />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function Simulator() {
  const { t } = useI18n()
  const [sel, setSel] = useState<TypeId>("control")
  const [gesture, setGesture] = useState<Gesture>("vertical")
  const [runId, setRunId] = useState(0)
  const [custom, setCustom] = useState<Custom | null>(null)
  const K = 1
  const type = TYPES.find((x) => x.id === sel)!
  const reset = () => setRunId(0)
  const onDone = useCallback(() => {}, [])
  const onDragStart = useCallback(() => { setGesture("custom"); setRunId(0) }, [])
  const onDragEnd = useCallback((c: Custom) => { setCustom(c); setRunId((n) => n + 1) }, [])
  const canRelease = gesture !== "custom" || custom !== null

  return (
    <div className="rounded-xl border bg-card p-4 sm:rounded-2xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg">{t.feel.playground}</h3>
        <Popover>
          <PopoverTrigger render={<Button variant="ghost" size="icon-lg" aria-label={t.feel.infoTitle} />}>
            <HugeiconsIcon icon={InformationCircleIcon} size={20} strokeWidth={1.5} />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="flex flex-col gap-3 p-1">
              <h4 className="text-base font-medium">{t.feel.infoTitle}</h4>
              <p className="text-xs leading-4 text-muted-foreground">{t.feel.howRead}</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-x-5 gap-y-2 sm:grid-cols-[1fr_14rem]">
        <Lane type={type} gesture={gesture} K={K} runId={runId} custom={custom} onDone={onDone} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        <div className="relative">
          <Race gesture={gesture} K={K} custom={custom} runId={runId} sel={sel} onSelect={(id) => { setSel(id); reset() }} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <Tabs value={gesture} onValueChange={(v) => { setGesture(v as Gesture); reset() }}>
          <TabsList size="lg">
            {([...Object.keys(GESTURES), "custom"] as Gesture[]).map((g) => <TabsTrigger key={g} value={g}>{t.feel.gestures[g]}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <Button size="lg" disabled={!canRelease} onClick={() => { setRunId((n) => n + 1) }}>{t.feel.release}</Button>
      </div>
    </div>
  )
}
