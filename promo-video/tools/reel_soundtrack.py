"""Synthesise the Curiothek reel's music and sound effects (original, numpy only).

Emotional arc follows the picture: punchy hits on the hook, a sad minor pad and
heartbeat while shoppers scroll past, a riser into the brand reveal, then an
uplifting 120 BPM groove in D major, resolving on the end card.
Every effect is placed on a frame from src/reel/Reel.tsx / scenes.tsx.

Usage: python3 tools/reel_soundtrack.py public/reel-soundtrack.wav
"""
import sys
import wave

import numpy as np

SR = 48000
FPS = 30
DUR = 1320 / FPS
N = int(SR * DUR)
BPM = 120
BEAT = 60 / BPM
rng = np.random.default_rng(11)
t_all = np.arange(N) / SR


def fr(frame):
    return frame / FPS


# Scene starts (absolute frames) — keep in sync with reelShots in Reel.tsx
R2, R3, R4, R5, R6, R7, R8, R9 = 80, 235, 318, 410, 605, 780, 945, 1110
T_GROOVE = fr(R4)
T_FULL = fr(R5 + 118)  # the reveal impact
T_END = fr(R9)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, fc, order=4):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(spec, len(x))


def highpass(x, fc, order=4):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    with np.errstate(divide="ignore"):
        spec *= 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-6)) ** (2 * order))
    return np.fft.irfft(spec, len(x))


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na) ** 2
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def place(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    sig = sig[: N - i]
    buf[0, i : i + len(sig)] += sig * np.cos((pan + 1) * np.pi / 4) * gain
    buf[1, i : i + len(sig)] += sig * np.sin((pan + 1) * np.pi / 4) * gain


def ts(n):
    return np.arange(n) / SR


# --- Instruments --------------------------------------------------------------


def pad_voice(freq, n, bright=0.6):
    t = ts(n)
    out = np.zeros(n)
    for det in (-0.007, 0.0, 0.006):
        ph = rng.uniform(0, 2 * np.pi)
        for k in range(1, 9):
            out += np.sin(2 * np.pi * freq * (1 + det) * k * t + ph * k) / k * bright ** (k - 1)
    return out / 6


def kick(power=1.0):
    n = int(0.45 * SR)
    t = ts(n)
    f = 45 + 85 * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
    click = highpass(rng.standard_normal(n), 2000) * np.exp(-t * 300) * 0.25
    return (body + click) * 0.9 * power


def clap():
    n = int(0.3 * SR)
    t = ts(n)
    noise = highpass(lowpass(rng.standard_normal(n), 4200), 900)
    e = np.exp(-t * 20) + 0.6 * np.exp(-((t - 0.011) ** 2) / 8e-6) + 0.4 * np.exp(-((t - 0.022) ** 2) / 8e-6)
    return noise * e * 0.32


def hat(open_=False):
    n = int((0.2 if open_ else 0.05) * SR)
    t = ts(n)
    return highpass(rng.standard_normal(n), 7500) * np.exp(-t * (16 if open_ else 80)) * 0.11


def pluck(freq, decay=6.0):
    n = int(0.8 * SR)
    t = ts(n)
    s = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 14)
    return s * np.exp(-t * decay) * env(n, 0.002, 0.05)


def bass(freq, length):
    n = int(length * SR)
    t = ts(n)
    s = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return s * env(n, 0.01, 0.06) * 0.5


# --- Sound effects ------------------------------------------------------------


def thump(pitch=70, power=1.0):
    """Word punch: short low hit with a bright transient."""
    n = int(0.3 * SR)
    t = ts(n)
    f = pitch * 0.6 + pitch * np.exp(-t * 40)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
    snap = highpass(rng.standard_normal(n), 3000) * np.exp(-t * 220) * 0.35
    return (body + snap) * power


def whoosh(length, up=True, power=1.0):
    n = int(length * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 20
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        x = c / (chunks - 1)
        fc = 300 * (14 ** (x if up else 1 - x))
        out[a:b] = highpass(lowpass(noise, fc * 2.2), fc * 0.5)[a:b]
    shape = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    return out * shape * 0.5 * power


def riser(length):
    n = int(length * SR)
    t = ts(n)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 24
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        out[a:b] = lowpass(noise, 350 * (16 ** (c / chunks)))[a:b]
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / length)) / SR) * 0.15
    return (out * 0.25 + tone) * (t / length) ** 2.4


