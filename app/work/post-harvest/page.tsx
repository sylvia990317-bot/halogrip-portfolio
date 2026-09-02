import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./post-harvest.css";
import Reveal from "./reveal";
import { project, meta, field, participants, finalConcept } from "./content";

/* Route-scoped fonts, same pattern HALOGRIP uses: none of these reach `/` or any other
   route. Geist carries readable text; Bodoni Moda carries display and the pull quote,
   giving the editorial contrast Sylvia asked for against the technical linework. */
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

/** Real values only. `src` records the booklet PDF page each figure comes from. */
const annotations = [
  { v: "10", k: "Shelves", src: "Measured, p.36" },
  { v: "81 x 70 x 2.5 cm", k: "Shelf size", src: "Measured, p.36" },
  { v: "approx. 100 kg", k: "Estimated design capacity", src: "Calculated, p.36" },
];

export default function PostHarvestPage() {
  const byName = (n: string) => participants.find((p) => p.name === n)!;
  const theresa = byName("Theresa");

  return (
    <main className={`ph-root ${geist.variable} ${geistMono.variable} ${bodoni.variable}`}>
      <Link href="/" className="ph-back">
        Close project
      </Link>

      {/* ---------------- 01 Hero ---------------- */}
      <header className="ph-section ph-hero">
        <div className="ph-shell">
          <div className="ph-hero-grid">
            <div className="ph-hero-copy">
              <div className="ph-hero-rule" />
              <p className="ph-mono" style={{ margin: "0 0 18px" }}>
                {project.title}
              </p>
              {/* Break is explicit so the headline is two deliberate lines, never three. */}
              <h1 className="ph-display">
                <span>Rethinking maize drying</span>
                <em>with farmers in Seme</em>
              </h1>
              <p className="ph-hero-sub">{project.subtitle}</p>

              <dl className="ph-meta">
                {meta.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="ph-hero-figure">
              <div className="ph-frame">
                <Image
                  src="/post-harvest/photo/maize-weevils-1600.webp"
                  alt="A farmer's hands holding a dried maize cob, Seme, Kenya"
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, 53vw"
                />
              </div>
              <figcaption className="ph-caption">
                Stored maize in Seme. Loss after harvest was the starting point for this project.
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* ---------------- 03 Learning in the field ---------------- */}
      <section className="ph-section" id="field">
        <div className="ph-shell">
          <Reveal className="ph-field-head">
            <p className="ph-figure-num">03</p>
            <h2 className="ph-display" style={{ fontSize: "var(--fs-h2)", maxWidth: "14ch" }}>
              {field.heading}
            </h2>
            <p className="ph-lead">{field.intro}</p>
          </Reveal>

          <div className="ph-sheet">
            {/* Theresa carries the narrative: her observation sits beside her portrait. */}
            <Reveal className="ph-person ph-p1">
              <div className="shot">
                <Image
                  src={`/post-harvest/portrait/portrait-${theresa.slug}-800.webp`}
                  alt={`${theresa.name}, a farmer who took part in the study. Portrait traced and blurred, as in the original project.`}
                  width={800}
                  height={866}
                  sizes="(max-width: 767px) 92vw, 32vw"
                />
              </div>
              <h3>{theresa.name}</h3>
              <p>{theresa.note}</p>
            </Reveal>

            <Reveal className="ph-quote" tag="figure">
              <blockquote>{field.quote.text}</blockquote>
              <figcaption>
                <span className="who">{field.quote.attribution}</span>
                <span className="ph-caption">Interview, Seme, 2024</span>
              </figcaption>
            </Reveal>

            {["Christine", "Magarite"].map((n, i) => {
              const p = byName(n);
              return (
                <Reveal className={`ph-person ph-p${i + 2}`} key={p.slug}>
                  <div className="shot">
                    <Image
                      src={`/post-harvest/portrait/portrait-${p.slug}-800.webp`}
                      alt={`${p.name}, a farmer who took part in the study. Portrait traced and blurred, as in the original project.`}
                      width={800}
                      height={1024}
                      sizes="(max-width: 767px) 44vw, 20vw"
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.note}</p>
                </Reveal>
              );
            })}

            <Reveal className="ph-note-slot">
              <div className="ph-fieldnote">
                <p>{field.documentation}</p>
                <p>{field.apollo}</p>
                {/* TODO(sylvia): open question B, confirm this attribution before publishing. */}
                <p>
                  <strong>{field.contribution}</strong>
                </p>
              </div>
            </Reveal>

            {["Jakob", "Philister"].map((n, i) => {
              const p = byName(n);
              return (
                <Reveal className={`ph-person ph-p${i + 4}`} key={p.slug}>
                  <div className="shot">
                    <Image
                      src={`/post-harvest/portrait/portrait-${p.slug}-800.webp`}
                      alt={`${p.name}, a farmer who took part in the study. Portrait traced and blurred, as in the original project.`}
                      width={800}
                      height={1000}
                      sizes="(max-width: 767px) 44vw, 20vw"
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.note}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 07 The Drying Tower, the reveal ---------------- */}
      <section className="ph-reveal-field" id="final-concept">
        <div className="ph-shell">
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

          {/* The handbook is the deliverable, so it holds the dominant slot. The tower
              drawing sits beside it as the thing the handbook describes. */}
          <Reveal>
            <div className="ph-outcome" style={{ marginTop: "clamp(48px, 6vw, 88px)" }}>
              <figure className="ph-handbook">
                <Image
                  className="ph-plate ph-plate-primary"
                  src="/post-harvest/handbook/handbook-cover-1600.webp"
                  alt="Cover of the construction handbook, titled Drying Tower, first version, listing a construction manual, materials needed, tools needed and how to use"
                  width={1600}
                  height={1132}
                  sizes="(max-width: 767px) 92vw, 46vw"
                />
                <figcaption className="ph-outcome-cap">
                  <strong>{finalConcept.deliverable.title}</strong>
                  <span>{finalConcept.deliverable.text}</span>
                  <ul className="ph-handbook-contents">
                    {finalConcept.deliverable.contents.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </figcaption>
              </figure>

              <div className="ph-outcome-side">
                <figure>
                  <Image
                    className="ph-plate"
                    src="/post-harvest/diagram/tower-shelves-1600.webp"
                    alt="Line drawing of the Drying Tower with its door open, showing ten stacked drying shelves, the chimney above and the black box collector connected at an angle"
                    width={1600}
                    height={1128}
                    sizes="(max-width: 767px) 92vw, 46vw"
                  />
                </figure>

                {finalConcept.body.map((t) => (
                  <p className="ph-body" key={t.slice(0, 20)}>
                    {t}
                  </p>
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

          {/* The handbook states its own status. Quoting it is more honest, and more
              persuasive, than restating it in our own words. */}
          <Reveal>
            <div className="ph-outcome ph-outcome-quote" style={{ marginTop: "clamp(40px, 5vw, 72px)" }}>
              <figure className="ph-handbook-quote">
                <blockquote>{finalConcept.handbookQuote.text}</blockquote>
                <figcaption>{finalConcept.handbookQuote.attribution}</figcaption>
              </figure>

              <figure>
                <Image
                  className="ph-plate"
                  src="/post-harvest/handbook/handbook-cutlist-1600.webp"
                  alt="A handbook page headed Cutlist of materials, showing measured steel sections including square tube, angle iron, flat iron, metal sheet and pipe"
                  width={1600}
                  height={1132}
                  sizes="(max-width: 767px) 92vw, 46vw"
                />
                <figcaption className="ph-caption" style={{ marginTop: 12, color: "var(--on-blue-dim)" }}>
                  A page from the handbook. Every part is drawn and dimensioned.
                </figcaption>
              </figure>
            </div>
          </Reveal>

          {/* Short status. Section 09 carries the full account. */}
          <Reveal>
            <p className="ph-status-line">
              <span>{finalConcept.status.built}</span>
              <strong>{finalConcept.status.notBuilt}</strong>
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
