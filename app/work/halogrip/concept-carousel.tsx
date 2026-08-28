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
 * float), and GSAP tweens the track/card-heights/background to match on every change.
 *
 * Reference's core trick, ported directly: the focused card is always centred in the stage —
 * `xFor(i) = stageWidth/2 - (i*step + cardW/2)`, and the *track* translates to align whichever
 * card is focused, rather than the card moving to a fixed spot. The previous (scroll-scrubbed)
 * version of this component pinned the focused card to the track's own origin (x=0, i.e. the
 * stage's left edge), which is why it clipped/crowded against the left edge when enlarged —
 * this rewrite is the fix for that.
 *
 * Card aspect ratio is the one deliberate departure from the reference: it's built for
 * portrait photography (CARD_AR=0.75, a 3:4 crop). HALOGRIP's sketches are landscape technical
 * drawings — both card sizes in the source ppt (2245800x1569300 and 2831100x1978200 EMU) work
 * out to the exact same 1.431:1 ratio, so CARD_AR here is that number instead. The "fixed
 * height, width = height x aspect ratio, focused = full height, others = half height, shared
 * top edge" framework itself is aspect-ratio-agnostic and needed no other change.
 */

import { useCallback, useEffect, useRef, useState } from "react";
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

const LAST = STAGES.length - 1;
const CARD_AR = 1.431;
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
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const indexRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

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
    // capped). `ScrollTrigger.refresh()` recomputes that bound — same fix as the previous
    // (scroll-driven) version of this component needed, still required even though this
    // rewrite creates no ScrollTrigger of its own.
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    return () => ro.disconnect();
  }, [enhanced]);

  const fullH = clamp(box.h * 0.46, 160, 420);
  const halfH = fullH / 2;
  const cardW = fullH * CARD_AR;
  const gap = Math.max(10, cardW * 0.05);
  const step = cardW + gap;

  const xFor = useCallback((i: number) => box.w / 2 - (i * step + cardW / 2), [box.w, step, cardW]);

  const go = useCallback((next: number) => {
    const clamped = clamp(next, 0, LAST);
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  // Every focus change (from wheel, drag release, click, or keyboard) lands here: tween the
  // track into alignment, tween each card's height, crossfade the background, restate the copy.
  useEffect(() => {
    if (!enhanced || !box.w) return;
    const track = trackRef.current;
    if (track) gsap.to(track, { x: xFor(index), duration: 0.6, ease: "power3.out" });

    STAGES.forEach((_, i) => {
      const card = cardRefs.current[i];
      if (card) gsap.to(card, { height: i === index ? fullH : halfH, duration: 0.5, ease: "power2.out" });
      const bg = bgRefs.current[i];
      if (bg) gsap.to(bg, { opacity: i === index ? 1 : 0, duration: 0.6, ease: "power2.out" });
    });

    if (railFillRef.current) {
      gsap.to(railFillRef.current, { left: `${(index / STAGES.length) * 100}%`, duration: 0.5, ease: "power2.out" });
    }
    if (titleRef.current && noteRef.current) {
      gsap.fromTo(
        [titleRef.current, noteRef.current],
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.05 }
      );
    }
  }, [index, enhanced, box.w, fullH, halfH, xFor]);

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
        <h3 ref={titleRef}>
          {active.title}
          {active.selected && <em className="concept-carousel-tag">SELECTED DIRECTION</em>}
        </h3>
        <p ref={noteRef}>{active.note}</p>
      </div>

      <div className="concept-carousel-strip">
        <div className="concept-carousel-track" ref={trackRef} style={{ gap }}>
          {STAGES.map((stage, i) => (
            <button
              key={stage.id}
              type="button"
              className="concept-carousel-card"
              style={{ width: cardW, height: i === index ? fullH : halfH }}
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
