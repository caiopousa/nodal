---
version: alpha
name: Mousepad 101
description: Base "Stripe" (designdotmd.directory/d/stripe) com ajustes: acento lilás #C18CFF, Valley Sans nos títulos, Figtree no corpo.
colors:
  primary: "#0A2540"
  secondary: "#425466"
  tertiary: "#C18CFF"
  neutral: "#F6F9FC"
  surface: "#FFFFFF"
  on-primary: "#0A2540"
grid: 4px            # todo tamanho, espaço e fonte em múltiplos de 4
typography:
  display: { fontFamily: Valley Sans, fontSize: 56px, fontWeight: 400, letterSpacing: "-0.04em" }
  h1: { fontFamily: Valley Sans, fontSize: 40px, fontWeight: 500, letterSpacing: "-0.02em" }
  body: { fontFamily: Figtree, fontSize: 16px, lineHeight: 24px }
  label: { fontFamily: Figtree, fontSize: 12px, fontWeight: 600, lineHeight: 16px, letterSpacing: "0.02em" }
rounded: { sm: 4px, md: 8px, lg: 16px }
spacing: { sm: 8px, md: 16px, lg: 32px }
---

## Como isto entra no código

Os tokens vivem no bloco `.dark` de `site/src/index.css`, sobre as variáveis
do shadcn. Mapeamento: neutral → `--background`; surface → `--card`;
primary → `--foreground`; secondary → `--muted-foreground`;
tertiary → `--primary`; rounded.md → `--radius`. Fontes via Google Fonts em
`--font-heading` / `--font-sans` / `--font-mono`.

## Regras

- **Grid de 4.** Tamanhos de fonte, entrelinhas, espaçamentos e alturas só em múltiplos de 4px. A escala tipográfica está no `@theme` do CSS: 12, 16, 20, 24, 32, 40, 48, 56, 64.

- **Tertiary é o único acento.** Uma ação por tela; rótulos de seção, números
  de resultado e rastros do simulador também usam ele, nada mais.
- **Sem gradiente decorativo.** Fundo plano. Exceção declarada: as texturas
  procedurais dos pads são render de material, não decoração.
- **Valley Sans nos títulos e na marca; Figtree no corpo e nos rótulos.** Display (h1) em 400; h2 e h3 em 500; rótulos em 600. Números em JetBrains Mono. Cantos de 8px, cards em 16px.
- **Acento lilás sobre texto escuro.** #C18CFF é claro; botões primários usam o azul-marinho como texto.
- **Espaço negativo é parte da composição.** Não preencher por preencher.
