"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onPinsReady } from "./pin-coordinator";

/**
 * 02.2 / REAL-WORLD NEED. The route line draws itself in every time the section scrolls into
 * view, and every other element on the poster (the three annotations, the frame around the
 * stalled vehicle, the "74" stat, RESPONSE ORIGIN) fades in synced to how far the line has
 * drawn toward that element's own position — not a fixed stagger. Unlike ./section-reveal.tsx's
 * one-shot fade, this replays on every entry (scrolling down in, or back up into it) rather
 * than only the first time: the section is a static "poster" (percentage/vw-positioned so it
 * scales as one image at any width — see halogrip.css's .need-scene history) and should still
 * read as one, just one that draws itself in each time it's seen.
 *
 * .need-route/.need-route-glow already carry their own stroke-dasharray for visual styling
 * (a dashed line + a blurred glow), so animating their own stroke-dashoffset for a draw-in
 * would fight that pattern. Instead an invisible solid copy of the same path
 * (#need-route-reveal-path) drives a <mask> that reveals the two real paths underneath as
 * its own dashoffset counts down from the path's full length to 0.
 *
 * Unlike ./section-reveal.tsx, this one replays every time the section re-enters the
 * viewport (scrolling down into it or back up into it), not just the first time — restarting
 * the same timeline from 0 on each entry.
 *
 * The route's own coordinates run straight through the frame box (x745-960 at y500, inside
 * the frame's y435-670 span). Rather than bending the path around it, a second static mask
 * (#need-frame-cutout) cuts a hole over the frame's own rect so the line simply stops before
 * the box and resumes after it — reading as passing behind the box, not through it — while
 * every fraction-of-length calculation below still runs against the path's real, unbent
 * geometry.
 */

const ROUTE_D =
  "M255,500 L300,500 L420,500 L468,528 L545,528 L592,528 L630,500 L745,500 L960,500 L1042,500 L1075,478 L1175,478 L1215,478 L1255,505 L1330,545 L1420,545 L1470,530 L1560,502";

