// Archive case study: Colorful, a 48-hour designathon project (1st place). Content and colors brought
// over from the original write-up (lightly copy-edited); uses the shared case-study layout (caseKit).
// Images live in /assets/Colorful/; the hero reuses the Archive GIF. Pillar colors come from the
// original page: green = community, pink = empowerment, yellow = flexibility.
import { CaseLayout, Section, P, H3, Frame, Callout, Label, Rows, Feature as SplitFeature, TYPE, INK } from './caseKit.jsx';

const C = '/assets/Colorful/';

const GREEN = '#A7D934', PINK = '#FAA0B3', YELLOW = '#FFCE1F', LAVENDER = '#A39BFF';
const TINT = { green: 'rgba(167,217,52,.18)', pink: 'rgba(250,160,179,.22)', yellow: 'rgba(255,206,31,.18)', lav: 'rgba(163,155,255,.2)', blush: '#FEF0F3', gYellow: 'rgba(255,206,31,.2)', gGreen: 'rgba(167,217,52,.25)' };

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Understanding Users' },
  { id: 'market', label: 'The Market Gap' },
  { id: 'opportunity', label: 'Opportunity' },
  { id: 'testing', label: 'Testing + Iteration' },
  { id: 'hifi', label: 'High Fidelity' },
  { id: 'future', label: 'Future Steps' },
  { id: 'reflection', label: 'Reflection' },
];

// A feature: the mascot icon sits inline with the title, then the description, then the screen at
// the full width of the column on a plain white panel.
const Feature = ({ icon, title, desc, img, alt }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img src={C + icon} alt="" width="28" height="28" style={{ flexShrink: 0, display: 'block' }} />
        <H3>{title}</H3>
      </div>
      <p style={{ ...TYPE.body, fontSize: 16, color: 'rgba(26,26,24,.6)', marginTop: 10, maxWidth: 620 }}>{desc}</p>
    </div>
    <Frame src={C + img} alt={alt} wide tint="#fff" />
  </div>
);

const Chip = ({ children, bg }) => (
  <span style={{ ...TYPE.label, textTransform: 'none', letterSpacing: '.02em', padding: '5px 12px', background: bg, color: INK, fontWeight: 500 }}>{children}</span>
);

const PILLARS = [
  ['Community', GREEN, TINT.green],
  ['Empowerment', PINK, TINT.pink],
  ['Flexibility', YELLOW, TINT.yellow],
];

const COMPETITORS = ['Lingokids', 'SplashLearn', 'Drawing for Kids'];
const MARKET = [
  ['Community', TINT.green, [
    'Interactive lessons and collaborative games. Community involvement is good, but the emphasis is on language learning, not art-specific community building.',
    'Not a focus.',
    'Not a focus.',
  ]],
  ['Empowerment', TINT.pink, [
    'Points and rewards for achievement. Our research says hard metrics stress users with learning difficulties.',
    'Stars for achievement and progress tracking. Stars are a good reward, but progress tracking seems irrelevant to art creation.',
    'Drawing levels and tiers, badges and certificates. Levels and tiers can stress users who aren\'t making progress.',
  ]],
  ['Flexibility', TINT.yellow, [
    'Adapts to a child\'s pace and preferences. Letting users choose can be both empowering and accessible.',
    'Adapts to a child\'s pace and preferences. Letting users choose can be both empowering and accessible.',
    'Users choose drawing topics and try art styles, which encourages creativity through flexibility.',
  ]],
];

const Market = () => (
  <div className="ck-market" style={{ display: 'grid', gridTemplateColumns: '130px repeat(3,minmax(0,1fr))', gap: 8 }}>
    <div />
    {COMPETITORS.map((c) => <div key={c} style={{ ...TYPE.label, color: DIM, padding: '8px 4px' }}>{c}</div>)}
    {MARKET.map(([pillar, tint, cells]) => [
      <div key={pillar} style={{ ...TYPE.small, fontWeight: 600, color: INK, padding: '18px 8px 18px 0' }}>{pillar}</div>,
      ...cells.map((t, i) => <div key={pillar + i} style={{ ...TYPE.small, color: 'rgba(26,26,24,.62)', background: tint, padding: 18 }}>{t}</div>),
    ])}
  </div>
);
const DIM = 'rgba(26,26,24,.4)';

// A pain point, tinted with the color of the pillar it maps to.
const PainRow = ({ tint, pillar, title, text }) => (
  <div style={{ background: tint, padding: '22px 24px', display: 'flex', flexWrap: 'wrap', gap: '10px 32px' }}>
    <div style={{ flex: '0 0 180px' }}>
      <div style={{ ...TYPE.small, fontWeight: 600, color: INK }}>{title}</div>
      <div style={{ ...TYPE.label, color: 'rgba(26,26,24,.5)', marginTop: 6 }}>{pillar}</div>
    </div>
    <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.65)', flex: 1, minWidth: 240 }}>{text}</div>
  </div>
);

