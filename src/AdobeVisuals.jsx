// Visuals for the Adobe case studies. The work is under NDA, so these are generic, abstract illustrations:
// placeholder bars instead of text, and the public marks of other products for the competitive analysis.
// Competitor marks live in /assets/Logos/competitors/ (c1..c8.png, cropped from the strip provided).
import { INK, LINE } from './caseKit.jsx';

const RED = '#E3000F';
const logo = (i) => `/assets/Logos/competitors/c${i}.png`;
const Bar = ({ w, c = '#C9C5BC', h = 6, style }) => <i style={{ display: 'block', width: w, height: h, background: c, flex: 'none', ...style }} />;

// A competitive analysis repository: one row per product, with its mark, a name, tags and a status.
export function CompetitiveRepo() {
  const rows = [1, 2, 3, 4, 5, 6];
  return (
    <div style={{ width: '100%', aspectRatio: '7 / 5', background: '#fff', border: `1px solid ${LINE}`, padding: '5.5% 5%', display: 'flex', flexDirection: 'column', gap: '3.5%', boxShadow: '0 18px 36px -20px rgba(26,26,24,.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: '3%', borderBottom: `1px solid ${LINE}` }}>
        <i style={{ width: 8, height: 8, background: RED, flex: 'none' }} />
        <Bar w="26%" c={INK} h={8} />
        <span style={{ flex: 1 }} />
        <Bar w="14%" />
      </div>
      {rows.map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '4%', flex: 1, background: i === 2 ? 'rgba(227,0,15,.06)' : 'transparent' }}>
          <img src={logo(n)} alt="" style={{ width: '9%', aspectRatio: '1', objectFit: 'contain', flex: 'none' }} />
          <Bar w="22%" c="#8f8b82" />
          <span style={{ display: 'flex', gap: 6, flex: 1 }}>
            {[18, 26, 14].map((w, j) => <i key={j} style={{ width: `${w}%`, height: 12, background: '#ECEAE4' }} />)}
          </span>
          <i style={{ width: 8, height: 8, background: i === 2 ? RED : '#BDB9B0', flex: 'none' }} />
        </div>
      ))}
    </div>
  );
}

// A 2x2 framework: items plotted across two axes, with one empty corner marked as the opportunity.
const PLOT = [[22, 20], [36, 34], [17, 38], [22, 66], [38, 82], [14, 82], [64, 68], [82, 84], [30, 54]];
export function Framework2x2() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '7 / 5', background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 18px 36px -20px rgba(26,26,24,.25)' }}>
      <i style={{ position: 'absolute', left: '6%', right: '6%', top: '50%', height: 2, background: '#8f8b82' }} />
      <i style={{ position: 'absolute', top: '6%', bottom: '6%', left: '50%', width: 2, background: '#8f8b82' }} />
      {[['8%', '52%'], ['76%', '52%'], ['52%', '8%'], ['52%', '88%']].map(([l, t], i) => <Bar key={i} w="9%" h={5} style={{ position: 'absolute', left: l, top: t }} />)}
      <div style={{ position: 'absolute', left: '53%', top: '9%', width: '41%', height: '39%', border: `1.5px dashed ${RED}`, background: 'rgba(227,0,15,.08)' }} />
      <i style={{ position: 'absolute', left: '71%', top: '24%', width: 18, height: 18, background: RED }} />
      {PLOT.map(([x, y], i) => (
        <i key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 14, height: 14, background: INK, transform: 'translate(-50%,-50%)' }} />
      ))}
    </div>
  );
}

// A repository that updates weekly and is shared with the organization, plus the skill that works through it
// (a SKILL.md file). Two stacked panels.
const Person = ({ c = '#8f8b82' }) => (
  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    <i style={{ width: 9, height: 9, background: c }} />
    <i style={{ width: 15, height: 11, background: c }} />
  </span>
);
const Panel = ({ children, ratio, style }) => (
  <div style={{ width: '100%', aspectRatio: ratio, background: '#fff', border: `1px solid ${LINE}`, boxShadow: '0 18px 36px -20px rgba(26,26,24,.25)', ...style }}>{children}</div>
);
const Mono = ({ children, style }) => <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(26,26,24,.45)', ...style }}>{children}</span>;

