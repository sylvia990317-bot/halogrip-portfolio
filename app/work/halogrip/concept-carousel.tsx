"use client";

/**
 * 05 / CONCEPT EXPLORATION — a self-contained, full-bleed hero carousel showing the 5 concept
 * sketches (originally extracted from `halogrip ppt.pptx` slides 11-15's "Ideation - Concepts
 * Exploration" filmstrip — see git history for that extraction).
 *
 * Motion model is ported from a reference `HeroCarousel` component Sylvia supplied
 * (framer-motion + Tailwind), re-implemented here with GSAP + hand-written CSS to match the
 * rest of this page's stack (scroll-intro.tsx / process-scene.tsx / design-gap-scene.tsx are
 * all GSAP; nothing on this route uses Tailwind). This is NOT tied to page-scroll position —
 * unlike every other pinned scene on this page, it's a self-driving widget: wheel / drag /
 * click-a-card / arrow keys all step a discrete `index` (never a continuous scroll-scrubbed
 * float), and GSAP tweens the track/cards/background to match on every change.
 *
 * Card treatment deliberately does NOT copy the reference's "fixed height, focused=full,
 * others=half, shared top edge, cropped via object-fit" mechanic. That's built for portrait
 * photography (crop to half height still reads as "a person's face," on purpose). Our sketches
 * are landscape technical drawings — cropping one in half chops off half the diagram. Every
 * card here keeps its full, uncropped aspect ratio (`aspect-ratio:1.431`, the sketches' own
 * real ratio — both card sizes in the source ppt, 2245800x1569300 and 2831100x1978200 EMU,
 * reduce to that exact number) at a fixed layout size; only the *focused* card gets visually
 * bigger, via `transform:scale()` from a centred origin — confirmed against the ppt's own
 * coordinates that its spotlight card really does scale from centre (every slide's spotlight
 * has the identical vertical centre as that slide's un-enlarged row, 1811825 EMU on all 5).
 * Scaling (not resizing the box) is also why the track's `step` spacing stays constant — focus
 * changes never reflow the row, only re-paint one card larger on top of it.
 *
 * Copy is the ppt's own wording, not an editorialized paraphrase: `title` is each slide's body
 * text verbatim ("Screen and Pedal", etc. — 4a and 4b share the *exact same* sentence in the
 * ppt, "Decision-making based steering device," which is why both show it), `conceptLabel` is
 * the ppt's own numbering (note 4a/4b, not a sequential 5th/6th), and `variant` is pulled from
 * each sketch's own handwritten title bar ("4a. L4-L2 Touch Screen" / "4b. L4-L2 HUD +
 * Joystick") — the only place the ppt actually distinguishes 4a from 4b in words.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Stage = {
  id: string;
  conceptLabel: string;
  title: string;
  variant?: string;
  image: string;
  alt: string;
  selected?: boolean;
};

const STAGES: Stage[] = [
  {
    id: "screen-pedal",
    conceptLabel: "CONCEPT 01",
    title: "Screen and Pedal",
    image: encodeURI("/media/halogrip图片/05/concept-1-screen-pedal.jpg"),
    alt: 'Concept 1 sketch, titled "① Screen + External Device": a dashboard screen control paired with a floor pedal and emergency seat',
  },
  {
    id: "pullout-wheel",
    conceptLabel: "CONCEPT 02",
    title: "Traditional steering wheel with pull-out mechanism",
    image: encodeURI("/media/halogrip图片/05/concept-2-pullout-wheel.jpg"),
    alt: 'Concept 2 sketch, titled "2. Steering wheel + Pull out + Functions": a traditional steering wheel that pulls out from the dashboard',
    selected: true,
  },
  {
    id: "modular-device",
    conceptLabel: "CONCEPT 03",
    title: "Removable modular steering wheel",
    image: encodeURI("/media/halogrip图片/05/concept-3-modular-device.png"),
    alt: 'Concept 3 sketch, titled "Concept 3 Detachable Steering Device": a detachable steering device inserted into the dashboard to unlock control',
  },
  {
    id: "decision-touch",
    conceptLabel: "CONCEPT 4A",
    title: "Decision-making based steering device",
    variant: "Touch Screen",
    image: encodeURI("/media/halogrip图片/05/concept-4a-touchscreen.png"),
    alt: 'Concept 4a sketch, titled "4a. L4-L2 Touch Screen": a touch-screen prompt for accepting or rejecting an autonomous maneuver',
  },
  {
    id: "decision-hud",
    conceptLabel: "CONCEPT 4B",
    title: "Decision-making based steering device",
    variant: "HUD + Joystick",
    image: encodeURI("/media/halogrip图片/05/concept-4b-hud-joystick.jpg"),
    alt: 'Concept 4b sketch, titled "4b. L4-L2 HUD + Joystick": a heads-up display and joystick used to accept or reject an autonomous maneuver',
  },
];

const LAST = STAGES.length - 1;
const CARD_AR = 1.431;
const FOCUS_SCALE = 1.38;
const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 420;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function canEnhance() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ConceptFallback() {
  return (
    <div className="concept-fallback">
      {STAGES.map((stage) => (
        <article key={stage.id} className={stage.selected ? "concept-fallback-selected" : ""}>
          <img src={stage.image} alt={stage.alt} loading="lazy" />
          <div>
            <span className="concept-carousel-eyebrow">{stage.conceptLabel}</span>
            <h3>
              {stage.title}
              {stage.selected && <em className="concept-carousel-tag">SELECTED DIRECTION</em>}
            </h3>
            {stage.variant && <p>{stage.variant}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ConceptCarousel() {
  const [enhanced, setEnhanced] = useState<boolean | null>(null);
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const indexRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const variantRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setEnhanced(canEnhance());
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!enhanced || !stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);

    // This component mounts its real (fixed, non-scroll-driven) height asynchronously —
    // `null` on first paint, then the actual ~520-760px section once `enhanced` resolves.
    // The site's GSAP ScrollTrigger.normalizeScroll() setup caches a max-scroll bound at
    // some point during page load; if that happens before this layout change lands, native
    // scroll silently caps below the real document height (confirmed directly: `window
    // ._scrollTop(x)` echoes `x` back from its getter while real `window.scrollY` stays
    // capped). `ScrollTrigger.refresh()` recomputes that bound — same fix as every previous
    // version of this component needed, still required even though this rewrite creates no
    // ScrollTrigger of its own.
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    return () => ro.disconnect();
  }, [enhanced]);

  // Every card keeps this same box at all times — focus never reflows the row, it only scales
  // one card larger in place (see file header for why, and for the ppt-verified centre anchor).
  const cardH = clamp(box.h * 0.3, 130, 260);
  const cardW = cardH * CARD_AR;
  const gap = Math.max(20, cardW * 0.16);
  const step = cardW + gap;
  const stripH = cardH * FOCUS_SCALE * 1.06;

  const xFor = useCallback((i: number) => box.w / 2 - (i * step + cardW / 2), [box.w, step, cardW]);

  const go = useCallback((next: number) => {
    const clamped = clamp(next, 0, LAST);
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  // Every focus change (from wheel, drag release, click, or keyboard) lands here: tween the
  // track into alignment, scale the focused card up in place, crossfade the background, and
  // restate the copy.
  useEffect(() => {
    if (!enhanced || !box.w) return;
    const track = trackRef.current;
    if (track) gsap.to(track, { x: xFor(index), duration: 0.6, ease: "power3.out" });

    STAGES.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (card) {
        gsap.to(card, {
          scale: i === index ? FOCUS_SCALE : 1,
          zIndex: i === index ? 10 : 1,
          boxShadow: i === index ? "0 30px 60px rgba(0,0,0,.45)" : "0 0px 0px rgba(0,0,0,0)",
          duration: 0.5,
          ease: "power2.out",
        });
      }
      const bg = bgRefs.current[i];
      if (bg) gsap.to(bg, { opacity: i === index ? 1 : 0, duration: 0.6, ease: "power2.out" });
    });

    if (railFillRef.current) {
      gsap.to(railFillRef.current, { left: `${(index / STAGES.length) * 100}%`, duration: 0.5, ease: "power2.out" });
    }
    const copyTargets = [eyebrowRef.current, titleRef.current, variantRef.current].filter(Boolean) as HTMLElement[];
    if (copyTargets.length) {
      gsap.fromTo(copyTargets, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.05 });
    }
  }, [index, enhanced, box.w, xFor]);

  // Wheel: accumulate delta into discrete ±1 steps (reference's threshold/cooldown numbers).
  // At either end, don't preventDefault — hand the gesture back to the page so this full-bleed
  // block never becomes a scroll trap.
  useEffect(() => {
    const stage = stageRef.current;
    if (!enhanced || !stage) return;
    let acc = 0;
    let until = 0;
    function onWheel(e: WheelEvent) {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const stuck = (delta > 0 && indexRef.current === LAST) || (delta < 0 && indexRef.current === 0);
      if (stuck) {
        acc = 0;
        return;
      }
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      acc += delta;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      go(indexRef.current + Math.sign(acc));
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    }
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [enhanced, go]);

  // Drag: manual pointer tracking (no framer-motion `drag` helper here) — live-set the track
  // position while dragging, then snap to whichever card is nearest on release, nudged by
  // release velocity so a flick clears more than one card.
  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!enhanced || !stage || !track || !box.w) return;

    let dragging = false;
    let startClientX = 0;
    let startTrackX = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      startClientX = e.clientX;
      startTrackX = Number(gsap.getProperty(track, "x"));
      lastX = e.clientX;
      lastT = e.timeStamp;
      velocity = 0;
      stage!.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - startClientX;
      gsap.set(track, { x: startTrackX + dx });
      const dt = e.timeStamp - lastT || 16;
      velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = e.timeStamp;
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      const currentX = Number(gsap.getProperty(track, "x"));
      const thrown = currentX + velocity * 120;
      const nearest = Math.round((box.w / 2 - thrown - cardW / 2) / step);
      go(nearest);
    }

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
    };
  }, [enhanced, box.w, cardW, step, go]);

  if (enhanced === null) return null;
  if (!enhanced) return <ConceptFallback />;

  const active = STAGES[index];

  return (
    <div
      className="concept-carousel"
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Concept exploration"
      onKeyDown={(e) => {
        const keys: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: LAST };
        if (!(e.key in keys)) return;
        e.preventDefault();
        go(keys[e.key]!);
      }}
    >
      <div className="concept-carousel-bg" aria-hidden="true">
        {STAGES.map((stage, i) => (
          <div
            key={stage.id}
            className="concept-carousel-bg-layer"
            style={{ opacity: i === index ? 1 : 0 }}
            ref={(el) => {
              bgRefs.current[i] = el;
            }}
          >
            <img src={stage.image} alt="" loading="lazy" />
          </div>
        ))}
        <div className="concept-carousel-bg-tint" />
        <div className="concept-carousel-bg-wash" />
      </div>

      <div className="concept-carousel-headline">
        <span className="concept-carousel-eyebrow" ref={eyebrowRef}>
          {active.conceptLabel}
        </span>
        <h3 ref={titleRef}>
          {active.title}
          {active.selected && <em className="concept-carousel-tag">SELECTED DIRECTION</em>}
        </h3>
        {active.variant && (
          <p className="concept-carousel-variant" ref={variantRef}>
            {active.variant}
          </p>
        )}
      </div>

      <div className="concept-carousel-strip" style={{ height: stripH }}>
        <div className="concept-carousel-track" ref={trackRef} style={{ gap }}>
          {STAGES.map((stage, i) => (
            <button
              key={stage.id}
              type="button"
              className="concept-carousel-card"
              style={{ width: cardW, height: cardH }}
              aria-label={stage.title}
              aria-current={i === index}
              onClick={() => go(i)}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <img src={stage.image} alt={stage.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="concept-carousel-rail">
        <div className="concept-carousel-rail-count">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{String(STAGES.length).padStart(2, "0")}</span>
        </div>
        <div className="concept-carousel-rail-track">
          <div className="concept-carousel-rail-fill" ref={railFillRef} style={{ width: `${100 / STAGES.length}%` }} />
        </div>
      </div>
    </div>
  );
}
