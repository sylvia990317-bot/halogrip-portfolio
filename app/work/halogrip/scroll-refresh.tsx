"use client";

/**
 * Some sections on this page (scroll-intro.tsx, design-gap-scene.tsx) defer their real,
 * pin-creating ScrollTrigger to a second render pass (SSR/hydration-safe fallback
 * detection), while others (process-scene.tsx, overview-backdrop.tsx) create theirs
 * synchronously on first mount — against a document that's still the short, unpinned
 * fallback layout. Their start/end pixel positions get baked in at creation time and are
 * never recomputed without an explicit refresh. This performs that refresh once, after
 * everything above has had a chance to run (plus a couple of later safety nets), so every
 * ScrollTrigger on the page ends up anchored to the final, fully-expanded layout.
 */
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollRefresh() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // TEMP-DIAGNOSTIC: expose for console inspection, remove before finishing.
    (window as any).__ST = ScrollTrigger;
    (window as any).__gsap = gsap;

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    // Two animation frames reliably lands after any effect-triggered re-render cascade
    // (scroll-intro's / design-gap-scene's enhanced-state flip + their real pin creation)
    // has committed and painted.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    });

    // Safety net for layout shifts that land even later: web font swap, the ssr:false
    // three.js chunk, below-the-fold images.
    document.fonts?.ready?.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
