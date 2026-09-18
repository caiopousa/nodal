import { useEffect, useMemo, useState } from "react"
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

  useEffect(() => {
    // seção ativa = a última cujo topo já passou de 40% da tela
    const onScroll = () => {
      const line = window.innerHeight * 0.4
      let idx = 0
      IDS.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) idx = i
      })
      setActive(idx)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const items = [{ label: t.nav.contents, heading: true as const }, ...IDS.map((id) => ({ label: titles[id], href: `#${id}` }))]

  return (
    <aside className="fixed top-1/2 left-6 z-30 hidden w-48 -translate-y-1/2 xl:block" aria-label={t.nav.contents}>
      <BounceSidebar
        items={items}
        value={active + 1}
        onChange={(i) => {
          const id = IDS[i - 1]
          if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
        }}
      />
    </aside>
  )
}
