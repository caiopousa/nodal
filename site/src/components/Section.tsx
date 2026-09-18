import { useRef, type ReactNode } from "react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { cn } from "cn"

type Props = {
  id: string
  eyebrow: string
  title: string
  lede?: string
  children?: ReactNode
  className?: string
  /** conteúdo fora do grid estreito (só pra etapas decorativas) */
  wide?: boolean
}

/**
 * "Bend" em CSS: a seção inclina levemente em perspectiva ao entrar pela borda
 * de baixo e ao sair pela de cima, e fica plana no meio da tela. Aproximação do
 * Bend do Canvas UI, que precisa de flag experimental do Chrome.
 */
function useBend() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const raw = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-10, 0, 0, 10])
  const rotateX = useSpring(raw, { stiffness: 90, damping: 26, mass: 0.6 })
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6]), { stiffness: 90, damping: 26 })
  return { ref, rotateX, opacity }
}

export function Section({ id, eyebrow, title, lede, children, className, wide }: Props) {
  const bend = useBend()
  return (
    <motion.section
      id={id}
      ref={bend.ref}
      className={cn("scroll-mt-24 py-20 sm:py-28", className)}
      style={{ rotateX: bend.rotateX, opacity: bend.opacity, transformPerspective: 1200, transformOrigin: "50% 50%" }}
    >
      <motion.header
        className="container-101"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="flex items-baseline gap-4 text-3xl tracking-tight sm:text-4xl">
          <span className="font-mono text-base text-primary">{eyebrow}</span>
          {title}
        </h2>
        {lede && <p className="prose-101 mt-4 max-w-2xl">{lede}</p>}
      </motion.header>
      <div className={cn("mt-10", !wide && "container-101")}>{children}</div>
    </motion.section>
  )
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
