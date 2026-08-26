"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Native pixel dimensions of /media/response-background.png — the SVG overlay uses this
// as its viewBox so `preserveAspectRatio="xMidYMid slice"` crops identically to the <img>'s
// `object-fit:cover`, and the HTML label layer (positioned via useCoverMap below) lines up
// with both at any viewport size.
const IMG_W = 1672;
const IMG_H = 941;

const STATION: [number, number] = [190, 470];
const CAR_L: [number, number] = [742, 515];
const CAR_R: [number, number] = [918, 522];
const CONVERGE: [number, number] = [1460, 500];
const TERMINUS: [number, number] = [1560, 480];

const PATH_A = `M${STATION[0]},${STATION[1]} C350,455 520,505 650,505 C690,507 715,510 ${CAR_L[0]},${CAR_L[1]}`;
const BRANCH_UPPER = `M${CAR_R[0]},${CAR_R[1]} C1050,430 1200,390 1330,405 C1380,412 1430,440 ${CONVERGE[0]},${CONVERGE[1]}`;
const BRANCH_LOWER = `M${CAR_R[0]},${CAR_R[1]} C1050,615 1200,655 1330,635 C1380,628 1430,560 ${CONVERGE[0]},${CONVERGE[1]}`;
const PATH_FINAL = `M${CONVERGE[0]},${CONVERGE[1]} C1500,492 1530,486 ${TERMINUS[0]},${TERMINUS[1]}`;

const BRACKET = { x: 700, y: 452, w: 260, h: 140 };
const STAT_ANCHOR: [number, number] = [762, 610];

const labels = [
  { key: "01", text: "INCIDENT DETECTED", x: 108, y: 402, leader: "M150,406 L150,428 L200,466", target: [200, 466] as [number, number] },
  { key: "02", text: "CALL OPERATOR", x: 392, y: 402, leader: "M432,406 L432,428 L470,494", target: [470, 494] as [number, number] },
  { key: "03", text: "VERIFY IDENTITY", x: 592, y: 402, leader: "M630,406 L630,430 L672,507", target: [672, 507] as [number, number] },
  { key: "04a", text: "REMOTE AUTHORIZATION", x: 1136, y: 286, leader: "M1250,318 L1250,362 L1330,405", target: [1330, 405] as [number, number] },
  { key: "04b", text: "ON-SITE DISPATCH", x: 1136, y: 706, leader: "M1250,700 L1250,656 L1330,635", target: [1330, 635] as [number, number] },
  { key: "05", text: "MOVE OR TOW", x: 1462, y: 358, leader: `M1520,388 L1520,422 L${TERMINUS[0]},${TERMINUS[1]}`, target: TERMINUS },
] as const;

function useCoverMap(ref: React.RefObject<HTMLElement | null>) {
  const [map, setMap] = useState({ x0: 0, y0: 0, visW: IMG_W, visH: IMG_H });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const containerRatio = w / h;
      const imgRatio = IMG_W / IMG_H;
      let visW: number;
      let visH: number;
      if (containerRatio > imgRatio) {
        visW = IMG_W;
        visH = IMG_W / containerRatio;
      } else {
        visH = IMG_H;
        visW = IMG_H * containerRatio;
      }
      setMap({ x0: (IMG_W - visW) / 2, y0: (IMG_H - visH) / 2, visW, visH });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return map;
}

