const LINE_ONE = "Industrial";
const LINE_TWO = "Designer";
const STEP = 0.025;

function RevealLine({ text, delayStart }: { text: string; delayStart: number }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block animate-[hero-reveal_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          style={{ animationDelay: `${delayStart + i * STEP}s`, opacity: 0 }}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative px-6 pb-16 pt-4 md:px-12 md:pb-24">
      <h1 className="font-heading text-[15vw] font-medium leading-[0.92] tracking-[-0.02em] text-ink sm:text-[96px] md:text-[132px]">
        <RevealLine text={LINE_ONE} delayStart={0} />
        <br />
        <RevealLine text={LINE_TWO} delayStart={LINE_ONE.length * STEP} />
      </h1>
      <style>{`
        @keyframes hero-reveal {
          from { opacity: 0; filter: blur(10px); transform: translateY(14px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
      `}</style>
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
