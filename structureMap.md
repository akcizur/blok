# Structure Map

## 1. Účel

Toto je technická mapa Dimple / KAAP.

Definuje:

- file ownership,
- dependency flow,
- state ownership,
- data flow,
- routing,
- styling,
- deployment,
- bezpečná místa pro rozšíření.

---

## 2. Root tree

    kaap/
    ├── .github/
    │   └── workflows/
    │       └── deploy-pages.yml
    ├── public/
    │   ├── .nojekyll
    │   └── styles.css
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── ModeButton.tsx
    │   │   ├── PostCard.tsx
    │   │   └── PostPage.tsx
    │   ├── config/
    │   │   └── viewModes.ts
    │   ├── data/
    │   │   └── posts.ts
    │   ├── hooks/
    │   │   └── usePreferences.ts
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── .gitignore
    ├── README.md
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts

---

## 3. Ownership map

| Soubor | Odpovědnost |
|---|---|
| index.html | HTML shell + metadata |
| main.tsx | React bootstrap |
| App.tsx | orchestrace + state + direct navbar controls |
| PostCard.tsx | post presentation |
| PostPage.tsx | detail presentation |
| ModeButton.tsx | reusable mode control |
| viewModes.ts | mode configuration |
| posts.ts | content data |
| usePreferences.ts | theme/view persistence |
| styles.css | visual system |
| vite.config.ts | build + base path |
| deploy-pages.yml | CI/CD |

---

## 4. Dependency graph

    index.html
       ↓
    src/main.tsx
       ↓
    src/App.tsx
       ├── src/data/posts.ts
       ├── src/config/viewModes.ts
       ├── src/hooks/usePreferences.ts
       ├── components/PostCard.tsx
       └── components/PostPage.tsx

CSS flow:

    index.html
       ↓
    public/styles.css
       ↓
    global classes + CSS variables
       ↓
    rendered React DOM

styles.css není JS module dependency. Je připojen jako veřejný stylesheet.

---

## 5. App state map

App.tsx vlastní:

    email
    subscribed
    language
    scale
    searchOpen
    searchOpen
    searchQuery
    selectedPostId

usePreferences vlastní:

    theme
    viewMode

Derived:

    selectedPost
    filteredPosts

---

## 6. Persistence map

    App.tsx
       ↓
    usePreferences()
       ↓
    React state
       ↓
    useEffect
       ↓
    localStorage

Keys:

    dimple-theme
    dimple-view

Pouze theme a viewMode jsou dnes persistentní.

---

## 7. Initial preference flow

Theme:

    localStorage
       ↓
    prefers-color-scheme
       ↓
    light

View mode:

    localStorage
       ↓
    validate against VIEW_MODES
       ↓
    list

---

## 8. Post data flow

    src/data/posts.ts
             ↓
          App.tsx
          /      \
         /        \
    filter       resolve
      ↓             ↓
    PostCard      PostPage

PostCard dostává Post přes props.

PostPage dostává jediný vybraný Post přes props.

Není použit globální content store.

---

## 9. Search flow

    search input
        ↓
    searchQuery
        ↓
    useMemo
        ↓
    posts.filter
        ↓
    title + excerpt + category + date
        ↓
    filteredPosts
        ↓
    PostCard[]

Search je synchronní klientský filtr.

---

## 10. Routing flow

Použit je query-param routing:

    ?post=1

Inicializace:

    window.location.search
          ↓
    URLSearchParams
          ↓
    post value
          ↓
    Number
          ↓
    selectedPostId
          ↓
    posts.find
          ↓
    selectedPost

Render:

    selectedPost?
       ├── yes → PostPage
       └── no  → listing

Browser history:

    popstate
      ↓
    syncPost()
      ↓
    selectedPostId

---

## 11. Navigation state

Navbar má tři přímé controls:

    layout
    theme
    search

Stav:

    searchOpen
    searchQuery

Layout a Theme nemají open state.

### Layout

Kliknutí:

    current viewMode
        ↓
    next viewMode
        ↓
    PostCard

### Theme

Kliknutí:

    light ↔ dark
        ↓
    data-theme
        ↓
    CSS tokens

### Search

Kliknutí:

    searchOpen
        ↓
    nav-panel--search
        ↓
    searchQuery
        ↓
    filteredPosts

