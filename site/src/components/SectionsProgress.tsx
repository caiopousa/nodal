import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { useI18n } from "@/lib/i18n"

const IDS = ["what", "types", "feel", "choose", "price", "brands", "market", "glossary"] as const

/**
 * Navegação por seções fixa na base da tela (Rare UI "Scroll Progress"):
 * pílula com o anel de progresso e o nome da seção atual; clique abre a lista.
 * Só aparece depois que o hero sai de cena, pra não cobrir a roda de pads.
 */
export function SectionsProgress() {
  const { t } = useI18n()
  const sections = useMemo(() => [
    { id: "what", label: t.what.title },
    { id: "types", label: t.feel.typesTitle },
    { id: "feel", label: t.feel.title },
    { id: "choose", label: t.choose.title },
    { id: "price", label: t.price.title },
    { id: "brands", label: t.brands.title },
    { id: "market", label: t.market.title },
    { id: "glossary", label: t.glossary.title },
  ], [t])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const first = document.getElementById(IDS[0])
      setVisible(!!first && first.getBoundingClientRect().top < window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="progress"
          className="fixed inset-x-0 bottom-0 z-50"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrollProgress key={t.nav.contents} sections={sections} offset={160} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
