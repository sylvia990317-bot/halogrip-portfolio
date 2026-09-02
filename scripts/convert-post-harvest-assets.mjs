// One-off: convert the approved Post Harvest assets to WebP at web widths.
// Source files in references/ are never modified or renamed. Idempotent: safe to re-run.
//
// Not handled here: the vector PDF / .ai diagrams (Empty Shelves, Door Swung Open,
// Airflow chart, Sun rays capturing, scenario, next step, talkng to friend, needs.ai).
// No PDF rasteriser is available in this environment (pdftoppm / pdftocairo / inkscape /
// imagemagick / ghostscript are all absent). Those slots ship as marked placeholders.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "references/kenya/full-booklet/Links";
const OUT = "public/post-harvest";

/** [sourceFile, outDir, outputBasename, widths[], quality, extract?] */
const JOBS = [
  // Documentary photography
  ["_DYR8983.jpg", "photo", "sketch-review", [1600, 1000, 600], 82],
  ["_DYR7834.jpg", "photo", "maize-weevils", [2400, 1600, 900], 82],
  ["DSCF0515.JPG", "photo", "road-to-seme", [1600, 900], 82],
  ["DSCF0457.JPG", "photo", "homestead-dusk", [1600, 900], 82],

  // Participant portraits (already blurred in the original project)
  ["christine.png", "portrait", "portrait-christine", [800, 400], 86],
  ["jakob.png", "portrait", "portrait-jakob", [800, 400], 86],
  ["magarete.png", "portrait", "portrait-magarite", [800, 400], 86],
  ["phlister.png", "portrait", "portrait-philister", [800, 400], 86],
  ["tresa.png", "portrait", "portrait-theresa", [800, 400], 86],

  // Narrative diagram: six-stage maize cycle with the drying stage marked
  ["focus area.png", "diagram", "maize-cycle", [1240, 800], 88],

  // Hand-traced figure illustrations (transparent background).
  // NS_0091 carries a colour-swatch strip baked into the top-right of the artwork;
  // `extract` crops it off before resizing (audit §4.3).
  ["NS_0091.png", "figure", "figure-market", [1600, 900], 88, { left: 0, top: 220, width: 3165, height: 1871 }],
  ["NS_0220.png", "figure", "figure-carrying", [750], 88],
  ["NS_0047.png", "figure", "figure-seated", [590], 88],
  ["NS_0045.png", "figure", "figure-wheelbarrow", [348], 88],
  ["NS_0097.png", "figure", "figure-table", [427], 88],
];

for (const d of ["photo", "portrait", "diagram", "figure"]) {
  await mkdir(path.join(OUT, d), { recursive: true });
}

let total = 0;
for (const [src, dir, base, widths, quality, extract] of JOBS) {
  const inPath = path.join(SRC, src);
  const meta = await sharp(inPath).metadata();
  for (const w of widths) {
    const sourceWidth = extract ? extract.width : meta.width;
    if (w > sourceWidth) continue; // never upscale
    const outPath = path.join(OUT, dir, `${base}-${w}.webp`);
    let pipe = sharp(inPath);
    if (extract) pipe = pipe.extract(extract);
    const info = await pipe.resize({ width: w }).webp({ quality, alphaQuality: 90 }).toFile(outPath);
    total += info.size;
    console.log(
      `${outPath.padEnd(50)} ${String(info.width).padStart(5)}x${String(info.height).padEnd(5)} ` +
        `${(info.size / 1024).toFixed(0).padStart(5)} KB`
    );
  }
}
console.log(`\ntotal: ${(total / 1024 / 1024).toFixed(2)} MB across ${JOBS.length} sources`);
