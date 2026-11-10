import { useEffect, useRef } from 'react';

// Parametric glyphs: small n-fold symmetric marks built from polar curves (roses, epitrochoid loops, spokes,
// dot rings, stars). One generator feeds three things: the breathing field used as the page background and
// the loader, the little glyph bullets/inline marks (SVG), and the favicon.
//
// A glyph is described by a seed. `b` (0..1) is how "open" it is: near 0 it is a single dot, then spokes or a
// dot ring grow out, then the curve layers appear, then the center star/ring. The field animates `b` as
// travelling waves, so the whole grid breathes in and out.

export const GLYPH_PALETTE = ['#E3000F', '#00A86B', '#4B2E83', '#2D5BD6', '#F2B600', '#D5287A', '#1E9A8A', '#2B2B2B'];
// One clock for every field and live glyph, so the loading curtain and the page background (same grid, same
// glyph per cell) agree on every frame and hand over without a visible change.
export const FIELD_T0 = typeof performance !== 'undefined' ? performance.now() : 0;
export const fieldTime = () => (performance.now() - FIELD_T0) / 1000;
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

function rng(seed) {
  let a = (Math.imul(seed + 1, 2654435761) >>> 0);
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeGlyph(seed, palette = GLYPH_PALETTE, over) {
  const r = rng(seed);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const N = pick([4, 4, 4, 6, 6, 8]);
  const cs = [pick(palette), pick(palette), pick(palette)];
  const curve = r() < 0.55
    ? { t: 'loops', N, h: pick([0.6, 0.75, 1.7, 2.1, 2.6]) }
    : { t: 'rose', N, lobe: 0.45 + r() * 0.5 };
  const second = r() < 0.5 ? { t: 'star', N } : { t: 'ring' };
  const g = {
    N, cs, curve, second,
    phase: r() * TAU, wob: r() * TAU,
    spin: (r() < 0.5 ? -1 : 1) * (0.08 + r() * 0.18),
    ring: r() < 0.5 ? 'spokes' : 'dots',
  };
  // `over` pins a hand-designed recipe (colors, curve, which layers show) instead of the seeded random one
  return over ? { ...g, ...over } : g;
}

// Minimal filled flower for small sizes (bullets): a petalled bloom, a smaller bloom of a second color turned half a
// petal, and a center dot. No strokes, so it stays crisp and calm at 18px. Opens with `b` like the others.
function solidPrims(g, b, rot) {
  const out = [], N = g.N, lobe = (g.petal || 0.7) * smooth(0, 0.5, b);   // lobe 0 is a plain circle
  const petals = (scale, turn, fill) => {
    const S = 72, pts = new Array(S * 2), cr = Math.cos(turn), sr = Math.sin(turn);
    for (let k = 0; k < S; k++) {
      const th = (k / S) * TAU, rr = (1 - 0.5 * lobe + 0.5 * lobe * Math.cos(N * th)) * scale;
      const x = rr * Math.cos(th), y = rr * Math.sin(th);
      pts[k * 2] = x * cr - y * sr; pts[k * 2 + 1] = x * sr + y * cr;
    }
    out.push({ k: 'poly', pts, stroke: null, w: 0, fill });
  };
  const a = 0.6 / (1 - 0.5 * lobe), c = smooth(0.3, 0.85, b);
  petals(a, rot, g.cs[0]);
  if (c > 0.01) petals(0.6 * c, rot + Math.PI / N, g.cs[1]);
  if (c > 0.01) out.push({ k: 'dot', x: 0, y: 0, r: (0.1 + 0.07 * c) * c, fill: g.coreColor || g.cs[2] });
  return out;
}

// Shape primitives in unit space (outer radius = 1). Line widths are in the same unit.
//   { k:'poly', pts:[x,y,x,y...], stroke, w, fill }   { k:'line', x1,y1,x2,y2, stroke, w }   { k:'dot', x,y,r, fill }
export function glyphPrims(g, b, t, minW = 0) {
  if (g.solid) return solidPrims(g, b, g.phase + t * g.spin);
  const out = [];
  if (b <= 0.02) return out;
  const rot = g.phase + t * g.spin;
  const w = Math.max(minW, 0.07);

  const L = g.layers;
  const has = (k) => !L || L.includes(k);

  // core dot
  const core = smooth(0, 0.14, b);
  if (has('core')) out.push({ k: 'dot', x: 0, y: 0, r: Math.max(minW * 0.9, (0.06 + 0.1 * smooth(0.1, 0.5, b)) * core), fill: g.coreColor || g.cs[0] });

  // spokes or dot ring
  const s1 = smooth(0.14, 0.5, b);
  if (has('ring') && s1 > 0.02) {
    const n = g.ring === 'spokes' ? g.N : g.N * 2;
    for (let j = 0; j < n; j++) {
      const a = rot + (j * TAU) / n, c = Math.cos(a), s = Math.sin(a);
      if (g.ring === 'spokes') {
        const r1 = 0.95 * s1;
        out.push({ k: 'line', x1: c * 0.2, y1: s * 0.2, x2: c * r1, y2: s * r1, stroke: g.cs[1], w: w * 0.8 });
        out.push({ k: 'dot', x: c * r1, y: s * r1, r: w * 0.95, fill: g.cs[1] });
      } else {
        out.push({ k: 'dot', x: c * 0.8 * s1, y: s * 0.8 * s1, r: w * 1.05, fill: g.cs[1] });
      }
    }
  }

  // curve layer
  const s2 = smooth(0.38, 0.78, b);
  if (has('curve') && s2 > 0.02) {
    const c = g.curve, S = 96, pts = new Array(S * 2);
    const h = c.t === 'loops' ? c.h * (1 + 0.07 * Math.sin(t * 0.9 + g.wob)) : 0;
    const cr = Math.cos(rot), sr = Math.sin(rot);
    for (let k = 0; k < S; k++) {
      const th = (k / S) * TAU;
      let x, y;
      if (c.t === 'loops') {
        const m = c.N + 1, norm = m + h;
        x = (m * Math.cos(th) - h * Math.cos(m * th)) / norm;
        y = (m * Math.sin(th) - h * Math.sin(m * th)) / norm;
      } else {
        const rr = 1 - 0.5 * c.lobe + 0.5 * c.lobe * Math.cos(c.N * th + g.wob * 0.3);
        x = rr * Math.cos(th); y = rr * Math.sin(th);
      }
      pts[k * 2] = (x * cr - y * sr) * 0.95 * s2;
      pts[k * 2 + 1] = (x * sr + y * cr) * 0.95 * s2;
    }
    out.push({ k: 'poly', pts, stroke: g.cs[0], w: w * 0.85, fill: null });
  }

  // center accent
  const s3 = smooth(0.62, 0.98, b);
  if (has('second') && s3 > 0.02) {
    if (g.second.t === 'star') {
      const S = 64, pts = new Array(S * 2);
      for (let k = 0; k < S; k++) {
        const th = (k / S) * TAU;
        const rr = (0.15 + 0.85 * Math.pow(Math.abs(Math.cos((g.second.N * th) / 2 + rot)), 3)) * 0.5 * s3;
        pts[k * 2] = rr * Math.cos(th); pts[k * 2 + 1] = rr * Math.sin(th);
      }
      out.push({ k: 'poly', pts, stroke: null, w, fill: g.cs[2] });
    } else {
      const S = 40, pts = new Array(S * 2), rr = 0.5 * s3;
      for (let k = 0; k < S; k++) { const th = (k / S) * TAU; pts[k * 2] = rr * Math.cos(th); pts[k * 2 + 1] = rr * Math.sin(th); }
      out.push({ k: 'poly', pts, stroke: g.cs[2], w: w * 0.7, fill: null });
    }
  }
  return out;
}

// `sat` (0..1) mixes every color toward its gray: 1 = as designed, 0 = fully desaturated.
const satCache = new Map();
function withSat(c, sat) {
  if (sat >= 0.98) return c;
  const q = Math.round(sat * 10), key = c + q;
  let v = satCache.get(key);
  if (!v) {
    const n = parseInt(c.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, bl = n & 255, y = 0.3 * r + 0.59 * g + 0.11 * bl, k = q / 10;
    v = `rgb(${Math.round(y + (r - y) * k)},${Math.round(y + (g - y) * k)},${Math.round(y + (bl - y) * k)})`;
    satCache.set(key, v);
  }
  return v;
}
export function paintGlyph(ctx, prims, sat = 1) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const p of prims) {
    if (p.k === 'dot') {
      ctx.fillStyle = withSat(p.fill, sat); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
    } else if (p.k === 'line') {
      ctx.strokeStyle = withSat(p.stroke, sat); ctx.lineWidth = p.w; ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
    } else {
      const q = p.pts; ctx.beginPath(); ctx.moveTo(q[0], q[1]);
      for (let i = 2; i < q.length; i += 2) ctx.lineTo(q[i], q[i + 1]);
      ctx.closePath();
      if (p.fill) { ctx.fillStyle = withSat(p.fill, sat); ctx.fill(); }
      if (p.stroke) { ctx.strokeStyle = withSat(p.stroke, sat); ctx.lineWidth = p.w; ctx.stroke(); }
    }
  }
}

