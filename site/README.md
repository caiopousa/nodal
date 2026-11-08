# nodal/setup

Site editorial sobre mousepads. Vite + React + TypeScript, Tailwind v4 e
shadcn/ui (estilo base-nova, sobre Base UI). Tudo estático: nenhum servidor,
nenhum banco.

## Rodando

```bash
npm install
npm run dev
```

O `predev` e o `prebuild` rodam `scripts/build-catalog.mjs`, que lê o
`mousepads_catalog.csv` da raiz do repositório e gera `src/data/catalog.json`.
Esse JSON é ignorado pelo git de propósito — o CSV é a fonte da verdade.

| Script | O que faz |
|--------|-----------|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | checagem de tipos + build de produção em `dist/` |
| `npm run preview` | serve o `dist/` localmente |
| `npm run lint` | oxlint |

## Publicando (Vercel ou Cloudflare Pages)

A raiz do projeto é esta pasta, não a raiz do repositório:

```
Root directory:    site
Build command:     npm run build
Output directory:  dist
Install command:   npm install
```

Não precisa de regra de rewrite: é uma página só, com navegação por âncora.
O build precisa do repositório inteiro, porque o catálogo é gerado a partir do
CSV que fica um nível acima desta pasta.

Node 20 ou mais novo.
