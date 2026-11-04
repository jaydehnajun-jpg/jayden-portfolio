// Thumbnail animations for the Experimentation grid: Google Maps, AI AAC device, Zuora design system and the
// Nordstrom gift-finder study. Each is a small stylized loop of what the project is about (not a screenshot),
// drawn in plain divs and driven by a stage counter with CSS transitions, same approach as AdobeAnim.jsx.
// They pause off-screen, hold a still frame for reduced motion, and fade out/in to restart.
import { useEffect, useRef, useState } from 'react';

const W = 640, H = 400;   // logical stage, scaled to fit the tile
const TICK = 800;         // ms per stage

const BASE_CSS = `
.ex-wrap{position:absolute;inset:0;overflow:hidden;background:#E5E1D9}
.ex-stage{position:absolute;left:50%;top:50%;width:${W}px;height:${H}px;transform-origin:center}
.ex-stage *{box-sizing:border-box}
.ex-fade{position:absolute;inset:0;transition:opacity .45s ease}
.ex-fade.hide{opacity:0}
.ex-bar{display:block;height:6px;flex:none}
`;

// Scales the stage to the tile, ticks the stage counter while visible, and shows one still frame for reduced motion.
function ExStage({ label, last, still, css, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.7);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / W, e.contentRect.height / H)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage(still); return; }
    let timer = null;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = setInterval(() => setStage((s) => (s + 1) % (last + 1)), TICK);
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [last, still]);

  const s = stage === last ? 0 : stage;   // the reset frame happens while everything is faded out
  return (
    <div className="ex-wrap" ref={ref} role="img" aria-label={label}>
      <style>{BASE_CSS + css}</style>
      <div className="ex-stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
        <div className={`ex-fade${stage >= last - 1 ? ' hide' : ''}`}>{children(s)}</div>
      </div>
    </div>
  );
}

const Bar = ({ w, c = '#BDB9B0', h = 6, style }) => <i className="ex-bar" style={{ width: w, height: h, background: c, ...style }} />;

// ─────────────────────────────────────────────── Google Maps: stops get added, the route reorders itself, then it's saved
const ROADS_H = [40, 90, 150, 230, 290, 318];
const ROADS_V = [20, 90, 200, 300, 380, 460, 500];
const PINS = [
  { id: 'A', x: 90, y: 290, start: true },
  { id: 'B', x: 460, y: 90, at: 1 },
  { id: 'C', x: 200, y: 150, at: 2 },
  { id: 'D', x: 460, y: 230, at: 3 },
];
const ROUTE_BAD = 'M90 290 H300 V90 H460 V150 H200 V230 H460';   // A, B, C, D in the order they were added
const ROUTE_GOOD = 'M90 290 V150 H200 V90 H460 V230';              // A, C, B, D

