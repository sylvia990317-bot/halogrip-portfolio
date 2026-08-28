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
   explicit decision from Sylvia. HALOGRIP is red/black/Koulen-and-Roboto-Mono on purpose (see
   Recent changes — swapped from Nimbus Sans Narrow/DejaVu Sans Mono this session) — leave it
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
      halogrip.css          HALOGRIP-only styles (font-size tokens + --display/--mono
                             tokens, all component classes) — see Recent changes for the
                             Koulen/Roboto Mono type-scale overhaul
      interaction-deck.tsx  Client component, steering-state demo ("use client")
      scroll-intro*.tsx/css Pinned scroll-driven 3D opening (R3F + GSAP ScrollTrigger), ported
                             1:1 from Sylvia's PowerPoint reference — see Recent changes
public/
  media/                   HALOGRIP's images (kept flat at /media/*.webp; not yet reorganized
                            per-project since there's only one project with real assets)
  home/                    Homepage's real assets (avatar, portrait, logos/, projects/) — see
                            Recent changes below for the source→destination mapping
  fonts/                   HALOGRIP's old self-hosted fonts (Nimbus Sans Narrow, DejaVu Sans
                            Mono) — superseded by Koulen/Roboto Mono (next/font/google, loaded
                            in page.tsx), left on disk unused, not deleted
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

### Section padding-block tightened ~30% after the mason-wong.com resize made the page feel "too zoomed in" (this session, follow-up)
- Right after the previous entry's literal-pixel resize, Sylvia reported the whole page now feels
  too large/dense — needing to zoom the browser out to 60-75% to see a full section at once. An
  Explore agent audit ruled out the font sizes themselves as fixed-container overflow bugs (the
  handful of fixed-height containers it flagged — `.close-project`, `.interaction-buttons button`,
  `.final-specs` — all use `min-height`/auto-growing layout, so bigger text just grows the box, it
  doesn't clip); the real cause is additive density: HALOGRIP has far more small-text elements per
  page (metadata grids, findings lists, footers, index numbers) than mason-wong.com's sparser
  layout, so flattening every small tier to mason's 12px floor compounds across dozens of elements
  even though each individual change was small. Sylvia's explicit direction (confirmed via
  `AskUserQuestion`): don't touch font sizes again — they should stay pinned to mason's numbers —
  tighten the surrounding whitespace instead.
- Cut the 7 largest section-level `padding-block` values in `halogrip.css` by ~30% (min/max/vw all
  scaled down together, selectors untouched): `.section` `clamp(108px,15vw,205px)`→
  `clamp(76px,10.5vw,144px)`, `.challenge-scene` `clamp(100px,14vw,170px)`→`clamp(70px,10vw,120px)`,
  `.principles` `clamp(135px,17vw,220px)`→`clamp(95px,12vw,154px)`, `.concepts` (bottom only)
  `160px`→`112px`, `.sketch-process` `clamp(90px,12vw,150px)`→`clamp(63px,8.5vw,105px)`, `.journey`
  `clamp(130px,16vw,205px)`→`clamp(91px,11vw,144px)`, `.site-footer` `130px 40px`→`92px 40px`. The
  `@media(max-width:760px)` mobile overrides for these same selectors were deliberately **left
  untouched** — Sylvia's complaint was specifically about desktop browser zoom, and mobile was
  already noticeably tighter than desktop before this change; `--gutter` (horizontal shell padding)
  was also left alone since the complaint was about vertical density, not horizontal.
- While investigating, the Explore agent flagged `.concept-deck-card-label` (section 05's per-card
  "CONCEPT 01 / Screen + External Device" label) as a possible risk: it sits `flex:none` above a
  `flex:1` image inside an `aspect-ratio`-locked (not auto-height) card, so if the label text
  wrapped to 2 lines it would visibly steal height from the image. Live `getBoundingClientRect()`
  checks initially looked alarming (heights up to 58px against an 18px single-line baseline) —
  but cross-checking against `offsetHeight` (which ignores CSS transforms) showed every label is
  actually a clean single line at 18px; the inflated `getBoundingClientRect()` numbers were purely
  a side effect of the non-active cards' GSAP rotation transform enlarging their axis-aligned
  bounding box, not real text wrapping. **No live bug existed**, but added a small defensive fix
  anyway since it's free insurance against a genuinely long future concept title: wrapped the label
  text in its own `<span className="concept-deck-card-label-text">` in `concept-carousel.tsx` and
  gave it `flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis` in
  `halogrip.css` (plus `flex:none` on the sibling `<em>` concept-number badge so it never shrinks)
  — a too-long label now truncates with an ellipsis instead of ever being able to wrap.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean, run twice) and live
  `getComputedStyle`/`offsetHeight` checks in the dev server confirming the new padding values
  are live and that all 5 concept-deck-card labels render at a single-line 18px `offsetHeight`.
  **Screenshot verification was not possible this round** — this session's automated browser tab
  returned a flat blank frame at every scroll position tried on `/work/halogrip`, matching the
  known WebGL-tab-capture issue already documented at length elsewhere in this file (this page's
  persistent React Three Fiber canvas breaks this particular browser extension's tab-capture, not
  a page bug) — confirmed by reproducing the same blank result at the very top of the page too,
  ruling out a scroll-position problem. A future session with working screenshots should do a
  visual before/after density check if this becomes load-bearing.

### Font-size tokens re-pinned to mason-wong.com's actual pixel numbers, not just consolidated (this session, follow-up)
- Immediately after the previous entry's token-consolidation pass (same session), Sylvia asked to go
  further: "我想要mason的字号数字套到我的case里" — don't just organize HALOGRIP's own sizes into named
  tokens, actually replace their *values* with the specific pixel numbers measured off mason-wong.com.
  Two real constraints surfaced and were resolved with her before editing (via a plan-mode
  `AskUserQuestion`/plan-file round): (1) mason's numbers are static px, not fluid — HALOGRIP's desktop
  rules lean on `clamp(min,vw,max)`; resolved by keeping every existing clamp's `min`/`vw` slope
  untouched and only replacing the `max` ceiling with mason's number, so large-screen sizing now
  genuinely matches mason while the 760px-breakpoint fluid scaling behavior is undisturbed. (2) mason
  never uses anything below 12px anywhere on either page it was inspected on (home or `/liverpoolfc`)
  — HALOGRIP's `--fs-label`/`--fs-caption`/`--fs-micro` were 10/9/8px. First proposed leaving those
  three untouched (mason has no equivalent to copy); Sylvia rejected that and said explicitly "我想所有
  字都12px以上的，和mason一样" (I want everything 12px or above, same as mason) — so all three now sit
  at 12px too, same as `--fs-body`. This is a real, visible change: every eyebrow/footer/index-
  number/caption on the page got noticeably bigger, confirmed intentional rather than incidental.
