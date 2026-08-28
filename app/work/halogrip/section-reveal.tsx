"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plain one-time fade-up when the section first scrolls into view.
 * Not scroll-scrubbed and not pinned — the observer fires once, then disconnects.
 */
export default function SectionReveal({
  id,
  className = "",
  children,
}: {
  id?: string;
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

  return (
    <section ref={ref} id={id} className={classes}>
      {children}
    </section>
  );
}
