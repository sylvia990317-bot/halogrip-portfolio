import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./post-harvest.css";
import Reveal from "./reveal";
import InlineSvg from "./inline-svg";
import {
  project, meta, context, field, participants, focus, challenge,
  concepts, finalConcept, mechanism, status, reflection,
} from "./content";

/* Route-scoped fonts, same pattern HALOGRIP uses: none of these reach `/` or any other
   route. Geist carries readable text; Bodoni Moda carries display, section numerals and
   quotes, giving the editorial contrast against the technical linework.
   The diagrams are inlined SVG (see inline-svg.tsx) so their labels bind to these same
   variables rather than falling back to a system sans. */
const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--ph-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--ph-mono" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap", variable: "--ph-serif" });

const title = "Post Harvest / Sylvia Xie";
const description =
  "Rethinking maize drying with farmers in Seme. A field research and concept development case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sylviaxie.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: [{ url: "/post-harvest/photo/maize-weevils-1600.webp", width: 1600, height: 1067, alt: "Maize held in a farmer's hands in Seme, Kenya" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/post-harvest/photo/maize-weevils-1600.webp"] },
};

/** Real measured and calculated values only. `src` records the source page. */
const annotations = [
  { v: "10", k: "Shelves", src: "Measured, p.36" },
  { v: "81 x 70 x 2.5 cm", k: "Shelf size", src: "Measured, p.36" },
  { v: "approx. 100 kg", k: "Estimated design capacity", src: "Calculated, p.36" },
];

function SectionHead({ n, heading, lead }: { n: string; heading: string; lead?: string }) {
  return (
    <div className="ph-head">
      <p className="ph-figure-num">{n}</p>
      <h2 className="ph-h2">{heading}</h2>
      {lead ? <p className="ph-lead">{lead}</p> : null}
    </div>
  );
}

