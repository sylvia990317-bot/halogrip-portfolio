import type { Metadata } from "next";
import { Koulen, Roboto_Mono } from "next/font/google";
import "./halogrip.css";
import "./scroll-intro.css";
import "./design-gap-sequence.css";
import InteractionDeck from "./interaction-deck";
import ScrollIntro from "./scroll-intro";
import { meta } from "./content";
import OverviewBackdrop from "./overview-backdrop";
import DesignGapSequence from "./design-gap-sequence";
import ConceptCarousel from "./concept-carousel";
import ConceptSketchLightbox from "./sketch-lightbox";
import SectionReveal from "./section-reveal";
import NeedScene from "./need-scene";
import CloseProjectButton from "./close-project-button";

// Route-scoped, same pattern as scroll-intro.tsx's Poppins load: keeps these fonts
// off `/` and off every other route. Replaces the self-hosted Nimbus Sans Narrow /
// DejaVu Sans Mono files (still on disk, unused) with the Mason Wong reference site's
// own display/mono pairing (--display / --mono in halogrip.css).
const koulen = Koulen({ subsets: ["latin"], weight: ["400"], display: "swap", variable: "--halogrip-display" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--halogrip-mono" });

const title = "HALOGRIP — Sylvia Xie";
const description = "A human-centered emergency steering system for autonomous vehicles. A UX, HMI, and industrial design case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sylviaxie.vercel.app"),
  title,
  description,
  openGraph: { title, description, images: [{ url: encodeURI("/media/halogrip图片/other/hero.webp"), width: 2100, height: 1181, alt: "HALOGRIP emergency steering device" }] },
  twitter: { card: "summary_large_image", title, description, images: [encodeURI("/media/halogrip图片/other/hero.webp")] },
};

// NOTE: the hero's `meta` array moved into ./scroll-intro.tsx, which renders the
// static hero as its fallback / loading state.

const findings = [
  ["OVERALL CONCERN", "PUBLIC + FIRST RESPONDERS", "Removing the steering wheel entirely leaves passengers unsure what to do if the vehicle stops — and responders worried it could delay action in a life-threatening situation."],
  ["CONTROL OVER VEHICLE BEHAVIOR", "ON-GROUND OPERATION", "Responders want assurance the vehicle won't move or drift while they work close to it — placing a ladder, reaching a patient — on an already chaotic scene."],
  ["INSUFFICIENT STRATEGIES", "COMPANY + FIRST-RESPONDER OPTIONS", "Local assistants can't reach a blocked scene either, and remote-assistant calls break down in loud, low-signal emergencies. What's left is pushing the vehicle aside with a fire truck — impossible to aim precisely."],
  ["LACK OF STANDARDIZATION", "CONTROLS + SOFTWARE UPDATES", "Every brand places emergency controls differently, and updates can change how they work without warning — one more thing to relearn under pressure."],
];

const principles = [
  ["IMMEDIATE", "No remote operator in the critical path."],
  ["FAMILIAR", "Understandable with little or no training."],
  ["PREDICTABLE", "Low-speed movement with a clear stop state."],
  ["GLOVE-FRIENDLY", "Large, tactile, visible physical controls."],
];

const steps = [
  ["AUTHORIZE", "Scan an authorized responder ID at the vehicle.", "01-authorize"],
  ["ACTIVATE", "Verify the steering device to enable manual control.", "02-activate"],
  ["REPOSITION", "Move the vehicle using the tilt-and-turn grip.", "03-reposition"],
  ["PARK", "Secure the vehicle once emergency access is clear.", "04-park"],
  ["COMPLETE", "End manual intervention and return system control.", "05-complete"],
];

