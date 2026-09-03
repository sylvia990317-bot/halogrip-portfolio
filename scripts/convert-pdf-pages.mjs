// Rasterise PDF pages to WebP.
//
// Why this exists: the Post Harvest source material is largely vector PDF (the construction
// handbook inside the final report, plus the product drawings and .ai diagrams). No system
// rasteriser is available on this machine (pdftoppm / pdftocairo / ghostscript / imagemagick
// are all absent), so we render with pdfjs-dist onto an @napi-rs/canvas surface and hand the
// result to sharp. Both deps ship prebuilt binaries, so no compiler is needed.
//
// Source files under references/ are never modified or renamed. Idempotent: safe to re-run.
//
// Usage:
//   node scripts/convert-pdf-pages.mjs                 run the JOBS table below
//   node scripts/convert-pdf-pages.mjs --probe A-B     render report pages A..B small, to
//                                                      scratch/, for picking which to keep
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const REPORT = "references/kenya/RS24_kenya_Post Harvest_Final Report.pdf";
const LINKS = "references/kenya/full-booklet/Links";
const OUT = "public/post-harvest";

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext("2d") };
  }
  reset(cc, width, height) {
    cc.canvas.width = width;
    cc.canvas.height = height;
  }
  destroy(cc) {
    cc.canvas.width = 0;
    cc.canvas.height = 0;
  }
}

async function openDoc(file) {
  const data = new Uint8Array(await readFile(file));
  return pdfjs.getDocument({
    data,
    canvasFactory: new NodeCanvasFactory(),
    // The source files embed subset fonts; this keeps text rendering faithful.
    useSystemFonts: false,
    isEvalSupported: false,
  }).promise;
}

/** Render one page to a PNG buffer at `targetWidth` CSS pixels. */
async function renderPage(doc, pageNo, targetWidth) {
  const page = await doc.getPage(pageNo);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: targetWidth / base.width });
  const factory = new NodeCanvasFactory();
  const { canvas, context } = factory.create(Math.ceil(viewport.width), Math.ceil(viewport.height));
  // White ground: these pages are artwork on paper, and WebP would otherwise get a black matte.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport, canvasFactory: factory }).promise;
  return canvas.toBuffer("image/png");
}

const DECK = "references/kenya/portfolio-current";

/**
 * The three concept sketches live side by side on one portfolio slide, so each is cut out
 * by fractional rectangle. Labels are deliberately excluded: the page sets them in its own
 * typeface. Fractions are resolution independent.
 */
const SKETCH = { top: 0.639, height: 0.2684 };

/** [sourceFile, pageNo, outDir, basename, widths[], quality, cropBottom?, cropRect?] */
const JOBS = [
  // The construction handbook: the project's primary deliverable (report p.54 onward).
  // Every handbook page is 595 x 420 pt landscape, same as the product drawings.
  [REPORT, 54, "handbook", "handbook-cover", [1600, 900], 88], // title page
  [REPORT, 60, "handbook", "handbook-cutlist", [1600, 900], 88], // "Cutlist of materials"
  [REPORT, 57, "handbook", "handbook-tools", [1200, 700], 88], // "Tools needed"

  // Tower drawings, 595 x 420 pt.
  [`${LINKS}/Empty Shelves.pdf`, 1, "diagram", "tower-shelves", [1600, 900], 88],
  [`${LINKS}/Door Swung Open.pdf`, 1, "diagram", "tower-door", [1200, 700], 88],

  // Mechanism, section 08.
  [`${LINKS}/Sun rays capturing.pdf`, 1, "diagram", "mechanism-sun", [1200, 700], 88],
  [`${LINKS}/Airflow chart.pdf`, 1, "diagram", "mechanism-airflow", [1200, 700], 88],

  // Narrative diagrams.
  // needs.ai carries a colour-swatch strip baked into the bottom of the artwork, the same
  // artefact NS_0091 has. Trim the bottom 11% so it does not ship on the page.
  [`${LINKS}/needs.ai`, 1, "diagram", "needs-map", [1600, 900], 88, 0.11],
  [`${LINKS}/flowshart draft 2 (1).ai`, 1, "diagram", "design-process", [1600, 900], 88],
  [`${LINKS}/scenario.pdf`, 1, "diagram", "scenario", [1200, 700], 88],
  // The source page stacks the same illustration twice. Keep only the upper instance.
  [`${LINKS}/next step.pdf`, 1, "diagram", "next-step", [1100, 640], 88, 0, { left: 0.11, top: 0.055, width: 0.79, height: 0.385 }],
  [`${LINKS}/talkng to friend.pdf`, 1, "diagram", "scenario-friend", [1200, 700], 88],

  // The three concepts presented to the farmers in the second evaluation round.
  [`${DECK}/Desktop - 14.pdf`, 1, "concept", "concept-table", [760, 440], 88, 0, { left: 0.0875, width: 0.2285, ...SKETCH }],
  [`${DECK}/Desktop - 14.pdf`, 1, "concept", "concept-tower", [760, 440], 88, 0, { left: 0.3815, width: 0.2434, ...SKETCH }],
  [`${DECK}/Desktop - 14.pdf`, 1, "concept", "concept-box", [760, 440], 88, 0, { left: 0.6825, width: 0.2333, ...SKETCH }],
];

const probe = process.argv.indexOf("--probe");
if (probe !== -1) {
  const [from, to] = process.argv[probe + 1].split("-").map(Number);
  const dir = "scratch/handbook-probe";
  await mkdir(dir, { recursive: true });
  const doc = await openDoc(REPORT);
  for (let p = from; p <= to; p++) {
    const png = await renderPage(doc, p, 460);
    const out = path.join(dir, `p${String(p).padStart(3, "0")}.webp`);
    const info = await sharp(png).webp({ quality: 78 }).toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
  console.log(`\nprobed pages ${from}-${to}`);
} else {
  const docCache = new Map();
  let total = 0;
  for (const [file, pageNo, dir, base, widths, quality, cropBottom, cropRect] of JOBS) {
    await mkdir(path.join(OUT, dir), { recursive: true });
    if (!docCache.has(file)) docCache.set(file, await openDoc(file));
    const doc = docCache.get(file);
    for (const w of widths) {
      // When cutting a rectangle out of a page, render the whole page large enough that
      // the crop still lands at the requested output width.
      const renderWidth = cropRect ? Math.round(w / cropRect.width) : w;
      const png = await renderPage(doc, pageNo, renderWidth);
      const outPath = path.join(OUT, dir, `${base}-${w}.webp`);
      let pipe = sharp(png);
      const m = await sharp(png).metadata();
      if (cropRect) {
        pipe = pipe.extract({
          left: Math.round(m.width * cropRect.left),
          top: Math.round(m.height * cropRect.top),
          width: Math.round(m.width * cropRect.width),
          height: Math.round(m.height * cropRect.height),
        });
      } else if (cropBottom) {
        pipe = pipe.extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * (1 - cropBottom)) });
      }
      const info = await pipe.webp({ quality }).toFile(outPath);
      total += info.size;
      console.log(
        `${outPath.padEnd(52)} ${String(info.width).padStart(5)}x${String(info.height).padEnd(5)} ` +
          `${(info.size / 1024).toFixed(0).padStart(5)} KB`
      );
    }
  }
  console.log(`\ntotal: ${(total / 1024 / 1024).toFixed(2)} MB across ${JOBS.length} sources`);
}
