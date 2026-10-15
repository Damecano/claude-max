import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFonts} from '../fonts';
import {prog} from '../motion';
import {color} from '../theme';
import {RBrand, RCanvas, RDetails, REnd, RHook, RPayoff, RProblem, RSet, RTurn} from './scenes';

loadFonts();

// Beat pattern: fast hook → medium problem → hold on the turn → quick brand →
// long canvas reveal → three detail holds → flash ×8 → payoff → long end card.
// Frame numbers here are mirrored in tools/reel_soundtrack.py.
export const reelShots: {C: React.FC; from: number; dur: number; fadeIn?: number}[] = [
  {C: RHook, from: 0, dur: 80},
  {C: RProblem, from: 80, dur: 155},
  {C: RTurn, from: 235, dur: 95},
  {C: RBrand, from: 318, dur: 95, fadeIn: 12},
  {C: RCanvas, from: 410, dur: 195, fadeIn: 6},
  {C: RDetails, from: 605, dur: 175},
  {C: RSet, from: 780, dur: 165},
  {C: RPayoff, from: 945, dur: 175},
  {C: REnd, from: 1110, dur: 210, fadeIn: 10},
];

export const REEL_FRAMES = 1320;

const FadeIn: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: frames ? prog(f, 0, frames) : 1}}>{children}</AbsoluteFill>;
};

export const Reel: React.FC<{withAudio?: boolean}> = ({withAudio = true}) => (
  <AbsoluteFill style={{background: color.night}}>
    {reelShots.map(({C, from, dur, fadeIn = 0}, i) => (
      <Sequence key={i} from={from} durationInFrames={dur} name={C.name}>
        <FadeIn frames={fadeIn}>
          <C />
        </FadeIn>
      </Sequence>
    ))}
    {withAudio && <Audio src={staticFile('reel-soundtrack.wav')} />}
  </AbsoluteFill>
);
