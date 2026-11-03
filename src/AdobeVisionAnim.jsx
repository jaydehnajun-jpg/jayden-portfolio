// Home-card animation for the Adobe future-vision project, in light mode (a warm gray a shade darker than
// the page). The work is under NDA, so this is a simple, familiar picture of the process, not the product or
// the idea: map the competitive landscape on a 2x2, notice the empty corner, drop an idea into it, then pitch
// it on a slide. Dots are other products; the red dashed corner is the opportunity.
// No readable text. The contents fade out and restart. Plain divs and CSS transitions driven by a stage
// counter; pauses when off-screen and holds a still frame for people who prefer reduced motion.
import { useEffect, useRef, useState } from 'react';

const W = 640, H = 400;
const TICK = 800;
const LAST = 13;            // stages 0..13; 12 fades out, 13 resets while hidden
const RED = '#E3000F';
const INK = '#1A1A18';

// Other products on the landscape: [x, y] centers. The top-right corner is left empty on purpose.
const DOTS = [
  [200, 100], [250, 150], [178, 172],     // appear at stage 2
  [214, 252], [282, 292], [160, 304],     // stage 3
  [382, 252], [452, 300], [420, 226],     // stage 4
];

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage(10); return; }
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
    <div className="vl-wrap" ref={ref} role="img" aria-label="Abstract animation: products are plotted on a 2 by 2 landscape, an empty corner is highlighted as the opportunity, an idea is placed there, and it is pitched on a slide to an audience">
      <style>{`
        .vl-wrap{position:absolute;inset:0;overflow:hidden;background:#E5E1D9}
        .vl-stage{position:absolute;left:50%;top:50%;width:${W}px;height:${H}px;transform-origin:center}
        .vl-stage *{box-sizing:border-box}
        .vl-layer{position:absolute;inset:0;opacity:1;transition:opacity .45s ease}
        .vl-layer.hide{opacity:0}
        .vl-bar{display:block;height:5px;flex:none}
        .vl-map{position:absolute;inset:0;transition:opacity .5s ease}
        .vl-map.dim{opacity:.25}
        .vl-ax-h{position:absolute;left:130px;top:199px;width:380px;height:2px;background:#8f8b82;transform:scaleX(0);transition:transform .7s ease}
        .vl-ax-v{position:absolute;left:319px;top:50px;width:2px;height:300px;background:#8f8b82;transform:scaleY(0);transition:transform .7s ease}
        .vl-ax-h.on,.vl-ax-v.on{transform:none}
        .vl-end{position:absolute;opacity:0;transition:opacity .4s ease .4s}
        .vl-end.on{opacity:1}
        .vl-dot{position:absolute;width:14px;height:14px;background:${INK};transform:scale(0);transition:transform .3s cubic-bezier(.2,1.5,.4,1)}
        .vl-dot.on{transform:scale(1)}
        .vl-lab{position:absolute;opacity:0;transition:opacity .4s ease .15s}
        .vl-lab.on{opacity:1}
        .vl-gap{position:absolute;left:328px;top:58px;width:176px;height:134px;border:1.5px dashed ${RED};background:rgba(227,0,15,0);opacity:0;transition:opacity .4s ease, background .6s ease}
        .vl-gap.on{opacity:1;animation:vlPulse 1.4s ease-in-out infinite}
        .vl-gap.fill{animation:none;background:rgba(227,0,15,.1)}
        @keyframes vlPulse{50%{opacity:.45}}
        .vl-idea{position:absolute;left:407px;top:117px;width:18px;height:18px;background:${RED};transform:scale(0);transition:transform .35s cubic-bezier(.2,1.5,.4,1)}
        .vl-idea.on{transform:scale(1)}
        .vl-ring{position:absolute;left:407px;top:117px;width:18px;height:18px;border:2px solid ${RED};opacity:0}
        .vl-ring.on{animation:vlRing .9s ease-out .15s}
        @keyframes vlRing{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(3.2)}}
        .vl-slide{position:absolute;left:195px;top:92px;width:250px;height:150px;background:#fff;border:1px solid #CFCBC3;box-shadow:0 18px 36px -16px rgba(26,26,24,.35);opacity:0;transform:scale(.92);transition:opacity .4s ease, transform .4s ease}
        .vl-slide.on{opacity:1;transform:none}
        .vl-aud{position:absolute;top:268px;width:16px;height:16px;background:#A8A49A;opacity:0;transform:translateY(6px);transition:opacity .35s ease, transform .35s ease}
        .vl-aud.on{opacity:1;transform:none}
      `}</style>

      <div className="vl-stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
        <div className={`vl-layer${stage >= 12 ? ' hide' : ''}`}>
          <div className={`vl-map${at(9) ? ' dim' : ''}`}>
            <div className={`vl-ax-h${at(1) ? ' on' : ''}`} />
            <div className={`vl-ax-v${at(1) ? ' on' : ''}`} />
            <div className={`vl-end${at(1) ? ' on' : ''}`} style={{ left: 134, top: 208 }}><Bar w={30} /></div>
            <div className={`vl-end${at(1) ? ' on' : ''}`} style={{ left: 476, top: 208 }}><Bar w={30} /></div>
            <div className={`vl-end${at(1) ? ' on' : ''}`} style={{ left: 328, top: 54 }}><Bar w={30} /></div>
            <div className={`vl-end${at(1) ? ' on' : ''}`} style={{ left: 328, top: 336 }}><Bar w={30} /></div>

            {DOTS.map(([x, y], i) => {
              const on = at(2 + Math.floor(i / 3));
              return (
                <span key={i}>
                  <i className={`vl-dot${on ? ' on' : ''}`} style={{ left: x - 7, top: y - 7, transitionDelay: `${(i % 3) * 110}ms` }} />
                  {i % 2 === 0 && <span className={`vl-lab${on ? ' on' : ''}`} style={{ left: x + 14, top: y - 2 }}><Bar w={[28, 22, 32, 26, 24][i / 2]} /></span>}
                </span>
              );
            })}

            <div className={`vl-gap${at(5) ? ' on' : ''}${at(7) ? ' fill' : ''}`} />
            <div className={`vl-ring${at(7) ? ' on' : ''}`} />
            <div className={`vl-idea${at(7) ? ' on' : ''}`} />
          </div>

          <div className={`vl-slide${at(9) ? ' on' : ''}`}>
            <div style={{ position: 'absolute', left: 30, top: 38, width: 40, height: 40, background: RED }} />
            <div style={{ position: 'absolute', left: 100, top: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Bar w={110} c={INK} style={{ height: 8 }} />
              <Bar w={96} />
              <Bar w={72} />
            </div>
          </div>
          {[0, 1, 2, 3, 4].map((i) => <i key={i} className={`vl-aud${at(9) ? ' on' : ''}`} style={{ left: 245 + i * 30, transitionDelay: `${i * 80}ms` }} />)}
        </div>
      </div>
    </div>
  );
}