export function MapsAnim() {
  const css = `
    .xm-card{position:absolute;left:60px;top:35px;width:520px;height:330px;background:#EFEBE3;border:1px solid #D2CEC5;overflow:hidden;box-shadow:0 18px 36px -18px rgba(26,26,24,.35)}
    .xm-card .a{position:absolute}
    .xm-road-h{height:9px;left:0;width:100%;background:#fff;border-top:1px solid #E2DDD2;border-bottom:1px solid #E2DDD2}
    .xm-road-v{width:9px;top:0;height:100%;background:#fff;border-left:1px solid #E2DDD2;border-right:1px solid #E2DDD2}
    .xm-svg{position:absolute;inset:0}
    .xm-route{fill:none;stroke-width:5;stroke-linecap:square;stroke-linejoin:miter;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.5s ease-in-out}
    .xm-route.bad{stroke:#E39A3B}
    .xm-route.good{stroke:#1A73E8;stroke-width:6}
    .xm-route.draw{stroke-dashoffset:0}
    .xm-route.bad.gone{visibility:hidden}
    .xm-pin{width:24px;height:24px;margin:-12px 0 0 -12px;background:#EA4335;color:#fff;font:700 12px/24px 'Open Sauce Sans',sans-serif;text-align:center;visibility:hidden;transform:translateY(-22px);transition:transform .4s cubic-bezier(.3,1.7,.5,1)}
    .xm-pin.start{background:#1A73E8;box-shadow:0 0 0 6px rgba(26,115,232,.2)}
    .xm-pin.on{visibility:visible;transform:none}
    .xm-chip{position:absolute;left:14px;top:14px;height:30px;padding:0 12px;color:#fff;font:700 13px/30px 'Open Sauce Sans',sans-serif;visibility:hidden;transform:translateY(6px);transition:transform .3s ease}
    .xm-chip.on{visibility:visible;transform:none}
    .xm-add{position:absolute;right:14px;top:14px;height:30px;padding:0 12px;background:#fff;border:1px solid #D2CEC5;display:flex;align-items:center;gap:8px;visibility:hidden}
    .xm-add.on{visibility:visible}
    .xm-add i{width:10px;height:10px;position:relative;display:block}
    .xm-add i::before,.xm-add i::after{content:"";position:absolute;background:#1A73E8}
    .xm-add i::before{left:4px;top:0;width:2px;height:10px}.xm-add i::after{left:0;top:4px;width:10px;height:2px}
    .xm-star{position:absolute;right:14px;top:14px;width:34px;height:34px;background:#fff;border:1px solid #D2CEC5;display:flex;align-items:center;justify-content:center;visibility:hidden;transform:scale(.6);transition:transform .4s cubic-bezier(.3,1.7,.5,1)}
    .xm-star.on{visibility:visible;transform:none}
    .xm-star i{width:18px;height:18px;background:#F6B400;clip-path:polygon(50% 0,62% 36%,100% 38%,70% 60%,80% 100%,50% 76%,20% 100%,30% 60%,0 38%,38% 36%)}
  `;
  return (
    <ExStage label="Animation: stops are added to a map, the route reorders to a faster order, and the route is saved" last={11} still={8} css={css}>
      {(s) => (
        <div className="xm-card">
          <div className="a" style={{ left: 20, top: 160, width: 62, height: 60, background: '#CFE3C2' }} />
          <div className="a" style={{ left: 310, top: 240, width: 140, height: 70, background: '#BFD9EA' }} />
          <div className="a" style={{ left: 210, top: 160, width: 80, height: 60, background: '#DCE8CF' }} />
          {ROADS_H.map((y) => <i key={y} className="a xm-road-h" style={{ top: y - 4 }} />)}
          {ROADS_V.map((x) => <i key={x} className="a xm-road-v" style={{ left: x - 4 }} />)}
          <svg className="xm-svg" viewBox="0 0 520 330">
            <path pathLength="1" className={`xm-route bad${s >= 4 ? ' draw' : ''}${s >= 6 ? ' gone' : ''}`} d={ROUTE_BAD} />
            <path pathLength="1" className={`xm-route good${s >= 6 ? ' draw' : ''}`} d={ROUTE_GOOD} />
          </svg>
          {PINS.map((p) => <div key={p.id} className={`a xm-pin${p.start ? ' start' : ''}${p.start || s >= p.at ? ' on' : ''}`} style={{ left: p.x, top: p.y }}>{p.start ? '' : p.id}</div>)}
          <div className={`xm-chip${s >= 4 && s < 6 ? ' on' : ''}`} style={{ background: '#E39A3B' }}>39 min</div>
          <div className={`xm-chip${s >= 6 ? ' on' : ''}`} style={{ background: '#1A73E8' }}>23 min · fastest</div>
          <div className={`xm-add${s >= 1 && s < 4 ? ' on' : ''}`}><i /><Bar w={44} c="#9aa0a6" /></div>
          <div className={`xm-star${s >= 8 ? ' on' : ''}`}><i /></div>
        </div>
      )}
    </ExStage>
  );
}

// ─────────────────────────────────────────────── AI AAC device: tap symbols to build a sentence, the AI suggests the next one
const SYM = { y: '#F6D54D', p: '#EE8FB5', g: '#8EBB57', o: '#F29A4A', b: '#6FA8E8' };
const TILES = ['y', 'y', 'y', 'p', 'g', 'g', 'g', 'b', 'o', 'o', 'o', 'b'];
const SHAPES = ['sq', 'dia', 'tri', 'plus', 'oct', 'ring', 'bars', 'dia', 'sq', 'oct', 'tri', 'ring'];
const Glyph = ({ k, c = '#1A1A18' }) => <i className={`xa-g ${k}`} style={{ '--c': c }} />;

