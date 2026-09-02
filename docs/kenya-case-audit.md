# Kenya / Post Harvest — Case Study Audit

**Date:** 2026-09-02
**Scope:** Audit only. No code, content or visual changes were made.
**Sources used:**

| Rank | Source | Role |
|---|---|---|
| 1 | Existing site code (`app/`) | Defines the global shell, navigation, reusable components and route conventions |
| 2 | `references/kenya/portfolio-current/Desktop - {7,8,11,13,14,15}.pdf` | Current **content selection** only — explicitly *not* a visual reference |
| 3 | `references/kenya/RS24_kenya_Post Harvest_Final Report.pdf` (90 pp.) | **Factual source of truth** (see Resolution log #13) |
| 3b | `references/kenya/full-booklet/BOOKLET final.pdf` (47 pp.) | Earlier, incomplete version. Secondary record only |
| 4 | `references/kenya/full-booklet/Links/` (47 files) | Original visual assets |

> **Page citations in this document refer to PDF page numbers** of `BOOKLET final.pdf`, not the
> booklet's own printed page numbers. The two differ by roughly 5 (PDF p.34 = printed p.29). Where
> the printed number matters it is given as "printed p.NN".

> **Note on the source-of-truth booklet.** It could not be page-rendered in this environment
> (`pdftoppm` is unavailable), so its text was extracted with `pdftotext -layout` page by page.
> All textual claims below are verified. Assessments of the booklet's *page imagery* are inferred
> from the corresponding `Links/` assets, which were opened directly.

---

## Resolution log — 2026-09-02

Sylvia reviewed this audit and resolved the open questions below. These are now **confirmed
editorial decisions**, not recommendations, and later sections of this document have been corrected
to match. Where a section still shows the original open question for context, it is marked resolved
inline.

1. **Participant names.** Canonical display spellings confirmed: **Christine, Jakob, Magarite,
   Theresa, Philister**. These were phonetic transcriptions made during fieldwork, not data-integrity
   errors. Portrait-to-name mapping confirmed (§4.2). Portraits were intentionally blurred in the
   original project and are approved for reuse — **no longer a consent or publication blocker**.
   First names may be shown with their portraits. Source files are not renamed. No public disclaimer
   about the phonetic spellings unless Sylvia later requests one.
2. **Editorial positioning.** The unbuilt tower and incomplete validation must **not** be the central
   narrative, the hero framing, or described as the project's strongest asset. The strongest material
   is the research journey — unfamiliar context, field interviews, needs synthesis, focus narrowing,
   concept evaluation with farmers, and the discipline to separate evidence from assumption. Incomplete
   validation is stated clearly, but late, in a dedicated prototype-status and reflection section.
3. **Naming system.** Project title: **Post Harvest**. Selected final concept: **The Drying Tower**.
   The current portfolio's "Final Outcome" heading becomes **"Final Concept"**. "Solar Dryer" is not
   used as the project's name.
4. **Timeframe.** **April–June 2024**, confirmed. The booklet's 2023 cover date is an internal
   source-document error.
5. **Academic context.** Confirmed combined phrasing: **"Year 4, MSc Industrial Design Engineering,
   Chalmers University of Technology."** ("Year 4" and "Master's student" were never actually in
   conflict — Sweden's integrated MSc uses a numbered-year system.)
6. **"Urban areas" removed.** Seme is a rural village and farming context; the phrase is dropped
   entirely rather than corrected in place.
7. **Prototype status wording.** Use: *"The full drying tower remained a detailed final concept. A
   metal solar collector was prototyped and left locally for continued exploration."* No claim of
   deployment, proven performance, measured crop-loss reduction, proven protection from rain/theft/
   animals/weevils, verified 100 kg capacity, verified improvement over tarp drying, or validated
   social/economic impact.
8. **100 kg figure.** Confirmed as an estimated design calculation, never a test result. Public
   wording: *"Estimated design capacity: approximately 100 kg."*
9. **Carrying-capacity numbers (15 kg vs. 10 kg).** Not to be merged into one claim — 15 kg is an
   interview-derived estimate (p.27), 10 kg is a scenario assumption (p.30). Keep separate, or omit
   the comparison if it can't be stated clearly and concisely.
10. **PICS bag lifespan figure removed entirely** from the public case study — the source is
    internally inconsistent (p.24 / p.28 / p.42) and the figure is not essential to the narrative.
11. **Missing screen 4 does not need to be recovered.** The field-research story is reconstructed
    from verified booklet material instead.
12. **Deliverable hierarchy (confirmed 2026-09-02).** The completed deliverable was **not** a
    finished drying tower. The correct hierarchy, which overrides any earlier phrasing in this
    document, is:

    | Rank | Item | Source |
    |---|---|---|
    | Final concept | **The Drying Tower** | p.34 |
    | **Primary deliverable** | **a construction handbook created by the team** | p.36, p.44, TOC p.3 |
    | Handbook's purpose | to guide farmers in building the tower locally | p.44, `Desktop - 11.pdf` |
    | Physically prototyped | **the metal solar collector only** | p.44 |
    | Not completed or validated | the full tower, and any real construction attempt using the handbook | p.44, p.45 |

    The handbook is the actual design outcome and must be presented as such, not as a minor
    supporting document. Section 07 leads with it; section 09 states plainly that the complete
    tower was not constructed and the handbook was not validated through an actual build.
    Approved lead for section 07, used verbatim: *"The project's final deliverable was a
    construction handbook designed to help farmers build the Drying Tower locally."*
    Use **"build"** or **"construct"**, never "rebuild" (and not the deck's "recreate").
    Do **not** add claims about local material sourcing, independence, affordability or
    successful replication: none of these are supported by the source material.
13. **New source of truth (confirmed 2026-09-02): `RS24_kenya_Post Harvest_Final Report.pdf`,
    90 pages.** Sylvia supplied a later, more complete version of the same document. It replaces
    `BOOKLET final.pdf`, which stays on disk as a secondary record.

    - **All existing page citations remain valid.** Pages 1 to 45 were compared page by page
      (p.10, 22, 26, 27, 30, 31, 34, 35, 36, 43, 44, 45) and are identical. Nothing needs re-keying.
    - **It contains the handbook** at pages 54 to 90, which closes open question F. Structure:
      p.54 title page ("Drying Tower, First (1st) version") listing **Construction, materials,
      tools, how to use**; p.55 a "What is this?" introduction; p.57 "Tools needed";
      p.60 "Cutlist of materials"; a Black Box section from p.61; a Drying Tower section from p.76.
    - **It fixes corrupted text.** `BUYERBSUYER` now reads as a real BUYER entry, and
      `CONSTCROUNCSTTOURCSTOR` is now **FABRICATORS** with real content. The garbled
      `MRaErAgaLrITitYe` string is gone. **Only `according to Blablabla` (p.28) remains unfilled.**
    - **It fixes the farmer name mismatch.** Theresa now has her own biography on p.16: 70 years
      old, grows maize, beans and peanuts, keeps cows, chickens and ducks, and attends communal
      One Acre Fund meetings, which is why she does not have the weevil and theft problems the
      others describe. Jacob, Philister, Christina and Margaret all align correctly.
      §6.4(b) is therefore resolved **in the source itself**, not only by Sylvia's confirmation.
    - **It contains the full reference list** at p.48 to 49: FAO (2012), FAO (2013),
      World Bank (2011), Ketiem (n.d., ILRI/SLU), Encyclopaedia Britannica, City Population,
      Hagstrum, Phillips and Cuperus (2012), Sauer (1988), Kuiper-Goodman (1995),
      Weather and Climate (n.d.). Use these for the statistics in section 02.
    - A Logical Framework sits at p.52 to 53. **Not used** in the case study.
    - The handbook states its own status on p.55, in the team's words:
      *"The principles work, but we are not sure how efficient they will be in this version.
      The prototype needs to be built and tested in real-world conditions."* This is quoted
      directly in section 07.
    - ⚠️ Note p.57: the handbook says fabrication needs someone who can cut and weld metal.
      This is a constraint, and it is a further reason not to imply that the tower is easy,
      cheap or independent to build.

---

## 0. Executive summary

Seven findings that shaped this audit, updated to reflect the resolutions above:

1. **There is no existing Kenya page to redesign.** This is a from-scratch build, not a refactor.
2. **The project's real title is "Post Harvest"**, not "Solar Dryer". The selected final concept is
   named **"The Drying Tower"**.
3. **The full drying tower was never constructed or performance-tested** — only the metal solar
   collector was prototyped and left with a farmer. This is stated clearly in a dedicated
   prototype-status section, but per confirmed editorial direction it is **not** the project's central
   narrative or its strongest asset (see Resolution log #2). The strongest material is the research
   journey: entering an unfamiliar context, field interviews, needs synthesis, focus narrowing, and
   concept evaluation with farmers.
4. **The booklet contains unfinished and corrupted text** that must never be copied to the web.
5. **Farmer portraits and first names are approved for use**, with the canonical spellings Sylvia
   confirmed (§4.2) — the booklet's inconsistent phonetic transcriptions are resolved, not a blocker.
6. **Three high-value assets are currently unused**, and three others must never be published.
7. **One slide of the original 7-screen portfolio sequence was never supplied and does not need
   recovery** — the field-research story is reconstructed from the verified booklet material instead.

---

## 1. Existing route and component structure

### 1.1 The Kenya route does not exist

`app/work/` contains exactly one subdirectory: `halogrip/`. A repo-wide, case-insensitive search for
`kenya`, `solar` and `stella` returns **zero matches** anywhere outside `references/`.

The project exists today only as a non-clickable placeholder card:

```ts
// app/data/projects.ts:40-47
{
  slug: "coming-soon-3",
  cardLabel: "04 / Maize Drying System",
  subtitle: "New project — details soon",
  comingSoon: true,
  image: "/home/projects/corn-hands.jpg",
  tags: PLACEHOLDER_TAGS,          // ["Placeholder tag", "2026"]
}
```

There is no `page.tsx`, no route CSS, no client components and no `public/` assets for it.

**Implication for the brief.** "Redesign the existing case study" means: the *existing artefact* is
the six-slide PDF deck, and the web version has to be authored. Section 2 below therefore audits the
**deck** rather than a page.

### 1.2 What actually exists and is reusable

**Global shell — shared by every route:**

| File | Provides |
|---|---|
| `app/layout.tsx` | Root layout; `Inter_Tight` / `Inter` / `DM_Mono` via `next/font/google` as CSS vars; site metadata; `<html lang="en" data-scroll-behavior="smooth">` |
| `app/globals.css` | `@import "tailwindcss"` + `@theme` tokens + `@layer base` reset. **20 lines total.** |

`@theme` tokens available site-wide:
`--color-bg: #f9f9fa`, `--color-ink: #141415`, `--color-muted: #656572`, `--color-tertiary: #858593`,
`--color-line: #e4e4e7`, `--radius-card: 20px`, `--font-heading`, `--font-body`, `--font-mono`.

`@layer base` reset: `*{box-sizing:border-box}`, `html{scroll-behavior:smooth}`,
`a{color:inherit;text-decoration:none}`, `img{display:block;max-width:100%}`.

**Reusable components:** `app/components/PlaceholderImage.tsx` (hatched placeholder box — required by
CLAUDE.md rule 5 for any asset not yet real). `SiteHeader` / `SiteFooter` exist but HALOGRIP does
**not** use them — it ships its own `<footer className="site-footer shell">` and a
`CloseProjectButton`. Both precedents are therefore available.

### 1.3 Route conventions established by HALOGRIP

These are the conventions a new case-study route should follow (per CLAUDE.md rules 1–3):

- **Route-scoped CSS**: plain `.css` files imported *only* from that route's `page.tsx`, so Next.js
  code-splits them per route. Heavy animated components get their own stylesheet
  (`halogrip.css` 408 lines, `scroll-intro.css` 54, `design-gap-sequence.css` 92).
- **Route-scoped fonts**: `next/font/google` called *inside* `page.tsx`, exposed as CSS custom
  properties (`--halogrip-display`, `--halogrip-mono`) so they never load on `/`.
- **Per-scene client components**: one file per interactive or animated scene
  (16 files, 3,540 lines total).
- **Centralised scroll coordination**: `pin-coordinator.ts` (95 lines) is a plain TS module that
  coordinates GSAP ScrollTrigger pin hand-offs between sections rather than each component pinning
  independently. `section-reveal.tsx` (55 lines) is a generic reveal-on-scroll wrapper.
- **Own metadata export** per route, including `openGraph` / `twitter`.

**Available libraries** (already in `package.json` — no new dependency needed):
`next@16.2.6`, `react@19.2.6`, `gsap@^3.15.0`, `@react-three/fiber`, `@react-three/drei`,
`three@^0.185.1`, `tailwindcss@4.2.1`. Scripts: `dev`, `build`, `start`. **No lint or test script.**

**Recommended new structure:**

```
app/work/post-harvest/
  page.tsx              metadata export, route-scoped font loading, section composition
  post-harvest.css      route-scoped tokens + component classes
  content.ts            all copy + claim provenance as data (see §5)
  <scene>.tsx           one client component per animated scene
public/post-harvest/    converted assets (see §4)
```

---

## 2. Current content — keep / rewrite / merge / remove

The six supplied PDFs are screens 1, 2, 3, 5, 6 and 7 of a **7-screen** sequence (read from the
pagination dots). Narrative order is *not* filename order.

| # | File | Section | Verdict | Reasoning |
|---|---|---|---|---|
| 1 | `Desktop - 7.pdf` | Cover / TOC — "04 / Product Design" | **Merge** into new hero | Keep the maize-in-hands image and the timeframe. Drop the portfolio-wide TOC rail — it belongs to the deck, not a web route. |
| 2 | `Desktop - 8.pdf` | "Solar Dryer" / BACKGROUND | **Rewrite** | See §2.1 — contains a factual error. |
| 3 | `Desktop - 15.pdf` | LEARNING | **Keep + relocate** | Strong, honest, specific content. But see §2.2 on its placement. |
| 4 | *(never supplied)* | — | **Reconstruct** | Screen 4 of 7 was not supplied. **Resolved: recovery not required** — the field-research story is rebuilt from verified booklet material (§3.2, §3.6). |
| 5 | `Desktop - 13.pdf` | FOCUS: MAIZE DRYING | **Keep + expand** | The best-argued screen. But it presents the *conclusion* of narrowing without showing the *reasoning* — §3.3. |
| 6 | `Desktop - 14.pdf` | GENERATING IDEAS | **Keep + rewrite captions** | Three concepts are shown but the evaluation method behind the choice is omitted — §3.4. |
| 7 | `Desktop - 11.pdf` | FINAL OUTCOME | **Rewrite; retitle "Final Concept"** | Reads as a delivered, working product. It was not. The correction is necessary, but belongs in a late prototype-status section rather than the opening story. See §2.3. |

### 2.1 `Desktop - 8.pdf` — factual errors to fix

Current copy:

> "Reality Studio is a transformative course offered within the Master's program at Chalmers.
> Through the course, I had the opportunity to travel to Kenya and engage directly with local
> stakeholders **in urban areas** to develop innovative design that improves health and enhances
> quality of life."

Two problems:

1. **"in urban areas" is wrong for this project — resolved: remove the phrase entirely.** It is
   lifted verbatim from the generic course description (booklet PDF p.6). The actual work happened in
   **Seme, a rural village and farming context** with a population density of 450 people/km² (p.10).
   Describing rural smallholder fieldwork as urban is the kind of error a design recruiter notices.
2. **"transformative" is course-brochure language.** It describes the course, not the work.

**Academic context — resolved, and not actually a conflict.** `Desktop - 7.pdf` says *"Year 4 at
Chalmers... Group project of 4 students"*; this slide and booklet p.6 say **master's programme**
(*"Sylvia and Yuhan are master's students in industrial design, and Xuanjia and Helge are master's
students in architecture"*). Both are true at once under Sweden's integrated MSc year-numbering.
Confirmed phrasing: **"Year 4, MSc Industrial Design Engineering, Chalmers University of
Technology."**

### 2.2 `Desktop - 15.pdf` — keep the content, reconsider the placement

The slide opens: *"I chose to present my learnings from this project at the beginning, as they may
be even more important than the project outcome itself."*

This instinct is right, and the content is genuinely strong — three named, specific
cross-disciplinary failures with what she'd do differently. **Keep all of it.**

However, on a **scrolling web page** the trade-off differs from a deck. Leading with reflection asks
the reader to care about lessons from a project they know nothing about yet. Recommendation:

- Put a **one-line thesis** in the hero that signals the honesty up front.
- Place the **full reflection near the end**, where it lands with force.

This preserves her intent (reflection is not an afterthought) while respecting how a case-study page
is actually read.

### 2.3 `Desktop - 11.pdf` — rewrite and retitle

**Editorial resolution.** This section is retitled **"Final Concept"** (not "Final Outcome") in the
new information architecture, and the correction below lives in a dedicated prototype-status section
late in the page — not in the hero or the opening story. The correction itself remains necessary;
only its placement and emphasis change.

**Deliverable resolution (Resolution log #12).** The slide's handbook sentence is not a footnote to
the tower: **the handbook *is* the deliverable.** Section 07 now leads with it, and the tower is the
concept the handbook describes. What the slide gets wrong is not mentioning the handbook, but
implying the tower itself was completed and its benefits demonstrated.

Current copy states, with no qualification:

> "After returning to Sweden, we finalized the concept... We created a **handbook** with measurements
> and construction guidelines for the facility, which the farmers in Kenya can follow to recreate the
> design."
>
> "**What problems can it solve?** Locking the door prevents issues like chickens eating or
> contaminating crops, theft, and unexpected rain. It also helps reduce weevils by driving them away
> with heat."

The booklet is unambiguous that none of this was verified:

- **p.44:** *"We left our **metal solar collector** with the farmer. The next step is **to construct
  the tower structure** per our handbook and assess the intricate concept for potential
  improvements."* → Only the black-box collector was left behind. **The tower itself was never
  built.**
- **p.45:** *"Due to time constraints, the prototype presented was **not optimal**."*
- **p.45:** *"While the principle of indirect solar drying is known... **it has not been tested under
  the exact same circumstances.** Key questions remain, such as whether it is possible to efficiently
  dry large amounts of grains like maize in these structures, **whether it is better than the
  conventional tarp method** used by the farmers today..."*
- **p.45:** *"Because we did not conduct the field study during the harvest season... **we are
  uncertain if our design meets all the desired features.**"*
- **p.35:** *"So in theory this should work, but **there are a lot of variables.**"*
- **p.34:** *"**More testing needs to be conducted**, but this could probably be achieved by putting
  fine fishing net on the shelves."*

**"What problems can it solve?" must become "What it is designed to solve — and what we could not
verify."** Every benefit currently asserted is a *design intention*, not a demonstrated result.

This is not a weakness to hide. A candidate who can distinguish an intended benefit from a validated
one is demonstrating exactly the judgement UX and industrial-design teams hire for. Frame it as a
deliberate epistemic position, not an apology — **and not as the headline**. It is one honest beat
late in the page; the hero and opening sections lead with the research journey (Resolution log #2).

---

## 3. Important information missing from the current page

Ranked by what it adds for a design recruiter.

### 3.1 The mandate changed — and that is the story (booklet p.7)

> *"Initially, our given mission was to solve the **grain storage** problem in Seme village. However,
> with the time flow, we decided to focus on the **drying process** instead."*

The current portfolio never mentions that the team was **assigned a different problem** and changed
it based on evidence. For a recruiter this is the single most valuable move in the project:
*reframing a brief because the research said so.* It is currently invisible.

### 3.2 The nine-step design process (booklet p.22, printed p.17)

A documented, numbered, iterative process — completely absent from the current deck:

| # | Step | Detail (p.22–25) |
|---|---|---|
| 1 | First site visit | |
| 2 | Qualitative interview & observation + literature review | Prior storage methods, maize weevil, maize |
| 3 | Data analysis | Hierarchical Task Analysis (HTA), flow matrix |
| 4 | Brainstorming round 1 | Maize storage and drying process |
| 5 | Literature review 2 | Mechanism of maize drying, hermetic bags |
| 6 | Brainstorming round 2 | Drying process |
| 7 | Site visit 2 + concept evaluation round 1 | |
| 8 | Brainstorming round 3 | Improvements and iterations on concepts |
| 9 | Site visit 3 + concept evaluation round 2 | |

**Three site visits and two concept-evaluation rounds with real users.** The current deck compresses
this to one sentence ("multiple rounds of field studies"). This is the backbone the new page needs.

### 3.3 The reasoning behind narrowing to maize drying (p.23–24, p.29)

The current deck presents "FOCUS: MAIZE DRYING" as a conclusion. The booklet shows the argument:

- p.23 — Initially prioritised **both** storage and drying: *"Storage was initially identified as a
  primary issue, and drying was of particular interest to our team members."*
- p.24 — Literature review revealed the storage problem was largely a **knowledge gap**, not a design
  gap: PICS bags already solve it, farmers were misusing them.
- p.24 — Discovered **two subgroups**: farmers who already have a storage room, and those who don't.
  *"farmers with storage rooms don't have a problem with a lack of storage space."*
- p.24 — Tested this by putting a storage concept into the farmer evaluation anyway: *"the thought
  was confirmed. Therefore... we decided to focus on increasing the effectiveness of the drying
  process."*

**They validated a scoping decision with users before committing to it.** That is a rigorous move and
it is entirely missing from the current page.

Asset `focus area.png` visualises exactly this — the six-stage maize lifecycle (Prework → Planting
Seeds → Waiting For Harvest → Harvest → **Drying Corns** → Storage) with the drying stage circled.
Currently unused.

### 3.4 How concepts were evaluated — including the team's own methodological correction (p.25)

- Ideas were presented verbally to **three of the five** farmers; the "table idea" was preferred.
- A requirement specification was written **before** the final brainstorm.
- The solar dryer emerged in the final session and was preferred by the **remaining** farmers.
- **The team caught a bias in its own method:**

> *"Various group members made the sketches at different detailed levels, potentially impacting which
> concept the farmers found more favorable. Knowing that the sketches were made by different members
> could also cause the farmers to give positive feedback on every concept. Therefore, the sketches in
> the second round of evaluation were made by **one person**, and the author of each concept remained
> **anonymous**."*

This is a research-methods insight of real professional quality — recognising demand characteristics
and controlling for them mid-study. **It is the strongest single paragraph in the entire booklet for
a UX audience, and it does not appear in the portfolio at all.**

### 3.5 Expressed vs. latent needs (p.26–28)

A structured needs model the deck reduces to four icons:

- **Expressed:** drying process, storage (weevils, space), transportation of crops, water for daily
  usage, extreme climate, effectiveness regarding harvest.
- **Latent:** **independence** (from One Acre Fund's sterile seeds and finite-life bags),
  **infrastructure**, **knowledge gap**.

The expressed/latent distinction is standard design-research vocabulary and signals training.
Asset `needs.ai` is the original diagram. Currently unused.

### 3.6 Research methods, named (p.18–19)

Qualitative interviews (structured → semi-structured as the study progressed), observation,
**Hierarchical Task Analysis**, **brain-drawing**, requirement specification, literature review, user
evaluation interviews, prototyping. Plus a documented data-capture protocol: *"at least two people
take notes and one person is responsible for photography... All interviews are also recorded."*

Also worth surfacing — an ethical observation (p.23):

> *"there was one time when we placed the camera directly in front of the interviewee for better
> quality. From her body language, it was clear she felt uneasy. I've learned from this experience."*

### 3.7 The requirement list (p.31, duplicated at p.43)

3 mandatory requirements and ~17 desired features. Absent from the current page, though
`Desktop - 14.pdf` refers to "a requirement list" without showing it. Note that two of the desired
features are **duplicated within the list itself** ("It should prevent grains from being polluted by
animals" appears twice) and one contains a copy-paste error from a bag-related brief ("Putting the
grain into **the bag**"). Clean before publishing.

### 3.8 The mechanism, explained (p.35)

The current deck gives one sentence. The booklet explains the full stack-effect chain: black box
inclined perpendicular to the sun for maximum exposure and water run-off; interior painted black;
air inlet near the ground where air is cooler and relatively drier; air heated on entry, rises
through the shelves, absorbs moisture, exits via the chimney; single inlet low and single outlet high
with sufficient height difference to maximise the stack effect. Assets `Sun rays capturing.pdf` and
`Airflow chart.pdf` illustrate the two halves. Currently unused.

### 3.9 Next steps as open questions (p.44)

Five specific unanswered questions — ideal as an honest closing section:

1. Is the airflow and the temperature inside the product enough?
2. How should they adjust the facility if the effect is not ideal?
3. How does rapid temperature change impact the maize inside when sudden rain occurs?
4. How much maize is feasible for the equipment to process?
5. Is it more efficient and convenient than the traditional way of maize drying?

### 3.10 Material reasoning and its unresolved tension (p.36, p.45)

Metal was chosen for speed of construction and durability; **farmers preferred metal** for long-term
resilience; **but metal's high cost is a barrier for small-scale farmers** (p.45). A genuine,
unresolved trade-off — far more interesting than a resolved one.

---

## 4. Asset inventory

All files in `references/kenya/full-booklet/Links/` (47 files). Dimensions verified.

### 4.1 Photography — usable at hero scale

| File | Dimensions | Proposed use |
|---|---|---|
| `DSCF0457.JPG` | 4416×2944 | Hero candidate / full-bleed section break |
| `DSCF0515.JPG` | 4416×2944 | Hero candidate / full-bleed section break |
| `_DYR7834.jpg` | 3936×2624 | Field-research section, landscape |
| `_DYR8550.jpg` | 3936×2624 | Field-research section, landscape |
| `_DYR8983.jpg` | 2624×3936 | **Portrait orientation** — good for an asymmetric two-column pairing |

> Content of these five was not individually verified (page rendering unavailable). **Confirm subject
> matter with Sylvia before assigning each to a section.**

### 4.2 Farmer portraits — approved, canonical names confirmed

**Resolved 2026-09-02.** Sylvia has confirmed the canonical display spelling for each participant and
the portrait-to-person mapping directly, independent of the booklet's mismatched page layout. The
booklet's conflicting spellings were phonetic transcriptions made during fieldwork, not a
data-integrity problem. The portraits were **intentionally blurred in the original project** and are
approved for reuse — this is no longer a consent or publication blocker.

| File | Dimensions | Canonical display name | Proposed use |
|---|---|---|---|
| `christine.png` | 822×1052 | **Christine** | Participant section |
| `jakob.png` | 817×818 | **Jakob** | Participant section |
| `magarete.png` | 1141×1592 | **Magarite** | Participant section |
| `phlister.png` | 1221×1841 | **Philister** | Participant section |
| `tresa.png` | 1846×1998 | **Theresa** | Participant section |

First names may be displayed with their corresponding portraits. **Do not rename the source files.**
Do not add a public disclaimer about phonetic spelling unless Sylvia later requests one. The existing
blur is a deliberate visual property to design *with*, not a defect to correct.

### 4.3 Illustrations and diagrams — the highest-value unused assets

| File | Format | Proposed use |
|---|---|---|
| `focus area.png` | 1241×1754 PNG | **★ Priority.** Six-stage maize lifecycle with drying circled — the narrowing-of-focus section (§3.3) |
| `needs.ai` | 1-page vector | **★** Expressed vs. latent needs map (§3.5) |
| `flowshart draft 2 (1).ai` | 1-page vector | **★** The nine-step design process (§3.2) |
| `cover time line draft 1 (2).ai` | 1-page vector | Project timeline, Mar–May 2024 |
| `context map.ai` | 1-page vector | Sweden → Kenya → Seme locator |
| `NS_0091.png` | 3165×2091 | Traced market-scene illustration, transparent bg. **Contains a baked-in colour-swatch strip in the top-right — crop it out.** |
| `NS_0220.png` | 750×1487 | Traced illustration |
| `NS_0047.png` | 590×947 | Traced illustration |
| `NS_0045.png` | 348×510 | Traced illustration — small, use at modest scale only |
| `NS_0097.png` | 427×476 | Traced illustration — small, use at modest scale only |
| `llhp2zKq.png` | 1131×585 | Unidentified — verify before use |
| `2.png` | 500×500 | Unidentified — verify before use |

The `NS_*` files are **hand-traced, flat-colour, transparent-background illustrations**. Per Sylvia's
direction these are a core asset to preserve — but note they were traced against the booklet's
original palette, so **recolouring them to the new palette will be part of the work**, not a
copy-paste.

### 4.4 Product renders and technical drawings

All are single-page vector PDFs with **no extractable text** — pure artwork, so they convert cleanly
to SVG.

| File | Size | Proposed use |
|---|---|---|
| `Empty Shelves.pdf` | 7.5 MB | Product hero — tower with shelves visible |
| `Door Swung Open.pdf` | 766 KB | Product detail — lockable door (the anti-theft/anti-chicken feature) |
| `Sun rays capturing.pdf` | 1.3 MB | Mechanism step 1 — heat capture (§3.8) |
| `Airflow chart.pdf` | 1.3 MB | Mechanism step 2 — stack-effect airflow (§3.8) |
| `scenario.pdf` | 112 KB | Use-scenario illustration |
| `next step.pdf` | 72 KB | Next-steps / open-questions section |
| `talkng to friend.pdf` | 38 KB | Scenario illustration — the "visiting a friend" beat (p.36–37) |

### 4.5 Identity and logos

| File | Dimensions | Proposed use |
|---|---|---|
| `coverSTELLA.png` | 2480×3507 | **Booklet cover — confirms the title "Post Harvest" and the four authors.** Use as a "source document" artefact, not as a layout template. |
| `One-Acre-Fund.png` | 1299×717 | One Acre Fund logo — context/stakeholder section |
| `610px-Formal_Seal_of_Chalmers_te.png` | 610×568 | Chalmers seal. **Cross-check against the homepage's existing `chalmers logo.svg`**, which CLAUDE.md already flags as possibly the wrong sub-brand mark. This file may be the better source. |
| `305219786_...-removebg-preview.png` | 500×500 | Unidentified, background-removed. Verify provenance before use. |

### 4.6 Process icons

Eight Noun Project icons at 700×700: `noun-field-6857922`, `noun-interview-6775950`,
`noun-literature-review-6648844`, `noun-analysis-6843373`, `noun-brainstorm-6813794`,
`noun-draw-960321`, `noun-camera-6874687`, `noun-steel-6719509`.

> **⚠️ Licensing.** Noun Project icons generally require attribution unless a licence was purchased.
> Confirm the licence before publishing, or replace them. Per the redesign skill's iconography
> guidance, a single consistent custom set would serve the new visual identity better than eight
> mixed-provenance icons anyway.

### 4.7 ⚠️ Do not publish

| File | Dimensions | Reason |
|---|---|---|
| `Screenshot 2024-05-28 at 11.21.58.png` | 2560×1600 | **Verified:** a Google Slides screenshot showing the browser bookmarks bar (Gmail, WhatsApp, ChatGPT, Pinterest), open tab titles, and Sylvia's account avatar. **Personal data leak.** |
| `Screenshot 2024-05-20 at 13.59.18.png` | 2560×1600 | Same class of asset — assume the same risk |
| `Screenshot 2024-05-22 at 16.10.23.png` | 2560×1600 | Same class of asset — assume the same risk |
| `PHOTO-2024-05-20-15-26-31.jpg` | **96×96** | Thumbnail-only; unusable at any web size |
| `PHOTO-2024-05-20-15-57-15.jpg` | **96×96** | Thumbnail-only; unusable at any web size |
| `WhatsApp Image 2024-05-22 at 16.52.41.jpeg` | **96×96** | Thumbnail-only; unusable at any web size |

The screenshots do contain one genuinely useful item — *"Graph 1. Effects in storage at different
temperatures"* — but it must be sourced from the original FAO material or redrawn, never
screenshotted.

### 4.8 Conversion requirements

- **7 vector PDFs → SVG** (preserves crispness, small payload, and allows recolouring to the new
  palette). Fall back to high-res WebP only where SVG conversion produces artefacts.
- **2 `.ai` diagram files** (`needs.ai`, `flowshart draft 2 (1).ai`) → SVG. Both are PDF-compatible
  and carry live text, so text can be re-set in the new typeface rather than left as outlines.
- **5 large JPEGs (2.6–8.5 MB each) → WebP**, multiple widths, via `next/image`. `sharp` is already a
  devDependency.
- **Existing card image** `/home/projects/corn-hands.jpg` is already real and can stay.

---

## 5. Factual claim table

Every claim proposed for the page, with its source page and evidence class.

**Evidence classes** — the five requested, plus one addition:

- **Observation** — the team saw it directly in the field
- **Interview statement** — a participant said it
- **Calculation** — derived arithmetically from other figures
- **Concept assumption** — a design intention or an untested belief about how the concept behaves
- **Validated result** — measured or verified by the team
- **Literature (cited)** *(added)* — from an external published source. This class was necessary
  because a large share of the booklet's numbers are cited literature, which is neither the team's
  own observation nor their assumption. Every such claim must carry its citation on the page.

### 5.1 Context and scale

| # | Proposed claim | PDF p. | Class |
|---|---|---|---|
| 1 | Seme is a rural village and sub-county north-east of Lake Victoria, ~5 km south of the equator | 10 | Observation |
| 2 | Seme sub-county: population 122,000, area 268 km², density 450 people/km² (2019) | 10 | Literature (cited) — *City Population* |
| 3 | For comparison, Gothenburg's density is 3,200 people/km² | 10 | Literature (cited) |
| 4 | Kisumu, the county Seme belongs to, is Kenya's third-largest city (~1.2 m) | 10 | Literature (cited) — *Britannica* |
| 5 | Four of the five farmers the team worked with were women | 10 | Observation |
| 6 | Agriculture contributes up to 30% of Kenya's annual GDP | 10 | Literature (cited) — *Ketiem, P.* |
| 7 | Nearly 1 in 3 Kenyans (14.5 m) face chronic food insecurity annually | 10 | Literature (cited) — *Ketiem, P.* |
| 8 | Kenya loses up to 30% of key cereals within six months after harvest | 10 | Literature (cited) — *World Bank et al., 2011* |
| 9 | Maize accounts for up to 15% of Kenya's GDP from food crops | 10 | Literature (cited) — *Ketiem, P.* |
| 10 | In 2008 maize farmers lost up to KES 29.6 bn, 80% linked to poor storage and aflatoxin | 10 | Literature (cited) — *Ketiem, P.* |
| 11 | A Kenyan small-scale farmer manages <1 to ~10 hectares | 10 | Literature (cited) — *FAO, 2013* |

### 5.2 Team, brief and process

| # | Proposed claim | PDF p. | Class |
|---|---|---|---|
| 12 | Reality Studio is a Chalmers master's course in Architecture and Planning Beyond Sustainability | 6 | Observation (course fact) |
| 13 | Team of four: two MSc industrial design (Sylvia, Yu-Han), two MSc architecture (Xuan-Jia, Helge) | 6 | Observation |
| 14 | **The original assigned mission was grain *storage*; the team changed focus to *drying*** | 7 | Observation |
| 15 | Fieldwork ran 8 April – 9 May 2024; project introduced 18 March 2024 in Sweden | 8 | Observation |
| 16 | Research focused on five farmers, due to time constraints | 14, 16 | Observation |
| 17 | Apollo, a local handcraft and agriculture expert, acted as intermediary with the community | 14 | Observation |
| 18 | Nine-step process across three site visits and two concept-evaluation rounds | 22 | Observation |
| 19 | Methods: qualitative interviews, observation, HTA, brain-drawing, requirement spec, literature review, user evaluation, prototyping | 18–19 | Observation |
| 20 | Interviews began structured, then became semi-structured as the study progressed | 18 | Observation |
| 21 | Protocol: ≥2 note-takers, 1 photographer, all interviews recorded | 19 | Observation |
| 22 | Sylvia formulated the interview questions and conducted all the interviews | *Desktop-13* | **Portfolio claim — not in booklet.** Verify with Sylvia; cite as her own account |
| 23 | An interviewee visibly felt uneasy with a camera placed directly in front of her; the team changed approach | 23 | Observation |
| 24 | Second-round evaluation sketches were drawn by one person and kept anonymous, to control for sketch-quality and authorship bias | 25 | Observation |

### 5.3 Findings — what the farmers reported

| # | Proposed claim | PDF p. | Class |
|---|---|---|---|
| 25 | Farmers can carry a maximum of ~15 kg of maize at a time, using only hands and small utensils | 27 | Interview statement |
| 26 | A farmer with 400 kg needs ~27 trips; at 3 min/trip ≈ 80 minutes to carry out | 27 | Calculation |
| 27 | Carrying out and back in again ≈ 3–4 hours daily, over 4–7 days of harvest | 27 | Calculation (from 25–26) |
| 28 | Grain must come indoors each evening because of theft and rain | 27 | Interview statement |
| 29 | Theft is especially severe for farmers living closer to the road | 27 | Interview statement |
| 30 | Chickens repeatedly eat and contaminate maize drying on the ground | 27 | Observation |
| 31 | Rain can arrive while the farmer is absent; tarps do not fully protect the maize | 27 | Interview statement |
| 32 | If maize is not dried enough, mould develops | 27 | Interview statement |
| 33 | "During a great harvest season, I could produce one bag of beans, but I could only harvest a half bag in time." | 27 | Interview statement *(direct quote — attribute to Theresa)* |
| 34 | Three of five farmers reported significant storage-capacity problems | 26 | Interview statement |
| 35 | Harvests of 400–600 kg vs. a donkey's 100 kg (2-sack) capacity forces multiple trips or rentals | 26 | Interview statement + Calculation |
| 36 | One Acre Fund maize is less insect-resistant than traditional maize, so farmers store traditional maize longer | 26 | Interview statement |
| 37 | Only one of the five farmers used PICS bags correctly — and was the only one without weevil problems | 28 | Observation |
| 38 | Farmers wrongly believed PICS bags were chemically treated and lost potency after a season | 28 | Interview statement |
| 39 | Latent need: independence from suppliers (sterile seeds requiring repurchase each season) | 28 | Interview statement |
| 40 | **The core storage problem turned out to be a knowledge gap, not a missing product** | 28, 45 | Observation |

### 5.4 Concept and mechanism

| # | Proposed claim | PDF p. | Class |
|---|---|---|---|
| 41 | The drying tower has two components: a black box solar collector and a shelved tower, joined by a flexible pipe | 34 | Concept assumption *(design description)* |
| 42 | The black box heats air; hot air rises through the shelves and exits via a chimney (stack effect) | 35 | Concept assumption |
| 43 | The inlet is placed near the ground because low air is cooler and relatively drier | 35 | Concept assumption |
| 44 | The collector is inclined perpendicular to the sun for maximum exposure and water run-off | 35 | Concept assumption |
| 45 | A lockable door is intended to prevent theft, rain damage and animal contamination | 34 | Concept assumption |
| 46 | Heat is intended to help drive out weevils | *Desktop-11* | **Concept assumption — booklet does not verify this.** Do not state as a benefit |
| 47 | Shelf dimensions 81 × 70 × 2.5 cm | 36 | Observation *(design spec)* |
| 48 | At a maize bulk density of 760 kg/m³, each shelf holds ~10 kg | 36 | **Calculation** |
| 49 | **"Estimated design capacity: approximately 100 kg."** Derived from 10 shelves × ~10 kg. Never state as a tested or achieved result. Drop the booklet's "equal to one PICS bag" comparison — it invites the reading that capacity was verified | 36 | **Calculation** |
| 50 | The 10 kg-per-shelf figure was set by the carrying capacity of the least physically strong of the five farmers | 36 | Concept assumption *(design decision grounded in observation)* |
| 51 | Built in metal for durability and speed of construction; farmers preferred metal | 36, 45 | Interview statement + design decision |
| 52 | Metal's cost is a barrier for small-scale farmers — unresolved | 45 | Observation |
| 53 | Could also dry beans; millet would need finer shelf holes — untested, "probably" fishing net | 34 | Concept assumption |
| 54 | Target moisture: reduce to max 15% from 18–25% at harvest | 40 | Literature (cited) — *FAO, 2012* |
| 55 | Siaya's yearly average temperature is 23.93 °C | 40 | Literature (cited) — *Celsius Weather and Climate* |

### 5.5 What was *not* established — the honest close

| # | Proposed claim | PDF p. | Class |
|---|---|---|---|
| 56 | **Only the metal solar collector was prototyped and left with a farmer; the tower structure was never constructed** | 44 | Observation |
| 57 | **A construction handbook was the project's primary deliverable.** It carries measurements and construction guidelines for building the tower, and marks alternative materials per component | 36, 44, TOC p.3, *Desktop-11* | Observation |
| 57b | **The handbook was never validated through an actual build.** Constructing the tower from it is named as the next step | 44 | Observation |
| 58 | "Due to time constraints, the prototype presented was not optimal" | 45 | Observation |
| 59 | The concept has not been tested under these circumstances; it is unknown whether it beats the tarp method | 45 | Observation |
| 60 | Fieldwork missed the harvest season, so some needs may have gone unidentified | 45 | Observation |
| 61 | Grain-loss reduction — a key requirement — could not be measured | 45 | Observation |
| 62 | Five open questions remain (airflow/temperature adequacy, adjustment, sudden rain, real capacity, efficiency vs. tradition) | 44 | Observation |
| 63 | "So in theory this should work, but there are a lot of variables" | 35 | Concept assumption *(direct quote)* |

### 5.6 What the evidence classes reveal

> **Across 63 candidate claims, none qualifies as a *validated result*.**

This is an accurate description of the project's epistemic status, and the page is written to respect
it. It is **not** the page's headline. Per the confirmed editorial direction (Resolution log #2), the
empty validated-result column is evidence of something more useful: the project generated a
substantial body of **observation and interview evidence**, applied **calculation** where evidence ran
out, and kept **concept assumptions** labelled as such rather than promoting them.

The framing for the page is therefore: **a well-researched, farmer-evaluated concept whose author can
say precisely which parts are evidenced, which are calculated, and which remain untested.** The
untested questions are named explicitly, once, in the prototype-status section.

### 5.7 Claims that must NOT be made

| Do not claim | Why |
|---|---|
| Successful deployment | Only the collector was prototyped and left locally; the tower was never built (p.44) |
| Proven drying performance | Never measured (p.45) |
| Measured crop-loss reduction | Explicitly could not be measured — the field study missed the harvest season (p.45) |
| Proven protection from rain, theft, animals or weevils | Design intentions, not demonstrated outcomes (p.34) |
| A verified 100 kg capacity | A calculation from shelf dimensions and bulk density (p.36). Use "Estimated design capacity: approximately 100 kg" |
| A verified improvement over tarp drying | Explicitly named as an open, unanswered question (p.45) |
| Validated social or economic impact | No such measurement exists anywhere in the source material |
| That anyone has built the tower from the handbook | The handbook was never validated through an actual build (p.44) |
| That the tower can be built from locally sourced or affordable materials | Not supported. The booklet notes alternative materials are marked in the handbook (p.36), and separately that metal's cost is a barrier (p.45). Neither supports a sourcing, affordability or independence claim |
| "Rebuild" or "recreate" the design | Wrong register and not what happened. Use "build" or "construct" |
| A merged "15 kg vs 10 kg" carrying figure | Different evidence classes: 15 kg is interview-derived (p.27), 10 kg is a scenario assumption (p.30). Keep separate, or omit the comparison |
| Any specific PICS bag lifespan (3 years / 3 seasons / 6 seasons) | Source is internally inconsistent (p.24, p.28, p.42) and the figure is not essential — **removed from the public case study entirely** |
| Any statistic not in §5.1–5.5 | Per the brief: invent nothing |
| Any farmer quotation beyond #33 | It is the only verbatim participant quote in the booklet |

---

## 6. Repeated layouts and current visual problems

### 6.1 In the source booklet

- **p.31 and p.43 are the identical requirement list**, reproduced verbatim in both the Process and
  Conclusion sections. Do not carry this duplication into the page.
- Within that list, "It should prevent grains from being polluted by animals" appears **twice**.
- The list also contains a stray requirement from a different brief: *"Putting the grain into **the
  bag** should not take more time than the traditional way."*

### 6.2 In the current six-slide portfolio

- **A single repeated template**: left text column + right image, on five of six slides. Only the
  concept slide varies. Uniform, and by slide 3 the eye has nothing new to hold.
- **All-caps section headers on every slide** (`BACKGROUND`, `LEARNING`, `FOCUS: MAIZE DRYING`,
  `GENERATING IDEAS`, `FINAL OUTCOME`) — flagged by the redesign skill's typography audit. Vary the
  treatment.
- **Three equal cards** for the three concepts (`Desktop - 14.pdf`) — the skill names this as the
  most generic layout pattern; replace with an asymmetric or comparative treatment that also carries
  the *evaluation* story from §3.4.
- **Decorative full-bleed imagery unrelated to content** — the chameleon photo behind "GENERATING
  IDEAS" is atmospheric but says nothing about idea generation. Per Sylvia's direction, imagery
  should work *with* the argument rather than decorate every section.
- **Numbered fragments without a system**: `1`/`2` mechanism callouts on `Desktop - 11.pdf` are
  unexplained at a glance.

### 6.3 Anticipated risks for the new page (from the redesign skill checklist)

Carried forward as constraints for the build, given the existing stack:

- **Typography**: the global shell is Inter / Inter Tight — the skill explicitly flags "Inter
  everywhere" as a default-AI signal. The route-scoped font pattern (§1.3) means a distinct display
  face can be loaded for this route only, exactly as HALOGRIP does. Recommended for the new identity.
- **Colour**: build a **new palette** (per Sylvia's direction), avoiding both the "AI gradient"
  purple/blue and the stereotyped ochre/olive/brown "earthy" register. One accent, kept below ~80%
  saturation, on one consistent grey family.
- **No random dark section** dropped into an otherwise light page — the skill calls this out
  specifically. If contrast is needed, use a deeper tone of the same palette. (Note HALOGRIP uses a
  `dark-section` class; that is its own identity and should not be imported here.)
- **Semantic HTML** (`<main>`, `<section>`, `<article>`, `<figure>`/`<figcaption>`) rather than div
  soup — figures matter here because nearly every asset needs a caption carrying its provenance.
- **Alt text on every image**, describing content — non-negotiable for photographs of real people and
  for diagrams that carry the argument.
- **A working back-navigation** to `/` (HALOGRIP's `close-project-button.tsx` is the precedent).
- **Metadata**: own `metadata` export with `openGraph` / `twitter`, matching the HALOGRIP pattern.

### 6.4 Content-integrity problems in the source — status

**(b), (c), (d) and (e) were resolved on 2026-09-02** (see Resolution log). **(a) and (f) still apply
in full** and remain binding constraints on any copy written from this source.

**(a) Unfinished placeholder text — mostly fixed by the new source.** The old booklet's p.14–15
carried corrupted stub content. In `RS24_kenya_Post Harvest_Final Report.pdf`:

| Item | Old booklet | New report |
|---|---|---|
| BUYER | `BUYERBSUYER` + boilerplate | **Fixed.** Real entry: buyers are neighbours, smaller market actors, or larger corporations |
| Constructor | `CONSTCROUNCSTTOURCSTOR` | **Fixed.** Now **FABRICATORS**, with real content about who farmers contact to build the design |
| Farmer name string | `MRaErAgaLrITitYe,SCTUhrDisItOina` | **Fixed** |
| PICS citation, p.28 | *"according to **Blablabla**"* | ⚠️ **Still unfilled.** The one remaining corruption |

The `Blablabla` citation may never be copied, and nothing depends on it: the PICS lifespan figure it
would have supported is already removed from the public case study (Resolution log #10). Where a
stakeholder's role is genuinely undocumented, omit it rather than inventing one.

**(b) Farmer names and descriptions are mismatched in the booklet itself — RESOLVED.** On p.16 the
heading **THERESA** sits above a description of **Jacob**; on p.17 the heading **MARGARET** sits above
a description of **"Madam Odema"**.

> **Resolution, now twice over.** Sylvia confirmed the portrait-to-person mapping directly (§4.2),
> **and the new source fixes the layout error itself**: `RS24_kenya_Post Harvest_Final Report.pdf`
> p.16 gives Theresa her own biography, with Jacob, Philister, Christina and Margaret all correctly
> aligned. Use that version. The old booklet's page order is superseded, not merely overridden.

**(c) Name spellings are inconsistent throughout — RESOLVED.** These were phonetic transcriptions
recorded during fieldwork, not errors of record. One canonical spelling per person is now confirmed
and must be used consistently in the audit, content plan and all visible site copy:

| Canonical (confirmed) | Variants appearing in the booklet / filenames |
|---|---|
| **Magarite** | Margarite (p.14), Marguerite (p.28), Margaret (p.17), Madam Odema (p.17), `magarete.png` |
| **Christine** | Christina (p.14, 17), `christine.png` |
| **Philister** | Phinister (p.14), Philister (p.16), Phlista (p.26), `phlister.png` |
| **Theresa** | Theresa (p.14, 16), `tresa.png` |
| **Jakob** | Jacob (p.14, 16), `jakob.png` |

Source filenames keep their original spellings; only the **display** names are canonicalised.

**(d) Date conflict — RESOLVED.** The booklet's title page (p.2) reads **18/05/2023**, but its own
timeline (p.8) runs 18/03/2024 → 9/5/2024 and the current portfolio says 04/2024–06/2024. The 2023
cover date is an internal source-document error. **Confirmed: use "April–June 2024".**

**(e) Internal numerical conflicts — RESOLVED:**

| Conflict | Sources | Resolution |
|---|---|---|
| Carrying capacity: **15 kg** vs **10 kg** | p.27 (findings) vs p.30 (Scenario 1) | **Not a conflict to merge.** 15 kg is an interview-derived estimate of what farmers reported carrying per trip; 10 kg is a number inside the Scenario 1 persona narrative, i.e. a scenario assumption. Label separately by evidence class. Omit the comparison entirely if it cannot be explained clearly and concisely. |
| PICS bag life: "up to three years" / "three seasons" / "up to 6 seasons (3 years)" | p.24, p.28, p.42 | **Removed from the public case study.** Internally inconsistent and not essential to the narrative. |
| Programme level: "Year 4" vs "Master's" | `Desktop - 7.pdf` vs `Desktop - 8.pdf` / p.6 | **Not a conflict — combined.** Use **"Year 4, MSc Industrial Design Engineering, Chalmers University of Technology."** |

**(f) "Grace" is a composite persona, not a participant.** She appears in Scenario 1, Scenario 2
(p.30) and the Using Scenario (p.36–37). If any of this narrative is used on the page, she must be
labelled clearly as a scenario persona so she is never mistaken for one of the five real farmers.

---

## 7. Responsive and animation risks

### 7.1 Performance

- **Source images are 2.6–8.5 MB each.** `DSCF0457.JPG` alone is 8.5 MB. Unconverted, a single hero
  would dominate LCP. → `next/image`, WebP, multiple widths, explicit `sizes`. `sharp` is already
  available.
- **`Empty Shelves.pdf` is 7.5 MB** as a vector. Converted naively to SVG it may stay heavy (complex
  paths). Check the converted size; if it exceeds ~200 KB, rasterise to WebP at 2–3 widths instead.
- **Total asset weight is the main risk here** — the `Links` folder is ~122 MB unpacked. Only a
  curated subset should ever reach `public/`.

### 7.2 Layout

- **`100vh` → `100dvh`** for any full-screen section (iOS Safari viewport bug), per the skill.
- **Wide content must scroll in its own container.** The nine-step process (§3.2), the requirement
  list (§3.7) and the claim-provenance captions are all wide; none may cause horizontal body scroll.
- **The two `.ai` diagrams carry live text.** At small viewports that text becomes unreadable if the
  SVG is simply scaled down. Either re-set the labels as real HTML/SVG text that reflows, or provide
  a separate mobile composition. **This is the single largest responsive risk in the project.**
- **`focus area.png` is a tall 1241×1754 portrait diagram** (§3.3) — it will want a different
  composition on mobile than on desktop. Plan for two arrangements, not one scaled image.
- **`NS_*` illustrations have transparent backgrounds** and were traced against the booklet's
  original colours. Against a new palette they may lose contrast or clash. Verify each against the
  final background — and recolour rather than reusing as-is.
- **`NS_0091.png` has a colour-swatch strip baked into the artwork** (top-right). Crop before use.

### 7.3 Animation

- **GSAP ScrollTrigger `pin` is the known-fragile pattern.** HALOGRIP needed a dedicated
  `pin-coordinator.ts` (95 lines) to manage hand-offs between pinned sections. If this page pins
  anything, reuse that pattern rather than re-solving it — and consider disabling pinning entirely
  below a breakpoint, where pinned scroll interacts badly with mobile browser chrome.
- **Animate `transform` and `opacity` only** — never `top`/`left`/`width`/`height`.
- **`prefers-reduced-motion` must be honoured.** Not currently handled anywhere in the codebase —
  worth checking HALOGRIP's scroll components at the same time.
- **Do not gate content behind animation.** The honest-limitations section (§5.5) is the most
  important content on the page; it must be readable even if JS fails or motion is reduced.
- **Scroll-driven reveals suit this narrative** (a research process is inherently sequential), but
  staggered entry on every section becomes noise. Reserve motion for the two or three moments that
  carry argument — the focus-narrowing diagram and the stack-effect mechanism.
- **R3F/three.js is available but almost certainly unnecessary here.** The product exists as clean
  vector drawings and there is no `.glb`. A 3D scene would mean modelling something that was never
  built — which cuts against the page's whole premise. Recommend against.

---

## 8. Recommended implementation sequence

Ordered so that content correctness is settled before any pixels are committed.

### Phase 0 — Open questions *(mostly resolved 2026-09-02)*

| # | Question | Status |
|---|---|---|
| 1 | Farmer name ↔ portrait mapping and consent to publish | **Resolved** — canonical names + mapping confirmed; portraits pre-blurred and approved (§4.2) |
| 2 | Programme level — Year 4 vs Master's | **Resolved** — both true; use "Year 4, MSc Industrial Design Engineering, Chalmers University of Technology" (§2.1, §6.4e) |
| 3 | Sylvia's individual role claim (interviews), for attribution (§5.2 #22) | **Still open** — the claim appears only in `Desktop - 13.pdf`, not the booklet |
| 4 | Missing screen 4 of the current deck | **Resolved** — not required; reconstructed from booklet material |
| 5 | Noun Project icon licensing, or approve replacement (§4.6) | **Still open** |
| 6 | Identify the five unverified photographs and `llhp2zKq.png` / `2.png` (§4.1, §4.3) | **Still open** |

### Phase 1 — Content

7. Write the final page copy against §5, with a provenance note attached to every factual claim.
8. Resolve the numeric conflicts in §6.4e.
9. Draft the honest-limitations section (§5.5) **first** — it sets the tone everything else supports.

### Phase 2 — Assets

10. Convert the 7 vector PDFs + 2 `.ai` files → SVG; verify text handling in the two diagrams.
11. Convert the 5 photographs → WebP at multiple widths.
12. Crop `NS_0091.png`; recolour the `NS_*` set to the new palette.
13. Place the curated subset in `public/post-harvest/`. **Never** copy the three screenshots or the
    three 96×96 files.

### Phase 3 — Visual identity

14. Define the new palette and type scale as route-scoped tokens in `post-harvest.css`.
15. Load the display face via `next/font/google` inside `page.tsx` (route-scoped, per §1.3).
16. Build the grid, spacing scale and figure/caption component — captions are load-bearing here.

### Phase 4 — Route skeleton

17. Create `app/work/post-harvest/page.tsx` with its own `metadata` export (+ `openGraph`/`twitter`).
18. Import `./post-harvest.css` from `page.tsx` only — never from `globals.css` (CLAUDE.md rule 2).
19. Add back-navigation to `/`.

### Phase 5 — Sections

Recommended narrative order, mapping to the brief's seven story beats:

| Section | Content | Key assets |
|---|---|---|
| Hero | Title, role, team, timeframe, one-line honest thesis | `DSCF*` or `_DYR*` photo |
| Entering an unfamiliar context | Reality Studio, Seme, the assigned brief | `context map.ai`, field photos |
| Field research | 3 site visits, methods, protocol, the camera lesson | `flowshart draft 2 (1).ai`, process icons |
| Mapping the problem space | Expressed vs. latent needs | `needs.ai` |
| **Narrowing the focus** | Storage → drying; the knowledge-gap discovery | **`focus area.png`** |
| Requirements & scenarios | Requirement list, scenario personas *(labelled)* | `scenario.pdf` |
| Concepts & evaluation | 3 concepts, 2 evaluation rounds, **the anonymity correction** | Concept sketches |
| The Drying Tower — **Final Concept** | Form, mechanism, interaction | `Empty Shelves`, `Door Swung Open`, `Sun rays`, `Airflow chart` |
| Prototype status & next steps | What was prototyped, what was calculated, 5 open questions | `next step.pdf` |
| Reflection | Cross-disciplinary learnings (from `Desktop - 15.pdf`) | — |

### Phase 6 — Motion

20. Add `SectionReveal`-style entry animation (`transform`/`opacity` only).
21. Add scroll-driven treatment to the focus-narrowing and mechanism sections **only**.
22. Implement `prefers-reduced-motion`; verify the page reads fully with motion disabled.

### Phase 7 — Ship

23. Flip the `projects.ts` entry: `slug: "post-harvest"`, `comingSoon: false`,
    `href: "/work/post-harvest"`, real `cardLabel` and `tags` (replaces `PLACEHOLDER_TAGS`).
24. Responsive pass at 375 / 768 / 1024 / 1440 / 1920; confirm no horizontal body scroll.
25. Verify alt text on every image; keyboard-navigate the whole page.
26. `npm run build`, then `vercel --prod --yes` (auto-deploy is not yet connected — CLAUDE.md).
27. Add a CHANGELOG.md entry.

---

## Appendix — booklet page map (PDF page → content)

| PDF p. | Content |
|---|---|
| 2 | Title page, credits, date (18/05/2023 — see §6.4d) |
| 3 | Table of contents |
| 5–7 | 1 Introduction: Reality Studio, students, project, **UN SDG + the change of mission** |
| 8 | Timeline |
| 9 | Context map (Sweden → Kenya → Seme) |
| 10 | Background: Seme, agriculture in Kenya, maize, small-scale farmers |
| 11 | Siaya county map |
| 12–19 | 2 Stakeholders & Methods (⚠️ p.14–15 contain corrupted text) |
| 20–25 | 3 Process & Findings: **design process, steps 1–8** |
| 26–28 | Expressed needs / latent needs |
| 29 | Focus area diagram |
| 30 | Design criteria — Scenarios 1 & 2 |
| 31 | Requirement list |
| 32–37 | 4 Design Outcome: **final concept, mechanism, material, capacity, using scenario** |
| 39–42 | 5 Conclusion: literature review |
| 43 | Requirement list *(duplicate of p.31)* |
| 44 | **Next steps** |
| 45 | **Reflections** |
| 46–47 | 6 Reference |

> The booklet's table of contents lists an **Appendix (printed p.47) containing the Logical Framework
> and the Handbook (printed p.49)**. The supplied PDF ends at page 47. **The construction handbook
> referenced on `Desktop - 11.pdf` and booklet p.44 is not included in this file** — request it from
> Sylvia if it is to be shown or linked.
