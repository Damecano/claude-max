import {continueRender, delayRender, staticFile} from 'remotion';

// Ship the fonts with the project so renders look the same on any machine.
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+20A0-20AB, U+20AD-20C0, U+2C60-2C7F, U+A720-A7FF';
const CYRILLIC = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

const faces: [family: string, file: string, range: string, style: string, weight: string][] = [
  ['Inter', 'Inter-normal-latin', LATIN, 'normal', '100 900'],
  ['Inter', 'Inter-normal-latin-ext', LATIN_EXT, 'normal', '100 900'],
  ['Inter', 'Inter-normal-cyrillic', CYRILLIC, 'normal', '100 900'],
  ['Inter Tight', 'InterTight-normal-latin', LATIN, 'normal', '100 900'],
  ['Inter Tight', 'InterTight-normal-latin-ext', LATIN_EXT, 'normal', '100 900'],
  ['Inter Tight', 'InterTight-normal-cyrillic', CYRILLIC, 'normal', '100 900'],
  ['Inter Tight', 'InterTight-italic-latin', LATIN, 'italic', '100 900'],
  ['Inter Tight', 'InterTight-italic-latin-ext', LATIN_EXT, 'italic', '100 900'],
  ['Inter Tight', 'InterTight-italic-cyrillic', CYRILLIC, 'italic', '100 900'],
  ['JetBrains Mono', 'JetBrainsMono-normal-latin', LATIN, 'normal', '100 800'],
  ['JetBrains Mono', 'JetBrainsMono-normal-cyrillic', CYRILLIC, 'normal', '100 800'],
];

let loaded = false;

/** Register the fonts once and hold the render until they are ready. */
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    faces.map(([family, file, unicodeRange, style, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)}) format('woff2')`, {unicodeRange, style, weight});
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