const f2 = (n) => (Math.round(n * 1000) / 1000).toString();
export function primsToSvg(prims) {
  return prims.map((p, i) => {
    if (p.k === 'dot') return `<circle key="${i}" cx="${f2(p.x)}" cy="${f2(p.y)}" r="${f2(p.r)}" fill="${p.fill}"/>`;
    if (p.k === 'line') return `<line x1="${f2(p.x1)}" y1="${f2(p.y1)}" x2="${f2(p.x2)}" y2="${f2(p.y2)}" stroke="${p.stroke}" stroke-width="${f2(p.w)}" stroke-linecap="round"/>`;
    let d = '';
    for (let k = 0; k < p.pts.length; k += 2) d += (k ? 'L' : 'M') + f2(p.pts[k]) + ' ' + f2(p.pts[k + 1]);
    return `<path d="${d}Z" fill="${p.fill || 'none'}" stroke="${p.stroke || 'none'}" stroke-width="${f2(p.w)}" stroke-linejoin="round"/>`;
  }).join('');
}

// A fixed pool of glyphs the field draws from.
export const GLYPHS = Array.from({ length: 64 }, (_, s) => makeGlyph(s));
const cellHash = (i, j) => (Math.imul(i + 31, 73856093) ^ Math.imul(j + 17, 19349663)) >>> 0;
export const cellGlyph = (i, j) => GLYPHS[cellHash(i, j) % GLYPHS.length];
export const cellNoise = (i, j) => ((cellHash(i, j) >>> 7) % 1000) / 1000;

