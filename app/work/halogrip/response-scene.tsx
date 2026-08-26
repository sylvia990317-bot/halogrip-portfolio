"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Coordinates below are percentages of the `.rsc` viewport-pinned container (left/top for HTML
// elements, *10 for the route SVG's 0-1000 viewBox — same convention as design-gap-scene.tsx's
// `.dgs-lines-svg`, which uses `preserveAspectRatio="none"` so it can fill an arbitrary-aspect
// viewport; only <path> strokes live in that stretched space, dots/leaders are plain HTML so
// they never suffer the non-uniform-scale distortion documented for response-flow's connectors).
// The route runs along the street from the first responder (bottom-left) toward the stalled
// robotaxi (right, mid-ground) — 01/02/03 track the approach, then it forks for 04A/04B and
// reconnects just before the vehicle, where the "05" targeting frame sits.
const LABELS = [
  { n: "01", text: "INCIDENT DETECTED", left: 6, top: 62, dot: [16, 76] },
  { n: "02", text: "CALL OPERATOR", left: 20, top: 50, dot: [30, 68] },
  { n: "03", text: "VERIFY IDENTITY", left: 34, top: 40, dot: [50, 54] },
  { n: "04A", text: "REMOTE AUTHORIZATION", left: 44, top: 22, dot: [58, 38] },
  { n: "04B", text: "ON-SITE DISPATCH", left: 44, top: 78, dot: [58, 68] },
  { n: "05", text: "MOVE OR TOW", left: 78, top: 30, dot: [74, 50] },
] as const;

const MAIN_PATH = "M160,760 C220,720 260,700 300,680 C340,660 380,630 440,600 C460,590 480,570 500,540";
const BRANCH_UPPER = "M500,540 C540,480 560,420 580,380 C600,360 620,380 660,520";
const BRANCH_LOWER = "M500,540 C540,600 560,660 580,680 C600,700 620,680 660,520";
const FINAL_PATH = "M660,520 C680,540 700,550 740,560";

const BRACKET = { left: 62, top: 34, w: 26, h: 40 };
const STAT_POS = { left: 63, top: 76 };

function refreshScrollTrigger() {
  const run = () => ScrollTrigger.refresh();
  if (document.readyState === "complete") {
    requestAnimationFrame(run);
  } else {
    window.addEventListener("load", run, { once: true });
  }
}

