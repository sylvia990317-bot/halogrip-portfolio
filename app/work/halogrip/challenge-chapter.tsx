import PlaceholderImage from "../../components/PlaceholderImage";
import RealWorldScene from "./real-world-scene";
import ResponseScene from "./response-scene";
import DesignGapScene from "./design-gap-scene";

export default function ChallengeChapter() {
  return (
    <>
      <section className="challenge-intro dark-section shell" id="challenge" aria-labelledby="challenge-title">
        <span className="eyebrow">[ 02 / THE CHALLENGE ]</span>
        <div className="challenge-intro-copy">
          <h2 id="challenge-title">
            THE CABIN IS CHANGING.
            <br />
            THE RISK ISN&rsquo;T.
          </h2>
          <p>
            Autonomous vehicles are removing the controls first responders once relied on — the
            need to move a stalled vehicle hasn&rsquo;t gone away.
          </p>
        </div>
      </section>

      <section className="challenge-scene challenge-scene-shift dark-section">
        <div className="shell">
          <span className="eyebrow">[ 02.1 / INDUSTRY SHIFT ]</span>
          <div className="scene-shift-layout">
            <div className="scene-copy">
              <h2>
                THE DRIVER IS DISAPPEARING
                <br />
                FROM THE CABIN.
              </h2>
              <p>
                Purpose-built robotaxis are beginning to remove conventional driving controls to
                create more space for passengers. Emergency procedures and regulations, however,
                are still adapting to the shift.
              </p>
            </div>
            <div className="cabin-compare">
              <figure>
                {/* TODO(sylvia): replace with a real conventional-cockpit photo */}
                <PlaceholderImage label="Conventional cockpit" className="cabin-compare-image" />
                <figcaption>
                  <span className="signal minus">−</span>Traditional controls removed
                </figcaption>
              </figure>
              <figure>
                {/* TODO(sylvia): replace with a real open-cabin photo */}
                <PlaceholderImage label="Open cabin" className="cabin-compare-image" />
                <figcaption>
                  <span className="signal plus">+</span>More flexible passenger space
                </figcaption>
              </figure>
            </div>
          </div>
          <p className="scene-bridge">
            THE DRIVER MAY DISAPPEAR. <span>THE NEED TO INTERVENE DOES NOT.</span>
          </p>
        </div>
      </section>

      <section className="challenge-scene challenge-scene-consequence dark-section" aria-labelledby="real-world-need-title">
        <RealWorldScene />
      </section>

      <section className="challenge-scene-response dark-section" aria-labelledby="current-response-title">
        <ResponseScene />
      </section>

      <section className="challenge-scene-gap dark-section" aria-labelledby="design-gap-title">
        <DesignGapScene />
      </section>
    </>
  );
}