// The default breathing: two travelling waves plus a little per-cell offset. Returns b in 0..1.
export function breathe(i, j, cols, rows, t) {
  const x = i / cols, y = j / rows;
  const w1 = Math.sin((x * 1.3 + y * 0.8) * TAU - t * 0.6);
  const w2 = Math.sin((x * 0.5 - y * 1.6) * TAU + t * 0.4 + 1.3);
  const n = Math.sin(cellNoise(i, j) * TAU + t * 0.9) * 0.08;
  return clamp(0.5 + 0.3 * w1 + 0.22 * w2 + n);
}

// ── Canvas field. `bFn(i, j, cols, rows, t, mouse, cx, cy)` decides how open each cell is. ──
export function ParamField({ cell = 40, alpha = 1, bFn = breathe, aFn, sFn, pre, className, style, reactive = false, still = false, fps = 30 }) {
  const ref = useRef(null);
  const props = useRef({ bFn, pre, alpha, aFn, sFn });
  props.current = { bFn, pre, alpha, aFn, sFn };
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const still0 = still || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dpr = 1, w = 0, h = 0, cols = 0, rows = 0, raf = null, last = 0;
    const mouse = { x: -9999, y: -9999 };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
      cols = Math.ceil(w / cell) + 1; rows = Math.ceil(h / cell) + 1;
    };
    const draw = (t) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      const { bFn: f, pre: pr, alpha: al0, aFn: af, sFn: sf } = props.current;
      const al = typeof al0 === 'function' ? al0(t) : al0;
      if (pr) pr(ctx, { w, h, dpr, t, cell, cols, rows });
      ctx.globalAlpha = al;
      const R = cell * 0.46, minW = 1 / (R * dpr);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cx = (i + 0.5) * cell, cy = (j + 0.5) * cell;
          const b = f(i, j, cols, rows, t, mouse, cx, cy, w, h);
          if (b <= 0.02) continue;
          ctx.globalAlpha = af ? al * af(i, j, cols, rows, t, mouse, cx, cy, w, h) : al;
          ctx.setTransform(dpr * R, 0, 0, dpr * R, dpr * cx, dpr * cy);
          paintGlyph(ctx, glyphPrims(cellGlyph(i, j), b, t, minW), sf ? sf(i, j, cols, rows, t, mouse, cx, cy, w, h) : 1);
        }
      }
      ctx.globalAlpha = 1;
    };
    resize();
    if (still0) {
      draw(3);
      const onR = () => { resize(); draw(3); };
      window.addEventListener('resize', onR);
      return () => window.removeEventListener('resize', onR);
    }
    draw(fieldTime());   // paint right away so a field mounted under a handover never shows an empty frame
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || now - last < 1000 / fps) return;
      last = now;
      draw((now - FIELD_T0) / 1000);
    };
    raf = requestAnimationFrame(frame);
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    if (reactive) window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, [cell, reactive, still, fps]);
  return <canvas ref={ref} className={className} style={style} aria-hidden="true" />;
}

