# Objetivos do projeto — Comparador/Simulador de Mousepads

Documento-base pra planejamento. Consolida a ideia, o foco e as decisões de
escopo tomadas até aqui.

## A ideia central

Um projeto que ajuda quem está escolhendo um mousepad a **entender** as
opções, não só compará-las tecnicamente. O ponto de partida foi a vontade de
simular o grip de um mousepad — arrastar um mouse virtual e sentir a
aderência/deslize dependendo do modelo — pra dar uma noção intuitiva de como
cada pad se comporta, sem exigir que a pessoa decifre ficha técnica.

## O que este projeto NÃO é

- **Não é um clone do EloShapes.** O EloShapes já é uma database técnica
  completa; replicá-la não agrega nada.
- **Não é uma ferramenta de recomendação de compra.** Não é objetivo indicar
  "compre este modelo" nem otimizar por preço/custo-benefício.
- **Não é um benchmark de precisão.** Os números que usamos (atrito,
  velocidade) servem pra dar noção comparativa e gerar curiosidade, não pra
  serem lidos como medição de laboratório definitiva.

## O que este projeto É

Uma camada de **entendimento e curiosidade** sobre cima de dados reais —
mostrando de forma acessível como cada mousepad se comporta, pra quem nunca
teve vocabulário técnico sobre o assunto conseguir formar uma expectativa
antes de comprar.

A referência de experiência é o **Canva**: uma ferramenta que dá suporte à
decisão através de exploração visual e interativa, não uma planilha
comparativa fria.

## Público-alvo

Compradores curiosos que quer entender o que estão comprando — não
especialistas que já sabem ler uma ficha técnica de mousepad, e não
compradores que só querem o preço mais barato.

## Pilares do produto

### 1. Simulador de grip/glide
Interação de arrastar-e-soltar um mouse virtual sobre um pad, com física de
desaceleração baseada no atrito real do modelo escolhido. Primeira versão já
prototipada com categorias genéricas (Control/Balanced/Speed/Glass); próximo
passo é plugar dados reais de modelos específicos no lugar das categorias.

### 2. Catálogo de mousepads com duas camadas de dado
- **Specs declaradas** (o que o fabricante diz) — fonte: EloShapes
- **Comportamento medido** (o que um teste independente mostrou) — fonte:
  ProSettings

Cada modelo carrega flags de proveniência (`specs_source`, `tested`,
`tested_source`) pra deixar claro de onde vem cada dado — inclusive quando o
dado é uma estimativa manual, não uma ficha oficial.

### 3. Seção educativa — "o que olhar num mousepad"
Conteúdo explicando os conceitos universais de compra (Speed vs. Control,
material da superfície, tamanho, espessura, base, bordas), levantado a partir
de guias de fabricantes e varejo especializado. Serve de porta de entrada pra
quem chega sem saber nem por onde começar.

### 4. Comparador
Visualização lado a lado de modelos reais, puxando das duas camadas de dado
acima — o diferencial é mostrar quando a spec declarada e o comportamento
medido concordam ou divergem (ex: fabricante chama de "Balanced" mas o teste
mostra fricção alta), o que vira um ponto de curiosidade genuíno.

## Decisões de escopo já tomadas

| Decisão | Motivo |
|---|---|
| EloShapes + ProSettings como fontes de dado ativas | Cobrem specs declaradas e comportamento medido, respectivamente, sem sobreposição |
| DCPROSENS descartado como fonte numérica | Dados sem metodologia visível, sinais de conteúdo de afiliado não curado |
| Preço/disponibilidade de compra (Doctor Mouse) fora por ora | Projeto não recomenda compra nesta fase |
| Uso por pro player fica para v2 | Ângulo de curiosidade válido, mas não é essencial pro núcleo do produto agora |
| Camada interpretativa (perfil de uso, trade-off em 1 frase, análogo sensorial) discutida mas não implementada | Só faz sentido depois que o catálogo base estiver estável |
| Modelo de dado aceita registros incompletos desde o início | O catálogo vai crescer com modelos adicionados manualmente, alguns sem specs confirmadas — o schema já foi desenhado pra isso, não é um ajuste futuro |

## O que já existe (estado atual)

- Simulador de grip funcional (protótipo com categorias genéricas)
- `mousepads_catalog.csv` — 470 modelos do EloShapes, 13 já cruzados com
  dado de comportamento medido do ProSettings
- `mousepad_catalog_guidelines.md` — regras de inserção de novos modelos e
  vocabulário controlado
- `mousepad_conceitos_universais.md` — levantamento dos conceitos de compra
  universais, pronto pra virar a seção educativa do site
- `mousepad_sites_uteis.md` — lista de fontes de dado e referências de UI já
  mapeadas
- Direção de UI iniciada: bibliotecas de componentes e referências visuais
  levantadas na coleção Resources (React Bits, Aceternity, Magic UI, Canvas
  UI, entre outras)

## Próximos passos em aberto (não decididos ainda)

- Estrutura final do schema/banco de dados (planilha vs. algo mais robusto)
- Como o simulador vai consumir os dados reais do catálogo em vez das
  categorias genéricas atuais
- Formato final da seção educativa no site
- Stack de construção (qual(is) biblioteca(s) de UI usar de fato)
