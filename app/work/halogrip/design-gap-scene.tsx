"use client";

/**
 * 02.4 / DESIGN GAP — pinned, scroll-driven consolidation from a hazy, receding wall of
 * external-dependency fragments into one unmistakable idea: limited fallback control could
 * already live inside the robotaxi's own cabin.
 *
 * Section 2.3 (./process-scene.tsx) already told the step-by-step external story in detail.
 * This section does not repeat it — the four left panels (INCIDENT / REMOTE SUPPORT /
 * ON-SITE DISPATCH / MOVE OR TOW) are a visual memory of that chain, not content meant to be
 * read: staggered scale/rotation/z-depth (GSAP `transformPerspective` + per-tier `rotateY`/
 * `scale`/`z`, static, set once) plus a static per-tier opacity/blur (CSS `[data-tier]`) make
 * the group read as depth and atmosphere, softening and dimming toward the back, deliberately
 * clipped by the left viewport edge.
 *
 * Scroll choreography (unchanged in kind from the previous pass, only the two window
 * boundaries moved): a single `ScrollTrigger` pins the section and drives one `applyFrame(t)`
 * per scroll tick via `onUpdate`/`onRefresh` — no React state on the scroll path, only direct
 * ref writes (`style.opacity`/`filter`/`maskImage`/`transform`, SVG attributes, a canvas
 * redraw). `dissolveT` (t: 0.18→0.65) drives a boundary that sweeps from the old centre seam
 * to past the left edge — panels erase in place via a `mask-image` wipe (never translate/
 * scale) fronted by a narrow canvas particle band (capped count, capped devicePixelRatio,
 * never one DOM node per particle). `redistT` (t: 0.28→0.82) grows/repositions the robotaxi
 * into the released space and gives the first responder its own modest settle-in read, while
 * a single thin line stretches between them. The headline, subhead and background are never
 * touched by any of this — they hold their default styles for the whole scroll range.
 *
 * The robotaxi's in-cabin "ON-BOARD FALLBACK CONTROL" marker (dot/callout/label) is a DOM
 * descendant of the same wrapper `applyFrame` transforms for the vehicle, so it structurally
 * cannot be read as a separate, external node — it moves and scales with the car as one rigid
 * unit. Its ground shadow is a separately-shaped `radial-gradient` ellipse, not a `box-shadow`
 * on the PNG's rectangular border-box, which is what a "cutout halo" would come from.
 *
 * Pin architecture mirrors ./scroll-intro.tsx and reports through ./pin-coordinator: this
 * file's real ScrollTrigger is created inside `onPinsReady(["scroll-intro","process-scene"],
 * cb)`, and `cb` calls `markPinReady("design-gap-scene")` once it exists (see that module's own
 * comment for why — process-scene.tsx and overview-backdrop.tsx depend on this transitively).
 * Reduced motion / narrow viewports skip the pin+scrub entirely and render a simplified static
 * composition instead (DesignGapFallback). Company names and invented timestamps stay out, same
 * reason process-scene.tsx keeps them out: not real/verified.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markPinReady, onPinsReady } from "./pin-coordinator";

const BG = encodeURI("/media/halogrip图片/2.4/assets/design-gap-background.png");
const RESPONDER = encodeURI("/media/halogrip图片/2.4/assets/first-responder.png");
const ROBOTAXI = encodeURI("/media/halogrip图片/2.4/assets/robotaxi.png");

type Panel = {
  id: string;
  title: string;
  tier: 0 | 1 | 2 | 3;
  x: number;
  y: number;
  w: number;
  h: number;
  icon: () => ReactNode;
};

/** Icon set ported 1:1 from process-scene.tsx's `icons` map for visual continuity with 02.3. */
function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4 L21 19 L3 19 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 10.5V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="15" r="1.15" fill="currentColor" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.4A7 7 0 0 0 5 9.6C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="9.6" r="2.1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16.5 6 11h9l3 3.2v2.3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M4 16.5h1.5M18 16.5H20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="16.7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16.5" cy="16.7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 5.5 17 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 5.5 20 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** tier 0 = nearest/sharpest, tier 3 = farthest/most receded — static, set once via GSAP. */
const PANEL_TIERS = [
  { scale: 1, rotateY: -4, z: 0 },
  { scale: 0.9, rotateY: -6, z: -40 },
  { scale: 0.8, rotateY: -8, z: -90 },
  { scale: 0.7, rotateY: -10, z: -150 },
] as const;

