# Conceitos universais para escolha de mousepad

Levantamento comparativo de guias de compra (fabricante, varejo e comunidade)
pra identificar quais critérios se repetem em qualquer lugar do mundo,
independente da fonte. Serve de base bruta pra seção do site sobre "o que
olhar num mousepad".

## Fontes consultadas

| Fonte | Tipo | Observação |
|---|---|---|
| [CORSAIR — How to Choose a Mousepad](https://www.corsair.com/us/en/explorer/gamer/mouse-pads/how-to-choose-a-mousepad/) | Fabricante | A mais estruturada das três; única que amarra os critérios a DPI/estilo de movimento antes de falar de produto |
| [MAXESPORT — Gaming Mouse Pad Buying Guide](https://maxesport.gg/blogs/buying-guide/gaming-mouse-pad-the-buying-guide) | Varejo especializado | Cobre pontos que as outras não cobrem (manutenção, wrist rest) |
| [Esports Gear UK — Mousepad Buying Guide](https://esportsgear.uk/blogs/buying-guides/mousepads) | Varejo especializado | Confirma o núcleo Speed/Control e detalha cloth |
| [Lorgar — How to Choose the Right Gaming Mousepad](https://lorgar.com/blog/how-to-choose-the-right-gaming-mousepad-size-surface-speed-and-control/) | Fabricante (blog) | Reforça tamanho amarrado a DPI e alcance do braço |
| Reddit (post do strumace) | Comunidade | **Bloqueado para acesso direto** — não foi possível recuperar o conteúdo original. Consenso de comunidade equivalente veio de discussões em fóruns (Steam) capturadas na busca |

## Núcleo universal — presente em praticamente todas as fontes

### 1. Speed vs. Control vs. Balanced
O eixo central de qualquer guia. A Corsair é a única que amarra isso a três
perguntas prévias antes de indicar um tipo de superfície:
- **Sensibilidade (DPI)**: sensibilidade alta = menos deslocamento físico
  necessário = pode usar pad menor; sensibilidade baixa = precisa de mais
  percurso = pad maior.
- **Estilo de movimento**: arrasto amplo do braço vs. micro-ajustes de
  pulso — independente da sensibilidade configurada.
- **Nível de jogo**: competitivo exige performance consistente e repetível;
  casual tem mais liberdade pra priorizar conforto.

### 2. Material da superfície — Soft vs. Hard
- **Soft (cloth/tecido)**: mais versátil, enrola pra transportar, vida útil
  menor, mais barato em geral.
- **Hard (vidro/plástico)**: glide mais rápido e consistente, não dobra/enrola,
  exige limpeza mais frequente (partículas ficam mais visíveis na superfície
  rígida e afetam o tracking).

Dentro do "soft", a Corsair traz uma distinção que nenhuma outra fonte
mencionou:
- **Trama micro-tecida (micro-woven)**: glide mais rápido, mas com diferença
  de atrito entre o eixo X e o eixo Y por causa da direção da trama.
- **Trama randômica (random-weave)**: glide mais lento, mas uniforme nos dois
  eixos — direção não importa.

### 3. Tamanho
Todas as fontes concordam que tamanho não é escolha estética — é função de
DPI e alcance de movimento:
- **Padrão (S/M/L)**: cobre só a área de manobra do mouse. Pra quem faz
  micro-ajuste.
- **Estendido (XL, 2XL, 3XL / deskmat)**: cobre boa parte da mesa,
  normalmente teclado + mouse juntos. Pra quem varre o braço todo ou quer
  unificar a estética da mesa.

### 4. Espessura
Trade-off consistente entre portabilidade e conforto, com faixas que batem
entre as fontes:
- **~1-2mm**: fino, rígido, mais portátil, mas o desconforto/irregularidade
  da mesa passa direto pro pulso.
- **3mm**: padrão de mercado, equilíbrio entre firmeza e amortecimento.
- **4mm+**: padrão "esportivo", pensado pra sessões longas — absorve
  irregularidades da mesa e reduz fadiga do pulso.

### 5. Base / aderência
Tratado como requisito básico, não diferencial, em todas as fontes — um
mousepad sem base antiderrapante é considerado defeituoso, não uma opção
válida. Ranking de material citado: rubber > silicone > PVC (rubber dá
aderência mais imediata e estável em madeira, vidro ou laminado).

### 6. Acabamento das bordas
Bordas costuradas (stitched edges) aparecem em todas as fontes que tocam
no assunto como sinônimo direto de durabilidade — evita que o tecido
desfie ou que o revestimento descasque com o uso.

## Pontos que aparecem em só uma fonte (não são "universais", mas são reais)

- **Manutenção/durabilidade** (MAXESPORT): cloth desgasta mais rápido que
  vidro; vidro exige produto de limpeza específico; nunca usar secadora
  (o calor descola o revestimento).
- **Wrist rest** (MAXESPORT): mantém o pulso reto, evita hiperextensão —
  tratado como acessório opcional, não como critério central.
- **Design/estética** (MAXESPORT): citado explicitamente como o único
  critério que **não** afeta performance — é só gosto pessoal.
- **Preço por faixa** (MAXESPORT): fora do escopo atual do projeto por
  decisão já tomada.

## Cruzamento com o schema já existente

A maior parte deste núcleo já tem campo correspondente direto no catálogo
(`mousepads_catalog.csv`):

| Conceito universal | Campo no catálogo |
|---|---|
| Speed vs. Control | `Speed` |
| Material da superfície | `Surface material`, `Texture` |
| Tamanho | `Width (mm)`, `Length (mm)` |
| Espessura | `Thickness (mm)` |
| Base/aderência | `Base material` |
| Bordas | `Edges` |
| Diferença de glide X/Y | `Glide Difference X/Y (%)` (camada ProSettings) |

O que falta não é campo de dado — é o **texto explicativo** por trás de cada
campo, que hoje só existe como cabeçalho de planilha. Esse é o material bruto
pra virar a seção do site.
