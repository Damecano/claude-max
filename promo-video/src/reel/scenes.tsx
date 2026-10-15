import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {GreenField, Icon, Orb, Pill, Typewriter} from '../components';
import {easeIn, easeInOut, easeOut, lerp, prog} from '../motion';
import {color} from '../theme';
import {copy, img, RCX, RH, RW, slides} from './copy';
import {
  back,
  bounce,
  Burst,
  Cursor,
  display,
  FeedGrid,
  Kinetic,
  mono,
  OrbWordmark,
  PITCH,
  Ripple,
  scrollAt,
  shake,
  spark,
  TILE_H,
  TileSpec,
  Touch,
  words,
} from './parts';

const SEL = '#2C8FD6'; // design-tool selection blue (from the orb palette)
const FEED_TOP = 600;
const paperGrid: React.CSSProperties = {
  background: color.paper,
  backgroundImage: 'radial-gradient(circle, rgba(14,15,14,0.11) 1.5px, transparent 1.8px)',
  backgroundSize: '36px 36px',
};

/** Paper band that keeps headline text readable over the scrolling feed. */
const TopBand: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: RW,
      height: 680,
      background: `linear-gradient(180deg, ${color.paper} 0%, ${color.paper} 72%, rgba(243,242,239,0) 100%)`,
    }}
  />
);

// Supplier photo clones: different sellers, same picture.
const cloneTile = (r: number, c: number, gray = 0, dim = 0): TileSpec => {
  const i = r * 2 + c;
  const src = i % 7 === 3 ? img.before('08_razmery') : i % 7 === 5 ? img.before('02_komplekt') : img.before('01_oblozhka');
  return {
    src,
    flip: i % 3 === 1,
    zoom: 1 + ((i * 37) % 4) * 0.05,
    gray,
    dim,
    tag: `SELLER ${String(((i * 5) % 23) + 1).padStart(2, '0')}`,
  };
};

// ---------------------------------------------------------------------------
// R1 · Hook — confident words on black, the orb lit beneath.

