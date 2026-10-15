import {Easing, interpolate} from 'remotion';

// The easing that gives everything its calm, expensive feel: fast start, long settle.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 over [start, start+dur] with the house ease. */
export const prog = (frame: number, start: number, dur: number, ease = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: ease});

/** Map frame through keyframes with clamping. */
export const lerp = (
  frame: number,
  input: number[],
  output: number[],
  ease: (t: number) => number = easeInOut,
) => interpolate(frame, input, output, {...clamp, easing: ease});

/** Fade in at `start`, fade out ending at `end`. */
export const inOut = (frame: number, start: number, end: number, fadeIn = 10, fadeOut = 10) =>
  Math.min(prog(frame, start, fadeIn, easeOut), 1 - prog(frame, end - fadeOut, fadeOut, easeIn));

/** Number of characters visible for a typewriter that starts at `start`. */
export const typed = (frame: number, start: number, charsPerFrame: number, length: number) =>
  Math.max(0, Math.min(length, Math.floor((frame - start) * charsPerFrame)));
