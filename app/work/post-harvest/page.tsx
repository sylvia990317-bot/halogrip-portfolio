import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./post-harvest.css";
import Reveal from "./reveal";
import {
  project, meta, context, field, participants, focus, challenge,
  concepts, finalConcept, mechanism, status, reflection,
} from "./content";

/* Route-scoped fonts, same pattern HALOGRIP uses: none of these reach `/` or any other
   route. Geist carries readable text; Bodoni Moda carries display, section numerals and
   quotes, giving the editorial contrast against the technical linework. */
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
  const theresa = byName("Theresa");

  return (
    <main className={`ph-root ${geist.variable} ${geistMono.variable} ${bodoni.variable}`}>
      <Link href="/" className="ph-back">Close project</Link>

      {/* ============ 01 Hero ============ */}
      <header className="ph-section ph-hero">
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

      {/* ============ 02 Context ============ */}
      <section className="ph-section" id="context">
        <div className="ph-shell">
          <Reveal>
            <div className="ph-context">
              <div>
                <SectionHead n="02" heading={context.heading} lead={context.intro} />
                <div style={{ marginTop: "var(--block-y)" }}>
                  {context.body.map((t) => (
                    <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                  ))}
                </div>
                <div className="ph-stat">
                  <b>{context.stat.value}</b>
                  <span>{context.stat.label}. {context.stat.cite}.</span>
                </div>
              </div>

              <figure className="ph-context-figure">
                <Image
                  className="ph-figimg"
                  src="/post-harvest/photo/road-to-seme-1600.webp"
                  alt="A red earth road running through dense green vegetation near Seme, with two people and a motorbike in the distance"
                  width={1600} height={1067} sizes="(max-width: 767px) 100vw, 58vw"
                />
                <figcaption className="ph-caption" style={{ marginTop: 12 }}>
                  The road into Seme. Cereal loss after harvest is cited to {context.lossCite}.
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 03 Learning in the field ============ */}
      <section className="ph-section" id="field">
        <div className="ph-shell">
          <Reveal className="ph-field-head">
            <SectionHead n="03" heading={field.heading} lead={field.intro} />
          </Reveal>

          {/* All five on one shared baseline: one encounter, not a grid of records. */}
          <Reveal>
            <ul className="ph-band">
              {["Christine", "Theresa", "Jakob", "Philister", "Magarite"].map((n) => {
                const p = byName(n);
                return (
                  <li className="ph-person" key={p.slug}>
                    <Image
                      src={`/post-harvest/portrait/portrait-${p.slug}-800.webp`}
                      alt={`${p.name}, a farmer who took part in the study. Portrait traced and blurred, as in the original project.`}
                      width={800} height={1000} sizes="(max-width: 767px) 46vw, 18vw"
                    />
                    <h3>{p.name}</h3>
                    <p>{p.note}</p>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal>
            <div className="ph-field-foot">
              <figure className="ph-quote">
                <blockquote>{field.quote.text}</blockquote>
                <figcaption>
                  <span className="who">{field.quote.attribution}</span>
                  <span className="ph-caption">Interview, Seme, 2024</span>
                </figcaption>
              </figure>

              <div className="ph-fieldnote">
                <p>{field.documentation}</p>
                <p>{field.apollo}</p>
                {/* TODO(sylvia): open question B, confirm this attribution before publishing. */}
                <p><strong>{field.contribution}</strong></p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 04 Finding the focus ============ */}
      <section className="ph-section" id="focus">
        <div className="ph-shell">
          <Reveal>
            <SectionHead n="04" heading={focus.heading} lead={focus.intro} />
          </Reveal>

          <Reveal>
            <div className="ph-focus">
              <figure>
                <Image
                  className="ph-figimg ph-cycle"
                  src="/post-harvest/diagram/maize-cycle-1240.webp"
                  alt="Illustrated diagram of the six stages of the maize cycle: prework, planting seeds, waiting for harvest, harvest, drying and storage, with the drying stage circled"
                  width={1240} height={1753} sizes="(max-width: 767px) 92vw, 38vw"
                />
              </figure>

              <div>
                {focus.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                ))}
                <ul className="ph-stages">
                  {focus.stages.map((s, i) => (
                    <li key={s} data-on={i === focus.selected}>{s}</li>
                  ))}
                </ul>
                <p className="ph-caption" style={{ marginTop: 14 }}>{focus.caption}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 05 Defining the challenge ============ */}
      <section className="ph-section" id="challenge">
        <div className="ph-shell">
          <Reveal>
            <SectionHead n="05" heading={challenge.heading} lead={challenge.intro} />
          </Reveal>

          <Reveal>
            <div className="ph-challenge">
              {/* The needs map is the evidence the requirements came from. */}
              <figure className="ph-needs-fig">
                <Image
                  className="ph-figimg"
                  src="/post-harvest/diagram/needs-map-1600.webp"
                  alt="The team's needs map, clustering expressed needs such as the drying process, storage, transportation of crops, water and extreme climate against latent needs including independence, infrastructure and a knowledge gap"
                  width={1600} height={1132} sizes="(max-width: 767px) 92vw, 54vw"
                />
                <figcaption className="ph-caption" style={{ marginTop: 12 }}>
                  Expressed needs mapped against latent ones. Booklet p.26.
                </figcaption>
              </figure>

              <div>
                {challenge.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                ))}

                {/* Grouped by where each requirement came from, so the relationship is
                    visible: what the farmers told us, and what we chose to set. */}
                <div className="ph-reqs" style={{ marginTop: "var(--block-y)" }}>
                  {["Research", "Design target"].map((origin) => (
                    <div className="ph-reqgroup" data-origin={origin} key={origin}>
                      <h4>{origin === "Research" ? "From the farmers" : "Set by the team"}</h4>
                      <ul>
                        {challenge.priorities.filter((p) => p.origin === origin).map((p) => (
                          <li key={p.text}>{p.text}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Traced figures kept as scale companions: this section is about moving
                    the harvest by hand, which is what they depict. */}
                <div className="ph-figures">
                  <Image src="/post-harvest/figure/figure-carrying-750.webp" alt="Traced illustration of a person carrying baskets of produce, one balanced on the head" width={750} height={1487} />
                  <Image src="/post-harvest/figure/figure-wheelbarrow-348.webp" alt="Traced illustration of a person pushing a loaded wheelbarrow" width={348} height={510} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 06 Developing with farmers ============ */}
      <section className="ph-section" id="concepts">
        <div className="ph-shell">
          {/* Head and copy sit against the photograph, which is the section's visual
              centre: the moment a concept was actually discussed with a farmer. The
              landscape crop lets the two columns end together instead of leaving a void. */}
          <Reveal>
            <div className="ph-concepts">
              <div>
                <SectionHead n="06" heading={concepts.heading} lead={concepts.intro} />
                <p className="ph-body" style={{ marginTop: "var(--block-y)" }}>{concepts.body[1]}</p>
              </div>

              <figure className="ph-concepts-photo">
                <Image
                  className="ph-figimg"
                  src="/post-harvest/photo/sketch-review-wide-1600.webp"
                  alt="Two hands holding a hand-drawn sketch of the drying tower, one pointing at the shelves and its dimensions"
                  width={1600} height={1068} sizes="(max-width: 767px) 100vw, 58vw"
                />
                <figcaption className="ph-caption" style={{ marginTop: 12 }}>
                  Reviewing a concept sketch with a farmer, second evaluation round.
                </figcaption>
              </figure>
            </div>
          </Reveal>

          {/* The three sketches the farmers actually saw. Asymmetric on purpose: the
              chosen concept is larger, so the trio shows the decision rather than
              presenting three equal options. */}
          <Reveal>
            <ul className="ph-trio">
              {concepts.options.map((o) => (
                <li key={o.slug} data-selected={o.selected}>
                  <Image
                    src={`/post-harvest/concept/concept-${o.slug}-760.webp`}
                    alt={`Hand-drawn concept sketch: ${o.name}`}
                    width={760} height={620}
                    sizes="(max-width: 767px) 88vw, 30vw"
                  />
                  <h3>{o.name}</h3>
                  {o.selected ? <span className="ph-picked">Selected</span> : null}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* The method correction closes the section, after the reader has seen what was
              actually compared. */}
          <Reveal>
            <div className="ph-method">
              <h3>{concepts.methodHeading}</h3>
              <p className="ph-body">{concepts.method}</p>
            </div>
            <p className="ph-caveat">{concepts.caveat}</p>
          </Reveal>
        </div>
      </section>

      {/* ============ 07 The Drying Tower, the reveal ============ */}
      <section className="ph-reveal-field" id="final-concept">
        <div className="ph-shell ph-shell-wide">
          <Reveal className="ph-tower-head">
            <div>
              <div className="ph-lockup">
                <span className="n">07</span>
                <span className="label">{finalConcept.label}</span>
              </div>
              <h2 className="ph-display">{finalConcept.heading}</h2>
            </div>
            <p className="ph-lead">{finalConcept.lead}</p>
          </Reveal>

          {/* The handbook is the deliverable, so it holds the dominant slot. */}
          <Reveal>
            <div className="ph-outcome" style={{ marginTop: "var(--block-y)" }}>
              <figure>
                <Image
                  className="ph-plate ph-plate-primary"
                  src="/post-harvest/handbook/handbook-cover-1600.webp"
                  alt="Cover of the construction handbook, titled Drying Tower, first version, listing a construction manual, materials needed, tools needed and how to use"
                  width={1600} height={1132} sizes="(max-width: 767px) 92vw, 46vw"
                />
                <figcaption className="ph-outcome-cap">
                  <strong>{finalConcept.deliverable.title}</strong>
                  <span>{finalConcept.deliverable.text}</span>
                  <ul className="ph-handbook-contents">
                    {finalConcept.deliverable.contents.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </figcaption>
              </figure>

              <div className="ph-outcome-side">
                <figure>
                  <Image
                    className="ph-plate"
                    src="/post-harvest/diagram/tower-shelves-1600.webp"
                    alt="Line drawing of the Drying Tower with its door open, showing ten stacked drying shelves, the chimney above and the black box collector connected at an angle"
                    width={1600} height={1128} sizes="(max-width: 767px) 92vw, 34vw"
                  />
                </figure>
                {finalConcept.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>{t}</p>
                ))}
                <ul className="ph-annots">
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

          {/* The handbook states its own status. Quoting it is more honest than restating it. */}
          <Reveal>
            <div className="ph-outcome ph-outcome-quote" style={{ marginTop: "var(--block-y)" }}>
              <figure className="ph-handbook-quote">
                <blockquote>{finalConcept.handbookQuote.text}</blockquote>
                <figcaption>{finalConcept.handbookQuote.attribution}</figcaption>
              </figure>
              <figure>
                <Image
                  className="ph-plate"
                  src="/post-harvest/handbook/handbook-cutlist-1600.webp"
                  alt="A handbook page headed Cutlist of materials, showing measured steel sections including square tube, angle iron, flat iron, metal sheet and pipe"
                  width={1600} height={1132} sizes="(max-width: 767px) 92vw, 56vw"
                />
                <figcaption className="ph-caption" style={{ marginTop: 12 }}>
                  A page from the handbook. Every part is drawn and dimensioned.
                </figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal>
            <p className="ph-status-line">
              <span>{finalConcept.status.built}</span>
              <strong>{finalConcept.status.notBuilt}</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 08 How it was intended to work ============ */}
      <section className="ph-section" id="mechanism">
        <div className="ph-shell">
          <Reveal>
            <SectionHead n="08" heading={mechanism.heading} lead={mechanism.intro} />
          </Reveal>

          <Reveal>
            <div className="ph-mech-figs">
              <figure>
                <Image className="ph-figimg" src="/post-harvest/diagram/mechanism-sun-1200.webp"
                  alt="Diagram showing the angled black box collector capturing sun rays to heat the air inside it"
                  width={1200} height={846} sizes="(max-width: 767px) 92vw, 46vw" />
                <figcaption className="ph-caption" style={{ marginTop: 10 }}>Capturing heat.</figcaption>
              </figure>
              <figure>
                <Image className="ph-figimg" src="/post-harvest/diagram/mechanism-airflow-1200.webp"
                  alt="Diagram showing warmed air rising from the collector through the tower shelves and out of the chimney"
                  width={1200} height={846} sizes="(max-width: 767px) 92vw, 46vw" />
                <figcaption className="ph-caption" style={{ marginTop: 10 }}>Creating airflow.</figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal>
            <div className="ph-steps">
              {mechanism.steps.map((s) => (
                <div className="ph-step" key={s.name}>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <ul className="ph-handling">
              {mechanism.handling.map(([k, v]) => (
                <li key={k}><b>{k}</b><span>{v}</span></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ 09 Prototype status and next steps ============ */}
      <section className="ph-section ph-section-sunk" id="status">
        <div className="ph-shell">
          <Reveal>
            <SectionHead n="09" heading={status.heading} lead={status.intro} />
          </Reveal>

          <Reveal>
            <div className="ph-status-grid">
              <div className="ph-states">
                {status.groups.map((g) => (
                  <div className="ph-state" data-key={g.key} key={g.key}>
                    <h3>{g.label}</h3>
                    <ul>
                      {g.items.map((it) => <li key={it.text}>{it.text}</li>)}
                    </ul>
                  </div>
                ))}
                {/* Marked as a note so it does not read as a fourth item under
                    "Not built, not validated". The limitation itself is kept in full. */}
                <p className="ph-limit">{status.limitation}</p>
              </div>

              {/* The next step is a drawing the team made, so it carries this column. */}
              <div>
                <figure className="ph-next">
                  <Image
                    className="ph-figimg"
                    src="/post-harvest/diagram/next-step-1100.webp"
                    alt="The team's closing illustration: a farmer walking across a field carrying a container"
                    width={1100} height={758} sizes="(max-width: 767px) 92vw, 38vw"
                  />
                  <figcaption className="ph-next-cap">
                    <strong>{status.nextStep.label}</strong>
                    <span>{status.nextStep.text}</span>
                  </figcaption>
                </figure>

                <h3 className="ph-mono" style={{ margin: "var(--block-y) 0 0" }}>{status.openHeading}</h3>
                <ul className="ph-open" style={{ marginTop: 14 }}>
                  {status.open.map((q) => <li key={q}>{q}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 10 Reflection ============ */}
      <section className="ph-section" id="reflection">
        <div className="ph-shell">
          <Reveal>
            <SectionHead n="10" heading={reflection.heading} lead={reflection.intro} />
          </Reveal>

          {/* Sylvia's own four reflections, each paired with what she would change, set
              beside the closing photograph so the section stays near one viewport. */}
          <Reveal>
            <div className="ph-reflect">
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

              <div className="ph-close-col">
                <figure className="ph-closing">
                  <Image className="ph-figimg" src="/post-harvest/photo/homestead-dusk-1600.webp"
                    alt="Cattle grazing at dusk beside a homestead in Seme, Kenya"
                    width={1600} height={1067} sizes="(max-width: 767px) 100vw, 38vw" />
                </figure>
                <p className="ph-takeaway">{reflection.takeaway}</p>
              </div>
            </div>

            <div className="ph-foot">
              <span className="ph-caption">{project.title}, {" "}Reality Studio, Chalmers, 2024</span>
              <Link href="/" className="ph-caption" style={{ textDecoration: "underline" }}>Back to all work</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
