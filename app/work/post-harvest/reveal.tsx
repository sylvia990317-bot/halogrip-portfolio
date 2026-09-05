import React from "react";

/**
 * Layout wrapper. MOTION IS OFF.
 *
 * MOTION_INTENSITY: 0. Sylvia's instruction, 2026-09-03: motion is to be rebuilt from
 * scratch after the layout system reset, so nothing here may defer, fade or transform.
 * This component now renders a plain element and ships no client JavaScript at all: there
 * is no observer, no armed state, no timer and no `ph-reveal` class, so every block is
 * painted on first frame of a hard reload and stays painted.
 *
 * It is deliberately kept as a component rather than deleted, because it marks the block
 * boundaries the future motion pass will need. When motion is rebuilt, reintroduce the
 * fail-open ladder here (server-visible default, reduced-motion opt out, in-viewport
 * blocks never armed, generous rootMargin, and a timer that reveals anything still armed)
 * rather than a bare IntersectionObserver.
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
  // The union of every intrinsic tag intersects to `never` on the props, so this is cast
  // the same way the previous implementation did.
  const Tag = tag as React.ElementType<{ id?: string; className?: string }>;
  return (
    <Tag id={id} className={className || undefined}>
      {children}
    </Tag>
  );
}
