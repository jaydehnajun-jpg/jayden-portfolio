// Vercel serverless function for the About canvas stickers.
//   GET  /api/stickers                          -> { stickers: [{ p, s, x, y, r }, ...] }  (newest last)
//   POST /api/stickers { p, s, x, y, r }        -> stores one sticker
// Only the fixed piece ids and sticker kinds below are accepted, with positions clamped, so nothing free-form is stored.
// Storage is a Redis list reached over Upstash's REST API; it needs two environment variables. Adding "Upstash Redis"
// from the Vercel Marketplace (Storage tab) sets them for you:
//   KV_REST_API_URL / KV_REST_API_TOKEN   (or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
// Keep PIECES and KINDS in step with CANVAS_PHOTOS (`vote: true`) and STICKER_KINDS in src/Portfolio.jsx.

const PIECES = ['bowls-on-butter', 'arms-crossed-pastel', 'slate-portrait', 'nesting-bowls', 'still-life-with-guitar', 'cups-after-dark', 'matcha-swirl', 'red-portrait', 'laminated-loaf', 'celadon-cup', 'holiday-cookies', 'living-room-charcoal', 'croissant-batch'];
const KINDS = ['pink', 'blue', 'gold', 'green', 'red', 'teal', 'spark', 'smile'];
const KEY = 'stickers:v1';
const KEEP = 600;     // newest stickers kept in total
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(...cmd) {
  const r = await fetch(URL_, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, Number(v) || 0));

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_ || !TOKEN) return res.status(503).json({ error: 'sticker storage is not configured' });
  try {
    if (req.method === 'POST') {
      const b = req.body || {};
      if (!PIECES.includes(b.p) || !KINDS.includes(b.s)) return res.status(400).json({ error: 'unknown piece or sticker' });
      const st = { p: b.p, s: b.s, x: Math.round(clamp(b.x, 0.03, 0.97) * 1000) / 1000, y: Math.round(clamp(b.y, 0.03, 0.97) * 1000) / 1000, r: Math.round(clamp(b.r, -25, 25)) };
      await redis('RPUSH', KEY, JSON.stringify(st));
      await redis('LTRIM', KEY, -KEEP, -1);
      return res.status(200).json({ ok: true });
    }
    if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });
    const rows = (await redis('LRANGE', KEY, -KEEP, -1)) || [];
    const stickers = rows.map((r) => { try { return JSON.parse(r); } catch (e) { return null; } }).filter(Boolean);
    return res.status(200).json({ stickers });
  } catch (e) {
    return res.status(500).json({ error: 'stickers failed' });
  }
}
