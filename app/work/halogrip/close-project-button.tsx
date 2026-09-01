"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fixed top-right "close" pill. Tracks whether a dark section (.dark-section, plus .overview,
 * which reads dark but doesn't carry that class since its own background is an absolutely
 * positioned photo layer) is currently sitting behind the button's own fixed screen position,
 * and flips between a dark pill/white text and a light pill/dark text accordingly — two clean
 * opaque states, never a translucent/see-through one.
 *
 * Implemented as an IntersectionObserver per dark element, each gated to a 1px-tall rootMargin
 * band at the button's own vertical center — cheaper than a scroll listener re-measuring on
 * every frame, and IntersectionObserver already recomputes on scroll for free.
 */
export default function CloseProjectButton() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const darkEls = Array.from(document.querySelectorAll<HTMLElement>(".dark-section, .overview"));
    if (darkEls.length === 0) return;

    const intersecting = new Set<Element>();
    let observer: IntersectionObserver | undefined;

    function setup() {
      const link = linkRef.current;
      if (!link) return;
      const rect = link.getBoundingClientRect();
      const y = Math.round(rect.top + rect.height / 2);
      const rootMargin = `-${y}px 0px -${Math.max(0, window.innerHeight - y - 1)}px 0px`;

      observer?.disconnect();
      intersecting.clear();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          });
          setOnDark(intersecting.size > 0);
        },
        { rootMargin, threshold: 0 }
      );
      darkEls.forEach((el) => observer!.observe(el));
    }

    setup();
    window.addEventListener("resize", setup);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <a ref={linkRef} className={`close-project${onDark ? " is-on-dark" : ""}`} href="/">
      <span className="close-project-track">
        <span>CLOSE PROJECT</span>
        <span aria-hidden="true">CLOSE PROJECT</span>
      </span>
    </a>
  );
}
