"use client";

/**
 * Scroll-driven 3D product intro for the HALOGRIP case study.
 *
 * Every pose, frame, colour, font and text string below is lifted straight out of
 * Sylvia's own PowerPoint build of this animation
 * (`public/media/Final Presention for claude12.pptx`, 9 slides + Morph). A .pptx is a
 * zip of OOXML: each slide's `<am3d:model3d>` carries the 3D rotation, `<p:xfrm>` the
 * 2D frame, `<a:t>` the copy, and the `prst="arc"` shape the directional graphic.
 * Angles are stored in 60000ths of a degree, lengths in EMU (9144000 x 5143500 slide).
 *
 * Responsibilities kept here:
 *  - fallback detection (reduced motion / no WebGL / narrow viewport)
 *  - the GSAP + ScrollTrigger timeline (all scrub math and reversal)
 *  - the HTML overlay (ghost wordmark, fact labels, callout block, arc, stage titles)
 *
 * Three.js lives entirely in `./scroll-intro-scene`, loaded with `ssr:false` from
 * here (a Client Component) because that is invalid from a Server Component.
 *
 * Perf contract: the only React state that changes during the sequence is the discrete
 * 0-2 direction bucket. Everything continuous is written onto a plain mutable object
 * that a single `useFrame` reads, or straight onto DOM nodes by GSAP — zero re-renders
 * per scroll frame.
 */

import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ScrollIntroScene = dynamic(() => import("./scroll-intro-scene"), { ssr: false });

/**
 * The deck is set in Poppins throughout — a deliberate, scoped exception to the rest of
 * this page's Nimbus Sans Narrow. Loading it here rather than in the root layout keeps it
 * off `/` and off the rest of `/work/halogrip`: only `.scroll-intro` carries the variable.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--si-poppins",
});

/**
 * One pose per slide. `pitch`/`yaw`/`roll` are the model's X/Y/Z rotation in degrees;
 * `fx`/`fy`/`fw`/`fh` are its on-screen frame as fractions of the viewport.
 *
 * PowerPoint keeps the frame glued to the *rendered* bounds of the model (it re-fits the
 * box every time you rotate), which is why the frame aspect swings from 2.04 on slide 1
 * to 0.61 on slide 4 — the scene fits the model into this rect rather than just scaling it.
 */
export type Pose = {
  pitch: number;
  yaw: number;
  roll: number;
  fx: number;
  fy: number;
  fw: number;
  fh: number;
};

/** Slide 1 — parked fully below the viewport (fy > 1), all but face-on. */
const POSE_PARKED: Pose = { pitch: 3.06, yaw: 0, roll: 0, fx: 0.0867, fy: 1.0167, fw: 0.8265, fh: 0.7218 };
/** Slide 2 — risen into frame, tipped forward so the top face reads. */
const POSE_RAISED: Pose = { pitch: 26.67, yaw: 0, roll: 0, fx: 0.1851, fy: 0.1362, fw: 0.6298, fh: 0.5692 };
/**
 * Slide 3 — the editorial close-up ("3D 模型 1" in the deck). The big one on the left,
 * bleeding off the left and top edges on purpose. This is the persistent model's stage-2
 * target, and it is also the last shape in slide 3's tree, i.e. the copy PowerPoint draws
 * on top. Turning to yaw -50 here means the whole sequence now runs 0 -> -50 -> -90 in one
 * direction rather than doubling back.
 */
const POSE_CLOSE_UP: Pose = { pitch: 26.53, yaw: -50.42, roll: -20.73, fx: -0.0950, fy: -0.3939, fw: 0.8372, fh: 1.3513 };
/**
 * Slide 3's *second* copy of the model ("3D 模型 6"). Slide 3 is the only slide that layers
 * two instances: a smaller, differently turned one off to the right, behind the close-up and
 * under the callout text. It is a fixed pose — nothing scrubs it — so it never enters
 * `SceneState`; only its opacity is animated, through `SceneState.backdrop`.
 */
const POSE_CLOSE_UP_BACKDROP: Pose = { pitch: 43.12, yaw: 29.77, roll: 24.57, fx: 0.5459, fy: -0.4656, fw: 0.7056, fh: 1.0361 };
/**
 * Slide 4 — clean side view. Held *unchanged* all the way through slide 9.
 * The deck stores this as ay=270deg; -90deg is the same pose and is what the scrub needs,
 * so the turn out of slide 3 takes the short way round instead of a 240deg detour.
 */
