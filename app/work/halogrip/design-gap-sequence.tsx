"use client";

/**
 * 02.3 / CURRENT RESPONSE -> 02.4 / DESIGN GAP, merged into one pinned, scroll-driven
 * sequence across three full-viewport photographic plates (`far car.png`, `close car.png`,
 * `in car.png` — all three already contain the first responder and the robotaxi baked in;
 * nothing here is a separate transparent car/responder asset composited on top). One
 * `ScrollTrigger` pins the section for `+=300%` (400vh total with the 100svh sticky frame)
 * and drives a single `applyFrame(t)` per scroll tick via `onUpdate`/`onRefresh` — no React
 * state on the scroll path, only direct ref writes (`style.opacity`/`transform`/`filter`,
 * SVG attribute writes). This mirrors ./design-gap-scene.tsx's (removed) architecture and
 * ./process-scene.tsx's (removed) pin-coordinator wiring exactly; see ./pin-coordinator.ts.
 *
 * Three narrative states, mapped straight onto scroll progress `t` (0-1):
 *   State 1  0.00-0.18 hold, 0.18-0.48 transition  "far car"   — external dependency
 *   State 2  0.48-0.58 hold (clean, no overlay)     "close car" — the approaching vehicle
 *   State 3  0.58-0.72 transition, 0.72-1.00 hold   "in car"    — limited control on board
 *
 * All three background images stay mounted and stacked the whole time; only their opacity
 * (plus a short shared blur + a barely-perceptible 1.00->1.015 scale during the cabin entry)
 * ever changes, driven by two eased progress values (`fadeT`, `transT`) so the three
 * opacities are always exact complements of each other — see the header comment inside
 * `applyFrame` for the derivation. Nothing here uses WebGL, a second 3D scene, or a heavy
 * per-pixel particle system: the "material disintegration" cue for the dissolving state-1
 * cards is a fixed pool of ~12 small CSS dots, opacity-only, not a canvas.
 *
 * No invented times, distances, coordinates, company names or statistics — matches every
 * other section's evidence-safe copy.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markPinReady, onPinsReady } from "./pin-coordinator";

const FAR = encodeURI("/media/halogrip图片/2.4/far car.png");
const CLOSE = encodeURI("/media/halogrip图片/2.4/close car.png");
const IN_CAR = encodeURI("/media/halogrip图片/2.4/in car.png");

const NODE_ICON = {
  responder: encodeURI("/media/halogrip图片/2.4/first-responder-icon.png"),
  control: encodeURI("/media/halogrip图片/2.4/local-control.png"),
  reposition: encodeURI("/media/halogrip图片/2.4/safe-move.png"),
} as const;

type Panel = { id: string; index: string; title: string; sub: string; x: number; y: number; rotateY: number; icon: () => ReactNode };

function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4 L21 19 L3 19 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 10.5V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconSupport() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="17" y="13" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
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
    </svg>
  );
}

/** A solid filled triangle, not an outlined chevron — per Sylvia's brief this arrowhead must
 *  read as an obvious, unmissable "this way" cue at a glance, not a subtle stroke. */
function IconFlowHead() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 4 L21 12 L3 20 Z" />
    </svg>
  );
}

/** Three workflow panels only (not process-scene.tsx's old six) — a glance, not a diagram.
 *  `x`/`y` are the panel's own centre in 0-100 viewport %; `rotateY` is a static per-panel
 *  skew so the row reads as following the road's own perspective, not sitting flat-on. */
const PANELS: Panel[] = [
  { id: "incident", index: "01", title: "INCIDENT", sub: "EVENT DETECTED", x: 25, y: 68, rotateY: -3, icon: IconWarn },
  { id: "support", index: "02", title: "EXTERNAL SUPPORT", sub: "CALL · VERIFY · AUTHORIZE", x: 40.5, y: 60, rotateY: -6, icon: IconSupport },
  { id: "move", index: "03", title: "MOVE OR TOW", sub: "HELP REACHES THE VEHICLE", x: 56, y: 53, rotateY: -9, icon: IconCar },
];
const PANEL_W = 12.5;
const PANEL_H = 21;

/** A fixed, small pool (not a canvas particle system) of red dust motes that appear only
 *  as the state-1 cards dissolve — deterministic hash, not Math.random, for SSR/client
 *  parity. Positions cluster loosely around the panel row. */
const DUST_COUNT = 12;
function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
const DUST = Array.from({ length: DUST_COUNT }, (_, i) => ({
  left: 20 + hash(i) * 38,
  top: 48 + hash(i + 50) * 30,
  size: 1.5 + hash(i + 100) * 2.5,
  delay: hash(i + 150) * 0.15,
}));

