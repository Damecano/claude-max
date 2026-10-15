"""Synthesise the promo's music bed: soft pads, plucked arpeggio and light drums.

Original, generated from scratch with numpy, timed to the scene cuts in src/Promo.tsx.
Usage: python3 tools/soundtrack.py public/soundtrack.wav
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 60.0
N = int(SR * DUR)
BPM = 96
BEAT = 60 / BPM
rng = np.random.default_rng(7)

# Scene times in seconds (frame / 30) — the music follows the picture.
T_REVEAL = 265 / 30  # brand reveal: groove starts
T_DROP = 1362 / 30  # merge: drums drop out
T_END = 1525 / 30  # end card: final swell


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


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na) ** 2
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def place(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4) * gain
    r = np.sin((pan + 1) * np.pi / 4) * gain
    buf[0, i : i + len(sig)] += sig * l
    buf[1, i : i + len(sig)] += sig * r


t_all = np.arange(N) / SR

# --- Harmony: Dmaj9 → Bm9 → Gmaj9 → Asus, two bars each -------------------
chords = [
    [50, 57, 61, 64, 66],  # D A C# E F#
    [47, 54, 57, 61, 62],  # B F# A C# D
    [43, 50, 54, 57, 62],  # G D F# A D
    [45, 52, 57, 59, 64],  # A E A B E
]
BAR = 4 * BEAT
CHORD_LEN = 2 * BAR


def chord_at(t):
    return chords[int(t // CHORD_LEN) % len(chords)]


def pad_voice(freq, n, bright):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.006, 0.0, 0.0065):
        f = freq * (1 + det)
        ph = rng.uniform(0, 2 * np.pi)
        for k in range(1, 9):
            out += np.sin(2 * np.pi * f * k * t + ph * k) / k * (bright ** (k - 1))
    return out / 6


pad = np.zeros((2, N))
t = 0.0
while t < DUR:
    seg = min(CHORD_LEN + 1.2, DUR - t)
    n = int(seg * SR)
    bright = 0.55 if t < T_REVEAL else 0.7
    for j, m in enumerate(chord_at(t + 0.01)):
        v = pad_voice(midi(m), n, bright) * env_adsr(n, 0.9, 1.2)
        place(pad, v, t, gain=0.09 if j else 0.12, pan=(-0.5 + j * 0.25))
    t += CHORD_LEN
pad[0] = lowpass(pad[0], 2200)
pad[1] = lowpass(pad[1], 2200)

# Intro swell: pad fades in from silence, extra-dark during the dark open.
intro = np.clip(t_all / 4.0, 0, 1) ** 1.5
pad *= intro

# --- Sub drone under the intro -------------------------------------------------
sub = np.sin(2 * np.pi * midi(38) * t_all) * 0.10 * np.clip(t_all / 3, 0, 1) * (t_all < T_REVEAL + 0.5)

# --- Drums -------------------------------------------------------------------
drums = np.zeros((2, N))


def kick():
    n = int(0.5 * SR)
    tt = np.arange(n) / SR
    f = 46 + 70 * np.exp(-tt * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 7.5) * 0.9


def clap():
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    noise = highpass(lowpass(noise, 3800), 900)
    e = np.exp(-tt * 18) + 0.5 * np.exp(-((tt - 0.012) ** 2) / 1e-5)
    return noise * e * 0.35


def hat(open_=False):
    n = int((0.18 if open_ else 0.06) * SR)
    tt = np.arange(n) / SR
    noise = highpass(rng.standard_normal(n), 7000)
    return noise * np.exp(-tt * (18 if open_ else 70)) * 0.12


K, C = kick(), clap()
sidechain = np.ones(N)
beat_t = T_REVEAL
step = 0
while beat_t < T_DROP:
    sixteenth = step % 16
    if sixteenth in (0, 8) or (sixteenth == 14 and (step // 16) % 2 == 1):
        place(drums, K, beat_t, 0.9)
        i = int(beat_t * SR)
        dip = 1 - 0.45 * np.exp(-np.arange(int(0.35 * SR)) / SR * 9)
        sidechain[i : i + len(dip)] = np.minimum(sidechain[i : i + len(dip)], dip[: N - i])
    if beat_t > T_REVEAL + 2 * BAR and sixteenth == 8:
        place(drums, C, beat_t, 0.8, pan=0.05)
    if beat_t > T_REVEAL + BAR:
        acc = 1.0 if sixteenth % 4 == 2 else 0.45
        place(drums, hat(open_=sixteenth == 14), beat_t, acc, pan=0.3 if sixteenth % 2 else -0.2)
    beat_t += BEAT / 4
    step += 1

# --- Pluck arpeggio ----------------------------------------------------------
plucks = np.zeros((2, N))


def pluck(freq):
    n = int(0.9 * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * tt) + 0.35 * np.sin(2 * np.pi * freq * 2 * tt) * np.exp(-tt * 12)
    return s * np.exp(-tt * 6) * env_adsr(n, 0.003, 0.05)


pattern = [0, 2, 3, 4, 3, 2, 1, 3]
pt = T_REVEAL + BAR
k = 0
while pt < T_END + 2 * BAR:
    ch = chord_at(pt + 0.01)
    note = ch[pattern[k % len(pattern)]] + 12
    g = 0.11 if pt < T_DROP else 0.08
    place(plucks, pluck(midi(note)), pt, g, pan=-0.45 if k % 2 else 0.45)
    pt += BEAT / 2
    k += 1

# Sparse sparkle notes in the intro (dark open / question storm)
for i, (tt_, m) in enumerate([(1.2, 78), (2.6, 81), (4.1, 76), (5.4, 85), (6.3, 83), (7.1, 81), (7.7, 88)]):
    place(plucks, pluck(midi(m)), tt_, 0.06, pan=(-0.6 if i % 2 else 0.6))

# --- Risers / impacts --------------------------------------------------------
fx = np.zeros((2, N))


def riser(length):
    n = int(length * SR)
    tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    chunks = 24
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        fc = 400 * (12 ** (c / chunks))
        out[a:b] = lowpass(noise, fc)[a:b]
    return out * (tt / length) ** 2.2 * 0.22


def impact():
    n = int(2.5 * SR)
    tt = np.arange(n) / SR
    f = 38 + 50 * np.exp(-tt * 10)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2)
    air = lowpass(rng.standard_normal(n), 2500) * np.exp(-tt * 3.5) * 0.25
    return (boom * 0.7 + air) * 0.8


place(fx, riser(2.2), T_REVEAL - 2.2, 1.0)
place(fx, impact(), T_REVEAL, 0.9)
place(fx, riser(1.6), T_END - 1.6, 0.8)
place(fx, impact(), T_END, 0.7)

# --- Mix ---------------------------------------------------------------------
mix = pad * sidechain + plucks + drums + fx
mix[0] += sub
mix[1] += sub

# Drop section: filter everything except the pad down
drop_mask = (t_all >= T_DROP) & (t_all < T_END)
for ch in range(2):
    dark = lowpass(mix[ch], 900)
    mix[ch] = np.where(drop_mask, dark, mix[ch])

# Simple stereo reverb: convolve with a decaying noise tail
ir_len = int(2.2 * SR)
ir_t = np.arange(ir_len) / SR
for ch in range(2):
    ir = rng.standard_normal(ir_len) * np.exp(-ir_t * 3.0)
    ir = lowpass(ir, 5000)
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(N + ir_len)))
    wet = np.fft.irfft(np.fft.rfft(mix[ch], size) * np.fft.rfft(ir, size), size)[:N]
    mix[ch] = mix[ch] * 0.82 + wet * 0.28

# Ending fade and master
fade = np.clip((DUR - t_all) / 4.0, 0, 1) ** 1.5
mix *= fade
mix = np.tanh(mix * 1.4) / 1.4
mix /= np.max(np.abs(mix)) / 0.89

out = (mix.T * 32767).astype(np.int16)
path = sys.argv[1] if len(sys.argv) > 1 else "public/soundtrack.wav"
with wave.open(path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("wrote", path)
