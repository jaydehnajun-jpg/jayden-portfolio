// Home-card animation for the Adobe future-vision project, in light mode (a warm gray a shade darker than
// the page). The work is under NDA, so this is a generic, low-fi illustration, not the product or the idea:
// a wireframe of an AI image and video generation tool. A prompt types in, Generate is pressed, the canvas
// fills in, and a timeline of frames plays. Then everything eases back to the start (no fade to blank).
// No readable text. Plain divs and CSS transitions driven by a stage counter; pauses when off-screen and
// holds a still frame for people who prefer reduced motion.
import { useEffect, useRef, useState } from 'react';

const W = 640, H = 400;
const TICK = 800;
const LAST = 8;             // stages 0..8; stage 8 eases everything back to the start state
const RED = '#E3000F';

// The generated "image" on the canvas: 8 x 5 tiles.
const SKY = ['#E9B9CB', '#EFC4D4'];
const tileColor = (r, c) => {
  if (r <= 1 && (c === 5 || c === 6)) return '#F6E04D';             // sun
  if (r === 4) return c === 2 || c === 3 ? '#7C8827' : '#8E9B2F';  // hill base
  if (r === 3 && c <= 4) return '#8E9B2F';                          // hill step
  return SKY[(r + c) % 2];
};
const FRAMES = ['#E9B9CB', '#EFC4D4', '#F4C84A', '#E9B9CB', '#8E9B2F', '#E9B9CB', '#F4C84A', '#EFC4D4', '#E9B9CB', '#8E9B2F'];

const Bar = ({ w, c = '#BDB9B0', style }) => <i className="vl-bar" style={{ width: w, background: c, ...style }} />;

export default function AdobeVisionAnim() {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.7);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / W, e.contentRect.height / H)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage(6); return; }
    let timer = null;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setStage((s) => (s + 1) % (LAST + 1)), TICK);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, []);

  const s = stage === LAST ? 0 : stage;
  const at = (n) => s >= n;

  return (
    <div className="vl-wrap" ref={ref} role="img" aria-label="Abstract animation: a low-fidelity wireframe of an AI image and video generation tool, where a prompt is entered, the canvas fills in, and a timeline of frames plays">
      <style>{`
        .vl-wrap{position:absolute;inset:0;overflow:hidden;background:#E5E1D9}
        .vl-stage{position:absolute;left:50%;top:50%;width:${W}px;height:${H}px;transform-origin:center}
        .vl-stage *{box-sizing:border-box}
        .vl-bar{display:block;height:5px;flex:none}
        .vl-card{position:absolute;left:60px;top:39px;width:520px;height:322px;background:#fff;border:1px solid #CFCBC3;box-shadow:0 18px 36px -16px rgba(26,26,24,.3)}
        .vl-card .abs{position:absolute}

        .vl-prompt{left:16px;top:48px;width:150px;height:84px;background:#F4F3EF;border:1px solid #E0DDD6;padding:14px 12px}
        .vl-type{display:flex;flex-direction:column;gap:10px;overflow:hidden;width:0;transition:width .4s ease}
        .vl-type.on{width:124px;transition:width 1.1s steps(12,end)}
        .vl-chip{top:142px;width:44px;height:18px;background:#E8E6E0}
        .vl-track{left:16px;width:150px;height:2px;background:#D5D2CB}
        .vl-handle{position:absolute;top:-5px;width:8px;height:12px;background:#9a968d}
        .vl-btn{left:16px;top:212px;width:150px;height:34px;background:${RED};display:flex;align-items:center;justify-content:center;transition:transform .2s ease}
        .vl-btn.press{transform:scale(.95)}

        .vl-canvas{left:182px;top:48px;width:322px;height:198px;background:#ECEAE4;border:1px solid #DAD7D0;overflow:hidden;
          background-image:linear-gradient(to top right,transparent calc(50% - .75px),#CFCBC3 calc(50% - .75px),#CFCBC3 calc(50% + .75px),transparent calc(50% + .75px)),linear-gradient(to bottom right,transparent calc(50% - .75px),#CFCBC3 calc(50% - .75px),#CFCBC3 calc(50% + .75px),transparent calc(50% + .75px))}
        .vl-tiles{position:absolute;inset:0;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(5,1fr)}
        .vl-tiles i{opacity:0;transition:opacity .4s ease}
        .vl-tiles.on i{opacity:1}

        .vl-frames{left:18px;top:268px;width:486px;height:46px;display:flex;gap:6px}
        .vl-frames i{flex:1;background:#E8E6E0;transition:background .4s ease}
        .vl-play{left:18px;top:262px;width:2px;height:58px;background:${RED};opacity:0;transform:translateX(0);transition:transform .5s ease, opacity .3s ease}
        .vl-play.on{opacity:1;transform:translateX(482px);transition:transform 1.9s linear, opacity .3s ease}
      `}</style>

      <div className="vl-stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
        <div className="vl-card">
          <div className="abs" style={{ left: 14, top: 13, display: 'flex', gap: 6 }}>{[0, 1, 2].map((i) => <i key={i} style={{ width: 6, height: 6, background: '#C9C5BC' }} />)}</div>
          <div className="abs" style={{ left: 214, top: 14 }}><Bar w={92} /></div>

          <div className="abs vl-prompt">
            <div className={`vl-type${at(1) ? ' on' : ''}`}>
              <Bar w={112} c="#4a4743" />
              <Bar w={96} c="#8f8b82" />
              <Bar w={64} c="#8f8b82" />
            </div>
          </div>
          {[0, 1, 2].map((i) => <i key={i} className="abs vl-chip" style={{ left: 16 + i * 53 }} />)}
          <div className="abs vl-track" style={{ top: 178 }}><i className="vl-handle" style={{ left: '38%' }} /></div>
          <div className="abs vl-track" style={{ top: 198 }}><i className="vl-handle" style={{ left: '68%' }} /></div>
          <div className={`abs vl-btn${s === 2 ? ' press' : ''}`}><Bar w={52} c="#fff" /></div>

          <div className="abs vl-canvas">
            <div className={`vl-tiles${at(3) ? ' on' : ''}`}>
              {Array.from({ length: 40 }, (_, i) => {
                const r = Math.floor(i / 8), c = i % 8;
                return <i key={i} style={{ background: tileColor(r, c), transitionDelay: `${(i * 53) % 420}ms` }} />;
              })}
            </div>
          </div>

          <div className="abs vl-frames">
            {FRAMES.map((c, i) => <i key={i} style={{ background: at(5) ? c : undefined, transitionDelay: `${i * 150}ms` }} />)}
          </div>
          <div className={`abs vl-play${at(5) ? ' on' : ''}`} />
        </div>
      </div>
    </div>
  );
}