// Pillar-colored row: name on the left, ideas on the right.
const PillarRow = ({ name, tint, items }) => (
  <div style={{ background: tint, padding: '22px 24px', display: 'flex', flexWrap: 'wrap', gap: '10px 32px' }}>
    <div style={{ ...TYPE.small, fontWeight: 600, color: INK, flex: '0 0 180px' }}>{name}</div>
    <div style={{ ...TYPE.small, color: 'rgba(26,26,24,.65)', flex: 1, minWidth: 240 }}>
      {items.map((t) => <div key={t} style={{ padding: '2px 0' }}>{t}</div>)}
    </div>
  </div>
);

export default function Colorful({ onNext }) {
  return (
    <CaseLayout
      accent="#F2843A"
      tags={['Designathon', 'Accessibility', 'Product Design']}
      title="Colorful"
      subtitle="Creating inclusive youth communities with arts education."
      hero={<Frame src="/assets/Archive/colorful.gif" alt="Colorful app on a tablet" max={420} />}
      meta={[
        ['Timeline', '48-hour design sprint, April 2023'],
        ['Team', 'Jayden Kang · Megan Phi · Amy La · William Han'],
        ['Context', 'UCI You-Belong-Here Designathon'],
      ]}
      outcomes={{ items: [
        ['1st Place', 'UCI You-Belong-Here Designathon'],
        ['280+ Participants', 'Intercollegiate designathon'],
        ['48 Hours', 'From prompt to pitch'],
      ] }}
      sections={SECTIONS}
      next={{ eyebrow: 'Back to', title: 'Archive', cta: 'Back to archive', onNext }}
    >
      <Section id="overview" title="An accessible way for kids to make and share art.">
        <Callout>Design your own digital application that fosters community and celebrates inclusivity.</Callout>
        <P>
          Colorful is an accessible medium for younger students to embrace their creativity and to champion and share their work.
        </P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 96, paddingTop: 24 }}>
          <Feature icon="icon1.svg" title="Making your space" desc="Kids can get messy when creating or playing, and that's okay! We wanted to embrace this and let users organize their spaces however they like." img="space.png" alt="Space setup screen on an iPad" />
          <Feature icon="icon2.svg" title="Guided practice + free form" desc="Creative tools can be intimidating, and a steep learning curve isn't very kid friendly. Our characters lead guided practice sessions, but creativity shouldn't have hard rules, which is where free form comes in." img="guided.png" alt="Guided practice screen on an iPad" />
          <Feature icon="icon3.svg" title="Explore creativity through engagement" desc="Kids display their daily challenge creations on the Community Board. They can add written captions or audio clips to their one-of-one pieces, and scrolling through friends' work keeps them inspired and motivated." img="board.png" alt="Community board on an iPad" />
          <Feature icon="icon4.svg" title="Personal gallery and badges" desc="Awards and badges stand in for hard metrics, and a personal gallery keeps each child's work in one place. We also don't define when an artwork is 'done.'" img="gallery.png" alt="Personal gallery and badges on an iPad" />
        </div>
      </Section>

      <Section id="users" title="Understanding who we were designing for.">
        <P>
          It was a rapid-fire competition, so we weren't expected to run primary research. We gathered information online and used existing research. These were the main pain points for our target users, children with special needs.
        </P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PainRow tint={TINT.green} pillar="Community" title="Lack of community" text="Almost half of children with disabilities are excluded from the educational system, compared with just 13 percent of their non-disabled peers. That takes away chances to engage with their communities." />
          <PainRow tint={TINT.pink} pillar="Empowerment" title="Lack of confidence" text="Children with learning disabilities often have low self-esteem because school-based programs are built with a neurotypical child in mind. Children with limited mobility lose confidence when tasks are designed for the majority." />
          <PainRow tint={TINT.yellow} pillar="Flexibility" title="Unequal access to arts" text="The most robust arts programs are mostly in well-funded schools. 70% of parents of children with disabilities reported difficulty accessing arts programs and activities (Journal of Intellectual Disability Research)." />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <H3>From these, we defined three discovery pillars.</H3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PILLARS.map(([n, c]) => <Chip key={n} bg={c}>{n}</Chip>)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <H3>Three potential users guided our ideas.</H3>
          <Rows rows={[
            ['Child with ADHD', ['Difficulty sustaining focus', 'Overwhelmed by complexity', 'Frustrated by lack of progress']],
            ['Child with limited hand mobility', ['Frustrated by precision tasks', 'Struggles to manipulate tools', 'Difficulty with fine motor control']],
            ['Parent of a child who is hard of hearing', ['Wants their child to feel empowered', 'Needs a community of parents for advice']],
          ]} />
        </div>
      </Section>

      <Section id="market" title="How are competitors tackling these pain points?">
        <Market />
      </Section>

      <Section id="opportunity" title="How might we make art feel welcoming for every child?">
        <Callout>
          How might we create an accessible medium for younger children to embrace their creativity and empower them to champion and share their work?
        </Callout>
        <P>We brainstormed features that address our goals and fill the gaps we found in the market.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PillarRow name="Community" tint={TINT.green} items={['A community board for parents', 'Students can share their work', 'Children respond to the same daily challenge and see others\' work']} />
          <PillarRow name="Empowerment" tint={TINT.pink} items={['Don\'t define when artwork is "done"', 'Awards and badges instead of hard metrics', 'A personal gallery']} />
          <PillarRow name="Flexibility" tint={TINT.yellow} items={['Free form or guided practice', 'Board setup', 'Voice or typed explanation', 'A feedback forum']} />
        </div>
        <Frame src={C + 'infoarch.png'} alt="Information architecture for Colorful" caption="We organized the feature ideas into an information architecture" wide />
      </Section>

      <Section id="testing" title="Key design decisions from user testing.">
        <P>
          With our first wireframes, we asked each other to perform tasks. Based on how that went and the feedback, we made these changes.
        </P>
        <Frame src={C + 'lowfi.png'} alt="Low-fidelity wireframes for Colorful" caption="Low-fidelity wireframes" wide />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>
          {[
            ['iter1.png', 'Designing for two distinct user groups: children and parents.', 'Wireframe iteration for children and parents'],
            ['iter2.png', 'Removing the stress of choice so users focus on one thing at a time.', 'Wireframe iteration: one focus at a time'],
            ['iter3.png', 'Making the artboard intuitive by minimizing necessary functions.', 'Wireframe iteration: a simpler artboard'],
          ].map(([f, t, alt], i) => (
            <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Label style={{ color: 'var(--acc)' }}>{`Decision ${i + 1}`}</Label>
              <H3>{t}</H3>
              <Frame src={C + f} alt={alt} wide />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <H3>Technical considerations</H3>
          <Rows rows={[
            ['Platform', 'Designing for iPad, with multi-modal interactions'],
            ['Feel', 'Micro-interactions and audio stimuli'],
            ['Feedback', 'A dedicated feedback forum for continual improvement'],
            ['Safety', 'Parental lock and security'],
            ['Guidance', 'Guide characters that help users past the learning curve of tech'],
            ['Motivation', 'Awards and badges when users hit a streak'],
          ]} />
          <Frame src={C + 'tech.png'} alt="Parental lock PIN screen with team notes" caption="Parental lock, with our notes from the design session" max={420} />
        </div>
      </Section>

      <Section id="hifi" title="A visual design that's friendly, intuitive, and accessible.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 112, paddingTop: 8 }}>
          <SplitFeature n="01" title="Guide characters" desc="Playful characters talk to users and interact with them along their artistic journey, and help them get past the learning curve of the technology.">
            <Frame src={C + 'hifi1.png'} alt="Guide character asking what to draw" max={220} />
          </SplitFeature>
          <SplitFeature n="02" title="WCAG 2.0 color contrast" desc="We tested every component with a color contrast tool so a lack of contrast never gets in the way of the experience." reverse>
            <Frame src={C + 'hifi2.png'} alt="Contrast ratio checks passing WCAG" max={300} />
          </SplitFeature>
          <SplitFeature n="03" title="Touch-friendly design" desc="We followed WCAG's minimum target size of 44 by 44px for every tappable element.">
            <Frame src={C + 'hifi3.png'} alt="Buttons sized to 44px minimum" max={240} />
          </SplitFeature>
        </div>
      </Section>

      <Section id="future" title="Looking forward, and measuring success.">
        <Rows rows={[
          ['Sharing and creating', ['How often are users sharing and creating work?', 'How often do they include written captions?', 'How often do they add audio clips?', 'Are they starting to open up more?']],
          ['Getting comfortable', ['Are users becoming more proficient with Colorful?', 'Are they completing doodles faster?', 'Are they relying less on guided practice and doing more free form?']],
          ['Parents', ['How are parents interacting with Colorful?', 'What does engagement in the forum look like?', 'What do testimonies say about efficacy?']],
        ]} />
      </Section>

      <Section id="reflection" title="Takeaways and lessons learned.">
        <P>
          This was my second-ever design-a-thon, and it was an incredible experience. Working with a talented, diverse team (William, Megan, and Amy) was an honor. The topic was sensitive, and our first ideas were raw and unpolished. Through open discussion and constructive feedback, we shaped them into powerful concepts.
        </P>
        <P>
          The all-nighters, hours of discussion, and prototyping paid off when we pitched our product and won first place. I'm so grateful to my teammates.
        </P>
        <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <Frame src={C + 'award.png'} alt="First place winner announcement" caption="First place at the UCI designathon" max={300} />
          <Frame src={C + 'team.png'} alt="Pitching the technical considerations" caption="Pitching the final product" max={300} />
        </div>
      </Section>
    </CaseLayout>
  );
}
