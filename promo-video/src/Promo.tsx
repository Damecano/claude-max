import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {prog} from './motion';
import {
  BrandReveal,
  ChatDemo,
  Channels,
  DarkOpen,
  EndCard,
  Headline,
  Insights,
  Knowledge,
  Languages,
  Merge,
  Prompt,
  QuestionStorm,
  Rules,
} from './scenes';
import {color} from './theme';

// Each shot starts a few frames before the previous one ends and fades in over it.
const shots: {C: React.FC; from: number; dur: number; fadeIn?: number}[] = [
  {C: DarkOpen, from: 0, dur: 150},
  {C: QuestionStorm, from: 150, dur: 125},
  {C: BrandReveal, from: 265, dur: 100, fadeIn: 14},
  {C: Headline, from: 360, dur: 82, fadeIn: 8},
  {C: Prompt, from: 438, dur: 75, fadeIn: 8},
  {C: ChatDemo, from: 505, dur: 190, fadeIn: 14},
  {C: Knowledge, from: 688, dur: 155, fadeIn: 10},
  {C: Languages, from: 835, dur: 128, fadeIn: 12},
  {C: Channels, from: 955, dur: 142, fadeIn: 10},
  {C: Rules, from: 1090, dur: 142, fadeIn: 10},
  {C: Insights, from: 1225, dur: 145, fadeIn: 10},
  {C: Merge, from: 1362, dur: 170, fadeIn: 10},
  {C: EndCard, from: 1525, dur: 275, fadeIn: 6},
];

export const PROMO_FRAMES = 1800;

// Ship the fonts with the project so renders look the same on any machine.
const fontFiles: [string, string][] = [
  ['fonts/Inter-normal-latin.woff2', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'],
  ['fonts/Inter-normal-latin-ext.woff2', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+20A0-20AB, U+20AD-20C0, U+2C60-2C7F, U+A720-A7FF'],
  ['fonts/Inter-normal-cyrillic.woff2', 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading Inter');
  Promise.all(
    fontFiles.map(([file, range]) => {
      const face = new FontFace('Inter', `url(${staticFile(file)}) format('woff2')`, {weight: '100 900', unicodeRange: range});
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

const FadeIn: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: frames ? prog(f, 0, frames) : 1}}>{children}</AbsoluteFill>;
};

export const Promo: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => {
  return (
    <AbsoluteFill style={{background: color.night}}>
      {shots.map(({C, from, dur, fadeIn = 0}, i) => (
        <Sequence key={i} from={from} durationInFrames={dur} name={C.displayName ?? C.name}>
          <FadeIn frames={fadeIn}>
            <C />
          </FadeIn>
        </Sequence>
      ))}
      {withAudio && <Audio src={staticFile('soundtrack.wav')} />}
    </AbsoluteFill>
  );
};
