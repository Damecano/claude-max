// Render a set of check frames into one folder: node tools/stills.mjs out/stills 60 200 400 ...
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [outDir, ...frames] = process.argv.slice(2);
const id = process.env.COMP ?? 'Promo';
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const inputProps = {withAudio: false};
const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable});
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(4, '0')}.jpg`);
  await renderStill({composition, serveUrl, frame: Number(f), output, imageFormat: 'jpeg', jpegQuality: 85, inputProps, browserExecutable, scale: Number(process.env.SCALE ?? 0.5)});
  console.log('wrote', output);
}
