"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// All coordinates below are percentages of the `.dgs` viewport-pinned container
// (left/top for HTML elements, *10 for the connector SVG's 0-1000 viewBox — see
// `.dgs-lines-svg`, which uses `preserveAspectRatio="none"` so it can fill an
// arbitrary-aspect viewport; only <path> strokes live in that stretched space,
// never circles/dots, to avoid the non-uniform-scale distortion documented for
// response-flow's connectors).
// Kept entirely below the headline's vertical footprint (roughly 24%-50% top) — an earlier
// pass staggered these higher, up into the headline band, which buried "FALLBACK"/"VEHICLE?"
// behind the panels; same class of bug documented for the 02.2 scene's incident labels.
const PROCEDURE = [
  { n: "01", label: "INCIDENT", left: 4, top: 74, icon: "incident" },
  { n: "02", label: "CALL OPERATOR", left: 14, top: 62, icon: "call" },
  { n: "03", label: "VERIFY", left: 24, top: 74, icon: "verify" },
  { n: "04", label: "AUTHORIZE OR DISPATCH", left: 34, top: 62, icon: "auth" },
  { n: "05", label: "MOVE OR TOW", left: 43, top: 70, icon: "tow" },
] as const;

const THRESHOLD: [number, number] = [50, 65];

const NODES = [
  { key: "responder", label: "FIRST RESPONDER", left: 60, top: 58, icon: "responder" },
  { key: "control", label: "LOCAL CONTROL", left: 71, top: 58, icon: "control" },
  { key: "move", label: "MOVE", left: 82, top: 58, icon: "move" },
] as const;

const PROCEDURE_PATH =
  "M40,740 C90,690 90,650 140,620 C180,600 190,700 240,740 C280,690 300,630 340,620 C370,615 400,660 430,700 C450,720 470,680 500,650";
const ROUTE_PATH = "M500,650 C560,620 580,600 600,580 L900,580";

// Deterministic px offsets for the threshold particle burst (no Math.random — avoids
// SSR/hydration mismatch, same reasoning as the hand-authored coordinate arrays elsewhere
// in this deck).
const PARTICLES = [
  [-30, -18], [24, -26], [-14, 20], [32, 14], [-40, 4], [10, -34], [-22, -8], [38, -4],
  [-8, 30], [18, 26], [-34, -30], [4, 36], [26, -14], [-18, 10],
] as const;

function refreshScrollTrigger() {
  const run = () => ScrollTrigger.refresh();
  if (document.readyState === "complete") {
    requestAnimationFrame(run);
  } else {
    window.addEventListener("load", run, { once: true });
  }
}

function PanelIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "incident":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M8 2 L15 14 H1 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="8" y1="6.5" x2="8" y2="10" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="12" r=".9" fill="currentColor" />
        </svg>
      );
    case "call":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M2 9c1-2.2 2.4-2.2 3-1l1 2c.4.8-.2 1.4-.8 1.9 1 2 2 3 4 4 .5-.6 1.1-1.2 1.9-.8l2 1c1.2.6 1.2 2 -1 3-3 1-8-3-10-6-.8-1.2-1.1-3-.1-4.1Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      );
    case "verify":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M2 4V2h4M14 4V2h-4M2 12v2h4M14 12v2h-4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M4.5 8.5 7 11l4.5-5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "auth":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <rect x="3.5" y="7" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="8" cy="10.5" r=".9" fill="currentColor" />
        </svg>
      );
    case "tow":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
          <path d="M2 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "responder":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M4 9.5c0-3 1.8-4.8 4-4.8s4 1.8 4 4.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="2.5" y1="9.5" x2="13.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="8" y1="9.5" x2="8" y2="4.3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "control":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="8" cy="8" r="1.1" fill="currentColor" />
          <line x1="8" y1="1.5" x2="8" y2="5" stroke="currentColor" strokeWidth="1" />
          <line x1="8" y1="11" x2="8" y2="14.5" stroke="currentColor" strokeWidth="1" />
          <line x1="1.5" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="11" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case "move":
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <line x1="2" y1="8" x2="12.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.5 4.5 13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DesignGapScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | SVGElement | null>>({});
  const setRef = (key: string) => (el: HTMLElement | SVGElement | null) => {
    refs.current[key] = el;
  };

  useEffect(() => {
    const r = refs.current;
    const panels = PROCEDURE.map((p) => r[`panel-${p.n}`]);
    const panelDots = PROCEDURE.map((p) => r[`panel-dot-${p.n}`]);
    const nodes = NODES.map((n) => r[`node-${n.key}`]);
    const particles = PARTICLES.map((_, i) => r[`particle-${i}`]);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(panels, { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" });
      gsap.set(panelDots, { opacity: 1, scale: 1 });
      gsap.set(r.procedurePath as SVGPathElement, { strokeDashoffset: 0 });
      gsap.set(r.routePath as SVGPathElement, { strokeDashoffset: 0 });
      gsap.set(particles, { opacity: 0 });
      gsap.set(r.thresholdGlow as HTMLElement, { opacity: 1 });
      gsap.set(nodes, { opacity: 1, scale: 1 });
      gsap.set(r.taillight as HTMLElement, { opacity: 1 });
      gsap.set(r.robotaxi as HTMLElement, { x: 14 });
      gsap.set([r.sideLabelLeft, r.sideLabelRight, r.headline, r.dependencies], { opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 761px)", () => {
      const context = gsap.context(() => {
        gsap.set(panels, { opacity: 0, scale: 1, filter: "blur(0px)" });
        gsap.set(panelDots, { opacity: 0, scale: 0.4, transformOrigin: "center" });
        gsap.set(r.procedurePath as SVGPathElement, { strokeDashoffset: 1000 });
        gsap.set(r.routePath as SVGPathElement, { strokeDashoffset: 1000 });
        gsap.set(particles, { opacity: 0, x: 0, y: 0, scale: 0.5 });
        gsap.set(r.thresholdGlow as HTMLElement, { opacity: 0.15 });
        gsap.set(nodes, { opacity: 0, scale: 0.7, transformOrigin: "center" });
        gsap.set(r.taillight as HTMLElement, { opacity: 0 });
        gsap.set(r.robotaxi as HTMLElement, { x: 0 });
        gsap.set([r.sideLabelLeft, r.sideLabelRight, r.headline, r.dependencies], { opacity: 0 });

        // Built paused and driven manually via ScrollTrigger's onUpdate below — see the matching
        // comment in response-scene.tsx for why `gsap.timeline({ scrollTrigger: {...} })` isn't
        // used directly (it leaves `ScrollTrigger.start` stuck at 0 in this project's gsap
        // 3.15.0 install; a plain `ScrollTrigger.create()` with no `animation` tied to a Timeline
        // computes correctly, so progress is driven by hand instead).
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

        // Entry — headline, side labels, dependency row.
        tl.to([r.sideLabelLeft, r.sideLabelRight, r.headline, r.dependencies], { opacity: 1, duration: 0.04 }, 0);

        // Left procedure panels reveal sequentially, the red signal line drawing between them.
        tl.to(r.procedurePath as SVGPathElement, { strokeDashoffset: 0, duration: 0.24, ease: "power1.inOut" }, 0.03);
        PROCEDURE.forEach((_, i) => {
          const at = 0.05 + i * 0.045;
          tl.to(panelDots[i] as HTMLElement, { opacity: 1, scale: 1, duration: 0.02 }, at);
          tl.to(panels[i] as HTMLElement, { opacity: 1, duration: 0.03 }, at + 0.005);
        });

        // Brief hold, then the "whoosh": panels accelerate toward the threshold, compressing,
        // blurring, and dissolving — staggered fastest-last so the chain visibly collapses.
        tl.to(panels as HTMLElement[], {
          // `left`/`top` are percentages of a full-viewport container, so a percentage-point
          // difference maps 1:1 to vw/vh — using those units (rather than a fixed px
          // multiplier) keeps the whoosh landing at the threshold regardless of viewport size.
          x: (i) => `${THRESHOLD[0] - PROCEDURE[i].left}vw`,
          y: (i) => `${THRESHOLD[1] - PROCEDURE[i].top}vh`,
          scale: 0.35,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.1,
          stagger: 0.015,
          ease: "power2.in",
        }, 0.32);
        tl.to(panelDots as HTMLElement[], { opacity: 0, duration: 0.06 }, 0.34);
        tl.to(r.procedurePath as SVGPathElement, { opacity: 0, duration: 0.06 }, 0.36);

        // Particles burst at the threshold as the panels dissolve into it.
        tl.to(r.thresholdGlow as HTMLElement, { opacity: 1, duration: 0.08 }, 0.4);
        tl.to(particles as HTMLElement[], {
          opacity: 1,
          x: (i) => PARTICLES[i][0] * 0.4,
          y: (i) => PARTICLES[i][1] * 0.4,
          scale: 1,
          duration: 0.06,
          stagger: 0.006,
        }, 0.4);
        // Particles pass through the threshold, reorganizing rightward into the clean line.
        tl.to(particles as HTMLElement[], {
          x: (i) => 140 + PARTICLES[i][0] * 0.15,
          y: (i) => PARTICLES[i][1] * 0.1,
          opacity: 0,
          scale: 0.6,
          duration: 0.14,
          stagger: 0.008,
          ease: "power1.in",
        }, 0.48);

        // The reorganized signal draws in as one clean red line on the right.
        tl.to(r.routePath as SVGPathElement, { strokeDashoffset: 0, duration: 0.18, ease: "power1.inOut" }, 0.52);
        tl.to(r.thresholdGlow as HTMLElement, { opacity: 0.2, duration: 0.1 }, 0.62);

        // Simplified path reveals sequentially: first responder -> local control -> move.
        NODES.forEach((_, i) => {
          const at = 0.66 + i * 0.08;
          tl.to(nodes[i] as HTMLElement, { opacity: 1, scale: 1, duration: 0.05, ease: "back.out(2)" }, at);
        });

        // The taillight activates and the vehicle shifts slightly forward.
        tl.to(r.taillight as HTMLElement, { opacity: 1, duration: 0.06 }, 0.9);
        tl.to(r.robotaxi as HTMLElement, { x: 14, duration: 0.08, ease: "power2.out" }, 0.9);

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => tl.progress(self.progress),
        });
      }, rootRef);

      return () => context.revert();
    });

    mm.add("(max-width: 760px)", () => {
      const context = gsap.context(() => {
        gsap.set(panels, { opacity: 0, y: 16 });
        gsap.set(panelDots, { opacity: 1, scale: 1 });
        gsap.set(r.procedurePath as SVGPathElement, { opacity: 0 });
        gsap.set(r.routePath as SVGPathElement, { opacity: 0 });
        gsap.set(particles, { opacity: 0 });
        gsap.set(r.thresholdGlow as HTMLElement, { opacity: 0 });
        gsap.set(nodes, { opacity: 0, y: 16 });
        gsap.set(r.taillight as HTMLElement, { opacity: 0 });
        gsap.set(r.robotaxi as HTMLElement, { x: 0 });
        gsap.set([r.sideLabelLeft, r.sideLabelRight, r.headline, r.dependencies], { opacity: 0, y: 10 });

        // Paused + played from a plain ScrollTrigger's onEnter — see the desktop branch above
        // for why the timeline isn't wired via `scrollTrigger:{...}` directly.
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

        tl.to([r.sideLabelLeft, r.sideLabelRight, r.headline], { opacity: 1, y: 0, duration: 0.4 })
          .to(panels as HTMLElement[], { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 }, "-=0.15")
          .to(nodes as HTMLElement[], { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, "-=0.1")
          .to(r.taillight as HTMLElement, { opacity: 1, duration: 0.3 }, "-=0.1")
          .to(r.robotaxi as HTMLElement, { x: 8, duration: 0.3 }, "<")
          .to(r.dependencies as HTMLElement, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");

        ScrollTrigger.create({ trigger: rootRef.current, start: "top 78%", onEnter: () => tl.play() });
      }, rootRef);

      return () => context.revert();
    });

    refreshScrollTrigger();

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="dgs">
      <img className="dgs-bg" src="/media/halogrip/design-gap/design-gap-background.png" alt="" aria-hidden="true" />
      <div className="dgs-scrim" aria-hidden="true" />

      <svg className="dgs-lines-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <path ref={setRef("procedurePath")} d={PROCEDURE_PATH} className="dgs-route" pathLength={1000} vectorEffect="non-scaling-stroke" />
        <path ref={setRef("routePath")} d={ROUTE_PATH} className="dgs-route" pathLength={1000} vectorEffect="non-scaling-stroke" />
      </svg>

      <div ref={setRef("thresholdGlow")} className="dgs-threshold" style={{ left: `${THRESHOLD[0]}%`, top: `${THRESHOLD[1]}%` }} aria-hidden="true" />

      <div className="dgs-particles" aria-hidden="true">
        {PARTICLES.map((_, i) => (
          <span
            key={i}
            ref={setRef(`particle-${i}`)}
            className="dgs-particle"
            style={{ left: `${THRESHOLD[0]}%`, top: `${THRESHOLD[1]}%` }}
          />
        ))}
      </div>

      <img ref={setRef("responder")} className="dgs-responder" src="/media/halogrip/shared/first-responder.png" alt="First responder viewed from behind, holding a tablet" />

      <div className="dgs-procedure" aria-hidden="false">
        {PROCEDURE.map((p) => (
          <div
            key={p.n}
            ref={setRef(`panel-${p.n}`)}
            className="dgs-panel"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          >
            <span className="dgs-panel-icon"><PanelIcon kind={p.icon} /></span>
            <span className="dgs-panel-n">{p.n}</span>
            <span className="dgs-panel-label">{p.label}</span>
          </div>
        ))}
        {PROCEDURE.map((p) => (
          <span
            key={`dot-${p.n}`}
            ref={setRef(`panel-dot-${p.n}`)}
            className="dgs-panel-dot"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="dgs-nodes">
        {NODES.map((n) => (
          <div key={n.key} ref={setRef(`node-${n.key}`)} className="dgs-node" style={{ left: `${n.left}%`, top: `${n.top}%` }}>
            <span className="dgs-node-icon"><PanelIcon kind={n.icon} /></span>
            <span className="dgs-node-label">{n.label}</span>
          </div>
        ))}
      </div>

      <div className="dgs-robotaxi-wrap">
        <img ref={setRef("robotaxi")} className="dgs-robotaxi" src="/media/halogrip/shared/robotaxi.png" alt="Robotaxi, rear three-quarter view" />
        <span ref={setRef("taillight")} className="dgs-taillight" aria-hidden="true" />
      </div>

      <span ref={setRef("sideLabelLeft")} className="dgs-side-label dgs-side-label-left">EXTERNAL DEPENDENCY</span>
      <span ref={setRef("sideLabelRight")} className="dgs-side-label dgs-side-label-right">LOCAL CONTROL</span>

      <div ref={setRef("headline")} className="dgs-text shell">
        <span className="eyebrow">[ 02.4 / DESIGN GAP ]</span>
        <h2 id="design-gap-title">WHAT IF FALLBACK LIVED INSIDE THE VEHICLE?</h2>
      </div>

      <p ref={setRef("dependencies")} className="dgs-dependencies">
        PERSONNEL <span>&middot;</span> CONNECTIVITY <span>&middot;</span> TRAINING <span>&middot;</span> TIME
      </p>
    </div>
  );
}
