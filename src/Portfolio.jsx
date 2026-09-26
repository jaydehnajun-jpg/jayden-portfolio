import { useState, useEffect, useRef, useCallback } from "react";
import ClassDiscovery from "./ClassDiscovery.jsx";
import Onboarding from "./Onboarding.jsx";
import AACDevice from "./AACDevice.jsx";
import Adobe from "./Adobe.jsx";
import GoogleMaps from "./GoogleMaps.jsx";
import Zuora from "./Zuora.jsx";
import Colorful from "./Colorful.jsx";
import Kidomi from "./Kidomi.jsx";
import UsabilityStudy from "./UsabilityStudy.jsx";

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
        el.classList.add('rv');
        el.style.transitionDelay = Math.min(i, 4) * 90 + 'ms';
        io.observe(el);
      });
    });
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
}

const ADOBE_IMG = "/assets/Adobe/claudexadobe.webp";
const SKILLSHARE_VID = "/assets/ClassDiscovery/classdiscoveryvid.mp4";
const ONBOARDING_VID = "/assets/Onboarding/onboardingvid.mp4";

const BIO = "Jayden is a product designer who previously interned at Adobe on the Agents team, designing gen AI experiences, and worked as an associate product designer at Skillshare. Studied at USC and the University of Washington.";
const NAME = 'Jayden';
const NAME_COLOR = '#1A1A18';
const BRAND_COLORS = { Adobe: '#E3000F', Skillshare: '#00A86B', USC: '#990000', 'University of Washington': '#4B2E83' };
const BRAND_NAMES = Object.keys(BRAND_COLORS);
const HIGHLIGHT_COLORS = { [NAME]: NAME_COLOR, ...BRAND_COLORS };
const HIGHLIGHTS = Object.keys(HIGHLIGHT_COLORS);

