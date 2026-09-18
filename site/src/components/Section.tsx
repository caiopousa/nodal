import { useState, type ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { useI18n } from "@/lib/i18n"

/** Botão que copia o link direto pra seção; mostra um check por 1,5 s. */
function CopyLink({ id }: { id: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const url = `${location.origin}${location.pathname}#${id}`
    try { await navigator.clipboard.writeText(url) } catch { /* sem clipboard: nada a fazer */ }
    history.replaceState(null, "", `#${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Button
      variant="ghost" size="icon-sm" onClick={copy}
      aria-label={copied ? t.nav.copied : t.nav.copyLink} title={copied ? t.nav.copied : t.nav.copyLink}
      className={cn("shrink-0 self-center text-muted-foreground transition-opacity group-hover/h2:opacity-100 focus-visible:opacity-100", copied ? "text-primary opacity-100" : "opacity-0")}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Link01Icon} size={16} strokeWidth={1.5} />
    </Button>
  )
}

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
        <h2 className="group/h2 flex items-baseline gap-4 text-3xl tracking-tight sm:text-4xl">
          <span className="font-mono text-base text-primary">{eyebrow}</span>
          {title}
          <CopyLink id={id} />
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
