# CLAUDE.md

Rules and context for working on Sylvia Xie's portfolio site. Read this before making changes.

## What this project is

A Next.js 16 (App Router) + React 19 + TypeScript portfolio site for Sylvia Xie, an industrial
designer. It has two kinds of pages:

- **`/` — the homepage.** A general portfolio landing page (hero, project grid, about,
  experience, testimonials, contact) styled to match Sylvia's Framer reference site
  (https://sylviaxie.framer.website/).
- **`/work/<slug>` — individual project case-study pages.** Each one is a self-contained,
  bespoke-designed page for a single project. The first and only one so far is
  `/work/halogrip` (an emergency steering wheel concept for autonomous vehicles, a master's
  thesis with Autoliv/Chalmers).

More project pages will be added over time as Sylvia has content for them.

## Hard rules — read before touching styles or structure

1. **Each project case-study page keeps its own bespoke visual style.** Do not unify
   `/work/halogrip` (or future project pages) into the homepage's design system. This was an
   explicit decision from Sylvia. HALOGRIP is red/black/Nimbus-Sans-Narrow on purpose — leave it
   alone unless she asks to redesign it specifically.
2. **CSS isolation is load-bearing, not incidental.** `app/globals.css` is shared across every
   route (Tailwind import + `@theme` tokens + a minimal reset). `app/work/halogrip/halogrip.css`
   is imported *only* from `app/work/halogrip/page.tsx` — Next.js code-splits it per route, so it
   never loads on `/`. When adding a new project page with its own custom CSS, follow the same
   pattern: a route-scoped `<slug>.css` imported only from that route's `page.tsx`, never added to
   `globals.css`.
3. **Any addition to the shared reset in `globals.css` must go inside `@layer base { ... }`.**
   Unlayered CSS beats Tailwind's `@layer utilities` regardless of class specificity — this
   already caused a real bug once (a bare `a{color:inherit}` silently broke every `text-*` utility
   on links, e.g. made the Contact section's "Let's talk" button text invisible). Do not add plain
   unlayered rules to `globals.css` again.
4. **The homepage uses Tailwind v4 utility classes**, not hand-written CSS (see `@theme` block in
   `app/globals.css` for the custom tokens: `--color-bg`, `--color-ink`, `--color-muted`,
   `--color-tertiary`, `--color-line`, `--radius-card`, `--font-heading`, `--font-body`,
   `--font-mono`). Keep new homepage components consistent with this — don't introduce more
   hand-written CSS classes there.
5. **Placeholder content stays obviously fake until Sylvia replaces it.** Use the
   `PlaceholderImage` component (`app/components/PlaceholderImage.tsx`) for any image without a
   real asset yet — never a broken `<img src>`. Flag placeholder text/links with a
   `// TODO(sylvia): ...` comment at the definition site (see `app/data/*.ts` and the homepage
   components for examples) so they're easy to grep later.
6. **"Coming soon" project cards are intentionally non-clickable** (`comingSoon: true`, no `href`
   in `app/data/projects.ts`) — plain `<div>`, not a link to a dead-end page. Only add a real
   `<Link>` once a project actually has a page to link to.

## Structure reference

```
app/
  layout.tsx              Root layout — generic site metadata, next/font/google (Inter Tight,
                           Inter, DM Mono) loaded here as CSS variables
  page.tsx                Homepage, composed from app/components/home/*
  globals.css              Shared: Tailwind import + @theme tokens + @layer base reset
  data/
    projects.ts            Drives the homepage project grid
    experience.ts           Homepage Experience timeline entries
    testimonials.ts        Homepage testimonial placeholders
  components/
    PlaceholderImage.tsx    Shared placeholder box (div, not a broken <img>)
    home/                   Homepage-only components (SiteHeader, Hero, ProjectGrid/ProjectCard,
                             ScrollZoomImage, TwoColumnSection, LogoMarquee, AboutCard,
                             ExperienceTimeline, TestimonialsCarousel, ContactSection, SiteFooter)
  work/
    halogrip/
      page.tsx              HALOGRIP case study — own `metadata` export, own CSS import
      halogrip.css          HALOGRIP-only styles (fonts, tokens, all component classes)
      interaction-deck.tsx  Client component, steering-state demo ("use client")
      scroll-intro*.tsx/css Pinned scroll-driven 3D opening (R3F + GSAP ScrollTrigger), ported
                             1:1 from Sylvia's PowerPoint reference — see Recent changes
public/
  media/                   HALOGRIP's images (kept flat at /media/*.webp; not yet reorganized
                            per-project since there's only one project with real assets)
  home/                    Homepage's real assets (avatar, portrait, logos/, projects/) — see
                            Recent changes below for the source→destination mapping
  fonts/                   HALOGRIP's self-hosted fonts (Nimbus Sans Narrow, DejaVu Sans Mono)
```

## Open items Sylvia still needs to supply

These currently ship as flagged placeholders (grep for `TODO(sylvia)`):

- Real contact email + social links (LinkedIn/Instagram hrefs are currently placeholder root URLs)
- Real CV link/file
- Real testimonials (3 placeholder slots currently in `app/data/testimonials.ts`)
- Real per-project tags for the hover ticker on each project card (`PLACEHOLDER_TAGS` in
  `app/data/projects.ts`, used by `ProjectCard.tsx`'s hover-reveal tag ticker)
- Real thumbnail for the HALOGRIP card itself — the other 3 project cards now have real cover
  photos, HALOGRIP's `image` field points at `/home/projects/halogrip-cover.png` (already real)
- Whether the 2018–2019 "Bachelor Thesis Student · Apple" entry (seen in the Framer reference) is
  real — it looked like unedited template filler and was deliberately omitted from
  `app/data/experience.ts`
- Confirm intended assignment of the still-unused `Namnlös design (1).jpg` (grey concept car
  render), left in `public/mainpage picture/` — not wired into any project card yet
- The homepage's logo marquee (`chalmers logo.svg`) markup looks scraped from a web page (purple
  `#6746EB` before recoloring, Tailwind-style classes baked into the SVG) rather than Chalmers'
  official seal — flagging in case it's the wrong sub-brand mark

## Deployment

- Hosted on **Vercel**, live at https://halogrip-portfolio.vercel.app
- Source pushed to GitHub: `sylvia990317-bot/halogrip-portfolio`
- GitHub → Vercel auto-deploy-on-push is **not yet connected** (Vercel account needs a GitHub
  login connection added manually in the Vercel dashboard first). Until then, deploy manually
  from this directory with `vercel --prod --yes`.

## Recent changes

### Fixed site-wide broken images after a `public/media/` reorg (this session)
- `public/media/`'s flat image files (`hero.webp`, `emergency.webp`, `product-*.webp`,
  `story-*.webp`, `id-one/two.webp`, `hud.webp`, `sketches.webp`, `prototype.webp`,
  `night-city.webp`, `concept-*.webp`, `Bild1.png`, etc.) were moved into a new
  `public/media/halogrip图片/other/` folder (with `2.1`/`2.2`/`2.3`/`2.4` subfolders holding new
  bespoke assets for the CABIN SHIFT / REAL WORLD NEED work below) outside this session — by the
  time this session picked up, `page.tsx`'s two newest sections (02.1 CABIN SHIFT, 02.2 REAL
  WORLD NEED) already correctly pointed at the new `halogrip图片/...` paths, but every other
  image reference across the page (`overview-backdrop.tsx`'s background photo, the research
  gallery, design-principles product shot, concept-exploration sketches/grid, prototype-testing
  photo, final-hero background, product-detail shot, `interaction-deck.tsx`'s control image, the
  emergency-handover story grid + ID/HUD images, `scroll-intro.tsx`'s hero image, and the page's
  OpenGraph/Twitter metadata images) still pointed at the old flat `/media/*.webp` paths, which no
  longer resolve — this is what made the OVERVIEW background photo (and effectively every other
  image on the page) disappear.