function Bio({ text }) {
  const pattern = new RegExp(`(${HIGHLIGHTS.join('|')})`, 'g');
  return (
    <p className="intro-text">
      {text.split(pattern).map((chunk, i) =>
        HIGHLIGHTS.includes(chunk) ? (
          <span key={i} className="brand">
            <span className="pixel-bullet is-active" style={{ background: HIGHLIGHT_COLORS[chunk] }} />
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
    title: 'Designing for Gen AI Experiences',
    desc: "Experience Design intern on Adobe's Agents team. Worked on how generative AI agents integrate with third-party tools and keep their behavior consistent and predictable. Details under NDA.",
    media: <Media src={ADOBE_IMG} fit="contain" bg="#EA1001" />,
  },
  {
    company: 'Skillshare', color: '#00A86B',
    title: 'Class Discovery Redesign',
    desc: 'Progressive disclosure redesign grounded in a 2,277-user survey and 183-person Maze test. Rolled out to 100% of users.',
    metrics: [{ val: '+47%', label: 'Subscriptions' }, { val: '+5%', label: 'CTR' }],
    media: <MediaVideo src={SKILLSHARE_VID} fit="cover" bg="#F5F2EE" />,
  },
  {
    company: 'Skillshare', color: '#00A86B',
    title: 'Onboarding & Member Home',
    desc: 'Led activation and retention redesign as sole designer, including an AI-assisted design system built with Figma MCP.',
    metrics: [{ val: '+4.3pp', label: 'Retention' }, { val: '−26%', label: 'Time-to-Action' }],
    media: <MediaVideo src={ONBOARDING_VID} fit="cover" bg="#C2CBBC" />,
  },
  {
    company: 'UW RAISE × Amazon', color: '#4B2E83',
    title: 'AI AAC Device',
    desc: 'Schedule-first AI communication tool for autistic children. Built with v0.dev, validated with 19 caregivers, presented at Amazon AI conference.',
    metrics: [{ val: '19', label: 'Caregivers' }, { val: '1st', label: 'AI Conference' }],
    media: <Media src="/assets/AAC/aacmain.png" fit="contain" bg="#fff" />,
  },
];

// ── Primary page nav — Work / Archive / About, identical on every page (current page bolded,
// not omitted). Lives inside the rail on the home page, in the slot the "Selected Work" TOC used
// to occupy; floats unobtrusively (no bar chrome) on the single-column Archive/About pages. ──
function PageNav({ page, goHome, goArchive, goAbout }) {
  return (
    <nav className="rail-nav" aria-label="Primary">
      <a href="#work-0" className={`rail-nav-link pixel-underline${page === 'home' || page === 'case' ? ' is-current' : ''}`} onClick={goHome('work-0')}>Work</a>
      <a href="#archive" className={`rail-nav-link pixel-underline${page === 'archive' || ARCHIVE_PAGE_KEYS.includes(page) ? ' is-current' : ''}`} onClick={goArchive}>Archive</a>
      <a href="#about" className={`rail-nav-link pixel-underline${page === 'about' ? ' is-current' : ''}`} onClick={goAbout}>About</a>
    </nav>
  );
}

// ── Left column: just the intro now — primary nav lives in a fixed-position element rendered
// once at the Portfolio level (see .floating-nav) so it sits at the exact same screen position
// on every page, rather than living inside this page-specific column. ──
function SideRail() {
  return (
    <aside className="rail">
      <Bio text={BIO} />
    </aside>
  );
}

// ── Right column: scroll-driven stack of cards. Each card's company label carries a pixel-bullet
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
          key={i} id={`work-${i}`} ref={el => cardRefs.current[i] = el} className="card"
          role="link" tabIndex={0} aria-label={`${c.company}: ${c.title}`}
          onClick={() => onOpenCase(i)}
          onKeyDown={(e) => { if (e.key === 'Enter') onOpenCase(i); }}
        >
          <div className="card-media">
            {c.media}
            {c.current && <span className="card-badge">Currently</span>}
          </div>
          <div className="card-body">
            <span className="card-company"><span className={`pixel-bullet${i === activeIdx ? ' is-active' : ''}`} style={{ background: c.color }} />{c.company}</span>
            <h3 className="card-title">{c.title}</h3>
            <p className="card-desc">{c.desc}</p>
            {c.metrics && (
              <div className="card-metrics">
                {c.metrics.map((m, j) => (<div key={j} className="metric"><span className="card-val">{m.val}</span><span className="card-label">{m.label}</span></div>))}
              </div>
            )}
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
        <span className="card-company"><span className="pixel-bullet is-active" style={{ background: card.color }} />{card.company}</span>
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
                className="rail-nav-link pixel-underline"
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
  [
    {
      src: 'banilathumb.jpeg', a: 1, title: 'Banila Co', tag: 'Branded Content', slug: 'banila-co',
      meta: 'June 2021 · Internship at Miping Plan, an advertising agency · 2 marketers, 1 designer',
      desc: 'Banila Co is a popular Korean cosmetics brand. During my internship, I created assets and branded content for their Instagram promotion.',
      assets: [
        '/assets/Archive/banila/661fe36f3c570e7b602920e9_banila mock.png',
        ['/assets/Archive/banila/634f6e234ba9485bfbb39246_FB253-p-800.png', '/assets/Archive/banila/634f6e2345e80b22d648da45_FB248-p-800.png'],
        ['/assets/Archive/banila/6625807568d8c074d183d28d_FB332-p-800.png', '/assets/Archive/banila/662580758fa37fd8f5c3143e_FB375-p-800.png'],
        ['/assets/Archive/banila/66258075d22d28967a048678_FB425-p-800.png', '/assets/Archive/banila/634f6e23ac1ff22262f52579_FB249 copy-p-800.png'],
        ['/assets/Archive/banila/66258075dbfdb6e991785b5f_FB349-p-800.png', '/assets/Archive/banila/634f6e234c5871feee154ae6_FB377-p-800.png'],
      ],
    },
  ],
];

const hasDetail = (item) => !!(item.page || item.slug || item.desc || (item.links && item.links.length) || (item.assets && item.assets.length));

function BentoTile({ item, onOpen }) {
  const open = hasDetail(item);
  return (
    <figure
      className={`bento-tile${open ? ' is-link' : ''}`}
      style={{ aspectRatio: item.a, background: item.matte }}
      onClick={open ? () => onOpen(item) : undefined}
      role={open ? 'button' : undefined}
      tabIndex={open ? 0 : undefined}
      onKeyDown={open ? (e) => { if (e.key === 'Enter') onOpen(item); } : undefined}
    >
      {item.nda ? (
        <div className="bento-nda"><span>Under NDA</span></div>
      ) : (
      <img
        src={item.src.startsWith('/') ? item.src : `/assets/Archive/${item.src}`} alt={item.title} loading="lazy"
        className={`bento-img${item.matte ? ' is-matte' : ''}`}
      />
      )}
      <figcaption className="bento-label">
        <span className="bento-tag">{item.tag}</span>
        <span className="bento-title">{item.title}</span>
      </figcaption>
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
            {m.map((f) => <img key={f} src={archiveSrc(f)} alt="" className="ad-img" loading="lazy" />)}
          </div>
        ) : (
          <img key={m} src={archiveSrc(m)} alt={i === 0 ? item.title : ''} className="ad-img" loading="lazy" />
        ))}
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

  const items = ARCHIVE_ROWS.flat();
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

// ── About: profile photo and hobby strip. Web-sized copies live in public/assets/About/web/ (the
// originals next to them are several MB each). Photos keep their own aspect ratio. To add more,
// drop a resized file in web/ and add its name to HOBBY_PHOTOS. ──
const ABOUT_DOT = { Adobe: '#E3000F', Skillshare: '#00A86B', 'University of Washington': '#4B2E83', 'University of Southern California': '#990000' };
const PROFILE_IMG = '/assets/About/web/profile.jpg';
// A few pottery, painting and baking photos in one calm, static row. Widths follow each photo's
// aspect ratio (`a`) so every photo is the same height and none are cropped.
const HOBBY_PHOTOS = [
  { f: 'pottery1', a: 1 }, { f: 'drawing2', a: 800 / 591 }, { f: 'baking1', a: 1452 / 1464 },
  { f: 'pottery3', a: 1 }, { f: 'drawing1', a: 1 }, { f: 'baking3', a: 1466 / 1280 },
];

function HobbyRow() {
  return (
    <div className="hobby-row" aria-label="Pottery, painting and baking">
      {HOBBY_PHOTOS.map(({ f, a }) => (
        <img key={f} src={`/assets/About/web/${f}.jpg`} alt="" className="hobby-img" style={{ flexGrow: a, aspectRatio: a }} loading="lazy" />
      ))}
    </div>
  );
}

const LOADER_IMG = "/assets/Loader/mosaic.webp";

// ── Loading curtain: a pixel grid sampled from the mosaic image (one flat color per cell,
// read via canvas — not a stretched photo crop), each cell fading out to reveal the page beneath,
// starting at the center and opening in a loose six-petal flower shape. ──
function Loader({ onDone }) {
  const [grid, setGrid] = useState(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const size = 22; // px per pixel cell — fine enough for the flower silhouette to read
    const cols = Math.ceil(window.innerWidth / size);
    const rows = Math.ceil(window.innerHeight / size);
    let cancelled = false;
    let timer = null;

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;

      // Crop the source image to the grid's aspect ratio (cover-fit) before downsampling,
      // so each canvas pixel we sample is a true average of that cell's region — not stretched.
      const gridRatio = cols / rows;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let sx, sy, sw, sh;
      if (imgRatio > gridRatio) {
        sh = img.naturalHeight;
        sw = sh * gridRatio;
        sx = (img.naturalWidth - sw) / 2;
        sy = 0;
      } else {
        sw = img.naturalWidth;
        sh = sw / gridRatio;
        sx = 0;
        sy = (img.naturalHeight - sh) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const { data } = ctx.getImageData(0, 0, cols, rows);

      const hold = 400;      // let the mosaic sit for a beat before it starts to go
      const maxDelay = 1500; // spread of the dissolve across the whole screen
      const duration = 700;  // each cell fades slowly rather than snapping off
      const colors = [];
      for (let i = 0; i < cols * rows; i++) {
        const o = i * 4;
        colors.push(`rgb(${data[o]},${data[o + 1]},${data[o + 2]})`);
      }

      // The dissolve opens from the center outward, and its edge is a six-petal flower rather
      // than a circle: each cell's distance from the center is divided by a petal factor that
      // swells and dips with its angle, so the clearing blooms out in six soft lobes. Jitter
      // keeps the edge loose, so the shape is only hinted at.
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const raw = [];
      let maxT = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const dx = (col + 0.5) * size - cx, dy = (row + 0.5) * size - cy;
          const petal = 1 + 0.3 * Math.cos(6 * Math.atan2(dy, dx) + 0.5);
          const t = Math.hypot(dx, dy) / petal;
          raw.push(t);
          if (t > maxT) maxT = t;
        }
      }
      const delays = raw.map((t) => hold + (t / maxT) * maxDelay + Math.random() * 140);

      setGrid({ cols, rows, colors, delays });
      timer = setTimeout(() => onDoneRef.current(), hold + maxDelay + duration + 200);
    };
    img.src = LOADER_IMG;

    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  if (!grid) return <div className="loader" style={{ backgroundImage: `url(${LOADER_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />;

  return (
    <div className="loader" style={{ gridTemplateColumns: `repeat(${grid.cols},1fr)`, gridTemplateRows: `repeat(${grid.rows},1fr)` }}>
      {grid.colors.map((c, i) => (
        <div key={i} className="loader-cell" style={{ background: c, animationDelay: `${grid.delays[i]}ms` }} />
      ))}
    </div>
  );
}

const TRAIL_COLORS = ['#E3000F', '#00A86B', '#4B2E83', '#990000'];

// ── Pixel trail left in the page background as the cursor moves — visible squares snapped to a
// grid, each remembering its own creation time and fading independently. Because they fade purely
// on their own age (not a shared canvas-wide wash), the oldest ones — the ones drawn first —
// always reach zero opacity first: the trail dissolves in the order it was made, not all at once.
// Runs on its own canvas + rAF loop with zero React state, so it never touches Portfolio's render
// cycle. Nothing shows until the cursor has been there. ──
function PixelTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cell = 14; // grid size
    const mark = cell; // fills the whole cell — no gap between adjacent pixels
    const fadeMs = 550; // how long a single pixel takes to dissolve, from the moment it's drawn
    const peakAlpha = 0.22; // kept low — this is ambient texture, not the thing to look at
    let raf = null;
    let last = { col: -1, row: -1 };
    let mouse = { x: -1000, y: -1000 };
    let colorIdx = 0;
    let marks = []; // { col, row, color, createdAt } — in creation order

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const loop = () => {
      const now = performance.now();

      const col = Math.floor(mouse.x / cell);
      const row = Math.floor(mouse.y / cell);
      if (col !== last.col || row !== last.row) {
        last = { col, row };
        marks.push({ col, row, color: TRAIL_COLORS[colorIdx % TRAIL_COLORS.length], createdAt: now });
        colorIdx++;
      }

      // Drop fully-dissolved marks — since they were pushed in creation order, the ones at the
      // front of the array (oldest) always age out first.
      if (marks.length && now - marks[0].createdAt >= fadeMs) {
        marks = marks.filter(m => now - m.createdAt < fadeMs);
      }

      // Redraw from scratch each frame based on each mark's true elapsed age — correct
      // regardless of how many frames were skipped in between, with no cumulative residue.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const m of marks) {
        const age = now - m.createdAt;
        ctx.globalAlpha = peakAlpha * (1 - age / fadeMs);
        ctx.fillStyle = m.color;
        ctx.fillRect(m.col * cell + (cell - mark) / 2, m.row * cell + (cell - mark) / 2, mark, mark);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="pixel-trail-canvas" />;
}

// ── Hash routing: every page and archive modal has a URL, so the back button works and pieces can be
// linked directly (#/work/adobe, #/archive/colorful, #/archive/glyqlo, #/about). ──
const WORK_SLUGS = ['adobe', 'class-discovery', 'onboarding', 'ai-aac-device'];
const ARCHIVE_PAGES = { gmaps: 'google-maps', zuora: 'zuora', colorful: 'colorful', kidomi: 'ki-domi', usability: 'nordstrom-ai-gift-finder' };
const ARCHIVE_PAGE_KEYS = Object.keys(ARCHIVE_PAGES);

function parseHash(hash) {
  const [a, b] = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (a === 'work' && WORK_SLUGS.includes(b)) return { page: 'case', caseIdx: WORK_SLUGS.indexOf(b), modal: null };
  if (a === 'archive') {
    const key = ARCHIVE_PAGE_KEYS.find((k) => ARCHIVE_PAGES[k] === b);
    if (key) return { page: key, caseIdx: 0, modal: null };
    return { page: 'archive', caseIdx: 0, modal: b || null };
  }
  if (a === 'about') return { page: 'about', caseIdx: 0, modal: null };
  return { page: 'home', caseIdx: 0, modal: null };
}

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

  // Follow the URL: back/forward and direct links all land here.
  useEffect(() => {
    const apply = () => {
      const r = parseHash(window.location.hash);
      const key = r.page + ':' + r.caseIdx;
      setPage(r.page);
      setCaseIdx(r.caseIdx);
      setModalSlug(r.modal);
      if (key !== routeRef.current) { routeRef.current = key; window.scrollTo(0, 0); }
    };
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  const [pendingScroll, setPendingScroll] = useState(null);

  // After switching pages, scroll to the requested target once the new page's content has mounted.
  useEffect(() => {
    if (!pendingScroll || page !== 'home') return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(pendingScroll.id)?.scrollIntoView({ behavior: 'smooth', block: pendingScroll.block });
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

  const goArchive = (e) => { e.preventDefault(); nav('#/archive'); if (page === 'archive') window.scrollTo(0, 0); };
  const goAbout = (e) => { e.preventDefault(); nav('#/about'); };
  const goArchiveCase = (key) => nav(key === 'archive' ? '#/archive' : '#/archive/' + ARCHIVE_PAGES[key]);
  const goCase = (idx) => nav('#/work/' + WORK_SLUGS[idx]);

  return (
    <>
      <style>{`
.rv{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.rv.rv-in{opacity:1;transform:none}
        /* fonts (Open Sauce Sans, DM Mono) are self-hosted and imported in main.jsx via @fontsource */

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#F5F2EE;--text:#1A1A18;--text-mid:rgba(26,26,24,.5);--text-dim:rgba(26,26,24,.3);
          --border:rgba(26,26,24,.08);--top:96px;
        }
        html{scroll-behavior:smooth;scroll-snap-type:y mandatory}
        body{background:var(--bg);color:var(--text);font-family:'Open Sauce Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}

        /* Canvas for PixelTrail — nothing shows until the cursor has actually moved over it */
        .pixel-trail-canvas{position:fixed;inset:0;z-index:-1;pointer-events:none;width:100vw;height:100vh}

        @keyframes nP{0%,100%{opacity:.25}50%{opacity:1}}
        @keyframes lC{0%{stroke-dashoffset:70;opacity:0}40%{opacity:.7}60%{stroke-dashoffset:0;opacity:.7}100%{stroke-dashoffset:70;opacity:0}}

        /* Primary nav — identical set of links on every page. Lives in the rail on the home
           page; floats (no bar chrome) on other pages. */
        .rail-nav{display:flex;gap:20px;align-items:center;flex-wrap:wrap}
        .rail-nav-link{font-size:12px;color:var(--text-dim);text-decoration:none;transition:color .15s}
        .rail-nav-link:hover{color:var(--text)}
        .rail-nav-link.is-current{color:var(--text);font-weight:600}
        .floating-nav{position:fixed;top:32px;left:60px;z-index:100}

        /* A blocky, stepped underline sweep on hover — reads as pixels assembling left to right,
           not a smooth wipe. Applied to plain text links across the rail/footer/nav. */
        .pixel-underline{position:relative}
        .pixel-underline::after{content:'';position:absolute;left:0;bottom:-3px;height:2px;width:0;background:currentColor;transition:width .28s steps(6,end)}
        .pixel-underline:hover::after{width:100%}

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
        .brand{font-weight:700;color:#000}
        .brand .pixel-bullet{margin-right:4px;vertical-align:middle}

        .rail-rule{height:1px;background:var(--border)}
        .rail-label{font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-dim)}

        /* ── RIGHT COLUMN ── */
        .stack{display:flex;flex-direction:column;gap:28px;padding-top:var(--top);padding-bottom:30vh}

        .card{position:relative;width:100%;border-radius:0;overflow:hidden;display:flex;flex-direction:column;background:transparent;transform-origin:center center;will-change:transform,opacity;scroll-margin-top:var(--top);scroll-snap-align:center;cursor:pointer}
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
        .card-badge{position:absolute;top:16px;left:16px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;background:rgba(245,242,238,.95);color:#1A1A18;padding:5px 10px;border-radius:20px}

        .card-body{padding:20px 2px 0;max-width:560px}
        .card-company{font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-mid);display:inline-flex;align-items:center;gap:7px;margin-bottom:8px}
        /* Active-card indicator — brand-colored per card (set inline via c.color), dimmed until
           this card is the one nearest viewport-center */
        .pixel-bullet{display:inline-block;width:6px;height:6px;flex-shrink:0;opacity:.4;transition:opacity .2s}
        .pixel-bullet.is-active{opacity:1}
        .card-title{font-size:clamp(19px,1.8vw,24px);font-weight:700;line-height:1.2;letter-spacing:-.02em;margin-bottom:8px}
        .card-desc{font-size:12.5px;line-height:1.6;color:var(--text-mid);margin-bottom:14px}
        .card-metrics{display:flex;gap:20px;padding-top:12px;border-top:1px solid rgba(26,26,24,.08)}
        .metric{display:flex;flex-direction:column;gap:2px}
        .card-val{font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:var(--text)}
        .card-label{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-dim)}

        /* ── Case study template: hero, then the home page's own .page grid reused for a
           TOC rail + placeholder content sections — same coordinate system, no new layout. ── */
        .case-hero{max-width:1280px;margin:0 auto;padding:calc(var(--top) + 24px) 60px 40px}
        .case-title{font-size:clamp(28px,3.4vw,44px);font-weight:700;line-height:1.1;letter-spacing:-.02em;margin:14px 0 12px;max-width:760px}
        .case-desc{font-size:15px;line-height:1.6;color:var(--text-mid);max-width:640px;margin-bottom:20px}
        .case-hero .card-metrics{margin-bottom:28px}
        .case-hero-media{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--border)}

        .case-toc{display:flex;flex-direction:column;gap:12px;margin-top:14px}
        .case-sections{display:flex;flex-direction:column;gap:56px;padding-bottom:60px}
        .case-section{display:flex;flex-direction:column;gap:12px}
        .case-section-title{font-size:20px;font-weight:700;letter-spacing:-.01em;scroll-margin-top:var(--top)}
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
          padding:calc(var(--top) + 24px) var(--gap) var(--gap);
        }
        .bento{display:flex;align-items:flex-start;gap:var(--gap)}
                .bento-col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:var(--gap)}
        .bento-tile{position:relative;margin:0;flex:none;width:100%;overflow:hidden;background:rgba(26,26,24,.06);display:flex;align-items:center;justify-content:center}
        .bento-img{display:block;width:100%;height:100%}
        .bento-img.is-matte{width:auto;height:auto;max-width:86%;max-height:86%}
        .bento-tile::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.5);opacity:0;transition:opacity .3s ease;pointer-events:none}
        .bento-tile:hover::after{opacity:1}
        .bento-tile.is-link{cursor:pointer}
        .bento-nda{position:absolute;inset:0;background:#1A1A18;display:flex;align-items:center;justify-content:center}
        .bento-nda span{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,242,238,.5)}
        .bento-label{position:absolute;left:18px;bottom:16px;right:18px;z-index:1;display:flex;flex-direction:column;gap:3px;color:#fff;opacity:0;transform:translateY(4px);transition:opacity .3s ease, transform .3s ease;pointer-events:none}
        .bento-tile:hover .bento-label{opacity:1;transform:none}
        .bento-tag{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.7)}
        .bento-title{font-size:14px;font-weight:600;letter-spacing:-.01em}

        /* ── About: clean and calm, same width as the Work page ── */
        .about-page{max-width:1160px;margin:0 auto;padding:calc(var(--top) + 64px) 60px 96px;display:flex;flex-direction:column;gap:64px}
        .wf-block{background:rgba(26,26,24,.06);border:1px solid var(--border)}
        .wf-divider{height:1px;background:var(--border)}

        .about-hero{display:flex;gap:32px;align-items:flex-start}
        .about-photo{width:260px;aspect-ratio:4/5;object-fit:cover;object-position:center 42%;flex-shrink:0;display:block}
        .about-hero-text{flex:1;padding-top:4px;display:flex;flex-direction:column;gap:10px}
        @font-face{font-family:'DreamHeumul';src:url('/fonts/DreamHeumulKR.ttf') format('truetype');font-display:swap}
        .about-name{font-family:'DreamHeumul',cursive;font-size:52px;font-weight:400;letter-spacing:0;line-height:1.1}
        .about-tagline{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim)}
        .about-bio{font-size:17px;line-height:1.8;color:var(--text-mid);max-width:560px}

        /* plain resume rows — company, title, date. nothing else. */
        .ad{position:fixed;inset:0;z-index:4000;background:rgba(26,26,24,.5);display:flex;align-items:center;justify-content:center;padding:32px 16px;animation:adIn .25s ease}
        @keyframes adIn{from{opacity:0}to{opacity:1}}
        .ad-dialog{width:min(820px,100%);max-height:100%;overflow-y:auto;background:var(--bg);border:1px solid rgba(26,26,24,.12);padding:32px 36px 40px;display:flex;flex-direction:column;gap:20px;animation:adUp .3s ease}
        @keyframes adUp{from{transform:translateY(12px)}to{transform:none}}
        .ad-head{display:flex;justify-content:space-between;align-items:center}
        .ad-close{background:none;border:none;padding:0;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text)}
        .ad-tag{display:flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim)}
        .ad-tag i{width:6px;height:6px;background:#1A1A18}
        .ad-title{font-size:clamp(24px,3vw,32px);font-weight:600;letter-spacing:-.025em;line-height:1.15;margin-top:4px}
        .ad-meta{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.02em;color:var(--text-dim)}
        .ad-desc{font-size:16px;line-height:1.7;color:var(--text-mid);max-width:600px}
        .ad-links{display:flex;gap:24px;flex-wrap:wrap;font-size:14px;font-weight:600}
        .ad-links a{color:var(--text);text-decoration:none;border-bottom:1px solid rgba(26,26,24,.3)}
        .ad-img{display:block;width:100%;height:auto}
        .ad-row{display:grid;gap:12px;align-items:start}
        .ad-video{position:relative;width:100%;aspect-ratio:16/9;background:#000}
        .ad-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
        @media (max-width:860px){.ad-dialog{padding:24px 20px 28px}}
        .about-sec{display:grid;grid-template-columns:200px minmax(0,1fr);gap:64px;border-top:1px solid #1A1A18;padding-top:24px}
        .about-block{display:flex;flex-direction:column;gap:24px;border-top:1px solid #1A1A18;padding-top:24px}
        .about-label{display:flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim);align-self:start;padding-top:3px}
        .about-label i,.about-dot{display:inline-block;width:6px;height:6px;flex-shrink:0}
        .about-label i{background:#1A1A18}
        .about-dot{align-self:center}
        .hobby-row{display:flex;gap:8px;align-items:flex-start;min-width:0}
        .hobby-img{display:block;flex:1 1 0;min-width:0;width:100%;height:auto;object-fit:cover}
        .about-list{display:flex;flex-direction:column}
        .about-item{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:16px 0;border-bottom:1px solid rgba(26,26,24,.08)}
        .about-item:first-child{padding-top:0}
        .about-item:last-child{border-bottom:none}
        .about-item-main{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
        .about-item-company{font-size:14px;font-weight:600;color:var(--text)}
        .about-item-role{font-size:13px;color:var(--text-mid)}
        .about-item-date{font-family:'DM Mono',monospace;font-size:11px;color:var(--text-dim);white-space:nowrap;flex-shrink:0}

        @media (max-width:860px){
          .about-page{padding:calc(var(--top) + 32px) 24px 60px}
          .floating-nav{top:24px;left:24px}
          .about-hero{flex-direction:column}
          .about-photo{width:200px}
          .about-item{flex-direction:column;gap:4px}
          .about-sec{grid-template-columns:1fr;gap:20px}
          .hobby-row{flex-wrap:wrap}
          .hobby-img{flex:1 1 40%}
        }

        @media (max-width:860px){
          .archive-page{--gap:6px}
        }

        footer{border-top:1px solid var(--border);padding:24px 60px}
        .footer-name{font-size:12px;color:var(--text-dim)}

        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:rgba(26,26,24,.12);border-radius:2px}

        .loader{position:fixed;inset:0;z-index:5000;display:grid;background:transparent}
        .loader-cell{animation:pixelOut .7s ease-in-out forwards}
        @keyframes pixelOut{to{opacity:0}}

        @media (max-width: 860px){
          html{scroll-snap-type:none}
          .page{grid-template-columns:1fr;padding:72px 24px 40px}
          .rail{position:relative;top:0;margin-bottom:32px}
          .stack{padding-top:0;gap:24px}
        }
      `}</style>

      {loading && <Loader onDone={finishLoading} />}

      <PixelTrail />

      <div className="floating-nav">
        <PageNav page={page} goHome={goHome} goArchive={goArchive} goAbout={goAbout} />
      </div>

      {page === 'home' && (
        <div className="page">
          <SideRail />
          <WorkStack activeIdx={activeIdx} onActiveChange={setActiveIdx} onOpenCase={goCase} />
        </div>
      )}

      {page === 'case' && caseIdx === 1 && <ScrollReveal><ClassDiscovery onNext={() => goCase(2)} /></ScrollReveal>}
      {page === 'case' && caseIdx === 2 && <ScrollReveal><Onboarding onNext={() => goCase(3)} /></ScrollReveal>}
      {page === 'case' && caseIdx === 3 && <ScrollReveal><AACDevice onNext={() => goCase(0)} /></ScrollReveal>}
      {page === 'case' && caseIdx === 0 && <ScrollReveal><Adobe onNext={() => goCase(1)} /></ScrollReveal>}
      {page === 'gmaps' && <ScrollReveal><GoogleMaps onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'zuora' && <ScrollReveal><Zuora onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'colorful' && <ScrollReveal><Colorful onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'kidomi' && <ScrollReveal><Kidomi onNext={() => goArchiveCase('archive')} /></ScrollReveal>}
      {page === 'usability' && <ScrollReveal><UsabilityStudy onNext={() => goArchiveCase('archive')} /></ScrollReveal>}

      {page === 'archive' && (
      /* ── Archive: explorations gallery ── */
      <section id="archive" className="archive archive-page">
        <ArchiveGrid modalSlug={modalSlug} onOpenModal={(slug) => nav('#/archive/' + slug)} onCloseModal={() => nav('#/archive')} onOpenPage={goArchiveCase} />

      </section>
      )}

      {page === 'about' && (
      /* ── About: clean, resume-style — company / title / date rows, same width as the Work page ── */
      <section id="about" className="about-page">
        <div className="about-hero">
          <img src={PROFILE_IMG} alt="Jayden Kang" className="about-photo" />
          <div className="about-hero-text">
            <h1 className="about-name">Jayden Kang</h1>
            <span className="about-tagline">Product Designer · Inclusive UX · Systems Thinking</span>
            <p className="about-bio">
              Former Experience Design intern on Adobe's Agents team. I like design systems, accessible-by-default UI,
              and building things that feel a little alive.
            </p>
          </div>
        </div>

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

        <div className="about-block">
        <span className="about-label"><i />Outside of Design</span>
        <HobbyRow />
        </div>
      </section>
      )}

      <footer>
        <span className="footer-name">Jayden Kang · 2026</span>
      </footer>
    </>
  );
}