export default function ResponseScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const map = useCoverMap(rootRef);
  const refs = useRef<Record<string, SVGElement | HTMLElement | null>>({});
  const setRef = (key: string) => (el: SVGElement | HTMLElement | null) => {
    refs.current[key] = el;
  };

  const toPct = (px: number, py: number) => ({
    left: `${(((px - map.x0) / map.visW) * 100).toFixed(2)}%`,
    top: `${(((py - map.y0) / map.visH) * 100).toFixed(2)}%`,
  });

  useEffect(() => {
    const r = refs.current;
    const paths = [r.pathA, r.branchUpper, r.branchLower, r.pathFinal] as unknown as SVGPathElement[];
    const dots = [r.dot01, r.dot02, r.dot03, r.dotUpper, r.dotLower, r.dotTerminus];
    const leaders = labels.map((l) => r[`leader-${l.key}`]);
    const labelEls = labels.map((l) => r[`label-${l.key}`]);
    const step = (key: string) => [r[`label-${key}`], r[`leader-${key}`]];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(paths, { strokeDashoffset: 0 });
      gsap.set([r.bracket, r.stat, ...dots], { opacity: 1 });
      gsap.set([...leaders, ...labelEls], { opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.set(paths, { strokeDashoffset: 1000 });
      gsap.set([r.bracket, r.stat], { opacity: 0 });
      gsap.set(dots, { opacity: 0, scale: 0.4, transformOrigin: "center" });
      gsap.set([...leaders, ...labelEls], { opacity: 0 });

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

      tl.to(r.pathA as SVGPathElement, { strokeDashoffset: 0, duration: 0.26 }, 0)
        .to(r.dot01 as SVGElement, { opacity: 1, scale: 1, duration: 0.03 }, 0.0)
        .to(step("01"), { opacity: 1, duration: 0.04 }, 0.02)
        .to(r.dot02 as SVGElement, { opacity: 1, scale: 1, duration: 0.03 }, 0.12)
        .to(step("02"), { opacity: 1, duration: 0.04 }, 0.13)
        .to(r.dot03 as SVGElement, { opacity: 1, scale: 1, duration: 0.03 }, 0.23)
        .to(step("03"), { opacity: 1, duration: 0.04 }, 0.24)
        // Pause at Verify — bracket + central stat settle in before the route forks.
        .to([r.bracket, r.stat], { opacity: 1, duration: 0.08 }, 0.3)
        .to(r.branchUpper as SVGPathElement, { strokeDashoffset: 0, duration: 0.22 }, 0.42)
        .to(r.dotUpper as SVGElement, { opacity: 1, scale: 1, duration: 0.03 }, 0.58)
        .to(step("04a"), { opacity: 1, duration: 0.04 }, 0.59)
        .to(r.branchLower as SVGPathElement, { strokeDashoffset: 0, duration: 0.22 }, 0.66)
        .to(r.dotLower as SVGElement, { opacity: 1, scale: 1, duration: 0.03 }, 0.82)
        .to(step("04b"), { opacity: 1, duration: 0.04 }, 0.83)
        .to(r.pathFinal as SVGPathElement, { strokeDashoffset: 0, duration: 0.1 }, 0.88)
        .to(r.dotTerminus as SVGElement, { opacity: 1, scale: 1, duration: 0.04 }, 0.94)
        .to(step("05"), { opacity: 1, duration: 0.05 }, 0.95);
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="rsc">
      <img className="rsc-bg" src="/media/response-background.png" alt="Aerial night view of a fire station, a stalled robotaxi, and an active fire scene" />
      <div className="rsc-vignette" aria-hidden="true" />

      <svg className="rsc-svg" viewBox={`0 0 ${IMG_W} ${IMG_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path ref={setRef("pathA")} d={PATH_A} className="rsc-route" pathLength={1000} />
        <path ref={setRef("branchUpper")} d={BRANCH_UPPER} className="rsc-route rsc-route-branch" pathLength={1000} />
        <path ref={setRef("branchLower")} d={BRANCH_LOWER} className="rsc-route rsc-route-branch" pathLength={1000} />
        <path ref={setRef("pathFinal")} d={PATH_FINAL} className="rsc-route" pathLength={1000} />

        <g ref={setRef("bracket")} className="rsc-bracket">
          <path d={`M${BRACKET.x},${BRACKET.y + 34} L${BRACKET.x},${BRACKET.y} L${BRACKET.x + 34},${BRACKET.y}`} />
          <path d={`M${BRACKET.x + BRACKET.w - 34},${BRACKET.y} L${BRACKET.x + BRACKET.w},${BRACKET.y} L${BRACKET.x + BRACKET.w},${BRACKET.y + 34}`} />
          <path
            d={`M${BRACKET.x + BRACKET.w},${BRACKET.y + BRACKET.h - 34} L${BRACKET.x + BRACKET.w},${BRACKET.y + BRACKET.h} L${BRACKET.x + BRACKET.w - 34},${BRACKET.y + BRACKET.h}`}
          />
          <path d={`M${BRACKET.x + 34},${BRACKET.y + BRACKET.h} L${BRACKET.x},${BRACKET.y + BRACKET.h} L${BRACKET.x},${BRACKET.y + BRACKET.h - 34}`} />
        </g>

        <circle ref={setRef("dot01")} cx={labels[0].target[0]} cy={labels[0].target[1]} r="5" className="rsc-dot" />
        <circle ref={setRef("dot02")} cx={labels[1].target[0]} cy={labels[1].target[1]} r="5" className="rsc-dot" />
        <circle ref={setRef("dot03")} cx={labels[2].target[0]} cy={labels[2].target[1]} r="5" className="rsc-dot" />
        <circle ref={setRef("dotUpper")} cx={labels[3].target[0]} cy={labels[3].target[1]} r="5" className="rsc-dot" />
        <circle ref={setRef("dotLower")} cx={labels[4].target[0]} cy={labels[4].target[1]} r="5" className="rsc-dot" />
        <circle ref={setRef("dotTerminus")} cx={labels[5].target[0]} cy={labels[5].target[1]} r="5" className="rsc-dot" />

        <g className="rsc-leaders">
          {labels.map((l) => (
            <path key={l.key} ref={setRef(`leader-${l.key}`)} d={l.leader} className="rsc-leader" />
          ))}
        </g>
      </svg>

      <div className="rsc-text shell">
        <span className="eyebrow">[ 02.3 / CURRENT RESPONSE ]</span>
        <h2 id="current-response-title">
          HELP EXISTS.
          <br />
          BUT IT IS NOT IMMEDIATE.
        </h2>
      </div>

      <div className="rsc-labels">
        {labels.map((l) => (
          <div key={l.key} ref={setRef(`label-${l.key}`)} className="rsc-label" style={toPct(l.x, l.y)}>
            <span>{l.key.toUpperCase()}</span>
            {l.text}
          </div>
        ))}
      </div>

      <div ref={setRef("stat")} className="rsc-stat" style={toPct(STAT_ANCHOR[0], STAT_ANCHOR[1])}>
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