const POSE_SIDE: Pose = { pitch: 0, yaw: -90, roll: 0, fx: 0.3639, fy: 0.1081, fw: 0.2672, fh: 0.7838 };

export type SceneState = Pose & {
  /** Continuous 0..2 that the direction bucket is derived from. Not read by the scene. */
  direction: number;
  /**
   * The rendered frame's flat 2D rotation in degrees, clockwise — slides 4-9's rock (see
   * `TILT_FORWARD`). Kept off `pitch` on purpose: `pitch` is the slide 1-4 approach and has to
   * stay parked at its slide-4 value once the model settles. The scene turns this about the
   * camera's own view axis rather than folding it into the pose Euler — see `TILT_SIGN` in
   * `scroll-intro-scene.tsx`.
   */
  tilt: number;
  /**
   * Visibility of slide 3's backdrop instance, 0..1. Scrubbed on exactly the same beats as
   * the callout block it shares a stage with; the scene maps it onto material opacity and
   * skips the instance entirely while it is 0.
   */
  backdrop: number;
};

/** Settled background at the very end of the pin — matches #overview's paper. */
const PAPER = "#eaeae6";

/**
 * The arc graphic's four placements, straight from the `prst="arc"` shapes. Its curve
 * geometry never changes (adj1 282.486deg -> adj2 349.156deg); only the frame, the shape
 * rotation and the horizontal flip do — which is what makes one arc read as three
 * different directions. `rotation` is normalised into (-180, 180] so GSAP always scrubs
 * the short way round.
 */
type ArcFrame = { left: string; top: string; width: string; height: string; rotation: number; scaleX: number };

const ARC_INTRO: ArcFrame = { left: "21.65%", top: "19.88%", width: "34.54%", height: "17.57%", rotation: -25.96, scaleX: 1 };
const ARC_FORWARD: ArcFrame = { left: "28.84%", top: "19.88%", width: "34.54%", height: "17.57%", rotation: -25.96, scaleX: 1 };
const ARC_BRAKE: ArcFrame = { left: "43.36%", top: "24.32%", width: "36.35%", height: "18.49%", rotation: 27.94, scaleX: -1 };
const ARC_REVERSE: ArcFrame = { left: "31.82%", top: "18.34%", width: "36.35%", height: "18.49%", rotation: 13.97, scaleX: -1 };

/**
 * The rock the product does across slides 4-9, and it is not a 3D move at all: every one of
 * those slides freezes `<am3d:model3d>`'s own `<am3d:rot>` at the side view, and what changes
 * instead is the `rot` attribute on each slide's `<p:graphicFrame>`'s `<p:xfrm>` — a flat,
 * in-the-picture-plane turn of the whole rendered frame, the way you would rotate a photo.
 * Morph tweens it between slides, and on a side-view silhouette that reads as the product
 * physically tilting. Values are 60000ths of a degree, clockwise, absent meaning 0:
 * slide 4 absent, slides 5 and 6 `rot="906972"` (15.12deg), slides 7 and 8 absent, slide 9
 * `rot="20232542"` (337.21deg, written here as -22.79 so the scrub takes the short way round).
 *
 * So this is one continuous sweep that never doubles back — 0 -> +15.12 -> 0 -> -22.79 — with
 * a hold at each slide's value, not three independent per-stage angles.
 */
const TILT_FORWARD = 15.12;
const TILT_BRAKE = 0;
const TILT_REVERSE = -22.79;

const meta = [
  ["Deliverable", "Fallback steering"],
  ["Partner", "Autoliv × Chalmers"],
  ["Role", "User research + concept"],
  ["Context", "Level 4 robotaxi"],
];

/** Slide 2's four labels. `lead` ones are 20pt bold, the others 14pt light. */
const facts = [
  { text: "More Lives Saved", lead: true, left: "4.2%", top: "71.5%" },
  { text: "Speed Limitation", lead: false, left: "4.2%", top: "78.5%" },
  { text: "Visible Analog", lead: false, left: "4.2%", top: "83.3%" },
  { text: "More Life Lived", lead: true, left: "70.8%", top: "71.5%" },
] as const;

/** Slide 3's single stacked callout block. Vertical order is the PPT's, not alphabetical. */
const callouts = [
  { text: "Button & Tag", lead: true, top: "68.1%" },
  { text: "Parking – Remote Assistant", lead: false, top: "75.1%" },
  { text: "Activate Steering Device", lead: false, top: "79.9%" },
] as const;