/** Dashboard nodes, state 3. Start compressed near centre, spread out as the cabin settles. */
const NODES = [
  { id: "responder", label: "FIRST RESPONDER", startX: 47, endX: 25, accent: false },
  { id: "control", label: "LOCAL CONTROL", startX: 50, endX: 50, accent: true },
  { id: "reposition", label: "SAFE REPOSITIONING", startX: 53, endX: 75, accent: false },
] as const;
const NODE_Y = 82;
/** Percentage-of-section-width gap left clear on each side of a connector so its arrowhead
 *  lands in the open space between two icons instead of being drawn underneath the next one
 *  (icon-centre to icon-centre was the original span — at a 44-52px icon width that swallowed
 *  the whole arrowhead, which is why the connectors used to read as a plain unbroken line).
 *  Kept tight on purpose — per feedback that a wider gap read as three isolated icons with
 *  decorative lines floating nearby rather than one connected flow. */
const CONNECTOR_GAP_PCT = 2.4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Ramps 0->1 over [from,from+span] and holds at 1 — for anything that must persist into
 *  the final composition once revealed (not a transient pulse). */
function rampHold(t: number, from: number, span: number) {
  return clamp01((t - from) / span);
}

function canEnhance() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 760) return false;
  return true;
}

/**
 * Reduced-motion (and narrow-viewport, matching every other pinned section on this page)
 * fallback: no pin, no scrub, no crossfade math — just the two narrative beats presented as
 * ordinary stacked static sections, each fully legible at rest. For reduced motion, this is
 * the "simple fade from the 2.3 state to the final interior state" read literally as "no
 * complex movement": there is no movement at all here.
 */
function DesignGapSequenceFallback() {
  return (
    <div className="dgs-fallback">
      <section className="dgs-fb-panel" aria-labelledby="response-title">
        <img className="dgs-fb-bg" src={FAR} alt="A first responder views a stalled robotaxi from a distance on a wet city street at night." loading="lazy" />
        <div className="dgs-fb-scrim" />
        <div className="dgs-fb-copy">
          <span className="eyebrow dgs-fb-label">[ 02.3 / CURRENT RESPONSE ]</span>
          <h2 id="response-title" className="dgs-fb-headline">
            HELP EXISTS.
            <br />
            BUT IT IS NOT IMMEDIATE.
          </h2>
          <p className="dgs-fb-para">Moving a stalled robotaxi still depends on external support, authorization and time on site.</p>
        </div>
      </section>

      <section className="dgs-fb-panel" aria-labelledby="design-gap-title">
        <img className="dgs-fb-bg" src={IN_CAR} alt="View from inside the robotaxi cabin, looking out at the city through the rear window." loading="lazy" />
        <div className="dgs-fb-scrim" />
        <div className="dgs-fb-copy dgs-fb-copy-center">
          <span className="eyebrow dgs-fb-label">[ 02.4 / DESIGN GAP ]</span>
          <h2 id="design-gap-title" className="dgs-fb-headline">
            WHAT IF LIMITED CONTROL
            <br />
            WAS ALREADY ON BOARD?
          </h2>
          <p className="dgs-fb-sub">FROM EXTERNAL DEPENDENCY TO DIRECT, ON-BOARD CONTROL.</p>
        </div>
      </section>
    </div>
  );
}

