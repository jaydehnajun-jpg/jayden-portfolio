// Archive case study: Zuora Design System. Content brought over from the original write-up (lightly
// copy-edited); uses the shared case-study layout (caseKit). Images live in /assets/Zuora/.
import { CaseLayout, Section, P, H3, Cards, Frame, Metrics, Quote, Callout } from './caseKit.jsx';

const Z = '/assets/Zuora/';

const SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'insights', label: 'User Insights' },
  { id: 'process', label: 'Design Process' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'reflection', label: 'Reflection' },
];

// One design decision: a heading, a short explanation, then the artifact it produced.
const Decision = ({ title, text, img, alt, caption }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <H3>{title}</H3>
      <div style={{ marginTop: 10 }}><P>{text}</P></div>
    </div>
    <Frame src={Z + img} alt={alt} caption={caption} max={380} />
  </div>
);

export default function Zuora({ onNext }) {
  return (
    <CaseLayout
      accent="#1B7F6B"
      tags={['Zuora', 'Design Systems', 'Accessibility']}
      title="Zuora Design System"
      subtitle="Bringing accessibility and clarity to internal sales dashboards."
      hero={<Frame src={Z + 'thumbnail.png'} alt="Zuora design system foundations" max={420} />}
      meta={[
        ['Context', 'Unifying dozens of PowerBI sales dashboards'],
        ['Role', 'Lead Product Designer, mentored by 2 SalesOps Analysts'],
        ['Timeline', 'May – September 2023'],
      ]}
      outcomes={{ items: [
        ['40% Reduction', 'In dashboard creation time'],
        ['WCAG Compliance', 'Improved accessibility'],
        ['Scalable System', 'Within PowerBI constraints'],
        ['Enhanced Onboarding', 'For new analysts'],
      ] }}
      sections={SECTIONS}
      next={{ eyebrow: 'Back to', title: 'Archive', cta: 'Back to archive', onNext }}
    >
      <Section id="problem" title="Inconsistencies creating barriers.">
        <P>
          At Zuora, I worked with the Sales Operations team to unify dozens of PowerBI dashboards used across global sales. These dashboards were critical to business operations, but they suffered from inconsistent layouts, inaccessible visuals, and poor onboarding experiences.
        </P>
        <Callout>
          The dashboards had grown organically over time, each built by different team members without shared guidelines.
        </Callout>
        <Frame src={Z + 'problem.svg'} alt="A sample of the inconsistent dashboards" max={300} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <H3>A deeper audit confirmed the scale of the problem.</H3>
          <Metrics items={[
            ['55', 'Unique type sizes'],
            ['30+', 'Tile dimensions'],
            ['140+', 'Spacing tokens'],
            ['7', 'Different fonts'],
            ['∞', 'Inconsistent terms'],
          ]} />
        </div>
      </Section>

      <Section id="insights" title="Analysts kept hitting the same three walls.">
        <P>I interviewed analysts and sales leaders, and three key issues came up.</P>
        <Cards numbered cols={3} items={[
          ['Navigation breakdowns', 'Analysts had to relearn the structure of every new dashboard.'],
          ['Poor onboarding experience', 'It was hard to onboard new sales analysts and teach them the dashboards.'],
          ['Lack of accessible design', 'Visuals lacked contrast, labels were unclear, and layouts were cluttered.'],
        ]} />
      </Section>

      <Section id="process" title="I focused on what would make the biggest difference, fast.">
        <P>
          I couldn't rebuild everything from scratch. PowerBI had major limitations, especially around font control and layout flexibility. So I picked the changes that would matter most.
        </P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 88, paddingTop: 16 }}>
          <Decision
            title="Using the existing brand guidelines"
            text="Zuora had brand guidelines, mainly for graphics and promotional materials. To give the dashboards a unified, professional look, I studied them and chose which styles to carry over."
            img="brand1.png" alt="Zuora brand fonts and color palette" caption="Brand fonts and colors from the existing guidelines"
          />
          <Decision
            title="Choosing core colors for WCAG compliance"
            text="The dashboards needed only about 8 to 10 colors to tell data apart. Based on WCAG compliance, I selected 8 unique colors for data visualization, plus one color each for the background and text."
            img="brand2.png" alt="Contrast ratio checks and the selected data colors" caption="Contrast checks and the selected palette"
          />
          <Decision
            title="Working around technical limits"
            text="PowerBI is data modeling software with limited font choices, and the brand fonts weren't available in the app. I selected the closest font that was."
            img="colors1.png" alt="Segoe UI type scale for dashboards" caption="Type scale in Segoe UI, the closest available match"
          />
          <Decision
            title="Unified dimensions for a unified experience"
            text="The biggest cause of a choppy experience was that every dashboard had a different size. I wrote a layout guideline so they all share the same frame."
            img="colors2.png" alt="Dashboard layout guideline with frame sizes" caption="Layout guideline: main frame, accent banner and title banner"
          />
        </div>
      </Section>

      <Section id="adoption" title="Testing, iterating, and getting people to use it.">
        <P>To make sure the system would actually be used, I worked in a loop with the analysts.</P>
        <Cards numbered cols={4} items={[
          ['Built', 'Live dashboards using the new system.'],
          ['Gathered', 'Feedback from analysts every week.'],
          ['Refined', 'Spacing, grid flexibility, and color rules.'],
          ['Documented', 'The system, with usage guidance in PowerBI.'],
        ]} />
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <Quote text="The design system saved me time when creating new dashboards." who="Senior Sales Analyst" />
          <Quote text="Before, data locations differed across dashboards. The design system's consistency now allows me to find things where expected." who="Global Sales Leader" />
        </div>
      </Section>

      <Section id="reflection" title="Design systems are more than components.">
        <Cards cols={2} items={[
          ['More than visual polish', 'A successful design system is about reducing friction, aligning cross-functional teams, and working within constraints. Even without Figma or code, I learned to bring systems thinking into a tool like PowerBI and make it usable for non-designers.'],
          ['Learn the stakeholders\' language', 'I started with limited sales background, so joining a data analyst team was a challenge at first. To set goals and talk with stakeholders, I had to learn the terms and concepts in their reports. Teaching myself that let me find the pain points for the primary users, the data analysts.'],
        ]} />
      </Section>
    </CaseLayout>
  );
}
