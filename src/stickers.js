// Stamps: visitors take a stamp (like FigJam's) and press it onto a piece on the About canvas. Stamps are shared (everyone
// sees what others left) and stored by api/stickers.js. Each browser can leave STICKER_LIMIT of them.
// If the server isn't reachable the feature simply doesn't appear; in `npm run dev` a small local stand-in is used.

export const STICKER_LIMIT = 10;
const USED = 'jk-stickers-used-v1';
const DEV = 'jk-stickers-dev-v1';

export const usedCount = () => { try { return Number(localStorage.getItem(USED)) || 0; } catch (e) { return 0; } };
const bump = () => { try { localStorage.setItem(USED, String(usedCount() + 1)); } catch (e) { /* private mode */ } };

async function call(method, body) {
  const r = await fetch('/api/stickers', { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error('stickers unavailable');
  return r.json();
}

function devList() {
  try { const l = JSON.parse(localStorage.getItem(DEV)); if (Array.isArray(l)) return l; } catch (e) { /* seed below */ }
  const seed = [
    { p: 'matcha-swirl', s: 'pink', x: 0.8, y: 0.25, r: 12 }, { p: 'matcha-swirl', s: 'smile', x: 0.25, y: 0.7, r: -8 },
    { p: 'celadon-cup', s: 'gold', x: 0.7, y: 0.2, r: 8 }, { p: 'slate-portrait', s: 'spark', x: 0.2, y: 0.3, r: -10 },
    { p: 'slate-portrait', s: 'blue', x: 0.78, y: 0.75, r: 14 }, { p: 'laminated-loaf', s: 'red', x: 0.5, y: 0.5, r: -6 },
  ];
  try { localStorage.setItem(DEV, JSON.stringify(seed)); } catch (e) { /* ignore */ }
  return seed;
}

// -> an array of { p: pieceId, s: stickerKind, x, y (0..1 inside the piece), r (deg) }, or null when there is no server
export async function loadStickers() {
  try { return (await call('GET')).stickers; } catch (e) { return import.meta.env.DEV ? devList() : null; }
}

export async function placeSticker(st) {
  try { await call('POST', st); } catch (e) {
    if (!import.meta.env.DEV) throw e;
    try { localStorage.setItem(DEV, JSON.stringify([...devList(), st])); } catch (err) { /* ignore */ }
  }
  bump();
}
