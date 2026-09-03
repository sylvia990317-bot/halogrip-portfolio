import fs from "node:fs";
import path from "node:path";

/**
 * Inlines a diagram's SVG markup instead of loading it through `<img>`.
 *
 * WHY THIS EXISTS. The diagrams are typeset in the page's own faces, and next/font
 * rewrites those to hashed family names (`__Geist_xxxxxx`). An SVG loaded via `<img>`
 * is an isolated document: it cannot see the page's CSS custom properties and cannot
 * fetch a webfont, so every label would silently fall back to the system sans. Inlined,
 * the `<text class="s">` / `class="m"` hooks in each file bind to `--ph-sans` and
 * `--ph-mono` through the rules in post-harvest.css, and the drawings set in Geist.
 *
 * Read happens at build time in a server component, so nothing ships to the client and
 * there is no runtime fetch. The files are plain generated markup committed to
 * `public/post-harvest/diagram/`, never user input, so the innerHTML is safe.
 */
const cache = new Map<string, string>();

function load(name: string): string {
  const hit = cache.get(name);
  if (hit !== undefined) return hit;
  const file = path.join(process.cwd(), "public", "post-harvest", "diagram", `${name}.svg`);
  const svg = fs.readFileSync(file, "utf8");
  cache.set(name, svg);
  return svg;
}

export default function InlineSvg({
  name,
  className = "",
  caption,
}: {
  /** File basename in public/post-harvest/diagram, without the extension. */
  name: string;
  className?: string;
  caption?: React.ReactNode;
}) {
  const svg = load(name);
  return (
    <figure className={`ph-svg ${className}`.trim()}>
      <div className="ph-svg-body" dangerouslySetInnerHTML={{ __html: svg }} />
      {caption ? <figcaption className="ph-caption ph-svg-cap">{caption}</figcaption> : null}
    </figure>
  );
}