// ── Small glyph as SVG: bullets, inline marks. `open` is the b value (how open the glyph is). `recipe` pins a
// hand-designed look (see BRAND_GLYPH in Portfolio.jsx). `live` makes it breathe and turn on the shared clock. ──
const glyphCache = new Map();
export function Glyph({ seed = 0, colors, recipe, open = 0.62, size = 12, t = 1.5, live = false, hover, minW = 0, lag = 0, range = [0.5, 0.95], speed = 1.6, className, style }) {
  const ref = useRef(null);
  const shown = hover === undefined ? open : 0;   // with `hover` given, it rests as its closed form (a dot/circle) and blooms while true
  const key = `${seed}|${colors ? colors.join(',') : ''}|${recipe ? JSON.stringify(recipe) : ''}|${shown}|${t}|${minW}`;
  let inner = glyphCache.get(key);
  const g = glyphFor(seed, colors, recipe);
  if (!inner) {
    inner = primsToSvg(glyphPrims(g, shown, t, minW)).replace(/ key="\d+"/g, '');
    glyphCache.set(key, inner);
  }
  useEffect(() => {
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    let raf, last = 0;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 33) return;
      last = now;
      const tt = fieldTime() + lag;
      const b = range[0] + (range[1] - range[0]) * (0.5 + 0.5 * Math.sin(tt * speed));   // opens and closes between a simple bloom and the full glyph
      el.innerHTML = primsToSvg(glyphPrims(g, b, tt * 1.4, minW)).replace(/ key="\d+"/g, '');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, open, key]);
  const bloom = useRef(0);
  useEffect(() => {
    if (hover === undefined) return;
    const el = ref.current;
    if (!el) return;
    const draw = (b, tt) => { el.innerHTML = primsToSvg(glyphPrims(g, b * open, tt, minW)).replace(/ key="\d+"/g, ''); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { bloom.current = hover ? 1 : 0; draw(bloom.current, t); return; }
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const target = hover ? 1 : 0;
      bloom.current += (target - bloom.current) * Math.min(1, dt * (hover ? 6 : 8));
      if (Math.abs(target - bloom.current) < 0.004) bloom.current = target;
      const tt = fieldTime() + lag;
      draw(bloom.current, tt * 1.4 + 0.5);
      if (hover || bloom.current > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hover, open, key]);
  return (
    <svg ref={ref} className={className} style={style} width={size} height={size} viewBox="-1.08 -1.08 2.16 2.16" aria-hidden="true" dangerouslySetInnerHTML={{ __html: inner }} />
  );
}
const glyphObjs = new Map();
function glyphFor(seed, colors, recipe) {
  const k = `${seed}|${colors ? colors.join(',') : ''}|${recipe ? JSON.stringify(recipe) : ''}`;
  let g = glyphObjs.get(k);
  if (!g) { g = makeGlyph(seed, colors || GLYPH_PALETTE, recipe); glyphObjs.set(k, g); }
  return g;
}

// Standalone SVG string (used to generate the favicon).
export function glyphSvgString(seed, colors, open, bg = '#111111') {
  const g = makeGlyph(seed, colors || GLYPH_PALETTE);
  const inner = primsToSvg(glyphPrims(g, open, 1.5, 0)).replace(/ key="\d+"/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.3 -1.3 2.6 2.6"><rect x="-1.3" y="-1.3" width="2.6" height="2.6" fill="${bg}"/>${inner}</svg>`;
}
