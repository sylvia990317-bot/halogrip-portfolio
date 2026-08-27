"use client";

/**
 * 02.4 / DESIGN GAP — pinned, scroll-driven consolidation from the external, multi-step
 * dependency chain (first responder -> call operator -> verify -> remote authorization /
 * on-site dispatch -> move or tow) into a single, widely-spaced in-vehicle local-control
 * line (first responder -> local control -> move -> robotaxi).
 *
 * Motion reference: `public/media/halogrip图片/2.4/halogrip-reflow-animation.gif` (motion
 * only — not reproduced as a video/image asset; every layer below is independent DOM/SVG/
 * canvas built from this project's own assets, fonts and colour tokens). It shows:
 *  - the FULL composition already on screen at rest (both systems, headline, background) —
 *    nothing fades in from nothing; the scroll only rearranges what's already there.
 *  - the six left panels erased in place by a particle boundary that starts at the centre
 *    seam and sweeps left, eating each panel from its right edge as it passes — panels
 *    never translate or scale, they just get wiped away.
 *  - the three right-side nodes (already visible, already connected by a line, but
 *    compressed into the original right half) sliding apart into a wide spread that
 *    spans most of the viewport, with the connecting line stretching continuously between
 *    them as they move.
 *  - the robotaxi adjusting its own position slightly, independently of the three nodes.
 *  - the headline, subhead and background never move at all.
 *
 * All coordinates are plain 0-100 numbers used identically as SVG viewBox units
 * (viewBox="0 0 100 100", preserveAspectRatio="none") and as CSS left/top percentages —
 * one coordinate system for every layer, so nothing needs px math for positioning. The
 * canvas particle band is the one exception: it needs real pixel coordinates to draw, so
 * it reads the section's own client size (kept in sync with a ResizeObserver).
 *
 * Pin architecture mirrors ./scroll-intro.tsx and reports through ./pin-coordinator so
 * ./process-scene.tsx and ./overview-backdrop.tsx don't measure a pre-pin document (see
 * that module's own comment for why). Reduced motion / narrow viewports skip the pin+scrub
 * entirely and render a simplified static composition instead (DesignGapFallback).
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
import { markPinReady, onPinsReady } from "./pin-coordinator";

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

/** Centre point of each panel above (still used for the route's connection dots). */
const PANEL_POINTS: [number, number][] = [
  [5.9, 55.2],
  [17.2, 55.2],
  [27.8, 55.2],
  [34.4, 38.7],
  [35.9, 65.2],
  [45.4, 55.2],
];

/** The dissolve boundary starts here (the old centre seam) and sweeps left past x=0. */
const SEAM_X = 50.9;
const BOUNDARY_END_X = -8;

const NODE_Y = 55.2;
const NODES: { label: string; icon: () => ReactNode; startX: number; endX: number }[] = [
  { label: "FIRST RESPONDER", icon: IconHelmet, startX: 57.4, endX: 22 },
  { label: "LOCAL CONTROL", icon: IconChip, startX: 68, endX: 50 },
  { label: "MOVE", icon: IconCar, startX: 77.5, endX: 78 },
];
const TAIL_BASE_X = 84;
const TAIL_TIP_X = 88;

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

