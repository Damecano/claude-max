// Grey-box sketch kit for the ATHLETIX shaker compositions (3:4, 1536×2048).
// Every function returns an SVG markup string; compose them inside <svg id="scene">.
// Proportions are measured from the real product photos (ref/real_*.jpg):
//   cup body 1.40·w, lid ring 0.30·w (1.07·w wide), dome 0.14·w, short tier 0.40·w, tall tier 0.80·w.
// Palette is greyscale on purpose: the sketch fixes layout, camera and light — not colour.

const K = {
  bg: '#ECECEA', floor: '#DFDFDC', ink: '#141416', body: '#2C2D31', bodyHi: '#5C5E64', lid: '#1B1C1F',
  rim: '#0D0D0F', print: '#F4F6F8', panel: '#6B6D72', steel: '#C9CCD0', steelDk: '#8E9297',
  prop: '#A9A9A6', propDk: '#8A8A87', propLt: '#C9C9C6', shadow: 'rgba(0,0,0,.22)',
};

let _id = 0;
const uid = p => `${p}${++_id}`;
const r2 = n => Math.round(n * 100) / 100;

// ---------- defs (filters/gradients) — call once, put inside <svg> ----------
function defs() {
  return `<defs>
    <filter id="blur-s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="blur-l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="36"/></filter>
    <linearGradient id="gloss" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".35"/>
      <stop offset=".18" stop-color="#fff" stop-opacity=".16"/>
      <stop offset=".27" stop-color="#fff" stop-opacity=".30"/>
      <stop offset=".36" stop-color="#fff" stop-opacity=".06"/>
      <stop offset=".78" stop-color="#000" stop-opacity=".05"/>
      <stop offset="1" stop-color="#000" stop-opacity=".45"/>
    </linearGradient>
    <linearGradient id="steel" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${K.steelDk}"/><stop offset=".5" stop-color="#EEF0F2"/><stop offset="1" stop-color="${K.steelDk}"/>
    </linearGradient>
    <linearGradient id="studio" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#F3F3F1"/><stop offset=".62" stop-color="${K.bg}"/><stop offset="1" stop-color="${K.floor}"/>
    </linearGradient>
  </defs>`;
}

// ---------- environment ----------
// Seamless studio sweep (no horizon line) — the default «white ATHLETIX» set.
function studio(W = 1536, H = 2048) {
  return `<rect width="${W}" height="${H}" fill="url(#studio)"/>`;
}
// Room / gym: back wall + floor with a horizon at y.
function room(horizonY, W = 1536, H = 2048, wall = '#E7E7E4', floor = '#D6D6D2') {
  return `<rect width="${W}" height="${horizonY}" fill="${wall}"/>
          <rect y="${horizonY}" width="${W}" height="${H - horizonY}" fill="${floor}"/>
          <rect y="${horizonY - 2}" width="${W}" height="4" fill="#C8C8C4"/>`;
}
// Soft contact shadow under an object standing at (cx, by) with footprint width w.
function shadow(cx, by, w, k = 1) {
  return `<ellipse cx="${cx}" cy="${by}" rx="${r2(w * 0.62 * k)}" ry="${r2(w * 0.09 * k)}" fill="${K.shadow}" filter="url(#blur-s)"/>`;
}

