import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { TextAnimate } from "@/components/ui/text-animate"
import { Pad, type SurfaceKind } from "@/components/Pad"
import { useI18n } from "@/lib/i18n"

const STRIP: { kind: SurfaceKind; color: string }[] = [
  { kind: "cloth", color: "#3a2226" },
  { kind: "polyester", color: "#22303b" },
  { kind: "cloth", color: "#1e3a2f" },
  { kind: "hybrid", color: "#2b2438" },
  { kind: "glass", color: "#0f1216" },
  { kind: "cloth", color: "#3a2e1c" },
  { kind: "polyester", color: "#242a3d" },
  { kind: "cloth", color: "#1f2d2d" },
]
const CARDS = [...STRIP, ...STRIP]          // 16 cartas na roda
const CARD_W = 144, CARD_H = 184, GAP = 24   // px, múltiplos de 4
const SPEED = 0.05                           // rad/s

/**
 * Roda de cartas (ref: React Bits "Rotating Cards"), mas com raio grande e
 * centro muito abaixo da tela: só o topo do círculo aparece, de ponta a ponta.
 * Cada carta fica tangente ao arco e gira em torno do centro comum.
 */
function useWheel(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cards = Array.from(el.children) as HTMLElement[]
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let paused = false
    let last = performance.now()
    let theta = 0
    let raf = 0
    let radius = 800
    // arrasto: velocidade angular herdada do gesto, com atrito
    let drag: { x: number; t: number; v: number } | null = null
    let momentum = 0
    const onEnter = () => { paused = true }
    const onLeave = () => { paused = false }
    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId)
      drag = { x: e.clientX, t: performance.now(), v: 0 }
      momentum = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const now = performance.now()
      const dx = e.clientX - drag.x
      const dTheta = dx / radius                     // deslocamento na borda da roda
      theta += dTheta
      drag.v = dTheta / Math.max(1, now - drag.t) * 1000
      drag.x = e.clientX; drag.t = now
    }
    const onUp = () => {
      if (!drag) return
      momentum = Math.max(-3, Math.min(3, drag.v))
      drag = null
    }
    el.addEventListener("pointerenter", onEnter)
    el.addEventListener("pointerleave", onLeave)
    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)

    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      if (drag) {
        // a mão manda
      } else if (Math.abs(momentum) > 0.01) {
        theta += momentum * dt
        momentum *= Math.exp(-3 * dt)                // atrito: para em ~1 s
      } else if (!paused && !reduce) {
        theta += SPEED * dt
      }

      const W = el.clientWidth
      const R = Math.max(800, W * 0.9)                 // raio: quanto maior, mais reto o arco
      radius = R
      const step = (CARD_W + GAP) / R                  // ângulo entre cartas
      const span = cards.length * step                 // faixa angular que as cartas ocupam
      const cx = W / 2
      const cy = R + 24                                // centro da roda, abaixo do container

      cards.forEach((card, i) => {
        // ângulo da carta, enrolado dentro da faixa e centrado em zero
        let a = (theta + i * step) % span
        if (a < 0) a += span
        a -= span / 2
        const x = cx + R * Math.sin(a)
        const y = cy - R * Math.cos(a)
        card.style.transform = `translate(${(x - CARD_W / 2).toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(a * 180 / Math.PI).toFixed(2)}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("pointerenter", onEnter)
      el.removeEventListener("pointerleave", onLeave)
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
    }
  }, [ref])
}

export function Hero() {
  const { t, locale } = useI18n()
  const wheel = useRef<HTMLDivElement>(null)
  useWheel(wheel)
  return (
    <section className="pt-20 sm:pt-28">
      <motion.div
        className="container-101 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="eyebrow">{t.hero.eyebrow}</p>
        {/* Magic UI "Text Animate": palavra a palavra, com desfoque subindo; refaz ao trocar de idioma */}
        <TextAnimate key={locale} as="h1" by="word" animation="blurInUp" duration={0.6} once className="mt-4 max-w-2xl text-4xl tracking-tight text-balance sm:text-6xl">
          {t.hero.title}
        </TextAnimate>
        <p className="prose-101 mt-6 max-w-xl">{t.hero.lede}</p>
        <Button size="lg" className="mt-8" nativeButton={false} render={<a href="#what" />}>{t.hero.cta}</Button>
      </motion.div>

      <div
        ref={wheel}
        className="relative mt-12 h-[400px] w-full cursor-grab overflow-hidden select-none active:cursor-grabbing"
        style={{
          touchAction: "pan-y",
          // a base da roda se dissolve no fundo em vez de ser cortada numa linha
          maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
        }}
        aria-hidden
      >
        {CARDS.map((p, i) => (
          <div key={i} className="absolute left-0 top-0" style={{ width: CARD_W, height: CARD_H, transformOrigin: "50% 0%", willChange: "transform" }}>
            <Pad kind={p.kind} color={p.color} ratio={CARD_W / CARD_H} />
          </div>
        ))}
      </div>
    </section>
  )
}
