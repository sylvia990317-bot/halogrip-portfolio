"use client";

/**
 * 02.4 / DESIGN GAP — pinned, scroll-driven transition from the external, multi-step
 * dependency chain (first responder -> call operator -> verify -> remote authorization /
 * on-site dispatch -> move or tow) to a single in-vehicle local-control line (first
 * responder -> local control -> move -> robotaxi).
 *
 * All coordinates below are plain 0-100 numbers used identically as SVG viewBox units
 * (viewBox="0 0 100 100", preserveAspectRatio="none") and as CSS left/top percentages —
 * one coordinate system for every layer (routes, particles, panels, nodes), so nothing
 * needs px math or a resize handler. Values are read off `2.4 reference.png`.
 *
 * Pin architecture mirrors ./scroll-intro.tsx: GSAP ScrollTrigger pins the section itself
 * (`pin: true`, `end: "+=250%"`), which combined with this section's own 100svh gives the
 * ~350vh scroll footprint the brief asks for. Reduced motion / narrow viewports skip the
 * pin+scrub entirely and render a simplified static composition instead (DesignGapFallback).
 *
 * The six panels recap the exact chain ./process-scene.tsx (02.3 CURRENT SOLUTION) just
 * built in detail one step earlier — same ids/titles/meta copy, same icon set — so this
 * section reads as compressing that specific diagram, not a freshly-invented one. Company
 * names and invented timestamps stay out for the same reason process-scene.tsx keeps them
 * out: not real/verified.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BG = encodeURI("/media/halogrip图片/2.4/assets/design-gap-background.png");
const RESPONDER = encodeURI("/media/halogrip图片/2.4/assets/first-responder.png");
const ROBOTAXI = encodeURI("/media/halogrip图片/2.4/assets/robotaxi.png");

type Panel = {
  id: string;
  title: string;
  sub: [string, string];
  x: number;
  y: number;
  w: number;
  h: number;
  icon: () => ReactNode;
};

/** Icon set ported 1:1 from process-scene.tsx's `icons` map (n01-n05) for visual continuity. */
function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4 L21 19 L3 19 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 10.5V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconWave() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h2.5l2-5 3 10 2-7 1.5 2H21" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function IconFace() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h-2v3M18 4h2v3M6 20h-2v-3M18 20h2v-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 17c1-2 2.5-3 4-3s3 1 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
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

function IconHelmet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16.5a8 8 0 0 1 16 0Z" />
      <path d="M4 16.5h16M12 8.5v-3" />
    </svg>
  );
}

function IconChip() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9.5 7V4M14.5 7V4M9.5 20v-3M14.5 20v-3M7 9.5H4M7 14.5H4M20 9.5h-3M20 14.5h-3" />
    </svg>
  );
}

/** Titles/meta copy match process-scene.tsx's NODES exactly — same chain, one section later. */
const PANELS: Panel[] = [
  { id: "01", title: "INCIDENT", sub: ["EVENT LOGGED", "AWAITING RESPONSE"], x: 0.9, y: 44, w: 10, h: 34, icon: IconWarn },
  { id: "02", title: "CONTACT OPERATOR", sub: ["CONNECTING TO OPERATOR", "CHANNEL SECURE"], x: 12.2, y: 44, w: 10, h: 34, icon: IconWave },
  { id: "03", title: "VERIFY", sub: ["IDENTITY CHECK", "SITUATION VALIDATED"], x: 22.8, y: 44, w: 10, h: 34, icon: IconFace },
  { id: "04A", title: "REMOTE AUTHORIZATION", sub: ["REMOTE SUPPORT", "TRAINED PROCEDURES"], x: 27.3, y: 29.8, w: 14.2, h: 17.8, icon: IconLock },
  { id: "04B", title: "ON-SITE DISPATCH", sub: ["LOCAL ASSISTANT", "DISPATCHED TO SCENE"], x: 30.3, y: 57, w: 11.2, h: 16.4, icon: IconPin },
  { id: "05", title: "MOVE OR TOW", sub: ["CLEAR SCENE", "ROUTE VERIFIED"], x: 40.4, y: 44, w: 10, h: 34, icon: IconCar },
];

/** Centre point of each panel above, in the same 0-100 coordinate space. */
const PANEL_POINTS: [number, number][] = [
  [5.9, 55.2],
  [17.2, 55.2],
  [27.8, 55.2],
  [34.4, 38.7],
  [35.9, 65.2],
  [45.4, 55.2],
];