// ---------- primitive: vertical cylinder segment seen slightly from above ----------
// top edge at y, height h, width w, persp = ellipse ry / rx (0 = pure front view).
function seg(cx, y, w, h, persp, fill, { gloss = true, topCap = false, topFill = null } = {}) {
  const rx = w / 2, ry = rx * persp, x = cx - rx;
  let s = `<path d="M${r2(x)},${r2(y)} L${r2(x)},${r2(y + h)} A${r2(rx)},${r2(ry)} 0 0 0 ${r2(x + w)},${r2(y + h)} L${r2(x + w)},${r2(y)} Z" fill="${fill}"/>`;
  if (gloss) s += `<path d="M${r2(x)},${r2(y)} L${r2(x)},${r2(y + h)} A${r2(rx)},${r2(ry)} 0 0 0 ${r2(x + w)},${r2(y + h)} L${r2(x + w)},${r2(y)} Z" fill="url(#gloss)"/>`;
  if (topCap) s += `<ellipse cx="${cx}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${topFill || fill}"/>`;
  return s;
}
const seam = (cx, y, w, persp) => `<path d="M${r2(cx - w / 2)},${r2(y)} A${r2(w / 2)},${r2(w / 2 * persp)} 0 0 0 ${r2(cx + w / 2)},${r2(y)}" fill="none" stroke="${K.rim}" stroke-width="${r2(Math.max(2, w * 0.012))}"/>`;

// ---------- print on the cup front ----------
function logo(cx, y, w, h) {
  // ATHLETIX vertical, reading bottom→top, centred, ~78% of the cup height.
  const len = h * 0.78, fs = w * 0.19, cy = y + h * 0.52;
  return `<text x="0" y="0" transform="translate(${r2(cx + fs * 0.36)},${r2(cy)}) rotate(-90)" text-anchor="middle"
            font-family="Montserrat" font-weight="800" font-size="${r2(fs)}" fill="${K.print}"
            textLength="${r2(len)}" lengthAdjust="spacingAndGlyphs">ATHLETIX</text>`;
}
function scale(cx, y, w, h) {
  // ml 100–500 left of the spine, oz 4–16 right — as photo C.
  const top = y + h * 0.20, bot = y + h * 0.86, x = cx + w * 0.02, sw = Math.max(2, w * 0.012), fs = w * 0.07;
  let s = `<g stroke="${K.print}" stroke-width="${r2(sw)}" fill="none"><path d="M${r2(x - w * 0.06)},${r2(top)} H${r2(x)} V${r2(bot)} H${r2(x - w * 0.08)}"/>`;
  const mls = [500, 400, 300, 200, 100];
  mls.forEach((v, i) => { const yy = top + (bot - top) * i / 4; s += `<path d="M${r2(x - w * 0.07)},${r2(yy)} H${r2(x)}"/>`; });
  [16, 12, 8, 4].forEach(v => { const yy = top + (bot - top) * (1 - (v * 29.57 - 100) / 400); s += `<path d="M${r2(x)},${r2(yy)} H${r2(x + w * 0.07)}"/>`; });
  s += `</g><g fill="${K.print}" font-family="Rubik" font-weight="500" font-size="${r2(fs)}">`;
  mls.forEach((v, i) => { const yy = top + (bot - top) * i / 4; s += `<text x="${r2(x - w * 0.09)}" y="${r2(yy + fs * 0.35)}" text-anchor="end">${v}</text>`; });
  [16, 12, 8, 4].forEach(v => { const yy = top + (bot - top) * (1 - (v * 29.57 - 100) / 400); s += `<text x="${r2(x + w * 0.09)}" y="${r2(yy + fs * 0.35)}">${v}</text>`; });
  s += `</g>`;
  return s;
}
function sidePanel(cx, y, w, h) {
  // matte graphite stepped insert, narrowing downward, 6 steps
  const top = y + h * 0.04, stepH = h * 0.13, base = w * 0.44;
  let s = '';
  for (let i = 0; i < 6; i++) {
    const ww = base * (1 - i * 0.11), xx = cx - w * 0.02 - ww / 2 + i * w * 0.012;
    s += `<rect x="${r2(xx)}" y="${r2(top + i * stepH)}" width="${r2(ww)}" height="${r2(stepH - 4)}" fill="${K.panel}" opacity=".9"/>`;
  }
  return s;
}