export const RHook: React.FC = () => {
  const f = useCurrentFrame();
  const [sx, sy] = shake(f, 31, 12, 16);
  const out = prog(f, 64, 16, easeIn);
  const pulse = 1 + 0.1 * Math.sin(prog(f, 31, 12) * Math.PI);
  const draw = prog(f, 0, 44);
  return (
    <AbsoluteFill style={{background: color.night, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy - out * 320}px)`, filter: `blur(${out * 16}px)`}}>
        <svg width={RW} height={RH} style={{position: 'absolute'}}>
          {[-16, 22, 74].map((a, i) => (
            <ellipse
              key={i}
              cx={RCX}
              cy={1260}
              rx={420 - i * 30}
              ry={130 + i * 26}
              transform={`rotate(${a + f * (0.12 + i * 0.05)} ${RCX} 1260)`}
              fill="none"
              stroke={color.lineDark}
              strokeWidth={1.6}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - Math.max(0, Math.min(1, draw * 1.3 - i * 0.15))}
            />
          ))}
        </svg>
        <div style={{position: 'absolute', left: RCX - 150, top: 1260 - 150, transform: `scale(${pulse})`}}>
          <Orb size={300} palette="earth" seed={3} shade="dark" reveal={lerp(f, [0, 44], [0, 1], easeOut)} speed={0.9} />
        </div>
        <Kinetic
          c="#fff"
          size={132}
          style={{position: 'absolute', top: 520, width: RW}}
          lines={[
            words(copy.hook[0], 6, 8),
            [
              {t: 'is', at: 22},
              {t: 'great.', at: 30, spark: true},
            ],
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R2 · Problem — a feed of identical supplier photos; shoppers flick past.

const r2Scroll = (f: number) => 2 * PITCH * easeOut(prog(f, 0, 56, (t) => t)) + 2 * PITCH * easeOut(prog(f, 92, 46, (t) => t));
export const R2_END_OFFSET = 4 * PITCH;

export const RProblem: React.FC = () => {
  const f = useCurrentFrame();
  const {offset, speed} = scrollAt(r2Scroll, f);
  const gray = prog(f, 96, 40);
  const outA = prog(f, 82, 10, easeIn);
  const outB = prog(f, 142, 13, easeIn);
  const touchY = lerp(f, [92, 108], [1450, 760], easeInOut);
  const touchOn = prog(f, 86, 6) * (1 - prog(f, 108, 8));
  return (
    <AbsoluteFill style={{background: color.paper, overflow: 'hidden'}}>
      <FeedGrid id="r2blur" offset={offset} top={FEED_TOP} blur={Math.min(22, speed * 0.14)} tile={(r, c) => cloneTile(r, c, gray)} />
      <AbsoluteFill style={{background: `rgba(243,242,239,${0.3 * prog(f, 118, 30)})`}} />
      <TopBand />
      <Kinetic
        size={96}
        style={{position: 'absolute', top: 190, width: RW, opacity: 1 - outA, transform: `translateX(${-outA * 160}px)`, filter: `blur(${outA * 12}px)`}}
        lines={[
          words(copy.problem[0], 8, 5),
          words(copy.problem[1], 22, 5),
          [
            {t: 'everyone', at: 32, spark: true},
            {t: 'else’s.', at: 37, spark: true},
          ],
        ]}
      />
      <Kinetic
        size={104}
        style={{position: 'absolute', top: 220, width: RW, opacity: 1 - outB, transform: `translateY(${-outB * 120}px)`, filter: `blur(${outB * 12}px)`}}
        lines={[words(copy.scroll[0], 92, 6), words(copy.scroll[1], 104, 5, 0)]}
      />
      <Touch x={760} y={touchY} opacity={touchOn} pressed={f >= 90 && f < 108 ? 1 : 0} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R3 · Turn — the orb drops in with a bounce and swallows the grey feed.

export const RTurn: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 30, (x) => x);
  const land = 1020;
  const size = lerp(f, [0, 62, 95], [240, 240, 3800], easeIn);
  const cy = f < 62 ? -200 + (land - 120 + 200) * bounce(t) : lerp(f, [62, 95], [land - 120, 960], easeIn);
  const contacts: [number, number][] = [
    [11, 0.24],
    [22, 0.12],
    [27, 0.06],
  ];
  const squash = contacts.reduce((k, [fc, s]) => Math.max(k, s * Math.exp(-((f - fc) ** 2) / 3)), 0);
  const wobble = f > 30 && f < 62 ? 0.03 * Math.sin((f - 30) * 0.5) * Math.exp(-(f - 30) / 14) : 0;
  const fade = prog(f, 10, 22);
  const [sx, sy] = shake(f, 11, 9, 10);
  const height = Math.max(0, Math.min(1, (land - (cy + 120)) / 900));
  return (
    <AbsoluteFill style={{background: color.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${1 - 0.03 * fade})`}}>
        <FeedGrid
          id="r3"
          offset={R2_END_OFFSET}
          top={FEED_TOP}
          tile={(r, c) => cloneTile(r, c, 1)}
          style={{opacity: 1 - 0.7 * fade, filter: `blur(${10 * fade}px)`}}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(243,242,239,${0.3 + 0.4 * fade})`}} />
      {f < 62 && (
        <div
          style={{
            position: 'absolute',
            left: RCX - 120 * (1 - 0.5 * height),
            top: land - 18,
            width: 240 * (1 - 0.5 * height),
            height: 36,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(14,15,14,0.28), transparent)',
            opacity: 1 - height * 0.7,
          }}
        />
      )}
      <Ripple x={RCX} y={land} at={11} r={320} c="rgba(14,15,14,0.35)" />
      <div
        style={{
          position: 'absolute',
          left: RCX - size / 2,
          top: cy - size / 2,
          transform: `scale(${1 + squash + wobble}, ${1 - squash - wobble})`,
          transformOrigin: '50% 100%',
        }}
      >
        <Orb size={size} palette="earth" seed={3} shade={f > 70 ? 'flat' : 'light'} speed={1.2} />
      </div>
      <Kinetic
        size={112}
        style={{position: 'absolute', top: 1180, width: RW, opacity: 1 - prog(f, 60, 8)}}
        lines={[
          [
            {t: 'Let’s', at: 34},
            {t: 'fix', at: 40},
            {t: 'that.', at: 46, spark: true},
          ],
        ]}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R4 · Brand — CURIOTHEK on the green field.

export const RBrand: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = lerp(f, [0, 26], [1.12, 1], easeOut) * lerp(f, [84, 95], [1, 1.3], easeIn);
  const whip = prog(f, 84, 11, easeIn);
  const sub = prog(f, 34, 16);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <GreenField w={RW} h={RH} drift={1.6} />
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: `blur(${whip * 16}px)`, opacity: 1 - whip * 0.5}}>
        <OrbWordmark size={132} y={900} c="#fff" reveal={prog(f, 6, 30, (t) => t)} orbScale={back(prog(f, 0, 14))} />
        <div
          style={{
            position: 'absolute',
            top: 1010,
            width: RW,
            textAlign: 'center',
            fontFamily: mono,
            fontSize: 26,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.92)',
            opacity: sub,
            transform: `translateY(${(1 - sub) * 14}px)`,
          }}
        >
          {copy.brandSub}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: 0.65 * (1 - prog(f, 0, 12))}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R5 · Canvas — select the supplier photo, wipe to the finished cover.

const AB = {x: 90, y: 380, w: 900, h: 1200};
const K = AB.w / 1080; // artboard px per slide px

const LabelRow: React.FC<{left: string; chip?: string; chipFlip?: number; opacity?: number}> = ({left, chip, chipFlip = 0, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: AB.x,
      top: AB.y - 56,
      width: AB.w,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: mono,
      fontSize: 22,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: color.muted,
      opacity,
    }}
  >
    <span>{left}</span>
    {chip && (
      <span
        style={{
          padding: '7px 16px',
          borderRadius: 8,
          background: color.ink,
          color: '#fff',
          fontSize: 20,
          transform: `scaleY(${Math.abs(Math.cos(chipFlip * Math.PI))})`,
        }}
      >
        {chip}
      </span>
    )}
  </div>
);

const Handles: React.FC<{x: number; y: number; w: number; h: number; s?: number}> = ({x, y, w, h, s = 16}) => (
  <>
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `2.5px solid ${SEL}`, boxSizing: 'border-box'}} />
    {[0, 0.5, 1].flatMap((u) =>
      [0, 0.5, 1]
        .filter((v) => !(u === 0.5 && v === 0.5))
        .map((v) => (
          <div
            key={`${u}-${v}`}
            style={{
              position: 'absolute',
              left: x + u * w - s / 2,
              top: y + v * h - s / 2,
              width: s,
              height: s,
              background: '#fff',
              border: `2.5px solid ${SEL}`,
              boxSizing: 'border-box',
            }}
          />
        )),
    )}
  </>
);

const Toolbar: React.FC<{p: number; dotPress: number}> = ({p, dotPress}) => {
  const item: React.CSSProperties = {width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14};
  return (
    <div
      style={{
        position: 'absolute',
        left: RCX - 180,
        top: AB.y + 36,
        width: 360,
        height: 84,
        borderRadius: 42,
        background: 'rgba(255,255,255,0.97)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06), 0 18px 44px rgba(20,30,20,0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 18px',
        opacity: Math.min(1, p * 1.6),
        transform: `translateY(${(1 - p) * 20}px) scale(${0.8 + 0.2 * back(p)})`,
      }}
    >
      <div style={{...item, fontFamily: display, fontWeight: 800, fontSize: 34, color: color.ink}}>T</div>
      <div style={item}>
        <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={1.8} strokeLinecap="round">
          <path d="M6 2.5v15.5h15.5M2.5 6H18v15.5" />
        </svg>
      </div>
      <div style={item}>
        <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth={1.8} strokeLinejoin="round">
          <path d="m12 3.5 9 4.5-9 4.5L3 8z" />
          <path d="m3 12.5 9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" opacity={0.5} />
        </svg>
      </div>
      <div style={{...item, transform: `scale(${1 + 0.25 * Math.sin(dotPress * Math.PI)})`}}>
        <Orb size={38} palette="earth" seed={9} speed={2} />
      </div>
    </div>
  );
};

export const RCanvas: React.FC = () => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 22);
  const sel = prog(f, 44, 6) * (1 - prog(f, 72, 8));
  const wipe = prog(f, 76, 40, easeInOut);
  const cx = lerp(f, [18, 40, 56, 68], [1000, 600, 600, 664], easeInOut);
  const cy = lerp(f, [18, 40, 56, 68], [1760, 980, 980, 462], easeInOut);
  const punch = f >= 118 ? 1 + 0.07 * Math.exp(-(f - 118) / 6) * Math.cos((f - 118) * 0.55) : 1;
  const breathe = lerp(f, [130, 195], [1, 1.025], easeInOut);
  const [sx, sy] = shake(f, 118, 10, 12);
  return (
    <AbsoluteFill style={{...paperGrid, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${punch * breathe})`}}>
        <Kinetic
          size={64}
          style={{position: 'absolute', top: 196, width: RW}}
          lines={[
            [
              {t: 'Same', at: 122},
              {t: 'product.', at: 127},
              {t: 'New', at: 136, spark: true},
              {t: 'card.', at: 141, spark: true},
            ],
          ]}
        />
        <LabelRow left={copy.canvasLabel} chip={f < 106 ? copy.before : copy.after} chipFlip={prog(f, 100, 12, (t) => t)} opacity={prog(f, 6, 16)} />
        <div
          style={{
            position: 'absolute',
            left: AB.x,
            top: AB.y,
            width: AB.w,
            height: AB.h,
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 30px 80px rgba(20,30,20,0.13)',
            opacity: inP,
            transform: `translateY(${(1 - inP) * 70}px)`,
            overflow: 'hidden',
          }}
        >
          <Img src={staticFile(img.before('01_oblozhka'))} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
          <Img
            src={staticFile(img.after('01_oblozhka'))}
            style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}
          />
        </div>
        {wipe > 0 && wipe < 1 && (
          <div
            style={{
              position: 'absolute',
              left: AB.x + wipe * AB.w - 7,
              top: AB.y - 34,
              width: 14,
              height: AB.h + 68,
              borderRadius: 7,
              background: 'linear-gradient(180deg, #2C8FD6, #3FA046 50%, #D9CF3A)',
              boxShadow: '0 0 40px rgba(63,160,70,0.65), 0 0 90px rgba(44,143,214,0.35)',
            }}
          />
        )}
        {sel > 0 && (
          <div style={{opacity: sel}}>
            <Handles x={AB.x} y={AB.y} w={AB.w} h={AB.h} />
            <div
              style={{
                position: 'absolute',
                left: RCX - 90,
                top: AB.y + AB.h + 18,
                width: 180,
                padding: '6px 0',
                borderRadius: 8,
                background: SEL,
                color: '#fff',
                fontFamily: mono,
                fontSize: 20,
                textAlign: 'center',
              }}
            >
              {copy.canvasSize}
            </div>
          </div>
        )}
        {f >= 48 && f < 82 && <Toolbar p={prog(f, 48, 14, (t) => t) * (1 - prog(f, 74, 8))} dotPress={prog(f, 70, 8)} />}
        <Ripple x={600} y={980} at={42} c={SEL} />
        <Ripple x={664} y={462} at={70} c={SEL} />
        {f >= 18 && f < 82 && <Cursor x={cx} y={cy} clickAt={[42, 70]} opacity={1 - prog(f, 74, 8)} />}
        <Burst x={RCX} y={AB.y + AB.h / 2} at={118} n={16} radius={620} seed={5} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: 0.5 * (f >= 118 ? 1 - prog(f, 118, 10) : 0)}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R6 · Details — shrink to a thumbnail, then dive into the numbers.