// Coordinates are fractions of product-front.webp's own 2100x1032 frame (0-1, labels can sit
// slightly beyond 0-1 since they read just outside the image's own silhouette). Chosen by
// sampling the image's alpha channel directly (see session notes) so each `point` lands on real
// opaque device geometry. Labels sit straight out from their point (up for 01/02, down for
// 03/04) rather than tucked into the gaps inside the photo — reads as a callout pointing away
// from the object, not text curling back into it — while staying close/short and pulled in from
// the page's outer margins rather than the product's very edge.
//
// `lineEnd` is where the leader *line* stops — independent of `label`, which is where the
// text block itself sits. 03/04's label sits well below the image (1.16) with visible empty
// space in between, so the line stops well short of it (1.0) instead of spanning that whole
// gap; 01/02 have no such gap, so their line still runs the full point-to-label distance
// (lineEnd === label).
const PRODUCT_ANNOTATIONS = [
  { id: "01", title: "OPEN GRIP", note: "RECOGNIZABLE", point: [0.85, 0.18], label: [0.85, -0.07], lineEnd: [0.85, -0.07] },
  { id: "02", title: "ID ACCESS", note: "AUTHORIZED", point: [0.5, 0.47], label: [0.5, 0.3], lineEnd: [0.5, 0.3] },
  { id: "03", title: "TILT INPUT", note: "HANDS-ONLY", point: [0.08, 0.8], label: [0.08, 1.16], lineEnd: [0.08, 1.0] },
  { id: "04", title: "15 KM/H", note: "LIMITED", point: [0.9, 0.8], label: [0.9, 1.16], lineEnd: [0.9, 1.0] },
] as const;
const PRODUCT_IMG_W = 2100;
const PRODUCT_IMG_H = 1032;