const SEAM: [number, number] = [50.9, 55.2];

const NODES: { label: string; x: number; icon: () => ReactNode }[] = [
  { label: "FIRST RESPONDER", x: 57.4, icon: IconHelmet },
  { label: "LOCAL CONTROL", x: 68, icon: IconChip },
  { label: "MOVE", x: 77.5, icon: IconCar },
];
const NODE_Y = 55.2;

const PARTICLE_COUNT = 26;
function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  fromPanel: i % PANEL_POINTS.length,
  toNode: i % NODES.length,
  jitter: (hash(i) - 0.5) * 5.5,
  delay: hash(i + 41) * 0.16,
  size: 2.2 + hash(i + 97) * 2.6,
}));

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
        <h2 id="design-gap-title">WHAT IF FALLBACK LIVED INSIDE THE VEHICLE?</h2>
        <p className="dg-subhead">FROM EXTERNAL DEPENDENCY TO LOCAL CONTROL.</p>
      </div>

      <div className="dg-fb-chain">
        <div className="dg-fb-chain-group">
          <span className="dg-fb-chain-label">EXTERNAL DEPENDENCY</span>
          <ol className="dg-fb-steps">
            {PANELS.map((p) => (
              <li key={p.id}>
                <span className="dg-fb-step-id">{p.id}</span>
                {p.title}
              </li>
            ))}
          </ol>
        </div>
        <span className="dg-fb-arrow" aria-hidden="true">
          &rarr;
        </span>
        <div className="dg-fb-chain-group">
          <span className="dg-fb-chain-label">LOCAL CONTROL</span>
          <ol className="dg-fb-steps dg-fb-steps-local">
            <li>FIRST RESPONDER</li>
            <li>LOCAL CONTROL</li>
            <li>MOVE</li>
            <li>ROBOTAXI</li>
          </ol>
        </div>
      </div>

      <img className="dg-fb-robotaxi" src={ROBOTAXI} alt="Robotaxi receiving the repositioning command from local control" loading="lazy" />

      <p className="dg-bottom-labels dg-fb-bottom">
        PERSONNEL <span>&middot;</span> CONNECTIVITY <span>&middot;</span> TRAINING <span>&middot;</span> TIME
      </p>
    </section>
  );
}

