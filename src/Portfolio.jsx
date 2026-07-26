import { useState, useEffect, useRef, useCallback } from "react";

const ADOBE_IMG = "/assets/Adobe/cover.jpg";
const SKILLSHARE_IMG = "/assets/Skillshare/class-discovery.jpg";

const BIO = "Jayden is a product designer currently interning at Adobe on the Agents team, designing gen AI experiences. Previously a product designer at Skillshare, and studied at USC and the University of Washington.";
const BRAND_NAMES = ['Adobe', 'Skillshare', 'USC', 'University of Washington'];

function Bio({ text }) {
  const pattern = new RegExp(`(${BRAND_NAMES.join('|')})`, 'g');
  return (
    <p className="intro-text">
      {text.split(pattern).map((chunk, i) =>
        BRAND_NAMES.includes(chunk) ? <span key={i} className="brand">{chunk}</span> : chunk
      )}
    </p>
  );
}

// ── Placeholder color fields for cards without a real photo yet ──
const AnimOB = () => (
  <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gridTemplateRows: 'repeat(4,1fr)', gap: '3px', padding: '18px', background: '#C2CBBC' }}>
    {Array.from({ length: 36 }).map((_, i) => (
      <div key={i} style={{ background: i % 8 === 0 ? 'rgba(26,26,24,0.32)' : 'rgba(26,26,24,0.08)', borderRadius: '3px', animation: `gS 2.4s ease-in-out ${(i * .09) % 1.8}s infinite` }} />
    ))}
  </div>
);
const AnimNS = () => {
  const b = [{ t: 'Find a gift for my sister', r: false, d: '0s' }, { t: 'She loves wellness', r: true, d: '.9s' }, { t: 'Budget: $50–$100', r: false, d: '1.8s' }];
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '20px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', background: '#BAC4CC' }}>
      {b.map((x, i) => (
        <div key={i} style={{ alignSelf: x.r ? 'flex-end' : 'flex-start', background: x.r ? 'rgba(26,26,24,0.3)' : 'rgba(26,26,24,0.08)', borderRadius: '14px', padding: '7px 13px', fontSize: '12px', color: 'rgba(26,26,24,0.55)', fontFamily: 'DM Mono,monospace', animation: `cF 3.2s ease-in-out ${x.d} infinite`, maxWidth: '75%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {x.t}
        </div>
      ))}
    </div>
  );
};
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

const CARDS = [
  {
    company: 'Adobe', current: true,
    title: 'Designing for Gen AI Experiences',
    desc: "Currently an Experience Design intern on Adobe's Agents team, shaping how people collaborate with generative AI.",
    media: <Media src={ADOBE_IMG} fit="contain" bg="#E3000F" />,
  },
  {
    company: 'Skillshare',
    title: 'Class Discovery Redesign',
    desc: 'Progressive disclosure redesign grounded in a 2,277-user survey and 183-person Maze test. Rolled out to 100% of users.',
    metrics: [{ val: '+47%', label: 'Subscriptions' }, { val: '+5%', label: 'CTR' }],
    media: <Media src={SKILLSHARE_IMG} fit="contain" bg="#F5F2EE" />,
  },
  {
    company: 'Skillshare',
    title: 'Onboarding & Member Home',
    desc: 'Led activation and retention redesign as sole designer, including an AI-assisted design system built with Figma MCP.',
    metrics: [{ val: '+4.3pp', label: 'Retention' }, { val: '−26%', label: 'Time-to-Action' }],
    media: <AnimOB />,
  },
  {
    company: 'Nordstrom',
    title: 'AI Gift Finder Study',
    desc: "Moderated usability study on Nordstrom's AI Gift Finder — uncovering how trust erodes when AI ignores user constraints.",
    metrics: [{ val: '83.9', label: 'SUS Score' }, { val: '6', label: 'Key Findings' }],
    media: <AnimNS />,
  },
  {
    company: 'UW RAISE × Amazon',
    title: 'AI AAC Device',
    desc: 'Schedule-first AI communication tool for autistic children. Built with v0.dev, validated with 19 caregivers, presented at Amazon AI conference.',
    metrics: [{ val: '19', label: 'Caregivers' }, { val: '1st', label: 'AI Conference' }],
    media: <AnimAC />,
  },
];

