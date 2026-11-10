import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { flushSync } from "react-dom";
import { ParamField, Glyph, breathe, fieldTime, cellNoise } from "./Glyphs.jsx";
import { MAP } from "./worldMap.js";
import ClassDiscovery from "./ClassDiscovery.jsx";
import Onboarding from "./Onboarding.jsx";
import AACDevice from "./AACDevice.jsx";
import AdobeTooling from "./AdobeTooling.jsx";
import AdobeVision from "./AdobeVision.jsx";
import GoogleMaps from "./GoogleMaps.jsx";
import Zuora from "./Zuora.jsx";
import Colorful from "./Colorful.jsx";
import Kidomi from "./Kidomi.jsx";
import UsabilityStudy from "./UsabilityStudy.jsx";
import AdobeAnim from "./AdobeAnim.jsx";
import AdobeVisionAnim from "./AdobeVisionAnim.jsx";
import { AnimImg } from "./caseKit.jsx";
import { MapsAnim, AACAnim, ZuoraAnim, NordAnim } from "./ExpAnims.jsx";
import { play, playBloom, playSparkle, isOn, setOn, subscribe, isReady, unlockAudio } from "./sound.js";

// Dev-only sandbox for 3D ideas (#/lab). Tree-shaken out of production builds.
const Lab3D = import.meta.env.DEV ? lazy(() => import("./Lab3D.jsx")) : null;

// Fades and lifts each case-study section's blocks into view as they scroll on screen.
function ScrollReveal({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    root.querySelectorAll('section').forEach((sec) => {
      Array.from(sec.children).forEach((el, i) => {
        // anything already on screen when the page opens just appears with the page transition, no second animation
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
        el.classList.add('rv');
        el.style.transitionDelay = Math.min(i, 4) * 90 + 'ms';
        io.observe(el);
      });
    });
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
}

const SKILLSHARE_VID = "/assets/ClassDiscovery/classdiscoveryvid.mp4";
const ONBOARDING_VID = "/assets/Onboarding/onboardingvid.mp4";

const BIO = "Jayden is an AI-native product designer. Adobe taught her to build gen AI experiences. Skillshare taught her to love B2C, watching real learners use what she made. Currently a Masters candidate at UW HCDE and a design graduate of USC.";
const NAME = 'Jayden';
const NAME_COLOR = '#1A1A18';
const BRAND_COLORS = { Adobe: '#E3000F', Skillshare: '#00A86B', USC: '#990000', 'University of Washington': '#4B2E83', UW: '#4B2E83' };
const BRAND_NAMES = Object.keys(BRAND_COLORS);
const HIGHLIGHT_COLORS = { [NAME]: NAME_COLOR, ...BRAND_COLORS };
const HIGHLIGHTS = Object.keys(HIGHLIGHT_COLORS);
// Hovering a company or school in the intro pops up a small photo from that chapter (files in public/assets/Intro/).
const PEEKS = { Adobe: 'adobe', Skillshare: 'skillshare', UW: 'uw', USC: 'usc' };

// Marker before a name or project: a small filled flower hand-colored per brand (petals, a lighter inner bloom,
// a bright center). No strokes, so it stays clean at 18px. A plain circle until hovered (the word in the intro, or the card), then it blooms.
const BRAND_GLYPH = {
  [NAME]: { solid: true, N: 5, petal: 0.4, cs: ['#1A1A18', '#F2B600', '#fff'], coreColor: '#D5287A' },
  Adobe: { solid: true, N: 6, petal: 0.4, cs: ['#E3000F', '#FF9A5A', '#fff'], coreColor: '#FFE066' },
  Skillshare: { solid: true, N: 5, petal: 0.4, cs: ['#00A86B', '#9FE6B8', '#fff'], coreColor: '#F2B600' },
  UW: { solid: true, N: 8, petal: 0.4, cs: ['#4B2E83', '#B9A3F0', '#fff'], coreColor: '#E0C97A' },
  USC: { solid: true, N: 6, petal: 0.4, cs: ['#990000', '#FF6A5A', '#fff'], coreColor: '#FFCC00' },
};
BRAND_GLYPH['University of Washington'] = BRAND_GLYPH.UW;
function Bullet({ name, active = true, hover, host }) {
  // A plain circle until hovered, then it blooms into the flower. `hover` is controlled by the caller (the intro words);
  // otherwise it follows the pointer over the closest `host` element (a card).
  const wrap = useRef(null);
  const [h, setH] = useState(false);
  useEffect(() => {
    const el = host && wrap.current ? wrap.current.closest(host) : null;
    if (!el) return;
    const on = () => setH(true), off = () => setH(false);
    el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off);
    return () => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off); };
  }, [host]);
  return (
    <span ref={wrap} className="gb-wrap">
      <Glyph className={`gbullet${active ? ' is-active' : ''}`} seed={1} recipe={BRAND_GLYPH[name] || BRAND_GLYPH[NAME]} open={0.92} hover={name === NAME ? undefined : hover === undefined ? h : hover} size={18} />
    </span>
  );
}

function Bio({ text, hot }) {
  const [over, setOver] = useState(null);   // the word under the pointer: its glyph blooms while the photo opens
  const pattern = new RegExp(`(${HIGHLIGHTS.join('|')})`, 'g');
  return (
    <p className="intro-text">
      {text.split(pattern).map((chunk, i) =>
        HIGHLIGHTS.includes(chunk) ? (
          <span key={i} data-peek={PEEKS[chunk]} className={`brand${chunk === hot ? ' is-hot' : ''}`} style={chunk === hot ? { color: HIGHLIGHT_COLORS[chunk] } : undefined}
            onMouseEnter={() => setOver(chunk)} onMouseLeave={() => setOver(null)}>
            <Bullet name={chunk} hover={chunk === over} />
            {chunk}
          </span>
        ) : chunk
      )}
    </p>
  );
}

// ── Placeholder color field for cards without a real photo yet ──
const AnimAC = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#DDD0BA' }}>
    <svg width="100%" height="100%" viewBox="0 0 260 150" preserveAspectRatio="xMidYMid slice">
      {[[46, 40, 130, 75], [130, 75, 214, 40], [130, 75, 82, 120], [130, 75, 184, 116], [46, 40, 82, 120]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(26,26,24,0.4)" strokeWidth="1" strokeDasharray="70" strokeDashoffset="70" style={{ animation: `lC 3s ease-in-out ${i * .45}s infinite` }} />
      ))}
      {[{ cx: 46, cy: 40, r: 8, d: '0s' }, { cx: 214, cy: 40, r: 6, d: '.5s' }, { cx: 130, cy: 75, r: 11, d: '.2s' }, { cx: 82, cy: 120, r: 7, d: '.9s' }, { cx: 184, cy: 116, r: 6, d: '1.1s' }].map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r={n.r + 5} fill="rgba(26,26,24,0.1)" style={{ animation: `nP 2.5s ease-in-out ${n.d} infinite` }} />
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="rgba(26,26,24,0.28)" stroke="rgba(26,26,24,0.5)" strokeWidth="1" style={{ animation: `nP 2.5s ease-in-out ${n.d} infinite` }} />
        </g>
      ))}
    </svg>
  </div>
);
const Media = ({ src, fit, bg }) => (
  <div className="card-img-wrap" style={{ background: bg }}>
    <img src={src} alt="" className="card-img" style={{ objectFit: fit }} />
  </div>
);

// Card media: a dark frame with a smaller animation centered in it.
const AnimFrame = ({ children }) => (
  <div className="card-img-wrap af"><div className="af-anim">{children}</div></div>
);

const MediaVideo = ({ src, fit, bg }) => (
  <div className="card-img-wrap" style={{ background: bg }}>
    <video
      className="card-img"
      style={{ objectFit: fit }}
      src={src}
      autoPlay
      loop
      muted
      playsInline
    />
  </div>
);

const CARDS = [
  {
    company: 'Adobe', color: '#E3000F',
    title: "Bringing Adobe's AI Agents to the Apps You Already Use.",
    tags: ['Adobe Internship', 'Under NDA'],
    media: <AnimFrame><AdobeAnim /></AnimFrame>,
  },
  {
    company: 'Adobe', color: '#E3000F',
    title: "Finding Where Adobe's AI Agent Could Stand Apart.",
    tags: ['Adobe Internship', 'Future Vision', 'Pitched'],
    media: <AnimFrame><AdobeVisionAnim /></AnimFrame>,
  },
  {
    company: 'Skillshare', color: '#00A86B',
    title: 'Redesigning How Learners Choose a Class.',
    tags: ['+47% Subscriptions', 'Shipped'],
    media: <MediaVideo src={SKILLSHARE_VID} fit="cover" bg="#F5F2EE" />,
  },
  {
    company: 'Skillshare', color: '#00A86B',
    title: 'Helping New Members Take Their First Step Faster.',
    tags: ['+4.3pp Retention', 'Shipped'],
    media: <MediaVideo src={ONBOARDING_VID} fit="cover" bg="#C2CBBC" />,
  },
];

// ── Primary page nav — Work / Archive / About, identical on every page (current page bolded,
// not omitted). Lives inside the rail on the home page, in the slot the "Selected Work" TOC used
// to occupy; floats unobtrusively (no bar chrome) on the single-column Archive/About pages. ──
// a four-point twinkle (used for the Tinkering hover)
const Twinkle = ({ color, size }) => (
  <svg width={size} height={size} viewBox="-1 -1 2 2" aria-hidden="true"><path d="M0 -1Q.1 -.1 1 0Q.1 .1 0 1Q-.1 .1 -1 0Q-.1 -.1 0 -1Z" fill={color} /></svg>
);

function PageNav({ page, goHome, goArchive, goAbout, goHandmade }) {
  return (
    <nav className="rail-nav" aria-label="Primary">
      <a href="#work-0" className={`rail-nav-link link-underline${page === 'home' || page === 'case' ? ' is-current' : ''}`} onClick={goHome('work-0')}>Work</a>
      <a href="#experimentation" className={`rail-nav-link link-underline${page === 'archive' || ARCHIVE_PAGE_KEYS.includes(page) ? ' is-current' : ''}`} onClick={goArchive}>Tinkering<span className="sparkles" aria-hidden="true"><Twinkle color="#F2B600" size={13} /><Twinkle color="#D5287A" size={10} /><Twinkle color="#2D5BD6" size={12} /><Twinkle color="#F2B600" size={9} /><Twinkle color="#1E9A8A" size={11} /></span></a>
      <a href="#handmade" className={`rail-nav-link link-underline${page === 'handmade' ? ' is-current' : ''}`} onClick={goHandmade}>Handmade</a>
      <a href="#about" className={`rail-nav-link link-underline${page === 'about' ? ' is-current' : ''}`} onClick={goAbout}>About<span className="fx-smile" aria-hidden="true" /></a>
    </nav>
  );
}

// ── Left column: just the intro now — primary nav lives in a fixed-position element rendered
// once at the Portfolio level (see .floating-nav) so it sits at the exact same screen position
// on every page, rather than living inside this page-specific column. ──
// Small label that follows the pointer over a project card, in that project's color.
function CardCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    let raf = null, x = 0, y = 0;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { raf = null; el.style.transform = `translate(${x + 16}px, ${y + 18}px)`; });
      const card = e.target.closest && e.target.closest('.card');
      el.classList.toggle('on', !!card);
      if (card) el.style.setProperty('--c', card.dataset.color || '#111');
    };
    const leave = () => el.classList.remove('on');
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave); };
  }, []);
  return <div className="card-cursor" ref={ref} aria-hidden="true"><div><i />View case study</div></div>;
}

function SideRail({ hot }) {
  return (
    <aside className="rail">
      <Bio text={BIO} hot={hot} />
    </aside>
  );
}

// Hover feel shared by the work cards and the Kind words cards: the element's first child leans a couple of
// degrees toward the pointer and the pointer position goes out as CSS vars (--tx/--ty for parallax, --gx/--gy
// for the sheen). Kept gentle on purpose, anything stronger visibly warps the image. It lives on an inner
// wrapper because .card's own transform belongs to the scroll-driven focus animation.
function tiltCard(e) {
  if (e.pointerType !== 'mouse') return;
  const t = e.currentTarget.firstChild, r = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  t.style.setProperty('--ry', `${((px - 0.5) * 3).toFixed(2)}deg`);
  t.style.setProperty('--rx', `${(-(py - 0.5) * 3).toFixed(2)}deg`);
  t.style.setProperty('--tx', (px - 0.5).toFixed(3));
  t.style.setProperty('--ty', (py - 0.5).toFixed(3));
  t.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
  t.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
}
function untiltCard(e) {
  const t = e.currentTarget.firstChild;
  t.style.setProperty('--ry', '0deg'); t.style.setProperty('--rx', '0deg');
  t.style.setProperty('--tx', '0'); t.style.setProperty('--ty', '0');
}