export default function DesignGapSequence() {
  const [enhanced, setEnhanced] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const farRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLImageElement>(null);
  const inCarRef = useRef<HTMLImageElement>(null);
  const bgStackRef = useRef<HTMLDivElement>(null);

  const s1CopyRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const connectorRef = useRef<SVGGElement>(null);
  const dustRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const s3CopyRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowARef = useRef<HTMLDivElement>(null);
  const arrowBRef = useRef<HTMLDivElement>(null);

  // First pass: decide, once, whether this browser gets the pinned/scrubbed sequence or the
  // static fallback. Mirrors every other pinned section on this page (scroll-intro.tsx,
  // the removed process-scene.tsx/design-gap-scene.tsx) — a one-time state flip on mount,
  // never touched again; the actual scroll handler below never calls setState.
  useEffect(() => {
    const result = canEnhance();
    setEnhanced(result);
    if (!result) markPinReady("design-gap-sequence");
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!enhanced || !section) return;

    // Preload + decode all three plates up front so the crossfades never stall on a
    // mid-scroll image decode.
    [farRef.current, closeRef.current, inCarRef.current].forEach((img) => {
      if (img && "decode" in img) img.decode().catch(() => {});
    });

    gsap.registerPlugin(ScrollTrigger);
    const ease = gsap.parseEase("power1.inOut");

    // Each connector spans the full distance between one icon's own centre and the next
    // icon's centre — `left`/`width` are both plain horizontal percentages (no diagonal, both
    // endpoints share NODE_Y), so this never touches `.dgs-graphic`'s non-uniformly-stretched
    // viewBox (preserveAspectRatio="none") and the arrowhead cap at the end stays undistorted.
    function setConnector(el: HTMLDivElement | null, x1: number, x2: number, opacity: number) {
      if (!el) return;
      el.style.left = `${x1}%`;
      el.style.width = `${x2 - x1}%`;
      el.style.top = `${NODE_Y}%`;
      el.style.opacity = String(opacity);
    }

    function applyFrame(t: number) {
      // Two eased progress values drive every crossfade. Because close/in-car opacity are
      // each written as a product of these (not three independently-tweened values), the
      // three plates are always exact complements — never a visible gap or double-exposure.
      const fadeT = ease(clamp01((t - 0.18) / 0.3)); // 0.18 -> 0.48: far -> close, cards recede
      const transT = ease(clamp01((t - 0.58) / 0.14)); // 0.58 -> 0.72: close -> in, cabin entry

      const farOpacity = 1 - fadeT;
      const closeOpacity = fadeT * (1 - transT);
      const inOpacity = transT;
      if (farRef.current) farRef.current.style.opacity = String(farOpacity);
      if (closeRef.current) closeRef.current.style.opacity = String(closeOpacity);
      if (inCarRef.current) inCarRef.current.style.opacity = String(inOpacity);

      // Restrained blur only during the two active crossfades (a bell curve of the eased
      // progress is naturally 0 at both ends of its own window and everywhere outside it),
      // plus the barely-perceptible "entering the cabin" scale that holds once state 3 settles.
      const blur = Math.sin(fadeT * Math.PI) * 2.2 + Math.sin(transT * Math.PI) * 2.6;
      const scale = lerp(1, 1.015, transT);
      if (bgStackRef.current) {
        bgStackRef.current.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        bgStackRef.current.style.transform = `scale(${scale})`;
      }

      // State 1 copy + panels fade and recede together over the same 0.18-0.48 window —
      // panels never translate/scale independently of their shared opacity.
      const s1Opacity = 1 - fadeT;
      if (s1CopyRef.current) {
        s1CopyRef.current.style.opacity = String(s1Opacity);
        s1CopyRef.current.style.transform = `translateY(${lerp(0, -10, fadeT)}px)`;
      }
      if (connectorRef.current) connectorRef.current.style.opacity = String(s1Opacity);
      const panelScale = lerp(1, 0.93, fadeT);
      const panelShift = lerp(0, -2.5, fadeT);
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(s1Opacity);
        el.style.transform = `translate(-50%,-50%) translateY(${panelShift}%) scale(${panelScale}) rotateY(${PANELS[i].rotateY}deg)`;
      });

      // A small, restrained dust layer — opacity-only, no motion of its own — that appears
      // only around the midpoint of the card dissolve and is fully gone before and after it.
      const dustEnvelope = Math.sin(clamp01(fadeT) * Math.PI);
      dustRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(Math.max(0, dustEnvelope - DUST[i].delay) * 0.6);
      });

      // State 3: headline only once the interior is mostly visible, nodes only after that,
      // spreading from a compressed cluster near centre out across the dashboard.
      const s3Opacity = ease(rampHold(t, 0.74, 0.08));
      if (s3CopyRef.current) {
        s3CopyRef.current.style.opacity = String(s3Opacity);
        s3CopyRef.current.style.transform = `translateY(${lerp(10, 0, s3Opacity)}px)`;
      }

      const nodesOpacity = rampHold(t, 0.8, 0.06);
      const spreadT = ease(clamp01((t - 0.82) / 0.13));
      const positions = NODES.map((n) => lerp(n.startX, n.endX, spreadT));
      positions.forEach((x, i) => {
        const el = nodeRefs.current[i];
        if (el) {
          el.style.left = `${x}%`;
          el.style.opacity = String(nodesOpacity);
        }
      });
      setConnector(arrowARef.current, positions[0] + CONNECTOR_GAP_PCT, positions[1] - CONNECTOR_GAP_PCT, nodesOpacity);
      setConnector(arrowBRef.current, positions[1] + CONNECTOR_GAP_PCT, positions[2] - CONNECTOR_GAP_PCT, nodesOpacity);
    }

    let context: gsap.Context | undefined;
    const unsubscribe = onPinsReady(["scroll-intro"], () => {
      context = gsap.context(() => {
        applyFrame(0);

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => applyFrame(self.progress),
          onRefresh: (self) => applyFrame(self.progress),
        });

        markPinReady("design-gap-sequence");
      }, section);
    });

    return () => {
      unsubscribe();
      context?.revert();
    };
  }, [enhanced]);

  if (enhanced === null) return null;
  if (!enhanced) return <DesignGapSequenceFallback />;

  return (
    <section className="design-gap-sequence dark-section" id="design-gap" ref={sectionRef} aria-label="Current response and design gap">
        <div className="dgs-bg-stack" ref={bgStackRef}>
          <img className="dgs-bg" ref={farRef} src={FAR} alt="A first responder views a stalled robotaxi from a distance on a wet city street at night." loading="eager" decoding="async" />
          <img className="dgs-bg" ref={closeRef} src={CLOSE} alt="The first responder approaches the stalled robotaxi, now close, on the wet street." loading="eager" decoding="async" style={{ opacity: 0 }} />
          <img className="dgs-bg" ref={inCarRef} src={IN_CAR} alt="View from inside the robotaxi cabin, looking out at the city through the rear window." loading="eager" decoding="async" style={{ opacity: 0 }} />
        </div>
        <div className="dgs-scrim" aria-hidden="true" />

        {/* State 1 — 02.3 CURRENT RESPONSE */}
        <div className="dgs-s1-copy" ref={s1CopyRef}>
          <span className="eyebrow dgs-s1-label">[ 02.3 / CURRENT RESPONSE ]</span>
          <h2 id="response-title" className="dgs-s1-headline">
            <span className="dgs-s1-headline-line">HELP EXISTS.</span>
            <span className="dgs-s1-headline-line">BUT IT IS NOT IMMEDIATE.</span>
          </h2>
          <p className="dgs-s1-para">Moving a stalled robotaxi still depends on external support, authorization and time on site.</p>
        </div>

        <svg className="dgs-graphic" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g className="dgs-connector" ref={connectorRef}>
            <path
              className="dgs-connector-line"
              d={`M${PANELS[0].x},${PANELS[0].y} L${PANELS[1].x},${PANELS[1].y} L${PANELS[2].x},${PANELS[2].y}`}
            />
            {PANELS.map((p) => (
              <circle key={p.id} className="dgs-connector-dot" cx={p.x} cy={p.y} r="0.55" />
            ))}
          </g>
        </svg>

        <div className="dgs-dust" aria-hidden="true">
          {DUST.map((d, i) => (
            <span
              key={i}
              className="dgs-dust-mote"
              style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
              ref={(el) => {
                dustRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        {PANELS.map((panel, i) => (
          <div
            key={panel.id}
            className="dgs-panel"
            style={{ left: `${panel.x}%`, top: `${panel.y}%`, width: `${PANEL_W}%`, height: `${PANEL_H}%` }}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
          >
            <div className="dgs-panel-head">
              <span className="dgs-panel-index">{panel.index}</span>
              <span className="dgs-panel-icon">
                <panel.icon />
              </span>
            </div>
            <h3>{panel.title}</h3>
            <p>{panel.sub}</p>
          </div>
        ))}

        {/* State 3 — 02.4 DESIGN GAP */}
        <div className="dgs-s3-copy" ref={s3CopyRef}>
          <span className="eyebrow dgs-s3-label">[ 02.4 / DESIGN GAP ]</span>
          <h2 id="design-gap-title" className="dgs-s3-headline">
            WHAT IF LIMITED CONTROL
            <br />
            WAS ALREADY ON BOARD?
          </h2>
          <p className="dgs-s3-sub">FROM EXTERNAL DEPENDENCY TO DIRECT, ON-BOARD CONTROL.</p>
        </div>

        {NODES.map((node, i) => (
          <div
            key={node.id}
            className={`dgs-node${node.accent ? " dgs-node-accent" : ""}`}
            style={{ left: `${node.startX}%`, top: `${NODE_Y}%` }}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
          >
            {/* Fixed-height slot, icon bottom-aligned inside it: LOCAL CONTROL's icon can stay
                visibly larger than the other two without pushing its label down — every label
                sits the same distance below NODE_Y regardless of the icon size above it. */}
            <div className="dgs-node-icon-slot">
              <img className="dgs-node-icon" src={NODE_ICON[node.id]} alt="" aria-hidden="true" loading="lazy" />
            </div>
            <span className="dgs-node-label">{node.label}</span>
          </div>
        ))}
        {/* Each connector spans the gap between two icons (see setConnector/CONNECTOR_GAP_PCT)
            — stopping short of both icon edges so the arrowhead lands in open space and stays
            fully visible instead of being drawn underneath the next node. */}
        <div className="dgs-flow-connector" ref={arrowARef} aria-hidden="true">
          <span className="dgs-flow-shaft" />
          <span className="dgs-flow-head"><IconFlowHead /></span>
        </div>
        <div className="dgs-flow-connector" ref={arrowBRef} aria-hidden="true">
          <span className="dgs-flow-shaft" />
          <span className="dgs-flow-head"><IconFlowHead /></span>
        </div>
      </section>
  );
}

