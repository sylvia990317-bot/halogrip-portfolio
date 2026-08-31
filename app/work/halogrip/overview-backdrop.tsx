"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markPinReady, onPinsReady } from "./pin-coordinator";

/**
 * #overview's background photo. It flickers in like a strobe settling rather than just
 * fading — scrubbed to scroll position (not time), so it stays tied to the user's own
 * scroll gesture into the section and unwinds cleanly on scroll-up, matching the
 * scroll-intro's own reversibility contract above it.
 */
export default function OverviewBackdrop() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const section = img?.closest("#overview");
    if (!img || !section) {
      markPinReady("overview-backdrop");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(img, { opacity: 1 });
      markPinReady("overview-backdrop");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let context: gsap.Context | undefined;
    const unsubscribe = onPinsReady(["scroll-intro"], () => {
      context = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: section, start: "top 95%", end: "top 45%", scrub: 0.3 },
          })
          .set(img, { opacity: 0 })
          .to(img, { opacity: 0.85, duration: 0.08 }, 0)
          .to(img, { opacity: 0.08, duration: 0.07 }, 0.08)
          .to(img, { opacity: 0.95, duration: 0.06 }, 0.22)
          .to(img, { opacity: 0.15, duration: 0.07 }, 0.3)
          .to(img, { opacity: 0.75, duration: 0.1 }, 0.45)
          .to(img, { opacity: 0.3, duration: 0.1 }, 0.58)
          .to(img, { opacity: 1, duration: 0.25 }, 0.7);

        markPinReady("overview-backdrop");
      }, section);
    });

    return () => {
      unsubscribe();
      context?.revert();
    };
  }, []);

  return (
    <div className="overview-bg" aria-hidden="true">
      <img ref={imgRef} src={encodeURI("/media/halogrip图片/other/Bild1.png")} alt="" style={{ opacity: 0 }} />
      <div className="overview-bg-scrim" />
      <div className="overview-bg-fade" />
      <div className="overview-bg-fade-bottom" />
    </div>
  );
}
