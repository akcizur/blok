# Blok

> Osobní blog a publikační rozhraní postavené na Vite + React + TypeScript. Jednoduché, monochromatické, statické a připravené pro GitHub Pages.

[![Website](https://img.shields.io/badge/website-blok.ruzickajakub.cz-000000?style=flat-square)](https://blok.ruzickajakub.cz)
[![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-000000?style=flat-square)](https://akcizur.github.io/blok/)
[![Stack](https://img.shields.io/badge/stack-Vite%20%2B%20React%20%2B%20TS-000000?style=flat-square)](#technologický-stack)

Blok je minimalistický blogový frontend pro psaní, myšlení a publikování. Projekt je navržen jako statická aplikace bez backendu, bez databáze a bez CMS. Obsah článků je uložený v Markdown souborech a při buildu se načítá jako součást aplikace. Vzhled a UX jsou navržené pro dlouhé čtení a nízkou režii.

## Hlavní vlastnosti

- statický frontend bez serveru
- osobní blog s jednoduchým katalogem článků
- režimy zobrazení článků: List, Grid, Magazine, Compact
- tématický režim Light / Dark
- vyhledávání v článcích v klientu
- detail článku přes čistou URL `/post/<slug>` s podporou starého `?post=N`
- monochromatická vizuální identita
- deployment přes GitHub Pages

## Architektura

Projekt je navržen jako tiny publishing frontend:

- `index.html` = shell aplikace
- `src/main.tsx` = bootstrap Reactu
- `src/App.tsx` = hlavní orchestrace UI a state
- `src/data/posts.ts` = loader a parser Markdown článků
- `src/content/posts/*.md` = zdrojový obsah článků + frontmatter
- `src/components/*` = UI komponenty
- `public/styles.css` = globální design tokens a styling

## Struktura projektu

```text
.
├── .github/
├── public/
│   ├── .nojekyll
│   └── styles.css
├── src/
│   ├── components/
│   ├── config/
│   ├── content/
│   │   └── posts/
│   ├── data/
│   ├── hooks/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── designRules.md
├── index.html
├── package.json
├── README.md
├── structureMap.md
├── tsconfig.json
├── vite.config.ts
└── yarn.lock / package-lock.json (pokud je přítomný v lokálním checkoutu)
```

## Technologický stack

### Runtime

- React 19
- React DOM 19
- TypeScript 5+

### Build a vývoj

- Vite
- @vitejs/plugin-react
- TypeScript
- oxfmt

### UI a design

- Lucide React
- Google Sans
- Fragment Mono
- ruční CSS (globální design tokens)

## Designové principy

Blok je záměrně minimalistický:

- úzký editorialní sloupec
- monochromatická palette
- tenké rámečky a nízká hloubka stínů
- velké mezery, nízké vizuální hluku
- typografie je rozdělená na hlavní text a metadata
- UI je postavená pro čtení, ne pro dashboard

## Obsah a data

Články jsou samostatné Markdown soubory v `src/content/posts/`. Metadata je uložená ve frontmatteru a samotný článek tvoří Markdown tělo.

Příklad:

```md
---
id: 7
title: "Název článku"
excerpt: "Krátké shrnutí pro kartu článku."
category: "Development"
date: "2. 10. 2026"
readTime: "5 min"
---

# Název článku

Obsah článku v Markdownu.
```

Při buildu Vite načte všechny `*.md` soubory přes `import.meta.glob`. `src/data/posts.ts` z nich vytvoří jednotný datový model a převede Markdown na HTML pro detail článku.

## Vyhledávání a navigace

- vyhledávání probíhá čistě v prohlížeči
- články se filtrují na základě metadat i obsahu Markdownu
- detail článku používá `/post/<slug>`; staré `?post=<id>` URL se automaticky převedou
- URL je synchronizována s výběrem článku
- `Escape` zavírá vyhledávací overlay

## Téma a režimy zobrazení

Aplikace podporuje:

- `List`
- `Grid`
- `Magazine`
- `Compact`

a dále:

- `light`
- `dark`

Preference se ukládají do `localStorage`.

## Rozvoj lokálně

### Instalace

```bash
npm install
```

### Development server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview produkční build

```bash
npm run preview
```

### Formátování

```bash
npm run format
```

## Deployment

Projekt je připraven pro GitHub Pages.

Hlavní konfigurace:

- `vite.config.ts` nastavuje `base` pro deployment
- `public/.nojekyll` zajišťuje správné zpracování statických artefaktů
- workflow v `.github/workflows/` publikuje build do Pages

## GitHub Pages a routing

Aplikace používá jednoduchý statický přístup ke článkům:

```text
/                  # seznam
/post/01-good-product  # detail
?post=1             # legacy kompatibilita
```

Routing je řešen malou vlastní vrstvou v `src/lib/routing.ts`, bez další router knihovny.

## Produkční principy

- static-first
- nízké komplexní nároky na infrastrukturu
- snadná údržba
- vhodné pro malý osobní web
- 100% v prohlížeči

## Souborová dokumentace

V repozitáři jsou doplňkové dokumenty:

- `designRules.md` — vizuální a designové zásady
- `structureMap.md` — mapování architektury a datových toků
- `README.md` — přehled projektu a práce s ním

## Repository

- GitHub: https://github.com/akcizur/blok
- Web: https://blok.ruzickajakub.cz

## Licence

Tento projekt nepoužívá žádnou explicitní licenční hlavičku; pokud jde o osobní publikování a vlastní frontend, je vhodné zvážit vyjasnění licence před publikací externích redistribucí.

## Krátká poznámka

Tento projekt není „blog engine“ v klasickém CMS smyslu. Je to designově čistý, statický publikační frontend pro osobní publikaci. Jeho síla spočívá v jednoduchosti, rychlosti a v tom, že se snadno udržuje.

Dokumentace odpovídá aktuální podobě projektu Blok.
