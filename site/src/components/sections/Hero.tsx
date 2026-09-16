import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Pad, type SurfaceKind } from "@/components/Pad"
import { useI18n } from "@/lib/i18n"

const RACK: { kind: SurfaceKind; color: string; label: string; ratio: number }[] = [
  { kind: "cloth", color: "#3a2226", label: "Control", ratio: 0.9 },
  { kind: "polyester", color: "#22303b", label: "Balanced", ratio: 0.85 },
  { kind: "cloth", color: "#1e3a2f", label: "Speed", ratio: 0.95 },
  { kind: "hybrid", color: "#2b2438", label: "Hybrid", ratio: 0.85 },
  { kind: "glass", color: "#0f1216", label: "Glass", ratio: 0.9 },
  { kind: "cloth", color: "#3a2e1c", label: "XL", ratio: 0.8 },
  { kind: "polyester", color: "#242a3d", label: "Deskmat", ratio: 0.75 },
]

export function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.85_0.17_90_/_0.10),transparent_70%)]" />
      <div className="container-101 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{t.hero.title}</h1>
          <p className="prose-101 mt-6 max-w-xl text-lg">{t.hero.lede}</p>
          <div className="mt-8 flex items-center gap-4">
            <Button size="lg" nativeButton={false} render={<a href="#what" />}>{t.hero.cta}</Button>
            <span className="text-sm text-muted-foreground">470 {t.market.models} · EloShapes + ProSettings</span>
          </div>
        </motion.div>

        <div className="rack relative">
          <div className="rack-bar mx-4" />
          <div className="mt-0 flex items-start justify-between px-6" style={{ transformStyle: "preserve-3d" }}>
            {RACK.map((p, i) => {
              const mid = (RACK.length - 1) / 2
              const off = i - mid
              return (
                <motion.div
                  key={p.label}
                  className="hanging w-[20%] shrink-0 -mx-[3.5%]"
                  style={{ transform: `rotateY(${off * -9}deg) translateZ(${-Math.abs(off) * 18}px)` }}
                  initial={{ opacity: 0, y: -30, rotateX: -12 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                  whileHover={{ y: 14, rotateX: 6, zIndex: 10 }}
                >
                  <div className="hook" />
                  <Pad kind={p.kind} color={p.color} label={p.label} ratio={p.ratio} className="shadow-2xl" />
                </motion.div>
              )
            })}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">{t.hero.rackNote}</p>
        </div>
      </div>
    </section>
  )
}
