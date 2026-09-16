---
version: alpha
name: Mousepad 101
description: Baseado no "Dream Engine" (designdotmd.directory/d/midjourney-dream). Obsidiana, violeta como único acento.
colors:
  primary: "#F1EDF9"
  secondary: "#8C87A2"
  tertiary: "#C18CFF"
  neutral: "#0B0A13"
  surface: "#15131F"
  on-primary: "#0B0A13"
typography:
  display: { fontFamily: Instrument Serif, fontSize: 5rem, fontWeight: 400, letterSpacing: "-0.02em" }
  h1: { fontFamily: Instrument Serif, fontSize: 2.6rem, fontWeight: 400 }
  body: { fontFamily: Inter, fontSize: 0.95rem, lineHeight: 1.6 }
  label: { fontFamily: JetBrains Mono, fontSize: 0.72rem, letterSpacing: "0.06em" }
rounded: { sm: 6px, md: 12px, lg: 20px }
spacing: { sm: 8px, md: 16px, lg: 32px }
---

## Como isto entra no código

Os tokens vivem no bloco `.dark` de `site/src/index.css`, sobre as variáveis
do shadcn. Mapeamento: neutral → `--background`; surface → `--card`;
primary → `--foreground`; secondary → `--muted-foreground`;
tertiary → `--primary`; rounded.md → `--radius`. Fontes via Google Fonts em
`--font-heading` / `--font-sans` / `--font-mono`.

## Regras

- **Tertiary é o único acento.** Uma ação por tela; rótulos de seção, números
  de resultado e rastros do simulador também usam ele, nada mais.
- **Sem gradiente decorativo.** Fundo plano. Exceção declarada: as texturas
  procedurais dos pads são render de material, não decoração.
- **Serif só em h1/h2.** Corpo em Inter, rótulos e números em JetBrains Mono.
- **Espaço negativo é parte da composição.** Não preencher por preencher.