Search panel je overlay pod 56px navbarem a neovlivňuje layout flow.

Neexistuje Settings menu, subnavbar, Language button ani Scale button.

## 13. View mode graph

    viewModes.ts
       ├── ViewMode type
       ├── VIEW_MODE_ORDER
       └── VIEW_MODES
             ↓
        App.tsx
        PostCard.tsx
        usePreferences.ts

PostCard renderuje mode-specific markup.

---

## 14. View mode expansion

Při přidání nového view mode:

1. ViewMode union,
2. VIEW_MODE_ORDER,
3. VIEW_MODES,
4. navbar control,
5. PostCard branch,
6. CSS.

Současná architektura používá explicitní větvení. Pro čtyři režimy je to čitelné a levné na údržbu.

---

## 15. Component coupling

### App.tsx

Nejvyšší coupling.

Je legitimní orchestration root, ale při růstu může být potřeba rozdělení.

### PostCard.tsx

Nízká coupling:

- Post,
- ViewMode.

### PostPage.tsx

Nízká coupling:

- Post.

### ModeButton.tsx

Malý reusable primitive.

Aktuální App stav jej nepoužívá jako hlavní mode flow.

---

## 16. CSS structure

styles.css je globální a lze ho číst v pořadí:

1. root tokens,
2. dark theme,
3. global base,
4. app/header,
5. navbar panels,
6. main content,
7. posts,
8. newsletter,
9. footer,
10. utilities,
11. post detail,
12. responsive.

Design rules pro tento stylesheet jsou v designRules.md.

---

## 17. Theme graph

    data-theme
       ↓
    CSS custom properties
       ↓
    component styles
       ↓
    rendered visual state

Například:

    data-theme=dark
       ↓
    --bg = #0a0a0a
       ↓
    .app background
       ↓
    page dark state

Komponenty nemají samostatné light/dark stylesheety.

---

## 18. Fixed navbar invariant

Navbar má pevnou výšku 56px.

Search overlay je absolutně pozicovaný pod navbarem a neovlivňuje layout flow.

## 19. Footer links

Externí odkazy jsou pouze ve footeru:

    website
    mail
    github

Nejsou součástí hlavní navbarové interakce.
## 20. Newsletter flow

    email state
       ↓
    form submit
       ↓
    setSubscribed(true)
       ↓
    success UI

Žádná data persistence ani API.

---

## 21. Build graph

    source
      ↓
    Vite
      ├── React transform
      ├── TypeScript/JS bundling
      └── static asset handling
      ↓
    dist/

public/.nojekyll → dist/.nojekyll  
public/styles.css → dist/styles.css

---

## 22. GitHub Pages graph

    push main
       ↓
    Actions
       ↓
    checkout
       ↓
    Node 22
       ↓
    npm install
       ↓
    npm run build
       ↓
    dist
       ↓
    upload-pages-artifact
       ↓
    deploy-pages
       ↓
    GitHub Pages

---

## 23. Base path graph

    VITE_BASE_PATH
          ↓
    explicit override
          ↓
    otherwise
    GITHUB_ACTIONS
          ↓
    GITHUB_REPOSITORY
          ↓
    /repository-name/

Lokální výchozí base:

/

Pro aktuální repository:

/kaap/

---

## 24. Directory ownership rules

### src/data

Only content data.

### src/config

Reusable configuration metadata.

### src/hooks

State abstraction and persistence.

### src/components

Presentation/UI behavior.

### src/App.tsx

Cross-feature orchestration.

### public

Static publicly served assets.

### .github/workflows

Automation.

---

## 25. Adding a post

Místo:

src/data/posts.ts

Potřebuje:

- unikátní id,
- title,
- excerpt,
- category,
- date,
- readTime.

Pořadí pole určuje pořadí listing renderu.

---

## 26. Changing the Post model

Změna Post type může ovlivnit:

- posts.ts,
- App.tsx,
- PostCard.tsx,
- PostPage.tsx,
- search logic.

Při přidání pole vždy zkontroluj, zda má být součástí search indexu a detailu.

---

## 27. Adding persistent preference

Persistentní preference patří do usePreferences.ts.

Nedělej pouze lokální useState v komponentě, pokud má hodnota přežít reload.

Preference boundary:

