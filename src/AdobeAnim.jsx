// Home-card animation for the Adobe project (third-party tooling). The real work is under NDA, so this is
// a deliberately abstract illustration of the idea: a conversation with an AI app that extends into direct
// controls. Text is shown as gray placeholder bars so it reads as a diagram, not a screenshot. A prompt
// produces a design, a section gets brushed, another gets a pinned comment, and only those parts change.
// The Claude, ChatGPT and Slack marks sit around the demo and drift gently, since the same controls are
// meant to work in each. The contents fade out and restart; the frame and the logos stay put.
//
// Logo marks live in /assets/Logos/ (claude.png, chatgpt.png, slack.png). If a file is missing, a generic
// glyph shows instead. Light mode, to match the rest of the site.
//
// Plain divs and CSS transitions driven by a stage counter; pauses when off-screen and holds a still frame
// for people who prefer reduced motion.
import { useEffect, useRef, useState } from 'react';

const W = 640, H = 400;     // logical stage size, scaled to fit the card
const TICK = 800;           // ms per stage
const LAST = 15;            // stages 0..15; 14 fades out, 15 resets while hidden
const RED = '#E3000F';

const ICONS = {
  brush: ['......##', '.....###', '....###.', '...###..', '..###...', '.##.....', '##......'],
  comment: ['########', '#......#', '#......#', '#......#', '########', '..##....', '..#.....'],
  spark: ['...#...', '...#...', '..###..', '#######', '..###..', '...#...', '...#...'],
};

// Where each mark sits around the demo, and how it drifts (duration, delay, tilt).
const LOGOS = [
  { id: 'claude', src: '/assets/Logos/claude.png', left: 12, top: 6, tilt: -6, dur: 4.2, delay: 0, glyph: ['#..#..#', '.#.#.#.', '..###..', '#######', '..###..', '.#.#.#.', '#..#..#'] },
  { id: 'chatgpt', src: '/assets/Logos/chatgpt.png', left: 542, top: 140, tilt: 5, dur: 4.8, delay: -1.6, glyph: ['.#####.', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '.#####.'] },
  { id: 'slack', src: '/assets/Logos/slack.png', left: 40, top: 306, tilt: 4, dur: 4.5, delay: -3, glyph: ['..#.#..', '..#.#..', '#######', '..#.#..', '#######', '..#.#..', '..#.#..'] },
];

function Px({ rows, color, size = 2 }) {
  const w = rows[0].length;
  return (
    <svg width={w * size} height={rows.length * size} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((r, y) => [...r].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} /> : null)))}
    </svg>
  );
}

function Logo({ logo, i }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="aa-logo" style={{ left: logo.left, top: logo.top, animationDelay: `${0.15 + i * 0.2}s` }}>
      <div className="aa-bob" style={{ '--t': `${logo.tilt}deg`, animationDuration: `${logo.dur}s`, animationDelay: `${logo.delay}s` }}>
        {ok ? (
          <img src={logo.src} width="84" height="84" alt="" onError={() => setOk(false)} style={{ display: 'block', filter: 'none' }} />
        ) : (
          <Px rows={logo.glyph} color="#1A1A18" size={11} />
        )}
      </div>
    </div>
  );
}

const Bar = ({ w, c = '#BDB9B0', style }) => <i className="aa-bar" style={{ width: w, background: c, ...style }} />;

// Cursor positions (in the canvas panel's coordinates) for each stage.
const CURSOR = { 5: [76, 17], 6: [44, 80], 7: [186, 80], 8: [100, 17], 9: [192, 118], 10: [192, 118], 11: [124, 17] };