def impact(power=1.0):
    n = int(2.4 * SR)
    t = ts(n)
    f = 36 + 60 * np.exp(-t * 9)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.4)
    air = lowpass(rng.standard_normal(n), 3000) * np.exp(-t * 4) * 0.3
    return (boom * 0.8 + air) * power


def pop(freq=900, power=1.0):
    n = int(0.12 * SR)
    t = ts(n)
    f = freq * (1 + 0.8 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40) * 0.5 * power


def click(power=1.0):
    n = int(0.04 * SR)
    t = ts(n)
    s = highpass(rng.standard_normal(n), 2500) * np.exp(-t * 400) + np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 250) * 0.4
    return s * 0.45 * power


def tick():
    n = int(0.03 * SR)
    t = ts(n)
    return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 300) * 0.25


def boing(power=1.0):
    n = int(0.5 * SR)
    t = ts(n)
    f = 160 + 90 * np.exp(-t * 6) * (1 + 0.25 * np.sin(2 * np.pi * 14 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 0.6 * power


def fall(length):
    n = int(length * SR)
    t = ts(n)
    f = 1400 * (0.35 ** (t / length))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, n)) * 0.12


def sad_tone():
    n = int(1.6 * SR)
    t = ts(n)
    out = np.zeros(n)
    for m, g in ((64, 1.0), (60, 0.7)):
        f = midi(m) * 2 ** (-2 * np.clip(t - 0.2, 0, None) / 12 / 1.2)
        out += np.sin(2 * np.pi * np.cumsum(f) / SR) * g
    return out * env(n, 0.05, 0.9) * 0.12


def chime(root=86, power=1.0):
    n = int(1.8 * SR)
    t = ts(n)
    out = np.zeros(n)
    for m, g, d in ((root, 1.0, 3.0), (root + 7, 0.6, 3.5), (root + 12, 0.45, 4.5), (root + 16, 0.3, 5.0)):
        out += np.sin(2 * np.pi * midi(m) * t) * g * np.exp(-t * d)
        out += np.sin(2 * np.pi * midi(m) * 2.76 * t) * g * 0.15 * np.exp(-t * d * 3)
    return out * 0.18 * power


def sparkle(seed_notes=(86, 90, 93, 98, 102, 105), spread=0.35):
    n = int((spread + 0.6) * SR)
    out = np.zeros(n)
    for i, m in enumerate(seed_notes):
        s = pluck(midi(m), decay=10) * 0.4
        a = int(i / len(seed_notes) * spread * SR)
        out[a : a + len(s)] += s[: n - a]
    return out


# --- Arrange ------------------------------------------------------------------

music = np.zeros((2, N))
sfx = np.zeros((2, N))

# Section 1 — hook + problem (0 → R3): A minor, sparse, a heartbeat under the problem
for t0, chord in ((fr(R2), [45, 52, 57, 60, 64]), (fr(R2) + 2.6, [41, 48, 57, 60, 64])):
    n = int(3.2 * SR)
    for j, m in enumerate(chord):
        place(music, lowpass(pad_voice(midi(m), n, 0.5), 1400) * env(n, 0.6, 1.2), t0, 0.09, -0.4 + j * 0.2)
hb = fr(R2) + 0.3
while hb < fr(R3) - 0.2:
    place(music, kick(0.55), hb)
    place(music, kick(0.35), hb + 0.22)
    hb += 1.0

# Section 2 — turn (R3 → R4): rising pad and riser
n = int((fr(R4) - fr(R3) + 1.0) * SR)
for j, m in enumerate([50, 57, 62, 66, 69]):
    place(music, pad_voice(midi(m), n, 0.55) * env(n, 1.2, 0.8) * np.linspace(0.3, 1, n), fr(R3) + 0.6, 0.08, -0.4 + j * 0.2)

# Section 3 — groove (R4 → R9): D major, I–V–vi–IV, one chord per bar
prog_chords = [[50, 57, 62, 66, 69], [45, 52, 57, 61, 64], [47, 54, 59, 62, 66], [43, 50, 55, 59, 62]]
roots = [38, 33, 35, 31]
BAR = 4 * BEAT
pads = np.zeros((2, N))
bar = 0
t0 = T_GROOVE
while t0 < T_END + 2 * BAR:
    ch = prog_chords[bar % 4]
    n = int((BAR + 0.6) * SR)
    for j, m in enumerate(ch):
        place(pads, pad_voice(midi(m), n, 0.7) * env(n, 0.25, 0.5), t0, 0.075, -0.5 + j * 0.25)
    if t0 < T_END:
        for b in range(8):
            place(music, bass(midi(roots[bar % 4]), BEAT / 2 * 0.9), t0 + b * BEAT / 2, 0.5 if b % 2 == 0 else 0.3)
    bar += 1
    t0 += BAR

