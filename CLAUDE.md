# Jayden Kang Portfolio — Claude Code briefing

Single-page React portfolio. Vite + plain React, no router, no CSS framework —
all styles live in one `<style>` string inside `src/Portfolio.jsx`. This file
is long on purpose; keep it a single component tree unless there's a real
reason to split it.

## Run it

```
npm install
npm run dev
```

## Architecture

- **Page switching is state, not routing.** `page` state in `Portfolio()`
  toggles between `'home' | 'archive' | 'about'`. Switching pages unmounts/
  remounts the other views. `pendingScroll` handles the case of navigating
  to a different page AND needing to scroll to a specific element once it
  mounts (see `goHome`).
- **Home page** = `<SideRail>` (left, sticky) + `<WorkStack>` (right, the
  scroll-driven card stack). Both live inside one CSS grid (`.page`) so they
  share a coordinate system — don't reintroduce separately-computed offsets
  for the two columns, that's what caused the alignment bugs earlier.
- **WorkStack** computes which card is nearest viewport-center on scroll and:
  1. reports it up via `onActiveChange` (drives the rail's active TOC item)
  2. applies scale/opacity as a JS fallback — but only if the browser lacks
     native support for `animation-timeline: view()` (checked via
     `CSS.supports`). Modern Chrome/Edge/Safari use the native CSS
     `@keyframes card-focus` + `animation-timeline: view()` instead — it's
     synced to the exact same scroll geometry the browser uses for
     `scroll-snap`, so there's no drift between "where it snapped" and
     "how scaled/faded it looks." Don't remove the native path to "simplify"
     — it's there because the JS-only version visibly desynced from snap.
- **Cards use `scroll-snap-type: y mandatory`** on `html`, `scroll-snap-align:
  center` on `.card`. On mobile (`≤860px`) snap is turned OFF
  (`html{scroll-snap-type:none}`) because on short viewports it was
  snapping past the intro/rail content before a visitor could read it.
- **Anchor/TOC clicks use `scrollIntoView({block:'center'})` via onClick,
  not bare `<a href="#id">`.** Native anchor-jump aligns to the *top* of the
  target (via `scroll-margin-top`), which fights `scroll-snap-align: center`
  — clicks would land on the wrong card or appear to do nothing. Always
  `preventDefault()` + `scrollIntoView` for any in-page nav here.

## Known landmines (already hit these once — don't reintroduce)

- **Never use a bare `nav{...}` CSS selector.** There are two `<nav>`
  elements on the page (`.site-nav` for the top bar, `.toc` for the rail's
  scrollspy). A bare element selector applies to *both* — this exact bug
  once made the TOC inherit `position:fixed` from the top nav's rule and
  silently vanish into an invisible full-width layer. Always scope nav
  styles to `.site-nav` or `.toc` explicitly.
- **`position: sticky` + CSS Grid + Safari** can misbehave without
  `align-self: start` and `min-height: 0` explicitly set on the sticky
  element (see `.rail`). Don't drop these "for cleanup."
- **Card z-index is capped low (0–10) on purpose.** The rail sits at
  `z-index: 20` specifically so it always renders above the scroll-scaled
  cards. If you add more z-indexed elements, keep the rail's higher.
- **`.card` background is `transparent` on purpose** (not `var(--bg)`).
  Cards used to have an opaque fill, which fought visually with the
  cursor-tracking background grid effect (see below) — an opaque card
  looked like a flat white box dropped on top of it.

## Visual system

- Palette/tokens all live in `:root` — `--bg`, `--text`, `--text-mid`,
  `--text-dim`, `--border`, `--nav-h`, `--top`.
- Brand colors (`#00A86B` Skillshare green, `#E3000F` Adobe red, `#4B2E83`
  UW purple, `#990000` USC red) are hardcoded inline where used (card themes,
  KEYWORDS map) — not tokenized, since they're one-off references to real
  brand identities, not part of the site's own palette.
- **Core theme: parametric glyphs (replaced the old pixel language).** The
  site's motif is small n-fold symmetric marks built from polar curves
  (roses, epitrochoid loops, spokes, dot rings, stars), inspired by the
  cnrd.art "breathing" pattern reference. Everything lives in `src/Glyphs.jsx`:
  `makeGlyph(seed, palette)` describes a glyph, `glyphPrims(g, b, t)` turns it
  into shapes for an openness `b` (0 = a dot, 1 = full rosette), `ParamField`
  paints a grid of them on a canvas, `Glyph` renders one as inline SVG.
  Used for: the loading curtain (`Loader`, field breathes then clears in a
  six-petal flower), the page background (`BackgroundField`, calm + blooms near
  the cursor, quieter on long-copy pages), bullets (`Bullet`), About inline
  marks (`ART_*` = `{seed, colors}`), the Tinkering nav hover, and the favicon.
  Don't bring back pixel squares/pixel art. Keep the background alpha very
  low (0.06 home, 0.035 text-heavy pages; it has been 0.28, 0.15 and 0.10 and
  was too loud) and keep it desaturated at rest (color returns near the
  cursor, `bgSat`) and keep the clear zone around `.intro-text` (`updateAvoid`), it
  sits behind transparent cards and text. The canvas must stay
  `pointer-events:none`. The name/brand bullets use hand-designed filled
  recipes (`BRAND_GLYPH`, `solid: true`): a plain circle at rest that blooms into a flower only on hover (the intro
  word, or the card). Hovering an intro brand also opens a photo (`PeekCard`) with a few opening-animation glyphs
  breathing around it, no stroke outline or drop shadow on them.
  The loader hands over to the background seamlessly: both use `FIELD_CELL`,
  the same glyph per cell, and the shared clock `fieldTime()`; don't change one
  without the other. The background only mounts after loading finishes.
- No border-radius anywhere (`border-radius: 0` on cards, tiles) — this was
  a deliberate, explicit design decision. Don't add rounding "to soften it."
- No CTA buttons on cards, no "view case study" links — removed on purpose.

## Content

- `CARDS` array in `Portfolio.jsx` is the single source of truth for the
  work section — each entry has `company`, `title`, `desc`, optional
  `metrics`, and `media` (either a real `<Media>` image or a placeholder
  `<Anim*>` component). Adobe entry has `current: true` which renders the
  "Currently" badge instead of metrics.
- Adobe title is **"Experience Design Intern, Agents Team"** — got this
  wrong twice already (wrote "Product Design Intern" and "Incoming
  Experience Designer, Emerging Design Team" before). Don't reintroduce
  either wrong version.
- About page top is `AboutCanvas`: a frameless dotted canvas, edge to edge under the top nav, that you drag around (mouse,
  trackpad sideways swipe, touch sideways; plain stack on phones). The intro is two clean flat stickies beside the pinned
  profile photo (`hello.txt`, and the "Listening is what I care about most..." paragraph as its own `listening.txt` note);
  below them the pottery/drawing/baking photos are scattered in three labelled clusters, each titled like a file name
  (`xxxx.jpg`/`.png`). Visitors take a rubber stamp from the FigJam-style dock, choose which one, and press it on a piece; the
  one-color ink impressions are shared (`src/stickers.js` + Vercel function `api/stickers.js`, needs an Upstash Redis store;
  each browser gets `STICKER_LIMIT`). No vote counts or percentages. The canvas ends with a 1px rule; below it the CV rows
  stay plain, then `Places` (dotted world map from `src/worldMap.js`, generated by `scripts/gen-world.mjs`; Americas on the
  left, flowers bloom in, place names only on hover). The background glyph field is not shown on About. No tiny inline
  drawings in the bio text. Tinkering's nav hover shows four-point twinkles (`Twinkle`).
- The rest of About is intentionally plain/resume-style (company — title — date,
  no descriptions) after an earlier "fun/playful" version (tilt photo,
  rotating status ticker, colorful hover tags) was tried and explicitly
  rejected as "tacky." Don't reintroduce that direction without being asked.
- Archive page is a placeholder wireframe (`.bento` grid, gray tiles, fixed
  3 columns, height-only variation via `short`/default/`tall` classes) —
  real content (older case studies + explorations) hasn't been dropped in
  yet.

## Assets

Real images live in `public/assets/[CompanyName]/` and are referenced by
plain path (e.g. `/assets/Adobe/cover.jpg`), not inlined as base64 — keep
it that way; inlining bloats the source file and was only ever a workaround
for passing images through chat.
