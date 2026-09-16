# Stack e libs — Mousepad Project

Referência isolada de base técnica, pra consulta rápida (Cowork ou onde for
usada). Não repete objetivos/escopo do projeto — só o que entra na
construção.

## Stack base

- **React**
- **Tailwind CSS**
- **shadcn/ui** — camada de componentes copy-paste (Radix + Tailwind),
  ponto de partida pros primitivos de UI

## Componentes — instalam via shadcn CLI

| Lib | Instalação | Uso no projeto |
|---|---|---|
| **Motion Primitives** — motion-primitives.com | `npx shadcn add` | Micro-interações gerais (cards, transições, números animados). Usa Motion + Lucide React por baixo |
| **beUI** — beui.dev/components/motion | `npx shadcn@latest add @beui/<component>` | Suíte de scroll animation (parallax, scroll-reveal) + 30+ blocos motion |
| **Kobra UI** — kobra.systems | `kobra.systems/r/{name}.json` (listado no diretório oficial shadcn/ui) | Componentes extras pra preencher gaps do shadcn puro |
| **React Bits** — reactbits.dev | Via 21st.dev / CLI | Componentes com micro-interações, mesmo criador do Canvas UI |

## Efeitos visuais — superfície/textura do simulador

| Lib | O que oferece | Uso no projeto |
|---|---|---|
| **Canvas UI** — canvasui.dev ⭐ | Efeitos criativos WebGL/WebGPU, registry compatível com shadcn | Peça central pro simulador de grip: componentes "Cloth" (tecido ondulando com cursor), "Liquid" (fluido puxado pelo ponteiro), "Glass"/"Frost" (refração), "Bubble" — mapeiam direto pras categorias de superfície (Cloth/Glass/Hybrid) |
| **Libraries.dev** — libraries.dev | 5 pacotes MIT isolados (Border Beam, Thinking Orb, Gooey, Liquid Metal, Image gen), React puro, ~83KB total | Toques pontuais de acabamento — Liquid Metal pra pad de vidro, Gooey pra um drag mais lúdico |

## Ícones
- **Hugeicons** — hugeicons.com. Escolhida como lib única por abrangência:
  46.000+ ícones em 9-10 estilos (stroke, duotone, solid, bulk, etc.),
  ~4.000-4.600 gratuitos — já ultrapassa o total do Lucide (~1.500, todos
  gratuitos) só no tier free, e cobre categorias de nicho que libs menores
  não têm. Coleção completa (46k) é paga (~$49 vitalício); o tier free já
  deve cobrir a maior parte do projeto.

## Ferramenta de QA de design (pós-build, não é lib de instalar)
- **Rams.ai** — rams.ai. Não é componente — é um linter de design pra
  agentes de IA: pontua PRs de 0-100 contra 313 regras (contraste, tokens,
  motion, acessibilidade) via GitHub App/MCP/CI. Free pra repo público.
  Entra depois que o repo existir, como checagem de qualidade contínua.

## Referência de arquitetura (não é instalável, é modelo a seguir)
- **ds.wellzesta.io** — exemplo real de design system Tailwind v4 + CVA +
  convenções shadcn, com tokens em 3 camadas (primitive → semantic →
  component). Vale seguir a lógica de organização de tokens, não o pacote
  em si (é o design system privado de outra empresa).

## Diretório de garimpo contínuo (não é lib, é lista curada)
- **Design Engineer Tools** — designengineer.tools. Bookmark pra explorar
  quando faltar algo específico (aponta pra Awwwards, 21st.dev, Godly,
  NumberFlow, Fancy Components, etc.)

## Protótipos já validados com essa base conceitual
- Simulador de grip (drag + física de desaceleração por atrito) — validado
  em CSS/JS puro, sem lib externa
- Cabide → mesa com perspectiva 3D (`perspective` + `rotateX`), textura de
  tecido via `repeating-linear-gradient` cruzado, borda costurada via SVG
  `stroke-dasharray`, vidro via gradiente + sheen animado — validado em
  CSS/JS puro; a versão de produção troca a textura geométrica por foto
  real da trama e o reflexo de vidro por material WebGL real (Canvas UI)
