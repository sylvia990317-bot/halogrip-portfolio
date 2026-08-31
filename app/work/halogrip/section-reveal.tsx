"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Plain one-time fade-up when the element first scrolls into view.
 * Not scroll-scrubbed and not pinned — the observer fires once, then disconnects.
 * `tag` lets this wrap something other than a `<section>` (e.g. a single `h2`/`p`
 * heading in place, with no extra wrapper element) so the same reveal can be dropped
 * onto a chapter heading without touching its surrounding layout.
 */
export default function SectionReveal({
  id,
  tag = "section",
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [className, "section-reveal", armed && "section-reveal-armed", visible && "is-visible"]
    .filter(Boolean)
    .join(" ");

  const Tag = tag as any;

  return (
    <Tag ref={ref} id={id} className={classes}>
      {children}
    </Tag>
  );
}
