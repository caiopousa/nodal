import { useEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useMotionValue, type PanInfo } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Section } from "@/components/Section"
import { Button } from "@/components/ui/button"
import { StepPlayer } from "@/components/ui/step-player"
import { Pad, brandColor, surfaceKind } from "@/components/Pad"
import { brandSample } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"

const SAMPLE = brandSample(12)
const GAP = 24                                   // px, múltiplo de 4
const SPRING = { type: "spring", stiffness: 260, damping: 34 } as const

/** Quantos cards cabem inteiros, conforme a largura disponível. */
const perView = (w: number) => (w >= 640 ? 3 : w >= 420 ? 2 : 1)

/**
 * Vitrine de marcas: sempre um número inteiro de cards visíveis, nunca um pad
 * cortado na borda. A largura de cada card sai da largura do container. Arrasto
 * e setas encaixam card a card; as setas ficam fora da área dos cards.
 */
export function Brands() {
  const { t } = useI18n()
  const viewport = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [cardW, setCardW] = useState(224)
  const [n, setN] = useState(3)
  const [index, setIndex] = useState(0)

  const step = cardW + GAP
  const maxIndex = Math.max(0, SAMPLE.length - n)

  // mede o container e recalcula largura dos cards e quantos cabem
  useEffect(() => {
    const measure = () => {
      const w = viewport.current?.clientWidth ?? 0
      if (!w) return
      const count = perView(w)
      setN(count)
      setCardW((w - GAP * (count - 1)) / count)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (viewport.current) ro.observe(viewport.current)
    return () => ro.disconnect()
  }, [])

  // mantém a trilha encaixada no card atual quando o tamanho muda
  useEffect(() => {
    const i = Math.min(index, maxIndex)
    if (i !== index) setIndex(i)
    x.set(-i * step)
  }, [step, maxIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // limites estáveis: um objeto novo a cada render faz o Motion reaplicar e cortar a animação
  const constraints = useMemo(() => ({ left: -maxIndex * step, right: 0 }), [maxIndex, step])

  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(maxIndex, i))
    setIndex(target)
    animate(x, -target * step, SPRING)
  }

  // ao soltar: encaixa no card mais próximo, levando em conta a velocidade do gesto
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = -x.get() - info.velocity.x * 0.2
    goTo(Math.round(projected / step))
  }

  // páginas do controlador: 0, n, 2n, ... e a última posição possível
  const pages = useMemo(() => {
    const p: number[] = []
    for (let i = 0; i < maxIndex; i += n) p.push(i)
    p.push(maxIndex)
    return p
  }, [maxIndex, n])
  const page = pages.reduce((best, p, k) => (Math.abs(p - index) < Math.abs(pages[best] - index) ? k : best), 0)

  const padBox = cardW   // caixa quadrada pro pad: legendas sempre na mesma linha
  const arrow = "absolute z-10 size-10 rounded-full bg-card shadow-md transition-opacity dark:bg-card dark:hover:bg-muted disabled:pointer-events-none disabled:opacity-0"

  return (
    <Section id="brands" eyebrow={t.brands.eyebrow} title={t.brands.title} lede={t.brands.lede}>
      <div className="relative">
        <div ref={viewport} className="overflow-hidden">
          <motion.div
            className="flex cursor-grab select-none active:cursor-grabbing"
            style={{ x, gap: GAP, touchAction: "pan-y" }}
            drag="x"
            dragConstraints={constraints}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            {SAMPLE.map((m, i) => (
              <motion.figure
                key={m.brand + m.model}
                className="shrink-0"
                style={{ width: cardW }}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
              >
                <div className="flex items-end" style={{ height: padBox }}>
                  <Pad
                    kind={surfaceKind(m.surface)}
                    color={brandColor(m.brand)}
                    stitched={m.edges === "Stitched"}
                    label={m.brand}
                    ratio={m.width && m.length ? Math.min(1.6, Math.max(1.02, m.width / m.length)) : 1.2}
                    className="pointer-events-none w-full"
                  />
                </div>
                <figcaption className="mt-3">
                  <div className="truncate text-sm font-medium">{m.brand} {m.model}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {[m.speed, m.surface, m.thickness ? `${m.thickness} mm` : null].filter(Boolean).join(" · ")}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>

        {/* setas fora da área dos cards (na margem da página); no celular, por cima da borda */}
        <Button variant="outline" size="icon-lg" className={`${arrow} left-1 md:-left-16`} style={{ top: padBox / 2 - 20 }} onClick={() => goTo(index - n)} disabled={index <= 0} aria-label={t.brands.prev}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.5} />
        </Button>
        <Button variant="outline" size="icon-lg" className={`${arrow} right-1 md:-right-16`} style={{ top: padBox / 2 - 20 }} onClick={() => goTo(index + n)} disabled={index >= maxIndex} aria-label={t.brands.next}>
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={1.5} />
        </Button>
      </div>

      {/* controlador: um passo por página, clicável; já vem tocando e volta ao início no fim */}
      <div className="mt-8 flex justify-center">
        <StepPlayer
          steps={pages.length}
          value={page}
          onValueChange={(k) => goTo(pages[k])}
          duration={8000}
          loop
          defaultPlaying
          seekable
          size={40}
        />
      </div>
    </Section>
  )
}
