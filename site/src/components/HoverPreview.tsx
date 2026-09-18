import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"

/**
 * Link externo que mostra o ícone do site ao passar o mouse (ref: "Hover
 * Preview", pro.reactbits.dev). O ícone acompanha o cursor com uma leve
 * inclinação. A seta indica que o destino é fora daqui.
 */
export function HoverPreview({ href, icon, children }: { href: string; icon: string; children: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hover, setHover] = useState(false)
  const [p, setP] = useState({ x: 0, r: 0 })

  const follow = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)   // -1..1
    setP({ x: dx * 14, r: dx * 12 })
  }

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="link-select relative inline-flex items-center gap-1 whitespace-nowrap px-0.5 text-foreground"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={follow}
    >
      {children}
      <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={2} className="text-primary" />
      <AnimatePresence>
        {hover && (
          <motion.span
            className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 block overflow-hidden rounded-lg border bg-card p-2 shadow-lg"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: p.x - 28, rotate: p.r }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <img src={icon} alt="" width={40} height={40} className="block size-10 rounded-md object-contain" />
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  )
}
