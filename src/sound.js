// Tiny UI sound kit, synthesized with the Web Audio API (no audio files, nothing to license or download).
// Everything is quiet and short, and tonal (no noise bursts): bell-like notes and a soft glide between pages. Browsers keep audio
// locked until the visitor interacts, so the context is created on the first pointer/key press. The on/off choice
// is remembered in localStorage; a small toggle in the corner of the page flips it.

const KEY = 'jk-sound';
const MASTER = 1.6;

let ctx = null, master = null;
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
  master = ctx.createGain(); master.gain.value = MASTER;
  const comp = ctx.createDynamicsCompressor();   // lets the master gain be generous without clipping when notes overlap
  master.connect(comp); comp.connect(ctx.destination);
  ctx.onstatechange = () => subs.forEach((fn) => fn(on));
  return ctx;
}

// Is audio allowed to play right now? (false until the visitor has clicked or pressed a key, unless the browser allows autoplay)
export const isReady = () => { const c = ensure(); return !!c && c.state === 'running'; };
// Start audio from inside a gesture; resolves once it is running (or has failed)
export function unlockAudio() {
  const c = ensure();
  if (!c) return Promise.resolve(false);
  if (c.state === 'running') return Promise.resolve(true);
  return c.resume().then(() => c.state === 'running', () => false);
}

// unlock on the first real gesture
const unlock = () => { const c = ensure(); if (c && c.state === 'suspended') c.resume(); };
if (typeof window !== 'undefined') {
  ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend'].forEach((e) => window.addEventListener(e, unlock, { once: false, passive: true }));
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

const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];   // C major pentatonic
const SOUNDS = {
  // pointer lands on something clickable: a barely-there tick
  hover: { gap: 60, fn: (t) => tone(t, { f0: 1500, f1: 1100, type: 'sine', dur: 0.04, gain: 0.05 }) },
  // a soft bell note from the same pentatonic scale as the chimes (a different one each time, like a wind chime)
  click: { gap: 40, fn: (t) => { const f = NOTES[Math.floor(Math.random() * 5)]; tone(t, { f0: f, dur: 0.32, gain: 0.06, attack: 0.005 }); tone(t, { f0: f * 2.01, dur: 0.14, gain: 0.015, attack: 0.005 }); } },
  // moving between pages: a soft rising glide of two sine tones, no noise (noise sounds like a snare)
  swish: { gap: 200, fn: (t) => { tone(t, { f0: 523.25, f1: 783.99, dur: 0.22, gain: 0.04, attack: 0.03 }); tone(t + 0.03, { f0: 783.99, f1: 1174.66, dur: 0.22, gain: 0.025, attack: 0.03 }); } },
  // Primary nav links each get their own: Work a warm low two-note, Tinkering a sparkle, About a friendly rising pair.
  navWork: { gap: 80, fn: (t) => { tone(t, { f0: 392, dur: 0.16, gain: 0.07, type: 'triangle' }); tone(t + 0.09, { f0: 523.25, dur: 0.2, gain: 0.06, type: 'triangle' }); } },
  navTinker: { gap: 80, fn: (t) => { [1318.5, 1568, 2093].forEach((f, i) => tone(t + i * 0.055, { f0: f, dur: 0.35, gain: 0.05, attack: 0.005 })); } },
  navAbout: { gap: 80, fn: (t) => { tone(t, { f0: 587.33, dur: 0.18, gain: 0.07 }); tone(t + 0.1, { f0: 783.99, dur: 0.28, gain: 0.07 }); } },
  // a bright, short chime from the top of the scale, for the opening animation
  chime: { gap: 0, fn: (t, arg = 0) => {
    const f = NOTES[((arg % NOTES.length) + NOTES.length) % NOTES.length] * 2;
    tone(t, { f0: f, dur: 0.55, gain: 0.04, attack: 0.004 });
    tone(t, { f0: f * 2.76, dur: 0.18, gain: 0.012, attack: 0.004 });
  } },
  // a flower opening: one soft bell-like note from a pentatonic scale. `arg` picks the note, so a handful of them
  // played in a row (see playBloom) sound like a little sparkling run.
  note: { gap: 0, fn: (t, arg = 0) => {
    const f = NOTES[((arg % NOTES.length) + NOTES.length) % NOTES.length];
    tone(t, { f0: f, dur: 0.7, gain: 0.07, attack: 0.006 });
    tone(t, { f0: f * 2.01, dur: 0.35, gain: 0.02, attack: 0.006 });
  } },
  // sound switched on: two quick rising notes
  toggle: { gap: 0, fn: (t) => { tone(t, { f0: 660, dur: 0.08, gain: 0.09 }); tone(t + 0.08, { f0: 880, dur: 0.12, gain: 0.09 }); } },
};

export function play(name, arg) {
  if (!on || document.hidden) return;
  const snd = SOUNDS[name];
  const c = ensure();
  if (!snd || !c || c.state !== 'running') return;   // still locked: stay silent rather than queue sounds for later
  const now = performance.now();
  if (now - (last[name] || 0) < snd.gap) return;
  last[name] = now;
  snd.fn(c.currentTime + 0.001, arg);
}

// A run of notes, one per delay (ms), starting from note `from`: used when a photo opens and its flowers bloom.
export function playBloom(delays, from = 0) {
  delays.forEach((d, n) => setTimeout(() => play('note', from + n * 2), d));
}

// Sparkling chimes across a window (ms): a soft opening chord, then a trickle that gets denser toward the end.
// Notes that fire while the browser still has audio locked are simply skipped.
export function playSparkle(startMs, spanMs, count = 28) {
  setTimeout(() => { play('note', 0); setTimeout(() => play('note', 2), 90); setTimeout(() => play('note', 4), 180); }, Math.max(0, startMs));
  for (let n = 0; n < count; n++) {
    const u = (n + Math.random() * 0.8) / count, d = startMs + 250 + (spanMs - 250) * Math.pow(u, 0.6);
    setTimeout(() => play('chime', Math.floor(Math.random() * 7)), d);
  }
}
