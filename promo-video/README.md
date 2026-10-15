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
