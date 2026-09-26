// Case study: UW × Amazon RAISE, AI AAC Device. Content is Jayden's own write-up, lightly
// condensed. Uses the shared case-study layout (caseKit). Images live in /assets/AAC/.
import { CaseLayout, Section, P, H3, Cards, Card, Frame, Split, Feature, Quote, Metrics, Label, Tag, Sq, TYPE, INK, LINE, SOFT } from './caseKit.jsx';

const A = '/assets/AAC/';

const SECTIONS = [
  { id: 'context', label: 'Context & Problem' },
  { id: 'research', label: 'Research' },
  { id: 'findings', label: 'Key Findings' },
  { id: 'hypotheses', label: 'Hypotheses' },
  { id: 'solution', label: 'Exploring Solutions' },
  { id: 'prototype', label: 'The Prototype' },
  { id: 'ai', label: 'AI Thinking Layer' },
  { id: 'reflection', label: 'Reflection' },
];

const Finding = ({ n, title, quote, who }) => (
  <Card title={title}>
    <p style={{ fontStyle: 'italic', margin: '4px 0 14px' }}>“{quote}”</p>
    <span style={{ ...TYPE.label, textTransform: 'none', color: 'rgba(26,26,24,.35)' }}>{who}</span>
  </Card>
);

const Rho = ({ title, rows }) => (
  <div>
    <Label style={{ marginBottom: 14, color: 'var(--acc)' }}>{title}</Label>
    {rows.map(([t, r]) => (
      <div key={t} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '16px 0', borderTop: `1px solid ${SOFT}` }}>
        <span style={{ ...TYPE.small, color: 'rgba(26,26,24,.6)' }}>{t}</span>
        <span style={{ ...TYPE.label, textTransform: 'none', color: INK, whiteSpace: 'nowrap' }}>ρ {r}</span>
      </div>
    ))}
  </div>
);

const Pair = ({ title, items, tone }) => (
  <div>
    <Label style={{ marginBottom: 14, color: tone || 'var(--acc)' }}>{title}</Label>
    {items.map(([t, d]) => (
      <div key={t} style={{ padding: '16px 0', borderTop: `1px solid ${SOFT}` }}>
        <div style={{ ...TYPE.small, fontWeight: 600, color: INK }}>{t}</div>
        <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.5)' }}>{d}</div>
      </div>
    ))}
  </div>
);

