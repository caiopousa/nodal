---
version: alpha
name: Mousepad 101
description: Baseado no "Braun / dieter-grid" (designdotmd.directory/d/dieter-grid). Cinza concreto, laranja utilitário como único acento.
colors:
  primary: "#0F1113"
  secondary: "#6B6F74"
  tertiary: "#D95600"
  neutral: "#E7E5E1"
  surface: "#F3F1EC"
  on-primary: "#F3F1EC"
grid: 4px            # todo tamanho, espaço e fonte em múltiplos de 4
typography:
  display: { fontFamily: Valley Sans, fontSize: 3.5rem, fontWeight: 500, letterSpacing: "-0.02em" }
  h1: { fontFamily: Valley Sans, fontSize: 1.9rem, fontWeight: 500 }
  body: { fontFamily: Inter, fontSize: 16px, lineHeight: 24px }
  label: { fontFamily: JetBrains Mono, fontSize: 12px, lineHeight: 16px, letterSpacing: "0.08em" }
rounded: { sm: 0px, md: 4px, lg: 4px }
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
- **Valley Sans nos títulos (h1 a h3) e na marca, peso 500. Inter no corpo.** Rótulos e números em JetBrains Mono. Cantos quase retos (2px).
- **Espaço negativo é parte da composição.** Não preencher por preencher.
