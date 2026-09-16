# Diretrizes do catálogo de mousepads

Este documento define como qualquer modelo novo deve ser inserido no catálogo,
para manter consistência entre o que já veio do EloShapes/ProSettings e o que
for adicionado manualmente no futuro.

## Objetivo do projeto

Este catálogo **não é um benchmark técnico** nem substitui o EloShapes. O
objetivo é dar suporte à decisão de compra através de curiosidade e
entendimento — mostrar de forma acessível como cada mousepad se comporta,
sem exigir que o comprador decifre jargão técnico sozinho.

## Fontes ativas nesta fase

| Fonte | O que fornece | Status |
|---|---|---|
| **EloShapes** | Specs declaradas pelo fabricante (camada 1) | Ativa |
| **ProSettings** | Comportamento medido em laboratório (camada 2) | Ativa |
| Doctor Mouse | Preço e disponibilidade BR | Fora por ora |
| Uso por pro player | Contexto social/curiosidade extra | Fica para v2 |

## Estrutura de colunas

### Identidade (sempre obrigatório)
- `Brand` — marca, como o fabricante escreve
- `Model` — nome do modelo. Inclua variante de tamanho/firmeza no nome
  quando o fabricante os trata como produtos distintos (ex: "FX Zero XL"
  vs "FX Zero XXL"), seguindo a convenção do EloShapes.

### Camada 1 — Specs declaradas (opcional, preencha o que souber)
| Coluna | Valores aceitos |
|---|---|
| `Speed` | Extremely slow, Very slow, Slow, Control, Balanced, Quick, Fast, Very fast, Extremely fast |
| `Texture` | Smooth, Textured, Rough |
| `Firmness` | Very soft, Soft, Firm, Very firm, Hard |
| `Width (mm)`, `Length (mm)`, `Thickness (mm)` | Numérico |
| `Surface material` | Cloth, Polyester, Hybrid, Glass, Glass coated cloth, Cordura, Plastic, Microfiber, Fabric, Carbon fiber, Nylon & spandex, Jacquard Cloth, Lycra, Amundsen |
| `Base material` | Rubber, SlimFlex, Poron, Polyurethane, Silicone, Alpha-cell, Neoprene, SCR, GlideCore Foam, SV BASE, SBR |
| `Edges` | Stitched, Flat, Rounded |
| `Packaging` | Flat, Rolled |

**Regra de vocabulário controlado**: sempre reutilize um valor já existente
na lista acima quando o modelo novo se encaixar. Só crie uma categoria nova
quando o material/textura genuinamente não existir na lista — inventar
sinônimos (ex: "Rápido-médio" em vez de "Quick") quebra qualquer filtro ou
comparação futura.

**Firmness aqui é dureza da base**, não da superfície — não confundir com
"hard surface" (vidro/plástico), que é capturado em `Surface material`.

### Camada 2 — Comportamento medido (só preencha se o modelo foi testado)
| Coluna | Valores aceitos |
|---|---|
| `Static Friction` | Very Low, Low, Medium, High, Very High |
| `Dynamic Friction` | Very Low, Low, Medium, High, Very High |
| `Glide Difference X/Y (%)` | Numérico (pode ser negativo) |
| `Overall Glide` | Control, Control-Oriented, Medium, Speed-Oriented, Speed |

Nunca preencha esta camada com estimativa própria — ela existe apenas para
dado de teste real e rastreável. Um modelo sem teste conhecido fica com
essas quatro colunas em branco.

### Flags de proveniência (sempre obrigatório)
| Coluna | Valores | Regra |
|---|---|---|
| `specs_source` | `EloShapes` / `Manual` | `Manual` quando você adicionar um modelo novo sem confirmar a ficha oficial |
| `tested` | `true` / `false` | `true` somente quando a Camada 2 estiver preenchida com dado de uma fonte real |
| `tested_source` | `ProSettings` / vazio | Nome da fonte do teste, quando `tested = true` |
| `review_url` | URL ou vazio | Link da review/teste completo, quando existir |

## Adicionando um modelo novo

1. Preencha `Brand` e `Model` (obrigatório).
2. Preencha o quanto souber da Camada 1, reaproveitando os valores da lista
   controlada. Deixe em branco o que não souber — não adivinhe.
3. Marque `specs_source` como `Manual`.
4. Se o modelo não foi testado por nenhuma fonte confiável, deixe a Camada 2
   em branco e marque `tested = false`, `tested_source` vazio.
5. Se você encontrar um teste real (ProSettings ou outra fonte equivalente
   no futuro), preencha a Camada 2 e marque `tested = true` com o nome da
   fonte em `tested_source`.

## Cruzamento entre fontes (nota de qualidade)

Ao casar nomes entre EloShapes e ProSettings, use apenas correspondências
exatas ou quase-exatas de marca+modelo. Descarte qualquer linha do
ProSettings cujo dado pareça ser resquício do sistema de medição antigo
deles (números brutos tipo "42.7" em vez de um rótulo como "High") — o
próprio ProSettings avisa que revisou a metodologia em maio de 2026 e que
alguns rótulos antigos podem estar incorretos ou não migrados. Nesse caso,
prefira deixar `tested = false` a inserir um dado ambíguo.

## O que NÃO entra nesta fase

- Preço (Doctor Mouse fica de fora por ora)
- Uso por pro player (fica para v2)
- Qualquer camada interpretativa (trade-off em 1 frase, perfil de uso,
  análogo sensorial) discutida anteriormente — pode ser adicionada como
  extensão do schema quando o catálogo base estiver estável.