// ── Left column: intro, then a grouped "Selected Work" box (label + TOC together), then links ──
function SideRail({ activeIdx, onLinkEnter, onLinkLeave }) {
  return (
    <aside className="rail">
      <Bio text={BIO} />

      <div className="rail-rule" />

      <div className="selected-work">
        <span className="rail-label">Selected Work</span>
        <nav className="toc" aria-label="Selected work">
          {CARDS.map((c, i) => (
            <a
              key={i}
              href={`#work-${i}`}
              className={`toc-item${i === activeIdx ? ' is-active' : ''}`}
              onMouseEnter={onLinkEnter}
              onMouseLeave={onLinkLeave}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`work-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              <span className="toc-company">{c.company}</span>
              <span className="toc-title">{c.title}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="rail-links">
        <a href="mailto:jaydehnajun@gmail.com" onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}>Email</a>
        <a href="#" onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}>LinkedIn</a>
        <a href="#" onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave}>Resume</a>
      </div>
    </aside>
  );
}

// ── Right column: scroll-driven stack of cards ──
function WorkStack({ onEnter, onLeave, onActiveChange }) {
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
        <div key={i} id={`work-${i}`} ref={el => cardRefs.current[i] = el} className="card" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <div className="card-media">
            {c.media}
            {c.current && <span className="card-badge">Currently</span>}
          </div>
          <div className="card-body">
            <span className="card-company">{c.company}</span>
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

export default function Portfolio() {
  const [mouse, setMouse] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [page, setPage] = useState('home'); // 'home' | 'archive' | 'about'
  const [pendingScroll, setPendingScroll] = useState(null);

  // After switching pages, scroll to the requested target once the new page's content has mounted.
  useEffect(() => {
    if (!pendingScroll) return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(pendingScroll.id)?.scrollIntoView({ behavior: 'smooth', block: pendingScroll.block });
      setPendingScroll(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [page, pendingScroll]);

  const goHome = (scrollId) => (e) => {
    e.preventDefault();
    if (page !== 'home') {
      setPage('home');
      setPendingScroll({ id: scrollId, block: 'center' });
    } else {
      document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goArchive = (e) => {
    e.preventDefault();
    setPage('archive');
    window.scrollTo(0, 0);
  };

  const goAbout = (e) => {
    e.preventDefault();
    setPage('about');
    window.scrollTo(0, 0);
  };

  const ringT = useRef({ x: -100, y: -100 });
  const ringC = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = e => {
      setMouse({ x: e.clientX, y: e.clientY });
      ringT.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMove);
    const loop = () => {
      ringC.current.x += (ringT.current.x - ringC.current.x) * 0.1;
      ringC.current.y += (ringT.current.y - ringC.current.y) * 0.1;
      setRing({ x: ringC.current.x, y: ringC.current.y });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); };
  }, []);

  const on = () => setHov(true);
  const off = () => setHov(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.coollabs.io/css2?family=Open+Sauce+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;cursor:none !important}
        :root{
          --bg:#F5F2EE;--text:#1A1A18;--text-mid:rgba(26,26,24,.5);--text-dim:rgba(26,26,24,.3);
          --border:rgba(26,26,24,.08);--nav-h:64px;--top:110px;--mx:50vw;--my:50vh;
        }
        html{scroll-behavior:smooth;scroll-snap-type:y mandatory}
        body{background:var(--bg);color:var(--text);font-family:'Open Sauce Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}

        /* faint dot grid, everywhere, barely visible — reads like a design-tool canvas */
        .grid-base{
          position:fixed;inset:0;z-index:-2;pointer-events:none;
          background-image:radial-gradient(rgba(26,26,24,.10) 1px, transparent 1.5px);
          background-size:20px 20px;
        }
        /* same dots, drawn darker, revealed in a soft radius around the cursor via mask — no blur needed, the mask's own falloff is already smooth */
        .grid-glow{
          position:fixed;inset:0;z-index:-1;pointer-events:none;
          background-image:radial-gradient(rgba(26,26,24,.16) 1px, transparent 1.5px);
          background-size:20px 20px;
          -webkit-mask-image:radial-gradient(220px circle at var(--mx) var(--my), black, transparent 70%);
          mask-image:radial-gradient(220px circle at var(--mx) var(--my), black, transparent 70%);
        }

        .cur-dot{position:fixed;z-index:9999;width:5px;height:5px;border-radius:50%;pointer-events:none;background:var(--text);transform:translate(-50%,-50%);transition:width .15s,height .15s}
        .cur-ring{position:fixed;z-index:9998;border-radius:50%;pointer-events:none;border:1px solid rgba(26,26,24,.15);transform:translate(-50%,-50%);transition:width .3s,height .3s}

        @keyframes gS{0%,100%{opacity:.15;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}
        @keyframes cF{0%{opacity:0;transform:translateX(-8px)}20%{opacity:1;transform:translateX(0)}80%{opacity:1}100%{opacity:0;transform:translateX(-8px)}}
        @keyframes nP{0%,100%{opacity:.25}50%{opacity:1}}
        @keyframes lC{0%{stroke-dashoffset:70;opacity:0}40%{opacity:.7}60%{stroke-dashoffset:0;opacity:.7}100%{stroke-dashoffset:70;opacity:0}}

        .site-nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:100;display:flex;justify-content:space-between;align-items:center;padding:0 60px;background:rgba(245,242,238,.94);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
        .nav-logo{font-size:14px;font-weight:600;letter-spacing:-.02em}
        .nav-links{display:flex;gap:36px;align-items:center}
        .nav-link{font-size:12px;color:var(--text-dim);text-decoration:none;transition:color .15s}
        .nav-link:hover{color:var(--text)}
        .nav-link.is-current{color:var(--text)}
        .nav-cta{font-size:11px;font-weight:500;letter-spacing:.06em;padding:7px 16px;border:1px solid rgba(26,26,24,.18);text-decoration:none;color:var(--text)}

        /* ── Page layout: one grid, one coordinate system for both columns ── */
        .page{max-width:1280px;margin:0 auto;padding:0 60px 40px;display:grid;grid-template-columns:260px 1fr;gap:48px;align-items:start}

        /* ── LEFT COLUMN ── */
        .rail{position:sticky;top:var(--top);align-self:start;display:flex;flex-direction:column;gap:16px;z-index:5;min-height:0}
        .intro-text{font-size:13px;line-height:1.7;color:var(--text);max-width:250px}
        .brand{font-weight:600}

        .rail-rule{height:1px;background:var(--border)}

        /* the "Selected Work" box — label and TOC grouped as one unit */
        .selected-work{display:flex;flex-direction:column;gap:14px}
        .rail-label{font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--text-dim)}

        /* TOC — always a vertical stack, lives inside the Selected Work box, below the label */
        .toc{display:flex;flex-direction:column;gap:14px}
        .toc-item{display:flex;flex-direction:column;gap:2px;text-decoration:none;padding-left:12px;border-left:1px solid var(--border)}
        .toc-item.is-active{border-left:1px solid var(--text)}
        .toc-company{font-size:13px;font-weight:600;color:var(--text-dim)}
        .toc-title{font-size:11px;color:var(--text-dim);opacity:.7}
        .toc-item.is-active .toc-company{color:var(--text)}
        .toc-item:hover .toc-company{color:var(--text)}

        .rail-links{display:flex;gap:14px}
        .rail-links a{font-size:11px;color:var(--text-dim);text-decoration:none}
        .rail-links a:hover{color:var(--text)}

        /* ── RIGHT COLUMN ── */
        .stack{display:flex;flex-direction:column;gap:28px;padding-top:var(--top);padding-bottom:30vh}

        .card{position:relative;width:100%;border-radius:0;overflow:hidden;display:flex;flex-direction:column;background:transparent;transform-origin:center center;will-change:transform,opacity;scroll-margin-top:var(--top);scroll-snap-align:center}

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
        .card-company{font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-dim);display:block;margin-bottom:8px}
        .card-title{font-size:clamp(19px,1.8vw,24px);font-weight:700;line-height:1.2;letter-spacing:-.02em;margin-bottom:8px}
        .card-desc{font-size:12.5px;line-height:1.6;color:var(--text-mid);margin-bottom:14px}
        .card-metrics{display:flex;gap:20px;padding-top:12px;border-top:1px solid rgba(26,26,24,.08)}
        .metric{display:flex;flex-direction:column;gap:2px}
        .card-val{font-family:'DM Mono',monospace;font-size:13px;font-weight:500;color:var(--text)}
        .card-label{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-dim)}

        /* ── Archive: temporary wireframe bento grid ── */
        /* --gap drives the grid gap AND the outer page margin, so spacing is uniform everywhere */
        .archive-page{
          --gap:8px;
          width:100%;
          min-height:100vh;
          box-sizing:border-box;
          padding:calc(var(--nav-h) + var(--gap)) var(--gap) var(--gap);
        }
        .bento{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          grid-auto-rows:140px;
          gap:var(--gap);
          height:100%;
        }
        .bento-tile{background:rgba(26,26,24,.06);border:1px solid var(--border);grid-row:span 2}
        .bento-tile:hover{background:rgba(26,26,24,.09)}
        .bento-tile.short{grid-row:span 1}
        .bento-tile.tall{grid-row:span 3}

        /* ── About: clean and calm, same width as the Work page ── */
        .about-page{max-width:1280px;margin:0 auto;padding:calc(var(--nav-h) + 48px) 60px 80px;display:flex;flex-direction:column;gap:28px}
        .wf-block{background:rgba(26,26,24,.06);border:1px solid var(--border)}
        .wf-divider{height:1px;background:var(--border)}

        .about-hero{display:flex;gap:32px;align-items:flex-start}
        .about-photo{width:160px;height:160px;flex-shrink:0}
        .about-hero-text{flex:1;padding-top:4px;display:flex;flex-direction:column;gap:10px}
        .about-name{font-size:28px;font-weight:700;letter-spacing:-.02em}
        .about-tagline{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim)}
        .about-bio{font-size:14px;line-height:1.7;color:var(--text-mid);max-width:520px}

        /* plain resume rows — company, title, date. nothing else. */
        .about-list{display:flex;flex-direction:column}
        .about-item{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:14px 0;border-bottom:1px solid var(--border)}
        .about-item:last-child{border-bottom:none}
        .about-item-main{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
        .about-item-company{font-size:14px;font-weight:600;color:var(--text)}
        .about-item-role{font-size:13px;color:var(--text-mid)}
        .about-item-date{font-family:'DM Mono',monospace;font-size:11px;color:var(--text-dim);white-space:nowrap;flex-shrink:0}

        @media (max-width:860px){
          .about-page{padding:calc(var(--nav-h) + 32px) 24px 60px}
          .about-hero{flex-direction:column}
          .about-photo{width:120px;height:120px}
          .about-item{flex-direction:column;gap:4px}
        }

        @media (max-width:860px){
          .archive-page{--gap:6px}
          .bento{grid-template-columns:repeat(2,1fr);grid-auto-rows:110px}
        }

        footer{border-top:1px solid var(--border);padding:24px 60px;display:flex;justify-content:space-between;align-items:center}
        .footer-name{font-size:12px;color:var(--text-dim)}
        .footer-links{display:flex;gap:20px}
        .footer-links a{font-size:11px;color:var(--text-dim);text-decoration:none}
        .footer-links a:hover{color:var(--text)}

        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:rgba(26,26,24,.12);border-radius:2px}

        @media (max-width: 860px){
          html{scroll-snap-type:none}
          .page{grid-template-columns:1fr;padding:calc(var(--nav-h) + 32px) 24px 40px}
          .rail{position:relative;top:0;margin-bottom:32px}
          .stack{padding-top:0;gap:24px}
          .site-nav{padding:0 24px}
          .toc{display:none}
        }
      `}</style>

      <div className="grid-base" />
      <div className="grid-glow" />
      <div className="cur-dot" style={{ left: mouse.x, top: mouse.y, width: hov ? '8px' : '5px', height: hov ? '8px' : '5px' }} />
      <div className="cur-ring" style={{ left: ring.x, top: ring.y, width: hov ? '46px' : '30px', height: hov ? '46px' : '30px' }} />

      <nav className="site-nav">
        <span className="nav-logo">Jayden Kang</span>
        <div className="nav-links">
          <a href="#work-0" className={`nav-link${page === 'home' ? ' is-current' : ''}`} onMouseEnter={on} onMouseLeave={off} onClick={goHome('work-0')}>Work</a>
          <a href="#archive" className={`nav-link${page === 'archive' ? ' is-current' : ''}`} onMouseEnter={on} onMouseLeave={off} onClick={goArchive}>Archive</a>
          <a href="#about" className={`nav-link${page === 'about' ? ' is-current' : ''}`} onMouseEnter={on} onMouseLeave={off} onClick={goAbout}>About</a>
          <a href="mailto:jaydehnajun@gmail.com" className="nav-cta" onMouseEnter={on} onMouseLeave={off}>Contact ↗</a>
        </div>
      </nav>

      {page === 'home' && (
        <div className="page">
          <SideRail activeIdx={activeIdx} onLinkEnter={on} onLinkLeave={off} />
          <WorkStack onEnter={on} onLeave={off} onActiveChange={setActiveIdx} />
        </div>
      )}

      {page === 'archive' && (
      /* ── Archive: temporary wireframe bento grid — case studies + explorations, placeholder tiles for now ── */
      <section id="archive" className="archive archive-page">
        <div className="bento">
          {[
            'tall', 'short', '',
            '', 'tall', 'short',
            'short', '', 'tall',
            'tall', 'short', '',
          ].map((cls, i) => (
            <div key={i} className={`bento-tile ${cls}`} onMouseEnter={on} onMouseLeave={off} />
          ))}
        </div>
      </section>
      )}

      {page === 'about' && (
      /* ── About: clean, resume-style — company / title / date rows, same width as the Work page ── */
      <section id="about" className="about-page">
        <div className="about-hero">
          <div className="wf-block about-photo" />
          <div className="about-hero-text">
            <h1 className="about-name">Jayden Kang</h1>
            <span className="about-tagline">Product Designer · Inclusive UX · Systems Thinking</span>
            <p className="about-bio">
              Experience Design intern on Adobe's Agents team. I like design systems, accessible-by-default UI,
              and building things that feel a little alive.
            </p>
          </div>
        </div>

        <div className="wf-divider" />

        <span className="rail-label">Experience</span>
        <div className="about-list">
          {[
            { company: 'Adobe', role: 'Experience Design Intern, Agents Team', date: 'Jun – Sep 2026' },
            { company: 'Skillshare', role: 'Associate Product Designer', date: 'Apr 2025 – Present' },
            { company: 'Skillshare', role: 'Product Design Intern', date: 'Sep – Dec 2024' },
            { company: 'Zuora', role: 'UX Design Intern', date: 'May – Sep 2023' },
            { company: 'Hiossen', role: 'UX Design Intern', date: 'May – Jun 2022' },
          ].map((row, i) => (
            <div className="about-item" key={i}>
              <div className="about-item-main">
                <span className="about-item-company">{row.company}</span>
                <span className="about-item-role">{row.role}</span>
              </div>
              <span className="about-item-date">{row.date}</span>
            </div>
          ))}
        </div>

        <div className="wf-divider" />

        <span className="rail-label">Education</span>
        <div className="about-list">
          {[
            { company: 'University of Washington', role: 'MS, Human Centered Design & Engineering', date: 'Sep 2025 – Dec 2027' },
            { company: 'University of Southern California', role: 'BFA, Design', date: 'Aug 2020 – May 2024' },
          ].map((row, i) => (
            <div className="about-item" key={i}>
              <div className="about-item-main">
                <span className="about-item-company">{row.company}</span>
                <span className="about-item-role">{row.role}</span>
              </div>
              <span className="about-item-date">{row.date}</span>
            </div>
          ))}
        </div>
      </section>
      )}

      <footer>
        <span className="footer-name">Jayden Kang · 2026</span>
        <div className="footer-links">
          <a href="mailto:jaydehnajun@gmail.com" onMouseEnter={on} onMouseLeave={off}>Email ↗</a>
          <a href="#" onMouseEnter={on} onMouseLeave={off}>LinkedIn ↗</a>
          <a href="#" onMouseEnter={on} onMouseLeave={off}>Resume ↗</a>
        </div>
      </footer>
    </>
  );
}