// ---------- lid (ring + dome + flip cap) ----------
function lid(cx, ringY, w, persp, cap = 'closed') {
  // ringY = bottom of the lid ring (= top of the cup). Returns markup and the top y.
  const rw = w * 1.07, rh = w * 0.30, dw = w * 0.86, dh = w * 0.14;
  let s = seg(cx, ringY - rh, rw, rh, persp, K.lid);
  s += seam(cx, ringY - rh * 0.42, rw, persp);                          // groove in the ring
  const dTop = ringY - rh - dh;
  s += `<path d="M${r2(cx - rw / 2)},${r2(ringY - rh)} C${r2(cx - rw / 2)},${r2(dTop + dh * 0.2)} ${r2(cx - dw / 2)},${r2(dTop)} ${r2(cx - dw * 0.32)},${r2(dTop)}
           L${r2(cx + dw * 0.32)},${r2(dTop)} C${r2(cx + dw / 2)},${r2(dTop)} ${r2(cx + rw / 2)},${r2(dTop + dh * 0.2)} ${r2(cx + rw / 2)},${r2(ringY - rh)} Z" fill="${K.lid}"/>`;
  s += `<ellipse cx="${cx}" cy="${r2(dTop)}" rx="${r2(dw * 0.32)}" ry="${r2(dw * 0.32 * persp)}" fill="#26272B"/>`;
  if (cap === 'closed') {
    // low tab across the dome, finger-loop at the right end
    const tx = cx - w * 0.30, tw = w * 0.62, th = w * 0.11, ty = dTop - th * 0.9;
    s += `<rect x="${r2(tx)}" y="${r2(ty)}" width="${r2(tw)}" height="${r2(th)}" rx="${r2(th / 2)}" fill="${K.rim}"/>`;
    s += `<circle cx="${r2(tx + tw - th * 0.9)}" cy="${r2(ty + th / 2)}" r="${r2(th * 0.26)}" fill="#3A3B40"/>`;
    return { svg: s, top: ty };
  }
  // open: raised spout at left, tab hinged on the right and flipped up, loop at the tip
  const sx = cx - w * 0.18, sw = w * 0.22, sh = w * 0.09;
  s += seg(sx, dTop - sh, sw, sh, persp * 1.4, K.rim, { gloss: false, topCap: true, topFill: '#35363B' });
  s += `<ellipse cx="${r2(sx)}" cy="${r2(dTop - sh)}" rx="${r2(sw * 0.28)}" ry="${r2(sw * 0.28 * persp * 1.4)}" fill="#050506"/>`;
  const hx = cx + w * 0.30, hy = dTop - w * 0.04, L = w * 0.62, th = w * 0.10;
  s += `<g transform="translate(${r2(hx)},${r2(hy)}) rotate(-62)"><rect x="0" y="${r2(-th / 2)}" width="${r2(L)}" height="${r2(th)}" rx="${r2(th / 2)}" fill="${K.rim}"/>
         <circle cx="${r2(L - th * 0.8)}" cy="0" r="${r2(th * 0.27)}" fill="#3A3B40"/></g>`;
  return { svg: s, top: hy - L * Math.sin(62 * Math.PI / 180) - th };
}

// ---------- the shaker ----------
// cx, by = centre x and bottom y; w = cup width. config 'full' | 'compact'.
// face: 'logo' (front) | 'scale' (back) | 'side' (stepped panel) | 'plain'.
function shaker(cx, by, w, { config = 'full', cap = 'closed', face = 'logo', persp = 0.10, lidOn = true } = {}) {
  const cupH = w * 1.40, t1 = w * 0.40, t2 = w * 0.80;
  let y = by, s = '';
  if (config === 'full') {
    s += seg(cx, y - t2, w, t2, persp, K.body); y -= t2; s += seam(cx, y, w, persp);
    s += seg(cx, y - t1, w, t1, persp, K.body); y -= t1; s += seam(cx, y, w, persp);
  }
  s += seg(cx, y - cupH, w, cupH, persp, K.body, { topCap: !lidOn, topFill: '#101012' });
  const cupY = y - cupH;
  if (face === 'logo') s += logo(cx, cupY, w, cupH);
  if (face === 'scale') s += scale(cx, cupY, w, cupH);
  if (face === 'side') s += sidePanel(cx, cupY, w, cupH);
  let top = cupY;
  if (lidOn) { const l = lid(cx, cupY, w, persp, cap); s += l.svg; top = l.top; }
  return { svg: `<g>${s}</g>`, top, cupTop: cupY, cupBottom: y };
}

