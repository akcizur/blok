# Design Rules

## 1. Role dokumentu

Toto je vizuální pravidlovník pro Dimple / KAAP.

Designový základ:

**minimal editorial interface + monochrome utility UI + compact navigation + generous whitespace**

Nová UI část nesmí působit jako samostatný dashboard přilepený k existující stránce.

---

## 2. Design DNA

Primární vlastnosti:

1. monochromatický,
2. kompaktní,
3. editorialní,
4. typografický,
5. klidný,
6. funkční,
7. nízký vizuální šum.

Sekundární vlastnosti:

- jemné borders,
- velmi malé ikony,
- omezené radius,
- metadata v Fragment Mono,
- krátké mikroanimace,
- minimum stínů.

---

## 3. Barevná pravidla

Používej existující CSS tokeny.

### Light

- --bg: #fff
- --surface: #fafafa
- --surface-strong: #f5f5f5
- --surface-dark: #fff
- --text: #171717
- --text-muted: #525252
- --text-soft: #737373
- --text-faint: #a3a3a3
- --text-subtle: #d4d4d4
- --border: #ebebeb
- --border-soft: #f5f5f5
- --border-strong: #e5e5e5
- --accent: #000
- --accent-contrast: #fff

### Dark

- --bg: #0a0a0a
- --surface: #0d0d0d
- --surface-strong: #141414
- --surface-dark: #111
- --text: #f5f5f5
- --text-muted: #a3a3a3
- --text-soft: #737373
- --text-faint: #525252
- --text-subtle: #404040
- --border: #1f1f1f
- --border-soft: #1a1a1a
- --border-strong: #262626
- --accent: #fff
- --accent-contrast: #000

### Rule

Nepřidávej novou brand barvu bez vědomého redesignu.

Komunikační hierarchie se řeší:

- kontrastem,
- background shift,
- border,
- opacity,
- typography,
- icon.

---

## 4. Monochrome first

Dimple nemá běžný barevný accent systém.

Preferuj:

transparent → surface-strong → border-strong

Ne:

blue → purple → gradient → glow.

Barva je výjimka. Černá, bílá a neutrální šedé jsou normální stav.

---

## 5. Typografie

### Google Sans

Použití:

- body,
- headings,
- brand,
- nav,
- forms,
- buttons.

### Fragment Mono

Použití:

- date,
- category,
- kicker,
- read time,
- metadata,
- jemná editorial označení.

Fragment Mono nesmí nahradit běžný body text.

---

## 6. Typografická hierarchie

### Hero

Aktuální reference:

- 26–40px clamp,
- weight 800,
- tracking přibližně -0.03em,
- line-height 1.1.

### List title

- 18px,
- weight 700,
- line-height 1.3.

### Grid title

- 15px,
- weight 700,
- line-height 1.35.

### Magazine featured

- 20px,
- weight 700.

### Detail title

- 32–54px clamp,
- weight 700,
- tracking přibližně -0.045em,
- line-height 1.03.

### Standard excerpt

14px / 1.7.

### Hero copy

15px / 1.7.

### Detail excerpt

18px / 1.7.

---

## 7. Metadata

Metadata mají být vizuálně sekundární.

Typický pattern:

11px + Fragment Mono + weight 400.

Datum používá extra-small treatment kolem 9px.

Datum nemá konkurovat title.

---

## 8. Layout width

Hlavní content width = 768px.

To je významný identity anchor.

Nová hlavní sekce nemá svévolně používat:

- 1200px,
- 1440px,
- full dashboard canvas.

Široká plocha je výjimka.

---

## 9. Spacing

Desktop reference:

- header 56px,
- horizontal padding 24px,
- main vertical padding 48px,
- hero bottom 40px,
- list gap 36px,
- newsletter top 64px.

Mobile:

- horizontal 16px,
- main top 36px,
- main bottom 44px.

Whitespace je součást designu.

