# Promo video — soft-gradient product style

60-second 1920×1080 promo built in Remotion: a dark orb intro, a wordmark on a blurred green
gradient, typed headlines, frosted chat UI, thin connector lines, black action pills, toggle
cards and an end card. The storyline, copy, logo mark, icons and music are original.

Finished render: `out/promo.mp4`.

## Change the words

All on-screen copy is in one place: `script` in `src/theme.ts` (brand name, product name,
questions, chat lines, rules, tagline, CTA). Colours and orb palettes are in the same file.

## Render

```
npm install
npm run render            # makes public/soundtrack.wav, then out/promo.mp4
npm run studio            # live preview / scrubbing
npm run stills -- 60 600  # quick check frames into out/stills
```

In a container that already has Playwright's Chromium, point Remotion at it instead of
downloading one:
`REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell npm run render`

## Shot list (frames @30fps)

| Frames | Shot |
|---|---|
| 0–150 | Dark open — orb lit out of black, orbit lines, opening line |
| 150–275 | Question storm — shopper questions pulled into the orb |
| 265–365 | Brand reveal on the green field |
| 360–513 | Typed headline → prompt box |
| 505–695 | Chat demo in a frosted panel |
| 688–843 | Store data flows into the orb |
| 835–963 | Greetings in four languages |
| 955–1097 | One line splits into five channels |
| 1090–1232 | Rules toggles |
| 1225–1370 | Orb rides a curve, insights pop up |
| 1362–1532 | Two rings merge into one orb |
| 1525–1800 | End card |

Timing lives in `src/Promo.tsx`; each scene is a component in `src/scenes.tsx`.
The music is synthesised by `tools/soundtrack.py` and follows the same cut times.

---

# Curiothek reel — vertical 1080×1920

44-second Instagram/Telegram reel for the studio, made from the real Rezinka card set:
supplier photos (`public/curiothek/before`) vs. the finished Curiothek slides
(`public/curiothek/after`). Finished render: `out/curiothek-reel.mp4`.

```
npm run reel                               # soundtrack + out/curiothek-reel.mp4
COMP=CuriothekReel npm run stills -- 300 600 # check frames
```

Words on screen: `copy` in `src/reel/copy.ts`. Scenes: `src/reel/scenes.tsx`.
Timing: `src/reel/Reel.tsx`, mirrored in `tools/reel_soundtrack.py` (music + every sound effect).
All readable text stays between y=160 and y=1540 (Instagram covers the top and bottom).

| Frames | Shot | Feeling |
|---|---|---|
| 0–80 | "Your product is great." on black, orb lit | confidence |
| 80–235 | Feed full of the same supplier photo; a thumb flicks past, colour drains | frustration |
| 235–330 | Orb drops in with a bounce — "Let's fix that." — and swallows the feed | hope |
| 318–413 | CURIOTHEK, the O is the orb | the turn |
| 410–605 | Design canvas: select the photo, wipe to the finished cover, impact | wow |
| 605–780 | Shrinks to thumbnail size, then dives into "11 в 1" and "56,7 кг" | trust |
| 780–945 | Eight slides flash past, then fan out | pride |
| 945–1120 | Same feed — the Curiothek card stops the scroll, gets tapped | payoff |
| 1110–1320 | End card: tagline, "Order your card set", link in bio | call to action |
