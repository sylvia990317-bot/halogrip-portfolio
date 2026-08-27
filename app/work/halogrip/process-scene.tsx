"use client";

/**
 * 02.3 CURRENT SOLUTION — pinned, scroll-driven process diagram.
 *
 * Visual reference: `public/media/halogrip图片/2.3/2.3 reference.png` — used for composition,
 * atmosphere and art direction only. Its baked-in numbers (T+18:20, km distances, GPS
 * coordinates) and company names (Waymo, Apollo Go) are not real/verified and are deliberately
 * not reproduced here; every label below is generic and evidence-safe. The whole information
 * layer is built as HTML/CSS/SVG (not the flattened reference image) so it stays editable.
 *
 * Six-step process, revealed one stage at a time as the section is scrolled through while
 * pinned (same GSAP + ScrollTrigger pin/scrub pattern as ./scroll-intro.tsx):
 *   0. label + headline + intro copy
 *   1. step 01 (route begins drawing)
 *   2. extend the route through 02 and 03
 *   3. split the route toward 04A and 04B
 *   4. merge both branches into 05 and the stalled vehicle
 *   5. hold on the complete process
 */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Align = "above" | "below";

type NodeSpec = {
  id: string;
  index: string;
  title: string;
  meta: [string, string];
  left: number;
  top: number;
  align: Align;
};

const NODES: NodeSpec[] = [
  { id: "n01", index: "01", title: "INCIDENT DETECTED", meta: ["EVENT LOGGED", "AWAITING RESPONSE"], left: 10, top: 64, align: "above" },
  { id: "n02", index: "02", title: "CONTACT OPERATOR", meta: ["CONNECTING TO OPERATOR", "CHANNEL SECURE"], left: 27, top: 64, align: "above" },
  { id: "n03", index: "03", title: "VERIFY SITUATION", meta: ["IDENTITY CHECK", "SITUATION VALIDATED"], left: 44, top: 64, align: "above" },
  { id: "n04a", index: "04A", title: "REMOTE AUTHORIZATION", meta: ["REMOTE SUPPORT", "TRAINED PROCEDURES"], left: 62, top: 40, align: "above" },
  { id: "n04b", index: "04B", title: "ON-SITE DISPATCH", meta: ["LOCAL ASSISTANT", "DISPATCHED TO SCENE"], left: 62, top: 73, align: "below" },
  { id: "n05", index: "05", title: "MOVE OR TOW", meta: ["CLEAR SCENE", "ROUTE VERIFIED"], left: 80, top: 64, align: "above" },
];

const ORIGIN = { left: 3, top: 64 };
const VEHICLE = { left: 94, top: 64 };

const STAGE_LABELS = ["DETECTED", "CONTACTED", "VERIFIED", "RESPONSE INITIATED", "VEHICLE CLEARED"];

/** viewBox is 1700x900; SVG coordinates are just the % grid above scaled by 17 / 9. */
const toPoint = (left: number, top: number): [number, number] => [left * 17, top * 9];

const [ox, oy] = toPoint(ORIGIN.left, ORIGIN.top);
const [vx, vy] = toPoint(VEHICLE.left, VEHICLE.top);
const byId = Object.fromEntries(NODES.map((n) => [n.id, toPoint(n.left, n.top)]));
const [n1x, n1y] = byId.n01;
const [n2x, n2y] = byId.n02;
const [n3x, n3y] = byId.n03;
const [n4ax, n4ay] = byId.n04a;
const [n4bx, n4by] = byId.n04b;
const [n5x, n5y] = byId.n05;

const midA = n3x + 70;
const midB = n4ax + 70;

const SEGMENTS = {
  segA: `M${ox},${oy} L${n1x},${n1y}`,
  segB: `M${n1x},${n1y} L${n2x},${n2y} L${n3x},${n3y}`,
  segC1: `M${n3x},${n3y} L${midA},${n3y} L${midA},${n4ay} L${n4ax},${n4ay}`,
  segC2: `M${n3x},${n3y} L${midA},${n3y} L${midA},${n4by} L${n4bx},${n4by}`,
  segD1: `M${n4ax},${n4ay} L${midB},${n4ay} L${midB},${n5y} L${n5x},${n5y}`,
  segD2: `M${n4bx},${n4by} L${midB},${n4by} L${midB},${n5y} L${n5x},${n5y}`,
  segE: `M${n5x},${n5y} L${vx},${vy}`,
} as const;

