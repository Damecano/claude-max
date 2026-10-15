import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {Card, GreenField, Icon, Mark, Orb, Pill, Rise, Toggle, Typewriter, Wordmark} from './components';
import {easeIn, easeInOut, easeOut, inOut, lerp, prog} from './motion';
import {color, font, H, script, W} from './theme';

const CX = W / 2;
const CY = H / 2;

const Paper: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{background: color.paper, fontFamily: font.sans, color: color.ink, ...style}}>{children}</AbsoluteFill>
);

const bez = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
type Pt = [number, number];
const bezPt = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => [
  bez(p0[0], p1[0], p2[0], p3[0], t),
  bez(p0[1], p1[1], p2[1], p3[1], t),
];
const pathD = (p0: Pt, p1: Pt, p2: Pt, p3: Pt) => `M${p0} C${p1} ${p2} ${p3}`;

/** Thin line that draws itself on. */
const DrawPath: React.FC<{d: string; p: number; stroke?: string; width?: number; dash?: string}> = ({
  d,
  p,
  stroke = color.line,
  width = 1.6,
}) => <path d={d} fill="none" stroke={stroke} strokeWidth={width} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;

// ---------------------------------------------------------------------------
// 1 · Dark open — an orb is lit out of the dark, orbit lines draw around it.

export const DarkOpen: React.FC = () => {
  const f = useCurrentFrame();
  const draw = prog(f, 4, 60);
  const reveal = lerp(f, [0, 75], [0, 1], easeOut);
  const size = lerp(f, [0, 100, 148], [330, 350, 140], easeInOut);
  const lines = 1 - prog(f, 112, 30, easeIn);
  const text = inOut(f, 58, 132, 18, 14);
  const ellipses = [-18, 24, 78];
  return (
    <AbsoluteFill style={{background: color.night}}>
      <svg width={W} height={H} style={{position: 'absolute', opacity: lines}}>
        {ellipses.map((a, i) => (
          <ellipse
            key={i}
            cx={CX}
            cy={CY - 30}
            rx={560 - i * 40}
            ry={190 + i * 30}
            transform={`rotate(${a + f * (0.05 + i * 0.03)} ${CX} ${CY - 30})`}
            fill="none"
            stroke={color.lineDark}
            strokeWidth={1.4}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - Math.max(0, Math.min(1, draw * 1.3 - i * 0.15))}
          />
        ))}
      </svg>
      <div style={{position: 'absolute', left: CX - size / 2, top: CY - 30 - size / 2}}>
        <Orb size={size} palette="earth" seed={3} shade="dark" reveal={reveal} speed={0.8} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 850,
          width: W,
          textAlign: 'center',
          fontFamily: font.sans,
          fontSize: 44,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.92)',
          opacity: text,
          transform: `translateY(${(1 - prog(f, 58, 22)) * 18}px)`,
        }}
      >
        {script.open}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2 · Question storm — questions pile up in the dark, then get pulled into the orb.

const QPOS: Pt[] = [
  [-560, -290],
  [430, -320],
  [-700, 30],
  [610, -40],
  [-470, 290],
  [480, 280],
  [-60, -400],
  [40, 390],
];

