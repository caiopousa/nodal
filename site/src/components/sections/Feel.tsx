import { Section, Reveal } from "@/components/Section"
import { Simulator } from "@/components/Simulator"
import { useI18n } from "@/lib/i18n"

export function Feel() {
  const { t } = useI18n()
  return (
    <Section id="feel" eyebrow={t.feel.eyebrow} title={t.feel.title} lede={t.feel.question + " " + t.feel.lede}>
      <Reveal><Simulator /></Reveal>
    </Section>
  )
}
