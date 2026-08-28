"use client";

/**
 * 05 / CONCEPT EXPLORATION — ported from the Morph-transition filmstrip on slides 11-15 of
 * `public/media/halogrip ppt.pptx` ("Ideation - Concepts Exploration"). Each of those 5 slides
 * enlarges a different one of 5 sketch cards into a "spotlight" position while the rest sit in
 * a row behind it; PowerPoint's Morph then interpolates every card's position/size between
 * slides, reading as a horizontal conveyor with one card in focus at a time.
 *
 * That exact per-slide EMU geometry wasn't worth porting pixel-for-pixel (the enlarge target's
 * on-slide x position isn't even consistent slide-to-slide — it was hand-placed per slide, not
 * formulaic). What was ported is the animation's actual grammar: a row of cards drifting
 * horizontally, continuous scale/elevation falloff by distance from a fixed focus point, and a
 * title/description readout synced to whichever card is currently in focus.
 *
 * Deliberately vanilla scroll (rAF + a plain scroll listener), not GSAP ScrollTrigger pin: this
 * component's progress is `-container.getBoundingClientRect().top / (containerHeight -
 * stageHeight)`, which only ever depends on the container's own measured height — never on
 * total document height — so it can't suffer the stale-trigger-measured-before-the-real-page-
 * height-exists bug documented in ./pin-coordinator.ts for the GSAP-pinned sections above this
 * one. No pin-coordinator wiring needed as a result.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Stage = {
  id: string;
  title: string;
  note: string;
  image: string;
  alt: string;
  selected?: boolean;
};

const STAGES: Stage[] = [
  {
    id: "screen-pedal",
    title: "SCREEN + PEDAL",
    note: "Screen control paired with a floor pedal — space-intensive.",
    image: encodeURI("/media/halogrip图片/05/concept-1-screen-pedal.jpg"),
    alt: "Concept 1 sketch: a dashboard screen control paired with a floor pedal and emergency seat",
  },
  {
    id: "pullout-wheel",
    title: "PULL-OUT WHEEL",
    note: "A traditional wheel that pulls out from the dash — selected direction.",
    image: encodeURI("/media/halogrip图片/05/concept-2-pullout-wheel.jpg"),
    alt: "Concept 2 sketch: a traditional steering wheel that pulls out from the dashboard",
    selected: true,
  },
  {
    id: "modular-device",
    title: "MODULAR DEVICE",
    note: "A detachable steering device, inserted to unlock control — potential misuse.",
    image: encodeURI("/media/halogrip图片/05/concept-3-modular-device.png"),
    alt: "Concept 3 sketch: a detachable steering device inserted into the dashboard to unlock control",
  },
  {
    id: "decision-touch",
    title: "DECISION UI",
    note: "A touchscreen accept/reject prompt for each maneuver — higher mental load.",
    image: encodeURI("/media/halogrip图片/05/concept-4a-touchscreen.png"),
    alt: "Concept 4a sketch: a touch-screen prompt for accepting or rejecting an autonomous maneuver",
  },
  {
    id: "decision-hud",
    title: "DECISION UI",
    note: "The same accept/reject choice via heads-up display and joystick.",
    image: encodeURI("/media/halogrip图片/05/concept-4b-hud-joystick.jpg"),
    alt: "Concept 4b sketch: a heads-up display and joystick used to accept or reject an autonomous maneuver",
  },
];

const STEP = 21;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function canEnhance() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 760) return false;
  return true;
}

function ConceptFallback() {
  return (
    <div className="concept-fallback">
      {STAGES.map((stage) => (
        <article key={stage.id} className={stage.selected ? "concept-fallback-selected" : ""}>
          <img src={stage.image} alt={stage.alt} loading="lazy" />
          <div>
            <h3>
              {stage.title}
              {stage.selected && <em className="concept-carousel-tag">SELECTED DIRECTION</em>}
            </h3>
            <p>{stage.note}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ConceptCarousel() {
  const [enhanced, setEnhanced] = useState<boolean | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    setEnhanced(canEnhance());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!enhanced || !container || !stage || !track) return;

    // This container's real height (several viewport-heights tall, for the sticky scrub
    // below) only exists in the DOM once this effect runs (a render pass after the
    // `enhanced` check above). The site's GSAP ScrollTrigger.normalizeScroll() setup caches
    // a max-scroll bound that was last computed against the page's *previous*, shorter
    // height, so without a refresh here the page becomes unscrollable past that stale bound
    // — confirmed directly: `window._scrollTop()` (normalizeScroll's own scroll setter)
    // accepted and reported values past this component's start, but the page never
    // visually scrolled past the old max. `ScrollTrigger.refresh()` recomputes that bound
    // (unlike an existing pin's own start/end — see ./pin-coordinator.ts's comment for why
    // that specific case doesn't respond to refresh()); this is a different code path.
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    let rafId: number | null = null;

    function applyFrame(focus: number) {
      track!.style.transform = `translateX(${-focus * STEP}%)`;

      STAGES.forEach((_, i) => {
        const distance = Math.abs(focus - i);
        const t = clamp01(1 - distance);
        const card = cardRefs.current[i];
        if (card) {
          const scale = lerp(0.8, 1.16, t);
          const lift = lerp(10, -8, t);
          card.style.transform = `translateY(${lift}px) scale(${scale})`;
          card.style.opacity = String(lerp(0.42, 1, clamp01(1 - distance * 0.85)));
          card.style.zIndex = String(Math.round(t * 100));
          card.style.boxShadow = t > 0.35 ? `0 ${lerp(10, 38, t)}px ${lerp(18, 60, t)}px rgba(0,0,0,${lerp(0.08, 0.32, t)})` : "none";
        }
        const dot = dotRefs.current[i];
        if (dot) dot.style.transform = `scale(${lerp(1, 1.8, t)})`;
      });

      if (lineFillRef.current) {
        lineFillRef.current.style.width = `${(focus / (STAGES.length - 1)) * 100}%`;
      }

      const nearest = Math.round(focus);
      if (nearest !== activeIndexRef.current) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
      }
    }

    function update() {
      rafId = null;
      const containerRect = container!.getBoundingClientRect();
      const scrollable = container!.offsetHeight - stage!.offsetHeight;
      const progress = scrollable > 0 ? clamp01(-containerRect.top / scrollable) : 0;
      applyFrame(progress * (STAGES.length - 1));
    }

    function onScroll() {
      if (rafId == null) rafId = requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      },
      { rootMargin: "0px" }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [enhanced]);

  if (enhanced === null) return null;
  if (!enhanced) return <ConceptFallback />;

  const active = STAGES[activeIndex];

  return (
    <div className="concept-carousel" ref={containerRef} style={{ height: `${(STAGES.length - 1) * 90 + 100}vh` }}>
      <div className="concept-carousel-stage" ref={stageRef}>
        <div className="concept-carousel-track" ref={trackRef}>
          {STAGES.map((stage, i) => (
            <div
              key={stage.id}
              className="concept-carousel-card"
              style={{ left: `${i * STEP}%` }}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <img src={stage.image} alt={stage.alt} loading="lazy" />
            </div>
          ))}
        </div>

        <div className="concept-carousel-line">
          <div className="concept-carousel-line-fill" ref={lineFillRef} />
          {STAGES.map((stage, i) => (
            <span
              key={stage.id}
              className="concept-carousel-dot"
              style={{ left: `${(i / (STAGES.length - 1)) * 100}%` }}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        <div className="concept-carousel-readout">
          <span>0{activeIndex + 1}</span>
          <div>
            <h3>
              {active.title}
              {active.selected && <em className="concept-carousel-tag">SELECTED DIRECTION</em>}
            </h3>
            <p>{active.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