const overshoot = Easing.bezier(0.34, 1.35, 0.64, 1);

export const RDetails: React.FC = () => {
  const f = useCurrentFrame();
  const keys = [0, 8, 28, 60, 80, 115, 135, 158, 175];
  // camera: focus point B (artboard px) is placed at screen point T with scale s
  const B = (sx: number, sy: number) => [AB.x + sx * K, AB.y + sy * K];
  const home = [RCX, AB.y + AB.h / 2];
  const p2 = B(845, 985);
  const p3 = B(845, 1318);
  const s = lerp(f, keys, [1, 1, 0.26, 0.26, 2.0, 2.0, 2.0, 2.0, 1], overshoot);
  const bx = lerp(f, keys, [home[0], home[0], home[0], home[0], p2[0], p2[0], p3[0], p3[0], home[0]]);
  const by = lerp(f, keys, [home[1], home[1], home[1], home[1], p2[1], p2[1], p3[1], p3[1], home[1]]);
  const tx = RCX;
  const ty = lerp(f, keys, [home[1], home[1], 700, 700, 740, 740, 720, 720, home[1]]);
  const T = [tx - s * bx, ty - s * by];
  const fadeTop = 1 - prog(f, 0, 10);

  const callouts = [
    {text: copy.callouts[0], from: 26, to: 60},
    {text: copy.callouts[1], from: 80, to: 115},
    {text: copy.callouts[2], from: 135, to: 160},
  ];
  const regions = [null, [668, 895, 1022, 1068], [668, 1236, 1026, 1402]] as const;
  return (
    <AbsoluteFill style={{...paperGrid, overflow: 'hidden'}}>
      <div style={{opacity: fadeTop}}>
        <Kinetic
          size={64}
          style={{position: 'absolute', top: 196, width: RW}}
          lines={[
            [
              {t: 'Same', at: -99},
              {t: 'product.', at: -99},
              {t: 'New', at: -99, spark: true},
              {t: 'card.', at: -99, spark: true},
            ],
          ]}
        />
        <LabelRow left={copy.canvasLabel} chip={copy.after} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: RW, height: RH, transformOrigin: '0 0', transform: `translate(${T[0]}px, ${T[1]}px) scale(${s})`}}>
        <div
          style={{
            position: 'absolute',
            left: AB.x,
            top: AB.y,
            width: AB.w,
            height: AB.h,
            background: '#fff',
            boxShadow: `0 2px 4px rgba(0,0,0,0.04), 0 ${30 / Math.sqrt(s)}px ${80 / Math.sqrt(s)}px rgba(20,30,20,0.16)`,
            borderRadius: 2 / s,
            overflow: 'hidden',
          }}
        >
          <Img src={staticFile(img.after('01_oblozhka'))} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        {regions.map((r, i) => {
          if (!r) return null;
          const on = prog(f, callouts[i].from - 4, 8) * (1 - prog(f, callouts[i].to, 6));
          if (on <= 0) return null;
          const [x0, y0, x1, y1] = r;
          return (
            <div key={i} style={{opacity: on}}>
              <Handles x={AB.x + x0 * K} y={AB.y + y0 * K} w={(x1 - x0) * K} h={(y1 - y0) * K} s={14 / s} />
            </div>
          );
        })}
      </div>
      {callouts.map((c, i) => {
        const p = prog(f, c.from, 16, (t) => t);
        const out = prog(f, c.to, 8, easeIn);
        if (p <= 0 || out >= 1) return null;
        const ws = c.text.split(' ');
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 90,
              top: i === 0 ? 1000 : 1060,
              width: 900,
              padding: '30px 40px 34px',
              borderRadius: 26,
              background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05), 0 24px 60px rgba(20,30,20,0.14)',
              opacity: Math.min(1, p * 2) * (1 - out),
              transform: `translateY(${(1 - back(p)) * 40 + out * 30}px) scale(${0.92 + 0.08 * back(p)})`,
            }}
          >
            <div style={{fontFamily: mono, fontSize: 22, letterSpacing: '0.1em', color: color.muted}}>{`0${i + 1} / 03`}</div>
            <div style={{fontFamily: display, fontStyle: 'italic', fontWeight: 800, fontSize: 60, letterSpacing: '-0.03em', marginTop: 8, lineHeight: 1.05}}>
              {ws.map((w, wi) => (
                <span key={wi} style={wi === ws.length - 1 ? spark : undefined}>
                  {w}
                  {wi < ws.length - 1 ? ' ' : ''}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R7 · The set — eight slides flash past, then fan out like a winning hand.

const CARD_W = 400;
const CARD_H = 533;
const CARD_TOP = 660;

export const RSet: React.FC = () => {
  const f = useCurrentFrame();
  const flash = f < 80;
  const i = Math.min(7, Math.floor(f / 10));
  const local = f - i * 10;
  const shrink = prog(f, 80, 18, easeInOut);
  const [sx, sy] = shake(f, 84, 8, 8);
  return (
    <AbsoluteFill style={{...paperGrid, overflow: 'hidden'}}>
      <Kinetic
        size={92}
        style={{position: 'absolute', top: 180, width: RW}}
        lines={[
          [
            {t: '8', at: 4, spark: true},
            {t: 'slides.', at: 9},
          ],
          [
            {t: 'One', at: 100},
            {t: 'system.', at: 106, spark: true},
          ],
        ]}
      />
      {flash ? (
        <>
          <LabelRow left={`Card 0${i + 1}`} chip={`0${i + 1} / 08`} />
          <div
            style={{
              position: 'absolute',
              left: AB.x,
              top: AB.y,
              width: AB.w,
              height: AB.h,
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 30px 80px rgba(20,30,20,0.13)',
              overflow: 'hidden',
              transform: `rotate(${(i % 2 ? 1 : -1) * 4 * (1 - prog(local, 0, 6))}deg) scale(${1.05 - 0.05 * prog(local, 0, 6)})`,
            }}
          >
            <Img src={staticFile(img.after(slides[i]))} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        </>
      ) : (
        <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
          {slides.map((s, k) => {
            const fan = back(prog(f, 88 + k * 2, 22, (t) => t));
            const angle = (k - 3.5) * 8.5 * fan + Math.sin(f * 0.05 + k) * 0.6 * fan;
            const scale = (AB.w / CARD_W) * (1 - shrink) + shrink;
            const dy = (AB.y + AB.h / 2 - (CARD_TOP + CARD_H / 2)) * (1 - shrink);
            return (
              <div
                key={s}
                style={{
                  position: 'absolute',
                  left: RCX - CARD_W / 2,
                  top: CARD_TOP,
                  width: CARD_W,
                  height: CARD_H,
                  zIndex: k,
                  transform: `translateY(${dy}px) scale(${scale})`,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05), 0 18px 40px rgba(20,30,20,0.16)',
                    transformOrigin: `50% ${((CARD_H + 950) / CARD_H) * 100}%`,
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <Img src={staticFile(img.after(s))} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R8 · Payoff — same feed, but now one card stops the thumb.

const HERO = {row: 5, col: 0};
const HERO_CENTER = 1060;
const R8_END = FEED_TOP + HERO.row * PITCH + TILE_H / 2 - HERO_CENTER;
const r8Scroll = (f: number) => R8_END * easeOut(prog(f, 0, 50, (t) => t));

export const RPayoff: React.FC = () => {
  const f = useCurrentFrame();
  const {offset, speed} = scrollAt(r8Scroll, f);
  const lift = Math.min(1, back(prog(f, 48, 16, (t) => t)));
  const press = f >= 80 && f < 90 ? Math.sin(((f - 80) / 10) * Math.PI) : 0;
  const liked = prog(f, 86, 6);
  const tx = lerp(f, [62, 80], [830, 300], easeInOut);
  const ty = lerp(f, [62, 80], [1520, 1010], easeInOut);
  const touchOn = prog(f, 60, 6) * (1 - prog(f, 90, 10));
  const toast = back(prog(f, 96, 18, (t) => t));
  const [sx, sy] = shake(f, 48, 8, 9);
  return (
    <AbsoluteFill style={{background: color.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
        <FeedGrid
          id="r8blur"
          offset={offset}
          top={FEED_TOP}
          blur={Math.min(22, speed * 0.14)}
          tile={(r, c) =>
            r === HERO.row && c === HERO.col
              ? {src: img.after('01_oblozhka'), lift: lift * (1 - 0.04 * press), liked}
              : cloneTile(r, c, 0.9, prog(f, 50, 16))
          }
        />
      </AbsoluteFill>
      <TopBand />
      <Kinetic
        size={104}
        style={{position: 'absolute', top: 180, width: RW}}
        lines={[
          [
            {t: 'Now', at: 40},
            {t: 'they', at: 45},
            {t: 'stop.', at: 50, spark: true},
          ],
          [
            {t: 'And', at: 92},
            {t: 'tap.', at: 98, spark: true},
          ],
        ]}
      />
      <Touch x={tx} y={ty} opacity={touchOn} pressed={press} />
      <Ripple x={300} y={1010} at={82} r={90} />
      <Burst x={460} y={HERO_CENTER - TILE_H / 2 + 50} at={86} n={9} radius={200} seed={11} />
      {f >= 96 && (
        <div
          style={{
            position: 'absolute',
            top: 452,
            width: RW,
            display: 'flex',
            justifyContent: 'center',
            opacity: Math.min(1, prog(f, 96, 6) * 1.5),
            transform: `translateY(${(1 - toast) * -40}px) scale(${0.85 + 0.15 * toast})`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 34px 20px 22px',
              borderRadius: 40,
              background: color.ink,
              color: '#fff',
              fontFamily: display,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: '-0.01em',
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{width: 44, height: 44, borderRadius: 22, background: '#3FAF6A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name="check" size={28} c="#fff" stroke={2.6} />
            </div>
            {copy.added}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// R9 · End card — the orb flies into the O.

export const REnd: React.FC = () => {
  const f = useCurrentFrame();
  const wordY = 800;
  const o = 132 * 0.78;
  const fly = prog(f, 0, 26, easeInOut);
  const flySize = 520 + (o - 520) * fly;
  const flyY = 960 + (wordY - 960) * fly;
  const landed = f >= 26;
  const ctaP = back(prog(f, 92, 16, (t) => t));
  const breathe = f > 120 ? 1 + 0.03 * Math.sin((f - 120) * 0.16) : 1;
  const shineAt = [126, 168].find((a) => f >= a && f < a + 22);
  const shine = shineAt !== undefined ? prog(f, shineAt, 22, easeInOut) : -1;
  return (
    <AbsoluteFill style={{background: color.paper, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: -360,
          top: -300,
          width: 1200,
          height: 1200,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${color.aqua}, transparent)`,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 1300,
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${color.sage}, transparent)`,
          opacity: 0.35,
        }}
      />
      <svg width={RW} height={RH} style={{position: 'absolute', opacity: prog(f, 30, 20) * 0.9}}>
        {[0, 60, 120].map((a, i) => (
          <ellipse
            key={i}
            cx={RCX}
            cy={wordY}
            rx={150}
            ry={52}
            transform={`rotate(${a + f * 0.7} ${RCX} ${wordY})`}
            fill="none"
            stroke="rgba(14,15,14,0.45)"
            strokeWidth={2.4}
            strokeDasharray="0.1 10"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <OrbWordmark size={132} y={wordY} c={color.ink} reveal={prog(f, 22, 30, (t) => t)} showOrb={landed} orbScale={1 + 0.2 * Math.sin(prog(f, 26, 10) * Math.PI)} />
      {!landed && (
        <div style={{position: 'absolute', left: RCX - flySize / 2, top: flyY - flySize / 2}}>
          <Orb size={flySize} palette="earth" seed={4} speed={1.3} shade="light" />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: 905,
          width: RW,
          textAlign: 'center',
          fontFamily: mono,
          fontSize: 24,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: color.muted,
          opacity: prog(f, 40, 16),
        }}
      >
        {copy.brandSub}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1000,
          width: RW,
          textAlign: 'center',
          fontFamily: display,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: '-0.025em',
        }}
      >
        <Typewriter text={copy.tagline} start={52} cps={1} caretUntil={112} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1132,
          width: RW,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, prog(f, 92, 6) * 1.5),
          transform: `scale(${(0.8 + 0.2 * ctaP) * breathe})`,
        }}
      >
        <div style={{position: 'relative', overflow: 'hidden', borderRadius: 60}}>
          <Pill label={copy.cta} scale={1.4} style={{borderRadius: 60, padding: '32px 64px', fontFamily: display, fontWeight: 600}} />
          {shine >= 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${-40 + shine * 160}%`,
                width: '30%',
                background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)',
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1310,
          width: RW,
          textAlign: 'center',
          fontFamily: mono,
          fontSize: 26,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: color.inkSoft,
          opacity: prog(f, 110, 16),
          transform: `translateY(${Math.sin(Math.max(0, f - 126) * 0.2) * 4}px)`,
        }}
      >
        {copy.ctaSub} ↓
      </div>
    </AbsoluteFill>
  );
};
