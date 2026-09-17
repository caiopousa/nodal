import { motion } from "motion/react"
import { Section } from "@/components/Section"
import { Pad, brandColor, surfaceKind } from "@/components/Pad"
import { brandSample } from "@/lib/catalog"
import { useI18n } from "@/lib/i18n"

const SAMPLE = brandSample(12)

export function Brands() {
  const { t } = useI18n()
  return (
    <Section id="brands" eyebrow={t.brands.eyebrow} title={t.brands.title} lede={t.brands.lede} wide>
      <div className="container-wide flex gap-5 overflow-x-auto pb-6 [scrollbar-width:thin]" style={{ scrollSnapType: "x proximity" }}>
        {SAMPLE.map((m, i) => (
          <motion.figure
            key={m.brand + m.model}
            className="w-52 shrink-0"
            style={{ scrollSnapAlign: "start" }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
          >
            <Pad
              kind={surfaceKind(m.surface)}
              color={brandColor(m.brand)}
              stitched={m.edges === "Stitched"}
              label={m.brand}
              ratio={m.width && m.length ? Math.min(1.6, Math.max(0.9, m.width / m.length)) : 1.2}
            />
            <figcaption className="mt-3">
              <div className="truncate text-sm font-medium">{m.brand} {m.model}</div>
              <div className="truncate text-xs text-muted-foreground">
                {[m.speed, m.surface, m.thickness ? `${m.thickness} mm` : null].filter(Boolean).join(" · ")}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  )
}