export function AACAnim() {
  const css = `
    .xa-dev{position:absolute;left:70px;top:40px;width:500px;height:320px;background:#1A1A18;padding:10px;box-shadow:0 20px 40px -18px rgba(26,26,24,.5)}
    .xa-scr{position:relative;width:100%;height:100%;background:#F7F3EA;overflow:hidden}
    .xa-scr .a{position:absolute}
    .xa-slot{top:14px;width:112px;height:50px;border:2px dashed #D8D2C4;display:flex;align-items:center;justify-content:center;transition:background .25s ease, border-color .25s ease}
    .xa-slot.full{border:2px solid transparent;animation:xaPop .35s ease}
    @keyframes xaPop{50%{transform:scale(1.07)}}
    .xa-say{left:404px;top:14px;width:62px;height:50px;background:#1A1A18;display:flex;align-items:center;justify-content:center;gap:4px}
    .xa-say b{width:5px;background:#F7F3EA;height:10px;display:block}
    .xa-say.on b{animation:xaWave .5s ease-in-out infinite alternate}
    .xa-say.on b:nth-child(2){animation-delay:.12s}.xa-say.on b:nth-child(3){animation-delay:.24s}.xa-say.on b:nth-child(4){animation-delay:.08s}
    @keyframes xaWave{from{height:8px}to{height:28px}}
    .xa-tile{width:86px;height:62px;display:flex;align-items:center;justify-content:center;transition:transform .15s ease, box-shadow .3s ease}
    .xa-tile.press{transform:scale(.9)}
    .xa-tile.glow{animation:xaGlow 1s ease-in-out infinite;z-index:2}
    @keyframes xaGlow{50%{box-shadow:0 0 0 6px rgba(26,26,24,.9);transform:scale(1.06)}}
    .xa-spark{width:8px;height:8px;background:#1A1A18;visibility:hidden}
    .xa-spark.on{visibility:visible;animation:xaSpark 1s ease-in-out infinite}
    @keyframes xaSpark{50%{transform:scale(.4) rotate(45deg)}}
    .xa-rail{left:398px;width:68px;height:60px;border:2px solid #E3DECF;display:flex;align-items:center;justify-content:center}
    .xa-rail.now{border-color:#1A1A18;background:#fff}
    .xa-g{display:block;width:20px;height:20px;background:var(--c);position:relative}
    .xa-g.dia{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
    .xa-g.tri{clip-path:polygon(50% 0,100% 100%,0 100%)}
    .xa-g.oct{clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)}
    .xa-g.ring{background:none;border:4px solid var(--c)}
    .xa-g.plus{background:none}
    .xa-g.plus::before,.xa-g.plus::after{content:"";position:absolute;background:var(--c)}
    .xa-g.plus::before{left:8px;top:0;width:4px;height:20px}.xa-g.plus::after{left:0;top:8px;width:20px;height:4px}
    .xa-g.bars{background:repeating-linear-gradient(to bottom,var(--c) 0 4px,transparent 4px 8px)}
  `;
  const slots = [[0, 1], [4, 3], [9, 6]];   // [tile index, stage it gets added]
  return (
    <ExStage label="Animation: a child taps symbols on an AAC tablet to build a sentence, and the AI highlights the next likely symbol" last={10} still={7} css={css}>
      {(s) => (
        <div className="xa-dev"><div className="xa-scr">
          {slots.map(([t, at], i) => (
            <div key={i} className={`a xa-slot${s >= at ? ' full' : ''}`} style={{ left: 14 + i * 122, background: s >= at ? SYM[TILES[t]] : 'transparent' }}>
              {s >= at && <Glyph k={SHAPES[t]} />}
            </div>
          ))}
          <div className={`a xa-say${s >= 7 && s < 9 ? ' on' : ''}`}><b /><b /><b /><b /></div>
          {TILES.map((c, i) => {
            const pressed = (i === 0 && s === 1) || (i === 4 && s === 3) || (i === 9 && s === 6);
            return (
              <div key={i} className={`a xa-tile${pressed ? ' press' : ''}${i === 9 && s === 5 ? ' glow' : ''}`} style={{ left: 14 + (i % 4) * 94, top: 84 + Math.floor(i / 4) * 70, background: SYM[c] }}>
                <Glyph k={SHAPES[i]} />
              </div>
            );
          })}
          <i className={`a xa-spark${s === 5 ? ' on' : ''}`} style={{ left: 316, top: 150 }} />
          <i className={`a xa-spark${s === 5 ? ' on' : ''}`} style={{ left: 340, top: 140, animationDelay: '.3s' }} />
          {[0, 1, 2].map((i) => <div key={i} className={`a xa-rail${i === 0 ? ' now' : ''}`} style={{ top: 84 + i * 70 }}><Glyph k={['sq', 'dia', 'oct'][i]} c={i === 0 ? '#1A1A18' : '#CFC9B8'} /></div>)}
        </div></div>
      )}
    </ExStage>
  );
}

