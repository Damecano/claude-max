// Renders every slide HTML to a 1080x1440 PNG with headless Chromium.
// Usage: node tools/render.mjs [slidesDir=slides] [outDir=output] [--only 01,03] [--scale 1]
// Prints QA warnings: text outside the canvas, overflowing [data-fit] boxes,
// overlapping [data-qa="label"] elements, broken images/fonts, unfilled ⟨__⟩ placeholders.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pos = process.argv.slice(2).filter(a => !a.startsWith('--'));
const flag = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : null; };
const slidesDir = path.resolve(ROOT, pos[0] || 'slides');
const outDir = path.resolve(ROOT, pos[1] || 'output');
const only = (flag('only') || '').split(',').filter(Boolean);
const scale = Number(flag('scale') || 1);
const W = 1080, H = 1440;

const specs = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/specs.json'), 'utf8'));
const files = fs.readdirSync(slidesDir).filter(f => /^\d\d_.*\.html$/.test(f))
  .filter(f => !only.length || only.some(o => f.startsWith(o))).sort();
if (!files.length) { console.error('No slides in', slidesDir); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: scale });
await ctx.addInitScript(s => { window.__SPECS__ = s; }, specs);
let problems = 0;
for (const f of files) {
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('JS: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('requestfailed', r => errs.push('load failed: ' + r.url()));
  await page.goto(pathToFileURL(path.join(slidesDir, f)).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  const qa = await page.evaluate(({ W, H }) => {
    const out = [];
    const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
    const visible = el => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length; };
    if (document.documentElement.dataset.bound !== '1') out.push('lib/bind.js not loaded');
    for (const el of document.querySelectorAll('body *')) {
      if (!visible(el)) continue;
      const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (hasText) {
        const r = el.getBoundingClientRect();
        if (r.left < -0.5 || r.top < -0.5 || r.right > W + 0.5 || r.bottom > H + 0.5)
          out.push(`text outside canvas: ${name(el)} "${el.textContent.trim().slice(0, 40)}"`);
      }
      if (el.hasAttribute('data-fit') && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1))
        out.push(`overflow in [data-fit]: ${name(el)} "${el.textContent.trim().slice(0, 40)}"`);
    }
    const labels = [...document.querySelectorAll('[data-qa="label"]')].filter(visible);
    for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i].getBoundingClientRect(), b = labels[j].getBoundingClientRect();
      if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
        out.push(`labels overlap: "${labels[i].textContent.trim().slice(0, 25)}" / "${labels[j].textContent.trim().slice(0, 25)}"`);
    }
    for (const img of document.images) if (!img.naturalWidth) out.push('broken image: ' + img.getAttribute('src'));
    for (const ff of document.fonts) if (ff.status === 'error') out.push('font failed: ' + ff.family);
    const ph = document.querySelectorAll('.ph').length;
    if (ph) out.push(`${ph} unfilled placeholder(s) ⟨__⟩`);
    return out;
  }, { W, H });
  const png = path.join(outDir, f.replace(/\.html$/, '.png'));
  await page.screenshot({ path: png, clip: { x: 0, y: 0, width: W, height: H } });
  const all = [...errs, ...qa];
  problems += all.length;
  console.log((all.length ? '! ' : 'ok ') + path.relative(ROOT, png) + (all.length ? '\n    - ' + all.join('\n    - ') : ''));
  await page.close();
}
await browser.close();
process.exitCode = problems ? 2 : 0;
