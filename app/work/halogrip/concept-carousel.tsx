"use client";

/**
 * 05 / CONCEPT EXPLORATION — a scattered "sketch deck": five overlapping paper sheets, one
 * large and sharp in the centre, the rest smaller/faded/rotated behind it. Switching which
 * sketch is centred happens ONLY via the left/right arrow buttons (or Left/Right arrow keys
 * while the deck has focus) — nothing here reads scroll position, wheel deltas, or drag.
 *
 * This is the third structural rebuild of this section (see CLAUDE.md's changelog): first a
 * scroll-scrubbed filmstrip, then a wheel/drag hero carousel, then a plain click-controlled
 * gallery (one image + 01-04/SELECTED pagination). This round replaces the gallery's single-
 * image-at-a-time layout with the overlapping-sheets treatment Sylvia mocked up directly
 * (`public/media/halogrip图片/other/skets reference.png`) and drops the pagination
 * boxes/SELECTED button entirely in favour of just the two arrows.
 *
 * Assets: back to the "Ideation - Concepts Exploration" sketches from ppt slides 11-15
 * (`public/media/halogrip图片/05/concept-*`) — Screen+External Device, Detachable/Modular
 * Steering Device, Touch Screen, HUD+Joystick, converging on the Pull-out Wheel as the
 * selected direction. An earlier round of this same rebuild switched to the *iteration*
 * sketches from slides 18-22 instead, extracted directly out of the pptx zip; Sylvia flagged
 * those as illegible ("草图都不对，全部都看不清晰为什么") even after repeated size increases —
 * the real problem wasn't card size, it was the source images themselves: white-on-black raw
 * scans with dense overlapping strokes and huge dead black margins around a small drawing, so
 * no amount of CSS scaling ever made them read better. The slides 11-15 set was already
 * sitting in the repo as clean, well-composed, black-on-white line art (this project's very
 * first "Concepts Exploration" round used it before later rounds drifted away from it) —
 * switching back to it is a strict legibility fix, not a new content direction.
 *
 * Slot layout: each non-active concept is assigned one of four fixed background positions
 * (upper-left / lower-left / upper-right / lower-right) by its position in CONCEPTS relative
 * to whichever is active, recomputed on every index change — so the four background sheets
 * visibly reshuffle into their new slots (or the centre) rather than jumping. GSAP drives the
 * per-card `xPercent`/`yPercent`/`rotation`/`scale`/`opacity` tween (percent-based so it's
 * self-relative to each card's own box, independent of the stage's actual measured size — no
 * ResizeObserver needed here, unlike earlier rounds of this component).
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Concept = {
  id: string;
  label: string;
  conceptNumber: string;
  image: string;
  alt: string;
  selected?: boolean;
};

const CONCEPTS: Concept[] = [
  {
    id: "screen-pedal",
    label: "Screen + External Device",
    conceptNumber: "CONCEPT 01",
    image: encodeURI("/media/halogrip图片/05/concept-1-screen-pedal.jpg"),
    alt: "Concept sketch 1: a start button integrated into the dashboard with on-screen speed control and a floor pedal for movement",
  },
  {
    id: "modular-device",
    label: "Detachable Steering Device",
    conceptNumber: "CONCEPT 03",
    image: encodeURI("/media/halogrip图片/05/concept-3-modular-device.png"),
    alt: "Concept sketch 3: a detachable steering device that inserts into a dashboard-mounted dock, authorized by NFC before use",
  },
  {
    id: "touchscreen",
    label: "Touch Screen",
    conceptNumber: "CONCEPT 04A",
    image: encodeURI("/media/halogrip图片/05/concept-4a-touchscreen.png"),
    alt: "Concept sketch 4a: a fold-out touchscreen mounted on the steering column offering automatic or manual activate-and-freeze control",
  },
  {
    id: "hud-joystick",
    label: "HUD + Joystick",
    conceptNumber: "CONCEPT 04B",
    image: encodeURI("/media/halogrip图片/05/concept-4b-hud-joystick.jpg"),
    alt: "Concept sketch 4b: a head-up display prompting a left-or-right choice, controlled by a dashboard-mounted joystick with a stop button",
  },
  {
    id: "pullout-wheel",
    label: "Pull-Out Wheel",
    conceptNumber: "CONCEPT 02",
    image: encodeURI("/media/halogrip图片/05/concept-2-pullout-wheel.jpg"),
    alt: "Concept sketch 2: a steering wheel that pulls out from the dashboard, revealing integrated function controls — the selected direction",
    selected: true,
  },
];

const LAST = CONCEPTS.length - 1;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type SlotName = "center" | "ul" | "ll" | "ur" | "lr";
const SLOT_ORDER: SlotName[] = ["ul", "ll", "ur", "lr"];
const SLOT_STYLE: Record<SlotName, { xPercent: number; yPercent: number; rotation: number; scale: number; opacity: number; z: number }> = {
  center: { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, z: 10 },
  ul: { xPercent: -112, yPercent: -52, rotation: -7, scale: 0.6, opacity: 0.55, z: 3 },
  ll: { xPercent: -104, yPercent: 58, rotation: -5, scale: 0.56, opacity: 0.48, z: 2 },
  ur: { xPercent: 98, yPercent: -56, rotation: 6, scale: 0.6, opacity: 0.55, z: 3 },
  lr: { xPercent: 92, yPercent: 60, rotation: 5, scale: 0.56, opacity: 0.48, z: 2 },
};

function slotFor(index: number, active: number): SlotName {
  if (index === active) return "center";
  const others = CONCEPTS.map((_, i) => i).filter((i) => i !== active);
  return SLOT_ORDER[others.indexOf(index)];
}

export default function ConceptCarousel() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // GSAP must own each card's transform from the very first frame — mixing its xPercent/
  // yPercent properties with a raw CSS `transform` string set some other way (e.g. React
  // inline style on first paint) confuses its internal decomposition of the existing matrix
  // and produces a wrong starting offset (confirmed directly: the "centre" slot rendered
  // ~290px off-centre until this was switched to `gsap.set()`). This runs once, synchronously
  // ahead of the index-driven effect below in the same commit, so it always establishes GSAP's
  // baseline before any `gsap.to()` call touches these elements.
  useEffect(() => {
    CONCEPTS.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const base = SLOT_STYLE[slotFor(i, 0)];
      gsap.set(card, { xPercent: base.xPercent, yPercent: base.yPercent, rotation: base.rotation, scale: base.scale, opacity: base.opacity, zIndex: base.z });
    });
  }, []);

  useEffect(() => {
    const onFinal = index === LAST;
    CONCEPTS.forEach((concept, i) => {
      const card = cardRefs.current[i];
      if (!card) return;
      const slot = slotFor(i, index);
      const base = SLOT_STYLE[slot];
      // On the final reveal, every sketch but the selected one fades out completely rather
      // than settling into its usual background slot.
      const opacity = onFinal && slot !== "center" ? 0 : base.opacity;
      gsap.to(card, {
        xPercent: base.xPercent,
        yPercent: base.yPercent,
        rotation: base.rotation,
        scale: base.scale,
        opacity,
        zIndex: base.z,
        duration: reduced ? 0 : 0.6,
        ease: "power2.out",
      });
    });
  }, [index, reduced]);

  function go(next: number) {
    setIndex(clamp(next, 0, LAST));
  }

  const active = CONCEPTS[index];

  return (
    <div
      className="concept-deck"
      tabIndex={0}
      role="group"
      aria-label="Concept iteration sketches"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
        }
      }}
    >
      <button type="button" className="concept-deck-arrow concept-deck-arrow-left" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous sketch">
        &larr;
      </button>

      <div className="concept-deck-stage">
        {CONCEPTS.map((concept, i) => (
          <div
            key={concept.id}
            className="concept-deck-card"
            aria-hidden={i !== index}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <span className="concept-deck-card-label">
              <em>{concept.conceptNumber}</em>
              {concept.label}
            </span>
            <img src={concept.image} alt={concept.alt} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      <button type="button" className="concept-deck-arrow concept-deck-arrow-right" onClick={() => go(index + 1)} disabled={index === LAST} aria-label="Next sketch">
        &rarr;
      </button>

      <div className="concept-deck-copy">
        {active.selected ? (
          <>
            <span className="concept-deck-eyebrow concept-deck-eyebrow-selected">
              SELECTED DIRECTION — {active.conceptNumber}
            </span>
            <h3>PULL-OUT WHEEL</h3>
          </>
        ) : null}
        <span className="concept-deck-counter">
          {String(index + 1).padStart(2, "0")} / {String(CONCEPTS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