/** A visual memory of process-scene.tsx's chain, not content to read — four panels only,
 *  no numbering, no sub-copy. Nearest/sharpest (MOVE OR TOW) sits closest to the boundary;
 *  farthest/haziest (INCIDENT) is already clipped by the left viewport edge. */
const PANELS: Panel[] = [
  { id: "incident", title: "INCIDENT", tier: 3, x: -3, y: 40, w: 10, h: 30, icon: IconWarn },
  { id: "remote", title: "REMOTE SUPPORT", tier: 2, x: 6, y: 26, w: 11, h: 19, icon: IconLock },
  { id: "dispatch", title: "ON-SITE DISPATCH", tier: 1, x: 15, y: 54, w: 10.5, h: 18, icon: IconPin },
  { id: "move", title: "MOVE OR TOW", tier: 0, x: 27, y: 42, w: 11, h: 32, icon: IconCar },
];

/** Centre point of each panel above, used for the thin signal line's dots. */
const PANEL_POINTS: [number, number][] = [
  [2, 55],
  [11.5, 35.5],
  [20.25, 63],
  [32.5, 58],
];

/** The dissolve boundary starts here (the old centre seam) and sweeps left past x=0. */
const SEAM_X = 50.9;
const BOUNDARY_END_X = -8;
/** Vertical anchor for the boundary glow — roughly the panel group's own row. */
const BOUNDARY_ROW_Y = 55;

/** Fixed pool for the canvas disintegration band — seeded, not Math.random, so server
 *  and client agree (this is a client component, but keeping it deterministic is free). */
const BAND_PARTICLE_COUNT = 90;
function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
const BAND_PARTICLES = Array.from({ length: BAND_PARTICLE_COUNT }, (_, i) => ({
  yFrac: 0.06 + hash(i) * 0.88,
  jitter: (hash(i + 300) - 0.5) * 3.4,
  phase: hash(i + 500) * Math.PI * 2,
  size: 0.9 + hash(i + 700) * 1.9,
  warm: hash(i + 900) > 0.55,
  alpha: 0.35 + hash(i + 1100) * 0.5,
}));

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 outside [inLo,outHi], ramps to 1 by inHi, holds, ramps back down from outLo. Use only
 *  for genuinely transient beats — anything that must still be visible at the final hold
 *  needs a plain ramp-and-hold instead (see `cabinReveal`/`trailReveal` below). */
function trapezoid(t: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  if (t <= inLo || t >= outHi) return 0;
  if (t < inHi) return (t - inLo) / (inHi - inLo);
  if (t < outLo) return 1;
  return 1 - (t - outLo) / (outHi - outLo);
}

/** Ramps 0->1 over [from,from+span] and holds at 1 — for anything that must persist into
 *  the final composition once revealed. */
function rampHold(t: number, from: number, span: number) {
  return clamp01((t - from) / span);
}

function canEnhance() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 760) return false;
  return true;
}

