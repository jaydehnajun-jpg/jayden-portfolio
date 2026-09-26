// Archive page for a client usability study (Nordstrom AI Gift Finder). Covers how the study was run,
// with the client named and two public screenshots. Findings and numbers are deliberately left out:
// the NDA still covers confidential information.
import { CaseLayout, Section, P, Cards, Rows, Frame } from './caseKit.jsx';

const U = '/assets/Usability/';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'method', label: 'How We Ran It' },
  { id: 'questions', label: 'What We Studied' },
  { id: 'delivered', label: 'What We Delivered' },
];

export default function UsabilityStudy({ onNext }) {
  return (
    <CaseLayout
      accent="#1A1A18"
      tags={['Nordstrom', 'UX Research', 'Usability Testing']}
      title="AI Gift Finder Usability Study"
      subtitle="A moderated usability study of Nordstrom's conversational AI gift-shopping feature."
      hero={<Frame src={U + 'gift-landing.png'} alt="Nordstrom's AI Gift Finder landing screen" max={420} />}
      meta={[
        ['Timeline', 'Winter 2026'],
        ['Context', 'Client project for Nordstrom, through a UW usability testing course'],
        ['Team', '4 researchers'],
      ]}
      sections={SECTIONS}
      next={{ eyebrow: 'Back to', title: 'Archive', cta: 'Back to archive', onNext }}
    >
      <Section id="overview" title="Testing an AI gift finder with real shoppers.">
        <P>
          This was real client work. As a team of four, we ran a moderated usability study of Nordstrom's AI Gift Finder, a chat tool that suggests gifts once you describe who you're shopping for. The results are confidential, so this page covers how we ran the study. I'm happy to talk through what we learned in conversation.
        </P>
        <Frame src={U + 'gift-chat.png'} alt="The AI Gift Finder chat with product suggestions" caption="The AI Gift Finder returns product suggestions and follow-up questions" wide />
      </Section>

      <Section id="method" title="A structured, think-aloud study.">
        <Cards cols={2} items={[
          ['Participants', 'Five occasional shoppers, picked from 118 screener responses so they matched the people the feature is meant for.'],
          ['Format', 'Moderated sessions run remotely over Zoom, 40 to 60 minutes each, using the think-aloud method.'],
          ['Roles', 'Two researchers in every session: one moderating and one taking notes.'],
          ['Measures', 'Task success, 7-point satisfaction and ease ratings, the System Usability Scale, and qualitative think-aloud and interview data.'],
        ]} />
        <Rows rows={[
          ['1', 'Orientation and a pre-test interview about how people shop for gifts today.'],
          ['2', 'Four tasks, each followed by a short interview, and a questionnaire where it applied.'],
          ['3', 'A post-test questionnaire, the SUS, and a closing interview.'],
        ]} />
      </Section>

      <Section id="questions" title="Four parts of the experience.">
        <Cards cols={2} items={[
          ['Discovery', 'How people look for ideas today, and where the AI feature fits into that.'],
          ['Recommendations', 'How people use the assistant, and how useful they find what it suggests.'],
          ['Saving ideas', 'How people expect to save what they like, and whether the experience matches.'],
          ['Feedback to the AI', 'How people understand and use the ways of telling the AI how it did.'],
        ]} />
      </Section>

      <Section id="delivered" title="A report the client could act on.">
        <Cards cols={2} items={[
          ['A written findings report', 'An executive summary, findings ranked by severity on Nordstrom\'s severity scale, and a recommendation for each.'],
          ['A full appendix', 'The session script, scenarios and tasks, screener, questionnaires, quantitative results, and the raw session recordings.'],
        ]} />
      </Section>
    </CaseLayout>
  );
}
