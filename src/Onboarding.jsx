// Short-form case study for Skillshare Onboarding & Member Home, written from Jayden's own
// account with no invented details. Uses the shared case-study layout.
import { CaseLayout, Section, P, Cards, Frame, Rows } from './caseKit.jsx';

const VIDEO = '/assets/Onboarding/onboardingvid.mp4';

const SECTIONS = [
  { id: 'problem', label: 'The Problem' },
  { id: 'goal', label: 'The Goal' },
  { id: 'tried', label: 'What We Tried' },
  { id: 'learned', label: 'What We Learned' },
];

const EXPERIMENTS = [
  ['Save a class, inside onboarding', 'I let people save right away instead of waiting until after setup.'],
  ['Recommend teachers to follow', 'I suggested teachers instead of making people go find them.'],
  ['Skip the personalization to watch a lesson', 'I made it easy to start the first lesson without filling everything out first.'],
  ['Image-based selection instead of text lists', 'I worked with the brand team to make the steps more creative and on brand.'],
];

export default function Onboarding({ onNext }) {
  return (
    <CaseLayout
      accent="#00A86B"
      tags={['Skillshare', 'Product Design', 'Experimentation']}
      title="Onboarding & Member Home"
      subtitle="Helping new members actually start learning by cutting the steps between signing up and their first real action."
      hero={
        <Frame max={420}>
          <video src={VIDEO} autoPlay loop muted playsInline style={{ maxWidth: '100%', maxHeight: 420, display: 'block' }} />
        </Frame>
      }
      meta={[['Role', 'Sole Product Designer'], ['Team', '1 PM · 3 Engineers'], ['Timeline', '~3–4 months, multiple design sprints']]}
      outcomes={{ items: [
        ['+4.3pp Retention', 'Measured through A/B tests by cohort'],
        ['−26% Time-to-Action', 'Users reached their first meaningful step faster'],
        ['3 Activation Steps', 'Save a class, follow a teacher, watch a lesson'],
      ] }}
      sections={SECTIONS}
      next={{ title: 'AI AAC Device', onNext }}
    >
      <Section id="problem" title="Too many steps, too many drop-offs.">
        <P>
          The old onboarding had multiple steps, and it took almost 12 clicks just to get to the next one. Unsurprisingly, a lot of people dropped off before they ever got to the good part.
        </P>
      </Section>

      <Section id="goal" title="Get people to three actions.">
        <P>
          My PM defined an activation formula: three actions that show someone is really getting value from Skillshare. The whole redesign was about nudging new members toward them.
        </P>
        <Cards numbered cols={3} items={[
          ['Save a class', 'Something they want to come back to.'],
          ['Follow a teacher', 'Someone whose work they like.'],
          ['Watch a lesson', 'The first real taste of the product.'],
        ]} />
      </Section>

      <Section id="tried" title="A lot of experiments.">
        <P>
          This was an ongoing effort across multiple design sprints, not one big redesign. I kept testing changes against those three activation steps.
        </P>
        <Rows rows={EXPERIMENTS} />
        <P>We measured retention with A/B tests, comparing cohorts.</P>
      </Section>

      <Section id="learned" title="Fewer steps beat more steps.">
        <P>
          Instead of walking people through a long setup, what worked best was much simpler: recommend classes and let people save them right away. There was less to fill out and more of the actual product.
        </P>
      </Section>
    </CaseLayout>
  );
}
