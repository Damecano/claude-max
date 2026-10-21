// Screenshot one HTML page at a given size: node tools/shot.mjs <page.html> <out.png> <width> <height>
import { createRequire } from 'module';
import path from 'path';
import { pathToFileURL } from 'url';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
const [page_, out, w, h] = process.argv.slice(2);
const W = Number(w), H = Number(h);
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errs = [];
page.on('pageerror', e => errs.push('JS: ' + e.message));
page.on('requestfailed', r => errs.push('load failed: ' + r.url()));
await page.goto(pathToFileURL(path.resolve(page_)).href, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();
console.log((errs.length ? '! ' : 'ok ') + out + (errs.length ? '\n  - ' + errs.join('\n  - ') : ''));