- Fixed by repointing every stale reference to `/media/halogrip图片/other/<file>`, each wrapped in
  `encodeURI(...)` (matching the convention the two newer sections already used for the non-ASCII
  folder name — plain unencoded template-literal paths with non-ASCII segments are the kind of
  thing that can silently 404 depending on how the string reaches the browser). Verified every
  referenced filename actually exists under the new path (`ls`/`find`), `npm run build` stayed
  clean, and confirmed in-browser that the OVERVIEW photo and other previously-broken images
  render again.
- Note for future sessions: `scroll-intro-scene.tsx`'s `/media/image2.png` mention is just a code
  comment referencing a path *inside* the source `.pptx` zip (`ppt/media/image2.png`), not a real
  asset reference — left alone, not part of this bug.
- Also note: the "THE CHALLENGE split into 4 placeholder subsections" entry directly below this
  one (from earlier in this session) is now partly superseded — 02.1 CABIN SHIFT and 02.2 REAL
  WORLD NEED were subsequently rebuilt with real bespoke layouts/imagery/copy (outside this
  session's own edits, structure not fully re-documented here yet); 02.3 CURRENT SOLUTION and
  02.4 DESIGN GAP were still the plain `PlaceholderImage` scaffolding described below as of this
  writing.

### THE CHALLENGE (02) split into 4 placeholder subsections: CABIN SHIFT / REAL WORLD NEED / CURRENT SOLUTION / DESIGN GAP (this session)
- Replaced the single `.challenge` hero section (full-bleed `emergency.webp` background, REMOTE
  HELP / PUSH-TOW / NO OVERRIDE three-reasons grid) with 4 stacked sibling sections — `[ 02.1 /
  CABIN SHIFT ]`, `[ 02.2 / REAL WORLD NEED ]`, `[ 02.3 / CURRENT SOLUTION ]`, `[ 02.4 / DESIGN
  GAP ]` — at Sylvia's request, as placeholder scaffolding only; she'll give real content/design
  direction for each in a future session.
- Deliberately lightweight: everything is plain inline JSX in `page.tsx` (no new component
  files, no GSAP/ScrollTrigger, no custom SVG, no reveal-on-scroll animation) — this project's
  history shows these exact scenes (`real-world-scene.tsx`, `response-scene.tsx`,
  `design-gap-scene.tsx` from the reverted `60bad72`/"26082602" checkpoint) got fully rewritten
  from scratch once real direction arrived, so there was no benefit to building bespoke structure
  now. Each of the 4 sections shares one skeleton: eyebrow → heading+body copy → one
  `PlaceholderImage` (`app/components/PlaceholderImage.tsx`, imported via
  `../../components/PlaceholderImage`).
- Copy is a draft carried over from the reverted `60bad72` version's wording (per Sylvia's
  choice), not freshly invented — every heading/body block has its own
  `{/* TODO(sylvia): draft copy carried over from an earlier revision (commit 60bad72) —
  review/replace headline + body */}` comment, and every `PlaceholderImage` has its own
  `{/* TODO(sylvia): replace with a real ... */}` comment above it (per Hard Rule 5). The old
  "CURRENT RESPONSE" label is now "CURRENT SOLUTION" per Sylvia's explicit renaming — its copy
  still covers the same call/verify/authorize-or-dispatch/move-or-tow process, just relabeled.
  02.2's "74 AV-related disruptions" stat carried its existing `TODO(sylvia): verify and cite the
  source` flag forward.
- CSS: removed all 8 old `.challenge*` rules from `halogrip.css` and added a shared
  `.challenge-scene` base (padding-block + a `border-top` seam between subsections, sized to
  match `.principles`/`.journey`'s stacked-section rhythm) plus `.challenge-scene-inner`/
  `-copy`/`-image`. The 4 per-section modifier classes (`.challenge-scene-cabin`, `-need`,
  `-solution`, `-gap`) are wired into the JSX as hooks but intentionally carry no CSS of their
  own yet — no per-section tweaks were invented ahead of real design direction. Updated the
  shared display-font selector (`.hero-heading h1,.section h2,...`) to point at `.challenge-scene
  h2` instead of the removed `.challenge h2`. Mobile override (the file's one
  `@media(max-width:760px)` block) updated in place to match the new classes.
- Verified via `npm run build` (clean) and dev-server screenshots scrolling through all 4
  sections into `#research` (no overlap, seams render correctly); the mobile CSS rule was
  sanity-checked by injecting the new mobile-breakpoint rules as a scratch `!important` override
  at the current ~1536px automation viewport (confirms the `PlaceholderImage` aspect-ratio
  actually switches to `1.4/1` etc.) rather than a real narrow-viewport resize, then removed —
  same technique other sessions in this file have used for the same tooling limitation.

