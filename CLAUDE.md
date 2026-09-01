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
   CHANGELOG.md — swapped from Nimbus Sans Narrow/DejaVu Sans Mono in an earlier session) — leave
   it alone unless she asks to redesign it specifically.
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
                             tokens, all component classes) — see CHANGELOG.md for the
                             Koulen/Roboto Mono type-scale overhaul
      interaction-deck.tsx  Client component, steering-state demo ("use client")
      scroll-intro*.tsx/css Pinned scroll-driven 3D opening (R3F + GSAP ScrollTrigger), ported
                             1:1 from Sylvia's PowerPoint reference — see CHANGELOG.md
      need-scene.tsx         02.2 / REAL-WORLD NEED — one-shot route-line draw-in synced to
                             the annotations/frame/stat, see CHANGELOG.md
      close-project-button.tsx Client component for the fixed top-right pill — IntersectionObserver
                             toggles a dark/light opaque state to match whatever section is
                             behind it, see CHANGELOG.md
public/
  media/                   HALOGRIP's images (kept flat at /media/*.webp; not yet reorganized
                            per-project since there's only one project with real assets)
  home/                    Homepage's real assets (avatar, portrait, logos/, projects/) — see
                            CHANGELOG.md for the source→destination mapping
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

- Hosted on **Vercel**, live at https://sylviaxie.vercel.app (renamed from
  `halogrip-portfolio.vercel.app` — HALOGRIP is one case-study project, not the whole site;
  Sylvia asked for the site-level project/repo/domain to say "Sylvia Xie", not "HALOGRIP". The
  old `halogrip-portfolio.vercel.app` domain was deliberately **not** kept as a redirect, per
  Sylvia's explicit choice — old links to it will break.)
- Source pushed to GitHub: `sylvia990317-bot/sylviaxie` (renamed from `halogrip-portfolio` in the
  same pass — GitHub auto-redirects the old repo URL, so this rename is low-risk unlike the
  Vercel domain one above)
- GitHub → Vercel auto-deploy-on-push is **not yet connected** (Vercel account needs a GitHub
  login connection added manually in the Vercel dashboard first). Until then, deploy manually
  from this directory with `vercel --prod --yes`.

## Change history

Detailed session-by-session notes (what changed, why, how it was verified) live in
`CHANGELOG.md` in this same directory — not auto-loaded, so it doesn't cost context on
every session. Read it when you need the rationale behind an existing decision or an
asset's history; add new entries there (not here) when finishing a session with notable
changes.