/**
 * Slides 5-9. The model's 3D pose is frozen across all three — what moves is the arc, this
 * copy, and the frame's flat 2D rotation (see `TILT_FORWARD` above).
 */
const directions = [
  { title: "ACCELERATION", label: "Forward" },
  { title: "DEACCELERATION", label: "Brake" },
  { title: "REVERSE", label: "Backward" },
] as const;

type DirectionIndex = 0 | 1 | 2;

function bucketForDirection(value: number): DirectionIndex {
  if (value < 0.5) return 0;
  if (value < 1.5) return 1;
  return 2;
}

function canEnhance() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 760) return false;
  try {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") || probe.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** The original static hero, verbatim. Also used as the loading state of the 3D path. */
function HeroFallback({ titleId }: { titleId?: string }) {
  return (
    <section className="hero shell" aria-labelledby={titleId}>
      <div className="hero-heading">
        <span className="eyebrow">[ CASE STUDY 001 ]</span>
        <h1 id={titleId}>HALOGRIP</h1>
        <span className="eyebrow hero-year">GOTHENBURG, SE / 2025</span>
      </div>
      <div className="metadata">
        {meta.map(([label, value]) => (
          <div className="meta-item" key={label}>
            <span className="eyebrow">[ {label} ]</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="hero-image">
        <img src={encodeURI("/media/halogrip图片/other/hero.webp")} alt="HALOGRIP emergency steering device in a blue-lit product render" fetchPriority="high" />
        <div className="hero-caption">
          <span>EMERGENCY CONTROL FOR AUTONOMOUS VEHICLES</span>
          <span>SYLVIA XIE</span>
        </div>
      </div>
    </section>
  );
}

/**
 * The arc: a stroked partial ring with a triangle only on its tail — the deck's
 * `prst="arc"` shape, whose ellipse is inscribed in the shape box (rx 500, ry 143.03 in
 * viewBox units) and swept between `adj1` 282.486deg and `adj2` 349.156deg. Stroke width
 * 40.2 viewBox units is the PPT's 10pt line (`<a:ln w="127000">`) at this shape width.
 *
 * The two adj angles are *true geometric angles*, not ellipse parameters, and on a box this
 * far from square (500 x 143, ratio 3.5) the difference is enormous. The preset says so
 * itself: `arc`'s geometry list converts the angle before handing it to `arcTo`, via
 *
 *     wt1 = wd2 sin(ang);  ht1 = hd2 cos(ang);  param = atan2(wt1, ht1)
 *
 * (the `cat2`/`sat2` formulas). Feeding the raw angles in as parameters — which is what an
 * earlier pass here did — moved both ends of the arc by ~50-60px at slide scale. Converted
 * properly, the full arc runs
 *
 *     start: true 282.486deg -> param -86.376deg -> (531.61, 0.29)
 *     end:   true 349.156deg -> param -33.807deg -> (915.46, 63.45)
 *     sweep: +52.57deg, so SVG large-arc-flag 0, sweep-flag 1
 *
 * on an ellipse centred (500, 143.03), and measures 391.06 units long.
 *
 * The tail triangle is `<a:tailEnd type="triangle" w="med" len="med"/>`. Both "med"s are 3x
 * the line width, so the head is 120.6 x 120.6 units against the 40.2 stroke — confirmed off
 * PowerPoint's own raster, where it measures 77.9 long by 77.3 wide against a 27.9 stroke.
 *
 * It is drawn as an explicit polygon rather than a `marker-end`, for two reasons, both of
 * which were live bugs here:
 *
 *  1. DrawingML *shortens the line by the arrowhead's length* so the head sits on the end of
 *     the stroke instead of on top of it. An SVG marker does not: the stroke still ran the
 *     full 391 units, so the last 120.6 of it stayed painted underneath the triangle and its
 *     butt cap squirted out past the head's lower flank. Because the arc turns 11deg across
 *     that span, the head's barbs also landed over a stretch of stroke pointing somewhere
 *     else — the two together read as a lopsided blob with a notch, not an arrow, and the tip
 *     never came clear of the line. The stroke below therefore stops at the head's base.
 *  2. `orient="auto"` takes the tangent at the vertex it is attached to, and Brake/Reverse
 *     mirror the whole `<svg>` with `scaleX: -1`. Pinning the geometry removes any question
 *     of how an auto-oriented marker composes with a negative-determinant transform: the
 *     mirrored states are now exactly the mirror image of the unflipped one.
 *
 * Head geometry, from the arc's own arc-length parameterisation:
 *   tip         = the arc's true end, (915.46, 63.45)
 *   base centre = 120.6 back along the arc, (800.01, 28.59)
 *   axis        = tip - base centre, 16.80deg — the chord across the head, which is what
 *                 PowerPoint orients an arrowhead to. The end tangent alone (23.05deg) cocks
 *                 the head off the line it is sitting on; the base tangent alone (12.17deg)
 *                 under-turns it.
 *   corners     = base centre +/- 60.3 along the axis normal
 * The stroke is cut 6 units short of the base (at 114.6 back) so it tucks under the triangle
 * rather than butting it exactly — the two edges are 4.6deg apart, so an exact join would
 * leave a hairline of background showing at one corner.
 */
const ARC_VIEWBOX = "0 0 1000 286.06";
const ARC_PATH = "M 531.61 0.29 A 500 143.03 0 0 1 806.04 29.92";
const ARC_HEAD = "M 782.58 86.32 L 915.46 63.45 L 817.43 -29.13 Z";

const DirectionReadout = memo(function DirectionReadout({ index }: { index: DirectionIndex }) {
  return <>{directions[index].title}</>;
});

const DirectionLabel = memo(function DirectionLabel({ index }: { index: DirectionIndex }) {
  return <>{directions[index].label}</>;
});

export default function ScrollIntro() {
  const [enhanced, setEnhanced] = useState(false);
  const [ready, setReady] = useState(false);
  const [preloadGone, setPreloadGone] = useState(false);
  const [active, setActive] = useState(true);
  const [directionIndex, setDirectionIndex] = useState<DirectionIndex>(0);

  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const canvasInnerRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const stageTitleRef = useRef<HTMLDivElement>(null);
  const stageLabelRef = useRef<HTMLParagraphElement>(null);
  const arcRef = useRef<SVGSVGElement>(null);

  const stateRef = useRef<SceneState>({ ...POSE_PARKED, direction: 0, backdrop: 0, tilt: 0 });
  const lastBucket = useRef<DirectionIndex>(0);

  // Fallback detection runs once, post-mount, so server + first paint always agree.
  useEffect(() => {
    const result = canEnhance();
    console.log("[DIAG] canEnhance() ->", result);
    if (result) setEnhanced(true);
  }, []);
  useEffect(() => {
    console.log("[DIAG] enhanced state is now", enhanced);
  }, [enhanced]);

  const handleReady = useCallback(() => setReady(true), []);

  // Cross-fade the static hero out once the model + junk-filter pass is done.
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setPreloadGone(true), 600);
    return () => window.clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    const pin = pinRef.current;
    if (!enhanced || !pin) return;

    gsap.registerPlugin(ScrollTrigger);

    const state = stateRef.current;
    const context = gsap.context(() => {
      // Base state for everything GSAP will scrub. Reverted with the context on refresh.
      gsap.set(arcRef.current, { ...ARC_INTRO, opacity: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        // A timeline's own onUpdate receives no arguments — read `state` directly.
        onUpdate: () => {
          const bucket = bucketForDirection(state.direction);
          if (bucket !== lastBucket.current) {
            lastBucket.current = bucket;
            setDirectionIndex(bucket);
          }
        },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=750%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => setActive(self.isActive),
        },
      });

      /*
       * Pacing. The deck itself is explicit about this: every slide 2-9 carries
       * `<p:transition p14:dur="1500">` (a 1.5s Morph) and slides 1-3 carry `advTm="2000"`
       * (a 2s auto-advance hold once the morph has landed). So a beat in the reference is
       * ~43% movement, ~57% settled — the pose, the copy and the graphic all reach their
       * final values and then simply *sit* there for longer than the move took.
       *
       * The timeline below is written to that ratio: each content stage runs its tweens in
       * roughly the leading 43% of its window and then holds, with the text/label fades
       * landing on the same frame as the pose they belong to rather than trailing it. That
       * only reads as a hold if there is real scroll distance behind it, which is why the
       * pin is `+=750%` rather than the 550% this used to be — the same tweens inside a
       * shorter pin would just be faster bursts separated by dead scroll.
       */

      // Stage 0 (0.00-0.06) — slide 1 held: ghost wordmark, model parked below frame.

      // Stage 1 (0.06-0.19) — slide 2: rise and pitch to 26.7deg, fact labels in.
      // Move 0.06-0.12, hold 0.12-0.19.
      timeline.to(state, { ...POSE_RAISED, duration: 0.06 }, 0.06);
      timeline.to(subtitleRef.current, { opacity: 0, duration: 0.03 }, 0.06);
      // Starts once the rise is underway and lands with it, so the labels are solid for the
      // whole hold instead of still fading when stage 2 begins pulling them back off.
      timeline.to(factsRef.current, { opacity: 1, duration: 0.035 }, 0.085);

      // Stage 2 (0.19-0.36) — slide 3: the close-up, plus the single callout block and the
      // backdrop instance. The backdrop is on the callout's beats exactly: slide 3 is the
      // only slide either of them appears on, so they share one visibility window.
      // Move 0.19-0.265, hold 0.265-0.36. This is the stage the pacing complaint was about:
      // the pose, the callout copy and the backdrop instance all finish together at 0.265,
      // leaving 0.095 (over half the stage) of genuinely settled frame before stage 3 starts.
      timeline.to(state, { ...POSE_CLOSE_UP, duration: 0.075 }, 0.19);
      timeline.to(factsRef.current, { opacity: 0, duration: 0.03 }, 0.19);
      timeline.to(calloutRef.current, { opacity: 1, duration: 0.05 }, 0.215);
      timeline.to(state, { backdrop: 1, duration: 0.05 }, 0.215);

      // Stage 3 (0.36-0.50) — slide 4: settle to the side view the rest of the deck holds.
      // Move 0.36-0.42, hold 0.42-0.50.
      timeline.to(state, { ...POSE_SIDE, duration: 0.06 }, 0.36);
      timeline.to(calloutRef.current, { opacity: 0, duration: 0.03 }, 0.36);
      timeline.to(state, { backdrop: 0, duration: 0.03 }, 0.36);
      timeline.to(noteRef.current, { opacity: 1, duration: 0.035 }, 0.385);
      timeline.to(arcRef.current, { opacity: 1, duration: 0.035 }, 0.385);

      // Stage 4 (0.50-0.63) — slide 5, ACCELERATION / Forward. The 3D pose is frozen from
      // here on: no pitch/yaw/roll or frame tween exists past 0.555, so the side view holds
      // for the rest of the pin. What still moves the product is `tilt`, the frame's flat 2D
      // rotation, and it runs as one sweep across the three stages rather than a value per
      // stage — each leg starts where the last one stopped, so the rock only ever turns one
      // way. Scrubbed like everything else here, so scrolling back up unwinds it.
      // Move 0.50-0.555, hold 0.555-0.63.
      timeline.to(titleRef.current, { opacity: 0, duration: 0.03 }, 0.5);
      timeline.to(noteRef.current, { opacity: 0, duration: 0.025 }, 0.5);
      timeline.to(arcRef.current, { ...ARC_FORWARD, duration: 0.055 }, 0.5);
      // Slide 4 -> 5: into the forward lean, on the arc's own beat.
      timeline.to(state, { tilt: TILT_FORWARD, duration: 0.055 }, 0.5);
      // Held back until the outgoing note has cleared, then landing with the lean.
      timeline.to(stageTitleRef.current, { opacity: 1, duration: 0.035 }, 0.52);
      timeline.to(stageLabelRef.current, { opacity: 1, duration: 0.035 }, 0.52);

      // Stage 5 (0.63-0.79) — slides 6/7, DEACCELERATION / Brake. Two slides, so two beats
      // of the same 43:57 shape rather than one long one: slide 6 flips the arc while the
      // forward lean still holds (move 0.63-0.665, hold to 0.71), then slide 7 brings the
      // tilt back to level (move 0.71-0.745, hold to 0.79).
      timeline.to(state, { direction: 1, duration: 0.03 }, 0.63);
      timeline.to(arcRef.current, { ...ARC_BRAKE, duration: 0.035 }, 0.63);
      timeline.to(state, { tilt: TILT_BRAKE, duration: 0.035 }, 0.71);

      // Stage 6 (0.79-0.95) — slides 8/9, REVERSE / Backward. Still flipped, new angle.
      // Same two-beat shape as stage 5: slide 8 repositions the arc while the model holds
      // level (move 0.79-0.825, hold to 0.87), slide 9 rocks back past it (move 0.87-0.905,
      // hold to 0.95).
      timeline.to(state, { direction: 2, duration: 0.03 }, 0.79);
      timeline.to(arcRef.current, { ...ARC_REVERSE, duration: 0.035 }, 0.79);
      timeline.to(state, { tilt: TILT_REVERSE, duration: 0.035 }, 0.87);

      // Stage 7 (0.95-1.00) — release into #overview.
      timeline.to(
        [stageTitleRef.current, stageLabelRef.current, arcRef.current, canvasInnerRef.current],
        { opacity: 0, duration: 0.04 },
        0.95,
      );
      timeline.to(pin, { backgroundColor: PAPER, duration: 0.04 }, 0.95);
    }, pin);

    return () => context.revert();
  }, [enhanced]);

  if (!enhanced) return <HeroFallback titleId="project-title" />;

  return (
    <div className={`scroll-intro ${poppins.variable}`} ref={pinRef}>
      {/* Behind the canvas, exactly as in the deck — the model passes in front of it. */}
      <h1 className="si-title" id="project-title" ref={titleRef}>
        HALOGRIP
      </h1>
      <div className="si-stage-title" ref={stageTitleRef} style={{ opacity: 0 }} aria-hidden="true">
        <DirectionReadout index={directionIndex} />
      </div>

      <div className={`scroll-intro-canvas${ready ? " is-visible" : ""}`}>
        <div className="scroll-intro-canvas-inner" ref={canvasInnerRef}>
          <ScrollIntroScene
            state={stateRef.current}
            backdropPose={POSE_CLOSE_UP_BACKDROP}
            onReady={handleReady}
            active={active}
          />
        </div>
      </div>

      <span className="si-subtitle" ref={subtitleRef}>
        [ CASE STUDY 001 ] &nbsp;/&nbsp; GOTHENBURG, SE / 2025
      </span>

      <div className="si-layer" ref={factsRef} style={{ opacity: 0 }} aria-hidden="true">
        {facts.map((fact) => (
          <p
            className={`si-note${fact.lead ? " is-lead" : ""}`}
            key={fact.text}
            style={{ left: fact.left, top: fact.top }}
          >
            {fact.text}
          </p>
        ))}
      </div>

      <div className="si-layer" ref={calloutRef} style={{ opacity: 0 }} aria-hidden="true">
        {callouts.map((callout) => (
          <p
            className={`si-note${callout.lead ? " is-lead" : ""}`}
            key={callout.text}
            style={{ left: "68.7%", top: callout.top }}
          >
            {callout.text}
          </p>
        ))}
      </div>

      <p className="si-note is-lead si-note-wide" ref={noteRef} style={{ opacity: 0 }} aria-hidden="true">
        Tilt-Based Control System Design
      </p>

      <p className="si-note is-lead si-stage-label" ref={stageLabelRef} style={{ opacity: 0 }} aria-hidden="true">
        <DirectionLabel index={directionIndex} />
      </p>

      <svg
        className="si-arc"
        ref={arcRef}
        viewBox={ARC_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        /*
         * The viewBox is the *shape* box — the ellipse's own bounds — so the 10pt stroke and
         * the arrowhead both legitimately hang outside it (the head's far barb reaches
         * y=-29.1 against a viewBox starting at 0). PowerPoint never clips a shape's outline
         * to its frame; an `<svg>` does, by UA stylesheet, which was slicing the top off the
         * triangle. Overriding it here rather than in the stylesheet keeps the frame
         * percentages the tween writes untouched.
         */
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {/*
          The 70% alpha belongs to the shape as a whole, exactly once. Putting it on the
          stroke and on the head separately double-blends wherever the two overlap, printing
          a dark bar across the arrowhead. Group opacity composites the line and its head
          together first, then fades the result.
        */}
        <g opacity="0.7">
          <path d={ARC_PATH} fill="none" stroke="var(--accent)" strokeWidth="40.2" strokeLinecap="butt" />
          <path d={ARC_HEAD} fill="var(--accent)" />
        </g>
      </svg>

      {!preloadGone && (
        <div className={`scroll-intro-preload${ready ? " is-hidden" : ""}`} aria-hidden="true" />
      )}
    </div>
  );
}
