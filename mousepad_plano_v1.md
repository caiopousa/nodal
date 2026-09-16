# Plano v1 — site "Mousepads, explicado"

Consolida a virada de escopo decidida em 15/09/2026. Substitui, onde
conflita, o que está em `mousepad_objetivos_projeto.md` (que fica como
histórico da ideia original).

## A virada

| Antes | Agora |
|---|---|
| Comparador/simulador sobre database de 470 modelos | Site editorial: o que é um mousepad, como escolher, o que muda entre barato e caro |
| Simulador modelo a modelo | Simulador por **tipo de superfície** (5 tipos) |
| Catálogo como produto | Catálogo como **matéria-prima**: exemplos reais nas seções, vitrine decorativa de marcas e números agregados do mercado |
| Comparador lado a lado | Descartado |
| Especs vs. medido como seção | Vira no máximo uma curiosidade dentro do texto |

Público continua o mesmo: comprador curioso, sem vocabulário técnico.
Ninguém compra nada no site.

## Direção visual

- **Escuro, 3D, apelativo, mas simples.** Grid centralizado com elementos
  de destaque, no espírito do interfacecraft.dev.
- **Metáfora física**: os mousepads vivem num **cabide** (ref: foto do
  rack com pads pendurados / galeria em anel 3D). Tirar um pad do cabide o
  leva pra **mesa**, onde ele vira a superfície do simulador. Protótipo
  "cabide → mesa" já validado em CSS puro.
- **Reação realista**: física fechada do doc de simulação, sem efeito
  decorativo que contradiga o comportamento real (tecido ondulando, líquido
  etc. ficam fora). O "apelo" vem de material, luz, sombra e animação de
  entrada/saída, não de física falsa.
- **Vitrine de marcas**: faixa achatada, 100% de largura, pads dos modelos
  reais entrando com animação in-view (motion-primitives). Fallback de
  navegação: carrossel do Kobra.
- **Cada pad na tela é gerado, não fotografado**: textura procedural por
  material (trama de tecido, vidro com reflexo, híbrido) + cor + logo
  textual. Vira identidade do projeto e resolve a falta de fotos.

## Estrutura do site (uma página, rolagem)

| # | Seção | Conteúdo | Fonte |
|---|---|---|---|
| 1 | **Hero** | Cabide 3D com pads; puxar um leva pra mesa | protótipo cabide→mesa |
| 2 | **O que é um mousepad** | Anatomia em camadas (superfície, base, borda), explodida em 3D | conceitos universais §2, §5, §6 |
| 3 | **Speed vs. Control** | Simulador: escolhe tipo de superfície + gesto, vê distância de frenagem. Modo realista e ×2 declarado | `mousepad_simulacao_superficie.md` |
| 4 | **Como escolher** | Material, tamanho (amarrado a DPI e estilo de movimento, com mini-interação), espessura, base, bordas | conceitos universais §1–§6 |
| 5 | **Barato vs. caro** | O que realmente muda: costura, base, consistência da trama, controle de qualidade, durabilidade. Sem preço por modelo | conceitos (manutenção, durabilidade) + redação nova |
| 6 | **Marcas e modelos** | Vitrine decorativa com 20–30 modelos reais e suas specs em 1 linha | `mousepads_catalog.csv` |
| 7 | **O mercado em números** | Agregados dos 470 modelos: % por material, espessura mais comum, distribuição Speed/Control, tamanhos | `mousepads_catalog.csv` |
| 8 | **Glossário** | Termos de mercado, mantidos em inglês no PT-BR | guidelines (vocabulário controlado) |

"O que os usuários geralmente falam" fica **fora do v1**: não há fonte
estruturada (Reddit bloqueado). Se entrar, é como citações curadas à mão.

## Simulador — tipos de superfície

| Tipo | μs | μk | Exemplo real (do CSV) |
|---|---|---|---|
| Cloth Control | 0,38 | 0,30 | a definir |
| Cloth Balanced | 0,30 | 0,24 | a definir |
| Cloth Speed | 0,22 | 0,18 | a definir |
| Hybrid | 0,26 | 0,21 | a definir |
| Glass | 0,14 | 0,12 | a definir |

Hybrid é novo; os demais vêm da tabela existente. Cada tipo aponta pra
1–2 modelos reais como exemplo ("é assim que se comporta um pad como o X").
Gestos, escala e forma fechada permanecem como documentado.

## Idiomas

EN-US é o padrão; PT-BR é a segunda. Termos de mercado (Speed, Control,
Glide, Stitched, Hybrid…) ficam em inglês nos dois. Conteúdo em dicionários
por locale desde o primeiro componente; rota `/` e `/pt-br`.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Base | Vite + React + TypeScript | Site estático, sem servidor |
| Estilo | Tailwind v4 + shadcn/ui, tokens em 3 camadas | já decidido |
| 3D | react-three-fiber + drei | cabide, mesa, materiais e luz reais; Canvas UI sai do caminho crítico |
| Animação de UI | Motion + motion-primitives (in-view) | já decidido |
| Ícones | Hugeicons (free) | já decidido |
| Dados | CSV → JSON no build | nada de banco; CSV segue como fonte da verdade |
| Deploy | Vercel desde o dia 1 | domínio .com.br só se o refino justificar |
| QA | Rams.ai quando o repo for público | já decidido |

## Mobile

Prioridade igual. Uma coluna; 3D com poucos pads e geometria leve; o
simulador não depende de arrastar (gestos são automáticos), então funciona
por toque sem adaptação de física.

## Fases

| Fase | Entrega | Risco |
|---|---|---|
| 0 | Repo git, scaffold, tokens, i18n, deploy vazio na Vercel | baixo |
| 1 | Simulador portado pra React (2D canvas, 5 tipos, 3 gestos) | baixo, doc pronto |
| 2 | Hero: cabide → mesa em r3f, pad procedural, simulador embutido na mesa | **alto**, é a peça visual |
| 3 | Seções 2, 4, 5 e 8 (conteúdo), EN primeiro, PT-BR depois | médio, é redação |
| 4 | Vitrine de marcas + mercado em números a partir do CSV | baixo |
| 5 | Polimento, mobile, Rams.ai, decisão de domínio | — |

## Pendências

- [ ] Recuperar `mousepad_surface_compare.html` e o protótipo cabide→mesa
      pra dentro desta pasta.
- [ ] Confirmar r3f (vs. CSS 3D puro) pro cabide.
- [ ] Escolher os 20–30 modelos da vitrine e os exemplos por tipo.
- [ ] Definir paleta e tipografia (tokens primitivos).
