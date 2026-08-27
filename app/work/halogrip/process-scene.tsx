"use client";

/**
 * 02.3 CURRENT RESPONSE — a calm cinematic establishing scene, not another interactive
 * diagram. The single scene image (`2.3-scene-clean.png`) already contains the first
 * responder, the glass process panels, the red response path and the robotaxi — none of
 * that is rebuilt in HTML/CSS/SVG here. This component only adds the real section label,
 * headline, paragraph and a restrained reveal so the image reads as a full-viewport
 * photographic establishing shot, not a UI screen.
 *
 * No invented times, distances, coordinates or company names — matches every other
 * section's evidence-safe copy.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markPinReady, onPinsReady } from "./pin-coordinator";

const SCENE = encodeURI("/media/halogrip图片/2.3/2.3-scene-clean.png");

function canEnhance() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ProcessScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  // This section has no pin/spacer of its own, so — unlike scroll-intro.tsx and
  // design-gap-scene.tsx — nothing here needs to wait for anything above it to size
  // itself correctly. Reported immediately so design-gap-scene.tsx's own
  // onPinsReady(["scroll-intro","process-scene"]) isn't left waiting on the 4s timeout.
  useEffect(() => {
    markPinReady("process-scene");
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !canEnhance()) return;

    gsap.registerPlugin(ScrollTrigger);

    let context: gsap.Context | undefined;
    const unsubscribe = onPinsReady(["scroll-intro"], () => {
      context = gsap.context(() => {
        gsap.set(imageRef.current, { opacity: 0, scale: 1.025 });
        gsap.set([labelRef.current, headlineRef.current, paragraphRef.current], { opacity: 0, y: 16 });

        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
          })
          .to(imageRef.current, { opacity: 1, scale: 1, duration: 1.4 })
          .to(
            [labelRef.current, headlineRef.current, paragraphRef.current],
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
            "-=0.95",
          );

        // Barely-there horizontal drift, scrubbed to scroll — skipped below 760px so it
        // can't nudge the image past its object-fit:contain edges there.
        if (window.innerWidth >= 760) {
          gsap.fromTo(
            imageRef.current,
            { x: -6 },
            {
              x: 6,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        }
      }, section);
    });

    return () => {
      unsubscribe();
      context?.revert();
    };
  }, []);

  return (
    <section className="response-scene" ref={sectionRef} aria-labelledby="response-title">
      <div className="response-scene-copy">
        <span className="eyebrow response-scene-label" ref={labelRef}>
          [ 02.3 / CURRENT RESPONSE ]
        </span>
        <h2 id="response-title" className="response-scene-headline" ref={headlineRef}>
          HELP EXISTS.
          <br />
          BUT IT IS NOT IMMEDIATE.
        </h2>
        <p className="response-scene-paragraph" ref={paragraphRef}>
          Moving a stalled robotaxi may require a chain of calls, verification, authorization or
          on-site dispatch. Each dependency can delay an on-site responder who needs to clear the
          scene.
        </p>
      </div>

      <div className="response-scene-frame">
        <img
          className="response-scene-image"
          ref={imageRef}
          src={SCENE}
          alt="A first responder views a chain of translucent process panels — incident, call operator, verify, remote authorization, on-site dispatch — connected by a glowing red path to a stalled robotaxi on a wet city street at night."
          loading="lazy"
        />
        <div className="response-scene-gradient" aria-hidden="true" />
      </div>
    </section>
  );
}
