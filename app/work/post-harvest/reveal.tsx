"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * One-time fade-up when the element first scrolls into view, then the observer
 * disconnects. Route-local on purpose: HALOGRIP has its own `section-reveal.tsx`, and
 * importing across routes would couple two deliberately independent design systems
 * (CLAUDE.md rule 1). The motion itself is defined in post-harvest.css, which also
 * disables it under `prefers-reduced-motion`.
 *
 * Content is rendered server-side and visible without JS: `armed` only becomes true
 * after mount, so the hidden state never applies for a reader without JavaScript.
 */
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
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [className, "ph-reveal", armed && "ph-reveal-armed", visible && "is-visible"]
    .filter(Boolean)
    .join(" ");

  const Tag = tag as any;
  return (
    <Tag ref={ref} id={id} className={classes}>
      {children}
    </Tag>
  );
}