App ↔ usePreferences ↔ localStorage

---

## 28. Adding navigation control

Nová hlavní navigační akce musí mít:

1. nav control v App.tsx,
2. jasný aktivní state,
3. keyboard/focus behavior,
4. odpovídající panel pouze pokud je nutný,
5. mobile behavior,
6. případné CSS.

Externí odkazy patří do footeru, ne do hlavního navbaru.

---

## 29. Routing growth trigger

Současný query-param model je vhodný pro jednoduchý detail postu.

Pokud přibudou:

- archive,
- category,
- tags,
- authors,
- search route,
- multiple content types,

vytvoř explicitní routing layer.

Nepřidávej všechny nové routes do jediného URL parseru v App.tsx.

---

## 30. Content growth trigger

Současný Post model je malý:

- id,
- title,
- excerpt,
- category,
- date,
- readTime.

Při přidání body:

    Post
      ├── metadata
      └── content

PostPage se pak stane plnohodnotným content rendererem.

---

## 31. Accessibility boundaries

Accessibility je distribuována podle ownership:

App.tsx:

- aria labels,
- expanded,
- focus/search behavior,
- keyboard behavior.

navbar settings:

- dialog,
- modal semantics,
- pressed states.

CSS:

- focus-visible visuals.

Budoucí accessibility opravu dělej u komponenty, která vlastní daný behavior.

---

## 32. Safe change zones

Nízké riziko:

- nový post,
- copy,
- existující token value,
- readTime,
- category.

Střední riziko:

- nový view mode,
- navbar panel,
- settings option,
- PostPage markup.

Vyšší riziko:

- routing,
- vite base path,
- CI workflow,
- global CSS architecture,
- package manager.

---

## 33. Architectural invariants

Bez vědomého redesignu zachovat:

- static-first,
- local content data,
- App jako orchestration root,
- PostCard jako presentation switch,
- usePreferences jako persistence boundary,
- query-param detail,
- global CSS token system,
- GitHub Pages deployment.

---

## 34. Refactor triggers

### Router

Až route count naroste.

### Content service

Až data nebudou lokální.

### App split

Až cross-feature state začne být obtížně čitelný.

### Search index

Až dataset výrazně naroste.

### Design token split

Až se tokens začnou sdílet mezi více stylesheety.

---

## 35. Recommended future structure

Při významném růstu je možné použít:

    src/
    ├── app/
    │   ├── App.tsx
    │   └── routing/
    ├── components/
    │   ├── navigation/
    │   ├── posts/
    │   ├── navigation/
    │   └── newsletter/
    ├── config/
    ├── content/
    ├── hooks/
    ├── lib/
    └── styles/

Pro současnou velikost projektu by tento split byl zbytečná abstrakce.

---

## 36. Feature matrix

| Feature | App | Component | Data | Hook | Config | CSS |
|---|---:|---:|---:|---:|---:|---:|
| listing | ✓ | ✓ | ✓ |  | ✓ | ✓ |
| detail | ✓ | ✓ | ✓ |  |  | ✓ |
| search | ✓ |  | ✓ |  |  | ✓ |
| theme | ✓ | ✓ |  | ✓ |  | ✓ |
| view mode | ✓ | ✓ |  | ✓ | ✓ | ✓ |
| settings | ✓ |  |  | ✓ | ✓ | ✓ |
| navbar panel | ✓ |  |  |  |  | ✓ |

| newsletter | ✓ |  |  |  |  | ✓ |
| Pages deployment |  |  |  |  |  |  |

---

## 37. Change propagation

### Theme token změna

styles.css
  ↓
token
  ↓
všechny classes používající var()

### Post model změna

posts.ts
  ↓
App
  ↓
PostCard
  ↓
PostPage
  ↓
search

### View mode změna

viewModes.ts
  ↓
navbar settings
  ↓
App
  ↓
PostCard
  ↓
CSS

---

## 38. Final rule

Při přidávání nové věci se ptej:

    je to data?
      → src/data

    je to config?
      → src/config

    je to persistentní preference?
      → src/hooks

    je to presentation?
      → src/components

    je to cross-feature orchestrace?
      → src/App.tsx

    je to visual system?
      → public/styles.css

    je to build/deploy?
      → vite.config.ts / workflow

To je základní structure map projektu.