export const QuestionStorm: React.FC = () => {
  const f = useCurrentFrame();
  const absorb = (i: number) => prog(f, 64 + i * 2.5, 22, easeIn);
  const pulse = 1 + 0.08 * Math.sin(Math.max(0, f - 70) * 0.35) * prog(f, 70, 10) * (1 - prog(f, 96, 6));
  const size = lerp(f, [0, 98, 124], [140, 150, 2600], easeIn) * pulse;
  const ring = prog(f, 0, 20) * (1 - prog(f, 96, 12));
  return (
    <AbsoluteFill style={{background: color.night, fontFamily: font.sans}}>
      <svg width={W} height={H} style={{position: 'absolute', opacity: ring}}>
        <circle cx={CX} cy={CY - 30} r={240 + f * 0.4} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.4} strokeDasharray="2 9" />
        <circle cx={CX} cy={CY - 30} r={430 + f * 0.6} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.2} strokeDasharray="2 12" />
      </svg>
      {script.questions.map((q, i) => {
        const pin = prog(f, 4 + i * 6, 16);
        const a = absorb(i);
        const [x, y] = QPOS[i];
        const px = CX + x * (1 - a);
        const py = CY - 30 + y * (1 - a);
        return (
          <div
            key={q}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              transform: `translate(-50%, -50%) scale(${(0.85 + 0.15 * pin) * (1 - a * 0.9)})`,
              opacity: pin * (1 - prog(f, 72 + i * 2.5, 14)),
              padding: '18px 28px',
              borderRadius: 22,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 28,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {q}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: CX - size / 2, top: CY - 30 - size / 2}}>
        <Orb size={size} palette="earth" seed={3} shade={f > 100 ? 'flat' : 'dark'} speed={0.8} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3 · Brand reveal on the green field.

export const BrandReveal: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = lerp(f, [0, 100], [1.0, 1.04], easeInOut);
  return (
    <AbsoluteFill>
      <GreenField drift={1.4} style={{transform: `scale(${zoom})`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - prog(f, 84, 14, easeIn)}}>
        <Wordmark size={92} c="#FFFFFF" progress={prog(f, 14, 44, easeInOut)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4 · Headline typed in, then the prompt box.

export const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const out = prog(f, 64, 16, easeIn);
  return (
    <Paper>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - out,
          transform: `scale(${1 - out * 0.06})`,
        }}
      >
        <div style={{fontSize: 136, fontWeight: 500, letterSpacing: '-0.045em'}}>
          <Typewriter text={script.headline} start={6} cps={0.6} />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

export const Prompt: React.FC = () => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 20);
  const press = f >= 50 ? 1 - 0.14 * Math.sin(Math.min(1, (f - 50) / 8) * Math.PI) : 1;
  const out = prog(f, 60, 15, easeIn);
  return (
    <Paper>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1040,
            height: 104,
            borderRadius: 52,
            background: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 18px 50px rgba(20,30,20,0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px 0 44px',
            gap: 20,
            opacity: inP * (1 - out),
            transform: `translateY(${(1 - inP) * 20 - out * 60}px) scale(${0.97 + 0.03 * inP})`,
          }}
        >
          <div style={{flex: 1, fontSize: 32, letterSpacing: '-0.015em'}}>
            <Typewriter text={script.prompt} start={8} cps={1.2} caretUntil={50} />
          </div>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: color.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${press})`,
            }}
          >
            <Icon name="arrowUp" size={30} c="#fff" stroke={2} />
          </div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// 5 · Chat demo in a frosted panel over the green field.

const Bubble: React.FC<{side: 'me' | 'bot'; children: React.ReactNode; start: number; style?: React.CSSProperties}> = ({
  side,
  children,
  start,
  style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, start, 16);
  if (f < start) return null;
  return (
    <div
      style={{
        alignSelf: side === 'me' ? 'flex-end' : 'flex-start',
        maxWidth: 520,
        padding: '18px 24px',
        borderRadius: side === 'me' ? '24px 24px 6px 24px' : '24px 24px 24px 6px',
        background: side === 'me' ? '#FFFFFF' : 'rgba(255,255,255,0.62)',
        border: side === 'me' ? 'none' : '1px solid rgba(255,255,255,0.7)',
        fontSize: 26,
        lineHeight: 1.35,
        letterSpacing: '-0.01em',
        color: color.ink,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px) scale(${0.96 + 0.04 * p})`,
        transformOrigin: side === 'me' ? 'right bottom' : 'left bottom',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const ChatDemo: React.FC = () => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 24);
  const zoom = lerp(f, [0, 190], [1, 1.035], easeInOut);
  const typing = f >= 34 && f < 60;
  const press = f >= 130 ? 1 - 0.12 * Math.sin(Math.min(1, (f - 130) / 8) * Math.PI) : 1;
  return (
    <AbsoluteFill style={{fontFamily: font.sans}}>
      <GreenField drift={1.2} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <div
          style={{
            width: 780,
            height: 880,
            borderRadius: 40,
            background: 'rgba(255,255,255,0.26)',
            border: '1.5px solid rgba(255,255,255,0.6)',
            boxShadow: '0 30px 80px rgba(20,50,30,0.18)',
            opacity: inP,
            transform: `translateY(${(1 - inP) * 50}px)`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '26px 32px',
              borderBottom: '1px solid rgba(255,255,255,0.55)',
            }}
          >
            <Orb size={48} palette="meadow" seed={5} />
            <div style={{fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em', color: color.ink}}>
              {script.brand} {script.product}
            </div>
            <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, color: color.inkSoft}}>
              <div style={{width: 10, height: 10, borderRadius: 5, background: '#3FAF6A'}} />
              online
            </div>
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 18, padding: '32px 32px'}}>
            <Bubble side="me" start={18}>
              {script.chat.q1}
            </Bubble>
            {typing && (
              <Bubble side="bot" start={34} style={{display: 'flex', gap: 8, padding: '24px 26px'}}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 6,
                      background: color.inkSoft,
                      opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 4) * 0.3)),
                    }}
                  />
                ))}
              </Bubble>
            )}
            <Bubble side="bot" start={60}>
              <Typewriter text={script.chat.a1} start={60} cps={1.1} caretUntil={112} />
            </Bubble>
            {f >= 112 && (
              <Rise start={112} dur={16} dist={14} style={{alignSelf: 'flex-start'}}>
                <Card style={{display: 'flex', alignItems: 'center', gap: 18, padding: 14, paddingRight: 16, width: 470, borderRadius: 20}}>
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 14,
                      background: `linear-gradient(140deg, ${color.sage}, ${color.deepGreen})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="tag" size={32} c="#fff" />
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 23, fontWeight: 600, letterSpacing: '-0.01em'}}>{script.chat.product}</div>
                    <div style={{fontSize: 19, color: '#3B8A5A', marginTop: 4}}>{script.chat.stock}</div>
                  </div>
                  <div
                    style={{
                      padding: '12px 20px',
                      borderRadius: 12,
                      background: color.ink,
                      color: '#fff',
                      fontSize: 20,
                      transform: `scale(${press})`,
                    }}
                  >
                    Reserve
                  </div>
                </Card>
              </Rise>
            )}
            <Bubble side="me" start={138}>
              {script.chat.q2}
            </Bubble>
            <Bubble side="bot" start={154} style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <Icon name="check" size={26} c="#2F8F57" stroke={2.2} />
              <Typewriter text={script.chat.a2} start={156} cps={1.2} caretUntil={190} />
            </Bubble>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6 · Knowledge — store data flows into the orb along thin lines.

export const Knowledge: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = lerp(f, [0, 155], [1.05, 1], easeOut);
  const icons = ['tag', 'box', 'doc'] as const;
  const ys = [330, 540, 750];
  const orbC: Pt = [1000, 540];
  const draw = prog(f, 16, 34, easeInOut);
  const outLine = prog(f, 58, 16, easeInOut);
  const pillP = prog(f, 70, 18);
  const out = prog(f, 140, 15, easeIn);
  return (
    <Paper>
      <AbsoluteFill style={{transform: `scale(${zoom})`, opacity: 1 - out}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {ys.map((y, i) => {
            const p0: Pt = [610, y];
            const p1: Pt = [780, y];
            const p2: Pt = [800, orbC[1]];
            const p3: Pt = [orbC[0] - 110, orbC[1]];
            const dots = [0, 1, 2].map((k) => {
              const t = (((f - 48 - i * 7 - k * 14) / 42) % 1 + 1) % 1;
              const [x, yy] = bezPt(p0, p1, p2, p3, t);
              const vis = f > 48 + i * 7 + k * 14 ? Math.sin(t * Math.PI) : 0;
              return <circle key={k} cx={x} cy={yy} r={5} fill={color.ink} opacity={vis} />;
            });
            return (
              <g key={i}>
                <DrawPath d={pathD(p0, p1, p2, p3)} p={Math.max(0, Math.min(1, draw * 1.25 - i * 0.12))} stroke="rgba(14,15,14,0.28)" />
                {dots}
              </g>
            );
          })}
          <DrawPath d={`M${orbC[0] + 110},${orbC[1]} L1250,${orbC[1]}`} p={outLine} stroke="rgba(14,15,14,0.28)" />
        </svg>
        {script.sources.map((s, i) => (
          <Rise key={s} start={2 + i * 6} style={{position: 'absolute', left: 210, top: ys[i] - 56}}>
            <Card style={{width: 400, height: 112, display: 'flex', alignItems: 'center', gap: 22, padding: '0 30px'}}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: color.mist,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={icons[i]} size={30} c={color.deepGreen} />
              </div>
              <div style={{fontSize: 28, fontWeight: 500, letterSpacing: '-0.015em'}}>{s}</div>
            </Card>
          </Rise>
        ))}
        <div
          style={{
            position: 'absolute',
            left: orbC[0] - 105,
            top: orbC[1] - 105,
            transform: `scale(${prog(f, 6, 26) * (1 + 0.04 * Math.sin(f * 0.12))})`,
          }}
        >
          <Orb size={210} palette="meadow" seed={8} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1250,
            top: orbC[1] - 38,
            opacity: pillP,
            transform: `scale(${0.85 + 0.15 * pillP})`,
            transformOrigin: 'left center',
          }}
        >
          <Pill icon="check" label={script.grounded} />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// 7 · Languages — one bubble, greetings roll through.

export const Languages: React.FC = () => {
  const f = useCurrentFrame();
  const inP = prog(f, 4, 20);
  const step = 27;
  const start = 14;
  const out = prog(f, 114, 14, easeIn);
  return (
    <AbsoluteFill style={{fontFamily: font.sans}}>
      <GreenField drift={1.3} />
      {[
        {s: 70, x: 330, y: 300, p: 'ice' as const, sd: 2},
        {s: 46, x: 1560, y: 760, p: 'lime' as const, sd: 6},
        {s: 34, x: 1460, y: 270, p: 'sea' as const, sd: 9},
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: o.x + 30 * Math.sin(f * 0.03 + i),
            top: o.y + 20 * Math.cos(f * 0.025 + i),
            opacity: prog(f, 6 + i * 6, 20) * (1 - out),
          }}
        >
          <Orb size={o.s} palette={o.p} seed={o.sd} />
        </div>
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
        <div
          style={{
            color: '#fff',
            fontSize: 30,
            fontWeight: 450,
            letterSpacing: '-0.01em',
            marginBottom: 34,
            textShadow: '0 1px 18px rgba(20,60,40,0.35)',
            opacity: inP,
            transform: `translateY(${(1 - inP) * 12}px)`,
          }}
        >
          {script.languagesLabel}
        </div>
        <div
          style={{
            width: 980,
            height: 120,
            borderRadius: 34,
            background: 'rgba(255,255,255,0.72)',
            border: '1.5px solid rgba(255,255,255,0.85)',
            position: 'relative',
            overflow: 'hidden',
            opacity: inP,
            transform: `translateY(${(1 - inP) * 24}px)`,
          }}
        >
          {script.greetings.map((g, i) => {
            const a = start + i * step;
            const pin = i === 0 ? 1 : prog(f, a, 14, easeOut);
            const pout = i === script.greetings.length - 1 ? 0 : prog(f, a + step, 14, easeInOut);
            if (f < a - 1 && i !== 0) return null;
            return (
              <div
                key={g}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  letterSpacing: '-0.02em',
                  color: color.ink,
                  opacity: pin * (1 - pout),
                  transform: `translateY(${(1 - pin) * 50 - pout * 50}px)`,
                  filter: `blur(${(1 - pin) * 6 + pout * 6}px)`,
                }}
              >
                {g}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 8 · Channels — a line splits into five channels that switch on one by one.

export const Channels: React.FC = () => {
  const f = useCurrentFrame();
  const icons = ['chat', 'send', 'phone', 'mail', 'globe'] as const;
  const top: Pt = [CX, 330];
  const iconY = 600;
  const stem = prog(f, 0, 22, easeInOut);
  const branches = prog(f, 16, 26, easeInOut);
  const out = prog(f, 128, 14, easeIn);
  return (
    <Paper>
      <AbsoluteFill style={{opacity: 1 - out}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <DrawPath d={`M${CX},0 L${CX},${top[1]}`} p={stem} stroke="rgba(14,15,14,0.3)" />
          {icons.map((_, i) => {
            const x = CX + (i - 2) * 200;
            return (
              <DrawPath
                key={i}
                d={pathD(top, [CX, top[1] + 110], [x, iconY - 160], [x, iconY - 52])}
                p={branches}
                stroke="rgba(14,15,14,0.3)"
              />
            );
          })}
        </svg>
        {icons.map((name, i) => {
          const x = CX + (i - 2) * 200;
          const pop = prog(f, 34 + i * 4, 18, Easing_back);
          const on = prog(f, 58 + i * 7, 10);
          const bump = 1 + 0.1 * Math.sin(on * Math.PI);
          return (
            <div
              key={name}
              style={{
                position: 'absolute',
                left: x - 50,
                top: iconY - 50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: interpolateColors(on, [0, 1], ['#FFFFFF', color.ink]),
                boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 12px 30px rgba(20,30,20,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: Math.min(1, pop * 1.5),
                transform: `scale(${(0.6 + 0.4 * pop) * bump})`,
              }}
            >
              <Icon name={name} size={40} c={interpolateColors(on, [0, 1], [color.ink, '#FFFFFF'])} />
            </div>
          );
        })}
        <Rise start={96} style={{position: 'absolute', top: 760, width: W, textAlign: 'center'}}>
          <div style={{fontSize: 52, fontWeight: 500, letterSpacing: '-0.035em'}}>{script.channelsLabel}</div>
        </Rise>
      </AbsoluteFill>
    </Paper>
  );
};

// a soft overshoot for pops
const Easing_back = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// ---------------------------------------------------------------------------
// 9 · Rules — guardrail cards shuffle in and switch on.

export const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const out = prog(f, 124, 16, easeIn);
  return (
    <Paper>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Rise start={0} style={{opacity: 1 - out}}>
          <div style={{fontSize: 26, color: color.muted, letterSpacing: '0.02em', marginBottom: 40, textAlign: 'center'}}>
            {script.rulesLabel}
          </div>
        </Rise>
        <div style={{position: 'relative', width: 900, height: 470}}>
          {script.rules.map((r, i) => {
            const p = prog(f, 6 + i * 9, 24);
            const on = prog(f, 48 + i * 18, 10, easeInOut);
            const lift = Math.sin(on * Math.PI);
            const y = i * 155 + (1 - p) * 120 - out * (60 + i * 20);
            return (
              <Card
                key={r.title}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: y,
                  width: 900,
                  height: 128,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  padding: '0 40px',
                  opacity: p * (1 - out),
                  transform: `scale(${0.96 + 0.04 * p + 0.015 * lift}) rotate(${(1 - p) * (i % 2 ? 2 : -2)}deg)`,
                  boxShadow: `0 1px 2px rgba(0,0,0,0.05), 0 ${14 + lift * 16}px ${40 + lift * 20}px rgba(20,30,20,${0.07 + lift * 0.05})`,
                }}
              >
                <Toggle on={on} scale={1.15} />
                <div>
                  <div style={{fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em'}}>{r.title}</div>
                  <div style={{fontSize: 23, color: color.muted, marginTop: 6, letterSpacing: '-0.005em'}}>{r.body}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// 10 · Insights — an orb rides a curve; what shoppers ask surfaces along it.

export const Insights: React.FC = () => {
  const f = useCurrentFrame();
  const segA: [Pt, Pt, Pt, Pt] = [
    [-60, 780],
    [420, 780],
    [560, 420],
    [960, 440],
  ];
  const segB: [Pt, Pt, Pt, Pt] = [
    [960, 440],
    [1360, 460],
    [1480, 760],
    [1980, 300],
  ];
  const t = lerp(f, [4, 120], [0, 1], easeInOut);
  const pt = t < 0.5 ? bezPt(...segA, t * 2) : bezPt(...segB, (t - 0.5) * 2);
  const d = `${pathD(...segA)} C${segB[1]} ${segB[2]} ${segB[3]}`;
  const marks: {t: number; at: Pt}[] = [
    {t: 0.3, at: bezPt(...segA, 0.6)},
    {t: 0.72, at: bezPt(...segB, 0.44)},
  ];
  const out = prog(f, 130, 15, easeIn);
  return (
    <Paper>
      <AbsoluteFill style={{opacity: 1 - out}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <DrawPath d={d} p={t} stroke="rgba(14,15,14,0.32)" width={1.8} />
          {marks.map((m, i) => {
            const p = prog(f, 4 + m.t * 116, 14);
            return (
              <g key={i} opacity={p}>
                <circle cx={m.at[0]} cy={m.at[1]} r={6} fill={color.ink} />
                <line x1={m.at[0]} y1={m.at[1] - 10} x2={m.at[0]} y2={m.at[1] - 10 - 110 * p} stroke="rgba(14,15,14,0.28)" strokeWidth={1.4} />
              </g>
            );
          })}
        </svg>
        {marks.map((m, i) => {
          const p = prog(f, 12 + m.t * 116, 16);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: m.at[0],
                top: m.at[1] - 130,
                transform: `translate(-50%, -100%) translateY(${(1 - p) * 14}px)`,
                opacity: p,
              }}
            >
              <Card style={{padding: '18px 26px', borderRadius: 16}}>
                <div style={{fontSize: 19, color: color.muted, letterSpacing: '0.01em'}}>{script.insights[i].label}</div>
                <div style={{fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4, whiteSpace: 'nowrap'}}>
                  {script.insights[i].value}
                </div>
              </Card>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: pt[0] - 40, top: pt[1] - 40}}>
          <Orb size={80} palette="sunrise" seed={11} speed={1.4} />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// 11 · Merge — two rings meet, the overlap fills with colour and becomes one orb.

export const Merge: React.FC = () => {
  const f = useCurrentFrame();
  const r = 230;
  const cy = CY - 20;
  const approach = lerp(f, [0, 56], [0, 1], easeOut);
  const merge = lerp(f, [62, 104], [0, 1], easeInOut);
  const sep = (1 - approach) * 420 + approach * (1 - merge) * 300;
  const ax = CX - sep / 2;
  const bx = CX + sep / 2;
  const rings = 1 - prog(f, 96, 18);
  const orbits = prog(f, 98, 22) * (1 - prog(f, 138, 20, easeIn));
  const shrink = lerp(f, [132, 168], [1, 90 / (2 * r)], easeInOut);
  const fillIn = prog(f, 30, 20);
  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: -300,
          top: -360,
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${color.aqua}, transparent)`,
          opacity: 0.22 * (1 - prog(f, 130, 30)),
        }}
      />
      <svg width={W} height={H} style={{position: 'absolute', opacity: orbits}}>
        {[0, 60, 120].map((a, i) => (
          <ellipse
            key={i}
            cx={CX}
            cy={cy}
            rx={(r + 140) * shrink}
            ry={(r - 70) * shrink}
            transform={`rotate(${a + f * 0.4} ${CX} ${cy})`}
            fill="none"
            stroke="rgba(14,15,14,0.5)"
            strokeWidth={2.6}
            strokeDasharray="0.1 12"
            strokeLinecap="round"
          />
        ))}
      </svg>
      {/* intersection lens = circle B clipping circle A */}
      <div
        style={{
          position: 'absolute',
          left: CX - r * shrink,
          top: cy - r * shrink,
          width: 2 * r * shrink,
          height: 2 * r * shrink,
          transform: 'translateZ(0)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: (bx - CX) * shrink,
            top: 0,
            width: 2 * r * shrink,
            height: 2 * r * shrink,
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: (ax - bx) * shrink,
              top: 0,
              width: 2 * r * shrink,
              height: 2 * r * shrink,
              borderRadius: '50%',
              overflow: 'hidden',
              opacity: fillIn,
            }}
          >
            <div style={{position: 'absolute', left: (CX - ax) * shrink, top: 0}}>
              <Orb size={2 * r * shrink} palette="earth" seed={4} speed={1.2} shade="flat" />
            </div>
          </div>
        </div>
      </div>
      <svg width={W} height={H} style={{position: 'absolute', opacity: rings}}>
        <circle cx={ax} cy={cy} r={r} fill="none" stroke="rgba(14,15,14,0.45)" strokeWidth={1.6} />
        <circle cx={bx} cy={cy} r={r} fill="none" stroke="rgba(14,15,14,0.45)" strokeWidth={1.6} />
      </svg>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// 12 · End card — the orb settles into the mark, wordmark and CTA arrive.

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const fly = lerp(f, [0, 30], [0, 1], easeInOut);
  const markY = 400;
  const orbSize = 90 - 30 * fly;
  const orbY = CY - 20 + (markY - (CY - 20)) * fly;
  const markP = prog(f, 22, 16);
  return (
    <Paper>
      <div
        style={{
          position: 'absolute',
          left: CX - orbSize / 2,
          top: orbY - orbSize / 2,
          opacity: 1 - prog(f, 22, 12),
        }}
      >
        <Orb size={orbSize} palette="earth" seed={4} speed={1.2} shade="flat" />
      </div>
      <div
        style={{
          position: 'absolute',
          left: CX - 54,
          top: markY - 36,
          opacity: markP,
          transform: `scale(${0.8 + 0.2 * markP})`,
        }}
      >
        <Mark size={72} c={color.ink} fill={prog(f, 30, 14)} />
      </div>
      <div style={{position: 'absolute', top: 488, width: W, display: 'flex', justifyContent: 'center'}}>
        <Wordmark size={100} c={color.ink} progress={prog(f, 26, 40, easeInOut)} mark={false} />
      </div>
      <div style={{position: 'absolute', top: 628, width: W, textAlign: 'center', fontSize: 36, letterSpacing: '-0.015em'}}>
        <Typewriter text={script.tagline} start={62} cps={1.1} inkColor={color.inkSoft} caretUntil={140} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 740,
          width: W,
          display: 'flex',
          justifyContent: 'center',
          opacity: prog(f, 104, 16),
          transform: `translateY(${(1 - prog(f, 104, 20)) * 16}px)`,
        }}
      >
        <Pill label={script.cta} scale={0.9} style={{borderRadius: 40, padding: '18px 40px'}} />
      </div>
    </Paper>
  );
};
