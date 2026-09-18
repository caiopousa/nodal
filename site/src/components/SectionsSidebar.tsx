import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { BounceSidebar } from "@/components/ui/bounce-sidebar"
import { useI18n } from "@/lib/i18n"

const IDS = ["what", "types", "feel", "choose", "price", "brands", "market", "glossary"] as const

/** Sumário fixo à esquerda: o ponto pula pra seção ativa conforme o scroll; clique rola até ela. */
export function SectionsSidebar() {
  const { t } = useI18n()
  const titles = useMemo(() => ({
    what: t.what.title, types: t.feel.typesTitle, feel: t.feel.title, choose: t.choose.title,
    price: t.price.title, brands: t.brands.title, market: t.market.title, glossary: t.glossary.title,
  }), [t])
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // seção ativa = a última cujo topo já passou de 40% da tela;
    // o sumário só aparece depois que a seção 1 já subiu um pouco
    const onScroll = () => {
      const line = window.innerHeight * 0.4
      let idx = 0
      IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) idx = i
      })
      setActive(idx)
      const first = document.getElementById(IDS[0])
      setVisible(!!first && first.getBoundingClientRect().top < window.innerHeight * 0.15)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const items = [{ label: t.nav.contents, heading: true as const }, ...IDS.map((id) => ({ label: titles[id], href: `#${id}` }))]

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key="toc"
          className="fixed top-1/2 left-6 z-30 hidden w-48 -translate-y-1/2 xl:block"
          aria-label={t.nav.contents}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <BounceSidebar
            items={items}
            value={active + 1}
            onChange={(i) => {
              const id = IDS[i - 1]
              if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
            }}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