export default function ResponseScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLElement | SVGElement | null>>({});
  const setRef = (key: string) => (el: HTMLElement | SVGElement | null) => {
    refs.current[key] = el;
  };

  useEffect(() => {
    const r = refs.current;
    const paths = [r.pathMain, r.branchUpper, r.branchLower, r.pathFinal] as unknown as SVGPathElement[];
    const dots = LABELS.map((l) => r[`dot-${l.n}`]);
    const labelEls = LABELS.map((l) => r[`label-${l.n}`]);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(paths, { strokeDashoffset: 0 });
      gsap.set([r.bracket, r.stat, ...dots, ...labelEls], { opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    (window as any).ScrollTrigger = ScrollTrigger;
    (window as any).gsap = gsap;

    const context = gsap.context(() => {
      gsap.set(paths, { strokeDashoffset: 1000 });
      gsap.set([r.bracket, r.stat], { opacity: 0 });
      gsap.set(dots, { opacity: 0, scale: 0.4, transformOrigin: "center" });
      gsap.set(labelEls, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const step = (n: string) => [r[`label-${n}`], r[`dot-${n}`]];

      tl.to(r.pathMain as SVGPathElement, { strokeDashoffset: 0, duration: 0.26 }, 0)
        .to(step("01"), { opacity: 1, duration: 0.04 }, 0.02)
        .to(step("02"), { opacity: 1, duration: 0.04 }, 0.13)
        .to(step("03"), { opacity: 1, duration: 0.04 }, 0.24)
        // Pause at Verify — bracket + central stat settle in before the route forks.
        .to([r.bracket, r.stat], { opacity: 1, duration: 0.08 }, 0.3)
        .to(r.branchUpper as SVGPathElement, { strokeDashoffset: 0, duration: 0.22 }, 0.42)
        .to(step("04A"), { opacity: 1, duration: 0.04 }, 0.59)
        .to(r.branchLower as SVGPathElement, { strokeDashoffset: 0, duration: 0.22 }, 0.66)
        .to(step("04B"), { opacity: 1, duration: 0.04 }, 0.83)
        .to(r.pathFinal as SVGPathElement, { strokeDashoffset: 0, duration: 0.1 }, 0.88)
        .to(step("05"), { opacity: 1, duration: 0.05 }, 0.95);
    }, rootRef);

    refreshScrollTrigger();

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="rsc">
      <img className="rsc-bg" src="/media/halogrip/response/current-response-background.png" alt="" aria-hidden="true" />
      <div className="rsc-scrim" aria-hidden="true" />

      <svg className="rsc-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <path ref={setRef("pathMain")} d={MAIN_PATH} className="rsc-route" pathLength={1000} vectorEffect="non-scaling-stroke" />
        <path ref={setRef("branchUpper")} d={BRANCH_UPPER} className="rsc-route rsc-route-branch" pathLength={1000} vectorEffect="non-scaling-stroke" />
        <path ref={setRef("branchLower")} d={BRANCH_LOWER} className="rsc-route rsc-route-branch" pathLength={1000} vectorEffect="non-scaling-stroke" />
        <path ref={setRef("pathFinal")} d={FINAL_PATH} className="rsc-route" pathLength={1000} vectorEffect="non-scaling-stroke" />
      </svg>

      <img className="rsc-responder" src="/media/halogrip/shared/first-responder.png" alt="First responder viewed from behind, holding a tablet" />

      <div className="rsc-robotaxi-wrap">
        <img className="rsc-robotaxi" src="/media/halogrip/shared/robotaxi.png" alt="Robotaxi, rear three-quarter view, stalled on the street" />
        <span className="rsc-taillight" aria-hidden="true" />
      </div>

      <div
        ref={setRef("bracket")}
        className="rsc-bracket"
        style={{ left: `${BRACKET.left}%`, top: `${BRACKET.top}%`, width: `${BRACKET.w}%`, height: `${BRACKET.h}%` }}
        aria-hidden="true"
      >
        <span className="rsc-corner rsc-corner-tl" />
        <span className="rsc-corner rsc-corner-tr" />
        <span className="rsc-corner rsc-corner-br" />
        <span className="rsc-corner rsc-corner-bl" />
      </div>

      <div className="rsc-text shell">
        <span className="eyebrow">[ 02.3 / CURRENT RESPONSE ]</span>
        <h2 id="current-response-title">
          HELP EXISTS.
          <br />
          BUT IT IS NOT IMMEDIATE.
        </h2>
      </div>

      <div className="rsc-labels">
        {LABELS.map((l) => (
          <div key={l.n} ref={setRef(`label-${l.n}`)} className="rsc-label" style={{ left: `${l.left}%`, top: `${l.top}%` }}>
            <span>{l.n}</span>
            {l.text}
          </div>
        ))}
        {LABELS.map((l) => (
          <span
            key={`dot-${l.n}`}
            ref={setRef(`dot-${l.n}`)}
            className="rsc-dot"
            style={{ left: `${l.dot[0]}%`, top: `${l.dot[1]}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div ref={setRef("stat")} className="rsc-stat" style={{ left: `${STAT_POS.left}%`, top: `${STAT_POS.top}%` }}>
        <strong>05</strong>
        <p>
          STEPS BEFORE A STALLED
          <br />
          VEHICLE CAN BE MOVED
        </p>
      </div>

      <p className="rsc-source">01 — CURRENT RESPONSE WORKFLOW.</p>
    </div>
  );
}