export default function HalogripPage() {
  return (
    <main id="top" className={`${koulen.variable} ${robotoMono.variable}`}>
      <header className="topbar shell">
        <a className="wordmark" href="/">SYLVIA XIE</a>
        <span className="topbar-note">A COLLECTION OF WORK / 2025</span>
        <a className="topbar-link" href="#overview">EXPLORE PROJECT ↘</a>
      </header>

      <CloseProjectButton />

      <ScrollIntro />

      <section className="product-intro section shell">
        <div className="product-intro-heading">
          <SectionReveal tag="h2">NEXT GENERATION STEERING DEVICE</SectionReveal>
        </div>
        <div className="metadata">
          {meta.map(([label, value]) => (
            <div className="meta-item" key={label}>
              <span className="eyebrow">[ {label} ]</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <figure className="product-intro-image">
          <img src={encodeURI("/media/halogrip图片/other/untitled.226.png")} alt="Close-up of the HALOGRIP grip's authorization control and mounting detail" loading="lazy" />
        </figure>
      </section>

      <section className="overview section" id="overview">
        <OverviewBackdrop />
        <div className="overview-content shell">
          <span className="eyebrow overview-marker">[ 01 / OVERVIEW ]</span>
          <div className="overview-copy">
            <SectionReveal tag="h2">WHEN THE VEHICLE STOPS,<br />THE RESPONSE SHOULD NOT.</SectionReveal>
            <SectionReveal tag="p">HALOGRIP is a compact, low-speed fallback interface that lets authorized first responders reposition a stalled robotaxi on site.</SectionReveal>
          </div>
        </div>
      </section>

      <section className="challenge-scene challenge-scene-cabin dark-section" aria-labelledby="challenge-cabin-title">
        <div className="challenge-scene-inner shell">
          <span className="chapter-label">[ 02 / CHALLENGE ]</span>
          <span className="eyebrow">[ CABIN SHIFT ]</span>
          <div className="cabin-shift-layout">
            <div className="challenge-scene-copy">
              <SectionReveal tag="h2" id="challenge-cabin-title">THE DRIVER IS DISAPPEARING<br />FROM THE CABIN.</SectionReveal>
              <SectionReveal tag="p">Purpose-built robotaxis are beginning to move beyond the conventional driver&rsquo;s cockpit. Deployment, however, remains in transition as regulations and emergency systems adapt.</SectionReveal>
            </div>
            <figure className="cabin-figure">
              <img src={encodeURI("/media/halogrip图片/2.1/robotaxi-cabin.png")} alt="Purpose-built robotaxi cabin without conventional driving controls" loading="lazy" />
              <figcaption>
                <div><span className="signal signal-plus">+</span><p>More flexible passenger space</p></div>
                <div><span className="signal signal-minus">&minus;</span><p>Traditional controls removed</p></div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <NeedScene />

      <DesignGapSequence />

      <section className="research section shell" id="research">
        <span className="eyebrow">[ 03 / PROBLEM STATEMENT ]</span>

        <div className="research-layout">
          <div className="research-left">
            <SectionReveal tag="h2">LISTEN BEFORE DESIGNING.</SectionReveal>
            <SectionReveal tag="p" className="research-intro">Interviews with first responders and a public survey surfaced four recurring concerns about robotaxis.</SectionReveal>
            <figure className="research-photo">
              <img src={encodeURI("/media/halogrip图片/03/firefighter-rescue.png")} alt="A firefighter rappels from an aerial ladder platform during a rescue operation" loading="lazy" />
            </figure>
          </div>

          <div className="research-findings">
            {findings.map(([title, meta, body], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <span className="research-finding-meta">{meta}</span>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
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

      <section className="principles" id="principles">
        <div className="principles-inner shell">
          <div className="principles-intro">
            <span className="eyebrow">[ 04 / DESIGN PRINCIPLES ]</span>
            <SectionReveal tag="h2">CONTROL MUST<br />FEEL OBVIOUS<br />UNDER <span>PRESSURE.</span></SectionReveal>
            <SectionReveal tag="p">Research shifted the project away from futuristic controls and toward a recognizable, local, physical interface.</SectionReveal>
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
          <SectionReveal tag="h2">FIVE DIRECTIONS FOR CONTROL.</SectionReveal>
          <SectionReveal tag="p">Four approaches explored how emergency personnel might take control without conventional pedals or a permanent steering wheel.</SectionReveal>
        </div>
        <ConceptCarousel />
      </section>

      <section className="sketch-process section shell" id="sketch-process">
        <span className="eyebrow">[ 06 / SKETCH PROCESS ]</span>
        {/* TODO(sylvia): draft heading — review/replace */}
        <SectionReveal tag="h2">REFINING THE SELECTED DIRECTION.</SectionReveal>
        {/* TODO(sylvia): draft intro — review/replace; spans both stages below */}
        <SectionReveal tag="p" className="sketch-process-intro">Sketching moved through two stages: exploring different overall forms before converging on the pull-out wheel, then refining the grip itself.</SectionReveal>

        <div className="sketch-process-stage">
          <span className="sketch-process-stage-label">Concept convergence</span>
          {/* TODO(sylvia): draft copy below (concept titles/descriptions, converged qualities,
              why-this-direction) — review/replace. Layout ported from the reference mock at
              public/media/halogrip图片/06-sketch-process/reference.png. */}
          <div className="sketch-process-converge">
            <ConceptSketchLightbox />

            <div className="sketch-process-converge-synth">
              <span className="sketch-process-converge-arrow" aria-hidden="true">&rarr;</span>
              <span className="sketch-process-converge-synth-label">Synthesized into</span>
              <p>Extracted the strongest qualities from each direction.</p>
            </div>

            <div className="sketch-process-converge-result">
              <span className="sketch-process-result-tag">Final &mdash; Selected direction</span>
              <p className="sketch-process-result-summary">B-pillar + Mechanical + HUD + U-shape + attached to dashboard</p>
              <figure>
                <img src={encodeURI("/media/halogrip图片/05-iteration/sketch-5-final-pullout-wheel.jpg")} alt="Final sketch: B-pillar mounted, mechanical, HUD, U-shape pull-out wheel attached to the dashboard — the selected direction" loading="lazy" />
              </figure>
              <div className="sketch-process-qualities">
                {[
                  ["B-pillar placement", "Clear visibility and ergonomic reach from the driver's seat."],
                  ["Mechanical pull-out", "Tangible, intuitive deployment from the dashboard."],
                  ["U-shape grip", "A recognizable, accessible form for both hands."],
                  ["Tilt-based control", "Hands-only speed modulation, no separate pedal."],
                  ["HUD feedback", "Dynamic driving information at eye level."],
                  ["NFC authorization", "Secure, seamless activation before use."],
                ].map(([title, desc], i) => (
                  <article key={title}>
                    <span>0{i + 1}</span>
                    <div>
                      <h4>{title}</h4>
                      <p>{desc}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="sketch-process-why">
                <span className="sketch-process-why-label">Why this direction</span>
                <p>Combines the clearest physical interaction with the fewest necessary controls — while keeping the device visible, accessible, and deliberately limited.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sketch-process-stage">
          <span className="sketch-process-stage-label">Grip refinement</span>
          <figure className="sketch-process-wide">
            <img src={encodeURI("/media/halogrip图片/05-iteration/sketches.webp")} alt="Six rounds of grip-form iteration converging on the final selected shape" loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="final-hero dark-section" id="solution">
        <img className="final-background" src={encodeURI("/media/halogrip图片/other/cockpit.webp")} alt="Robotaxi cockpit interior with the HALOGRIP steering device embedded in the dashboard" loading="lazy" />
        <div className="final-scrim" />
        <div className="final-content shell">
          <span className="eyebrow">[ 07 / FINAL CONCEPT ]</span>
          <SectionReveal tag="h2">HALOGRIP</SectionReveal>
          <SectionReveal tag="p">A compact, on-board fallback control for safely repositioning a stalled robotaxi.</SectionReveal>
        </div>
      </section>

      <section className="product-detail section shell" id="product-overview">
        <div className="product-copy">
          <span className="eyebrow">[ 07.1 / PRODUCT OVERVIEW ]</span>
          <SectionReveal tag="h2">DESIGNED TO BE VISIBLE,<br />ACCESSIBLE AND<br />DELIBERATELY LIMITED.</SectionReveal>
        </div>
        <div className="product-visual">
          <img src={encodeURI("/media/halogrip图片/other/product-front.webp")} alt="Front view of the HALOGRIP steering device showing its open, angular hand grips and illuminated controls" loading="lazy" />
          <svg className="product-annotations" viewBox={`0 0 ${PRODUCT_IMG_W} ${PRODUCT_IMG_H}`} aria-hidden="true">
            {PRODUCT_ANNOTATIONS.map(({ id, point, lineEnd }) => (
              <g key={id}>
                <line x1={point[0] * PRODUCT_IMG_W} y1={point[1] * PRODUCT_IMG_H} x2={lineEnd[0] * PRODUCT_IMG_W} y2={lineEnd[1] * PRODUCT_IMG_H} />
                <circle cx={point[0] * PRODUCT_IMG_W} cy={point[1] * PRODUCT_IMG_H} r={7} />
              </g>
            ))}
          </svg>
          {PRODUCT_ANNOTATIONS.map(({ id, title, note, label }) => (
            <div key={id} className="product-annotation" style={{ left: `${label[0] * 100}%`, top: `${label[1] * 100}%` }}>
              <span>{id}</span>
              <strong>{title}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="interaction section shell" id="interaction">
        <div className="interaction-heading">
          <div><span className="eyebrow">[ 07.2 / INTERACTION MODEL ]</span><SectionReveal tag="h2">TURN TO STEER. <span>TILT TO MOVE.</span></SectionReveal><SectionReveal tag="p">Direction and speed live in one familiar, hands-only physical interaction.</SectionReveal></div>
        </div>
        <InteractionDeck />
      </section>

      <SectionReveal id="handover" className="journey">
        <div className="journey-inner shell">
          <span className="eyebrow">[ 07.3 / EMERGENCY HANDOVER ]</span>
          <h2>FROM BLOCKED TO CLEARED.</h2>
          <p className="journey-lede">ONE RESPONDER / LOCAL CONTROL / TARGET INTERVENTION UNDER FIVE MINUTES</p>
          <div className="story-grid">
            {steps.map(([title, description, file], index) => (
              <article key={title}>
                <img src={encodeURI(`/media/halogrip图片/09-handover/${file}.png`)} alt={`${title}: ${description}`} loading="lazy" />
                <div className="story-step">
                  <span>0{index + 1}</span>
                  <i aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div className="system-detail">
            <div className="access-detail"><span className="eyebrow">[ 07.3.1 / SECURE ACCESS ]</span><div className="access-images"><img src={encodeURI("/media/halogrip图片/other/id-one.webp")} alt="Responder identity verification interface" loading="lazy" /><img src={encodeURI("/media/halogrip图片/other/id-two.webp")} alt="Successful authorization screen for vehicle entry" loading="lazy" /></div><p>Two verification steps separate vehicle access from manual control.</p></div>
            <div className="hud-detail"><span className="eyebrow">[ 07.3.2 / HEAD-UP DISPLAY ]</span><img src={encodeURI("/media/halogrip图片/other/hud.webp")} alt="Head-up display presenting manual control status and emergency driving guidance" loading="lazy" /><p>Only the information needed to maintain situational awareness during intervention.</p></div>
          </div>
        </div>
      </SectionReveal>

      <footer className="site-footer shell">
        <div><span className="eyebrow">[ MASTER’S THESIS / 2025 ]</span><SectionReveal tag="h2">DESIGNED FOR THE PEOPLE<br />WHO CANNOT AFFORD TO WAIT.</SectionReveal></div>
        <div className="footer-bottom"><span>SYLVIA XIE — USER RESEARCH &amp; CONCEPT / AUTOLIV × CHALMERS</span><a href="/">BACK TO HOME ↑</a></div>
      </footer>
    </main>
  );
}