function DesignGapFallback() {
  return (
    <section className="design-gap-scene dg-fallback dark-section" id="design-gap" aria-labelledby="design-gap-title">
      <div className="dg-bg" style={{ backgroundImage: `url(${BG})` }} />
      <div className="dg-scrim" />
      <span className="eyebrow dg-eyebrow">[ 02.4 / DESIGN GAP ]</span>

      <div className="dg-fb-copy">
        <h2 id="design-gap-title">WHAT IF LIMITED CONTROL WAS ALREADY ON BOARD?</h2>
        <p className="dg-subhead">FROM EXTERNAL DEPENDENCY TO DIRECT, ON-BOARD CONTROL.</p>
      </div>

      <div className="dg-fb-chain">
        <div className="dg-fb-chain-group">
          <span className="dg-fb-chain-label">EXTERNAL DEPENDENCY</span>
          <ol className="dg-fb-steps">
            {PANELS.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ol>
        </div>
        <span className="dg-fb-arrow" aria-hidden="true">
          &rarr;
        </span>
        <div className="dg-fb-chain-group">
          <span className="dg-fb-chain-label">ON-BOARD CONTROL</span>
          <ol className="dg-fb-steps dg-fb-steps-local">
            <li>FIRST RESPONDER</li>
            <li>ON-BOARD FALLBACK CONTROL</li>
          </ol>
        </div>
      </div>

      <img className="dg-fb-robotaxi" src={ROBOTAXI} alt="Robotaxi with its on-board fallback control" loading="lazy" />
    </section>
  );
}

export default function DesignGapScene() {
  const [enhanced, setEnhanced] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signalRef = useRef<SVGGElement>(null);
  const responderRef = useRef<HTMLImageElement>(null);
  const externalLabelRef = useRef<HTMLSpanElement>(null);
  const panelOuterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boundaryGlowRef = useRef<HTMLDivElement>(null);
  const respLineRef = useRef<SVGLineElement>(null);
  const robotaxiRef = useRef<HTMLDivElement>(null);
  const cabinGlowRef = useRef<SVGCircleElement>(null);
  const cabinMarkRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);

  useEffect(() => {
    const result = canEnhance();
    setEnhanced(result);
    if (!result) markPinReady("design-gap-scene");
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!enhanced || !section || !canvas) return;

    gsap.registerPlugin(ScrollTrigger);
    const ease = gsap.parseEase("power1.inOut");
    const ctx2d = canvas.getContext("2d");

    function sizeCanvas() {
      if (!canvas || !section) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = section.clientWidth;
      const h = section.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (ctx2d) ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawBand(boundaryX: number, envelope: number) {
      if (!ctx2d || !canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx2d.clearRect(0, 0, w, h);
      if (envelope <= 0.001) return;
      const cx = (boundaryX / 100) * w;
      const bandTop = h * 0.24;
      const bandHeight = h * 0.52;
      const wobbleClock = progressRef.current * 40;
      BAND_PARTICLES.forEach((p) => {
        const wob = Math.sin(wobbleClock + p.phase) * (w * 0.006);
        const x = cx + (p.jitter / 100) * w + wob;
        if (x < -10 || x > w + 10) return;
        const y = bandTop + p.yFrac * bandHeight;
        const alpha = envelope * p.alpha;
        ctx2d.fillStyle = p.warm ? `rgba(255,255,255,${alpha})` : `rgba(224,69,58,${alpha})`;
        ctx2d.beginPath();
        ctx2d.arc(x, y, p.size, 0, Math.PI * 2);
        ctx2d.fill();
      });
    }

    function setLine(el: SVGLineElement | null, x1: number, y1: number, x2: number, y2: number) {
      if (!el) return;
      el.setAttribute("x1", String(x1));
      el.setAttribute("y1", String(y1));
      el.setAttribute("x2", String(x2));
      el.setAttribute("y2", String(y2));
    }

    function setPanelVisibility(el: HTMLDivElement | null, visible: number) {
      if (!el) return;
      const stop = clamp01(visible) * 100;
      const feather = 7;
      const mask = `linear-gradient(to right, black 0%, black ${stop}%, transparent ${Math.min(100, stop + feather)}%)`;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
      el.style.opacity = String(0.12 + 0.88 * visible);
      el.style.filter = visible < 1 ? `blur(${(1 - visible) * 7}px)` : "none";
    }

    function applyFrame(t: number) {
      progressRef.current = t;

      const dissolveT = ease(clamp01((t - 0.18) / 0.47));
      const redistT = ease(clamp01((t - 0.28) / 0.54));

      const boundaryX = lerp(SEAM_X, BOUNDARY_END_X, dissolveT);

      PANELS.forEach((panel, i) => {
        const left = panel.x;
        const right = panel.x + panel.w;
        const visible = clamp01((boundaryX - left) / (right - left));
        setPanelVisibility(panelRefs.current[i], visible);
      });

      const leftGroupOpacity = 1 - dissolveT;
      if (signalRef.current) signalRef.current.style.opacity = String(leftGroupOpacity);
      if (externalLabelRef.current) externalLabelRef.current.style.opacity = String(clamp01(1 - dissolveT * 1.6));

      // The first responder is one of the two final-state elements, not left-group debris:
      // it dips through the crossfade but recovers to full presence by the time the right
      // side has finished redistributing, with a small settle nudge of its own.
      const responderOpacity = clamp01(1 - dissolveT * 0.5 + redistT * 0.5);
      const responderBlur = Math.max(0, dissolveT - redistT) * 4;
      if (responderRef.current) {
        responderRef.current.style.opacity = String(responderOpacity);
        responderRef.current.style.filter = responderBlur > 0.1 ? `blur(${responderBlur}px)` : "none";
        responderRef.current.style.transform = `translateX(${lerp(-2.5, 0, redistT)}%) scale(${lerp(0.94, 1.03, redistT)})`;
      }

      const bandEnvelope = trapezoid(t, 0.17, 0.2, 0.63, 0.68);
      drawBand(boundaryX, bandEnvelope);
      if (boundaryGlowRef.current) {
        boundaryGlowRef.current.style.left = `${boundaryX}%`;
        boundaryGlowRef.current.style.opacity = String(bandEnvelope * 0.85);
      }

      // The robotaxi stays a separate element with its own scale/settle nudge — never
      // coupled to the responder's tween. Grows out of its grounded corner as it "expands
      // into the released space," per the brief.
      if (robotaxiRef.current) {
        const shift = lerp(6, 0, redistT);
        const scale = lerp(0.62, 1, redistT);
        robotaxiRef.current.style.transform = `translateX(${shift}%) scale(${scale})`;
      }

      // One thin, restrained line from the responder toward the vehicle — endpoints move
      // with `redistT`, approximate rather than pixel-locked to the transformed robotaxi
      // wrap (reading its live transformed rect every frame would reintroduce the layout-
      // thrash risk this whole architecture avoids elsewhere).
      setLine(respLineRef.current, 16, 60, lerp(40, 60, redistT), lerp(62, 42, redistT));

      // Cabin control: a dot/callout/label that ramp in once and STAY for the final hold
      // (not a transient pulse), plus a short-lived brighter flash layered on top so the
      // "illumination" reads as an event, not just a static presence.
      const cabinReveal = rampHold(t, 0.72, 0.1);
      const cabinFlash = trapezoid(t, 0.76, 0.83, 0.83, 0.93);
      if (cabinMarkRef.current) cabinMarkRef.current.style.opacity = String(cabinReveal);
      if (cabinGlowRef.current) {
        cabinGlowRef.current.setAttribute("opacity", String(clamp01(cabinReveal * 0.3 + cabinFlash * 0.6)));
      }

      // Movement trail: reveals just after the cabin control illuminates and stays into
      // the final hold — a short directional hint, not an arrowhead.
      if (trailRef.current) trailRef.current.style.opacity = String(rampHold(t, 0.86, 0.08) * 0.6);
    }

    const resizeObserver = new ResizeObserver(() => {
      sizeCanvas();
      applyFrame(progressRef.current);
    });
    resizeObserver.observe(section);
    sizeCanvas();

    let context: gsap.Context | undefined;
    const unsubscribe = onPinsReady(["scroll-intro", "process-scene"], () => {
      context = gsap.context(() => {
        gsap.set(panelOuterRefs.current, { transformPerspective: 900 });
        PANELS.forEach((panel, i) => {
          const tier = PANEL_TIERS[panel.tier];
          gsap.set(panelOuterRefs.current[i], { rotateY: tier.rotateY, scale: tier.scale, z: tier.z, transformOrigin: "50% 50%" });
        });

        applyFrame(0);

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyFrame(self.progress),
          onRefresh: (self) => applyFrame(self.progress),
        });

        markPinReady("design-gap-scene");
      }, section);
    });

    return () => {
      resizeObserver.disconnect();
      unsubscribe();
      context?.revert();
    };
  }, [enhanced]);

  if (enhanced === null) return null;
  if (!enhanced) return <DesignGapFallback />;

  return (
    <section className="design-gap-scene dark-section" id="design-gap" ref={sectionRef} aria-labelledby="design-gap-title">
      <div className="dg-bg" style={{ backgroundImage: `url(${BG})` }} />
      <div className="dg-scrim" />

      <span className="eyebrow dg-eyebrow">[ 02.4 / DESIGN GAP ]</span>
      <span className="dg-side-label dg-side-label-left" ref={externalLabelRef}>
        EXTERNAL DEPENDENCY
      </span>
      <span className="dg-side-label dg-side-label-right">ON-BOARD CONTROL</span>

      <img className="dg-responder" src={RESPONDER} alt="First responder consulting a tablet before an in-vehicle handoff" ref={responderRef} loading="lazy" />

      <svg className="dg-graphic" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <g className="dg-signal" ref={signalRef}>
          <path className="dg-signal-line" d="M2,55 L11.5,35.5 L20.25,63 L32.5,58 L50.9,58" />
          {PANEL_POINTS.map(([x, y], i) => (
            <circle key={i} className="dg-signal-dot" cx={x} cy={y} r="0.5" />
          ))}
        </g>
        <line className="dg-resp-line" ref={respLineRef} />
      </svg>

      <canvas className="dg-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="dg-boundary-glow" ref={boundaryGlowRef} style={{ top: `${BOUNDARY_ROW_Y}%` }} aria-hidden="true" />

      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          className="dg-panel"
          data-tier={panel.tier}
          style={{ left: `${panel.x}%`, top: `${panel.y}%`, width: `${panel.w}%`, height: `${panel.h}%` }}
          ref={(el) => {
            panelOuterRefs.current[i] = el;
          }}
        >
          <div
            className="dg-panel-surface"
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
          >
            <span className="dg-panel-icon">
              <panel.icon />
            </span>
            <h3>{panel.title}</h3>
          </div>
        </div>
      ))}

      <div className="dg-robotaxi-wrap" ref={robotaxiRef}>
        <div className="dg-robotaxi-shadow" aria-hidden="true" />
        <img className="dg-robotaxi-img" src={ROBOTAXI} alt="Robotaxi with its on-board fallback control, illuminated in the rear cabin window" loading="lazy" />
        <div className="dg-motion-trail" ref={trailRef} aria-hidden="true" />
        <div className="dg-cabin-mark" ref={cabinMarkRef} aria-hidden="true">
          <svg className="dg-cabin-marker" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line className="dg-cabin-callout" x1="33" y1="31" x2="50" y2="8" />
            <circle className="dg-cabin-glow" ref={cabinGlowRef} cx="33" cy="31" r="4.5" />
            <circle className="dg-cabin-dot" cx="33" cy="31" r="1.5" />
          </svg>
          <span className="dg-cabin-label">ON-BOARD FALLBACK CONTROL</span>
        </div>
      </div>

      <div className="dg-headline">
        <h2 id="design-gap-title">WHAT IF LIMITED CONTROL WAS ALREADY ON BOARD?</h2>
        <p className="dg-subhead">From external dependency to direct, on-board control.</p>
      </div>
    </section>
  );
}