### Git history: reverted to the 26082601 snapshot, then re-applied just the OVERVIEW change (this session)
- The working tree had drifted through several dated checkpoint commits (`26082601` →
  `26082602` → `26082603` → two follow-up commits literally titled "破了，得重新做"/"垃圾" —
  "broken, redo"/"garbage" — indicating that work regressed). At Sylvia's request the tree was
  restored to match the `26082601` commit's content, twice (`git rm -rf .` +
  `git checkout <commit> -- .` + a new commit, not `reset --hard`, so full history stays intact
  and nothing was force-pushed). In between she asked to check `26082602` specifically to see
  whether THE CHALLENGE (02) had already been split into subsections there (it had — 4 files:
  `challenge-chapter.tsx`, `design-gap-scene.tsx`, `real-world-scene.tsx`, `response-scene.tsx`)
  before deciding to land on `26082601` instead, which predates that split entirely.
- Net effect: this file, `app/work/halogrip/page.tsx`, and `app/work/halogrip/halogrip.css` are
  currently at the `26082601` shape (THE CHALLENGE is still the old single `.challenge` section
  with the REMOTE HELP / PUSH-TOW / NO OVERRIDE three-reasons grid — **not** the 5-scene
  `ChallengeChapter` described in older revisions of this file's history). If a future session
  finds this file's "Structure reference" not mentioning `challenge-chapter.tsx` etc., that's why
  — it's not a documentation gap, the files really aren't here right now.
- With the tree at `26082601`, Sylvia asked for just the OVERVIEW (section 01) content/layout
  edit that `26082602` had introduced — without pulling back the THE CHALLENGE split — so it was
  re-applied by hand on top of the reverted tree (not by re-merging `26082602`):
  headline changed to "WHEN THE VEHICLE STOPS,<br/>THE RESPONSE SHOULD NOT.", body copy collapsed
  to one line ("HALOGRIP is a compact, low-speed fallback interface that lets authorized first
  responders reposition a stalled robotaxi on site."), and the `<figure className="city-banner">`
  (city photo + "74 AV-related disruptions" `stat-panel` figcaption) was deleted outright — same
  content edit `26082602` made, same reasoning: the "74" stat wasn't otherwise used anywhere in
  this `26082601`-based tree, unlike in `26082602` where it had already moved into
  `real-world-scene.tsx`'s 02.2 scene. `.overview` went from a 2-column grid to
  `display:grid;place-items:center;text-align:center`; `.city-banner`/`.stat-panel*` rules were
  deleted from `halogrip.css` as dead CSS.
- Follow-up bug found by Sylvia after that edit: the OVERVIEW background photo
  (`overview-backdrop.tsx`'s `.overview-bg`, `position:absolute;inset:0`) was rendering narrow —
  capped to `.shell`'s `width:min(100%,1700px)` instead of full-bleed — because `shell` was on
  the outer `<section className="overview section shell">` itself, so the absolutely-positioned
  background's containing block was that already-narrowed section. Fixed by moving `shell` off
  the outer section onto a new inner `<div className="overview-content shell">` wrapping just the
  eyebrow marker + copy (mirrors how `.challenge`/`.challenge-content` already split
  background-vs-content this exact way): outer section keeps `overview section` only, background
  is now full-bleed to the viewport, content stays constrained/centered inside the new wrapper.
  Added `overflow:hidden` to `.overview` to match `.challenge`'s pattern.
- Second follow-up: `.overview{min-height:850px}` didn't fill the viewport on the reviewer's
  actual screen (a 2560×1271 display — 850px left visible empty space above/below). Changed to
  `min-height:100vh` so the section is full-screen the moment it's scrolled into view, matching
  Sylvia's ask ("看到overview的时候是满屏"). The `max-width:760px` mobile override
  (`.overview{min-height:auto;padding-block:90px}`) was left untouched — not requested, and mobile
  intentionally sizes to content there rather than forcing full-screen.
- Verified via `npm run build` (clean each step) and dev-server screenshots at `#overview`'s live
  scroll position (same "layout can shift mid-scroll" caveat as other sessions in this file — this
  page's pinned `ScrollIntro` GSAP timeline affects document height while scrolling).

### Multi-project restructure (earlier session)
- Moved the entire former `app/page.tsx` (the HALOGRIP case study) to `app/work/halogrip/page.tsx`
  unchanged, with its CSS split out into `app/work/halogrip/halogrip.css` and its
  `interaction-deck.tsx` moved alongside it.
- Trimmed `app/globals.css` down to a shared Tailwind setup + `@theme` design tokens for the new
  homepage.
- Built a new `app/page.tsx` homepage cloned from Sylvia's Framer site
  (https://sylviaxie.framer.website/), using Tailwind utility classes throughout, with 1 real
  project card (HALOGRIP) + 3 "coming soon" placeholder cards.
- Added `next/font/google` (Inter Tight, Inter, DM Mono) to `app/layout.tsx` and split metadata
  so the root layout is generic and HALOGRIP's specific metadata lives on its own page.
- Fixed a cascade-layer bug where an unlayered `a{color:inherit}` reset was overriding Tailwind
  utility text colors (see Hard Rule 3 above).
- **Not yet done**: redeploying this to Vercel — the live site still shows the old single-page
  version as of this writing.

### Homepage real assets + animation pass (this session)
- Wired real images/logos into every homepage placeholder slot: header avatar, about-section
  portrait, all 4 logo-marquee marks (Cstrider/Volvo/Chalmers/Autoliv, recolored solid black,
  equal-size slots), and 3 of 4 project card covers (HALOGRIP, Maritime HMI Design, Truck Sensory
  Design, Maize Drying System). Source files moved from `public/mainpage picture/` into a clean
  `public/home/` structure (see that folder for the mapping); one file
  (`Namnlös design (1).jpg`) is still unused, left in place.
- Renamed all 4 project card titles to Sylvia's confirmed real names (`app/data/projects.ts`);
  the 3 non-HALOGRIP cards stay `comingSoon: true` / no `href` per Hard Rule 6, just with real
  photos and captions instead of gray placeholders.
- Compared homepage animations against the Framer reference and fixed mismatches:
  - `Hero.tsx`: added a letter-by-letter blur-in reveal for "Industrial Designer" (own `<style>`
    keyframe block, no `globals.css` change).
  - `SiteHeader.tsx`: fades in ~1.25s after the hero reveal finishes (was simultaneous before).
  - `LogoMarquee.tsx`: keeps its auto-scrolling marquee (confirmed with Sylvia this should stay,
    despite the reference itself appearing static when inspected).
  - New `ScrollZoomImage.tsx` (`"use client"`): wraps each project card cover in a scroll-linked
    zoom — scale ~1.0 when the card is vertically centered in the viewport, growing to ~1.22 near
    the top/bottom edges, measured directly off the reference site's own scroll behavior.
  - `ProjectCard.tsx`: subtitle is now hover-only (`group-hover:opacity-100`), and hovering
    reveals a full-width scrolling tag-pill ticker over the cover image (placeholder tags for now,
    `app/data/projects.ts`).
- `npm run build` failed at the time on a TypeScript error in
  `app/work/halogrip/scroll-intro-scene.tsx` (`OrthographicCamera.aspect`) from in-progress work
  on the HALOGRIP scroll-intro scene that this session didn't touch — since fixed (see the
  scroll-intro entry below); `npm run build` is clean again as of this writing. All homepage work
  above was verified via the dev server + browser inspection instead (computed styles,
  `getAnimations()`, console-error checks), not `npm run build`.

### Homepage polish pass — corrections after direct reference-site instrumentation (this session)
Several follow-up rounds, each fixing a specific mismatch found by measuring the live reference
site's DOM/computed styles rather than guessing:
- `ScrollZoomImage.tsx`: the scroll-linked zoom was rebuilt from a symmetric
  distance-from-viewport-center formula to an **entry-progress-from-the-bottom-edge-only**
  formula (`entryProgress = clamp01((viewportH - rect.top) / rect.height)`). The old version also
  re-zoomed as a card exited near the top edge; the reference only reacts to the bottom edge —
  confirmed by polling the reference's own `getBoundingClientRect()`/`matrix3d` during scroll.
- `ProjectCard.tsx`, three separate bugs/mismatches found and fixed:
  - The hover tag-ticker used `animation-play-state: paused/running` toggling, which does **not**
    reset a CSS animation's progress — every hover resumed from wherever it last stopped instead
    of starting at `translateX(0)`. Fixed by only attaching `group-hover:animate-[tag-ticker_...]`
    at all on hover (no animation in the default state), so it's always fresh. Ticker background
    also changed from a dark gradient to the reference's measured `#f4f4f6`.
  - The title/subtitle caption was a detached block below the image with a gap; the reference
    fuses it to the image's bottom edge as one rounded card. Rounding/clipping moved from
    `ScrollZoomImage`'s className up to the card's root element; the caption is now
    `absolute inset-x-0 bottom-0` with `bg-[#f4f4f6]`, growing its `max-height` on hover
    (bottom-anchored, so it visibly grows *upward* into the photo) to reveal the subtitle stacked
    below the title, rather than the title/subtitle sitting side-by-side.
  - Sizing iterated up in a few rounds per Sylvia's feedback: title is `text-xl` (was `text-lg`),
    ticker padding/text bumped to `px-6 py-5`/`text-sm` (was `px-4 py-2`/`text-[10px]`).
- `app/globals.css`: `--radius-card` reduced from `52px` to `20px` — matches the reference card's
  measured `border-radius` exactly (`getComputedStyle` on its outer `<a>`). Affects every
  `rounded-card` use (project cards, about-section portrait).
- `ContactSection.tsx`: added the "Contact" eyebrow pill above the heading (same pattern as
  About/Experience/Testimonials — was missing entirely). "Let's talk" button flipped from solid
  black/light-text to the reference's actual style: light pill (`bg-bg text-ink`, matching its
  measured `rgb(249,249,250)`/`rgb(20,20,21)`), bigger padding, plus a blurred orange-red radial
  glow (`rgba(255,77,46,...)`) sitting behind/under it, reproducing the reference's glow div.
  `SiteFooter.tsx` deliberately left alone — Sylvia confirmed the reference has no equivalent
  footer but wants to keep ours anyway.
- Added a **`CLOSE PROJECT` button** to `/work/halogrip` (`page.tsx` + `.close-project*` rules in
  `halogrip.css`) — Sylvia's request, not a reference-site match. `position: fixed` top-right,
  black pill/white text, stays visible through the whole scroll (verified past 1500px of scroll).
  Hover reveals a duplicate stacked copy of the label sliding up (`translateY(-38px)`, one
  line-height) to read as "selected." Hit one bug while building it: `align-items: center` on the
  outer pill centered the two-line text track inside the clipped window, showing the seam between
  both copies instead of one clean line — fixed with `align-items: flex-start`.

### HALOGRIP scroll-intro: ported 1:1 from PowerPoint reference (this session)
- The pinned scroll-driven 3D opening (`scroll-intro.tsx` / `scroll-intro-scene.tsx` /
  `scroll-intro.css`, R3F + `three` + GSAP `ScrollTrigger`, real product model at
  `public/models/halogrip.glb`) was rebuilt to match a reference animation Sylvia had already
  designed in PowerPoint (`public/media/Final Presention for claude12.pptx`, a real embedded 3D
  Model object + Morph transitions across 9 slides), rather than the text-brief guess a first
  pass had shipped. Ground truth (exact per-slide pitch/yaw/roll, on-screen frame, text, colors,
  font, and a custom directional-arrow shape) was extracted straight from the `.pptx`'s OOXML —
  it's a zip; `ppt/slides/slideN.xml`'s `<am3d:model3d>` element and `<p:xfrm>` have the numbers.
- Confirmed with Sylvia and implemented: accent color is `#2D5391` (`--accent` in
  `halogrip.css`, replacing an earlier invented `--navy`), font is **Poppins** via
  `next/font/google` scoped to this route only (not the page's usual Nimbus Sans Narrow — a
  deliberate, confirmed exception for just this section). The part-callout stage is one static
  text block (not per-part 3D-tracked labels), and the Forward/Brake/Reverse stage keeps the
  model's **3D** pose frozen at the side view (there is no separate Neutral state).
- The Forward/Brake/Reverse stage does rock the product, and that rock is not a 3D move: every
  one of slides 4-9 freezes `<am3d:rot>` at the side view, and what Morph actually animates is
  the `rot` attribute on each slide's `<p:graphicFrame>`'s `<p:xfrm>` — a flat, in-the-picture-
  plane turn of the whole rendered frame. Decoded (60000ths of a degree, clockwise, absent = 0)
  that is one continuous sweep, never doubling back: slide 4 = 0, slides 5-6 = +15.12, slides
  7-8 = 0, slide 9 = -22.79 (stored as 337.21). It rides on its own `SceneState.tilt` channel,
  deliberately not on `pitch` — `pitch` is the slide 1-4 approach and stays parked afterwards.
  The scene applies it to the `place` group, i.e. about the camera's own view axis, *outside*
  the pose rotation. Do not fold it into pitch/yaw/roll: at yaw -90 both of the other Euler
  channels have landed on world X, so composing there foreshortens the side view instead of
  rocking it (an earlier draft's bug). Note it disagrees in direction with
  `interaction-deck.tsx` further down the page, whose FORWARD is -16 (anticlockwise) against
  this stage's +15.12 (clockwise) for the same word — the deck's numbers are that component's
  own, the intro's come from the PPT; flagged for Sylvia, not reconciled.
- Camera is `OrthographicCamera`, not perspective — required so the model's on-screen size
  matches the deck's frame percentages exactly at every pose; a perspective camera measurably
  over-sized the side-view pose.
- Verified: `npm run build` and `npx tsc --noEmit` both clean; scroll sequence checked stage by
  stage against the deck's own rasterized per-pose renders (`ppt/media/image*.png` inside the
  pptx) since the paired screen-recording video wouldn't play back reliably in-browser; reversal
  (scroll to bottom then back to top) mirrors correctly; mobile/no-WebGL/reduced-motion fallback
  still renders the plain static hero.
- Slide 3's second copy of the model is now in (Sylvia confirmed she wants it). That slide layers
  two instances, so `scroll-intro-scene.tsx` renders two: the persistent one the whole timeline
  scrubs, and a stage-2-only backdrop that fades in and out on the callout block's exact beats
  (`SceneState.backdrop`, tweened at 0.30 and 0.40 alongside `calloutRef`). Per-instance notes:
  - The fit mechanism is the standalone `fitToFrame(place, rotate, pose, silhouette, lens,
    scratch, depth)` — it takes an instance's pose and frame as arguments, so the scrubbed
    `SceneState` and the backdrop's frozen `Pose` run through identical code.
  - Which slide-3 pose belongs to which instance was corrected once and is now confirmed: the
    persistent model takes the **left** pose (26.5/-50.4/-20.7, `POSE_CLOSE_UP`) and the backdrop
    the **right** one (43.1/29.8/24.6, `POSE_CLOSE_UP_BACKDROP`) — matching slide 3's own z-order,
    where the left copy is the later shape and therefore on top. This also makes the whole
    sequence turn 0 -> -50 -> -90 in one direction instead of doubling back.
  - `Object3D.clone()` shares material references (checked against this GLB: 21 meshes, 13
    materials, all shared), so the backdrop clones its own or fading it would fade the primary.
  - The backdrop's meshes get an explicit near-to-far `renderOrder`. Without it a translucent
    solid double-blends wherever the default back-to-front order applies, and the instance comes
    out visibly blotchy rather than uniformly faded.
- Nothing from this pass has been committed to git — changes are sitting in the working tree.

### HALOGRIP scroll-intro: pacing, arc, and lighting fixes (this session)
- **Pacing.** The PPT's own timing (unzip the pptx, `ppt/slides/slideN.xml`'s `<p:transition>`)
  is a consistent 1500ms Morph on every slide 2-9, plus a 2000ms hold (`advTm="2000"`) on slides
  1-3 before auto-advancing — roughly a 43:57 move:hold ratio. The first PPT-accurate pass didn't
  reproduce this: pose/opacity tweens spanned almost the entire width of each scroll stage,
  leaving near-zero dwell time, so elements (the callout block, the stage-2 backdrop instance)
  were still mid-fade when the next stage already started clearing them. Fixed by raising the pin
  distance from `+=550%` to `+=750%` (shrinking tween durations inside the same budget would just
  make the same distance mostly dead, not add real dwell time) and rebalancing every content stage
  to roughly that 43:57 ratio, with fades landing on the *same* beat as the pose/element they
  belong to rather than trailing it. New stage boundaries: S0 0-0.06, S1 0.06-0.19, S2 0.19-0.36,
  S3 0.36-0.50, S4 0.50-0.63, S5 0.63-0.79, S6 0.79-0.95, S7 0.95-1.0 (S5/S6 each now carry two
  beats, since they each cover two source slides).
- **Lighting / "buttons look black instead of silver."** Root cause: six of the GLB's thirteen
  materials ("纹理铝") are `metalness:1, roughness:0.1` — a pure metal has no diffuse term, so
  under point/directional lights alone it can only return a few specular pinpoints and otherwise
  reads as black. The missing input was an environment, not more lamps. Fixed in
  `scroll-intro-scene.tsx`: added a `StudioEnvironment` (three's built-in `RoomEnvironment`, no
  network fetch, baked once via `PMREMGenerator` into `scene.environment`), and replaced the
  placeholder lighting with the deck's own real rig, read straight out of `<am3d:model3d>`'s
  `<am3d:ambientLight>`/`<am3d:ptLight>` elements: ambient (.5,.5,.5 @ illuminance 0.5) plus a warm
  key / cool fill / violet rim point light at the PPT's own colors and a 9.77 : 12.25 : 3.13
  intensity ratio (positions used as normalized directions at a fixed radius, `decay={0}` so
  brightness doesn't shift when `fitToFrame` rescales the model). Verified side-by-side against
  the deck's own cached `ppt/media/slide2.png`-equivalent render.
- **Backdrop opacity.** Was capped at a deliberate 0.5 (invented, to keep the callout text
  legible over it) — but neither `<am3d:model3d>` shape in the deck has any alpha effect; the
  ground truth is fully opaque. Changed `BACKDROP_OPACITY` to 1. No legibility conflict in
  practice: the backdrop's frame bottoms out at 57% viewport height, the callout starts at 68.1%,
  they don't overlap.
- **Arc/arrowhead — two real bugs, not one.** (1) `ARC_PATH` had originally been built by treating
  the PPT arc preset's `adj1`/`adj2` as literal ellipse parametric angles; they're true geometric
  angles and the `arc` preset applies its own `atan2`-based conversion first — on a 500x143 box
  this put both path endpoints tens of px off and the end tangent ~30° out, which is what first
  showed up as a misaligned triangle. Recomputed from the real conversion (verified against
  PowerPoint's own exported slide images to sub-pixel accuracy). (2) After that fix, the triangle
  was still visibly wrong in a way that turned out to have nothing to do with the earlier flip
  (`scaleX(-1)`) suspicion — a controlled test proved the CSS mirror was rendering a faithful,
  undistorted mirror image both times. The actual cause: DrawingML shortens a line by the
  arrowhead's own length so the head sits neatly *on* the stroke's end; SVG `marker-end` does not
  — the stroke kept running full-length underneath the triangle, so its butt cap poked out past
  one flank (the "notch"), the arc's own curvature across that span misaimed the auto-oriented
  head (the "squashed diamond"), and the tip never actually cleared the line (it read as buried,
  not pointed). Fixed by cutting the stroke back to the head's base and replacing the
  `orient="auto"` `<marker>` with an explicitly-computed triangle polygon (tip position kept from
  the earlier fix; base/axis computed from the *chord* across the head — not the end tangent or
  base tangent, chord is what PowerPoint itself orients an arrowhead to; head size kept at 3x
  stroke width per the deck's own `<a:tailEnd type="triangle" w="med" len="med"/>`). Verified with
  tight zoomed screenshots on all three states (Forward/Brake/Reverse): clean triangular tip
  clearly proud of the line, no notch, symmetric barbs, in every state.
- Nothing from this pass has been committed to git either — still sitting in the working tree.