export default function AdobeAnim() {
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

  const s = stage === LAST ? 0 : stage;   // the reset frame happens while the contents are faded out
  const at = (n) => s >= n;
  const tool = at(12) ? 'spark' : at(8) ? 'comment' : 'brush';
  const cur = CURSOR[Math.min(s, 11)];
  const done = at(12);

  return (
    <div className="aa-wrap" ref={ref} role="img" aria-label="Abstract animation: a prompt makes a design, then a brushed section and a pinned comment refine just those parts, with the Claude, ChatGPT and Slack logos around it">
      <style>{`
        .aa-wrap{position:absolute;inset:0;overflow:hidden;background:#E5E1D9}
        .aa-stage{position:absolute;left:50%;top:50%;width:${W}px;height:${H}px;transform-origin:center}
        .aa-stage *{box-sizing:border-box}
        .aa-demo{position:absolute;left:22px;top:18px;width:596px;height:364px;transform:scale(.8);transform-origin:center}
        .aa-win{position:absolute;inset:0;background:#F7F6F3;border:1px solid #DAD7D0}
        .aa-dots{position:absolute;left:12px;top:9px;display:flex;gap:6px}
        .aa-dots i{width:6px;height:6px;background:#C9C5BC}
        .aa-layer{position:absolute;inset:0;opacity:1;transition:opacity .45s ease}
        .aa-layer.hide{opacity:0}
        .aa-bar{display:block;height:6px;flex:none}
        .aa-fade{opacity:0;transition:opacity .35s ease, transform .35s ease;transform:translateY(4px)}
        .aa-fade.on{opacity:1;transform:none}
        .aa-bubble{position:absolute;left:16px;background:#E8E6E0;padding:9px 10px}
        .aa-type{display:block;overflow:hidden;width:0;transition:width 1.1s steps(12,end)}
        .aa-agent{position:absolute;left:16px;display:flex;gap:8px;align-items:center}
        .aa-agent b{width:12px;height:12px;background:#1A1A18;flex:none}
        .aa-pinchip{display:inline-block;width:12px;height:12px;background:${RED};color:#fff;font:700 8px/12px 'DM Mono',monospace;text-align:center;margin-right:8px;vertical-align:middle}
        .aa-composer{position:absolute;left:16px;top:318px;width:236px;height:30px;background:#fff;border:1px solid #D5D2CB;display:flex;align-items:center;padding:0 34px 0 10px}
        .aa-composer i.send{position:absolute;right:6px;top:6px;width:16px;height:16px;background:#1A1A18}
        .aa-canvas{position:absolute;left:268px;top:30px;width:312px;height:322px;background:#fff;border:1px solid #E0DDD6}
        .aa-poster{position:absolute;left:28px;top:34px;width:176px;height:248px;background:#F1EAD6;opacity:0;transform:scale(.94);transition:opacity .5s ease, transform .5s ease}
        .aa-poster.on{opacity:1;transform:none}
        .aa-poster.pop{animation:aaPop .45s ease}
        @keyframes aaPop{50%{transform:scale(1.03)}}
        .aa-head{position:absolute;left:12px;top:12px;width:152px;height:62px;background:#8E9B2F;display:flex;align-items:center;justify-content:center;transition:background .5s ease}
        .aa-head.new{background:#E26D9A}
        .aa-img{position:absolute;left:12px;top:84px;width:152px;height:112px;background:#E9B9CB;overflow:hidden;transition:background .5s ease}
        .aa-img.new{background:#F4C84A}
        .aa-sun{position:absolute;left:96px;top:14px;width:36px;height:36px;background:#F6E04D;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);transition:background .5s ease}
        .aa-img.new .aa-sun{background:#fff}
        .aa-hill{position:absolute;left:0;bottom:0;width:104px;height:44px;background:#8E9B2F;clip-path:polygon(0 100%,0 40%,24% 40%,24% 20%,52% 20%,52% 0,76% 0,76% 36%,100% 36%,100% 100%)}
        .aa-tag{position:absolute;left:12px;top:206px;width:92px;height:30px;background:#F2F04A;display:flex;align-items:center;justify-content:center}
        .aa-sq{position:absolute;top:214px;width:12px;height:12px}
        .aa-brush{position:absolute;left:40px;top:46px;width:152px;height:62px;border:1px solid ${RED};background:repeating-linear-gradient(135deg,rgba(227,0,15,.5) 0 6px,rgba(227,0,15,.28) 6px 12px);clip-path:inset(0 100% 0 0);transition:clip-path 1s linear, opacity .4s ease}
        .aa-brush.on{clip-path:inset(0 0 0 0)}
        .aa-brush.gone{opacity:0}
        .aa-tools{position:absolute;left:64px;top:6px;width:104px;height:24px;background:#fff;border:1px solid #CFCBC3;display:flex;opacity:0;transition:opacity .3s ease}
        .aa-tools.on{opacity:1}
        .aa-tools span{width:24px;height:22px;display:flex;align-items:center;justify-content:center;transition:background .25s ease}
        .aa-tools span.act{background:${RED}}
        .aa-pin{position:absolute;left:185px;top:111px;width:14px;height:14px;background:${RED};color:#fff;font:700 9px/14px 'DM Mono',monospace;text-align:center;transform:scale(0);transition:transform .25s ease, opacity .4s ease}
        .aa-pin.on{transform:scale(1)}
        .aa-note{position:absolute;left:206px;top:104px;width:96px;padding:8px 8px;background:#fff;border:1px solid ${RED};display:flex;flex-direction:column;gap:5px;opacity:0;transform:translateY(3px);transition:opacity .3s ease, transform .3s ease}
        .aa-note.on{opacity:1;transform:none}
        .aa-cursor{position:absolute;left:0;top:0;width:12px;height:17px;background:#1A1A18;clip-path:polygon(0 0,0 100%,30% 76%,52% 100%,68% 90%,46% 66%,100% 66%);filter:drop-shadow(0 1px 0 #fff);transition:opacity .25s ease}

        .aa-logo{position:absolute;width:84px;height:84px;opacity:0;animation:aaLogoIn .9s ease-out forwards}
        @keyframes aaLogoIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}
        .aa-bob{animation:aaBob 4.5s ease-in-out infinite alternate}
        @keyframes aaBob{from{transform:translateY(0) rotate(calc(var(--t) * -.5))}to{transform:translateY(-7px) rotate(var(--t))}}
        @media (prefers-reduced-motion:reduce){.aa-bob{animation:none}}
      `}</style>

      <div className="aa-stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
        <div className="aa-demo">
          <div className="aa-win">
            <div className="aa-dots"><i /><i /><i /></div>

            {/* everything below fades out to restart; the frame stays */}
            <div className={`aa-layer${stage >= 14 ? ' hide' : ''}`}>
              <div className={`aa-bubble aa-fade${at(1) ? ' on' : ''}`} style={{ top: 44 }}>
                <span className="aa-type" style={{ width: at(1) ? 120 : 0 }}>
                  <Bar w={120} c="#4a4743" />
                  <Bar w={78} c="#8f8b82" style={{ marginTop: 5 }} />
                </span>
              </div>

              <div className={`aa-agent aa-fade${at(3) ? ' on' : ''}`} style={{ top: 96 }}><b /><Bar w={104} /></div>
              <div className={`aa-agent aa-fade${at(5) ? ' on' : ''}`} style={{ top: 120 }}><b /><Bar w={88} /></div>
              <div className={`aa-bubble aa-fade${at(10) ? ' on' : ''}`} style={{ top: 150 }}><span className="aa-pinchip">1</span><Bar w={64} c="#4a4743" style={{ display: 'inline-block', verticalAlign: 'middle' }} /></div>
              <div className={`aa-agent aa-fade${at(12) ? ' on' : ''}`} style={{ top: 194 }}><b /><Bar w={96} /></div>

              <div className="aa-composer"><Bar w={96} c="#C9C5BC" /><i className="send" /></div>

              <div className="aa-canvas">
                <div className={`aa-poster${at(3) ? ' on' : ''}${s === 12 ? ' pop' : ''}`}>
                  <div className={`aa-head${done ? ' new' : ''}`}><Bar w={84} c="#F1EAD6" style={{ height: 10 }} /></div>
                  <div className={`aa-img${done ? ' new' : ''}`}><div className="aa-sun" /><div className="aa-hill" /></div>
                  <div className="aa-tag"><Bar w={48} c="#8a8a2a" style={{ height: 8 }} /></div>
                  <i className="aa-sq" style={{ left: 120, background: '#E26D9A' }} />
                  <i className="aa-sq" style={{ left: 136, background: '#8E9B2F' }} />
                  <i className="aa-sq" style={{ left: 152, background: RED }} />
                </div>

                <div className={`aa-brush${at(7) ? ' on' : ''}${done ? ' gone' : ''}`} />
                <div className={`aa-tools${at(5) ? ' on' : ''}`}>
                  {['brush', 'comment', 'spark'].map((t) => (
                    <span key={t} className={tool === t ? 'act' : ''}><Px rows={ICONS[t]} color={tool === t ? '#fff' : '#7a766d'} /></span>
                  ))}
                </div>
                <div className={`aa-pin${at(9) && !done ? ' on' : ''}`}>1</div>
                <div className={`aa-note${at(10) && !done ? ' on' : ''}`}><Bar w={72} c="#4a4743" /><Bar w={52} c="#A9A59C" /></div>

                <div className="aa-cursor" style={{
                  transform: `translate(${cur ? cur[0] : 76}px, ${cur ? cur[1] : 17}px)`,
                  opacity: at(5) && !done ? 1 : 0,
                  transition: `transform ${s === 7 ? '1s linear' : '.45s ease'}, opacity .25s ease`,
                }} />
              </div>
            </div>
          </div>
        </div>

        {LOGOS.map((l, i) => <Logo key={l.id} logo={l} i={i} />)}
      </div>
    </div>
  );
}
