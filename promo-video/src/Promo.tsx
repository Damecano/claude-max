import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from './fonts';
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

loadFonts();

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