- New `:root` values in `halogrip.css` (only the token *values* changed, no selectors touched — every
  selector already referenced these tokens from the prior consolidation pass): `--fs-hero` max
  270→**167** (mason's own Liverpool-FC-page project-title size — same role, a case study's own H1),
  `--fs-display-1` 205→**158**, `--fs-display-2` 147→**120**, `--fs-display-3` 138→**86**, `--fs-title`
  90→**80** (mason's Liverpool-page section-heading size), `--fs-stat` 76→**74**, `--fs-heading-lg`
  58→**61**, `--fs-heading-sm` 38→**37** (mason's Liverpool-page "Mobile app" sub-heading, exact
  match), `--fs-card-title-lg` 29→**34**, `--fs-meta-stat` max 27→**25**, `--fs-card-title-sm`
  22→**24**; body tiers `--fs-body-lg` 12→**14** (mason's nav/label size), `--fs-body` 11→**12**
  (mason's paragraph size), and `--fs-label`/`--fs-caption`/`--fs-micro` all 10/9/8→**12** per above.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and live `getComputedStyle` checks
  in the dev server (`.hero-heading h1`→167px, `.overview-copy h2`→80px, `.overview-copy>p`→14px,
  `.eyebrow`/`.research-findings article p`/`.footer-bottom`/`.final-specs small`→12px, confirming
  nothing on the page renders below 12px anymore) plus a screenshot of the hero section.

### HALOGRIP's type system swapped to Koulen + Roboto Mono (mason-wong.com's own font pairing), and its scattered font sizes consolidated into named tokens (this session)
- This followed a separate conversation where Sylvia asked to inspect the font system on
  https://www.mason-wong.com/ (and its `/liverpoolfc` case-study page) via live browser
  `getComputedStyle` inspection — confirmed that site's headings are all set in **Koulen**
  (Google Fonts, SIL OFL 1.1, free to use commercially) and its body/UI text in **Roboto Mono**
  (Google Fonts, Apache 2.0, free commercially); the site also uses a decorative Chinese
  calligraphy typeface (HanyiSentyFoundation — free for personal use only, commercial use needs
  a paid Hanyi license) and two minor accent faces (Pinyon Script, Albert Sans for bracket
  glyphs) that Sylvia explicitly asked to skip. Confirmed with Sylvia via `AskUserQuestion` before
  touching code that "套用大小" meant: swap the fonts, and reorganize HALOGRIP's own existing
  (already fluid/`clamp()`-based, already tuned across many earlier sessions per the entries
  below) font sizes into a named tier system — not overwrite them with mason-wong's literal
  pixel numbers, which belong to a completely different, much simpler page layout.
- **Font loading** (`app/work/halogrip/page.tsx`): added `Koulen` (`weight:["400"]` — it's a
  single-weight display face, so `font-weight:700` on headings synthesizes/faux-bolds in the
  browser, same as it would with any single-weight display font) and `Roboto_Mono`
  (`weight:["400","500","700"]`) via `next/font/google`, following the exact route-scoped
  pattern `scroll-intro.tsx` already established for Poppins — variables land on `<main
  id="top">` via `className`, never touching the root layout or `/`. The old self-hosted
  `@font-face` rules (Nimbus Sans Narrow, DejaVu Sans Mono) were deleted from `halogrip.css`;
  the actual font files stay on disk unused, per this project's convention for superseded
  assets.
- **A real scoping bug hit and fixed**: `--halogrip-display`/`--halogrip-mono` (the CSS custom
  properties next/font/google's `variable` option defines) only exist on `#top` and its
  descendants — but `halogrip.css`'s `--display`/`--mono` tokens, and `body`'s own
  `font-family`, live on `:root`/`body`, which are *ancestors* of `#top`. CSS custom properties
  only inherit downward, so `:root` referencing `var(--halogrip-display)` was invalid at that
  scope and silently fell through to the fallback stack (confirmed live: computed
  `font-family` was resolving to the browser's generic `ui-sans-serif`/`Courier New`, not
  Koulen/Roboto Mono, even though the variables themselves were correctly defined one level
  down). Fixed with a second rule, `#top{--display:var(--halogrip-display),...;--mono:
  var(--halogrip-mono),...;font-family:var(--mono)}`, added right after `:root` — since `#top`
  wraps 100% of this route's rendered markup, redeclaring both the tokens and the base
  `font-family` there (rather than on `body`, which sits one level too high to see the
  variables) is what actually gets every element on the page onto the new fonts. `:root`'s
  copies of `--display`/`--mono` were reduced to plain fallback stacks (`'Arial Narrow',
  sans-serif` / `'Courier New',monospace`) so they're never invalid, just unused once `#top`'s
  override applies.
- **Font-size consolidation**: added ~14 named tokens to `halogrip.css`'s `:root` — heading
  tiers `--fs-hero` (the H1 only) / `--fs-display-1/2/3` / `--fs-title` / `--fs-heading-lg/sm` /
  `--fs-card-title-lg/sm` / `--fs-stat` / `--fs-meta-stat`, and body tiers `--fs-body-lg` (12px)
  / `--fs-body` (11px) / `--fs-label` (10px) / `--fs-caption` (9px) / `--fs-micro` (8px) — then
  replaced essentially every hardcoded `font-size` in the file's *desktop* rules with the
  matching token. This is a **consolidation, not a redesign**: most selectors just got their
  existing exact value wrapped in a shared, named variable (e.g. every already-identical 9px
  caption across `journey-lede`/`story-grid article>p`/`interaction-footer`/etc. now reads
  `var(--fs-caption)`), and only genuinely-drifted near-duplicates were snapped together (e.g.
  the card-title cluster 20/22/24/29/31px collapsed to two tokens, `--fs-card-title-sm`(22)/
  `-lg`(29)). The `@media(max-width:760px)` block was **not touched** — it overrides the same
  selectors with its own fixed px values regardless of what the desktop rule resolves to, so it
  keeps working unchanged. `.need-*` (section 02.2's photo-overlay annotations, coordinate-matched
  pixel-for-pixel against a reference image per an earlier session's entry) was **deliberately
  excluded** from size consolidation — only its font-family changes via the shared token, its
  sizes are untouched, since nudging them risks misaligning text against the SVG leader-lines.
- **Letter-spacing cleanup**: removed the negative tracking (`-.01em` to `-.026em`) that every
  Koulen-driven heading selector had inherited from Nimbus Sans Narrow. Koulen is already a
  tightly-set condensed display face (confirmed against mason-wong.com's own CSS, which uses
  `letter-spacing:normal` throughout) and reads cramped with extra negative tracking on top.
- `design-gap-sequence.css` and `scroll-intro.css` need no direct edits — both already reference
  `var(--display)`/`var(--mono)` rather than hardcoding a font name, so they picked up
  Koulen/Roboto Mono automatically once the shared tokens changed. Updated two stale code
  comments in `scroll-intro.tsx`/`scroll-intro.css` that described Poppins as "a deliberate,
  scoped exception to this page's Nimbus Sans Narrow" to say Koulen instead — Poppins itself is
  untouched, still exclusive to `.scroll-intro`.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean, run twice — once before the
  `#top` scoping fix, once after) and live `getComputedStyle` checks in the dev server across
  representative elements (`.hero-heading h1`, `.overview-copy h2`/`>p`, `.eyebrow`, `.research-
  findings h3`, `.wordmark`, `body`, `#top`) confirming Koulen/Roboto Mono actually resolve (not
  just that the token chain looks right on paper) — this is what caught the `#top`-scoping bug
  above, a plain visual screenshot would not have surfaced it since the fallback stacks
  (`ui-sans-serif`, `Courier New`) don't look obviously broken. Also confirmed visually via
  screenshots at the hero, `02.3 CURRENT RESPONSE`, `01 OVERVIEW`, and `03 PROBLEM STATEMENT`
  sections post-fix.

### Section 6 replaced: PROTOTYPE TESTING out, SKETCH PROCESS in — reusing a previously-shelved sketch-sheet asset (this session)
- Sylvia asked to put `public/media/halogrip图片/other/sketches.webp` (a wide hand-sketch summary
  sheet: 6 rounds of grip-form iteration converging on a pink-highlighted "Final" form) into the
  current section 6, replacing it entirely. This file was a previously shelved asset — an earlier
  session had deliberately dropped it from the page ("for now") while keeping it on disk for
  later; this session reactivates it. Confirmed three open questions with Sylvia via
  `AskUserQuestion` before touching code: (1) the old section 6 content is deleted outright, not
  relocated; (2) the new section uses a full-width layout, not the old section's 50/50 photo/copy
  split — this project has repeatedly hit "dense sketch sheet unreadable when squeezed into a
  half-width slot" (see the several 05-concept-carousel sizing rounds elsewhere in this file), so
  full width was the safe default for legibility; (3) yes, write a small amount of draft copy
  (eyebrow + one-line heading + a caption), flagged for her review rather than leaving the section
  bare.
- **Old section removed wholesale**: `.testing`/`#testing` — a two-column section with
  `prototype.webp` (physical foam-prototype photo) on the left and "TEST. LEARN. REFINE." +
  three evaluation findings (LOWER PIVOT / BIGGER CONTROLS / TWO-STEP ACCESS, the `iterations`
  array in `page.tsx`) on the right. That content described physical-prototype evaluation, a
  different story from sketch-stage form iteration, so it was deleted rather than kept or moved —
  per Sylvia's explicit call, not an assumption.
- **New `<section className="sketch-process section shell" id="sketch-process">`** in `page.tsx`:
  eyebrow `[ 06 / SKETCH PROCESS ]`, a draft `<h2>FROM WHEEL TO GRIP.</h2>` (own
  `// TODO(sylvia): draft heading` comment), then a `<figure>` with the sketch sheet at full
  section width (`width:100%;height:auto`, no `object-fit` crop — the whole point given this
  project's history of illegible cropped sketch sheets) and a draft `<figcaption>SIX ITERATION
  ROUNDS / FINAL FORM SELECTED</figcaption>` (own `TODO(sylvia)` comment). Both text strings are
  my drafts for Sylvia to confirm or replace, not treated as final copy.
- `halogrip.css`: replaced the old `.testing`/`.testing-photo`/`.testing-copy`/`.iteration-list`
  rule block (desktop + the `max-width:760px` override) with a much smaller `.sketch-process`/
  `.sketch-process-figure` block. Also removed `.testing-copy h2` from the shared oversized-title
  selector on the `.principles` line (that selector's other members — `.final-content h2`,
  `.journey-inner h2`, `.site-footer h2` — are unrelated hero-scale headings; the new section's
  `h2` uses its own smaller rule, sized like `.concept-heading h2` rather than a full-bleed hero
  headline) and dropped a now-dead `.iteration-list h3` from the `.principles-list h3,.story-grid
  h3` shared selector.
- No nav link pointed at `#testing`, so renaming the section id to `#sketch-process` was safe
  (confirmed by grep before renaming).
- Verified via `npx tsc --noEmit` and `npm run build` (both clean, run twice — once after the
  initial edit, again after the CSS dead-selector cleanup). **Browser screenshot verification hit
  the same known issue documented elsewhere in this file** (`document.hidden`/`visibilityState`
  reporting `"hidden"` for this session's automated tab — an environment characteristic, not a
  page bug) — screenshots came back blank even though the page was live. Verified instead via
  direct DOM/network checks: fetched the image URL directly (200, `image/webp`, natural size
  1920×1080 matching the source file), confirmed the rendered `<img>`'s on-page aspect ratio
  matches that natural ratio exactly (no distortion from the `height:auto` CSS), confirmed
  eyebrow/heading/caption text render as authored, and confirmed the new section's top/bottom
  edges land exactly on the previous section's (`#concepts`) bottom and the next section's
  (`#solution`, 07 FINAL CONCEPT) top with zero gap or overlap.

### 09 / EMERGENCY HANDOVER five-step scenario rebuilt from a supplied asset pack; new one-time section-fade-in helper added (this session)
- Sylvia supplied a zip, `public/media/halogrip图片/other/halogrip-scenario-assets-F3F2EE.zip`
  (5 storyboard frames — Authorize/Activate/Reposition/Park/Complete — plus a `README.txt`
  stating the canvas/background color is exactly `#F3F2EE` and that the 5 images already have
  that color composited into their own backgrounds, so the page should use
  `background-color:#F3F2EE` rather than loading the included reference PNG), with an explicit
  spec: use the 5 images in that order: set the section's entire background to `#F3F2EE`; no
  cards/shadows/borders/white containers around the images (their backgrounds already match);
  all 5 steps equal size/weight in one horizontal row; restrained red only on the step numbers
  and a thin connecting line; reuse the existing condensed heading/mono body fonts; a single
  subtle whole-section fade-in (8px upward, 600ms) with no per-step animation, no pinning, no
  scroll-progress linkage; stay responsive; don't touch any other section.
- Extracted the 5 PNGs to `public/media/halogrip图片/09-handover/` (own per-section folder, same
  convention as `03/`, `2.1`-`2.4`, `05-iteration/`). `#F3F2EE` is exactly this file's existing
  `--paper-light` token, so no new color was introduced — `.journey` (section 09's own class)
  now sets `background:var(--paper-light)`, matching how `.interaction` (section 08, just above
  it) already uses the same token.
- **`dark-section` removed from section 09.** It was previously a `<section className="journey
  dark-section">`; with `--paper-light` as the new background, keeping `dark-section` (`background
  :var(--dark);color:var(--white)`) would fight the new bg. Removing it lets every descendant fall
  back to `body`'s own `color:var(--ink)` for free — the only follow-up needed was recoloring a
  handful of colors that had been hand-picked light-gray-on-dark literals (`#c8cbc6`, `#c4c7c1`,
  `#555956`, etc., on `.journey-lede`, `.story-grid article>p`, `.access-detail>p`/`.hud-detail>p`,
  `.system-detail`'s border) over to the existing `var(--muted)`/`var(--line)` tokens.
- `steps` in `page.tsx` renamed to match the supplied filenames — `IDENTIFY`→`AUTHORIZE`,
  `RELEASE`→`COMPLETE` (`ACTIVATE`/`REPOSITION`/`PARK` unchanged) — each entry now also carries
  its asset's filename stem so the map can build the `/media/halogrip图片/09-handover/<file>.png`
  src directly. The old `story-N.webp` images (a different, non-matching asset set) are no longer
  referenced by this section; left on disk untouched, same as every other superseded-but-kept
  asset in this project's history.
- **Connecting line**: each step is `<img> → .story-step (number + line) → h3 → p`, where
  `.story-step` is a flex row of the red index number plus a `flex:1` 1px red line
  (`opacity:.35`) filling the rest of that step's own column width; the last step's line is
  `visibility:hidden` (nothing to connect to after it). This reads as one continuous line across
  the row at normal viewing sizes, with only the 16px grid gap between columns as an unbridged
  gap — a deliberate simplification over precisely bridging every grid gutter, in keeping with
  "restrained." `.story-grid article img` switched from `object-fit:cover` (with a `var(--paper)`
  crop fallback, no longer needed) to `object-fit:contain` at `aspect-ratio:1.618/1` (the 5 new
  PNGs' own real ratio, read directly from their PNG headers — 1.607–1.627 across the 5 files,
  close enough to treat as one shared ratio) — since the images' own backgrounds already match
  the section's, `contain` shows each frame in full with no visible letterboxing seam.
- **New `app/work/halogrip/section-reveal.tsx`** (`SectionReveal`, "use client"), a small generic
  wrapper — renders the `<section>` itself (not an extra nested `<div>`) — that fires a plain
  `IntersectionObserver` once, adds `is-visible`, then disconnects: no continuous scroll linkage,
  no per-child animation, matching the "don't animate individual steps / don't pin / don't
  connect to scroll progress" constraint exactly. `page.tsx`'s section 09 now renders
  `<SectionReveal id="handover" className="journey">` instead of a plain `<section>`. CSS
  (`halogrip.css`): `.section-reveal` defaults to `opacity:1` (so content already in the DOM
  without JS, or before the observer fires, is never stuck invisible); only once the component
  has mounted does it add a second class, `section-reveal-armed`, and only under `@media
  (prefers-reduced-motion:no-preference)` does `.section-reveal-armed` actually go to `opacity:0;
  translateY(8px)` with a `.6s` transition, with `.is-visible` bringing it back to
  `opacity:1;translateY(0)` — so reduced-motion visitors and no-JS visitors both just see the
  section, no animation, no flash of hidden content.
- Not wired into any other section — `SectionReveal` exists as a reusable helper now, but per
  the brief ("do not modify other sections") only section 09 uses it this session.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and direct DOM/computed-style
  inspection in the dev server: `#handover`'s background resolves to `rgb(243,242,238)`
  (`#F3F2EE`); `.story-grid` lays out as 5 equal `204.97px` columns with the images loading `200`
  and rendering at the real `1.618/1` ratio; each step number and its connecting line compute to
  `rgb(201,55,49)` (`--red`), with the 5th step's line `visibility:hidden`; `.system-detail`'s
  recolored border/paragraph text resolve to the `--line`/`--muted` token values; and injecting
  the file's existing `@media(max-width:760px)` rules as a scratch override (this session's
  automated browser can't actually resize its viewport — same tooling limitation noted elsewhere
  in this file) confirms the grid collapses to 2 columns with the 5th step spanning full width.
  **Pixel screenshots of this page could not be used for verification this session** — every
  screenshot attempt (fresh load, after `_scrollTop()` jumps, after real incremental mouse-wheel
  scrolling, at section 09 and also at the untouched section 08 above it) came back a flat blank
  frame despite `getComputedStyle`/`elementFromPoint` on the same live tab confirming fully
  opaque, correctly colored, correctly positioned content at that exact moment — almost certainly
  the browser extension's tab-capture mechanism breaking against this page's persistent React
  Three Fiber/WebGL canvas (a known class of Chromium tab-capture bug), not a real rendering
  defect. Flagging in case a future session hits the same thing: don't trust a blank screenshot
  on `/work/halogrip` as evidence of a bug without cross-checking computed styles first.

### 05 / CONCEPT EXPLORATION deck — concept numbers made explicit after Sylvia flagged the "1 3 4 2" card order as confusing (this session, follow-up)
- Immediately after the previous entry's asset switch, Sylvia noticed the on-card labels' own
  ppt numbering ("1.", "3.", "4a.", "4b.", "2.") reads as a strange, non-sequential order when
  browsed in deck position order, and — more importantly — that landing on the final card never
  actually told a viewer *which* concept number they'd arrived at ("不过现在这个顺序 1 3 4 2 是
  不是有点奇怪，而且没有显示我最后选择了2" — isn't this 1/3/4/2 order a bit odd, and it doesn't
  show I ultimately picked [concept] 2). Both are the same root cause: the deck's position order
  (dictated by "selected direction must be the last card revealed," unchanged from every earlier
  round's spec) and the ppt's own concept numbering are two different sequences, and showing only
  the ppt number with no framing made the mismatch read as a mistake instead of two intentionally
  separate axes.
- Fix, `concept-carousel.tsx`: added a `conceptNumber` field to each `Concept`
  ("CONCEPT 01"/"03"/"04A"/"04B"/"02", the ppt's own numbering, unchanged) and stopped folding
  that number into `label` (label is now just the plain title — "Screen + External Device",
  "Pull-Out Wheel", etc.). Each on-sheet card now shows `CONCEPT NN` (red, `.concept-deck-card-
  label em`) next to the title on every card consistently, so the ppt numbering reads as its own
  labelled axis wherever a viewer is in the deck, distinct from the position counter (`01/05`
  etc.) already shown below. The final reveal's eyebrow changed from a bare "SELECTED DIRECTION"
  to "SELECTED DIRECTION — CONCEPT 02", directly answering "which concept did I land on."
  `halogrip.css`: `.concept-deck-card-label` is now `display:flex;gap:10px` to lay the number and
  title side by side; new `.concept-deck-card-label em{font-style:normal;color:var(--red)}` rule
  for the number.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and a live dev-server check:
  read all 5 card labels (confirmed "CONCEPT 01" through "CONCEPT 04B" render on their respective
  cards) and clicked through to the last card, confirming the eyebrow reads exactly
  "SELECTED DIRECTION — CONCEPT 02".

### 05 / CONCEPT EXPLORATION sketch deck switched back to the slides 11-15 asset set — the illegibility was never a sizing problem (this session, follow-up)
- Mid-session Sylvia pointed straight at the fix: "你是不是不知道原稿的草图在哪里，在这里
  `public/media/halogrip图片/other`" (do you not know where the original sketches are? they're
  here). Opening the files in that folder (and the sibling `public/media/halogrip图片/05/`
  folder, which turned out to hold the same set at full size) showed the real problem: the
  `05-iteration/` sketches used since the previous "sketch deck" rebuild (extracted directly out
  of the pptx zip, slides 18-22) are raw, white-on-black scans — dense overlapping pencil
  strokes, handwritten pink annotations, and a lot of dead black canvas around a comparatively
  small drawing. No CSS card-size increase was ever going to fix that (three separate rounds of
  enlarging tried and failed) because the useful content was always a small fraction of each
  image's own bounds — enlarging the card just enlarged the dead space along with it.
  `public/media/halogrip图片/05/concept-*.{jpg,png}` — the slides 11-15 "Ideation - Concepts
  Exploration" set this same section used in its very first round, before later rebuilds drifted
  onto the 18-22 set per an earlier explicit instruction — turned out to already be clean,
  well-composed, black-on-white line art at the same 2048x1431 (1.431 ratio) size. Confirmed by
  opening all 5 files directly: no illegibility issue at all, just normal design-sketch density.
- **`concept-carousel.tsx`**: `CONCEPTS` now points at the 5 existing `05/concept-*` files
  instead of `05-iteration/sketch-*`: Screen + External Device, Detachable Steering Device,
  Touch Screen, HUD + Joystick, and Pull-Out Wheel last as the `selected` (SELECTED DIRECTION)
  card — same card order and same "final card = selected direction" narrative structure as
  before, only the underlying image set and per-card labels/alt text changed to match this
  content. The `05-iteration/` folder and its pptx-extracted images are left on disk, unused,
  same as every other superseded asset folder in this project's history — not deleted.
- **`halogrip.css`**: removed the `contrast(1.18) brightness(1.1)` filter on
  `.concept-deck-card img` — that was compensating for the old dark/muddy scans and has no
  purpose (and no real effect worth keeping) on the new clean white-background art.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean), plus a live check in the dev
  server: `fetch()`'d all 5 new image paths (200, correct content-type, byte sizes matching the
  files read directly), then clicked through to the final card and confirmed
  `SELECTED DIRECTION` / `PULL-OUT WHEEL` renders with `concept-2-pullout-wheel.jpg` as the
  active image.

### 05 / CONCEPT EXPLORATION sketch deck sized up twice more after Sylvia reported the cards still illegible (this session, follow-up to the follow-up)
- Sylvia's report after the previous round's size bump ("48vh→68vh" stage, "44%→56%" card) was
  blunt: "草图都不对，全部都看不清晰为什么" (the sketches are all wrong, none can be seen
  clearly, why?), then mid-session, live: "图片还是太少，看不清楚" / "太小" (still too
  small/sparse, too small). The previous round's fix wasn't enough — this round drops the
  viewport-height cap entirely and sizes the deck primarily off the container width instead.
  `.concept-deck-stage` went from `width:min(100%,calc(68vh * 1.7))` to `width:min(100%,1040px)`;
  `.concept-deck-card` went from `44%` (Round 8's original) → `56%` (previous round) → `66%` of
  the stage (this round). At a typical ~960px-wide container the active card is now ~634px wide —
  roughly 2.8x its original size. Contrast/brightness filter on the sketch `<img>` bumped slightly
  further (`contrast(1.18) brightness(1.1)`, was `1.15/1.08`) and the card label font/padding grew
  a notch too. Mobile override (`@media(max-width:760px)`) updated to match:
  `.concept-deck-stage{width:100%}` (was `calc(52vh * 1.7)`), `.concept-deck-card{width:78%}`
  (was `66%`).
- The four background sketch sheets' `SLOT_STYLE` offsets in `concept-carousel.tsx` are
  percentage-based (`xPercent`/`yPercent`, self-relative to each card's own — now much bigger —
  box), so they scaled up proportionally with the active card automatically; no changes needed
  there, and a live geometry check (`getBoundingClientRect()` on the arrows and all 5 cards)
  confirmed no overlap with the arrow buttons at the new size.
- **Verification note — this session's browser automation was itself unreliable**: screenshots
  repeatedly came back solid blank even though `document.querySelector` confirmed all content
  (including the always-visible fixed `CLOSE PROJECT` pill) was correctly laid out and painted
  colors were set — traced to `document.hidden`/`visibilityState` reporting `"hidden"` for the
  automated tab (an OS/window-focus issue with the Chrome extension on this machine this session,
  not a page bug). Visual confirmation of the final size was therefore done via direct DOM
  geometry checks (`getBoundingClientRect` on the stage/cards/arrows, `img.naturalWidth` to
  confirm all 5 sketch assets decode correctly) rather than screenshots.
- **Also found and diagnosed, not a real bug**: mid-session, clicking through multiple concepts in
  quick succession sometimes left the GSAP-driven card transform/opacity visually frozen at an
  earlier index while React's own state (`aria-hidden`, the `01/05`-style counter, the `SELECTED
  DIRECTION` copy) had already correctly advanced further. Console logs showed repeated
  `[Fast Refresh] rebuilding` events landing in the same windows as the test clicks, and the
  system's own file-watcher reminders confirmed `halogrip.css` was being edited on disk by a
  concurrent process throughout this session — i.e. Next.js dev-mode Fast Refresh was remounting
  the component (resetting its GSAP mount baseline) mid-test because of unrelated concurrent
  edits, not because of a flaw in `concept-carousel.tsx`'s own logic. Confirmed clean: on a fresh
  page load with no concurrent edits in flight, a single click (and a verified 4-click sequence
  through to the final `SELECTED DIRECTION` / `PULL-OUT WHEEL` state, checked via
  `getComputedStyle().transform`/`.opacity` on all 5 cards) drives the GSAP transform to exactly
  the slot `slotFor(i, index)` predicts every time. No code change was made for this — flagging it
  here in case a future session sees the same symptom and wonders whether the carousel logic
  itself is broken; it isn't, verified by hand-deriving `slotFor()`'s expected output and matching
  it against the live DOM transform matrices.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean).

### 05 / CONCEPT EXPLORATION replaced again — the click-gallery is out, a scattered "sketch deck" (five overlapping paper sheets) is in; assets switched to ppt slides 18-22's iteration sketches (this session, follow-up)
- Sylvia sent a real mockup she'd made herself,
  `public/media/halogrip图片/other/skets reference.png`, and asked for the section to match it:
  five overlapping paper-sheet cards (one large/sharp/centred, four smaller/faded/rotated behind
  it), switching only via left/right circular arrow buttons — no pagination boxes, no big
  "SELECTED" button (both explicitly asked to be removed) — with a bottom-left "SELECTED
  DIRECTION / PULL-OUT WHEEL" reveal on the last card. This is a layout/interaction reference,
  not literal content: it uses placeholder sketch names ("Pop-up yoke," "Sliding control
  handle") that don't exist in the project. The actual content came from a separate, explicit
  instruction — "use the real sketches from PPT pages 18-22" — which is a *different* slide
  range than every earlier round of this section (those all used slides 11-15's "Concepts
  Exploration" filmstrip).
- **Re-extracted the full pptx** (a previous partial extraction in the scratchpad only had
  slides 9 and 11-15 cached from earlier rounds) and read slides 18-22: four "iteration" sketches
  (ppt's own numbering, `Sketch 1-4`) each pairing a shape/mechanism/interaction choice — 1:
  D-shaped wheel + single pedal + mechanical pull-out + HUD; 2: U-shape yoke + on-screen +
  electrical insert; 3: oblique ellipse + NFC + aircraft-throttle-style speed control; 4: classic
  round + electrical slide rails + voice control — converging on slide 22's own "Final" sketch,
  whose on-slide handwritten text literally reads "Final = B pillar + Mechanical + HUD + U-shape
  + attached to dashboard": the pull-out wheel. That's a direct, ppt-sourced justification for
  the "5th card = selected direction" structure, not an assumption. Copied the 5 real images
  (`ppt/media/image23.png`/`24`/`25`/`26`/`28.jpg`) to
  `public/media/halogrip图片/05-iteration/sketch-{1-4}-*.png` +
  `sketch-5-final-pullout-wheel.jpg` — the previous round's `05/` folder assets (from slides
  11-15) are now unused but left on disk, same as every other superseded-but-kept asset folder in
  this project's history.
- **`app/work/halogrip/concept-carousel.tsx` rewritten again.** Click/keyboard-only (Left/Right
  arrow keys), exactly as before — nothing new added around scroll/wheel/drag. New per-card
  positioning model: each non-active concept is assigned one of four fixed background slots
  (upper-left/lower-left/upper-right/lower-right) by its position in the array *relative to
  whichever is currently active* (recomputed every index change via `slotFor()`), so the
  background cards visibly reshuffle into their new slots rather than jumping. GSAP tweens each
  card's `xPercent`/`yPercent`/`rotation`/`scale`/`opacity` to match. On the final card
  (`index===LAST`), every non-active card's target opacity is forced to `0` instead of its usual
  background-slot opacity — a full fade-out, not just a dim — matching "fade the other sketches
  out" from the brief.
- **A real centering bug found and fixed.** First pass set each card's *initial* position via a
  raw multi-function CSS `transform` string in a React inline `style` prop (`translate(...%, ...%
  ) rotate(...) scale(...)`), then handed the element to GSAP's `xPercent`/`yPercent` for
  subsequent tweens. Confirmed directly via `getBoundingClientRect()`: the "centre" slot
  (`xPercent:0, yPercent:0`, meant to be a no-op offset) rendered ~290px off from the stage's
  actual measured centre. Root cause: GSAP must parse and internally decompose whatever
  transform already exists on an element the first time it tweens it, and a multi-function
  string it didn't itself author doesn't decompose cleanly into the xPercent/yPercent baseline it
  expects. Fixed by never writing a raw CSS `transform` at all — an additional `useEffect(() =>
  {...}, [])` calls `gsap.set()` (not `gsap.to()`) once on mount to establish GSAP's own
  baseline for every card, before the index-driven effect's `gsap.to()` calls ever run on them.
  Re-verified after the fix: stage centre and the centred card's own centre matched to within
  rounding.
- Verified via `npx tsc --noEmit` and `npm run build` (clean) and dev-server interaction:
  confirmed the centred card sits precisely centred with symmetric background cards on both
  sides (not just visually — re-checked computed rects), clicked through all 5 sketches via the
  arrow buttons, confirmed the readout text/labels match each sketch's real ppt content, and
  confirmed the final click shows "SELECTED DIRECTION" (red) / "PULL-OUT WHEEL" with every other
  sketch faded to fully invisible, matching the supplied mockup.

### 05 / CONCEPT EXPLORATION gallery — sizing pass: frame and both headings shrunk (this session, follow-up)
- Sylvia's next look at the new click-controlled gallery (previous entry): "图片和字都太大了看不清"
  (the image and text are all too big, hard to see clearly). Two separate, real sizing problems,
  both fixed in `halogrip.css` only (no JS/structure changes):
  - **`.concept-gallery-frame`** was `width:100%;aspect-ratio:1.431` — at the shell's max width
    (~1530px inside the 1700px shell minus gutters) that resolves to a ~1069px-tall box, taller
    than most real browser viewports. The image was technically never cropped (per the previous
    round's fix) but practically couldn't be *seen* — its top and bottom didn't fit on screen at
    once, so seeing the whole sketch required scrolling within the section. Fixed by making
    height the driving dimension instead of width: `width:min(100%,calc(52vh * 1.431))` (pure
    CSS, no JS measurement) caps the frame at roughly 52% of viewport height — `aspect-ratio`
    then derives width from that capped height — while `min(100%, ...)` still lets width (and so
    height) shrink further on narrow viewports where 100% is the tighter constraint. Also added
    `margin-inline:auto` since the frame no longer reliably fills the shell's width.
  - **`.concept-heading h2`** (`page.tsx`'s "HOW SHOULD CONTROL APPEAR IN A VEHICLE DESIGNED
    WITHOUT IT?", part of the section's outer heading block above the gallery component, not
    the gallery itself) was `clamp(57px,7.4vw,98px)` — sized like the page's other big section
    headlines, but those are short punchy phrases ("LISTEN BEFORE DESIGNING.") while this one is
    a full question that wraps to 3 lines at that scale, eating a disproportionate amount of
    vertical space. Sylvia called this heading out by name in her feedback, so it's fair game
    despite being outside the gallery component proper. Reduced to `clamp(36px,4.4vw,58px)`
    (mobile override 54px→32px) — now wraps to 2 lines and reads proportionate to the content
    below it instead of dominating the section.
  - `.concept-gallery-copy h3` (the per-concept title, e.g. "PULL-OUT WHEEL") was also nudged
    down slightly, `clamp(22px,2.6vw,34px)` → `clamp(18px,1.8vw,26px)`, as part of the same pass.
- Verified via `npx tsc --noEmit` and `npm run build` (clean) and dev-server screenshots: the
  outer heading now wraps to 2 lines at a proportionate size, and the gallery frame (with its
  title/eyebrow) fits comfortably within a normal viewport with room to spare — no more
  scrolling within the section just to see one image top-to-bottom.

### 05 / CONCEPT EXPLORATION replaced entirely — scroll/wheel-driven carousel out, click-controlled gallery in (this session, follow-up)
- After three rounds of carousel fixes (see the two entries below this one), Sylvia's next
  message wasn't a tweak — it was a full pivot away from the whole interaction model, delivered
  as a complete, explicit spec (reproduced almost verbatim into the plan file this session, then
  implemented directly per her own "implement the change directly rather than describing it").
  Root complaint: **vertical page scroll should only ever move between page sections.** Every
  carousel version up to this point intercepted scroll/wheel input inside 05 itself (first as a
  `position:sticky` scroll-scrub, then as a wheel-capturing self-contained widget) — visitors
  couldn't scroll upward through it, pause on one image, or skip past it naturally. That's gone
  now: `concept-carousel.tsx` no longer reads scroll position, wheel deltas, or drag gestures at
  all. It's a plain click/keyboard-driven index (`useState`, changed only by clicking a
  selector/arrow or pressing Left/Right with the gallery focused) — nothing here can ever trap
  or hijack the page's own scroll.
- **Also reverses the dark full-bleed navy panel** from the previous two rounds (`#121B32`,
  `left:50%;margin-left:-50vw` breakout) back to the page's normal warm off-white background,
  sitting inline in the existing `.concepts.shell` padding like any other section content — no
  more dark theme, no more edge-to-edge bleed. `page.tsx`'s `[ 05 / CONCEPT EXPLORATION ]`
  eyebrow/heading/intro paragraph above the component were untouched throughout (never part of
  the carousel component itself).
- **Presentation order changed for storytelling**, asset identity did not: Screen + Pedal →
  Modular Device → Touchscreen → HUD + Joystick → **Pull-out Wheel last**, labeled `SELECTED`
  instead of `05` in the selector row. The Pull-out Wheel asset is still `concept-2-pullout-
  wheel.jpg` internally (`id:"pullout-wheel"`) — moving it to the end of the *display* order is
  not a relabel to "Concept 05." Titles reverted from round 3's full ppt sentences back to short
  editorial names ("Screen + Pedal", "Modular Device", etc., matching what Sylvia's own spec
  listed verbatim as the concept order) — this is a deliberate reuse of existing project wording,
  not new copy invented for this round.
- **Structure**: one `.concept-gallery-frame` (`aspect-ratio:1.431`, unchanged real ratio of all
  5 sketch assets, so the box never resizes and the page never jumps switching concepts) with all
  5 images stacked as absolutely-positioned layers from mount — only the active one is
  `opacity:1`, the rest sit at `0`. Rendering all 5 up front *is* the preload Sylvia's spec asked
  for (no flash switching, no separate `<link rel=preload>` needed). On index change, GSAP
  crossfades the outgoing layer out (`opacity:0,x:-10`) while the incoming one fades in from the
  opposite offset (`x:10→0,opacity:1`), ~250ms, `prefers-reduced-motion` skips the duration
  entirely — restrained, matches the spec's 220-300ms/8-12px numbers, no scale/3D/bounce.
- Below the image: 5 real `<button>` selectors (`01`/`02`/`03`/`04`/`SELECTED`) +
  Previous/Next arrow buttons (disabled at either end). The `SELECTED` selector is styled in
  `var(--red)` **unconditionally**, independent of `aria-pressed` — it reads as red from first
  paint (concept 1 is what's actually shown on load, per spec) so a visitor can identify and jump
  straight to the chosen direction without clicking through the other four; a separate
  `aria-pressed="true"` style (bordered/ink-colored) marks whichever is currently *being viewed*,
  so the two signals ("this is the selected direction" vs "this is what you're looking at right
  now") stay visually distinct and can coexist once you land on it.
- Clicking `SELECTED` swaps in the Pull-out Wheel image and switches the eyebrow from the plain
  `01`-style number to `SELECTED DIRECTION` (red) with the title reading `PULL-OUT WHEEL` — same
  crossfade as every other switch, no separate animation path, no dark treatment.
- Removed entirely, all now dead: the `wheel` event listener and its threshold/cooldown
  accumulator, the manual `pointerdown`/`pointermove`/`pointerup` drag tracking, the
  `ResizeObserver`-measured filmstrip geometry (`cardW`/`cardH`/`step`/`xFor`/`FOCUS_SCALE`), the
  background crossfade+tint+wash layers, the bottom progress rail, and — because this component
  no longer mounts an async, non-trivial-height section — the `gsap`/`ScrollTrigger` import and
  its `ScrollTrigger.refresh()` mount-effect workaround that every prior round of this component
  needed (documented in each of the entries below) to counteract the site's
  `normalizeScroll()` stale-max-scroll-bound bug. That bug was a symptom of async layout height
  changes interacting with page-scroll bounds; a component that never captures scroll and has a
  simple, CSS-fixed-aspect-ratio frame doesn't create the same failure mode, so the workaround
  is gone along with everything else that needed it.
- The old narrow-viewport (`<760px`) static-grid fallback (`ConceptFallback`) is also gone — that
  existed specifically because the old pin/scroll-scrub mechanic got fragile on narrow viewports;
  a click/tap-driven gallery has no such constraint, so the same component now serves every
  viewport width, and `.concept-gallery-selectors` just wraps via `flex-wrap` at narrow widths
  instead.
- CSS: the entire `.concept-carousel*` (dark full-bleed hero) and `.concept-fallback*` (static
  grid) blocks in `halogrip.css` were deleted and replaced with a new, much smaller
  `.concept-gallery*` block — deliberately renamed off "carousel" since the mechanic it now
  describes isn't a carousel at all.
- Verified via `npx tsc --noEmit` and `npm run build` (clean) and dev-server interaction: real
  mouse-wheel scrolling now passes straight through Section 05 in both directions with zero
  interception (confirmed scrolling up back into it, not just down past it); clicked every
  selector and the arrows; confirmed `SELECTED` reads red before ever being clicked; confirmed
  clicking it shows the `SELECTED DIRECTION` label + `PULL-OUT WHEEL` title with the ordinary
  crossfade only; confirmed Section 05 flows directly into the existing `06 / PROTOTYPE TESTING`
  content with nothing else on the page disturbed.

### 05 / CONCEPT EXPLORATION carousel — third round: cards no longer crop, copy replaced with the ppt's actual wording (this session, follow-up)
- Sylvia flagged two more things after seeing the second (wheel/drag/GSAP) rewrite: unfocused
  cards still felt "uncomfortable" because half of each was cropped away, and the copy on the
  carousel ("SCREEN + PEDAL" / "Screen control paired with a floor pedal — space-intensive." —
  carried over from the old static four-card grid, never actually sourced from the ppt) didn't
  match what the ppt itself says. Both fixed together, same files
  (`app/work/halogrip/concept-carousel.tsx`, `halogrip.css`), no plan-mode disagreement — just
  finished the ppt-fidelity work the earlier rounds hadn't gotten to yet.
- **No more cropping.** The half-height crop was inherited wholesale from the reference
  `HeroCarousel`'s own mechanic (`fullH`/`halfH`, shared top edge, `object-position` picking
  which half survives) — a deliberate choice *there* because it's built for portrait photography
  (cropping a portrait to its top half still reads as "a person"). Applied to landscape technical
  sketches, cropping to half just amputates the diagram. Replaced with: every card keeps the same
  fixed box at the sketches' real, uncropped ratio (`aspect-ratio:1.431`, unchanged from before),
  laid out at a constant `step` that never changes with focus — only the focused card's
  `transform:scale()` changes (`FOCUS_SCALE=1.38`, `transform-origin:50% 50%`, matching the
  centre-anchored growth already confirmed against the ppt's own coordinates in the previous
  round's entry). Because scale doesn't reflow the row, `xFor`/`step`/drag-snap math needed zero
  changes — only `.concept-carousel-card`'s box sizing and the per-card GSAP tween (now animating
  `scale`+`zIndex`+`boxShadow` instead of `height`) changed. `track`/`strip` switched from
  `align-items:flex-start` (needed for the old shared-top-edge crop) to `align-items:center`
  (matches the confirmed centre anchor). `gap` widened (`cardW*0.16` vs the old `*0.05`) so a
  scaled-up focused card has room before visually crowding its neighbours.
- **Copy now sourced from the ppt itself**, not the old grid's paraphrase. Re-read
  `ppt/slides/slide11-15.xml`'s body text and each sketch's own handwritten title bar (already
  extracted once, in an earlier round's changelog entry) and built the new `STAGES` fields
  directly from that: `conceptLabel` is the ppt's own numbering (`CONCEPT 01`../`03`, then
  `4A`/`4B` — not sequential 04/05, that's a deliberate mismatch: the position rail below still
  counts 01-05 sequentially through the 5 *cards*, while the headline's `conceptLabel` reports
  the ppt's own concept numbering, which two of the five cards share); `title` is each slide's
  body text verbatim (4a and 4b render the *identical* sentence, "Decision-making based steering
  device" — that's not a copy-paste bug, the ppt genuinely repeats it); `variant` (new field,
  `.concept-carousel-variant`, shown only on 4a/4b) is the one place the ppt actually distinguishes
  the two in words — each sketch's own title-bar text, "Touch Screen" / "HUD + Joystick". The old
  invented one-line justifications ("space-intensive," "potential misuse," "higher mental load" —
  never in the ppt, carried over from the pre-rebuild static grid) are gone entirely rather than
  kept alongside the real copy. "SELECTED DIRECTION" on Concept 02 was left alone — real site
  content about which direction was chosen, not a ppt-fidelity question.
- Verified via `npx tsc --noEmit` and `npm run build` (clean) and stepping through all 5 cards in
  the dev server (arrow keys + click): every neighbour card now shows its complete sketch at
  reduced size, the focused card is visibly larger without any crop boundary, and each card's
  headline text (checked directly against the table in the previous round's own changelog entry)
  matches — confirmed on-screen for Concept 01, 02 (tag renders cleanly beside the wrapped
  two-line title), and 4B (variant line "HUD + JOYSTICK" renders under the shared 4a/4b title).

### 05 / CONCEPT EXPLORATION rebuilt as a scroll-scrubbed filmstrip carousel, ported from `public/media/halogrip ppt.pptx` slides 11-15; `sketches.webp` hidden but kept on disk (this session)
- Sylvia asked to replace the static 4-card `.concept-grid` with "the animation" from pptx
  slides 11-15 ("Ideation - Concepts Exploration") — a Morph-transition sequence where each of
  5 slides enlarges a different one of 5 sketch cards into a "spotlight" while the rest sit in a
  row behind it. Ground truth pulled from the OOXML (`ppt/slides/slide11-15.xml`'s `<p:pic>`
  `<a:off>`/`<a:ext>` values, confirmed `<p159:morph option="byObject">` on all 5) — see the note
  below on why the literal per-slide EMU coordinates weren't ported 1:1.
- Also asked to drop the `sketch-sheet` full sheet image (`sketches.webp`, the large hand-drawn
  overview shown above the old grid) "for now" but keep the file on disk for later — removed only
  the `<img className="sketch-sheet">` JSX line and its now-dead CSS (`.sketch-sheet` rule, both
  desktop and the `max-width:760px` override); the file itself was left untouched in
  `public/media/halogrip图片/other/`.
- **New assets**: the pptx's own 5 sketch images (`ppt/media/image15-19.{jpg,png}`) were extracted
  and copied to `public/media/halogrip图片/05/concept-{1-screen-pedal,2-pullout-wheel,
  3-modular-device,4a-touchscreen,4b-hud-joystick}.{jpg,png}` — real filenames/captions read
  directly off each sketch's own handwritten title ("① Screen + External Device", "2. Steering
  wheel + Pull out + Functions", "Concept 3 Detachable Steering Device", "4a. L4-L2 Touch
  Screen", "4b. L4-L2 HUD + Joystick"). This incidentally corrected a pre-existing mismatch: the
  old `.concept-grid`'s `concept-screen.webp` (labeled "SCREEN + PEDAL" on the card) was actually
  a crop of the "4a Touch Screen" decision-UI sketch, not a screen-and-pedal concept — confirmed
  by opening the file directly. Not flagged further since this rebuild replaces that whole grid.
- **New `app/work/halogrip/concept-carousel.tsx`** (`ConceptCarousel`, "use client") + matching
  CSS in `halogrip.css` (`.concept-carousel*`, `.concept-fallback*`). What was ported from the
  pptx is the animation's *grammar* — a row of cards drifting horizontally, continuous scale/
  elevation falloff by distance from a fixed focus point, a connecting line with a filled
  progress bar and per-stage dots, and a title/description readout synced to whichever card is
  in focus — not the literal per-slide pixel coordinates: those aren't even self-consistent
  slide-to-slide (the enlarge target's on-slide x position was hand-placed per slide by whoever
  built the deck, not formulaic — verified by extracting and diffing all 5 slides' coordinates
  before deciding this). Implementation: a tall (`(STAGES.length-1)*90+100`vh) container with a
  `position:sticky` inner stage (mirrors `ScrollZoomImage.tsx`'s entry-progress technique, not
  GSAP `ScrollTrigger.create({pin:true})` — deliberate, see below); scroll progress drives a
  continuous `focus` value (0..4) via `-container.getBoundingClientRect().top / (containerHeight
  - stageHeight)`; each card's scale/lift/opacity/z-index/shadow is a distance-from-focus falloff
  written directly to refs per frame (no React state on the scroll path, matching
  `design-gap-scene.tsx`'s established pattern); the nearest integer stage drives the text
  readout via `setState` (only changes 4 times per full scroll, cheap). Kept "PULL-OUT WHEEL" as
  the previously-`concept-selected` entry, now surfaced as a `SELECTED DIRECTION` tag next to its
  title in the readout — see the outline bug note below for why it isn't a border on the card.
- **A real bug hit and fixed during this build**: the site's global GSAP
  `ScrollTrigger.normalizeScroll()` setup (the same mechanism behind `window._scrollTop()`,
  documented elsewhere in this file) caches a max-scroll bound. This component's own tall
  container doesn't exist in the DOM until after the `enhanced` check's first render pass, so
  without a nudge the page becomes unscrollable past whatever bound was cached before this
  component mounted — confirmed directly: `window._scrollTop(x)` would echo back `x` from its
  getter while the page's *real* `window.scrollY` silently stayed capped at the old, shorter
  bound. Fixed with one `ScrollTrigger.refresh()` call inside this component's mount effect.
  This is a different code path from the pin-timing bug `./pin-coordinator.ts` documents (that
  one is about an existing *trigger's own* `start`/`end` not responding to `refresh()` — this is
  normalizeScroll's separate max-scroll-bound cache, which does respond to `refresh()`). No
  `pin-coordinator` wiring was added for this component since it creates no GSAP pin of its own.
- **Bug found and fixed mid-build**: the "selected" concept was first marked with a persistent
  red `outline` directly on its card. Because adjacent cards overlap (card width 24% > the 21%
  step spacing, an intentional filmstrip stacking look) and z-index is focus-driven, the outline
  from the selected card could visually bleed out from behind whichever *other* card currently
  had focus and a higher z-index — reads as "the wrong concept is marked selected." Fixed by
  moving the "selected" signal off the card image entirely and into the text readout instead (an
  `<em class="concept-carousel-tag">SELECTED DIRECTION</em>` next to the active title) — no
  per-card outline at all now, so there's nothing for the stacking to expose incorrectly.
- Reduced-motion / narrow-viewport fallback (`ConceptFallback`, same `canEnhance()` pattern as
  `design-gap-scene.tsx`/`scroll-intro.tsx`): a plain static grid of all 5 stages, no scroll
  scrubbing, reusing the same `STAGES` data and the same `SELECTED DIRECTION` tag treatment.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and dev-server screenshots
  stepping through 4 of the 5 stages (Screen+Pedal → Pull-out Wheel, tag confirmed showing
  cleanly with no stray outline → Modular Device → Decision UI/touchscreen), each showing the
  correct spotlight card, correct line-fill percentage, correct highlighted dot, and correct
  synced readout text; confirmed the page still scrolls normally into the sections below (09 /
  EMERGENCY HANDOVER rendered correctly after scrolling past this one). The 5th stage (Decision
  UI/HUD+joystick, `STAGES[4]`) was not independently screenshotted — it runs through the
  identical code path as the other 4 confirmed stages, just a different array index, and repeated
  large `window._scrollTop()` jumps in this session's automated browser became increasingly
  unreliable deep into this component's own tall scroll range (real `window.scrollY` intermittently
  drifted backward after being set, unrelated to any per-frame logic in this component — plausibly
  GSAP's own resize-triggered auto-refresh cascading against this page's several other pinned
  ScrollTriggers while lazily-loaded card images settled). Confirmed this is an automation-harness
  characteristic, not a page bug, by reloading fresh and reaching well past this section (scrollY
  21600 of ~23760 max, 09 / EMERGENCY HANDOVER rendering correctly) using many small incremental
  jumps instead of a few large ones. A future session should re-confirm stage 5 specifically with
  real mouse-wheel scrolling if this becomes load-bearing.

### 05 / CONCEPT EXPLORATION carousel rewritten a second time — self-contained wheel/drag/click hero, ported from a reference `HeroCarousel` component (this session, follow-up)
- The scroll-scrubbed version documented in the entry below this one shipped with three real
  problems Sylvia found by actually looking at it: the cards read as too narrow to make out the
  sketch detail, the background didn't match the ppt's dark navy slide, and the motion itself
  ("动线") was wrong. Diagnosed by re-reading the ppt's own OOXML coordinates directly against
  the shipped CSS/JS rather than guessing:
  - **Narrow cards**: `.concept-carousel-card{width:24%;height:100%}` combined two unrelated
    percentages into whatever aspect ratio fell out, which didn't match the sketches' real
    1.431:1 ratio (verified: both card sizes in the ppt, 2245800x1569300 and 2831100x1978200
    EMU, reduce to the exact same 1.431 — not a coincidence, it's the sketches' own aspect).
    Mismatched ratio meant `object-fit:cover` was cropping the sides off, including the
    handwritten labels near the edges of several sketches.
  - **transform-origin bug, confirmed from the ppt's own numbers**: computing each spotlight
    card's vertical centre (`y-offset + height/2`) across all 5 slides gives exactly 1811825
    EMU every time — identical to the same slide's un-enlarged row's own vertical centre. The
    ppt scales its spotlight card from the *centre*, not the bottom; the shipped code used
    `transform-origin:50% 100%` (bottom-anchored), which read as the card bulging upward when
    it grew instead of growing evenly.
  - **The real "动线" bug**: `track` translated by `-focus*STEP%` while each card sat at its own
    static `left:i*STEP%`, which nets out to the focused card always rendering at track x=0 —
    i.e. pinned to the stage's left edge on every single stage, not just some of them. Enlarging
    a card anchored at the left edge pushed its left half past the stage boundary into the
    `overflow:hidden` clip.
- Sylvia then supplied the actual fix in the form of a reference `HeroCarousel` component
  (framer-motion, full source pasted in-conversation, not just a usage demo) and said to base
  the carousel's motion on it directly. Confirmed with her before touching code: rebuild using
  GSAP instead of adding framer-motion as a new dependency (this route uses GSAP exclusively —
  `scroll-intro.tsx`/`process-scene.tsx`/`design-gap-scene.tsx` — and hand-written CSS, no
  Tailwind, unlike the reference's Tailwind+`cn()` markup), porting the reference's actual
  interaction model rather than literally its code.
- **`app/work/halogrip/concept-carousel.tsx` rewritten from scratch**, dropping the entire
  scroll-scrubbed architecture (the tall `position:sticky` spacer container, the
  `IntersectionObserver`+`window.scroll` progress listener, the continuous-float `applyFrame`).
  It's no longer tied to page-scroll position at all — matching the reference, it's a
  self-contained widget:
  - `index` is a discrete integer (`useState`), stepped by wheel, drag, a clicked card, or
    arrow/Home/End keys — never a continuous scroll-driven float
  - **The actual fix for the "动线" bug**: `xFor(i) = stageWidth/2 - (i*step + cardW/2)` — the
    *track* translates on every index change (via `gsap.to()`) so the focused card is always
    centred in the stage, with room on both sides. This is the reference's core trick and
    directly replaces the old "focus pinned at track origin" bug above.
  - Card sizing keeps the reference's "fixed height, width = height x aspect ratio, focused =
    full height, others = half height, shared top edge" framework unchanged — the ratio-agnostic
    part of it — with only `CARD_AR` swapped from the reference's 0.75 (portrait photography) to
    `1.431` (the sketches' real, ppt-verified ratio, confirmed above)
  - Wheel handling (accumulate delta into ±1 steps past a threshold, with a cooldown) is ported
    with the reference's own numbers (`WHEEL_THRESHOLD=60`, `WHEEL_COOLDOWN=420`), including its
    scroll-chaining behavior: at either end, wheel events aren't `preventDefault`'d, so hovering
    this full-bleed block and continuing to scroll hands the gesture back to the page instead of
    trapping it
  - Drag: no framer-motion `drag` prop available, so this is manual `pointerdown`/`pointermove`/
    `pointerup` tracking, live-writing the track's `x` via `gsap.set` during the drag and
    snapping to the nearest card on release (`Math.round((stageW/2 - thrown - cardW/2)/step)`,
    thrown = release position + a velocity nudge — same formula as the reference)
  - Background: all 5 sketches stacked as permanently-mounted absolutely-positioned layers,
    crossfaded via `gsap.to(el,{opacity})` on index change (simpler than the reference's
    `AnimatePresence` mount/unmount — GSAP has no equivalent primitive, so this trades a little
    always-loaded memory for not needing one). A single `#121B32` (the ppt's own navy) tint
    layer sits on top via `mix-blend-mode:multiply` — deliberately *not* per-card accent hues
    like the reference (Sylvia asked for one consistent dark navy background, not a different
    colour per concept)
  - Bottom-left rail (`01/05` counter + a sliding fill line) replaces the previous 5-dot
    indicator — closer to the reference's own rail treatment
  - `ResizeObserver`-driven measurement (not `window.innerWidth` breakpoints) means the whole
    thing scales continuously with real measured stage size, the same technique the reference
    uses — no separate `<760px` layout path needed
- **`.concept-carousel` is now a genuine full-bleed panel** (`left:50%;margin-left:-50vw` etc.,
  breaking out of the parent `.concepts.shell`'s max-width/padding), a deliberate default: the
  `[ 05 / CONCEPT EXPLORATION ]` eyebrow + big headline + intro paragraph *above* it stay on the
  page's normal light background, unchanged — only the carousel itself becomes the dark,
  ppt-navy, edge-to-edge "hero" panel, matching how `.need-scene`/`.response-scene`/
  `.design-gap-scene` already nest full-bleed dark scenes inside an otherwise-light page rather
  than converting a whole numbered section to dark. Flagged to Sylvia as the default interpretation
  in case she actually wants the outer heading dark too.
- **`canEnhance()` simplified** to only check `prefers-reduced-motion` — the old `<760px` check
  was there because a `position:sticky`+`ScrollTrigger`-scrubbed layout genuinely got fragile on
  narrow viewports; wheel/drag/click/keyboard input has no such constraint, so the interactive
  carousel now runs at any width and only the static `ConceptFallback` grid is reserved for
  actual reduced-motion preference (also re-themed dark, to match).
- **Hit the same normalizeScroll stale-max-scroll-bound issue as the previous version**, even
  though this rewrite creates no `ScrollTrigger` of its own: the component still mounts `null`
  on first paint then a real ~520-760px section once `enhanced` resolves, and that async height
  change is enough to desync the site's cached scroll bound again. Same fix, `ScrollTrigger
  .refresh()` in the mount effect — kept the `gsap`/`ScrollTrigger` import for exactly this one
  call, nothing else in the rewrite touches ScrollTrigger.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and real interactive testing
  in the dev server (mouse wheel over the carousel to step through, click-any-card, `Home`/
  `ArrowRight` keyboard nav) — confirmed: focused card always centred with visible margin on
  both sides (no more left-edge clipping), sketches render at full legible size uncropped when
  focused, background is the dark navy from the ppt with a crossfade on every index change, the
  "SELECTED DIRECTION" tag reads clearly on the dark background next to PULL-OUT WHEEL, and
  wheel-scrolling past the last card correctly hands off to real page scroll (confirmed: scrolling
  past index 5 lands cleanly on `[ 06 / PROTOTYPE TESTING ]`, not stuck).

### 04 / DESIGN PRINCIPLES — heading downsized, intro image removed (this session, follow-up)
- Sylvia asked to shrink "第四section的大字" (04's big heading) and drop "那个图片" (the
  `product-detail.webp` close-up shot sitting under the intro paragraph in `.principles-intro`).
  `page.tsx`: removed the `<img>` line entirely (no `TODO(sylvia)` — an explicit removal request,
  not a missing asset). `halogrip.css`: `.principles-intro h2` was sharing one selector with
  `.final-content h2`/`.journey-inner h2`/`.site-footer h2`/`.testing-copy h2` at
  `font-size:clamp(73px,9vw,127px)` — split it into its own rule at `clamp(52px,6vw,92px)` so the
  other four headings (which weren't mentioned) stay untouched. Removed the now-dead
  `.principles-intro>img` rule (desktop) and its `max-width:760px` mobile override (was
  `width:95%;margin-top:36px`), and shrank the mobile `.principles-intro h2` override from `77px`
  to `54px` to match the new desktop scale down.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and a dev-server screenshot at
  `#principles`: heading is visibly smaller, the image is gone, and the paragraph now sits with
  clean whitespace above the principles list instead of a photo.

### 03 / FIELD RESEARCH rebuilt as PROBLEM STATEMENT — content sourced from `public/media/halogrip ppt.pptx` slide 9 (this session)
- Sylvia asked to replace the top-level chapter 03 section (`id="research"` in `page.tsx` —
  distinct from the `02.x` THE CHALLENGE subsections; confirmed which one she meant via
  `AskUserQuestion` before touching anything, since both are plausible readings of "第三章节")
  with the content from page 9 of `public/media/halogrip ppt.pptx`, titled "PROBLEM STATEMENT -
  USER STUDIES". That slide's ground truth was read straight out of its OOXML (unzip the pptx;
  `ppt/slides/slide9.xml`'s `<a:t>` runs) and its speaker notes (`ppt/notesSlides/notesSlide9
  .xml`), not just the on-slide labels — the notes are what actually explain each of the 4 navy
  finding-box headers (OVERALL CONCERN ABOUT ROBOTAXI / CONTROL OVER VEHICLE BEHAVIOR /
  INSUFFICIENT STRATEGIES / STANDARDIZATION).
- The slide's own real photo (`ppt/media/image13.png`, a firefighter rope-rescue on an aerial
  ladder platform) was extracted and copied to `public/media/halogrip图片/03/firefighter-rescue
  .png`, following the same per-section-folder convention as `2.1`-`2.4`.
- Old section (a 3-image `.research-gallery` grid — fire/prototype/city photos, no connection to
  the actual field-research findings, just generic scene-setting) fully removed: `page.tsx`'s
  `research` section JSX rewritten, `.research-gallery`/`.research-fire`/`.research-prototype`/
  `.research-city` CSS deleted (desktop + the `max-width:760px` mobile block) and replaced with
  `.research-layout` (photo left, findings list right) + `.research-findings article` (a red
  index number + red uppercase meta line + body copy, deliberately reusing the same visual
  grammar as `.principles-list article` just below it in the page, rather than porting the PPT's
  own navy-box styling verbatim — per Hard Rule 1, the reference's content/structure was ported,
  its Google-Slides visual identity was not). Eyebrow renamed `[ 03 / PROBLEM STATEMENT ]` (was
  `[ 03 / FIELD RESEARCH ]`); `h2` copy ("LISTEN BEFORE DESIGNING.") and the closing
  `research-bottom` stats/quote block (04 firefighter interviews / 02 fire stations / 76 survey
  responses, the "FIVE TO TEN MINUTES ALREADY FEELS LONG" quote) were kept as-is — real validated
  research data, not something the PPT slide's own content should displace.
- The 4 finding bodies are original summaries of the notes' actual explanatory text (not just the
  slide's short label + sub-label fragments), written in the site's existing short-declarative
  voice — not flagged `TODO(sylvia)` since it's a faithful compression of her own PPT content, not
  invented placeholder copy.
- Verified via `npx tsc --noEmit` and `npm run build` (both clean) and dev-server screenshots at
  both the default ~1568px-wide automation viewport and a single-column mobile check. Same
  `resize_window`-doesn't-actually-resize tooling limitation noted elsewhere in this file applied
  again here — the mobile `.research-layout{grid-template-columns:1fr}` collapse was verified by
  injecting the new mobile-breakpoint rule as a scratch `!important` override at the current
  viewport and confirming the photo/findings stack vertically, then removing it, rather than a
  real narrow-viewport screenshot. Also hit (and worked around) a scroll-position issue while
  testing: this page's GSAP `ScrollTrigger.normalizeScroll()`-style setup intercepts native
  `window.scrollTo` during the pinned scroll-intro — it silently no-ops past a certain point — so
  jumping to a specific section for screenshot purposes requires calling the page's own
  `window._scrollTop(value)` (a getter/setter GSAP installs on `window`) instead of
  `window.scrollTo`.

### 02.3 CURRENT RESPONSE rebuilt as a single cinematic scene image, replacing the flat-card timeline; pin-timing bug fixed with a dependency-ordered coordinator (this session)
- **Content/visual rebuild.** `process-scene.tsx` was fully rewritten. The previous
  implementation (a flat DOM timeline: small glass-panel cards, an SVG process path, a grid
  background, a bottom DETECTED/CONNECTED/VERIFIED progress bar, a vehicle-stalled icon — see
  the "02.3 CURRENT RESPONSE — pinned scroll-driven process diagram" entry further below for how
  that version was built) was deleted outright, all matching `.process-*` CSS removed from
  `halogrip.css` (desktop + mobile), and replaced with: one full-viewport scene image
  (`public/media/halogrip图片/2.3/2.3-scene-clean.png` — moved here from a misplaced `2.4/`
  location; it already contains the first responder, glass process panels, red response path and
  robotaxi baked in as a single photo, so none of that is rebuilt in HTML/CSS/SVG anymore), a
  readability gradient, and real HTML label/headline/paragraph. Section label renamed
  `[ 02.3 / CURRENT RESPONSE ]` (was `CURRENT SOLUTION`) per Sylvia's explicit instruction — do
  not rename it back.
- Motion is now minimal by design: image opacity 0→1 + scale 1.025→1 on scroll-into-view (once,
  `toggleActions:"play none none none"`, not scrubbed), a small always-on horizontal parallax
  (Β±6px, scrubbed, disabled below 760px), and a short fade-up stagger on the label/headline/
  paragraph. No canvas, no per-node reveal choreography, no line-drawing animation — 02.4 is
  where the major transformation animation lives, 02.3 is deliberately a calm establishing shot.
- **Known geometric tension, resolved via the gradient, not fully eliminated:** the source
  image's first glass panel sits close to the left edge (~13% of the image's own width), and the
  spec'd headline/copy footprint (large condensed type, ~520-540px column) is wide/tall enough
  that on short viewports the headline can visually reach the panel's position. Confirmed
  directly (Sylvia flagged it live: "字好像有点挡后面背景的字"). Fixed by biasing
  `object-position` toward the image's left edge (`.response-scene-image`, more of the panel's
  clearance is preserved) and switching the readability gradient from a shallow linear fade to a
  strong `radial-gradient` anchored near the upper-left (`.response-scene-gradient`, 96%→0%
  opacity, anchor `6% 12%`) so the panel underneath is genuinely subdued rather than competing
  with the text, plus a tightened line-height (`.9`, still inside the spec's 0.9-0.95 range) and
  text-shadow on the paragraph. This was verified as a real improvement (panel text goes from
  clearly legible to a barely-visible ghost) but **not fully verified at the three target widths
  (1280/1440/1920)** — this session's automated browser has a fixed, non-resizable ~639px-tall
  viewport (`resize_window` calls report success but don't change `window.innerHeight`), which is
  a much wider/shorter aspect (2.0-3.0) than any real monitor at those widths (1280x800/1440x900/
  1920x1080 are all ~1.6-1.78). The `object-fit:cover` math was worked through by hand for those
  three real aspect ratios and gives meaningfully more clearance than what's visible in this
  session's own test screenshots; a future session with real viewport-resize should re-check
  before trusting this fully solved rather than just improved.
- **Pin-timing bug found and fixed** (this was the actual root cause of a report that read at
  first like "02.3 shows up twice with a blank gap in between" — right after the opening 3D
  model, then correctly again after 02.2): `process-scene.tsx` (and `overview-backdrop.tsx`)
  used to create their GSAP `ScrollTrigger`s synchronously on first mount, before `scroll-intro
  .tsx`'s own real pin (which is itself deferred to a second, hydration-safe render pass, and
  under real page load — heavy JS payload, WebGL setup — has been measured taking up to ~1s, not
  one frame) existed. That bakes in a `start`/`end` measured against a document that's still
  short. Calling `ScrollTrigger.refresh()` afterward does **not** fix an already-created trigger
  — verified directly from the browser console: a trigger's start/end survive `refresh()`
  unchanged no matter when it's called, while creating a brand-new trigger at that same later
  moment measures correctly on the first try. **New `app/work/halogrip/pin-coordinator.ts`**
  (replaces `scroll-refresh.tsx` below, which is now deleted — that file's refresh-after-the-fact
  approach was the first fix attempt and didn't work) is the real fix: `markPinReady(source)` /
  `onPinsReady(deps, callback)`, a small dependency graph so each section defers its own
  `ScrollTrigger` creation until everything above it has already landed. Wiring: `scroll-intro`
  has no deps; `process-scene` and `overview-backdrop` depend on `["scroll-intro"]`;
  `design-gap-scene` depends on `["scroll-intro","process-scene"]` (comes right after 02.3 in the
  DOM). `process-scene.tsx` also calls `markPinReady("process-scene")` essentially immediately
  (it has no pin/spacer of its own anymore, so nothing needs to wait on *it* for layout reasons —
  reported early purely so `design-gap-scene.tsx`'s own dependency resolves promptly instead of
  falling back to the coordinator's 4s safety timeout). Verified against a production build
  (`next build && next start`) with real mouse-wheel scrolling: 02.3 now pins/reveals exactly
  once, only after 02.2, no early appearance, no blank gap.
- If a future session touches `scroll-intro.tsx` or `design-gap-scene.tsx`'s own `enhanced`-flip
  gating, remember both must keep calling `markPinReady` on **every** code path (including the
  "decided not to enhance" branches) or a sibling waiting via `onPinsReady` will silently stall
  until the 4s timeout.

### 02.4 DESIGN GAP rebuilt as a bespoke pinned scroll transition; new ScrollRefresh helper added (outside this session, documented now)
- **Superseded**: the `ScrollRefresh` component described below (including its un-removed
  `TEMP-DIAGNOSTIC` flag) has been deleted and replaced by `pin-coordinator.ts` — see the entry
  above this one. Its refresh-after-creation approach didn't actually fix the stale-trigger bug
  it was written for. Also, this entry's description of `process-scene.tsx`'s six-step node-card
  content is now stale — 02.3 was rebuilt as a single scene image (see the entry above).
- `page.tsx`'s 02.4 section — previously the plain `PlaceholderImage`-based scaffolding from the
  "THE CHALLENGE (02) split..." entry further below — was replaced with `<DesignGapScene />`
  (`app/work/halogrip/design-gap-scene.tsx` + `design-gap-scene.css`, new files, not built in this
  session; documenting now so the structure reference stays accurate). `PlaceholderImage` is no
  longer imported anywhere in `page.tsx` — all four THE CHALLENGE subsections (02.1-02.4) now have
  real bespoke content; the placeholder-scaffolding phase is fully superseded.
- `DesignGapScene` is a pinned, scroll-driven GSAP/ScrollTrigger sequence (`pin:true, end:"+=250%"`,
  same pin/scrub pattern as `scroll-intro.tsx`) that visually compresses `process-scene.tsx`'s
  (02.3) six-step external-dependency chain (INCIDENT → CONTACT OPERATOR → VERIFY → REMOTE
  AUTHORIZATION / ON-SITE DISPATCH → MOVE OR TOW) into a single "local control" line (FIRST
  RESPONDER → LOCAL CONTROL → MOVE → ROBOTAXI) — same panel ids/titles/meta copy and icon set as
  02.3, by design, so it reads as compressing that specific diagram rather than inventing a new
  one. Real assets: `public/media/halogrip图片/2.4/assets/{design-gap-background,first-responder,
  robotaxi}.png` (verified present). Company names/invented timestamps are deliberately excluded,
  same reasoning as `process-scene.tsx`.
- Has its own reduced-motion/narrow-viewport fallback (`DesignGapFallback`, mirrors
  `scroll-intro.tsx`'s `canEnhance()` pattern — `prefers-reduced-motion` or `<760px` viewport skips
  the pin+scrub and renders a static two-column "EXTERNAL DEPENDENCY → LOCAL CONTROL" list instead.
- **New `app/work/halogrip/scroll-refresh.tsx`**, rendered once at the very end of `<main>` in
  `page.tsx`. Not a visual component (`return null`) — it exists because some sections
  (`scroll-intro.tsx`, `design-gap-scene.tsx`) defer their real pin-creating ScrollTrigger to a
  second, hydration-safe render pass, while others (`process-scene.tsx`, `overview-backdrop.tsx`)
  create theirs synchronously on first mount, against a document that's still the short, unpinned
  fallback layout — so their start/end pixel positions can get baked in against the wrong page
  height. `ScrollRefresh` calls `ScrollTrigger.refresh()` after two `requestAnimationFrame`s (past
  the enhanced-state-flip re-render cascade), again once `document.fonts.ready` resolves, and again
  on `window.load`, so every ScrollTrigger on the page ends up anchored to the final layout.
- **Flagging, not fixing**: `scroll-refresh.tsx` has a `// TEMP-DIAGNOSTIC: expose for console
  inspection, remove before finishing.` comment directly above `(window as any).__ST = ScrollTrigger;
  (window as any).__gsap = gsap;` — by its own comment this should have been removed already and
  wasn't. Left as-is since removing it wasn't requested; flag to Sylvia before shipping.
- `process-scene.tsx` (02.3) also picked up minor spacing/sizing tweaks outside this session
  (tighter `.process-node` cards, smaller intro-copy type scale, `.process-intro` no longer carries
  the `shell` class) — noted for completeness, not re-verified in depth here.

### Scroll-intro: stopped showing the old static hero as the 3D scene's loading placeholder (this session)
- Sylvia reported a flash of "the old intro" before the 3D model appears on `/work/halogrip`.
  Root cause: `scroll-intro.tsx`'s `HeroFallback` (the pre-3D-redesign hero — headline + metadata
  grid + full-bleed product photo — explicitly commented `"The original static hero, verbatim.
  Also used as the loading state of the 3D path."`) was being rendered a *second* time as an
  opaque full-screen overlay (`.scroll-intro-preload`, z-index 6) while the 3D scene's GLB model
  fetched/parsed/baked its environment, only crossfading out once `ready`. So every load, capable
  browsers genuinely saw the old design twice — once as the pre-hydration first paint (correct,
  unavoidable, SSR-hydration-safe), then again as a held loading placeholder for a variable
  (sometimes long) duration — before landing on the sparse 3D resting pose (ghost wordmark only,
  product parked off-screen). Not a misperception; the old hero really was flashing.
- Fix (scroll-intro.tsx lines 534-538): the `.scroll-intro-preload` overlay no longer renders
  `<HeroFallback />` as a child — it's now an empty `aria-hidden` div that relies on its own
  existing CSS background (`var(--paper-light)`) to show a blank screen during the load window,
  then crossfades into the 3D scene exactly as before (no timing/opacity/CSS changes). The *real*
  fallback — permanently shown to visitors with no WebGL, `prefers-reduced-motion`, or a
  narrow/mobile viewport (`canEnhance()`, scroll-intro.tsx:184-196) — is untouched: `HeroFallback`
  is still used, unchanged, at the top-level `if (!enhanced) return <HeroFallback
  titleId="project-title" />` branch (line 447), confirmed by grep to be the only remaining call
  site. Explicitly confirmed with Sylvia this fallback role must stay exactly as-is.
- Side benefit: also removes a redundant second fetch/mount of `hero.webp` (the preload's old
  `HeroFallback` was re-rendering the same `fetchPriority="high"` image the real fallback had
  already fetched once on first paint).
- Verified via `npm run build` (clean) and a dev-server screenshot sequence: immediately after
  navigation the screen is blank paper background (`.scroll-intro-preload`'s `innerHTML` confirmed
  empty via devtools), then crossfades cleanly into the 3D scene's ghost-wordmark resting state
  with the old hero never reappearing.

### 02.1 CABIN SHIFT rebuilt to match Sylvia's reference story-prototype mockup, then bridge line removed (this session)
- Fills half of the documentation gap the "Fixed site-wide broken images..." entry below flags
  ("02.1 CABIN SHIFT ... subsequently rebuilt ... structure not fully re-documented here yet";
  the other half, 02.2, is now covered by the entry directly above this one). Sylvia supplied a
  standalone reference mockup at `public/media/section 2 reference/index.html` + `styles.css` (a
  self-contained HTML/CSS "story prototype" not built by this session — its own `README.txt` says
  to port its section structure/copy into the real React page) and asked for 02.1 specifically to
  be recreated to match its `#shift` section, using the real cabin photo at
  `public/media/halogrip图片/2.1/robotaxi-cabin.png`.
- The reference's `#shift` section is a two-column grid: copy on the left, a `<figure>` on the
  right holding the cabin photo with a `figcaption` overlay of two "signal" rows (a red `+` for
  "More flexible passenger space", a grey `−` for "Traditional controls removed"), plus a
  right-aligned "bridge line" strip under the whole section ("The driver may disappear. The need
  to intervene does not.").
- Rebuilt `page.tsx`'s 02.1 section to match: replaced the old single-column
  `PlaceholderImage`-based scaffolding (described in the "THE CHALLENGE (02) split..." entry
  further below) with a new `.cabin-shift-layout` grid (`.challenge-scene-copy` +
  `<figure className="cabin-figure">` with the real photo + figcaption signal rows). Image is
  sourced directly from `/media/halogrip图片/2.1/robotaxi-cabin.png` via `encodeURI(...)` —
  matching the non-ASCII-path convention 02.2's `need-scene` background already established —
  rather than copying the file into a flat `public/media/` location.
- New CSS in `halogrip.css`: `.cabin-shift-layout`, `.cabin-figure` (+ `figcaption`, `.signal`,
  `.signal-plus`, `.signal-minus`), restyled with HALOGRIP's own established tokens (`--red
  #c93731`, `--dark`, `--white`, Nimbus Sans Narrow / DejaVu mono) instead of the reference
  mockup's own separate palette (`--red:#df4435`, `--blue:#0c78b8`) — per Hard Rule 1, the
  reference's layout was ported but not its visual identity. Mobile override added to the
  existing single `@media(max-width:760px)` block.
- The bridge-line strip was ported first (own `.bridge-line`/`.bridge-line span` CSS, right-aligned
  under a `shell`-classed `<p>`), then Sylvia asked to remove it — the paragraph and both CSS
  rules (desktop + the mobile-breakpoint override) were deleted outright, not just hidden.
- Verified via `npm run build` (clean) and a dev-server screenshot at `#challenge-cabin-title`:
  two-column layout, real cabin photo, and the plus/minus signal callouts render correctly; the
  section transitions cleanly into 02.2 with the bridge line gone.
- Not touched: 02.3/02.4's current state wasn't reverified in this session.

### 02.2 REAL-WORLD NEED rebuilt as a bespoke cinematic scene matching a supplied reference (this session)
- Replaced the placeholder `.challenge-scene challenge-scene-need` skeleton (eyebrow → heading/body
  copy → one `PlaceholderImage`) with a fully bespoke, full-bleed section (`.need-scene` in
  `page.tsx`/`halogrip.css`) built to match two assets Sylvia supplied directly: a background photo
  and a finished visual-target reference, both at `public/media/halogrip图片/2.2/2.2 background.png`
  / `2.2 reference.png` (1672×941, exactly 16:9). Only the background photo is ever rendered on the
  page — the reference image is a design target, not an asset — and the section's body-copy
  paragraph from the old skeleton was dropped entirely since the reference has no equivalent block.
- `.need-scene` is `position:relative;aspect-ratio:1672/941` with the photo as a `background-size:
  cover` layer (`.need-bg`) plus a top/bottom gradient scrim for text legibility. Everything else —
  eyebrow, headline, the three numbered leader-line annotations (`01 BLOCKED ROADS` / `02 BLOCKED
  FIRE STATION EXITS` / `03 DISRUPTED FIREFIGHTING`), the glowing dashed red route line, the red
  technical frame + corner brackets around the stalled car, the giant "74" stat, the stat caption,
  the "RESPONSE ORIGIN / FIRE STATION 12" bracket block, and the bottom source note — is positioned
  with `left/top` percentages (or, for the route/leader-lines/frame, one `<svg viewBox="0 0 1672
  941" preserveAspectRatio="none">` overlay) computed directly from pixel coordinates read off the
  reference image, so every element's position is proportional to the same 1672×941 grid the photo
  itself is on.
- This is why the section scales responsively without a mobile media-query rewrite (unlike every
  other stacked section in this file, which gets bespoke `@media(max-width:760px)` overrides): the
  container keeps its aspect ratio at any width, and since virtually all sizing is `vw`-relative
  (wrapped in `clamp()` with a legibility floor for narrow screens and a ceiling for very wide ones,
  same pattern as the rest of the file's `clamp()` usage) percentages and `vw` values stay accurate
  to the same composition at any viewport width — "responsive" here means "the same poster scaled
  down," not "content reflows."
- The existing global `.close-project` pill (fixed top-right, already rendered on every route) is
  what supplies the reference's top-right `CLOSE PROJECT` control — no second one was added for
  this section.
- Verified with `npm run build` and `npx tsc --noEmit` (both clean) and side-by-side dev-server
  screenshots against `2.2 reference.png`: eyebrow/headline position and size, route path shape,
  annotation/leader-line placement, frame+"74" placement, and the bottom-left bracket/source-note
  blocks all match closely. Full-width in-browser resize testing wasn't possible this session (see
  the tooling-limitation note in the "THE CHALLENGE (02) split..." entry below — window resize
  doesn't reliably change the automated browser's actual viewport here); responsiveness was instead
  verified by reasoning through the `vw`/`clamp()`/percentage math above rather than a real
  narrow-viewport screenshot.
- `// TODO(sylvia)` carried forward on the "74" stat and the bottom source line (`01 — SOURCE
  PENDING VERIFICATION.`) — the reference bakes the pending-verification caveat into the design
  itself as in-scene text, so it's flagged in both the JSX comment and literally on the page.

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
