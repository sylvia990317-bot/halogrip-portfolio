export default function Hero() {
  return (
    <section className="relative px-6 pb-16 pt-4 md:px-12 md:pb-24">
      <h1 className="font-heading text-[15vw] font-medium leading-[0.92] tracking-[-0.02em] text-ink sm:text-[96px] md:text-[132px]">
        Industrial
        <br />
        Designer
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
        I turn complex systems into intuitive, human-centered experiences that people can
        understand, trust, and enjoy. Based in Gothenburg Sweden.
      </p>
      <a
        href="#work"
        className="mt-10 flex w-fit items-center gap-3 text-xs text-muted hover:text-ink md:absolute md:right-12 md:top-8 md:mt-0"
      >
        <span className="font-mono uppercase tracking-wide">Scroll to explore</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line">
          ↓
        </span>
      </a>
    </section>
  );
}
