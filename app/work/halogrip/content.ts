// Plain data shared across a "use client" module (scroll-intro.tsx) and the server
// component (page.tsx). Kept in its own file with no "use client" directive: a named
// export re-imported from a client-boundary module isn't reliably usable as plain data
// on the server during static generation (hit as a real build failure — `meta.map is
// not a function` at prerender — when `meta` briefly lived inside scroll-intro.tsx and
// was exported from there instead).
export const meta = [
  ["Deliverable", "Fallback steering"],
  ["Partner", "Autoliv × Chalmers"],
  ["Role", "User research + concept"],
  ["Context", "Level 4 robotaxi"],
];