// ── Right column: scroll-driven stack of cards. Each card's company label carries a glyph bullet
// marker that fills in when that card is the one nearest viewport-center — the active-state cue
// the removed "Selected Work" TOC used to carry, now living on the cards themselves. ──
function WorkStack({ activeIdx, onActiveChange, onOpenCase }) {
  const cardRefs = useRef([]);
  const rafId = useRef(null);
  const activeIdxRef = useRef(0);
  const nativeSupport = useRef(typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'view()'));

  const measure = useCallback(() => {
    const vh = window.innerHeight;
    const centerY = vh / 2;
    let nearest = 0, nearestDist = Infinity;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cardCenter = r.top + r.height / 2;
      const dist = Math.abs(cardCenter - centerY);

      // Native browsers handle the visual scale/fade themselves via CSS — only compute it here as a fallback.
      if (!nativeSupport.current) {
        const proximity = Math.max(0, 1 - dist / (vh * 0.55));
        el.style.transform = `scale(${0.9 + proximity * 0.1})`;
        el.style.opacity = 0.5 + proximity * 0.5;
        el.style.zIndex = String(Math.round(proximity * 10));
      }

      if (dist < nearestDist) { nearestDist = dist; nearest = i; }
    });

    if (nearest !== activeIdxRef.current) {
      activeIdxRef.current = nearest;
      onActiveChange(nearest);
    }
    rafId.current = null;
  }, [onActiveChange]);

  const onScroll = useCallback(() => {
    if (rafId.current == null) rafId.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [onScroll, measure]);

  return (
    <div className="stack">
      {CARDS.map((c, i) => (
        <div
          key={i} id={`work-${i}`} ref={el => cardRefs.current[i] = el} className="card" data-color={c.color}
          role="link" tabIndex={0} aria-label={`${c.company}: ${c.title}`}
          onClick={() => onOpenCase(i)}
          onKeyDown={(e) => { if (e.key === 'Enter') onOpenCase(i); }}
          onPointerMove={tiltCard} onPointerLeave={untiltCard}
        >
          <div className="card-tilt">
            <div className="card-media">
              {c.media}
              {c.current && <span className="card-badge">Currently</span>}
            </div>
            <div className="card-body">
              <span className="card-company"><Bullet name={c.company} active={i === activeIdx} host=".card" />{c.company}</span>
              <h3 className="card-title">{c.title}</h3>
              <p className="card-tags">{c.tags.map((t, j) => <span key={t}>{j > 0 && <i />}{t}</span>)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Case study template — same shape for every project: a hero (company, title, description,
// metrics, media) followed by a two-column layout reusing the home page's own .page grid, with
// a sticky table-of-contents rail on the left and placeholder (wireframe) content sections on
// the right. Real case-study copy hasn't been written yet — this is the structural skeleton it
// will drop into, same convention as the Archive page's placeholder tiles. ──
const CASE_SECTIONS = ['Overview', 'Problem', 'Process', 'Solution', 'Outcome'];
const slugify = (s) => s.toLowerCase();

function CaseStudy({ card }) {
  return (
    <section className="case-page">
      <div className="case-hero">
        <span className="card-company"><Bullet name={card.company} />{card.company}</span>
        <h1 className="case-title">{card.title}</h1>
        <p className="case-desc">{card.desc}</p>
        {card.metrics && (
          <div className="card-metrics">
            {card.metrics.map((m, j) => (<div key={j} className="metric"><span className="card-val">{m.val}</span><span className="card-label">{m.label}</span></div>))}
          </div>
        )}
        <div className="case-hero-media">
          {card.media}
          {card.current && <span className="card-badge">Currently</span>}
        </div>
      </div>

      <div className="page case-body">
        <aside className="rail">
          <span className="rail-label">On This Page</span>
          <nav className="case-toc" aria-label="Case study sections">
            {CASE_SECTIONS.map((s) => (
              <a
                key={s}
                href={`#${slugify(s)}`}
                className="rail-nav-link link-underline"
                onClick={(e) => { e.preventDefault(); document.getElementById(slugify(s))?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              >
                {s}
              </a>
            ))}
          </nav>
        </aside>

        <div className="case-sections">
          {CASE_SECTIONS.map((s) => (
            <section key={s} id={slugify(s)} className="case-section">
              <h2 className="case-section-title">{s}</h2>
              <div className="wf-block case-placeholder" />
              <div className="wf-block case-placeholder short" />
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Archive: explorations and side projects, in justified rows. Inside a row each tile's width
// is proportional to its image's aspect ratio (`a`, width / height), so every image in a row
// comes out the same height at its true proportions: nothing is cropped or stretched, and the
// mix of row heights gives the grid its variety. `matte` sets the image on a colored panel
// (for sources whose own backdrop blends into the page). Titles are descriptive placeholders
// inferred from the files; rename freely. ──
// Rows run top to bottom in order of importance and appeal: real product/UX work first, then
// interaction studies, then 3D and type. Order of the rows (and of tiles within a row) is the
// display order, so to re-rank, reorder here and keep each row's tiles adding up to a nice height.
//
// Optional fields make a tile clickable. `page` opens a full case-study page (see the routing at
// the bottom of Portfolio); the others open a quick detail panel:
//   desc:   a paragraph of context
//   links:  [{ label, url }]
//   assets: extra image filenames in public/assets/Archive/ (shown below, at natural size)
const ARCHIVE_ROWS = [
  [
    { src: 'colorful.gif',   a: 600 / 461,   title: 'Colorful',                       tag: 'UCI Designathon · 1st Place', page: 'colorful', matte: '#E4DCCF' },
    { src: 'gmap.png',       a: 2000 / 1430, title: 'Google Maps Route Optimization', tag: 'Feature Proposal', page: 'gmaps' },
  ],
  [
    { src: 'zuorathum.png',    a: 712 / 400,  title: 'Zuora Design System', tag: 'Systems', page: 'zuora' },
    { src: '/assets/AAC/aacmain-tile.png', a: 1049 / 757, title: 'AI AAC Device', tag: 'UW × Amazon RAISE', page: 'aac' },
    { src: 'carcolor.gif',     a: 1,          title: 'Car Color Selection', tag: 'Spatial Interaction', slug: 'car-color-selection', desc: 'A spatial interaction experiment.' },
  ],
  [
    { src: '/assets/Kidomi/thumb.png', a: 1600 / 1027, title: 'Ki.domi', tag: 'Accessibility', page: 'kidomi', matte: '#E6DDF7' },
    { src: '/assets/Usability/gift-landing.png', a: 1010 / 482, title: 'Nordstrom AI Gift Finder Study', tag: 'UX Research', page: 'usability' },
    { src: 'cardselect.gif',           a: 1280 / 720,  title: 'Card Selection', tag: 'Spatial Interaction', slug: 'card-selection', desc: 'A spatial interaction experiment.' },
  ],
  [
    { src: 'foldernavinteraction.gif', a: 1280 / 720, title: 'Folder Navigation', tag: 'Spatial Interaction', slug: 'folder-navigation', desc: 'A spatial interaction experiment.' },
    { src: 'toneshiftimg.gif',         a: 800 / 493,  title: 'Tone Shifter',      tag: 'Interaction', slug: 'tone-shifter', desc: 'A tool that helps rephrase Slack messages.' },
    {
      src: 'customfont.png', a: 800 / 577, title: 'Glyqlo', tag: 'Typeface', slug: 'glyqlo',
      meta: 'April 2023 · Advanced Typography class · FontForge, Illustrator, Procreate',
      desc: 'In my Advanced Typography class, I created a new typeface that focused on the different possibilities of descenders and strokes.',
      assets: ['/assets/Glyqlo/g19.png', '/assets/Glyqlo/g14.png', '/assets/Glyqlo/g15.png', '/assets/Glyqlo/g16.png', '/assets/Glyqlo/g17.png', '/assets/Glyqlo/g18.png'],
    },
  ],
  [
    {
      src: '/assets/Experiments/IMG_6438.jpg', a: 3 / 4, title: 'Laser-Cut Dot Slider', tag: 'Physical Prototype', slug: 'laser-cut-dot-slider',
      meta: 'Laser-cut wood',
      desc: 'A laser-cut wooden object with a dot-matrix engraving and a sliding knob.',
      assets: ['/assets/Experiments/IMG_6438.jpg'],
      mp4: '/assets/Experiments/IMG_6440.mp4',
    },
    {
      src: '/assets/Experiments/IMG_6147.jpg', a: 3 / 4, title: 'Laser-Cut Modular Shelf', tag: 'Physical Prototype', slug: 'laser-cut-modular-shelf',
      meta: 'Laser-cut wood',
      desc: 'A modular wooden shelf with interlocking panels and patterned cutouts, cut on a laser cutter.',
      assets: ['/assets/Experiments/IMG_6147.jpg'],
    },
  ],
  [
    {
      src: '3dmodeling.png', a: 800 / 505, title: 'Pink Imagination', tag: '3D Animation', slug: 'pink-imagination',
      meta: 'November 2022 · Classwork · Cinema 4D',
      desc: 'A 3D animation made in Cinema 4D for a class.',
      video: 'myMBru0y0lE',
    },
    {
      src: 'typography.png', a: 800 / 450, title: 'Type Explorations', tag: 'Typography', slug: 'type-explorations',
      meta: '2022 – 2023 · Personal projects, classwork, and things made for fun',
      desc: 'A mix of typographic explorations: 3D lettering, posters, and type in motion.',
      video: 'hgT_3S-ffnw',
      assets: ['/assets/TypeExplorations/minutes.jpg', '/assets/TypeExplorations/ouch.png', '/assets/TypeExplorations/screen.jpg', ['/assets/TypeExplorations/space1.png', '/assets/TypeExplorations/space2.png'], ['/assets/TypeExplorations/space3.png', '/assets/TypeExplorations/space4.png']],
    },
  ],
];

// Grid order and thumbnails: the physical and spatial pieces lead, then the rest. Four projects get a drawn
// animation (ExpAnims.jsx) instead of a screenshot, and Colorful plays the part of the prototype after onboarding.
const ARCHIVE_ORDER = ['Google Maps Route Optimization', 'Car Color Selection', 'Card Selection', 'Folder Navigation', 'Laser-Cut Modular Shelf', 'Colorful', 'Laser-Cut Dot Slider', 'AI AAC Device', 'Tone Shifter', 'Zuora Design System', 'Ki.domi', 'Nordstrom AI Gift Finder Study', 'Glyqlo', 'Pink Imagination', 'Type Explorations'];
const ARCHIVE_ANIMS = { 'Google Maps Route Optimization': MapsAnim, 'AI AAC Device': AACAnim, 'Zuora Design System': ZuoraAnim, 'Nordstrom AI Gift Finder Study': NordAnim };
const ARCHIVE_ITEMS = ARCHIVE_ROWS.flat()
  .map((it) => (ARCHIVE_ANIMS[it.title] ? { ...it, anim: ARCHIVE_ANIMS[it.title], a: 1.6 }
    : it.title === 'Colorful' ? { ...it, src: 'colorful-play.gif', a: 856 / 658, matte: undefined } : it))
  .sort((x, y) => ARCHIVE_ORDER.indexOf(x.title) - ARCHIVE_ORDER.indexOf(y.title));

const hasDetail = (item) => !!(item.page || item.slug || item.desc || (item.links && item.links.length) || (item.assets && item.assets.length));

function BentoTile({ item, onOpen, plain }) {
  const open = hasDetail(item);
  return (
    <figure
      className={`bento-tile${open ? ' is-link' : ''}${plain ? ' is-plain' : ''}`}
      style={{ aspectRatio: item.a, background: item.matte }}
      onClick={open ? () => onOpen(item) : undefined}
      role={open ? 'button' : undefined}
      tabIndex={open ? 0 : undefined}
      onKeyDown={open ? (e) => { if (e.key === 'Enter') onOpen(item); } : undefined}
    >
      {item.nda ? (
        <div className="bento-nda"><span>Under NDA</span></div>
      ) : item.anim ? (
        <div className="bento-anim"><item.anim /></div>
      ) : (
      <AnimImg
        src={item.src.startsWith('/') ? item.src : `/assets/Archive/${item.src}`} alt={item.title}
        className={`bento-img${item.matte ? ' is-matte' : ''}`}
      />
      )}
      {!plain && (
      <figcaption className="bento-label">
        <span className="bento-tag">{item.tag}</span>
        <span className="bento-title">{item.title}</span>
      </figcaption>
      )}
    </figure>
  );
}

// Full-screen detail for an archive piece: the work at natural size, context, links, extra assets.
const archiveSrc = (f) => encodeURI(f.startsWith('/') ? f : `/assets/Archive/${f}`);

function ArchiveDetail({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  // Text first, then the work (images; a nested array is a row), then video last.
  const media = item.assets && item.assets.length ? item.assets : (item.video ? [] : [item.src]);
  return (
    <div className="ad" onClick={onClose}>
      <div className="ad-dialog" role="dialog" aria-modal="true" aria-label={item.title} onClick={(e) => e.stopPropagation()}>
        <div className="ad-head">
          <span className="ad-tag"><i />{item.tag}</span>
          <button className="ad-close" onClick={onClose}>Close ✕</button>
        </div>
        <h2 className="ad-title">{item.title}</h2>
        {item.meta && <div className="ad-meta">{item.meta}</div>}
        {item.desc && <p className="ad-desc">{item.desc}</p>}
        {item.links && item.links.length > 0 && (
          <div className="ad-links">
            {item.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer">{l.label} →</a>)}
          </div>
        )}
        {media.map((m, i) => Array.isArray(m) ? (
          <div key={i} className="ad-row" style={{ gridTemplateColumns: `repeat(${m.length},minmax(0,1fr))` }}>
            {m.map((f) => <AnimImg key={f} src={archiveSrc(f)} alt="" className="ad-img" />)}
          </div>
        ) : (
          <AnimImg key={m} src={archiveSrc(m)} alt={i === 0 ? item.title : ''} className="ad-img" />
        ))}
        {item.mp4 && <video src={item.mp4} className="ad-img" controls playsInline preload="metadata" />}
        {item.video && (
          <div className="ad-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${item.video}`}
              title={item.title}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Pinterest-style masonry: fixed-width columns, each tile at its own aspect ratio. Tiles are dealt
// out in order to whichever column is currently shortest, so the list still reads roughly left to
// right, top to bottom (most important first).
const archiveCols = (w) => (w >= 1400 ? 4 : w >= 900 ? 3 : 2);

function ArchiveGrid({ modalSlug, onOpenModal, onCloseModal, onOpenPage }) {
  const [cols, setCols] = useState(() => archiveCols(window.innerWidth));
  useEffect(() => {
    const onResize = () => setCols(archiveCols(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const items = ARCHIVE_ITEMS;
  const columns = Array.from({ length: cols }, () => []);
  const heights = Array(cols).fill(0);
  items.forEach((item) => {
    const c = heights.indexOf(Math.min(...heights));
    columns[c].push(item);
    heights[c] += 1 / item.a;
  });

  const open = modalSlug ? items.find((i) => i.slug === modalSlug) : null;
  const openItem = (item) => (item.page ? onOpenPage(item.page) : onOpenModal(item.slug));
  return (
    <>
      <div className="bento">
        {columns.map((col, i) => (
          <div key={i} className="bento-col">
            {col.map((item) => <BentoTile key={item.src || item.title} item={item} onOpen={openItem} />)}
          </div>
        ))}
      </div>
      {open && <ArchiveDetail item={open} onClose={onCloseModal} />}
    </>
  );
}

// ── About: profile photo, plus the Outside of Design shelf, film strip and Places below. Web-sized copies live in public/assets/About/web/ (the
// originals next to them are several MB each). Photos keep their own aspect ratio. To add more,
// drop a resized file in web/ and add it to BOARD below. ──
const ABOUT_DOT = { Adobe: '#E3000F', Skillshare: '#00A86B', 'University of Washington': '#4B2E83', 'University of Southern California': '#990000' };
// Small parametric glyphs for the About story; they sit inline in the paragraph like icons.

// Recommendations from Skillshare colleagues, quoted as written (trimmed to whole sentences).
// `photo` is a square headshot in public/assets/Kind/; without one the card shows an initial.
const KIND_WORDS = [
  {
    name: 'Sharon Byun',
    photo: '/assets/Kind/sharon.jpg',
    role: 'Lead Product Designer, Skillshare',
    text: "What stood out most was her ability to blend creativity with practicality, producing polished, functional designs while always keeping user needs top of mind. I have no doubt that Jayden has a bright future ahead in product design, and I highly recommend her for any design role.",
  },
  {
    name: 'Melissa Lyons',
    photo: '/assets/Kind/melissa.jpg',
    role: 'VP of Product, Skillshare',
    text: "Jayden was an incredible Product Design Intern at Skillshare in the fall of 2024. Within her first month, she was independently tackling projects, conducting competitive analyses, user research, and deep dives into current functionality, uncovering insights that might have otherwise been missed.",
  },
];

const LINKEDIN_URL = 'https://www.linkedin.com/in/jaydenhkang/';
const CONTACT_EMAIL = 'jaydehnajun@gmail.com';

// Footer: a small thank-you, the LinkedIn link, and an email address that copies on click.
// `snapEnd` is for the home page only: html uses mandatory scroll-snap there, so the footer needs its own snap point
// to be reachable. On every other page it would be the only snap point and drag each scroll to the bottom.
function SiteFooter({ snapEnd }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONTACT_EMAIL).then(done, done);
    else done();
  };
  return (
    <footer className={`site-footer${snapEnd ? ' snap-end' : ''}`}>
      <p className="footer-msg">Thanks for stopping by. If something here made you smile, I'd love to say hi <span className="footer-smile" aria-hidden="true" /></p>
      <div className="footer-links">
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="pixel-underline">LinkedIn ↗</a>
        <button type="button" className="footer-copy pixel-underline" onClick={copy} aria-live="polite">
          {copied ? 'Email copied ✓' : 'Copy email'}
        </button>
      </div>
      <span className="footer-name">Jayden Kang · 2026</span>
    </footer>
  );
}

// About story: three short paragraphs; the pixel illustrations sit mid-sentence like inline icons.
const ABOUT_STORY = [
  "As a kid, I stayed up past bedtime making tiny food, chasing every detail. That love of craft followed me into design. In college I studied visual branding and loved the storytelling, but it felt one-sided.",
  "Then at Skillshare, I launched my first real interaction and watched people use it. Suddenly there was a real person on the other end. UX felt like a conversation. I build something, people respond, I respond back, and I fell for that loop. At Adobe, I got to design the conversation itself, shaping how generative AI agents behave in ways people can trust.",
  "Listening is what I care about most, and it's personal. I know what it's like to be left out of a design that wasn't built with me in mind, so I make things that work for everyone, without anyone noticing the effort.",
];
const PROFILE_IMG = '/assets/About/web/profile.jpg';
// ── About ──
// Flower recipes shared by the About page (gallery blooms, the places map).
const R = {
  pink: { solid: true, N: 5, petal: 0.4, cs: ['#D5287A', '#F7B2C4', '#fff'], coreColor: '#F2B600' },
  blue: { solid: true, N: 6, petal: 0.4, cs: ['#2D5BD6', '#A9C0FF', '#fff'], coreColor: '#F2B600' },
  gold: { solid: true, N: 8, petal: 0.35, cs: ['#F2B600', '#FFE08A', '#fff'], coreColor: '#E3000F' },
  green: { solid: true, N: 4, petal: 0.5, cs: ['#00A86B', '#9FE6B8', '#fff'], coreColor: '#F2B600' },
  red: { solid: true, N: 6, petal: 0.4, cs: ['#E3000F', '#FF9A5A', '#fff'], coreColor: '#FFE066' },
  teal: { solid: true, N: 5, petal: 0.3, cs: ['#1E9A8A', '#A5E3DA', '#fff'], coreColor: '#D5287A' },
};

// The signature moment: the opening animation's glyphs, breathing in color behind the intro, full-bleed under the top nav. The intro
// sits on a feathered square layered over them. Move through the field and the glyphs under the cursor open up, each with a small
// chime, like the opening animation (sound waits for the first click or key press).
function HeroField({ children }) {
  const lit = useRef(new Map()), lastNote = useRef(0);
  const [touched, setTouched] = useState(false);
  const bFn = (i, j, cols, rows, t, m, cx, cy) => {
    const base = 0.2 + 0.5 * breathe(i, j, cols, rows, t * 0.8);
    const d = Math.hypot(cx - m.x, cy - m.y), bloom = Math.exp(-(d * d) / (2 * 130 * 130));
    const key = i * 512 + j, was = lit.current.get(key) || false;
    if (bloom > 0.55 && !was) {
      lit.current.set(key, true);
      const now = performance.now();
      if (now - lastNote.current > 90) { lastNote.current = now; play('chime', i * 3 + j * 5); setTouched(true); }
    } else if (bloom < 0.2 && was) lit.current.set(key, false);
    return Math.min(0.97, base + bloom * 0.6);
  };
  const sFn = (i, j, cols, rows, t, m, cx, cy) => 0.78 + 0.22 * Math.exp(-(Math.hypot(cx - m.x, cy - m.y) ** 2) / (2 * 160 * 160));
  return (
    <div className="heroband">
      <ParamField className="heroband-canvas" cell={FIELD_CELL} alpha={0.5} bFn={bFn} sFn={sFn} reactive local fps={30} />
      {children}
      <span className={`heroband-hint${touched ? ' is-gone' : ''}`} aria-hidden="true">Move through it</span>
    </div>
  );
}

// The Handmade page (#/handmade): the same bento masonry as Tinkering, without links or hover text. Pottery first. Photos from
// public/assets/Studio/ (from the @jaydensarkive archive) and public/assets/About/web/. `a` is width / height.
const STUDIO = [
  { src: '/assets/Studio/lilac-and-rose-bowls.jpg', a: 1, title: 'Lilac and Rose Bowls', tag: 'Pottery' },
  { src: '/assets/About/web/pottery4.jpg', a: 1171 / 1200, title: 'Celadon Cup', tag: 'Pottery' },
  { src: '/assets/Studio/rose-pouring-bowl.jpg', a: 528 / 640, title: 'Rose Pouring Bowl', tag: 'Pottery' },
  { src: '/assets/About/web/pottery1.jpg', a: 1200 / 1197, title: 'Nesting Bowls', tag: 'Pottery' },
  { src: '/assets/Studio/round-vase-lavender.jpg', a: 1, title: 'Round Vase in Lavender', tag: 'Pottery' },
  { src: '/assets/Studio/lilac-bowl-carved.jpg', a: 480 / 640, title: 'Carved Lilac Bowl', tag: 'Pottery' },
  { src: '/assets/About/web/pottery3.jpg', a: 1, title: 'Cups After Dark', tag: 'Pottery' },
  { src: '/assets/Studio/stacked-vases-shadow.jpg', a: 639 / 640, title: 'Stacked Vases', tag: 'Pottery' },
  { src: '/assets/About/web/pottery2.jpg', a: 1200 / 1197, title: 'Bowls on Butter', tag: 'Pottery' },
  { src: '/assets/Studio/two-cups-closeup.jpg', a: 639 / 640, title: 'Two Cups, Up Close', tag: 'Pottery' },
  { src: '/assets/Studio/mug-on-deck.jpg', a: 1, title: 'Mug on the Deck', tag: 'Pottery' },
  { src: '/assets/Studio/cream-glaze-closeup.jpg', a: 639 / 640, title: 'Cream Glaze', tag: 'Pottery' },
  { src: '/assets/Studio/greenware-lineup.jpg', a: 1, title: 'Greenware Lineup', tag: 'Pottery' },
  { src: '/assets/About/web/drawing1.jpg', a: 1, title: 'Still Life with Guitar', tag: 'Drawing' },
  { src: '/assets/About/web/drawing5.jpg', a: 800 / 782, title: 'Red Portrait', tag: 'Drawing' },
  { src: '/assets/About/web/drawing2.jpg', a: 800 / 591, title: 'Living Room, Charcoal', tag: 'Drawing' },
  { src: '/assets/About/web/drawing4.jpg', a: 1, title: 'Slate Portrait', tag: 'Drawing' },
  { src: '/assets/About/web/drawing3.jpg', a: 800 / 794, title: 'Arms Crossed, Pastel', tag: 'Drawing' },
  { src: '/assets/About/web/baking2.jpg', a: 1200 / 957, title: 'Matcha Swirl', tag: 'Baking' },
  { src: '/assets/About/web/baking1.jpg', a: 1190 / 1200, title: 'Laminated Loaf', tag: 'Baking' },
  { src: '/assets/About/web/baking4.jpg', a: 1141 / 1200, title: 'Croissant Batch', tag: 'Baking' },
  { src: '/assets/About/web/baking3.jpg', a: 1200 / 1047, title: 'Holiday Cookies', tag: 'Baking' },
];
function StudioGrid() {
  const [cols, setCols] = useState(() => Math.min(3, archiveCols(window.innerWidth)));
  useEffect(() => {
    const onResize = () => setCols(Math.min(3, archiveCols(window.innerWidth)));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const columns = Array.from({ length: cols }, () => []);
  const heights = Array(cols).fill(0);
  STUDIO.forEach((item) => {
    const c = heights.indexOf(Math.min(...heights));
    columns[c].push(item);
    heights[c] += 1 / item.a;
  });
  return (
    <div className="bento">
      {columns.map((col, i) => (
        <div key={i} className="bento-col">{col.map((item) => <BentoTile key={item.src} item={item} plain />)}</div>
      ))}
    </div>
  );
}
// Places I've been: an abstract world map (src/worldMap.js, generated by scripts/gen-world.mjs) with every pin at its true spot. Hover a
// pin, or a name under the map, and that place's photo opens beside the pin.
const PLACES = [
  { key: 'portland', city: 'Portland', region: 'Oregon', role: 'Born' },
  { key: 'seoul', city: 'Seoul', region: 'South Korea', role: 'Grew up', photo: '/assets/Places/seoul.jpg' },
  { key: 'la', city: 'Los Angeles', region: 'California', role: 'USC · undergrad', photo: '/assets/Intro/usc.jpg' },
  { key: 'london', city: 'London', region: 'England', role: 'Study abroad', photo: '/assets/Places/london.jpg' },
  { key: 'sf', city: 'San Francisco', region: 'California', role: 'Adobe internship', photo: '/assets/Intro/adobe.jpg' },
  { key: 'seattle', city: 'Seattle', region: 'Washington', role: 'UW · grad school', now: true, photo: '/assets/Intro/uw.jpg' },
];
const PLACE_FLOWERS = { portland: R.pink, seoul: R.blue, la: BRAND_GLYPH.USC, london: R.teal, sf: BRAND_GLYPH.Adobe, seattle: BRAND_GLYPH.UW };
function Places() {
  const [active, setActive] = useState(null);
  const on = (k) => ({ onMouseEnter: () => setActive(k), onMouseLeave: () => setActive(null), onFocus: () => setActive(k), onBlur: () => setActive(null) });
  return (
    <div className="places">
      <div className="map-box" style={{ aspectRatio: `${MAP.W} / ${MAP.h}` }}>
        <svg viewBox={`0 ${MAP.y0} ${MAP.W} ${MAP.h}`} className="map-svg" role="img" aria-label="World map of the places listed under it">
          <path d={MAP.land} className="map-land" />
        </svg>
        {PLACES.map((p) => {
          const [x, y] = MAP.pts[p.key], left = (x / MAP.W) * 100, flip = left > 60;
          return (
            <div key={p.key} className={`map-pin${active === p.key ? ' is-on' : ''}${flip ? ' is-flip' : ''}`} style={{ left: `${left}%`, top: `${((y - MAP.y0) / MAP.h) * 100}%` }}>
              <button type="button" className="map-dot" aria-label={p.city} {...on(p.key)} />
              <span className="map-bloom"><Glyph seed={1} recipe={PLACE_FLOWERS[p.key]} open={0.92} hover={active === p.key} size={30} /></span>
              <figure className="map-peek" aria-hidden="true">
                <div className="map-peek-img">
                  {p.photo ? <img src={p.photo} alt="" draggable="false" /> : <span className="map-peek-flower"><Glyph seed={1} recipe={PLACE_FLOWERS[p.key]} open={0.92} hover={active === p.key} size={64} /></span>}
                </div>
                <figcaption><b>{p.city}</b><span>{p.role}</span></figcaption>
              </figure>
            </div>
          );
        })}
      </div>
      <ul className="place-names">
        {PLACES.map((p) => (
          <li key={p.key}><button type="button" className={active === p.key ? 'is-on' : ''} {...on(p.key)}>{p.city}{p.now && <em>Now</em>}</button></li>
        ))}
      </ul>
    </div>
  );
}

// ── Loading curtain: the parametric field fills the screen on the cream page color, breathes open for a
// moment, then clears from the center outward. The clearing edge is a loose six-petal flower rather than a
// circle: each cell's distance from the center is divided by a petal factor that swells and dips with its
// angle. Cells the edge has passed don't vanish: they settle into the exact state of the page background
// (same grid, same glyph, same shared clock), so when the curtain unmounts nothing changes on screen. ──
const FIELD_CELL = 48;
const bgAlpha = (quiet) => (quiet ? 0.035 : 0.06);
function Loader({ onDone, quiet }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const t0 = useRef(fieldTime()).current;
  const rel = useRef(null);            // when the curtain starts to clear (null = still holding)
  const [gate, setGate] = useState(false);
  const HOLD = 1.7, CLEAR = 1.5;   // seconds: breathing in, then clearing outward
  // Browsers keep audio locked until the visitor clicks or presses a key, so the chimes would never be heard if the intro ran by
  // itself. If audio is locked, the intro holds (breathing) with a "click to enter with sound" hint: a click unlocks the sound and
  // the curtain clears with the chimes. If nobody clicks within a few seconds it carries on silently.
  useEffect(() => {
    let done = false, wait = 0, fin = 0;
    const release = (hold, chimes) => {
      if (done) return;
      done = true; clearTimeout(wait); setGate(false);
      rel.current = fieldTime() + hold;
      if (chimes) playSparkle(0, (hold + CLEAR) * 1000);
      fin = setTimeout(() => onDoneRef.current(), (hold + CLEAR + 0.15) * 1000);
    };
    const ev = ['pointerdown', 'keydown'];
    const go = () => { off(); unlockAudio().then(() => release(0.9, true)); };
    const off = () => ev.forEach((e) => window.removeEventListener(e, go));
    if (!isOn()) release(HOLD, false);
    else if (isReady()) release(HOLD, true);
    else {
      setGate(true);
      ev.forEach((e) => window.addEventListener(e, go));
      wait = setTimeout(() => { off(); release(0.4, false); }, 4800);
    }
    return () => { done = true; off(); clearTimeout(wait); clearTimeout(fin); };
  }, []);
  // Each cell clears on its own schedule: a loose pull from the centre outward, mostly scatter, so the
  // curtain breaks up irregularly (like pixels dropping out) instead of sweeping away as one clean edge.
  const WIN = 0.12;
  const clearAt = (i, j, cx, cy, w, h) => {
    const dx = cx - w / 2, dy = cy - h / 2;
    const radial = Math.min(1, Math.hypot(dx, dy) / (Math.hypot(w / 2, h / 2)));
    const n = 0.6 * cellNoise(i, j) + 0.4 * cellNoise(j + 57, i + 131);
    return 0.3 * radial + 0.7 * n;
  };
  // 1 = still part of the curtain, 0 = cleared (now just the page background)
  const keep = (i, j, cx, cy, w, h, T) => {
    const R = rel.current;
    if (R === null || T <= R) return 1;
    const th = clearAt(i, j, cx, cy, w, h) * (1 - WIN), p = (T - R) / CLEAR;
    return 1 - smoothstep(th, th + WIN, p);
  };
  // The cream sheet behind the glyphs goes transparent more gently than the glyphs do: it fades out a little ahead of
  // them and is drawn from a tiny per-cell map scaled up smoothly, so no square ever shows as it disappears.
  const sheet = useRef(null);
  const sheetKeep = (i, j, cx, cy, w, h, T) => {
    const R = rel.current, p = R === null ? 0 : (T - R) / CLEAR;
    if (p <= 0) return 1;
    const st = clearAt(i, j, cx, cy, w, h) * 0.55;
    return 1 - smoothstep(st, st + 0.35, p);
  };
  const bFn = (i, j, cols, rows, T, m, cx, cy, w, h) => {
    const t = T - t0, grow = smoothstep(0, 1.1, t);
    const full = breathe(i, j, cols, rows, T * 1.4) * 0.9 * grow + 0.08 * grow;
    const s = keep(i, j, cx, cy, w, h, T);
    const calm = bgField(i, j, cols, rows, T, m, cx, cy);
    return calm + (full - calm) * s;
  };
  const aFn = (i, j, cols, rows, T, m, cx, cy, w, h) => { const s = keep(i, j, cx, cy, w, h, T), a = bgAlpha(quiet); return a + (1 - a) * s; };
  const sFn = (i, j, cols, rows, T, m, cx, cy, w, h) => { const s = keep(i, j, cx, cy, w, h, T), c = bgSat(i, j, cols, rows, T, m, cx, cy); return c + (1 - c) * s; };
  const pre = (ctx, { w, h, dpr, t: T, cell }) => {
    updateAvoid();
    // cream sheet under the glyphs (smooth, see sheetKeep)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#F5F2EE';
    if (rel.current === null || T <= rel.current) { ctx.fillRect(0, 0, w, h); return; }
    const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
    if (!sheet.current) sheet.current = document.createElement('canvas');
    const sc = sheet.current;
    if (sc.width !== cols || sc.height !== rows) { sc.width = cols; sc.height = rows; }
    const sx = sc.getContext('2d'), img = sx.createImageData(cols, rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const o = (j * cols + i) * 4;
      img.data[o] = 0xF5; img.data[o + 1] = 0xF2; img.data[o + 2] = 0xEE;
      img.data[o + 3] = Math.round(255 * sheetKeep(i, j, (i + 0.5) * cell, (j + 0.5) * cell, w, h, T));
    }
    sx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sc, 0, 0, cols * cell, rows * cell);
    ctx.globalAlpha = 1;
  };
  return (
    <>
      <ParamField className="loader" cell={FIELD_CELL} alpha={1} aFn={aFn} sFn={sFn} bFn={bFn} pre={pre} fps={45} />
      {gate && <div className="loader-hint" aria-live="polite"><span>Click anywhere to enter, with sound</span></div>}
    </>
  );
}
const smoothstep = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

// ── Page background: the same field, kept calm. Glyphs sit small and quiet and breathe slowly; near the
// cursor they bloom open. Low alpha, and they clear out around the intro text so it always reads. ──
let AVOID = null;
const updateAvoid = () => {
  const el = window.innerWidth > 860 ? document.querySelector('.intro-text') : null;
  AVOID = el ? el.getBoundingClientRect() : null;
};
const avoidFactor = (cx, cy) => {
  if (!AVOID) return 1;
  const dx = Math.max(AVOID.left - 28 - cx, 0, cx - (AVOID.right + 28)), dy = Math.max(AVOID.top - 28 - cy, 0, cy - (AVOID.bottom + 28));
  return smoothstep(0, 110, Math.hypot(dx, dy));
};
const bgBloom = (m, cx, cy) => { const d = Math.hypot(cx - m.x, cy - m.y); return Math.exp(-(d * d) / (2 * 90 * 90)); };
// desaturated at rest; color comes back where the cursor is
// Poking the empty background wakes the field up: a click sends a ripple of blooms across it and lifts its color for a few seconds,
// and resting on empty background for 3 seconds does too. The color rises to about 80% at the centre of the bloom and fades out with
// distance (not at the rim). Both ease back.
const BG_CONTENT = 'a,button,input,textarea,select,label,p,h1,h2,h3,h4,li,blockquote,figure,img,video,svg:not(.field-canvas),.card,.kind,.glyph-band,.site-footer,.rail-nav,.sound-toggle,.peek,[data-peek],.map,.places';
const onBg = (el) => !(el && el.closest && el.closest(BG_CONTENT));
const bgFx = { boost: 0, since: 0, ripples: [] };
const bgFxStep = () => {
  const now = performance.now();
  const target = bgFx.since && now - bgFx.since > 3000 ? 1 : 0;   // resting on empty background for 3s (strength follows the pointer)
  bgFx.boost += (target - bgFx.boost) * (target > bgFx.boost ? 0.07 : 0.025);
  if (bgFx.ripples.length && now - bgFx.ripples[0].at > 3600) bgFx.ripples.shift();
};
const bgPre = () => { updateAvoid(); bgFxStep(); };
// Where the background was clicked (or where the pointer has rested for 3s) the color rises to about 80% at the centre and fades out
// with distance, so the saturated part is the middle of the bloom, not its expanding rim.
const bgFocus = (t, m, cx, cy) => {
  let f = 0;
  for (const r of bgFx.ripples) {
    const age = t - r.t;
    if (age < 0 || age > 3.4) continue;
    const dx = cx - r.x, dy = cy - r.y;
    f += Math.min(1, age / 0.2) * (1 - age / 3.4) * Math.exp(-(dx * dx + dy * dy) / (2 * 260 * 260));
  }
  if (bgFx.boost > 0.01) { const dx = cx - m.x, dy = cy - m.y; f += bgFx.boost * Math.exp(-(dx * dx + dy * dy) / (2 * 260 * 260)); }
  return Math.min(1, f);
};
const bgSat = (i, j, cols, rows, t, m, cx, cy) => Math.min(1, 0.08 + 0.92 * bgBloom(m, cx, cy) + 0.72 * bgFocus(t, m, cx, cy));
const bgAlphaMul = (i, j, cols, rows, t, m, cx, cy) => 1 + 0.7 * bgFocus(t, m, cx, cy);
const bgField = (i, j, cols, rows, t, m, cx, cy) => {
  const base = 0.03 + 0.2 * breathe(i, j, cols, rows, t * 0.6);
  let rip = 0;
  for (const r of bgFx.ripples) {   // a ring of bloom travelling out from where the background was clicked
    const age = t - r.t;
    if (age < 0 || age > 2) continue;
    const d = Math.hypot(cx - r.x, cy - r.y) - age * 620;
    rip += 0.55 * Math.exp(-(d * d) / (2 * 70 * 70)) * (1 - age / 2);
  }
  return Math.min(0.9, base + bgBloom(m, cx, cy) * 0.6 + rip) * avoidFactor(cx, cy);
};
function BackgroundField({ quiet }) {
  useEffect(() => {
    let down = null;
    const pd = (e) => { down = { x: e.clientX, y: e.clientY, at: performance.now(), bg: onBg(e.target) }; };
    const pu = (e) => {
      const d = down; down = null;
      if (!d || !d.bg || !onBg(e.target) || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6 || performance.now() - d.at > 500) return;   // a click, not a drag
      bgFx.ripples.push({ x: e.clientX, y: e.clientY, t: fieldTime(), at: performance.now() });
    };
    const pm = (e) => { if (onBg(e.target)) { if (!bgFx.since) bgFx.since = performance.now(); } else bgFx.since = 0; };
    const leave = () => { bgFx.since = 0; };
    window.addEventListener('pointerdown', pd); window.addEventListener('pointerup', pu); window.addEventListener('pointermove', pm, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('pointerdown', pd); window.removeEventListener('pointerup', pu); window.removeEventListener('pointermove', pm);
      document.documentElement.removeEventListener('mouseleave', leave);
      bgFx.boost = 0; bgFx.since = 0; bgFx.ripples.length = 0;
    };
  }, []);
  // quieter on pages with long copy so the glyphs never compete with reading
  return <ParamField className="field-canvas" cell={FIELD_CELL} alpha={bgAlpha(quiet)} aFn={bgAlphaMul} bFn={bgField} sFn={bgSat} pre={bgPre} reactive fps={30} />;
}


// ── Hash routing: every page and archive modal has a URL, so the back button works and pieces can be
// linked directly (#/work/adobe, #/experimentation/colorful, #/experimentation/glyqlo, #/about). `#/archive/...` still works. ──
const WORK_SLUGS = ['adobe-tooling', 'adobe-vision', 'class-discovery', 'onboarding'];
const ARCHIVE_PAGES = { gmaps: 'google-maps', zuora: 'zuora', colorful: 'colorful', kidomi: 'ki-domi', usability: 'nordstrom-ai-gift-finder', aac: 'ai-aac-device' };
const ARCHIVE_PAGE_KEYS = Object.keys(ARCHIVE_PAGES);

function parseHash(hash) {
  const [a, b] = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (a === 'work' && b === 'ai-aac-device') return { page: 'aac', caseIdx: 0, modal: null }; // moved to Experimentation
  if (a === 'work' && b === 'adobe') return { page: 'case', caseIdx: 0, modal: null }; // old single Adobe page
  if (a === 'work' && WORK_SLUGS.includes(b)) return { page: 'case', caseIdx: WORK_SLUGS.indexOf(b), modal: null };
  if (a === 'experimentation' || a === 'archive') {
    const key = ARCHIVE_PAGE_KEYS.find((k) => ARCHIVE_PAGES[k] === b);
    if (key) return { page: key, caseIdx: 0, modal: null };
    return { page: 'archive', caseIdx: 0, modal: b || null };
  }
  if (a === 'about') return { page: 'about', caseIdx: 0, modal: null };
  if (a === 'handmade' || a === 'hobbies' || a === 'outside') return { page: 'handmade', caseIdx: 0, modal: null };
  if (a === 'lab' && import.meta.env.DEV) return { page: 'lab', caseIdx: 0, modal: null };
  return { page: 'home', caseIdx: 0, modal: null };
}

// Small photo that follows the cursor while it's over an intro word marked data-peek. It trails the pointer a
// little and tilts with its speed. The frame loop only runs while a photo is showing.
// A few glyphs from the opening animation bloom around the photo and keep breathing, softly, while it is open. Each photo
// has its own arrangement: [left %, top %, size px, delay ms, seed]. Some overlap its corners and edges; none sit on the
// hovered word, which is just left of it.
const PEEK_LAYOUT = {
  adobe: [[-2, -6, 38, 0, 3], [100, -4, 48, 90, 9], [96, 102, 32, 180, 21], [52, 108, 22, 240, 30]],
  skillshare: [[103, 12, 34, 0, 14], [105, 62, 24, 100, 41], [72, 108, 44, 170, 5], [22, 105, 26, 240, 27], [-3, -3, 28, 60, 11]],
  uw: [[48, -10, 32, 0, 33], [-4, 104, 42, 120, 17], [101, 40, 26, 60, 50], [92, 101, 38, 200, 2]],
  usc: [[-3, -5, 42, 0, 25], [64, -11, 24, 80, 38], [104, 50, 40, 150, 7], [40, 106, 28, 220, 44], [100, 104, 22, 260, 19]],
};
const PEEK_NOTE = { adobe: 0, skillshare: 2, uw: 1, usc: 3 };   // where each photo's run of notes starts on the scale
const PEEK_COLORS = Object.fromEntries(Object.entries(PEEKS).map(([name, k]) => [k, [...BRAND_GLYPH[name].cs.slice(0, 2), '#F2B600', '#2D5BD6', '#D5287A', '#1E9A8A']]));
function PeekCard() {
  const box = useRef(null);
  const [key, setKey] = useState(null);   // the photo being shown (kept while it fades out)
  const [visible, setVisible] = useState(false);
  const [warm, setWarm] = useState(false);
  useEffect(() => { const t = setTimeout(() => setWarm(true), 2000); return () => clearTimeout(t); }, []); // preload the four photos once the page has settled
  useEffect(() => {
    const el = box.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = { x: 0, y: 0, tx: 0, ty: 0, rot: 0, show: false, raf: 0 };
    const frame = () => {
      const dx = s.tx - s.x, dy = s.ty - s.y;
      s.x += dx * (reduced ? 1 : 0.2); s.y += dy * (reduced ? 1 : 0.2);
      s.rot += ((reduced ? 0 : Math.max(-9, Math.min(9, dx * 0.35))) - s.rot) * 0.15;
      const w = el.offsetWidth, h = el.offsetHeight;
      // hangs right next to the pointer, so the hovered word stays visible just to its left
      let x = s.x + 24;
      if (x + w > window.innerWidth - 12) x = s.x - w - 24;   // flip to the left near the right edge
      const y = Math.max(12, Math.min(window.innerHeight - h - 12, s.y - h * 0.35));
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${s.rot}deg)`;
      s.raf = s.show || Math.abs(dx) + Math.abs(dy) > 0.5 ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(frame); };
    const onOver = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const t = e.target.closest && e.target.closest('[data-peek]');
      if (!t) return;
      s.tx = e.clientX; s.ty = e.clientY;
      if (!s.show) { s.x = s.tx; s.y = s.ty; s.rot = 0; }
      if (!s.show) playBloom((PEEK_LAYOUT[t.dataset.peek] || []).map((p) => p[3]), PEEK_NOTE[t.dataset.peek] || 0);
      s.show = true; setKey(t.dataset.peek); setVisible(true); kick();
    };
    const onMove = (e) => { if (!s.show) return; s.tx = e.clientX; s.ty = e.clientY; kick(); };
    const onOut = (e) => {
      const t = e.target.closest && e.target.closest('[data-peek]');
      if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return;
      s.show = false; setVisible(false);
    };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    return () => { cancelAnimationFrame(s.raf); document.removeEventListener('pointerover', onOver); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerout', onOut); };
  }, []);
  return (
    <div className={`peek${visible ? ' is-on' : ''}`} ref={box} aria-hidden="true">
      <div className="peek-in">
        {Object.values(PEEKS).map((k) => (warm || k === key) ? <img key={k} src={`/assets/Intro/${k}.jpg`} alt="" className={k === key ? 'is-cur' : ''} draggable="false" /> : null)}
      </div>
      <div className="peek-glyphs">
        {key && (PEEK_LAYOUT[key] || []).map(([x, y, size, delay, seed], n) => (
          <span key={`${key}${n}`} className="peek-g" style={{ left: `${x}%`, top: `${y}%`, '--d': `${delay}ms` }}>
            <Glyph seed={seed} colors={PEEK_COLORS[key]} open={0.95} minW={0.09} live={visible} lag={n * 1.3} range={[0.35, 0.95]} speed={1.1 + (n % 3) * 0.3} size={size} />
          </span>
        ))}
      </div>
    </div>
  );
}

// Corner switch for the UI sounds (see sound.js). Remembered between visits.
function SoundToggle() {
  const [on, setLocal] = useState(isOn());
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(isReady()); return subscribe((v) => { setLocal(v); setReady(isReady()); }); }, []);
  return (
    <button type="button" className="sound-toggle" onClick={() => setOn(!on)} aria-pressed={on} aria-label={on ? 'Turn sound off' : 'Turn sound on'}>
      <i className={on && ready ? 'is-on' : ''} />{on ? (ready ? 'Sound on' : 'Click for sound') : 'Sound off'}
    </button>
  );
}

// Which elements get which sound. Delegated from the document so the individual components stay untouched.
const HOVER_SOUND = '[data-peek], .card, .rail-nav-link, .ad-close, .sound-toggle';
const NAV_SOUND = { '#work-0': 'navWork', '#experimentation': 'navTinker', '#handmade': 'navAbout', '#about': 'navAbout' };
const CLICK_SOUND = 'a, button, [role="button"], .card, .bento-tile.is-link';

const nav = (hash) => { if (window.location.hash !== hash) window.location.hash = hash; };

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const finishLoading = useCallback(() => setLoading(false), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const initial = useRef(parseHash(window.location.hash)).current;
  const [page, setPage] = useState(initial.page); // 'home' | 'archive' | 'about' | 'case' | an archive page key
  const [caseIdx, setCaseIdx] = useState(initial.caseIdx);
  const [modalSlug, setModalSlug] = useState(initial.modal);
  const routeRef = useRef(initial.page + ':' + initial.caseIdx);

  // UI sounds: a tick on hover (mouse only), a pip on click, a swish when the page changes, a note per nav link.
  useEffect(() => {
    let over = null;
    const onOver = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const t = e.target.closest && e.target.closest(HOVER_SOUND);
      if (t === over) return;
      over = t;
      if (t && !t.classList.contains('sound-toggle')) play(t.classList.contains('rail-nav-link') ? NAV_SOUND[t.getAttribute('href')] || 'hover' : 'hover');
    };
    let navAt = -1e9;   // the top nav keeps its hover sound but is silent on click (and on the page change it causes)
    const onClick = (e) => {
      if (!e.target.closest) return;
      if (e.target.closest('.rail-nav-link')) { navAt = performance.now(); return; }
      if (e.target.closest(CLICK_SOUND) && !e.target.closest('.sound-toggle')) play('click');
    };
    const onHash = () => { if (performance.now() - navAt > 500) play('swish'); };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('click', onClick, true);
    window.addEventListener('hashchange', onHash);
    return () => { document.removeEventListener('pointerover', onOver); document.removeEventListener('click', onClick, true); window.removeEventListener('hashchange', onHash); };
  }, []);

  // Follow the URL: back/forward and direct links all land here.
  useEffect(() => {
    const apply = () => {
      const r = parseHash(window.location.hash);
      const key = r.page + ':' + r.caseIdx;
      const changed = key !== routeRef.current;
      const swap = () => {
        // reset scroll first (instant: html has scroll-behavior:smooth) so the new page mounts at the top and its
        // above-the-fold content can skip the reveal animation; the old page's snapshot is already taken
        if (changed) window.scrollTo({ top: 0, behavior: 'instant' });
        flushSync(() => { setPage(r.page); setCaseIdx(r.caseIdx); setModalSlug(r.modal); });
      };
      routeRef.current = key;
      // Moving between pages cross-fades through the View Transitions API (a ~0.2s fade, see the ::view-transition
      // rules in the CSS) so the content swap and scroll reset don't read as a jump. Browsers without it, and
      // visitors who prefer reduced motion, get the plain swap. Opening/closing a modal on the same page is not a route change.
      if (changed && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(swap);
      else swap();
    };
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  const [pendingScroll, setPendingScroll] = useState(null);

  // After switching pages, scroll to the requested target once the new page's content has mounted.
  useEffect(() => {
    if (!pendingScroll || page !== 'home') return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(pendingScroll.id)?.scrollIntoView({ behavior: 'instant', block: pendingScroll.block });
      setPendingScroll(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [page, pendingScroll]);

  const goHome = (scrollId) => (e) => {
    e.preventDefault();
    if (page !== 'home') {
      setPendingScroll({ id: scrollId, block: 'center' });
      nav('#/');
    } else {
      document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goArchive = (e) => { e.preventDefault(); nav('#/experimentation'); if (page === 'archive') window.scrollTo(0, 0); };
  const goAbout = (e) => { e.preventDefault(); nav('#/about'); };
  const goHandmade = (e) => { e.preventDefault(); nav('#/handmade'); };
  const goArchiveCase = (key) => nav(key === 'archive' ? '#/experimentation' : '#/experimentation/' + ARCHIVE_PAGES[key]);
  const goCase = (idx) => nav('#/work/' + WORK_SLUGS[idx]);

  const quietBg = page === 'about' || page === 'handmade' || page === 'case' || ARCHIVE_PAGE_KEYS.includes(page);

  return (
    <>
      <style>{`
.rv{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}
.rv.rv-in{opacity:1;transform:none}
        /* fonts (Open Sauce Sans, DM Mono) are self-hosted and imported in main.jsx via @fontsource */

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#F5F2EE;--text:#1A1A18;--text-mid:rgba(26,26,24,.5);--text-dim:rgba(26,26,24,.3);
          --border:rgba(26,26,24,.08);--top:96px;
        }
        html{scroll-behavior:smooth;scroll-snap-type:y mandatory}
        body{background:var(--bg);color:var(--text);font-family:'Open Sauce Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        /* headings use Thermal (Adobe Fonts kit linked in index.html); everything else stays Open Sauce Sans */
        /* page-to-page cross-fade (View Transitions API); the fixed nav and sound toggle keep their own layers so they stay put */
        ::view-transition-group(root){animation-duration:.3s}
        ::view-transition-old(root){animation:vtOut .16s ease both}
        ::view-transition-new(root){animation:vtIn .3s cubic-bezier(.2,.7,.2,1) both}
        @keyframes vtOut{to{opacity:0}}
        @keyframes vtIn{from{opacity:0;transform:translateY(6px)}}
        .floating-nav{view-transition-name:site-nav}
        .sound-toggle{view-transition-name:sound-toggle}
        h1,h2,h3{font-family:'thermal-variable','Open Sauce Sans',sans-serif;font-weight:400}

        /* parametric glyph field behind the page, and the same canvas as the loading curtain */
        .field-canvas{position:fixed;inset:0;z-index:-1;pointer-events:none;width:100vw;height:100vh}

        @keyframes nP{0%,100%{opacity:.25}50%{opacity:1}}
        @keyframes lC{0%{stroke-dashoffset:70;opacity:0}40%{opacity:.7}60%{stroke-dashoffset:0;opacity:.7}100%{stroke-dashoffset:70;opacity:0}}

        /* Primary nav — identical set of links on every page. Lives in the rail on the home
           page; floats (no bar chrome) on other pages. */
        .rail-nav{display:flex;gap:20px;align-items:center;flex-wrap:wrap}
        .rail-nav-link{font-size:12px;color:var(--text-dim);text-decoration:none;transition:color .15s}
        .rail-nav-link:hover{color:var(--text)}
        /* "Tinkering" blooms a few little parametric glyphs around the word on hover */
        .rail-nav-link{position:relative}
        .sparkles{position:absolute;inset:0;pointer-events:none}
        .sparkles svg{position:absolute;opacity:0;scale:0}
        .sparkles svg:nth-child(1){left:-12px;top:-9px}
        .sparkles svg:nth-child(2){left:32%;top:-15px}
        .sparkles svg:nth-child(3){left:64%;top:-12px}
        .sparkles svg:nth-child(4){right:-12px;top:3px}
        .sparkles svg:nth-child(5){left:44%;bottom:-15px}
        @media (prefers-reduced-motion:no-preference){
          .rail-nav-link:hover .sparkles svg{animation:twinkle 1.05s ease-in-out infinite}
          .sparkles svg:nth-child(2){animation-delay:.2s!important}
          .sparkles svg:nth-child(3){animation-delay:.45s!important}
          .sparkles svg:nth-child(4){animation-delay:.1s!important}
          .sparkles svg:nth-child(5){animation-delay:.65s!important}
        }
        /* About: a sideways :) pops in above the word, the same smile as the footer */
        .fx-smile{position:absolute;left:100%;top:-11px;margin-left:-2px;pointer-events:none;font-family:'DM Mono',monospace;font-size:11px;line-height:1;color:var(--text);opacity:0;transform:rotate(90deg) scale(0)}
        .fx-smile::before{content:':)'}
        @media (prefers-reduced-motion:no-preference){
          .rail-nav-link:hover .fx-smile{animation:smilePop .5s steps(5,end) forwards}
        }
        @keyframes smilePop{0%{opacity:0;transform:rotate(90deg) scale(0)}60%{opacity:1;transform:rotate(90deg) scale(1.4)}100%{opacity:1;transform:rotate(90deg) scale(1)}}
        @keyframes twinkle{0%{opacity:0;scale:0;rotate:-25deg}35%{opacity:1;scale:1.25;rotate:0deg}55%{opacity:.85;scale:.8}75%{opacity:1;scale:1.05}100%{opacity:0;scale:0;rotate:35deg}}
        .rail-nav-link.is-current{color:var(--text);font-weight:600}
        .floating-nav{position:fixed;top:32px;left:60px;z-index:100}
        .peek{position:fixed;left:0;top:0;z-index:90;pointer-events:none;will-change:transform}
        .peek-in{position:relative;background:#fff;padding:5px;border:1px solid rgba(26,26,24,.1);box-shadow:0 14px 32px -14px rgba(26,26,24,.4);opacity:0;clip-path:inset(48% 46% 48% 46%);transition:opacity .15s ease,clip-path .2s ease}
        .peek.is-on .peek-in{opacity:1;clip-path:inset(0);transition:opacity .12s ease,clip-path .55s cubic-bezier(.2,.9,.25,1)}
        .peek-in img{scale:1.18;transition:scale .7s cubic-bezier(.2,.9,.25,1)}
        .peek.is-on .peek-in img{scale:1}
        .peek-glyphs{position:absolute;inset:0;pointer-events:none}
        .peek-g{position:absolute;display:block;line-height:0;translate:-50% -50%;scale:0;rotate:-90deg;opacity:0;transition:scale .15s ease,rotate .15s ease,opacity .15s ease}
        .peek.is-on .peek-g{scale:1;rotate:0deg;opacity:.8;transition:scale .5s cubic-bezier(.3,1.5,.5,1) var(--d),rotate .8s cubic-bezier(.2,.9,.25,1) var(--d),opacity .2s ease var(--d)}
        .peek-g svg{display:block}
        @media (prefers-reduced-motion:reduce){.peek-in{clip-path:none;transition:opacity .15s}}
        .peek-in img{display:none;max-width:230px;max-height:250px;width:auto;height:auto;-webkit-user-drag:none}
        .peek-in img.is-cur{display:block}
        .sound-toggle{position:fixed;right:24px;bottom:20px;z-index:100;display:flex;align-items:center;gap:8px;padding:6px 2px;background:none;border:0;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-mid)}
        .sound-toggle:hover{color:var(--text)}
        .sound-toggle i{width:6px;height:6px;background:var(--text-dim);display:block;transition:background .2s ease}
        .sound-toggle i.is-on{background:#E3000F}

        /* underline that draws left to right on hover */
        .link-underline{position:relative}
        .link-underline::after{content:'';position:absolute;left:0;bottom:-3px;height:2px;width:0;background:currentColor;transition:width .35s cubic-bezier(.2,.7,.2,1)}
        .link-underline:hover::after{width:100%}

        /* ── Page layout: one grid, one coordinate system for both columns.
           No top padding here — .rail's sticky top:var(--top) and .stack's padding-top:var(--top)
           both key off the same variable, so the two columns line up without a third offset. ── */
        .page{max-width:1280px;margin:0;padding:0 60px 40px;display:grid;grid-template-columns:260px 1fr;gap:48px;align-items:start}

        /* ── LEFT COLUMN ── */
        .rail{position:sticky;top:var(--top);align-self:start;display:flex;flex-direction:column;gap:16px;z-index:5;min-height:0}
        .intro-text{font-size:13px;line-height:1.7;color:var(--text);max-width:250px}
        /* bigger screens: a slightly larger intro on the left, and the card column nudged to the right */
        @media (min-width:1500px){
          .page{max-width:1400px;grid-template-columns:320px 1fr;gap:80px}
          .intro-text{font-size:15px;max-width:300px}
        }
        @media (min-width:1900px){
          .page{max-width:1560px;grid-template-columns:360px 1fr;gap:96px}
          .intro-text{font-size:17px;max-width:340px}
        }
        .brand{font-weight:700;color:#000;transition:color .35s ease}
        .gb-wrap{display:contents}
        .card-cursor{position:fixed;left:0;top:0;z-index:6000;pointer-events:none}
        .card-cursor>div{display:flex;align-items:center;gap:8px;background:#111;color:#fff;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:7px 10px;white-space:nowrap;opacity:0;transform:scale(.85);transform-origin:top left;transition:opacity .15s ease, transform .15s ease}
        .card-cursor>div i{width:6px;height:6px;background:var(--c,#fff)}
        .card-cursor.on>div{opacity:1;transform:none}
        .card-media>*{transition:transform .7s cubic-bezier(.2,.7,.2,1)}
        .card:hover .card-media>*{transform:scale(1.05) translate(calc(var(--tx,0) * -10px),calc(var(--ty,0) * -8px))}
        .card{perspective:900px}
        .card-tilt{translate:0 0;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .6s cubic-bezier(.34,1.4,.64,1),translate .6s cubic-bezier(.34,1.56,.64,1)}
        .card:hover .card-tilt{translate:0 -6px}
        /* a soft light that follows the pointer across the image, like a reflection on a raised surface */
        .card-media::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s ease;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.28),rgba(255,255,255,0) 55%)}
        .card:hover .card-media::after{opacity:1}
        @media (hover:none),(prefers-reduced-motion:reduce){.card-tilt{transform:none!important;translate:none!important}.card-media::after{display:none}}
        .brand .gbullet{margin-right:0;vertical-align:-4.5px}

        .rail-rule{height:1px;background:var(--border)}
        .rail-label{font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-dim)}

        /* ── RIGHT COLUMN ── */
        .stack{display:flex;flex-direction:column;gap:28px;padding-top:var(--top);padding-bottom:8vh}

        .card{position:relative;width:100%;border-radius:0;overflow:visible;display:flex;flex-direction:column;background:transparent;transform-origin:center center;will-change:transform,opacity;scroll-margin-top:var(--top);scroll-snap-align:center;cursor:pointer}
        .card:focus-visible{outline:2px solid var(--text);outline-offset:4px}

        /* Native scroll-driven animation — runs on the compositor, exactly synced to the same
           viewport geometry the browser uses for snapping, so there's no JS/CSS timing mismatch.
           Falls back to the JS-driven inline styles (see WorkStack) in browsers without support. */
        @supports (animation-timeline: view()) {
          .card{
            animation: card-focus linear both;
            animation-timeline: view();
            animation-range: cover 0% cover 100%;
          }
        }
        @keyframes card-focus{
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50%      { transform: scale(1);   opacity: 1;   }
        }
        .card-media{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;border-bottom:1px solid rgba(26,26,24,.07)}
        .card-img-wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .card-img{width:100%;height:100%;display:block}
        .af{background:#E5E1D9}
        .af-anim{position:relative;width:84%;aspect-ratio:16/10}
        .card-tags{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;font-size:12.5px;line-height:1.4;color:var(--text-mid);margin-bottom:6px}
        .card-tags span{display:inline-flex;align-items:center;gap:10px}
        .card-tags i{width:5px;height:5px;background:#bdb8b0;flex:none}
        .card-badge{position:absolute;top:16px;left:16px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;background:rgba(245,242,238,.95);color:#1A1A18;padding:5px 10px;border-radius:20px}

        .card-body{padding:20px 2px 0;container-type:inline-size}
        .card-company{font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-mid);display:inline-flex;align-items:center;gap:4px;margin-bottom:8px}
        /* Active-card indicator — brand-colored per card (set inline via c.color), dimmed until
           this card is the one nearest viewport-center */
        .gbullet{display:inline-block;width:18px;height:18px;flex-shrink:0;opacity:.4;transition:opacity .2s}
        .gbullet.is-active{opacity:1}
        .card-title{font-size:clamp(15px,2.7cqw,24px);font-weight:400;line-height:1.2;letter-spacing:-.02em;margin-bottom:8px}
        .card-desc{max-width:560px;font-size:12.5px;line-height:1.6;color:var(--text-mid);margin-bottom:14px}
        .card-metrics{display:flex;gap:20px;padding-top:12px;border-top:1px solid rgba(26,26,24,.08)}
        .metric{display:flex;flex-direction:column;gap:2px}
        .card-val{font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:var(--text)}
        .card-label{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-dim)}

        /* ── Case study template: hero, then the home page's own .page grid reused for a
           TOC rail + placeholder content sections — same coordinate system, no new layout. ── */
        .case-hero{max-width:1280px;margin:0 auto;padding:calc(var(--top) + 24px) 60px 40px}
        .case-title{font-size:clamp(28px,3.4vw,44px);font-weight:400;line-height:1.1;letter-spacing:-.02em;margin:14px 0 12px;max-width:760px}
        .case-desc{font-size:15px;line-height:1.6;color:var(--text-mid);max-width:640px;margin-bottom:20px}
        .case-hero .card-metrics{margin-bottom:28px}
        .case-hero-media{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--border)}

        .case-toc{display:flex;flex-direction:column;gap:12px;margin-top:14px}
        .case-sections{display:flex;flex-direction:column;gap:56px;padding-bottom:60px}
        .case-section{display:flex;flex-direction:column;gap:12px}
        .case-section-title{font-size:20px;font-weight:400;letter-spacing:-.01em;scroll-margin-top:var(--top)}
        .case-placeholder{width:100%;height:180px}
        .case-placeholder.short{height:90px}

        @media (max-width:860px){
          .case-hero{padding:calc(var(--top) + 16px) 24px 32px}
        }

        /* ── Archive: temporary wireframe bento grid ── */
        /* --gap drives the grid gap AND the outer page margin, so spacing is uniform everywhere */
        .archive-page{
          --gap:8px;
          width:100%;
          min-height:100vh;
          box-sizing:border-box;
          padding:var(--top) var(--gap) var(--gap);
        }
        .bento{display:flex;align-items:flex-start;gap:var(--gap)}
                .bento-col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:var(--gap)}
        .bento-tile{position:relative;margin:0;flex:none;width:100%;overflow:hidden;background:rgba(26,26,24,.06);display:flex;align-items:center;justify-content:center}
        .bento-anim{position:absolute;inset:0}
        .bento-img{display:block;width:100%;height:100%}
        .bento-img.is-matte{width:auto;height:auto;max-width:86%;max-height:86%}
        .bento-tile::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.5);opacity:0;transition:opacity .3s ease;pointer-events:none}
        .bento-tile:hover::after{opacity:1}
        .bento-tile.is-plain::after{display:none}
        .bento-tile.is-link{cursor:pointer}
        .bento-nda{position:absolute;inset:0;background:#1A1A18;display:flex;align-items:center;justify-content:center}
        .bento-nda span{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,242,238,.5)}
        .bento-label{position:absolute;left:18px;bottom:16px;right:18px;z-index:1;display:flex;flex-direction:column;gap:3px;color:#fff;opacity:0;transform:translateY(4px);transition:opacity .3s ease, transform .3s ease;pointer-events:none}
        .bento-tile:hover .bento-label{opacity:1;transform:none}
        .bento-tag{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.7)}
        .bento-title{font-size:14px;font-weight:600;letter-spacing:-.01em}

        /* ── About: clean and calm, same width as the Work page ── */
        .about-page{max-width:1160px;margin:0 auto;padding:var(--top) 60px 96px;display:flex;flex-direction:column;gap:64px}
        .wf-block{background:rgba(26,26,24,.06);border:1px solid var(--border)}
        .wf-divider{height:1px;background:var(--border)}

        .about-name{font-size:32px;font-weight:400;letter-spacing:-.02em;line-height:1.1}
        .about-tagline{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim)}
        .about-bio{font-size:16px;line-height:1.75;color:var(--text-mid);max-width:620px}

        /* plain resume rows — company, title, date. nothing else. */
        .ad{position:fixed;inset:0;z-index:4000;background:rgba(26,26,24,.5);display:flex;align-items:center;justify-content:center;padding:32px 16px;animation:adIn .25s ease}
        @keyframes adIn{from{opacity:0}to{opacity:1}}
        .ad-dialog{width:min(820px,100%);max-height:100%;overflow-y:auto;background:var(--bg);border:1px solid rgba(26,26,24,.12);padding:32px 36px 40px;display:flex;flex-direction:column;gap:20px;animation:adUp .3s ease}
        @keyframes adUp{from{transform:translateY(12px)}to{transform:none}}
        .ad-head{display:flex;justify-content:space-between;align-items:center}
        .ad-close{background:none;border:none;padding:0;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text)}
        .ad-tag{display:flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim)}
        .ad-tag i{width:6px;height:6px;background:#1A1A18}
        .ad-title{font-size:clamp(24px,3vw,32px);font-weight:400;letter-spacing:-.025em;line-height:1.15;margin-top:4px}
        .ad-meta{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.02em;color:var(--text-dim)}
        .ad-desc{font-size:16px;line-height:1.7;color:var(--text-mid);max-width:600px}
        .ad-links{display:flex;gap:24px;flex-wrap:wrap;font-size:14px;font-weight:600}
        .ad-links a{color:var(--text);text-decoration:none;border-bottom:1px solid rgba(26,26,24,.3)}
        .ad-img{display:block;width:100%;height:auto}
        .ad-row{display:grid;gap:12px;align-items:start}
        .ad-video{position:relative;width:100%;aspect-ratio:16/9;background:#000}
        .ad-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
        @media (max-width:860px){.ad-dialog{padding:24px 20px 28px}}
        .about-sec{display:grid;grid-template-columns:200px minmax(0,1fr);gap:64px}
        .kind-list{display:flex;flex-direction:column;gap:40px}
        .kind blockquote{font-size:16px;line-height:1.7;color:var(--text)}
        .kind-band{position:relative;z-index:1;margin-top:80px;background:#EDE8E0;border-top:1px solid rgba(26,26,24,.1);scroll-snap-align:start;scroll-margin-top:0}
        .kind-sec{max-width:1280px;padding:96px 60px 104px;display:grid;grid-template-columns:260px 1fr;gap:48px;align-items:start}
        .kind-head{display:flex;flex-direction:column;gap:8px}
        .kind-sub{font-size:13px;line-height:1.5;color:var(--text-mid)}
        .kind-title{font-size:20px;font-weight:400;letter-spacing:-.015em;line-height:1.2;color:var(--text)}
        .kind-sec .kind-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
        /* the cards share the work cards' tilt and sit on the section like paper on a desk */
        .kind-sec .kind{perspective:900px}
        .kind-in{translate:0 0;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .6s cubic-bezier(.34,1.4,.64,1),translate .6s cubic-bezier(.34,1.56,.64,1);height:100%;background:#FBFAF7;border:1px solid rgba(26,26,24,.1);padding:28px;display:flex;flex-direction:column;gap:20px}
        .kind-quote{display:block;font-size:44px;line-height:.6;height:22px;font-weight:600;color:#00A86B}
        .kind-sec .kind blockquote{font-size:14px;line-height:1.7;color:var(--text);flex:1}
        .kind-sec .kind figcaption{margin:0;display:flex;align-items:center;gap:16px;flex-wrap:nowrap;color:inherit}
        .kind-pic{width:52px;height:52px;flex-shrink:0;object-fit:cover;display:grid;place-items:center;background:#00A86B;color:#fff;font-size:20px;font-weight:600;box-shadow:4px 4px 0 #00A86B;transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s cubic-bezier(.34,1.56,.64,1)}
        .kind-sec .kind:hover .kind-in{translate:0 -5px}
        .kind-sec .kind:hover .kind-pic{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #00A86B}
        .kind-who{display:flex;flex-direction:column;gap:3px;font-family:'Open Sauce Sans',sans-serif;font-size:13px;letter-spacing:0;color:var(--text-mid)}
        .kind-sec .kind-who strong{color:var(--text);font-weight:600;font-size:15px}
        @media (hover:none),(prefers-reduced-motion:reduce){.kind-in,.kind-sec .kind:hover .kind-pic{transform:none!important;translate:none!important}}
        @media (max-width:1100px){.kind-sec{grid-template-columns:1fr;gap:28px}}
        @media (min-width:1500px){.kind-sec{max-width:1400px;grid-template-columns:320px 1fr;gap:80px}}
        @media (min-width:1900px){.kind-sec{max-width:1560px;grid-template-columns:360px 1fr;gap:96px}}
        .kind figcaption{margin-top:14px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.04em;color:var(--text-dim);display:flex;gap:10px;flex-wrap:wrap}
        .kind figcaption strong{color:var(--text);font-weight:500}
        /* About */
        /* About: the intro sits on a feathered square layered over a vivid glyph field */
        .heroband{position:relative;width:100vw;margin-left:calc(50% - 50vw);margin-top:calc(-1 * var(--top));padding:calc(var(--top) + 24px) 60px 150px;min-height:780px}
        .heroband::before{content:'';position:absolute;left:0;top:0;width:100%;height:110px;z-index:1;background:linear-gradient(to bottom,var(--bg) 40%,transparent);pointer-events:none}
        .heroband-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;-webkit-mask-image:linear-gradient(to bottom,#000 72%,transparent);mask-image:linear-gradient(to bottom,#000 72%,transparent)}
        .heroband-in{position:relative;z-index:2;max-width:1040px;margin:0 auto}
        .heroband-hint{position:absolute;right:60px;bottom:120px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text);background:var(--bg);padding:6px 12px;pointer-events:none;transition:opacity .6s ease}
        .heroband-hint.is-gone{opacity:0}
        /* the frosted square: the portrait and text sit together, centred in it, with room to breathe */
        .about-panel{position:relative;display:flex;justify-content:center;align-items:flex-start;gap:56px;width:max-content;max-width:calc(100% + 120px);margin:0 auto;padding:140px 130px;--feather:84px}
        .about-frost{position:absolute;inset:0;background:transparent;-webkit-backdrop-filter:blur(9px) saturate(.95);backdrop-filter:blur(9px) saturate(.95);
          -webkit-mask-image:linear-gradient(to right,transparent,#000 var(--feather),#000 calc(100% - var(--feather)),transparent),linear-gradient(to bottom,transparent,#000 var(--feather),#000 calc(100% - var(--feather)),transparent);
          -webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent,#000 var(--feather),#000 calc(100% - var(--feather)),transparent),linear-gradient(to bottom,transparent,#000 var(--feather),#000 calc(100% - var(--feather)),transparent);mask-composite:intersect}
        .about-panel>*:not(.about-frost){position:relative;z-index:1}
        .about-avatar{flex:none;width:112px;height:112px;margin-top:4px;border-radius:50%;overflow:hidden;background:rgba(26,26,24,.06)}
        .about-avatar img{display:block;width:100%;height:100%;object-fit:cover;object-position:48% 50%;transform:scale(1.4);transform-origin:48% 50%}
        .about-copy{display:flex;flex-direction:column;gap:16px;max-width:560px}
        .about-copy p{font-size:15px;line-height:1.75;color:var(--text)}
        .about-sign{font-family:'thermal-variable','Open Sauce Sans',sans-serif;font-size:22px;letter-spacing:-.01em;color:var(--text);margin-top:4px}
        /* a divider between the CV-style sections (none above the first) */
        .about-sec+.about-sec{border-top:1px solid #1A1A18;padding-top:24px}
        .places-sec{display:flex;flex-direction:column;gap:22px;border-top:1px solid #1A1A18;padding-top:28px}
        .places-title{font-family:'thermal-variable','Open Sauce Sans',sans-serif;font-weight:400;font-size:22px;letter-spacing:-.02em;line-height:1.1;color:var(--text)}
        .places{display:flex;flex-direction:column;gap:22px}
        .map-box{position:relative;width:100%}
        .map-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
        .map-land{fill:#DCD5C8;stroke:#DCD5C8;stroke-width:5;stroke-linejoin:round}
        .map-pin{position:absolute;width:0;height:0}
        .map-dot{position:absolute;left:-6px;top:-6px;width:12px;height:12px;padding:0;border:0;border-radius:50%;background:#1A1A18;box-shadow:0 0 0 3px rgba(245,242,238,.9);cursor:pointer;transition:opacity .2s ease}
        .map-dot::after{content:'';position:absolute;inset:-9px}
        .map-bloom{position:absolute;left:-15px;top:-15px;line-height:0;opacity:0;transition:opacity .2s ease;pointer-events:none}
        .map-pin.is-on{z-index:6}
        .map-pin.is-on .map-dot{opacity:0}
        .map-pin.is-on .map-bloom{opacity:1}
        /* the place's photo opens beside the pin, like the intro photos on home */
        .map-peek{position:absolute;left:20px;top:0;translate:0 -50%;width:160px;margin:0;padding:5px 5px 10px;background:#fff;border:1px solid rgba(26,26,24,.1);box-shadow:0 14px 32px -14px rgba(26,26,24,.4);opacity:0;scale:.9;transform-origin:left center;pointer-events:none;transition:opacity .18s ease,scale .22s cubic-bezier(.2,.8,.3,1)}
        .map-pin.is-flip .map-peek{left:auto;right:20px;transform-origin:right center}
        .map-pin.is-on .map-peek{opacity:1;scale:1}
        .map-peek-img{aspect-ratio:4/5;overflow:hidden;background:rgba(26,26,24,.05);display:flex;align-items:center;justify-content:center}
        .map-peek-img img{display:block;width:100%;height:100%;object-fit:cover}
        .map-peek-flower{line-height:0}
        .map-peek figcaption{display:flex;flex-direction:column;gap:2px;padding:8px 4px 0}
        .map-peek b{font-family:'thermal-variable','Open Sauce Sans',sans-serif;font-weight:400;font-size:16px;letter-spacing:-.015em;line-height:1.15;color:var(--text)}
        .map-peek figcaption span{font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-mid)}
        .place-names{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px 22px}
        .place-names button{display:inline-flex;align-items:center;gap:8px;padding:0;background:none;border:0;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-mid);transition:color .2s ease}
        .place-names button:hover,.place-names button.is-on{color:var(--text)}
        .place-names em{font-style:normal;color:#fff;background:#1A1A18;padding:1px 6px}
        /* a divider between the CV-style sections (none above the first) */
        .about-sec+.about-sec{border-top:1px solid #1A1A18;padding-top:24px}
        @media (max-width:860px){
          .heroband{padding:calc(var(--top) + 24px) 24px 120px;min-height:0}
          .about-panel{flex-direction:column;align-items:flex-start;gap:22px;width:auto;max-width:none;margin:0 -24px;padding:80px 24px;--feather:36px}
          .about-avatar{width:96px;height:96px}
          .heroband-hint{display:none}
        }
        .about-label{display:flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-mid);align-self:start;padding-top:3px}
        .about-label i,.about-dot{display:inline-block;width:6px;height:6px;flex-shrink:0}
        .about-label i{background:#1A1A18}
        .about-dot{align-self:center}
        .about-list{display:flex;flex-direction:column}
        .about-item{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:16px 0;border-bottom:1px solid rgba(26,26,24,.08)}
        .about-item:first-child{padding-top:0}
        .about-item:last-child{border-bottom:none}
        .about-item-main{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
        .about-item-company{font-size:15px;font-weight:600;color:var(--text)}
        .about-item-role{font-size:15px;color:var(--text)}
        .about-item-date{font-family:'DM Mono',monospace;font-size:11px;color:var(--text-mid);white-space:nowrap;flex-shrink:0}

        @media (max-width:860px){
          .about-page{padding:72px 24px 60px}
          .floating-nav{top:24px;left:24px}
              .about-item{flex-direction:column;gap:4px}
          .about-sec{grid-template-columns:1fr;gap:20px}
          }

        @media (max-width:860px){
          .archive-page{--gap:6px;padding-top:72px}
        }

        .site-footer{border-top:1px solid var(--border);padding:56px 60px 32px;display:flex;flex-direction:column;gap:16px}
        .site-footer.snap-end{scroll-snap-align:end}
        .footer-msg{font-size:14px;line-height:1.6;color:var(--text);max-width:420px}
        .footer-smile{display:inline-block;font-family:'DM Mono',monospace;transform:rotate(90deg);transition:transform .4s cubic-bezier(.2,.7,.2,1)}
        .footer-smile::before{content:':)'}
        .footer-msg:hover .footer-smile{transform:rotate(90deg) scale(1.25)}
        .footer-msg:hover .footer-smile::before{content:':D'}
        .footer-links{display:flex;gap:24px;font-size:13px;font-weight:600}
        .footer-links a,.footer-copy{color:var(--text);text-decoration:none;background:none;border:0;padding:0;font:inherit;cursor:pointer}
        .footer-name{font-size:12px;color:var(--text-dim)}

        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:rgba(26,26,24,.12);border-radius:2px}

        .loader{position:fixed;inset:0;z-index:5000;width:100vw;height:100vh;display:block}
        .loader-hint{position:fixed;left:0;right:0;bottom:12vh;z-index:5001;display:flex;justify-content:center;pointer-events:none;animation:loaderHint .6s ease .5s both}
        .loader-hint span{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text);background:var(--bg);padding:8px 14px}
        @keyframes loaderHint{from{opacity:0}to{opacity:1}}

        @media (max-width: 860px){
          html{scroll-snap-type:none}
          .page{grid-template-columns:1fr;padding:72px 24px 40px}
          .kind-band{margin-top:64px}
          .kind-sec{grid-template-columns:1fr;gap:24px;padding:64px 24px 72px}
          .kind-sec .kind-list{grid-template-columns:1fr}
          .rail{align-items:center}
          .intro-text{max-width:520px;font-size:15px}
          .site-footer{padding:48px 24px 28px}
          .rail{position:relative;top:0;margin-bottom:32px}
          .stack{padding-top:0;gap:24px}
        }
      `}</style>

      {loading && <Loader onDone={finishLoading} quiet={quietBg} />}
      <CardCursor />

      {!loading && <BackgroundField quiet={quietBg} />}
      <SoundToggle />
      <PeekCard />

      <div className="floating-nav">
        <PageNav page={page} goHome={goHome} goArchive={goArchive} goAbout={goAbout} goHandmade={goHandmade} />
      </div>

      {page === 'home' && (
        <div className="page">
          <SideRail hot={CARDS[activeIdx] && CARDS[activeIdx].company} />
          <WorkStack activeIdx={activeIdx} onActiveChange={setActiveIdx} onOpenCase={goCase} />
        </div>
      )}

      {page === 'home' && (
        <section className="kind-band" aria-labelledby="kind-title">
          <div className="kind-sec">
            <div className="kind-head">
              <h2 id="kind-title" className="kind-title">Kind words <span className="footer-smile" aria-hidden="true" /></h2>
              <p className="kind-sub">From teammates at Skillshare.</p>
            </div>
            <div className="kind-list">
              {KIND_WORDS.map((q) => (
                <figure className="kind" key={q.name} onPointerMove={tiltCard} onPointerLeave={untiltCard}>
                  <div className="kind-in">
                    <span className="kind-quote" aria-hidden="true">“</span>
                    <blockquote>{q.text}</blockquote>
                    <figcaption>
                      {q.photo ? <img className="kind-pic" src={q.photo} alt="" /> : <span className="kind-pic" aria-hidden="true">{q.name[0]}</span>}
                      <span className="kind-who"><strong>{q.name}</strong>{q.role}</span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {page === 'case' && caseIdx === 0 && <ScrollReveal><AdobeTooling onNext={() => goCase(1)} /></ScrollReveal>}
      {page === 'case' && caseIdx === 1 && <ScrollReveal><AdobeVision onNext={() => goCase(2)} /></ScrollReveal>}
      {page === 'case' && caseIdx === 2 && <ScrollReveal><ClassDiscovery onNext={() => goCase(3)} /></ScrollReveal>}
      {page === 'case' && caseIdx === 3 && <ScrollReveal><Onboarding onNext={() => goCase(0)} /></ScrollReveal>}
      {page === 'aac' && <ScrollReveal><AACDevice onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'gmaps' && <ScrollReveal><GoogleMaps onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'zuora' && <ScrollReveal><Zuora onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'colorful' && <ScrollReveal><Colorful onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'kidomi' && <ScrollReveal><Kidomi onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'usability' && <ScrollReveal><UsabilityStudy onNext={() => goArchiveCase('archive')} /></ScrollReveal>}

      {page === 'archive' && (
      /* ── Archive: explorations gallery ── */
      <section id="archive" className="archive archive-page">
        <ArchiveGrid modalSlug={modalSlug} onOpenModal={(slug) => nav('#/experimentation/' + slug)} onCloseModal={() => nav('#/experimentation')} onOpenPage={goArchiveCase} />

      </section>
      )}

      {page === 'handmade' && (
      /* ── Handmade: the Tinkering grid, without links or hover text ── */
      <section id="handmade" className="archive archive-page">
        <StudioGrid />
      </section>
      )}

      {page === 'lab' && Lab3D && <Suspense fallback={null}><Lab3D /></Suspense>}

      {page === 'about' && (
      /* ── About: clean, resume-style — company / title / date rows, same width as the Work page ── */
      <section id="about" className="about-page">
        <HeroField>
          <div className="heroband-in"><div className="about-panel">
            <span className="about-frost" aria-hidden="true" />
            <div className="about-avatar"><img src={PROFILE_IMG} alt="Jayden Kang" draggable="false" /></div>
            <div className="about-copy">
              {ABOUT_STORY.map((text, i) => <p key={i}>{text}</p>)}
              <span className="about-sign">Jayden</span>
            </div>
          </div></div>
        </HeroField>

        <div className="about-sec">
        <span className="about-label"><i />Experience</span>
        <div className="about-list">
          {[
            { company: 'Adobe', role: 'Experience Design Intern, Agents Team', date: 'Jun – Sep 2026' },
            { company: 'Skillshare', role: 'Associate Product Designer', date: 'Apr 2025 – Jun 2026' },
            { company: 'Skillshare', role: 'Product Design Intern', date: 'Sep – Dec 2024' },
            { company: 'Zuora', role: 'UX Design Intern', date: 'May – Sep 2023' },
            { company: 'Hiossen', role: 'UX Design Intern', date: 'May – Jun 2022' },
          ].map((row, i) => (
            <div className="about-item" key={i}>
              <div className="about-item-main">
                <i className="about-dot" style={{ background: ABOUT_DOT[row.company] || "rgba(26,26,24,.22)" }} /><span className="about-item-company">{row.company}</span>
                <span className="about-item-role">{row.role}</span>
              </div>
              <span className="about-item-date">{row.date}</span>
            </div>
          ))}
        </div>
        </div>

        <div className="about-sec">
        <span className="about-label"><i />Education</span>
        <div className="about-list">
          {[
            { company: 'University of Washington', role: 'MS, Human Centered Design & Engineering', date: 'Sep 2025 – Dec 2027' },
            { company: 'University of Southern California', role: 'BFA, Design', date: 'Aug 2020 – May 2024' },
          ].map((row, i) => (
            <div className="about-item" key={i}>
              <div className="about-item-main">
                <i className="about-dot" style={{ background: ABOUT_DOT[row.company] || "rgba(26,26,24,.22)" }} /><span className="about-item-company">{row.company}</span>
                <span className="about-item-role">{row.role}</span>
              </div>
              <span className="about-item-date">{row.date}</span>
            </div>
          ))}
        </div>
        </div>

        <div className="places-sec">
          <h2 className="places-title">Places I've called home</h2>
          <Places />
        </div>
      </section>
      )}

      <SiteFooter snapEnd={page === 'home'} />
    </>
  );
}
