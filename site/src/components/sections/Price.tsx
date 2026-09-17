import { Section, Reveal } from "@/components/Section"
import { useI18n } from "@/lib/i18n"

export function Price() {
  const { t } = useI18n()
  return (
    <Section id="price" eyebrow={t.price.eyebrow} title={t.price.title} lede={t.price.lede} className="border-y bg-card/40">
      <Reveal className="overflow-hidden rounded-lg border bg-background">
        <div className="hidden grid-cols-[1fr_1.4fr_1.4fr] gap-6 border-b bg-card px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <span>{t.price.cols.aspect}</span><span>{t.price.cols.cheap}</span><span className="text-primary">{t.price.cols.premium}</span>
        </div>
        {t.price.rows.map((r) => (
          <div key={r.aspect} className="grid gap-2 border-b px-6 py-5 last:border-b-0 md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-6">
            <div className="font-medium">{r.aspect}</div>
            <div className="text-base text-muted-foreground"><span className="mr-2 text-xs uppercase tracking-wider md:hidden">{t.price.cols.cheap} · </span>{r.cheap}</div>
            <div className="text-base"><span className="mr-2 text-xs uppercase tracking-wider text-primary md:hidden">{t.price.cols.premium} · </span>{r.premium}</div>
          </div>
        ))}
      </Reveal>
      <Reveal className="mt-8 max-w-2xl">
        <p className="text-lg text-balance"><span className="text-primary">→</span> {t.price.note}</p>
      </Reveal>
    </Section>
  )
}