// ─────────────────────────────────────────────── Zuora: accessible colors, then components snapping into one grid
const SWATCHES = ['#1B7F6B', '#2FB297', '#CDE8DF', '#F1EAD6', '#FFFFFF'];
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 6 6" shapeRendering="crispEdges"><path d="M0 3h1v1h1v1h1V4h1V3h1V2h-1v1H4v1H3v1H2V4H1V3z" fill="#0E4945" /></svg>
);

export function ZuoraAnim() {
  const css = `
    .xz-card{position:absolute;left:50px;top:30px;width:540px;height:340px;background:#0E4945;box-shadow:0 18px 36px -18px rgba(14,73,69,.7)}
    .xz-card .a{position:absolute}
    .xz-sw{top:18px;width:92px;height:34px;visibility:hidden;transform:translateY(8px);transition:transform .35s cubic-bezier(.3,1.5,.5,1)}
    .xz-sw.on{visibility:visible;transform:none}
    .xz-badge{right:4px;bottom:4px;width:16px;height:16px;background:#fff;display:flex;align-items:center;justify-content:center;transform:scale(0);transition:transform .3s cubic-bezier(.3,1.7,.5,1)}
    .xz-badge.on{transform:scale(1)}
    .xz-slot{width:160px;height:118px;border:1px dashed rgba(255,255,255,.28)}
    .xz-comp{display:flex;flex-direction:column;gap:10px;padding:14px;background:#F4F1E8;visibility:hidden;transform:scale(.9);transition:transform .4s cubic-bezier(.3,1.5,.5,1)}
    .xz-comp.on{visibility:visible;transform:none}
    .xz-row{display:flex;gap:8px;align-items:center}
    .xz-btn{height:26px;flex:none}
    .xz-field{height:28px;border:1.5px solid #9AA89F;background:#fff;display:flex;align-items:center;padding:0 8px}
    .xz-field.focus{border-color:#1B7F6B;box-shadow:0 0 0 3px rgba(27,127,107,.25)}
    .xz-tog{width:34px;height:18px;background:#1B7F6B;position:relative;flex:none}
    .xz-tog::after{content:"";position:absolute;right:2px;top:2px;width:14px;height:14px;background:#fff}
    .xz-chk{width:16px;height:16px;flex:none;border:2px solid #1B7F6B}
    .xz-chk.fill{background:#1B7F6B}
    .xz-bars{display:flex;align-items:flex-end;gap:7px;height:54px}
    .xz-bars i{flex:1;background:#2FB297;transform-origin:bottom;animation:none}
    .xz-guide{background:#7CF2D2;visibility:hidden}
    .xz-guide.on{visibility:visible}
  `;
  const COL = [25, 195, 365], ROW = [72, 200];
  const comp = (s, n, c, r, w, children) => (
    <div className={`a xz-comp${s >= n ? ' on' : ''}`} style={{ left: COL[c], top: ROW[r], width: w, height: 118, transitionDelay: `${(n % 2) * 140}ms` }}>{children}</div>
  );
  return (
    <ExStage label="Animation: accessible brand colors are checked, then buttons, inputs, toggles, charts and tables snap into one consistent grid" last={11} still={8} css={css}>
      {(s) => {
        return (
          <div className="xz-card">
            {SWATCHES.map((c, i) => (
              <div key={c} className={`a xz-sw${s >= 1 ? ' on' : ''}`} style={{ left: 25 + i * 102, background: c, transitionDelay: `${i * 90}ms` }}>
                <div className={`a xz-badge${s >= 3 ? ' on' : ''}`} style={{ transitionDelay: `${i * 110}ms` }}><Check /></div>
              </div>
            ))}
            {[[0, 0], [1, 0], [2, 0], [0, 1]].map(([c, r]) => <div key={`${c}${r}`} className="a xz-slot" style={{ left: COL[c], top: ROW[r] }} />)}
            <div className="a xz-slot" style={{ left: COL[1], top: ROW[1], width: 330 }} />
            {comp(s, 5, 0, 0, 160, <>
              <div className="xz-row"><i className="xz-btn" style={{ width: 62, background: '#1B7F6B' }} /><i className="xz-btn" style={{ width: 52, border: '2px solid #1B7F6B' }} /></div>
              <div className="xz-row"><i className="xz-btn" style={{ width: 40, background: '#CDE8DF' }} /><Bar w={44} c="#9AA89F" /></div>
              <Bar w={90} c="#C9C5BC" />
            </>)}
            {comp(s, 5, 1, 0, 160, <>
              <Bar w={56} c="#7c8a82" />
              <div className="xz-field focus"><Bar w={70} c="#1A1A18" h={5} /></div>
              <div className="xz-field"><Bar w={44} c="#C9C5BC" h={5} /></div>
            </>)}
            {comp(s, 6, 2, 0, 160, <>
              <div className="xz-row"><i className="xz-tog" /><Bar w={52} c="#7c8a82" /></div>
              <div className="xz-row"><i className="xz-chk fill" /><Bar w={64} c="#7c8a82" /></div>
              <div className="xz-row"><i className="xz-chk" /><Bar w={48} c="#C9C5BC" /></div>
            </>)}
            {comp(s, 6, 0, 1, 160, <>
              <Bar w={48} c="#7c8a82" />
              <div className="xz-bars">{[0.45, 0.7, 0.55, 1].map((h, i) => <i key={i} style={{ height: `${h * 100}%`, background: i === 3 ? '#1B7F6B' : '#2FB297' }} />)}</div>
            </>)}
            {comp(s, 7, 1, 1, 330, <>
              <div className="xz-row"><Bar w={70} c="#1B7F6B" /><Bar w={50} c="#7c8a82" /><Bar w={60} c="#7c8a82" style={{ marginLeft: 'auto' }} /></div>
              {[0, 1, 2].map((i) => <div key={i} className="xz-row" style={{ borderTop: '1px solid #DAD6CB', paddingTop: 8 }}><Bar w={90} c="#C9C5BC" /><Bar w={64} c="#D5D1C7" /><Bar w={40} c="#C9C5BC" style={{ marginLeft: 'auto' }} /></div>)}
            </>)}
            {[COL[0] - 6, COL[1] - 5, COL[2] - 5, COL[2] + 165].map((x, i) => <i key={`v${i}`} className={`a xz-guide${s === 8 ? ' on' : ''}`} style={{ left: x, top: 62, width: 1, height: 264 }} />)}
            {[ROW[0] - 5, ROW[1] - 5, ROW[1] + 123].map((y, i) => <i key={`h${i}`} className={`a xz-guide${s === 8 ? ' on' : ''}`} style={{ left: 18, top: y, width: 504, height: 1 }} />)}
          </div>
        );
      }}
    </ExStage>
  );
}