export function RepoAndSkill() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* the repository: updated weekly, shared with the organization */}
      <Panel ratio="7 / 3.4" style={{ padding: '4.5% 5%', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '4%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} style={{ aspectRatio: '1', background: '#F4F3EF', border: '1px solid #E0DDD6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={logo(n)} alt="" style={{ width: '56%', aspectRatio: '1', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <i key={i} style={{ width: 9, height: 9, background: i === 4 ? RED : '#D5D2CB' }} />)}
          </div>
          <Mono>Weekly</Mono>
          <span style={{ fontSize: 22, lineHeight: 1, color: RED }}>→</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{Array.from({ length: 10 }, (_, i) => <Person key={i} c={i === 3 ? INK : '#8f8b82'} />)}</div>
          <Mono>Shared with the org</Mono>
        </div>
      </Panel>

      {/* the skill: a SKILL.md file */}
      <Panel ratio="7 / 3.4" style={{ padding: '4.5% 5%', display: 'flex', flexDirection: 'column', gap: 10, background: '#F7F6F3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <i style={{ width: 10, height: 10, background: RED, flex: 'none' }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: INK }}>SKILL.md</span>
        </div>
        <Bar w="46%" c={INK} h={9} />
        <Bar w="82%" c="#BDB9B0" />
        {[70, 58, 64].map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i style={{ width: 7, height: 7, background: '#8f8b82', flex: 'none' }} />
            <Bar w={`${w}%`} c="#BDB9B0" />
          </div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
          {[24, 30, 20].map((w, i) => <i key={i} style={{ width: `${w}%`, height: 14, background: '#E8E6E0' }} />)}
        </div>
      </Panel>
    </div>
  );
}

// ---------- Third-party tooling visuals ----------
const APPS = ['/assets/Logos/claude.png', '/assets/Logos/chatgpt.png', '/assets/Logos/slack.png'];
const Tile = ({ children, style }) => <div style={{ background: '#fff', border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>{children}</div>;

// A tiny poster used throughout.
export function MiniPoster({ width = '100%', style }) {
  return (
    <div style={{ position: 'relative', width, aspectRatio: '176 / 248', background: '#F1EAD6', ...style }}>
      <i style={{ position: 'absolute', left: '7%', top: '5%', width: '86%', height: '25%', background: '#8E9B2F' }} />
      <i style={{ position: 'absolute', left: '7%', top: '34%', width: '86%', height: '45%', background: '#E9B9CB' }} />
      <i style={{ position: 'absolute', left: '7%', top: '83%', width: '52%', height: '12%', background: '#F2F04A' }} />
    </div>
  );
}

// Before: hop between tools to finish. After: stay in one app, with the controls right there.
export function SwitchingTools() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '3%' }}>
      <Panel ratio="7 / 5" style={{ position: 'relative' }}>
        <svg viewBox="0 0 280 200" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          {[40, 100, 160].map((y, i) => <line key={i} x1="82" y1="100" x2="196" y2={y + 20} stroke="#8f8b82" strokeWidth="1.5" strokeDasharray="4 4" />)}
          {[40, 100, 160].map((y, i) => <rect key={i} x="196" y={y} width="1" height="1" fill="none" />)}
        </svg>
        <i style={{ position: 'absolute', left: '12%', top: '50%', width: '20%', aspectRatio: '1', background: RED, transform: 'translateY(-50%)' }} />
        {[14, 40, 66].map((t, i) => (
          <Tile key={i} style={{ position: 'absolute', right: '10%', top: `${t}%`, width: '18%', aspectRatio: '1' }}>
            <img src={APPS[i]} alt="" style={{ width: '60%', objectFit: 'contain' }} />
          </Tile>
        ))}
        <Mono style={{ position: 'absolute', left: '6%', bottom: '5%' }}>Before</Mono>
      </Panel>
      <span style={{ fontSize: 28, lineHeight: 1, color: RED }}>→</span>
      <Panel ratio="7 / 5" style={{ position: 'relative', background: '#F7F6F3' }}>
        <div style={{ position: 'absolute', left: '9%', top: '12%', right: '9%', bottom: '16%', background: '#fff', border: `1px solid ${LINE}`, display: 'flex' }}>
          <div style={{ width: '38%', padding: '6%', borderRight: `1px solid ${LINE}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 5 }}>{APPS.map((a, i) => <img key={i} src={a} alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />)}</div>
            <Bar w="80%" c="#4a4743" /><Bar w="60%" c="#BDB9B0" /><Bar w="70%" c="#BDB9B0" />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MiniPoster width="34%" /></div>
        </div>
        <Mono style={{ position: 'absolute', left: '6%', bottom: '5%' }}>After</Mono>
      </Panel>
    </div>
  );
}

// The hypothesis as two paths: chat only takes many rounds; chat plus controls takes fewer.
const Step = ({ kind }) => {
  if (kind === 'p') return <i style={{ width: 34, height: 22, background: '#E8E6E0', flex: 'none', display: 'block' }} />;
  if (kind === 'r') return <MiniPoster width={22} style={{ flex: 'none' }} />;
  if (kind === 'b') return <i style={{ width: 34, height: 22, border: `1.5px solid ${RED}`, background: 'rgba(227,0,15,.08)', flex: 'none', display: 'block' }} />;
  return <i style={{ width: 22, height: 22, background: RED, flex: 'none', display: 'block' }} />;
};
const Arrow = () => <i style={{ width: 12, height: 2, background: '#BDB9B0', flex: 'none', display: 'block' }} />;
function Path({ steps, label, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Mono style={{ color: accent ? RED : undefined }}>{label}</Mono>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {steps.map((k, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{i > 0 && <Arrow />}<Step kind={k} /></span>)}
      </div>
    </div>
  );
}
export function LoopCompare() {
  return (
    <Panel ratio="auto" style={{ padding: '3.5% 4%', display: 'flex', flexDirection: 'column', gap: 26, aspectRatio: 'auto' }}>
      <Path label="Chat only" steps={['p', 'r', 'p', 'r', 'p', 'r', 'p', 'r']} />
      <Path label="Chat, taken further" accent steps={['p', 'r', 'b', 'd']} />
    </Panel>
  );
}

// Small charts for "what I'd measure".
export function MeasureViz({ kind }) {
  const box = { height: 86, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 2px 2px', borderBottom: `1px solid ${LINE}` };
  if (kind === 'reprompts') {
    return <div style={box}>{[78, 62, 46, 30, 18].map((h, i) => <i key={i} style={{ width: 18, height: h, background: i === 4 ? RED : '#BDB9B0' }} />)}</div>;
  }
  if (kind === 'less') {
    return (
      <div style={{ ...box, gap: 16 }}>
        {[[70, 28], [44, 52], [20, 76]].map(([w, c], i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            <i style={{ width: 14, height: w, background: '#BDB9B0' }} />
            <i style={{ width: 14, height: c, background: RED }} />
          </span>
        ))}
      </div>
    );
  }
  return (
    <div style={{ ...box, alignItems: 'center', gap: 6, borderBottom: 'none' }}>
      {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ width: 14, height: 14, background: [0, 3, 5, 6, 8, 9, 10, 12, 13].includes(i) ? INK : '#E0DDD6' }} />)}
    </div>
  );
}

// Trust: the agent is visibly connected to the apps it works in.
export function ConnectedApps() {
  return (
    <Panel ratio="7 / 5" style={{ position: 'relative', background: '#F7F6F3' }}>
      <svg viewBox="0 0 280 200" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        {[[56, 46], [224, 46], [140, 160]].map(([x, y], i) => <line key={i} x1="140" y1="100" x2={x} y2={y} stroke="#8f8b82" strokeWidth="1.5" />)}
      </svg>
      <i style={{ position: 'absolute', left: '50%', top: '50%', width: '16%', aspectRatio: '1', background: RED, transform: 'translate(-50%,-50%)' }} />
      {[['20%', '23%'], ['80%', '23%'], ['50%', '80%']].map(([l, t], i) => (
        <Tile key={i} style={{ position: 'absolute', left: l, top: t, width: '17%', aspectRatio: '1', transform: 'translate(-50%,-50%)' }}>
          <img src={APPS[i]} alt="" style={{ width: '60%', objectFit: 'contain' }} />
          <i style={{ position: 'absolute', right: 4, bottom: 4, width: 7, height: 7, background: '#00A86B' }} />
        </Tile>
      ))}
    </Panel>
  );
}
