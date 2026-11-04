// Case study: Adobe, future vision. Under NDA, so it stays deliberately vague about the direction itself:
// the goal and hypothesis, how I found the opportunity (with abstract visuals), what I'd measure, and what
// I learned. No product specifics, visuals or numbers. The animation and diagrams are illustrations.
import { CaseLayout, Section, P, Cards, Feature, Callout, TYPE, LINE } from './caseKit.jsx';
import AdobeVisionAnim from './AdobeVisionAnim.jsx';
import { CompetitiveRepo, RepoAndSkill, Framework2x2 } from './AdobeVisuals.jsx';

const SECTIONS = [
  { id: 'goal', label: 'The Goal' },
  { id: 'opportunity', label: 'Finding the Opportunity' },
  { id: 'measure', label: 'How I’d Know It Worked' },
  { id: 'learned', label: 'What I Learned' },
];

export default function AdobeVision({ onNext }) {
  return (
    <CaseLayout
      accent="#E3000F"
      tags={['Adobe', 'Future Vision', 'Gen AI']}
      title="Finding Where Adobe's AI Agent Could Stand Apart."
      subtitle="A confidential future vision for Adobe's agent, and the idea I pitched."
      hero={<div style={{ position: 'relative', width: '100%', height: 520 }}><AdobeVisionAnim /></div>}
      meta={[['Role', 'Experience Design Intern'], ['Team', 'Agents Team'], ['Timeline', 'Jun – Sep 2026']]}
      note={
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', border: `1px solid ${LINE}`, padding: '16px 20px' }}>
          <span style={{ ...TYPE.label, color: 'var(--acc)' }}>NDA</span>
          <span style={{ ...TYPE.small, color: 'rgba(26,26,24,.6)' }}>This work is under a confidentiality agreement, so details and visuals are abstracted on purpose. The animation above is a generic illustration, not the product or the idea.</span>
        </div>
      }
      sections={SECTIONS}
      next={{ title: 'Redesigning How Learners Choose a Class.', onNext }}
    >
      <Section id="goal" title="Find a direction that sets Adobe’s agent apart.">
        <P>
          As AI creative tools multiply, the goal was to find a direction for Adobe’s agent that sets it apart, and to make the case for it.
        </P>
      </Section>

      <Section id="opportunity" title="Four steps from a crowded landscape to one idea.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 96 }}>
          <Feature n="1" title="Competitive analysis" desc="I studied how AI agents and creative tools are showing up across the products people already use.">
            <CompetitiveRepo />
          </Feature>
          <Feature n="2" title="A repository and a skill" reverse desc="As a side project, I designed a competitive analysis repository, updated weekly and shared with the organization, and a skill (a SKILL.md file) that works through it.">
            <RepoAndSkill />
          </Feature>
          <Feature n="3" title="A framework" desc="I built a framework to organize it all. It made the gaps visible, and one corner stood out as a real opportunity.">
            <Framework2x2 />
          </Feature>
        </div>
        <Callout>
          Then I chose a direction, shaped it into an idea, and pitched it. The specifics stay in the room, and I’m happy to talk through my thinking in conversation.
        </Callout>
      </Section>

      <Section id="measure" title="What I’d measure to know it worked.">
        <Cards numbered cols={3} items={[
          ['A clear pitch', 'Whether people could repeat the idea back in their own words, and wanted to take it further.'],
          ['Fit with the gap', 'Whether the idea filled the opportunity the framework showed, and not just a nice-to-have.'],
          ['Reuse', 'Whether the repository and skill kept getting used after I made them.'],
        ]} />
      </Section>

      <Section id="learned" title="What I learned.">
        <P>
          A shared, structured view of the landscape makes a direction much easier to argue for. Making the research reusable turned a one-off into something the team could build on.
        </P>
      </Section>
    </CaseLayout>
  );
}