Nezahušťuj layout pouze kvůli využití prostoru.

---

## 10. Radius

Aktuální language:

- icon controls = circle,
- search input = 10px,
- navbar settings options = 7px,
- small chip = 6px,
- input = 10px,
- post card = 16px,
- newsletter = 20px.

Pill není součástí hlavní navigace. Search je inline field přímo v navbar panelu.

---

## 11. Header

Header je:

- sticky,
- 56px,
- blur,
- translucent,
- thin border.

Není to hero panel.

Má poskytovat navigaci, ne soupeřit s obsahem.

---

## 12. Navigation controls

Desktop:

36 × 36px.

Mobile:

32 × 32px.

Icon:

15px, stroke 2.

Default:

- transparent,
- soft text.

Hover/focus/active:

- surface-strong,
- border-strong,
- text.

Aktivace nemá způsobit velký layout shift.

---

## 13. Direct navbar controls

Navbar je jediná navigační vrstva. Neexistuje Settings menu ani subnavbar.

Hlavní řádek obsahuje:

- Dimple brand,
- Layout,
- Theme,
- Search.

### Layout

Jeden kruhový button.

Kliknutí cyklicky mění:

List → Grid → Magazine → Compact → List

Uvnitř je pouze ikona aktuálního layoutu.

### Theme

Jeden kruhový button.

Kliknutí přepíná:

Light ↔ Dark

Uvnitř je pouze ikona aktuálního theme.

### Search

Jeden kruhový button. Kliknutí otevře search field jako overlay pod 56px navbar.

### Removed controls

- Settings menu,
- subnavbar,
- Language button,
- Scale button.

### Interaction rule

Všechny navbar actions jsou click-only. Hover pouze mění vizuální stav, nikdy nepřepíná funkci ani neotevírá navigační obsah.

## 14. Hover

Hover je mikrointerakce.

Preferuj:

- opacity,
- background,
- border,
- color,
- malý translate.

Post hover aktuálně používá opacity.

Nepřidávej:

- glow,
- heavy shadow,
- scale 1.05,
- permanent motion,
- hover jako mechanismus pro přepínání navigačního obsahu.

---

## 15. Focus

Focus musí být viditelný.

Standard:

outline 2px currentColor + offset.

Focus nesmí být odstraněn jen proto, že „kazí čistý design“.

---

## 16. Shadows

Shadow je řízená výjimka.

Používá se primárně pro modal elevation.

Běžný post card shadow nemá být standard.

---

## 17. Borders

Borders jsou primární separator.

Používej:

- --border,
- --border-soft,
- --border-strong.

Preferuj 1px.

Nepoužívej border na každém řádku, pokud již existuje jiný jasný separator.

---

## 18. Surface hierarchy

Používej:

bg
  ↓
surface
  ↓
surface-strong
  ↓
accent active

To vytváří hloubku bez barev a heavy shadow.

---

## 19. List mode

Základní editorialní forma:

TITLE
EXCERPT
----------------
CATEGORY       DATE · READ TIME

Nemá být card.

Nemá mít thumbnail.

Nemá mít CTA button.

---

## 20. Grid mode

Grid card může mít:

- 1px border,
- 16px radius,
- 20px padding,
- subtle surface.

Nemá se měnit na dashboard widget.

---

## 21. Magazine mode

První post je featured.

Featured:

- větší padding,
- border,
- surface,
- větší title,
- excerpt.

Ostatní:

- jednodušší rows,
- border-bottom,
- menší title.

Hierarchie vzniká velikostí a spacingem, nikoli barvou.

---

## 22. Compact mode

Model:

CATEGORY   TITLE....................... DATE

Vlastnosti:

- nowrap title,
- ellipsis,
- malé řádkové padding,
- bottom border.

Compact musí být skutečně compact.

---

## 23. Newsletter

Newsletter je jeden z největších surface blocks.

