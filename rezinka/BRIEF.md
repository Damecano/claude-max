# Rezinka — Uzum product-card slides (brief)

8 marketplace slides (Uzum), **1080×1440 PNG**, Russian copy, **no brand / no logo**.
Product: set of 5 tube resistance bands + accessories, **11 items**.
Studio: Curiothek (client is an Uzum seller).

## Project layout (root = `/home/user/claude-max/rezinka`)

```
src/NN_*.jpg        product photos, 1536×2048 (3:4) — the ONLY images allowed on slides
fonts/fonts.css     local web fonts (Cyrillic): Unbounded, Onest, Manrope, Oswald, Inter Tight (ital),
                    Inter, JetBrains Mono, Golos Text, Playfair Display (ital), Russo One, Rubik, Montserrat
data/specs.json     all numbers (kg, cm). Bind with <b data-spec="key"></b>
lib/bind.js         fills [data-spec]; include at end of <body>
tools/render.mjs    node tools/render.mjs <slidesDir> <outDir> [--only 01,03]  -> PNG + QA warnings
tools/contact.py    python3 tools/contact.py <outDir>  -> _contact.jpg (1/4 size), _thumbs.jpg (phone-grid size)
```

Slide file = `NN_name.html` (one self-contained page, 1080×1440, `html,body{margin:0;width:1080px;height:1440px;overflow:hidden}`),
links `fonts/fonts.css` and the shared `base.css` by relative path, loads `lib/bind.js` last.
Photos are referenced relatively from `src/`. Never edit `src/`, `fonts/`, `lib/`, `tools/`, `data/`.

QA hooks the renderer checks: put `data-fit` on fixed-size text boxes (warns on overflow) and
`data-qa="label"` on callout labels (warns when two overlap). It also warns on text outside the canvas,
broken images, failed fonts, JS errors.

**Always look at your renders** (Read the PNG) and at `_thumbs.jpg` — shoppers first see the cover at ~170 px wide.

## Style — «белый ATHLETIX» (white athletic)

The client asked for a white «ATHLETIX» style: a premium sports-brand look (think Nike / Gymshark / On
campaign infographics), on a **white** base.

- Pure white background, black ultra-bold type, big numerals, sharp geometry, a sense of motion
  (slant, diagonal cut, speed-rule) used with restraint. Lots of air. **The product is the hero.**
- Curiothek rules: monochrome base + at most ONE accent; extreme scale contrast (headline : meta ≥ 4:1);
  monospaced micro-metadata (index `01/08`, section tag); numbered modules; color only when it means
  something — the five band colors are the data palette for load levels.
- Banned: purple/blue mesh gradients, glassmorphism cards, generic rounded 3-card grids, emoji, clip-art
  icons, fake badges («хит», «гарантия», «№1»), stock 3D blobs, drop-shadow soup.
- Consistent chrome on all 8 slides (same margins, index position, title position/scale) so the set reads as one system.

Legibility (marketplace, mostly phones): margins ≥ 56 px; headline ≥ 96 px on the cover / ≥ 80 px elsewhere;
any fact text ≥ 34 px; smallest meta ≥ 22 px; nothing important on the product; contrast AAA for text.
**2–4 facts per slide** (slide 8: the five dimensions).

## Photos — technique

- White-background photos (01, 02, 03, 06, 07, 08): page background `#fff` and `mix-blend-mode: multiply`
  on the `<img>` so the photo's near-white (#FBFBFB–#FEFEFE, slight vignette) melts into the page — no visible
  photo edge. Photo 03 has a soft grey wall gradient toward the right/bottom — check for a visible edge.
- 04 (door) and 05 (man) are full scenes (grey wall, floor): use them full-bleed or in a hard-edged frame;
  put text on solid white/black blocks, never directly on busy areas.
- Scale/crop/position photos freely, never distort, recolor, or paint over the product. Insets/crops of the
  same photos are fine (e.g. ankle strap with D-ring from `08_razmery.jpg` or `02_komplekt.jpg`).
- Photo contents:
  - 01: tubes coiled in a ring (yellow inside → green → red → blue → black outside), 5 carabiners at right,
    2 foam handles hanging below. Empty white at top (~19%) and below the handles.
  - 02: flat-lay. Row 1: 5 coiled bands yellow, red, blue, green, black. Row 2: 2 handles, 2 ankle straps
    (D-ring), door anchor. Row 3: printed box, drawstring bag, exercise-guide sheet. Top ~27% empty.
  - 03: 5 short bands hanging from a chrome bar, left→right **yellow, red, blue, green, black**. Top ~25% and
    bottom ~17% empty.
  - 04: man from behind, door anchor at top of a white door, red + blue bands to handles, room interior.
  - 05: man standing on bands, arms out (lateral raise), red + blue bands, light studio.
  - 06: macro: foam handle with strap, metal swivel carabiner, red band with black reinforced end cap.
  - 07: drawstring bag with 5 band loops sticking out, printed box behind right, guide sheet front-right.
  - 08: 5 straight bands top (yellow, red, blue, green, black, carabiners both ends), below: 2 handles,
    ankle strap (D-ring), door anchor.

