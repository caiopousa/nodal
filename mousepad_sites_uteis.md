# Sites úteis para o projeto de mousepads

Lista consolidada de todos os sites levantados até agora, organizados por
finalidade. Serve de referência rápida pra não perder nenhuma fonte pelo
caminho.

## Dados de mousepad — specs declaradas

| Site | O que oferece | Status |
|---|---|---|
| [EloShapes](https://www.eloshapes.com/mousepads/browse) | Database com 470+ modelos, 52 marcas. Campos: Speed (9 níveis), Texture, Firmness, Material, Base, Edges, Packaging, dimensões | Fonte primária ativa — já extraída em `mousepads_catalog.csv` |
| [Doctor Mouse](https://doctormouse.com.br/mousepads/) | Catálogo BR com preço em R$ e categorização própria (Control/Híbrido/Speed/Vidro) | Fora do escopo por ora (preço/compra não é foco do projeto) |

## Dados de mousepad — comportamento medido

| Site | O que oferece | Status |
|---|---|---|
| [ProSettings — How We Test Mousepads](https://prosettings.net/blog/how-we-test-mousepads) | Metodologia de teste (dinamômetro, gauge de ângulo, cronômetro) | Fonte primária ativa |
| [ProSettings — Mousepad List](https://prosettings.net/gear/lists/mousepads/) | 200+ pads testados: Static/Dynamic Friction, Glide Difference X/Y, Overall Glide, uso por pro player | Fonte primária ativa — 13 modelos já cruzados com o EloShapes no catálogo |
| [DCPROSENS — Mousepad Chart](https://dcprosens.com/mousepad-chart/) | Tabela de fricção/velocidade 1-10 por modelo | **Não confiável** — sem metodologia visível, links de compra genéricos reutilizados entre produtos diferentes. Usar só as definições de texto (static/dynamic friction, stopping power), nunca os números |

## Guias de compra — conceitos universais

| Site | Tipo | Observação |
|---|---|---|
| [CORSAIR — How to Choose a Mousepad](https://www.corsair.com/us/en/explorer/gamer/mouse-pads/how-to-choose-a-mousepad/) | Fabricante | Guia mais estruturado; amarra critérios a DPI e estilo de movimento antes de falar de produto |
| [MAXESPORT — Buying Guide](https://maxesport.gg/blogs/buying-guide/gaming-mouse-pad-the-buying-guide) | Varejo especializado | Único que cobre manutenção/limpeza e wrist rest |
| [Esports Gear UK — Mousepad Buying Guide](https://esportsgear.uk/blogs/buying-guides/mousepads) | Varejo especializado | Confirma o núcleo Speed/Control, detalha cloth |
| [Lorgar — How to Choose the Right Gaming Mousepad](https://lorgar.com/blog/how-to-choose-the-right-gaming-mousepad-size-surface-speed-and-control/) | Fabricante (blog) | Reforça tamanho amarrado a DPI e alcance do braço |
| Reddit — post do strumace sobre buying guide 101 | Comunidade | **Bloqueado** para fetch direto e não recuperado via busca. Revisitar depois com outro método (ex: navegador) se for essencial |

## Referências de UI/interação (coleção "Resources" do Raindrop)

Úteis pra construir a interface do comparador e do simulador — não têm
relação com dado de mousepad.

| Site | Pra que serve |
|---|---|
| [React Bits](https://reactbits.dev) | Componentes React com micro-interações |
| [Aceternity UI](https://ui.aceternity.com) | Componentes React + Tailwind, visual premium |
| [Magic UI](https://magicui.design) | Efeitos visuais pra dar vida a cards/seções |
| [Beautiful UI](https://beautifului.dev) | Primitivos de UI mais crus, pra construir do zero |
| [Canvas UI](https://canvasui.dev) | Componentes canvas/WebGL — útil pra evoluir o simulador de grip |
| [Bencho](https://bencho.dev) | Blocos de UI interativos, referência de drag/slider |
| [Design Minis](https://designminis.com) | Micro-interações isoladas, banco de ideias pra feedback visual |
| [Lucide Icons](https://lucide.dev) | Ícones leves, open source |
| [Hugeicons](https://hugeicons.com) | Ícones com mais variedade |
| Devouring Details | Referência de qualidade de microinteração em produtos reais |
| Interface Craft | Idem acima |
| Web UI Benchmark | Referência geral de qualidade de UI |

## Notas gerais

- A pasta "Resources" do Raindrop (129 itens) é 100% sobre UI/design —
  nenhum item relacionado a dado de mousepad.
- Nenhuma outra database pública dedicada a mousepad foi encontrada além do
  EloShapes; a comunidade (Reddit) existe mas não é estruturada/exportável.