export default function DesignGapScene() {
  const [enhanced, setEnhanced] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const routesRef = useRef<SVGGElement>(null);
  const responderRef = useRef<HTMLImageElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const seamGlowRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const lineArrowRef = useRef<SVGPolygonElement>(null);
  const localLabelRef = useRef<HTMLSpanElement>(null);
  const nodeWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeCircleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const robotaxiRef = useRef<HTMLDivElement>(null);
  const taillightRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bottomLabelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnhanced(canEnhance());
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!enhanced || !section) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const linePath = linePathRef.current;
      const lineLength = linePath ? linePath.getTotalLength() : 0;
      if (linePath) gsap.set(linePath, { strokeDasharray: lineLength, strokeDashoffset: lineLength });

      gsap.set(panelRefs.current, { transformPerspective: 800, rotateY: -5 });
      gsap.set(seamGlowRef.current, { opacity: 0 });
      gsap.set(lineArrowRef.current, { opacity: 0 });
      gsap.set(localLabelRef.current, { opacity: 0 });
      gsap.set(nodeWrapRefs.current, { opacity: 0 });
      gsap.set(robotaxiRef.current, { opacity: 0, x: 5, xPercent: 0 });
      gsap.set(taillightRef.current, { opacity: 0 });
      gsap.set(headlineRef.current, { opacity: 0, y: 14 });
      gsap.set(bottomLabelsRef.current, { opacity: 0 });
      PARTICLES.forEach((p, i) => {
        const [ox, oy] = PANEL_POINTS[p.fromPanel];
        gsap.set(particleRefs.current[i], { left: `${ox}%`, top: `${oy + p.jitter * 0.3}%`, opacity: 0, scale: 0.6, width: p.size, height: p.size });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Stage A (0-0.06): establishing hold. Left system is already at rest via CSS.

      // Stage B (0.06-0.42): the whoosh — panels + routes pulled toward the seam and
      // dissolved, first responder subdued (not removed; it stays into the final frame).
      timeline.to(responderRef.current, { opacity: 0.42, scale: 0.97, duration: 0.14 }, 0.08);
      timeline.to(routesRef.current, { scaleX: 1.12, transformOrigin: "51% 50%", duration: 0.05 }, 0.08);
      timeline.to(routesRef.current, { scaleX: 0.65, opacity: 0, duration: 0.13 }, 0.14);

      PANELS.forEach((_, i) => {
        const el = panelRefs.current[i];
        const start = 0.08 + i * 0.045;
        timeline.to(
          el,
          { left: "47%", top: `${SEAM[1]}%`, scaleX: 0.32, scaleY: 1.2, opacity: 0, filter: "blur(9px)", duration: 0.12, ease: "power1.in" },
          start,
        );
      });

      PARTICLES.forEach((p, i) => {
        const el = particleRefs.current[i];
        const node = [NODES[p.toNode].x, NODE_Y] as const;
        const t0 = 0.1 + p.delay;
        timeline.to(el, { opacity: 0.95, duration: 0.03 }, t0);
        timeline.to(el, { left: `${SEAM[0]}%`, top: `${SEAM[1] + p.jitter * 0.15}%`, duration: 0.17, ease: "power1.in" }, t0);
        timeline.to(el, { opacity: 0.25, duration: 0.02 }, t0 + 0.16);
        const t1 = 0.42 + p.delay * 0.5;
        timeline.to(el, { opacity: 0.95, duration: 0.02 }, t1);
        timeline.to(el, { left: `${node[0]}%`, top: `${node[1]}%`, duration: 0.16, ease: "power1.out" }, t1);
        timeline.to(el, { opacity: 0, duration: 0.03 }, t1 + 0.14);
      });

      // Stage C (0.36-0.48): the seam flash where particles cross.
      timeline.to(seamGlowRef.current, { opacity: 1, duration: 0.06 }, 0.36);
      timeline.to(seamGlowRef.current, { opacity: 0.4, duration: 0.14 }, 0.44);

      // Stage D (0.42-0.7): right system reforms. Line draws progressively, LOCAL CONTROL
      // label appears, each node pulses once as the drawn line reaches it.
      timeline.to(localLabelRef.current, { opacity: 1, duration: 0.05 }, 0.44);
      if (linePath) timeline.to(linePath, { strokeDashoffset: 0, duration: 0.26 }, 0.42);
      timeline.to(lineArrowRef.current, { opacity: 1, duration: 0.03 }, 0.64);

      NODES.forEach((_, idx) => {
        const wrap = nodeWrapRefs.current[idx];
        const circle = nodeCircleRefs.current[idx];
        const t = 0.46 + idx * 0.1;
        timeline.to(wrap, { opacity: 1, duration: 0.03 }, t);
        timeline.to(circle, { scale: 1.32, duration: 0.03 }, t).to(circle, { scale: 1, duration: 0.035 }, t + 0.03);
      });

      // Stage E (0.68-0.82): robotaxi slides/fades in, tail light briefly brightens.
      timeline.to(robotaxiRef.current, { opacity: 1, x: 0, duration: 0.09 }, 0.68);
      timeline.to(taillightRef.current, { opacity: 1, duration: 0.045 }, 0.72);
      timeline.to(taillightRef.current, { opacity: 0.55, duration: 0.07 }, 0.78);

      // Stage F (0.8-1.0): final composition — headline + bottom labels settle in.
      timeline.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.09 }, 0.8);
      timeline.to(bottomLabelsRef.current, { opacity: 1, duration: 0.08 }, 0.82);
    }, section);

    return () => context.revert();
  }, [enhanced]);

  if (enhanced === null) return null;
  if (!enhanced) return <DesignGapFallback />;

  return (
    <section className="design-gap-scene dark-section" id="design-gap" ref={sectionRef} aria-labelledby="design-gap-title">
      <div className="dg-bg" style={{ backgroundImage: `url(${BG})` }} />
      <div className="dg-scrim" />

      <span className="eyebrow dg-eyebrow">[ 02.4 / DESIGN GAP ]</span>
      <span className="dg-side-label dg-side-label-left">EXTERNAL DEPENDENCY</span>
      <span className="dg-side-label dg-side-label-right" ref={localLabelRef}>
        LOCAL CONTROL
      </span>

      <img className="dg-responder" src={RESPONDER} alt="First responder consulting a tablet before an in-vehicle handoff" ref={responderRef} loading="lazy" />

      <svg className="dg-graphic" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <g className="dg-routes" ref={routesRef}>
          <path className="dg-route-glow" d="M5.9,55.2 L17.2,55.2 L27.8,55.2 L31,55.2 L41,55.2 L45.4,55.2 L50.9,55.2" />
          <path className="dg-route" d="M5.9,55.2 L17.2,55.2 L27.8,55.2 L31,55.2 L41,55.2 L45.4,55.2 L50.9,55.2" />
          <path className="dg-route-glow" d="M31,55.2 L31,41.5 L34.4,41.5 L34.4,38.7" />
          <path className="dg-route" d="M31,55.2 L31,41.5 L34.4,41.5 L34.4,38.7" />
          <path className="dg-route-glow" d="M34.4,38.7 L34.4,49 L37.6,49 L41,55.2" />
          <path className="dg-route" d="M34.4,38.7 L34.4,49 L37.6,49 L41,55.2" />
          <path className="dg-route-glow" d="M31,55.2 L31,68.5 L35.9,68.5 L35.9,65.2" />
          <path className="dg-route" d="M31,55.2 L31,68.5 L35.9,68.5 L35.9,65.2" />
          <path className="dg-route-glow" d="M35.9,65.2 L35.9,54 L38.6,54 L41,55.2" />
          <path className="dg-route" d="M35.9,65.2 L35.9,54 L38.6,54 L41,55.2" />
          {PANEL_POINTS.map(([x, y], i) => (
            <circle key={i} className="dg-route-dot" cx={x} cy={y} r="0.55" />
          ))}
        </g>

        <path
          className="dg-line"
          ref={linePathRef}
          d={`M${SEAM[0]},${SEAM[1]} L${NODES[0].x},${NODE_Y} L${NODES[1].x},${NODE_Y} L${NODES[2].x},${NODE_Y} L84,${NODE_Y}`}
        />
        <polygon className="dg-line-arrow" ref={lineArrowRef} points={`84,${NODE_Y - 1.7} 88,${NODE_Y} 84,${NODE_Y + 1.7}`} />
      </svg>

      <div className="dg-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={p.id}
            className="dg-particle"
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <div className="dg-seam-glow" ref={seamGlowRef} style={{ left: `${SEAM[0]}%`, top: `${SEAM[1]}%` }} aria-hidden="true" />

      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          className="dg-panel"
          style={{ left: `${panel.x}%`, top: `${panel.y}%`, width: `${panel.w}%`, height: `${panel.h}%` }}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
        >
          <div className="dg-panel-head">
            <span className="dg-panel-id">{panel.id}</span>
            <span className="dg-panel-icon">
              <panel.icon />
            </span>
          </div>
          <h3>{panel.title}</h3>
          <p>
            {panel.sub[0]}
            <br />
            {panel.sub[1]}
          </p>
        </div>
      ))}

      {NODES.map((node, i) => (
        <div
          key={node.label}
          className="dg-node"
          style={{ left: `${node.x}%`, top: `${NODE_Y}%` }}
          ref={(el) => {
            nodeWrapRefs.current[i] = el;
          }}
        >
          <span className="dg-node-label">{node.label}</span>
          <div
            className="dg-node-circle"
            ref={(el) => {
              nodeCircleRefs.current[i] = el;
            }}
          >
            <node.icon />
          </div>
        </div>
      ))}

      <div className="dg-robotaxi-wrap" ref={robotaxiRef}>
        <img className="dg-robotaxi-img" src={ROBOTAXI} alt="Robotaxi receiving the repositioning command from local control" loading="lazy" />
        <div className="dg-taillight-glow" ref={taillightRef} />
        <span className="dg-robotaxi-label">ROBOTAXI</span>
      </div>

      <div className="dg-headline" ref={headlineRef}>
        <h2 id="design-gap-title">WHAT IF FALLBACK LIVED INSIDE THE VEHICLE?</h2>
        <p className="dg-subhead">FROM EXTERNAL DEPENDENCY TO LOCAL CONTROL.</p>
      </div>

      <div className="dg-bottom-labels" ref={bottomLabelsRef}>
        <span>PERSONNEL</span>
        <span aria-hidden="true">&middot;</span>
        <span>CONNECTIVITY</span>
        <span aria-hidden="true">&middot;</span>
        <span>TRAINING</span>
        <span aria-hidden="true">&middot;</span>
        <span>TIME</span>
      </div>
    </section>
  );
}
