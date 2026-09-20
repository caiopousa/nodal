import { useMemo } from "react"
import { Section } from "@/components/Section"
import { useI18n } from "@/lib/i18n"

const LETTERS = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

/** Primeira letra do termo; qualquer coisa que não seja A–Z cai no "#". */
const initial = (term: string) => {
  const c = term.trim()[0]?.toUpperCase() ?? "#"
  return c >= "A" && c <= "Z" ? c : "#"
}

export function Glossary() {
  const { t } = useI18n()

  // índice A–Z: agrupa por inicial e ordena dentro de cada letra
  const groups = useMemo(() => {
    const map = new Map<string, typeof t.glossary.terms>()
    for (const g of [...t.glossary.terms].sort((a, b) => a.term.localeCompare(b.term))) {
      const k = initial(g.term)
      map.set(k, [...(map.get(k) ?? []), g])
    }
    return map
  }, [t.glossary.terms])

  return (
    <Section id="glossary" eyebrow={t.glossary.eyebrow} title={t.glossary.title} className="border-t bg-card/40">
      <nav className="-mx-2 flex flex-wrap gap-x-1 gap-y-0" aria-label={t.glossary.index}>
        {LETTERS.map((l) =>
          groups.has(l) ? (
            <a
              key={l}
              href={`#glossary-${l === "#" ? "num" : l}`}
              className="inline-flex size-8 items-center justify-center rounded-sm font-mono text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              {l}
            </a>
          ) : (
            <span key={l} className="inline-flex size-8 items-center justify-center font-mono text-sm text-muted-foreground/40" aria-hidden>
              {l}
            </span>
          ),
        )}
      </nav>

      <div className="mt-10 gap-x-10 sm:columns-2">
        {LETTERS.filter((l) => groups.has(l)).map((l) => (
          <section key={l} id={`glossary-${l === "#" ? "num" : l}`} className="mb-10 break-inside-avoid scroll-mt-28">
            <h3 className="font-heading text-3xl leading-10">{l}</h3>
            <div className="mt-2 border-t" />
            <dl className="mt-4 flex flex-col gap-4">
              {groups.get(l)!.map((g) => (
                <div key={g.term}>
                  <dt className="font-medium">{g.term}</dt>
                  <dd className="mt-1 text-base leading-6 text-muted-foreground">{g.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Section>
  )
}
