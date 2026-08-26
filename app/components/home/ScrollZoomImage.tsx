"use client";

import { useEffect, useRef } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 1.22;

export default function ScrollZoomImage({
  children,
  overlay,
  className = "",
}: {
  children: React.ReactNode;
  overlay?: React.ReactNode;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    let rafId: number | null = null;

    function update() {
      rafId = null;
      const rect = wrapper!.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const entryProgress =
        rect.height > 0 ? Math.min(1, Math.max(0, (viewportH - rect.top) / rect.height)) : 1;
      inner!.style.transform = `scale(${MAX_SCALE - (MAX_SCALE - MIN_SCALE) * entryProgress})`;
    }

    function onScroll() {
      if (rafId == null) rafId = requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { rootMargin: "25% 0px" }
    );
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
      <div ref={innerRef} className="h-full w-full">
        {children}
      </div>
      {overlay}
    </div>
  );
}
