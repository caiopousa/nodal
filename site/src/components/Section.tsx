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
  wide?: boolean
}

export function Section({ id, eyebrow, title, lede, children, className, wide }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-20 sm:py-28", className)}>
      <div className={wide ? "" : "container-101"}>
        <motion.header
          className={cn("max-w-2xl", wide && "container-101")}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 text-4xl tracking-tight text-balance sm:text-5xl">{title}</h2>
          {lede && <p className="prose-101 mt-4 text-lg">{lede}</p>}
        </motion.header>
        <div className="mt-12">{children}</div>
      </div>
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