// ─────────────────────────────────────────────── Nordstrom: a shopper chats with the gift finder; findings pile up as sticky notes
const NOTES = [
  { x: 12, y: 16, c: '#F2F04A', r: -3, flag: '#E3000F' },
  { x: 120, y: 30, c: '#F4C84A', r: 2.5, flag: '#00A86B' },
  { x: 20, y: 126, c: '#E9B9CB', r: 2, flag: '#00A86B' },
  { x: 122, y: 140, c: '#A8D5B8', r: -2.5, flag: '#E3000F' },
  { x: 66, y: 236, c: '#A9C7EE', r: 1.5, flag: '#E3000F' },
];
const GIFTS = ['#D9C5B2', '#9DB8D9', '#E9B9CB'];

export function NordAnim() {
  const css = `
    .xn-phone{position:absolute;left:70px;top:28px;width:230px;height:344px;background:#fff;border:1px solid #D2CEC5;box-shadow:0 18px 36px -18px rgba(26,26,24,.35);overflow:hidden}
    .xn-phone .a{position:absolute}
    .xn-top{left:0;top:0;width:100%;height:34px;border-bottom:1px solid #EBE8E0}
    .xn-user{right:12px;top:48px;width:132px;padding:10px;background:#1A1A18;display:flex;flex-direction:column;gap:6px;visibility:hidden;transform:translateY(8px);transition:transform .3s ease}
    .xn-ai{left:12px;top:112px;display:flex;gap:6px;visibility:hidden}
    .xn-ai i{width:7px;height:7px;background:#9a968d;animation:xnDot .9s ease-in-out infinite}
    .xn-ai i:nth-child(2){animation-delay:.15s}.xn-ai i:nth-child(3){animation-delay:.3s}
    @keyframes xnDot{50%{transform:translateY(-5px);background:#1A1A18}}
    .xn-on{visibility:visible!important;transform:none!important}
    .xn-gift{top:104px;width:62px;height:118px;background:#F4F3EF;border:1px solid #E6E3DB;padding:5px;display:flex;flex-direction:column;gap:6px;visibility:hidden;transform:translateY(14px);transition:transform .4s cubic-bezier(.3,1.4,.5,1)}
    .xn-gift .img{height:62px}
    .xn-gift.pick{border-color:#1A1A18;box-shadow:0 0 0 2px #1A1A18}
    .xn-ok{right:-6px;top:-6px;width:16px;height:16px;background:#1A1A18;display:flex;align-items:center;justify-content:center;transform:scale(0);transition:transform .3s cubic-bezier(.3,1.7,.5,1)}
    .xn-ok.on{transform:scale(1)}
    .xn-comp{left:12px;bottom:12px;width:206px;height:30px;border:1px solid #D5D2CB;display:flex;align-items:center;padding:0 8px}
    .xn-comp .t{transition:width .7s steps(8,end)}
    .xn-board{position:absolute;left:330px;top:28px;width:240px;height:344px;background-image:radial-gradient(#C9C5BC 1.2px,transparent 1.2px);background-size:16px 16px}
    .xn-note{position:absolute;width:104px;height:88px;padding:10px;display:flex;flex-direction:column;gap:7px;box-shadow:0 8px 14px -8px rgba(26,26,24,.4);visibility:hidden;transform:translateY(-14px) scale(.9) rotate(var(--r));transition:transform .4s cubic-bezier(.3,1.5,.5,1)}
    .xn-note.on{visibility:visible;transform:rotate(var(--r))}
    .xn-note .f{position:absolute;right:8px;bottom:8px;width:9px;height:9px}
  `;
  const Tick = () => <svg width="10" height="10" viewBox="0 0 6 6" shapeRendering="crispEdges"><path d="M0 3h1v1h1v1h1V4h1V3h1V2h-1v1H4v1H3v1H2V4H1V3z" fill="#fff" /></svg>;
  return (
    <ExStage label="Animation: a shopper asks an AI gift finder for ideas and picks one, while usability findings collect as sticky notes" last={11} still={8} css={css}>
      {(s) => (
        <>
          <div className="xn-phone">
            <div className="a xn-top"><i className="a" style={{ left: 12, top: 13, width: 56, height: 7, background: '#C9C5BC' }} /></div>
            <div className={`a xn-user${s >= 2 ? ' xn-on' : ''}`}><Bar w={104} c="#fff" h={5} /><Bar w={70} c="rgba(255,255,255,.55)" h={5} /></div>
            <div className="a xn-ai" style={{ visibility: s === 3 ? 'visible' : 'hidden' }}><i /><i /><i /></div>
            {GIFTS.map((c, i) => (
              <div key={c} className={`a xn-gift${s >= 4 ? ' xn-on' : ''}${s >= 6 && i === 1 ? ' pick' : ''}`} style={{ left: 12 + i * 70, transitionDelay: s >= 4 ? `${i * 120}ms` : '0ms' }}>
                <div className="img" style={{ background: c }} />
                <Bar w={40} c="#8f8b82" h={5} /><Bar w={26} c="#C9C5BC" h={5} />
                {i === 1 && <div className={`a xn-ok${s >= 6 ? ' on' : ''}`}><Tick /></div>}
              </div>
            ))}
            <div className="a xn-comp"><Bar w={s === 1 ? 118 : 0} c="#4a4743" h={5} style={{ transition: 'width .7s steps(8,end)' }} /></div>
          </div>
          <div className="xn-board">
            {NOTES.map((n, i) => (
              <div key={i} className={`xn-note${s >= 5 + i ? ' on' : ''}`} style={{ left: n.x, top: n.y, background: n.c, '--r': `${n.r}deg` }}>
                <Bar w={64} c="rgba(26,26,24,.55)" h={5} /><Bar w={78} c="rgba(26,26,24,.28)" h={5} /><Bar w={44} c="rgba(26,26,24,.28)" h={5} />
                <i className="f" style={{ background: n.flag }} />
              </div>
            ))}
          </div>
        </>
      )}
    </ExStage>
  );
}
