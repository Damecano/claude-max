import React from 'react';
import {Composition} from 'remotion';
import {Promo, PROMO_FRAMES} from './Promo';
import {Reel, REEL_FRAMES} from './reel/Reel';
import {RH, RW} from './reel/copy';
import {FPS, H, W} from './theme';


export const Root: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={FPS} width={W} height={H} defaultProps={{withAudio: true}} />
    <Composition id="CuriothekReel" component={Reel} durationInFrames={REEL_FRAMES} fps={FPS} width={RW} height={RH} defaultProps={{withAudio: true}} />
  </>
);
