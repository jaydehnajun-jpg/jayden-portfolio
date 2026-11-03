// Case study: Adobe, future vision. Under NDA, so this page tells the process only, and stays deliberately
// vague about what the direction was: a note up front, the steps I took, and an honest line about what stays
// in conversation. No product specifics, visuals or numbers. The hero animation is an illustration of the
// process, not the product or the direction.
import { CaseLayout, Section, P, Rows, Callout, TYPE, LINE } from './caseKit.jsx';
import AdobeVisionAnim from './AdobeVisionAnim.jsx';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'process', label: 'The Process' },
  { id: 'conversation', label: 'What I Can Share' },
];

export default function AdobeVision({ onNext }) {
  return (
    <CaseLayout
      accent="#E3000F"
      tags={['Adobe', 'Future Vision', 'Gen AI']}
      title="Shaping a Future Vision for Adobe's AI Agents."
      subtitle="A confidential exploration of where Adobe's agent could go next, and the idea I pitched for it."
      hero={<div style={{ position: 'relative', width: '100%', maxWidth: 680, aspectRatio: '16 / 10', margin: '0 auto', border: `1px solid ${LINE}` }}><AdobeVisionAnim /></div>}
      meta={[['Role', 'Experience Design Intern'], ['Team', 'Agents Team'], ['Timeline', 'Jun – Sep 2026']]}
      note={
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', border: `1px solid ${LINE}`, padding: '16px 20px' }}>
          <span style={{ ...TYPE.label, color: 'var(--acc)' }}>NDA</span>
          <span style={{ ...TYPE.small, color: 'rgba(26,26,24,.6)' }}>This work is under a confidentiality agreement, so details and visuals are abstracted on purpose. The animation above shows the process only, not the product or the idea.</span>
        </div>
      }
      sections={SECTIONS}
      next={{ title: 'Redesigning How Learners Choose a Class.', onNext }}
    >
      <Section id="overview" title="I started by looking around.">
        <P>
          I wanted to understand where AI agents were headed, so I began with the landscape and worked my way toward an idea to pitch for Adobe’s own agent.
        </P>
      </Section>

      <Section id="process" title="Four steps, one direction.">
        <Rows rows={[
          ['1 · Competitive analysis', 'I studied how AI agents are showing up across the products people already use.'],
          ['2 · An internal tool', 'To make sense of what I was finding, I built a small internal tool. It started as a side project.'],
          ['3 · A framework', 'I built a framework to organize it all. It made the gaps visible, and one stood out as a real opportunity.'],
          ['4 · A pitch', 'I chose a direction, shaped it into an idea for where Adobe’s agent could go next, and pitched it.'],
        ]} />
      </Section>

      <Section id="conversation" title="The details stay in the room.">
        <Callout>
          The specifics are confidential. I’m happy to walk through my thinking, process and decisions in conversation.
        </Callout>
      </Section>
    </CaseLayout>
  );
}
