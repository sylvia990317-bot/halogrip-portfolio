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

/** [sourceFile, pageNo, outDir, basename, widths[], quality] */
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
  [`${LINKS}/needs.ai`, 1, "diagram", "needs-map", [1600, 900], 88],
  [`${LINKS}/flowshart draft 2 (1).ai`, 1, "diagram", "design-process", [1600, 900], 88],
  [`${LINKS}/scenario.pdf`, 1, "diagram", "scenario", [1200, 700], 88],
  [`${LINKS}/next step.pdf`, 1, "diagram", "next-step", [1200, 700], 88],
  [`${LINKS}/talkng to friend.pdf`, 1, "diagram", "scenario-friend", [1200, 700], 88],
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
  for (const [file, pageNo, dir, base, widths, quality] of JOBS) {
    await mkdir(path.join(OUT, dir), { recursive: true });
    if (!docCache.has(file)) docCache.set(file, await openDoc(file));
    const doc = docCache.get(file);
    for (const w of widths) {
      const png = await renderPage(doc, pageNo, w);
      const outPath = path.join(OUT, dir, `${base}-${w}.webp`);
      const info = await sharp(png).webp({ quality }).toFile(outPath);
      total += info.size;
      console.log(
        `${outPath.padEnd(52)} ${String(info.width).padStart(5)}x${String(info.height).padEnd(5)} ` +
          `${(info.size / 1024).toFixed(0).padStart(5)} KB`
      );
    }
  }
  console.log(`\ntotal: ${(total / 1024 / 1024).toFixed(2)} MB across ${JOBS.length} sources`);
}
