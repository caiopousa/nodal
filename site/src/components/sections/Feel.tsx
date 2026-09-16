import { Section, Reveal } from "@/components/Section"
import { Simulator, TYPES } from "@/components/Simulator"
import { useI18n } from "@/lib/i18n"

export function Feel() {
  const { t } = useI18n()
  return (
    <Section id="feel" eyebrow={t.feel.eyebrow} title={t.feel.title} lede={t.feel.lede} className="border-y bg-card/40">
      <Reveal><Simulator /></Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TYPES.map((type, i) => (
          <Reveal key={type.id} delay={i * 0.05} className="rounded-lg border bg-background p-4">
            <div className="text-sm font-medium">{t.feel.types[type.id].name}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t.feel.types[type.id].blurb}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 max-w-2xl">
        <p className="text-lg text-balance"><span className="text-primary">→</span> {t.feel.takeaway}</p>
      </Reveal>
    </Section>
  )
}
