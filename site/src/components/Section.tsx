import type { ReactNode } from "react"
import { motion } from "motion/react"
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

export function Section({ id, eyebrow, title, lede, children, className, wide }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-20 sm:py-28", className)}>
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
    </section>
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
