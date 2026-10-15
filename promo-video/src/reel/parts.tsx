import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {Orb} from '../components';
import {easeOut, prog} from '../motion';
import {color, OrbPalette} from '../theme';
import {RCX, RW} from './copy';

export const display = "'Inter Tight', 'Inter', system-ui, sans-serif";
export const mono = "'JetBrains Mono', ui-monospace, monospace";

/** The one emphasis treatment: orb colours poured into the letters. */
export const spark: React.CSSProperties = {
  backgroundImage: 'linear-gradient(100deg, #2C8FD6 0%, #3FA046 48%, #D9CF3A 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  paddingRight: '0.08em',
  marginRight: '-0.08em',
};

const rand = (seed: number) => {
  const x = Math.sin(seed * 91.345) * 47453.5453;
  return x - Math.floor(x);
};

/** Decaying camera shake, returned as [x, y] px. */
export const shake = (f: number, at: number, dur = 10, amp = 12): [number, number] => {
  if (f < at || f > at + dur) return [0, 0];
  const k = 1 - (f - at) / dur;
  return [Math.sin((f - at) * 2.1) * amp * k, Math.cos((f - at) * 2.7) * amp * k * 0.7];
};

/** Overshoot ease for pops. */
export const back = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Bouncing drop, 0→1 with three contacts. */
export const bounce = (t: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// ---------------------------------------------------------------------------
// Kinetic type — each word punches in on its own frame.

export type Word = {t: string; at: number; spark?: boolean};

export const Kinetic: React.FC<{
  lines: Word[][];
  size: number;
  c?: string;
  align?: 'center' | 'left';
  lineGap?: number;
  style?: React.CSSProperties;
}> = ({lines, size, c = color.ink, align = 'center', lineGap = 0.02, style}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: display,
        fontStyle: 'italic',
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1 + lineGap,
        letterSpacing: '-0.035em',
        color: c,
        textAlign: align,
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {words.map((w, wi) => {
            const p = prog(f, w.at, 9, easeOut);
            const on = f >= w.at;
            return (
              <span
                key={wi}
                style={{
                  ...(w.spark ? spark : {}),
                  display: 'inline-block',
                  marginRight: wi < words.length - 1 ? '0.24em' : w.spark ? '-0.08em' : 0,
                  opacity: on ? Math.min(1, (f - w.at + 1) / 3) : 0,
                  transform: `scale(${1.45 - 0.45 * p})`,
                  filter: `blur(${(1 - p) * 10}px)`,
                }}
              >
                {w.t}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Split a phrase into words that land `gap` frames apart. */
export const words = (text: string, at: number, gap = 6, sparkFrom = Infinity): Word[] =>
  text.split(' ').map((t, i) => ({t, at: at + i * gap, spark: i >= sparkFrom}));

// ---------------------------------------------------------------------------
// Pointer, touch and feedback

export const Cursor: React.FC<{x: number; y: number; clickAt?: number[]; opacity?: number}> = ({x, y, clickAt = [], opacity = 1}) => {
  const f = useCurrentFrame();
  const press = clickAt.reduce((m, a) => (f >= a && f < a + 6 ? Math.min(m, 0.82 + 0.18 * Math.abs(f - a - 3) / 3) : m), 1);
  return (
    <svg
      width={48}
      height={56}
      viewBox="0 0 24 28"
      style={{position: 'absolute', left: x - 4, top: y - 3, transform: `scale(${press})`, transformOrigin: '4px 3px', opacity}}
    >
      <path d="M2 1.5v21l5.6-5.4 3.8 8.6 3.6-1.6-3.8-8.4H19z" fill={color.ink} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
};

export const Ripple: React.FC<{x: number; y: number; at: number; r?: number; c?: string}> = ({x, y, at, r = 70, c = color.ink}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 18) return null;
  const p = prog(f, at, 18, easeOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r * p,
        top: y - r * p,
        width: 2 * r * p,
        height: 2 * r * p,
        borderRadius: '50%',
        border: `3px solid ${c}`,
        opacity: 1 - p,
      }}
    />
  );
};

export const Touch: React.FC<{x: number; y: number; opacity: number; pressed?: number}> = ({x, y, opacity, pressed = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 48,
      top: y - 48,
      width: 96,
      height: 96,
      borderRadius: '50%',
      background: 'rgba(14,15,14,0.16)',
      border: '3px solid rgba(255,255,255,0.95)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      opacity,
      transform: `scale(${1 - 0.18 * pressed})`,
    }}
  />
);

/** Small orbs flung outward from a point. */
export const Burst: React.FC<{x: number; y: number; at: number; n?: number; radius?: number; seed?: number}> = ({
  x,
  y,
  at,
  n = 10,
  radius = 260,
  seed = 1,
}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 40) return null;
  const palettes: OrbPalette[] = ['earth', 'meadow', 'sunrise', 'lime', 'sea', 'ice'];
  const p = prog(f, at, 28, easeOut);
  const fade = 1 - prog(f, at + 14, 24);
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rand(seed + i) * 0.6;
        const d = radius * (0.55 + rand(seed * 3 + i) * 0.6) * p;
        const s = 14 + rand(seed * 7 + i) * 30;
        return (
          <div key={i} style={{position: 'absolute', left: x + Math.cos(a) * d - s / 2, top: y + Math.sin(a) * d - s / 2, opacity: fade}}>
            <Orb size={s} palette={palettes[i % palettes.length]} seed={seed + i} shade="light" />
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Marketplace feed

export const TILE_W = 480;
export const TILE_IMG_H = 640;
export const TILE_H = TILE_IMG_H + 112;
export const TILE_GAP = 24;
export const PITCH = TILE_H + TILE_GAP;
const COL_X = [(RW - 2 * TILE_W - TILE_GAP) / 2, (RW - 2 * TILE_W - TILE_GAP) / 2 + TILE_W + TILE_GAP];

export type TileSpec = {
  src: string;
  flip?: boolean;
  zoom?: number;
  gray?: number;
  tag?: string;
  liked?: number; // 0..1 heart fill
  lift?: number; // 0..1 hero emphasis
  dim?: number; // 0..1
};

const Heart: React.FC<{fill: number}> = ({fill}) => (
  <svg width={30} height={30} viewBox="0 0 24 24" style={{display: 'block', transform: `scale(${1 + 0.35 * Math.sin(Math.min(1, fill) * Math.PI)})`}}>
    <path
      d="M12 20.5s-7.5-4.6-7.5-10.4A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.8c0 5.8-7.5 10.4-7.5 10.4z"
      fill={fill > 0.5 ? color.ink : 'none'}
      stroke={color.ink}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </svg>
);

export const FeedTile: React.FC<{spec: TileSpec; x: number; y: number}> = ({spec, x, y}) => {
  const {src, flip, zoom = 1, gray = 0, tag, liked = 0, lift = 0, dim = 0} = spec;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: TILE_W,
        height: TILE_H,
        transform: `scale(${1 + 0.07 * lift})`,
        zIndex: lift > 0 ? 2 : 1,
        opacity: 1 - 0.55 * dim,
      }}
    >
      <div
        style={{
          width: TILE_W,
          height: TILE_IMG_H,
          borderRadius: 22,
          overflow: 'hidden',
          position: 'relative',
          background: '#fff',
          boxShadow: lift > 0 ? `0 ${20 * lift}px ${60 * lift}px rgba(20,40,30,${0.25 * lift}), 0 0 0 ${4 * lift}px rgba(255,255,255,0.9)` : 'none',
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoom}) scaleX(${flip ? -1 : 1})`,
            filter: gray ? `grayscale(${gray}) contrast(${1 - 0.1 * gray})` : undefined,
          }}
        />
        {tag && (
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 16,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.92)',
              fontFamily: mono,
              fontSize: 19,
              color: color.inkSoft,
              letterSpacing: '0.04em',
            }}
          >
            {tag}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: 16,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart fill={liked} />
        </div>
      </div>
      <div style={{padding: '18px 6px 0'}}>
        <div style={{width: '86%', height: 20, borderRadius: 6, background: '#E2E1DC'}} />
        <div style={{width: '58%', height: 20, borderRadius: 6, background: '#E2E1DC', marginTop: 10}} />
        <div style={{width: '38%', height: 26, borderRadius: 7, background: '#CDCCC6', marginTop: 14}} />
      </div>
    </div>
  );
};

/** Two-column feed scrolled by `offset` px. `tile(row, col)` describes each card. */
export const FeedGrid: React.FC<{
  offset: number;
  top: number;
  tile: (row: number, col: number) => TileSpec;
  blur?: number;
  id: string;
  style?: React.CSSProperties;
}> = ({offset, top, tile, blur = 0, id, style}) => {
  const first = Math.floor((offset - top) / PITCH) - 1;
  const rows = Array.from({length: 5}, (_, i) => first + i).filter((r) => r >= 0);
  const hero = (r: number, c: number) => (tile(r, c).lift ?? 0) > 0;
  const order = rows.flatMap((r) => [0, 1].map((c) => [r, c] as const)).sort((a, b) => Number(hero(...a)) - Number(hero(...b)));
  return (
    <div style={{position: 'absolute', inset: 0, isolation: 'isolate', filter: blur > 0.4 ? `url(#${id})` : undefined, ...style}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id={id} x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation={`0 ${blur}`} />
        </filter>
      </svg>
      {order.map(([r, c]) => (
        <FeedTile key={`${r}-${c}`} spec={tile(r, c)} x={COL_X[c]} y={top + r * PITCH - offset} />
      ))}
    </div>
  );
};

/** Scroll position helpers: offset at frame and its speed (px/frame). */
export const scrollAt = (fn: (f: number) => number, f: number) => ({
  offset: fn(f),
  speed: Math.abs(fn(f + 0.5) - fn(f - 0.5)),
});

// ---------------------------------------------------------------------------
// CURIOTHEK wordmark — the O is a living orb. Letters slide out from behind it.

export const OrbWordmark: React.FC<{
  size: number;
  y: number; // centre line
  c: string;
  reveal: number; // 0..1
  orbScale?: number;
  showOrb?: boolean;
}> = ({size, y, c, reveal, orbScale = 1, showOrb = true}) => {
  const o = size * 0.78;
  const gap = size * 0.05;
  const letter = (ch: string, d: number, side: -1 | 1) => {
    const p = Math.max(0, Math.min(1, reveal * 5.2 - (d - 1) * 0.95));
    const e = easeOut(p);
    return (
      <span
        key={ch + d}
        style={{
          display: 'inline-block',
          opacity: Math.min(1, p * 2),
          transform: `translateX(${-side * (1 - e) * size * 0.5 * d}px)`,
          filter: `blur(${(1 - e) * 10}px)`,
        }}
      >
        {ch}
      </span>
    );
  };
  const text: React.CSSProperties = {
    position: 'absolute',
    top: y - size / 2,
    fontFamily: display,
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    color: c,
    whiteSpace: 'nowrap',
  };
  const [left, right] = ['CURI', 'THEK'];
  return (
    <>
      <div style={{...text, right: RW - (RCX - o / 2 - gap)}}>{Array.from(left).map((ch, i) => letter(ch, left.length - i, -1))}</div>
      <div style={{...text, left: RCX + o / 2 + gap}}>{Array.from(right).map((ch, i) => letter(ch, i + 1, 1))}</div>
      {showOrb && (
        <div style={{position: 'absolute', left: RCX - o / 2, top: y - o / 2, transform: `scale(${orbScale})`}}>
          <Orb size={o} palette="earth" seed={4} speed={1.3} shade="light" />
        </div>
      )}
    </>
  );
};
