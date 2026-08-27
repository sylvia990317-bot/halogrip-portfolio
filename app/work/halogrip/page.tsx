import type { Metadata } from "next";
import "./halogrip.css";
import "./scroll-intro.css";
import InteractionDeck from "./interaction-deck";
import ScrollIntro from "./scroll-intro";
import OverviewBackdrop from "./overview-backdrop";

const title = "HALOGRIP — Sylvia Xie";
const description = "A human-centered emergency steering system for autonomous vehicles. A UX, HMI, and industrial design case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://halogrip-portfolio.vercel.app"),
  title,
  description,
  openGraph: { title, description, images: [{ url: "/media/hero.webp", width: 2100, height: 1181, alt: "HALOGRIP emergency steering device" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/media/hero.webp"] },
};

// NOTE: the hero's `meta` array moved into ./scroll-intro.tsx, which renders the
// static hero as its fallback / loading state.

const principles = [
  ["IMMEDIATE", "No remote operator in the critical path."],
  ["FAMILIAR", "Understandable with little or no training."],
  ["PREDICTABLE", "Low-speed movement with a clear stop state."],
  ["GLOVE-FRIENDLY", "Large, tactile, visible physical controls."],
];

const concepts = [
  ["SCREEN + PEDAL", "Space-intensive", "concept-screen"],
  ["PULL-OUT WHEEL", "Selected direction", "concept-pullout"],
  ["MODULAR DEVICE", "Potential misuse", "concept-module"],
  ["DECISION UI", "Higher mental load", "concept-decision"],
];

const iterations = [
  ["LOWER PIVOT", "Forward pressure now maps clearly to acceleration and backward pressure to braking."],
  ["BIGGER CONTROLS", "Physical buttons remain visible and operable while wearing protective gloves."],
  ["TWO-STEP ACCESS", "Unlocking the vehicle and activating manual control are clearly separated."],
];

const steps = [
  ["IDENTIFY", "Scan an authorized responder ID at the vehicle."],
  ["ACTIVATE", "Verify the steering device to enable manual control."],
  ["REPOSITION", "Move the vehicle using the tilt-and-turn grip."],
  ["PARK", "Secure the vehicle once emergency access is clear."],
  ["RELEASE", "End manual intervention and return system control."],
];

export default function HalogripPage() {
  return (
    <main id="top">
      <header className="topbar shell">
        <a className="wordmark" href="/">SYLVIA XIE</a>
        <span className="topbar-note">A COLLECTION OF WORK / 2025</span>
        <a className="topbar-link" href="#overview">EXPLORE PROJECT ↘</a>
      </header>

      <a className="close-project" href="/">
        <span className="close-project-track">
          <span>CLOSE PROJECT</span>
          <span aria-hidden="true">CLOSE PROJECT</span>
        </span>
      </a>

      <ScrollIntro />

      <section className="overview section" id="overview">
        <OverviewBackdrop />
        <div className="overview-content shell">
          <span className="eyebrow overview-marker">[ 01 / OVERVIEW ]</span>
          <div className="overview-copy">
            <h2>WHEN THE VEHICLE STOPS,<br />THE RESPONSE SHOULD NOT.</h2>
            <p>HALOGRIP is a compact, low-speed fallback interface that lets authorized first responders reposition a stalled robotaxi on site.</p>
          </div>
        </div>
      </section>

      <section className="challenge dark-section" aria-labelledby="challenge-title">
        <img className="challenge-background" src="/media/emergency.webp" alt="Firefighters responding to a building fire" loading="lazy" />
        <div className="challenge-content shell">
          <span className="eyebrow">[ 02 / THE CHALLENGE ]</span>
          <h2 id="challenge-title">NO STEERING WHEEL.<br />NO TIME TO WAIT.</h2>
          <p>A stalled autonomous vehicle can block a fire engine or prevent first responders from reaching someone in time.</p>
          <div className="challenge-reasons">
            <article><span>01</span><strong>REMOTE HELP</strong><p>May arrive too late.</p></article>
            <article><span>02</span><strong>PUSH / TOW</strong><p>Needs space and equipment.</p></article>
            <article><span>03</span><strong>NO OVERRIDE</strong><p>Creates uncertainty on scene.</p></article>
          </div>
          <p className="challenge-gap"><span>A CRITICAL DESIGN GAP</span> — Lack of manual interaction methods.</p>
        </div>
      </section>

      <section className="research section shell" id="research">
        <span className="eyebrow">[ 03 / FIELD RESEARCH ]</span>
        <h2>LISTEN BEFORE DESIGNING.</h2>
        <div className="research-gallery">
          <img className="research-fire" src="/media/emergency.webp" alt="Emergency services responding to a fire" loading="lazy" />
          <img className="research-prototype" src="/media/prototype.webp" alt="Physical foam prototypes used to evaluate the emergency controls" loading="lazy" />
          <img className="research-city" src="/media/night-city.webp" alt="Night-time traffic and an autonomous vehicle in the city" loading="lazy" />
        </div>
        <div className="research-bottom">
          <div className="research-stats">
            <div><strong>04</strong><span>FIREFIGHTER<br />INTERVIEWS</span></div>
            <div><strong>02</strong><span>FIRE STATIONS<br />VISITED</span></div>
            <div><strong>76</strong><span>SURVEY<br />RESPONSES</span></div>
          </div>
          <blockquote>“FIVE TO TEN MINUTES<br />ALREADY FEELS LONG.”<cite>FIRST-RESPONDER INSIGHT</cite></blockquote>
        </div>
      </section>

      <section className="principles dark-section" id="principles">
        <div className="principles-inner shell">
          <div className="principles-intro">
            <span className="eyebrow">[ 04 / DESIGN PRINCIPLES ]</span>
            <h2>CONTROL MUST<br />FEEL OBVIOUS<br />UNDER <span>PRESSURE.</span></h2>
            <p>Research shifted the project away from futuristic controls and toward a recognizable, local, physical interface.</p>
            <img src="/media/product-detail.webp" alt="Close-up of the tactile HALOGRIP controls" loading="lazy" />
          </div>
          <div className="principles-list">
            {principles.map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="concepts section shell" id="concepts">
        <span className="eyebrow">[ 05 / CONCEPT EXPLORATION ]</span>
        <div className="concept-heading">
          <h2>HOW SHOULD CONTROL APPEAR<br />IN A VEHICLE DESIGNED WITHOUT IT?</h2>
          <p>Four approaches explored how emergency personnel might take control without conventional pedals or a permanent steering wheel.</p>
        </div>
        <img className="sketch-sheet" src="/media/sketches.webp" alt="Hand-drawn exploration of emergency control concepts and steering wheel forms" loading="lazy" />
        <div className="concept-grid">
          {concepts.map(([title, note, image], index) => (
            <article className={index === 1 ? "concept-selected" : ""} key={title}>
              <img src={`/media/${image}.webp`} alt={`${title} concept sketch`} loading="lazy" />
              <div><span>0{index + 1}</span><h3>{title}</h3><p>{note}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="testing" id="testing">
        <div className="testing-photo">
          <img src="/media/prototype.webp" alt="Full-size foam models used to evaluate the removable emergency steering interface" loading="lazy" />
          <span>1:1 PHYSICAL PROTOTYPES / EVALUATION ROUNDS 01–03</span>
        </div>
        <div className="testing-copy">
          <span className="eyebrow">[ 06 / PROTOTYPE TESTING ]</span>
          <h2>TEST.<br />LEARN.<br /><span>REFINE.</span></h2>
          <p>Evaluation revealed three specific breakdowns that changed the final design.</p>
          <div className="iteration-list">
            {iterations.map(([title, body], index) => (
              <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-hero dark-section" id="solution">
        <img className="final-background" src="/media/hero.webp" alt="Final HALOGRIP steering system illuminated in deep blue and teal" loading="lazy" />
        <div className="final-content shell">
          <span className="eyebrow">[ 07 / FINAL CONCEPT ]</span>
          <h2>HALOGRIP</h2>
          <p>A VISIBLE, ANALOG FALLBACK STEERING DEVICE EMBEDDED IN THE ROBOTAXI DASHBOARD.</p>
          <div className="final-specs">
            {[["OPEN GRIP", "RECOGNIZABLE"], ["ID ACCESS", "AUTHORIZED"], ["TILT INPUT", "HANDS-ONLY"], ["15 KM/H", "LIMITED"]].map(([title, note], index) => (
              <article key={title}><span>0{index + 1}</span><strong>{title}</strong><small>{note}</small></article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail section shell">
        <div className="product-copy">
          <span className="eyebrow">[ VISIBLE BY DEFAULT ]</span>
          <h2>DESIGNED TO<br />BE RECOGNIZED<br />IN A SECOND.</h2>
          <p>The open steering profile remains recognizable inside the dashboard while maintaining enough space for gloved hands.</p>
        </div>
        <img src="/media/product-front.webp" alt="Front view of the HALOGRIP steering device showing its open, angular hand grips and illuminated controls" loading="lazy" />
        <div className="product-spec-line"><span>OPEN GEOMETRY / PROTECTIVE GLOVES</span><span>TACTILE SWITCHES / NFC AUTHENTICATION</span></div>
      </section>

      <section className="interaction section shell" id="interaction">
        <div className="interaction-heading">
          <div><span className="eyebrow">[ 08 / INTERACTION MODEL ]</span><h2>TURN TO STEER.<br /><span>TILT TO MOVE.</span></h2><p>Direction and speed live in one familiar, hands-only physical interaction.</p></div>
          <span className="speed-note">MANUAL SPEED / 15 KM/H MAX</span>
        </div>
        <InteractionDeck />
        <div className="interaction-footer"><span>ROTATION / DIRECTION</span><span>FORWARD TILT / ACCELERATION</span><span>BACKWARD TILT / BRAKE + REVERSE</span></div>
      </section>

      <section className="journey dark-section" id="handover">
        <div className="journey-inner shell">
          <span className="eyebrow">[ 09 / EMERGENCY HANDOVER ]</span>
          <h2>FROM BLOCKED<br />TO CLEARED.</h2>
          <p className="journey-lede">ONE RESPONDER / LOCAL CONTROL / TARGET INTERVENTION UNDER FIVE MINUTES</p>
          <div className="story-grid">
            {steps.map(([title, description], index) => (
              <article key={title}><img src={`/media/story-${index + 1}.webp`} alt={`${title}: ${description}`} loading="lazy" /><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
          <div className="system-detail">
            <div className="access-detail"><span className="eyebrow">[ SECURE ACCESS ]</span><div className="access-images"><img src="/media/id-one.webp" alt="Responder identity verification interface" loading="lazy" /><img src="/media/id-two.webp" alt="Successful authorization screen for vehicle entry" loading="lazy" /></div><p>Two verification steps separate vehicle access from manual control.</p></div>
            <div className="hud-detail"><span className="eyebrow">[ HEAD-UP DISPLAY ]</span><img src="/media/hud.webp" alt="Head-up display presenting manual control status and emergency driving guidance" loading="lazy" /><p>Only the information needed to maintain situational awareness during intervention.</p></div>
          </div>
          <div className="outcomes">
            {[["02", "ID SCANS"], ["01", "RESPONDER"], ["15", "KM/H MAX"], ["<5", "MIN TARGET"]].map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <footer className="site-footer shell">
        <div><span className="eyebrow">[ MASTER’S THESIS / 2025 ]</span><h2>DESIGNED FOR THE PEOPLE<br />WHO CANNOT AFFORD TO WAIT.</h2></div>
        <div className="footer-bottom"><span>SYLVIA XIE — USER RESEARCH &amp; CONCEPT / AUTOLIV × CHALMERS</span><a href="/">BACK TO HOME ↑</a></div>
      </footer>
    </main>
  );
}
