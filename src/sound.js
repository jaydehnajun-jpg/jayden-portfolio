// Tiny UI sound kit, synthesized with the Web Audio API (no audio files, nothing to license or download).
// Everything is quiet and short: soft taps, a faint detent, a gentle swish between pages. Browsers keep audio
// locked until the visitor interacts, so the context is created on the first pointer/key press. The on/off choice
// is remembered in localStorage; a small toggle in the corner of the page flips it.

const KEY = 'jk-sound';
const MASTER = 0.5;

let ctx = null, master = null, noiseBuf = null;
const last = {};
const subs = new Set();

const read = () => { try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; } };
let on = read();

export const isOn = () => on;
export const subscribe = (fn) => { subs.add(fn); return () => subs.delete(fn); };
export function setOn(v) {
  on = v;
  try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch (e) { /* private mode: just don't remember */ }
  subs.forEach((fn) => fn(on));
  if (v) play('toggle');
}

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = MASTER; master.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

// unlock on the first real gesture
const unlock = () => { const c = ensure(); if (c && c.state === 'suspended') c.resume(); };
if (typeof window !== 'undefined') {
  ['pointerdown', 'keydown', 'touchstart'].forEach((e) => window.addEventListener(e, unlock, { once: false, passive: true }));
}

// a short enveloped tone
function tone(t, { f0, f1 = f0, type = 'sine', dur = 0.08, gain = 0.05, attack = 0.004 }) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + 0.02);
}

// filtered noise: a click transient or a swish
function noise(t, { freq = 2500, q = 1, dur = 0.02, gain = 0.05, sweepTo, type = 'bandpass' }) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.01, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(master);
  s.start(t); s.stop(t + dur + 0.02);
}

const SOUNDS = {
  // pointer lands on something clickable: a barely-there tick
  hover: { gap: 60, fn: (t) => tone(t, { f0: 1500, f1: 1100, type: 'sine', dur: 0.03, gain: 0.018 }) },
  // a soft keyboard-style tap
  click: { gap: 40, fn: (t) => { noise(t, { freq: 2200, q: 0.8, dur: 0.018, gain: 0.07 }); tone(t, { f0: 420, f1: 300, type: 'sine', dur: 0.07, gain: 0.05 }); } },
  // moving between pages: a light air swish
  swish: { gap: 200, fn: (t) => noise(t, { freq: 700, q: 0.7, dur: 0.22, gain: 0.05, sweepTo: 3200 }) },
  // the next card settles into focus while scrolling: a faint detent
  detent: { gap: 90, fn: (t) => tone(t, { f0: 330, f1: 280, type: 'triangle', dur: 0.05, gain: 0.03 }) },
  // sound switched on: two quick rising notes
  toggle: { gap: 0, fn: (t) => { tone(t, { f0: 660, dur: 0.07, gain: 0.05 }); tone(t + 0.07, { f0: 880, dur: 0.1, gain: 0.05 }); } },
};

export function play(name) {
  if (!on || document.hidden) return;
  const snd = SOUNDS[name];
  const c = ensure();
  if (!snd || !c || c.state !== 'running') return;   // still locked: stay silent rather than queue sounds for later
  const now = performance.now();
  if (now - (last[name] || 0) < snd.gap) return;
  last[name] = now;
  snd.fn(c.currentTime + 0.001);
}
