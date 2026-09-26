// Case study: Adobe, Experience Design Intern on the Agents Team. Under NDA, so this is deliberately
// high-level: the problem space, the two areas of focus, and no product specifics or numbers.
import { CaseLayout, Section, P, Cards, Frame, Label, TYPE, LINE, INK } from './caseKit.jsx';

const IMG = '/assets/Adobe/claudexadobe.webp';

const SECTIONS = [
  { id: 'space', label: 'The Space' },
  { id: 'focus', label: 'Focus Areas' },
  { id: 'approach', label: 'Approach' },
  { id: 'takeaway', label: 'Takeaway' },
];

export default function Adobe({ onNext }) {
  return (
    <CaseLayout
      accent="#E3000F"
      tags={['Adobe', 'Gen AI', 'Agents']}
      title="Designing for Gen AI Experiences"
      subtitle="Designing how generative AI agents work with third-party tools like Claude, ChatGPT and Slack, and how they behave once they do."
      hero={<Frame src={IMG} alt="Claude working inside an Adobe design workflow" max={400} />}
      meta={[['Role', 'Experience Design Intern'], ['Team', 'Agents Team'], ['Timeline', 'Jun – Sep 2026']]}
      note={
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', border: `1px solid ${LINE}`, padding: '16px 20px' }}>
          <span style={{ ...TYPE.label, color: 'var(--acc)' }}>NDA</span>
          <span style={{ ...TYPE.small, color: 'rgba(26,26,24,.6)' }}>This work is confidential, so I’ve kept this page to the problem space and my approach. Happy to walk through more in conversation.</span>
        </div>
      }
      sections={SECTIONS}
      next={{ title: 'Class Discovery Redesign', onNext }}
    >
      <Section id="space" title="Agents are only as useful as the tools they can reach.">
        <P>
          As an Experience Design intern on Adobe’s Agents team, I worked on how generative AI agents fit into real creative work: connecting to tools beyond Adobe’s own, such as Claude, ChatGPT and Slack, and acting in ways people can predict and trust.
        </P>
      </Section>

      <Section id="focus" title="Two problems I worked on.">
        <Cards numbered cols={2} items={[
          ['Third-party tooling', 'How an agent discovers, connects to, and hands work off to tools and services outside the product, like Claude, ChatGPT and Slack.'],
          ['Consistent, predictable behavior', 'How an agent’s persona and actions stay consistent across contexts, so people know what to expect from it.'],
        ]} />
      </Section>

      <Section id="approach" title="Design for trust first.">
        <P>
          With agents, a good interface isn’t just about being clear. It’s about whether people feel in control of something that acts for them. I came at both problems from that angle: make it clear what the agent is doing, and keep its behavior consistent enough to rely on.
        </P>
      </Section>

      <Section id="takeaway" title="What this taught me.">
        <P>
          Designing agents feels closer to designing a relationship than a screen. I learned that predictability and transparency matter as much as what the agent can do, because they’re what make people willing to hand work over.
        </P>
      </Section>
    </CaseLayout>
  );
}
