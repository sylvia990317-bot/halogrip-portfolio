"use client";

/**
 * Scroll-driven 3D product intro for the HALOGRIP case study.
 *
 * Responsibilities kept here:
 *  - fallback detection (reduced motion / no WebGL / narrow viewport)
 *  - the GSAP + ScrollTrigger timeline (all scrub math, easing and reversal)
 *  - the HTML overlay (title -> wordmark, tracked callouts, tilt readout)
 *
 * Three.js lives entirely in `./scroll-intro-scene`, loaded with `ssr:false` from
 * here (a Client Component) because that is invalid from a Server Component.
 *
 * Perf contract: the only React state that changes during the sequence is the
 * discrete 0-3 tilt bucket. Everything continuous is written onto a plain mutable
 * object that a single `useFrame` reads — zero re-renders per scroll frame.
 */

import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScrollIntroScene = dynamic(() => import("./scroll-intro-scene"), { ssr: false });

export type SceneState = {
  riseY: number;
  yaw: number;
  tilt: number;
  secondaryOpacity: number;
  secondaryYaw: number;
  secondaryScale: number;
  arm0: number;
  arm1: number;
  arm2: number;
  arm3: number;
};

export type CalloutRefs = readonly RefObject<HTMLDivElement | null>[];

/** Y position the model is parked at before it rises into frame. */
const PARK_Y = -2.1;
/** How much the <h1> grows on its way to becoming the background wordmark. */
const WORDMARK_SCALE = 3.2;
/** Settled background at the very end of the pin — matches #overview's paper. */
const PAPER = "#eaeae6";

const meta = [
  ["Deliverable", "Fallback steering"],
  ["Partner", "Autoliv × Chalmers"],
  ["Role", "UX / product design"],
  ["Context", "Level 4 robotaxi"],
];

/**
 * `dx`/`dy` nudge each label clear of the anchor (and of each other) in screen pixels;
 * `side` flips the label to the other side of its dot so it never crosses the product.
 */
const callouts = [
  { label: "PHYSICAL BUTTONS", side: "right", dx: -30, dy: 74 },
  { label: "PARK CONTROL", side: "right", dx: 26, dy: -36 },
  { label: "REMOTE ASSISTANCE", side: "left", dx: -26, dy: 22 },
  { label: "AUTHORIZATION TAG", side: "right", dx: 14, dy: -84 },
] as const;

/** Mirrors the four states in `interaction-deck.tsx` — same angles, same copy. */
const tiltStates = [
  { title: "FORWARD", action: "PUSH / ACCELERATE", arrow: "↑", angle: -16 },
  { title: "NEUTRAL", action: "UPRIGHT / STILL", arrow: "—", angle: 0 },
  { title: "BRAKE", action: "PULL / DECELERATE", arrow: "↓", angle: 13 },
  { title: "REVERSE", action: "PULL FURTHER", arrow: "↓↓", angle: 24 },
] as const;

type TiltIndex = 0 | 1 | 2 | 3;

function bucketForTilt(angle: number): TiltIndex {
  if (angle <= -8) return 0;
  if (angle < 6.5) return 1;
  if (angle < 18.5) return 2;
  return 3;
}

