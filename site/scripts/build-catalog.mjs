// CSV (fonte da verdade, editado à mão) -> src/data/catalog.json
import { readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, "../../mousepads_catalog.csv")
const out = resolve(here, "../src/data/catalog.json")

function parseCsv(text) {
  const rows = []
  let row = [], field = "", q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') q = false
      else field += c
    } else if (c === '"') q = true
    else if (c === ",") { row.push(field); field = "" }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(field); rows.push(row); row = []; field = ""
    } else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows.filter(r => r.length > 1)
}

const [header, ...lines] = parseCsv(readFileSync(src, "utf8"))
const num = v => (v === "" ? null : Number(v))
const str = v => (v === "" ? null : v)

const items = lines.map(r => {
  const g = k => r[header.indexOf(k)] ?? ""
  return {
    brand: g("Brand"), model: g("Model"),
    speed: str(g("Speed")), texture: str(g("Texture")), firmness: str(g("Firmness")),
    width: num(g("Width (mm)")), length: num(g("Length (mm)")), thickness: num(g("Thickness (mm)")),
    surface: str(g("Surface material")), base: str(g("Base material")),
    edges: str(g("Edges")), packaging: str(g("Packaging")),
    staticFriction: str(g("Static Friction")), dynamicFriction: str(g("Dynamic Friction")),
    glideDiff: num(g("Glide Difference X/Y (%)")), overallGlide: str(g("Overall Glide")),
    specsSource: g("specs_source"), tested: g("tested") === "true",
    testedSource: str(g("tested_source")), reviewUrl: str(g("review_url")),
    image: str(g("image")),            // opcional: nome do arquivo em public/pads
    imageCredit: str(g("image_credit")),
  }
})
writeFileSync(out, JSON.stringify(items))
console.log(`catalog.json: ${items.length} models`)
