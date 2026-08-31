"use client";

import { useState } from "react";

/**
 * `product-side.webp` is not shot upright — measured directly (pixel centroid of the wand's
 * long axis, sampled via `sharp`, rows clear of the base cylinder), the photo itself already
 * leans ~22deg clockwise. `rotate(0deg)` on it was therefore never upright — NEUTRAL_ANGLE
 * counter-rotates that measured baseline so the resting pose is genuinely upright.
 *
 * There is no standalone NEUTRAL card — Sylvia flagged it as confusing once BRAKE and NEUTRAL
 * rendered as the exact same upright pose (a 4th button whose click produced no visible change).
 * BRAKE's own copy already carries the "returns to neutral" idea, so it does that job: FORWARD
 * tilts forward off the upright rest position; BRAKE releases back to it (deceleration, not a
 * new pose — this is what used to be labelled NEUTRAL_ANGLE with no offset); REVERSE continues
 * past that same rest position in the opposite direction from FORWARD.
 *
 * FORWARD/REVERSE's *direction* (which way is clockwise vs counter-clockwise) previously wasn't
 * derived from anything — it was set by eyeballing this cropped, no-context studio photo, which
 * has no windshield/dashboard in frame to tell you which rotation is physically "forward." That
 * guess was wrong (confirmed live: forward read as tilting backward), and every earlier fix here
 * was the same kind of guess, so it kept landing wrong. This is now pinned to the one place in
 * this project that actually has an authoritative answer: `scroll-intro.tsx`'s
 * `TILT_FORWARD`/`TILT_BRAKE`/`TILT_REVERSE`, read directly from the real PowerPoint deck's own
 * frame-rotation values (not guessed — extracted from the `.pptx` XML) for this exact gesture.
 * Forward is clockwise off rest, reverse is counter-clockwise (-22.79deg) off rest, brake is
 * rest itself (0deg offset) — applied on top of NEUTRAL_ANGLE below.
 *
 * FORWARD's *magnitude* does deliberately depart from the PPT's own 15.12deg, though: Sylvia
 * flagged live that at that value forward read as too subtle — closer to what she pictured for
 * brake than for a clear forward push. First bumped to match REVERSE's own magnitude (22.79deg),
 * then bumped again per a further round of live feedback ("forward's angle, add a bit more") —
 * forward is now visibly the most tilted of the three, past REVERSE's magnitude.
 *
 * BRAKE, in the same round of feedback, was asked to move too ("brake also add a bit") — it had
 * been sitting exactly on the upright rest pose (0deg offset), which read as too flat/static next
 * to the two tilted states. Given a small offset in FORWARD's own direction: BRAKE is deceleration
 * *out of* a forward tilt, not a new gesture, so a partial lean back toward (but well short of)
 * FORWARD reads as "still easing off" rather than "already stopped."
 */
const NEUTRAL_ANGLE = -22;
const TILT_FORWARD = 30;
const TILT_BRAKE = 10;
const TILT_REVERSE = -22.79;
const states = [
  { title: "FORWARD", action: "PUSH / ACCELERATE", angle: NEUTRAL_ANGLE + TILT_FORWARD, description: "Tilt forward to move the vehicle ahead." },
  { title: "BRAKE", action: "RELEASE / DECELERATE", angle: NEUTRAL_ANGLE + TILT_BRAKE, description: "Release the forward tilt to return to neutral and slow down." },
  { title: "REVERSE", action: "PULL BACK", angle: NEUTRAL_ANGLE + TILT_REVERSE, description: "Tilt back past neutral to reverse at low speed." },
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
