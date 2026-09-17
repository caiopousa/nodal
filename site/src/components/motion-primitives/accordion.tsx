"use client"
/**
 * Accordion no padrão do Motion Primitives (motion-primitives.com/docs/accordion).
 * Reescrito localmente porque o registry deles limitou as requisições; API igual:
 * Accordion / AccordionItem / AccordionTrigger / AccordionContent.
 */
import { createContext, useContext, useState, type ReactNode, type Key } from "react"
import { AnimatePresence, motion, type Transition } from "motion/react"
import { cn } from "cn"

type Ctx = { expanded: Key | null; toggle: (v: Key) => void; transition: Transition }
const AccordionCtx = createContext<Ctx | null>(null)
const ItemCtx = createContext<Key | null>(null)

export function Accordion({
  children, className, transition = { type: "spring", stiffness: 260, damping: 30 }, expandedValue, onValueChange,
}: { children: ReactNode; className?: string; transition?: Transition; expandedValue?: Key | null; onValueChange?: (v: Key | null) => void }) {
  const [internal, setInternal] = useState<Key | null>(null)
  const expanded = expandedValue !== undefined ? expandedValue : internal
  const toggle = (v: Key) => {
    const next = expanded === v ? null : v
    setInternal(next)
    onValueChange?.(next)
  }
  return <AccordionCtx.Provider value={{ expanded, toggle, transition }}><div className={className}>{children}</div></AccordionCtx.Provider>
}

export function AccordionItem({ value, children, className }: { value: Key; children: ReactNode; className?: string }) {
  const ctx = useContext(AccordionCtx)!
  return (
    <ItemCtx.Provider value={value}>
      <div className={className} data-expanded={ctx.expanded === value ? "" : undefined}>{children}</div>
    </ItemCtx.Provider>
  )
}

export function AccordionTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(AccordionCtx)!
  const value = useContext(ItemCtx)!
  const open = ctx.expanded === value
  return (
    <button type="button" aria-expanded={open} onClick={() => ctx.toggle(value)} className={cn("group w-full text-left", className)} data-expanded={open ? "" : undefined}>
      {children}
    </button>
  )
}

export function AccordionContent({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(AccordionCtx)!
  const value = useContext(ItemCtx)!
  const open = ctx.expanded === value
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={ctx.transition}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