export default function AACDevice({ onNext }) {
  return (
    <CaseLayout
      accent="#4B2E83"
      tags={['UW × Amazon RAISE', 'Research', 'Design']}
      title="AI AAC Device for Children with Autism"
      subtitle="Imagining a schedule-first AI AAC prototype for children with autism and their caregivers."
      hero={<Frame src={A + 'aacmain.png'} alt="Schedule-first AAC prototype on a tablet" max={400} />}
      meta={[
        ['Team', 'Jayden Kang · Henson Chen · Kathryn Rambo'],
        ['Timeline', 'July – September 2025 · Ongoing'],
        ['Context', 'University of Washington research project'],
      ]}
      outcomes={{ label: 'My contributions', items: [
        ['Presentation', 'Presented our research at the UW × Amazon RAISE AI Conference.'],
        ['Survey & Flow Design', 'Structured the caregiver survey so the results were clear and usable.'],
        ['Framing & Ideation', 'Led research question synthesis and the “How Might We” sessions.'],
        ['Prototype & Testing', 'Built the schedule-first prototype and the usability testing script.'],
      ] }}
      sections={SECTIONS}
      next={{ title: 'Designing for Gen AI Experiences', onNext }}
    >
      <Section id="context" title="AAC tools are static, hard to personalize, and often abandoned.">
        <Split>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <P>AAC (Augmentative and Alternative Communication) devices support communication when speech is hard. That can be anything from picture cards to speech-generating apps.</P>
            <P>For a research project at the University of Washington, we explored how AI could make them better for autistic children.</P>
          </div>
          <Frame src={A + 'what_are_aac_device.png'} alt="A typical AAC device with a grid of core words" caption="A typical AAC board: a fixed grid of words" max={260} />
        </Split>
        <Quote text="I hope technology can help my child express abstract feelings and sensations, like hunger, tiredness, or poor sleep." who="Caregiver response from survey" />
      </Section>

      <Section id="research" title="Grounded in literature, informed by caregivers.">
        <Cards cols={2} numbered items={[
          ['Literature review', 'We mapped where current AAC tools work (alternatives to speech) and where they fail (rigid boards, low adoption, high caregiver effort).'],
          ['Caregiver survey', 'I structured it to mix Likert ratings with open-ended questions, so we got both patterns and personal stories about daily communication. We reached 19 parents of children aged 5 to 25.'],
        ]} />
        <Frame src={A + 'affinitymapping.png'} alt="Affinity map of the literature review" caption="Affinity map: device limitations, emotional context, caregiver needs, and opportunities for AI" max={420} />
      </Section>

      <Section id="findings" title="Three core caregiver frustrations.">
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 20 }}>
          <Finding n="01" title="Rigid routines" quote="He insists on finding specific brands (e.g., Panasonic) when shopping and is obsessively repetitive." who="Mother of a 5-year-old boy with ASD" />
          <Finding n="02" title="Abstract concepts and schedules" quote="My child repeatedly asks about the day’s schedule until I write it down!" who="Mother of a 25-year-old man with ASD" />
          <Finding n="03" title="Meltdowns tied to time of day" quote="He gets angry and throws things when he can't open a bottle, especially right after waking up or when overtired." who="Mother of a 5-year-old boy with ASD" />
        </div>
        <Split>
          <Frame src={A + 'low-adoption.png'} alt="Pie chart: 79% of caregivers don't use AAC, 21% do" caption="Do you use AAC? 15 said no, 4 said yes" max={240} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <H3>Most families aren’t using AAC.</H3>
            <P>Caregivers worried it might inhibit natural speech, that it’s complex and costly, and that it overwhelms kids.</P>
          </div>
        </Split>
        <div>
          <Label style={{ marginBottom: 14 }}>What already works</Label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Visual schedules', 'Simplified language', 'A child’s special interests, like cartoon characters'].map((x) => <Tag key={x}>{x}</Tag>)}
          </div>
        </div>
      </Section>

      <Section id="hypotheses" title="Preparing for the next round of research.">
        <P>From the first study we formed hypotheses about how context shapes openness to change and trust in AI-powered AAC. These will guide our next survey.</P>
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <Rho title="Trust in AI" rows={[
            ['Current method works well → more worried AI will make AAC too complex', '0.68'],
            ['Current method doesn’t fit the child → more comfortable sharing video/audio for model training', '−0.57'],
            ['Child struggles to start conversations → caregivers more likely to trust AI support', '0.61'],
          ]} />
          <Rho title="Openness to change" rows={[
            ['Current method doesn’t fit the child → more open to changing communication methods', '−0.74'],
            ['Older caregivers or longer caregiving experience → less open to change', '−0.72'],
          ]} />
        </div>
      </Section>

      <Section id="solution" title="What if AAC could anticipate needs instead of staying static?">
        <P>Once we pulled our insights together, we turned the problem into opportunities. I led a team ideation session where we came up with and grouped “How Might We” questions, all tied back to what caregivers told us.</P>
        <Frame src={A + 'personaaac.png'} alt="Persona, themes, and How Might We board" caption="Our persona, the five themes we heard, and the ideas we grouped" max={360} />
        <Cards cols={3} numbered items={[
          ['Express needs early', 'How might we help children express internal needs before escalation?'],
          ['Adapt to the day', 'How might we adapt AAC to daily rhythms and emotions?'],
          ['Less guesswork', 'How might we reduce caregiver guesswork while maintaining trust?'],
        ]} />
      </Section>

      <Section id="prototype" title="A schedule-first, AI-powered prototype.">
        <P>Time of day strongly shaped communication: mornings were harder, transitions caused stress, and routines gave children stability. I built a rough prototype in v0.dev. It wasn't meant to be a final app. It was a way to test whether a schedule-first approach could cut down on caregiver guesswork.</P>
        <Frame src={A + 'now-nextroutine.png'} alt="Annotated Now/Next schedule screen" caption="Now/Next routines with predictive phrases that follow the schedule" max={400} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 128, paddingTop: 48 }}>
          <Feature n="01" title="Daily Emotion Check" desc="AI labels the emotion it sees and caregivers refine it, building emotional vocabulary and reducing guesswork.">
            <Frame src={A + 'emotion-check.png'} alt="Emotion check screen" panel={380} />
          </Feature>
          <Feature n="02" title="Emergency Mode" desc="A one-tap shortcut to calming tools, like a guided breathing exercise, to de-escalate meltdowns." reverse>
            <Frame src={A + 'emergencymode.png'} alt="Breathing exercise screen" panel={380} />
          </Feature>
          <Feature n="03" title="Caregiver Dashboard" desc="Tracks progress and offers AI insights, like suggested new words, so caregivers get clarity and control.">
            <Frame src={A + 'caregiverdashboard.png'} alt="Parent dashboard screen" panel={380} />
          </Feature>
        </div>
      </Section>

      <Section id="ai" title="What AI enables, and what could go wrong.">
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <Pair title="What it enables" items={[['Predictive suggestions', 'Anticipates likely needs by time and routine.'], ['Context adaptation', 'Surfaces phrases tied to environment and schedule.'], ['Emotion loop', 'Learns from caregiver corrections.']]} />
          <Pair title="What could go wrong" tone="#B4321F" items={[['Mislabeling', 'Wrong emotion labels could erode caregiver trust.'], ['Overreliance', 'Tech replacing human bonding.'], ['Privacy', 'Sensitive communication patterns need protection.']]} />
        </div>
      </Section>

      <Section id="reflection" title="Looking back.">
        <Cards cols={3} numbered items={[
          ['Designing with and for AI', 'I learned to balance what AI can do with caregiver trust, and to think of AI as a supportive partner, not a replacement.'],
          ['Challenges', 'The timeline was short, I didn\'t know the subject area well at first, and a few survey questions confused people.'],
          ['What I’d do differently', 'I\'d spend more time on the literature review, take longer to refine the questions before collecting data, and run 2 to 3 practice surveys before the full pilot.'],
        ]} />
      </Section>
    </CaseLayout>
  );
}
