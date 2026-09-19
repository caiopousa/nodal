import { Section } from "@/components/Section"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/motion-primitives/accordion"
import { Pad } from "@/components/Pad"
import { useI18n } from "@/lib/i18n"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSpeed02Icon, MaterialAndTextureIcon, RulerDimensionLineIcon, Layers01Icon, Magnet01Icon, BorderAll01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Alert, AlertDescription } from "@/components/ui/alert"

/** Um ícone da Hugeicons por critério. */
const ICONS = { feel: DashboardSpeed02Icon, material: MaterialAndTextureIcon, size: RulerDimensionLineIcon, thickness: Layers01Icon, base: Magnet01Icon, edges: BorderAll01Icon }

/** Miniaturas por critério, todas construídas com o pad procedural. */
function Visual({ k }: { k: string }) {
  switch (k) {
    case "feel":
      return (
        <div className="flex items-end gap-3">
          <Pad kind="cloth" color="#3a2226" label="Control" className="w-24" />
          <Pad kind="cloth" color="#1e3a2f" label="Speed" className="w-24" />
        </div>
      )
    case "material":
      return (
        <div className="flex items-end gap-3">
          <Pad kind="cloth" label="Cloth" className="w-24" />
          <Pad kind="glass" label="Glass" className="w-24" />
        </div>
      )
    case "size":
      return (
        <div className="flex items-end gap-2">
          <Pad kind="cloth" label="M" className="w-12" ratio={1.15} />
          <Pad kind="cloth" label="L" className="w-16" ratio={1.15} />
          <Pad kind="cloth" label="XL" className="w-28" ratio={2.1} />
        </div>
      )
    case "thickness":
      return (
        <div className="flex items-end gap-4">
          {[2, 3, 4, 6].map((mm) => (
            <div key={mm} className="flex flex-col items-center gap-1">
              <div className="w-10 rounded-sm bg-gradient-to-b from-[#3a3f4a] to-[#141518]" style={{ height: mm * 5 }} />
              <span className="text-xs text-muted-foreground">{mm} mm</span>
            </div>
          ))}
        </div>
      )
    case "base":
      return (
        <div className="relative w-28" style={{ perspective: "600px" }}>
          <div className="h-3 rounded-sm bg-[#141518]" style={{ transform: "rotateX(55deg) translateY(28px)" }} />
          <Pad kind="cloth" className="w-28" style={{ transform: "rotateX(55deg)" }} />
        </div>
      )
    default:
      return (
        <div className="flex items-end gap-3">
          <Pad kind="cloth" label="Stitched" className="w-24" />
          <Pad kind="cloth" stitched={false} label="Flat" className="w-24" />
        </div>
      )
  }
}

export function Choose() {
  const { t } = useI18n()
  return (
    <Section id="choose" eyebrow={t.choose.eyebrow} title={t.choose.title} lede={t.choose.lede}>
      <Accordion className="border-t" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
        {t.choose.items.map((it) => (
          <AccordionItem key={it.key} value={it.key} className="border-b">
            <AccordionTrigger className="grid w-full grid-cols-[2.5rem_1fr_auto] text-left items-center gap-4 py-5 transition-colors hover:text-foreground">
              <HugeiconsIcon icon={ICONS[it.key as keyof typeof ICONS]} size={24} strokeWidth={1.5} className="text-primary" />
              <span className="text-lg font-medium">{it.title}</span>
              <span className="text-muted-foreground transition-transform duration-300 group-data-[expanded]:rotate-45" aria-hidden>+</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-6 pb-7 pl-[3.5rem] sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <p className="prose-101 text-base">{it.body}</p>
                  <Alert variant="muted" className="mt-4">
                    <HugeiconsIcon icon={InformationCircleIcon} size={16} strokeWidth={1.5} />
                    <AlertDescription>{it.tip}</AlertDescription>
                  </Alert>
                </div>
                <div className="sm:pt-1"><Visual k={it.key} /></div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
