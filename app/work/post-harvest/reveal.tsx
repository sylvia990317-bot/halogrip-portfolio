"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * One-time fade-up when the element first scrolls into view.
 *
 * FAIL-OPEN BY DESIGN. Content is visible unless every condition for safely hiding it is
 * met, because a stuck `opacity: 0` block is far worse than a missing animation. In order:
 *
 *  1. Server-rendered and pre-mount state is fully visible, so no-JS readers see everything.
 *  2. `prefers-reduced-motion` never arms.
 *  3. Missing IntersectionObserver never arms.
 *  4. Anything already in, or near, the viewport at mount never arms. This is what stops
 *     anchor navigation (`/work/post-harvest#status`) and fast scrolling from landing on
 *     hidden content.
 *  5. A generous `rootMargin` triggers the reveal before the block reaches the viewport.
 *  6. A final timer reveals anything still armed. If the observer never fires for any
 *     reason, the content appears anyway. Off-screen blocks reveal invisibly, so this
 *     costs nothing.
 *  7. Any thrown error reveals.
 *
 * Motion itself is defined in post-harvest.css, which also disables it under reduced motion.
 */
const FAIL_OPEN_MS = 6000;

export default function Reveal({
  id,
  tag = "div",
  className = "",
  children,
}: {
  id?: string;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"open" | "armed" | "visible">("open");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce || typeof IntersectionObserver === "undefined") {
        setState("visible");
        return;
      }

      // Already on screen, or about to be: show it, never arm it.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.15) {
        setState("visible");
        return;
      }

      setState("armed");

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setState("visible");
            observer?.disconnect();
          }
        },
        { threshold: 0, rootMargin: "200px 0px 200px 0px" }
      );
      observer.observe(el);

      timer = setTimeout(() => {
        setState("visible");
        observer?.disconnect();
      }, FAIL_OPEN_MS);
    } catch {
      setState("visible");
    }

    return () => {
      if (timer) clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  const classes = [
    className,
    "ph-reveal",
    state === "armed" && "ph-reveal-armed",
    state === "visible" && "is-visible",
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = tag as any;
  return (
    <Tag ref={ref} id={id} className={classes}>
      {children}
    </Tag>
  );
}
