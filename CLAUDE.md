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
  sits behind transparent cards and text. The background wakes up when poked: clicking empty background sends a ripple of blooms and takes the color to ~80% saturation at the CENTRE of the bloom, fading out with distance (not the rim; alpha a
  little higher there too), for ~3s, and resting on empty background for 3s does the same around the pointer (`bgFx`, `bgFocus`, `onBg`). The canvas must stay
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
- About page (redesigned many times; scrapbook canvas, gallery-wall canvas, big-heading hero, tiny avatar, left-aligned layout,
  hover-to-reveal decks, huge-type bands and an in-page masonry were all tried and rejected; git 26d4571 has the scrapbook). Keep it
  CENTERED in the 1160px column. Top = `HeroField`: a full-bleed, high-saturation field of the opening animation's glyphs
  (breathing; moving through it opens glyphs with soft chimes) under the nav, with the intro on a frosted square (`.about-panel` +
  `.about-frost`: NO white fill, background transparent, heavy backdrop blur only, edges feathered by a mask) with generous padding.
  The portrait + text group is CENTERED in the box (equal left/right margins; the box hugs the content, ~130px each side, so it is slim), no longer lined up with the CV columns below.
  Intro = a SMALL (112px) round portrait aligned to the top of the text, lightly zoomed + ONE even block of 15px body text in full ink
  colour, NO bold phrases, no greeting heading, signed "Jayden". Keep About text dark. An ink divider sits between the CV-style
  sections (`.about-sec+.about-sec`) but NOT above Experience. Then Experience, Education and "Places I've been". There is NO
  "Outside of Design" block on About any more (hobbies have their own page).
- "Handmade" (pottery, drawing, baking; was called Hobbies) is its own page in the top nav (`#/handmade`, `page === 'handmade'`; old `#/hobbies` and `#/outside` still work): the same bento masonry as
  Tinkering (`StudioGrid`, `BentoTile plain`) but with NO links and NO hover text/overlay. Pottery first (they take pottery seriously),
  then drawing, baking. Photos: `public/assets/About/web/` plus `public/assets/Studio/` (9 pottery photos taken from the public posts of
  the @jaydensarkive Instagram, 640px, duplicates of existing photos skipped). Add pieces to `STUDIO` in Portfolio.jsx.
- "Places I've been" is NOT a label-and-content row: its own Thermal title, then an ABSTRACT world map (`src/worldMap.js`, generated by
  `scripts/gen-world.mjs`: coarse paper-cut continents, whole world framed with nothing cut off, no dotted style, Americas on the left)
  with every pin at its TRUE position (never offset pins: that put Portland in the sea). Hovering a pin or a place name under the map
  opens that place's photo beside the pin (white-framed card like the home intro photos) and blooms its flower: Portland (no photo yet,
  flower tile), Seoul (`public/assets/Places/seoul.jpg`), Los Angeles (usc.jpg), London (london.jpg, the user's polaroid), San Francisco
  (Adobe internship, adobe.jpg), Seattle (now, uw.jpg). No tiny inline drawings in the bio. Tinkering's nav hover shows twinkles.
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
