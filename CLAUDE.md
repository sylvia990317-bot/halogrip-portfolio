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
                             TwoColumnSection, LogoMarquee, AboutCard, ExperienceTimeline,
                             TestimonialsCarousel, ContactSection, SiteFooter)
  work/
    halogrip/
      page.tsx              HALOGRIP case study — own `metadata` export, own CSS import
      halogrip.css          HALOGRIP-only styles (fonts, tokens, all component classes)
      interaction-deck.tsx  Client component, steering-state demo ("use client")
public/
  media/                   HALOGRIP's images (kept flat at /media/*.webp; not yet reorganized
                            per-project since there's only one project with real assets)
  fonts/                   HALOGRIP's self-hosted fonts (Nimbus Sans Narrow, DejaVu Sans Mono)
```

## Open items Sylvia still needs to supply

These currently ship as flagged placeholders (grep for `TODO(sylvia)`):

- Real card title/caption for the HALOGRIP tile on the homepage grid
- Real contact email + social links (LinkedIn/Instagram hrefs are currently placeholder root URLs)
- Real CV link/file
- Real testimonials (3 placeholder slots currently in `app/data/testimonials.ts`)
- Real photos: avatar, portrait, company/school logos (Cstrider, Volvo, Chalmers, Autoliv), all 4
  project thumbnails — everywhere via `PlaceholderImage` until supplied
- Whether the 2018–2019 "Bachelor Thesis Student · Apple" entry (seen in the Framer reference) is
  real — it looked like unedited template filler and was deliberately omitted from
  `app/data/experience.ts`

## Deployment

- Hosted on **Vercel**, live at https://halogrip-portfolio.vercel.app
- Source pushed to GitHub: `sylvia990317-bot/halogrip-portfolio`
- GitHub → Vercel auto-deploy-on-push is **not yet connected** (Vercel account needs a GitHub
  login connection added manually in the Vercel dashboard first). Until then, deploy manually
  from this directory with `vercel --prod --yes`.

## Recent changes (this session)

Restructured the project from a single-page HALOGRIP site into a multi-project portfolio:
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
- Verified locally: homepage section order matches the Framer reference, HALOGRIP page renders
  identically at its new route with working interaction demo, `npm run build` succeeds.
- **Not yet done**: redeploying this to Vercel — the live site still shows the old single-page
  version as of this writing.
