// Archive case study: Ki.domi, a solo passion project helping senior citizens in Seoul use self-service
// kiosks. Content brought over from the original write-up (lightly copy-edited); uses the shared
// case-study layout (caseKit). Images live in /assets/Kidomi/.
import { CaseLayout, Section, P, H3, Cards, Frame, Callout, Rows, Feature, Tag, TYPE } from './caseKit.jsx';

const K = '/assets/Kidomi/';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'research', label: 'Research' },
  { id: 'interviews', label: 'Interviews' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'solution', label: 'Design Solution' },
  { id: 'testing', label: 'Testing + Iteration' },
  { id: 'final', label: 'Final Experience' },
  { id: 'takeaways', label: 'Takeaways' },
  { id: 'future', label: 'Future Steps' },
];

const Cols = ({ n, children, gap = 24 }) => (
  <div className="ck-cols" style={{ display: 'grid', gridTemplateColumns: `repeat(${n},minmax(0,1fr))`, gap, alignItems: 'start' }}>{children}</div>
);

const Decision = ({ n, title, img, alt }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <H3>{`${n}. ${title}`}</H3>
    <Frame src={K + img} alt={alt} wide />
  </div>
);

export default function Kidomi({ onNext }) {
  return (
    <CaseLayout
      accent="#7B5BE8"
      tags={['Ki.domi', 'Accessibility', 'Mobile App']}
      title="Ki.domi"
      subtitle="Helping senior citizens in Seoul feel confident with self-service machines."
      hero={<Frame src={K + 'thumb.png'} alt="Ki.domi app screens" max={420} />}
      meta={[
        ['Timeline', 'June – August 2022'],
        ['Context', 'Solo passion project'],
        ['Methods', 'Guerrilla interviews · Wireframing · Prototyping'],
      ]}
      sections={SECTIONS}
      next={{ eyebrow: 'Back to', title: 'Archive', cta: 'Back to archive', onNext }}
    >
      <Section id="overview" title="It all began with an encounter.">
        <P>
          I was waiting in line to order food at a food court in Korea, and I saw a grandma struggling with the kiosk. She was completely lost, so I ended up helping her with her order. That sparked a question: what is the experience of senior citizens with self-service machines?
        </P>
        <Cols n={3}>
          <Frame src={K + 'kiosk1.png'} alt="A man using a self-ordering kiosk" max={320} />
          <Frame src={K + 'kiosk2.png'} alt="Another kiosk in a Korean restaurant" max={320} />
          <Frame src={K + 'context.jpeg'} alt="Kiosk ordering in a restaurant" max={320} />
        </Cols>
        <Callout>
          In technology-centric cities like Seoul, senior citizens can feel excluded, even with the simplest tasks like ordering food at a store.
        </Callout>
        <P>Ki.domi lets senior citizens in Korea use self-service kiosk machines with ease.</P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 112, paddingTop: 24 }}>
          <Feature n="01" title="Easily locate yourself" desc="Ki.domi finds the nearest restaurants for you. Tap “Relocate” to update your location whenever you need to.">
            <Frame src={K + 'feat-cart.png'} alt="Stores near me screen with a Relocate button" max={440} />
          </Feature>
          <Feature n="02" title="Afraid of online transactions? That's okay!" desc="Add and remove items freely. Nothing is charged until you physically insert your card at the kiosk." reverse>
            <Frame src={K + 'feat-voice.gif'} alt="Adding items to an order" max={520} />
          </Feature>
          <Feature n="03" title="Stuck? Ki.domi will help." desc="Use voice search to find stores, add menu items, and get help.">
            <Frame src={K + 'feat-qr.gif'} alt="Voice search in the menu" max={520} />
          </Feature>
          <Feature n="04" title="Scan your QR code on the kiosk" desc="Check out and place your order by scanning the QR code on the kiosk." reverse>
            <Frame src={K + 'scan.png'} alt="Phone showing a QR code next to a kiosk" max={420} />
          </Feature>
        </div>
      </Section>

      <Section id="research" title="Starting with what already exists.">
        <P>
          I started with white paper research and read articles on kiosk use by seniors in Korea. A survey by the Seoul Digital Foundation was especially helpful. It found three main reasons seniors are reluctant to use kiosks.
        </P>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['They are difficult to use', 'They are not necessary', 'Peer pressure'].map((x) => <Tag key={x}>{x}</Tag>)}
        </div>
        <Frame src={K + 'piechart.png'} alt="Survey results on why seniors avoid kiosks" caption="Seoul Digital Foundation survey" max={340} />
      </Section>

      <Section id="interviews" title="How do seniors feel about ordering with kiosks?">
        <P>
          At a local McDonald's where kiosks were the main way to order, I ran guerrilla interviews with 7 senior citizens between the ages of 60 and 80. I wanted to empathize with them personally and understand what makes kiosks hard to use.
        </P>
        <Frame src={K + 'interviews.png'} alt="Quotes from senior citizens about kiosks" max={720} />
        <Callout>
          Low digital literacy and the physical difficulty of kiosks are the surface-level pain points. The major problem is the emotional burden.
        </Callout>
        <Cards cols={3} items={[
          ['Fear of making a mistake', ''],
          ['Lack of confidence', ''],
          ['Peer pressure', ''],
        ]} />
      </Section>

      <Section id="ideas" title="Three design directions.">
        <P>I proposed three directions to address what I learned.</P>
        <Rows rows={[
          ['A. Accessible kiosk machine', ['Physical controllers and voice aid', 'Intuitive screens with fewer steps', 'No time countdown']],
          ['B. Kiosk education app', ['A demo of how to use kiosks, based on the specific franchise', 'Practice on your phone']],
          ['C. Kiosk aid mobile app', ['Voice-assisted ordering', 'Choose your menu on your phone', 'A QR code to scan on the kiosk screen']],
        ]} />
        <Cols n={2} gap={32}>
          <Frame src={K + 'idea-a.png'} alt="Sketch of a kiosk with physical controllers" caption="Direction A: physical controllers" max={300} />
          <Frame src={K + 'idea-b.png'} alt="Sketches of a redesigned kiosk flow" caption="Direction A: a simpler kiosk flow" max={300} />
        </Cols>
        <H3>I evaluated the ideas against the three pain points.</H3>
        <Frame src={K + 'compare.png'} alt="Comparison of the three solutions against each pain point" wide />
        <P>Reflecting on the pain points, the kiosk aid app was the best solution.</P>
      </Section>

      <Section id="solution" title="QR code orders.">
        <P>
          The goal was to keep the user's interaction with the kiosk to a minimum, so ordering stays low stress. With QR code orders, the only things a user does at the kiosk are scan the code and insert their card.
        </P>
        <Cols n={2} gap={32}>
          <Frame src={K + 'qr1.png'} alt="Each pain point matched to a solution" caption="Each pain point has an answer" max={280} />
          <Frame src={K + 'qr2.png'} alt="Illustration of scanning a QR code at a kiosk" caption="Scan the code, then insert your card" max={280} />
        </Cols>
        <H3>User flow</H3>
        <Frame src={K + 'flow1.png'} alt="User flow with and without Ki.domi" wide />
        <Frame src={K + 'flow2.png'} alt="Hand-drawn flow for the Ki.domi app" wide />
      </Section>

      <Section id="testing" title="Key design decisions from testing.">
        <P>
          With the first wireframes, I tested the product with 5 seniors between the ages of 60 and 80 and watched how they did on specific tasks. Based on the usability tests, I made these changes.
        </P>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>
          <Decision n="1" title="A more identifiable store finder" img="iter1.png" alt="Store finder before and after" />
          <Decision n="2" title="It needs to be intuitive" img="iter2.png" alt="Menu screen changes for intuitiveness" />
          <Decision n="3" title="Accessible touch targets" img="iter3.png" alt="Larger touch targets and QR access" />
        </div>
      </Section>

      <Section id="final" title="A three-step flow.">
        <Frame src={K + 'final.png'} alt="Find stores, add to order, checkout" wide />
      </Section>

      <Section id="takeaways" title="The key to good UX is always empathy.">
        <Cards cols={2} items={[
          ['Be extra wary about accessibility', 'Because this app is for seniors, I asked myself with every choice: what is more accessible and intuitive? Accessibility is tricky, especially when you aren\'t experiencing the struggles first hand. I made buttons and fonts bigger, simplified the flow, and added a menu button in the top right corner so users can check their order anytime.'],
          ['Empathize with their logic, not mine', 'The questions that came up along the way could only be answered with user interviews and research data. At one point I realized I was coming up with solutions by "empathizing" with my own logic. I needed to return to what users actually said, and when that wasn\'t enough, I ran more rounds of testing.'],
        ]} />
      </Section>

      <Section id="future" title="Moving forward.">
        <P>
          This experience was designed around the pain points of senior citizens, but the target users could expand to anyone who wants to order food at a restaurant. If it is accessible for people with special needs, it is easier for everyone else too.
        </P>
        <Rows rows={[
          ['Technical considerations', 'Because this is a cross-device experience, the kiosk may need an attached QR code scanner. Its hardware and software should be optimized for fast processing and responsiveness during QR scanning and payment.'],
        ]} />
      </Section>
    </CaseLayout>
  );
}
