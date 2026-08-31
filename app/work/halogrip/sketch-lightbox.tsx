"use client";

/**
 * 06 / SKETCH PROCESS — concept convergence's 2x2 thumbnail grid, plus a click/tap-to-open
 * lightbox for the same four sketches. The thumbnails render at ~280-350px wide (packed into
 * a shared grid column) even though the source PNGs are 2048x1431 — legible at full size, just
 * squeezed down 6-7x. Desktop mouse users get a lighter in-place CSS hover-zoom (see
 * `.sketch-process-concept-card:hover img` in halogrip.css, gated to hover-capable pointers so
 * it never fires on touch); this component covers the click/tap path that works on every device
 * (and doubles as the keyboard-accessible route on desktop) via a portal-rendered modal.
 *
 * Deliberately NOT a `<button>` wrapping the `<figure>`: `<button>`'s content model is
 * phrasing-content-only and can't legally contain `<figcaption>`, so the whole card is a
 * `role="button"` figure with manual Enter/Space handling instead.
 */

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Sketch = { id: string; file: string; ext: string; number: string; title: string; desc: string; traits: string[] };

const SKETCHES: Sketch[] = [
  { id: "sketch-1-d-shaped-hud", file: "sketch-1-d-shaped-hud", ext: "png", number: "01", title: "D-shaped wheel", desc: "Single pedal, mechanical pull-out, and HUD.", traits: ["Single-pedal control", "Mechanical pull-out", "HUD feedback"] },
  { id: "sketch-2-u-shape-onscreen", file: "sketch-2-u-shape-onscreen", ext: "png", number: "02", title: "U-shape yoke", desc: "On-screen interface, electrically actuated.", traits: ["On-screen interface", "Electrical actuation"] },
  { id: "sketch-3-oblique-ellipse", file: "sketch-3-oblique-ellipse", ext: "png", number: "03", title: "Oblique ellipse", desc: "NFC authorization and aircraft-throttle-style speed control.", traits: ["NFC authorization", "Aircraft-throttle speed control"] },
  { id: "sketch-4-classic-round", file: "sketch-4-classic-round", ext: "png", number: "04", title: "Classic round", desc: "Electrical slide rails with voice control.", traits: ["Electrical slide rails", "Voice control"] },
];
const LAST = SKETCHES.length - 1;

const srcFor = (s: Sketch) => encodeURI(`/media/halogrip图片/05-iteration/${s.file}.${s.ext}`);
const altFor = (s: Sketch) => `Iteration sketch: ${s.title} — ${s.desc}`;

export default function ConceptSketchLightbox() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  function open(index: number, trigger: HTMLElement) {
    lastTriggerRef.current = trigger;
    setOpenIndex(index);
  }
  function close() {
    setOpenIndex(null);
  }
  function goPrev() {
    setOpenIndex((i) => (i === null ? i : (i + LAST) % (LAST + 1)));
  }
  function goNext() {
    setOpenIndex((i) => (i === null ? i : (i + 1) % (LAST + 1)));
  }

  // Scroll lock while the modal is open. ScrollTrigger (used by this page's pinned-scroll
  // intro) tracks scroll purely off window scroll events / scrollY and never reads or writes
  // body.style.overflow itself, so this doesn't fight it — it just freezes in place and
  // resumes correctly once the lock is lifted. The paddingRight compensation avoids a
  // horizontal layout jump when the scrollbar disappears.
  useEffect(() => {
    if (openIndex === null) return;
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [openIndex]);

  // Focus the close button on open; return focus to whichever card triggered it on close.
  // lastTriggerRef (set at click time), not something derived from openIndex, since openIndex
  // is already null by the time the close-side effect cleanup runs.
  useEffect(() => {
    if (openIndex === null) return;
    closeBtnRef.current?.focus();
    return () => {
      lastTriggerRef.current?.focus();
      lastTriggerRef.current = null;
    };
  }, [openIndex]);

  // Escape to close, Left/Right to cycle, and a manual Tab trap — there's no native <dialog>
  // here, but the modal only ever holds 3-4 focusable buttons so trapping is cheap.
  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  const active = openIndex !== null ? SKETCHES[openIndex] : null;

  return (
    <>
      <div className="sketch-process-converge-concepts">
        {SKETCHES.map((s, i) => (
          <figure
            key={s.id}
            className="sketch-process-concept-card"
            role="button"
            tabIndex={0}
            aria-label={`View larger: ${s.title}`}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            onClick={(e) => open(i, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(i, e.currentTarget);
              }
            }}
          >
            <img src={srcFor(s)} alt={altFor(s)} loading="lazy" />
            <figcaption>
              <span className="sketch-process-concept-number">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* openIndex is only ever non-null from a client click/keydown handler post-hydration,
          so document.body is always available here — no isMounted/typeof-window guard needed. */}
      {active &&
        createPortal(
          <div className="sketch-lightbox" onClick={close}>
            <button type="button" className="sketch-lightbox-nav sketch-lightbox-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous concept sketch">
              &larr;
            </button>
            <div className="sketch-lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} onClick={(e) => e.stopPropagation()}>
              <button type="button" className="sketch-lightbox-close" ref={closeBtnRef} onClick={close} aria-label="Close enlarged sketch">
                &times;
              </button>
              <div className="sketch-lightbox-media">
                <img src={srcFor(active)} alt={altFor(active)} />
              </div>
              <div className="sketch-lightbox-info">
                <span className="sketch-process-concept-number">{active.number}</span>
                <h3 id={titleId}>{active.title}</h3>
                <p>{active.desc}</p>
                <ul className="sketch-lightbox-traits">
                  {active.traits.map((trait) => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button type="button" className="sketch-lightbox-nav sketch-lightbox-next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next concept sketch">
              &rarr;
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