// ---------- loose parts ----------
// Open container standing (lid off): rim ellipse on top, dark inside.
function container(cx, by, w, h, persp = 0.28, { contents = null, dividers = 0 } = {}) {
  const y = by - h, rx = w / 2, ry = rx * persp;
  let s = seg(cx, y, w, h, persp, K.body);
  s += `<ellipse cx="${cx}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${K.rim}"/>`;
  s += `<ellipse cx="${cx}" cy="${r2(y + ry * 0.12)}" rx="${r2(rx * 0.9)}" ry="${r2(ry * 0.86)}" fill="#08080A"/>`;
  if (dividers) for (let i = 0; i < dividers; i++) {
    const a = (-90 + i * 360 / dividers) * Math.PI / 180;
    s += `<path d="M${cx},${r2(y + ry * 0.12)} L${r2(cx + Math.cos(a) * rx * 0.9)},${r2(y + ry * 0.12 + Math.sin(a) * ry * 0.86)}" stroke="#3A3B40" stroke-width="${r2(w * 0.03)}"/>`;
  }
  if (contents) s += contents(cx, y + ry * 0.12, rx * 0.86, ry * 0.8);
  return `<g>${s}</g>`;
}
// Whisk disc: black ring + 3 spokes + steel conical spiral. (cx, cy) centre, r radius, persp tilt (1 = top-down).
function whisk(cx, cy, r, persp = 1) {
  const ry = r * persp;
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="${r2(r)}" ry="${r2(ry)}" fill="none" stroke="${K.rim}" stroke-width="${r2(r * 0.09)}"/>`;
  for (let i = 0; i < 3; i++) {
    const a = (-90 + i * 120) * Math.PI / 180;
    s += `<path d="M${cx},${cy} L${r2(cx + Math.cos(a) * r)},${r2(cy + Math.sin(a) * ry)}" stroke="${K.rim}" stroke-width="${r2(r * 0.09)}"/>`;
  }
  for (let k = 7; k >= 1; k--) {
    const f = k / 7.6;
    s += `<ellipse cx="${cx}" cy="${r2(cy - (1 - persp) * r * 0.25 * (1 - f))}" rx="${r2(r * f * 0.86)}" ry="${r2(ry * f * 0.86)}" fill="none" stroke="url(#steel)" stroke-width="${r2(r * 0.03)}"/>`;
  }
  return `<g>${s}</g>`;
}
// Loose lid seen from above (top-down view, persp ~1) or tilted.
function lidTop(cx, cy, w, persp = 1) {
  const rx = w * 0.535, ry = rx * persp;
  return `<g><ellipse cx="${cx}" cy="${cy}" rx="${r2(rx)}" ry="${r2(ry)}" fill="${K.lid}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r2(rx * 0.8)}" ry="${r2(ry * 0.8)}" fill="#202125"/>
    <rect x="${r2(cx - w * 0.30)}" y="${r2(cy - w * 0.07 * persp)}" width="${r2(w * 0.62)}" height="${r2(w * 0.14 * persp)}" rx="${r2(w * 0.07 * persp)}" fill="${K.rim}"/>
    <circle cx="${r2(cx + w * 0.22)}" cy="${cy}" r="${r2(w * 0.04)}" fill="#3A3B40"/></g>`;
}

// ---------- props (greys) ----------
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
// Fill an ellipse (cx, cy, rx, ry) with n small items drawn by fn(x, y, rot, i).
function scatter(cx, cy, rx, ry, n, seed, fn) {
  const R = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, d = Math.sqrt(R());
    s += fn(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, R() * 180, i);
  }
  return s;
}
const almond = (x, y, rot, size = 34) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(size)}" ry="${r2(size * 0.55)}" transform="rotate(${r2(rot)} ${r2(x)} ${r2(y)})" fill="${K.propDk}" stroke="#6E6E6B" stroke-width="2"/>`;
const capsule = (x, y, rot, size = 30, light = true) => `<rect x="${r2(x - size)}" y="${r2(y - size * 0.36)}" width="${r2(size * 2)}" height="${r2(size * 0.72)}" rx="${r2(size * 0.36)}" transform="rotate(${r2(rot)} ${r2(x)} ${r2(y)})" fill="${light ? '#E4E4E0' : '#77777A'}" stroke="#9C9C98" stroke-width="2"/>`;
const powder = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(ry)}" fill="#F1F1EE"/><ellipse cx="${r2(cx - rx * 0.15)}" cy="${r2(cy - ry * 0.2)}" rx="${r2(rx * 0.55)}" ry="${r2(ry * 0.45)}" fill="#FAFAF8"/>`;
const almonds = (n = 18, seed = 7) => (cx, cy, rx, ry) => scatter(cx, cy, rx, ry, n, seed, (x, y, r) => almond(x, y, r, rx * 0.17));
const capsules = (n = 12, seed = 3) => (cx, cy, rx, ry) => scatter(cx, cy, rx, ry, n, seed, (x, y, r, i) => capsule(x, y, r, rx * 0.16, i % 3 !== 0));
const powderFill = () => (cx, cy, rx, ry) => powder(cx, cy, rx, ry);

