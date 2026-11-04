// Case study: Adobe, third-party tooling (Experience Design Intern, Agents Team). Under NDA, so it stays
// high-level: the goal and hypothesis, what I designed (shown as an illustration, not the product), what I'd
// measure, and what I learned. No product specifics or numbers.
import { CaseLayout, Section, P, Cards, Card, Hero, Label, Split, TYPE, LINE } from './caseKit.jsx';
import AdobeAnim from './AdobeAnim.jsx';
import { SwitchingTools, LoopCompare, MeasureViz, ConnectedApps } from './AdobeVisuals.jsx';

const IMG = '/assets/Adobe/claudexadobe.webp';

const SECTIONS = [
  { id: 'goal', label: 'Goal + Hypothesis' },
  { id: 'design', label: 'What I Designed' },
  { id: 'measure', label: 'How I’d Know It Worked' },
  { id: 'learned', label: 'What I Learned' },
];

export default function AdobeTooling({ onNext }) {
  return (
    <CaseLayout
      accent="#E3000F"
      tags={['Adobe', 'Gen AI', 'Agents']}
      title="Bringing Adobe's AI Agents to the Apps You Already Use."
      subtitle="Third-party tooling for Adobe's agents, so creative work can happen inside apps like Claude, ChatGPT and Slack."
      hero={<Hero src={IMG} alt="Claude working inside an Adobe design workflow" tint="#EA1001" />}
      meta={[['Role', 'Experience Design Intern'], ['Team', 'Agents Team'], ['Timeline', 'Jun – Sep 2026']]}
      note={
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', border: `1px solid ${LINE}`, padding: '16px 20px' }}>
          <span style={{ ...TYPE.label, color: 'var(--acc)' }}>NDA</span>
          <span style={{ ...TYPE.small, color: 'rgba(26,26,24,.6)' }}>This work is under a confidentiality agreement, so details and visuals are abstracted on purpose. I’m happy to walk through more in conversation.</span>
        </div>
      }
      sections={SECTIONS}
      next={{ title: "Finding Where Adobe's AI Agent Could Stand Apart.", onNext }}
    >
      <Section id="goal" title="Start creative work in the apps people already use, and finish it there.">
        <Cards cols={2} items={[
          ['The goal', 'Let people use Adobe’s creative agents inside the AI apps they already work in, like Claude, ChatGPT and Slack, instead of making them switch tools.'],
          ['My hypothesis', 'If a conversation could be extended with more direct ways to shape the result, people would get to a finished design faster and feel more in control.'],
        ]} />
        <SwitchingTools />
        <LoopCompare />
      </Section>

      <Section id="design" title="Conversation, taken further.">
        <P>
          Chat is great for starting something, but it’s awkward for fine-tuning. I designed how an agent could carry that conversation further, so people can keep shaping a design without leaving the app they’re in.
        </P>
        <div>
          <div style={{ position: 'relative', width: '100%', height: 520 }}><AdobeAnim /></div>
          <Label style={{ marginTop: 14, textTransform: 'none', letterSpacing: '.04em' }}>An illustration of the idea, not the product.</Label>
        </div>
      </Section>

      <Section id="measure" title="What I’d measure to know it worked.">
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 20 }}>
          {[
            ['reprompts', 'Fewer re-prompts', 'People get to a finished design in fewer rounds of chatting back and forth.'],
            ['less', 'Less rewording', 'People spend less time re-describing what they want and more time shaping it.'],
            ['return', 'Coming back', 'People return to the same app to keep creating, not just to try it once.'],
          ].map(([k, t, d]) => (
            <div key={k} style={{ border: `1px solid ${LINE}`, padding: 22, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              <MeasureViz kind={k} />
              <div style={{ ...TYPE.small, fontSize: 15, fontWeight: 600, color: 'var(--ink, #1A1A18)' }}>{t}</div>
              <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.55)' }}>{d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="learned" title="What I learned.">
        <Split>
          <P>
            Conversation is a good way to start, but finishing takes precision. I also learned that trust grows when it’s clear what the agent is connecting to and what it’s doing there.
          </P>
          <ConnectedApps />
        </Split>
      </Section>
    </CaseLayout>
  );
}
