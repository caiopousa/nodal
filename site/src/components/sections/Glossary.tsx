import { Section, Reveal } from "@/components/Section"
import { useI18n } from "@/lib/i18n"

export function Glossary() {
  const { t } = useI18n()
  return (
    <Section id="glossary" eyebrow={t.glossary.eyebrow} title={t.glossary.title} className="border-t bg-card/40">
      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.glossary.terms.map((g, i) => (
          <Reveal key={g.term} delay={(i % 3) * 0.05}>
            <dt className="font-medium">{g.term}</dt>
            <dd className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{g.def}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
