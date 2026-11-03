// Case study: Adobe, third-party tooling (Experience Design Intern, Agents Team). Under NDA, so this is
// deliberately high-level: the problem space and approach, with no product specifics or numbers.
import { CaseLayout, Section, P, Cards, Frame, TYPE, LINE } from './caseKit.jsx';

const IMG = '/assets/Adobe/claudexadobe.webp';

const SECTIONS = [
  { id: 'space', label: 'The Space' },
  { id: 'focus', label: 'What I Worked On' },
  { id: 'approach', label: 'Approach' },
  { id: 'takeaway', label: 'Takeaway' },
];

export default function AdobeTooling({ onNext }) {
  return (
    <CaseLayout
      accent="#E3000F"
      tags={['Adobe', 'Gen AI', 'Agents']}
      title="Connecting Adobe's AI Agents to the Tools You Already Use."
      subtitle="Designing how generative AI agents work with third-party tools like Claude, ChatGPT and Slack."
      hero={<Frame src={IMG} alt="Claude working inside an Adobe design workflow" max={400} />}
      meta={[['Role', 'Experience Design Intern'], ['Team', 'Agents Team'], ['Timeline', 'Jun – Sep 2026']]}
      note={
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', border: `1px solid ${LINE}`, padding: '16px 20px' }}>
          <span style={{ ...TYPE.label, color: 'var(--acc)' }}>NDA</span>
          <span style={{ ...TYPE.small, color: 'rgba(26,26,24,.6)' }}>This work is under a confidentiality agreement, so details and visuals are abstracted on purpose. I’m happy to walk through more in conversation.</span>
        </div>
      }
      sections={SECTIONS}
      next={{ title: "Shaping a Future Vision for Adobe's AI Agents.", onNext }}
    >
      <Section id="space" title="Agents are only as useful as the tools they can reach.">
        <P>
          As an Experience Design intern on Adobe’s Agents team, I worked on how generative AI agents fit into real creative work. That meant connecting to tools beyond Adobe’s own, such as Claude, ChatGPT and Slack.
        </P>
      </Section>

      <Section id="focus" title="How an agent connects to a tool.">
        <Cards numbered cols={3} items={[
          ['Discover', 'How an agent finds out which tools and services are available to it.'],
          ['Connect', 'How it links up to them, so setting it up feels simple.'],
          ['Hand off', 'How it passes work to a tool outside the product, and picks it back up.'],
        ]} />
      </Section>

      <Section id="approach" title="Design for trust first.">
        <P>
          With agents, a good interface isn’t just about being clear. It’s about whether people feel in control of something that acts for them. So I focused on making it clear what the agent is connecting to and what it’s doing there.
        </P>
      </Section>

      <Section id="takeaway" title="What this taught me.">
        <P>
          Designing agents feels closer to designing a relationship than a screen. I learned that transparency matters as much as what the agent can do, because it’s what makes people willing to hand work over.
        </P>
      </Section>
    </CaseLayout>
  );
}
