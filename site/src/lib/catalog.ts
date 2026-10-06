import raw from "@/data/catalog.json"

export type Model = {
  brand: string; model: string
  speed: string | null; texture: string | null; firmness: string | null
  width: number | null; length: number | null; thickness: number | null
  surface: string | null; base: string | null; edges: string | null; packaging: string | null
  staticFriction: string | null; dynamicFriction: string | null
  glideDiff: number | null; overallGlide: string | null
  specsSource: string; tested: boolean; testedSource: string | null; reviewUrl: string | null
  /** foto do produto em public/pads; sem ela, o card cai no render procedural */
  image: string | null; imageCredit: string | null
}

export const catalog = raw as Model[]

export function count<K extends keyof Model>(key: K, map?: (v: Model[K]) => string | null) {
  const m = new Map<string, number>()
  for (const item of catalog) {
    const v = map ? map(item[key]) : item[key]
    if (v === null || v === undefined || v === "") continue
    const k = String(v)
    m.set(k, (m.get(k) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, n]) => ({ label, n }))
}

/** Uma amostra por marca, das marcas com mais modelos. */
export function brandSample(limit = 12): Model[] {
  const seen = new Map<string, Model>()
  const order = count("brand").map((b) => b.label)
  for (const item of catalog) if (!seen.has(item.brand)) seen.set(item.brand, item)
  return order
    .filter((b) => !b.includes(" x "))
    .slice(0, limit)
    .map((b) => seen.get(b)!)
}

export const SPEED_ORDER = ["Extremely slow", "Very slow", "Slow", "Control", "Balanced", "Quick", "Fast", "Very fast", "Extremely fast"]