export default function NeedScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const revealPath = revealPathRef.current;
    if (!section || !revealPath) return;

    const annotations = Array.from(section.querySelectorAll<HTMLElement>(".need-annotation"));
    const leaders = Array.from(section.querySelectorAll<SVGElement>(".need-leader, .need-leader-dot"));
    const frameParts = Array.from(
      section.querySelectorAll<SVGElement>(".need-frame-fill, .need-frame-outline, .need-frame-corner")
    );
    const statParts = Array.from(section.querySelectorAll<HTMLElement>(".need-stat-number, .need-stat-caption"));
    const origin = section.querySelector<HTMLElement>(".need-origin");
    const sourceParts = Array.from(section.querySelectorAll<HTMLElement>(".need-source-mark, .need-source"));

    const length = revealPath.getTotalLength();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(revealPath, { strokeDasharray: length, strokeDashoffset: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Samples the path to find what fraction of its total length the draw-in has reached
    // by the time it passes closest to (targetX, targetY) — so timing always matches the
    // actual path geometry instead of duplicating hand-picked percentages here.
    const SAMPLES = 400;
    function fractionAt(targetX: number, targetY: number) {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i <= SAMPLES; i++) {
        const len = (i / SAMPLES) * length;
        const pt = revealPath!.getPointAtLength(len);
        const dist = (pt.x - targetX) ** 2 + (pt.y - targetY) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = len;
        }
      }
      return best / length;
    }

    const fDot01 = fractionAt(627, 500);
    const fFrame = fractionAt(745, 500); // the path's own vertex at the frame's left edge
    const fDot02 = fractionAt(1063, 500);
    const fDot03 = fractionAt(1320, 545);

    let context: gsap.Context | undefined;
    const unsubscribe = onPinsReady(["scroll-intro"], () => {
      context = gsap.context(() => {
        gsap.set(revealPath, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set([...annotations, ...statParts, ...(origin ? [origin] : []), ...sourceParts], {
          opacity: 0,
          y: 6,
        });
        gsap.set([...leaders, ...frameParts], { opacity: 0 });

        const DURATION = 1.6;
        const tl = gsap.timeline({ paused: true });
        tl.to(revealPath, { strokeDashoffset: 0, duration: DURATION, ease: "power1.inOut" }, 0);

        if (annotations[0]) {
          tl.to([annotations[0], leaders[0], leaders[1]], { opacity: 1, y: 0, duration: 0.3 }, fDot01 * DURATION);
        }
        tl.to(frameParts, { opacity: 1, duration: 0.35 }, fFrame * DURATION);
        tl.to(statParts, { opacity: 1, y: 0, duration: 0.35 }, fFrame * DURATION + 0.15);
        if (annotations[1]) {
          tl.to([annotations[1], leaders[2], leaders[3]], { opacity: 1, y: 0, duration: 0.3 }, fDot02 * DURATION);
        }
        if (annotations[2]) {
          tl.to([annotations[2], leaders[4], leaders[5]], { opacity: 1, y: 0, duration: 0.3 }, fDot03 * DURATION);
        }
        if (origin) tl.to(origin, { opacity: 1, y: 0, duration: 0.35 }, DURATION);
        tl.to(sourceParts, { opacity: 1, y: 0, duration: 0.35 }, DURATION);

        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
        });
      }, section);
    });

    return () => {
      unsubscribe();
      context?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="need-scene dark-section" aria-labelledby="challenge-need-title">
      <div
        className="need-bg"
        style={{ backgroundImage: `url(${encodeURI("/media/halogrip图片/2.2/2.2 background.png")})` }}
      />
      <div className="need-scrim" />
      <div className="need-fade-top" />

      <span className="eyebrow need-marker">[ 02.2 / REAL-WORLD NEED ]</span>

      {/* TODO(sylvia): verify/cite the "74" AV-related-disruptions stat source */}
      <h2 id="challenge-need-title" className="need-heading">THE NEED TO MOVE<br />THE VEHICLE REMAINS.</h2>

      <svg className="need-graphic" viewBox="0 0 1672 941" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="need-hatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--red)" strokeWidth="1" opacity=".35" />
          </pattern>
          <mask id="need-route-reveal">
            <path
              ref={revealPathRef}
              d={ROUTE_D}
              fill="none"
              stroke="#fff"
              strokeWidth={22}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
          <mask id="need-frame-cutout">
            <rect x="0" y="0" width="1672" height="941" fill="#fff" />
            <rect x="725" y="415" width="255" height="275" fill="#000" />
          </mask>
        </defs>

        <g mask="url(#need-frame-cutout)">
          <g mask="url(#need-route-reveal)">
            <path className="need-route-glow" d={ROUTE_D} />
            <path className="need-route" d={ROUTE_D} />
          </g>
        </g>

        <line className="need-leader" x1="700" y1="358" x2="627" y2="500" />
        <circle className="need-leader-dot" cx="627" cy="500" r="3" />
        <line className="need-leader" x1="1115" y1="432" x2="1063" y2="500" />
        <circle className="need-leader-dot" cx="1063" cy="500" r="3" />
        <line className="need-leader" x1="1210" y1="600" x2="1320" y2="545" />
        <circle className="need-leader-dot" cx="1320" cy="545" r="3" />

        <rect className="need-frame-fill" x="745" y="435" width="215" height="235" />
        <rect className="need-frame-outline" x="745" y="435" width="215" height="235" />
        <path className="need-frame-corner" d="M739,451 L739,429 L757,429" />
        <path className="need-frame-corner" d="M948,429 L966,429 L966,447" />
        <path className="need-frame-corner" d="M739,658 L739,676 L757,676" />
        <path className="need-frame-corner" d="M948,676 L966,676 L966,658" />
      </svg>

      <div className="need-annotation" style={{ left: "41.87%", top: "34.54%" }}>
        <span className="need-annotation-index">01</span>
        <span className="need-annotation-label">BLOCKED ROADS</span>
      </div>
      <div className="need-annotation" style={{ left: "66.69%", top: "41.23%" }}>
        <span className="need-annotation-index">02</span>
        <span className="need-annotation-label">BLOCKED FIRE<br />STATION EXITS</span>
      </div>
      <div className="need-annotation" style={{ left: "71.65%", top: "63.76%" }}>
        <span className="need-annotation-index">03</span>
        <span className="need-annotation-label">DISRUPTED<br />FIREFIGHTING</span>
      </div>

      <span className="need-stat-number" style={{ left: "46.2%", top: "59.7%" }}>74</span>
      <p className="need-stat-caption" style={{ left: "44.56%", top: "73.32%" }}>
        AV-related disruptions to<br />emergency response in<br />San Francisco, Nov 2022–Aug 2023.
      </p>

      <div className="need-origin" style={{ left: "2.39%", top: "71.8%" }}>
        <span>RESPONSE ORIGIN</span>
        <strong>FIRE STATION</strong>
      </div>
    </section>
  );
}