export default function PostHarvestPage() {
  const byName = (n: string) => participants.find((p) => p.name === n)!;

  return (
    <main className={`ph-root ${geist.variable} ${geistMono.variable} ${bodoni.variable}`}>
      <Link href="/" className="ph-back">Close project</Link>

      {/* ============ 01 Hero ============
          Approved: the hero photograph stays _DYR7834 (the held cob). Not replaced. */}
      <header className="ph-section ph-hero" id="hero">
        <div className="ph-shell ph-shell-wide">
          <div className="ph-hero-grid">
            <div className="ph-hero-copy">
              <div className="ph-hero-rule" />
              <p className="ph-mono" style={{ margin: "0 0 18px" }}>{project.title}</p>
              {/* Explicit break so the headline is two deliberate lines, never three. */}
              <h1 className="ph-display">
                <span>Rethinking maize drying</span>
                <em>with farmers in Seme</em>
              </h1>
              <p className="ph-hero-sub">{project.subtitle}</p>
              <dl className="ph-meta">
                {meta.map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </div>

            <figure className="ph-hero-figure">
              <div className="ph-frame">
                <Image
                  src="/post-harvest/photo/maize-weevils-1600.webp"
                  alt="A farmer's hands holding a dried maize cob, Seme, Kenya"
                  fill priority sizes="(max-width: 767px) 100vw, 50vw"
                />
              </div>
              <figcaption className="ph-caption">
                Stored maize in Seme. Loss after harvest was the starting point for this project.
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* ============ 02 Context ============  V2 PROTOTYPE
          One composition first: heading, dateline, lead and both statistics read against
          the locator in a single viewport. The map is capped at 340px because it orients
          the reader; it is not the subject of the section. Then one compact evidence
          mosaic on a single image height, so three photographs read as one strip of
          evidence rather than three separate posters. */}
      <section className="ph-section ph-v2" id="context">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-ctx">
              <div>
                <div className="ph-v2-head">
                  <p className="num">02</p>
                  <h2>{context.heading}</h2>
                  <div className="lede">
                    <p className="ph-lbl">{context.dateline}</p>
                    <p>{context.lead}</p>
                  </div>
                </div>

                <div className="ph-v2-stats">
                  {context.stats.map((s) => (
                    <div className="ph-v2-stat" key={s.value}>
                      <b>{s.value}</b>
                      <span>{s.label}. {s.cite}.</span>
                    </div>
                  ))}
                </div>
              </div>

              <InlineSvg name="seme-locator" className="ph-v2-map" caption={context.captions.locator} />
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-v2-mosaic">
              <figure className="ph-mosaic-lead">
                <Image
                  src="/post-harvest/photo/road-to-seme-1600.webp"
                  alt="A red earth road running through dense green vegetation near Seme, with two people and a motorbike in the distance"
                  width={1600} height={1067} sizes="(max-width: 899px) 92vw, 46vw"
                />
                <figcaption className="ph-cap">{context.captions.road}</figcaption>
              </figure>
              <figure>
                <Image
                  src="/post-harvest/photo/field-roof-drying-1600.webp"
                  alt="Greens laid out to dry along the ridge of a corrugated tin roof on a mud-walled building in Seme"
                  width={1600} height={1067} sizes="(max-width: 899px) 92vw, 26vw"
                />
                <figcaption className="ph-cap">{context.captions.roof}</figcaption>
              </figure>
              <figure>
                <Image
                  src="/post-harvest/photo/field-planting-1600.webp"
                  alt="A farmer bending to plant by hand in freshly tilled soil, with young maize seedlings in rows"
                  width={1600} height={1067} sizes="(max-width: 899px) 92vw, 26vw"
                />
                <figcaption className="ph-cap">{context.captions.planting}</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 03 Learning in the field ============
          DOMINANT: the walk-in photograph. Everything else is evidence at supporting
          scale — the seated interview and the timeline share one subordinate row, and
          the five portraits are a small strip rather than five plates. */}
      <section className="ph-section ph-v2" id="field">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">03</p>
              <h2>{field.heading}</h2>
              <p className="lede">{field.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            <figure className="ph-dominant">
              <Image
                src="/post-harvest/photo/field-walking-2400.webp"
                alt="Three team members and a guide walking across a grass clearing towards a homestead with a corrugated roof, seen from behind"
                width={2400} height={1600} sizes="(max-width: 899px) 92vw, 88vw"
              />
              <figcaption className="ph-cap">{field.captions.walking}</figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <div className="ph-support ph-support-2-3">
              <figure>
                <Image
                  src="/post-harvest/photo/field-team-1600.webp"
                  alt="Three team members seated on plastic chairs under a tree, talking with farmers during an interview"
                  width={1600} height={1067} sizes="(max-width: 899px) 92vw, 34vw"
                />
                <figcaption className="ph-cap">{field.captions.team}</figcaption>
              </figure>
              <InlineSvg name="field-timeline" caption={field.captions.timeline} />
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-03-foot">
              <div>
                <p className="ph-lbl">{field.captions.portraits}</p>
                <ul className="ph-strip ph-strip-5 ph-people-strip">
                  {["Christine", "Theresa", "Jakob", "Philister", "Magarite"].map((n) => {
                    const p = byName(n);
                    return (
                      <li key={p.slug}>
                        <div className="ph-strip-frame">
                          <Image
                            src={`/post-harvest/portrait/portrait-${p.slug}-400.webp`}
                            alt={`${p.name}, a farmer who took part in the study. Portrait traced and blurred, as in the original project.`}
                            width={400} height={500} sizes="(max-width: 767px) 44vw, 15vw"
                          />
                        </div>
                        <h4>{p.name}</h4>
                        <p>{p.note}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <figure className="ph-quote">
                  <blockquote>{field.quote.text}</blockquote>
                  <figcaption>
                    <span className="who">{field.quote.attribution}</span>
                    <span className="ph-cap">Interview, Seme, 2024</span>
                  </figcaption>
                </figure>
                <div className="ph-fieldnote" style={{ marginTop: 26 }}>
                  <p>{field.documentation}</p>
                  {/* TODO(sylvia): open question B, confirm this attribution before publishing. */}
                  <p><strong>{field.contribution}</strong></p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 04 Finding the focus ============
          DOMINANT: the needs map, because the finding lives in it. The lifecycle is the
          supporting diagram and is held well below it. */}
      <section className="ph-section ph-v2" id="focus">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">04</p>
              <h2>{focus.heading}</h2>
              <p className="lede">{focus.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            <InlineSvg name="needs-map" className="ph-fig-primary" caption={focus.captions.needs} />
          </Reveal>

          <Reveal>
            <div className="ph-04-foot">
              <InlineSvg name="maize-lifecycle" className="ph-fig-support" caption={focus.captions.cycle} />
              <div className="ph-04-copy">
                {focus.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 05 Defining the challenge ============  V2 PROTOTYPE
          Two beats, each one visual argument sized to a viewport.

          Beat one has exactly one dominant visual, the photograph. The three whole-scene
          drawings sit beside it as a single analytical rail at one small size, and the
          weevil is a smaller inset beneath that rail. The change of scale is carried by
          the composition and by the weevil's own caption; the old "SCALE BREAK" heading
          is gone, because it read as an internal design note rather than page copy.

          Beat two keeps the carrying explanation and the two carrying figures as one unit
          in the left column, with the requirement list beside them in the same viewport.
          The list uses the two-column drawing so all 18 rows stay legible at this width
          instead of being squeezed to about 11px. */}
      <section className="ph-section ph-v2" id="challenge">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">05</p>
              <h2>{challenge.heading}</h2>
              <p className="lede">{challenge.lead}</p>
            </div>
          </Reveal>

          {/* --- beat one ------------------------------------------------------ */}
          <Reveal>
            <div className="ph-beat">
              <div className="ph-beat-head">
                <h3>{challenge.beats.threats}</h3>
                <p className="ph-lbl">{challenge.threatsLabel}</p>
              </div>

              <figure className="ph-dominant" style={{ marginTop: 0 }}>
                <Image
                  src="/post-harvest/photo/chicken-tarp-2400.webp"
                  alt="A chicken standing on maize spread out to dry on a dark tarp on grass, beside a homestead in Seme"
                  width={2400} height={1106} sizes="(max-width: 899px) 92vw, 88vw"
                />
                <figcaption className="ph-cap">{challenge.captions.chickenPhoto}</figcaption>
              </figure>

              <div className="ph-threat-foot">
                <ul className="ph-strip ph-strip-3">
                  {challenge.threats.map((t) => (
                    <li key={t.slug}>
                      <div className="ph-strip-frame">
                        <Image
                          src={`/post-harvest/vignette/vignette-${t.slug}-600.webp`}
                          alt={`Line drawing: ${t.note.toLowerCase()}, on a heap of maize spread on a tarp`}
                          width={t.w} height={t.h} sizes="(max-width: 767px) 30vw, 200px"
                        />
                      </div>
                      <h4>{t.name}</h4>
                      <p>{t.note}</p>
                    </li>
                  ))}
                </ul>

                <div className="ph-weevil-inset">
                  <div className="ph-rail-box">
                    <Image
                      src={`/post-harvest/vignette/vignette-${challenge.weevil.slug}-600.webp`}
                      alt="Line drawing of maize weevils on individual kernels, drawn close up"
                      width={challenge.weevil.w} height={challenge.weevil.h} sizes="132px"
                    />
                  </div>
                  <h4>{challenge.weevil.name}</h4>
                  <p>{challenge.weevil.note}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* --- beat two ------------------------------------------------------ */}
          <Reveal>
            <div className="ph-beat">
              <div className="ph-beat-head">
                <h3>{challenge.beats.needs}</h3>
              </div>

              <div className="ph-v2-needs">
                <div className="ph-carry-unit">
                  <p className="ph-body">{challenge.arithmetic}</p>
                  <figure>
                    <div className="ph-carry-figs">
                      <Image src="/post-harvest/figure/figure-carrying-750.webp" alt="Traced illustration of a person carrying baskets of produce, one balanced on the head" width={750} height={1487} sizes="120px" />
                      <Image src="/post-harvest/figure/figure-wheelbarrow-348.webp" alt="Traced illustration of a person pushing a loaded wheelbarrow" width={348} height={510} sizes="120px" />
                    </div>
                    <figcaption className="ph-cap" style={{ marginTop: 12 }}>{challenge.captions.figures}</figcaption>
                  </figure>
                </div>

                <InlineSvg
                  name="req-checklist-blank-wide"
                  className="ph-v2-checklist"
                  caption={challenge.captions.checklist}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 06 Developing with farmers ============
          DOMINANT: the farmer reading the sketch. The three concepts are one small
          comparison strip, and the tower is marked inside that strip.

          The enlarged repeat of the tower sketch is REMOVED. It showed the same drawing
          twice, the second time at four times the size, which gave the section two
          competing focal points and said nothing the marked frame does not. */}
      <section className="ph-section ph-v2" id="concepts">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">06</p>
              <h2>{concepts.heading}</h2>
              <p className="lede">{concepts.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            <figure className="ph-dominant">
              <Image
                src="/post-harvest/photo/sketch-review-wide-1600.webp"
                alt="Two hands holding a hand-drawn sketch of the drying tower, one pointing at the shelves and its dimensions"
                width={1600} height={900} sizes="(max-width: 899px) 92vw, 88vw"
              />
              <figcaption className="ph-cap">{concepts.captions.review}</figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <ol className="ph-rounds-v2">
              {concepts.rounds.map((r) => (
                <li key={r.n}><b>{r.n}</b><span>{r.text}</span></li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <div>
              <div className="ph-eval-bar-v2">
                <p className="ph-lbl">{concepts.evaluationLabel}</p>
                <InlineSvg name="sketch-legend" className="ph-legend" />
              </div>
              <ul className="ph-strip ph-strip-3">
                {concepts.options.map((o) => (
                  <li key={o.slug} data-picked={o.selected || undefined}>
                    <div className="ph-strip-frame">
                      <Image
                        src={`/post-harvest/concept/concept-${o.slug}-760.webp`}
                        alt={`Hand-drawn concept sketch: ${o.name}`}
                        width={760} height={620} sizes="(max-width: 767px) 88vw, 28vw"
                      />
                    </div>
                    <h4>{o.name}</h4>
                    {o.selected ? <p className="ph-picked-note">{concepts.selectedNote}</p> : null}
                  </li>
                ))}
              </ul>
              <p className="ph-conclusion">{concepts.conclusion}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 07 The Drying Tower ============
          DOMINANT: the construction handbook, which is the completed deliverable. The
          tower drawing and the two handbook pages are supporting plates at a third of
          its size, so nothing competes with it and nothing reads as a delivered tower. */}
      <section className="ph-v2 ph-v2-blue" id="final-concept">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">07</p>
              <h2>{finalConcept.heading}</h2>
              <div className="lede">
                <p className="ph-lbl">{finalConcept.label}</p>
                <p>{finalConcept.lead}</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <figure className="ph-handbook-dominant">
              <Image
                src="/post-harvest/handbook/handbook-cover-1600.webp"
                alt="Cover of the construction handbook, titled Drying Tower, first version, listing a construction manual, materials needed, tools needed and how to use"
                width={1600} height={1132} sizes="(max-width: 899px) 92vw, 78vw"
              />
              <figcaption className="ph-cap">
                <b>{finalConcept.deliverable.title}.</b> {finalConcept.deliverable.text}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <div className="ph-07-support">
              <figure className="ph-support-plate-wrap">
                <div className="ph-support-plate">
                  <Image
                    src="/post-harvest/diagram/tower-shelves-1600.webp"
                    alt="Line drawing of the Drying Tower with its door open, showing ten stacked drying shelves, the chimney above and the black box collector connected at an angle"
                    width={1600} height={1128} sizes="(max-width: 999px) 88vw, 28vw"
                  />
                </div>
                <figcaption className="ph-cap">{finalConcept.captions.tower}</figcaption>
              </figure>

              <figure className="ph-support-plate-wrap">
                <div className="ph-support-plate">
                  <Image
                    src="/post-harvest/handbook/handbook-cutlist-1600.webp"
                    alt="A handbook page headed Cutlist of materials, showing measured steel sections including square tube, angle iron, flat iron, metal sheet and pipe"
                    width={1600} height={1132} sizes="(max-width: 999px) 88vw, 28vw"
                  />
                </div>
                <figcaption className="ph-cap">{finalConcept.captions.cutlist}</figcaption>
              </figure>

              <div>
                {finalConcept.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                ))}
                <ul className="ph-annots" style={{ marginTop: 22 }}>
                  {annotations.map((a) => (
                    <li className="ph-annot" key={a.k}>
                      <span className="v">{a.v}</span>
                      <span className="k">{a.k}</span>
                      <span className="src">{a.src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-07-close">
              <figure className="ph-handbook-quote">
                <blockquote>{finalConcept.handbookQuote.text}</blockquote>
                <figcaption>{finalConcept.handbookQuote.attribution}</figcaption>
              </figure>
              <p className="ph-status-line">
                <span>{finalConcept.status.built}</span>
                <strong>{finalConcept.status.notBuilt}</strong>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 08 How it was intended to work ============
          DOMINANT: the two-state drawing, read as one unit. The difference between the
          frames is the argument, so they are a pair rather than two plates. The ghosted
          handling frames are small evidence beneath. */}
      <section className="ph-section ph-v2" id="mechanism">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">08</p>
              <h2>{mechanism.heading}</h2>
              <p className="lede">{mechanism.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-mech-pair">
              <figure>
                <Image src="/post-harvest/diagram/mechanism-sun-1200.webp"
                  alt="Diagram showing the angled black box collector capturing sun rays to heat the air inside it"
                  width={1200} height={846} sizes="(max-width: 799px) 92vw, 42vw" />
                <figcaption><span className="ph-frame-n">1</span>{mechanism.frameCaptions.sun}</figcaption>
              </figure>
              <figure>
                <Image src="/post-harvest/diagram/mechanism-airflow-1200.webp"
                  alt="Diagram showing warmed air rising from the collector through the tower shelves and out of the chimney"
                  width={1200} height={846} sizes="(max-width: 799px) 92vw, 42vw" />
                <figcaption><span className="ph-frame-n">2</span>{mechanism.frameCaptions.airflow}</figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal>
            <ol className="ph-steplabels" style={{ marginTop: "var(--pair)" }}>
              {mechanism.steps.map((s) => (
                <li key={s.name}>
                  <span className="n">{s.n}</span>
                  <b>{s.name}</b>
                  <span className="t">{s.text}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <div className="ph-08-foot">
              <div>
                <p className="ph-lbl">{mechanism.handlingNote}</p>
                <ul className="ph-strip ph-strip-2">
                  {mechanism.handling.map((h, i) => (
                    <li key={h.name}>
                      <div className="ph-strip-frame ph-ghost-frame">
                        <Image
                          src={`/post-harvest/diagram/${i === 0 ? "handling-loading" : "handling-release"}-700.webp`}
                          alt={i === 0
                            ? "Line drawing: the drying tower in pale ghost line with one pulled-out shelf inked solid"
                            : "Line drawing: the drying tower in pale ghost line with the release chute at its base inked solid"}
                          width={700} height={i === 0 ? 863 : 941} sizes="(max-width: 767px) 44vw, 200px"
                        />
                      </div>
                      <h4>{h.name}</h4>
                      <p>{h.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <figure className="ph-quote ph-mech-quote">
                <blockquote>{mechanism.quote.text}</blockquote>
                <figcaption><span className="who">{mechanism.quote.attribution}</span></figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 09 What we completed, and what remained open ============
          DOMINANT: the team's own marked requirement list. The completed band above it is
          typographic, not pictorial, and the handbook page inside it is small. An
          unmarked box records only that the item was not assessed. */}
      <section className="ph-section ph-v2 ph-section-sunk" id="status">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">09</p>
              <h2>{status.heading}</h2>
            </div>
          </Reveal>
        </div>

        <div className="ph-v2-ink">
          <div className="ph-canvas">
            <Reveal>
              <div className="ph-done-v2">
                <div>
                  <p className="ph-done-label">{status.completed.label}</p>
                  <p className="ph-done-claim">{status.claimSolid}</p>
                  <ul className="ph-done-items">
                    {status.completed.items.map((it) => (
                      <li key={it.name}>
                        <h3>{it.name}</h3>
                        <p>{it.note}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* TODO(sylvia): if you have a photo of the built collector left with the
                    farmer, it belongs here beside the handbook page. */}
                <figure>
                  <Image
                    src="/post-harvest/handbook/handbook-tools-1200.webp"
                    alt="A spread from the finished construction handbook headed Tools needed, listing tape measure, hammer, pliers, wrench, drill, drill bits, welding machine, angle grinder, paint brush and silicon gun"
                    width={1200} height={850} sizes="(max-width: 899px) 88vw, 30vw"
                  />
                </figure>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="ph-canvas">
          <Reveal>
            <div className="ph-scored-v2">
              <p className="ph-open-claim">{status.claimOpen}</p>
              <InlineSvg
                name="req-checklist-scored-wide"
                className="ph-fig-primary"
                caption={`${status.checklist.caption} Booklet p.${status.checklist.page}.`}
              />
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-why">
              <div className="ph-why-say">
                <h3 className="ph-why-head">{status.whyOpen.heading}</h3>
                <p className="ph-body">{status.whyOpen.text}</p>
              </div>
              <div className="ph-why-limits">
                <p className="ph-body">{status.notValidated.text}</p>
                <p className="ph-body">{status.notValidated.season}</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-forward">
              <p className="ph-lbl">{status.nextStep.label}</p>
              <p className="ph-forward-action">{status.nextStep.text}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 10 Reflection ============
          DOMINANT: the dusk photograph. Prose-led by decision, so there are no
          explanatory icons or diagrams; the four learnings sit under the image as text. */}
      <section className="ph-section ph-v2" id="reflection">
        <div className="ph-canvas">
          <Reveal>
            <div className="ph-v2-head">
              <p className="num">10</p>
              <h2>{reflection.heading}</h2>
              <p className="lede">{reflection.lead}</p>
            </div>
          </Reveal>

          <Reveal>
            <figure className="ph-dominant">
              <Image
                src="/post-harvest/photo/homestead-dusk-1600.webp"
                alt="Cattle grazing at dusk beside a homestead in Seme, Kenya"
                width={1600} height={1067} sizes="(max-width: 899px) 92vw, 88vw"
              />
              <figcaption className="ph-cap">{reflection.closingCaption}</figcaption>
            </figure>
          </Reveal>

          <Reveal>
            <ol className="ph-insights">
              {reflection.insights.map((ins, i) => (
                <li className="ph-insight" key={ins.what}>
                  <span className="ph-insight-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{ins.what}</h3>
                  <p className="ph-body">{ins.detail}</p>
                  <p className="next">{ins.next}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <p className="ph-takeaway">{reflection.takeaway}</p>
            <div className="ph-foot">
              <span className="ph-cap">{project.title}, Reality Studio, Chalmers, 2024</span>
              <Link href="/" className="ph-cap" style={{ textDecoration: "underline" }}>Back to all work</Link>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
