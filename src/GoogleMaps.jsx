// Archive case study: Google Maps feature proposal (route optimization). Content brought over from
// the original write-up; uses the shared case-study layout (caseKit). Images in /assets/GoogleMaps/.
import { CaseLayout, Section, P, Callout, Frame, Feature, TYPE, INK } from './caseKit.jsx';

const G = '/assets/GoogleMaps/';
const HERO = '/assets/Archive/gmap.png';

const SECTIONS = [
  { id: 'problem', label: 'Problem' },
  { id: 'entry', label: 'Multi-Stop Entry' },
  { id: 'optimize', label: 'Route Optimization' },
  { id: 'save', label: 'Save Routes' },
];

export default function GoogleMaps({ onNext }) {
  return (
    <CaseLayout
      accent="#1A73E8"
      tags={['Feature Proposal', 'UX Research', 'UI Exploration']}
      title="Google Maps Route Optimization"
      subtitle="A feature proposal for making multi-stop trips on Google Maps simpler to plan."
      hero={<Frame src={HERO} alt="Multi-stop route options on Google Maps" max={420} />}
      meta={[['Timeline', 'March – April 2024'], ['Scope', 'UX Research · UI Exploration'], ['Team', 'Solo Project']]}
      sections={SECTIONS}
      next={{ eyebrow: 'Back to', title: 'Archive', cta: 'Back to archive', onNext }}
    >
      <Section id="problem" title="Multi-stop trips take too much thinking.">
        <Callout>
          Navigating multi-stop routes on Google Maps requires too much cognitive load, leading to inefficient and time-consuming travel.
        </Callout>
      </Section>

      <Section id="entry" title="Add multiple stops with just a click.">
        <Feature n="01" title="Multi-stop entry" desc="Users add multiple stops with just a click. They enter the addresses or locations of the various stops they want to add to their journey.">
          <Frame src={G + 'multistop.png'} alt="Place page with an Add stop button" max={520} />
        </Feature>
      </Section>

      <Section id="optimize" title="Google Maps finds the best order for you.">
        <Feature n="02" title="Route optimization" desc="Google Maps automatically optimizes the route by considering the order of stops, minimizing travel time. Users can tap a button to see alternative routes, which display different orderings of stops."  reverse>
          <Frame src={G + 'step2.png'} alt="Route options showing different stop orderings" max={520} />
        </Feature>
      </Section>

      <Section id="save" title="Save optimized routes to use again.">
        <Feature n="03" title="Save optimized routes" desc="Users save routes for future use and access them in their saved lists.">
          <Frame src={G + 'savin.png'} alt="Save to list screen with a Saved confirmation" max={520} />
        </Feature>
      </Section>
    </CaseLayout>
  );
}
