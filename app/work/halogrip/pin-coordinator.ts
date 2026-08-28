/**
 * Coordinates GSAP ScrollTrigger creation across this page's independently-mounted,
 * stacked pinned sections (scroll-intro.tsx -> design-gap-sequence.tsx, with
 * overview-backdrop.tsx's scrub sandwiched in after scroll-intro).
 *
 * design-gap-sequence.tsx merges what used to be two separate pinned sections
 * (process-scene.tsx / 02.3 and design-gap-scene.tsx / 02.4) into one continuous pinned
 * sequence — both of those files are gone; this module's `Source` union reflects that.
 *
 * Each of these measures its own trigger's `start`/`end` from the live document at the
 * moment it creates its ScrollTrigger. If a *later* (further down the page) section's
 * pin-spacer doesn't exist yet at that moment, an *earlier* section's own numbers are
 * unaffected (nothing below it matters to its own position) — but a section whose own
 * pin-spacer is inserted before everything ABOVE it has finished growing will bake in a
 * `start`/`end` that's too small.
 *
 * Both of these sections (scroll-intro.tsx, design-gap-sequence.tsx) defer their real
 * pin-creating ScrollTrigger to a second render pass behind an async `enhanced` flag
 * (checked post-mount, for SSR/hydration safety) — and scroll-intro's real pin specifically
 * only lands once React actually gets around to processing that state flip, which under
 * real page load (heavy JS payload, WebGL setup) has been measured taking up to ~1s, not
 * one frame. overview-backdrop.tsx used to create its ScrollTrigger synchronously on first
 * mount — before scroll-intro's real pin exists.
 *
 * Calling `ScrollTrigger.refresh()` afterward to fix an already-created trigger does NOT
 * work here: verified empirically (multiple times, including a manual refresh() from the
 * console long after the page had visibly settled) that an existing trigger's start/end
 * stays exactly as it was computed at creation — refresh() does not re-derive it from the
 * trigger element's current document position. The only reliable fix is to not create a
 * trigger until everything above it in the page is already in its final position — a
 * freshly-created trigger, created at the right moment, measures correctly immediately
 * with no refresh needed (verified: `ScrollTrigger.create()` called from the console after
 * the layout had settled returned the right numbers on the first try).
 *
 * So: each source reports in via `markPinReady` once its own trigger exists (or once it's
 * determined no trigger is coming — reduced motion / narrow viewport / not enhanced).
 * Anything that needs an earlier section done first defers its own creation with
 * `onPinsReady([...deps], callback)`.
 */

export type Source = "scroll-intro" | "design-gap-sequence" | "overview-backdrop";

const readySources = new Set<Source>();
const waiters: { deps: readonly Source[]; fn: () => void }[] = [];

function checkWaiters() {
  for (let i = waiters.length - 1; i >= 0; i--) {
    const w = waiters[i];
    if (w.deps.every((d) => readySources.has(d))) {
      waiters.splice(i, 1);
      // markPinReady (and so checkWaiters) is typically called from inside the reporting
      // section's own gsap.context() callback, which is still executing/hasn't returned
      // yet. Calling gsap.context() again synchronously from in here, nested inside that
      // still-open one, corrupts GSAP's internal context stack (observed directly: throws
      // "Cannot read properties of undefined (reading 'deps')" inside gsap.context()) —
      // and a microtask alone wasn't a strong enough boundary to avoid it either.
      // setTimeout guarantees a clean macrotask, fully outside any call stack GSAP
      // might still consider "inside" the outer context.
      setTimeout(w.fn, 0);
    }
  }
}

/** Call once a section has created its real ScrollTrigger, or decided not to. */
export function markPinReady(source: Source) {
  readySources.add(source);
  checkWaiters();
}

/**
 * Defers `callback` until every source in `deps` has reported ready (or fires it anyway
 * after a 4s safety timeout, so a future bug in a dependency can't permanently break the
 * caller). Returns an unsubscribe function — call it on unmount if `callback` shouldn't
 * fire after the caller is gone.
 */
export function onPinsReady(deps: readonly Source[], callback: () => void): () => void {
  if (deps.every((d) => readySources.has(d))) {
    setTimeout(callback, 0);
    return () => {};
  }
  const entry = { deps, fn: callback };
  waiters.push(entry);
  const timeoutId = setTimeout(() => {
    const idx = waiters.indexOf(entry);
    if (idx !== -1) {
      waiters.splice(idx, 1);
      callback();
    }
  }, 4000);
  return () => {
    clearTimeout(timeoutId);
    const idx = waiters.indexOf(entry);
    if (idx !== -1) waiters.splice(idx, 1);
  };
}
