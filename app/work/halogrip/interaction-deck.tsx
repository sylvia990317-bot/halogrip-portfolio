"use client";

import { useState } from "react";

/**
 * `product-side.webp` is not shot upright — measured directly (pixel centroid of the wand's
 * long axis, sampled via `sharp`, rows clear of the base cylinder), the photo itself already
 * leans ~22deg clockwise, i.e. it's effectively a pre-tilted "pulled back" pose, not a neutral
 * one. `rotate(0deg)` on it was therefore never upright — angles below are counter-rotated from
 * that measured baseline so NEUTRAL is genuinely upright.
 *
 * The four states are not four distinct tilts: per Sylvia's correction, FORWARD tilts forward
 * off neutral; BRAKE is the grip releasing back to that same neutral/upright position
 * (deceleration, not a new pose); REVERSE continues past neutral in the opposite direction from
 * FORWARD. So BRAKE intentionally shares NEUTRAL's angle — this also matches the real PPT
 * reference in scroll-intro.tsx (`TILT_FORWARD`/`TILT_BRAKE`/`TILT_REVERSE`), where brake's tilt
 * is 0, identical to the resting pose.
 */
const NEUTRAL_ANGLE = -22;
const states = [
  { title: "FORWARD", action: "PUSH / ACCELERATE", angle: -40, description: "Tilt forward to move the vehicle ahead." },
  { title: "NEUTRAL", action: "UPRIGHT / STILL", angle: NEUTRAL_ANGLE, description: "Release the grip to remain stationary." },
  { title: "BRAKE", action: "RELEASE / DECELERATE", angle: NEUTRAL_ANGLE, description: "Release the forward tilt to return to neutral and slow down." },
  { title: "REVERSE", action: "PULL BACK", angle: 0, description: "Tilt back past neutral to reverse at low speed." },
];

export default function InteractionDeck() {
  const [selected, setSelected] = useState(0);
  const active = states[selected];

  return (
    <div className="interaction-control">
      <div className="interaction-demo" aria-live="polite">
        <span className="interaction-indicator">LIVE INPUT / {active.title}</span>
        <img
          src={encodeURI("/media/halogrip图片/other/product-side.webp")}
          alt={active.description}
          style={{ transform: `rotate(${active.angle}deg)` }}
        />
        <span className="interaction-description">{active.description}</span>
      </div>
      <div className="interaction-buttons" aria-label="Explore steering control states">
        {states.map((state, index) => (
          <button
            className={index === selected ? "is-active" : ""}
            key={state.title}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={index === selected}
          >
            <span>0{index + 1}</span>
            <strong>{state.title}</strong>
            <small>{state.action}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