Desktop reference:

- margin-top 64px,
- padding 40px,
- radius 20px,
- border.

Mobile:

- smaller padding.

Input:

- 10px radius,
- border,
- surface-dark.

Submit:

- 36px circle,
- accent background.

Newsletter nemá převzít vizuální prvenství nad hero a posty.

---

## 24. Footer links

Web, Mail a GitHub nejsou součástí hlavního navbaru.

Ve footeru používají:

- 32 × 32px icon control,
- kruhový hit area,
- 15px icon,
- transparent default,
- surface-strong + border-strong on hover/focus.

Footer links jsou čistě navigační. Nemají vlastní contextual panel.

---

## 25. Iconography

Primární sada:

Lucide React.

Standard:

15px, stroke 2.

Ikony mají být malé a opticky konzistentní.

Nepřidávej náhodné ikonové styly z jiných sad bez důvodu.

---

## 26. Brand

Dimple header brand:

- 16px,
- weight 800,
- uppercase,
- tracking přibližně .08em.

Bez gradientu.

Bez velké logomark ilustrace.

---

## 27. Animace

Utility animations:

cca 0.15s.

Navbar panel:

cca 0.18s.

Theme:

cca 0.3s.

Používej:

- opacity,
- color,
- background-color,
- border-color,
- transform.

Nepřidávej permanentní loops.

---

## 28. Responsive rules

Breakpoint 980px:

header actions mohou scrollovat.

Breakpoint 640px:

- padding 16px,
- buttons 32px,
- compact navbar panel,
- helper text may hide,
- smaller newsletter,
- responsive title.

Mobile nesmí získat horizontální overflow kvůli desktop spacing.

---

## 29. UI scale

Aplikace musí fungovat při:

- 90%,
- 100%,
- 110%.

Nový komponent nesmí při scale:

- překrývat obsah,
- vyčnívat,
- rozbíjet focus ring,
- vytvářet nechtěný horizontal overflow.

---

## 30. Copy

UI text má být:

- krátký,
- přímý,
- klidný,
- utilitární.

Preferuj jasné labels.

Vyhýbej se marketingovým claimům a dekorativnímu textu bez funkce.

---

## 31. Density

Stránka má být vzdušná.

Základní pořadí:

hero
→ posts header
→ posts
→ newsletter
→ footer

Nepřidávej panely jen proto, že je volné místo.

---

## 32. Anti-patterns

Bez vědomého redesignu nepřidávat:

- gradient backgrounds,
- neon accent,
- glassmorphism,
- heavy shadows,
- giant icon cards,
- dashboard sidebar,
- excessive pills,
- badge soup,
- card-on-card nesting,
- floating CTA clusters,
- permanent decorative animations.

---

## 33. Design tokens rule

Rozhodovací pořadí:

1. existující token,
2. existující spacing,
3. existující component pattern,
4. malá lokální odchylka,
5. nový token až při opakovaném použití.

Nevytvářej druhý paralelní design systém uvnitř projektu.

---

## 34. Component review

Každá nová komponenta musí mít jasnou odpověď na:

- jakou barvu/token používá,
- jakou typografii používá,
- jaký spacing pattern používá,
- proč má daný radius,
- zda skutečně potřebuje shadow,
- jak reaguje na hover/focus,
- co se stane na mobile,
- co se stane v dark theme,
- co se stane při 90/100/110%.

---

## 35. Priority

Při konfliktu:

1. clarity,
2. consistency,
3. accessibility,
4. density,
5. decoration.

---

## 36. Final visual test

    [ ] monochrome
    [ ] 768px discipline
    [ ] Google Sans role
    [ ] Fragment Mono metadata
    [ ] 1px borders
    [ ] small icons
    [ ] visible focus
    [ ] no unnecessary shadow
    [ ] no unnecessary color
    [ ] dark works
    [ ] mobile works
    [ ] 90/100/110 works
