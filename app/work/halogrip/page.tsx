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
import SectionReveal from "./section-reveal";
import NeedScene from "./need-scene";

// Route-scoped, same pattern as scroll-intro.tsx's Poppins load: keeps these fonts
// off `/` and off every other route. Replaces the self-hosted Nimbus Sans Narrow /
// DejaVu Sans Mono files (still on disk, unused) with the Mason Wong reference site's
// own display/mono pairing (--display / --mono in halogrip.css).
const koulen = Koulen({ subsets: ["latin"], weight: ["400"], display: "swap", variable: "--halogrip-display" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--halogrip-mono" });

const title = "HALOGRIP — Sylvia Xie";
const description = "A human-centered emergency steering system for autonomous vehicles. A UX, HMI, and industrial design case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://halogrip-portfolio.vercel.app"),
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

export default function HalogripPage() {
  return (
    <main id="top" className={`${koulen.variable} ${robotoMono.variable}`}>
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

      <section className="product-intro section shell">
        <div className="product-intro-heading">
          <h2>NEXT GENERATION STEERING DEVICE</h2>
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
            <h2>WHEN THE VEHICLE STOPS,<br />THE RESPONSE SHOULD NOT.</h2>
            <p>HALOGRIP is a compact, low-speed fallback interface that lets authorized first responders reposition a stalled robotaxi on site.</p>
          </div>
        </div>
      </section>

      <section className="challenge-scene challenge-scene-cabin dark-section" aria-labelledby="challenge-cabin-title">
        <div className="challenge-scene-inner shell">
          <span className="eyebrow">[ 02.1 / CABIN SHIFT ]</span>
          <div className="cabin-shift-layout">
            <div className="challenge-scene-copy">
              <h2 id="challenge-cabin-title">THE DRIVER IS DISAPPEARING<br />FROM THE CABIN.</h2>
              <p>Purpose-built robotaxis are beginning to move beyond the conventional driver&rsquo;s cockpit. Deployment, however, remains in transition as regulations and emergency systems adapt.</p>
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
            <h2>LISTEN BEFORE DESIGNING.</h2>
            <p className="research-intro">Interviews with first responders and a public survey surfaced four recurring concerns about robotaxis.</p>
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
            <h2>CONTROL MUST<br />FEEL OBVIOUS<br />UNDER <span>PRESSURE.</span></h2>
            <p>Research shifted the project away from futuristic controls and toward a recognizable, local, physical interface.</p>
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
        <ConceptCarousel />
      </section>

      <section className="sketch-process section shell" id="sketch-process">
        <span className="eyebrow">[ 06 / SKETCH PROCESS ]</span>
        {/* TODO(sylvia): draft heading — review/replace */}
        <h2>FROM WHEEL TO GRIP.</h2>
        <figure className="sketch-process-figure">
          <img src={encodeURI("/media/halogrip图片/other/sketches.webp")} alt="Six rounds of hand-sketched iteration converging on the final HALOGRIP grip form" loading="lazy" />
          {/* TODO(sylvia): draft caption — review/replace */}
          <figcaption>SIX ITERATION ROUNDS / FINAL FORM SELECTED</figcaption>
        </figure>
      </section>

      <section className="final-hero dark-section" id="solution">
        <img className="final-background" src={encodeURI("/media/halogrip图片/other/cockpit.webp")} alt="Robotaxi cockpit interior with the HALOGRIP steering device embedded in the dashboard" loading="lazy" />
        <div className="final-scrim" />
        <div className="final-content shell">
          <span className="eyebrow">[ 07 / FINAL CONCEPT ]</span>
          <h2>HALOGRIP</h2>
          <p>A compact, on-board fallback control for safely repositioning a stalled robotaxi.</p>
        </div>
      </section>

      <section className="product-detail section shell">
        <div className="product-copy">
          <span className="eyebrow">[ PRODUCT OVERVIEW ]</span>
          <h2>DESIGNED TO BE VISIBLE,<br />ACCESSIBLE AND<br />DELIBERATELY LIMITED.</h2>
          <div className="final-specs">
            {[["OPEN GRIP", "RECOGNIZABLE"], ["ID ACCESS", "AUTHORIZED"], ["TILT INPUT", "HANDS-ONLY"], ["15 KM/H", "LIMITED"]].map(([title, note], index) => (
              <article key={title}><span>0{index + 1}</span><strong>{title}</strong><small>{note}</small></article>
            ))}
          </div>
        </div>
        <img src={encodeURI("/media/halogrip图片/other/product-front.webp")} alt="Front view of the HALOGRIP steering device showing its open, angular hand grips and illuminated controls" loading="lazy" />
      </section>

      <section className="interaction section shell" id="interaction">
        <div className="interaction-heading">
          <div><span className="eyebrow">[ 08 / INTERACTION MODEL ]</span><h2>TURN TO STEER.<br /><span>TILT TO MOVE.</span></h2><p>Direction and speed live in one familiar, hands-only physical interaction.</p></div>
          <span className="speed-note">MANUAL SPEED / 15 KM/H MAX</span>
        </div>
        <InteractionDeck />
        <div className="interaction-footer"><span>ROTATION / DIRECTION</span><span>FORWARD TILT / ACCELERATION</span><span>BACKWARD TILT / BRAKE + REVERSE</span></div>
      </section>

      <SectionReveal id="handover" className="journey">
        <div className="journey-inner shell">
          <span className="eyebrow">[ 09 / EMERGENCY HANDOVER ]</span>
          <h2>FROM BLOCKED<br />TO CLEARED.</h2>
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
            <div className="access-detail"><span className="eyebrow">[ SECURE ACCESS ]</span><div className="access-images"><img src={encodeURI("/media/halogrip图片/other/id-one.webp")} alt="Responder identity verification interface" loading="lazy" /><img src={encodeURI("/media/halogrip图片/other/id-two.webp")} alt="Successful authorization screen for vehicle entry" loading="lazy" /></div><p>Two verification steps separate vehicle access from manual control.</p></div>
            <div className="hud-detail"><span className="eyebrow">[ HEAD-UP DISPLAY ]</span><img src={encodeURI("/media/halogrip图片/other/hud.webp")} alt="Head-up display presenting manual control status and emergency driving guidance" loading="lazy" /><p>Only the information needed to maintain situational awareness during intervention.</p></div>
          </div>
        </div>
      </SectionReveal>

      <footer className="site-footer shell">
        <div><span className="eyebrow">[ MASTER’S THESIS / 2025 ]</span><h2>DESIGNED FOR THE PEOPLE<br />WHO CANNOT AFFORD TO WAIT.</h2></div>
        <div className="footer-bottom"><span>SYLVIA XIE — USER RESEARCH &amp; CONCEPT / AUTOLIV × CHALMERS</span><a href="/">BACK TO HOME ↑</a></div>
      </footer>
    </main>
  );
}
