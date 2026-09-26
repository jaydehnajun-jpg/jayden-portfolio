import { useState, useEffect, createContext, useContext } from 'react';

// Shared building blocks for every case study, so all four pages have one layout and one look:
// hero, "On this page" rail, numbered sections, then a next-project footer. The visual language
// is blueprint-style: hairline rules, corner tick marks, a faint drafting grid behind images,
// mono labels and no shadows or filled boxes. Each page sets its accent via <CaseLayout accent>,
// exposed to everything below as the CSS variable --acc.

export const INK = '#1A1A18';
export const LINE = 'rgba(26,26,24,.16)';
export const SOFT = 'rgba(26,26,24,.08)';
export const MID = 'rgba(26,26,24,.62)';
export const DIM = 'rgba(26,26,24,.4)';

export const TYPE = {
  display: { fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-.035em' },
  h2:      { fontSize: 'clamp(24px,2.8vw,32px)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-.025em' },
  h3:      { fontSize: '20px', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.01em' },
  stat:    { fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 300, lineHeight: 1, letterSpacing: '-.03em' },
  body:    { fontSize: '17px', lineHeight: 1.8 },
  small:   { fontSize: '13px', lineHeight: 1.65 },
  label:   { fontFamily: 'DM Mono,monospace', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase' },
};

const Sections = createContext([]);

// ── Marks ────────────────────────────────────────────────

const corner = (v, h) => ({
  position: 'absolute', width: 9, height: 9, [v]: -5, [h]: -5, pointerEvents: 'none',
  [`border${v === 'top' ? 'Top' : 'Bottom'}`]: `1px solid ${INK}`,
  [`border${h === 'left' ? 'Left' : 'Right'}`]: `1px solid ${INK}`,
  opacity: 0.55,
});
export const Ticks = () => (
  <>
    <i style={corner('top', 'left')} /><i style={corner('top', 'right')} />
    <i style={corner('bottom', 'left')} /><i style={corner('bottom', 'right')} />
  </>
);

const GRID = {
  backgroundColor: '#FBFAF8',
  backgroundImage: 'linear-gradient(rgba(26,26,24,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,26,24,.05) 1px,transparent 1px)',
  backgroundSize: '24px 24px',
};

export const Sq = ({ size = 6 }) => <span style={{ width: size, height: size, background: 'var(--acc)', flexShrink: 0, display: 'inline-block' }} />;

// An image, or, for .gif sources, the .mp4 with the same name playing as a silent loop (same look,
// a tenth of the download size). Drop-in for <img>.
export const AnimImg = ({ src, alt = '', ...rest }) =>
  /\.gif$/i.test(src)
    ? <video src={src.replace(/\.gif$/i, '.mp4')} autoPlay loop muted playsInline preload="metadata" aria-label={alt} {...rest} />
    : <img src={src} alt={alt} {...rest} />;

// ── Text ─────────────────────────────────────────────────

export const P = ({ children }) => <p style={{ ...TYPE.body, color: MID, maxWidth: 640 }}>{children}</p>;

export const H3 = ({ children }) => <div style={{ ...TYPE.h3, color: INK }}>{children}</div>;

export const Label = ({ children, style }) => <div style={{ ...TYPE.label, color: DIM, ...style }}>{children}</div>;

export const Callout = ({ children }) => (
  <div style={{ borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${LINE}`, padding: '32px 0', fontSize: 'clamp(19px,2vw,23px)', fontWeight: 300, lineHeight: 1.5, letterSpacing: '-.015em', color: INK }}>
    {children}
  </div>
);

export const Quote = ({ text, who }) => (
  <div style={{ borderLeft: '1px solid var(--acc)', paddingLeft: 24 }}>
    <p style={{ ...TYPE.body, fontStyle: 'italic', color: MID, marginBottom: who ? 8 : 0 }}>“{text}”</p>
    {who && <span style={{ ...TYPE.label, textTransform: 'none', color: DIM }}>{who}</span>}
  </div>
);

export const Tag = ({ children, tone }) => {
  const c = { green: '#00734F', amber: '#7A5500', red: '#8A1C1C', blue: '#2E4F80' }[tone] || 'rgba(26,26,24,.55)';
  return <span style={{ ...TYPE.label, textTransform: 'none', letterSpacing: '.02em', display: 'inline-block', padding: '3px 8px', border: `1px solid ${LINE}`, color: c, whiteSpace: 'nowrap' }}>{children}</span>;
};

// ── Surfaces ─────────────────────────────────────────────

// Plain image or video. `panel` puts it on a soft fixed-size tile so a set of them matches.
// `wide` stretches the image to the full column width; `tint` sets it on a colored panel.
export const Frame = ({ src, alt = '', caption, max = 380, panel, wide, tint, children, style }) => {
  const media = src
    ? <AnimImg src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: wide ? undefined : (panel ? panel - 48 : max), width: wide ? '100%' : 'auto', height: 'auto', display: 'block', mixBlendMode: 'multiply' }} />
    : children;
  return (
    <figure style={{ margin: 0, width: '100%', ...style }}>
      {panel
        ? <div style={{ height: panel, background: 'rgba(26,26,24,.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>{media}</div>
        : tint
          ? <div style={{ background: tint, padding: 'clamp(16px,4vw,40px)', display: 'flex', justifyContent: 'center' }}>{media}</div>
          : <div style={{ display: 'flex', justifyContent: 'center' }}>{media}</div>}
      {caption && (
        <figcaption style={{ ...TYPE.label, letterSpacing: '.04em', textTransform: 'none', color: DIM, marginTop: 14 }}>{caption}</figcaption>
      )}
    </figure>
  );
};

export const Card = ({ idx, title, children }) => (
  <div className="ck-card" style={{ border: `1px solid ${SOFT}`, padding: 26, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
    {title && <div style={{ ...TYPE.small, fontSize: 15, fontWeight: 600, color: INK }}>{title}</div>}
    {children && <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.55)' }}>{children}</div>}
  </div>
);

// items: [title, description]. numbered adds 01, 02… in the accent.
export const Cards = ({ items, cols = 2, numbered }) => (
  <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: 20 }}>
    {items.map(([t, d], i) => <Card key={t} title={t} idx={numbered ? String(i + 1).padStart(2, '0') : undefined}>{d}</Card>)}
  </div>
);

// Big numbers separated by hairlines, like dimension callouts on a drawing.
export const Metrics = ({ items }) => (
  <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},minmax(0,1fr))`, borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${LINE}` }}>
    {items.map(([v, l], i) => (
      <div key={l} style={{ padding: '28px 24px 28px ' + (i ? '24px' : '0'), borderLeft: i ? `1px solid ${LINE}` : 'none' }}>
        <div style={{ ...TYPE.stat, color: 'var(--acc)', marginBottom: 12 }}>{v}</div>
        <div style={{ ...TYPE.label, color: DIM, lineHeight: 1.6 }}>{l}</div>
      </div>
    ))}
  </div>
);

export const Rows = ({ rows }) => (
  <div>
    {rows.map(([t, d, right], i) => (
      <div key={t} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', padding: '18px 0', alignItems: 'baseline', borderTop: i === 0 ? `1px solid ${INK}` : `1px solid ${SOFT}`, borderBottom: i === rows.length - 1 ? `1px solid ${LINE}` : 'none' }}>
        <div style={{ ...TYPE.small, fontWeight: 600, color: INK, flex: '0 0 220px', maxWidth: '100%' }}>{t}</div>
        <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.55)', flex: 1, minWidth: 220 }}>
          {Array.isArray(d) ? d.map((x) => <div key={x} style={{ padding: '2px 0' }}>{x}</div>) : d}
        </div>
        {right}
      </div>
    ))}
  </div>
);

export const Split = ({ children, reverse, gap = 56 }) => (
  <div className={`ck-split${reverse ? ' rev' : ''}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, alignItems: 'center' }}>{children}</div>
);

// Text on one side, a framed image on the other. Used for feature walk-throughs.
export const Feature = ({ n, title, desc, extra, reverse, children }) => (
  <Split reverse={reverse}>
    <div>
      <H3>{title}</H3>
      <p style={{ ...TYPE.body, fontSize: 15, color: 'rgba(26,26,24,.55)', marginTop: 10, maxWidth: 380 }}>{desc}</p>
      {extra}
    </div>
    {children}
  </Split>
);

export const Flow = ({ steps }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    {steps.map((s, i) => (
      <div key={s.title} style={{ display: 'flex', alignItems: 'flex-start', flex: i < steps.length - 1 ? 1 : '0 0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 64 }}>
          <div style={{ width: 30, height: 30, border: `1px solid ${s.hi ? 'var(--acc)' : INK}`, background: s.hi ? 'var(--acc)' : 'transparent', color: s.hi ? '#fff' : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', ...TYPE.label, letterSpacing: 0 }}>{i + 1}</div>
          <div style={{ ...TYPE.small, fontWeight: 600, color: INK }}>{s.title}</div>
          <div style={{ ...TYPE.label, color: DIM }}>{s.sub}</div>
        </div>
        {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: LINE, marginTop: 15, minWidth: 16 }} />}
      </div>
    ))}
  </div>
);

// ── Structure ────────────────────────────────────────────

export const Section = ({ id, title, children }) => {
  const list = useContext(Sections);
  const i = list.findIndex((s) => s.id === id);
  return (
    <section id={id} style={{ padding: '96px 0 0', display: 'flex', flexDirection: 'column', gap: 40, scrollMarginTop: 90 }}>
      <div style={{ borderTop: `1px solid ${INK}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Sq size={6} />
          <span style={{ ...TYPE.label, color: DIM }}>{list[i]?.label}</span>
        </div>
        <h2 style={{ ...TYPE.h2, color: INK, maxWidth: 620 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
};

function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const n = 56, filled = Math.round(pct * n);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 150, display: 'flex', gap: 2, height: 3, pointerEvents: 'none' }}>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ flex: 1, background: i < filled ? 'var(--acc)' : SOFT, transition: 'background .15s' }} />)}
    </div>
  );
}

function Toc({ sections }) {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-15% 0px -70% 0px' }
    );
    sections.forEach(({ id }) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [sections]);
  return (
    <nav aria-label="Table of contents">
      <Label style={{ marginBottom: 18 }}>On this page</Label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <a key={s.id} href={`#${s.id}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              style={{ ...TYPE.small, textDecoration: 'none', display: 'flex', gap: 10, color: on ? INK : DIM, fontWeight: on ? 600 : 400, transition: 'color .15s, border-color .15s' }}>
              <span style={{ width: 6, height: 6, marginTop: 7, flexShrink: 0, background: on ? 'var(--acc)' : 'rgba(26,26,24,.18)', transition: 'background .15s' }} />
              {s.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

const CSS = `
@keyframes ckFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.ck-split.rev>:first-child{order:2}
.ck-grid{display:grid;grid-template-columns:200px minmax(0,1fr);gap:64px;align-items:start}
@media (max-width:860px){
  .ck-grid,.ck-cols,.ck-split{grid-template-columns:1fr!important}
  .ck-split.rev>:first-child{order:0}
  .ck-rail{position:static!important;margin:64px 0 -32px!important}
  .ck-meta>div{border-left:none!important;padding-left:0!important}
}
`;

// ── Page shell ───────────────────────────────────────────

export function CaseLayout({ accent, tags = [], title, subtitle, hero, meta = [], outcomes, note, sections, next, children }) {
  return (
    <Sections.Provider value={sections}>
      <style>{CSS}</style>
      <div style={{ '--acc': accent }}>
        <ProgressBar />

        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '96px 60px 0' }}>
          <div style={{ animation: 'ckFade .5s ease forwards', opacity: 0, marginBottom: 56 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>{tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <h1 style={{ ...TYPE.display, color: INK, marginBottom: 18, maxWidth: 760 }}>{title}</h1>
            <p style={{ ...TYPE.body, color: 'rgba(26,26,24,.55)', maxWidth: 600 }}>{subtitle}</p>
          </div>

          {hero}

          <div className="ck-cols ck-meta" style={{ display: 'grid', gridTemplateColumns: `repeat(${meta.length},minmax(0,1fr))`, borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${LINE}`, marginTop: 56 }}>
            {meta.map(([l, v], i) => (
              <div key={l} style={{ padding: '22px 24px', paddingLeft: i ? 24 : 0, borderLeft: i ? `1px solid ${LINE}` : 'none' }}>
                <Label style={{ marginBottom: 8 }}>{l}</Label>
                <div style={{ ...TYPE.small, fontWeight: 500, color: INK }}>{v}</div>
              </div>
            ))}
          </div>

          {note && <div style={{ marginTop: 32 }}>{note}</div>}

          {outcomes && (
            <div style={{ marginTop: 80 }}>
              <Label style={{ marginBottom: 20 }}>{outcomes.label || 'Key outcomes'}</Label>
              <Cards items={outcomes.items} cols={outcomes.items.length >= 4 ? 4 : outcomes.items.length} />
            </div>
          )}
        </div>

        <div className="ck-grid" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 60px 120px' }}>
          <aside className="ck-rail" style={{ position: 'sticky', top: 110, marginTop: 96 }}><Toc sections={sections} /></aside>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {children}
            <div style={{ marginTop: 112, borderTop: `1px solid ${INK}`, paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
              <div>
                <Label style={{ marginBottom: 8 }}>{next.eyebrow || 'Next case study'}</Label>
                <div style={{ ...TYPE.h3, color: INK }}>{next.title}</div>
              </div>
              <button onClick={next.onNext} style={{ ...TYPE.label, textTransform: 'none', letterSpacing: '.02em', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: INK, fontWeight: 600 }}>
                {next.cta || 'Next case study'} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Sections.Provider>
  );
}
