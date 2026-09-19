import { useRef, useState } from "react"
import { cn } from "cn"

const REST = { x: 22, y: -22 }   // ângulo de repouso

/**
 * Símbolo da marca: um quadrado visto em ângulo. No hover ele inclina em
 * perspectiva seguindo o cursor e afunda ao clicar (ref: "Scroll Key",
 * scrolltide.co).
 */
export function Keycap({ label = "N", className }: { label?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [tilt, setTilt] = useState(REST)
  const [pressed, setPressed] = useState(false)

  const follow = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)      // -1..1
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    setTilt({ x: REST.x - dy * 26, y: REST.y + dx * 34 })
  }
  const rest = () => { setTilt(REST); setPressed(false) }

  return (
    <span
      ref={ref}
      className={cn("keycap", className)}
      onPointerMove={follow}
      onPointerLeave={rest}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      aria-hidden
    >
      <span
        className="keycap-tile"
        style={{
          // perspectiva embutida no transform: projeção independente de qualquer ancestral
          transform: `perspective(180px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${pressed ? -6 : 0}px)`,
        }}
      >
        {label}
      </span>
    </span>
  )
}
