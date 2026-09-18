---
version: alpha
name: Mousepad 101
description: Baseado no "Stripe" (designdotmd.directory/d/stripe). Azul-marinho no texto, fundo cinza-azulado, roxo como único acento.
colors:
  primary: "#0A2540"
  secondary: "#425466"
  tertiary: "#635BFF"
  neutral: "#F6F9FC"
  surface: "#FFFFFF"
  on-primary: "#FFFFFF"
grid: 4px            # todo tamanho, espaço e fonte em múltiplos de 4
typography:
  display: { fontFamily: Inter, fontSize: 56px, fontWeight: 300, letterSpacing: "-0.04em" }
  h1: { fontFamily: Inter, fontSize: 40px, fontWeight: 500, letterSpacing: "-0.02em" }
  body: { fontFamily: Inter, fontSize: 16px, lineHeight: 24px }
  label: { fontFamily: Inter, fontSize: 12px, fontWeight: 600, lineHeight: 16px, letterSpacing: "0.02em" }
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
- **Inter em tudo.** Display (h1) em peso 300; h2 e h3 em 500; rótulos em 600. Números em JetBrains Mono. Cantos de 8px, cards em 16px.
- **Espaço negativo é parte da composição.** Não preencher por preencher.