drums = np.zeros((2, N))
duck = np.ones(N)
step = 0
bt = T_GROOVE
while bt < T_END:
    s16 = step % 16
    full = bt >= T_FULL - 0.01
    if s16 % 4 == 0 and (full or s16 in (0, 8)):
        place(drums, kick(), bt, 0.95)
        i = int(bt * SR)
        dip = 1 - 0.5 * np.exp(-ts(int(0.3 * SR)) * 10)
        duck[i : i + len(dip)] = np.minimum(duck[i : i + len(dip)], dip[: N - i])
    if full and s16 in (4, 12):
        place(drums, clap(), bt, 0.9, 0.05)
    if bt > T_GROOVE + BAR:
        if s16 % 4 == 2:
            place(drums, hat(open_=full), bt, 0.9, 0.25)
        elif full:
            place(drums, hat(), bt, 0.45, -0.25)
    bt += BEAT / 4
    step += 1

# Pluck arpeggio, brighter after the reveal; an extra sparkle layer in the payoff
arp = [0, 2, 4, 3, 1, 3, 2, 4]
pt = T_GROOVE + BAR
k = 0
while pt < T_END + 3 * BAR:
    ch = prog_chords[int((pt - T_GROOVE) // BAR) % 4]
    m = ch[arp[k % 8]] + 12
    g = 0.1 if pt < T_FULL else 0.13
    if pt >= T_END:
        g *= max(0, 1 - (pt - T_END) / (3 * BAR))
    place(music, pluck(midi(m)), pt, g, -0.4 if k % 2 else 0.4)
    if fr(R8) <= pt < T_END and k % 2 == 0:
        place(music, pluck(midi(m + 12), decay=9), pt + BEAT / 4, 0.05, 0.6 if k % 4 else -0.6)
    pt += BEAT / 2
    k += 1

music += pads * duck
music += drums
music[0] *= 1.0
# Final resolve: a D major chord blooms on the CTA
n = int(6 * SR)
for j, m in enumerate([50, 57, 62, 66, 69, 74]):
    place(music, pad_voice(midi(m), n, 0.65) * env(n, 0.4, 3.0), fr(R9 + 92), 0.07, -0.5 + j * 0.2)

# --- Effects on the cut points ------------------------------------------------
# R1 hook words
for f_, p_ in ((6, 0.7), (14, 0.7), (22, 0.8), (30, 1.2)):
    place(sfx, thump(75 if f_ < 30 else 60, p_), fr(f_), 0.8)
place(sfx, impact(0.5), fr(30), 0.35)
place(sfx, whoosh(0.5, up=True), fr(64), 0.8)
# R2 problem
place(sfx, whoosh(0.7, up=False, power=1.2), fr(R2), 0.9)
for f_ in (8, 13, 18, 22, 27):
    place(sfx, pop(700), fr(R2 + f_), 0.5)
for f_ in (32, 37):
    place(sfx, thump(90, 0.6), fr(R2 + f_), 0.7)
place(sfx, whoosh(0.8, up=False, power=1.3), fr(R2 + 92), 0.9)
for f_ in (92, 98, 104, 109, 114):
    place(sfx, pop(620), fr(R2 + f_), 0.45)
place(sfx, sad_tone(), fr(R2 + 116), 1.0)
# R3 turn — the drop
place(sfx, fall(0.36), fr(R3), 1.0)
for f_, p_ in ((11, 1.0), (22, 0.6), (27, 0.35)):
    place(sfx, boing(p_), fr(R3 + f_), 0.9)
place(sfx, thump(55, 1.0), fr(R3 + 11), 0.8)
for f_ in (34, 40, 46):
    place(sfx, thump(85, 0.6), fr(R3 + f_), 0.7)
place(sfx, riser(fr(R4 - (R3 + 48))), fr(R3 + 48), 0.9)
place(sfx, whoosh(1.1, up=True, power=1.2), fr(R3 + 62), 0.6)
# R4 brand
place(sfx, impact(1.0), fr(R4), 0.9)
place(sfx, sparkle(), fr(R4 + 2), 0.6)
place(sfx, whoosh(0.4, up=True), fr(R4 + 84), 0.7)
# R5 canvas
place(sfx, whoosh(0.5, up=False, power=0.6), fr(R5), 0.6)
place(sfx, click(), fr(R5 + 42), 0.9)
place(sfx, pop(1100), fr(R5 + 48), 0.6)
place(sfx, click(), fr(R5 + 70), 0.9)
place(sfx, whoosh(fr(42), up=True, power=1.4), fr(R5 + 76), 0.9)
place(sfx, impact(1.1), fr(R5 + 118), 1.0)
place(sfx, sparkle((88, 93, 95, 100, 105, 107, 112)), fr(R5 + 118), 0.7)
for f_ in (122, 127, 136, 141):
    place(sfx, pop(800), fr(R5 + f_), 0.45)
# R6 details — camera moves and callouts
place(sfx, whoosh(0.7, up=False, power=0.8), fr(R6 + 8), 0.7)
place(sfx, whoosh(0.7, up=True, power=0.9), fr(R6 + 60), 0.7)
place(sfx, whoosh(0.7, up=False, power=0.7), fr(R6 + 115), 0.6)
place(sfx, whoosh(0.6, up=True, power=0.6), fr(R6 + 158), 0.6)
for f_ in (26, 80, 135):
    place(sfx, pop(950, 1.2), fr(R6 + f_), 0.6)
    place(sfx, tick(), fr(R6 + f_ + 3), 0.8)
# R7 set — a cut on every slide, then the fan
for i in range(8):
    place(sfx, thump(95, 0.45), fr(R7 + i * 10), 0.6)
    place(sfx, tick(), fr(R7 + i * 10), 1.0)
place(sfx, whoosh(0.7, up=True, power=1.1), fr(R7 + 80), 0.8)
for i in range(8):
    place(sfx, click(0.6), fr(R7 + 88 + i * 2), 0.5, -0.6 + i * 0.17)
for f_ in (100, 106):
    place(sfx, pop(760), fr(R7 + f_), 0.5)
# R8 payoff
place(sfx, whoosh(1.4, up=False, power=1.3), fr(R8), 0.9)
place(sfx, thump(50, 1.1), fr(R8 + 48), 0.9)
for f_ in (40, 45, 50):
    place(sfx, pop(820), fr(R8 + f_), 0.5)
place(sfx, click(1.3), fr(R8 + 82), 1.0)
place(sfx, pop(1300, 1.3), fr(R8 + 86), 0.8)
place(sfx, sparkle((93, 98, 102, 105)), fr(R8 + 86), 0.6)
for f_ in (92, 98):
    place(sfx, pop(880), fr(R8 + f_), 0.5)
place(sfx, chime(86), fr(R8 + 96), 1.0)
# R9 end
place(sfx, whoosh(0.8, up=True, power=0.8), fr(R9), 0.7)
place(sfx, pop(700, 1.2), fr(R9 + 26), 0.7)
place(sfx, sparkle(), fr(R9 + 26), 0.5)
for i in range(31):
    place(sfx, tick(), fr(R9 + 52 + i), 0.35, rng.uniform(-0.3, 0.3))
place(sfx, pop(1000, 1.2), fr(R9 + 92), 0.7)
place(sfx, chime(81, 1.2), fr(R9 + 92), 1.0)
for f_ in (126, 168):
    place(sfx, sparkle((98, 102, 105, 110), 0.2), fr(R9 + f_), 0.35)

# --- Mix ------------------------------------------------------------------------
mix = music + sfx * 0.9

ir_len = int(1.8 * SR)
ir_t = ts(ir_len)
for ch in range(2):
    ir = lowpass(rng.standard_normal(ir_len) * np.exp(-ir_t * 3.2), 5500)
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(N + ir_len)))
    wet = np.fft.irfft(np.fft.rfft(mix[ch], size) * np.fft.rfft(ir, size), size)[:N]
    mix[ch] = mix[ch] * 0.85 + wet * 0.22

mix *= np.clip((DUR - t_all) / 2.5, 0, 1) ** 1.5
mix = np.tanh(mix * 1.5) / 1.5
mix /= np.max(np.abs(mix)) / 0.89

out = (mix.T * 32767).astype(np.int16)
path = sys.argv[1] if len(sys.argv) > 1 else "public/reel-soundtrack.wav"
with wave.open(path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("wrote", path)