const icons: Record<string, ReactNode> = {
  n01: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4 L21 19 L3 19 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 10.5V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  ),
  n02: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12h2.5l2-5 3 10 2-7 1.5 2H21" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  n03: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h-2v3M18 4h2v3M6 20h-2v-3M18 20h2v-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 17c1-2 2.5-3 4-3s3 1 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  n04a: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="15" r="1.15" fill="currentColor" />
    </svg>
  ),
  n04b: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.4A7 7 0 0 0 5 9.6C5 14.8 12 21 12 21Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="9.6" r="2.1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  n05: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16.5 6 11h9l3 3.2v2.3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M4 16.5h1.5M18 16.5H20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="16.7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16.5" cy="16.7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 5.5 17 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M17 5.5 20 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

function canEnhance() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 760) return false;
  return true;
}

export default function ProcessScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGSVGElement>(null);
  const segRefs = useRef<Record<string, SVGPathElement | null>>({});
  const dotRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const pulseRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const originRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotTrackRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !canEnhance()) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const segEntries = Object.entries(segRefs.current) as [string, SVGPathElement][];
      const lengths: Record<string, number> = {};
      segEntries.forEach(([key, el]) => {
        const length = el.getTotalLength();
        lengths[key] = length;
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap.set(routeRef.current, { opacity: 0 });
      gsap.set(introRef.current, { opacity: 0, y: 18 });
      gsap.set(originRef.current, { opacity: 0, y: 16 });
      gsap.set(vehicleRef.current, { opacity: 0, y: 16 });
      NODES.forEach((n) => gsap.set(nodeRefs.current[n.id], { opacity: 0, y: n.align === "above" ? -16 : 16 }));
      NODES.forEach((n) => gsap.set(dotRefs.current[n.id], { opacity: 0 }));
      NODES.forEach((n) => gsap.set(pulseRefs.current[n.id], { opacity: 0, attr: { r: 3 } }));
      labelRefs.current.forEach((el) => gsap.set(el, { opacity: 0.4 }));
      dotTrackRefs.current.forEach((el) => gsap.set(el, { backgroundColor: "rgba(245,245,241,.35)" }));
      gsap.set(fillRef.current, { scaleX: 0 });

      const draw = (key: keyof typeof SEGMENTS, at: number, duration: number) => {
        timeline.to(segRefs.current[key], { strokeDashoffset: 0, duration }, at);
      };

      const revealNode = (id: string, at: number, duration = 0.02) => {
        timeline.to(nodeRefs.current[id], { opacity: 1, y: 0, duration }, at);
        timeline.to(dotRefs.current[id], { opacity: 1, duration: duration * 0.6 }, at);
        timeline.fromTo(
          pulseRefs.current[id],
          { opacity: 0.75, attr: { r: 4 } },
          { opacity: 0, attr: { r: 22 }, duration: duration * 3.2 },
          at,
        );
      };

      const dimNode = (id: string, at: number) => {
        timeline.to(nodeRefs.current[id], { opacity: 0.55, duration: 0.02 }, at);
      };

      const activateStage = (index: number, at: number) => {
        timeline.to(labelRefs.current[index], { opacity: 1, duration: 0.02 }, at);
        timeline.to(dotTrackRefs.current[index], { backgroundColor: "var(--red)", duration: 0.02 }, at);
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=420%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Stage 0 (0 - 0.14) — label, headline, intro copy only.
      timeline.to(introRef.current, { opacity: 1, y: 0, duration: 0.1 }, 0.02);

      // Stage 1 (0.14 - 0.30) — step 01, route begins drawing.
      timeline.to(introRef.current, { opacity: 0.55, duration: 0.02 }, 0.14);
      timeline.to(routeRef.current, { opacity: 1, duration: 0.02 }, 0.14);
      timeline.to(originRef.current, { opacity: 1, y: 0, duration: 0.03 }, 0.14);
      draw("segA", 0.16, 0.06);
      revealNode("n01", 0.22, 0.03);
      activateStage(0, 0.14);

      // Stage 2 (0.30 - 0.48) — extend the route through 02 and 03.
      dimNode("n01", 0.3);
      draw("segB", 0.31, 0.08);
      revealNode("n02", 0.36, 0.03);
      activateStage(1, 0.36);
      revealNode("n03", 0.43, 0.03);
      activateStage(2, 0.43);

      // Stage 3 (0.48 - 0.66) — split the route toward 04A and 04B.
      dimNode("n02", 0.48);
      dimNode("n03", 0.48);
      draw("segC1", 0.49, 0.07);
      draw("segC2", 0.49, 0.07);
      revealNode("n04a", 0.57, 0.03);
      revealNode("n04b", 0.57, 0.03);
      activateStage(3, 0.48);

      // Stage 4 (0.66 - 0.86) — merge both routes into 05 and the stalled vehicle.
      dimNode("n04a", 0.66);
      dimNode("n04b", 0.66);
      draw("segD1", 0.67, 0.07);
      draw("segD2", 0.67, 0.07);
      revealNode("n05", 0.75, 0.03);
      activateStage(4, 0.75);
      draw("segE", 0.78, 0.05);
      timeline.to(vehicleRef.current, { opacity: 1, y: 0, duration: 0.04 }, 0.8);

      // Stage 5 (0.86 - 1.0) — hold on the complete process.
      timeline.to(fillRef.current, { scaleX: 1, duration: 0.98, ease: "none" }, 0.02);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="process-scene dark-section" ref={sectionRef} aria-labelledby="process-title">
      <div className="process-bg" aria-hidden="true" />
      <div className="process-ground" aria-hidden="true" />
      <div className="process-scrim" aria-hidden="true" />

      <div className="process-intro" ref={introRef}>
        <span className="eyebrow">[ 02.3 / CURRENT SOLUTION ]</span>
        <h2 id="process-title">HELP EXISTS.<br />BUT IT IS NOT IMMEDIATE.</h2>
        <p>Today, moving a stalled vehicle means calling a remote operator, verifying identity, waiting for authorization or an on-site dispatch, and only then moving or towing the vehicle. Each step adds time a first responder on scene may not have.</p>
      </div>

      <svg className="process-route" ref={routeRef} viewBox="0 0 1700 900" preserveAspectRatio="none" aria-hidden="true">
        {Object.entries(SEGMENTS).map(([key, d]) => (
          <path
            key={key}
            className="process-route-line"
            d={d}
            ref={(el) => {
              segRefs.current[key] = el;
            }}
          />
        ))}
        {NODES.map((n) => {
          const [x, y] = byId[n.id];
          return (
            <g key={n.id}>
              <circle
                className="process-pulse-ring"
                cx={x}
                cy={y}
                r={4}
                ref={(el) => {
                  pulseRefs.current[n.id] = el;
                }}
              />
              <circle
                className="process-node-dot"
                cx={x}
                cy={y}
                r={5}
                ref={(el) => {
                  dotRefs.current[n.id] = el;
                }}
              />
            </g>
          );
        })}
      </svg>

      <div className="process-origin" ref={originRef} style={{ left: `${ORIGIN.left}%`, top: `${ORIGIN.top}%` }}>
        <span className="process-origin-dot" aria-hidden="true" />
        <span>INCIDENT SITE</span>
      </div>

      {NODES.map((n) => (
        <div
          className="process-node"
          key={n.id}
          data-align={n.align}
          ref={(el) => {
            nodeRefs.current[n.id] = el;
          }}
          style={{ left: `${n.left}%`, top: `${n.top}%` }}
        >
          <div className="process-node-head">
            <span className="process-node-index">{n.index}</span>
            <span className="process-node-icon">{icons[n.id]}</span>
          </div>
          <h3>{n.title}</h3>
          <p>{n.meta[0]}<br />{n.meta[1]}</p>
        </div>
      ))}

      <div className="process-vehicle" ref={vehicleRef} style={{ left: `${VEHICLE.left}%`, top: `${VEHICLE.top}%` }}>
        <svg viewBox="0 0 48 24" fill="none" aria-hidden="true">
          <path d="M4 18 6 9h13l9 5v4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M4 18h2M35 18h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="11" cy="18.4" r="2.6" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="30" cy="18.4" r="2.6" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span>VEHICLE STALLED</span>
      </div>

      <div className="process-stage-track" aria-hidden="true">
        <span className="process-stage-fill-track">
          <span className="process-stage-fill" ref={fillRef} />
        </span>
        <div className="process-stage-labels">
          {STAGE_LABELS.map((label, index) => (
            <div className="process-stage-item" key={label}>
              <span
                className="process-stage-dot"
                ref={(el) => {
                  dotTrackRefs.current[index] = el;
                }}
              />
              <span
                className="process-stage-label"
                ref={(el) => {
                  labelRefs.current[index] = el;
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