## Facts (verified from the supplier's original photos — use ONLY these)

- 11 items: 5 bands, 2 handles, 2 ankle straps (with metal D-ring), 1 door anchor, 1 bag. Plus an exercise
  guide sheet (not counted). The printed box appears in our photos but NOT in the supplier photos —
  **never mention a box/gift packaging in text**.
- Resistance: supplier states **15–35 lb**. Converted (assumed 5 lb steps): yellow 6,8 кг · green 9,1 ·
  red 11,3 · blue 13,6 · black 15,9 · all together 56,7 кг. Level order from the supplier guide:
  yellow extra light → green light → red medium → blue heavy → black extra heavy.
  Always bind numbers from specs (`res_yellow_kg` … `res_black_kg`, `res_total_kg`) — never hardcode kg.
- Features: metal carabiners; reinforced connection (end caps); foam handles; ankle strap with D-ring;
  door anchor («Safety door buckle»).
- Sizes (cm): band 120; handle 13 × 15; ankle strap 41 × 5,8; door anchor 23,5; bag 28 × 24,5
  (keys: `len_band_cm`, `handle_w_cm`, `handle_h_cm`, `ankle_l_cm`, `ankle_w_cm`, `anchor_l_cm`, `bag_w_cm`, `bag_h_cm`).
- Russian decimals with comma; «×» for dimensions; non-breaking space between number and unit (`56,7&nbsp;кг`).

## Copy deck (Russian — use verbatim; line breaks are yours)

Section tags for chrome (mono, small): 01 НАБОР · 02 КОМПЛЕКТ · 03 НАГРУЗКА · 04 ДВЕРНОЙ ЯКОРЬ ·
05 ТРЕНИРОВКИ · 06 ДЕТАЛИ · 07 ГДЕ УГОДНО · 08 РАЗМЕРЫ. Product line where useful: «Набор эспандеров».

**01 · 01_oblozhka.jpg — cover**
- USP headline: «Спортзал у вас дома»
- «11 в 1» (biggest number on the slide)
- «5 уровней нагрузки»
- «До {res_total_kg} кг» (total load) — e.g. «Общая нагрузка до 56,7 кг»
- eyebrow / product type: «Набор эспандеров»

**02 · 02_komplekt.jpg — kit**
- Title: «Что входит в набор»
- Number markers ON the photo, reading order: 1–5 bands · 6–7 handles · 8–9 ankle straps · 10 door anchor · 11 bag
- Legend: «1–5 Эспандеры» · «6–7 Ручки» · «8–9 Манжеты на лодыжки» · «10 Дверной якорь» · «11 Сумка»
- Small: «+ инструкция с упражнениями». (Do not number or name the box.)

**03 · 03_nagruzka.jpg — load**
- Title: «5 уровней нагрузки»
- Under each band, in photo order (yellow, red, blue, green, black): «{kg} кг» + level word:
  жёлтый «очень лёгкая» · красный «средняя» · синий «тяжёлая» · зелёный «лёгкая» · чёрный «очень тяжёлая»
- Optional mini-scale «легче → тяжелее» in true order (yellow, green, red, blue, black)
- Key line: «Соединяйте вместе — до {res_total_kg} кг»

**04 · 04_dver.jpg — door anchor**
- Title: «Дверной якорь»
- Sub: «Любая дверь превращается в тренажёр»
- 3 steps: «1 Вложите якорь между дверью и косяком» · «2 Плотно закройте дверь» · «3 Проденьте эспандер и пристегните ручки»

**05 · 05_myshtsy.jpg — muscles**
- Title: «Все группы мышц»
- Six tags: «Руки» · «Плечи» · «Спина» · «Грудь» · «Ноги» · «Ягодицы»
- Optional small: «Инструкция с упражнениями в комплекте»

**06 · 06_detali.jpg — details**
- Title: «Продуманные детали»
- 4 callouts: «Металлический карабин» · «Усиленное соединение» · «Мягкая ручка» · «Манжета с D-кольцом»
  (short sub-lines allowed only if purely descriptive, e.g. «быстро меняете эспандер» for the carabiner;
  the D-ring strap is not in photo 06 — use an inset crop from 08 or 02)

**07 · 07_podarok.jpg — anywhere**
- Title: «Тренируйтесь где угодно»
- Four places: «Дома» · «В зале» · «В поездке» · «На улице»
- Key line: «Весь набор помещается в одну сумку» (+ optional «Сумка {bag_w_cm} × {bag_h_cm} см»)

**08 · 08_razmery.jpg — sizes**
- Title: «Размеры»
- Dimension lines/labels: «Эспандер 120 см» · «Ручка 13 × 15 см» · «Манжета 41 × 5,8 см» · «Дверной якорь 23,5 см» ·
  «Сумка 28 × 24,5 см» (bag is not in photo 08 — text only or small inset from 07/02)
