import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {color, font, orbPalettes, OrbPalette, script} from './theme';
import {prog} from './motion';

// ---------------------------------------------------------------------------
// Orb — the multicolour sphere. Soft colour blobs drift inside a clipped circle.

const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const Orb: React.FC<{
  size: number;
  palette?: OrbPalette;
  seed?: number;
  speed?: number;
  /** 'dark' = lit sphere on black, 'light' = glossy on paper, 'flat' = no shading */
  shade?: 'dark' | 'light' | 'flat';
  /** 0..1 — light sweeping across the sphere (crescent → full). */
  reveal?: number;
  style?: React.CSSProperties;
}> = ({size, palette = 'earth', seed = 1, speed = 1, shade = 'light', reveal = 1, style}) => {
  const frame = useCurrentFrame();
  const p = orbPalettes[palette];
  const t = (frame / 30) * speed;
  const blob = size * 0.95;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        background: p.base,
        flexShrink: 0,
        ...style,
      }}
    >
      <div style={{position: 'absolute', inset: 0, filter: `blur(${size * 0.05}px)`, transform: `rotate(${t * 14 + seed * 40}deg)`}}>
        {p.blobs.map((c, i) => {
          const ph = rand(seed * 7 + i) * Math.PI * 2;
          const r = 0.22 + rand(seed * 3 + i) * 0.22;
          const x = 0.5 + r * Math.cos(t * (0.6 + i * 0.13) + ph);
          const y = 0.5 + r * Math.sin(t * (0.5 + i * 0.11) + ph * 1.3);
          const s = blob * (0.55 + rand(seed + i * 5) * 0.5);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x * size - s / 2,
                top: y * size - s / 2,
                width: s,
                height: s,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${c} 0%, ${c} 28%, transparent 68%)`,
              }}
            />
          );
        })}
      </div>
      {shade === 'dark' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 36% 32%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      )}
      {shade === 'light' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 34% 28%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 45%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.12) 100%)',
          }}
        />
      )}
      {reveal < 1 && (
        <div
          style={{
            position: 'absolute',
            inset: -2,
            background: `radial-gradient(circle at ${-70 + 120 * reveal}% 42%, rgba(0,0,0,0) ${20 + 45 * reveal}%, rgba(0,0,0,1) ${48 + 60 * reveal}%)`,
          }}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// GreenField — the blurred green/aqua atmosphere used behind hero moments.

export const GreenField: React.FC<{intensity?: number; drift?: number; style?: React.CSSProperties}> = ({
  intensity = 1,
  drift = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * drift;
  const blob = (x: number, y: number, s: number, c: string, a: number) => (
    <div
      style={{
        position: 'absolute',
        left: x - s / 2,
        top: y - s / 2,
        width: s,
        height: s,
        borderRadius: '50%',
        background: `radial-gradient(closest-side, ${c} 0%, ${c} 35%, transparent 100%)`,
        opacity: a * intensity,
      }}
    />
  );
  return (
    <AbsoluteFill style={{background: color.mist, overflow: 'hidden', ...style}}>
      {blob(1350 + 120 * Math.sin(t * 0.35), 820 + 60 * Math.cos(t * 0.3), 1700, color.deepGreen, 0.95)}
      {blob(1000 + 160 * Math.cos(t * 0.25), 380 + 80 * Math.sin(t * 0.4), 1300, color.green, 0.85)}
      {blob(260 + 120 * Math.sin(t * 0.3 + 1), 760 + 80 * Math.cos(t * 0.35), 1200, color.aqua, 0.95)}
      {blob(520 + 90 * Math.cos(t * 0.45), 140 + 60 * Math.sin(t * 0.3), 1100, '#C9E9E0', 0.9)}
      {blob(120 + 60 * Math.sin(t * 0.2), 120, 900, '#FFFFFF', 0.75)}
      {blob(1780, 140 + 80 * Math.sin(t * 0.3), 900, '#DDEDE3', 0.7)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Typewriter — fresh characters arrive in teal and settle into ink.

export const Typewriter: React.FC<{
  text: string;
  start: number;
  cps?: number; // characters per frame
  inkColor?: string;
  freshColor?: string;
  caret?: boolean;
  caretUntil?: number;
  style?: React.CSSProperties;
}> = ({text, start, cps = 0.8, inkColor = color.ink, freshColor = color.teal, caret = true, caretUntil = 1e9, style}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const shown = Math.max(0, Math.min(chars.length, Math.floor((frame - start) * cps)));
  const done = shown >= chars.length;
  const doneAt = start + chars.length / cps;
  const blinkOn = !done || Math.floor((frame - doneAt) / 14) % 2 === 0;
  return (
    <span style={{whiteSpace: 'pre-wrap', ...style}}>
      {chars.slice(0, shown).map((ch, i) => {
        const age = frame - (start + i / cps);
        const c = interpolateColors(Math.min(1, age / 10), [0, 1], [freshColor, inkColor]);
        const a = Math.min(1, 0.35 + age / 4);
        return (
          <span key={i} style={{color: c, opacity: a}}>
            {ch}
          </span>
        );
      })}
      {caret && frame >= start && frame < caretUntil && (
        <span
          style={{
            display: 'inline-block',
            width: '0.06em',
            height: '1.05em',
            marginLeft: '0.04em',
            verticalAlign: '-0.15em',
            background: freshColor,
            opacity: blinkOn ? 1 : 0,
          }}
        />
      )}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Logo mark (two overlapping rings with a filled lens) and wordmark.

export const Mark: React.FC<{size: number; c?: string; fill?: number}> = ({size, c = color.ink, fill = 1}) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 30 20" style={{display: 'block'}}>
    <defs>
      <clipPath id="mark-a">
        <circle cx="10" cy="10" r="8.6" />
      </clipPath>
    </defs>
    <circle cx="10" cy="10" r="8.6" fill="none" stroke={c} strokeWidth="2.2" />
    <circle cx="20" cy="10" r="8.6" fill="none" stroke={c} strokeWidth="2.2" />
    <circle cx="20" cy="10" r="8.6" fill={c} clipPath="url(#mark-a)" opacity={fill} />
  </svg>
);

export const Wordmark: React.FC<{
  size: number;
  c?: string;
  progress?: number; // 0..1 letter reveal
  mark?: boolean;
}> = ({size, c = color.ink, progress = 1, mark = true}) => {
  const {brand, product} = script;
  const letters = Array.from(brand + ' ' + product);
  const bold = brand.length;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.32, color: c, fontFamily: font.sans}}>
      {mark && <Mark size={size * 0.78} c={c} />}
      <div style={{fontSize: size, letterSpacing: '-0.035em', lineHeight: 1, whiteSpace: 'pre'}}>
        {letters.map((ch, i) => {
          const local = Math.max(0, Math.min(1, progress * letters.length * 0.55 - i * 0.45));
          return (
            <span
              key={i}
              style={{
                fontWeight: i < bold ? 650 : 380,
                opacity: local,
                filter: `blur(${(1 - local) * 8}px)`,
                display: 'inline-block',
                transform: `translateY(${(1 - local) * size * 0.12}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// UI atoms

export const Card: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      background: color.card,
      borderRadius: 18,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 14px 40px rgba(20,30,20,0.07)',
      fontFamily: font.sans,
      color: color.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Toggle: React.FC<{on: number; scale?: number}> = ({on, scale = 1}) => {
  const w = 52 * scale;
  const h = 30 * scale;
  const k = 22 * scale;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h,
        background: interpolateColors(on, [0, 1], ['#D9DAD7', color.ink]),
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: (h - k) / 2,
          left: (h - k) / 2 + on * (w - h),
          width: k,
          height: k,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

type IconName =
  | 'chat'
  | 'send'
  | 'phone'
  | 'mail'
  | 'globe'
  | 'tag'
  | 'box'
  | 'doc'
  | 'check'
  | 'arrowUp'
  | 'person'
  | 'spark';

const iconPaths: Record<IconName, React.ReactNode> = {
  chat: <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4z" />,
  send: <path d="M3.5 11.5 20.5 4l-7.5 17-2.2-7.3zM10.8 13.7 20.5 4" />,
  phone: (
    <path d="M6.5 3.5h3l1.5 4.2-2 1.3a10 10 0 0 0 6 6l1.3-2 4.2 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5z" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4.5h8l9 9-8 8z" />
      <circle cx="8" cy="9" r="1.4" />
    </>
  ),
  box: (
    <>
      <path d="m12 3.5 8 4v9l-8 4-8-4v-9z" />
      <path d="m4 7.5 8 4 8-4M12 11.5v9" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  person: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5c1.2-3.8 4-5.8 7.5-5.8s6.3 2 7.5 5.8" />
    </>
  ),
  spark: <path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5M6.2 6.2l3 3M14.8 14.8l3 3M17.8 6.2l-3 3M9.2 14.8l-3 3" />,
};

export const Icon: React.FC<{name: IconName; size?: number; c?: string; stroke?: number}> = ({
  name,
  size = 24,
  c = 'currentColor',
  stroke = 1.6,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{display: 'block'}}
  >
    {iconPaths[name]}
  </svg>
);

/** Black pill with an icon — the "action" chip. */
export const Pill: React.FC<{icon?: IconName; label: string; scale?: number; style?: React.CSSProperties}> = ({
  icon,
  label,
  scale = 1,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14 * scale,
      padding: `${18 * scale}px ${30 * scale}px`,
      borderRadius: 18 * scale,
      background: color.ink,
      color: '#fff',
      fontFamily: font.sans,
      fontSize: 30 * scale,
      fontWeight: 450,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon && <Icon name={icon} size={30 * scale} c="#fff" />}
    {label}
  </div>
);

/** Fade-and-rise entrance helper. */
export const Rise: React.FC<{start: number; dur?: number; dist?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  start,
  dur = 18,
  dist = 24,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, start, dur);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dist}px)`, ...style}}>{children}</div>;
};