// Dumbbell lying on the floor, axis horizontal.
function dumbbell(cx, cy, len, rot = 0) {
  const p = len * 0.2, ph = len * 0.34;
  return `<g transform="rotate(${rot} ${cx} ${cy})"><rect x="${r2(cx - len / 2)}" y="${r2(cy - len * 0.045)}" width="${r2(len)}" height="${r2(len * 0.09)}" fill="${K.propDk}"/>
    <rect x="${r2(cx - len / 2)}" y="${r2(cy - ph / 2)}" width="${r2(p)}" height="${r2(ph)}" rx="${r2(p * 0.25)}" fill="#7C7C79"/>
    <rect x="${r2(cx + len / 2 - p)}" y="${r2(cy - ph / 2)}" width="${r2(p)}" height="${r2(ph)}" rx="${r2(p * 0.25)}" fill="#7C7C79"/></g>`;
}
// Folded towel block.
const towel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r2(h * 0.25)}" fill="${K.propLt}"/><rect x="${x}" y="${r2(y + h * 0.45)}" width="${w}" height="${r2(h * 0.1)}" fill="#BDBDBA"/>`;
// Simplified hand (mitten silhouette) gripping a vertical object at (cx, cy); s = scale (1 ≈ adult hand on a 300 px cup).
function hand(cx, cy, s = 1, side = 'left') {
  const f = side === 'left' ? 1 : -1;
  return `<g transform="translate(${cx},${cy}) scale(${f * s},${s})" fill="#B9B4AE" stroke="#9E9993" stroke-width="3">
    <path d="M-150,40 C-150,-20 -110,-70 -60,-80 L60,-90 C95,-92 110,-70 100,-48 L40,-40 L40,60 C40,110 0,140 -50,140 L-150,140 Z"/>
    <path d="M30,-40 C80,-40 112,-30 112,-6 C112,16 84,22 40,20 Z" /><path d="M30,0 C80,0 112,10 112,34 C112,56 84,62 40,60 Z"/></g>`;
}

window.K = K;
window.Kit = { defs, studio, room, shadow, seg, seam, logo, scale, sidePanel, lid, shaker, container, whisk, lidTop,
  scatter, almond, capsule, powder, almonds, capsules, powderFill, dumbbell, towel, hand, rng };
