# Composition sketches — plan (ATHLETIX shaker, 8 slides)

Purpose: each sketch is attached to ChatGPT image generation as a **layout guide** (camera, framing,
object placement, light, empty space). The client adds all text and design elements later, so a sketch
contains **no slide text, no badges, no arrows, no UI** — only the scene. The only letters allowed are the
product's own print (ATHLETIX logo, ml/oz scale) drawn by the kit.

Canvas **1536 × 2048** (3:4). File pair per sketch: `sketches/SNN_name.html` → `sketches/SNN_name.png`.
Render: `cd /home/user/claude-max/shaker && node tools/shot.mjs sketches/SNN_name.html sketches/SNN_name.png 1536 2048`
Kit: `sketches/lib/kit.js` (preview of every component: `sketches/lib/kit_preview.png`, code example:
`sketches/lib/kit_preview.html`). Pages link `../fonts/fonts.css` and `lib/kit.js`.

## Rules for every sketch

- Greyscale grey-box style from the kit: light seamless background, dark product, mid-grey props, soft
  contact shadows, highlight on the left = key light from upper left. Clean, readable at a glance.
- **Text-safe zone:** the top **470 px** (0–470) holds nothing but background on every sketch — the
  client's title goes there (same layout as the approved Rezinka slides). Each sketch below names one
  more free zone for facts.
- Product correct per `IDENTITY.md`: proportions from the kit, logo vertical bottom→top on the front,
  the right number of tiers, flip cap state as specified. Never draw parts that do not exist.
- The product is the hero: large, sharp, never cropped by the frame unless the plan says so.
- Margins: keep product and important props ≥ 64 px from the canvas edges (except deliberate bleed).

## The eight sketches

| # | File | Slide idea (client's text later) | Scene |
|---|---|---|---|
| S01 | `S01_oblozhka` | Cover: «Шейкер 4 в 1», 500 мл | **Hero.** Assembled shaker (cup + 2 tiers), cap closed, logo to camera, standing on white seamless. Low hero camera (slightly below mid-height, persp ≈ 0.06). Product big: ~65 % of canvas height, centred-left (cx ≈ 600). Small grounding props at its base only: the whisk disc leaning against the base on the left. **Free:** right column x 1000–1472 from y 900 down (stats). |
| S02 | `S02_komplekt` | «Что входит в набор» — 6 parts | **Knolling flat-lay, top-down** (persp 1 for discs). On white: the cup lying horizontally with the logo up (reads left→right), its lid detached; whisk disc; pill organizer (3 sections, empty); two storage containers (open, empty). Even grid, generous spacing, all parts fully visible. Content area y 520–1960. **Free:** small gaps beside each part for number markers. |
| S03 | `S03_ustroystvo` | «Как устроен» — exploded view, 4 в 1 | **Exploded vertical stack**, slightly elevated camera (persp ≈ 0.16): from top — lid (cap closed), whisk disc (tilted ellipse), cup (logo), short tier, tall bottom tier — on one vertical axis with even 40–70 px gaps. Column centred-left (cx ≈ 560), spanning y ≈ 500–1960. **Free:** right side x 960–1472 for callouts. |
| S04 | `S04_shkala` | «500 мл» — measuring scale | **Pouring close-up.** Compact cup with the lid off, **scale side to camera** (face 'scale'), large (w ≈ 620), centred-right (cx ≈ 900), bottom ≈ 1900. A plain glass carafe/bottle top-left pours a stream of milk into the cup; milk inside reaches ≈ the 200 ml mark. Eye-level camera. **Free:** left column x 64–520 from y 900 down. |
| S05 | `S05_venchik` | «Венчик-пружина — без комков» | **Insert the whisk.** Camera elevated ~35° (persp ≈ 0.42). Open compact cup (lid off) lower centre; the whisk disc hovering just above the opening, tilted, as if being dropped in; liquid with a little powder on top visible inside. A measuring scoop of protein powder lying on the floor right. **Free:** left-lower zone x 64–420. |
| S06 | `S06_otseki` | «Отсеки для протеина, таблеток и перекуса» | **Storage open.** Compact cup with lid on, logo to camera, standing back-left (cx ≈ 420). In front, on a diagonal from centre to right-front: container with protein powder, pill organizer with capsules (3 sections), container with almonds. Camera elevated ~25° (persp ≈ 0.30). All three fills clearly readable. **Free:** upper-right x 900–1472, y 470–900. |
| S07 | `S07_varianty` | «Сборный и разборный вариант» | **Two configurations side by side**, same scale, same baseline (by ≈ 1860), eye-level (persp ≈ 0.08): compact (left, cx ≈ 470) and assembled (right, cx ≈ 1066), both cap closed, logos to camera, w ≈ 340. **Free:** band between and below for labels; top zone as usual. |
| S08 | `S08_zal` | «Всегда с собой — в зал и в дорогу» | **Lifestyle, bright gym.** Assembled shaker standing on a light wooden gym bench at right-centre (cx ≈ 1000), logo to camera; folded towel beside it, a dumbbell on the floor in front-left; soft daylight from large windows on the left; background wall light and plain (blurred in the final photo). Eye-level with the bench top. **Free:** left half x 64–620 from y 470 to 1300. |