/** 0 outside [inLo,outHi], ramps to 1 by inHi, holds, ramps back down from outLo. */
function trapezoid(t: number, inLo: number, inHi: number, outLo: number, outHi: number) {
  if (t <= inLo || t >= outHi) return 0;
  if (t < inHi) return (t - inLo) / (inHi - inLo);
  if (t < outLo) return 1;
  return 1 - (t - outLo) / (outHi - outLo);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const routesRef = useRef<SVGGElement>(null);
  const responderRef = useRef<HTMLImageElement>(null);
  const externalLabelRef = useRef<HTMLSpanElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boundaryGlowRef = useRef<HTMLDivElement>(null);
  const lineABRef = useRef<SVGLineElement>(null);
  const lineBCRef = useRef<SVGLineElement>(null);
  const lineCDRef = useRef<SVGLineElement>(null);
  const arrowRef = useRef<SVGPolygonElement>(null);
  const nodeWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeCircleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const robotaxiRef = useRef<HTMLDivElement>(null);
  const taillightRef = useRef<HTMLDivElement>(null);
  const bottomLabelsRef = useRef<HTMLDivElement>(null);

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
      const bandTop = h * 0.27;
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

    function setLine(el: SVGLineElement | null, x1: number, x2: number) {
      if (!el) return;
      el.setAttribute("x1", String(x1));
      el.setAttribute("x2", String(x2));
      el.setAttribute("y1", String(NODE_Y));
      el.setAttribute("y2", String(NODE_Y));
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

      const dissolveT = ease(clamp01((t - 0.2) / 0.5));
      const redistT = ease(clamp01((t - 0.3) / 0.55));

      const boundaryX = lerp(SEAM_X, BOUNDARY_END_X, dissolveT);

      PANELS.forEach((panel, i) => {
        const left = panel.x;
        const right = panel.x + panel.w;
        const visible = clamp01((boundaryX - left) / (right - left));
        setPanelVisibility(panelRefs.current[i], visible);
      });

      const leftGroupOpacity = 1 - dissolveT;
      if (routesRef.current) routesRef.current.style.opacity = String(leftGroupOpacity);
      if (responderRef.current) {
        responderRef.current.style.opacity = String(leftGroupOpacity);
        responderRef.current.style.filter = dissolveT > 0 ? `blur(${dissolveT * 5}px)` : "none";
      }
      if (externalLabelRef.current) externalLabelRef.current.style.opacity = String(clamp01(1 - dissolveT * 1.6));
      if (bottomLabelsRef.current) bottomLabelsRef.current.style.opacity = String(clamp01(1 - dissolveT * 3.2));

      const bandEnvelope = trapezoid(t, 0.19, 0.22, 0.68, 0.73);
      drawBand(boundaryX, bandEnvelope);
      if (boundaryGlowRef.current) {
        boundaryGlowRef.current.style.left = `${boundaryX}%`;
        boundaryGlowRef.current.style.opacity = String(bandEnvelope * 0.85);
      }

      const fr = lerp(NODES[0].startX, NODES[0].endX, redistT);
      const lc = lerp(NODES[1].startX, NODES[1].endX, redistT);
      const mv = lerp(NODES[2].startX, NODES[2].endX, redistT);
      const positions = [fr, lc, mv];
      positions.forEach((x, i) => {
        const wrap = nodeWrapRefs.current[i];
        if (wrap) wrap.style.left = `${x}%`;
      });

      setLine(lineABRef.current, fr, lc);
      setLine(lineBCRef.current, lc, mv);
      setLine(lineCDRef.current, mv, TAIL_BASE_X);
      if (arrowRef.current) {
        arrowRef.current.setAttribute(
          "points",
          `${TAIL_BASE_X},${NODE_Y - 1.7} ${TAIL_TIP_X},${NODE_Y} ${TAIL_BASE_X},${NODE_Y + 1.7}`,
        );
      }

      // The robotaxi stays a separate element with its own small settle-in nudge —
      // never coupled to the three nodes' tween.
      if (robotaxiRef.current) {
        const shift = lerp(2.2, 0, redistT);
        robotaxiRef.current.style.transform = `translateX(${shift}%)`;
      }

      // A single settle pulse once the nodes finish spreading, shared by all three
      // circles and the taillight, so the arrival reads as one beat.
      const settle = trapezoid(t, 0.78, 0.85, 0.85, 0.93);
      nodeCircleRefs.current.forEach((el) => {
        if (el) el.style.transform = `scale(${1 + settle * 0.16})`;
      });
      if (taillightRef.current) taillightRef.current.style.opacity = String(0.15 + settle * 0.65);
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
        gsap.set(panelRefs.current, { transformPerspective: 800, rotateY: -5 });

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
      <span className="dg-side-label dg-side-label-right">LOCAL CONTROL</span>

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

        <line className="dg-line" ref={lineABRef} />
        <line className="dg-line" ref={lineBCRef} />
        <line className="dg-line" ref={lineCDRef} />
        <polygon className="dg-line-arrow" ref={arrowRef} />
      </svg>

      <canvas className="dg-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="dg-boundary-glow" ref={boundaryGlowRef} style={{ top: `${NODE_Y}%` }} aria-hidden="true" />

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
          style={{ left: `${node.startX}%`, top: `${NODE_Y}%` }}
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

      <div className="dg-headline">
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
