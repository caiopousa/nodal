import type { CSSProperties } from "react"
import { cn } from "cn"

export type SurfaceKind = "cloth" | "polyester" | "hybrid" | "glass"

/** Mapeia o vocabulário controlado de `Surface material` pra uma das 4 texturas procedurais. */
export function surfaceKind(material: string | null | undefined): SurfaceKind {
  const m = (material ?? "").toLowerCase()
  if (m.includes("glass") && !m.includes("cloth")) return "glass"
  if (m.includes("hybrid") || m.includes("coated") || m.includes("cordura") || m.includes("carbon") || m.includes("plastic")) return "hybrid"
  if (m.includes("polyester") || m.includes("nylon") || m.includes("lycra") || m.includes("microfiber")) return "polyester"
  return "cloth"
}

const PALETTE = ["#1b1b1f", "#242a3d", "#1e3a2f", "#3a2226", "#3a2e1c", "#22303b", "#2b2438", "#33333a", "#2f2f2f", "#1f2d2d"]

/** Cor determinística por marca, pra vitrine ter variedade sem foto. */
export function brandColor(brand: string): string {
  let h = 0
  for (const ch of brand) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[h % PALETTE.length]
}

type Props = {
  kind?: SurfaceKind
  color?: string
  stitched?: boolean
  label?: string
  /** largura / comprimento, ex.: 450/400 */
  ratio?: number
  className?: string
  style?: CSSProperties
}

export function Pad({ kind = "cloth", color, stitched = true, label, ratio = 1.2, className, style }: Props) {
  const glass = kind === "glass"
  return (
    <div
      className={cn("pad", `pad-${kind}`, stitched && !glass && "pad-stitched", className)}
      style={{ aspectRatio: String(ratio), "--pad-color": color ?? (glass ? "#0f1216" : "#1c1c1f"), ...style } as CSSProperties}
      aria-hidden
    >
      {label && <span className="pad-label">{label}</span>}
    </div>
  )
}
