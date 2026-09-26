// Case study: Skillshare Class Discovery Redesign. Uses the shared case-study layout (caseKit).
import { CaseLayout, Section, P, H3, Cards, Frame, Rows, Tag, Callout, Quote, Flow, Metrics, Label, TYPE, INK, LINE, SOFT } from './caseKit.jsx';

const BASE = '/assets/ClassDiscovery/';
const I = {
  hero:          BASE + 'mockupofclassdiscovery.png',
  existingCard:  BASE + 'existingclasscard.png',
  classPage:     BASE + 'classpage.png',
  mentalModel:   BASE + 'MentalModel.png',
  mostImportant: BASE + 'mostimportantclassdetailsl.png',
  modal:         BASE + 'designed-modalfordecisionmaking.png',
  cardUsability: BASE + 'cardforusabilitytest.png',
  updatedFinal:  BASE + 'updatedcard%20based%20on%20results.png',
};

const SECTIONS = [
  { id: 'problem', label: 'The Problem' },
  { id: 'research', label: 'Research' },
  { id: 'design', label: 'Design' },
  { id: 'testing', label: 'Testing + Iteration' },
  { id: 'results', label: 'Results' },
  { id: 'reflection', label: 'Reflection' },
];

const Strong = ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>;

export default function ClassDiscovery({ onNext }) {
  return (
    <CaseLayout
      accent="#00A86B"
      tags={['Skillshare', 'Interaction Design', 'UX Research']}
      title="Class Discovery Redesign"
      subtitle="A redesign of how learners choose a class, built around how people actually decide instead of guessing and bouncing."
      hero={<Frame src={I.hero} alt="Class discovery redesign mockup" max={400} />}
      meta={[
        ['Context', 'Class discovery at Skillshare, redesigned so people feel confident about which class to take.'],
        ['Team', 'Jayden Kang · 1 PM · 3 Engineers'],
        ['Timeline', '4 Weeks · Live on Platform'],
      ]}
      outcomes={{ items: [
        ['+47% Subscriptions', 'In A/B testing, resulting in full rollout'],
        ['+5% Click-Through Rate', 'In A/B testing, resulting in full rollout'],
        ['Survey Design & Analysis', 'Pre-design survey (n=2,277) to identify information hierarchy'],
        ['Usability Testing', 'Designed and ran an unmoderated Maze test with 183 participants'],
      ] }}
      sections={SECTIONS}
      next={{ title: 'Onboarding & Member Home', onNext }}
    >
      <Section id="problem" title="Users were flying blind.">
        <Callout>
          When someone picks a class, they think it through in stages. But the old flow gave them one big jump: <Strong>card straight to the full class page</Strong>. There was no in-between, so people had to commit before they knew enough to decide.
        </Callout>
        <P>
          You can guess what happened. People dropped off before committing, clicked into the wrong classes, or saved a class as a placeholder because they didn't have enough info yet.
        </P>
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Frame src={I.existingCard} alt="Existing class card" caption="The old card showed just a title and duration" max={240} />
          <Frame src={I.classPage} alt="Full class page" caption="The full class page was too much, too soon" max={240} />
        </div>
        <Rows rows={[
          ['Drop-off', 'Users bounced before reaching the class page', <Tag tone="red">Impact</Tag>],
          ['Misclicks', 'Without preview, users clicked into the wrong classes', <Tag tone="amber">Impact</Tag>],
          ['Saves ≠ Starts', '"Save" really meant "maybe later," not "I want this"', <Tag tone="amber">Impact</Tag>],
        ]} />
      </Section>

      <Section id="research" title="I designed around how people decide.">
        <P>
          In our user interviews, the same pattern kept coming up. People don't decide in one step. They move through a few stages before they commit. I wanted the design to follow that instead of fighting it.
        </P>
        <Frame src={I.mentalModel} alt="User mental model" caption="The three stages people go through, from our interviews" max={380} />
        <Cards cols={3} items={[
          ['Scan first', '"I immediately scan the thumbnails. Then I check the class duration. Time is always my biggest deciding factor."'],
          ['Then a checklist', '"My checklist is: editor picks, student count, and then I test the first couple videos."'],
          ['Proof before commit', '"I look for reviews and whether people actually finished the class. Then I watch the intro to see if it grabs me."'],
        ]} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <H3>Then I checked it with numbers.</H3>
            <Tag tone="blue">n=2,277</Tag>
          </div>
          <P>
            I ran a survey asking learners to rank what mattered most when picking a class. It backed up what we heard in interviews, and it gave me real data to decide what to show first.
          </P>
        </div>
        <Frame src={I.mostImportant} alt="Survey results: most and least important class details" caption="Survey results: most important (left) and least important (right) class details" max={380} />
      </Section>

      <Section id="design" title="I turned one big jump into four steps.">
        <Callout>
          Instead of one big jump, I broke it into four stages: <Strong>progressive disclosure</Strong> where each stage shows just enough to help you decide what to do next.
        </Callout>
        <Flow steps={[
          { title: 'Card', sub: 'Scan' },
          { title: 'Hover', sub: 'Skim' },
          { title: 'Modal', sub: 'Evaluate' },
          { title: 'Class', sub: 'Commit', hi: true },
        ]} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <H3>Every piece of information mapped to a stage.</H3>
          <P>The survey told me what mattered most, so I put each detail at the stage where it's actually useful, instead of dumping everything on one screen.</P>
        </div>
        <Rows rows={[
          ['Default Card', 'Title · Materials/Skills · Level · Students · Duration · Rating', <Tag tone="green">3 new fields</Tag>],
          ['Hover State', 'Autoplay intro video · All skills expanded', <Tag tone="green">New</Tag>],
          ['Modal', 'Trailer · Project outcomes · Reviews · Skill level · Time', <Tag tone="green">New</Tag>],
          ['Class Page', 'Full curriculum · Instructor · Community', <Tag>Existing</Tag>],
        ]} />
        <Frame src={I.modal} alt="Designed modal" caption="The modal gives deeper context without committing to a full page" max={400} />
      </Section>

      <Section id="testing" title="183 people told us what to fix.">
        <P>
          We tested the new flow with an unmoderated Maze study of 183 people. 78.5% completed the task, which was a good sign, and it showed me three clear things to fix.
        </P>
        <Metrics items={[['78.5%', 'Task success rate'], ['183', 'Maze participants'], ['3', 'Iterations made']]} />
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {[
            ['What landed', 'green', [['Hover previews + trailers', 'Gave confidence before committing'], ['Modal vs. direct start', 'Respected browsing vs. decision-ready mode']]],
            ['What we fixed', 'amber', [['"View More" was unclear', 'Now "Learn More"'], ['Expected a save button', 'Added a bookmark to the card'], ['Card missing metadata', 'Added level, students, length']]],
          ].map(([head, tone, rows]) => (
            <div key={head}>
              <div style={{ marginBottom: 14 }}><Tag tone={tone}>{head}</Tag></div>
              {rows.map(([t, d]) => (
                <div key={t} style={{ padding: '14px 0', borderTop: `1px solid ${SOFT}` }}>
                  <div style={{ ...TYPE.small, fontWeight: 600, color: INK }}>{t}</div>
                  <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.5)' }}>{d}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Frame src={I.cardUsability} alt="Hover card tested in Maze" caption="Before: the card we tested" max={300} />
          <Frame src={I.updatedFinal} alt="Hover card after iteration" caption="After: updated from the results" max={300} />
        </div>
        <div style={{ borderLeft: '1px solid var(--acc)', paddingLeft: 24 }}>
          <Label style={{ marginBottom: 8 }}>Engineering collaboration</Label>
          <H3>Hover buffer logic</H3>
          <p style={{ ...TYPE.small, fontSize: 15, color: 'rgba(26,26,24,.55)', marginTop: 8, maxWidth: 560 }}>
            I worked with the engineers to add a small buffer zone around the hover card. It stops the card from flickering when the cursor briefly leaves, and a short delay before the video plays keeps it from startling anyone. It's a small detail, but it changes how the whole thing feels.
          </p>
        </div>
      </Section>

      <Section id="results" title="It shipped, and it worked.">
        <Callout>
          We A/B tested the new design against the old card, and the results were clear enough that we rolled it out to <Strong>every user on the platform</Strong>.
        </Callout>
        <Metrics items={[['+47%', 'Subscriptions · A/B → Full Rollout'], ['+5%', 'Click-Through Rate'], ['100%', 'Rolled out to all users']]} />
        <P>
          For me, the numbers say something pretty simple. When people get the right info at the right time, they decide faster and with more confidence. Progressive disclosure wasn't just nice to have here. It matched how people actually think.
        </P>
      </Section>

      <Section id="reflection" title="What I'd carry forward.">
        <Cards cols={2} items={[
          ['Design is decision architecture', 'Good UX follows how people actually decide, not how I wish they would. Mapping out the decision process first made every design choice after that faster, and easier to explain.'],
          ['Ship decisions, not preferences', 'Every change I made was backed by real user data. That made conversations with my team much easier, and it made the product better. I now think of research as part of the design work, not extra work on top of it.'],
        ]} />
      </Section>
    </CaseLayout>
  );
}
