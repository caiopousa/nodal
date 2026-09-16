# Simulação de superfície — diretrizes e lógica do teste

Documento de referência do comparador de superfície (`mousepad_surface_compare.html`).
Registra o modelo físico, as decisões de design e o histórico de erros que levaram
a ele, pra que qualquer ajuste futuro parta do raciocínio e não do código.

## O que o teste é (e o que não é)

**É** uma metáfora visual de stopping power: "se você soltasse o mouse, quanto ele
andaria sozinho". Serve pra tornar visível uma diferença que, na mão, é sutil.

**Não é** um benchmark nem uma reprodução literal do uso — ninguém solta o mouse.
Por isso o texto do produto sempre fala em "se você soltasse", nunca em "o mouse
desliza".

A regra que sustenta tudo: **a simulação pode ser exemplificada, mas a sensação e
a visão precisam ser reais.** Os números por trás do que aparece na tela são os
do mundo real; a metáfora é só a forma de mostrar.

## Escala física

| Grandeza | Valor | Observação |
|---|---|---|
| Escala | 9 px = 1 cm | Caixa de 340 × 230 px ≈ 38 × 26 cm (um pad L real) |
| Gravidade | 9,81 m/s² → `981/1e6 × 9` px/ms² | Usada de verdade, não um número escolhido |
| Mouse | 22 × 32 px ≈ 2,4 × 3,6 cm | Tamanho aproximado de um mouse de jogo compacto |

Toda velocidade declarada em m/s é convertida pra px/ms por essa escala. Se a
escala mudar, tudo escala junto — nunca alterar só um dos lados.

## Materiais e coeficientes de atrito

Cada superfície tem dois coeficientes, em faixas plausíveis pra mouse com skates
de PTFE. **μs** (estático) decide quando o mouse descola; **μk** (dinâmico) decide
a frenagem.

| Material | μs | μk | Comportamento |
|---|---|---|---|
| Control | 0,38 | 0,30 | Segura mais pra descolar, freia mais rápido |
| Balanced | 0,30 | 0,24 | Intermediário |
| Speed | 0,22 | 0,18 | Descola fácil, freia devagar |
| Glass | 0,14 | 0,12 | Quase não segura, quase não freia |

Espalhamento Control → Glass: **2,5×**. É o que a física permite. Um espalhamento
de 13× (como no primeiro protótipo) só é possível inflando o atrito do tecido pra
níveis de borracha em asfalto — parece mais legível, mas mente.

Quando os dados reais entrarem (EloShapes, ProSettings), o μ vem da fonte e
esta tabela vira a tabela de mapeamento. O ProSettings mede estático e dinâmico
separados — por isso o modelo também tem os dois.

## Movimentos padronizados

Não há modo manual. Cada gesto é um trajeto fixo (frações da caixa) com uma
**velocidade de soltura declarada** em m/s. A velocidade é uma decisão de
design, não um efeito colateral da geometria.

| Gesto | Trajeto | v₀ (soltura) | Por quê |
|---|---|---|---|
| Vertical | reta, meio da caixa, 10% → 55% da altura | 0,7 m/s | Arrasto lento, isola bem o atrito |
| Diagonal | reta, canto superior esquerdo → 70% / 65% | 1,0 m/s | Arrasto médio, usa os dois eixos |
| Flick de mira | Bézier quadrática, sobe e volta | 0,9 m/s | Gesto de FPS; termina no meio da caixa pra sobrar espaço de frenagem |

**Duração do windup derivada da velocidade.** A animação acelera com easing `t²`.
A velocidade no fim de uma curva com esse easing é `2·|B'(1)| / T`, então
`T = 2·|B'(1)| / v₀`. Assim o que se vê antes de soltar é exatamente a velocidade
que entra na frenagem. Nunca fixar a duração e deixar a velocidade "cair" dela.

