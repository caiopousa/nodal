import { motion } from "motion/react"
import { Section } from "@/components/Section"
import { catalog, topBrands } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"

const BRANDS = topBrands(24)

/** Arredonda pra baixo na dezena, pra legenda envelhecer bem quando entrar marca nova. */
const floor = (n: number) => Math.floor((n - 1) / 10) * 10

const ITEM = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
}

export function Brands() {
  const { t, locale } = useI18n()
  const num = (v: number) => v.toLocaleString(locale === "pt" ? "pt-BR" : "en-US")

  return (
    <Section id="brands" eyebrow={t.brands.eyebrow} title={t.brands.title} lede={t.brands.lede}>
      {/* os nomes entram em cascata quando a seção aparece, um atrás do outro */}
      <motion.ul
        className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {BRANDS.map((b) => (
          <motion.li
            key={b.label}
            variants={ITEM}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-2xl leading-8 tracking-tight"
            title={`${b.n} ${t.market.models}`}
          >
            {b.label}
          </motion.li>
        ))}
      </motion.ul>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        {t.brands.note.replace("{brands}", num(floor(new Set(catalog.map((m) => m.brand)).size))).replace("{models}", num(floor(catalog.length)))}
      </p>
    </Section>
  )
}