function canEnhance() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 760) return false;
  try {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") || probe.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** The original static hero, verbatim. Also used as the loading state of the 3D path. */
function HeroFallback({ titleId }: { titleId?: string }) {
  return (
    <section className="hero shell" aria-labelledby={titleId}>
      <div className="hero-heading">
        <span className="eyebrow">[ CASE STUDY 001 ]</span>
        <h1 id={titleId}>HALOGRIP</h1>
        <span className="eyebrow hero-year">GOTHENBURG, SE / 2025</span>
      </div>
      <div className="metadata">
        {meta.map(([label, value]) => (
          <div className="meta-item" key={label}>
            <span className="eyebrow">[ {label} ]</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="hero-image">
        <img src="/media/hero.webp" alt="HALOGRIP emergency steering device in a blue-lit product render" fetchPriority="high" />
        <div className="hero-caption">
          <span>EMERGENCY CONTROL FOR AUTONOMOUS VEHICLES</span>
          <span>SYLVIA XIE + YUXIN LIN</span>
        </div>
      </div>
    </section>
  );
}

const TiltReadout = memo(function TiltReadout({ index }: { index: TiltIndex }) {
  const state = tiltStates[index];
  return (
    <div className="tilt-readout" key={state.title}>
      <span className="tilt-arrow">{state.arrow}</span>
      <span className="tilt-copy">
        <strong>{state.title}</strong>
        <small>{state.action}</small>
      </span>
    </div>
  );
});

export default function ScrollIntro() {
  const [enhanced, setEnhanced] = useState(false);
  const [ready, setReady] = useState(false);
  const [preloadGone, setPreloadGone] = useState(false);
  const [active, setActive] = useState(true);
  const [tiltIndex, setTiltIndex] = useState<TiltIndex>(1);

  const pinRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const canvasInnerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const calloutRef0 = useRef<HTMLDivElement>(null);
  const calloutRef1 = useRef<HTMLDivElement>(null);
  const calloutRef2 = useRef<HTMLDivElement>(null);
  const calloutRef3 = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<CalloutRefs>([calloutRef0, calloutRef1, calloutRef2, calloutRef3]).current;

  const stateRef = useRef<SceneState>({
    riseY: PARK_Y,
    yaw: 0,
    tilt: 0,
    secondaryOpacity: 0,
    secondaryYaw: -18,
    secondaryScale: 0.7,
    arm0: 0,
    arm1: 0,
    arm2: 0,
    arm3: 0,
  });

  const lastBucket = useRef<TiltIndex>(1);

  // Fallback detection runs once, post-mount, so server + first paint always agree.
  useEffect(() => {
    if (canEnhance()) setEnhanced(true);
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  // Cross-fade the static hero out once the model + junk-filter pass is done.
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setPreloadGone(true), 600);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!enhanced || !pin) return;

    gsap.registerPlugin(ScrollTrigger);

    const state = stateRef.current;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: (self) => {
          (window as unknown as Record<string, unknown>).__hgp = { p: self.progress(), state: { ...state } };
          const bucket = bucketForTilt(state.tilt);
          if (bucket !== lastBucket.current) {
            lastBucket.current = bucket;
            setTiltIndex(bucket);
          }
        },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=650%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => setActive(self.isActive),
        },
      });

      // Stage 0 (0.00-0.08): title hold — nothing animates.

      // Stage 1 (0.08-0.24): rise to a centred frontal view; title becomes the wordmark.
      timeline.to(state, { riseY: 0, duration: 0.16 }, 0.08);
      timeline.to(subtitleRef.current, { opacity: 0, duration: 0.06 }, 0.08);
      timeline.to(titleRef.current, { scale: WORDMARK_SCALE, opacity: 0.13, duration: 0.16 }, 0.08);
      // Drop the heading behind the canvas the moment it stops reading as a title.
      timeline.set(headingRef.current, { zIndex: 0 }, 0.15);

      // Stage 2 (0.24-0.36): frontal -> three-quarter. Camera never moves.
      timeline.to(state, { yaw: 32, duration: 0.12 }, 0.24);

      // Stage 3 (0.36-0.60): secondary instance, then four tracked callouts.
      timeline.to(state, { secondaryOpacity: 1, secondaryScale: 0.82, duration: 0.04 }, 0.36);
      timeline.to(state, { arm0: 1, duration: 0.025 }, 0.4);
      timeline.to(state, { arm1: 1, duration: 0.025 }, 0.455);
      timeline.to(state, { arm2: 1, duration: 0.025 }, 0.51);
      timeline.to(state, { arm3: 1, duration: 0.025 }, 0.565);

      // Stage 4 (0.60-0.72): drop the callouts and the clone, rotate to a clean side view.
      timeline.to(state, { arm0: 0, arm1: 0, arm2: 0, arm3: 0, duration: 0.035 }, 0.6);
      timeline.to(state, { secondaryOpacity: 0, secondaryScale: 0.7, duration: 0.08 }, 0.6);
      timeline.to(state, { yaw: 90, duration: 0.1 }, 0.62);

      // Stage 5 (0.72-0.96): the tilt demo, same angles as the interaction deck.
      timeline.to(tiltRef.current, { opacity: 1, duration: 0.02 }, 0.72);
      timeline.to(state, { tilt: -16, duration: 0.06 }, 0.74);
      timeline.to(state, { tilt: 0, duration: 0.06 }, 0.8);
      timeline.to(state, { tilt: 13, duration: 0.06 }, 0.86);
      timeline.to(state, { tilt: 24, duration: 0.04 }, 0.92);

      // Stage 6 (0.96-1.00): release into #overview.
      timeline.to(tiltRef.current, { opacity: 0, duration: 0.03 }, 0.96);
      timeline.to(canvasInnerRef.current, { opacity: 0, duration: 0.04 }, 0.96);
      timeline.to(titleRef.current, { opacity: 0, duration: 0.04 }, 0.96);
      timeline.to(pin, { backgroundColor: PAPER, duration: 0.04 }, 0.96);
    }, pin);

    return () => context.revert();
  }, [enhanced]);

  if (!enhanced) return <HeroFallback titleId="project-title" />;

  return (
    <div className="scroll-intro" ref={pinRef}>
      <div className="scroll-intro-heading" ref={headingRef}>
        <h1 id="project-title" ref={titleRef}>HALOGRIP</h1>
        <span className="scroll-intro-subtitle" ref={subtitleRef}>
          [ CASE STUDY 001 ] &nbsp;/&nbsp; GOTHENBURG, SE / 2025
        </span>
      </div>

      <div className={`scroll-intro-canvas${ready ? " is-visible" : ""}`}>
        <div className="scroll-intro-canvas-inner" ref={canvasInnerRef}>
          <ScrollIntroScene state={stateRef.current} calloutRefs={calloutRefs} onReady={handleReady} active={active} />
        </div>
      </div>

      {callouts.map((callout, index) => (
        <div
          className={`callout${callout.side === "left" ? " is-left" : ""}`}
          key={callout.label}
          ref={calloutRefs[index]}
          data-side={callout.side}
          style={{ opacity: 0, marginLeft: callout.dx, marginTop: callout.dy }}
          aria-hidden="true"
        >
          <span className="callout-dot" />
          <span>{callout.label}</span>
        </div>
      ))}

      <div className="tilt-label" ref={tiltRef} style={{ opacity: 0 }} aria-hidden="true">
        <span className="tilt-eyebrow">[ TILT INPUT ]</span>
        <TiltReadout index={tiltIndex} />
      </div>

      {!preloadGone && (
        <div className={`scroll-intro-preload${ready ? " is-hidden" : ""}`}>
          <HeroFallback />
        </div>
      )}
    </div>
  );
}