**Direção de soltura** = derivada do trajeto no fim, normalizada:
- Reta: `P1 − P0`
- Bézier quadrática: `2·(P2 − P1)`

## Modelo físico

### 1. Descolar (atrito estático)
A mão aumenta a força linearmente; o mouse sai do lugar quando `F > μs·N`.
Com uma rampa de ~250 ms, o atraso é `t_stick = μs × 250 ms`. Control ≈ 95 ms,
Glass ≈ 35 ms. Visualmente: micro-compressão do mouse enquanto segura.

### 2. Windup (gesto da mão)
Posição = `trajeto(t²)` ao longo de `T`. Puramente visual — o resultado não
depende de nenhum quadro desta fase.

### 3. Frenagem (atrito cinético)
Desaceleração **constante** (atrito cinético real, não arrasto de ar):

```
a        = μk · g · K
v(t)     = v₀ − a·t
s(t)     = v₀·t − ½·a·t²
t_stop   = v₀ / a
d_stop   = v₀² / (2a)        ← o número que aparece na tela
```

Direção fixa após a soltura. `K` é o fator de escala (ver abaixo).

### 4. Borda da caixa
Distância até a borda ao longo da direção fixa: menor entre "quando X sai" e
"quando Y sai". Se for menor que `d_stop`, a animação para na borda — **mas o
número exibido continua sendo `d_stop`**, com a nota "mais que a área do pad".
A borda limita o que se vê, nunca o que se reporta.

Instante em que chega na borda (raiz menor da quadrática):
`t = (v₀ − √(v₀² − 2·a·d_borda)) / a`

## Fator de escala K

| Modo | K | Efeito |
|---|---|---|
| Realista | 1 | Nada ampliado |
| Ampliada ×2 | 2 | Multiplica só a frenagem, pra leitura |

Os μ nunca mudam com K. O rodapé da página diz explicitamente o que está
ampliado. Se o modo realista parecer sutil demais, é assim que é — a ampliação
existe pra ser uma escolha declarada, não um número escondido.

## Regras de comparação

- **Mesma caixa pros dois pads, sempre.** Caixas de tamanho diferente por
  material confundem geometria com atrito (foi a causa de "Glass 4,2 cm vs
  Speed 5,1 cm"). O tamanho real do pad pode voltar como um modo separado,
  nunca dentro deste comparador.
- **Mesma velocidade de entrada pros dois.** A única variável entre Pad A e
  Pad B é o material.
- **Nada depende do tempo real entre quadros.** Velocidade de soltura, distância
  e colisão são calculadas em forma fechada antes de animar. O
  `requestAnimationFrame` só desenha.

## Histórico de erros (pra não repetir)

| Sintoma | Causa | Correção |
|---|---|---|
| Mouse não solta, para no lugar | Variável local com o mesmo nome da função de animação | Renomear |
| Resultado varia a cada execução, mesmo gesto | Velocidade medida no último frame (jitter do navegador) | Derivada analítica do trajeto |
| Balanced e Speed "iguais a Glass" | Frenagem integrada quadro a quadro com `dt` real; pads que param em 1-3 quadros sofrem mais | Forma fechada `v²/2a` |
| Diagonal e Curva incoerentes, Vertical ok | Velocidade escalava pela caixa de cada material; só a altura era parecida entre eles | Velocidade calculada por referência única |
| Glass "anda menos" que Speed | Número exibido era a distância até a borda, não a de frenagem | Reportar sempre `d_stop` |
| Diferença some mesmo com os números certos | Caixas de proporção diferente por material | Uma caixa só |
| Control 6× mais "grudento" que a realidade | μ inventados | μ plausíveis + K explícito |

## O que ainda falta

- Ligar os μ a dados reais (EloShapes → 9 níveis de Speed; ProSettings →
  rótulos de fricção estática/dinâmica).
- Definir a tabela de mapeamento rótulo → μ e documentá-la aqui.
- Decidir se o modo "tamanho real do pad" existe, e onde.
